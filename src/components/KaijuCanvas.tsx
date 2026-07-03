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

/** Draws a static sprite character, scaling it up with growth stage to echo the procedural kaiju's growth. */
function drawSprite(ctx: CanvasRenderingContext2D, img: HTMLImageElement, stage: number, time: number) {
  const s = Math.max(0, Math.min(5, stage));
  const t = s / 5;
  const groundY = GRID - 3;
  const bob = Math.sin(time * 2.1) * 0.7;
  const size = Math.round(GRID * (0.5 + t * 0.5));
  const x = (GRID - size) / 2;
  const y = groundY - size;

  ctx.clearRect(0, 0, GRID, GRID);

  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#000000";
  ctx.fillRect(GRID / 2 - size * 0.35, groundY, size * 0.7, 2);
  ctx.globalAlpha = 1;

  if (img.complete && img.naturalWidth > 0) {
    ctx.save();
    ctx.translate(0, bob);
    ctx.drawImage(img, x, y, size, size);
    ctx.restore();
  }
}

export function KaijuCanvas({ stage, characterId = "kaiju", size = 220 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const character = getCharacter(characterId);
    const img = character.kind === "sprite" && character.src ? loadImage(character.src) : null;

    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const time = (now - start) / 1000;
      if (img) drawSprite(ctx, img, stage, time);
      else drawKaiju(ctx, stage, time);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [stage, characterId]);

  return (
    <canvas
      ref={canvasRef}
      width={GRID}
      height={GRID}
      className="pixelated"
      style={{ width: size, height: size }}
    />
  );
}
