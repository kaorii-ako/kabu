import { useState } from "react";
import { CHANNEL, LUK_CHANNEL, ARIEL_VIDEOS, videoUrl } from "../content/course";
import { LUK_VIDEOS } from "../content/luk";
import { resetAll } from "../lib/store";
import { asOf, fmtDate } from "../lib/market";

const RESEARCH = [
  {
    cite: "Dunlosky, Rawson, Marsh, Nathan & Willingham (2013). Improving students' learning with effective learning techniques. Psychological Science in the Public Interest.",
    use: "Rated practice testing and spaced practice as the most useful study techniques. Every lesson here is mostly questions, and Review spaces them out.",
    url: "https://doi.org/10.1177/1529100612453266",
  },
  {
    cite: "Roediger & Karpicke (2006). Test-enhanced learning. Psychological Science.",
    use: "Recalling an answer builds memory better than rereading. That's why lessons ask before they tell.",
    url: "https://doi.org/10.1111/j.1467-9280.2006.01693.x",
  },
  {
    cite: "Cepeda, Pashler, Vul, Wixted & Rohrer (2006). Distributed practice in verbal recall tasks. Psychological Bulletin.",
    use: "Spacing practice over days beats cramming. Review cards return after 1, 2, 4, 8, 16 and 32 days.",
    url: "https://doi.org/10.1037/0033-2909.132.3.354",
  },
  {
    cite: "Rohrer & Taylor (2007). The shuffling of mathematics problems improves learning. Instructional Science.",
    use: "Mixing problem types teaches you to pick the right method. Review and the final unit mix setups from different lessons.",
    url: "https://doi.org/10.1007/s11251-007-9015-8",
  },
];

export default function Sources() {
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);
  return (
    <div className="page sources">
      <h1>About Kabu</h1>
      <div className="prose">
        <p>
          Kabu (株, Japanese for "stock") is a free, independent course for people who have never traded. It has two tracks: the swing trading process of Ariel Hernandez, as he explains it on{" "}
          <a href={CHANNEL} target="_blank" rel="noreferrer">
            his YouTube channel
          </a>
          , and the method of Martin Luk, from{" "}
          <a href={LUK_CHANNEL} target="_blank" rel="noreferrer">
            his live streams
          </a>{" "}
          and interviews. Both are applied to real charts from the US and Thai markets.
        </p>
        <p>
          Kabu is not made, checked or endorsed by Ariel or Martin. Everything here is a summary in our own words; for their full explanations, watch the videos below.
        </p>
      </div>

      <h2>Ariel Hernandez: what the track covers, and what it doesn't</h2>
      <div className="prose">
        <p>
          Ariel's channel has more than 800 videos, most of them long live trading sessions. Kabu is built from his teaching videos on setups, entry tactics, scanning and sizing, plus his long TraderLion interview on his full system, all listed below. It does not summarise every live session, and his views may have changed since a video was recorded.
        </p>
      </div>

      <h2>Ariel Hernandez: videos used in the lessons</h2>
      <ul className="link-list">
        {Object.values(ARIEL_VIDEOS).map((v) => (
          <li key={v.id}>
            <a href={videoUrl(v)} target="_blank" rel="noreferrer">
              {v.title}
            </a>
          </li>
        ))}
      </ul>


      <h2>Martin Luk: how the track was researched</h2>
      <div className="prose">
        <p>
          The Martin Luk track was built from his own words, not from summaries by other people. We pulled the YouTube captions of every video on his channel (115 live streams from November 2025 to November 2026; 100 had captions, 15 didn't) and of his three long interviews: TraderLion in 2025 and 2026, and the US Investing Championship podcast.
        </p>
        <p>
          The two TraderLion interviews, where he walks through his whole process with charts, were read in full. The streams were read where he explains his routine (premarket, watchlists, weekend scans) and searched by topic for everything else: risk per trade, position size, stops, break-even, the first 15 minutes, earnings, liquidity, scans, shorting and selling. When he said different things at different times, the lessons say so and give both dates, because his method changed between 2024 and 2026.
        </p>
        <p>
          Every point in a lesson links to the video and the minute where he says it. Times come from automatic captions, so they're accurate to about a minute, and captions sometimes mishear tickers and numbers; we checked those against the charts. Two analyses by James Muninn, who logged his 2026 trades, were used only to cross-check and are labelled as secondary where cited.
        </p>
        <p>
          Chart lessons use the same EMAs he uses (9, 21, 50, 150) and anchored VWAP, computed from Kabu's daily data. The trade examples (AMD, IonQ, Micron, Tesla, Robinhood, QQQ) are real moves picked to show his patterns; where he traded them himself, the lesson says so.
        </p>
      </div>

      <h2>Martin Luk: videos used in the lessons</h2>
      <ul className="link-list">
        {Object.values(LUK_VIDEOS).map((v) => (
          <li key={v.id}>
            <a href={videoUrl(v)} target="_blank" rel="noreferrer">
              {v.title}
            </a>
          </li>
        ))}
      </ul>

      <h2>How the lessons are designed</h2>
      <ul className="research">
        {RESEARCH.map((r) => (
          <li key={r.url}>
            <a href={r.url} target="_blank" rel="noreferrer">
              {r.cite}
            </a>
            <p>{r.use}</p>
          </li>
        ))}
      </ul>

      <h2>Data</h2>
      <div className="prose">
        <p>
          Charts use daily prices from Yahoo Finance, downloaded on {fmtDate(asOf)}. In the Ariel track, moving averages are simple averages of closing prices; in the Martin Luk track they are exponential (EMA), as he uses them. TDEX, a fund that tracks the SET50, stands in for the Thai market. Board lot and trading-hour rules come from the Stock Exchange of Thailand.
        </p>
        <p>
          The setup library and the chart analyzer use two years of daily bars for about 50 US and Thai stocks. A rule engine scans them for Ariel's setups (flat base, undercut and rally, MA undercut and rally, pullback to a rising average, gap up on heavy volume, high tight flag, and rallies into a falling 50-day), runs his checklist, and replays each trade with his management rules. The rules are a simplified version of his process written for teaching: they only see daily bars, so they can't weigh news, the stock's group or intraday entries the way he does. "Ask Claude" in the analyzer only appears when Kabu is opened inside Claude.
        </p>
      </div>

      <h2>Not financial advice</h2>
      <div className="prose">
        <p>
          Kabu is for learning. The examples were picked after the fact to show clean patterns, and plenty of setups that look the same fail. Practise on paper first, never risk money you need, and if you are under 18, any real account needs a parent or guardian.
        </p>
      </div>

      <h2>Your progress</h2>
      <div className="prose">
        <p>Progress is saved in this browser only. Clearing it can't be undone.</p>
      </div>
      {cleared ? (
        <p role="status">Progress cleared.</p>
      ) : confirming ? (
        <div className="confirm-row">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              resetAll();
              setConfirming(false);
              setCleared(true);
            }}
          >
            Yes, clear everything
          </button>
          <button type="button" className="btn btn-quiet" onClick={() => setConfirming(false)}>
            Keep my progress
          </button>
        </div>
      ) : (
        <button type="button" className="btn btn-danger" onClick={() => setConfirming(true)}>
          Clear my progress
        </button>
      )}
    </div>
  );
}
