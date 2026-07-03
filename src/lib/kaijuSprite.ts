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

interface PathPalette {
  body: string;
  bodyLight: string;
  bodyDark: string;
  belly: string;
  eye: string;
  outline: string;
  accent: string;
  accentLight: string;
}

const PATH_PALETTES: Record<PathId, PathPalette> = {
  titan: { body: "#8a7360", bodyLight: "#ab9075", bodyDark: "#5f4d3d", belly: "#c9b896", eye: "#ff7a33", outline: "#2e2620", accent: "#6b5b48", accentLight: "#8f7c65" },
  warden: { body: "#4a5568", bodyLight: "#6b7a91", bodyDark: "#2f3946", belly: "#8fa3bd", eye: "#4fc3ff", outline: "#1c232c", accent: "#cbd5e1", accentLight: "#eef2f7" },
  emperor: { body: "#5b3a73", bodyLight: "#7d55a0", bodyDark: "#3a2350", belly: "#caa9ff", eye: "#ffd166", outline: "#24122e", accent: "#ffd75e", accentLight: "#fff0b0" },
};

function drawTitanAccessories(ctx: CanvasRenderingContext2D, t: number, pal: PathPalette, geo: BodyGeometry) {
  const hornLen = 2 + t * 2.5;
  ctx.fillStyle = pal.accent;
  for (const side of [-1, 1]) {
    const hx = geo.headX + geo.headW / 2 + side * geo.headW * 0.32;
    const hy = geo.headY + 1;
    ctx.beginPath();
    ctx.moveTo(hx - 1.1, hy);
    ctx.lineTo(hx + 1.1, hy);
    ctx.lineTo(hx + side * 0.3, hy - hornLen);
    ctx.closePath();
    ctx.fill();
  }

  const spotCount = 2 + Math.round(t * 3);
  ctx.fillStyle = pal.accentLight;
  for (let i = 0; i < spotCount; i++) {
    const frac = i / Math.max(1, spotCount - 1);
    px(ctx, geo.bodyX + 1 + frac * (geo.bodyW - 2), geo.bodyY + geo.bodyH * 0.55 + (i % 2) * 2, 1.2, 1.2, pal.accentLight);
  }
}

function drawWardenAccessories(ctx: CanvasRenderingContext2D, t: number, pal: PathPalette, geo: BodyGeometry) {
  // chest plate
  const plateH = 3 + t * 1.5;
  px(ctx, geo.bodyX + 1, geo.bodyY + geo.bodyH * 0.15, geo.bodyW - 2, plateH, pal.accent);
  px(ctx, geo.bodyX + geo.bodyW / 2 - 0.5, geo.bodyY + geo.bodyH * 0.15, 1, plateH, pal.accentLight);

  // shoulder pads
  const padW = 3 + t;
  px(ctx, geo.bodyX - padW * 0.4, geo.bodyY, padW, 2 + t, pal.accent);
  px(ctx, geo.bodyX + geo.bodyW - padW * 0.6, geo.bodyY, padW, 2 + t, pal.accent);

  // visor
  px(ctx, geo.headX + geo.headW * 0.18, geo.headY + geo.headH * 0.3, geo.headW * 0.64, 1.4, pal.accent);
}

function drawEmperorAccessories(ctx: CanvasRenderingContext2D, t: number, pal: PathPalette, geo: BodyGeometry) {
  // cape, drawn behind the body footprint
  const capeW = geo.bodyW * 0.9;
  const capeH = geo.bodyH * (0.9 + t * 0.6);
  ctx.fillStyle = pal.bodyDark;
  ctx.beginPath();
  ctx.moveTo(geo.bodyX + geo.bodyW * 0.5 - capeW * 0.5, geo.bodyY + 1);
  ctx.lineTo(geo.bodyX + geo.bodyW * 0.5 + capeW * 0.5, geo.bodyY + 1);
  ctx.lineTo(geo.bodyX + geo.bodyW * 0.5 + capeW * 0.35, geo.bodyY + capeH);
  ctx.lineTo(geo.bodyX + geo.bodyW * 0.5 - capeW * 0.35, geo.bodyY + capeH);
  ctx.closePath();
  ctx.fill();
}

interface BodyGeometry {
  bodyX: number;
  bodyY: number;
  bodyW: number;
  bodyH: number;
  headX: number;
  headY: number;
  headW: number;
  headH: number;
}

function drawEvolvedCreature(ctx: CanvasRenderingContext2D, stage: number, pathId: PathId) {
  const t = (Math.max(3, Math.min(5, stage)) - 3) / 2;
  const pal = PATH_PALETTES[pathId];

  const bodyW = Math.round(14 + t * 4);
  const bodyH = Math.round(11 + t * 3);
  const legH = Math.round(4 + t * 2);
  const legW = Math.round(4 + t);
  const headW = Math.round(bodyW * 0.6);
  const headH = Math.round(headW * 0.86);
  const armW = 3 + Math.round(t);
  const armH = 5 + Math.round(t * 2);

  const legY = GROUND_Y - legH;
  const bodyY = legY - bodyH;
  const bodyX = CX - bodyW / 2;
  const headY = bodyY - headH + 2;
  const headX = CX - headW / 2;
  const geo: BodyGeometry = { bodyX, bodyY, bodyW, bodyH, headX, headY, headW, headH };

  drawGroundShadow(ctx, bodyW + 4);

  function block(x: number, y: number, w: number, h: number, color: string) {
    px(ctx, x - 1, y - 1, w + 2, h + 2, pal.outline);
    px(ctx, x, y, w, h, color);
  }

  if (pathId === "emperor") drawEmperorAccessories(ctx, t, pal, geo);

  // legs
  block(bodyX + 1, legY, legW, legH, pal.bodyDark);
  block(bodyX + bodyW - legW - 1, legY, legW, legH, pal.bodyDark);

  // body
  block(bodyX, bodyY, bodyW, bodyH, pal.body);
  px(ctx, bodyX + 1, bodyY + 1, bodyW * 0.2, bodyH - 2, pal.bodyLight);
  px(ctx, bodyX + bodyW - bodyW * 0.16 - 1, bodyY + 1, bodyW * 0.16, bodyH - 2, pal.bodyDark);

  // belly
  ctx.fillStyle = pal.belly;
  ctx.beginPath();
  ctx.ellipse(CX, bodyY + bodyH * 0.62, bodyW * 0.24, bodyH * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();

  // arms
  block(bodyX - armW + 1, bodyY + bodyH * 0.35, armW, armH, pal.bodyDark);
  block(bodyX + bodyW - 1, bodyY + bodyH * 0.35, armW, armH, pal.bodyDark);

  // head
  block(headX, headY, headW, headH, pal.body);
  px(ctx, headX + 1, headY + 1, headW * 0.26, headH - 2, pal.bodyLight);

  // eyes: glowing, flat monster face (no snout)
  const eyeY = headY + headH * 0.42;
  const eyeSize = Math.max(1.6, headW * 0.2);
  for (const eyeX of [headX + headW * 0.3, headX + headW * 0.66]) {
    ctx.save();
    ctx.shadowColor = pal.eye;
    ctx.shadowBlur = 2.5;
    ctx.fillStyle = pal.eye;
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, eyeSize / 2, eyeSize / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // mouth
  px(ctx, headX + headW * 0.35, headY + headH * 0.75, headW * 0.3, 1, pal.outline);

  if (pathId === "titan") drawTitanAccessories(ctx, t, pal, geo);
  if (pathId === "warden") drawWardenAccessories(ctx, t, pal, geo);
  if (pathId === "emperor") {
    // trim + crown drawn after the body so they sit on top of it
    px(ctx, bodyX + 1, bodyY + bodyH * 0.5, bodyW - 2, 1, pal.accent);
    const crownW = headW * 0.6;
    const crownX = headX + headW * 0.2;
    const crownY = headY - 1.5 - t * 1.5;
    ctx.fillStyle = pal.accent;
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
