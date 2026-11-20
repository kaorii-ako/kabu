import { useMemo, useState } from "react";
import Chart from "./Chart";
import Icon from "./Icon";
import { checks, VERDICTS } from "../content/trades";
import { plan, startState, stepDay, trim, sellAll, finish, hints, runRules, result, tradeBars } from "../lib/engine";
import { fmtDate } from "../lib/market";

function money(n, cur) {
  const sign = n < 0 ? "−" : "";
  const v = Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
  return `${sign}${cur === "THB" ? "฿" : "$"}${v}`;
}

function signed(n, d = 1, suffix = "") {
  return `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(d)}${suffix}`;
}

export default function TradeSim({ t, onComplete }) {
  const all = useMemo(() => tradeBars(t), [t]);
  const setupIdx = all.findIndex((b) => b.date >= t.setup);
  const from = all[Math.max(0, setupIdx - 55)].date;
  const list = useMemo(() => checks(t), [t]);
  const [phase, setPhase] = useState("brief");
  const [answers, setAnswers] = useState([]);
  const [choice, setChoice] = useState(null);
  const [sim, setSim] = useState(null);
  const [p, setP] = useState(null);

  const cur = t.currency;
  const sym = cur === "THB" ? "฿" : "$";
  const canTrade = t.facts.entry != null;

  const lines = [];
  if (p && sim) {
    if (sim.trimmed && sim.shares > 0) lines.push({ price: p.entry, label: "Entry, now the stop", tone: "stop" });
    else {
      lines.push({ price: p.entry, label: "Entry", tone: "pivot" });
      if (sim.shares > 0) lines.push({ price: sim.stop, label: "Stop", tone: "stop" });
    }
  }
  const upto = sim ? all[sim.i].date : phase === "outcome" ? null : t.setup;
  const spec = { ex: `trade_${t.id}`, from, mas: [10, 20, 50], lines, reveal: upto ? { upto } : undefined };

  const decide = (c) => {
    setChoice(c);
    setPhase("verdict");
  };

  const begin = () => {
    const size = choice === "take" ? false : choice === "smaller" ? true : t.verdict === "smaller";
    const pl = plan(t, size);
    setP(pl);
    setSim(startState(t, pl));
    setPhase("replay");
  };

  const end = (s) => {
    setSim(s);
    setPhase("done");
    onComplete?.();
  };

  const act = (fn) => {
    const s = fn(sim);
    if (s.done) end(s);
    else setSim(s);
  };

  const next = () => {
    const s = stepDay(sim, p);
    if (s.done) return end(s);
    if (s.atEnd) return end(finish(s));
    setSim(s);
  };

  const rules = useMemo(() => (p ? runRules(t, p) : null), [t, p]);
  const h = sim && phase === "replay" ? hints(sim, p) : [];
  const bar = sim ? all[sim.i] : null;
  const extHint = h.find((x) => x.action === "ext");
  const live = sim && p ? result(sim, p) : null;

  return (
    <div className="sim-trade">
      <div className="sim-head">
        <h2>{t.title}</h2>
        <p>{t.story}</p>
      </div>

      <Chart spec={spec} revealed={phase === "outcome" || phase === "done"} height={340} />

      {phase === "brief" && (
        <div className="sim-panel">
          <p className="sim-group">{t.group}</p>
          <button type="button" className="btn btn-primary" onClick={() => setPhase("checks")}>
            Run Ariel's checklist
          </button>
        </div>
      )}

      {phase === "checks" && (
        <div className="sim-panel">
          <ol className="checks">
            {list.map((c, k) => {
              const a = answers[k];
              if (k > answers.length) return null;
              return (
                <li key={c.key} className={a == null ? "" : a === c.yes ? "is-right" : "is-wrong"}>
                  <p>{c.q}</p>
                  {a == null ? (
                    <div className="yn">
                      <button type="button" className="btn btn-quiet" onClick={() => setAnswers([...answers, true])}>
                        Yes
                      </button>
                      <button type="button" className="btn btn-quiet" onClick={() => setAnswers([...answers, false])}>
                        No
                      </button>
                    </div>
                  ) : (
                    <p className="check-result">
                      <Icon name={a === c.yes ? "check" : "x"} size={16} />
                      {c.explain}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
          {answers.length === list.length && (
            <div className="decide">
              <p>
                The setup: <strong>{t.pattern}</strong>. Your call?
              </p>
              <div className="decide-row">
                {Object.entries(VERDICTS).map(([k, label]) => (
                  <button key={k} type="button" className="btn btn-quiet" onClick={() => decide(k)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {phase === "verdict" && (
        <div className={`sim-panel verdict ${choice === t.verdict ? "is-right" : "is-wrong"}`}>
          <p className="verdict-line">
            You chose <strong>{VERDICTS[choice].toLowerCase()}</strong>. Ariel's rules say <strong>{VERDICTS[t.verdict].toLowerCase()}</strong>.
          </p>
          <p>{t.why}</p>
          {canTrade && t.verdict !== "pass" ? (
            <button type="button" className="btn btn-primary" onClick={begin}>
              {choice === "pass" ? "Replay it with the rules anyway" : "Place the trade"}
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => { setPhase("outcome"); onComplete?.(); }}>
              See what happened next
            </button>
          )}
        </div>
      )}

      {phase === "outcome" && (
        <div className="sim-panel">
          <p>
            That's the rest of the chart. A pass is a decision too: the rules keep you out of trades where the risk is unclear, even when some of them work out.
          </p>
        </div>
      )}

      {(phase === "replay" || phase === "done") && sim && (
        <div className="sim-panel">
          <dl className="position">
            <div>
              <dt>Day</dt>
              <dd>
                {sim.day} <small>{fmtDate(bar.date)}</small>
              </dd>
            </div>
            <div>
              <dt>Shares held</dt>
              <dd>{sim.shares.toLocaleString("en-US")}</dd>
            </div>
            <div>
              <dt>Stop</dt>
              <dd>{sim.shares ? `${sym}${sim.stop}` : "None"}</dd>
            </div>
            <div>
              <dt>Result so far</dt>
              <dd className={live.pnl >= 0 ? "up" : "down"}>
                {signed(live.r, 1, "R")} <small>{money(live.pnl, cur)}</small>
              </dd>
            </div>
          </dl>
          <p className="plan-note">
            Account {money(p.account, cur)}. Risking {p.riskPct}% means {money(p.account * p.riskPct / 100, cur)} at most; the stop is {sym}
            {p.perShare.toFixed(2)} away, so you bought {p.shares.toLocaleString("en-US")} shares ({money(p.value, cur)})
            {p.capped ? `, capped at ${p.riskPct < 0.5 ? "7.5" : "15"}% of the account` : ""}{p.lot > 1 ? ` in lots of ${p.lot}` : ""}.
          </p>

          {phase === "replay" && (
            <>
              {h.length > 0 && (
                <ul className="hints">
                  {h.map((x) => (
                    <li key={x.action}>{x.text}</li>
                  ))}
                </ul>
              )}
              <div className="sim-actions">
                <button type="button" className="btn btn-primary" onClick={next}>
                  Next day
                </button>
                <button type="button" className="btn btn-quiet" onClick={() => act((s) => trim({ ...s, extLevel: extHint ? extHint.level : s.extLevel }, p, 1 / 3))} disabled={sim.day === 1}>
                  Trim a third
                </button>
                <button type="button" className="btn btn-quiet" onClick={() => act((s) => trim({ ...s, extLevel: extHint ? extHint.level : s.extLevel }, p, 0.5))} disabled={sim.day === 1}>
                  Trim half
                </button>
                <button type="button" className="btn btn-danger" onClick={() => act((s) => sellAll(s))} disabled={sim.day === 1}>
                  Sell the rest
                </button>
              </div>
              <p className="sim-help">Day 1 is the day you buy. Sells happen at the day's close; the stop triggers by itself.</p>
            </>
          )}

          {phase === "done" && rules && (
            <div className="compare">
              <div>
                <h3>You</h3>
                <p className={live.pnl >= 0 ? "up" : "down"}>
                  {signed(live.r, 1, "R")}, {signed(live.accountPct, 2, "%")} on the account
                </p>
              </div>
              <div>
                <h3>Ariel's rules</h3>
                {(() => {
                  const rr = result(rules, p);
                  return (
                    <p className={rr.pnl >= 0 ? "up" : "down"}>
                      {signed(rr.r, 1, "R")}, {signed(rr.accountPct, 2, "%")} on the account
                    </p>
                  );
                })()}
                <ul className="rule-log">
                  {rules.log.slice(1).map((e, k) => (
                    <li key={k}>
                      Day {e.day}: {e.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <ol className="trade-log" aria-label="Your trade log">
            {sim.log.map((e, k) => (
              <li key={k} className={`log-${e.kind}`}>
                <span>Day {e.day}</span> {e.text}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
