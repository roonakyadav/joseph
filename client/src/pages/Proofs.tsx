// APEX DESIGN: Sale Proofs — an evidence archive, never a testimonial wall.
import { ArrowLeft, ChevronLeft, ChevronRight, Expand, Minus, Plus, X } from "lucide-react";
import { type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ApexCatalogHeader } from "@/components/ApexCatalogHeader";
import { usePageMeta } from "@/lib/seo";
import { trpc } from "@/lib/trpc";
import "./Proofs.css";

type ProofRecord = {
  id: string;
  accountId: string | null;
  accountSlug: string | null;
  ovr: number | null;
  imageUrl: string;
  imageAlt: string;
  kind: "handover" | "account-record" | "confirmation";
  caption: string | null;
};

const proofKindLabel: Record<ProofRecord["kind"], string> = {
  handover: "Handover record",
  "account-record": "Account record",
  confirmation: "Confirmation",
};

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
    <div className="proof-viewer-top"><div><span>{proof.id}</span><small>Proof record</small></div><button ref={closeButton} className="focus-ring" type="button" onClick={onClose} aria-label="Close proof viewer"><X size={20} /></button></div>
    <div className="proof-viewer-image"><img src={proof.imageUrl} alt={proof.imageAlt} style={{ transform: `scale(${zoom})` }} /></div>
    <div className="proof-viewer-bottom"><div className="viewer-zoom"><button className="focus-ring" type="button" onClick={() => setZoom((current) => Math.max(1, current - 0.5))} disabled={zoom <= 1} aria-label="Zoom out"><Minus size={16} /></button><span>{zoom.toFixed(1)}×</span><button className="focus-ring" type="button" onClick={() => setZoom((current) => Math.min(2.5, current + 0.5))} disabled={zoom >= 2.5} aria-label="Zoom in"><Plus size={16} /></button></div><span>{String(index + 1).padStart(2, "0")} / {String(proofs.length).padStart(2, "0")}</span></div>
    {canNavigate && <><button className="proof-viewer-nav previous focus-ring" type="button" onClick={previous} aria-label="Previous proof"><ChevronLeft size={20} /></button><button className="proof-viewer-nav next focus-ring" type="button" onClick={next} aria-label="Next proof"><ChevronRight size={20} /></button></>}
  </section>;
}

function ProofCard({ proof, index, onOpen }: { proof: ProofRecord; index: number; onOpen: () => void }) {
  const [imageState, setImageState] = useState<"loading" | "ready" | "missing">("loading");
  return <article className={`proof-card ${index === 0 ? "proof-card--lead" : "proof-card--index"}`} data-reveal>
    <div className="proof-card-top"><span>{index === 0 ? "Lead record" : "Indexed record"} / {proof.id.replace("#", "")}</span><span className="proof-card-sequence">Archive {String(index + 1).padStart(2, "0")}</span></div>
    <button type="button" className="proof-card-image focus-ring" onClick={onOpen} aria-label={`Open ${proof.id} evidence image`}>
      {imageState === "loading" && <i className="proof-image-skeleton" aria-hidden="true" />}
      {imageState === "missing" ? <span className="proof-image-missing"><i /> Proof image unavailable</span> : <img src={proof.imageUrl} alt={proof.imageAlt} loading="lazy" decoding="async" onLoad={() => setImageState("ready")} onError={() => setImageState("missing")} />}
      <span className="proof-image-wash" aria-hidden="true" />
      <span className="proof-image-label">Privacy-reviewed record</span><span className="proof-expand"><Expand size={16} /> Inspect</span>
    </button>
    <div className="proof-card-meta"><div className="proof-meta-primary"><span>Type</span><strong>{proofKindLabel[proof.kind]}</strong></div>{proof.accountSlug ? <div className="proof-meta-account"><span>Account</span><Link href={`/accounts/${proof.accountSlug}`} className="focus-ring">View account record{proof.ovr ? <em>{proof.ovr} OVR</em> : null}</Link></div> : proof.accountId ? <div className="proof-meta-account"><span>Account</span><strong className="proof-account-archived">Archived account reference{proof.ovr ? <em>{proof.ovr} OVR</em> : null}</strong></div> : null}</div>
    {proof.caption && <p className="proof-caption">{proof.caption}</p>}
    <p className="proof-disclosure"><i /> Privacy-reviewed published proof record.</p>
  </article>;
}

export default function Proofs() {
  usePageMeta({ title: "Sale proof archive — Elite Traders", description: "Review privacy-checked published FC Mobile handover and account evidence records.", path: "/proofs" });
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const revealFocus = useRef<HTMLButtonElement | null>(null);
  const proofsQuery = trpc.proofs.list.useQuery();
  const proofs = useMemo(() => proofsQuery.data ?? [], [proofsQuery.data]);
  useEffect(() => { const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")); const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-revealed")), { threshold: .12 }); elements.forEach((element) => observer.observe(element)); return () => observer.disconnect(); }, []);
  const closeViewer = () => { setViewerIndex(null); window.setTimeout(() => revealFocus.current?.focus(), 0); };

  return <div className="proofs-page"><div className="proofs-grid" aria-hidden="true" /><ApexCatalogHeader active="proofs" /><main className="proofs-main">
    <section className="proofs-intro" aria-labelledby="proofs-title"><div className="proofs-rail"><p className="eyebrow"><i /> Elite Traders / Sale proofs</p><span>Proof archive</span></div><div className="proofs-intro-copy"><h1 id="proofs-title">See the record,<br /><em>in context.</em></h1><p>This archive presents privacy-reviewed handover material before seller contact.</p></div><aside className="proofs-development-note"><span className="apex-inspection-seal" aria-hidden="true"><img src="/manus-storage/apex-mark_890b511d.png" alt="" /></span><span>Archive status</span><strong>Published records</strong><p>{proofs.length ? "Each record shown is supplied for public viewing." : "No public evidence records have been published yet."}</p></aside></section>
    <section className="proofs-archive" aria-labelledby="archive-title"><div className="archive-head"><div><span>001</span><p id="archive-title">Privacy review archive</p></div><p>{proofsQuery.isLoading ? "Loading archive" : proofs.length ? `${proofs.length} ${proofs.length === 1 ? "record" : "records"} in view` : "No published records"}</p></div>{proofsQuery.isLoading ? <div className="proof-list"><div className="proof-card proof-card--lead"><div className="proof-image-skeleton" /></div></div> : proofs.length ? <div className="proof-list">{proofs.map((proof, index) => <ProofCard proof={proof} index={index} key={proof.id} onOpen={() => { revealFocus.current = document.activeElement as HTMLButtonElement; setViewerIndex(index); }} />)}</div> : <section className="proof-empty"><span>00</span><h2>No published proof records yet.</h2><p>Privacy-checked handover records appear here only after a completed transaction is approved for public sharing.</p><Link href="/accounts" className="focus-ring">Browse accounts <ArrowLeft size={15} /></Link></section>}</section>
    <section className="proofs-method" data-reveal aria-labelledby="method-title"><div><span>002</span><p id="method-title">Publication method</p></div><p>Only material approved for public display belongs in the published archive. Private contact details, payment references and other sensitive information are excluded or redacted before publishing.</p></section>
  </main>{viewerIndex !== null && proofs[viewerIndex] && <ProofViewer proofs={proofs} initialIndex={viewerIndex} onClose={closeViewer} />}</div>;
}
