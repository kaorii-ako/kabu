export const CHANNEL = "https://www.youtube.com/@RealSimpleAriel";

export const VIDEOS = {
  setupVsEntry: { id: "310HGdY-uoE", title: "Daily Setup vs Entry Tactic" },
  unr: { id: "BynXTHRe9NU", title: "Undercut and Rally" },
  sixTwenty: { id: "nT_UmDSHWiQ", title: "Entry tactic: 6/20 setup" },
  flatBase: { id: "85SuKMuBjEc", title: "Flat Base Breakout" },
  maReject: { id: "5wsSZZLN4kk", title: "MA-Rejection" },
  predictive: { id: "_YIqHGE2O8c", title: "Predictive ability" },
  digest: { id: "q3k2XYFOBAY", title: "What does it mean to Digest?" },
  groups: { id: "oO4CLlK8I7U", title: "Scanning for group strength!" },
  universe: { id: "I_VMUnJ_xJo", title: "Building a Universe List!" },
  finviz: { id: "xuT_QvVMTXE", title: "Scanning using Finviz" },
  sizing: { id: "YADyGj171Fw", title: "Mastering Position Sizing" },
  volume: { id: "jLIjTQj8l6I", title: "Mastering Stock Buy Points: Key Volume Insights" },
  bigLosses: { id: "3LXVRMDFtOg", title: "Trading Rule: Avoid HUGE Losses" },
};

export const videoUrl = (v) => `https://www.youtube.com/watch?v=${v.id}`;

const kgcBase = { ex: "kgc_flat", from: "2025-06-02", to: "2025-08-29" };

export const UNITS = [
  {
    id: "chart",
    title: "Reading a chart",
    blurb: "Candles, volume, trend, and how Thai and US markets differ.",
    lessons: [
      {
        id: "candles",
        title: "What one candle tells you",
        steps: [
          {
            type: "read",
            title: "A chart is a diary of prices",
            body: [
              "On a daily chart, each candle is one trading day. The thick body runs from where the price opened to where it closed. The thin lines above and below, called wicks, reach the highest and lowest prices of the day.",
              "This is Krungthai Bank (KTB) on the Stock Exchange of Thailand in early 2026. Hover over or tap any candle: the strip above the chart shows its open (O), high (H), low (L) and close (C).",
            ],
            chart: { ex: "ktb_flat", from: "2026-01-12", to: "2026-02-12", mas: [] },
          },
          {
            type: "read",
            title: "Green up, red down",
            body: [
              "A green candle closed higher than it opened. A red candle closed lower. The colour says nothing about yesterday, only about that one day.",
              "A long wick means price travelled far during the day and then came back. Someone pushed, and someone else pushed back harder.",
            ],
            chart: {
              ex: "ktb_flat",
              from: "2026-01-12",
              to: "2026-02-12",
              mas: [],
              marks: [
                { date: "2026-01-21", label: "Long red day", at: "low", tone: "stop" },
                { date: "2026-02-09", label: "Strong green day", at: "high", tone: "pivot" },
              ],
            },
          },
          {
            type: "mcq",
            q: "On 9 Feb 2026 KTB opened at ฿29.25 and closed at ฿30.25. What kind of candle did that day draw?",
            options: [
              "Green, because it closed above where it opened",
              "Red, because the price moved by a whole baht",
              "There is no candle when the price rises",
            ],
            answer: 0,
            explain: "Close above open means a green body. The body runs from ฿29.25 up to ฿30.25.",
          },
          {
            type: "tap",
            q: "Tap the day KTB closed at its lowest price in this window.",
            chart: { ex: "ktb_flat", from: "2026-01-12", to: "2026-02-12", mas: [] },
            mode: "candle",
            target: { from: "2026-01-21", to: "2026-01-21" },
            explain: "21 Jan 2026. KTB dropped to ฿27.50 and closed at ฿27.75. The next day it closed back at ฿28.75, so the drop didn't last.",
          },
          {
            type: "mcq",
            q: "A candle has a long lower wick and closes near its high. What happened that day?",
            options: [
              "Sellers pushed the price down, then buyers pushed it back up",
              "The stock never traded below its open",
              "The stock closed at the low of the day",
            ],
            answer: 0,
            explain: "The wick shows how low price went. Closing near the high means buyers won the day after a sell-off.",
          },
        ],
      },
      {
        id: "volume",
        title: "Volume: who is showing up",
        video: "volume",
        steps: [
          {
            type: "read",
            title: "Volume counts the shares traded",
            body: [
              "The bars along the bottom of every chart show volume: how many shares changed hands that day. Funds and banks buy millions of shares at a time, and you can see them in these bars.",
              "Ariel teaches volume as a check on buy points. A breakout on heavy volume suggests big buyers are behind it. A breakout on light volume has less support.",
            ],
            chart: { ex: "ktb_flat", from: "2026-01-12", to: "2026-02-12", mas: [] },
          },
          {
            type: "tap",
            q: "Tap the day with the most volume.",
            chart: { ex: "ktb_flat", from: "2026-01-12", to: "2026-02-12", mas: [] },
            mode: "candle",
            target: { from: "2026-01-22", to: "2026-01-22" },
            explain: "22 Jan 2026, with 132.7 million shares. It came the day after the drop to ฿27.50: buyers arrived in size and pushed KTB back up.",
          },
          {
            type: "mcq",
            q: "On 9 Feb 2026 KTB closed above ฿29.25 for the first time in a month, on 120.8 million shares. A normal day was 30 to 60 million. What does the volume suggest?",
            chart: { ex: "ktb_flat", from: "2026-01-12", to: "2026-02-12", mas: [], marks: [{ date: "2026-02-09", label: "9 Feb", at: "high", tone: "pivot" }] },
            options: [
              "Large buyers took part in the move",
              "Few people cared about the move",
              "The price will certainly double",
            ],
            answer: 0,
            explain: "Two to four times normal volume on the day price escapes a range is what institutional buying looks like. It is evidence, not a promise. KTB went on to reach ฿35.50 by 26 Feb.",
          },
        ],
      },
      {
        id: "trend",
        title: "Up, down, sideways",
        steps: [
          {
            type: "read",
            title: "Three states",
            body: [
              "An uptrend makes higher highs and higher lows. A downtrend makes lower highs and lower lows. Sideways means price bounces inside a range and gets nowhere.",
              "KTB spent May to July 2025 going sideways between about ฿21 and ฿23, mostly below its 50-day average. Then something changed.",
            ],
            chart: { ex: "ktb_trend", from: "2025-05-01", to: "2026-01-30", mas: [50] },
          },
          {
            type: "tap",
            q: "Tap a candle from the week KTB's uptrend began.",
            chart: { ex: "ktb_trend", from: "2025-05-01", to: "2026-01-30", mas: [50] },
            mode: "candle",
            target: { from: "2025-07-31", to: "2025-08-08" },
            explain: "Early August 2025. KTB pushed above ฿22.30 on 5 Aug, and on 6 Aug traded 128.8 million shares, about twice a normal day. It never went back to ฿21.",
          },
          {
            type: "mcq",
            q: "Which is the clearest sign of an uptrend?",
            options: ["Higher highs and higher lows", "One big green candle", "A low share price"],
            answer: 0,
            explain: "One candle is one day. A trend is a pattern across many days.",
          },
        ],
      },
      {
        id: "markets",
        title: "Thai stocks and US stocks",
        steps: [
          {
            type: "read",
            title: "Two markets, two clocks",
            body: [
              "Thai stocks trade on the Stock Exchange of Thailand (SET), priced in baht. There is a morning session from 10:00 to 12:30 and an afternoon session from 14:00 to 16:30, Bangkok time.",
              "US stocks trade on the NYSE and Nasdaq from 9:30 to 16:00 New York time. From Bangkok that is 21:30 to 04:00 in the northern winter and 20:30 to 03:00 in summer.",
            ],
          },
          {
            type: "read",
            title: "Board lots and price steps",
            body: [
              "On the SET main board you buy in board lots of 100 shares, or 50 for stocks priced at ฿500 or more for six months straight. Smaller orders go to a separate odd-lot board with fewer buyers and sellers.",
              "Thai prices also move in fixed steps that depend on the price. KTB near ฿30 moves in ฿0.25 steps. KBANK near ฿230 moves in ฿1 steps. US stocks move in cents, and many US brokers sell fractions of a share.",
            ],
          },
          {
            type: "mcq",
            q: "You can afford 70 shares of AOT. Where can that order trade?",
            options: [
              "Only on the odd-lot board, because the main board trades in lots of 100",
              "On the main board like any other order",
              "Nowhere: the minimum is 1,000 shares",
            ],
            answer: 0,
            explain: "70 is less than one board lot, so it goes to the odd-lot board.",
          },
          {
            type: "mcq",
            q: "It is 22:00 in Bangkok on a weekday in January. Is the US market open?",
            options: ["Yes, it opened at 21:30 Bangkok time", "No, it opens at 9:30 Bangkok time", "No, US markets close for January"],
            answer: 0,
            explain: "In January New York is 12 hours behind Bangkok, so 9:30 there is 21:30 here.",
          },
        ],
      },
    ],
  },
  {
    id: "ma",
    title: "Moving averages",
    blurb: "The lines that show the trend without the noise.",
    lessons: [
      {
        id: "ma-basics",
        title: "What a moving average is",
        steps: [
          {
            type: "read",
            title: "An average that moves",
            body: [
              "A 10-day moving average is the average close of the last 10 days. Each new day, the oldest close drops out and the newest goes in, so the line follows price but smoother.",
              "Ariel uses simple moving averages. The 10-day shows the short-term trend, the 20-day the swing trend, and the 50-day the bigger picture.",
            ],
            chart: { ex: "kgc_flat", from: "2025-04-15", to: "2025-08-29" },
          },
          {
            type: "calc",
            q: "KBANK closed at ฿244, ฿251, ฿252, ฿250 and ฿253 on five days in September 2026. What is the 5-day average?",
            answer: 250,
            tolerance: 0.01,
            unit: "฿",
            explain: "Add them: 244 + 251 + 252 + 250 + 253 = 1,250. Divide by 5: ฿250.",
          },
          {
            type: "mcq",
            q: "Why do traders draw moving averages?",
            options: [
              "To see the trend without the day-to-day noise",
              "To predict tomorrow's exact price",
              "Because the exchange requires them",
            ],
            answer: 0,
            explain: "An average smooths out noise. It describes the trend; it doesn't forecast a price.",
          },
        ],
      },
      {
        id: "ma-stack",
        title: "Reading the averages together",
        video: "finviz",
        steps: [
          {
            type: "read",
            title: "Stacked means healthy",
            body: [
              "When price is above the 10-day, the 10-day is above the 20-day, and the 20-day is above the 50-day, every timeframe agrees the stock is rising.",
              "Ariel's scans keep stocks whose 20-day average is above their 50-day. It's a quick filter for stocks already in uptrends.",
            ],
            chart: { ex: "kgc_flat", from: "2025-04-15", to: "2025-08-08" },
          },
          {
            type: "mcq",
            q: "On 4 Aug 2025 KGC closed at $17.26. Its 10-day average was $16.11, the 20-day $15.79 and the 50-day $15.51. How would you describe it?",
            options: [
              "Fully stacked: price above the 10, above the 20, above the 50",
              "A downtrend, because the averages are below price",
              "Impossible to tell without the news",
            ],
            answer: 0,
            explain: "Each line sits above the slower one, and price sits above all of them.",
          },
          {
            type: "mcq",
            q: "Here is Rocket Lab (RKLB) in August 2026. The 50-day is falling and price is under it. Is this what Ariel's long setups look for?",
            chart: { ex: "rklb_reject", from: "2026-05-15", to: "2026-08-14" },
            options: [
              "No. Price is under a falling 50-day average",
              "Yes. It bounced, so it must be strong",
              "Yes. Any stock above its 10-day is a buy",
            ],
            answer: 0,
            explain: "A bounce under a falling 50-day is still a downtrend on the bigger timeframe. You'll meet RKLB again in the lesson on MA rejections.",
          },
        ],
      },
    ],
  },
  {
    id: "context",
    title: "Market and groups",
    blurb: "Trade with the tide: check the market, then find the leading groups.",
    lessons: [
      {
        id: "market-first",
        title: "Check the market first",
        steps: [
          {
            type: "read",
            title: "Most stocks follow the market",
            body: [
              "When the market falls, good-looking setups fail more often. So Ariel starts with the market's trend, and trades more when it is healthy and less when it isn't. He builds exposure step by step as trades start to work.",
              "For US stocks traders watch the S&P 500 and the Nasdaq 100, which the fund QQQ tracks. For Thai stocks there is the SET index and the SET50. In this course TDEX, a fund that tracks the SET50, stands in for the Thai market.",
            ],
          },
          {
            type: "mcq",
            q: "The index is under its falling 50-day average, and most breakouts this month have failed. What does a rules-based trader do?",
            options: [
              "Trade smaller, or sit out until the market improves",
              "Trade bigger to win back the losses",
              "Ignore the market, because only the stock matters",
            ],
            answer: 0,
            explain: "Failing breakouts are information about the market. Cutting size keeps you in the game until conditions improve.",
          },
        ],
      },
      {
        id: "groups",
        title: "Strong stocks move in groups",
        video: "groups",
        steps: [
          {
            type: "read",
            title: "Birds of a feather",
            body: [
              "A stock rarely moves alone. When money flows into an industry, most stocks in it rise together. Ariel cites research that roughly half of a stock's price gain is tied to its group, so he finds the leading groups first and the best stocks inside them second.",
              "In 2025, gold miners were a leading group. Each line starts at 100 on 2 Jan 2025.",
            ],
            group: "gold_miners",
          },
          {
            type: "mcq",
            q: "These are Thai stocks from Jan 2025 to Jun 2026, each starting at 100. TDEX tracks the SET50. Which group led?",
            group: "thai_banks",
            options: [
              "Banks: KTB, KBANK and BBL all beat the SET50",
              "Convenience retail: CPALL",
              "Nothing beat the SET50",
            ],
            answer: 0,
            explain: "KTB gained 81%, KBANK 41% and BBL 18%, against 16% for the SET50 fund. CPALL fell 16%. KTB was the leader inside the leading group.",
          },
          {
            type: "mcq",
            q: "Two stocks break out of flat bases on the same day. One is a gold miner while gold miners lead the market. The other is in a group that keeps falling. Which do you prefer?",
            options: ["The gold miner, because its group is leading", "The other one, because it is cheaper", "Either: groups don't matter"],
            answer: 0,
            explain: "Same setup, different tide. The stock with its group behind it has more buyers on its side.",
          },
        ],
      },
      {
        id: "universe",
        title: "Build a universe list",
        video: "universe",
        steps: [
          {
            type: "read",
            title: "Watch fewer stocks, better",
            body: [
              "Instead of looking at thousands of charts each night, Ariel keeps a universe list: the strongest names from the strongest groups. His scans filter for growing earnings and sales and a 20-day average above the 50-day.",
              "The Thai market is smaller, so you can build this by hand. Start from the SET50, keep the stocks whose 20-day sits above their 50-day, and favour the ones whose group is beating the SET50.",
            ],
          },
          {
            type: "mcq",
            q: "What belongs on a universe list?",
            options: [
              "Strong stocks from leading groups, with growing earnings",
              "Every stock under ฿10, because they are cheap",
              "The stocks that fell the most this month",
            ],
            answer: 0,
            explain: "A low price doesn't make a stock strong, and big fallers are usually in downtrends.",
          },
          {
            type: "mcq",
            q: "Why keep a short list?",
            options: [
              "You can study each chart properly and act quickly when a setup appears",
              "A short list guarantees profits",
              "Brokers limit how many stocks you can follow",
            ],
            answer: 0,
            explain: "Attention is limited. A short list means you are ready before the move.",
          },
        ],
      },
    ],
  },
  {
    id: "digest",
    title: "The digest",
    blurb: "Why strong stocks pause, and why the pause matters.",
    lessons: [
      {
        id: "digest",
        title: "Up, sideways, up",
        video: "digest",
        steps: [
          {
            type: "read",
            title: "Strong stocks rest",
            body: [
              "Leaders don't go straight up. After a run they move sideways while early buyers take profits and new buyers take their place. Ariel calls this digesting. The pattern is up, sideways, up.",
              "Delta Electronics (DELTA) doubled from its April 2025 low, rested for two months, then ran again.",
            ],
            chart: { ex: "delta_digest", from: "2025-03-03", to: "2025-11-28" },
          },
          {
            type: "tap",
            q: "Tap a candle inside DELTA's sideways digest after its first big run.",
            chart: { ex: "delta_digest", from: "2025-03-03", to: "2025-11-28" },
            mode: "candle",
            target: { from: "2025-05-13", to: "2025-07-11" },
            explain: "From mid-May to mid-July 2025 DELTA stayed roughly between ฿91 and ฿116 while the 50-day average caught up. On 17 July it broke out and closed at ฿132.50.",
          },
          {
            type: "mcq",
            q: "During a healthy digest, what should the 50-day average do?",
            options: ["Keep rising or flatten out, with price holding near it", "Fall sharply", "It doesn't matter"],
            answer: 0,
            explain: "A rising 50-day under a sideways stock means the trend is intact while price rests.",
          },
          {
            type: "mcq",
            q: "Why is the end of a digest a good place to look for entries?",
            options: [
              "The range gives a clear level to buy above and a nearby level where you're wrong",
              "Prices are always lowest at the end of a digest",
              "Volume is always highest during a digest",
            ],
            answer: 0,
            explain: "A tight range means a short distance between entry and stop. That is what makes the risk small.",
          },
        ],
      },
    ],
  },
  {
    id: "setups",
    title: "Daily setups",
    blurb: "Flat bases, undercuts and rejections, on real US and Thai charts.",
    lessons: [
      {
        id: "flat-us",
        title: "Flat base breakout: KGC",
        video: "flatBase",
        steps: [
          {
            type: "read",
            title: "The flat base",
            body: [
              "A flat base is a tight sideways range, often a few weeks long, where the highs line up near one price. That price is the pivot. A move above the pivot, ideally on rising volume, says the digest is over.",
              "Ariel names the flat base as his favourite setup. Here is Kinross Gold (KGC) in the summer of 2025, while gold miners led the market.",
            ],
            chart: { ...kgcBase, to: "2025-08-01" },
          },
          {
            type: "tap",
            q: "Tap the pivot: the price KGC kept failing to get above in late July 2025.",
            chart: { ...kgcBase, to: "2025-08-01" },
            mode: "price",
            target: { lo: 16.35, hi: 16.7 },
            explain: "About $16.50. KGC hit $16.52 on 22 July and $16.47 on 1 August and was pushed back both times.",
          },
          {
            type: "mcq",
            q: "On 4 Aug 2025 KGC closed at $17.26, above the $16.52 pivot, with all three averages rising under it. What is the plan?",
            chart: {
              ...kgcBase,
              reveal: { upto: "2025-08-04" },
              lines: [{ price: 16.52, label: "Pivot", tone: "pivot" }],
            },
            options: [
              "Buy, with a stop just under the day's low of $16.35",
              "Wait for it to fall back to $15",
              "Buy with no stop, because it's a strong stock",
            ],
            answer: 0,
            explain: "The setup gives both the entry and the exit. Over the next three weeks KGC reached $19.82, about 15% above the breakout close, while the stop sat about 5% below.",
          },
        ],
      },
      {
        id: "flat-thai",
        title: "Flat bases in Thailand: AOT and KTB",
        video: "flatBase",
        steps: [
          {
            type: "read",
            title: "Airports of Thailand, autumn 2025",
            body: [
              "From mid-October to late November 2025 AOT moved between about ฿39 and ฿42.75. The highs inside that range kept stopping near ฿42.75, which made it the pivot.",
            ],
            chart: { ex: "aot_flat", from: "2025-10-10", to: "2025-11-24", lines: [{ price: 42.75, label: "Pivot", tone: "pivot" }] },
          },
          {
            type: "mcq",
            q: "On 25 Nov 2025 AOT closed at ฿43.75, above the ฿42.75 pivot, on 84 million shares, its heaviest volume since at least September. Do you take it?",
            chart: {
              ex: "aot_flat",
              from: "2025-10-10",
              to: "2025-12-31",
              reveal: { upto: "2025-11-25" },
              lines: [{ price: 42.75, label: "Pivot", tone: "pivot" }],
            },
            options: [
              "Yes: pivot cleared on heavy volume, stop under the day's low of ฿41.75",
              "No: Thai stocks don't break out",
              "Yes, and put half the account into it",
            ],
            answer: 0,
            explain: "AOT reached ฿55.75 on 8 Dec, 27% above the breakout close. Even good setups get normal-sized positions; sizing comes in the risk unit.",
          },
          {
            type: "tap",
            q: "Here is KTB from late 2025 into 2026. Tap the day it broke out of its flat base.",
            chart: { ex: "ktb_flat", from: "2025-11-15", to: "2026-03-13" },
            mode: "candle",
            target: { from: "2026-02-09", to: "2026-02-09" },
            explain: "9 Feb 2026. After a month stuck under ฿29.25, KTB closed at ฿30.25 on 120.8 million shares.",
          },
          {
            type: "calc",
            q: "KTB closed at ฿30.25 on the breakout day. The day's low was ฿29.00. If you buy at the close with a stop at the low, how much do you risk per share?",
            answer: 1.25,
            tolerance: 0.001,
            unit: "฿",
            explain: "฿30.25 − ฿29.00 = ฿1.25 per share. That distance is the risk you size the position from.",
          },
        ],
      },
      {
        id: "unr",
        title: "Undercut and rally",
        video: "unr",
        steps: [
          {
            type: "read",
            title: "The shakeout",
            body: [
              "Sometimes a stock dips below an obvious low, sets off the stop orders sitting just under it, then climbs back above. Ariel calls this an undercut and rally.",
              "The sellers who were shaken out are gone, and the reclaim gives a tight place to be wrong: the low of the undercut. Here is Kasikornbank (KBANK) in October 2026.",
            ],
            chart: {
              ex: "kbank_unr",
              from: "2026-09-01",
              to: "2026-11-20",
              lines: [{ price: 230, label: "Prior low", tone: "pivot" }],
              marks: [{ date: "2026-10-09", label: "Undercut", at: "low", tone: "stop" }],
            },
          },
          {
            type: "tap",
            q: "Tap the undercut: the day KBANK broke below its ฿230 low of 8 October.",
            chart: { ex: "kbank_unr", from: "2026-09-01", to: "2026-10-20", lines: [{ price: 230, label: "Prior low", tone: "pivot" }] },
            mode: "candle",
            target: { from: "2026-10-09", to: "2026-10-09" },
            explain: "9 Oct 2026. KBANK fell to ฿226, then closed back above ฿230 on the next trading day. By 28 Oct it reached ฿252.",
          },
          {
            type: "mcq",
            q: "Dell (DELL) undercut its 24 Aug low of $424.00 on 1 Sept 2026, touching $421.89, and closed at $425.00. If you buy the reclaim, where does the stop go?",
            chart: {
              ex: "dell_unr",
              from: "2026-06-15",
              to: "2026-09-30",
              reveal: { upto: "2026-09-01" },
              lines: [{ price: 424, label: "24 Aug low", tone: "pivot" }],
            },
            options: ["Just under $421.89, the undercut low", "At $300, far away to be safe", "No stop: undercuts always work"],
            answer: 0,
            explain: "If price goes back under the undercut low, the idea is wrong. The next day DELL opened at $462 and closed at $492.20. By 18 Sept it hit $595.51.",
          },
          {
            type: "mcq",
            q: "What makes an undercut and rally valid?",
            options: [
              "Price reclaims the old low quickly, within a day or two",
              "Price stays under the low for weeks",
              "The company pays a dividend",
            ],
            answer: 0,
            explain: "The speed of the reclaim is the point. Weeks below the low is a breakdown, not a shakeout.",
          },
        ],
      },
      {
        id: "munr",
        title: "Moving-average undercut and rally",
        video: "unr",
        steps: [
          {
            type: "read",
            title: "Same idea, different line",
            body: [
              "The undercut works with moving averages too. A strong stock dips under its 20-day or 50-day average during the day and closes back above it. Ariel calls this an MA undercut and rally.",
              "AMD in September 2026: the 20-day had flattened out and the 50-day was still drifting lower, which made the trade less clean than the textbook version.",
            ],
            chart: { ex: "amd_munr", from: "2026-07-01", to: "2026-09-14", marks: [{ date: "2026-09-14", label: "Undercut 20-day", at: "low", tone: "stop" }] },
          },
          {
            type: "mcq",
            q: "On 14 Sept AMD fell to $480.33, under its 20-day average of $480.99, and closed at $493.41. You plan to buy if it trades above today's high of $498.39 tomorrow. Where's the stop?",
            chart: {
              ex: "amd_munr",
              from: "2026-07-01",
              to: "2026-10-09",
              reveal: { upto: "2026-09-14" },
              lines: [
                { price: 498.39, label: "Entry trigger", tone: "pivot", after: true },
                { price: 480.33, label: "Stop", tone: "stop", after: true },
              ],
            },
            options: ["$480.33, the low of the undercut day", "$400, a round number", "At the 200-day average"],
            answer: 0,
            explain: "On 15 Sept AMD traded up to $513.67 and triggered the entry. Within three weeks it reached $645.46, about 30% above the entry, against risk of about $18 a share.",
          },
        ],
      },
      {
        id: "rejection",
        title: "MA rejection: when not to buy",
        video: "maReject",
        steps: [
          {
            type: "read",
            title: "A falling ceiling",
            body: [
              "A falling 50-day average often acts like a ceiling. When a weak stock rallies into it and gets pushed back, Ariel calls it an MA rejection. Short sellers use it to bet on a fall.",
              "For a beginner who only buys, its main use is a warning sign.",
            ],
            chart: { ex: "rklb_reject", from: "2026-05-15", to: "2026-08-17", marks: [{ date: "2026-08-17", label: "Rejected", at: "high", tone: "stop" }] },
          },
          {
            type: "mcq",
            q: "17 Aug 2026: RKLB poked up to $85.55, above its falling 50-day of $84.78, then closed back below at $82.08. Buy?",
            chart: { ex: "rklb_reject", from: "2026-05-15", to: "2026-09-15", reveal: { upto: "2026-08-17" } },
            options: ["No: it was rejected at a falling 50-day", "Yes: touching the 50-day shows strength", "Yes, and buy twice as much"],
            answer: 0,
            explain: "Twelve trading days later RKLB traded at $61.45, 25% below the 17 Aug close.",
          },
          {
            type: "tap",
            q: "AOT in spring 2025. Tap the day it was rejected at its falling 50-day average.",
            chart: { ex: "aot_reject", from: "2025-02-01", to: "2025-06-30" },
            mode: "candle",
            target: { from: "2025-05-02", to: "2025-05-02" },
            explain: "2 May 2025. AOT opened at ฿41, spiked to ฿42.75 above the 50-day (฿39.65), and closed at ฿38.50. By 27 May it traded at ฿33.",
          },
        ],
      },
    ],
  },
  {
    id: "entries",
    title: "Setup vs entry",
    blurb: "The daily chart picks the stock. The entry tactic picks the moment.",
    lessons: [
      {
        id: "setup-vs-entry",
        title: "Two separate decisions",
        video: "setupVsEntry",
        steps: [
          {
            type: "read",
            title: "What, then when",
            body: [
              "Ariel separates two decisions. The daily setup tells you which stock and roughly where: a flat base, an undercut and rally. The entry tactic tells you the exact moment to buy, usually on a shorter chart during the day.",
            ],
          },
          {
            type: "read",
            title: "Common entry tactics",
            body: [
              "Prior-day high: buy when price trades above yesterday's high.",
              "Opening range: buy when price breaks the high of the first 5 minutes.",
              "VWAP reclaim: buy when price climbs back above VWAP, the day's average price weighted by volume.",
              "The 6/20 setup, which Ariel credits to Gil Morales, is another intraday tactic. He only uses it when the daily chart already has a setup.",
            ],
            video: "sixTwenty",
          },
          {
            type: "mcq",
            q: "KBANK undercut its low and reclaimed it. You plan to buy if it trades above yesterday's high. Which part is the setup?",
            options: [
              "The undercut and reclaim is the setup; buying above yesterday's high is the entry tactic",
              "Both are entry tactics",
              "Both are setups",
            ],
            answer: 0,
            explain: "The daily pattern is the setup. The trigger that gets you in is the tactic.",
          },
          {
            type: "mcq",
            q: "You see a clean 5-minute opening range breakout, but the daily chart is under a falling 50-day with no setup. What does Ariel's approach say?",
            options: [
              "Skip it: the entry tactic only counts when the daily chart has a setup",
              "Buy it: an intraday signal is enough",
              "Buy it with extra size",
            ],
            answer: 0,
            explain: "Tactics time a good idea. They can't turn a bad daily chart into one.",
          },
        ],
      },
    ],
  },
  {
    id: "risk",
    title: "Risk and position size",
    blurb: "Decide where you're wrong first. Then work out how many shares.",
    lessons: [
      {
        id: "stops",
        title: "Every trade has an exit before it starts",
        video: "sizing",
        steps: [
          {
            type: "read",
            title: "Risk per share is 1R",
            body: [
              "Before you buy, decide where you are wrong. Ariel usually puts the stop at the low of the entry day or the prior day's low.",
              "The distance from entry to stop is your risk per share. Traders call it 1R and measure results in it: a trade that gains three times its risk made 3R.",
            ],
          },
          {
            type: "tap",
            q: "You buy KBANK at ฿231 on 12 Oct 2026 as it reclaims ฿230. Tap where your stop goes.",
            chart: { ex: "kbank_unr", from: "2026-09-15", to: "2026-10-12", lines: [{ price: 230, label: "Prior low", tone: "pivot" }] },
            mode: "price",
            target: { lo: 223.5, hi: 226.5 },
            explain: "Just under ฿226, the low of the undercut on 9 Oct. With KBANK moving in ฿1 steps, ฿225 is a common choice.",
          },
          {
            type: "calc",
            q: "Entry ฿231, stop ฿225. What is your risk per share?",
            answer: 6,
            tolerance: 0.001,
            unit: "฿",
            explain: "฿231 − ฿225 = ฿6 per share. That is 1R for this trade.",
          },
          {
            type: "calc",
            q: "AMD trade: entry $498.39, stop $480.33. It later reached $645.46. How many R was that move? Round to one decimal.",
            answer: 8.1,
            tolerance: 0.11,
            unit: "R",
            explain: "Risk is $498.39 − $480.33 = $18.06. Gain is $645.46 − $498.39 = $147.07. $147.07 ÷ $18.06 = 8.1R.",
          },
        ],
      },
      {
        id: "sizing",
        title: "How many shares",
        video: "sizing",
        steps: [
          {
            type: "read",
            title: "Size comes from risk",
            body: [
              "Ariel's rule is to never lose more than 1% of the account on one position, and he often risks only 0.5%.",
              "Shares = (account × risk %) ÷ risk per share. Then check the position isn't too big. Ariel's positions are usually around 5% to 15% of the account.",
            ],
          },
          {
            type: "calc",
            q: "Account $10,000, risking 0.5% per trade. KGC entry $17.26, stop $16.35. How many shares?",
            answer: 54,
            tolerance: 0,
            unit: "shares",
            explain: "0.5% of $10,000 is $50. Risk per share is $0.91. $50 ÷ $0.91 = 54.9, so 54 shares. That position is $932, about 9% of the account.",
          },
          {
            type: "calc",
            q: "Account ฿100,000, risking 0.5%. AOT entry ฿43.75, stop ฿41.75, and you buy in board lots of 100. How many shares?",
            answer: 200,
            tolerance: 0,
            unit: "shares",
            explain: "0.5% is ฿500. Risk per share is ฿2.00, so 250 shares at most. Round down to whole lots: 200 shares, a ฿8,750 position risking ฿400.",
          },
          {
            type: "mcq",
            q: "Why round down to 200 and not up to 300?",
            options: ["300 shares would risk ฿600, more than your ฿500 limit", "Brokers charge less for round numbers", "It makes no difference"],
            answer: 0,
            explain: "The risk limit wins. Rounding up breaks the rule you set before the trade.",
          },
        ],
      },
      {
        id: "expectancy",
        title: "Losing often, still profitable",
        video: "predictive",
        steps: [
          {
            type: "read",
            title: "Expectancy",
            body: [
              "Ariel is open about how many of his trades lose. The profits come from the shape of the results: losers are cut at about 1R while winners are given room to run.",
              "Expectancy = (win rate × average win) − (loss rate × average loss). It's the average result per trade, in R.",
            ],
          },
          {
            type: "calc",
            q: "You win 40% of trades. Average win is 2.5R, average loss is 1R. What's the expectancy per trade, in R?",
            answer: 0.4,
            tolerance: 0.001,
            unit: "R",
            explain: "0.40 × 2.5 = 1.0. 0.60 × 1 = 0.6. 1.0 − 0.6 = +0.4R per trade. Losing 6 trades in 10 still makes money.",
          },
          {
            type: "mcq",
            q: "Another trader wins 70% of trades, but the average win is 0.5R and the average loss is 2R. What's the expectancy?",
            options: ["−0.25R: a losing system despite winning often", "+0.35R", "+1.5R"],
            answer: 0,
            explain: "0.70 × 0.5 = 0.35. 0.30 × 2 = 0.60. 0.35 − 0.60 = −0.25R. Winning often means little if the losses are big.",
          },
        ],
      },
    ],
  },
  {
    id: "rules",
    title: "Rules under pressure",
    blurb: "Failed breakouts, selling into strength, and why setups don't predict.",
    lessons: [
      {
        id: "failed",
        title: "When a breakout fails",
        video: "bigLosses",
        steps: [
          {
            type: "read",
            title: "KTB, September 2026",
            body: [
              "Not every breakout works. KTB broke above ฿44.75 on 17 Sept 2026 and closed at ฿45.00. With a stop at the day's low of ฿44.25, the risk was ฿0.75 a share.",
            ],
            chart: {
              ex: "ktb_fail",
              from: "2026-07-15",
              to: "2026-09-21",
              lines: [
                { price: 44.75, label: "Pivot", tone: "pivot" },
                { price: 44.25, label: "Stop", tone: "stop" },
              ],
            },
          },
          {
            type: "mcq",
            q: "28 Sept: KTB trades down to ฿43.50, through your ฿44.25 stop. What do you do?",
            chart: {
              ex: "ktb_fail",
              from: "2026-07-15",
              to: "2026-10-30",
              reveal: { upto: "2026-09-28" },
              lines: [
                { price: 44.75, label: "Pivot", tone: "pivot" },
                { price: 44.25, label: "Stop", tone: "stop" },
              ],
            },
            options: ["Sell: the stop is the plan", "Hold: it will come back", "Buy more to lower the average price"],
            answer: 0,
            explain: "Two days later KTB fell to ฿40.75 on 244.5 million shares. Selling near the stop cost about ฿1 a share. Holding would have cost over ฿4.",
          },
          {
            type: "mcq",
            q: "What usually turns a small loss into a huge one?",
            options: ["Moving or ignoring the stop", "Using a stop", "Taking some profit early"],
            answer: 0,
            explain: "A stop only protects you if you follow it. Ariel's rule about avoiding huge losses comes down to this.",
          },
        ],
      },
      {
        id: "selling",
        title: "Selling into strength",
        video: "predictive",
        steps: [
          {
            type: "read",
            title: "Pay yourself",
            body: [
              "Ariel trims part of a position into strength, often around the third to fifth day of a move. That locks in some gain and lets the rest ride with its stop.",
              "Setups have no predictive power on their own. What they give you is a defined place to buy and a defined place to be wrong. Selling rules handle the rest.",
            ],
          },
          {
            type: "mcq",
            q: "KGC broke out on 4 Aug 2025 at $17.26 with $0.91 of risk. Three days later it traded at $19.05, about 2R up. What does a trim-into-strength rule say?",
            chart: { ...kgcBase, to: "2025-08-07", lines: [{ price: 16.52, label: "Pivot", tone: "pivot" }] },
            options: [
              "Sell part of the position and keep the rest with a stop",
              "Sell everything and never buy KGC again",
              "Put the rest of your cash into KGC",
            ],
            answer: 0,
            explain: "Trimming turns a paper gain into a real one, and the remaining shares can still catch the bigger move.",
          },
          {
            type: "mcq",
            q: "If setups don't predict the future, why use them?",
            options: [
              "They give a defined entry and a defined point where you're wrong",
              "They do predict the future",
              "They remove all risk",
            ],
            answer: 0,
            explain: "Defined risk plus letting winners run is what makes the expectancy positive.",
          },
        ],
      },
    ],
  },
  {
    id: "review",
    title: "Trade review",
    blurb: "Mixed real charts. Name the setup, size it, decide.",
    lessons: [
      {
        id: "review-game",
        title: "Mixed chart review",
        steps: [
          {
            type: "mcq",
            q: "DELTA after a two-month digest between about ฿91 and ฿116. On 17 July 2025 it ran 16% and closed at ฿132.50. A stop at the day's low (฿115.50) is ฿17 away. What do you do?",
            chart: { ex: "delta_digest", from: "2025-04-20", to: "2025-10-31", reveal: { upto: "2025-07-17" } },
            options: [
              "Buy much smaller, or wait for a tighter entry later",
              "Buy full size anyway",
              "Skip the stop because the day is so strong",
            ],
            answer: 0,
            explain: "A wide stop means few shares. DELTA did keep going, to ฿232 on 28 Oct, but the size has to match the risk.",
          },
          {
            type: "mcq",
            q: "Account ฿200,000, risking 0.5% (฿1,000). DELTA entry ฿132.50, stop ฿115.50. How many board lots can you buy?",
            options: ["None: even 100 shares would risk ฿1,700", "1 lot", "5 lots"],
            answer: 0,
            explain: "Risk per share is ฿17. ฿1,000 ÷ ฿17 = 58 shares, less than one lot. The rule says pass, or wait for a setup with a tighter stop.",
          },
          {
            type: "mcq",
            q: "Name this setup. KBANK, 12 Oct 2026.",
            chart: { ex: "kbank_unr", from: "2026-09-01", to: "2026-11-20", reveal: { upto: "2026-10-12" } },
            options: ["Undercut and rally", "Flat base breakout", "MA rejection"],
            answer: 0,
            explain: "It broke the ฿230 low, then reclaimed it. KBANK reached ฿252 on 28 Oct, 9% above the ฿231 close.",
          },
          {
            type: "mcq",
            q: "Name what you see. AOT, 2 May 2025.",
            chart: { ex: "aot_reject", from: "2025-02-01", to: "2025-06-30", reveal: { upto: "2025-05-02" } },
            options: ["MA rejection: don't buy", "Flat base breakout: buy", "Undercut and rally: buy"],
            answer: 0,
            explain: "A spike above a falling 50-day that closed back under it. AOT fell to ฿33 by 27 May.",
          },
          {
            type: "mcq",
            q: "KTB went sideways between about ฿21 and ฿23 from May to July 2025. On 6 Aug it closed at ฿23.00, at the top of the range, on about twice its normal volume. What is this?",
            chart: { ex: "ktb_trend", from: "2025-05-01", to: "2025-10-31", reveal: { upto: "2025-08-06" } },
            options: ["A breakout from a sideways range", "An MA rejection", "A failed breakout"],
            answer: 0,
            explain: "By 3 Sept KTB closed at ฿25.25. A year later it traded above ฿44.",
          },
        ],
      },
    ],
  },
];

export const LESSONS = UNITS.flatMap((u) => u.lessons.map((l) => ({ ...l, unit: u })));

export function findStep(cardId) {
  const [lessonId, idx] = cardId.split(":");
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const step = lesson?.steps[Number(idx)];
  return step ? { lesson, step } : null;
}

export const QUESTION_TYPES = new Set(["mcq", "tap", "calc"]);
