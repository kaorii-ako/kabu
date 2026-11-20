const W = 360;
const H = 200;

function Candle({ x, o, h, l, c, w = 12 }) {
  const up = c <= o;
  return (
    <g className={up ? "il-up" : "il-down"}>
      <line x1={x} x2={x} y1={h} y2={l} className="il-wick" />
      <rect x={x - w / 2} y={Math.min(o, c)} width={w} height={Math.max(2, Math.abs(c - o))} rx="2" />
    </g>
  );
}

function Path({ pts, className = "il-line", dash }) {
  return <polyline points={pts.map((p) => p.join(",")).join(" ")} className={className} strokeDasharray={dash} />;
}

function T({ x, y, children, className = "il-text", anchor = "start", size }) {
  return (
    <text x={x} y={y} className={className} textAnchor={anchor} style={size ? { fontSize: size } : undefined}>
      {children}
    </text>
  );
}

function series(start, steps) {
  const out = [];
  let y = start;
  steps.forEach((d, i) => {
    y += d;
    out.push(y);
  });
  return out;
}

function Candles({ ys, x0 = 20, dx = 16, w = 10, spread = 6 }) {
  return ys.map((y, i) => {
    const prev = i ? ys[i - 1] : y + 4;
    const o = prev;
    const c = y;
    const hi = Math.min(o, c) - spread * (0.4 + ((i * 37) % 10) / 14);
    const lo = Math.max(o, c) + spread * (0.4 + ((i * 53) % 10) / 14);
    return <Candle key={i} x={x0 + i * dx} o={o} c={c} h={hi} l={lo} w={w} />;
  });
}

const ART = {
  "candle-anatomy": () => (
    <>
      <Candle x={110} o={140} c={70} h={34} l={170} w={46} />
      <Candle x={250} o={70} c={140} h={34} l={170} w={46} />
      {[
        [34, "High"],
        [70, "Close"],
        [140, "Open"],
        [170, "Low"],
      ].map(([y, t]) => (
        <g key={t}>
          <line x1={140} x2={168} y1={y} y2={y} className="il-guide" />
          <T x={150} y={y - 4} size={11} className="il-muted">
            {t}
          </T>
        </g>
      ))}
      <T x={110} y={194} anchor="middle" className="il-up-text">Up day</T>
      <T x={250} y={194} anchor="middle" className="il-down-text">Down day</T>
      <T x={282} y={38} className="il-muted" size={11}>wick</T>
      <T x={282} y={108} className="il-muted" size={11}>body</T>
    </>
  ),
  "long-wick": () => (
    <>
      <Candle x={120} o={70} c={56} h={44} l={170} w={40} />
      <path d="M170 160 C 200 150, 210 100, 180 70" className="il-arrow" />
      <T x={190} y={150} size={13}>sellers pushed it down,</T>
      <T x={190} y={74} size={13}>buyers pushed it back</T>
    </>
  ),
  "three-trends": () => {
    const up = [[20, 150], [50, 120], [70, 132], [100, 96], [120, 108], [150, 70], [170, 80], [200, 44]];
    return (
      <>
        <g transform="translate(0,0) scale(0.5)">
          <Path pts={up} className="il-line il-up-stroke" />
        </g>
        <g transform="translate(120,0) scale(0.5)">
          <Path pts={[[20, 90], [50, 120], [80, 80], [110, 118], [140, 84], [170, 116], [200, 88]]} className="il-line il-a-stroke" />
        </g>
        <g transform="translate(240,0) scale(0.5)">
          <Path pts={up.map(([x, y]) => [x, 194 - y])} className="il-line il-down-stroke" />
        </g>
        <T x={55} y={140} anchor="middle" className="il-up-text">Uptrend</T>
        <T x={175} y={140} anchor="middle" className="il-a-text">Sideways</T>
        <T x={295} y={140} anchor="middle" className="il-down-text">Downtrend</T>
        <T x={55} y={162} anchor="middle" size={11} className="il-muted">higher highs, higher lows</T>
        <T x={175} y={162} anchor="middle" size={11} className="il-muted">stuck in a range</T>
        <T x={295} y={162} anchor="middle" size={11} className="il-muted">lower highs, lower lows</T>
      </>
    );
  },
  "atr-range": () => {
    const ys = [110, 96, 118, 100, 90, 108, 94, 86];
    return (
      <>
        <Candles ys={ys} x0={40} dx={28} w={14} spread={18} />
        <line x1={250} x2={250} y1={62} y2={136} className="il-measure" />
        <line x1={242} x2={258} y1={62} y2={62} className="il-measure" />
        <line x1={242} x2={258} y1={136} y2={136} className="il-measure" />
        <T x={264} y={96}>about 1 ATR</T>
        <T x={264} y={114} size={11} className="il-muted">a normal range</T>
        <T x={40} y={180} size={12} className="il-muted">ATR = average of each day's range over 14 days</T>
      </>
    );
  },
  "atr-ladder": () => (
    <>
      <Path pts={[[20, 160], [340, 120]]} className="il-line il-c-stroke" />
      <T x={300} y={142} size={11} className="il-c-text">50-day</T>
      {[
        [4, "4 ATR", "il-a-text"],
        [7, "7 ATR", "il-up-text"],
      ].map(([n, t, cls]) => (
        <g key={n}>
          <Path pts={[[20, 160 - n * 15], [340, 120 - n * 15]]} className="il-line il-guide" dash="5 5" />
          <T x={22} y={154 - n * 15} size={12} className={cls}>{t}</T>
        </g>
      ))}
      <Path pts={[[70, 168], [120, 150], [170, 128], [210, 104], [250, 74], [290, 52], [330, 34]]} className="il-line il-ink-stroke" />
      <T x={20} y={190} size={12} className="il-muted">Above 4 ATR: no new buys. From 7 ATR: trim.</T>
    </>
  ),
  "two-clocks": () => (
    <>
      <T x={20} y={34} size={12} className="il-muted">Bangkok time</T>
      {[0, 6, 12, 18, 24].map((h) => (
        <g key={h}>
          <line x1={20 + h * 13.3} x2={20 + h * 13.3} y1={44} y2={160} className="il-guide" />
          <T x={20 + h * 13.3} y={180} anchor="middle" size={11} className="il-muted">{`${String(h).padStart(2, "0")}:00`}</T>
        </g>
      ))}
      <rect x={20 + 10 * 13.3} y={60} width={2.5 * 13.3} height={26} rx="6" className="il-up-fill" />
      <rect x={20 + 14 * 13.3} y={60} width={2.5 * 13.3} height={26} rx="6" className="il-up-fill" />
      <T x={20 + 10 * 13.3} y={56} size={12} className="il-up-text">SET 10:00–12:30, 14:00–16:30</T>
      <rect x={20 + 21.5 * 13.3} y={110} width={2.5 * 13.3} height={26} rx="6" className="il-a-fill" />
      <rect x={20} y={110} width={4 * 13.3} height={26} rx="6" className="il-a-fill" />
      <T x={20} y={150} size={12} className="il-a-text">US 21:30–04:00 (northern winter)</T>
    </>
  ),
  "board-lot": () => (
    <>
      {Array.from({ length: 3 }).map((_, k) => (
        <g key={k} transform={`translate(${30 + k * 74},40)`}>
          {Array.from({ length: 100 }).map((__, i) => (
            <rect key={i} x={(i % 10) * 6} y={Math.floor(i / 10) * 6} width={4.5} height={4.5} rx="1" className="il-up-fill" />
          ))}
        </g>
      ))}
      <T x={30} y={128} size={12}>Main board: lots of 100 shares</T>
      <g transform="translate(262,40)">
        {Array.from({ length: 70 }).map((_, i) => (
          <rect key={i} x={(i % 10) * 6} y={Math.floor(i / 10) * 6} width={4.5} height={4.5} rx="1" className="il-c-fill" />
        ))}
      </g>
      <T x={262} y={128} size={12} className="il-c-text">70 shares:</T>
      <T x={262} y={144} size={12} className="il-c-text">odd-lot board</T>
    </>
  ),
  checklist: () => (
    <>
      {["Market healthy?", "Leading group, strong stock?", "20-day above 50-day?", "Within 4 ATR of the 50-day?", "Not chasing a full-range move?", "Setup, and where am I wrong?"].map((t, i) => (
        <g key={t} transform={`translate(30,${22 + i * 28})`}>
          <rect width="18" height="18" rx="5" className="il-up-fill" />
          <path d="M4 9 l4 4 l7 -8" className="il-check" />
          <T x={30} y={14} size={14}>{t}</T>
        </g>
      ))}
    </>
  ),
  "market-types": () => (
    <>
      <g transform="translate(10,20)">
        <Path pts={[[0, 110], [30, 90], [50, 96], [80, 60], [100, 66], [110, 30]]} className="il-line il-up-stroke" />
        <T x={55} y={140} anchor="middle" className="il-up-text">Healthy</T>
        <T x={55} y={158} anchor="middle" size={11} className="il-muted">breakouts work</T>
      </g>
      <g transform="translate(130,20)">
        <Path pts={[[0, 70], [20, 100], [40, 60], [60, 100], [80, 62], [100, 96], [110, 74]]} className="il-line il-a-stroke" />
        <T x={55} y={140} anchor="middle" className="il-a-text">Choppy</T>
        <T x={55} y={158} anchor="middle" size={11} className="il-muted">smaller, pullbacks</T>
      </g>
      <g transform="translate(250,20)">
        <Path pts={[[0, 30], [30, 56], [50, 46], [80, 84], [100, 76], [110, 112]]} className="il-line il-down-stroke" />
        <T x={55} y={140} anchor="middle" className="il-down-text">Falling</T>
        <T x={55} y={158} anchor="middle" size={11} className="il-muted">wait</T>
      </g>
    </>
  ),
  "progressive-exposure": () => (
    <>
      {[16, 30, 52, 80, 112].map((h, i) => (
        <rect key={i} x={40 + i * 56} y={160 - h} width={36} height={h} rx="6" className={i < 2 ? "il-a-fill" : "il-up-fill"} />
      ))}
      <T x={40} y={182} size={12} className="il-muted">start small</T>
      <T x={240} y={182} size={12} className="il-muted">add as trades work</T>
    </>
  ),
  "win-loss": () => {
    const r = [-1, -1, 3.2, -1, -0.6, -1, 5, -1, -1, 2.4, -1, -0.8];
    return (
      <>
        <line x1={20} x2={340} y1={110} y2={110} className="il-guide" />
        {r.map((v, i) => (
          <rect key={i} x={26 + i * 26} y={v > 0 ? 110 - v * 18 : 110} width={18} height={Math.abs(v) * 18} rx="3" className={v > 0 ? "il-up-fill" : "il-down-fill"} />
        ))}
        <T x={20} y={160} size={12} className="il-down-text">Many small losses, cut at 1R</T>
        <T x={20} y={178} size={12} className="il-up-text">A few big wins pay for them</T>
      </>
    );
  },
  "playbook-flow": () => {
    const steps = ["Market", "Groups", "Chart", "Setup", "Entry", "Size", "Manage"];
    return (
      <>
        <Path pts={steps.map((_, i) => [30 + i * 50, 110 - (i % 2) * 40])} className="il-line il-guide" />
        {steps.map((s, i) => (
          <g key={s}>
            <circle cx={30 + i * 50} cy={110 - (i % 2) * 40} r={15} className={i === 0 ? "il-a-fill" : "il-up-fill"} />
            <T x={30 + i * 50} y={115 - (i % 2) * 40} anchor="middle" className="il-onfill" size={13}>{i + 1}</T>
            <T x={30 + i * 50} y={150 - (i % 2) * 40 + (i % 2 ? -70 : 0)} anchor="middle" size={11}>{s}</T>
          </g>
        ))}
      </>
    );
  },
  "group-together": () => {
    const base = [0, -3, 4, -2, 3, -3, 2, -2, 1, -16, -10];
    return (
      <>
        {[0, 1, 2].map((k) => (
          <g key={k} transform={`translate(${14 + k * 116},${30 + k * 6})`}>
            <rect x="-4" y="-14" width="104" height="128" rx="10" className="il-card" />
            <Candles ys={series(80, base.map((d, i) => (i === 9 - (k === 2 ? 0 : 0) ? d : d)))} x0={8} dx={9} w={5} spread={4} />
            <line x1={0} x2={96} y1={72} y2={72} className="il-pivot" />
            <T x={48} y={106} anchor="middle" size={11} className="il-muted">{["Stock A", "Stock B", "Stock C"][k]}</T>
          </g>
        ))}
        <T x={180} y={192} anchor="middle" size={12}>Same group, breaking out together</T>
      </>
    );
  },
  "flat-base": () => {
    const ys = series(170, [-12, -14, -10, -16, -12, -8, 6, -4, 5, -5, 4, -6, 5, -4, 3, -5, -16, -14]);
    return (
      <>
        <Candles ys={ys} x0={20} dx={18} w={10} spread={6} />
        <line x1={120} x2={320} y1={82} y2={82} className="il-pivot" />
        <T x={124} y={76} size={12} className="il-a-text">pivot</T>
        <T x={30} y={192} size={12} className="il-muted">up</T>
        <T x={170} y={192} size={12} className="il-muted">sideways (digest)</T>
        <T x={318} y={192} size={12} className="il-muted" anchor="end">up</T>
      </>
    );
  },
  unr: () => {
    const ys = [60, 70, 82, 96, 106, 98, 86, 76, 70, 80, 92, 104, 120, 104, 90, 76, 62];
    return (
      <>
        <Candles ys={ys} x0={20} dx={20} w={11} spread={6} />
        <line x1={20} x2={340} y1={110} y2={110} className="il-pivot" />
        <T x={24} y={146} size={12} className="il-a-text">meaningful low that held before</T>
        <circle cx={260} cy={124} r={16} className="il-ring" />
        <T x={282} y={146} size={12} className="il-down-text">undercut</T>
        <T x={318} y={38} size={12} className="il-up-text" anchor="end">rally back</T>
      </>
    );
  },
  munr: () => {
    const ys = series(160, [-12, -10, -12, -8, -10, 6, 8, 4, 10, -14, -10, -12, -8]);
    return (
      <>
        <Path pts={ys.map((_, i) => [26 + i * 24, 150 - i * 8])} className="il-line il-a-stroke" />
        <T x={300} y={64} size={12} className="il-a-text">20-day</T>
        <Candles ys={ys} x0={26} dx={24} w={12} spread={8} />
        <circle cx={26 + 8 * 24} cy={102} r={18} className="il-ring" />
        <T x={180} y={190} size={12} className="il-muted" anchor="middle">dips under the average, closes back above</T>
      </>
    );
  },
  rejection: () => {
    const ys = series(40, [10, 14, 12, 16, 14, 10, -8, -10, -12, -8, 18, 16, 14]);
    return (
      <>
        <Path pts={ys.map((_, i) => [26 + i * 24, 30 + i * 6])} className="il-line il-c-stroke" />
        <T x={20} y={20} size={12} className="il-c-text">falling 50-day</T>
        <Candles ys={ys} x0={26} dx={24} w={12} spread={8} />
        <T x={26 + 9 * 24} y={54} size={12} className="il-down-text" anchor="middle">rejected: don't buy here</T>
      </>
    );
  },
  zoom: () => (
    <>
      <rect x={14} y={24} width={150} height={130} rx="10" className="il-card" />
      <Candles ys={series(120, [-8, -6, 4, -8, 3, -4, 2, -10])} x0={30} dx={16} w={8} spread={5} />
      <rect x={136} y={54} width={22} height={50} rx="4" className="il-zoombox" />
      <T x={89} y={174} anchor="middle" size={12}>Daily chart: the setup</T>
      <path d="M160 64 L196 40 M160 100 L196 140" className="il-guide" />
      <rect x={196} y={24} width={150} height={130} rx="10" className="il-card" />
      <Path pts={[[206, 120], [222, 110], [236, 126], [252, 112], [266, 118], [280, 96], [298, 86], [318, 70], [336, 56]]} className="il-line il-ink-stroke" />
      <line x1={206} x2={340} y1={104} y2={104} className="il-pivot" />
      <circle cx={280} cy={96} r={6} className="il-a-fill" />
      <T x={271} y={174} anchor="middle" size={12}>5-minute chart: the entry</T>
    </>
  ),
  "entry-tactics": () => (
    <>
      {[
        ["Prior-day high", [[0, 70], [20, 80], [40, 60], [60, 66], [80, 40], [100, 30]], 52],
        ["Opening range", [[0, 70], [10, 50], [20, 74], [40, 64], [60, 56], [80, 40], [100, 28]], 50],
        ["VWAP reclaim", [[0, 40], [20, 62], [40, 84], [60, 76], [80, 54], [100, 40]], 64],
      ].map(([t, pts, lv], k) => (
        <g key={t} transform={`translate(${14 + k * 116},30)`}>
          <rect x="-4" y="-10" width="108" height="118" rx="10" className="il-card" />
          <line x1={0} x2={100} y1={lv} y2={lv} className={k === 2 ? "il-vwap" : "il-pivot"} />
          <Path pts={pts} className="il-line il-ink-stroke" />
          <T x={50} y={128} anchor="middle" size={12}>{t}</T>
        </g>
      ))}
    </>
  ),
  "six-twenty": () => {
    const p = [120, 128, 132, 126, 120, 110, 100, 92, 86, 80, 74, 70];
    const six = p.map((v, i) => [30 + i * 26, v - 2]);
    const twenty = p.map((v, i) => [30 + i * 26, 116 - i * 2.4]);
    return (
      <>
        <Path pts={twenty} className="il-line il-c-stroke" />
        <Path pts={six} className="il-line il-a-stroke" />
        <circle cx={30 + 4.4 * 26} cy={116} r={9} className="il-ring" />
        <T x={30} y={30} size={12} className="il-a-text">6-period</T>
        <T x={100} y={30} size={12} className="il-c-text">20-period</T>
        <T x={190} y={30} size={12} className="il-muted">on a 5-minute chart</T>
        <line x1={20} x2={340} y1={160} y2={160} className="il-guide" />
        <Path pts={p.map((v, i) => [30 + i * 26, 168 - (132 - v) / 2])} className="il-line il-muted-stroke" />
        <T x={20} y={190} size={11} className="il-muted">MACD below crosses first, then the averages</T>
      </>
    );
  },
  "fourth-green-day": () => (
    <>
      <Path pts={[[20, 50], [340, 96]]} className="il-line il-c-stroke" />
      <T x={20} y={40} size={12} className="il-c-text">falling 50-day</T>
      {[0, 1, 2, 3].map((i) => (
        <Candle key={i} x={140 + i * 36} o={170 - i * 22} c={146 - i * 22} h={140 - i * 22} l={176 - i * 22} w={18} />
      ))}
      <path d="M240 60 l30 30 M270 60 l-30 30" className="il-x" />
      <T x={20} y={190} size={12} className="il-muted">Fourth green day into a falling 50-day: no 6/20 buy</T>
    </>
  ),
  "r-ruler": () => (
    <>
      {[
        [40, "+3R", "il-up-text"],
        [70, "+2R", "il-up-text"],
        [100, "+1R", "il-up-text"],
        [130, "Entry", "il-a-text"],
        [160, "Stop (−1R)", "il-down-text"],
      ].map(([y, t, c]) => (
        <g key={t}>
          <line x1={110} x2={330} y1={y} y2={y} className={t === "Entry" ? "il-pivot" : t.startsWith("Stop") ? "il-stopline" : "il-guide"} />
          <T x={100} y={y + 4} anchor="end" size={13} className={c}>{t}</T>
        </g>
      ))}
      <line x1={140} x2={140} y1={130} y2={160} className="il-measure" />
      <T x={150} y={150} size={12} className="il-muted">risk per share = 1R</T>
    </>
  ),
  sizing: () => (
    <>
      <rect x={20} y={40} width={320} height={28} rx="8" className="il-card" />
      <rect x={20} y={40} width={48} height={28} rx="8" className="il-a-fill" />
      <T x={20} y={32} size={12}>Account</T>
      <T x={76} y={59} size={12} className="il-muted">position, 5–15% of the account</T>
      <rect x={20} y={110} width={320} height={28} rx="8" className="il-card" />
      <rect x={20} y={110} width={6} height={28} rx="3" className="il-down-fill" />
      <T x={20} y={102} size={12}>Risk</T>
      <T x={34} y={129} size={12} className="il-muted">0.5%, at most 1%</T>
      <T x={20} y={178} size={13}>shares = account × risk % ÷ (entry − stop)</T>
    </>
  ),
  expectancy: () => (
    <>
      <rect x={30} y={40} width={105} height={50} rx="8" className="il-up-fill" />
      <T x={82} y={70} anchor="middle" className="il-onfill">35% win</T>
      <rect x={30} y={100} width={210} height={30} rx="8" className="il-down-fill" />
      <T x={135} y={120} anchor="middle" className="il-onfill">65% lose</T>
      <T x={150} y={60} size={12}>× 3R each</T>
      <T x={250} y={120} size={12}>× 1R each</T>
      <T x={30} y={170} size={14}>1.05R − 0.65R = +0.4R a trade</T>
    </>
  ),
  "sell-rule": () => (
    <>
      <line x1={20} x2={340} y1={130} y2={130} className="il-stopline" />
      <T x={24} y={148} size={12} className="il-down-text">stop: low of day</T>
      <Path pts={[[20, 100], [70, 104], [110, 98], [150, 106]]} className="il-line il-ink-stroke" />
      <circle cx={150} cy={106} r={6} className="il-down-fill" />
      <T x={150} y={90} size={12} anchor="middle" className="il-down-text">sold early, stop not hit</T>
      <Path pts={[[150, 106], [200, 100], [250, 70], [300, 44], [340, 30]]} className="il-line il-muted-stroke" dash="5 5" />
      <T x={300} y={26} size={12} anchor="end" className="il-muted">then it ran without him</T>
      <T x={20} y={186} size={12}>Follow the rule both ways: sell at the stop, hold until it's hit</T>
    </>
  ),
  "momentum-burst": () => {
    const ys = [130, 118, 98, 84, 70, 74, 66];
    return (
      <>
        <Candles ys={ys} x0={50} dx={40} w={18} spread={8} />
        {ys.map((_, i) => (
          <T key={i} x={50 + i * 40} y={182} anchor="middle" size={11} className="il-muted">{`Day ${i + 1}`}</T>
        ))}
        <rect x={110} y={40} width={110} height={120} rx="10" className="il-zone" />
        <T x={165} y={34} anchor="middle" size={12} className="il-up-text">days 3–5: trim ⅓ to ½</T>
      </>
    );
  },
  extension: () => (
    <>
      <Path pts={[[20, 170], [340, 120]]} className="il-line il-c-stroke" />
      <T x={300} y={140} size={11} className="il-c-text">50-day</T>
      <Path pts={[[20, 160], [80, 150], [140, 120], [190, 90], [240, 60], [290, 40], [330, 24]]} className="il-line il-ink-stroke" />
      {[[240, 60, "7 ATR: trim"], [290, 40, "8 ATR: trim more"]].map(([x, y, t]) => (
        <g key={t}>
          <circle cx={x} cy={y} r={6} className="il-up-fill" />
          <T x={x - 10} y={y - 10} anchor="end" size={12} className="il-up-text">{t}</T>
        </g>
      ))}
    </>
  ),
  "relative-strength": () => (
    <>
      <Path pts={[[20, 70], [80, 84], [140, 110], [200, 128], [260, 140], [330, 150]]} className="il-line il-down-stroke" />
      <T x={330} y={170} anchor="end" size={12} className="il-down-text">market falling</T>
      <Path pts={[[20, 60], [80, 58], [140, 64], [200, 56], [260, 50], [330, 44]]} className="il-line il-up-stroke" />
      <T x={330} y={36} anchor="end" size={12} className="il-up-text">leader holding up</T>
    </>
  ),
  funnel: () => (
    <>
      <path d="M40 30 H320 L220 120 V170 H140 V120 Z" className="il-funnel" />
      <T x={180} y={52} anchor="middle" size={13}>Thousands of stocks</T>
      <T x={180} y={92} anchor="middle" size={12} className="il-muted">strong groups, growing sales</T>
      <T x={180} y={150} anchor="middle" size={13} className="il-up-text">Universe list</T>
    </>
  ),
  replay: () => (
    <>
      <Candles ys={series(150, [-6, -10, 4, -8, -12, 6, -10, -14])} x0={30} dx={22} w={12} spread={6} />
      <rect x={210} y={30} width={130} height={140} rx="10" className="il-zone-dim" />
      <T x={275} y={104} anchor="middle" size={13} className="il-muted">?</T>
      <g transform="translate(30,170)">
        <rect width="84" height="24" rx="8" className="il-a-fill" />
        <T x={42} y={16} anchor="middle" size={12} className="il-onfill">Next day</T>
        <rect x={94} width="72" height="24" rx="8" className="il-card" />
        <T x={130} y={16} anchor="middle" size={12}>Trim</T>
      </g>
    </>
  ),
};

export const ILLUSTRATIONS = Object.keys(ART);

export default function Illustration({ name, caption }) {
  const Art = ART[name];
  if (!Art) return null;
  return (
    <figure className="illus">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={caption || name.replace(/-/g, " ")}>
        <Art />
      </svg>
    </figure>
  );
}
