import { useState } from "react";
import TradeSim from "../components/TradeSim";
import Icon from "../components/Icon";
import { SCENARIOS } from "../content/trades";
import { setOption } from "../lib/store";

export default function Trade({ state }) {
  const [open, setOpen] = useState(null);
  const done = state.trades || {};
  const t = SCENARIOS.find((s) => s.id === open);

  if (t) {
    return (
      <section className="page page-wide">
        <button type="button" className="link-btn back" onClick={() => setOpen(null)}>
          <Icon name="back" size={16} /> All trades
        </button>
        <TradeSim key={t.id} t={t} onComplete={() => setOption("trades", { ...done, [t.id]: true })} />
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Trade it like Ariel</h1>
      <p className="lede">
        Real setups from US and Thai stocks, replayed one day at a time. Run his checklist, decide whether to take the trade, then manage it: hold, trim into strength, or sell. At the end you see how your result compares with his rules.
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
