import { PATHS, getPath, type PathId, type SpriteSize } from "./paths";

export const GRID = 96;
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

const EGG_SPRITE = "/sprites/egg/south.png";
const EGG_SPRITE_SIZE: SpriteSize = { width: 92, height: 92 };

// Sprite images are loaded once and cached by src; the idle rAF loop in
// KaijuCanvas naturally picks them up on a later frame once they finish loading.
const spriteImageCache = new Map<string, HTMLImageElement>();

function getSpriteImage(src: string): HTMLImageElement {
  let img = spriteImageCache.get(src);
  if (!img) {
    img = new Image();
    img.src = src;
    spriteImageCache.set(src, img);
  }
  return img;
}

/** Draws a pre-rendered PNG sprite (egg / baby / final forms), bottom-anchored above the ground shadow. */
function drawSprite(ctx: CanvasRenderingContext2D, src: string, size: SpriteSize) {
  const targetH = GRID * 0.78;
  const scale = targetH / size.height;
  const w = size.width * scale;
  const h = targetH;

  drawGroundShadow(ctx, w * 0.75);

  const img = getSpriteImage(src);
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, CX - w / 2, GROUND_Y - h * 0.92, w, h);
  }
}

/**
 * Draws the kaiju at the given growth stage (0 = Egg, 1 = Baby, 2 = Final Form).
 * `time` (seconds) drives a gentle idle bob.
 */
export function drawKaiju(ctx: CanvasRenderingContext2D, stage: number, pathId: PathId | null, time = 0) {
  const s = Math.max(0, Math.min(2, stage));
  ctx.clearRect(0, 0, GRID, GRID);

  const bob = Math.sin(time * 2.1) * 0.7 * S;
  ctx.save();
  ctx.translate(0, bob);

  if (s === 0) {
    drawSprite(ctx, EGG_SPRITE, EGG_SPRITE_SIZE);
  } else {
    const path = getPath(pathId) ?? PATHS[0];
    if (s === 1) drawSprite(ctx, path.babySprite, path.babySpriteSize);
    else drawSprite(ctx, path.finalSprite, path.finalSpriteSize);
  }

  ctx.restore();
}
