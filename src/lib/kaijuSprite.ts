import type { PathId } from "./paths";

export const GRID = 32;
const GROUND_Y = GRID - 3;
const CX = GRID / 2;

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawGroundShadow(ctx: CanvasRenderingContext2D, width: number) {
  ctx.globalAlpha = 0.22;
  px(ctx, CX - width / 2, GROUND_Y, width, 2, "#000000");
  ctx.globalAlpha = 1;
}

const EGG_PALETTE = {
  shell: "#f2ede0",
  shellLight: "#ffffff",
  shellDark: "#d8d2c2",
  speckle: "#b8b2a4",
  outline: "#8f8b82",
  glow: "#ffe9a8",
};

function drawEggBody(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const centerY = GROUND_Y - h / 2;
  ctx.lineWidth = 1;
  ctx.fillStyle = EGG_PALETTE.shell;
  ctx.strokeStyle = EGG_PALETTE.outline;
  ctx.beginPath();
  ctx.ellipse(CX, centerY, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = EGG_PALETTE.shellLight;
  ctx.beginPath();
  ctx.ellipse(CX - w * 0.18, centerY - h * 0.22, w * 0.22, h * 0.28, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = EGG_PALETTE.shellDark;
  ctx.beginPath();
  ctx.ellipse(CX + w * 0.2, centerY + h * 0.2, w * 0.18, h * 0.24, 0.3, 0, Math.PI * 2);
  ctx.fill();

  const speckles: [number, number][] = [
    [-0.2, -0.05],
    [0.18, 0.12],
    [0.02, -0.32],
    [-0.12, 0.3],
    [0.28, -0.1],
  ];
  for (const [ox, oy] of speckles) {
    px(ctx, CX + ox * w - 0.6, centerY + oy * h - 0.6, 1.3, 1.3, EGG_PALETTE.speckle);
  }
  return centerY;
}

function drawEgg(ctx: CanvasRenderingContext2D, cracked: boolean) {
  const w = 15;
  const h = 19;
  drawGroundShadow(ctx, w + 2);
  const centerY = drawEggBody(ctx, w, h);

  if (cracked) {
    ctx.strokeStyle = EGG_PALETTE.outline;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(CX + 0.5, centerY - h * 0.42);
    ctx.lineTo(CX + 2, centerY - h * 0.18);
    ctx.lineTo(CX - 1.5, centerY + 0.05 * h);
    ctx.lineTo(CX + 1.5, centerY + 0.28 * h);
    ctx.lineTo(CX, centerY + 0.42 * h);
    ctx.stroke();

    ctx.globalAlpha = 0.8;
    ctx.fillStyle = EGG_PALETTE.glow;
    ctx.beginPath();
    ctx.ellipse(CX + 0.5, centerY, 1.1, 3, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const HATCHLING_PALETTE = {
  body: "#8fbf9a",
  bodyLight: "#b9dcc0",
  bodyDark: "#5f9470",
  eye: "#2a2420",
  blush: "#ffa8ba",
  outline: "#31513a",
};

function drawHatchling(ctx: CanvasRenderingContext2D) {
  const pal = HATCHLING_PALETTE;
  const shellW = 17;
  const shellH = 8;
  drawGroundShadow(ctx, shellW + 2);

  const bodyW = 11;
  const bodyH = 9;
  const bodyX = CX - bodyW / 2;
  const bodyY = GROUND_Y - shellH * 0.55 - bodyH * 0.6;
  const headW = 9;
  const headH = 8;
  const headX = CX - headW / 2;
  const headY = bodyY - headH + 2;

  // stubby arms resting on the shell rim
  px(ctx, bodyX - 3, bodyY + bodyH * 0.4, 3, 3, pal.bodyDark);
  px(ctx, bodyX + bodyW, bodyY + bodyH * 0.4, 3, 3, pal.bodyDark);

  // torso (mostly hidden behind the shell rim, drawn first)
  px(ctx, bodyX - 1, bodyY - 1, bodyW + 2, bodyH + 2, pal.outline);
  px(ctx, bodyX, bodyY, bodyW, bodyH, pal.body);

  // head
  px(ctx, headX - 1, headY - 1, headW + 2, headH + 2, pal.outline);
  px(ctx, headX, headY, headW, headH, pal.body);
  px(ctx, headX + 1, headY + 1, headW * 0.3, headH - 2, pal.bodyLight);

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
    ctx.ellipse(eyeX, eyeY, 1.7, 1.9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = pal.eye;
    ctx.beginPath();
    ctx.ellipse(eyeX + 0.3, eyeY + 0.3, 0.9, 1.05, 0, 0, Math.PI * 2);
    ctx.fill();
    px(ctx, eyeX - 0.3, eyeY - 0.9, 0.7, 0.7, "#ffffff");
  }

  // smile
  ctx.strokeStyle = pal.outline;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(headX + headW * 0.36, headY + headH * 0.78);
  ctx.quadraticCurveTo(headX + headW * 0.5, headY + headH * 0.95, headX + headW * 0.64, headY + headH * 0.78);
  ctx.stroke();

  // broken shell "cup" drawn last so its front rim occludes the lower torso
  const shellCenterY = GROUND_Y - shellH * 0.35;
  ctx.fillStyle = EGG_PALETTE.shell;
  ctx.strokeStyle = EGG_PALETTE.outline;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(CX, shellCenterY, shellW / 2, shellH / 2, 0, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // jagged notches along the broken rim
  ctx.fillStyle = "#0000";
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
    ctx.lineTo(CX + ox * shellW - 1, shellCenterY + oy * shellH * 0.5 - 1.4);
    ctx.lineTo(CX + ox * shellW + 1, shellCenterY + oy * shellH * 0.5 - 1.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// --- Titan: an atomic-age reptilian colossus ---

const TITAN_PALETTE = {
  body: "#46614c",
  bodyLight: "#6f9573",
  bodyDark: "#2c4030",
  belly: "#cdbf8a",
  bellyDark: "#b3a374",
  spike: "#e3dcb0",
  spikeDark: "#a89a5f",
  eye: "#bff0ff",
  outline: "#16241a",
  teeth: "#f5f0e1",
};

function drawTitan(ctx: CanvasRenderingContext2D, t: number) {
  const pal = TITAN_PALETTE;
  const bodyW = Math.round(11 + t * 5);
  const bodyH = Math.round(9 + t * 4);
  const legH = Math.round(4 + t * 2);
  const legW = Math.round(4 + t);
  const headW = Math.round(bodyW * 0.5);
  const headH = Math.round(headW * 0.8);
  const snoutW = Math.max(2, Math.round(headW * 0.42));
  const snoutH = Math.max(2, Math.round(headH * 0.36));
  const armW = 2 + Math.round(t);
  const armH = 4 + Math.round(t * 2);
  const tailLen = Math.round(6 + t * 6);
  const spikeCount = 3 + Math.round(t * 3);

  const legY = GROUND_Y - legH;
  const bodyY = legY - bodyH;
  const bodyX = CX - bodyW / 2;
  const headY = bodyY - headH + 1;
  const headX = CX - headW / 2;

  drawGroundShadow(ctx, bodyW + tailLen * 0.6);

  function block(x: number, y: number, w: number, h: number, color: string) {
    px(ctx, x - 1, y - 1, w + 2, h + 2, pal.outline);
    px(ctx, x, y, w, h, color);
  }

  // tapering tail, drawn back-to-front so the base overlaps cleanly
  const tailSegs = 4;
  for (let i = tailSegs - 1; i >= 0; i--) {
    const segLen = tailLen / tailSegs;
    const segX = bodyX + bodyW - 2 + i * segLen;
    const segH = Math.max(2, bodyH * 0.45 * (1 - i / (tailSegs + 1)));
    const segY = legY - segH - i * 0.7;
    block(segX, segY, segLen + 1, segH, pal.bodyDark);
  }

  // legs
  block(bodyX + 1, legY, legW, legH, pal.bodyDark);
  block(bodyX + bodyW - legW - 1, legY, legW, legH, pal.bodyDark);

  // body
  block(bodyX, bodyY, bodyW, bodyH, pal.body);
  px(ctx, bodyX + 1, bodyY + 1, bodyW * 0.2, bodyH - 2, pal.bodyLight);
  px(ctx, bodyX + bodyW - bodyW * 0.16 - 1, bodyY + 1, bodyW * 0.16, bodyH - 2, pal.bodyDark);

  // belly plates
  ctx.fillStyle = pal.belly;
  ctx.beginPath();
  ctx.ellipse(CX, bodyY + bodyH * 0.62, bodyW * 0.24, bodyH * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  px(ctx, CX - bodyW * 0.16, bodyY + bodyH * 0.75, bodyW * 0.32, 1, pal.bellyDark);

  // small stubby arms
  block(bodyX - armW + 1, bodyY + bodyH * 0.4, armW, armH, pal.bodyDark);
  block(bodyX + bodyW - 1, bodyY + bodyH * 0.4, armW, armH, pal.bodyDark);

  // head with a heavy jaw
  block(headX, headY, headW, headH, pal.body);
  px(ctx, headX + 1, headY + 1, headW * 0.28, headH - 2, pal.bodyLight);

  const snoutX = headX + headW * 0.7;
  const snoutY = headY + headH * 0.5;
  block(snoutX, snoutY, snoutW, snoutH, pal.body);
  ctx.fillStyle = pal.teeth;
  ctx.beginPath();
  ctx.moveTo(snoutX + snoutW * 0.1, snoutY + snoutH);
  ctx.lineTo(snoutX + snoutW * 0.55, snoutY + snoutH);
  ctx.lineTo(snoutX + snoutW * 0.32, snoutY + snoutH + 1.6);
  ctx.closePath();
  ctx.fill();

  // glowing slit eye — a crisp solid core with only a faint halo, since a big
  // shadowBlur at this resolution turns into a blown-out blob once upscaled
  const eyeY = headY + headH * 0.32;
  const eyeX = headX + headW * 0.42;
  const eyeSize = Math.max(1, headW * 0.16);
  ctx.save();
  ctx.shadowColor = pal.eye;
  ctx.shadowBlur = 1.2;
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
    const baseY = sx < headRightEdge ? headY + 1 : bodyY + 1;
    const h = Math.round(1.5 + t * 2 + Math.sin(frac * Math.PI) * 1.5);
    ctx.fillStyle = pal.spikeDark;
    ctx.beginPath();
    ctx.moveTo(sx - 1.4, baseY);
    ctx.lineTo(sx + 1.4, baseY);
    ctx.lineTo(sx, baseY - h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = pal.spike;
    ctx.beginPath();
    ctx.moveTo(sx - 0.6, baseY - h * 0.35);
    ctx.lineTo(sx + 0.6, baseY - h * 0.35);
    ctx.lineTo(sx, baseY - h);
    ctx.closePath();
    ctx.fill();
  }
}

// --- Warden: a guardian moth wreathed in light ---

const WARDEN_PALETTE = {
  body: "#cdb37a",
  bodyDark: "#a68f5c",
  stripe: "#8a744a",
  wing: "#7ecbe0",
  wingDark: "#5aa8c2",
  spotPink: "#ffb6c1",
  spotYellow: "#ffe082",
  outline: "#3a2f1f",
  eye: "#241c12",
};

function drawWardenWing(ctx: CanvasRenderingContext2D, side: 1 | -1, t: number, thoraxX: number, thoraxY: number) {
  const pal = WARDEN_PALETTE;
  const span = 11 + t * 7;
  const h = 8 + t * 3;

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

  if (t > 0.4) {
    ctx.fillStyle = pal.spotPink;
    ctx.beginPath();
    ctx.ellipse(thoraxX + side * span * 0.3, thoraxY + h * 0.3, span * 0.08, h * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWarden(ctx: CanvasRenderingContext2D, t: number) {
  const pal = WARDEN_PALETTE;
  const bodyW = Math.round(5 + t * 2);
  const bodyH = Math.round(9 + t * 2);
  const headSize = Math.round(3.5 + t);

  const bodyY = GROUND_Y - bodyH;
  const thoraxX = CX;
  const thoraxY = bodyY + bodyH * 0.3;

  drawGroundShadow(ctx, 8 + t * 5);

  // wings, drawn behind the body
  drawWardenWing(ctx, -1, t, thoraxX, thoraxY);
  drawWardenWing(ctx, 1, t, thoraxX, thoraxY);

  // fuzzy segmented abdomen
  px(ctx, CX - bodyW / 2 - 1, bodyY - 1, bodyW + 2, bodyH + 2, pal.outline);
  px(ctx, CX - bodyW / 2, bodyY, bodyW, bodyH, pal.body);
  for (let i = 0; i < 3; i++) {
    px(ctx, CX - bodyW / 2, bodyY + bodyH * 0.35 + i * bodyH * 0.2, bodyW, 1, pal.stripe);
  }

  // head with curled antennae
  const headX = CX - headSize / 2;
  const headY = bodyY - headSize + 1;
  px(ctx, headX - 1, headY - 1, headSize + 2, headSize + 2, pal.outline);
  px(ctx, headX, headY, headSize, headSize, pal.body);

  ctx.strokeStyle = pal.outline;
  ctx.lineWidth = 0.8;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(CX + side * headSize * 0.3, headY);
    ctx.quadraticCurveTo(CX + side * (headSize * 0.9 + t), headY - 3 - t, CX + side * (headSize * 1.6 + t * 1.5), headY - 2 - t);
    ctx.stroke();
  }

  // tiny eyes
  px(ctx, headX + headSize * 0.2, headY + headSize * 0.35, 0.9, 0.9, pal.eye);
  px(ctx, headX + headSize * 0.65, headY + headSize * 0.35, 0.9, 0.9, pal.eye);
}

// --- Emperor: a three-headed golden dragon ---

const EMPEROR_PALETTE = {
  body: "#b8952e",
  bodyDark: "#7a5f1f",
  head: "#d9b23c",
  horn: "#fff2b0",
  wing: "#4a2b52",
  wingBone: "#6b3f6e",
  eye: "#ff5c33",
  outline: "#241c0a",
};

function drawEmperorNeck(ctx: CanvasRenderingContext2D, baseX: number, baseY: number, tipX: number, tipY: number, headSize: number) {
  const pal = EMPEROR_PALETTE;
  ctx.strokeStyle = pal.outline;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();
  ctx.strokeStyle = pal.body;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(tipX, tipY);
  ctx.stroke();

  // head
  px(ctx, tipX - headSize / 2 - 0.6, tipY - headSize / 2 - 0.6, headSize + 1.2, headSize + 1.2, pal.outline);
  px(ctx, tipX - headSize / 2, tipY - headSize / 2, headSize, headSize, pal.head);

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
  ctx.shadowBlur = 2;
  ctx.fillStyle = pal.eye;
  px(ctx, tipX - headSize * 0.12, tipY - headSize * 0.05, headSize * 0.3, headSize * 0.3, pal.eye);
  ctx.restore();
}

function drawEmperor(ctx: CanvasRenderingContext2D, t: number) {
  const pal = EMPEROR_PALETTE;
  const bodyW = Math.round(9 + t * 3);
  const bodyH = Math.round(6 + t * 2);
  const legH = Math.round(3 + t);
  const legW = Math.round(3 + t);
  const wingSpan = 9 + t * 5;
  const centerNeckLen = 8 + t * 5;
  const sideNeckLen = 6 + t * 3.5;
  const headSize = 2.6 + t * 1.3;

  const legY = GROUND_Y - legH;
  const bodyY = legY - bodyH;
  const bodyX = CX - bodyW / 2;
  const shoulderY = bodyY + bodyH * 0.2;

  drawGroundShadow(ctx, bodyW + wingSpan * 0.5);

  function block(x: number, y: number, w: number, h: number, color: string) {
    px(ctx, x - 1, y - 1, w + 2, h + 2, pal.outline);
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
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(CX, shoulderY);
    ctx.lineTo(CX + side * wingSpan * 0.85, shoulderY - wingSpan * 0.3);
    ctx.stroke();
  }

  // tail
  block(bodyX + bodyW - 2, bodyY + bodyH * 0.4, 5 + t * 3, 2, pal.bodyDark);

  // legs
  block(bodyX + 1, legY, legW, legH, pal.bodyDark);
  block(bodyX + bodyW - legW - 1, legY, legW, legH, pal.bodyDark);

  // body
  block(bodyX, bodyY, bodyW, bodyH, pal.body);
  px(ctx, bodyX + 1, bodyY + 1, bodyW * 0.22, bodyH - 2, pal.head);
  px(ctx, bodyX + bodyW - bodyW * 0.18 - 1, bodyY + 1, bodyW * 0.18, bodyH - 2, pal.bodyDark);

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

  const bob = Math.sin(time * 2.1) * 0.7;
  ctx.save();
  ctx.translate(0, bob);

  if (s === 0) drawEgg(ctx, false);
  else if (s === 1) drawEgg(ctx, true);
  else if (s === 2) drawHatchling(ctx);
  else drawEvolvedCreature(ctx, s, pathId ?? "titan");

  ctx.restore();
}
