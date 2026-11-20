import { useMemo, useState } from "react";

function num(v) {
  const n = Number(String(v).replace(/[,฿$\s]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

function Field({ label, value, onChange, suffix, prefix, step = "any", hint }) {
  const id = label.replace(/\W+/g, "-").toLowerCase();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="field-input">
        {prefix && <span className="calc-unit">{prefix}</span>}
        <input id={id} inputMode="decimal" step={step} value={value} onChange={(e) => onChange(e.target.value)} />
        {suffix && <span className="calc-unit">{suffix}</span>}
      </div>
      {hint && <small>{hint}</small>}
    </div>
  );
}

function SizeCalculator() {
  const [market, setMarket] = useState("SET");
  const [account, setAccount] = useState("100000");
  const [riskPct, setRiskPct] = useState("0.5");
  const [entry, setEntry] = useState("43.75");
  const [stop, setStop] = useState("41.75");
  const cur = market === "SET" ? "฿" : "$";

  const r = useMemo(() => {
    const A = num(account);
    const p = num(riskPct) / 100;
    const e = num(entry);
    const s = num(stop);
    if (![A, p, e, s].every(Number.isFinite) || A <= 0 || p <= 0 || e <= 0) return { error: "Fill in every box with a number." };
    if (s >= e) return { error: "For a buy, the stop has to be below the entry price." };
    const perShare = e - s;
    const budget = A * p;
    const raw = budget / perShare;
    const lot = market === "SET" ? (e >= 500 ? 50 : 100) : 1;
    const shares = Math.floor(raw / lot) * lot;
    const value = shares * e;
    return { perShare, budget, raw, lot, shares, value, pct: (value / A) * 100, risk: shares * perShare, stopPct: (perShare / e) * 100 };
  }, [market, account, riskPct, entry, stop]);

  const f = (n, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <section className="tool" aria-labelledby="size-title">
      <h2 id="size-title">Position size calculator</h2>
      <p className="tool-intro">Pick your stop first. The calculator turns your risk limit into a number of shares, rounded down to whole board lots for Thai stocks.</p>
      <div className="segmented" role="radiogroup" aria-label="Market">
        {[
          ["SET", "Thai (SET)"],
          ["US", "US"],
        ].map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={market === k}
            className={market === k ? "is-on" : ""}
            onClick={() => {
              setMarket(k);
              if (k === "US") {
                setAccount("10000");
                setEntry("17.26");
                setStop("16.35");
              } else {
                setAccount("100000");
                setEntry("43.75");
                setStop("41.75");
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="fields">
        <Field label="Account size" prefix={cur} value={account} onChange={setAccount} />
        <Field label="Risk per trade" suffix="%" value={riskPct} onChange={setRiskPct} hint="Ariel's limit is 1%, often 0.5%." />
        <Field label="Entry price" prefix={cur} value={entry} onChange={setEntry} />
        <Field label="Stop price" prefix={cur} value={stop} onChange={setStop} hint="Usually the low of the entry day or the prior day." />
      </div>
      {r.error ? (
        <p className="tool-error" role="alert">
          {r.error}
        </p>
      ) : (
        <div className="result" aria-live="polite">
          <p className="result-main">
            Buy <strong>{r.shares.toLocaleString("en-US")}</strong> shares
          </p>
          <dl>
            <div>
              <dt>Risk per share</dt>
              <dd>
                {cur}
                {f(r.perShare)} ({f(r.stopPct, 1)}% below entry)
              </dd>
            </div>
            <div>
              <dt>Most you may lose</dt>
              <dd>
                {cur}
                {f(r.budget)}
              </dd>
            </div>
            <div>
              <dt>Actual risk</dt>
              <dd>
                {cur}
                {f(r.risk)}
              </dd>
            </div>
            <div>
              <dt>Position value</dt>
              <dd>
                {cur}
                {f(r.value)} ({f(r.pct, 1)}% of the account)
              </dd>
            </div>
          </dl>
          {market === "SET" && r.shares === 0 && (
            <p className="tool-warn">Even one board lot ({r.lot} shares) risks more than your limit. Skip the trade or find a tighter stop.</p>
          )}
          {market === "SET" && r.shares > 0 && Math.floor(r.raw) !== r.shares && (
            <p className="tool-note">
              Your limit allows {Math.floor(r.raw).toLocaleString("en-US")} shares; rounded down to lots of {r.lot}.
            </p>
          )}
          {r.pct > 15 && <p className="tool-warn">This position is over 15% of the account because the stop is tight. Ariel's positions usually sit between 5% and 15%.</p>}
          {r.shares > 0 && r.pct < 5 && <p className="tool-note">Under 5% of the account. That's fine; a wide stop means a small position.</p>}
        </div>
      )}
    </section>
  );
}

function simulate({ win, avgWin, avgLoss, risk, trades, paths }) {
  const out = [];
  for (let p = 0; p < paths; p += 1) {
    let eq = 100;
    let streak = 0;
    let worst = 0;
    let peak = 100;
    let dd = 0;
    const pts = [eq];
    for (let t = 0; t < trades; t += 1) {
      const isWin = Math.random() < win;
      const R = isWin ? avgWin * (0.4 + Math.random() * 1.2) : -avgLoss;
      eq *= 1 + (risk * R) / 100;
      streak = isWin ? 0 : streak + 1;
      worst = Math.max(worst, streak);
      peak = Math.max(peak, eq);
      dd = Math.max(dd, (peak - eq) / peak);
      pts.push(eq);
    }
    out.push({ pts, end: eq, worst, dd });
  }
  return out;
}

function Simulator() {
  const [win, setWin] = useState(40);
  const [avgWin, setAvgWin] = useState("2.5");
  const [avgLoss, setAvgLoss] = useState("1");
  const [risk, setRisk] = useState("0.5");
  const [seed, setSeed] = useState(0);
  const trades = 100;

  const W = num(avgWin);
  const L = num(avgLoss);
  const Rk = num(risk);
  const valid = [W, L, Rk].every((v) => Number.isFinite(v) && v > 0) && Rk <= 10;
  const expectancy = valid ? (win / 100) * W - (1 - win / 100) * L : NaN;

  const runs = useMemo(
    () => (valid ? simulate({ win: win / 100, avgWin: W, avgLoss: L, risk: Rk, trades, paths: 40 }) : []),
    [win, W, L, Rk, valid, seed]
  );

  const sorted = [...runs].sort((a, b) => a.end - b.end);
  const median = sorted[Math.floor(sorted.length / 2)];
  const losers = runs.filter((r) => r.end < 100).length;
  const avgStreak = runs.length ? runs.reduce((s, r) => s + r.worst, 0) / runs.length : 0;

  const w = 640;
  const h = 240;
  let lo = Infinity;
  let hi = -Infinity;
  runs.forEach((r) => r.pts.forEach((v) => ((lo = Math.min(lo, v)), (hi = Math.max(hi, v)))));
  lo = Math.min(lo, 100) * 0.98;
  hi = Math.max(hi, 100) * 1.02;
  const x = (i) => (i / trades) * (w - 50);
  const y = (v) => 10 + ((hi - v) / (hi - lo)) * (h - 20);
  const line = (pts) => pts.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <section className="tool" aria-labelledby="sim-title">
      <h2 id="sim-title">Win rate and expectancy simulator</h2>
      <p className="tool-intro">Each line is one possible run of 100 trades with the numbers you choose. Losses are always the full average loss; wins vary around the average.</p>
      <div className="fields">
        <div className="field">
          <label htmlFor="win-rate">Win rate: {win}%</label>
          <input id="win-rate" type="range" min="10" max="90" value={win} onChange={(e) => setWin(Number(e.target.value))} />
        </div>
        <Field label="Average win" suffix="R" value={avgWin} onChange={setAvgWin} />
        <Field label="Average loss" suffix="R" value={avgLoss} onChange={setAvgLoss} />
        <Field label="Risk per trade" suffix="%" value={risk} onChange={setRisk} />
      </div>
      {!valid ? (
        <p className="tool-error" role="alert">
          Use positive numbers, and keep risk per trade at 10% or less.
        </p>
      ) : (
        <>
          <p className={`result-main ${expectancy >= 0 ? "up" : "down"}`}>
            Expectancy <strong>{expectancy >= 0 ? "+" : "−"}{Math.abs(expectancy).toFixed(2)}R</strong> per trade
          </p>
          <figure className="sim">
            <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`40 simulated runs. Median account ends at ${median?.end.toFixed(0)} from a start of 100.`}>
              <line className="grid base" x1="0" x2={w - 50} y1={y(100)} y2={y(100)} />
              <text className="axis" x={w - 44} y={y(100) + 4}>
                start
              </text>
              {runs.map((r, i) => (
                <polyline key={`${seed}-${i}`} className={`sim-path ${r.end >= 100 ? "up" : "down"}`} points={line(r.pts)} />
              ))}
              {median && <polyline className="sim-median" points={line(median.pts)} />}
              {median && (
                <text className="axis" x={w - 44} y={y(median.end) + 4}>
                  median
                </text>
              )}
            </svg>
          </figure>
          <dl className="sim-stats">
            <div>
              <dt>Median result</dt>
              <dd>
                {median.end >= 100 ? "+" : "−"}
                {Math.abs(median.end - 100).toFixed(1)}%
              </dd>
            </div>
            <div>
              <dt>Runs that lost money</dt>
              <dd>
                {losers} of {runs.length}
              </dd>
            </div>
            <div>
              <dt>Typical worst losing streak</dt>
              <dd>{avgStreak.toFixed(0)} in a row</dd>
            </div>
          </dl>
          <button type="button" className="btn btn-quiet" onClick={() => setSeed((s) => s + 1)}>
            Run 40 new simulations
          </button>
        </>
      )}
    </section>
  );
}

export default function Tools() {
  return (
    <div className="page">
      <h1>Tools</h1>
      <p className="lede">Two small tools from the risk unit. Use them before every paper trade.</p>
      <SizeCalculator />
      <Simulator />
    </div>
  );
}
