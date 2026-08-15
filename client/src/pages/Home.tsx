// APEX DESIGN: Account Archive — a mobile product dossier with visual account concepts, sharp metadata, and restrained green signals.
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./Home.css";

const APEX_WHATSAPP_URL = "";

const futureRoutes = ["Accounts", "Sell", "Proofs", "Community"];

function APEXMark({ className = "" }: { className?: string }) {
  return (
    <img
      className={`apex-mark ${className}`}
      src="/manus-storage/apex-mark_890b511d.png"
      alt="APEX"
    />
  );
}

export default function Home() {
  const welcomePreview = new URLSearchParams(window.location.search).get("welcome") === "preview";
  const [introVisible, setIntroVisible] = useState(() => {
    const welcomeMode = new URLSearchParams(window.location.search).get("welcome");
    return Boolean(welcomeMode) || !window.sessionStorage.getItem("apex-entry-seen");
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [communityNote, setCommunityNote] = useState(false);

  useEffect(() => {
    const welcomeMode = new URLSearchParams(window.location.search).get("welcome");
    if (welcomeMode === "preview") return;
    if (welcomeMode === "1") {
      const timer = window.setTimeout(() => setIntroVisible(false), 3400);
      return () => window.clearTimeout(timer);
    }

    const hasVisited = window.sessionStorage.getItem("apex-entry-seen");
    if (hasVisited) {
      setIntroVisible(false);
      return;
    }

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem("apex-entry-seen", "true");
      setIntroVisible(false);
    }, 3400);

    return () => window.clearTimeout(timer);
  }, []);

  const dismissIntro = () => {
    window.sessionStorage.setItem("apex-entry-seen", "true");
    setIntroVisible(false);
  };

  const showCommunityNote = () => {
    setCommunityNote(true);
    window.setTimeout(() => setCommunityNote(false), 4200);
  };

  return (
    <div className="apex-page">
      <div className="apex-ambient" aria-hidden="true" />
      <header className="apex-header">
        <a className="brand-lockup focus-ring" href="#top" aria-label="APEX home">
          <APEXMark />
          <span>APEX</span>
        </a>

        <div className="header-end">
          <span className="header-build">Build 01</span>
          <button
            className="menu-trigger focus-ring"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="apex-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span>{menuOpen ? "Close" : "Menu"}</span>
            {menuOpen ? <X aria-hidden="true" size={17} strokeWidth={1.8} /> : <Menu aria-hidden="true" size={18} strokeWidth={1.8} />}
          </button>
        </div>

        <div id="apex-menu" className={`apex-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
          <p className="micro-label">Platform index</p>
          <a href="#top" onClick={() => setMenuOpen(false)}>
            <span>01</span> Home <em>Open</em>
          </a>
          {futureRoutes.map((item, index) => (
            <p key={item} className="future-route" aria-disabled="true">
              <span>0{index + 2}</span> {item} <em>In development</em>
            </p>
          ))}
        </div>
      </header>

      <main id="top">
        <section className="opening-dossier" aria-labelledby="platform-title">
          <div className="dossier-meta reveal-1">
            <span className="eyebrow"><i /> APEX / Platform launch</span>
            <span className="micro-label">India · Worldwide</span>
          </div>

          <div className="hero-copy">
            <p className="hero-kicker reveal-2">The next chapter is in progress.</p>
            <h1 id="platform-title" className="reveal-3">
              The new home <span>for FC Mobile</span> accounts.
            </h1>
            <div className="hero-summary reveal-4">
              <div className="status-line">
                <span className="status-pip" aria-hidden="true" />
                <span>APEX is under construction</span>
              </div>
              <p>
                A direct, transparent place to browse, buy and eventually list FC Mobile accounts—built with the account at the centre.
              </p>
            </div>
          </div>

          <div className="dossier-visual reveal-5" aria-label="APEX platform concept preview">
            <div className="corner-mark top-left" aria-hidden="true" />
            <div className="corner-mark top-right" aria-hidden="true" />
            <div className="visual-tag"><span className="status-pip" /> Concept preview</div>
            <img src="/manus-storage/apex-dossier-terminal_b763d73e.jpg" alt="Abstract account dossier concept artwork" />
            <div className="visual-gradient" aria-hidden="true" />
            <div className="scan-line" aria-hidden="true" />
            <div className="terminal-data terminal-data-one">
              <p className="micro-label">Account identity</p>
              <strong>Preview <em>01</em></strong>
              <span>Platform specimen</span>
            </div>
            <div className="terminal-data terminal-data-two">
              <p className="micro-label">Squad rating</p>
              <strong>OVR <em>—</em></strong>
              <span>Concept only</span>
            </div>
            <div className="terminal-rail" aria-hidden="true"><span /></div>
            <div className="visual-index">01 / 03</div>
          </div>
        </section>

        <section className="platform-readout" aria-labelledby="platform-readout-title">
          <div className="section-rail">
            <span className="eyebrow">01 / The platform</span>
            <div className="archive-rule" />
          </div>

          <div className="readout-layout">
            <div>
              <p className="micro-label">Being built with intent</p>
              <h2 id="platform-readout-title">A considered route to your next squad.</h2>
            </div>
            <p className="readout-copy">
              This is the foundation for a marketplace that respects the details: clear account information, room to inspect, and direct contact when you are ready.
            </p>
          </div>

          <div className="capability-list">
            <article>
              <span className="capability-index">01</span>
              <div><h3>Browse with clarity</h3><p>Account-first views designed for fast comparison.</p></div>
              <span className="future-label">Coming next</span>
            </article>
            <article>
              <span className="capability-index">02</span>
              <div><h3>Inspect the details</h3><p>Squad, resources and account identity in context.</p></div>
              <span className="future-label">In design</span>
            </article>
            <article>
              <span className="capability-index">03</span>
              <div><h3>List when ready</h3><p>A future home for credible seller submissions.</p></div>
              <span className="future-label">Planned</span>
            </article>
          </div>
        </section>

        <section className="community-brief" aria-labelledby="community-title">
          <div className="community-art" aria-hidden="true">
            <img src="/manus-storage/apex-platform-module_326de0da.jpg" alt="" />
            <span className="community-shade" />
          </div>
          <div className="community-content">
            <p className="eyebrow">02 / Stay close</p>
            <h2 id="community-title">The community is part of the build.</h2>
            <p>Real platform updates and the official APEX community channel will be available here once configured.</p>
            {APEX_WHATSAPP_URL ? (
              <a className="apex-button primary focus-ring" href={APEX_WHATSAPP_URL} target="_blank" rel="noreferrer">
                Open WhatsApp community <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ) : (
              <>
                <button className="apex-button pending focus-ring" type="button" onClick={showCommunityNote} aria-describedby="community-configuration-note">
                  WhatsApp link pending <ArrowUpRight size={16} aria-hidden="true" />
                </button>
                <p id="community-configuration-note" className={`configuration-note ${communityNote ? "is-visible" : ""}`} role="status">
                  The official community link has not been configured yet.
                </p>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="apex-footer">
        <div className="footer-brand"><APEXMark /><span>APEX</span></div>
        <p className="micro-label">FC Mobile Account Platform / Build 01</p>
        <p>© {new Date().getFullYear()} APEX. Platform preview.</p>
      </footer>

      {introVisible && (
        <section className={`welcome-layer ${welcomePreview ? "is-preview" : ""}`} aria-labelledby="welcome-title">
          <div className="welcome-backdrop" aria-hidden="true">
            <img src="/manus-storage/apex-welcome-archive_31af4dfa.jpg" alt="" />
          </div>
          <div className="welcome-grid" aria-hidden="true" />
          <div className="welcome-shell">
            <div className="welcome-top">
              <div className="welcome-brand"><APEXMark /><span>APEX</span></div>
              <button type="button" className="skip-button focus-ring" onClick={dismissIntro}>Skip intro</button>
            </div>
            <div className="welcome-copy">
              <p className="eyebrow welcome-sequence-one">001 / Welcome to APEX</p>
              <h2 id="welcome-title" className="welcome-sequence-two">Your hub for <span>FC Mobile</span> accounts.</h2>
              <p className="welcome-description welcome-sequence-three">Browse, buy, and eventually sell FC Mobile accounts through a direct, transparent experience.</p>
              <button type="button" className="enter-button focus-ring welcome-sequence-four" onClick={dismissIntro}>
                Enter APEX <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            </div>
            <p className="welcome-foot micro-label">APEX / A considered platform in progress</p>
          </div>
        </section>
      )}
    </div>
  );
}
