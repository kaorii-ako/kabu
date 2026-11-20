import market from "../data/market.json";
import tradeData from "../data/trades.json";

tradeData.forEach((t) => {
  market.examples[`trade_${t.id}`] = { symbol: t.symbol, name: t.name, currency: t.currency, market: t.market, rows: t.rows };
});

export const TRADES = tradeData;

export const MA_PERIODS = [10, 20, 50, 200];

const resolvers = [];

export function addExampleResolver(fn) {
  resolvers.push(fn);
}

export function example(key) {
  let ex = market.examples[key];
  if (!ex) {
    for (const r of resolvers) {
      ex = r(key);
      if (ex) {
        market.examples[key] = ex;
        break;
      }
    }
  }
  if (!ex) throw new Error(`Unknown chart example: ${key}`);
  return ex;
}

export function bars(key, from, to) {
  const ex = example(key);
  return ex.rows
    .filter((r) => (!from || r[0] >= from) && (!to || r[0] <= to))
    .map((r) => ({
      date: r[0],
      o: r[1],
      h: r[2],
      l: r[3],
      c: r[4],
      v: r[5],
      ma: { 10: r[6], 20: r[7], 50: r[8], 200: r[9] },
      atr: r[10] ?? null,
    }));
}

export function group(key) {
  return market.groups[key];
}

export const asOf = market.asOf;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(iso, withYear = true) {
  const [y, m, d] = iso.split("-").map(Number);
  return withYear ? `${d} ${MONTHS[m - 1]} ${y}` : `${d} ${MONTHS[m - 1]}`;
}

export function monthLabel(iso) {
  const [y, m] = iso.split("-").map(Number);
  return m === 1 ? `${MONTHS[0]} ${y}` : MONTHS[m - 1];
}

export function fmtPrice(p, currency) {
  if (p == null) return "";
  const digits = p >= 100 ? 2 : p >= 10 ? 2 : 3;
  const s = p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: digits });
  return currency === "THB" ? `฿${s}` : currency === "USD" ? `$${s}` : s;
}

export function fmtVol(v) {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${Math.round(v / 1e3)}K`;
  return String(v);
}
