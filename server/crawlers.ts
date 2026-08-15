import type { Express, Request } from "express";
import { listPublishedAccounts } from "./db";

const stablePublicPaths = ["/", "/accounts", "/proofs", "/sell"];

function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function originForRequest(req: Request) {
  const forwardedHost = req.header("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || req.header("host")?.trim();
  if (!host || !/^[a-z0-9.-]+(?::\d+)?$/i.test(host)) return "";
  const forwardedProtocol = req.header("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol === "https" || req.protocol === "https" ? "https" : "http";
  return `${protocol}://${host}`;
}

export function buildSitemapXml(origin: string, accountSlugs: string[]) {
  const urls = [...stablePublicPaths, ...accountSlugs.map(slug => `/accounts/${encodeURIComponent(slug)}`)]
    .map(path => `${origin}${path}`)
    .map(url => `<url><loc>${xmlEscape(url)}</loc></url>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function registerCrawlerRoutes(app: Express) {
  app.get("/robots.txt", (req, res) => {
    const origin = originForRequest(req);
    const sitemap = origin ? `${origin}/sitemap.xml` : "/sitemap.xml";
    res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${sitemap}\n`);
  });

  app.get("/sitemap.xml", async (req, res) => {
    const origin = originForRequest(req);
    if (!origin) return res.status(400).type("text/plain").send("A valid public host is required.");
    try {
      const accounts = await listPublishedAccounts();
      res.type("application/xml").send(buildSitemapXml(origin, accounts.map(account => account.slug)));
    } catch (error) {
      console.error("[SEO] Unable to build sitemap", error);
      res.status(503).type("text/plain").send("Sitemap temporarily unavailable.");
    }
  });
}
