// APEX DESIGN: Account Archive — an image-led product inspector where gallery, OVR, status, price and decision path precede secondary account facts.
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ApexCatalogHeader } from "@/components/ApexCatalogHeader";
import { formatCurrency, formatQuantity, mapPublicAccount, type AccountMedia, type AccountRecord } from "@/data/accounts";
import { trackApexEvent } from "@/lib/analytics";
import { usePageMeta } from "@/lib/seo";
import { trpc } from "@/lib/trpc";
import "./AccountRoute.css";

function getWhatsappUrl(account: AccountRecord) {
  if (!account.sellerWhatsapp) return "";
  const message = `Hi, I'm interested in the APEX account ${account.id} (${account.ovr} OVR). Is it still available?`;
  return `https://wa.me/${account.sellerWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

function LoadingRecord() {
  return <main className="account-route-main account-loading" aria-label="Loading account record"><div className="record-loading-image" /><div className="record-loading-lines"><i /><i /><i /></div><div className="record-loading-specs">{Array.from({ length: 4 }, (_, index) => <i key={index} />)}</div></main>;
}

type GalleryProps = { media: AccountMedia[]; title: string; initialViewer?: boolean };

function AccountGallery({ media, title, initialViewer = false }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(initialViewer);
  const [imageState, setImageState] = useState<"loading" | "ready" | "missing">("loading");
  const openButton = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);

  const activeMedia = media[activeIndex];
  const canNavigate = media.length > 1;
  const previous = () => setActiveIndex((current) => (current - 1 + media.length) % media.length);
  const next = () => setActiveIndex((current) => (current + 1) % media.length);
  const closeViewer = () => {
    setViewerOpen(false);
    window.setTimeout(() => openButton.current?.focus(), 0);
  };

  useEffect(() => { setImageState("loading"); }, [activeIndex]);

  useEffect(() => {
    if (!viewerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft" && canNavigate) previous();
      if (event.key === "ArrowRight" && canNavigate) next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [viewerOpen, canNavigate]);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => { touchStart.current = event.clientX; };
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (touchStart.current === null || !canNavigate) return;
    const distance = event.clientX - touchStart.current;
    if (Math.abs(distance) > 42) distance > 0 ? previous() : next();
    touchStart.current = null;
  };

  return <>
    <section className="record-gallery" aria-label={`${title} media gallery`} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <button ref={openButton} className="record-gallery-main focus-ring" type="button" onClick={() => setViewerOpen(true)} aria-label={`Expand ${activeMedia.label.toLowerCase()} for ${title}`}>
        {imageState === "loading" && <span className="gallery-image-skeleton" aria-hidden="true" />}
        {imageState === "missing" ? <span className="gallery-missing"><i /> Record image unavailable</span> : <img src={activeMedia.src} alt={activeMedia.alt} decoding="async" onLoad={() => setImageState("ready")} onError={() => setImageState("missing")} />}
        <span className="gallery-image-wash" aria-hidden="true" />
        <span className="gallery-stamp">{activeMedia.label}</span>
        <span className="gallery-expand"><Expand size={16} /><span>Expand</span></span>
      </button>
      <div className="gallery-controls">
        <span className="gallery-count">{String(activeIndex + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}</span>
        <div className="gallery-dots" aria-hidden="true">{media.map((_, index) => <i key={index} className={index === activeIndex ? "is-active" : ""} />)}</div>
        {canNavigate && <div className="gallery-buttons"><button className="focus-ring" type="button" onClick={previous} aria-label="Previous gallery image"><ChevronLeft size={16} /></button><button className="focus-ring" type="button" onClick={next} aria-label="Next gallery image"><ChevronRight size={16} /></button></div>}
      </div>
      {canNavigate && <div className="gallery-thumbnails" aria-label="Choose gallery image">{media.map((item, index) => <button type="button" key={item.src} className={`focus-ring ${index === activeIndex ? "is-active" : ""}`} onClick={() => setActiveIndex(index)} aria-label={`Show image ${index + 1}`}><img src={item.src} alt="" loading="lazy" decoding="async" /></button>)}</div>}
    </section>
    {viewerOpen && <section className="image-viewer" role="dialog" aria-modal="true" aria-label={`${title} image viewer`} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <div className="image-viewer-top"><span>{title} / {String(activeIndex + 1).padStart(2, "0")}</span><button className="focus-ring" type="button" onClick={closeViewer} aria-label="Close full-screen viewer"><X size={20} /></button></div>
      <div className="image-viewer-frame">{imageState === "missing" ? <span className="gallery-missing"><i /> Record image unavailable</span> : <img src={activeMedia.src} alt={activeMedia.alt} />}</div>
      {canNavigate && <><button className="viewer-nav previous focus-ring" type="button" onClick={previous} aria-label="Previous gallery image"><ChevronLeft size={20} /></button><button className="viewer-nav next focus-ring" type="button" onClick={next} aria-label="Next gallery image"><ChevronRight size={20} /></button></>}
    </section>}
  </>;
}

export default function AccountRoute({ params }: { params: { slug: string } }) {
  const [, navigate] = useLocation();
  const recordQuery = trpc.accounts.getBySlug.useQuery({ slug: params.slug });
  const accountIndexQuery = trpc.accounts.list.useQuery();
  const account = recordQuery.data ? mapPublicAccount(recordQuery.data) : undefined;
  usePageMeta({ title: account ? `${account.title} — APEX account record` : "Account record — APEX", description: account ? `${account.ovr} OVR FC Mobile account record with ${account.keyPlayers.slice(0, 3).join(", ")}.` : "Inspect a published APEX FC Mobile account record.", path: `/accounts/${params.slug}`, image: account?.image, noIndex: !account });
  const [messageState, setMessageState] = useState<"idle" | "copied" | "unavailable">("idle");

  const returnToCatalog = () => window.history.length > 1 ? window.history.back() : navigate("/accounts");

  if (recordQuery.isLoading) return <div className="account-route-page"><ApexCatalogHeader active="accounts" /><LoadingRecord /></div>;
  if (!account) return <div className="account-route-page"><ApexCatalogHeader active="accounts" /><main className="account-route-main"><section className="record-missing"><span>404 / Record unavailable</span><h1>Account record not found.</h1><p>This APEX identifier is not present in the current catalog.</p><Link className="record-return focus-ring" href="/accounts">Return to accounts <ArrowUpRight size={16} /></Link></section></main></div>;

  const isSold = account.status === "sold";
  const whatsappUrl = getWhatsappUrl(account);
  const enquiryMessage = `Hi, I'm interested in the APEX account ${account.id} (${account.ovr} OVR). Is it still available?`;
  const coreSpecs = [{ label: "Coins", value: formatQuantity(account.coins) }, { label: "Gems", value: formatQuantity(account.gems) }, { label: "Rank", value: account.rank }, { label: "Status", value: isSold ? "Sold" : "Available" }];
  const relatedAccounts = (accountIndexQuery.data ?? []).map(mapPublicAccount).filter((candidate) => candidate.slug !== account.slug && candidate.status === "available").sort((a, b) => Math.abs(a.ovr - account.ovr) - Math.abs(b.ovr - account.ovr)).slice(0, 3);
  const galleryMedia = account.media.length > 0 ? account.media : [{ src: "", alt: `${account.title} has no published media`, label: "Record image" as const }];
  const copyEnquiry = async () => {
    try { await navigator.clipboard.writeText(enquiryMessage); setMessageState("copied"); }
    catch { setMessageState("unavailable"); }
    window.setTimeout(() => setMessageState("idle"), 3200);
  };

  return <div className={`account-route-page ${isSold ? "is-archived" : ""}`}>
    <ApexCatalogHeader active="accounts" />
    <main className="account-route-main with-sticky-action">
      <div className="detail-context"><button type="button" className="record-back focus-ring" onClick={returnToCatalog}><ArrowLeft size={15} /> Back to accounts</button><span>{account.id}</span></div>
      <AccountGallery media={galleryMedia} title={account.title} />
      <section className="record-identity" aria-labelledby="record-title"><div className="identity-rail"><span className={`record-status ${account.status}`}><i /> {account.status}</span><span>APEX / {account.classification} record</span></div><div className="record-title-line"><div><h1 id="record-title">{account.title}</h1><p>{account.id}</p></div><div className="record-ovr"><strong>{account.ovr}</strong><span>OVR</span></div></div></section>
      <section className="price-panel" aria-label="Account price"><div><span>{isSold ? "Archive price reference" : "Listed price"}</span><strong>{formatCurrency(account.price, account.currency)}</strong></div><p>{isSold ? "Not active inventory" : "Available verified record"}</p></section>
      <section className="record-specifications" aria-labelledby="specs-title"><div className="section-label"><span>01</span><p id="specs-title">Core specifications</p></div><dl>{coreSpecs.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl></section>
      <section className="record-players premium-section" aria-labelledby="players-title"><div className="section-label"><span>02</span><p id="players-title">Key players</p></div><div>{account.keyPlayers.map((player, index) => <span key={player}><i>{String(index + 1).padStart(2, "0")}</i><strong>{player}</strong><small>Curated record field</small></span>)}</div></section>
      <section className="record-description premium-section" aria-labelledby="description-title"><div className="section-label"><span>03</span><p id="description-title">Account note</p></div><p>{account.description}</p></section>
      <section className="record-transfer premium-section" aria-labelledby="transfer-title"><div className="section-label"><span>04</span><p id="transfer-title">Transfer information</p></div><dl><div><dt>Channel</dt><dd>{account.transfer.channel}</dd></div><div><dt>Handover note</dt><dd>{account.transfer.note}</dd></div></dl></section>
      <section className="related-records premium-section" aria-labelledby="related-title"><div className="section-label"><span>05</span><p id="related-title">Archive continuation</p></div><div className="related-heading"><h2>Adjacent account files</h2><Link href="/accounts">Open index <ArrowRight size={15} /></Link></div><div className="related-list">{relatedAccounts.map((related) => <Link key={related.id} href={`/accounts/${related.slug}`} className="related-record focus-ring"><img src={related.image} alt="" /><span><i>{related.id}</i><strong>{related.title}</strong><small>Available / verified record</small></span><b><em>{related.ovr}</em><small>OVR</small></b><ArrowUpRight size={15} /></Link>)}</div></section>
      <p className="record-disclaimer">Published account record. Availability, seller contact, and handover terms must be confirmed directly through the configured contact path.</p>
    </main>
    <aside className={`sticky-conversion ${isSold ? "is-sold" : ""}`} aria-label="Account decision action"><div><span>{isSold ? "Archived status" : "Listed price"}</span><strong>{isSold ? "Sold" : formatCurrency(account.price, account.currency)}</strong><small>{account.ovr} OVR · {account.id}</small></div>{isSold ? <Link href="/accounts" className="sticky-action focus-ring">Browse available <ArrowRight size={16} /></Link> : whatsappUrl ? <a className="sticky-action focus-ring" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => trackApexEvent("account_whatsapp_open", { account_ovr: account.ovr })}>Contact on WhatsApp <ArrowUpRight size={16} /></a> : <button type="button" className="sticky-action is-pending focus-ring" onClick={() => { trackApexEvent("account_enquiry_copy", { account_ovr: account.ovr }); void copyEnquiry(); }}>{messageState === "copied" ? "Enquiry copied" : messageState === "unavailable" ? "Copy unavailable" : "Copy WhatsApp enquiry"}</button>}<span className={`conversion-note ${messageState !== "idle" ? "is-visible" : ""}`} role="status">{messageState === "copied" ? "Paste this contextual enquiry into the seller’s configured WhatsApp channel." : "Clipboard access is unavailable. Configure a seller channel to continue."}</span></aside>
  </div>;
}
