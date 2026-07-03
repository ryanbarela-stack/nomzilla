export const GRID = 32;

interface Palette {
  body: string;
  bodyLight: string;
  bodyDark: string;
  belly: string;
  bellyDark: string;
  spike: string;
  spikeLight: string;
  eye: string;
  eyeGlow: boolean;
  outline: string;
}

const PALETTES: Palette[] = [
  { body: "#8fd35c", bodyLight: "#b6e88c", bodyDark: "#5fa73a", belly: "#f2e6b8", bellyDark: "#e3d093", spike: "#4f8f2f", spikeLight: "#7fc94f", eye: "#1a1a1a", eyeGlow: false, outline: "#20390f" },
  { body: "#7cc94e", bodyLight: "#a3de78", bodyDark: "#4f9c33", belly: "#eee0ab", bellyDark: "#dfc98a", spike: "#3f7d26", spikeLight: "#68a83f", eye: "#1a1a1a", eyeGlow: false, outline: "#1c330d" },
  { body: "#68b644", bodyLight: "#8fce68", bodyDark: "#3f8a2a", belly: "#e6d59e", bellyDark: "#d6c082", spike: "#33691e", spikeLight: "#569636", eye: "#1a1a1a", eyeGlow: false, outline: "#182c0b" },
  { body: "#57a23a", bodyLight: "#7cbb5c", bodyDark: "#357226", belly: "#dcc890", bellyDark: "#c9b076", spike: "#2a5518", spikeLight: "#4a7c30", eye: "#e33d3d", eyeGlow: false, outline: "#152509" },
  { body: "#489330", bodyLight: "#6cae4c", bodyDark: "#2c6b1f", belly: "#d1bb7f", bellyDark: "#bfa46a", spike: "#ecd53c", spikeLight: "#fff08a", eye: "#ff5033", eyeGlow: true, outline: "#101f08" },
  { body: "#398324", bodyLight: "#5ba33e", bodyDark: "#215817", belly: "#c3ac70", bellyDark: "#af955c", spike: "#5ff3ff", spikeLight: "#b8faff", eye: "#ffb300", eyeGlow: true, outline: "#0c1806" },
];

const TEETH = "#f5f0e1";
const SCLERA = "#f5f0e1";

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/** Draws a stylized pixel-art kaiju at the given growth stage (0-5) onto a GRIDxGRID canvas. */
export function drawKaiju(ctx: CanvasRenderingContext2D, stage: number) {
  const s = Math.max(0, Math.min(5, stage));
  const t = s / 5;
  const pal = PALETTES[s];

  // outlined block: dark rim first, fill drawn inset on top
  function part(x: number, y: number, w: number, h: number, color: string) {
    px(ctx, x - 1, y - 1, w + 2, h + 2, pal.outline);
    px(ctx, x, y, w, h, color);
  }

  ctx.clearRect(0, 0, GRID, GRID);

  const groundY = GRID - 3;
  const bodyW = Math.round(9 + t * 9);
  const bodyH = Math.round(8 + t * 8);
  const legH = Math.round(3 + t * 3);
  const legW = Math.round(3 + t * 2);
  const headW = Math.round(bodyW * 0.58);
  const headH = Math.round(bodyH * 0.44);
  const snoutW = Math.max(2, Math.round(headW * 0.4));
  const snoutH = Math.max(2, Math.round(headH * 0.4));
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

  // ground shadow
  ctx.globalAlpha = 0.25;
  px(ctx, cx - bodyW / 2, groundY, bodyW + 2, 2, "#000000");
  ctx.globalAlpha = 1;

  // tail: tapering segments, drawn back-to-front so the base overlaps cleanly
  const tailSegs = 4;
  for (let i = tailSegs - 1; i >= 0; i--) {
    const segLen = tailLen / tailSegs;
    const segX = bodyX + bodyW - 2 + i * segLen;
    const segH = Math.max(2, (bodyH * 0.5) * (1 - i / (tailSegs + 1)));
    const segY = legY - segH - i * 0.6;
    part(segX, segY, segLen + 1, segH, pal.bodyDark);
    if (s >= 2 && i < tailSegs - 1) {
      px(ctx, segX + segLen * 0.25, segY - 1, 1.3, 1.3, pal.spike);
    }
  }

  // back legs with tiny toe claws
  const leg1X = bodyX + 1;
  const leg2X = bodyX + bodyW - legW - 1;
  part(leg1X, legY, legW, legH, pal.bodyDark);
  part(leg2X, legY, legW, legH, pal.bodyDark);
  px(ctx, leg1X - 0.5, legY + legH, legW * 0.7, 1, pal.outline);
  px(ctx, leg2X - 0.5, legY + legH, legW * 0.7, 1, pal.outline);

  // body with left-highlight / right-shadow shading
  part(bodyX, bodyY, bodyW, bodyH, pal.body);
  px(ctx, bodyX + 1, bodyY + 1, Math.max(1, bodyW * 0.22), bodyH - 2, pal.bodyLight);
  px(ctx, bodyX + bodyW - Math.max(1, bodyW * 0.18) - 1, bodyY + 1, Math.max(1, bodyW * 0.18), bodyH - 2, pal.bodyDark);

  // belly with a darker accent band
  const bellyX = cx - bodyW * 0.24;
  const bellyY = bodyY + bodyH * 0.32;
  const bellyW = bodyW * 0.48;
  const bellyH = bodyH * 0.58;
  px(ctx, bellyX, bellyY, bellyW, bellyH, pal.belly);
  px(ctx, bellyX, bellyY + bellyH * 0.55, bellyW, Math.max(1, bellyH * 0.18), pal.bellyDark);

  // arms with clawed hands
  const armX1 = bodyX - armW + 1;
  const armX2 = bodyX + bodyW - 1;
  const armY = bodyY + bodyH * 0.3;
  part(armX1, armY, armW, armH, pal.bodyDark);
  part(armX2, armY, armW, armH, pal.bodyDark);
  px(ctx, armX1, armY + armH - 1, armW, 1, pal.spikeLight);
  px(ctx, armX2, armY + armH - 1, armW, 1, pal.spikeLight);

  // head with highlight
  part(headX, headY, headW, headH, pal.body);
  px(ctx, headX + 1, headY + 1, Math.max(1, headW * 0.28), headH - 2, pal.bodyLight);

  // snout, nostril and (from stage 1+) teeth
  const snoutX = headX + headW * 0.72;
  const snoutY = headY + headH * 0.46;
  part(snoutX, snoutY, snoutW, snoutH, pal.body);
  px(ctx, snoutX + snoutW * 0.55, snoutY + snoutH * 0.2, 1, 1, pal.outline);
  if (s >= 1) {
    ctx.fillStyle = TEETH;
    ctx.beginPath();
    ctx.moveTo(snoutX + snoutW * 0.15, snoutY + snoutH);
    ctx.lineTo(snoutX + snoutW * 0.55, snoutY + snoutH);
    ctx.lineTo(snoutX + snoutW * 0.35, snoutY + snoutH + 1.4);
    ctx.closePath();
    ctx.fill();
  }

  // eye: sclera + pupil, with a brow ridge once it looks fiercer
  const eyeSize = Math.max(1.6, headW * 0.24);
  const eyeX = headX + headW * 0.52;
  const eyeY = headY + headH * 0.3;
  px(ctx, eyeX - 0.4, eyeY - 0.4, eyeSize + 0.8, eyeSize + 0.8, SCLERA);
  if (pal.eyeGlow) {
    ctx.save();
    ctx.shadowColor = pal.eye;
    ctx.shadowBlur = 3;
    px(ctx, eyeX, eyeY, eyeSize * 0.65, eyeSize * 0.65, pal.eye);
    ctx.restore();
  } else {
    px(ctx, eyeX, eyeY, eyeSize * 0.65, eyeSize * 0.65, pal.eye);
  }
  if (s >= 3) {
    px(ctx, eyeX - 0.6, eyeY - 1.6, eyeSize + 1.2, 1.1, pal.outline);
  }

  // back spikes: two-tone (dark base, light tip) along head + body top edge
  const spikeSpan = headW * 0.5 + bodyW * 0.85;
  const spikeStartX = headX + headW * 0.5;
  for (let i = 0; i < spikeCount; i++) {
    const frac = i / (spikeCount - 1 || 1);
    const sx = spikeStartX + frac * spikeSpan;
    const baseY = i === 0 ? headY : bodyY + frac * bodyH * 0.15;
    const h = Math.round(2 + t * 3 + Math.sin(frac * Math.PI) * 2);
    ctx.fillStyle = pal.spike;
    ctx.beginPath();
    ctx.moveTo(sx - 0.2, baseY);
    ctx.lineTo(sx + 1.6, baseY);
    ctx.lineTo(sx + 0.7, baseY - h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = pal.spikeLight;
    ctx.beginPath();
    ctx.moveTo(sx + 0.3, baseY - h * 0.45);
    ctx.lineTo(sx + 1.1, baseY - h * 0.45);
    ctx.lineTo(sx + 0.7, baseY - h);
    ctx.closePath();
    ctx.fill();
  }
}
