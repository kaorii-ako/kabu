import seriesData from "../data/series.json";
import libraryData from "../data/library.json";
import { addExampleResolver } from "./market";
import { indicators, toRows } from "./analyze";

const cache = {};

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
  if (key.startsWith("upload_")) return uploads[key] || null;
  return null;
});
