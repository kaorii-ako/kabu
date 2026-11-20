export const SETUPS = {
  flat: { name: "Flat base", short: "Flat base", blurb: "A leader goes sideways in a tight range near its highs, above rising averages. Buy the prior-day-high break near the top of the range." },
  unr: { name: "Undercut and rally", short: "UNR", blurb: "Price dips under a meaningful low that held before, shakes out weak holders, and closes back above it." },
  munr: { name: "MA undercut and rally", short: "MUNR", blurb: "A stock in an uptrend dips under its 10, 20 or 50-day average and closes back above it the same day." },
  pullback: { name: "Pullback to a rising average", short: "Pullback", blurb: "A leader pulls back to its rising 10 or 20-day average and holds it without breaking under." },
  gap: { name: "Gap up on heavy volume", short: "Gap up", blurb: "Price opens well above yesterday's close on several times normal volume, usually on earnings or news, and holds the gain." },
  htf: { name: "High tight flag", short: "HTF", blurb: "A stock rises 80% or more in under two months, then rests in a shallow, tight flag." },
  rejection: { name: "Rally into a falling 50-day", short: "Rejection", blurb: "A falling stock bounces straight up into its falling 50-day average and closes under it. For a long, that is a pass." },
};

export const SETUP_ORDER = ["flat", "unr", "munr", "pullback", "gap", "htf", "rejection"];

const r2 = (v) => (v == null ? null : Math.round(v * 100) / 100);
const r1 = (v) => (v == null ? null : Math.round(v * 10) / 10);
const r3 = (v) => (v == null ? null : Math.round(v * 1000) / 1000);

export function tickFor(price, market) {
  if (market !== "SET") return 0.01;
  if (price < 2) return 0.01;
  if (price < 5) return 0.02;
  if (price < 10) return 0.05;
  if (price < 25) return 0.1;
  if (price < 100) return 0.25;
  if (price < 200) return 0.5;
  if (price < 400) return 1;
  return 2;
}

function smaArr(vals, n) {
  const out = new Array(vals.length).fill(null);
  let s = 0;
  for (let i = 0; i < vals.length; i++) {
    s += vals[i];
    if (i >= n) s -= vals[i - n];
    if (i >= n - 1) out[i] = s / n;
  }
  return out;
}

export function cleanRows(rows) {
  return rows.filter((r) => r && r.every((x) => x != null) && !(r[5] === 0 && r[1] === r[2] && r[2] === r[3] && r[3] === r[4]));
}

export function indicators(rows) {
  const c = rows.map((r) => r[4]);
  const v = rows.map((r) => r[5]);
  const tr = rows.map((r, i) => {
    const pc = i ? rows[i - 1][4] : r[4];
    return Math.max(r[2] - r[3], Math.abs(r[2] - pc), Math.abs(r[3] - pc));
  });
  const m = { 10: smaArr(c, 10), 20: smaArr(c, 20), 50: smaArr(c, 50), 200: smaArr(c, 200) };
  const atr = smaArr(tr, 14);
  const vol50 = smaArr(v, 50);
  return rows.map((r, i) => ({
    date: r[0],
    o: r[1],
    h: r[2],
    l: r[3],
    c: r[4],
    v: r[5],
    ma: { 10: m[10][i], 20: m[20][i], 50: m[50][i], 200: m[200][i] },
    atr: atr[i],
    vol50: vol50[i],
  }));
}

export function toRows(bars) {
  return bars.map((b) => [b.date, b.o, b.h, b.l, b.c, b.v, r3(b.ma[10]), r3(b.ma[20]), r3(b.ma[50]), r3(b.ma[200]), r3(b.atr)]);
}

function maxH(b, from, to) {
  let m = -Infinity;
  let at = from;
  for (let k = Math.max(0, from); k <= to; k++) if (b[k].h > m) { m = b[k].h; at = k; }
  return { v: m, at };
}

function minL(b, from, to) {
  let m = Infinity;
  let at = from;
  for (let k = Math.max(0, from); k <= to; k++) if (b[k].l < m) { m = b[k].l; at = k; }
  return { v: m, at };
}

function uptrend(b, i) {
  const x = b[i];
  return x.ma[50] != null && b[i - 10]?.ma[50] != null && x.c > x.ma[50] && x.ma[20] > x.ma[50] && x.ma[50] > b[i - 10].ma[50];
}

const detectors = {
  flat(b, i) {
    const x = b[i];
    if (!uptrend(b, i) || x.c < x.ma[10] || x.c < x.ma[20]) return null;
    for (let L = 40; L >= 15; L--) {
      const s = i - L + 1;
      if (s - 60 < 0) continue;
      const hi = maxH(b, s, i);
      const lo = minL(b, s, i);
      const depth = (hi.v - lo.v) / hi.v;
      if (depth > 0.15) continue;
      if (hi.at > i - 5) continue;
      if (x.c < hi.v * 0.96) continue;
      const before = minL(b, s - 60, s - 1);
      const run = b[s].c / before.v - 1;
      if (run < 0.2) continue;
      const tight = maxH(b, i - 9, i).v / minL(b, i - 9, i).v - 1;
      if (tight > 0.1) continue;
      return { L, hi: hi.v, lo: lo.v, depth, run, startDate: b[s].date };
    }
    return null;
  },
  unr(b, i) {
    const x = b[i];
    if (x.atr == null) return null;
    for (let j = i - 5; j >= i - 60 && j >= 6; j--) {
      const lj = b[j].l;
      if (minL(b, j - 5, Math.min(j + 5, i - 1)).at !== j) continue;
      if (maxH(b, j + 1, i - 1).v < lj + 2 * b[j].atr) continue;
      let held = true;
      for (let k = j + 1; k < i; k++) if (b[k].c < lj) { held = false; break; }
      if (!held) continue;
      if (x.l < lj && x.c > lj && x.l >= lj - 1.5 * x.atr && b[i - 1].l >= lj) {
        return { lowDate: b[j].date, low: lj, bounce: maxH(b, j + 1, i - 1).v / lj - 1 };
      }
      return null;
    }
    return null;
  },
  munr(b, i) {
    const x = b[i];
    if (!uptrend(b, i) || x.atr == null) return null;
    for (const k of [50, 20, 10]) {
      const m = x.ma[k];
      if (!(x.l < m && x.c > m)) continue;
      let above = true;
      for (let d = 1; d <= 5; d++) if (b[i - d].c <= b[i - d].ma[k]) { above = false; break; }
      if (!above) continue;
      const top = maxH(b, i - 10, i).v;
      if (top < x.c + x.atr) continue;
      return { k, ma: m, top };
    }
    return null;
  },
  pullback(b, i) {
    const x = b[i];
    if (!uptrend(b, i) || x.atr == null) return null;
    for (const k of [20, 10]) {
      const m = x.ma[k];
      if (m <= b[i - 5].ma[k]) continue;
      if (!(x.l >= m && x.l <= m + 0.35 * x.atr && x.c > m)) continue;
      const top = maxH(b, i - 10, i).v;
      if (top < x.c + 1.5 * x.atr) continue;
      let lower = 0;
      for (let d = 0; d < 3; d++) if (b[i - d].h < b[i - d - 1].h) lower++;
      if (lower < 2) continue;
      return { k, ma: m, top };
    }
    return null;
  },
  gap(b, i) {
    const x = b[i];
    const p = b[i - 1];
    if (p.vol50 == null) return null;
    const gap = x.o / p.c - 1;
    const volX = x.v / p.vol50;
    if (gap < 0.04 || volX < 2.5) return null;
    if (x.h === x.l || (x.c - x.l) / (x.h - x.l) < 0.5) return null;
    if (x.c < p.c * 1.03) return null;
    return { gap, volX, prevClose: p.c };
  },
  htf(b, i) {
    const x = b[i];
    for (let p = i - 5; p >= i - 25 && p >= 45; p--) {
      if (maxH(b, p, i).at !== p) continue;
      const base = minL(b, p - 40, p);
      const pole = b[p].h / base.v - 1;
      if (pole < 0.8) return null;
      const depth = 1 - minL(b, p, i).v / b[p].h;
      if (depth > 0.25) return null;
      if (x.c < b[p].h * 0.88) return null;
      return { pole, depth, days: i - p, top: b[p].h, poleDays: p - base.at };
    }
    return null;
  },
  rejection(b, i) {
    const x = b[i];
    if (x.ma[50] == null || b[i - 10]?.ma[50] == null) return null;
    if (!(x.ma[50] < b[i - 10].ma[50] && x.ma[20] < x.ma[50])) return null;
    if (!(x.h >= x.ma[50] * 0.99 && x.c < x.ma[50])) return null;
    const low = minL(b, i - 10, i);
    if (low.v > x.ma[50] * 0.93) return null;
    return { ma: x.ma[50], bounce: x.h / low.v - 1, days: i - low.at };
  },
};

export function detectAt(b, i, only) {
  if (i < 60 || i >= b.length) return [];
  const out = [];
  for (const type of only || SETUP_ORDER) {
    const info = detectors[type](b, i);
    if (info) out.push({ type, info });
  }
  return out;
}

function barOn(b, date) {
  let lo = 0;
  let hi = b.length - 1;
  if (b[0].date > date) return -1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (b[mid].date <= date) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

export function factsAt(b, i, meta, idx) {
  const x = b[i];
  const ret = (arr, k, n) => (k - n >= 0 ? r1((arr[k].c / arr[k - n].c - 1) * 100) : null);
  const f = {
    close: x.c,
    high: x.h,
    low: x.l,
    ma10: r3(x.ma[10]),
    ma20: r3(x.ma[20]),
    ma50: r3(x.ma[50]),
    ma50_10ago: r3(b[i - 10]?.ma[50]),
    atr: r3(x.atr),
    ext: r2((x.c - x.ma[50]) / x.atr),
    ret3m: ret(b, i, 63),
    ret6m: ret(b, i, 126),
    adrPct: r1((x.atr / x.c) * 100),
  };
  if (idx) {
    const j = barOn(idx.bars, x.date);
    if (j >= 10) {
      const ix = idx.bars[j];
      Object.assign(f, {
        idxSym: idx.symbol,
        idxClose: ix.c,
        idxMa50: r3(ix.ma[50]),
        idxMa50_10ago: r3(idx.bars[j - 10].ma[50]),
        idxRet3m: ret(idx.bars, j, 63),
        idxRet6m: ret(idx.bars, j, 126),
      });
    }
  }
  const tick = tickFor(x.c, meta.market);
  const nxt = b[i + 1];
  const trigger = r3(x.h + tick);
  Object.assign(f, { trigger, prevClose: x.c });
  if (nxt) {
    const entry = nxt.h >= trigger ? Math.max(trigger, nxt.o) : null;
    Object.assign(f, {
      entryDate: nxt.date,
      entry: entry == null ? null : r3(entry),
      entryOpen: nxt.o,
      entryDayLow: nxt.l,
      moveAtEntry: entry == null ? null : r1((entry / x.c - 1) * 100),
      stopAtr: entry == null ? null : r2((entry - nxt.l) / x.atr),
    });
  }
  return { facts: f, tick };
}

export function evaluate(type, f) {
  const has = (k) => f[k] != null;
  const marketOk = has("idxClose") ? f.idxClose > f.idxMa50 && f.idxMa50 >= f.idxMa50_10ago : null;
  const rsOk = has("idxRet3m") ? f.ret3m > f.idxRet3m + 2 || (f.ret6m != null && f.idxRet6m != null && f.ret6m > f.idxRet6m + 2) : null;
  const trendOk = f.ma20 > f.ma50;
  const extOk = f.ext <= 4;
  const chaseOk = f.moveAtEntry == null ? null : f.moveAtEntry < f.adrPct;
  const stopOk = f.stopAtr == null ? null : f.stopAtr <= 1.5;
  const reasons = [];
  let verdict = "take";
  const fail = (v, text) => {
    reasons.push(text);
    if (v === "pass" || verdict === "take") verdict = v;
  };
  if (type === "rejection") fail("pass", `The price is under a falling 50-day average${trendOk ? "" : " and the 20-day is under the 50-day"}. Ariel doesn't buy into falling averages; he'd only look at this as a short, which beginners should leave alone.`);
  if (rsOk === false) fail("pass", `No relative strength: ${sgn(f.ret3m)} over three months against ${sgn(f.idxRet3m)} for ${f.idxSym}${f.ret6m != null && f.idxRet6m != null ? `, and ${sgn(f.ret6m)} against ${sgn(f.idxRet6m)} over six` : ""}. Ariel only buys leaders.`);
  if (!extOk) fail("pass", `Too extended: ${f.ext} ATR above the 50-day. Ariel doesn't start new positions more than about 4 ATR above it.`);
  if (chaseOk === false) fail("pass", `It would be a chase: the trigger came with the stock already up ${f.moveAtEntry}% on the day, more than its ${f.adrPct}% average daily range.`);
  if (stopOk === false) fail("pass", `The stop would be too wide: the low of the entry day is ${f.stopAtr} ATR under the entry, past Ariel's limit of about 1 to 1.5 ATR.`);
  if (!trendOk && type !== "rejection") fail(type === "unr" || type === "gap" ? "smaller" : "pass", `The 20-day average is under the 50-day, so the trend isn't clearly up.`);
  if (marketOk === false && type !== "rejection") fail("smaller", `The market is weak: ${f.idxSym} ${f.idxClose <= f.idxMa50 ? "is under its 50-day" : "is above a falling 50-day"}. Progressive exposure says trade smaller until it improves.`);
  return { verdict, reasons, marketOk, rsOk, trendOk, extOk, chaseOk, stopOk };
}

export function scanSymbol(b, meta, idx, opts = {}) {
  const from = opts.from ?? 130;
  const to = opts.to ?? b.length - 2;
  const cool = opts.cooldown ?? 15;
  const last = {};
  let lastAny = -Infinity;
  const found = [];
  for (let i = from; i <= to; i++) {
    const hits = detectAt(b, i);
    for (const h of hits) {
      if (i - (last[h.type] ?? -Infinity) < cool) continue;
      if (i - lastAny < 3) continue;
      const { facts, tick } = factsAt(b, i, meta, idx);
      if (facts.entry == null) continue;
      last[h.type] = i;
      lastAny = i;
      found.push({ i, date: b[i].date, type: h.type, info: h.info, facts, tick });
      break;
    }
  }
  return found;
}

export function setupDays(b) {
  const out = [];
  for (let i = 60; i < b.length; i++) if (detectAt(b, i).length) out.push(i);
  return out;
}

export function latestSetups(b, meta, idx, at, lookback = 5) {
  const out = [];
  for (let i = at; i >= Math.max(60, at - lookback); i--) {
    for (const h of detectAt(b, i)) {
      if (out.some((o) => o.type === h.type)) continue;
      const { facts: full, tick } = factsAt(b, i, meta, idx);
      const facts = { ...full };
      if (i + 1 > at) for (const k of ["entryDate", "entry", "entryOpen", "entryDayLow", "moveAtEntry", "stopAtr"]) delete facts[k];
      out.push({ i, date: b[i].date, type: h.type, info: h.info, facts, full, tick, daysAgo: at - i, ...evaluate(h.type, facts) });
    }
  }
  return out;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function niceDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`;
}

export function monthYear(iso) {
  const [y, m] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

export function shortName(name, symbol) {
  const n = (name || symbol)
    .replace(/ Public Company Limited| Holdings,? Inc\.| Holdings Co| Technologies,? Inc\.| Corporation| Inc\.| Corp\.| Limited| Ltd\.?| Co\.?$/g, "")
    .replace(/,$/, "")
    .trim();
  return n.length > 30 ? symbol : n;
}

export function money(v, currency) {
  if (v == null) return "";
  const s = v >= 100 ? v.toFixed(2) : v >= 10 ? v.toFixed(2) : v.toFixed(v >= 1 ? 2 : 3);
  return `${currency === "THB" ? "฿" : "$"}${Number(s).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 3 })}`;
}

const pct = (v, d = 0) => `${(v * 100).toFixed(d)}%`;
const sgn = (v) => `${v >= 0 ? "+" : "−"}${Math.abs(v)}%`;

export function story(type, info, f, meta, date) {
  const m = (v) => money(v, meta.currency);
  const s = meta.symbol;
  switch (type) {
    case "flat":
      return `${s} rose ${pct(info.run)} before the base, then went sideways for ${info.L} trading days between ${m(info.lo)} and ${m(info.hi)}. On ${niceDate(date)} it closed at ${m(f.close)}, near the top of the range.`;
    case "unr":
      return `${s} set a low of ${m(info.low)} on ${niceDate(info.lowDate)} and bounced ${pct(info.bounce)} off it. On ${niceDate(date)} it dipped to ${m(f.low)}, under that low, and closed back above it at ${m(f.close)}.`;
    case "munr":
      return `${s} pulled back from ${m(info.top)}. On ${niceDate(date)} it dipped under its ${info.k}-day average (${m(info.ma)}) to ${m(f.low)}, then closed back above it at ${m(f.close)}.`;
    case "pullback":
      return `${s} pulled back from ${m(info.top)} to its rising ${info.k}-day average. On ${niceDate(date)} the low was ${m(f.low)}, just above the average at ${m(info.ma)}, and it closed at ${m(f.close)}.`;
    case "gap":
      return `${s} gapped up ${pct(info.gap, 1)} on ${niceDate(date)} on ${info.volX.toFixed(1)} times its average volume, and closed at ${m(f.close)}, up ${pct(f.close / info.prevClose - 1, 1)} on the day. Gaps like this usually come from earnings or big news.`;
    case "htf":
      return `${s} rose ${pct(info.pole)} in ${info.poleDays} trading days, topping at ${m(info.top)}. Over the next ${info.days} days it pulled back only ${pct(info.depth)} and closed at ${m(f.close)} on ${niceDate(date)}.`;
    case "rejection":
      return `${s} had been falling. It bounced ${pct(info.bounce)} in ${info.days} days, right up to its falling 50-day average at ${m(info.ma)}, and closed under it at ${m(f.close)} on ${niceDate(date)}.`;
    default:
      return "";
  }
}

export function contextLine(f, meta) {
  if (f.idxSym == null) return "";
  const idx = f.idxSym === "TDEX" ? "the SET50 fund (TDEX)" : "QQQ";
  const mk = f.idxClose > f.idxMa50 ? (f.idxMa50 >= f.idxMa50_10ago ? "above a rising 50-day" : "above a falling 50-day") : "under its 50-day";
  return `Over three months ${meta.symbol} was ${sgn(f.ret3m)} against ${sgn(f.idxRet3m)} for ${f.idxSym}${f.ret6m != null && f.idxRet6m != null ? `; over six months ${sgn(f.ret6m)} against ${sgn(f.idxRet6m)}` : ""}. ${idx[0].toUpperCase() + idx.slice(1)} was ${mk}.`;
}

export function whyText(ev) {
  if (ev.verdict === "take") return "Everything on the checklist passes: a healthy market, clear relative strength, a 20-day above the 50-day, not extended, no chase, and a stop within 1.5 ATR.";
  return ev.reasons.join(" ");
}

export function outcomeOf(r) {
  if (r >= 1) return "worked";
  if (r <= -0.5) return "failed";
  return "scratch";
}

export const OUTCOMES = {
  worked: "Worked",
  failed: "Failed",
  scratch: "Scratch",
};

export function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("The file has no rows.");
  const head = lines[0].split(/[,;\t]/).map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase());
  const col = (names) => head.findIndex((h) => names.includes(h));
  const di = col(["date", "time", "datetime", "timestamp"]);
  const oi = col(["open", "o"]);
  const hi = col(["high", "h"]);
  const li = col(["low", "l"]);
  const ci = col(["close", "c", "adj close", "price", "last"]);
  const vi = col(["volume", "vol", "v"]);
  if ([di, oi, hi, li, ci].some((k) => k < 0)) throw new Error("Couldn't find Date, Open, High, Low and Close columns. Export daily bars from Yahoo Finance or TradingView and try again.");
  const toDate = (s) => {
    const t = s.replace(/^"|"$/g, "").trim();
    if (/^\d{9,13}$/.test(t)) {
      const ms = t.length > 10 ? +t : +t * 1000;
      return new Date(ms).toISOString().slice(0, 10);
    }
    const d = new Date(t.length === 10 ? `${t}T00:00:00Z` : t);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10);
  };
  const num = (s) => {
    const v = parseFloat(String(s).replace(/^"|"$/g, "").replace(/,/g, ""));
    return Number.isFinite(v) ? v : null;
  };
  const rows = [];
  for (const line of lines.slice(1)) {
    const p = line.split(/[,;\t](?=(?:[^"]*"[^"]*")*[^"]*$)/);
    const d = toDate(p[di] || "");
    const r = [d, num(p[oi]), num(p[hi]), num(p[li]), num(p[ci]), vi >= 0 ? num(p[vi]) ?? 0 : 0];
    if (d && r.slice(1, 5).every((x) => x != null)) rows.push(r);
  }
  rows.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  if (rows.length < 70) throw new Error(`Only ${rows.length} daily bars found. The analyzer needs at least 70, and 130 or more for the six-month checks.`);
  return rows;
}
