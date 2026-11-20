import { useEffect, useMemo, useRef, useState } from "react";
import { bars, example, fmtDate, fmtPrice, fmtVol, monthLabel } from "../lib/market";

function useWidth(ref) {
  const [w, setW] = useState(640);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

function niceTicks(lo, hi, count = 5) {
  const span = hi - lo;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count + 1) || mag * 10;
  const out = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) out.push(+v.toFixed(6));
  return out;
}

const MA_LABEL = { 10: "10-day", 20: "20-day", 50: "50-day", 200: "200-day" };

export default function Chart({
  spec,
  revealed = true,
  tap = null,
  pick = null,
  onPick,
  highlight = null,
  height = 320,
}) {
  const wrap = useRef(null);
  const width = useWidth(wrap);
  const ex = example(spec.ex);
  const all = useMemo(() => bars(spec.ex, spec.from, spec.to), [spec.ex, spec.from, spec.to]);
  const cut = spec.reveal && !revealed ? all.findIndex((b) => b.date > spec.reveal.upto) : -1;
  const visible = cut === -1 ? all : all.slice(0, cut);
  const mas = spec.mas ?? [10, 20, 50];
  const [hover, setHover] = useState(null);
  const [cursorPrice, setCursorPrice] = useState(null);
  const [kbIndex, setKbIndex] = useState(null);
  const prevCount = useRef(visible.length);
  const [growFrom, setGrowFrom] = useState(visible.length);

  useEffect(() => {
    if (visible.length > prevCount.current) setGrowFrom(prevCount.current);
    prevCount.current = visible.length;
  }, [visible.length]);

  const pad = { l: 6, r: 58, t: 14, b: 24 };
  const volH = Math.round(height * 0.16);
  const plotW = width - pad.l - pad.r;
  const priceH = height - pad.t - pad.b - volH - 6;
  const n = all.length;
  const slot = plotW / n;
  const bodyW = Math.max(1.2, Math.min(14, slot * 0.64));

  const [lo, hi] = useMemo(() => {
    let a = Infinity;
    let b = -Infinity;
    visible.forEach((d) => {
      a = Math.min(a, d.l);
      b = Math.max(b, d.h);
      mas.forEach((m) => {
        const v = d.ma[m];
        if (v != null) {
          a = Math.min(a, v);
          b = Math.max(b, v);
        }
      });
    });
    (spec.lines || []).forEach((ln) => {
      if (!ln.after || revealed) {
        a = Math.min(a, ln.price);
        b = Math.max(b, ln.price);
      }
    });
    const p = (b - a) * 0.07;
    return [a - p, b + p];
  }, [visible, mas, spec.lines, revealed]);

  const vMax = Math.max(...visible.map((d) => d.v), 1);
  const x = (i) => pad.l + slot * i + slot / 2;
  const y = (p) => pad.t + ((hi - p) / (hi - lo)) * priceH;
  const yInv = (py) => hi - ((py - pad.t) / priceH) * (hi - lo);
  const volTop = pad.t + priceH + 6;
  const idxOf = (date) => all.findIndex((b) => b.date >= date);

  const levelYs = (spec.lines || []).filter((ln) => !ln.after || revealed).map((ln) => ln.price);
  const ticks = niceTicks(lo, hi, height < 260 ? 3 : 5);
  const tickClear = (t) => levelYs.every((p) => Math.abs(((p - t) / (hi - lo)) * priceH) > 14);
  const months = [];
  all.forEach((b, i) => {
    if (i === 0 || b.date.slice(0, 7) !== all[i - 1].date.slice(0, 7)) months.push({ i, label: monthLabel(b.date) });
  });
  const monthEvery = Math.ceil(months.length / Math.max(2, Math.floor(plotW / 64)));

  const levels = (spec.lines || [])
    .map((ln, k) => ({ ln, k }))
    .filter(({ ln }) => !ln.after || revealed)
    .sort((p, q) => q.ln.price - p.ln.price);
  levels.forEach((lv, j) => {
    const prev = levels[j - 1];
    lv.chipY = prev ? Math.max(y(lv.ln.price), prev.chipY + 19) : y(lv.ln.price);
    lv.below = Boolean(prev && y(lv.ln.price) - y(prev.ln.price) < 16);
  });

  const active = hover ?? kbIndex;
  const info = visible[active ?? visible.length - 1];

  function locate(evt) {
    const r = evt.currentTarget.getBoundingClientRect();
    const px = evt.clientX - r.left;
    const py = evt.clientY - r.top;
    const i = Math.max(0, Math.min(visible.length - 1, Math.floor((px - pad.l) / slot)));
    return { i, price: yInv(Math.max(pad.t, Math.min(pad.t + priceH, py))) };
  }

  function choose(i, price) {
    if (!tap || !onPick) return;
    const b = visible[i];
    onPick({ date: b.date, index: i, mode: tap.mode, price: tap.mode === "price" ? +price.toFixed(3) : b.c });
  }

  function onKey(e) {
    if (!tap) return;
    const i = kbIndex ?? visible.length - 1;
    const step = (hi - lo) / 60;
    if (e.key === "ArrowLeft") setKbIndex(Math.max(0, i - 1));
    else if (e.key === "ArrowRight") setKbIndex(Math.min(visible.length - 1, i + 1));
    else if (e.key === "ArrowUp" && tap.mode === "price") setCursorPrice((cursorPrice ?? visible[i].c) + step);
    else if (e.key === "ArrowDown" && tap.mode === "price") setCursorPrice((cursorPrice ?? visible[i].c) - step);
    else if (e.key === "Enter" || e.key === " ") choose(i, cursorPrice ?? visible[i].c);
    else return;
    e.preventDefault();
  }

  const tone = (t) => `tone-${t || "neutral"}`;

  return (
    <figure className="chart" ref={wrap}>
      <div className="chart-info" aria-live="off">
        <strong>{ex.symbol}</strong>
        <span className="chart-market">{ex.market === "SET" ? "SET, baht" : "US, dollars"}</span>
        {info && (
          <span className="chart-ohlc">
            <span>{fmtDate(info.date)}</span>
            <span>O {fmtPrice(info.o)}</span>
            <span>H {fmtPrice(info.h)}</span>
            <span>L {fmtPrice(info.l)}</span>
            <span className={info.c >= info.o ? "up" : "down"}>C {fmtPrice(info.c)}</span>
            <span>Vol {fmtVol(info.v)}</span>
          </span>
        )}
      </div>
      <svg
        width={width}
        height={height}
        className={`chart-svg${tap ? " is-tappable" : ""}`}
        role={tap ? "application" : "img"}
        aria-label={`${ex.name} daily chart from ${fmtDate(all[0].date)} to ${fmtDate(visible[visible.length - 1].date)}${tap ? ". Use arrow keys to move, Enter to choose." : ""}`}
        tabIndex={tap ? 0 : -1}
        onKeyDown={onKey}
        onPointerMove={(e) => {
          const p = locate(e);
          setHover(p.i);
          setCursorPrice(p.price);
        }}
        onPointerLeave={() => {
          setHover(null);
          if (tap?.mode !== "price") setCursorPrice(null);
        }}
        onClick={(e) => {
          const p = locate(e);
          choose(p.i, p.price);
        }}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line className="grid" x1={pad.l} x2={pad.l + plotW} y1={y(t)} y2={y(t)} />
            {tickClear(t) && (
              <text className="axis" x={width - pad.r + 8} y={y(t) + 4}>
                {fmtPrice(t)}
              </text>
            )}
          </g>
        ))}
        {months.map((m, k) =>
          k % monthEvery === 0 ? (
            <text key={m.i} className="axis" x={x(m.i) - slot / 2} y={height - 6}>
              {m.label}
            </text>
          ) : null
        )}

        {(spec.zones || []).map((z, k) => {
          if (z.after && !revealed) return null;
          const a = idxOf(z.from);
          const b = z.to ? all.findLastIndex((d) => d.date <= z.to) : n - 1;
          const top = z.hi != null ? y(z.hi) : pad.t;
          const bot = z.lo != null ? y(z.lo) : pad.t + priceH;
          return (
            <g key={k} className={`zone ${tone(z.tone)}`}>
              <rect x={x(a) - slot / 2} width={(b - a + 1) * slot} y={top} height={Math.max(2, bot - top)} rx="3" />
              {z.label && (
                <text x={x(a) - slot / 2 + 6} y={top + 14}>
                  {z.label}
                </text>
              )}
            </g>
          );
        })}

        {highlight && (
          <g className="answer">
            {highlight.from && (
              <rect
                x={x(idxOf(highlight.from)) - slot / 2}
                width={(all.findLastIndex((d) => d.date <= (highlight.to || highlight.from)) - idxOf(highlight.from) + 1) * slot}
                y={pad.t}
                height={priceH}
                rx="3"
              />
            )}
            {highlight.lo != null && (
              <rect x={pad.l} width={plotW} y={y(highlight.hi)} height={Math.max(3, y(highlight.lo) - y(highlight.hi))} rx="2" />
            )}
          </g>
        )}

        {visible.map((d, i) => (
          <rect
            key={`v${d.date}`}
            className={`vol ${d.c >= d.o ? "up" : "down"}${i >= growFrom ? " grow" : ""}`}
            style={i >= growFrom ? { animationDelay: `${(i - growFrom) * 28}ms` } : undefined}
            x={x(i) - bodyW / 2}
            width={bodyW}
            y={volTop + volH - (d.v / vMax) * volH}
            height={Math.max(1, (d.v / vMax) * volH)}
          />
        ))}

        {mas.map((m) => {
          const pts = visible
            .map((d, i) => (d.ma[m] != null ? `${x(i).toFixed(1)},${y(d.ma[m]).toFixed(1)}` : null))
            .filter(Boolean);
          return pts.length > 1 ? <polyline key={m} className={`ma ma-${m}`} points={pts.join(" ")} /> : null;
        })}

        {visible.map((d, i) => {
          const up = d.c >= d.o;
          const top = y(Math.max(d.o, d.c));
          const bh = Math.max(1, Math.abs(y(d.o) - y(d.c)));
          return (
            <g
              key={d.date}
              className={`candle ${up ? "up" : "down"}${i >= growFrom ? " grow" : ""}${active === i ? " is-active" : ""}`}
              style={i >= growFrom ? { animationDelay: `${(i - growFrom) * 28}ms` } : undefined}
            >
              <line x1={x(i)} x2={x(i)} y1={y(d.h)} y2={y(d.l)} />
              <rect x={x(i) - bodyW / 2} y={top} width={bodyW} height={bh} rx={bodyW > 5 ? 1 : 0} />
            </g>
          );
        })}

        {levels.map(({ ln, k, chipY, below }) => (
          <g key={k} className={`level ${tone(ln.tone)}`}>
            <line x1={pad.l} x2={pad.l + plotW} y1={y(ln.price)} y2={y(ln.price)} />
            <rect x={width - pad.r + 2} y={chipY - 9} width={pad.r - 4} height={18} rx="4" />
            <text className="level-price" x={width - pad.r + 8} y={chipY + 4}>
              {fmtPrice(ln.price)}
            </text>
            {ln.label && (
              <text className="level-label" x={pad.l + 6} y={y(ln.price) + (below ? 15 : -6)}>
                {ln.label}
              </text>
            )}
          </g>
        ))}

        {(spec.marks || []).map((mk, k) => {
          if (mk.after && !revealed) return null;
          const i = idxOf(mk.date);
          if (i < 0 || i >= visible.length) return null;
          const d = visible[i];
          const below = mk.at === "low";
          const py = below ? y(d.l) + 10 : y(d.h) - 10;
          return (
            <g key={k} className={`mark ${tone(mk.tone)}`}>
              <path
                d={below ? `M${x(i)},${py - 4} l-5,8 h10 z` : `M${x(i)},${py + 4} l-5,-8 h10 z`}
              />
              <text x={x(i)} y={below ? py + 18 : py - 10} textAnchor={x(i) > width * 0.72 ? "end" : x(i) < width * 0.2 ? "start" : "middle"}>
                {mk.label}
              </text>
            </g>
          );
        })}

        {active != null && visible[active] && (
          <line className="crosshair" x1={x(active)} x2={x(active)} y1={pad.t} y2={volTop + volH} />
        )}
        {tap?.mode === "price" && cursorPrice != null && (
          <g className="crosshair-price">
            <line x1={pad.l} x2={pad.l + plotW} y1={y(cursorPrice)} y2={y(cursorPrice)} />
            <rect x={width - pad.r + 2} y={y(cursorPrice) - 9} width={pad.r - 4} height={18} rx="4" />
            <text x={width - pad.r + 8} y={y(cursorPrice) + 4}>
              {fmtPrice(cursorPrice)}
            </text>
          </g>
        )}

        {pick && (
          <g className={`pick ${highlight ? "is-graded" : ""}`}>
            {pick.mode === "price" ? (
              <line x1={pad.l} x2={pad.l + plotW} y1={y(pick.price)} y2={y(pick.price)} />
            ) : (
              <circle cx={x(pick.index)} cy={y(visible[pick.index]?.h ?? pick.price) - 14} r="6" />
            )}
          </g>
        )}

        {spec.reveal && !revealed && (
          <g className="future">
            <rect x={x(visible.length) - slot / 2} width={(n - visible.length) * slot} y={pad.t} height={priceH + volH + 6} rx="4" />
            {(n - visible.length) * slot > 130 && (
              <text x={x(visible.length) - slot / 2 + ((n - visible.length) * slot) / 2} y={pad.t + priceH / 2} textAnchor="middle">
                What happens next?
              </text>
            )}
          </g>
        )}
      </svg>
      {mas.length > 0 && (
        <figcaption className="chart-legend">
          {mas.map((m) => (
            <span key={m} className={`legend legend-${m}`}>
              <i />
              {MA_LABEL[m]} average
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}

export function GroupChart({ series, height = 260, highlight }) {
  const wrap = useRef(null);
  const width = useWidth(wrap);
  const syms = Object.keys(series);
  const len = series[syms[0]].length;
  const pad = { l: 6, r: 70, t: 14, b: 24 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  let lo = Infinity;
  let hi = -Infinity;
  syms.forEach((s) => series[s].forEach(([, v]) => ((lo = Math.min(lo, v)), (hi = Math.max(hi, v)))));
  lo = Math.min(lo, 100) - 5;
  hi += 8;
  const x = (i) => pad.l + (i / (len - 1)) * plotW;
  const y = (v) => pad.t + ((hi - v) / (hi - lo)) * plotH;
  const dates = series[syms[0]].map((p) => p[0]);
  const months = dates
    .map((d, i) => ({ d, i }))
    .filter(({ d, i }) => i === 0 || d.slice(0, 7) !== dates[i - 1].slice(0, 7));
  const every = Math.ceil(months.length / Math.max(2, Math.floor(plotW / 70)));
  const ends = syms
    .map((s) => ({ s, v: series[s][series[s].length - 1][1] }))
    .sort((a, b) => b.v - a.v);
  let last = -Infinity;
  const labelY = {};
  ends.forEach(({ s, v }) => {
    const py = Math.max(y(v), last + 15);
    labelY[s] = py;
    last = py;
  });

  return (
    <figure className="chart" ref={wrap}>
      <svg width={width} height={height} className="chart-svg" role="img" aria-label={`Performance from ${fmtDate(dates[0])}, starting at 100: ${ends.map((e) => `${e.s} ${e.v.toFixed(0)}`).join(", ")}`}>
        {niceTicks(lo, hi, 4).map((t) => (
          <g key={t}>
            <line className={`grid${t === 100 ? " base" : ""}`} x1={pad.l} x2={pad.l + plotW} y1={y(t)} y2={y(t)} />
          </g>
        ))}
        {months.map((m, k) =>
          k % every === 0 ? (
            <text key={m.i} className="axis" x={x(m.i)} y={height - 6}>
              {monthLabel(m.d)}
            </text>
          ) : null
        )}
        {syms.map((s, k) => (
          <g key={s} className={`gline gline-${k}${highlight && highlight !== s ? " is-dim" : ""}`}>
            <polyline points={series[s].map(([, v], i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")} />
            <text x={pad.l + plotW + 8} y={labelY[s] + 4}>
              {s} {series[s][series[s].length - 1][1] >= 100 ? "+" : ""}
              {(series[s][series[s].length - 1][1] - 100).toFixed(0)}%
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
