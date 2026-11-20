import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./components/Icon";
import Player from "./components/Player";
import Home from "./views/Home";
import Review, { reviewItems } from "./views/Review";
import Tools from "./views/Tools";
import Sources from "./views/Sources";
import { LESSONS, QUESTION_TYPES } from "./content/course";
import Trade from "./views/Trade";
import Illustration, { ILLUSTRATIONS } from "./components/Illustration";
import { dueCards, finishLesson, gradeCard, setOption, streak, useStore } from "./lib/store";

const PAGES = [
  ["learn", "Learn", "path"],
  ["trade", "Trade", "play"],
  ["review", "Review", "cycle"],
  ["tools", "Tools", "tools"],
  ["about", "About", "book"],
];

function readHash() {
  const h = window.location.hash.replace(/^#\/?/, "");
  return h || "learn";
}

export default function App() {
  const state = useStore();
  const [route, setRoute] = useState(readHash);
  const [session, setSession] = useState(null);
  const graded = useRef(new Set());
  const due = useMemo(() => dueCards(state), [state]);
  const days = streak(state);

  useEffect(() => {
    const on = () => setRoute(readHash());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === "auto") delete root.dataset.theme;
    else root.dataset.theme = state.theme;
  }, [state.theme]);

  useEffect(() => {
    document.body.classList.toggle("is-playing", Boolean(session) || route.startsWith("lesson-"));
  }, [session, route]);

  const go = (r) => {
    window.location.hash = r;
    setRoute(r);
  };

  const lessonId = route.startsWith("lesson-") ? route.slice(7) : null;
  const lesson = lessonId && LESSONS.find((l) => l.id === lessonId);

  if (lesson) {
    const items = lesson.steps.map((step, i) => ({ id: `${lesson.id}:${i}`, step, lesson }));
    return (
      <Player
        key={lesson.id}
        title={lesson.title}
        items={items}
        note="The questions you just answered will come back in Review over the next few days. Spacing them out is what makes them stick."
        onExit={() => go("learn")}
        onFinish={({ firstTry }) =>
          finishLesson(
            lesson.id,
            items.filter((it) => QUESTION_TYPES.has(it.step.type)).map((it) => it.id),
            10 + firstTry * 2
          )
        }
      />
    );
  }

  if (session) {
    return (
      <Player
        key={session.key}
        title={session.mode === "review" ? "Review" : "Practice set"}
        items={session.items}
        note={session.mode === "review" ? "Cards you got right will wait longer before they come back. Missed ones return tomorrow." : "Practice sets don't change your review schedule."}
        onExit={() => {
          setSession(null);
          go("review");
        }}
        onGrade={(item, ok) => {
          if (session.mode !== "review" || graded.current.has(item.id)) return;
          graded.current.add(item.id);
          gradeCard(item.id, ok);
        }}
      />
    );
  }

  const page = PAGES.some(([k]) => k === route) || route === "illustrations" ? route : "learn";
  const nextTheme = { auto: "dark", dark: "light", light: "auto" }[state.theme] || "auto";

  return (
    <div className="app">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <a className="brand" href="#learn" aria-label="Kabu home">
          <span className="brand-mark" aria-hidden="true">
            株
          </span>
          <span className="brand-name">Kabu</span>
        </a>
        <nav aria-label="Main">
          {PAGES.map(([k, label, icon]) => (
            <a key={k} href={`#${k}`} className={page === k ? "is-here" : ""} aria-current={page === k ? "page" : undefined}>
              <Icon name={icon} size={18} />
              <span>{label}</span>
              {k === "review" && due.length > 0 && <span className="badge">{due.length}</span>}
            </a>
          ))}
        </nav>
        <div className="stats">
          <span className={`stat${days ? " is-lit" : ""}`} title="Days in a row with a lesson or review">
            <Icon name="flame" size={18} />
            <span className="num">{days}</span>
            <span className="sr">day streak</span>
          </span>
          <span className="stat" title="Experience points">
            <Icon name="gem" size={18} />
            <span className="num">{state.xp}</span>
            <span className="sr">XP</span>
          </span>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setOption("theme", nextTheme)}
            aria-label={`Colour theme: ${state.theme}. Switch to ${nextTheme}.`}
            title={`Theme: ${state.theme}`}
          >
            <Icon name={state.theme === "dark" ? "moon" : state.theme === "light" ? "sun" : "auto"} size={18} />
          </button>
        </div>
      </header>

      <main id="main">
        {page === "learn" && <Home state={state} due={due.length} onStart={(id) => go(`lesson-${id}`)} />}
        {page === "review" && (
          <Review
            state={state}
            due={due}
            onRun={(ids, mode) => {
              graded.current = new Set();
              setSession({ key: Date.now(), mode, items: reviewItems(ids) });
            }}
          />
        )}
        {page === "trade" && <Trade state={state} />}
        {page === "tools" && <Tools />}
        {page === "illustrations" && (
          <section className="page page-wide">
            <h1>Illustrations</h1>
            <div className="gallery">
              {ILLUSTRATIONS.map((n) => (
                <div key={n}>
                  <Illustration name={n} />
                  <p className="box-label">{n}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {page === "about" && <Sources />}
      </main>

      <footer className="footer">
        <p>
          Kabu is an independent learning project, not affiliated with Ariel Hernandez. Nothing here is financial advice. Prices from Yahoo Finance.
        </p>
      </footer>
    </div>
  );
}
