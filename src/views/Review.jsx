import { findStep, LESSONS, QUESTION_TYPES } from "../content/course";

export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function interleave(ids) {
  const byLesson = {};
  shuffle(ids).forEach((id) => {
    const k = id.split(":")[0];
    (byLesson[k] ||= []).push(id);
  });
  const piles = shuffle(Object.values(byLesson));
  const out = [];
  while (piles.some((p) => p.length)) piles.forEach((p) => p.length && out.push(p.shift()));
  return out;
}

export function reviewItems(ids) {
  return ids
    .map((id) => {
      const found = findStep(id);
      return found ? { id, step: found.step, lesson: found.lesson, label: `From: ${found.lesson.title}` } : null;
    })
    .filter(Boolean);
}

export function practicePool(state) {
  return LESSONS.filter((l) => state.done[l.id]).flatMap((l) =>
    l.steps.map((s, i) => (QUESTION_TYPES.has(s.type) ? `${l.id}:${i}` : null)).filter(Boolean)
  );
}

export default function Review({ state, due, onRun }) {
  const pool = practicePool(state);
  const boxes = [0, 0, 0, 0, 0, 0];
  Object.values(state.cards).forEach((c) => (boxes[c.box] += 1));
  const total = Object.keys(state.cards).length;

  return (
    <section className="page">
      <h1>Review</h1>
      <p className="lede">
        Questions from lessons you've finished come back on a schedule. Get one right and it waits longer before returning: 1 day, then 2, 4, 8, 16 and 32. Get it wrong and it starts again tomorrow. Cards from different lessons are mixed together, so you practise telling setups apart.
      </p>

      {due.length > 0 ? (
        <button type="button" className="btn btn-primary" onClick={() => onRun(interleave(due).slice(0, 15), "review")}>
          Review {Math.min(15, due.length)} due {due.length === 1 ? "card" : "cards"}
        </button>
      ) : total === 0 ? (
        <p className="empty">Finish a lesson and its questions will show up here tomorrow.</p>
      ) : (
        <div className="empty">
          <p>Nothing is due today.</p>
          {pool.length > 0 && (
            <button type="button" className="btn btn-quiet" onClick={() => onRun(interleave(pool).slice(0, 8), "practice")}>
              Practise a mixed set anyway
            </button>
          )}
        </div>
      )}

      {total > 0 && (
        <div className="boxes" aria-label="Cards by how well you know them">
          <h2>Your cards</h2>
          <ol>
            {boxes.map((n, i) => (
              <li key={i} style={{ "--fill": total ? n / total : 0 }}>
                <span className="box-bar" />
                <span className="box-n">{n}</span>
                <span className="box-label">{["New or missed", "2 days", "4 days", "8 days", "16 days", "32 days"][i]}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
