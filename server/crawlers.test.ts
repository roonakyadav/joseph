import { describe, expect, it } from "vitest";
import { buildSitemapXml } from "./crawlers";

describe("APEX crawler routes", () => {
  it("enumerates only stable public paths and supplied published account slugs", () => {
    const sitemap = buildSitemapXml("https://apex.example", ["prime-squad", "elite-record"]);
    expect(sitemap).toContain("https://apex.example/accounts/prime-squad");
    expect(sitemap).toContain("https://apex.example/accounts/elite-record");
    expect(sitemap).toContain("https://apex.example/proofs");
    expect(sitemap).not.toContain("/admin");
    expect(sitemap).not.toContain("/api/");
  });

  it("escapes XML-sensitive URL characters", () => {
    const sitemap = buildSitemapXml("https://apex.example?source=a&b=c", []);
    expect(sitemap).toContain("source=a&amp;b=c");
  });
});
