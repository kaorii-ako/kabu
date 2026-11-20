# Kabu

Kabu (株, "stock") is a free, interactive course that teaches Ariel Hernandez's swing trading process to people who have never traded: how he reads the market, finds leading groups, reads a chart, picks a setup and entry tactic, sizes risk and manages a trade. Every example is a real daily chart from US or Thai stocks.

The method comes from Ariel Hernandez's public YouTube videos ([@RealSimpleAriel](https://www.youtube.com/@RealSimpleAriel)). Kabu is an independent summary and is not affiliated with or endorsed by him. Nothing here is financial advice.

## What's inside

- 31 lessons in 10 units that follow his order: his playbook, chart basics (candles, volume, moving averages, ATR), reading the market, finding leaders, reading the chart, his setups (flat base, undercut and rally, MA undercut and rally, MA rejection), entry tactics (prior-day high, opening range, VWAP, 6/20), risk and position size, and managing the trade (sell rules, trimming into strength).
- Trade replays: real setups from KGC, DELTA, AOT, KTB, KBANK, AMD, DELL and RKLB. You run Ariel's checklist, decide to take, size down or pass, then manage the trade one day at a time. Your result is compared with a rule engine that follows his guidance (stop at the entry day's low, trim a third to a half on a 3 to 5 day momentum burst, breakeven stop after the trim, extension trims from 7 ATR above the 50-day, and a simple close-below-the-20-day trailing exit).
- Setup library: 146 real setups found by scanning two years of daily bars for about 50 US and Thai stocks, covering flat bases, undercut and rally, MA undercut and rally, pullbacks to a rising average, gap ups on heavy volume, high tight flags, and rallies into a falling 50-day. Each one is replayable, and roughly half of them failed, because that's what real trading looks like. Filter by setup, result, checklist verdict or market.
- Chart analyzer: pick any stock in the dataset and any day, or upload your own daily CSV. The rule engine runs Ariel's checklist for that day, finds his setups in the last five sessions, gives the trigger and stop, and can show what happened next. When the site is opened inside Claude, an "Ask Claude" panel sends the chart data (and an optional screenshot) to Claude for a written read against the same rules. On GitHub Pages and Vercel that panel is hidden, and the analysis is the rule engine alone.
- A picture for every step: real candlestick charts for every example, and drawn diagrams for every concept (candle anatomy, ATR, flat base, undercut and rally, 6/20 cross, R multiples, momentum burst and more). All diagrams are at `#illustrations`.
- Interactive SVG candlestick charts with moving averages, levels, tap-to-answer questions and bar-by-bar reveals.
- Spaced review: finished questions come back after 1, 2, 4, 8, 16 and 32 days, mixed across lessons.
- A position size calculator (US shares or Thai board lots) and a win rate and expectancy simulator.
- Progress, XP and streak saved in the browser's localStorage.

Price data is daily OHLCV from Yahoo Finance, stored in `src/data/market.json` and `src/data/trades.json` (as of 20 Nov 2026). Lesson content quotes and paraphrases Ariel's public videos; the About page lists every video used.

## Run it

```bash
npm install
npm run dev
```

## Build

```bash
npm run build          # static site in dist/
npm run build:single   # one self-contained index.html in dist-single/
```

## GitHub Pages

The site is live at https://kaorii-ako.github.io/kabu/. Every push to `main` runs `.github/workflows/pages.yml`, which builds the site and publishes `dist/` to the `gh-pages` branch. In the repository settings, Pages should be set to deploy from the `gh-pages` branch, root folder.

To publish by hand instead: `npm run deploy:pages`.

## Deploy on Vercel

1. Go to vercel.com/new and import this repository.
2. Vercel detects Vite. Build command `npm run build`, output directory `dist` (already set in `vercel.json`).
3. Deploy. No environment variables are needed.

## Refreshing the data

The setup library and analyzer read `src/data/series.json` and `src/data/library.json`. To rebuild them from a folder of Yahoo chart JSON files (`{symbol,name,currency,rows:[[date,o,h,l,c,v]]}`):

```bash
npx esbuild scripts/gen-library.mjs --bundle --platform=node --format=esm --outfile=/tmp/gen.mjs
node /tmp/gen.mjs path/to/raw src/data
```

## Project layout

```
src/
  content/course.js      lessons, questions, video references
  content/trades.js      trade replay scenarios and Ariel's checklist
  lib/engine.js          trade replay and rule engine
  lib/analyze.js         setup detectors, checklist, CSV parser
  lib/library.js         setup library and price series for the analyzer
  data/series.json       two years of daily bars for every stock
  data/library.json      the 146 scanned setups
  views/Library.jsx      setup library
  views/Analyze.jsx      chart analyzer and Ask Claude
  components/TradeSim.jsx  the replay UI
  data/market.json       chart windows and group performance
  components/Chart.jsx   candlestick and group charts
  components/Player.jsx  lesson and review player
  views/                 Home, Review, Tools, About
  lib/store.js           progress, streak, spaced review
```
