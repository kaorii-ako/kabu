import { TRADES } from "../lib/market";

const NOTES = {
  kgc: {
    title: "Kinross Gold, August 2025",
    story: "Gold miners led the market all year. KGC ran up in spring, then went sideways through July with the highs stopping near $16.50.",
    group: "Gold miners were the leading group: GDX was up 46% for 2025 by the end of July, against 11% for QQQ.",
    pattern: "Flat base",
    verdict: "take",
    why: "Healthy market, leading group, a tight flat base above all key averages, and not extended. Ariel used this exact chart in his flat base video, with the breakout on 4 August.",
  },
  delta: {
    title: "Delta Electronics, July 2025",
    story: "DELTA nearly doubled from its April low, then digested for two months between about ฿91 and ฿116.",
    group: "DELTA rose 92% in three months while the SET50 fund rose 11%. That is strong relative strength.",
    pattern: "Flat base",
    verdict: "take",
    why: "The SET50 was just above a flat 50-day, the stock was a clear leader, and the base was tight with a stop well inside one ATR.",
  },
  aot: {
    title: "Airports of Thailand, November 2025",
    story: "AOT moved sideways between about ฿39 and ฿42.75 from mid-October, above a rising 50-day.",
    group: "AOT beat the SET50 over both three and six months.",
    pattern: "Flat base",
    verdict: "smaller",
    why: "A clean base in a stock with relative strength, but the SET50 was under its 50-day. Ariel's progressive exposure says take it with less risk until the market improves.",
  },
  ktbfail: {
    title: "Krungthai Bank, September 2026",
    story: "KTB had a huge year. It went sideways for a month just under ฿44.75 and then pushed through.",
    group: "Banks were still leading on a six-month view, but had stalled for a month.",
    pattern: "Flat base",
    verdict: "smaller",
    why: "The setup and relative strength were fine, but the SET50 had slipped under its 50-day, so the rules call for smaller risk. This one failed. That is normal; the stop is what keeps it small.",
  },
  kbank: {
    title: "Kasikornbank, October 2026",
    story: "KBANK slid from ฿258 to ฿230, then on 9 Oct dipped to ฿226 and closed at ฿228.",
    group: "Thai banks had led over six months, but the SET50 and KBANK were both falling.",
    pattern: "Undercut of a recent low",
    verdict: "pass",
    why: "The ฿230 low was only a day old, not a meaningful low that had held before, and KBANK was under all its key averages in a falling market. Ariel says he doesn't trade undercuts of random recent lows. It did bounce 9%, but rules are judged on the decision, not on one outcome.",
  },
  amd: {
    title: "AMD, September 2026",
    story: "AMD had more than doubled in six months. It pulled back into its 10 and 20-day averages and on 14 Sept dipped under the 20-day before closing back above it.",
    group: "AMD was up 155% in six months against 19% for QQQ, but the Nasdaq was under a falling 50-day.",
    pattern: "MA undercut and rally",
    verdict: "smaller",
    why: "Not a textbook chart: the Nasdaq was choppy and AMD's 20-day had slipped under a falling 50-day. But in a choppy market Ariel prefers pullbacks into moving averages over breakouts, and AMD was a big leader over six months. He bought it that Monday himself on a VWAP reclaim near the 10 and 20-day, with about 1.25% risk to the low. Smaller size covers the weaker context.",
  },
  dell: {
    title: "Dell, September 2026",
    story: "DELL undercut its 24 Aug low of $424 on 1 Sept, touched $421.89 and closed at $425. A classic undercut and rally setup.",
    group: "DELL was up 193% in six months against 18% for QQQ.",
    pattern: "Undercut and rally",
    verdict: "pass",
    why: "The setup was real, but the next morning DELL opened 8.7% higher, and the prior-day-high trigger came with the stock up 8.9%. Its average daily range was 5.7%. Ariel never buys a stock that has already moved its full daily range: the stop would be far too wide. It ran another 28%, which happens. Missing a trade costs nothing; chasing costs a lot over time.",
  },
  rklb: {
    title: "Rocket Lab, August 2026",
    story: "RKLB fell hard from its highs, then bounced for two weeks straight into its falling 50-day average.",
    group: "RKLB was down 34% over three months while QQQ was up 3%.",
    pattern: "Rally into a falling 50-day",
    verdict: "pass",
    why: "Price was under a falling 50-day with poor relative strength. For a long, that is a pass. Ariel would look at this as a possible short instead, which beginners should leave alone. The trigger never even hit: the next day it fell.",
  },
};

export const SCENARIOS = TRADES.filter((t) => NOTES[t.id]).map((t) => ({ ...t, ...NOTES[t.id] }));

export const scenario = (id) => SCENARIOS.find((s) => s.id === id);

export function checks(t) {
  const f = t.facts;
  const marketOk = f.idxClose > f.idxMa50 && f.idxMa50 >= f.idxMa50_10ago;
  const rsOk = f.ret3m > f.idxRet3m + 2 || f.ret6m > f.idxRet6m + 2;
  const extOk = f.ext <= 4;
  const chaseOk = f.moveAtEntry == null ? null : f.moveAtEntry < f.adrPct;
  const idx = f.idxSym === "TDEX" ? "the SET50 fund (TDEX)" : "QQQ";
  const cur = t.currency === "THB" ? "฿" : "$";
  const list = [
    {
      key: "market",
      q: `Is the market healthy? ${idx} closed at ${f.idxClose}, its 50-day average is ${f.idxMa50.toFixed(2)}, and ten days ago that average was ${f.idxMa50_10ago.toFixed(2)}.`,
      yes: marketOk,
      explain: marketOk
        ? "Yes: above a 50-day that is flat or rising."
        : f.idxClose <= f.idxMa50
          ? "No: the index is under its 50-day. Ariel trades smaller, and prefers pullbacks to breakouts."
          : "Not quite: above the 50-day, but that average is falling. Treat it as choppy.",
    },
    {
      key: "rs",
      q: `Is ${t.symbol} stronger than the market? Over 3 months: ${t.symbol} ${f.ret3m > 0 ? "+" : ""}${f.ret3m}%, ${f.idxSym} ${f.idxRet3m > 0 ? "+" : ""}${f.idxRet3m}%. Over 6 months: ${f.ret6m > 0 ? "+" : ""}${f.ret6m}% against ${f.idxRet6m > 0 ? "+" : ""}${f.idxRet6m}%.`,
      yes: rsOk,
      explain: rsOk ? "Yes: it clearly beat the market over at least one of those periods." : "No: it didn't clearly beat the market. Ariel wants leaders.",
    },
    {
      key: "trend",
      q: `Ariel's scans keep stocks whose 20-day average is above the 50-day. ${t.symbol}'s 20-day is ${cur}${f.ma20.toFixed(2)} and its 50-day is ${cur}${f.ma50.toFixed(2)}. Is the 20-day above?`,
      yes: f.ma20 > f.ma50,
      explain: f.ma20 > f.ma50 ? "Yes: the medium-term trend is up." : "No: the 20-day is under the 50-day, so the trend isn't clearly up.",
    },
    {
      key: "ext",
      q: `Is it extended? Close ${cur}${f.close}, 50-day ${cur}${f.ma50.toFixed(2)}, ATR ${cur}${f.atr.toFixed(2)}. That puts it ${f.ext.toFixed(1)} ATR from the 50-day. Is that 4 ATR or less?`,
      yes: extOk,
      explain: extOk ? "Yes: within 4 ATR, so there is still room. Ariel doesn't start new positions more than about 4 ATR above the 50-day." : "No: more than 4 ATR above the 50-day is too extended for a new position.",
    },
  ];
  if (chaseOk != null) {
    list.push({
      key: "chase",
      q: `Would you be chasing? The entry trigger is the prior day's high, ${cur}${f.trigger}. When it hits, ${t.symbol} is up ${f.moveAtEntry}% on the day. Its average daily range is ${f.adrPct}%. Is the move smaller than that range?`,
      yes: chaseOk,
      explain: chaseOk ? "Yes: it hasn't used up its normal daily move yet." : "No: it has already moved more than a normal full day. Ariel never buys that; the stop would be too wide.",
    });
  }
  if (f.stopAtr != null) {
    const stopOk = f.stopAtr <= 1.5;
    list.push({
      key: "stop",
      q: `Is the stop tight enough? The stop goes just under the entry day's low, ${cur}${f.entryDayLow}. That is ${f.stopAtr} ATR below the entry of ${cur}${f.entry}. Is it within 1.5 ATR?`,
      yes: stopOk,
      explain: stopOk ? "Yes: a stop within 1 to 1.5 ATR keeps the loss small if it fails." : "No: the stop is too far away. Ariel wants it within about 1 to 1.5 ATR, or he skips the trade.",
    });
  }
  return list;
}

export const VERDICTS = {
  take: "Take it",
  smaller: "Take it, with half the risk",
  pass: "Pass",
};
