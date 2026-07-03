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
  blush: string;
  outline: string;
  sparkle: boolean;
  crown: boolean;
}

const PALETTES: Palette[] = [
  { body: "#b7f0c0", bodyLight: "#e3fbe6", bodyDark: "#8ed69b", belly: "#fff6df", bellyDark: "#ffe9bc", spike: "#ffc2d1", spikeLight: "#ffe0e8", eye: "#3b2a20", blush: "#ff9fb3", outline: "#3f6b46", sparkle: false, crown: false },
  { body: "#9de6ac", bodyLight: "#c9f7d3", bodyDark: "#6fc984", belly: "#fff0d0", bellyDark: "#ffdfa8", spike: "#ffb0c6", spikeLight: "#ffd3de", eye: "#2e2118", blush: "#ff90a8", outline: "#2f5a3a", sparkle: false, crown: false },
  { body: "#7fdba0", bodyLight: "#b3efc6", bodyDark: "#54b978", belly: "#fff0d0", bellyDark: "#ffdca0", spike: "#ffd166", spikeLight: "#ffe6a3", eye: "#241c14", blush: "#ff8aa0", outline: "#28503a", sparkle: false, crown: false },
  { body: "#5fcf8f", bodyLight: "#8fe6b3", bodyDark: "#3ba86c", belly: "#ffedc2", bellyDark: "#ffd48f", spike: "#ffd166", spikeLight: "#ffe6a3", eye: "#2a6fdb", blush: "#ff8296", outline: "#1f4530", sparkle: true, crown: false },
  { body: "#45b87a", bodyLight: "#78d6a0", bodyDark: "#2a8f5c", belly: "#ffe6ad", bellyDark: "#ffcb73", spike: "#c9a0ff", spikeLight: "#e6cfff", eye: "#ffb238", blush: "#ff7d94", outline: "#194526", sparkle: true, crown: false },
  { body: "#2fae7a", bodyLight: "#5fd6a3", bodyDark: "#1c8560", belly: "#ffe9b8", bellyDark: "#ffce80", spike: "#ffd75e", spikeLight: "#fff0b0", eye: "#7fe0ff", blush: "#ff7a90", outline: "#123a2b", sparkle: true, crown: true },
];

const SHINE = "#ffffff";

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/**
 * Draws a cute chibi-proportioned pixel-art kaiju at the given growth stage (0-5)
 * onto a GRIDxGRID canvas. `time` (seconds) drives a gentle idle bob and blink.
 */
export function drawKaiju(ctx: CanvasRenderingContext2D, stage: number, time = 0) {
  const s = Math.max(0, Math.min(5, stage));
  const t = s / 5;
  const pal = PALETTES[s];
  const outline = pal.outline;

  // outlined block: dark rim first, fill drawn inset on top
  function part(x: number, y: number, w: number, h: number, color: string) {
    px(ctx, x - 1, y - 1, w + 2, h + 2, outline);
    px(ctx, x, y, w, h, color);
  }

  // fake rounded corners by nibbling the outline block's corner pixels
  function roundCorners(x: number, y: number, w: number, h: number, amount = 1) {
    ctx.clearRect(x - 1, y - 1, amount, amount);
    ctx.clearRect(x + w + 1 - amount, y - 1, amount, amount);
    ctx.clearRect(x - 1, y + h + 1 - amount, amount, amount);
    ctx.clearRect(x + w + 1 - amount, y + h + 1 - amount, amount, amount);
  }

  ctx.clearRect(0, 0, GRID, GRID);

  const groundY = GRID - 3;
  const bodyW = Math.round(10 + t * 8);
  const bodyH = Math.round(7 + t * 6);
  const legH = Math.round(2 + t * 2);
  const legW = Math.round(3 + t * 2);
  const headScale = 0.9 - t * 0.12; // chibi: head stays big relative to body at every stage
  const headW = Math.round(bodyW * headScale);
  const headH = Math.round(headW * 0.86);
  const snoutW = Math.max(2, Math.round(headW * 0.3));
  const snoutH = Math.max(2, Math.round(headH * 0.28));
  const armW = 2 + Math.round(t);
  const armH = 2 + Math.round(t * 2);
  const tailLen = Math.round(4 + t * 6);
  const spikeCount = 2 + s;

  // idle animation: soft breathing bob + occasional blink
  const bob = Math.sin(time * 2.1) * 0.7;
  const blinkCycle = time % 3.6;
  const blinking = blinkCycle > 3.35 && blinkCycle < 3.5;

  const cx = GRID / 2;
  const legY = groundY - legH;

  // ground shadow stays put; the creature bobs above it
  ctx.globalAlpha = 0.22;
  px(ctx, cx - bodyW / 2, groundY, bodyW + 2, 2, "#000000");
  ctx.globalAlpha = 1;

  ctx.save();
  ctx.translate(0, bob);

  const bodyY = legY - bodyH;
  const bodyX = cx - bodyW / 2;
  const headY = bodyY - headH + 2;
  const headX = cx - headW / 2;

  // tail: short and curled, rounded ball tip for a cute flourish
  const tailSegs = 3;
  for (let i = tailSegs - 1; i >= 0; i--) {
    const segLen = tailLen / tailSegs;
    const segX = bodyX + bodyW - 2 + i * segLen;
    const segH = Math.max(2, bodyH * 0.4 * (1 - i / (tailSegs + 1)));
    const segY = legY - segH - i * 0.8;
    part(segX, segY, segLen + 1, segH, i === 0 ? pal.bodyDark : pal.body);
    roundCorners(segX, segY, segLen + 1, segH, 1);
  }

  // stubby back legs
  const leg1X = bodyX + 1;
  const leg2X = bodyX + bodyW - legW - 1;
  part(leg1X, legY, legW, legH, pal.bodyDark);
  part(leg2X, legY, legW, legH, pal.bodyDark);
  roundCorners(leg1X, legY, legW, legH, 1);
  roundCorners(leg2X, legY, legW, legH, 1);

  // round body with soft highlight / shadow shading
  part(bodyX, bodyY, bodyW, bodyH, pal.body);
  roundCorners(bodyX, bodyY, bodyW, bodyH, 2);
  px(ctx, bodyX + 1, bodyY + 1, Math.max(1, bodyW * 0.2), bodyH - 2, pal.bodyLight);
  px(ctx, bodyX + bodyW - Math.max(1, bodyW * 0.16) - 1, bodyY + 1, Math.max(1, bodyW * 0.16), bodyH - 2, pal.bodyDark);

  // round belly
  const bellyX = cx - bodyW * 0.22;
  const bellyY = bodyY + bodyH * 0.34;
  const bellyW = bodyW * 0.46;
  const bellyH = bodyH * 0.56;
  ctx.fillStyle = pal.belly;
  ctx.beginPath();
  ctx.ellipse(bellyX + bellyW / 2, bellyY + bellyH / 2, bellyW / 2, bellyH / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  px(ctx, bellyX, bellyY + bellyH * 0.6, bellyW, Math.max(1, bellyH * 0.15), pal.bellyDark);

  // stubby little arms
  const armX1 = bodyX - armW + 1;
  const armX2 = bodyX + bodyW - 1;
  const armY = bodyY + bodyH * 0.35;
  part(armX1, armY, armW, armH, pal.bodyDark);
  part(armX2, armY, armW, armH, pal.bodyDark);
  roundCorners(armX1, armY, armW, armH, 1);
  roundCorners(armX2, armY, armW, armH, 1);

  // big round chibi head with highlight
  part(headX, headY, headW, headH, pal.body);
  roundCorners(headX, headY, headW, headH, 2);
  px(ctx, headX + 1, headY + 1, Math.max(1, headW * 0.26), headH - 2, pal.bodyLight);

  // tiny crown for the max evolution
  if (pal.crown) {
    const crownW = headW * 0.5;
    const crownX = headX + headW * 0.28;
    const crownY = headY - 2.5;
    ctx.fillStyle = "#ffd75e";
    ctx.beginPath();
    ctx.moveTo(crownX, crownY + 2.5);
    ctx.lineTo(crownX, crownY);
    ctx.lineTo(crownX + crownW * 0.25, crownY + 1.3);
    ctx.lineTo(crownX + crownW * 0.5, crownY);
    ctx.lineTo(crownX + crownW * 0.75, crownY + 1.3);
    ctx.lineTo(crownX + crownW, crownY);
    ctx.lineTo(crownX + crownW, crownY + 2.5);
    ctx.closePath();
    ctx.fill();
  }

  // rounded snout: plain fill (no outline ring, since it sits mostly inside the
  // head) with just a soft shadow underneath to read as a muzzle, not a seam
  const snoutX = headX + headW * 0.68;
  const snoutY = headY + headH * 0.5;
  px(ctx, snoutX, snoutY, snoutW, snoutH, pal.body);
  px(ctx, snoutX, snoutY + snoutH - 1, snoutW, 1, pal.bodyDark);
  px(ctx, snoutX + snoutW * 0.55, snoutY + snoutH * 0.25, 1, 1, outline);

  // friendly smile, with a tiny nub tooth peeking for a playful (not fierce) grin
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(snoutX + snoutW * 0.05, snoutY + snoutH * 0.85);
  ctx.quadraticCurveTo(snoutX + snoutW * 0.4, snoutY + snoutH * 1.35, snoutX + snoutW * 0.75, snoutY + snoutH * 0.85);
  ctx.stroke();
  if (s >= 2) {
    px(ctx, snoutX + snoutW * 0.38, snoutY + snoutH * 0.85, 1, 1.1, "#f5f0e1");
  }

  // cheek blush
  ctx.fillStyle = pal.blush;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.ellipse(headX + headW * 0.22, headY + headH * 0.62, headW * 0.13, headH * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // big sparkly eye with white shine, or a happy closed-eye arc when blinking
  const eyeSize = Math.max(2.2, headW * 0.34);
  const eyeX = headX + headW * 0.46;
  const eyeY = headY + headH * 0.32;
  if (blinking) {
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(eyeX + eyeSize * 0.4, eyeY + eyeSize * 0.45, eyeSize * 0.45, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#f5f0e1";
    ctx.beginPath();
    ctx.ellipse(eyeX + eyeSize * 0.4, eyeY + eyeSize * 0.4, eyeSize * 0.52, eyeSize * 0.58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pal.eye;
    ctx.beginPath();
    ctx.ellipse(eyeX + eyeSize * 0.46, eyeY + eyeSize * 0.46, eyeSize * 0.3, eyeSize * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    // shine dot for sparkle
    px(ctx, eyeX + eyeSize * 0.22, eyeY + eyeSize * 0.12, Math.max(1, eyeSize * 0.16), Math.max(1, eyeSize * 0.16), SHINE);

    if (pal.sparkle) {
      const twinkle = (Math.sin(time * 3 + s) + 1) / 2;
      ctx.globalAlpha = 0.5 + twinkle * 0.5;
      ctx.fillStyle = SHINE;
      const spX = eyeX + eyeSize * 1.5;
      const spY = eyeY - eyeSize * 0.3;
      ctx.fillRect(spX - 1.5, spY, 3, 0.8);
      ctx.fillRect(spX, spY - 1.5, 0.8, 3);
      ctx.globalAlpha = 1;
    }
  }

  // back plates: small rounded scallops (dark base, light tip) running from the
  // back of the head, over the top of the body, to the base of the tail —
  // staying clear of the face, which sits on the head's right/front side
  const spikeStartX = headX + headW * 0.15;
  const spikeEndX = bodyX + bodyW * 0.92;
  const headRightEdge = headX + headW;
  for (let i = 0; i < spikeCount; i++) {
    const frac = i / (spikeCount - 1 || 1);
    const sx = spikeStartX + frac * (spikeEndX - spikeStartX);
    const baseY = sx < headRightEdge ? headY + 1 : bodyY + 1;
    const r = 1.1 + t * 0.9 + Math.sin(frac * Math.PI) * 0.6;
    ctx.fillStyle = pal.spike;
    ctx.beginPath();
    ctx.arc(sx, baseY, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pal.spikeLight;
    ctx.beginPath();
    ctx.arc(sx - r * 0.25, baseY - r * 0.25, r * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
