import Chart from "../components/Chart";
import Icon from "../components/Icon";
import { LESSONS, UNITS, CHANNEL } from "../content/course";
import { setOption } from "../lib/store";

const cardSpec = {
  ex: "kgc_flat",
  from: "2025-05-15",
  to: "2025-08-29",
  lines: [{ price: 16.52, label: "Pivot", tone: "pivot" }],
  marks: [{ date: "2025-08-04", label: "Entry", at: "low", tone: "pivot" }],
};

const OFFSETS = [0, 56, 84, 56, 0, -56, -84, -56];

function lessonState(lesson, i, state) {
  if (state.done[lesson.id]) return "done";
  const prev = LESSONS[i - 1];
  if (i === 0 || state.done[prev.id] || state.openAll) return "open";
  return "locked";
}

export default function Home({ state, onStart, due }) {
  const nextIndex = LESSONS.findIndex((l) => !state.done[l.id]);
  const next = LESSONS[nextIndex];
  const doneCount = LESSONS.filter((l) => state.done[l.id]).length;
  const pct = Math.round((doneCount / LESSONS.length) * 100);
  let flat = -1;

  return (
    <div className="course-page">
      <aside className="course-card">
        <div className="course-art">
          <Chart spec={cardSpec} height={190} />
        </div>
        <div className="course-body">
          <h1>Trade like Ariel Hernandez</h1>
          <p>
            Learn his swing trading process one step at a time: read the market, find the leaders, spot the setup, time the entry, size the risk, manage the trade. Built from{" "}
            <a href={CHANNEL} target="_blank" rel="noreferrer">
              his public videos
            </a>{" "}
            and practised on real US and Thai charts.
          </p>
          <div className="course-progress" aria-label={`${doneCount} of ${LESSONS.length} lessons done`}>
            <span style={{ transform: `scaleX(${pct / 100})` }} />
          </div>
          <p className="course-count">
            {doneCount} of {LESSONS.length} lessons, {UNITS.length} levels
          </p>
          {next ? (
            <button type="button" className="btn btn-primary btn-block" onClick={() => onStart(next.id)}>
              {doneCount ? "Continue" : "Start learning"}
            </button>
          ) : (
            <p className="all-done">Every lesson is done. Keep your reviews going.</p>
          )}
          <div className="course-links">
            <a className="btn btn-quiet btn-block" href="#trade">
              <Icon name="play" size={16} /> Replay a real trade
            </a>
            {due > 0 && (
              <a className="btn btn-quiet btn-block" href="#review">
                <Icon name="cycle" size={16} /> {due} review {due === 1 ? "card" : "cards"} due
              </a>
            )}
          </div>
          <p className="course-fine">Not financial advice. Not affiliated with Ariel Hernandez.</p>
        </div>
      </aside>

      <section className="levels" aria-label="Course map">
        {UNITS.map((unit, u) => (
          <div className={`level level-${u % 5}`} key={unit.id}>
            <header className="level-head">
              <span className="level-num">Level {u + 1}</span>
              <h2>{unit.title}</h2>
              <p>{unit.blurb}</p>
            </header>
            <ol className="path">
              {unit.lessons.map((lesson, k) => {
                flat += 1;
                const i = flat;
                const status = lessonState(lesson, i, state);
                const current = next && next.id === lesson.id;
                return (
                  <li key={lesson.id} style={{ "--x": `${OFFSETS[k % OFFSETS.length]}px` }}>
                    {current && <span className="path-start">Start</span>}
                    <button
                      type="button"
                      className={`path-node is-${status}${current ? " is-current" : ""}`}
                      disabled={status === "locked"}
                      onClick={() => onStart(lesson.id)}
                      aria-label={`${lesson.title}${status === "done" ? ", completed" : status === "locked" ? ", locked" : ""}`}
                    >
                      {status === "done" ? (
                        <Icon name="check" size={26} />
                      ) : status === "locked" ? (
                        <Icon name="lock" size={22} />
                      ) : lesson.steps.some((s) => s.type === "trade") ? (
                        <Icon name="play" size={24} />
                      ) : (
                        <span className="path-n">{i + 1}</span>
                      )}
                    </button>
                    <span className={`path-label is-${status}`}>{lesson.title}</span>
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
    </div>
  );
}
