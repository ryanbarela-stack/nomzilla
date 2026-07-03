import { useEffect, useRef } from "react";
import { GRID, drawKaiju } from "../lib/kaijuSprite";
import { getCharacter } from "../lib/characters";

interface Props {
  stage: number;
  characterId?: string;
  size?: number;
}

const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): HTMLImageElement {
  let img = imageCache.get(src);
  if (!img) {
    img = new Image();
    img.src = src;
    imageCache.set(src, img);
  }
  return img;
}

/**
 * Draws a static sprite at its native resolution, filling the canvas 1:1 — never
 * resampled internally, so it stays crisp. Growth is expressed by the caller
 * resizing the canvas element itself rather than shrinking the bitmap.
 */
function drawSprite(ctx: CanvasRenderingContext2D, img: HTMLImageElement, time: number) {
  ctx.clearRect(0, 0, GRID, GRID);
  if (img.complete && img.naturalWidth > 0) {
    // integer-only bob offset: a fractional translate would force the canvas to
    // resample the bitmap at a sub-pixel position, blurring the pixel art
    const bob = Math.round(Math.sin(time * 2.1));
    ctx.save();
    ctx.translate(0, bob);
    ctx.drawImage(img, 0, 0, GRID, GRID);
    ctx.restore();
  }
}

export function KaijuCanvas({ stage, characterId = "kaiju", size = 220 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const character = getCharacter(characterId);
  const s = Math.max(0, Math.min(5, stage));
  const t = s / 5;
  // sprites are a single static image, so growth is shown by scaling the element
  // itself (never the bitmap) — the canvas's own pixel data is always native-res
  const displaySize = character.kind === "sprite" ? Math.round(size * (0.55 + t * 0.45)) : size;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const img = character.kind === "sprite" && character.src ? loadImage(character.src) : null;

    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const time = (now - start) / 1000;
      if (img) drawSprite(ctx, img, time);
      else drawKaiju(ctx, stage, time);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [stage, characterId, character.kind, character.src]);

  return (
    <div className="flex items-end justify-center" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={GRID}
        height={GRID}
        className="pixelated"
        style={{ width: displaySize, height: displaySize }}
      />
    </div>
  );
}
