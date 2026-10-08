export function SceneFallback() {
  return (
    <svg
      className="scene-fallback"
      viewBox="0 0 1400 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth=".7">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${800 + i * 36} 900V${230 + i * 44}a${260 - i * 36} ${260 - i * 36} 0 0 1 ${520 - i * 72} 0V900`}
          />
        ))}
        <path d="M500 900 1060 580l340 180M1060 580v320M650 840h750M780 770h620M900 700h500" />
      </g>
    </svg>
  );
}
