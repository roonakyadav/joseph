// APEX DESIGN: Account Archive — image-led account object with a controlled information rail; no generic marketplace-card treatment.
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { formatCurrency, formatQuantity, type AccountRecord } from "@/data/accounts";
import "./AccountCard.css";

export function AccountCard({ account }: { account: AccountRecord }) {
  const [imageFailed, setImageFailed] = useState(false);
  const isSold = account.status === "sold";

  return (
    <article className={`account-card ${isSold ? "is-sold" : ""}`}>
      <Link href={`/accounts/${account.slug}`} className="account-card-link focus-ring" aria-label={`View ${account.title}, ${account.id}`}>
        <div className="account-card-image">
          {!imageFailed ? <img src={account.image} alt={account.imageAlt} onError={() => setImageFailed(true)} /> : <div className="account-image-fallback"><span>Image unavailable</span><i /></div>}
          <div className="account-card-wash" />
          <div className="account-card-topline"><span className="dev-mark">Verified record</span><span className={`status-mark ${account.status}`}>{account.status}</span></div>
          <div className="account-ovr"><strong>{account.ovr}</strong><span>OVR</span></div>
          {isSold && <div className="sold-stamp">Archived<br />sold</div>}
        </div>
        <div className="account-card-body">
          <div className="account-card-title"><div><p>{account.id}</p><h2>{account.title}</h2></div><span className="card-rank">{account.rank}</span></div>
          <p className="record-classification">Verified APEX account record / Live inventory status</p>
          <p className="account-players">{account.keyPlayers.join(" · ")}</p>
          <dl className="account-metrics"><div><dt>Coins</dt><dd>{formatQuantity(account.coins)}</dd></div><div><dt>Gems</dt><dd>{formatQuantity(account.gems)}</dd></div><div><dt>Price</dt><dd>{formatCurrency(account.price, account.currency)}</dd></div></dl>
          <div className="account-card-action"><span>{isSold ? "Inspect archive" : "Inspect record"}</span><ArrowUpRight size={15} aria-hidden="true" /></div>
        </div>
      </Link>
    </article>
  );
}

export function AccountCardSkeleton() {
  return <article className="account-card account-skeleton" aria-label="Loading account"><div className="skeleton-image" /><div className="skeleton-body"><i /><b /><i /><div><em /><em /><em /></div></div></article>;
}
