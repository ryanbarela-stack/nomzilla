import { useEffect, useRef } from "react";
import { GRID, drawKaiju } from "../lib/kaijuSprite";
import type { PathId } from "../lib/paths";

interface Props {
  stage: number;
  pathId: PathId | null;
  size?: number;
}

export function KaijuCanvas({ stage, pathId, size = 220 }: Props) {
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
      drawKaiju(ctx, stage, pathId, (now - start) / 1000);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [stage, pathId]);

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
