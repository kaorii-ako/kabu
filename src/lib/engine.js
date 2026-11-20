import { bars } from "./market";

export const ACCOUNT = { USD: 100000, THB: 1000000 };
export const MAX_POSITION = 0.15;

export function tradeBars(t) {
  return t.bars || bars(`trade_${t.id}`);
}

export function plan(t, smaller) {
  const f = t.facts;
  if (f.entry == null) return null;
  const tick = t.tick;
  const stop = +(f.entryDayLow - tick).toFixed(4);
  const perShare = +(f.entry - stop).toFixed(4);
  const account = ACCOUNT[t.currency];
  const riskPct = smaller ? 0.25 : 0.5;
  const lot = t.market === "SET" ? (f.entry >= 500 ? 50 : 100) : 1;
  const byRisk = (account * riskPct) / 100 / perShare;
  const byCap = (account * MAX_POSITION * (smaller ? 0.5 : 1)) / f.entry;
  const raw = Math.min(byRisk, byCap);
  const shares = Math.floor(raw / lot) * lot;
  return {
    entry: f.entry,
    stop,
    perShare,
    account,
    riskPct,
    lot,
    shares,
    capped: byCap < byRisk,
    riskAmt: shares * perShare,
    value: shares * f.entry,
  };
}

export function startState(t, p) {
  const all = tradeBars(t);
  const entryIndex = all.findIndex((b) => b.date === t.facts.entryDate);
  return {
    all,
    entryIndex,
    i: entryIndex,
    day: 1,
    shares: p.shares,
    stop: p.stop,
    cash: -p.shares * p.entry,
    trimmed: false,
    extLevel: 6,
    log: [{ date: all[entryIndex].date, day: 1, text: `Bought ${p.shares.toLocaleString("en-US")} shares at ${p.entry}. Stop under the day's low, at ${p.stop}.`, kind: "buy" }],
    done: false,
    exitReason: null,
  };
}

function sell(s, qty, price, date, text, kind) {
  const q = Math.min(qty, s.shares);
  if (q <= 0) return s;
  return {
    ...s,
    shares: s.shares - q,
    cash: s.cash + q * price,
    log: [...s.log, { date, day: s.day, text: `${text} Sold ${q.toLocaleString("en-US")} at ${+price.toFixed(2)}.`, kind }],
  };
}

export function roundLot(n, lot) {
  return Math.max(lot, Math.floor(n / lot) * lot);
}

export function stepDay(s, p) {
  if (s.done) return s;
  const i = s.i + 1;
  if (i >= s.all.length) return { ...s, done: true, exitReason: "end" };
  const b = s.all[i];
  let next = { ...s, i, day: s.day + 1 };
  if (b.l <= next.stop) {
    const px = Math.min(b.o, next.stop);
    next = sell(next, next.shares, px, b.date, next.trimmed ? "Price fell to your breakeven stop." : "Price hit your stop.", "stop");
    return { ...next, done: true, exitReason: "stop" };
  }
  if (i === s.all.length - 1) return { ...next, atEnd: true };
  return next;
}

export function trim(s, p, fraction, reason) {
  const b = s.all[s.i];
  const qty = Math.min(s.shares, roundLot(s.shares * fraction, p.lot));
  let next = sell(s, qty, b.c, b.date, reason || "Trimmed into strength.", "trim");
  if (!s.trimmed) {
    next = { ...next, trimmed: true, stop: p.entry, log: [...next.log, { date: b.date, day: s.day, text: `Stop on the rest moved up to breakeven, ${p.entry}.`, kind: "note" }] };
  }
  if (next.shares === 0) next = { ...next, done: true, exitReason: "sold" };
  return next;
}

export function sellAll(s, reason) {
  const b = s.all[s.i];
  const next = sell(s, s.shares, b.c, b.date, reason || "Sold the rest.", "sell");
  return { ...next, done: true, exitReason: "sold" };
}

export function finish(s) {
  const b = s.all[s.i];
  if (s.shares > 0) return { ...sell(s, s.shares, b.c, b.date, "Replay ended; marked at the last close.", "end"), done: true, exitReason: "end" };
  return { ...s, done: true };
}

export function hints(s, p) {
  const b = s.all[s.i];
  const out = [];
  if (s.done || s.shares === 0) return out;
  const gain = b.c / p.entry - 1;
  if (!s.trimmed && s.day >= 3 && s.day <= 5 && gain >= 0.08) {
    out.push({
      action: gain >= 0.2 ? "half" : "third",
      text: `Day ${s.day} and up ${(gain * 100).toFixed(1)}%: a momentum burst. Ariel trims ${gain >= 0.2 ? "half" : "a third to a half"} here.`,
    });
  }
  if (b.atr && b.ma[50] != null) {
    const ext = (b.c - b.ma[50]) / b.atr;
    if (ext >= s.extLevel + 1) out.push({ action: "ext", level: Math.floor(ext), text: `Now ${ext.toFixed(1)} ATR above the 50-day. Ariel trims about 10% of what's left at 7 ATR and every ATR after.` });
  }
  if (s.day > 5 && (s.trimmed || gain >= 0.1) && b.ma[20] != null && b.c < b.ma[20]) {
    out.push({ action: "trail", text: "The trade has worked and just closed below the 20-day average. Ariel lets winners work while they hold the 10 and 20-day; Kabu's simple trailing rule sells the rest on a close below the 20-day." });
  }
  return out;
}

export function runRules(t, p) {
  let s = startState(t, p);
  while (!s.done) {
    const h = hints(s, p);
    const burst = h.find((x) => x.action === "half" || x.action === "third");
    const ext = h.find((x) => x.action === "ext");
    const trail = h.find((x) => x.action === "trail");
    if (trail) {
      s = sellAll(s, "Closed below the 20-day.");
      break;
    }
    if (burst) s = trim(s, p, burst.action === "half" ? 0.5 : 1 / 3, "Momentum burst on days 3 to 5.");
    if (ext && s.shares > 0) {
      s = trim({ ...s, extLevel: ext.level }, p, 0.1, `${ext.level} ATR above the 50-day.`);
    }
    if (s.done) break;
    const n = stepDay(s, p);
    if (n.atEnd) {
      s = finish(n);
      break;
    }
    s = n;
  }
  return s;
}

export function result(s, p) {
  const pnl = s.cash + s.shares * s.all[s.i].c;
  return { pnl, r: pnl / (p.shares * p.perShare), accountPct: (pnl / p.account) * 100 };
}
