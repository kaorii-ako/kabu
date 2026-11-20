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
  sevenSteps: { id: "-dv_2h61a2o", title: "The 7 Steps to a Profitable Trading System (TraderLion interview)" },
};

export const videoUrl = (v) => `https://www.youtube.com/watch?v=${v.id}`;

const kgcBase = { ex: "kgc_flat", from: "2025-06-02", to: "2025-08-29" };

export const UNITS = [
  {
    id: "playbook",
    title: "Ariel's playbook",
    blurb: "How he thinks before he looks at a single chart.",
    lessons: [
      {
        id: "playbook",
        title: "Ariel's process in one lesson",
        video: "sevenSteps",
        steps: [
          {
            type: "read",
            title: "Who you're learning from",
            body: [
              "Ariel Hernandez is a professional swing trader. He trades US stocks, usually holding for days to weeks, runs a trading room, and explains his trades on his YouTube channel and in interviews.",
              "His method isn't one magic signal. It's a set of pieces that fit together, and this course takes them in his order.",
            ],
          },
          {
            type: "read",
            title: "The pieces, in order",
            body: [
              "1. Read the market. Is it healthy, choppy or falling? That decides how much he trades and which setups he looks for.",
              "2. Find the leading groups, then the strongest stocks inside them.",
              "3. Read the daily chart for a clean setup: a flat base, an undercut and rally, a pullback into a rising average.",
              "4. Pick an entry tactic on a short chart, so the stop can be tight.",
              "5. Size the position from the stop, so a loss is small and known before he buys.",
              "6. Manage the trade: trim into strength, let the rest work, follow the sell rules.",
              "7. Add exposure step by step when trades start working, and pull back when they don't.",
            ],
          },
          {
            type: "read",
            title: "He's wrong most of the time",
            body: [
              "In his TraderLion interview Ariel says his own stats show him right on about 35 to 37% of trades. He still makes money because losers are cut fast and winners are left to work.",
              "So this course won't teach you to predict. It teaches you to find trades where being wrong is cheap and being right can pay a lot.",
            ],
          },
          {
            type: "mcq",
            q: "What does Ariel look at first, before any single chart?",
            options: ["How the market is acting", "Which stock has the cheapest price", "Yesterday's news headlines"],
            answer: 0,
            explain: "The market sets the environment. The same chart can be a buy in a healthy market and a trap in a weak one.",
          },
          {
            type: "mcq",
            q: "Ariel is right on roughly 35 to 37% of his trades. How can that make money?",
            options: [
              "His losses are small and quick; his winners are much bigger",
              "He only trades on days he feels confident",
              "It can't: you need to be right more than half the time",
            ],
            answer: 0,
            explain: "Cut losers small, let winners run. The size of wins versus losses matters more than how often you win.",
          },
        ],
      },
      {
        id: "predict",
        title: "Setups don't predict. Context helps.",
        video: "predictive",
        steps: [
          {
            type: "read",
            title: "What a setup is for",
            body: [
              "In his video on predictive ability, Ariel says a chart pattern on its own doesn't tell you a stock will go up. A perfect-looking breakout can fail.",
              "What a setup does give you is a clear level where you are wrong. That lets you keep the loss small when it fails.",
            ],
          },
          {
            type: "read",
            title: "Stacking the deck",
            body: [
              "What makes a setup more likely to work is context. Is the market healthy? Is the stock's group one of the leaders? Are other stocks in the group setting up and breaking out at the same time?",
              "If several banks or several chip stocks all break out together while the market is strong, that's where money is going. If the group is rolling over, the same pattern is more likely to fail.",
            ],
          },
          {
            type: "mcq",
            q: "Three gold miners have flat bases. Two broke out yesterday, gold is rising and the market is healthy. The third is breaking out today. Compared with a lone breakout in a weak group, this one is:",
            options: ["More likely to work, because its group and market agree", "Guaranteed to work", "Less likely to work, because it's late"],
            answer: 0,
            explain: "Never guaranteed, but the context is on your side. That's the closest thing to an edge a setup gets.",
          },
          {
            type: "mcq",
            q: "What is the main job of a setup, in Ariel's view?",
            options: ["To give you a defined level where you know you're wrong", "To predict the next move", "To find the cheapest stock"],
            answer: 0,
            explain: "Defined risk is the point. The context decides how likely it is to work.",
          },
        ],
      },
    ],
  },
  {
    id: "basics",
    title: "Chart basics, his way",
    blurb: "Candles, volume, moving averages and ATR: the tools he actually uses.",
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
              "Asked whether he checks volume when a stock moves through a buy point, Ariel says the first question is how its own market is acting. For a gold miner he looks at gold, the gold miners ETF and other gold stocks. Volume is a useful extra: a heavy day means you are not the only one buying.",
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
      {
        id: "atr",
        title: "ATR: how far a stock normally moves",
        video: "sevenSteps",
        steps: [
          {
            type: "read",
            title: "Average true range",
            body: [
              "ATR is a stock's average daily range, usually over the last 14 days. A stock with a $5 ATR moves about $5 on a normal day; a $1 ATR stock moves a fifth as much. Dividing ATR by the price gives the average daily range as a percentage.",
              "Ariel uses ATR to stop himself from chasing and to set stops that fit the stock's personality.",
            ],
          },
          {
            type: "read",
            title: "Ariel's ATR rules",
            body: [
              "He never buys a stock that has already moved its full average daily range that day. You'd be asking the market for favours, and your stop would be far away.",
              "A stop should be no more than about 1 to 1.5 times the ATR, and he thinks even that is a lot.",
              "He doesn't open a new position when price is more than about 4 ATR above the 50-day average. From around 7 ATR above it, he starts trimming.",
            ],
          },
          {
            type: "calc",
            q: "On 16 July 2025 DELTA closed at ฿114.50. Its 50-day average was ฿104.10 and its ATR was ฿4.82. How many ATR above the 50-day was it? Round to one decimal.",
            answer: 2.2,
            tolerance: 0.1,
            unit: "ATR",
            explain: "(114.50 − 104.10) ÷ 4.82 = 2.2 ATR. Under 4, so not too extended for a new position.",
          },
          {
            type: "mcq",
            q: "DELL closed at $425 on 1 Sept 2026. The next morning it opened at $462, up 8.7%. Its average daily range was 5.7%. What do Ariel's rules say about buying at the open?",
            options: [
              "Don't: it has already moved more than its full daily range",
              "Buy: a big gap means strength",
              "Buy double, because it's moving",
            ],
            answer: 0,
            explain: "It went on to rise another 28%, which happens. The rule still holds: over many trades, chasing full-range moves means wide stops and poor risk.",
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
    id: "market",
    title: "Step 1: Read the market",
    blurb: "Healthy, choppy or falling decides how much and what to trade.",
    lessons: [
      {
        id: "market-first",
        title: "Read the market like Ariel",
        video: "maReject",
        steps: [
          {
            type: "read",
            title: "His morning checklist",
            body: [
              "Before the open Ariel runs through the same questions. What are the indexes doing? How is breadth: are most stocks rising or falling? Are the leaders still leading? Is there market news today, like a Fed meeting? And how are his own open positions acting?",
              "For US stocks that means the S&P 500 and the Nasdaq 100 (the fund QQQ). For Thai stocks, use the SET index and the SET50. In this course TDEX, a fund that tracks the SET50, stands in for the Thai market.",
            ],
          },
          {
            type: "read",
            title: "Three kinds of market",
            body: [
              "Healthy and trending: breakouts work, so he trades flat bases and other breakouts and builds up to full size.",
              "Choppy or drifting down: he trades less and smaller. He prefers pullbacks into rising moving averages, undercut and rallies and support gaps over breakouts.",
              "Bear market: he waits. Longs only make sense again after a selling climax or a follow-through day, a strong up day in an index some days after a low.",
            ],
          },
          {
            type: "read",
            title: "Progressive exposure",
            body: [
              "Most follow-through days fail, so Ariel doesn't jump in with everything. He starts small, and adds only when his first trades work. If new positions keep getting stopped out, that's the market telling him to slow down.",
              "Red flags he watches: breakouts failing, defensive stocks such as consumer staples leading, and his own stops getting hit.",
            ],
          },
          {
            type: "mcq",
            q: "The index is under its falling 50-day average, and most breakouts this month have failed. What would Ariel do?",
            options: [
              "Trade smaller, and look for pullbacks into rising averages rather than breakouts",
              "Trade bigger to win back the losses",
              "Ignore the market, because only the stock matters",
            ],
            answer: 0,
            explain: "Failing breakouts are information. In that environment he leans on pullback setups and keeps size down.",
          },
          {
            type: "mcq",
            q: "After a correction, the index has a strong follow-through day. What does progressive exposure mean here?",
            options: [
              "Start with a few small positions and add only as they work",
              "Go fully invested immediately",
              "Wait a full year to be sure",
            ],
            answer: 0,
            explain: "Most follow-through days fail. Small first, then more as the market proves it.",
          },
          {
            type: "mcq",
            q: "You've been stopped out of four new long trades in a row this week. What is that telling you?",
            options: ["The market isn't rewarding longs right now; slow down", "You need to take a fifth trade quickly", "Your broker is broken"],
            answer: 0,
            explain: "Ariel treats his own results as market feedback. Repeated stop-outs mean pump the brakes.",
          },
        ],
      },
    ],
  },
  {
    id: "groups",
    title: "Step 2: Find the leaders",
    blurb: "Leading groups first, then the strongest stocks inside them.",
    lessons: [
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
        id: "rs",
        title: "Relative strength: finding leaders",
        video: "sevenSteps",
        steps: [
          {
            type: "read",
            title: "Strong when the market is weak",
            body: [
              "Ariel's simplest test for a leader: how does it act when the market doesn't help? A stock rising while the market goes sideways or down has relative strength. So does one going sideways while the market falls, or one that is still within 10 to 20% of its high during a sell-off.",
              "He tags every stock on his watchlist with its industry group and tracks which groups lead over the last week, month and three months.",
            ],
          },
          {
            type: "mcq",
            q: "From late August to 24 Nov 2025 AOT rose 10% while the SET50 fund rose 1% (chart). From mid-May to 17 Aug 2026 RKLB fell 34% while QQQ rose 3%. Which shows relative strength?",
            options: ["AOT", "RKLB", "Neither"],
            answer: 0,
            explain: "AOT beat its market. RKLB badly lagged a rising market, which is relative weakness.",
          },
          {
            type: "mcq",
            q: "The market falls 8% in a month. Stock A falls 2% and stays near its highs. Stock B falls 15%. When the market recovers, which is Ariel more likely to watch?",
            options: ["Stock A, because it held up while the market fell", "Stock B, because it is cheaper now", "Whichever has the lower share price"],
            answer: 0,
            explain: "Stocks that hold up in a correction are often the first to break out when it ends. Ariel says he welcomes corrections for this reason.",
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
    id: "read",
    title: "Step 3: Read the chart",
    blurb: "Up, sideways, up, and the checklist he runs on every chart.",
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
      {
        id: "checklist",
        title: "Run the checklist on a chart",
        video: "flatBase",
        steps: [
          {
            type: "read",
            title: "Five questions before every trade",
            body: [
              "Put the pieces together and you get a checklist you can run on any chart in a minute:",
              "Is the market healthy? Is the stock stronger than the market? Is it in an uptrend, above its 50-day or just under it after an undercut? Is it within about 4 ATR of the 50-day? Would buying now mean chasing a stock that has already moved its full daily range?",
              "Then: what is the setup, and where exactly are you wrong?",
            ],
          },
          {
            type: "mcq",
            q: "Kinross Gold, 1 Aug 2025. QQQ was above a rising 50-day. KGC was up 41% over six months against 6% for QQQ. Is the market healthy, and is KGC a leader?",
            chart: { ex: "kgc_flat", from: "2025-04-15", to: "2025-08-01" },
            options: ["Yes and yes", "Market yes, KGC no", "Market no, KGC yes"],
            answer: 0,
            explain: "Both boxes ticked. Gold miners were also the strongest group that year.",
          },
          {
            type: "calc",
            q: "KGC closed at $16.21 on 1 Aug. Its 50-day average was $15.45 and its ATR was $0.55. How many ATR above the 50-day? Round to one decimal.",
            answer: 1.4,
            tolerance: 0.1,
            unit: "ATR",
            explain: "(16.21 − 15.45) ÷ 0.55 = 1.4 ATR. Comfortably under 4: not extended.",
          },
          {
            type: "mcq",
            q: "So far: healthy market, a leader, an uptrend, not extended, and a flat base with highs near $16.50. What's left to decide?",
            options: [
              "The entry trigger and the stop: where you get in and where you're wrong",
              "Nothing: just buy at any price",
              "Whether the company has a nice logo",
            ],
            answer: 0,
            explain: "Ariel bought this kind of base on a break of the prior day's high. The next lessons cover his setups and entry tactics.",
          },
        ],
      },
    ],
  },
  {
    id: "setups",
    title: "Step 4: His setups",
    blurb: "Flat bases, undercuts and rallies, and the rejections he avoids.",
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
              "Ariel adds two things. Almost every great flat base sits above all the key moving averages, and it is rarely the only stock in its group doing it. This is Kinross Gold (KGC) in summer 2025, a chart he uses in his own flat base video, while gold and silver miners led the market.",
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
            explain: "Ariel says his entry here would simply be a break of the prior day's high, which happened on 4 Aug. Over the next three weeks KGC reached $19.82, about 15% above the breakout close.",
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
            title: "A shakeout below a meaningful low",
            body: [
              "Ariel's undercut and rally: a stock dips below a meaningful prior low, one where price clearly held before and bounced, then climbs back above it. Sellers who were shaken out are gone, and the new low gives a tight place to be wrong.",
              "He reads the setup on the daily chart and times the entry on a 5-minute chart, for example a break of the opening range or a reclaim of VWAP. He doesn't trade undercuts of some random recent low.",
              "Dell (DELL), September 2026: the 24 Aug low of $424 had held and bounced. On 1 Sept DELL dipped under it.",
            ],
            chart: {
              ex: "dell_unr",
              from: "2026-06-15",
              to: "2026-09-01",
              lines: [{ price: 424, label: "24 Aug low", tone: "pivot" }],
            },
          },
          {
            type: "tap",
            q: "Tap the undercut: the day DELL traded below its $424 low.",
            chart: { ex: "dell_unr", from: "2026-06-15", to: "2026-09-08", lines: [{ price: 424, label: "24 Aug low", tone: "pivot" }] },
            mode: "candle",
            target: { from: "2026-09-01", to: "2026-09-01" },
            explain: "1 Sept 2026. DELL touched $421.89, closed back at $425.00, and the next day opened at $462.",
          },
          {
            type: "mcq",
            q: "If you buy the reclaim of $424, where does the stop go?",
            options: ["Just under $421.89, the undercut low", "At $300, far away to be safe", "No stop: undercuts always work"],
            answer: 0,
            explain: "If price goes back under the new low, the idea is wrong. That level is what makes this a defined-risk trade.",
          },
          {
            type: "mcq",
            q: "KBANK, October 2026. It had slid from ฿258. On 8 Oct it made a low of ฿230, and on 9 Oct it dipped to ฿226 and closed at ฿228. Is this Ariel's undercut and rally?",
            chart: { ex: "kbank_unr", from: "2026-08-01", to: "2026-10-09", lines: [{ price: 230, label: "8 Oct low", tone: "pivot" }] },
            options: [
              "No: the ฿230 low was a day old, not a meaningful low that had held before",
              "Yes: any undercut of any low counts",
              "Yes, because it's a bank",
            ],
            answer: 0,
            explain: "A meaningful low is one the market already defended. KBANK was also under all its key averages. It bounced 9% anyway, but that doesn't make it his setup.",
          },
        ],
      },
      {
        id: "munr",
        title: "Moving-average undercut and rally: Ariel's AMD trade",
        video: "unr",
        steps: [
          {
            type: "read",
            title: "Same idea, with a moving average",
            body: [
              "Ariel learned the MA undercut and rally from Gil Morales. A strong stock pulls back, dips under a key moving average like the 10, 20 or 50-day, then rallies back through it.",
              "He bought AMD this way himself on Monday 14 Sept 2026, as he explains in his undercut and rally video. AMD gapped down into its 10 and 20-day averages, sold off in the morning, then reclaimed VWAP right at those averages. His risk to the low was about 1.25%.",
            ],
            chart: { ex: "amd_munr", from: "2026-07-01", to: "2026-09-14", marks: [{ date: "2026-09-14", label: "Undercut, then reclaim", at: "low", tone: "pivot" }] },
          },
          {
            type: "mcq",
            q: "On 14 Sept AMD fell to $480.33, under its 20-day average of $480.99, and closed at $493.41. Where is the stop for this trade?",
            chart: {
              ex: "amd_munr",
              from: "2026-07-01",
              to: "2026-10-09",
              reveal: { upto: "2026-09-14" },
              lines: [{ price: 480.33, label: "Undercut low", tone: "stop", after: true }],
            },
            options: ["Just under $480.33, the low of the undercut", "$400, a round number", "At the 200-day average"],
            answer: 0,
            explain: "Within three weeks AMD reached $645.46. Ariel described it as being up 25 to 30% in a couple of weeks from a 1.25% risk.",
          },
          {
            type: "mcq",
            q: "The Nasdaq was choppy, under its 50-day, when Ariel bought AMD. Why take a long at all?",
            options: [
              "In choppy markets he prefers pullbacks into averages over breakouts, and this was one",
              "He ignores the market for big stocks",
              "Because AMD is famous",
            ],
            answer: 0,
            explain: "The market decides which setups to favour, not only whether to trade.",
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
              "He uses Rocket Lab rallying into its declining 50-day as an example in his 6/20 video. For a beginner who only buys, the main use is a warning sign: don't buy into a falling 50-day.",
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
    title: "Step 5: Entry tactics",
    blurb: "The daily chart picks the stock. A 5-minute tactic picks the moment.",
    lessons: [
      {
        id: "setup-vs-entry",
        title: "Setup first, entry tactic second",
        video: "setupVsEntry",
        steps: [
          {
            type: "read",
            title: "What, then when",
            body: [
              "Ariel separates two decisions. The daily setup tells you which stock and roughly where: a flat base, an undercut and rally, a pullback into a rising average. The entry tactic tells you the exact moment to buy, on a 5-minute chart during the day.",
              "If someone asks what he's trading, he can always answer both: the setup and the entry tactic.",
            ],
          },
          {
            type: "read",
            title: "His entry tactics",
            body: [
              "Prior-day high: buy when price trades above yesterday's high. That's how he'd have bought KGC's flat base on 4 Aug 2025.",
              "5-minute opening range break: buy when price breaks above the high of the first five minutes.",
              "VWAP reclaim: buy when price climbs back above VWAP, the day's average price weighted by volume.",
              "The 6/20 setup: the next lesson.",
            ],
          },
          {
            type: "mcq",
            q: "DELL undercut its meaningful low and reclaimed it. You plan to buy on a 5-minute opening range break. Which part is the setup?",
            options: [
              "The undercut and reclaim is the setup; the opening range break is the entry tactic",
              "Both are entry tactics",
              "Both are setups",
            ],
            answer: 0,
            explain: "Structure comes from the daily chart. The trigger comes from the intraday chart.",
          },
          {
            type: "mcq",
            q: "Why bother with an intraday entry tactic at all?",
            options: [
              "It gets you in at a spot where the stop can be very tight",
              "It guarantees the trade works",
              "It lets you skip the daily chart",
            ],
            answer: 0,
            explain: "Ariel says great swing trades don't need the 5-minute chart, but it helps you get in with a small, defined risk.",
          },
        ],
      },
      {
        id: "six-twenty",
        title: "The 6/20 setup",
        video: "sixTwenty",
        steps: [
          {
            type: "read",
            title: "Two moving averages on a 5-minute chart",
            body: [
              "The 6/20 setup comes from Gil Morales, who managed money with William O'Neil. On a 5-minute chart, a 6-period and a 20-period moving average cross. MACD usually crosses first, then the averages; Ariel waits for the averages, because MACD gives more false signals.",
              "For a long, the stop goes at the low of the day.",
            ],
          },
          {
            type: "read",
            title: "Only off a daily level",
            body: [
              "Ariel stresses that the 6/20 is not magic. It only counts when the daily chart gives a logical level: a pullback into a rising moving average, an undercut of a meaningful low, a support gap. Ideally other stocks in the group and the index are turning up too.",
              "A 6/20 cross on the fourth green day in a row, straight into a falling 50-day, is the opposite of how it's meant to be used.",
            ],
          },
          {
            type: "mcq",
            q: "A stock is up four days in a row into a falling 50-day average. A 6/20 buy signal appears on the 5-minute chart. What would Ariel say?",
            options: [
              "Skip it: no daily level supports a long here",
              "Buy it: the signal is the signal",
              "Buy double",
            ],
            answer: 0,
            explain: "He'd rather see it get above the 50-day on its own, tighten up, then pull back to the 50 for a 6/20 off support.",
          },
          {
            type: "calc",
            q: "Ariel's example: a 6/20 entry with a stop 4% below at the low of day, taking a 10% position. What percent of the account is at risk?",
            answer: 0.4,
            tolerance: 0.001,
            unit: "%",
            explain: "10% position × 4% stop = 0.4% of the account, roughly the half percent he aims for.",
          },
        ],
      },
    ],
  },
  {
    id: "risk",
    title: "Step 6: Risk and size",
    blurb: "Know the loss before you buy, then work out the shares.",
    lessons: [
      {
        id: "stops",
        title: "Decide the loss before you buy",
        video: "sizing",
        steps: [
          {
            type: "read",
            title: "Stops without negotiation",
            body: [
              "Ariel's order is risk first, shares second. Before buying he knows where he's wrong, normally the low of the day he buys or the prior day's low.",
              "The distance from entry to stop is the risk per share, called 1R. Results are measured in R: a trade that gains three times its risk made 3R.",
            ],
          },
          {
            type: "tap",
            q: "You buy AOT at ฿42.00 on 25 Nov 2025 as it trades above the prior day's high. The low of that day is ฿41.75. Tap where your stop goes.",
            chart: { ex: "aot_flat", from: "2025-10-10", to: "2025-11-25", lines: [{ price: 42.75, label: "Pivot", tone: "pivot" }] },
            mode: "price",
            target: { lo: 41.2, hi: 41.76 },
            explain: "Just under ฿41.75, the low of the entry day. AOT moves in ฿0.25 steps, so ฿41.50 is the natural price.",
          },
          {
            type: "calc",
            q: "Entry ฿42.00, stop ฿41.50. What is your risk per share?",
            answer: 0.5,
            tolerance: 0.001,
            unit: "฿",
            explain: "฿42.00 − ฿41.50 = ฿0.50 per share. That's 1R for this trade.",
          },
          {
            type: "calc",
            q: "AMD: say you bought at $498.39 with a stop at $480.33, and it later reached $645.46. How many R was that? Round to one decimal.",
            answer: 8.1,
            tolerance: 0.11,
            unit: "R",
            explain: "Risk $18.06, gain $147.07. $147.07 ÷ $18.06 = 8.1R. A few trades like this pay for many 1R losses.",
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
        title: "Right 35% of the time, still profitable",
        video: "sevenSteps",
        steps: [
          {
            type: "read",
            title: "Expectancy",
            body: [
              "Ariel's stats say he's right on 35 to 37% of trades. He calls cutting losers quickly the single most important skill: you can be mediocre at everything else and still make money if you cut losers fast and let winners run.",
              "Expectancy = (win rate × average win) − (loss rate × average loss). It's the average result per trade, in R.",
            ],
          },
          {
            type: "calc",
            q: "You win 35% of trades. The average win is 3R and the average loss is 1R. What's the expectancy per trade, in R?",
            answer: 0.4,
            tolerance: 0.001,
            unit: "R",
            explain: "0.35 × 3 = 1.05. 0.65 × 1 = 0.65. 1.05 − 0.65 = +0.4R per trade, while losing almost two trades in three.",
          },
          {
            type: "mcq",
            q: "Same 35% win rate, but you let losers run to 2R on average. Expectancy?",
            options: ["−0.25R: the same trades now lose money", "+0.4R, nothing changes", "+1.05R"],
            answer: 0,
            explain: "1.05 − (0.65 × 2) = −0.25R. Only the loss size changed. That's why the stop isn't negotiable.",
          },
        ],
      },
    ],
  },
  {
    id: "manage",
    title: "Step 7: Manage the trade",
    blurb: "Sell rules, trims into strength, and letting winners work.",
    lessons: [
      {
        id: "failed",
        title: "Follow the sell rule, both ways",
        video: "bigLosses",
        steps: [
          {
            type: "read",
            title: "KTB, September 2026",
            body: [
              "KTB broke above ฿44.75 on 17 Sept 2026 and closed at ฿45.00. The low that day was ฿44.25, so the stop went just under it at ฿44.00.",
            ],
            chart: {
              ex: "ktb_fail",
              from: "2026-07-15",
              to: "2026-09-21",
              lines: [
                { price: 44.75, label: "Pivot", tone: "pivot" },
                { price: 44.0, label: "Stop", tone: "stop" },
              ],
            },
          },
          {
            type: "mcq",
            q: "28 Sept: KTB trades down to ฿43.50, through your ฿44.00 stop. What do you do?",
            chart: {
              ex: "ktb_fail",
              from: "2026-07-15",
              to: "2026-10-30",
              reveal: { upto: "2026-09-28" },
              lines: [
                { price: 44.75, label: "Pivot", tone: "pivot" },
                { price: 44.0, label: "Stop", tone: "stop" },
              ],
            },
            options: ["Sell: the stop is the plan", "Hold: it will come back", "Buy more to lower the average price"],
            answer: 0,
            explain: "Two days later KTB fell to ฿40.75. Selling at the stop cost ฿1 a share, exactly 1R. Holding would have cost over 4R.",
          },
          {
            type: "read",
            title: "The other way to break a rule",
            body: [
              "In his video on avoiding huge losses, Ariel tells the opposite mistake. He bought SOXL and Amazon with stops at the low of the day. Both closed flat, his stops were never hit, but he sold anyway because the trades felt stuck.",
              "Soon after, SOXL rose about 40% and Amazon gapped up about $15 a share, without him. He also held two earnings gap-ups, Toast and TMDX, that closed flat without hitting their stops, and both worked. His lesson: know your loss before you get in, and follow the rule all the time.",
            ],
          },
          {
            type: "mcq",
            q: "You bought a breakout with a stop at the day's low. Two days later it's flat and your stop hasn't been hit. Following Ariel's rule, you:",
            options: ["Hold: the stop decides when you're wrong, not boredom", "Sell, because it feels stuck", "Move the stop lower to give it room"],
            answer: 0,
            explain: "Selling early and moving the stop are both ways of breaking the rule.",
          },
        ],
      },
      {
        id: "selling",
        title: "Trim into strength",
        video: "sevenSteps",
        steps: [
          {
            type: "read",
            title: "The momentum burst",
            body: [
              "Ariel counts the day he buys as day 1. Strong stocks often make a momentum burst: an 8 to 20% move over the next three to five days, sometimes up to eight.",
              "He trims a third to a half into that burst. If a stock gives him 20 to 30% in three to five sessions, he takes half. If it keeps going you still own the rest; if it comes back, you're glad you sold.",
            ],
          },
          {
            type: "read",
            title: "Let the rest work",
            body: [
              "While the stock holds above its 10 and 20-day averages, he lets the rest work. Extension tells him when to sell more: at about 7 ATR above the 50-day he trims, and again at each ATR after that, taking around 10% of what's left each time.",
              "He doesn't add to a position once it's about 3 ATR above his entry without a fresh base. And he's described moving the stop on the rest to breakeven after taking some off.",
            ],
          },
          {
            type: "mcq",
            q: "KGC broke out on 4 Aug 2025. On day 3, 6 Aug, it closed at $18.71, about 13% above a $16.48 entry. What does the trim rule say?",
            chart: { ex: "kgc_flat", from: "2025-06-02", to: "2025-08-06", lines: [{ price: 16.48, label: "Entry", tone: "pivot" }] },
            options: [
              "Trim a third to a half; keep the rest with a stop",
              "Sell everything and never buy KGC again",
              "Buy more, it's working",
            ],
            answer: 0,
            explain: "A 13% burst by day 3 is exactly what he trims into. The rest can keep working while it stays above the 10 and 20-day.",
          },
          {
            type: "mcq",
            q: "A stock you own is now 8 ATR above its 50-day average. What does Ariel do?",
            options: ["Trim some more, roughly 10% of what's left", "Add a big new position", "Nothing, extension doesn't matter"],
            answer: 0,
            explain: "Stocks tend to revert to their averages when this extended. He harvests some of the gain.",
          },
        ],
      },
    ],
  },
  {
    id: "trade",
    title: "Trade it like Ariel",
    blurb: "Replay real trades day by day with his rules.",
    lessons: [
      {
        id: "replay-kgc",
        title: "Replay: KGC's flat base",
        steps: [
          {
            type: "read",
            title: "Now you trade it",
            body: [
              "You'll see the chart as it looked on the evening before the trade. Run the checklist, make the call, then manage the position one day at a time. Your result is compared with what Ariel's rules would have done.",
              "The practice account is $100,000 for US stocks or ฿1,000,000 for Thai stocks, so share counts divide sensibly; what matters are the percentages. Each trade risks 0.5% of the account, or 0.25% when the rules say smaller, and no position is bigger than 15% of the account (7.5% when smaller).",
            ],
          },
          { type: "trade", trade: "kgc" },
        ],
      },
      {
        id: "replay-ktb",
        title: "Replay: a breakout that fails",
        steps: [{ type: "trade", trade: "ktbfail" }],
      },
      {
        id: "replay-dell",
        title: "Replay: when the right call is to pass",
        steps: [{ type: "trade", trade: "dell" }],
      },
      {
        id: "review-game",
        title: "Mixed chart review",
        video: "predictive",
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
            q: "AMD, 14 Sept 2026: a pullback into the 10 and 20-day, an intraday dip under the 20-day, and a close back above it. Name the setup.",
            chart: { ex: "amd_munr", from: "2026-07-01", to: "2026-10-09", reveal: { upto: "2026-09-14" } },
            options: ["MA undercut and rally", "Flat base breakout", "MA rejection"],
            answer: 0,
            explain: "The trade Ariel took himself. AMD reached $645.46 within three weeks.",
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


const VISUALS = {
  "playbook:0": { illus: "playbook-flow" },
  "playbook:1": { illus: "playbook-flow" },
  "playbook:2": { illus: "win-loss" },
  "playbook:3": { illus: "market-types" },
  "playbook:4": { illus: "win-loss" },
  "predict:0": { chart: { ex: "ktb_fail", from: "2026-07-15", to: "2026-10-30", lines: [{ price: 44.75, label: "Breakout level", tone: "pivot" }] } },
  "predict:1": { illus: "group-together" },
  "predict:2": { group: "gold_miners" },
  "predict:3": { illus: "r-ruler" },
  "candles:0": { illus: "candle-anatomy" },
  "candles:2": { chart: { ex: "ktb_flat", from: "2026-01-12", to: "2026-02-09", mas: [], marks: [{ date: "2026-02-09", label: "9 Feb", at: "high", tone: "pivot" }] } },
  "candles:4": { illus: "long-wick" },
  "trend:0": { illus: "three-trends" },
  "trend:2": { illus: "three-trends" },
  "ma-basics:1": { chart: { ex: "kbank_unr", from: "2026-08-20", to: "2026-09-17", marks: [{ date: "2026-09-11", label: "5 closes", at: "low", tone: "pivot" }] } },
  "ma-basics:2": { chart: { ex: "kgc_flat", from: "2025-04-15", to: "2025-08-29" } },
  "ma-stack:1": { chart: { ex: "kgc_flat", from: "2025-04-15", to: "2025-08-04", marks: [{ date: "2025-08-04", label: "4 Aug", at: "high", tone: "pivot" }] } },
  "atr:0": { illus: "atr-range" },
  "atr:1": { illus: "atr-ladder" },
  "atr:2": { chart: { ex: "delta_digest", from: "2025-04-01", to: "2025-07-16" } },
  "atr:3": { chart: { ex: "dell_unr", from: "2026-07-01", to: "2026-10-30", reveal: { upto: "2026-09-02" }, lines: [{ price: 425, label: "1 Sept close", tone: "pivot" }] } },
  "markets:0": { illus: "two-clocks" },
  "markets:1": { illus: "board-lot" },
  "markets:2": { illus: "board-lot" },
  "markets:3": { illus: "two-clocks" },
  "market-first:0": { illus: "checklist" },
  "market-first:1": { illus: "market-types" },
  "market-first:2": { illus: "progressive-exposure" },
  "market-first:3": { illus: "market-types" },
  "market-first:4": { illus: "progressive-exposure" },
  "market-first:5": { illus: "win-loss" },
  "groups:2": { illus: "group-together" },
  "rs:0": { illus: "relative-strength" },
  "rs:1": { group: "aot_rs" },
  "rs:2": { illus: "relative-strength" },
  "universe:0": { illus: "funnel" },
  "universe:1": { group: "gold_miners" },
  "universe:2": { illus: "funnel" },
  "digest:2": { chart: { ex: "delta_digest", from: "2025-03-03", to: "2025-07-16" } },
  "digest:3": { illus: "flat-base" },
  "checklist:0": { illus: "checklist" },
  "checklist:2": { chart: { ex: "kgc_flat", from: "2025-04-15", to: "2025-08-01" } },
  "checklist:3": { chart: { ex: "kgc_flat", from: "2025-06-02", to: "2025-08-01", lines: [{ price: 16.52, label: "Pivot", tone: "pivot" }] } },
  "flat-us:0": { illus: "flat-base" },
  "flat-thai:3": { chart: { ex: "ktb_flat", from: "2026-01-12", to: "2026-02-09", lines: [{ price: 30.25, label: "Close", tone: "pivot" }, { price: 29.0, label: "Low", tone: "stop" }] } },
  "unr:0": { illus: "unr" },
  "unr:2": { chart: { ex: "dell_unr", from: "2026-07-15", to: "2026-09-01", lines: [{ price: 424, label: "24 Aug low", tone: "pivot" }, { price: 421.89, label: "Undercut low", tone: "stop" }] } },
  "munr:0": { illus: "munr" },
  "munr:2": { illus: "market-types" },
  "rejection:0": { illus: "rejection" },
  "setup-vs-entry:0": { illus: "zoom" },
  "setup-vs-entry:1": { illus: "entry-tactics" },
  "setup-vs-entry:2": { illus: "zoom" },
  "setup-vs-entry:3": { illus: "entry-tactics" },
  "six-twenty:0": { illus: "six-twenty" },
  "six-twenty:1": { illus: "fourth-green-day" },
  "six-twenty:2": { illus: "fourth-green-day" },
  "six-twenty:3": { illus: "sizing" },
  "stops:0": { illus: "r-ruler" },
  "stops:2": { illus: "r-ruler" },
  "stops:3": { chart: { ex: "amd_munr", from: "2026-08-01", to: "2026-10-09", lines: [{ price: 498.39, label: "Entry", tone: "pivot" }, { price: 480.33, label: "Stop", tone: "stop" }] } },
  "sizing:0": { illus: "sizing" },
  "sizing:1": { chart: { ex: "kgc_flat", from: "2025-06-02", to: "2025-08-04", lines: [{ price: 17.26, label: "Entry", tone: "pivot" }, { price: 16.35, label: "Stop", tone: "stop" }] } },
  "sizing:2": { chart: { ex: "aot_flat", from: "2025-10-10", to: "2025-11-25", lines: [{ price: 43.75, label: "Entry", tone: "pivot" }, { price: 41.75, label: "Stop", tone: "stop" }] } },
  "sizing:3": { illus: "sizing" },
  "expectancy:0": { illus: "win-loss" },
  "expectancy:1": { illus: "expectancy" },
  "expectancy:2": { illus: "win-loss" },
  "failed:2": { illus: "sell-rule" },
  "failed:3": { illus: "sell-rule" },
  "selling:0": { illus: "momentum-burst" },
  "selling:1": { illus: "extension" },
  "selling:3": { illus: "extension" },
  "replay-kgc:0": { illus: "replay" },
  "review-game:1": { chart: { ex: "delta_digest", from: "2025-05-01", to: "2025-07-17", lines: [{ price: 132.5, label: "Entry", tone: "pivot" }, { price: 115.5, label: "Stop", tone: "stop" }] } },
};

UNITS.forEach((u) =>
  u.lessons.forEach((l) =>
    l.steps.forEach((s, i) => {
      const v = VISUALS[`${l.id}:${i}`];
      if (v) Object.entries(v).forEach(([k, val]) => {
        if (!s[k]) s[k] = val;
      });
    })
  )
);

export const LESSONS = UNITS.flatMap((u) => u.lessons.map((l) => ({ ...l, unit: u })));

export function findStep(cardId) {
  const [lessonId, idx] = cardId.split(":");
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const step = lesson?.steps[Number(idx)];
  return step ? { lesson, step } : null;
}

export const QUESTION_TYPES = new Set(["mcq", "tap", "calc"]);
