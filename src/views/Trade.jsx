import { useState } from "react";
import TradeSim from "../components/TradeSim";
import Icon from "../components/Icon";
import Library from "./Library";
import { SCENARIOS } from "../content/trades";
import { LIBRARY } from "../lib/library";
import { setOption } from "../lib/store";

export default function Trade({ state, tab, onTab }) {
  const [open, setOpen] = useState(null);
  const done = state.trades || {};
  const t = SCENARIOS.find((s) => s.id === open);

  if (t && tab !== "library") {
    return (
      <section className="page page-wide">
        <button type="button" className="link-btn back" onClick={() => setOpen(null)}>
          <Icon name="back" size={16} /> All trades
        </button>
        <TradeSim key={t.id} t={t} onComplete={() => setOption("trades", { ...done, [t.id]: true })} />
      </section>
    );
  }

  if (tab === "library") {
    return (
      <Library
        state={state}
        head={
          <>
            <h1>Trade it like Ariel</h1>
            <Tabs tab={tab} onTab={onTab} />
          </>
        }
      />
    );
  }

  return (
    <section className="page page-wide">
      <h1>Trade it like Ariel</h1>
      <Tabs tab={tab} onTab={onTab} />
      <p className="lede">
        Real setups from US and Thai stocks, replayed one day at a time. Run his checklist, decide whether to take the trade, then manage it: hold, trim into strength, or sell. At the end you see how your result compares with his rules. These eight come with hand-written notes; the setup library has {LIBRARY.length} more.
      </p>
      <ul className="trade-list">
        {SCENARIOS.map((s) => (
          <li key={s.id}>
            <button type="button" className="trade-card" onClick={() => setOpen(s.id)}>
              <span className="trade-market">{s.market === "SET" ? "Thai" : "US"}</span>
              <span className="trade-title">{s.title}</span>
              <span className="trade-setup">{s.pattern}</span>
              <span className="trade-status">{done[s.id] ? <><Icon name="check" size={14} /> Played</> : "Not played yet"}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Tabs({ tab, onTab }) {
  return (
    <div className="segmented page-tabs" role="tablist" aria-label="Trades">
      {[
        ["trade", "Guided trades"],
        ["library", `Setup library (${LIBRARY.length})`],
      ].map(([k, label]) => (
        <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? "is-on" : ""} onClick={() => onTab(k)}>
          {label}
        </button>
      ))}
    </div>
  );
}
