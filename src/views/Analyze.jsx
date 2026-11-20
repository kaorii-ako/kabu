import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "../components/Chart";
import Icon from "../components/Icon";
import { SYMBOLS, symbolBars, symbolMeta, indexFor, registerUpload, SERIES } from "../lib/library";
import { SETUPS, factsAt, latestSetups, setupDays, indicators, parseCsv, niceDate, money } from "../lib/analyze";
import { plan, runRules, result } from "../lib/engine";
import { VERDICTS } from "../content/trades";

let uploadCount = 0;

const sgn = (v, d = 1) => (v == null ? "n/a" : `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(d)}%`);
const signedR = (r) => `${r >= 0 ? "+" : "−"}${Math.abs(r).toFixed(1)}R`;

function dayChecklist(f, meta, hasIdx) {
  const m = (v) => money(v, meta.currency);
  const rows = [];
  if (hasIdx) {
    const idxName = f.idxSym === "TDEX" ? "The SET50 fund (TDEX)" : "QQQ";
    const above = f.idxClose > f.idxMa50;
    const rising = f.idxMa50 >= f.idxMa50_10ago;
    rows.push({
      key: "market",
      label: "Market",
      ok: above && rising ? "yes" : "no",
      text: `${idxName} is ${above ? "above" : "under"} its 50-day average, and that average is ${rising ? "flat or rising" : "falling"}. ${above && rising ? "A healthy market: normal size." : "Weak or choppy: trade smaller and prefer pullbacks to breakouts."}`,
    });
    const rs = f.ret3m > f.idxRet3m + 2 || (f.ret6m != null && f.idxRet6m != null && f.ret6m > f.idxRet6m + 2);
    rows.push({
      key: "rs",
      label: "Relative strength",
      ok: rs ? "yes" : "no",
      text: `${meta.symbol} ${sgn(f.ret3m)} over three months against ${sgn(f.idxRet3m)} for ${f.idxSym}${f.ret6m != null && f.idxRet6m != null ? `, and ${sgn(f.ret6m)} against ${sgn(f.idxRet6m)} over six` : ""}. ${rs ? "A leader." : "Not a leader. Ariel only buys stocks that beat the market."}`,
    });
  } else {
    rows.push({ key: "market", label: "Market and relative strength", ok: "info", text: "Not checked: Kabu only has index data up to " + niceDate(SERIES.asOf) + ", and your file's dates are outside it. Check the index and the stock's group yourself first." });
  }
  const trend = f.ma20 > f.ma50;
  const above = [10, 20, 50].filter((k) => f.close > f[`ma${k}`]);
  rows.push({
    key: "trend",
    label: "Trend",
    ok: trend && above.length === 3 ? "yes" : trend ? "warn" : "no",
    text: `20-day ${m(f.ma20)} is ${trend ? "above" : "under"} the 50-day ${m(f.ma50)}. The close is above ${above.length === 3 ? "all three of the 10, 20 and 50-day averages" : above.length ? above.map((k) => `the ${k}-day`).join(" and ") + " only" : "none of the 10, 20 and 50-day averages"}.`,
  });
  rows.push({
    key: "ext",
    label: "Extension",
    ok: f.ext <= 4 && f.ext >= -1 ? "yes" : f.ext >= 7 ? "warn" : "no",
    text:
      f.ext >= 7
        ? `${f.ext} ATR above the 50-day. If you already own it, this is Ariel's trim zone: about 10% of what's left at 7 ATR and every ATR after. Don't start a new position.`
        : f.ext > 4
          ? `${f.ext} ATR above the 50-day. Too far for a new position; wait for a base or a pullback.`
          : f.ext < -1
            ? `${Math.abs(f.ext)} ATR under the 50-day. Nothing to buy until it is back above.`
            : `${f.ext} ATR from the 50-day. Not extended.`,
  });
  rows.push({
    key: "atr",
    label: "Volatility",
    ok: "info",
    text: `ATR ${m(f.atr)}, about ${f.adrPct}% a day. A stop should sit within 1 to 1.5 ATR (${m(f.atr)} to ${m(f.atr * 1.5)}) of the entry, and Ariel won't buy once it has moved ${f.adrPct}% on the day.`,
  });
  return rows;
}

function planText(s, meta, ev) {
  const m = (v) => money(v, meta.currency);
  const f = s.facts;
  if (ev.verdict === "pass") return null;
  if (f.entry === undefined) {
    return `Trigger: buy if it trades above ${m(f.trigger)}, the high of ${niceDate(s.date)} plus one tick. Stop: just under the low of the day you buy, and skip it if that low is more than 1.5 ATR (${m(f.atr * 1.5)}) under your price or if it's already up more than ${f.adrPct}% when it triggers. Risk ${ev.verdict === "smaller" ? "0.25%" : "0.5%"} of the account.`;
  }
  if (f.entry == null) return `It didn't trigger: ${niceDate(f.entryDate)} never traded above ${m(f.trigger)}. No trade, no loss.`;
  return `It triggered on ${niceDate(f.entryDate)} at ${m(f.entry)}${f.moveAtEntry != null ? `, up ${f.moveAtEntry}% on the day` : ""}. The stop went just under that day's low of ${m(f.entryDayLow)}, ${f.stopAtr} ATR away.`;
}

function useSample() {
  const [sample, setSample] = useState(undefined);
  const [images, setImages] = useState(false);
  useEffect(() => {
    let on = true;
    const c = typeof window !== "undefined" ? window.claude : null;
    if (!c || typeof c.use !== "function") {
      setSample(null);
      return;
    }
    c.use("sample")
      .then(async (s) => {
        if (!on) return;
        setSample(() => s || null);
        if (s && typeof s.limits === "function") {
          try {
            const l = await s.limits();
            if (on) setImages(Boolean(l?.images));
          } catch {
            if (on) setImages(false);
          }
        }
      })
      .catch(() => on && setSample(null));
    return () => {
      on = false;
    };
  }, []);
  return [sample, images, () => setSample(null)];
}

function buildPrompt({ meta, b, i, facts, setups, rows, question, shotOnly, hasShot }) {
  const rules = `You are a trading coach teaching a beginner Ariel Hernandez's swing-trading process. His rules:
- Market first: trade normal size when the index (QQQ for US, the SET50 for Thai stocks) is above a flat or rising 50-day average; trade smaller in a weak or choppy market and prefer pullbacks to breakouts there.
- Only buy leaders: stocks beating the index over 3 or 6 months, in a leading group, with the 20-day average above the 50-day.
- Setups: flat base (tight sideways range near highs above rising averages), undercut and rally (dip under a meaningful prior low, close back above), MA undercut and rally (dip under the 10, 20 or 50-day, close back above), pullback to a rising 10 or 20-day, gap up on heavy volume, high tight flag. A rally into a falling 50-day is a pass.
- Entry: buy the break of the prior day's high. Never buy once the stock has already moved its average daily range on the day.
- Stop: just under the low of the entry day, within 1 to 1.5 ATR. Risk 0.5% of the account per trade (at most 1%), position at most 15%.
- No new position more than about 4 ATR above the 50-day. Trim a third to half on an 8 to 20% move in days 3 to 5; trim about 10% of what's left at 7 ATR above the 50-day and each ATR after.
- He is right only about 35 to 37% of the time; small losses and bigger winners make the money.`;
  const fmt = (v) => (v == null ? "" : +v.toFixed(v >= 100 ? 2 : 3));
  const table = b
    .slice(Math.max(0, i - 59), i + 1)
    .map((x) => [x.date, fmt(x.o), fmt(x.h), fmt(x.l), fmt(x.c), x.v, fmt(x.ma[10]), fmt(x.ma[20]), fmt(x.ma[50])].join(","))
    .join("\n");
  const data = shotOnly
    ? "Only the attached screenshot is given. Read the chart from it. If you can't read prices or dates from it, say so and keep the analysis to what you can see."
    : `Stock: ${meta.symbol} (${meta.name}), ${meta.market === "SET" ? "Thai SET, baht" : "US, dollars"}. Analysis date: ${b[i].date}. Use only data up to that date.
Rule-engine checklist for that day:
${rows.map((r) => `- ${r.label}: ${r.text}`).join("\n")}
Setups the rule engine detected in the last five sessions: ${setups.length ? setups.map((s) => `${SETUPS[s.type].name} on ${s.date} (verdict ${s.verdict}${s.reasons.length ? `: ${s.reasons.join(" ")}` : ""})`).join("; ") : "none"}.
Key numbers: close ${facts.close}, ATR ${facts.atr}, ${facts.ext} ATR from the 50-day.
Last 60 daily bars (date,open,high,low,close,volume,ma10,ma20,ma50):
${table}${hasShot ? "\nA screenshot of the user's chart is attached as well." : ""}`;
  const ask = question.trim() ? `The user's question: ${question.trim()}` : "Give your read of this chart.";
  return `${rules}

${data}

${ask}

Answer in plain text with no markdown symbols, in at most 220 words, in these short parts, each starting on its own line with its label:
What I see:
Setup:
Checklist:
Ariel's call: (take it, take it smaller, wait, or pass, with the trigger and stop if it is a trade)
What would change it:
Don't predict where the price will go. This is for learning, not financial advice.`;
}

function AskClaude({ ctx }) {
  const [sample, canImages, hide] = useSample();
  const [question, setQuestion] = useState("");
  const [shot, setShot] = useState(null);
  const [shotOnly, setShotOnly] = useState(false);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const abort = useRef(null);

  useEffect(() => () => abort.current?.abort(), []);

  if (sample === undefined) return null;
  if (sample === null) {
    return (
      <section className="ask is-off" aria-labelledby="ask-title">
        <h2 id="ask-title">Ask Claude about this chart</h2>
        <p>
          The written analysis above comes from Kabu's rule engine, which runs Ariel's checklist on the numbers. It isn't an AI. When you open Kabu inside Claude, this panel also lets you ask Claude to read the chart, or a screenshot of your own, against the same rules.
        </p>
      </section>
    );
  }

  const run = async () => {
    setBusy(true);
    setError("");
    setAnswer("");
    abort.current?.abort();
    const ctl = new AbortController();
    abort.current = ctl;
    try {
      const prompt = buildPrompt({ ...ctx, question, shotOnly: shotOnly && shot, hasShot: Boolean(shot) });
      const opts = { signal: ctl.signal, modelTier: "default", onText: ({ text }) => setAnswer(text) };
      if (shot && canImages) opts.images = [shot];
      const res = await sample(prompt, opts);
      setAnswer(res.text);
    } catch (e) {
      if (e?.code === "not_granted") hide();
      else if (e?.name === "AbortError") setError("");
      else if (e?.code === "rate_limited") setError("Claude is getting a lot of requests from this page. Wait a minute and ask again.");
      else setError(e?.message ? `Claude couldn't answer: ${e.message}` : "Claude couldn't answer. Try again.");
      if (e?.text) setAnswer(e.text);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="ask" aria-labelledby="ask-title">
      <h2 id="ask-title">Ask Claude about this chart</h2>
      <p>Claude gets Ariel's rules, the checklist above and the last 60 daily bars, and writes its own read. It can be wrong; check it against the rules.</p>
      <div className="field">
        <label htmlFor="ask-q">Your question (optional)</label>
        <textarea id="ask-q" rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Is this a real flat base, or is the range too loose?" />
      </div>
      {canImages && (
        <div className="ask-shot">
          <label className="btn btn-quiet file-btn">
            <Icon name="image" size={16} />
            {shot ? "Change screenshot" : "Add a chart screenshot"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setShot(f);
                e.target.value = "";
              }}
            />
          </label>
          {shot && (
            <>
              <span className="file-name">{shot.name}</span>
              <button type="button" className="link-btn" onClick={() => { setShot(null); setShotOnly(false); }}>
                Remove
              </button>
              <label className="check-line">
                <input type="checkbox" checked={shotOnly} onChange={(e) => setShotOnly(e.target.checked)} /> It's a different chart: use only the screenshot
              </label>
            </>
          )}
        </div>
      )}
      <button type="button" className="btn btn-primary" onClick={run} disabled={busy}>
        {busy ? "Claude is reading the chart…" : "Ask Claude"}
      </button>
      {error && <p className="form-error" role="alert">{error}</p>}
      {answer && (
        <div className="answer" aria-live="polite">
          {answer}
        </div>
      )}
    </section>
  );
}

function pickDefault() {
  const prefer = ["NVDA", "AMD", "PLTR", "DELTA", "KTB"];
  const order = [...prefer, ...SYMBOLS.map((s) => s.symbol).filter((s) => !prefer.includes(s))];
  for (const sym of order) {
    const meta = symbolMeta(sym);
    const b = symbolBars(sym);
    if (!meta || !b) continue;
    const idx = indexFor(meta.market);
    const hit = latestSetups(b, meta, idx, b.length - 1, 3).find((s) => s.verdict !== "pass");
    if (hit) return sym;
  }
  return "NVDA";
}

export default function Analyze() {
  const [source, setSource] = useState("data");
  const [symbol, setSymbol] = useState(pickDefault);
  const [upload, setUpload] = useState(null);
  const [uploadErr, setUploadErr] = useState("");
  const [uploadMarket, setUploadMarket] = useState("US");
  const [atBy, setAtBy] = useState({});
  const [showNext, setShowNext] = useState(false);

  const ctxBase = useMemo(() => {
    if (source === "csv") {
      if (!upload) return null;
      return upload;
    }
    return { key: `sym_${symbol}`, meta: symbolMeta(symbol), b: symbolBars(symbol) };
  }, [source, symbol, upload]);

  const days = useMemo(() => (ctxBase ? setupDays(ctxBase.b) : []), [ctxBase]);

  if (!ctxBase) {
    return (
      <section className="page page-wide">
        <AnalyzeHead source={source} setSource={setSource} />
        <Upload
          market={uploadMarket}
          setMarket={setUploadMarket}
          error={uploadErr}
          onFile={async (file) => {
            setUploadErr("");
            try {
              const rows = parseCsv(await file.text());
              const b = indicators(rows);
              const key = `upload_${++uploadCount}`;
              const name = file.name.replace(/\.[^.]+$/, "");
              const meta = { symbol: name.toUpperCase().slice(0, 12), name, market: uploadMarket, currency: uploadMarket === "SET" ? "THB" : "USD" };
              registerUpload(key, meta, b);
              setUpload({ key, meta, b });
            } catch (e) {
              setUploadErr(e.message || "Couldn't read that file.");
            }
          }}
        />
      </section>
    );
  }

  const { key, meta, b } = ctxBase;
  const last = b.length - 1;
  const minAt = Math.min(last, 60);
  const at = Math.min(last, Math.max(minAt, atBy[key] ?? last));
  const setAt = (v) => {
    setAtBy({ ...atBy, [key]: Math.min(last, Math.max(minAt, v)) });
    setShowNext(false);
  };

  const idx = indexFor(meta.market);
  const idxLast = idx.bars[idx.bars.length - 1].date;
  const hasIdx = b[at].date <= idxLast && b[at].date >= idx.bars[130].date;
  const facts = factsAt(b, at, meta, hasIdx ? idx : null).facts;
  const rows = dayChecklist(facts, meta, hasIdx);
  const setups = latestSetups(b, meta, hasIdx ? idx : null, at, 5);
  const shownFrom = setups.length ? Math.min(...setups.map((s) => s.i)) : at;
  const prevSetup = [...days].reverse().find((d) => d < shownFrom);
  const nextSetup = days.find((d) => d > at);

  const canPeek = at < last;
  const to = showNext ? Math.min(last, at + 45) : at;
  const from = Math.max(0, at - 100);
  const lines = [];
  const marks = setups.map((s) => ({ date: s.date, label: SETUPS[s.type].short, at: s.type === "rejection" ? "high" : "low", tone: s.type === "rejection" ? "stop" : "pivot" }));
  const zones = setups.filter((s) => s.type === "flat").map((s) => ({ from: s.info.startDate, to: s.date, lo: s.info.lo, hi: s.info.hi, tone: "pivot" }));
  const live = setups.find((s) => s.daysAgo === 0 && s.verdict !== "pass");
  if (live) lines.push({ price: live.facts.trigger, label: "Trigger", tone: "pivot" });

  const outcomes = showNext
    ? setups
        .filter((s) => s.full.entry != null)
        .map((s) => {
          const t = { id: `an-${s.date}`, symbol: meta.symbol, currency: meta.currency, market: meta.market, tick: s.tick, facts: s.full, bars: b };
          const p = plan(t, s.verdict === "smaller");
          if (!p || p.shares <= 0) return null;
          const st = runRules(t, p);
          return { s, r: result(st, p).r, days: st.day, exit: st.exitReason };
        })
        .filter(Boolean)
    : [];

  return (
    <section className="page page-wide">
      <AnalyzeHead source={source} setSource={setSource} />

      <div className="an-controls">
        {source === "data" ? (
          <div className="field">
            <label htmlFor="an-sym">Stock</label>
            <select id="an-sym" className="select" value={symbol} onChange={(e) => { setSymbol(e.target.value); setShowNext(false); }}>
              <optgroup label="US">
                {SYMBOLS.filter((s) => s.market === "US").map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol}, {s.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Thailand (SET)">
                {SYMBOLS.filter((s) => s.market === "SET").map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol}, {s.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        ) : (
          <div className="field">
            <span className="field-label">Your file</span>
            <p className="file-name">
              {meta.name}, {b.length} days{" "}
              <button type="button" className="link-btn" onClick={() => setUpload(null)}>
                Use another file
              </button>
            </p>
          </div>
        )}
        <div className="field an-date">
          <label htmlFor="an-day">Analyze as of {niceDate(b[at].date)}</label>
          <input id="an-day" type="range" min={minAt} max={last} value={at} onChange={(e) => setAt(+e.target.value)} />
          <div className="an-steps">
            <button type="button" className="btn btn-quiet btn-sm" onClick={() => setAt(prevSetup ?? at)} disabled={prevSetup == null}>
              Previous setup
            </button>
            <button type="button" className="btn btn-quiet btn-sm" onClick={() => setAt(at - 1)} disabled={at <= minAt} aria-label="One day back">
              <Icon name="back" size={16} />
            </button>
            <button type="button" className="btn btn-quiet btn-sm" onClick={() => setAt(at + 1)} disabled={at >= last} aria-label="One day forward">
              <Icon name="forward" size={16} />
            </button>
            <button type="button" className="btn btn-quiet btn-sm" onClick={() => setAt(nextSetup ?? at)} disabled={nextSetup == null}>
              Next setup
            </button>
            <button type="button" className="btn btn-quiet btn-sm" onClick={() => setAt(last)} disabled={at === last}>
              Latest
            </button>
          </div>
        </div>
      </div>

      <Chart key={`${key}-${at}-${showNext}`} spec={{ ex: key, from: b[from].date, to: b[to].date, mas: [10, 20, 50], marks, zones, lines}} height={360} />

      {canPeek && (
        <div className="an-peek">
          <button type="button" className="btn btn-quiet" onClick={() => setShowNext(!showNext)}>
            {showNext ? "Hide what happened next" : "Show what happened next"}
          </button>
        </div>
      )}

      <div className="an-grid">
        <section className="an-panel" aria-labelledby="an-setups">
          <h2 id="an-setups">Setups in the last five sessions</h2>
          {setups.length === 0 ? (
            <p className="an-none">
              None of Ariel's setups on {meta.symbol} up to {niceDate(b[at].date)}. That's the normal state: most days there is nothing to do.
              {nextSetup != null ? " Use Next setup to jump to the next one the engine found." : ""}
            </p>
          ) : (
            <ul className="an-setups">
              {setups.map((s) => {
                const pt = planText(s, meta, s);
                const o = outcomes.find((x) => x.s === s);
                return (
                  <li key={s.type + s.date} className={`an-setup verdict-${s.verdict}`}>
                    <div className="an-setup-head">
                      <h3>{SETUPS[s.type].name}</h3>
                      <span className={`verdict-chip v-${s.verdict}`}>{VERDICTS[s.verdict]}</span>
                    </div>
                    <p className="an-when">{s.daysAgo === 0 ? `Today, ${niceDate(s.date)}` : `${niceDate(s.date)}, ${s.daysAgo} session${s.daysAgo > 1 ? "s" : ""} ago`}</p>
                    <p>{SETUPS[s.type].blurb}</p>
                    {s.reasons.length > 0 && (
                      <ul className="an-reasons">
                        {s.reasons.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    )}
                    {pt && <p className="an-plan">{pt}</p>}
                    {o && (
                      <p className={`an-outcome ${o.r >= 0 ? "up" : "down"}`}>
                        With Ariel's rules: {signedR(o.r)}, out on day {o.days} ({o.exit === "stop" ? "stopped out" : o.exit === "end" ? "still open at the end of the data" : "sold by the trailing rule"}).
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="an-panel" aria-labelledby="an-check">
          <h2 id="an-check">Checklist for {niceDate(b[at].date)}</h2>
          <ul className="an-checks">
            {rows.map((r) => (
              <li key={r.key} className={`an-check is-${r.ok}`}>
                <span className="an-icon" aria-hidden="true">
                  <Icon name={r.ok === "yes" ? "check" : r.ok === "no" ? "x" : r.ok === "warn" ? "alert" : "info"} size={16} />
                </span>
                <div>
                  <strong>{r.label}</strong>
                  <p>{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <AskClaude ctx={{ meta, b, i: at, facts, setups, rows }} />

      <p className="fine">
        The analysis is a set of fixed rules applied to daily bars, written to teach Ariel Hernandez's process. It can miss context he would weigh, like news, the stock's group or intraday action. Not financial advice.
      </p>
    </section>
  );
}

function AnalyzeHead({ source, setSource }) {
  return (
    <>
      <h1>Chart analyzer</h1>
      <p className="lede">Pick a stock and a day. Kabu runs Ariel's checklist on that day, looks for his setups, and tells you what the rules say to do. Step back in time to test yourself, then show what happened next.</p>
      <div className="segmented page-tabs" role="tablist" aria-label="Data source">
        {[
          ["data", "Kabu's stocks"],
          ["csv", "Your CSV"],
        ].map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={source === k} className={source === k ? "is-on" : ""} onClick={() => setSource(k)}>
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

function Upload({ market, setMarket, error, onFile }) {
  return (
    <div className="upload-box">
      <h2>Analyze your own data</h2>
      <p>
        Upload daily bars as a CSV with Date, Open, High, Low, Close and Volume columns. Yahoo Finance's historical data download and TradingView's chart export both work. Use at least 130 days so the six-month checks have data.
      </p>
      <div className="segmented" role="radiogroup" aria-label="Market">
        {[
          ["US", "US stock"],
          ["SET", "Thai stock"],
        ].map(([k, label]) => (
          <button key={k} type="button" role="radio" aria-checked={market === k} className={market === k ? "is-on" : ""} onClick={() => setMarket(k)}>
            {label}
          </button>
        ))}
      </div>
      <label className="btn btn-primary file-btn">
        <Icon name="upload" size={16} />
        Choose a CSV file
        <input
          type="file"
          accept=".csv,text/csv,text/plain"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = "";
          }}
        />
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <p className="fine">The file stays in your browser. Nothing is uploaded anywhere.</p>
    </div>
  );
}
