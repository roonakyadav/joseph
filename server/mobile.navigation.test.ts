import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const navigationSource = readFileSync(resolve(projectRoot, "client/src/components/PublicMobileNav.tsx"), "utf8");
const navigationStyles = readFileSync(resolve(projectRoot, "client/src/components/PublicMobileNav.css"), "utf8");

describe("shared public mobile navigation", () => {
  it("keeps the four approved public destinations and treats account detail as part of Buy", () => {
    expect(navigationSource).toContain('{ href: "/", label: "Home"');
    expect(navigationSource).toContain('{ href: "/accounts", label: "Buy"');
    expect(navigationSource).toContain('path === "/accounts" || path.startsWith("/accounts/")');
    expect(navigationSource).toContain('{ href: "/sell", label: "Sell"');
    expect(navigationSource).toContain('{ href: "/proofs", label: "Proofs"');
    expect(navigationSource).not.toContain('label: "Index"');
  });

  it("does not render on protected routes and retains mobile safe-area and desktop-hide safeguards", () => {
    expect(navigationSource).toContain('if (location.startsWith("/admin")) return null;');
    expect(navigationStyles).toContain('env(safe-area-inset-bottom)');
    expect(navigationStyles).toContain('min-height:3.45rem');
    expect(navigationStyles).toContain('@media(min-width:960px)');
  });
});
