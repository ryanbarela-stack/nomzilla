import { useEffect, useRef } from "react";
import { GRID, drawChampion } from "../lib/championSprite";
import type { ClassId } from "../lib/classes";

interface Props {
  classId: ClassId | null;
  size?: number;
}

export function ChampionCanvas({ classId, size = 220 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      drawChampion(ctx, classId, (now - start) / 1000);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [classId]);

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
