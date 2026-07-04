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

// --- Titan: an atomic-age reptilian colossus ---

const TITAN_PALETTE = {
  body: "#46614c",
  bodyLight: "#6f9573",
  bodyMid: "#557a5c",
  bodyDark: "#2c4030",
  belly: "#cdbf8a",
  bellyDark: "#b3a374",
  spike: "#e3dcb0",
  spikeDark: "#a89a5f",
  scale: "#365140",
  claw: "#d8d2c2",
  eye: "#bff0ff",
  outline: "#16241a",
  teeth: "#f5f0e1",
};

function drawTitan(ctx: CanvasRenderingContext2D, t: number) {
  const pal = TITAN_PALETTE;
  const bodyW = Math.round(11 * S + t * 5 * S);
  const bodyH = Math.round(9 * S + t * 4 * S);
  const legH = Math.round(4 * S + t * 2 * S);
  const legW = Math.round(4 * S + t * S);
  const headW = Math.round(bodyW * 0.5);
  const headH = Math.round(headW * 0.8);
  const snoutW = Math.max(2 * S, Math.round(headW * 0.42));
  const snoutH = Math.max(2 * S, Math.round(headH * 0.36));
  const armW = 2 * S + Math.round(t * S);
  const armH = 4 * S + Math.round(t * 2 * S);
  const tailLen = Math.round(6 * S + t * 6 * S);
  const spikeCount = 3 + Math.round(t * 3);

  const legY = GROUND_Y - legH;
  const bodyY = legY - bodyH;
  const bodyX = CX - bodyW / 2;
  const headY = bodyY - headH + 1 * S;
  const headX = CX - headW / 2;

  drawGroundShadow(ctx, bodyW + tailLen * 0.6);

  function block(x: number, y: number, w: number, h: number, color: string) {
    px(ctx, x - S, y - S, w + 2 * S, h + 2 * S, pal.outline);
    px(ctx, x, y, w, h, color);
  }

  // tapering tail, drawn back-to-front so the base overlaps cleanly
  const tailSegs = 4;
  for (let i = tailSegs - 1; i >= 0; i--) {
    const segLen = tailLen / tailSegs;
    const segX = bodyX + bodyW - 2 * S + i * segLen;
    const segH = Math.max(2 * S, bodyH * 0.45 * (1 - i / (tailSegs + 1)));
    const segY = legY - segH - i * 0.7 * S;
    block(segX, segY, segLen + 1 * S, segH, pal.bodyDark);
    if (i === 0) {
      // small tail-tip spike
      ctx.fillStyle = pal.spikeDark;
      ctx.beginPath();
      ctx.moveTo(segX + segLen * 0.3, segY);
      ctx.lineTo(segX + segLen * 0.9, segY);
      ctx.lineTo(segX + segLen * 0.6, segY - 2 * S);
      ctx.closePath();
      ctx.fill();
    }
  }

  // legs with small clawed toes
  block(bodyX + 1 * S, legY, legW, legH, pal.bodyDark);
  block(bodyX + bodyW - legW - 1 * S, legY, legW, legH, pal.bodyDark);
  for (const lx of [bodyX + 1 * S, bodyX + bodyW - legW - 1 * S]) {
    for (let c = 0; c < 3; c++) {
      px(ctx, lx + (c * legW) / 3, GROUND_Y - 0.6 * S, legW / 3 - 0.5 * S, 1 * S, pal.claw);
    }
  }

  // body with a three-tone shading gradient
  block(bodyX, bodyY, bodyW, bodyH, pal.body);
  px(ctx, bodyX + 1 * S, bodyY + 1 * S, bodyW * 0.2, bodyH - 2 * S, pal.bodyLight);
  px(ctx, bodyX + bodyW * 0.32, bodyY + 1 * S, bodyW * 0.2, bodyH - 2 * S, pal.bodyMid);
  px(ctx, bodyX + bodyW - bodyW * 0.16 - 1 * S, bodyY + 1 * S, bodyW * 0.16, bodyH - 2 * S, pal.bodyDark);

  // scattered scale texture across the torso
  const scaleSpots: [number, number][] = [
    [0.18, 0.3],
    [0.42, 0.55],
    [0.62, 0.25],
    [0.3, 0.7],
    [0.72, 0.6],
  ];
  for (const [ox, oy] of scaleSpots) {
    px(ctx, bodyX + ox * bodyW, bodyY + oy * bodyH, 1 * S, 1 * S, pal.scale);
  }

  // belly plates
  ctx.fillStyle = pal.belly;
  ctx.beginPath();
  ctx.ellipse(CX, bodyY + bodyH * 0.62, bodyW * 0.24, bodyH * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  px(ctx, CX - bodyW * 0.16, bodyY + bodyH * 0.75, bodyW * 0.32, 1 * S, pal.bellyDark);
  px(ctx, CX - bodyW * 0.16, bodyY + bodyH * 0.58, bodyW * 0.32, 0.6 * S, pal.bellyDark);

  // small stubby arms with tiny claws
  block(bodyX - armW + 1 * S, bodyY + bodyH * 0.4, armW, armH, pal.bodyDark);
  block(bodyX + bodyW - 1 * S, bodyY + bodyH * 0.4, armW, armH, pal.bodyDark);
  px(ctx, bodyX - armW + 0.5 * S, bodyY + bodyH * 0.4 + armH - 0.5 * S, armW, 0.8 * S, pal.claw);
  px(ctx, bodyX + bodyW - 1.5 * S, bodyY + bodyH * 0.4 + armH - 0.5 * S, armW, 0.8 * S, pal.claw);

  // head with a heavy jaw
  block(headX, headY, headW, headH, pal.body);
  px(ctx, headX + 1 * S, headY + 1 * S, headW * 0.28, headH - 2 * S, pal.bodyLight);

  const snoutX = headX + headW * 0.7;
  const snoutY = headY + headH * 0.5;
  block(snoutX, snoutY, snoutW, snoutH, pal.body);
  px(ctx, snoutX + snoutW * 0.75, snoutY + snoutH * 0.2, 0.8 * S, 0.8 * S, pal.outline);
  ctx.fillStyle = pal.teeth;
  ctx.beginPath();
  ctx.moveTo(snoutX + snoutW * 0.1, snoutY + snoutH);
  ctx.lineTo(snoutX + snoutW * 0.55, snoutY + snoutH);
  ctx.lineTo(snoutX + snoutW * 0.32, snoutY + snoutH + 1.6 * S);
  ctx.closePath();
  ctx.fill();

  // glowing slit eye — a crisp solid core with only a faint halo, since a big
  // shadowBlur at this resolution turns into a blown-out blob once upscaled
  const eyeY = headY + headH * 0.32;
  const eyeX = headX + headW * 0.42;
  const eyeSize = Math.max(1 * S, headW * 0.16);
  ctx.save();
  ctx.shadowColor = pal.eye;
  ctx.shadowBlur = 1.2 * S;
  ctx.fillStyle = pal.eye;
  px(ctx, eyeX - eyeSize / 2, eyeY - eyeSize / 2, eyeSize, eyeSize * 0.7, pal.eye);
  ctx.restore();

  // jagged two-tone back plates running from the back of the head, over the
  // body, toward the tail — staying clear of the face on the head's right side
  const spikeStartX = headX + headW * 0.12;
  const spikeEndX = bodyX + bodyW * 0.92;
  const headRightEdge = headX + headW;
  for (let i = 0; i < spikeCount; i++) {
    const frac = i / (spikeCount - 1 || 1);
    const sx = spikeStartX + frac * (spikeEndX - spikeStartX);
    const baseY = sx < headRightEdge ? headY + 1 * S : bodyY + 1 * S;
    const h = Math.round(1.5 * S + t * 2 * S + Math.sin(frac * Math.PI) * 1.5 * S);
    ctx.fillStyle = pal.spikeDark;
    ctx.beginPath();
    ctx.moveTo(sx - 1.4 * S, baseY);
    ctx.lineTo(sx + 1.4 * S, baseY);
    ctx.lineTo(sx, baseY - h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = pal.spike;
    ctx.beginPath();
    ctx.moveTo(sx - 0.6 * S, baseY - h * 0.35);
    ctx.lineTo(sx + 0.6 * S, baseY - h * 0.35);
    ctx.lineTo(sx, baseY - h);
    ctx.closePath();
    ctx.fill();
  }
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

  // tiny legs
  px(ctx, CX - bodyW * 0.6, GROUND_Y - 1.2 * S, 1 * S, 1.2 * S, pal.bodyDark);
  px(ctx, CX + bodyW * 0.6 - 1 * S, GROUND_Y - 1.2 * S, 1 * S, 1.2 * S, pal.bodyDark);

  // fuzzy segmented abdomen
  px(ctx, CX - bodyW / 2 - S, bodyY - S, bodyW + 2 * S, bodyH + 2 * S, pal.outline);
  px(ctx, CX - bodyW / 2, bodyY, bodyW, bodyH, pal.body);
  px(ctx, CX - bodyW / 2, bodyY + 1 * S, bodyW * 0.3, bodyH - 2 * S, pal.bodyLight);
  for (let i = 0; i < 4; i++) {
    px(ctx, CX - bodyW / 2, bodyY + bodyH * 0.25 + i * bodyH * 0.16, bodyW, 0.8 * S, pal.stripe);
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
  px(ctx, headX - S, headY - S, headSize + 2 * S, headSize + 2 * S, pal.outline);
  px(ctx, headX, headY, headSize, headSize, pal.body);

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
  }

  // tiny eyes
  px(ctx, headX + headSize * 0.2, headY + headSize * 0.35, 0.9 * S, 0.9 * S, pal.eye);
  px(ctx, headX + headSize * 0.65, headY + headSize * 0.35, 0.9 * S, 0.9 * S, pal.eye);
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

  function block(x: number, y: number, w: number, h: number, color: string) {
    px(ctx, x - S, y - S, w + 2 * S, h + 2 * S, pal.outline);
    px(ctx, x, y, w, h, color);
  }

  // wings, drawn behind the body
  for (const side of [-1, 1] as const) {
    ctx.fillStyle = pal.wing;
    ctx.beginPath();
    ctx.moveTo(CX, shoulderY);
    ctx.lineTo(CX + side * wingSpan, shoulderY - wingSpan * 0.5);
    ctx.lineTo(CX + side * wingSpan * 0.5, shoulderY + wingSpan * 0.3);
    ctx.closePath();
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
  block(bodyX + bodyW - 2 * S, bodyY + bodyH * 0.4, tailW, 2 * S, pal.bodyDark);
  ctx.fillStyle = pal.horn;
  ctx.beginPath();
  ctx.moveTo(bodyX + bodyW - 2 * S + tailW, bodyY + bodyH * 0.4);
  ctx.lineTo(bodyX + bodyW - 2 * S + tailW, bodyY + bodyH * 0.4 + 2 * S);
  ctx.lineTo(bodyX + bodyW - 2 * S + tailW + 1.6 * S, bodyY + bodyH * 0.4 + 1 * S);
  ctx.closePath();
  ctx.fill();

  // legs
  block(bodyX + 1 * S, legY, legW, legH, pal.bodyDark);
  block(bodyX + bodyW - legW - 1 * S, legY, legW, legH, pal.bodyDark);

  // body with scale texture
  block(bodyX, bodyY, bodyW, bodyH, pal.body);
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
