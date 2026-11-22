import { useMemo, useState } from "react";
import { SERIES, emaArr } from "../lib/library";
import { fmtDate } from "../lib/market";

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


const BUCKET_NAME = { leading: "Leading", mediocre: "Mediocre", lagging: "Lagging" };

function buildUniverse() {
  const out = {};
  Object.entries(SERIES.symbols).forEach(([sym, m]) => {
    if (sym === SERIES.index.US || sym === SERIES.index.SET) return;
    const rows = m.rows;
    const c = rows.map((r) => r[4]);
    out[sym] = { sym, name: m.name, market: m.market, currency: m.currency, rows, e50: emaArr(c, 50), e150: emaArr(c, 150) };
  });
  return out;
}

function classify(u, date) {
  let i = u.rows.length - 1;
  while (i >= 0 && u.rows[i][0] > date) i--;
  if (i < 150 || u.e150[i] == null) return null;
  const r = u.rows[i];
  const close = r[4];
  const e50 = u.e50[i];
  const e150 = u.e150[i];
  const from = Math.max(0, i - 19);
  let dv = 0;
  let adr = 0;
  for (let k = from; k <= i; k++) {
    dv += u.rows[k][4] * u.rows[k][5];
    adr += u.rows[k][2] / u.rows[k][3] - 1;
  }
  const n = i - from + 1;
  const bucket = close > e50 && e50 > e150 ? "leading" : close < e50 && e50 < e150 ? "lagging" : "mediocre";
  return { ...u, date: r[0], close, e50, e150, dv: dv / n, adr: (adr / n) * 100, bucket };
}

function WatchlistSorter() {
  const universe = useMemo(buildUniverse, []);
  const dates = useMemo(() => {
    const ref = SERIES.symbols[SERIES.index.US].rows.map((r) => r[0]);
    return ref.slice(160);
  }, []);
  const [market, setMarket] = useState("US");
  const [idx, setIdx] = useState(dates.length - 1);
  const [liquidOnly, setLiquidOnly] = useState(true);
  const date = dates[idx];
  const rows = useMemo(
    () =>
      Object.values(universe)
        .filter((u) => u.market === market)
        .map((u) => classify(u, date))
        .filter(Boolean)
        .filter((r) => !liquidOnly || market !== "US" || r.dv >= 100e6)
        .sort((a, b) => ["leading", "mediocre", "lagging"].indexOf(a.bucket) - ["leading", "mediocre", "lagging"].indexOf(b.bucket) || b.close / b.e50 - a.close / a.e50),
    [universe, market, date, liquidOnly]
  );
  const counts = rows.reduce((acc, r) => ({ ...acc, [r.bucket]: (acc[r.bucket] || 0) + 1 }), {});
  const cur = market === "US" ? "$" : "฿";
  const money = (v) => (v >= 1e9 ? `${cur}${(v / 1e9).toFixed(1)}B` : `${cur}${Math.round(v / 1e6)}M`);
  const px = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section className="tool" aria-labelledby="sorter-title">
      <h2 id="sorter-title">Martin Luk's watchlist sorter</h2>
      <p className="tool-intro">
        His 2026 rules on the daily chart: leading if the price is above the 50 EMA and the 50 EMA is above the 150 EMA, lagging if both are reversed, mediocre otherwise. Move the date back to watch stocks change lists, and watch the counts: that's how he reads breadth.
      </p>
      <div className="segmented" role="radiogroup" aria-label="Market">
        {[
          ["US", "US"],
          ["SET", "Thai (SET)"],
        ].map(([k, label]) => (
          <button key={k} type="button" role="radio" aria-checked={market === k} className={market === k ? "is-on" : ""} onClick={() => setMarket(k)}>
            {label}
          </button>
        ))}
      </div>
      <div className="field">
        <label htmlFor="sorter-date">Date: {fmtDate(date)}</label>
        <input id="sorter-date" type="range" min={0} max={dates.length - 1} value={idx} onChange={(e) => setIdx(Number(e.target.value))} />
      </div>
      {market === "US" && (
        <label className="check-row">
          <input type="checkbox" checked={liquidOnly} onChange={(e) => setLiquidOnly(e.target.checked)} /> Only stocks trading at least $100M a day (his minimum)
        </label>
      )}
      <div className="bucket-counts" aria-live="polite">
        {["leading", "mediocre", "lagging"].map((b) => (
          <span key={b} className={`bucket bucket-${b}`}>
            {BUCKET_NAME[b]}: {counts[b] || 0}
          </span>
        ))}
      </div>
      <div className="table-scroll">
        <table className="bucket-table">
          <thead>
            <tr>
              <th scope="col">Stock</th>
              <th scope="col">List</th>
              <th scope="col">Close</th>
              <th scope="col">50 EMA</th>
              <th scope="col">150 EMA</th>
              <th scope="col">Avg daily value</th>
              <th scope="col">ADR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.sym}>
                <td>
                  <strong>{r.sym}</strong>
                </td>
                <td>
                  <span className={`bucket bucket-${r.bucket}`}>{BUCKET_NAME[r.bucket]}</span>
                </td>
                <td>{px(r.close)}</td>
                <td>{px(r.e50)}</td>
                <td>{px(r.e150)}</td>
                <td>{money(r.dv)}</td>
                <td>{r.adr.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="tool-intro">
        Average daily value is the 20-day average of close × volume. ADR is the 20-day average of high ÷ low − 1. Kabu's universe is about 50 stocks; Martin sorts the hundreds his scans find.
      </p>
    </section>
  );
}

function TightStopCalc() {
  const [move, setMove] = useState("25");
  const [stopA, setStopA] = useState("3");
  const [stopB, setStopB] = useState("1.5");
  const m = num(move);
  const a = num(stopA);
  const b = num(stopB);
  const ok = [m, a, b].every((v) => Number.isFinite(v) && v > 0);
  const ra = ok ? m / a : 0;
  const rb = ok ? m / b : 0;
  return (
    <section className="tool" aria-labelledby="rstop-title">
      <h2 id="rstop-title">Tight-stop calculator</h2>
      <p className="tool-intro">Martin's favourite slide: the same move is worth far more R with a tighter stop. Change the numbers to see how many extra losing trades the tighter stop pays for.</p>
      <div className="fields">
        <Field label="The stock rises" value={move} onChange={setMove} suffix="%" />
        <Field label="Wide stop" value={stopA} onChange={setStopA} suffix="%" />
        <Field label="Tight stop" value={stopB} onChange={setStopB} suffix="%" />
      </div>
      {ok ? (
        <div className="result" aria-live="polite">
          <p className="result-main">
            With the wide stop the move is worth <strong>{ra.toFixed(1)}R</strong>. With the tight stop it's worth <strong>{rb.toFixed(1)}R</strong>.
          </p>
          <p>
            The tight stop adds <strong>{(rb - ra).toFixed(1)}R</strong>: enough to cover about {Math.floor(rb - ra)} extra stop-outs of 1R each.
          </p>
        </div>
      ) : (
        <p className="tool-error" role="alert">Fill in every box with a number above zero.</p>
      )}
    </section>
  );
}

export default function Tools() {
  return (
    <div className="page">
      <h1>Tools</h1>
      <p className="lede">Small tools from both courses. Use them before every paper trade.</p>
      <SizeCalculator />
      <Simulator />
      <WatchlistSorter />
      <TightStopCalc />
    </div>
  );
}
