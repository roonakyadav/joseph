// APEX DESIGN: Account Archive — a real record route kept intentionally compact while the full account-detail product surface remains out of scope.
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { ApexCatalogHeader } from "@/components/ApexCatalogHeader";
import { formatCurrency, formatQuantity, getAccountBySlug } from "@/data/accounts";
import "./AccountRoute.css";

export default function AccountRoute({ params }: { params: { slug: string } }) {
  const [, navigate] = useLocation();
  const account = useMemo(() => getAccountBySlug(params.slug), [params.slug]);

  const returnToCatalog = () => {
    if (window.history.length > 1) window.history.back();
    else navigate("/accounts");
  };

  if (!account) {
    return <div className="account-route-page"><ApexCatalogHeader active="accounts" /><main className="account-route-main"><section className="record-missing"><span>404</span><h1>Account record not found.</h1><p>This APEX identifier is not present in the current development catalog.</p><Link className="record-return focus-ring" href="/accounts">Return to accounts <ArrowUpRight size={16} /></Link></section></main></div>;
  }

  const isSold = account.status === "sold";
  const whatsappUrl = account.sellerWhatsapp ? `https://wa.me/${account.sellerWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello, I am enquiring about APEX account ${account.id}.`)}` : "";

  return (
    <div className="account-route-page">
      <ApexCatalogHeader active="accounts" />
      <main className="account-route-main">
        <button type="button" className="record-back focus-ring" onClick={returnToCatalog}><ArrowLeft size={15} /> Back to catalog</button>
        <section className="record-intro" aria-labelledby="record-title">
          <div className="record-rail"><span><i /> APEX / Development record</span><span>{account.id}</span></div>
          <div className="record-heading"><div><p className={`record-status ${account.status}`}>{account.status}</p><h1 id="record-title">{account.title}</h1><p>{account.description}</p></div><div className="record-ovr"><strong>{account.ovr}</strong><span>OVR</span></div></div>
        </section>
        <section className="record-visual" aria-label={`Concept account visual for ${account.title}`}><img src={account.image} alt={account.imageAlt} /><div className="record-visual-wash" /><span className="record-dev-stamp">Development<br />concept</span>{isSold && <span className="record-sold-stamp">Archived<br />sold</span>}</section>
        <section className="record-summary" aria-labelledby="summary-title"><div className="section-label"><span>01</span><p id="summary-title">Core record</p></div><dl><div><dt>Price</dt><dd>{formatCurrency(account.price, account.currency)}</dd></div><div><dt>Coins</dt><dd>{formatQuantity(account.coins)}</dd></div><div><dt>Gems</dt><dd>{formatQuantity(account.gems)}</dd></div><div><dt>Rank</dt><dd>{account.rank}</dd></div></dl></section>
        <section className="record-players" aria-labelledby="players-title"><div className="section-label"><span>02</span><p id="players-title">Key player preview</p></div><div>{account.keyPlayers.map((player, index) => <span key={player}><i>{String(index + 1).padStart(2, "0")}</i>{player}</span>)}</div></section>
        <section className="record-contact" aria-labelledby="contact-title"><div><p className="eyebrow">03 / Seller channel</p><h2 id="contact-title">{isSold ? "Archived record" : "Seller contact"}</h2><p>{isSold ? "This record remains visible for archive reference and cannot be contacted as an available account." : "A verified seller channel activates when a live record is connected to this account."}</p></div>{isSold ? <span className="contact-state">No contact on sold archive</span> : whatsappUrl ? <a className="contact-link focus-ring" href={whatsappUrl} target="_blank" rel="noreferrer">Contact seller <ArrowUpRight size={16} /></a> : <span className="contact-state">Seller channel pending</span>}</section>
        <p className="record-disclaimer">This page demonstrates the APEX account record route using development data. Live listing, verification and seller-contact data are not configured.</p>
      </main>
    </div>
  );
}
