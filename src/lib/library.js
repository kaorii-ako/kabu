import seriesData from "../data/series.json";
import libraryData from "../data/library.json";
import { addExampleResolver } from "./market";
import { indicators, toRows } from "./analyze";

const cache = {};

export const EMA_KEYS = [9, 21, 50, 150];

export function emaArr(xs, n) {
  const k = 2 / (n + 1);
  const out = new Array(xs.length).fill(null);
  let e = null;
  for (let i = n - 1; i < xs.length; i++) {
    if (e == null) {
      let sum = 0;
      for (let j = i - n + 1; j <= i; j++) sum += xs[j];
      e = sum / n;
    } else e = xs[i] * k + e * (1 - k);
    out[i] = Math.round(e * 1000) / 1000;
  }
  return out;
}

function emaRows(rows) {
  const c = rows.map((r) => r[4]);
  const e = EMA_KEYS.map((n) => emaArr(c, n));
  return rows.map((r, i) => [r[0], r[1], r[2], r[3], r[4], r[5], e[0][i], e[1][i], e[2][i], e[3][i], null]);
}

export function anchoredVwap(rows, anchor) {
  let pv = 0;
  let vol = 0;
  const out = {};
  rows.forEach((r) => {
    if (r[0] < anchor) return;
    const tp = (r[2] + r[3] + r[4]) / 3;
    pv += tp * r[5];
    vol += r[5];
    out[r[0]] = vol ? pv / vol : null;
  });
  return out;
}

export const SERIES = seriesData;

export const SYMBOLS = Object.entries(seriesData.symbols)
  .filter(([s]) => s !== seriesData.index.US && s !== seriesData.index.SET)
  .map(([symbol, m]) => ({ symbol, name: m.name, market: m.market, currency: m.currency }))
  .sort((a, b) => (a.market === b.market ? a.symbol.localeCompare(b.symbol) : a.market === "US" ? -1 : 1));

export function symbolBars(symbol) {
  if (!cache[symbol]) {
    const m = seriesData.symbols[symbol];
    if (!m) return null;
    cache[symbol] = indicators(m.rows);
  }
  return cache[symbol];
}

export function symbolMeta(symbol) {
  const m = seriesData.symbols[symbol];
  return m ? { symbol, name: m.name, market: m.market, currency: m.currency } : null;
}

export function indexFor(market) {
  const s = seriesData.index[market];
  return { symbol: s, bars: symbolBars(s) };
}

const uploads = {};

export function registerUpload(key, meta, b) {
  uploads[key] = { ...meta, rows: toRows(b) };
}

export const LIBRARY = libraryData.map((e) => ({ ...e, ex: `trade_${e.id}` }));

const byId = Object.fromEntries(LIBRARY.map((e) => [e.id, e]));

export const libraryItem = (id) => byId[id];

addExampleResolver((key) => {
  if (key.startsWith("trade_")) {
    const e = byId[key.slice(6)];
    if (!e) return null;
    const b = symbolBars(e.symbol).filter((x) => x.date >= e.from && x.date <= e.to);
    return { symbol: e.symbol, name: e.name, currency: e.currency, market: e.market, rows: toRows(b) };
  }
  if (key.startsWith("sym_")) {
    const s = key.slice(4);
    const m = symbolMeta(s);
    if (!m) return null;
    return { ...m, rows: toRows(symbolBars(s)) };
  }
  if (key.startsWith("luk_")) {
    const s = key.slice(4);
    const m = seriesData.symbols[s];
    if (!m) return null;
    return { ...symbolMeta(s), rows: emaRows(m.rows), maKeys: EMA_KEYS, ema: true };
  }
  if (key.startsWith("upload_")) return uploads[key] || null;
  return null;
});
