const PATHS = {
  flame: "M12 3c1 3.5 5 5.4 5 10a5 5 0 0 1-10 0c0-2.2 1-3.6 2.2-4.6.2 1.6 1 2.6 2 3 0-3.2-.6-5.6.8-8.4Z",
  gem: "M6 4h12l3 5-9 11L3 9l3-5Zm-3 5h18M9.5 4 8 9l4 11 4-11-1.5-5",
  cycle: "M20 11a8 8 0 0 0-14.3-4.9L4 8m0-4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16m0 4v-4h-4",
  path: "M5 20c3-1 3-5 7-6s4-5 7-6M5 20a1.5 1.5 0 1 0 0-.01M19 8a1.5 1.5 0 1 0 0-.01",
  tools: "M4 20 15 9m2-5 3 3-3.5 3.5-3-3L17 4ZM6.5 14.5l3 3M4 4h5v5H4z",
  book: "M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5v-13Z",
  check: "M5 12.5 10 17.5 19 7",
  x: "M6 6l12 12M18 6 6 18",
  play: "M8 5.5v13l10.5-6.5L8 5.5Z",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13v9h-13z",
  sun: "M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7 1.4-1.4M4.9 19.1l1.4-1.4m11.4 0 1.4 1.4M4.9 4.9l1.4 1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  auto: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0v18m0-13h4m-4 4h6m-6 4h6m-6 4h4",
  moon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z",
  back: "M15 5l-7 7 7 7",
  forward: "M9 5l7 7-7 7",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15.5 9.5a1 1 0 1 0 0-.01",
  upload: "M12 16V4m-5 5 5-5 5 5M4 16v3h16v-3",
  alert: "M12 4 2.5 20h19L12 4Zm0 6v4.5m0 2.5v.01",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9v.01",
  scan: "M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M7 15l3-4 3 2 4-5",
  external: "M14 4h6v6m0-6-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
};

export default function Icon({ name, size = 20, className = "" }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
