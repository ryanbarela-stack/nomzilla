export const GRID = 32;

interface Palette {
  body: string;
  bodyDark: string;
  belly: string;
  spike: string;
  eye: string;
  eyeGlow: boolean;
  outline: string;
}

const PALETTES: Palette[] = [
  { body: "#7ec850", bodyDark: "#5fa73a", belly: "#e8dcae", spike: "#4f8f2f", eye: "#1a1a1a", eyeGlow: false, outline: "#274a17" },
  { body: "#6fbf4a", bodyDark: "#4f9c33", belly: "#e6dba9", spike: "#3f7d26", eye: "#1a1a1a", eyeGlow: false, outline: "#233f14" },
  { body: "#5cad3f", bodyDark: "#3f8a2a", belly: "#e0d29c", spike: "#33691e", eye: "#1a1a1a", eyeGlow: false, outline: "#1e3612" },
  { body: "#4a9a35", bodyDark: "#357226", belly: "#d9c98f", spike: "#2a5518", eye: "#c62828", eyeGlow: false, outline: "#1a2f10" },
  { body: "#3d8a2c", bodyDark: "#2c6b1f", belly: "#cfbd80", spike: "#dfe84a", eye: "#ff3b30", eyeGlow: true, outline: "#16260c" },
  { body: "#2f7a22", bodyDark: "#215817", belly: "#c4b070", spike: "#4ff0ff", eye: "#ffb300", eyeGlow: true, outline: "#0f1c08" },
];

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/** Draws a stylized pixel-art kaiju at the given growth stage (0-5) onto a GRIDxGRID canvas. */
export function drawKaiju(ctx: CanvasRenderingContext2D, stage: number) {
  const s = Math.max(0, Math.min(5, stage));
  const t = s / 5;
  const pal = PALETTES[s];

  ctx.clearRect(0, 0, GRID, GRID);

  const groundY = GRID - 3;
  const bodyW = Math.round(9 + t * 9);
  const bodyH = Math.round(8 + t * 8);
  const legH = Math.round(3 + t * 3);
  const legW = Math.round(3 + t * 2);
  const headW = Math.round(bodyW * 0.55);
  const headH = Math.round(bodyH * 0.42);
  const armW = 2 + Math.round(t * 2);
  const armH = Math.round(3 + t * 3);
  const tailLen = Math.round(5 + t * 9);
  const spikeCount = 2 + s;

  const cx = GRID / 2;
  const legY = groundY - legH;
  const bodyY = legY - bodyH;
  const bodyX = cx - bodyW / 2;
  const headY = bodyY - headH + 1;
  const headX = cx - headW / 2;

  // shadow
  ctx.globalAlpha = 0.25;
  px(ctx, cx - bodyW / 2, groundY, bodyW + 2, 2, "#000000");
  ctx.globalAlpha = 1;

  // tail (extends to the right, tapering down to the ground)
  const tailSegs = 4;
  for (let i = 0; i < tailSegs; i++) {
    const segLen = tailLen / tailSegs;
    const segX = bodyX + bodyW - 2 + i * segLen;
    const segH = Math.max(2, (bodyH * 0.5) * (1 - i / (tailSegs + 1)));
    const segY = legY - segH - i * 0.6;
    px(ctx, segX, segY, segLen + 1, segH, pal.bodyDark);
  }

  // back legs
  px(ctx, bodyX + 1, legY, legW, legH, pal.bodyDark);
  px(ctx, bodyX + bodyW - legW - 1, legY, legW, legH, pal.bodyDark);

  // body
  px(ctx, bodyX, bodyY, bodyW, bodyH, pal.body);
  // belly
  px(ctx, cx - bodyW * 0.25, bodyY + bodyH * 0.35, bodyW * 0.5, bodyH * 0.55, pal.belly);

  // arms
  px(ctx, bodyX - armW + 1, bodyY + bodyH * 0.3, armW, armH, pal.bodyDark);
  px(ctx, bodyX + bodyW - 1, bodyY + bodyH * 0.3, armW, armH, pal.bodyDark);

  // head
  px(ctx, headX, headY, headW, headH, pal.body);

  // eye
  const eyeSize = Math.max(1, Math.round(headW * 0.18));
  const eyeX = headX + headW * 0.55;
  const eyeY = headY + headH * 0.4;
  if (pal.eyeGlow) {
    ctx.save();
    ctx.shadowColor = pal.eye;
    ctx.shadowBlur = 3;
    px(ctx, eyeX, eyeY, eyeSize, eyeSize, pal.eye);
    ctx.restore();
  } else {
    px(ctx, eyeX, eyeY, eyeSize, eyeSize, pal.eye);
  }

  // back spikes: along head + body top edge
  const spikeSpan = headW * 0.5 + bodyW * 0.85;
  const spikeStartX = headX + headW * 0.5;
  const spikeBaseY = headY;
  for (let i = 0; i < spikeCount; i++) {
    const frac = i / (spikeCount - 1 || 1);
    const sx = spikeStartX + frac * spikeSpan;
    const curveY = bodyY - (headY - bodyY) * frac + (i === 0 ? 0 : 0);
    const baseY = i === 0 ? spikeBaseY : bodyY + (frac * bodyH * 0.15);
    const h = Math.round(2 + t * 3 + Math.sin(frac * Math.PI) * 2);
    ctx.fillStyle = pal.spike;
    ctx.beginPath();
    ctx.moveTo(sx, baseY);
    ctx.lineTo(sx + 1.4, baseY);
    ctx.lineTo(sx + 0.7, baseY - h);
    ctx.closePath();
    ctx.fill();
    void curveY;
  }

  // outline accents on feet
  px(ctx, bodyX + 1, legY + legH - 1, legW, 1, pal.outline);
  px(ctx, bodyX + bodyW - legW - 1, legY + legH - 1, legW, 1, pal.outline);
}
