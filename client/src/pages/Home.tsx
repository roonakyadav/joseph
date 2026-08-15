// APEX DESIGN: Account Archive 02 — a product-first FC Mobile account specimen, not a conventional landing-page stack.
import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import { type PointerEvent, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { formatCurrency, formatQuantity, mapPublicAccount } from "@/data/accounts";
import { trackApexEvent } from "@/lib/analytics";
import { usePageMeta } from "@/lib/seo";
import { trpc } from "@/lib/trpc";
import "./Home.css";

function APEXMark({ className = "" }: { className?: string }) {
  return <img className={`apex-mark ${className}`} src="/manus-storage/apex-mark_890b511d.png" alt="Elite Traders" />;
}

function ScrollToProtocol() {
  const protocol = document.getElementById("protocol");
  protocol?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  usePageMeta({ title: "Elite Traders — FC Mobile account archive", description: "Inspect published FC Mobile account records, evidence, and configured contact paths.", path: "/" });
  const [introVisible, setIntroVisible] = useState(() => !window.sessionStorage.getItem("apex-entry-seen"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [communityNote, setCommunityNote] = useState(false);
  const [artifactActive, setArtifactActive] = useState(false);
  const settingsQuery = trpc.settings.getPublic.useQuery();
  const featuredQuery = trpc.accounts.getFeatured.useQuery();
  const featuredAccounts = useMemo(() => (featuredQuery.data ?? []).map(mapPublicAccount), [featuredQuery.data]);
  const communityUrl = settingsQuery.data?.whatsappCommunityUrl ?? "";

  useEffect(() => {
    if (window.sessionStorage.getItem("apex-entry-seen")) {
      setIntroVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem("apex-entry-seen", "true");
      setIntroVisible(false);
    }, 3400);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const revealables = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-revealed")),
      { threshold: 0.16 },
    );

    revealables.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const dismissIntro = () => {
    window.sessionStorage.setItem("apex-entry-seen", "true");
    setIntroVisible(false);
  };

  const showCommunityNote = () => {
    setCommunityNote(true);
    window.setTimeout(() => setCommunityNote(false), 4200);
  };

  const handleArtifactPointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${offsetX * 4}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${offsetY * -3}deg`);
  };

  const resetArtifactTilt = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div className="apex-page">
      <div className="apex-grid" aria-hidden="true" />
      <header className="apex-header">
        <a className="brand-lockup focus-ring" href="#top" aria-label="Elite Traders home">
          <APEXMark />
          <span>Elite Traders</span>
        </a>
        <div className="header-right">
          <span className="header-build">Archive / Live</span>
          <button className="index-trigger focus-ring" type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="apex-index">
            <span className="index-dot" aria-hidden="true" /> Index <b>01</b>
          </button>
        </div>
      </header>

      <aside id="apex-index" className={`index-panel ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="index-panel-top">
          <p className="micro-label">Elite Traders / Platform index</p>
          <button className="index-close focus-ring" type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation index"><X size={18} /></button>
        </div>
        <div className="index-current">
          <span>01</span>
          <div><strong>Home</strong><p>Platform entry</p></div>
          <i>Active</i>
        </div>
        <div className="index-future">
          <Link href="/accounts" onClick={() => setMenuOpen(false)} className="index-live-route"><span>02</span><strong>Accounts</strong><p>Public archive</p><i>Open</i></Link>
          <Link href="/sell" onClick={() => setMenuOpen(false)} className="index-live-route"><span>03</span><strong>Sell</strong><p>Submission protocol</p><i>Open</i></Link>
          <Link href="/proofs" onClick={() => setMenuOpen(false)} className="index-live-route"><span>04</span><strong>Proofs</strong><p>Evidence archive</p><i>Open</i></Link>
          {communityUrl && <a href={communityUrl} target="_blank" rel="noreferrer" onClick={() => trackApexEvent("community_open")} className="index-live-route"><span>05</span><strong>Community</strong><p>Official channel</p><i>Open</i></a>}
        </div>
        <p className="index-note">Only active public destinations are indexed here.</p>
      </aside>

      <main id="top">
        <section className="specimen-hero" aria-labelledby="hero-title">
          <div className="hero-rail" data-reveal>
            <span className="eyebrow hero-label"><i /> FC MOBILE ACCOUNTS</span>
            <span className="micro-label">ID / A-001 · Global relay</span>
          </div>

          <div className="hero-wording" data-reveal>
            <p className="hero-pretitle">Account ownership, made legible.</p>
            <h1 id="hero-title">Buy or sell <span>FC Mobile</span> accounts.</h1>
            <p className="hero-intro">Elite Traders presents a direct account archive around the squad itself—not generic listings, noise, or guesswork.</p>
          </div>

          <article
            className={`account-artifact ${artifactActive ? "is-active" : ""}`}
            aria-label="Elite Traders account archive visual specimen"
            data-reveal
            onPointerMove={handleArtifactPointerMove}
            onPointerLeave={resetArtifactTilt}
            onPointerDown={() => setArtifactActive(true)}
            onPointerUp={() => setArtifactActive(false)}
            onPointerCancel={() => setArtifactActive(false)}
          >
            <div className="artifact-topline">
              <span><i className="live-pip" /> Archive specimen</span>
              <span>Account / A-001</span>
            </div>
            <div className="artifact-image-shell">
              <img src="/manus-storage/apex-dossier-terminal_b763d73e.jpg" alt="Conceptual FC Mobile account squad specimen" />
              <span className="artifact-stamp">ARCHIVE<br />SPECIMEN</span>
              <span className="artifact-coordinate coordinate-a">X 07 / Y 19</span>
              <span className="artifact-coordinate coordinate-b">GRID / 4–3–3</span>
              <span className="artifact-corner corner-one" />
              <span className="artifact-corner corner-two" />
              <div className="artifact-scan" aria-hidden="true" />
            </div>
            <dl className="account-readout platform-readout" aria-label="Elite Traders platform information">
              <div><dt>Buy</dt><dd>Find FC Mobile accounts</dd></div>
              <div><dt>Sell</dt><dd>List your FC Mobile account</dd></div>
              <div><dt>Proofs</dt><dd>See transaction evidence</dd></div>
              <div><dt>Community</dt><dd>{communityUrl ? <a href={communityUrl} target="_blank" rel="noreferrer" onClick={() => trackApexEvent("community_open")}>Join the community</a> : "Official community"}</dd></div>
            </dl>
            <p className="artifact-footnote">This archive visual is an interface specimen, not a live account listing.</p>
          </article>

          <div className="hero-actions"><Link href="/accounts" className="explore-accounts focus-ring">Explore accounts <ArrowUpRight size={16} aria-hidden="true" /></Link><Link href="/sell" className="inspect-cue focus-ring"><span>Submit an account</span><ArrowDown size={16} aria-hidden="true" /></Link></div>
        </section>

        <section className="featured-index" aria-labelledby="featured-title">
          <div className="featured-index-head" data-reveal><span className="eyebrow">001 / Selected records</span><div><h2 id="featured-title">Featured in the <em>archive.</em></h2><Link href="/accounts" className="featured-index-link">Open full index <ArrowUpRight size={15} /></Link></div></div>
          {featuredQuery.isLoading ? <div className="featured-loading" aria-label="Loading featured records"><i /><i /></div> : featuredAccounts.length ? <div className="featured-list">{featuredAccounts.map((account, index) => <Link href={`/accounts/${account.slug}`} className="featured-record focus-ring" key={account.id} data-reveal><div className="featured-record-image">{account.image ? <img src={account.image} alt={account.imageAlt} /> : <span>Media pending</span>}<b>{String(index + 1).padStart(2, "0")}</b></div><div className="featured-record-copy"><span>{account.id} / {account.status}</span><h3>{account.title}</h3><p>{account.keyPlayers.slice(0, 3).join(" · ") || "Account details available in record"}</p></div><dl><div><dt>OVR</dt><dd>{account.ovr}</dd></div><div><dt>Coins</dt><dd>{formatQuantity(account.coins)}</dd></div><div><dt>Price</dt><dd>{formatCurrency(account.price, account.currency)}</dd></div></dl><ArrowUpRight size={17} /></Link>)}</div> : <div className="featured-empty" data-reveal><span>Archive signal / Pending</span><p>Featured records will appear here when the Elite Traders operations team marks a published account for the public archive.</p></div>}
        </section>

        <section className="inspection-flow" id="protocol" aria-labelledby="protocol-title">
          <div className="flow-marker" data-reveal><span>002</span><div /><p>Account protocol</p></div>
          <div className="flow-heading" data-reveal>
            <p className="eyebrow">The account is the product</p>
            <h2 id="protocol-title">Every important detail,<br /><em>in the right order.</em></h2>
          </div>
          <div className="system-readout" data-reveal>
            <div className="readout-overline"><span>Elite Traders / Account grammar</span><span>Phase 01</span></div>
            <p className="readout-statement">Every published listing reads like an inspection record: squad composition first, resources second, identity and context last.</p>
            <div className="grammar-lines">
              <div><span>01</span><strong>Squad</strong><p>Formation, key players, OVR</p></div>
              <div><span>02</span><strong>Resources</strong><p>Coins, gems, inventory</p></div>
              <div><span>03</span><strong>Identity</strong><p>Account ID, status, region</p></div>
            </div>
          </div>
        </section>

        <section className="platform-cut" aria-labelledby="platform-title">
          <div className="cut-image" data-reveal>
            <img src="/manus-storage/apex-platform-module_326de0da.jpg" alt="Abstract Elite Traders account platform module" />
            <span className="cut-image-label">Inventory<br />signal</span>
          </div>
          <div className="cut-copy" data-reveal>
            <p className="eyebrow">003 / Archive protocol</p>
            <h2 id="platform-title">A quieter way to move through the market.</h2>
            <p>Browse with context. Inspect with confidence. Connect directly when a record is available. Nothing is presented as live inventory until it is published.</p>
          </div>
        </section>

        <section className="community-wire" aria-labelledby="community-title">
          <div className="wire-header" data-reveal><span className="eyebrow">004 / Community relay</span><span className="wire-line" /></div>
          <div className="wire-body" data-reveal>
            <h2 id="community-title">Stay close to the archive.</h2>
            <p>Official community updates are shared through the configured channel.</p>
            {communityUrl ? (
              <a className="apex-button primary focus-ring" href={communityUrl} target="_blank" rel="noreferrer" onClick={() => trackApexEvent("community_open")}>Open WhatsApp community <ArrowUpRight size={16} /></a>
            ) : (
              <>
                <button className="apex-button pending focus-ring" type="button" onClick={showCommunityNote}>Community channel unavailable <ArrowUpRight size={16} /></button>
                <p className={`configuration-note ${communityNote ? "is-visible" : ""}`} role="status">The official community channel is not currently available. Please return to the archive later.</p>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="apex-footer">
        <div className="footer-brand"><APEXMark /><span>Elite Traders</span></div>
        <p className="micro-label">FC Mobile account archive / Public index</p>
        <p>© {new Date().getFullYear()} Elite Traders. Independent public record service; not affiliated with EA or EA SPORTS.</p>
      </footer>

      {introVisible && (
        <section className="welcome-layer" aria-labelledby="welcome-title">
          <div className="welcome-backdrop" aria-hidden="true"><img src="/manus-storage/apex-welcome-archive_31af4dfa.jpg" alt="" /></div>
          <div className="welcome-grid" aria-hidden="true" />
          <div className="welcome-shell">
            <div className="welcome-top"><div className="welcome-brand"><APEXMark /><span>Elite Traders</span></div><button type="button" className="skip-button focus-ring" onClick={dismissIntro}>Skip intro</button></div>
            <div className="welcome-copy">
              <p className="eyebrow welcome-sequence-one">001 / Welcome to Elite Traders</p>
              <h2 id="welcome-title" className="welcome-sequence-two">Your account,<br /><span>in focus.</span></h2>
              <p className="welcome-description welcome-sequence-three">A direct FC Mobile account archive built around squad visibility, ownership and clarity.</p>
              <button type="button" className="enter-button focus-ring welcome-sequence-four" onClick={dismissIntro}>Enter Elite Traders <ArrowUpRight size={17} /></button>
            </div>
            <p className="welcome-foot micro-label">Elite Traders / Public account archive</p>
          </div>
        </section>
      )}
    </div>
  );
}
