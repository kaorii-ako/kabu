import { useMemo, useState } from "react";
import TradeSim from "../components/TradeSim";
import Icon from "../components/Icon";
import { LIBRARY } from "../lib/library";
import { SETUPS, SETUP_ORDER, OUTCOMES } from "../lib/analyze";
import { VERDICTS } from "../content/trades";
import { setOption } from "../lib/store";

const signedR = (r) => `${r >= 0 ? "+" : "−"}${Math.abs(r).toFixed(1)}R`;

function toSim(e) {
  const passNote =
    e.verdict === "pass"
      ? `If you had bought it anyway, Ariel's management rules would have finished at ${signedR(e.rulesR)}${e.outcome === "worked" ? ". This one worked, but over many trades the setups the checklist rejects lose more often and lose bigger." : e.outcome === "failed" ? ", a loss the checklist kept you out of." : ", close to breakeven."}`
      : null;
  return { ...e, pattern: SETUPS[e.type].name, library: true, passNote };
}

function Filter({ label, value, options, onChange }) {
  return (
    <div className="lib-filter" role="radiogroup" aria-label={label}>
      <span className="lib-filter-label">{label}</span>
      <div className="chips">
        {options.map(([k, text, n]) => (
          <button key={k} type="button" role="radio" aria-checked={value === k} className={`chip${value === k ? " is-on" : ""}`} onClick={() => onChange(k)}>
            {text}
            {n != null && <span className="chip-n">{n}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Library({ state, head }) {
  const [open, setOpen] = useState(null);
  const [type, setType] = useState("all");
  const [outcome, setOutcome] = useState("all");
  const [market, setMarket] = useState("all");
  const [verdict, setVerdict] = useState("all");
  const played = state.library || {};

  const list = useMemo(
    () =>
      LIBRARY.filter(
        (e) =>
          (type === "all" || e.type === type) &&
          (outcome === "all" || e.outcome === outcome) &&
          (market === "all" || e.market === market) &&
          (verdict === "all" || e.verdict === verdict)
      ),
    [type, outcome, market, verdict]
  );

  const count = (pred) => LIBRARY.filter(pred).length;
  const t = open && LIBRARY.find((e) => e.id === open);

  if (t) {
    const idx = list.findIndex((e) => e.id === t.id);
    const nextOne = list.slice(idx + 1).find((e) => !played[e.id]) || list.find((e) => !played[e.id] && e.id !== t.id);
    return (
      <section className="page page-wide">
        <div className="lib-nav">
          <button type="button" className="link-btn back" onClick={() => setOpen(null)}>
            <Icon name="back" size={16} /> Setup library
          </button>
          {nextOne && (
            <button type="button" className="btn btn-quiet" onClick={() => setOpen(nextOne.id)}>
              Next setup
            </button>
          )}
        </div>
        <TradeSim key={t.id} t={toSim(t)} onComplete={() => setOption("library", { ...played, [t.id]: true })} />
      </section>
    );
  }

  const random = () => {
    const pool = list.filter((e) => !played[e.id]);
    const from = pool.length ? pool : list;
    if (from.length) setOpen(from[Math.floor(Math.random() * from.length)].id);
  };

  const playedCount = LIBRARY.filter((e) => played[e.id]).length;

  return (
    <section className="page page-wide">
      {head}
      <p className="lede">
        {LIBRARY.length} real setups found by scanning two years of daily charts for {new Set(LIBRARY.map((e) => e.symbol)).size} US and Thai stocks with Ariel's rules. Every one is replayable. The checklist verdict and the outcome come from the same rules engine, so you'll see setups that passed the checklist and failed, and setups it rejected that worked anyway. You have played {playedCount}.
      </p>

      <div className="lib-filters">
        <Filter
          label="Setup"
          value={type}
          onChange={setType}
          options={[["all", "All", LIBRARY.length], ...SETUP_ORDER.map((k) => [k, SETUPS[k].short, count((e) => e.type === k)])]}
        />
        <Filter
          label="Result"
          value={outcome}
          onChange={setOutcome}
          options={[["all", "Any"], ...Object.entries(OUTCOMES).map(([k, v]) => [k, v, count((e) => e.outcome === k)])]}
        />
        <Filter label="Checklist" value={verdict} onChange={setVerdict} options={[["all", "Any"], ...Object.entries(VERDICTS).map(([k, v]) => [k, v, count((e) => e.verdict === k)])]} />
        <Filter
          label="Market"
          value={market}
          onChange={setMarket}
          options={[
            ["all", "Both"],
            ["US", "US", count((e) => e.market === "US")],
            ["SET", "Thai", count((e) => e.market === "SET")],
          ]}
        />
      </div>

      {type !== "all" && (
        <div className="lib-blurb">
          <h2>{SETUPS[type].name}</h2>
          <p>{SETUPS[type].blurb}</p>
        </div>
      )}

      <div className="lib-bar">
        <p>
          {list.length === LIBRARY.length ? `All ${list.length} setups` : `${list.length} of ${LIBRARY.length} setups`}
          {outcome !== "all" || verdict !== "all" ? ". The filter gives the answer away, so use it to study a pattern, not to quiz yourself." : ""}
        </p>
        <button type="button" className="btn btn-primary" onClick={random} disabled={!list.length}>
          Play a random one
        </button>
      </div>

      {list.length === 0 ? (
        <p className="empty">No setups match all of those filters. Loosen one of them.</p>
      ) : (
        <ul className="trade-list">
          {list.map((e) => (
            <li key={e.id}>
              <button type="button" className="trade-card" onClick={() => setOpen(e.id)}>
                <span className="trade-market">{e.market === "SET" ? "Thai" : "US"}</span>
                <span className="trade-title">{e.title}</span>
                <span className="trade-setup">{SETUPS[e.type].name}</span>
                {played[e.id] ? (
                  <span className={`trade-status outcome-${e.outcome}`}>
                    <Icon name={e.outcome === "failed" ? "x" : "check"} size={14} /> {OUTCOMES[e.outcome]}, {signedR(e.rulesR)}. Checklist: {VERDICTS[e.verdict].toLowerCase()}
                  </span>
                ) : (
                  <span className="trade-status">Not played yet</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
