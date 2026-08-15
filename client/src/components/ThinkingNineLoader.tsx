import { useEffect, useMemo, useRef } from "react";
import "./ThinkingNineLoader.css";

type ThinkingNineLoaderProps = {
  destination?: string;
};

const particleCount = 56;
const trailSpan = 0.39;
const durationMs = 4700;
const rotationDurationMs = 30000;
const pulseDurationMs = 4200;

function normalizeProgress(progress: number) {
  return ((progress % 1) + 1) % 1;
}

function getPoint(progress: number, detailScale: number) {
  const angle = progress * Math.PI * 2;
  const x = 7 * Math.cos(angle) - 3 * detailScale * Math.cos(9 * angle);
  const y = 7 * Math.sin(angle) - 3 * detailScale * Math.sin(9 * angle);
  return { x: 50 + x * 3.9, y: 50 + y * 3.9 };
}

function buildPath(detailScale: number) {
  const steps = 180;
  let path = "";
  for (let index = 0; index <= steps; index += 1) {
    const point = getPoint(index / steps, detailScale);
    path += `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)} `;
  }
  return path;
}

export function ThinkingNineLoader({ destination = "LOADING" }: ThinkingNineLoaderProps) {
  const groupRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const particleRefs = useRef<SVGCircleElement[]>([]);
  const particles = useMemo(() => Array.from({ length: particleCount }, (_, index) => index), []);

  useEffect(() => {
    const group = groupRef.current;
    const path = pathRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!group || !path) return;

    let frameId = 0;
    let cancelled = false;
    let startedAt = performance.now();

    const renderFrame = (time: number, staticFrame = false) => {
      const progress = staticFrame ? 0.18 : ((time - startedAt) % durationMs) / durationMs;
      const pulseProgress = staticFrame ? 0.62 : ((time - startedAt) % pulseDurationMs) / pulseDurationMs;
      const detailScale = 0.52 + ((Math.sin(pulseProgress * Math.PI * 2 + 0.55) + 1) / 2) * 0.48;
      const rotation = staticFrame ? -18 : -(((time - startedAt) % rotationDurationMs) / rotationDurationMs) * 360;

      group.setAttribute("transform", `rotate(${rotation} 50 50)`);
      path.setAttribute("d", buildPath(detailScale));

      particleRefs.current.forEach((node, index) => {
        if (!node) return;
        const tailOffset = index / (particleCount - 1);
        const point = getPoint(normalizeProgress(progress - tailOffset * trailSpan), detailScale);
        const fade = Math.pow(1 - tailOffset, 0.56);
        node.setAttribute("cx", point.x.toFixed(2));
        node.setAttribute("cy", point.y.toFixed(2));
        node.setAttribute("r", (0.72 + fade * 2.35).toFixed(2));
        node.setAttribute("opacity", (0.05 + fade * 0.95).toFixed(3));
      });
    };

    const animate = (time: number) => {
      if (cancelled || reducedMotion.matches) return;
      renderFrame(time);
      frameId = window.requestAnimationFrame(animate);
    };

    const setMotionMode = () => {
      window.cancelAnimationFrame(frameId);
      if (reducedMotion.matches) {
        renderFrame(performance.now(), true);
        return;
      }
      startedAt = performance.now();
      frameId = window.requestAnimationFrame(animate);
    };

    setMotionMode();
    reducedMotion.addEventListener("change", setMotionMode);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      reducedMotion.removeEventListener("change", setMotionMode);
    };
  }, []);

  return (
    <main className="thinking-nine-loader" role="status" aria-live="polite" aria-label={`Loading ${destination.toLowerCase()}`}>
      <div className="thinking-nine-loader__content">
        <svg className="thinking-nine-loader__curve" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <g ref={groupRef}>
            <path ref={pathRef} className="thinking-nine-loader__path" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
            {particles.map((index) => <circle key={index} ref={(node) => { if (node) particleRefs.current[index] = node; }} />)}
          </g>
        </svg>
        <div className="thinking-nine-loader__meta">
          <span>Loading</span>
          <strong>{destination}</strong>
        </div>
      </div>
    </main>
  );
}
