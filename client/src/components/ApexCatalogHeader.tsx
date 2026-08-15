// APEX DESIGN: Account Archive — shared compact product header, structured as an index rather than a generic navigation bar.
import { X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import "./ApexCatalogHeader.css";

function APEXMark() {
  return <img className="catalog-mark" src="/manus-storage/apex-mark_890b511d.png" alt="" />;
}

export function ApexCatalogHeader({ active = "accounts" }: { active?: "home" | "accounts" | "sell" | "proofs" }) {
  const [indexOpen, setIndexOpen] = useState(false);

  return (
    <>
      <header className="catalog-header">
        <Link href="/" className="catalog-brand focus-ring" aria-label="APEX home">
          <APEXMark /> <span>APEX</span>
        </Link>
        <div className="catalog-header-meta"><span>Build / 05</span><button className="catalog-index-trigger focus-ring" type="button" onClick={() => setIndexOpen(true)} aria-expanded={indexOpen} aria-controls="catalog-index"><i /> Index <b>{active === "proofs" ? "04" : active === "sell" ? "03" : active === "accounts" ? "02" : "01"}</b></button></div>
      </header>
      <aside id="catalog-index" className={`catalog-index ${indexOpen ? "is-open" : ""}`} aria-hidden={!indexOpen}>
        <div className="catalog-index-top"><p>APEX / Platform index</p><button type="button" className="catalog-index-close focus-ring" aria-label="Close navigation index" onClick={() => setIndexOpen(false)}><X size={18} /></button></div>
        <nav className="catalog-index-nav" aria-label="APEX platform routes">
          <Link href="/" className={active === "home" ? "is-active" : ""} onClick={() => setIndexOpen(false)}><span>01</span><strong>Home</strong><small>Platform entry</small>{active === "home" && <i>Active</i>}</Link>
          <Link href="/accounts" className={active === "accounts" ? "is-active" : ""} onClick={() => setIndexOpen(false)}><span>02</span><strong>Accounts</strong><small>Development catalog</small>{active === "accounts" && <i>Active</i>}</Link>
          <Link href="/sell" className={active === "sell" ? "is-active" : ""} onClick={() => setIndexOpen(false)}><span>03</span><strong>Sell</strong><small>Submission protocol</small>{active === "sell" && <i>Active</i>}</Link>
          <Link href="/proofs" className={active === "proofs" ? "is-active" : ""} onClick={() => setIndexOpen(false)}><span>04</span><strong>Proofs</strong><small>Evidence archive</small>{active === "proofs" && <i>Active</i>}</Link>
          <div><span>05</span><strong>Community</strong><small>Official channel</small></div>
        </nav>
        <p className="catalog-index-note">Only live destinations open. Future surfaces remain visible as part of the platform map.</p>
      </aside>
    </>
  );
}
