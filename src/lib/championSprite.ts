import { getClass, type ClassId } from "./classes";
import type { SpriteSize } from "./paths";

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

// Sprite images are loaded once and cached by src; the idle rAF loop in
// ChampionCanvas naturally picks them up on a later frame once they finish loading.
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

function drawSprite(ctx: CanvasRenderingContext2D, src: string, size: SpriteSize) {
  // Champion sprites carry generous transparent padding around the character (for
  // unused rotation frames), so they need a bigger multiplier than a tightly-cropped
  // sprite would to read as the same visual size within the canvas.
  const targetH = GRID * 1.15;
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
 * Draws the champion's chosen class, or nothing (just the empty frame) if no
 * class has been picked yet. `time` (seconds) drives a gentle idle bob.
 */
export function drawChampion(ctx: CanvasRenderingContext2D, classId: ClassId | null, time = 0) {
  ctx.clearRect(0, 0, GRID, GRID);

  const champClass = getClass(classId);
  if (!champClass) return;

  const bob = Math.sin(time * 2.1) * 0.7 * S;
  ctx.save();
  ctx.translate(0, bob);
  drawSprite(ctx, champClass.sprite, champClass.spriteSize);
  ctx.restore();
}
