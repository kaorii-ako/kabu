import { useEffect, useMemo, useRef, useState } from "react";
import Chart, { GroupChart } from "./Chart";
import Icon from "./Icon";
import { group, fmtDate, fmtPrice, example } from "../lib/market";
import { VIDEOS, videoUrl } from "../content/course";
import TradeSim from "./TradeSim";
import { scenario } from "../content/trades";

function grade(step, answer) {
  if (answer == null) return false;
  if (step.type === "mcq") return answer === step.answer;
  if (step.type === "tap") {
    if (step.mode === "price") return answer.price >= step.target.lo && answer.price <= step.target.hi;
    return answer.date >= step.target.from && answer.date <= step.target.to;
  }
  if (step.type === "calc") {
    const v = Number(String(answer).replace(/[,฿$\s]/g, ""));
    return Number.isFinite(v) && Math.abs(v - step.answer) <= step.tolerance + 1e-9;
  }
  return true;
}

const PRAISE = ["Correct.", "That's it.", "Right.", "Yes, exactly.", "Spot on."];
const NUDGE = ["Not this time.", "Not quite.", "Close, but no.", "That one's wrong."];

export function VideoLink({ id }) {
  const v = VIDEOS[id];
  if (!v) return null;
  return (
    <a className="video-link" href={videoUrl(v)} target="_blank" rel="noreferrer">
      <span className="video-play">
        <Icon name="play" size={14} />
      </span>
      <span>
        Watch Ariel explain it
        <small>{v.title}, on YouTube</small>
      </span>
    </a>
  );
}

function Body({ paragraphs }) {
  return paragraphs.map((p, i) => <p key={i}>{p}</p>);
}

function StepView({ step, lesson, answer, setAnswer, status, onSubmit }) {
  const checked = status !== "idle";
  const inputRef = useRef(null);

  useEffect(() => {
    if (step.type === "calc" && inputRef.current) inputRef.current.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => {
    if (step.type !== "mcq" || checked) return;
    const onKey = (e) => {
      const n = Number(e.key);
      if (n >= 1 && n <= step.options.length && !e.metaKey && !e.ctrlKey) setAnswer(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, checked, setAnswer]);

  if (step.type === "read") {
    return (
      <div className="step step-read">
        <h2>{step.title}</h2>
        <div className="prose">
          <Body paragraphs={step.body} />
        </div>
        {step.chart && <Chart spec={step.chart} />}
        {step.group && <GroupChart series={group(step.group)} />}
        {(step.video || (lesson?.video && lesson.steps.find((s) => s.type === "read") === step)) && (
          <VideoLink id={step.video || lesson.video} />
        )}
      </div>
    );
  }

  if (step.type === "trade") {
    return (
      <div className="step">
        <TradeSim t={scenario(step.trade)} onComplete={() => setAnswer("done")} />
      </div>
    );
  }

  const prompt = <h2 className="question">{step.q}</h2>;

  if (step.type === "mcq") {
    return (
      <div className="step">
        {prompt}
        {step.chart && <Chart spec={step.chart} revealed={checked} />}
        {step.group && <GroupChart series={group(step.group)} />}
        <div className="options" role="radiogroup" aria-label="Answers">
          {step.options.map((opt, i) => {
            const state = checked ? (i === step.answer ? "is-right" : i === answer ? "is-wrong" : "is-muted") : answer === i ? "is-selected" : "";
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={answer === i}
                className={`option ${state}`}
                data-index={i}
                disabled={checked}
                onClick={() => setAnswer(i)}
                onDoubleClick={() => {
                  setAnswer(i);
                  onSubmit(i);
                }}
              >
                <kbd>{i + 1}</kbd>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (step.type === "tap") {
    const ex = example(step.chart.ex);
    const target = checked ? step.target : null;
    return (
      <div className="step">
        {prompt}
        <Chart
          spec={step.chart}
          tap={checked ? null : { mode: step.mode }}
          pick={answer}
          onPick={setAnswer}
          highlight={target}
        />
        <p className="pick-readout" aria-live="polite">
          {answer
            ? step.mode === "price"
              ? `Your price: ${fmtPrice(answer.price, ex.currency)}`
              : `Your pick: ${fmtDate(answer.date)}`
            : step.mode === "price"
              ? "Tap the chart at the price you mean. You can tap again to change it."
              : "Tap a candle. You can tap again to change it."}
        </p>
      </div>
    );
  }

  if (step.type === "calc") {
    return (
      <div className="step">
        {prompt}
        <form
          className="calc"
          onSubmit={(e) => {
            e.preventDefault();
            if (!checked && answer !== "" && answer != null) onSubmit();
          }}
        >
          <label htmlFor="calc-input">Your answer</label>
          <div className="calc-field">
            {step.unit === "฿" && <span className="calc-unit">฿</span>}
            <input
              id="calc-input"
              ref={inputRef}
              inputMode="decimal"
              autoComplete="off"
              value={answer ?? ""}
              disabled={checked}
              onChange={(e) => setAnswer(e.target.value)}
            />
            {step.unit && step.unit !== "฿" && <span className="calc-unit">{step.unit}</span>}
          </div>
        </form>
        {checked && (
          <p className="calc-answer">
            Answer: {step.unit === "฿" ? "฿" : ""}
            {step.answer.toLocaleString("en-US")}
            {step.unit && step.unit !== "฿" ? ` ${step.unit}` : ""}
          </p>
        )}
      </div>
    );
  }
  return null;
}

export default function Player({ title, items, onExit, onFinish, onGrade, note }) {
  const [queue, setQueue] = useState(() => items.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [status, setStatus] = useState("idle");
  const [retried, setRetried] = useState(() => new Set());
  const [firstTry, setFirstTry] = useState(0);
  const [missed, setMissed] = useState(() => new Set());
  const [done, setDone] = useState(false);
  const mainRef = useRef(null);
  const feedbackRef = useRef(null);

  const idx = queue[pos];
  const item = items[idx];
  const step = item?.step;
  const isQuestion = step && step.type !== "read" && step.type !== "trade";
  const blocked = step?.type === "trade" && answer == null;
  const questions = useMemo(() => items.filter((it) => it.step.type !== "read" && it.step.type !== "trade").length, [items]);
  const progress = done ? 1 : pos / queue.length;
  const verdict = useMemo(() => {
    const list = status === "right" ? PRAISE : NUDGE;
    return list[(pos * 7 + idx) % list.length];
  }, [status, pos, idx]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pos]);

  useEffect(() => {
    if (status !== "idle") feedbackRef.current?.focus({ preventScroll: true });
  }, [status]);

  function submit(override) {
    const a = override ?? answer;
    const ok = grade(step, a);
    setStatus(ok ? "right" : "wrong");
    if (onGrade) onGrade(item, ok);
    if (ok && !missed.has(idx)) setFirstTry((n) => n + 1);
    if (!ok) {
      setMissed((m) => new Set(m).add(idx));
      if (!retried.has(idx)) {
        setRetried((r) => new Set(r).add(idx));
        setQueue((q) => [...q, idx]);
      }
    }
  }

  function next() {
    setAnswer(null);
    setStatus("idle");
    if (pos + 1 >= queue.length) {
      setDone(true);
      onFinish?.({ firstTry, questions });
    } else setPos(pos + 1);
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter" || done) return;
      if (e.target.tagName === "INPUT" && status === "idle") return;
      if (e.target.classList?.contains("option")) {
        e.preventDefault();
        if (status === "idle") {
          const i = Number(e.target.dataset.index);
          setAnswer(i);
          submit(i);
        } else next();
        return;
      }
      if (e.target.tagName === "svg" || e.target.closest?.("svg")) return;
      if (blocked) return;
      if (!isQuestion || status !== "idle") {
        e.preventDefault();
        next();
      } else if (answer != null && answer !== "") {
        e.preventDefault();
        submit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const ready = answer != null && answer !== "";

  return (
    <div className="player">
      <header className="player-bar">
        <button type="button" className="icon-btn" onClick={onExit} aria-label="Leave and go back">
          <Icon name="x" />
        </button>
        <div
          className="meter"
          role="progressbar"
          aria-label={`${title} progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <span className="player-count">
          {Math.min(pos + 1, queue.length)} of {queue.length}
        </span>
      </header>

      <main className="player-main" ref={mainRef}>
        {done ? (
          <Finish title={title} firstTry={firstTry} questions={questions} onExit={onExit} note={note} />
        ) : (
          <div className="player-stage" key={`${pos}-${idx}`}>
            {item.label && <p className="player-from">{item.label}</p>}
            <StepView step={step} lesson={item.lesson} answer={answer} setAnswer={setAnswer} status={status} onSubmit={submit} />
          </div>
        )}
      </main>

      {!done && (
        <footer className={`player-foot is-${status}`}>
          {status !== "idle" && (
            <div className="feedback" ref={feedbackRef} tabIndex={-1} role="status">
              <span className="feedback-badge">
                <Icon name={status === "right" ? "check" : "x"} size={22} />
              </span>
              <div>
                <strong>{verdict}</strong>
                <p>{step.explain}</p>
                {status === "wrong" && retried.has(idx) && queue.indexOf(idx, pos + 1) > -1 && (
                  <p className="feedback-note">This one comes back at the end of the lesson.</p>
                )}
              </div>
            </div>
          )}
          <div className="player-actions">
            {isQuestion && status === "idle" ? (
              <button type="button" className="btn btn-primary" disabled={!ready} onClick={() => submit()}>
                Check
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={next} disabled={blocked}>
                {blocked ? "Finish the trade to continue" : "Continue"}
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

function Finish({ title, firstTry, questions, onExit, note }) {
  const pct = questions ? Math.round((firstTry / questions) * 100) : 100;
  return (
    <div className="finish">
      <svg className="finish-candle" viewBox="0 0 120 160" aria-hidden="true">
        <line x1="60" y1="8" x2="60" y2="152" />
        <rect x="36" y="30" width="48" height="96" rx="4" />
      </svg>
      <h2>{title} done</h2>
      <p className="finish-stats">
        {questions > 0 ? (
          <>
            {firstTry} of {questions} right first time ({pct}%).
          </>
        ) : (
          "Nothing to grade here."
        )}
      </p>
      {note && <p className="finish-note">{note}</p>}
      <button type="button" className="btn btn-primary" onClick={onExit} autoFocus>
        Back to the course
      </button>
    </div>
  );
}
