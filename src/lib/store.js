import { useEffect, useState } from "react";

const KEY = "kabu.v1";
const DAY = 86400000;
const INTERVALS = [1, 2, 4, 8, 16, 32];

const blank = () => ({
  done: {},
  xp: 0,
  days: [],
  cards: {},
  openAll: false,
  theme: "auto",
  trades: {},
});

let memory = null;

function read() {
  if (memory) return memory;
  try {
    const raw = window.localStorage.getItem(KEY);
    memory = raw ? { ...blank(), ...JSON.parse(raw) } : blank();
  } catch {
    memory = blank();
  }
  return memory;
}

const listeners = new Set();

function write(next) {
  memory = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    memory = next;
  }
  listeners.forEach((fn) => fn(next));
}

export function useStore() {
  const [state, setState] = useState(read);
  useEffect(() => {
    listeners.add(setState);
    return () => listeners.delete(setState);
  }, []);
  return state;
}

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const dayNum = (s) => Math.round(new Date(s + "T00:00:00").getTime() / DAY);

function markDay(s) {
  const t = today();
  return s.days.includes(t) ? s.days : [...s.days, t].slice(-400);
}

export function streak(state) {
  const set = new Set(state.days.map(dayNum));
  let n = dayNum(today());
  if (!set.has(n)) n -= 1;
  let count = 0;
  while (set.has(n)) {
    count += 1;
    n -= 1;
  }
  return count;
}

export function finishLesson(lessonId, cardIds, xpGained) {
  const s = read();
  const cards = { ...s.cards };
  const due = dayNum(today()) + 1;
  cardIds.forEach((id) => {
    if (!cards[id]) cards[id] = { box: 0, due };
  });
  write({
    ...s,
    done: { ...s.done, [lessonId]: { at: today(), best: Math.max(s.done[lessonId]?.best || 0, xpGained) } },
    xp: s.xp + xpGained,
    days: markDay(s),
    cards,
  });
}

export function gradeCard(id, correct) {
  const s = read();
  const card = s.cards[id] || { box: 0, due: 0 };
  const box = correct ? Math.min(card.box + 1, INTERVALS.length - 1) : 0;
  const next = { box, due: dayNum(today()) + INTERVALS[box] };
  write({
    ...s,
    cards: { ...s.cards, [id]: next },
    xp: s.xp + (correct ? 2 : 0),
    days: markDay(s),
  });
}

export function dueCards(state) {
  const n = dayNum(today());
  return Object.entries(state.cards)
    .filter(([, c]) => c.due <= n)
    .map(([id]) => id);
}

export function setOption(key, value) {
  write({ ...read(), [key]: value });
}

export function resetAll() {
  write(blank());
}
