import type { Mood } from "./moodTypes";

interface KaijuSvgProps {
  stageId: number;
  mood: Mood;
  className?: string;
}

const MOOD_TINT: Record<Mood, { body: string; belly: string; glow: string }> = {
  great: { body: "#4fd67a", belly: "#bff2cf", glow: "#5df27a" },
  good: { body: "#57c48a", belly: "#c8ecd6", glow: "#39e6c8" },
  neutral: { body: "#6f9e8a", belly: "#cfe3d8", glow: "#8fb9ac" },
  rough: { body: "#7a7690", belly: "#d6d2e6", glow: "#a374ff" },
};

/** Spikes rendered along a back curve; count/size scale with stage. */
function Spikes({ n, cx, topY, spread, height, color }: { n: number; cx: number; topY: number; spread: number; height: number; color: string }) {
  const spikes = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const x = cx - spread / 2 + spread * t;
    const arc = Math.sin(t * Math.PI);
    const y = topY - arc * (height * 0.35);
    const h = height * (0.55 + arc * 0.6);
    spikes.push(
      <polygon
        key={i}
        points={`${x - 6},${y + h} ${x},${y - h} ${x + 6},${y + h}`}
        fill={color}
        stroke="#0b1020"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />,
    );
  }
  return <>{spikes}</>;
}

export default function KaijuSvg({ stageId, mood, className }: KaijuSvgProps) {
  const tint = MOOD_TINT[mood];
  const cx = 100;
  const groundY = 178;

  if (stageId === 0) {
    return (
      <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Kaiju egg">
        <ellipse cx={cx} cy={groundY + 4} rx={38} ry={8} fill="#000" opacity={0.25} />
        <g className="animate-breathe" style={{ transformOrigin: `${cx}px ${groundY}px` }}>
          <ellipse cx={cx} cy={groundY - 38} rx={36} ry={46} fill={tint.belly} stroke={tint.body} strokeWidth={4} />
          <path d="M78,150 Q95,132 88,116 Q108,124 100,104" fill="none" stroke={tint.body} strokeWidth={3} strokeLinecap="round" />
          <path d="M118,146 Q106,130 116,118" fill="none" stroke={tint.body} strokeWidth={3} strokeLinecap="round" />
          <ellipse cx={cx} cy={groundY - 38} rx={36} ry={46} fill="none" stroke="#0b1020" strokeWidth={2} opacity={0.4} />
        </g>
      </svg>
    );
  }

  const scale = [0, 0.62, 0.78, 0.92, 1.05, 1.18][stageId] ?? 1;
  const spikeCount = [0, 0, 3, 5, 6, 7][stageId] ?? 0;
  const hasAura = stageId >= 4;
  const hasCrown = stageId >= 5;
  const eyeGlow = stageId >= 3;
  const bodyH = 70 * scale;
  const bodyW = 46 * scale;
  const headR = 26 * scale;
  const headCy = groundY - bodyH * 1.55;

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Kaiju">
      <ellipse cx={cx} cy={groundY + 6} rx={20 + 20 * scale} ry={9} fill="#000" opacity={0.3} />

      {hasAura && (
        <circle
          cx={cx}
          cy={groundY - bodyH}
          r={70}
          fill={tint.glow}
          className="animate-auraGlow"
          style={{ transformOrigin: `${cx}px ${groundY - bodyH}px` }}
        />
      )}

      <g className="animate-breathe" style={{ transformOrigin: `${cx}px ${groundY}px` }}>
        {/* tail */}
        <path
          d={`M${cx + bodyW * 0.55},${groundY - bodyH * 0.3}
              Q${cx + bodyW * 1.6},${groundY - bodyH * 0.1} ${cx + bodyW * 1.9 + scale * 10},${groundY - bodyH * 0.55}`}
          fill="none"
          stroke={tint.body}
          strokeWidth={10 * scale}
          strokeLinecap="round"
        />
        {stageId >= 3 && (
          <polygon
            points={`${cx + bodyW * 1.9 + scale * 10},${groundY - bodyH * 0.72} ${cx + bodyW * 2.15 + scale * 10},${groundY - bodyH * 0.55} ${cx + bodyW * 1.9 + scale * 10},${groundY - bodyH * 0.38}`}
            fill={tint.body}
            stroke="#0b1020"
            strokeWidth={1.5}
          />
        )}

        {/* legs */}
        <rect x={cx - bodyW * 0.55} y={groundY - bodyH * 0.32} width={bodyW * 0.34} height={bodyH * 0.4} rx={bodyW * 0.16} fill={tint.body} />
        <rect x={cx + bodyW * 0.21} y={groundY - bodyH * 0.32} width={bodyW * 0.34} height={bodyH * 0.4} rx={bodyW * 0.16} fill={tint.body} />

        {/* arms */}
        <rect
          x={cx - bodyW * 0.95}
          y={groundY - bodyH * 1.05}
          width={bodyW * 0.32}
          height={bodyH * 0.55}
          rx={bodyW * 0.15}
          fill={tint.body}
          transform={`rotate(18 ${cx - bodyW * 0.8} ${groundY - bodyH * 0.9})`}
        />
        <rect
          x={cx + bodyW * 0.63}
          y={groundY - bodyH * 1.05}
          width={bodyW * 0.32}
          height={bodyH * 0.55}
          rx={bodyW * 0.15}
          fill={tint.body}
          transform={`rotate(-18 ${cx + bodyW * 0.8} ${groundY - bodyH * 0.9})`}
        />
        {stageId >= 2 && (
          <>
            <polygon points={`${cx - bodyW * 0.95},${groundY - bodyH * 0.58} ${cx - bodyW * 1.08},${groundY - bodyH * 0.48} ${cx - bodyW * 0.88},${groundY - bodyH * 0.44}`} fill="#e7ecff" />
            <polygon points={`${cx + bodyW * 0.95},${groundY - bodyH * 0.58} ${cx + bodyW * 1.08},${groundY - bodyH * 0.48} ${cx + bodyW * 0.88},${groundY - bodyH * 0.44}`} fill="#e7ecff" />
          </>
        )}

        {/* body */}
        <ellipse cx={cx} cy={groundY - bodyH * 0.75} rx={bodyW} ry={bodyH * 0.65} fill={tint.body} stroke="#0b1020" strokeWidth={2.5} />
        <ellipse cx={cx} cy={groundY - bodyH * 0.6} rx={bodyW * 0.62} ry={bodyH * 0.42} fill={tint.belly} />

        {/* back spikes */}
        {spikeCount > 0 && (
          <Spikes n={spikeCount} cx={cx} topY={groundY - bodyH * 1.28} spread={bodyW * 1.5} height={14 * scale} color={tint.body} />
        )}

        {/* head */}
        <circle cx={cx} cy={headCy} r={headR} fill={tint.body} stroke="#0b1020" strokeWidth={2.5} />

        {hasCrown && (
          <g>
            <polygon points={`${cx - 22},${headCy - headR + 4} ${cx - 14},${headCy - headR - 22} ${cx - 6},${headCy - headR + 4}`} fill={tint.glow} />
            <polygon points={`${cx - 5},${headCy - headR - 2} ${cx},${headCy - headR - 30} ${cx + 5},${headCy - headR - 2}`} fill={tint.glow} />
            <polygon points={`${cx + 6},${headCy - headR + 4} ${cx + 14},${headCy - headR - 22} ${cx + 22},${headCy - headR + 4}`} fill={tint.glow} />
          </g>
        )}

        {/* eyes */}
        <ellipse cx={cx - headR * 0.42} cy={headCy - 2} rx={eyeGlow ? 7 : 6} ry={eyeGlow ? 8 : 7} fill={eyeGlow ? tint.glow : "#fff"} className={eyeGlow ? "animate-pulseGlow" : undefined} />
        <ellipse cx={cx + headR * 0.42} cy={headCy - 2} rx={eyeGlow ? 7 : 6} ry={eyeGlow ? 8 : 7} fill={eyeGlow ? tint.glow : "#fff"} className={eyeGlow ? "animate-pulseGlow" : undefined} />
        <circle cx={cx - headR * 0.42} cy={headCy - 1} r={3} fill="#0b1020" />
        <circle cx={cx + headR * 0.42} cy={headCy - 1} r={3} fill="#0b1020" />

        {/* mouth */}
        {mood === "rough" ? (
          <path d={`M${cx - 9},${headCy + headR * 0.55} Q${cx},${headCy + headR * 0.4} ${cx + 9},${headCy + headR * 0.55}`} fill="none" stroke="#0b1020" strokeWidth={2.5} strokeLinecap="round" />
        ) : (
          <path d={`M${cx - 10},${headCy + headR * 0.42} Q${cx},${headCy + headR * 0.75} ${cx + 10},${headCy + headR * 0.42}`} fill="none" stroke="#0b1020" strokeWidth={2.5} strokeLinecap="round" />
        )}
        {stageId >= 3 && mood !== "rough" && (
          <>
            <polygon points={`${cx - 7},${headCy + headR * 0.46} ${cx - 4},${headCy + headR * 0.46} ${cx - 5.5},${headCy + headR * 0.6}`} fill="#fff" />
            <polygon points={`${cx + 7},${headCy + headR * 0.46} ${cx + 4},${headCy + headR * 0.46} ${cx + 5.5},${headCy + headR * 0.6}`} fill="#fff" />
          </>
        )}

        {/* head spikes for juvenile+ (non-crown) */}
        {stageId >= 2 && stageId < 5 && (
          <polygon points={`${cx - 6},${headCy - headR + 6} ${cx},${headCy - headR - 12 * scale} ${cx + 6},${headCy - headR + 6}`} fill={tint.body} stroke="#0b1020" strokeWidth={1.5} />
        )}
      </g>
    </svg>
  );
}
