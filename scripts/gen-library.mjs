import fs from "node:fs";
import path from "node:path";
import { cleanRows, indicators, scanSymbol, evaluate, story, contextLine, whyText, outcomeOf, shortName, monthYear, SETUP_ORDER } from "../src/lib/analyze.js";
import { plan, runRules, result } from "../src/lib/engine.js";

const RAW = process.argv[2];
const OUT = process.argv[3];
const INDEX = { US: "QQQ", SET: "TDEX.BK" };
const SKIP = new Set(["QQQ", "TDEX.BK", "GDX"]);

const r4 = (v) => Math.round(v * 10000) / 10000;

const files = fs.readdirSync(RAW).filter((f) => f.endsWith(".json"));
const raw = {};
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(path.join(RAW, f), "utf8"));
  const market = d.symbol.endsWith(".BK") ? "SET" : "US";
  const rows = cleanRows(d.rows).map((r) => [r[0], r4(r[1]), r4(r[2]), r4(r[3]), r4(r[4]), Math.round(r[5])]);
  raw[d.symbol] = { symbol: d.symbol.replace(".BK", ""), yahoo: d.symbol, name: d.name, currency: d.currency, market, rows };
}

const bars = {};
for (const k of Object.keys(raw)) bars[k] = indicators(raw[k].rows);
const idxOf = (market) => ({ symbol: INDEX[market].replace(".BK", ""), bars: bars[INDEX[market]] });

const candidates = [];
for (const k of Object.keys(raw)) {
  if (SKIP.has(k)) continue;
  const meta = raw[k];
  const b = bars[k];
  const found = scanSymbol(b, meta, idxOf(meta.market), { to: b.length - 26 });
  for (const s of found) {
    const ev = evaluate(s.type, s.facts);
    const id = `${meta.symbol.toLowerCase()}-${s.type}-${s.date.replace(/-/g, "")}`;
    const t = { id, symbol: meta.symbol, currency: meta.currency, market: meta.market, tick: s.tick, facts: s.facts, bars: b };
    const p = plan(t, ev.verdict === "smaller");
    if (!p || p.shares <= 0) continue;
    const st = runRules(t, p);
    const res = result(st, p);
    const exitBar = st.i;
    candidates.push({
      id,
      key: k,
      symbol: meta.symbol,
      name: meta.name,
      currency: meta.currency,
      market: meta.market,
      tick: s.tick,
      type: s.type,
      setup: s.date,
      setupIdx: s.i,
      exitIdx: exitBar,
      info: s.info,
      facts: s.facts,
      verdict: ev.verdict,
      checks: { market: ev.marketOk, rs: ev.rsOk, trend: ev.trendOk, ext: ev.extOk, chase: ev.chaseOk, stop: ev.stopOk },
      title: `${shortName(meta.name, meta.symbol)}, ${monthYear(s.date)}`,
      story: story(s.type, s.info, s.facts, meta, s.date),
      group: contextLine(s.facts, meta),
      why: whyText(ev),
      rulesR: Math.round(res.r * 100) / 100,
      rulesPct: Math.round(res.accountPct * 100) / 100,
      exit: st.exitReason,
      days: st.day,
      outcome: outcomeOf(res.r),
    });
  }
}

const tally = (list, key) => list.reduce((a, c) => ((a[c[key]] = (a[c[key]] || 0) + 1), a), {});
console.log("candidates", candidates.length);
console.log("by type", tally(candidates, "type"));
console.log("by outcome", tally(candidates, "outcome"));
console.log("by verdict", tally(candidates, "verdict"));
const cross = {};
for (const c of candidates) {
  const k = `${c.type}`;
  cross[k] ??= {};
  cross[k][c.outcome] = (cross[k][c.outcome] || 0) + 1;
}
console.log(cross);

const QUOTA = { flat: 26, unr: 24, munr: 24, pullback: 24, gap: 22, htf: 10, rejection: 16 };
function pick(list, n) {
  const byOutcome = { worked: [], failed: [], scratch: [] };
  for (const c of list) byOutcome[c.outcome].push(c);
  const order = ["failed", "worked", "scratch", "failed", "worked"];
  const take = [];
  const usedSym = {};
  for (const k of Object.keys(byOutcome)) byOutcome[k].sort((a, b) => (a.setup < b.setup ? -1 : 1));
  const spread = (arr) => {
    const out = [];
    const step = arr.length / Math.max(1, Math.min(arr.length, n));
    for (let i = 0; i < arr.length; i += Math.max(1, step)) out.push(arr[Math.floor(i)]);
    return out.concat(arr.filter((x) => !out.includes(x)));
  };
  const pools = Object.fromEntries(Object.entries(byOutcome).map(([k, v]) => [k, spread(v)]));
  let guard = 0;
  while (take.length < n && guard++ < 10000) {
    let added = false;
    for (const o of order) {
      if (take.length >= n) break;
      const pool = pools[o];
      const idx = pool.findIndex((c) => (usedSym[c.symbol] || 0) < 2);
      const at = idx >= 0 ? idx : pool.length ? 0 : -1;
      if (at < 0) continue;
      const c = pool.splice(at, 1)[0];
      usedSym[c.symbol] = (usedSym[c.symbol] || 0) + 1;
      take.push(c);
      added = true;
    }
    if (!added) break;
  }
  return take;
}

const chosen = [];
for (const type of SETUP_ORDER) chosen.push(...pick(candidates.filter((c) => c.type === type), QUOTA[type]));
chosen.sort((a, b) => (SETUP_ORDER.indexOf(a.type) - SETUP_ORDER.indexOf(b.type)) || (a.setup < b.setup ? -1 : 1));
console.log("chosen", chosen.length, tally(chosen, "type"), tally(chosen, "outcome"), tally(chosen, "verdict"), tally(chosen, "market"));

const lib = chosen.map((c) => {
  const b = bars[c.key];
  const from = Math.max(0, c.setupIdx - 75);
  const to = Math.min(b.length - 1, Math.max(c.exitIdx + 15, c.setupIdx + 70));
  const { key, setupIdx, exitIdx, ...rest } = c;
  return { ...rest, from: b[from].date, to: b[to].date };
});

const series = {};
for (const k of Object.keys(raw)) {
  const m = raw[k];
  series[m.symbol] = { name: m.name, currency: m.currency, market: m.market, rows: m.rows };
}
const asOf = Object.values(raw).reduce((a, m) => (m.rows.at(-1)[0] > a ? m.rows.at(-1)[0] : a), "");
fs.writeFileSync(path.join(OUT, "series.json"), JSON.stringify({ asOf, index: { US: "QQQ", SET: "TDEX" }, symbols: series }));
fs.writeFileSync(path.join(OUT, "library.json"), JSON.stringify(lib));
console.log("series KB", Math.round(fs.statSync(path.join(OUT, "series.json")).size / 1024), "library KB", Math.round(fs.statSync(path.join(OUT, "library.json")).size / 1024));
