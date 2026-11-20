import { useState } from "react";
import { CHANNEL, VIDEOS, videoUrl } from "../content/course";
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
          Kabu (株, Japanese for "stock") is a free, independent course for people who have never traded. It teaches the swing trading process of Ariel Hernandez, step by step, as he explains it on{" "}
          <a href={CHANNEL} target="_blank" rel="noreferrer">
            his YouTube channel
          </a>
          , and applies it to real charts from the US and Thai markets.
        </p>
        <p>
          Kabu is not made, checked or endorsed by Ariel. Everything here is a summary in our own words; for his full explanations, watch the videos below.
        </p>
      </div>

      <h2>What it covers, and what it doesn't</h2>
      <div className="prose">
        <p>
          Ariel's channel has more than 800 videos, most of them long live trading sessions. Kabu is built from his teaching videos on setups, entry tactics, scanning and sizing, plus his long TraderLion interview on his full system, all listed below. It does not summarise every live session, and his views may have changed since a video was recorded.
        </p>
      </div>

      <h2>Videos used in the lessons</h2>
      <ul className="link-list">
        {Object.values(VIDEOS).map((v) => (
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
          Charts use daily prices from Yahoo Finance, downloaded on {fmtDate(asOf)}. Moving averages are simple averages of closing prices. TDEX, a fund that tracks the SET50, stands in for the Thai market. Board lot and trading-hour rules come from the Stock Exchange of Thailand.
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
