// APEX DESIGN: Account Archive — shared compact product header, structured as an index rather than a generic navigation bar.
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import "./ApexCatalogHeader.css";

function APEXMark() {
  return <img className="catalog-mark" src="/manus-storage/apex-mark_890b511d.png" alt="" />;
}

export function ApexCatalogHeader({ active = "accounts" }: { active?: "home" | "accounts" | "sell" | "proofs" }) {
  const [indexOpen, setIndexOpen] = useState(false);
  const indexTriggerRef = useRef<HTMLButtonElement>(null);
  const indexPanelRef = useRef<HTMLElement>(null);

  const closeIndex = () => {
    setIndexOpen(false);
    window.setTimeout(() => indexTriggerRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!indexOpen) return;
    const previousOverflow = document.body.style.overflow;
    const focusFirstDrawerControl = () => indexPanelRef.current?.querySelector<HTMLElement>("button, a[href]")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeIndex();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(indexPanelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.setTimeout(focusFirstDrawerControl, 0);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [indexOpen]);

  return (
    <>
      <header className="catalog-header">
        <Link href="/" className="catalog-brand focus-ring" aria-label="APEX home">
          <APEXMark /> <span>APEX</span>
        </Link>
        <div className="catalog-header-meta"><span>Archive / Live</span><button ref={indexTriggerRef} className="catalog-index-trigger focus-ring" type="button" onClick={() => setIndexOpen(true)} aria-expanded={indexOpen} aria-controls="catalog-index"><i /> Index <b>{active === "proofs" ? "04" : active === "sell" ? "03" : active === "accounts" ? "02" : "01"}</b></button></div>
      </header>
      {indexOpen && <div className="catalog-index-layer">
        <button type="button" className="catalog-index-backdrop" aria-label="Close navigation index" onClick={closeIndex} />
        <aside id="catalog-index" ref={indexPanelRef} className="catalog-index is-open" role="dialog" aria-modal="true" aria-label="APEX platform index">
        <div className="catalog-index-top"><p>APEX / Platform index</p><button type="button" className="catalog-index-close focus-ring" aria-label="Close navigation index" onClick={closeIndex}><X size={18} /></button></div>
        <nav className="catalog-index-nav" aria-label="APEX platform routes">
          <Link href="/" className={active === "home" ? "is-active" : ""} onClick={closeIndex}><span>01</span><strong>Home</strong><small>Platform entry</small>{active === "home" && <i>Active</i>}</Link>
          <Link href="/accounts" className={active === "accounts" ? "is-active" : ""} onClick={closeIndex}><span>02</span><strong>Accounts</strong><small>Public record index</small>{active === "accounts" && <i>Active</i>}</Link>
          <Link href="/sell" className={active === "sell" ? "is-active" : ""} onClick={closeIndex}><span>03</span><strong>Sell</strong><small>Submission protocol</small>{active === "sell" && <i>Active</i>}</Link>
          <Link href="/proofs" className={active === "proofs" ? "is-active" : ""} onClick={closeIndex}><span>04</span><strong>Proofs</strong><small>Evidence archive</small>{active === "proofs" && <i>Active</i>}</Link>
          <div><span>05</span><strong>Community</strong><small>Official channel</small></div>
        </nav>
        <p className="catalog-index-note">Public destinations are indexed here. The official community route becomes available only when configured.</p>
        </aside>
      </div>}
    </>
  );
}
