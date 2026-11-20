import Chart from "../components/Chart";
import Icon from "../components/Icon";
import { LESSONS, UNITS, CHANNEL } from "../content/course";
import { setOption } from "../lib/store";

const heroSpec = {
  ex: "kgc_flat",
  from: "2025-05-15",
  to: "2025-08-29",
  lines: [{ price: 16.52, label: "Flat base pivot", tone: "pivot" }],
  marks: [{ date: "2025-08-04", label: "Prior-day-high entry", at: "low", tone: "pivot" }],
};

function lessonState(lesson, i, state) {
  if (state.done[lesson.id]) return "done";
  const prev = LESSONS[i - 1];
  if (i === 0 || state.done[prev.id] || state.openAll) return "open";
  return "locked";
}

function Candle({ status, rise }) {
  return (
    <svg className={`node-candle is-${status}`} viewBox="0 0 28 64" aria-hidden="true">
      <line x1="14" y1={4 + (12 - rise)} x2="14" y2="60" />
      <rect x="5" y={14 + (12 - rise)} width="18" height={34 + rise} rx="3" />
    </svg>
  );
}

export default function Home({ state, onStart, due }) {
  const nextIndex = LESSONS.findIndex((l) => !state.done[l.id]);
  const next = LESSONS[nextIndex];
  const doneCount = LESSONS.filter((l) => state.done[l.id]).length;
  let flat = -1;

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>Read charts and trade like Ariel Hernandez.</h1>
          <p className="lede">
            His process, one step at a time: read the market, find the leading groups, spot the setup, enter with a tactic, size the risk, manage the trade. Built from{" "}
            <a href={CHANNEL} target="_blank" rel="noreferrer">
              his public videos
            </a>{" "}
            and practised on real US and Thai charts. No trading experience needed.
          </p>
          <div className="hero-actions">
            {next ? (
              <button type="button" className="btn btn-primary" onClick={() => onStart(next.id)}>
                {doneCount ? `Continue: ${next.title}` : "Start the first lesson"}
              </button>
            ) : (
              <p className="all-done">You have finished every lesson. Keep your reviews going.</p>
            )}
            <a className="btn btn-quiet" href="#trade">
              Replay a real trade
            </a>
            {due > 0 && (
              <a className="btn btn-quiet" href="#review">
                {due} review {due === 1 ? "card" : "cards"} due
              </a>
            )}
          </div>
          <p className="hero-fine">
            {doneCount} of {LESSONS.length} lessons done. Not financial advice, and not affiliated with Ariel.
          </p>
        </div>
        <div className="hero-chart">
          <Chart spec={heroSpec} height={300} />
        </div>
      </section>

      <section className="course" aria-label="Course map">
        {UNITS.map((unit) => (
          <div className="unit" key={unit.id}>
            <div className="unit-head">
              <h2>{unit.title}</h2>
              <p>{unit.blurb}</p>
            </div>
            <ol className="unit-lessons">
              {unit.lessons.map((lesson, k) => {
                flat += 1;
                const i = flat;
                const status = lessonState(lesson, i, state);
                const current = next && next.id === lesson.id;
                return (
                  <li key={lesson.id} style={{ "--step": k }}>
                    <button
                      type="button"
                      className={`node is-${status}${current ? " is-current" : ""}`}
                      disabled={status === "locked"}
                      onClick={() => onStart(lesson.id)}
                      aria-label={`${lesson.title}${status === "done" ? ", completed" : status === "locked" ? ", locked until the previous lesson is done" : ""}`}
                    >
                      <Candle status={status} rise={Math.min(12, k * 4)} />
                      <span className="node-title">{lesson.title}</span>
                      <span className="node-meta">
                        {status === "done" ? (
                          <>
                            <Icon name="check" size={14} /> Done
                          </>
                        ) : status === "locked" ? (
                          <>
                            <Icon name="lock" size={14} /> Locked
                          </>
                        ) : (
                          `${lesson.steps.length} steps`
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
        {!state.openAll && (
          <p className="unlock">
            Already know the basics?{" "}
            <button type="button" className="link-btn" onClick={() => setOption("openAll", true)}>
              Open every lesson
            </button>
          </p>
        )}
      </section>
    </>
  );
}
