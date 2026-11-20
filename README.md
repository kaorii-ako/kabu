# Kabu

Kabu (株, "stock") is a free, interactive course on swing trading for people who have never traded. Short lessons mix reading with questions, chart-tapping and small calculations, and every example is a real daily chart from US or Thai stocks.

The method comes from Ariel Hernandez's public YouTube videos ([@RealSimpleAriel](https://www.youtube.com/@RealSimpleAriel)). Kabu is an independent summary and is not affiliated with or endorsed by him. Nothing here is financial advice.

## What's inside

- 22 lessons in 9 units: chart basics, moving averages, market and group strength, the digest, daily setups (flat base, undercut and rally, MA undercut and rally, MA rejection), setup vs entry tactic, risk and position sizing, rules under pressure, and a mixed trade review.
- Interactive SVG candlestick charts with moving averages, levels, tap-to-answer questions and bar-by-bar reveals of what happened next.
- Spaced review: finished questions come back after 1, 2, 4, 8, 16 and 32 days, mixed across lessons.
- A position size calculator (US shares or Thai board lots) and a win rate and expectancy simulator.
- Progress, XP and streak saved in the browser's localStorage.

Price data is daily OHLCV from Yahoo Finance, stored in `src/data/market.json` (as of 20 Nov 2026).

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

## Deploy on Vercel

1. Go to vercel.com/new and import this repository.
2. Vercel detects Vite. Build command `npm run build`, output directory `dist` (already set in `vercel.json`).
3. Deploy. No environment variables are needed.

## Project layout

```
src/
  content/course.js      lessons, questions, video references
  data/market.json       chart windows and group performance
  components/Chart.jsx   candlestick and group charts
  components/Player.jsx  lesson and review player
  views/                 Home, Review, Tools, About
  lib/store.js           progress, streak, spaced review
```
