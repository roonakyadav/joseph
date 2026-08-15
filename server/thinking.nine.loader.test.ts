import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const loaderSource = readFileSync(resolve(projectRoot, "client/src/components/ThinkingNineLoader.tsx"), "utf8");
const loaderStyles = readFileSync(resolve(projectRoot, "client/src/components/ThinkingNineLoader.css"), "utf8");
const appSource = readFileSync(resolve(projectRoot, "client/src/App.tsx"), "utf8");

describe("Thinking Nine route loader", () => {
  it("uses the shared loader for the former generic route fallback with destination-aware public labels", () => {
    expect(appSource).toContain('import { ThinkingNineLoader } from "./components/ThinkingNineLoader";');
    expect(appSource).toContain('return <ThinkingNineLoader destination={destination} />;');
    expect(appSource).toContain('location.startsWith("/accounts") ? "BUY"');
    expect(appSource).toContain('location === "/sell" ? "SELL"');
    expect(appSource).toContain('location === "/proofs" ? "PROOFS"');
    expect(appSource).not.toContain("Opening record index.");
  });

  it("keeps the animation lifecycle-safe and avoids per-frame DOM creation", () => {
    expect(loaderSource).toContain("window.requestAnimationFrame(animate)");
    expect(loaderSource).toContain("window.cancelAnimationFrame(frameId)");
    expect(loaderSource).toContain('reducedMotion.addEventListener("change", setMotionMode)');
    expect(loaderSource).toContain('reducedMotion.removeEventListener("change", setMotionMode)');
    expect(loaderSource).not.toContain("document.createElement");
    expect(loaderSource).toContain('aria-live="polite"');
  });

  it("reserves mobile safe-area clearance and provides a reduced-motion visual fallback", () => {
    expect(loaderStyles).toContain("env(safe-area-inset-bottom)");
    expect(loaderStyles).toContain("@media (prefers-reduced-motion:reduce)");
    expect(loaderStyles).toContain("@media (min-width:960px)");
  });
});
