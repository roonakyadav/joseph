// APEX DESIGN: Account Archive 02 — a product-first FC Mobile account specimen, not a conventional landing-page stack.
import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import { type PointerEvent, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { formatCurrency, formatQuantity, mapPublicAccount } from "@/data/accounts";
import { trpc } from "@/lib/trpc";
import "./Home.css";

const futureRoutes = [
  ["05", "Community", "Official channel"],
];

function APEXMark({ className = "" }: { className?: string }) {
  return <img className={`apex-mark ${className}`} src="/manus-storage/apex-mark_890b511d.png" alt="APEX" />;
}

function ScrollToProtocol() {
  const protocol = document.getElementById("protocol");
  protocol?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const welcomeMode = new URLSearchParams(window.location.search).get("welcome");
  const indexPreview = new URLSearchParams(window.location.search).get("index") === "preview";
  const [introVisible, setIntroVisible] = useState(() => Boolean(welcomeMode) || !window.sessionStorage.getItem("apex-entry-seen"));
  const [menuOpen, setMenuOpen] = useState(indexPreview);
  const [communityNote, setCommunityNote] = useState(false);
  const [artifactActive, setArtifactActive] = useState(false);
  const settingsQuery = trpc.settings.getPublic.useQuery();
  const featuredQuery = trpc.accounts.getFeatured.useQuery();
  const featuredAccounts = useMemo(() => (featuredQuery.data ?? []).map(mapPublicAccount), [featuredQuery.data]);
  const communityUrl = settingsQuery.data?.whatsappCommunityUrl ?? "";

  useEffect(() => {
    if (welcomeMode === "preview") return;
    if (welcomeMode === "1") {
      const timer = window.setTimeout(() => setIntroVisible(false), 3400);
      return () => window.clearTimeout(timer);
    }

    if (window.sessionStorage.getItem("apex-entry-seen")) {
      setIntroVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem("apex-entry-seen", "true");
      setIntroVisible(false);
    }, 3400);

    return () => window.clearTimeout(timer);
  }, [welcomeMode]);

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
        <a className="brand-lockup focus-ring" href="#top" aria-label="APEX home">
          <APEXMark />
          <span>APEX</span>
        </a>
        <div className="header-right">
          <span className="header-build">Build / 02</span>
          <button className="index-trigger focus-ring" type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="apex-index">
            <span className="index-dot" aria-hidden="true" /> Index <b>01</b>
          </button>
        </div>
      </header>

      <aside id="apex-index" className={`index-panel ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="index-panel-top">
          <p className="micro-label">APEX / Platform index</p>
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
          {futureRoutes.map(([index, name, state]) => (
            <div key={name}><span>{index}</span><strong>{name}</strong><p>{state}</p></div>
          ))}
        </div>
        <p className="index-note">Only live destinations open. The rest are shown as part of the platform map—not as incomplete navigation.</p>
      </aside>

      <main id="top">
        <section className="specimen-hero" aria-labelledby="hero-title">
          <div className="hero-rail" data-reveal>
            <span className="eyebrow"><i /> APEX / FC Mobile account platform</span>
            <span className="micro-label">ID / A-001 · Global relay</span>
          </div>

          <div className="hero-wording" data-reveal>
            <p className="hero-pretitle">Account ownership, made legible.</p>
            <h1 id="hero-title">Inspect your next <span>FC Mobile</span> account.</h1>
            <p className="hero-intro">APEX is building a direct account marketplace around the squad itself—not generic listings, noise, or guesswork.</p>
          </div>

          <article
            className={`account-artifact ${artifactActive ? "is-active" : ""}`}
            aria-label="APEX platform account concept specimen"
            data-reveal
            onPointerMove={handleArtifactPointerMove}
            onPointerLeave={resetArtifactTilt}
            onPointerDown={() => setArtifactActive(true)}
            onPointerUp={() => setArtifactActive(false)}
            onPointerCancel={() => setArtifactActive(false)}
          >
            <div className="artifact-topline">
              <span><i className="live-pip" /> Platform specimen</span>
              <span>Account / A-001</span>
            </div>
            <div className="artifact-image-shell">
              <img src="/manus-storage/apex-dossier-terminal_b763d73e.jpg" alt="Conceptual FC Mobile account squad specimen" />
              <span className="artifact-stamp">CONCEPT<br />SPECIMEN</span>
              <span className="artifact-coordinate coordinate-a">X 07 / Y 19</span>
              <span className="artifact-coordinate coordinate-b">GRID / 4–3–3</span>
              <span className="artifact-corner corner-one" />
              <span className="artifact-corner corner-two" />
              <div className="artifact-scan" aria-hidden="true" />
            </div>
            <dl className="account-readout">
              <div><dt>OVR</dt><dd>—</dd><small>Preview value</small></div>
              <div><dt>Coins</dt><dd>—</dd><small>Resource field</small></div>
              <div><dt>Gems</dt><dd>—</dd><small>Resource field</small></div>
              <div><dt>Status</dt><dd>Build</dd><small>Platform only</small></div>
            </dl>
            <p className="artifact-footnote">This is a platform visual concept, not a live account listing.</p>
          </article>

          <div className="hero-actions"><Link href="/accounts" className="explore-accounts focus-ring">Explore accounts <ArrowUpRight size={16} aria-hidden="true" /></Link><button className="inspect-cue focus-ring" type="button" onClick={ScrollToProtocol}><span>Inspect the system</span><ArrowDown size={16} aria-hidden="true" /></button></div>
        </section>

        <section className="featured-index" aria-labelledby="featured-title">
          <div className="featured-index-head" data-reveal><span className="eyebrow">001 / Selected records</span><div><h2 id="featured-title">Featured in the <em>archive.</em></h2><Link href="/accounts" className="featured-index-link">Open full index <ArrowUpRight size={15} /></Link></div></div>
          {featuredQuery.isLoading ? <div className="featured-loading" aria-label="Loading featured records"><i /><i /></div> : featuredAccounts.length ? <div className="featured-list">{featuredAccounts.map((account, index) => <Link href={`/accounts/${account.slug}`} className="featured-record focus-ring" key={account.id} data-reveal><div className="featured-record-image">{account.image ? <img src={account.image} alt={account.imageAlt} /> : <span>Media pending</span>}<b>{String(index + 1).padStart(2, "0")}</b></div><div className="featured-record-copy"><span>{account.id} / {account.status}</span><h3>{account.title}</h3><p>{account.keyPlayers.slice(0, 3).join(" · ") || "Account details available in record"}</p></div><dl><div><dt>OVR</dt><dd>{account.ovr}</dd></div><div><dt>Coins</dt><dd>{formatQuantity(account.coins)}</dd></div><div><dt>Price</dt><dd>{formatCurrency(account.price, account.currency)}</dd></div></dl><ArrowUpRight size={17} /></Link>)}</div> : <div className="featured-empty" data-reveal><span>Archive signal / Pending</span><p>Featured records will appear here when the APEX operations team marks a published account for the public archive.</p></div>}
        </section>

        <section className="inspection-flow" id="protocol" aria-labelledby="protocol-title">
          <div className="flow-marker" data-reveal><span>002</span><div /><p>Account protocol</p></div>
          <div className="flow-heading" data-reveal>
            <p className="eyebrow">The account is the product</p>
            <h2 id="protocol-title">Every important detail,<br /><em>in the right order.</em></h2>
          </div>
          <div className="system-readout" data-reveal>
            <div className="readout-overline"><span>APEX / Account grammar</span><span>Phase 01</span></div>
            <p className="readout-statement">A future listing will read like an inspection record: squad composition first, resources second, identity and context last.</p>
            <div className="grammar-lines">
              <div><span>01</span><strong>Squad</strong><p>Formation, key players, OVR</p></div>
              <div><span>02</span><strong>Resources</strong><p>Coins, gems, inventory</p></div>
              <div><span>03</span><strong>Identity</strong><p>Account ID, status, region</p></div>
            </div>
          </div>
        </section>

        <section className="platform-cut" aria-labelledby="platform-title">
          <div className="cut-image" data-reveal>
            <img src="/manus-storage/apex-platform-module_326de0da.jpg" alt="Abstract APEX account platform module" />
            <span className="cut-image-label">Inventory<br />signal</span>
          </div>
          <div className="cut-copy" data-reveal>
            <p className="eyebrow">003 / The platform, in progress</p>
            <h2 id="platform-title">A quieter way to move through the market.</h2>
            <p>Browse with context. Inspect with confidence. Connect directly when the platform is ready. Nothing here is presented as a live listing until it is actually live.</p>
          </div>
        </section>

        <section className="community-wire" aria-labelledby="community-title">
          <div className="wire-header" data-reveal><span className="eyebrow">004 / Community relay</span><span className="wire-line" /></div>
          <div className="wire-body" data-reveal>
            <h2 id="community-title">Stay close to the build.</h2>
            <p>Official community updates will run through this channel once it is configured.</p>
            {communityUrl ? (
              <a className="apex-button primary focus-ring" href={communityUrl} target="_blank" rel="noreferrer">Open WhatsApp community <ArrowUpRight size={16} /></a>
            ) : (
              <>
                <button className="apex-button pending focus-ring" type="button" onClick={showCommunityNote}>WhatsApp link pending <ArrowUpRight size={16} /></button>
                <p className={`configuration-note ${communityNote ? "is-visible" : ""}`} role="status">Official community connection awaits administrator configuration.</p>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="apex-footer">
        <div className="footer-brand"><APEXMark /><span>APEX</span></div>
        <p className="micro-label">FC Mobile account platform / Build 02</p>
        <p>© {new Date().getFullYear()} APEX. Platform preview.</p>
      </footer>

      {introVisible && (
        <section className={`welcome-layer ${welcomeMode === "preview" ? "is-preview" : ""}`} aria-labelledby="welcome-title">
          <div className="welcome-backdrop" aria-hidden="true"><img src="/manus-storage/apex-welcome-archive_31af4dfa.jpg" alt="" /></div>
          <div className="welcome-grid" aria-hidden="true" />
          <div className="welcome-shell">
            <div className="welcome-top"><div className="welcome-brand"><APEXMark /><span>APEX</span></div><button type="button" className="skip-button focus-ring" onClick={dismissIntro}>Skip intro</button></div>
            <div className="welcome-copy">
              <p className="eyebrow welcome-sequence-one">001 / Welcome to APEX</p>
              <h2 id="welcome-title" className="welcome-sequence-two">Your account,<br /><span>in focus.</span></h2>
              <p className="welcome-description welcome-sequence-three">A direct FC Mobile account marketplace built around squad visibility, ownership and clarity.</p>
              <button type="button" className="enter-button focus-ring welcome-sequence-four" onClick={dismissIntro}>Enter APEX <ArrowUpRight size={17} /></button>
            </div>
            <p className="welcome-foot micro-label">APEX / Account platform in progress</p>
          </div>
        </section>
      )}
    </div>
  );
}
