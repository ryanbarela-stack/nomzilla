import type { PathId } from "./paths";

export const GRID = 48;
// Scale factor from the original 32px design — every absolute pixel measurement
// below is written as "base-at-32px * S" so the whole cast gained more canvas
// real estate (and therefore room for finer detail) without changing proportions.
const S = GRID / 32;
const GROUND_Y = GRID - 3 * S;
const CX = GRID / 2;

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawGroundShadow(ctx: CanvasRenderingContext2D, width: number) {
  ctx.globalAlpha = 0.22;
  px(ctx, CX - width / 2, GROUND_Y, width, 2 * S, "#000000");
  ctx.globalAlpha = 1;
}

const EGG_PALETTE = {
  shell: "#f2ede0",
  shellLight: "#ffffff",
  shellMid: "#e6e0d0",
  shellDark: "#d8d2c2",
  speckle: "#b8b2a4",
  outline: "#8f8b82",
  glow: "#ffe9a8",
};

function drawEggBody(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const centerY = GROUND_Y - h / 2;
  ctx.lineWidth = 1 * S;
  ctx.fillStyle = EGG_PALETTE.shell;
  ctx.strokeStyle = EGG_PALETTE.outline;
  ctx.beginPath();
  ctx.ellipse(CX, centerY, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // mid-tone band for a smoother rounded gradient, then the brighter highlight and darker shadow on top
  ctx.fillStyle = EGG_PALETTE.shellMid;
  ctx.beginPath();
  ctx.ellipse(CX + w * 0.08, centerY + h * 0.05, w * 0.32, h * 0.36, 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = EGG_PALETTE.shellLight;
  ctx.beginPath();
  ctx.ellipse(CX - w * 0.18, centerY - h * 0.22, w * 0.22, h * 0.28, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = EGG_PALETTE.shellDark;
  ctx.beginPath();
  ctx.ellipse(CX + w * 0.2, centerY + h * 0.2, w * 0.18, h * 0.24, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // faint hairline texture strokes to break up the flat shell surface
  ctx.strokeStyle = EGG_PALETTE.shellDark;
  ctx.lineWidth = 0.6 * S;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(CX - w * 0.3, centerY - h * 0.15);
  ctx.quadraticCurveTo(CX - w * 0.15, centerY - h * 0.02, CX - w * 0.22, centerY + h * 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(CX + w * 0.05, centerY - h * 0.32);
  ctx.quadraticCurveTo(CX + w * 0.18, centerY - h * 0.18, CX + w * 0.12, centerY - h * 0.02);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const speckles: [number, number][] = [
    [-0.2, -0.05],
    [0.18, 0.12],
    [0.02, -0.32],
    [-0.12, 0.3],
    [0.28, -0.1],
    [-0.3, 0.12],
    [0.1, 0.34],
    [0.32, 0.18],
  ];
  for (const [ox, oy] of speckles) {
    px(ctx, CX + ox * w - 0.65 * S, centerY + oy * h - 0.65 * S, 1.3 * S, 1.3 * S, EGG_PALETTE.speckle);
  }
  return centerY;
}

function drawEgg(ctx: CanvasRenderingContext2D, cracked: boolean) {
  const w = 15 * S;
  const h = 19 * S;
  drawGroundShadow(ctx, w + 2 * S);
  const centerY = drawEggBody(ctx, w, h);

  if (cracked) {
    ctx.strokeStyle = EGG_PALETTE.outline;
    ctx.lineWidth = 1.1 * S;
    ctx.beginPath();
    ctx.moveTo(CX + 0.5 * S, centerY - h * 0.42);
    ctx.lineTo(CX + 2 * S, centerY - h * 0.18);
    ctx.lineTo(CX - 1.5 * S, centerY + 0.05 * h);
    ctx.lineTo(CX + 1.5 * S, centerY + 0.28 * h);
    ctx.lineTo(CX, centerY + 0.42 * h);
    ctx.stroke();

    ctx.globalAlpha = 0.8;
    ctx.fillStyle = EGG_PALETTE.glow;
    ctx.beginPath();
    ctx.ellipse(CX + 0.5 * S, centerY, 1.1 * S, 3 * S, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const HATCHLING_PALETTE = {
  body: "#c9cdd1",
  bodyLight: "#e8eaec",
  bodyDark: "#9a9fa5",
  eye: "#2a2420",
  blush: "#ffa8ba",
  outline: "#4a4d51",
};

function drawHatchling(ctx: CanvasRenderingContext2D) {
  const pal = HATCHLING_PALETTE;
  const shellW = 17 * S;
  const shellH = 8 * S;
  drawGroundShadow(ctx, shellW + 2 * S);

  const bodyW = 11 * S;
  const bodyH = 9 * S;
  const bodyX = CX - bodyW / 2;
  const bodyY = GROUND_Y - shellH * 0.55 - bodyH * 0.6;
  const headW = 9 * S;
  const headH = 8 * S;
  const headX = CX - headW / 2;
  const headY = bodyY - headH + 2 * S;

  // stubby arms resting on the shell rim
  px(ctx, bodyX - 3 * S, bodyY + bodyH * 0.4, 3 * S, 3 * S, pal.bodyDark);
  px(ctx, bodyX + bodyW, bodyY + bodyH * 0.4, 3 * S, 3 * S, pal.bodyDark);

  // torso (mostly hidden behind the shell rim, drawn first)
  px(ctx, bodyX - S, bodyY - S, bodyW + 2 * S, bodyH + 2 * S, pal.outline);
  px(ctx, bodyX, bodyY, bodyW, bodyH, pal.body);
  px(ctx, bodyX + bodyW * 0.6, bodyY + 1 * S, bodyW * 0.3, bodyH - 2 * S, pal.bodyDark);

  // head
  px(ctx, headX - S, headY - S, headW + 2 * S, headH + 2 * S, pal.outline);
  px(ctx, headX, headY, headW, headH, pal.body);
  px(ctx, headX + 1 * S, headY + 1 * S, headW * 0.3, headH - 2 * S, pal.bodyLight);

  // blush
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = pal.blush;
  ctx.beginPath();
  ctx.ellipse(headX + headW * 0.22, headY + headH * 0.62, headW * 0.14, headH * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // big eyes with shine
  const eyeY = headY + headH * 0.38;
  for (const eyeX of [headX + headW * 0.28, headX + headW * 0.64]) {
    ctx.fillStyle = "#f5f0e1";
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 1.7 * S, 1.9 * S, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pal.eye;
    ctx.beginPath();
    ctx.ellipse(eyeX + 0.3 * S, eyeY + 0.3 * S, 0.9 * S, 1.05 * S, 0, 0, Math.PI * 2);
    ctx.fill();
    px(ctx, eyeX - 0.3 * S, eyeY - 0.9 * S, 0.7 * S, 0.7 * S, "#ffffff");
  }

  // smile
  ctx.strokeStyle = pal.outline;
  ctx.lineWidth = 1 * S;
  ctx.beginPath();
  ctx.moveTo(headX + headW * 0.36, headY + headH * 0.78);
  ctx.quadraticCurveTo(headX + headW * 0.5, headY + headH * 0.95, headX + headW * 0.64, headY + headH * 0.78);
  ctx.stroke();

  // broken shell "cup" drawn last so its front rim occludes the lower torso
  const shellCenterY = GROUND_Y - shellH * 0.35;
  ctx.fillStyle = EGG_PALETTE.shell;
  ctx.strokeStyle = EGG_PALETTE.outline;
  ctx.lineWidth = 1 * S;
  ctx.beginPath();
  ctx.ellipse(CX, shellCenterY, shellW / 2, shellH / 2, 0, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // subtle shell-surface texture lines
  ctx.strokeStyle = EGG_PALETTE.shellDark;
  ctx.lineWidth = 0.5 * S;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(CX - shellW * 0.3, shellCenterY - shellH * 0.05);
  ctx.lineTo(CX - shellW * 0.15, shellCenterY + shellH * 0.15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(CX + shellW * 0.18, shellCenterY - shellH * 0.1);
  ctx.lineTo(CX + shellW * 0.3, shellCenterY + shellH * 0.1);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // jagged notches along the broken rim
  const notches: [number, number][] = [
    [-0.32, -0.9],
    [-0.05, -1.05],
    [0.2, -0.85],
    [0.4, -0.6],
  ];
  for (const [ox, oy] of notches) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.moveTo(CX + ox * shellW, shellCenterY + oy * shellH * 0.5);
    ctx.lineTo(CX + ox * shellW - 1 * S, shellCenterY + oy * shellH * 0.5 - 1.4 * S);
    ctx.lineTo(CX + ox * shellW + 1 * S, shellCenterY + oy * shellH * 0.5 - 1.4 * S);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// --- Titan: an atomic-age reptilian colossus, in side profile ---

const TITAN_PALETTE = {
  body: "#3f5057",
  bodyLight: "#5c7079",
  bodyMid: "#4c6068",
  bodyDark: "#28353a",
  belly: "#8a9aa0",
  bellyDark: "#6b7b81",
  claw: "#e8ecee",
  eye: "#7ff2ff",
  spikeBase: "#155863",
  spikeTip: "#c6fbff",
  outline: "#12181a",
  teeth: "#f0eee8",
};

interface SpikeAnchor {
  x: number;
  y: number;
  nx: number;
  ny: number;
  len: number;
}

function drawGlowSpike(ctx: CanvasRenderingContext2D, anchor: SpikeAnchor) {
  const pal = TITAN_PALETTE;
  const { x, y, nx, ny, len } = anchor;
  const tipX = x + nx * len;
  const tipY = y + ny * len;
  const perpX = -ny;
  const perpY = nx;
  const baseHalf = Math.max(0.7 * S, len * 0.16);

  ctx.fillStyle = pal.outline;
  ctx.beginPath();
  ctx.moveTo(x - perpX * (baseHalf + 0.6 * S), y - perpY * (baseHalf + 0.6 * S));
  ctx.lineTo(x + perpX * (baseHalf + 0.6 * S), y + perpY * (baseHalf + 0.6 * S));
  ctx.lineTo(tipX + nx * 0.6 * S, tipY + ny * 0.6 * S);
  ctx.closePath();
  ctx.fill();

  const grad = ctx.createLinearGradient(x, y, tipX, tipY);
  grad.addColorStop(0, pal.spikeBase);
  grad.addColorStop(1, pal.spikeTip);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(x - perpX * baseHalf, y - perpY * baseHalf);
  ctx.lineTo(x + perpX * baseHalf, y + perpY * baseHalf);
  ctx.lineTo(tipX, tipY);
  ctx.closePath();
  ctx.fill();
}

function drawTitan(ctx: CanvasRenderingContext2D, t: number) {
  const pal = TITAN_PALETTE;

  function block(x: number, y: number, w: number, h: number, color: string, round = 0) {
    px(ctx, x - S, y - S, w + 2 * S, h + 2 * S, pal.outline);
    px(ctx, x, y, w, h, color);
    if (round > 0) {
      ctx.clearRect(x - S, y - S, round, round);
      ctx.clearRect(x + w + S - round, y - S, round, round);
      ctx.clearRect(x - S, y + h + S - round, round, round);
      ctx.clearRect(x + w + S - round, y + h + S - round, round, round);
    }
  }

  function drawClaw(x: number, y: number, size: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    const dx = Math.cos(rad);
    const dy = Math.sin(rad);
    const perpX = -dy;
    const perpY = dx;
    ctx.fillStyle = pal.outline;
    ctx.beginPath();
    ctx.moveTo(x - perpX * size * 0.4, y - perpY * size * 0.4);
    ctx.lineTo(x + perpX * size * 0.4, y + perpY * size * 0.4);
    ctx.lineTo(x + dx * (size + 0.6 * S), y + dy * (size + 0.6 * S));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = pal.claw;
    ctx.beginPath();
    ctx.moveTo(x - perpX * size * 0.3, y - perpY * size * 0.3);
    ctx.lineTo(x + perpX * size * 0.3, y + perpY * size * 0.3);
    ctx.lineTo(x + dx * size, y + dy * size);
    ctx.closePath();
    ctx.fill();
  }

  const bodyW = Math.round(8.5 * S + t * 3 * S);
  const bodyH = Math.round(5 * S + t * 2 * S);
  const legW = Math.round(4.5 * S + t * 1.5 * S);
  const thighH = Math.round(4.5 * S + t * 1.7 * S);
  const shinH = Math.round(4 * S + t * 1.5 * S);
  const footLen = Math.round(5.5 * S + t * 2 * S);
  const headW = Math.round(bodyW * 0.72);
  const headH = Math.round(headW * 0.85);
  const armW = Math.round(3 * S + t * S);
  const armH = Math.round(6 * S + t * 2 * S);
  const tailBaseR = 3 * S + t * 1.1 * S;

  // anchor the hips right-of-center so the tail has room to curl on the left
  const hipX = CX + bodyW * 0.1;
  const legY = GROUND_Y - (thighH + shinH);
  const bodyY = legY - bodyH;
  const bodyX = hipX - bodyW * 0.55;
  const headX = bodyX + bodyW * 0.66;
  const headY = bodyY - headH * 0.42;

  drawGroundShadow(ctx, bodyW * 1.7);

  // --- curled tail, coiling behind the body ---
  const curlCenterX = bodyX - bodyW * 0.18;
  const curlCenterY = bodyY + bodyH * 0.95;
  const curlBaseRadius = 7 * S + t * 2.6 * S;
  const tailSegCount = 11;
  const tailPoints: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < tailSegCount; i++) {
    const frac = i / (tailSegCount - 1);
    const angleDeg = 5 + frac * 250;
    const angle = (angleDeg * Math.PI) / 180;
    const radius = curlBaseRadius * (1 - frac * 0.72);
    tailPoints.push({
      x: curlCenterX + Math.cos(angle) * radius,
      y: curlCenterY + Math.sin(angle) * radius * 0.85,
      r: Math.max(1.1 * S, tailBaseR * (1 - frac * 0.75)),
    });
  }
  for (let i = tailPoints.length - 1; i >= 0; i--) {
    const p = tailPoints[i];
    ctx.fillStyle = pal.outline;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + 0.8 * S, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = tailPoints.length - 1; i >= 0; i--) {
    const p = tailPoints[i];
    ctx.fillStyle = i % 2 === 0 ? pal.bodyMid : pal.body;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- back leg (partially behind the body, suggesting a walking stride) ---
  const backThighX = hipX - bodyW * 0.36;
  block(backThighX, legY, legW, thighH, pal.bodyDark, 1.4 * S);
  block(backThighX - legW * 0.1, legY + thighH, legW, shinH, pal.bodyDark, 1.2 * S);
  block(backThighX - legW * 0.1, legY + thighH + shinH - 1 * S, footLen * 0.7, 2.2 * S, pal.bodyDark, 1 * S);

  // --- body: a wide, squat torso with soft directional shading (one highlight,
  // one shadow corner) instead of even vertical stripes, which read as ribs ---
  block(bodyX, bodyY, bodyW, bodyH, pal.body, 2 * S);
  px(ctx, bodyX + bodyW * 0.08, bodyY + bodyH * 0.12, bodyW * 0.26, bodyH * 0.42, pal.bodyLight);
  px(ctx, bodyX + bodyW * 0.72, bodyY + bodyH * 0.4, bodyW * 0.22, bodyH * 0.5, pal.bodyDark);

  // chest/belly patch — a plain flat panel flush with the bottom edge, no
  // separate rounded cap (that read as an extra lump stuck onto the torso)
  const bellyX = bodyX + bodyW * 0.4;
  const bellyW = bodyW * 0.44;
  const bellyTopY = bodyY + bodyH * 0.48;
  px(ctx, bellyX, bellyTopY, bellyW, bodyY + bodyH - bellyTopY, pal.belly);
  px(ctx, bellyX, bodyY + bodyH * 0.66, bellyW, 0.8 * S, pal.bellyDark);

  // --- front leg, bigger and in front, with toe claws ---
  const frontThighX = hipX + bodyW * 0.02;
  block(frontThighX, legY, legW * 1.1, thighH, pal.bodyMid, 1.6 * S);
  block(frontThighX + legW * 0.25, legY + thighH, legW * 1.1, shinH, pal.body, 1.3 * S);
  block(frontThighX + legW * 0.25, legY + thighH + shinH - 1 * S, footLen, 2.6 * S, pal.body, 1 * S);
  for (let c = 0; c < 3; c++) {
    drawClaw(
      frontThighX + legW * 0.25 + footLen * 0.5 + c * (footLen * 0.22),
      legY + thighH + shinH + 1.6 * S,
      1.6 * S,
      75 + c * 5,
    );
  }

  // --- small clawed arm hanging in front of the chest ---
  const armX = bodyX + bodyW * 0.68;
  const armY = bodyY + bodyH * 0.5;
  block(armX, armY, armW, armH * 0.6, pal.bodyDark, 1 * S);
  block(armX + armW * 0.3, armY + armH * 0.55, armW, armH * 0.55, pal.bodyDark, 1 * S);
  for (let c = 0; c < 3; c++) {
    drawClaw(armX + armW * 0.3 + c * armW * 0.32, armY + armH, 1.3 * S, 100 + c * 15);
  }

  // --- head with a short attached jaw, in profile ---
  block(headX, headY, headW, headH, pal.body, 1.8 * S);

  // neck patch: paints over the head/body outline seam in their overlap zone
  // so the two shapes read as one continuous silhouette instead of two
  // separately-outlined blocks stacked on top of each other
  const neckX = headX - 1 * S;
  const neckY = bodyY - 1 * S;
  const neckW = bodyX + bodyW - headX + 2 * S;
  const neckH = headY + headH - bodyY + 2 * S;
  px(ctx, neckX, neckY, neckW, neckH, pal.body);

  px(ctx, headX + 1 * S, headY + 1 * S, headW * 0.32, headH * 0.7, pal.bodyLight);

  const jawW = headW * 0.5;
  const jawH = headH * 0.3;
  const jawX = headX + headW * 0.72;
  const jawY = headY + headH * 0.48;
  block(jawX, jawY, jawW, jawH, pal.body, 1 * S);

  // jaw patch: same seam-fusing trick as the neck patch, for the head/jaw joint
  px(ctx, jawX - 1 * S, headY + headH * 0.4, headX + headW - jawX + 2 * S, jawH * 0.35, pal.body);

  px(ctx, jawX + jawW * 0.8, jawY + jawH * 0.15, 0.9 * S, 0.9 * S, pal.outline);
  ctx.fillStyle = pal.teeth;
  ctx.beginPath();
  ctx.moveTo(jawX + jawW * 0.05, jawY + jawH);
  ctx.lineTo(jawX + jawW * 0.3, jawY + jawH);
  ctx.lineTo(jawX + jawW * 0.15, jawY + jawH + 1.6 * S);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(jawX + jawW * 0.4, jawY + jawH);
  ctx.lineTo(jawX + jawW * 0.63, jawY + jawH);
  ctx.lineTo(jawX + jawW * 0.5, jawY + jawH + 1.4 * S);
  ctx.closePath();
  ctx.fill();

  // glowing eye — crisp solid core, only a faint halo (a big shadowBlur at this
  // resolution turns into a blown-out blob once upscaled)
  const eyeX = headX + headW * 0.48;
  const eyeY = headY + headH * 0.32;
  const eyeSize = Math.max(1 * S, headW * 0.16);
  ctx.save();
  ctx.shadowColor = pal.eye;
  ctx.shadowBlur = 1.2 * S;
  ctx.fillStyle = pal.eye;
  px(ctx, eyeX - eyeSize / 2, eyeY - eyeSize / 2, eyeSize, eyeSize * 0.7, pal.eye);
  ctx.restore();

  // --- continuous glowing spike ridge: head crest -> back -> tail curl ---
  const spikeAnchors: SpikeAnchor[] = [];
  const crestCount = 3;
  for (let i = 0; i < crestCount; i++) {
    const frac = i / (crestCount - 1);
    spikeAnchors.push({
      x: headX + headW * (0.15 + frac * 0.45),
      y: headY + headH * 0.06,
      nx: 0,
      ny: -1,
      len: (2.2 + frac * 0.8) * S + t * 1.2 * S,
    });
  }
  const backCount = 4;
  for (let i = 0; i < backCount; i++) {
    const frac = (i + 1) / (backCount + 1);
    spikeAnchors.push({
      x: bodyX + bodyW * (0.85 - frac * 0.68),
      y: bodyY + bodyH * 0.02,
      nx: 0,
      ny: -1,
      len: (3.6 + Math.sin(frac * Math.PI) * 1.6) * S + t * 1.6 * S,
    });
  }
  const tailSpikeCount = 7 + Math.round(t * 2);
  for (let i = 0; i < tailSpikeCount; i++) {
    const frac = i / (tailSpikeCount - 1);
    const tp = tailPoints[Math.min(tailPoints.length - 1, Math.round(frac * (tailPoints.length - 2)))];
    const dx = tp.x - curlCenterX;
    const dy = (tp.y - curlCenterY) / 0.85;
    const dist = Math.max(0.001, Math.hypot(dx, dy));
    spikeAnchors.push({
      x: tp.x,
      y: tp.y,
      nx: dx / dist,
      ny: (dy / dist) * 0.85,
      len: (2.6 - frac * 1.6) * S + t * 0.8 * S,
    });
  }
  for (const anchor of spikeAnchors) drawGlowSpike(ctx, anchor);
}

// --- Warden: a guardian moth wreathed in light ---

const WARDEN_PALETTE = {
  body: "#4a2e5c",
  bodyDark: "#331f40",
  bodyLight: "#5e3d73",
  stripe: "#2e1b3d",
  wing: "#7ecbe0",
  wingDark: "#5aa8c2",
  wingVein: "#3f7d92",
  spotPink: "#ffb6c1",
  spotYellow: "#ffe082",
  outline: "#1c1124",
  eye: "#f0e6f7",
};

function drawWardenWing(ctx: CanvasRenderingContext2D, side: 1 | -1, t: number, thoraxX: number, thoraxY: number) {
  const pal = WARDEN_PALETTE;
  const span = 11 * S + t * 7 * S;
  const h = 8 * S + t * 3 * S;

  ctx.fillStyle = pal.outline;
  ctx.beginPath();
  ctx.moveTo(thoraxX, thoraxY - h * 0.15);
  ctx.lineTo(thoraxX + side * span * 1.02, thoraxY - h * 0.62);
  ctx.lineTo(thoraxX + side * span * 0.62, thoraxY + h * 0.85);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = pal.wing;
  ctx.beginPath();
  ctx.moveTo(thoraxX, thoraxY - h * 0.1);
  ctx.lineTo(thoraxX + side * span, thoraxY - h * 0.55);
  ctx.lineTo(thoraxX + side * span * 0.6, thoraxY + h * 0.75);
  ctx.closePath();
  ctx.fill();

  // vein lines radiating from the thorax toward the wing edge
  ctx.strokeStyle = pal.wingVein;
  ctx.lineWidth = 0.5 * S;
  ctx.globalAlpha = 0.7;
  for (const f of [0.35, 0.6, 0.85]) {
    ctx.beginPath();
    ctx.moveTo(thoraxX, thoraxY - h * 0.05);
    ctx.lineTo(thoraxX + side * span * f, thoraxY - h * 0.55 * f);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = pal.wingDark;
  ctx.beginPath();
  ctx.ellipse(thoraxX + side * span * 0.4, thoraxY - h * 0.05, span * 0.22, h * 0.3, side * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // eyespot
  ctx.fillStyle = pal.spotYellow;
  ctx.beginPath();
  ctx.ellipse(thoraxX + side * span * 0.62, thoraxY - h * 0.18, span * 0.14, h * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = pal.spotPink;
  ctx.beginPath();
  ctx.ellipse(thoraxX + side * span * 0.62, thoraxY - h * 0.18, span * 0.07, h * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  px(ctx, thoraxX + side * span * 0.62 - 0.4 * S, thoraxY - h * 0.18 - 0.4 * S, 0.8 * S, 0.8 * S, pal.outline);

  if (t > 0.4) {
    ctx.fillStyle = pal.spotPink;
    ctx.beginPath();
    ctx.ellipse(thoraxX + side * span * 0.3, thoraxY + h * 0.3, span * 0.08, h * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // scalloped wing edge texture
  ctx.strokeStyle = pal.outline;
  ctx.lineWidth = 0.4 * S;
  ctx.globalAlpha = 0.5;
  for (const f of [0.2, 0.45, 0.7, 0.92]) {
    ctx.beginPath();
    ctx.arc(thoraxX + side * span * f, thoraxY - h * 0.55 * f + h * 0.1, 1.2 * S, 0, Math.PI);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawWarden(ctx: CanvasRenderingContext2D, t: number) {
  const pal = WARDEN_PALETTE;

  function block(x: number, y: number, w: number, h: number, color: string, round = 0) {
    px(ctx, x - S, y - S, w + 2 * S, h + 2 * S, pal.outline);
    px(ctx, x, y, w, h, color);
    if (round > 0) {
      ctx.clearRect(x - S, y - S, round, round);
      ctx.clearRect(x + w + S - round, y - S, round, round);
      ctx.clearRect(x - S, y + h + S - round, round, round);
      ctx.clearRect(x + w + S - round, y + h + S - round, round, round);
    }
  }

  function drawLegClaw(x: number, y: number, size: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    const dx = Math.cos(rad);
    const dy = Math.sin(rad);
    const perpX = -dy;
    const perpY = dx;
    ctx.fillStyle = pal.outline;
    ctx.beginPath();
    ctx.moveTo(x - perpX * size * 0.35, y - perpY * size * 0.35);
    ctx.lineTo(x + perpX * size * 0.35, y + perpY * size * 0.35);
    ctx.lineTo(x + dx * (size + 0.5 * S), y + dy * (size + 0.5 * S));
    ctx.closePath();
    ctx.fill();
  }

  const bodyW = Math.round(5 * S + t * 2 * S);
  const bodyH = Math.round(9 * S + t * 2 * S);
  const headSize = Math.round(3.5 * S + t * S);

  const bodyY = GROUND_Y - bodyH;
  const thoraxX = CX;
  const thoraxY = bodyY + bodyH * 0.3;

  drawGroundShadow(ctx, 8 * S + t * 5 * S);

  // wings, drawn behind the body
  drawWardenWing(ctx, -1, t, thoraxX, thoraxY);
  drawWardenWing(ctx, 1, t, thoraxX, thoraxY);

  // small clawed legs
  for (const side of [-1, 1] as const) {
    px(ctx, CX + side * bodyW * 0.6 - 0.5 * S, GROUND_Y - 2 * S, 1 * S, 2 * S, pal.bodyDark);
    drawLegClaw(CX + side * bodyW * 0.6, GROUND_Y, 1.4 * S, 75 + side * 15);
  }

  // fuzzy segmented abdomen, rounded rather than a hard-edged box
  block(CX - bodyW / 2, bodyY, bodyW, bodyH, pal.body, 1.6 * S);
  px(ctx, CX - bodyW / 2, bodyY + 1 * S, bodyW * 0.3, bodyH - 2 * S, pal.bodyLight);
  for (let i = 0; i < 3; i++) {
    px(ctx, CX - bodyW / 2, bodyY + bodyH * 0.28 + i * bodyH * 0.2, bodyW, 0.8 * S, pal.stripe);
  }
  // fuzzy edge ticks
  for (let i = 0; i < 3; i++) {
    const fy = bodyY + bodyH * (0.2 + i * 0.28);
    px(ctx, CX - bodyW / 2 - 1.2 * S, fy, 1 * S, 0.6 * S, pal.bodyDark);
    px(ctx, CX + bodyW / 2 + 0.2 * S, fy, 1 * S, 0.6 * S, pal.bodyDark);
  }

  // head with curled antennae
  const headX = CX - headSize / 2;
  const headY = bodyY - headSize + 1 * S;
  block(headX, headY, headSize, headSize, pal.body, 1.2 * S);

  ctx.strokeStyle = pal.outline;
  ctx.lineWidth = 0.8 * S;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(CX + side * headSize * 0.3, headY);
    ctx.quadraticCurveTo(
      CX + side * (headSize * 0.9 + t * S),
      headY - 3 * S - t * S,
      CX + side * (headSize * 1.6 + t * 1.5 * S),
      headY - 2 * S - t * S,
    );
    ctx.stroke();
    px(
      ctx,
      CX + side * (headSize * 1.6 + t * 1.5 * S) - 0.5 * S,
      headY - 2 * S - t * S - 0.5 * S,
      1 * S,
      1 * S,
      pal.outline,
    );
  }

  // tiny glowing eyes — a guardian's watchful gaze
  ctx.save();
  ctx.shadowColor = pal.eye;
  ctx.shadowBlur = 1 * S;
  ctx.fillStyle = pal.eye;
  px(ctx, headX + headSize * 0.2, headY + headSize * 0.35, 0.9 * S, 0.9 * S, pal.eye);
  px(ctx, headX + headSize * 0.65, headY + headSize * 0.35, 0.9 * S, 0.9 * S, pal.eye);
  ctx.restore();
}

// --- Emperor: a three-headed golden dragon ---

const EMPEROR_PALETTE = {
  body: "#b8952e",
  bodyDark: "#7a5f1f",
  bodyLight: "#d4ac3b",
  head: "#d9b23c",
  horn: "#fff2b0",
  wing: "#4a2b52",
  wingBone: "#6b3f6e",
  scale: "#8f7124",
  eye: "#ff5c33",
  outline: "#241c0a",
};

function drawEmperorNeck(ctx: CanvasRenderingContext2D, baseX: number, baseY: number, tipX: number, tipY: number, headSize: number) {
  const pal = EMPEROR_PALETTE;
  ctx.strokeStyle = pal.outline;
  ctx.lineWidth = 2.6 * S;
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();
  ctx.strokeStyle = pal.body;
  ctx.lineWidth = 1.6 * S;
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  // head
  px(ctx, tipX - headSize / 2 - 0.6 * S, tipY - headSize / 2 - 0.6 * S, headSize + 1.2 * S, headSize + 1.2 * S, pal.outline);
  px(ctx, tipX - headSize / 2, tipY - headSize / 2, headSize, headSize, pal.head);

  // brow ridge shading above the eye
  px(ctx, tipX - headSize * 0.35, tipY - headSize * 0.3, headSize * 0.7, headSize * 0.16, pal.bodyDark);

  // horns
  ctx.fillStyle = pal.horn;
  ctx.beginPath();
  ctx.moveTo(tipX - headSize * 0.3, tipY - headSize * 0.4);
  ctx.lineTo(tipX - headSize * 0.55, tipY - headSize * 1.1);
  ctx.lineTo(tipX - headSize * 0.05, tipY - headSize * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(tipX + headSize * 0.3, tipY - headSize * 0.4);
  ctx.lineTo(tipX + headSize * 0.55, tipY - headSize * 1.1);
  ctx.lineTo(tipX + headSize * 0.05, tipY - headSize * 0.35);
  ctx.closePath();
  ctx.fill();

  // glowing eye
  ctx.save();
  ctx.shadowColor = pal.eye;
  ctx.shadowBlur = 2 * S;
  ctx.fillStyle = pal.eye;
  px(ctx, tipX - headSize * 0.12, tipY - headSize * 0.05, headSize * 0.3, headSize * 0.3, pal.eye);
  ctx.restore();
}

function drawEmperor(ctx: CanvasRenderingContext2D, t: number) {
  const pal = EMPEROR_PALETTE;
  const bodyW = Math.round(9 * S + t * 3 * S);
  const bodyH = Math.round(6 * S + t * 2 * S);
  const legH = Math.round(3 * S + t * S);
  const legW = Math.round(3 * S + t * S);
  const wingSpan = 9 * S + t * 5 * S;
  const centerNeckLen = 8 * S + t * 5 * S;
  const sideNeckLen = 6 * S + t * 3.5 * S;
  const headSize = 2.6 * S + t * 1.3 * S;

  const legY = GROUND_Y - legH;
  const bodyY = legY - bodyH;
  const bodyX = CX - bodyW / 2;
  const shoulderY = bodyY + bodyH * 0.2;

  drawGroundShadow(ctx, bodyW + wingSpan * 0.5);

  function block(x: number, y: number, w: number, h: number, color: string, round = 0) {
    px(ctx, x - S, y - S, w + 2 * S, h + 2 * S, pal.outline);
    px(ctx, x, y, w, h, color);
    if (round > 0) {
      ctx.clearRect(x - S, y - S, round, round);
      ctx.clearRect(x + w + S - round, y - S, round, round);
      ctx.clearRect(x - S, y + h + S - round, round, round);
      ctx.clearRect(x + w + S - round, y + h + S - round, round, round);
    }
  }

  function drawFootClaw(x: number, y: number, size: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    const dx = Math.cos(rad);
    const dy = Math.sin(rad);
    const perpX = -dy;
    const perpY = dx;
    ctx.fillStyle = pal.outline;
    ctx.beginPath();
    ctx.moveTo(x - perpX * size * 0.35, y - perpY * size * 0.35);
    ctx.lineTo(x + perpX * size * 0.35, y + perpY * size * 0.35);
    ctx.lineTo(x + dx * (size + 0.5 * S), y + dy * (size + 0.5 * S));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = pal.horn;
    ctx.beginPath();
    ctx.moveTo(x - perpX * size * 0.25, y - perpY * size * 0.25);
    ctx.lineTo(x + perpX * size * 0.25, y + perpY * size * 0.25);
    ctx.lineTo(x + dx * size, y + dy * size);
    ctx.closePath();
    ctx.fill();
  }

  // wings, drawn behind the body — a scalloped bat-wing membrane with two bone struts
  for (const side of [-1, 1] as const) {
    ctx.fillStyle = pal.wing;
    ctx.beginPath();
    ctx.moveTo(CX, shoulderY);
    ctx.lineTo(CX + side * wingSpan, shoulderY - wingSpan * 0.5);
    ctx.lineTo(CX + side * wingSpan * 0.78, shoulderY - wingSpan * 0.08);
    ctx.lineTo(CX + side * wingSpan * 0.55, shoulderY + wingSpan * 0.15);
    ctx.lineTo(CX + side * wingSpan * 0.32, shoulderY + wingSpan * 0.02);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = pal.wingBone;
    ctx.beginPath();
    ctx.ellipse(CX + side * wingSpan * 0.55, shoulderY - wingSpan * 0.12, wingSpan * 0.16, wingSpan * 0.1, side * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = pal.wingBone;
    ctx.lineWidth = 0.8 * S;
    ctx.beginPath();
    ctx.moveTo(CX, shoulderY);
    ctx.lineTo(CX + side * wingSpan * 0.85, shoulderY - wingSpan * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(CX, shoulderY);
    ctx.lineTo(CX + side * wingSpan * 0.55, shoulderY + wingSpan * 0.15);
    ctx.stroke();
  }

  // tail with a small spiked tip
  const tailW = 5 * S + t * 3 * S;
  block(bodyX + bodyW - 2 * S, bodyY + bodyH * 0.4, tailW, 2 * S, pal.bodyDark, 1 * S);
  ctx.fillStyle = pal.horn;
  ctx.beginPath();
  ctx.moveTo(bodyX + bodyW - 2 * S + tailW, bodyY + bodyH * 0.4);
  ctx.lineTo(bodyX + bodyW - 2 * S + tailW, bodyY + bodyH * 0.4 + 2 * S);
  ctx.lineTo(bodyX + bodyW - 2 * S + tailW + 1.6 * S, bodyY + bodyH * 0.4 + 1 * S);
  ctx.closePath();
  ctx.fill();

  // legs with small clawed feet
  block(bodyX + 1 * S, legY, legW, legH, pal.bodyDark, 1 * S);
  block(bodyX + bodyW - legW - 1 * S, legY, legW, legH, pal.bodyDark, 1 * S);
  drawFootClaw(bodyX + 1 * S + legW / 2, GROUND_Y, 1.4 * S, 100);
  drawFootClaw(bodyX + bodyW - legW / 2 - 1 * S, GROUND_Y, 1.4 * S, 80);

  // body with scale texture, rounded rather than a hard box
  block(bodyX, bodyY, bodyW, bodyH, pal.body, 1.6 * S);
  px(ctx, bodyX + 1 * S, bodyY + 1 * S, bodyW * 0.22, bodyH - 2 * S, pal.bodyLight);
  px(ctx, bodyX + bodyW - bodyW * 0.18 - 1 * S, bodyY + 1 * S, bodyW * 0.18, bodyH - 2 * S, pal.bodyDark);
  const scaleSpots: [number, number][] = [
    [0.3, 0.3],
    [0.5, 0.6],
    [0.65, 0.35],
  ];
  for (const [ox, oy] of scaleSpots) {
    px(ctx, bodyX + ox * bodyW, bodyY + oy * bodyH, 0.9 * S, 0.9 * S, pal.scale);
  }

  // three necks: center, and two flanking outward like a trident
  drawEmperorNeck(ctx, CX, shoulderY, CX, shoulderY - centerNeckLen, headSize * 1.1);
  drawEmperorNeck(ctx, CX - bodyW * 0.2, shoulderY, CX - sideNeckLen * 0.85, shoulderY - sideNeckLen * 0.75, headSize);
  drawEmperorNeck(ctx, CX + bodyW * 0.2, shoulderY, CX + sideNeckLen * 0.85, shoulderY - sideNeckLen * 0.75, headSize);
}

function drawEvolvedCreature(ctx: CanvasRenderingContext2D, stage: number, pathId: PathId) {
  const t = (Math.max(3, Math.min(5, stage)) - 3) / 2;
  if (pathId === "titan") drawTitan(ctx, t);
  else if (pathId === "warden") drawWarden(ctx, t);
  else drawEmperor(ctx, t);
}

/**
 * Draws the kaiju at the given growth stage (0-5): an egg that cracks, hatches,
 * then (from stage 3 on) evolves along the chosen path — Titan, Warden, or
 * Emperor. `time` (seconds) drives a gentle idle bob.
 */
export function drawKaiju(ctx: CanvasRenderingContext2D, stage: number, pathId: PathId | null, time = 0) {
  const s = Math.max(0, Math.min(5, stage));
  ctx.clearRect(0, 0, GRID, GRID);

  const bob = Math.sin(time * 2.1) * 0.7 * S;
  ctx.save();
  ctx.translate(0, bob);

  if (s === 0) drawEgg(ctx, false);
  else if (s === 1) drawEgg(ctx, true);
  else if (s === 2) drawHatchling(ctx);
  else drawEvolvedCreature(ctx, s, pathId ?? "titan");

  ctx.restore();
}
