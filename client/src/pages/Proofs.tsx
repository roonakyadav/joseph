// APEX DESIGN: Sale Proofs — an evidence archive, never a testimonial wall. Development specimens remain explicit until authentic permissioned material exists.
import { ArrowLeft, ChevronLeft, ChevronRight, Expand, Minus, Plus, X } from "lucide-react";
import { type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ApexCatalogHeader } from "@/components/ApexCatalogHeader";
import { getAccountBySlug } from "@/data/accounts";
import { getVisibleProofs, proofArchiveMode, proofKindLabel, type ProofRecord } from "@/data/proofs";
import "./Proofs.css";

function ProofViewer({ proofs, initialIndex, onClose }: { proofs: ProofRecord[]; initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const closeButton = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);
  const proof = proofs[index];
  const canNavigate = proofs.length > 1;
  const previous = () => { setZoom(1); setIndex((current) => (current - 1 + proofs.length) % proofs.length); };
  const next = () => { setZoom(1); setIndex((current) => (current + 1) % proofs.length); };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); if (event.key === "ArrowLeft" && canNavigate) previous(); if (event.key === "ArrowRight" && canNavigate) next(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeButton.current?.focus();
    return () => { document.body.style.overflow = originalOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [canNavigate, onClose]);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => { touchStart.current = event.clientX; };
  const onPointerUp = (event: PointerEvent<HTMLElement>) => { if (touchStart.current === null || !canNavigate || zoom > 1) return; const delta = event.clientX - touchStart.current; if (Math.abs(delta) > 42) delta > 0 ? previous() : next(); touchStart.current = null; };

  return <section className="proof-viewer" role="dialog" aria-modal="true" aria-label={`${proof.id} full-screen proof view`} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
    <div className="proof-viewer-top"><div><span>{proof.id}</span><small>{proof.isDevelopment ? "Development specimen" : "Proof record"}</small></div><button ref={closeButton} className="focus-ring" type="button" onClick={onClose} aria-label="Close proof viewer"><X size={20} /></button></div>
    <div className="proof-viewer-image"><img src={proof.image} alt={proof.imageAlt} style={{ transform: `scale(${zoom})` }} /></div>
    <div className="proof-viewer-bottom"><div className="viewer-zoom"><button className="focus-ring" type="button" onClick={() => setZoom((current) => Math.max(1, current - 0.5))} disabled={zoom <= 1} aria-label="Zoom out"><Minus size={16} /></button><span>{zoom.toFixed(1)}×</span><button className="focus-ring" type="button" onClick={() => setZoom((current) => Math.min(2.5, current + 0.5))} disabled={zoom >= 2.5} aria-label="Zoom in"><Plus size={16} /></button></div><span>{String(index + 1).padStart(2, "0")} / {String(proofs.length).padStart(2, "0")}</span></div>
    {canNavigate && <><button className="proof-viewer-nav previous focus-ring" type="button" onClick={previous} aria-label="Previous proof"><ChevronLeft size={20} /></button><button className="proof-viewer-nav next focus-ring" type="button" onClick={next} aria-label="Next proof"><ChevronRight size={20} /></button></>}
  </section>;
}

function ProofCard({ proof, index, onOpen }: { proof: ProofRecord; index: number; onOpen: () => void }) {
  const linkedAccount = proof.accountSlug ? getAccountBySlug(proof.accountSlug) : undefined;
  const [imageState, setImageState] = useState<"loading" | "ready" | "missing">("loading");
  return <article className={`proof-card ${index === 0 ? "proof-card--lead" : "proof-card--index"}`} data-reveal>
    <div className="proof-card-top"><span>{index === 0 ? "Lead specimen" : "Indexed specimen"} / {proof.id.replace("#", "")}</span><span className="proof-card-sequence">Archive {String(index + 1).padStart(2, "0")}</span></div>
    <button type="button" className="proof-card-image focus-ring" onClick={onOpen} aria-label={`Open ${proof.id} evidence image`}>
      {imageState === "loading" && <i className="proof-image-skeleton" aria-hidden="true" />}
      {imageState === "missing" ? <span className="proof-image-missing"><i /> Development proof image unavailable</span> : <img src={proof.image} alt={proof.imageAlt} onLoad={() => setImageState("ready")} onError={() => setImageState("missing")} />}
      <span className="proof-image-wash" aria-hidden="true" />
      <span className="proof-image-label">{proof.isDevelopment ? "Development sample" : "Shared record"}</span><span className="proof-expand"><Expand size={16} /> Inspect</span>
    </button>
    <div className="proof-card-meta"><div className="proof-meta-primary"><span>Type</span><strong>{proofKindLabel[proof.kind]}</strong></div>{proof.accountId && <div className="proof-meta-account"><span>Account</span>{linkedAccount ? <Link href={`/accounts/${linkedAccount.slug}`} className="focus-ring">{proof.accountId}{proof.ovr ? <em>{proof.ovr} OVR</em> : null}</Link> : <strong>{proof.accountId}{proof.ovr ? <em>{proof.ovr} OVR</em> : null}</strong>}</div>}</div>
    {proof.caption && <p className="proof-caption">{proof.caption}</p>}
    <p className="proof-disclosure"><i /> {proof.isDevelopment ? "Privacy-safe development specimen — not customer evidence or a completed transaction." : "Privacy-reviewed published proof record."}</p>
  </article>;
}

export default function Proofs() {
  const [viewerIndex, setViewerIndex] = useState<number | null>(() => new URLSearchParams(window.location.search).get("viewer") === "1" ? 0 : null);
  const revealFocus = useRef<HTMLButtonElement | null>(null);
  const previewMode = new URLSearchParams(window.location.search).get("preview");
  const proofs = useMemo(() => {
    const currentProofs = getVisibleProofs();
    if (previewMode === "empty") return [];
    if (previewMode === "missing" && currentProofs[0]) return [{ ...currentProofs[0], image: "/manus-storage/apex-proof-missing-development-preview.jpg" }, ...currentProofs.slice(1)];
    return currentProofs;
  }, [previewMode]);
  useEffect(() => { const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-revealed")), { threshold: .12 }); elements.forEach((element) => observer.observe(element)); return () => observer.disconnect(); }, []);
  const closeViewer = () => { setViewerIndex(null); window.setTimeout(() => revealFocus.current?.focus(), 0); };

  return <div className="proofs-page"><div className="proofs-grid" aria-hidden="true" /><ApexCatalogHeader active="proofs" /><main className="proofs-main">
    <section className="proofs-intro" aria-labelledby="proofs-title"><div className="proofs-rail"><p className="eyebrow"><i /> APEX / Sale proofs</p><span>{proofArchiveMode === "development" ? "Development archive" : "Proof archive"}</span></div><div className="proofs-intro-copy"><h1 id="proofs-title">See the record,<br /><em>in context.</em></h1><p>This archive demonstrates how privacy-reviewed handover material can be presented before seller contact.</p></div><aside className="proofs-development-note"><span className="apex-inspection-seal" aria-hidden="true"><img src="/manus-storage/apex-mark_890b511d.png" alt="" /></span><span>Archive status</span><strong>{proofArchiveMode === "development" ? "Sample content" : "Published records"}</strong><p>{proofArchiveMode === "development" ? "Every item below is a labelled, privacy-safe interface specimen. Authentic public handover material has not been added." : "Each record shown is supplied for public viewing."}</p></aside></section>
    <section className="proofs-archive" aria-labelledby="archive-title"><div className="archive-head"><div><span>001</span><p id="archive-title">Privacy review archive</p></div><p>{proofs.length ? `${proofs.length} ${proofs.length === 1 ? "record" : "records"} in view` : "No published records"}</p></div>{proofs.length ? <div className="proof-list">{proofs.map((proof, index) => <ProofCard proof={proof} index={index} key={proof.id} onOpen={() => { revealFocus.current = document.activeElement as HTMLButtonElement; setViewerIndex(index); }} />)}</div> : <section className="proof-empty"><span>00</span><h2>Proof archive is being built.</h2><p>Authentic handover records will appear here as transactions are completed and approved for public sharing.</p><Link href="/accounts" className="focus-ring">Browse accounts <ArrowLeft size={15} /></Link></section>}</section>
    <section className="proofs-method" data-reveal aria-labelledby="method-title"><div><span>002</span><p id="method-title">Publication method</p></div><p>Only material approved for public display belongs in the published archive. Private contact details, payment references and other sensitive information are excluded or redacted before publishing.</p></section>
  </main>{viewerIndex !== null && proofs[viewerIndex] && <ProofViewer proofs={proofs} initialIndex={viewerIndex} onClose={closeViewer} />}</div>;
}
