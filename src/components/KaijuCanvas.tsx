import { useEffect, useRef } from "react";
import { GRID, drawKaiju } from "../lib/kaijuSprite";

interface Props {
  stage: number;
  size?: number;
}

export function KaijuCanvas({ stage, size = 220 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    drawKaiju(ctx, stage);
  }, [stage]);

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
