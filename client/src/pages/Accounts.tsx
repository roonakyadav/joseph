// APEX DESIGN: Account Archive — a mobile product catalog where the account specimen leads and controls remain compact, explicit, and thumb-native.
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ApexCatalogHeader } from "@/components/ApexCatalogHeader";
import { AccountCard, AccountCardSkeleton } from "@/components/AccountCard";
import { accountRecords, type AccountStatus } from "@/data/accounts";
import "./Accounts.css";

type QuickFilter = "all" | "110" | "115" | "budget" | "available";
type SortOption = "newest" | "ovr" | "price-low" | "price-high";

type StoredCatalogState = {
  search?: string;
  quick?: QuickFilter;
  status?: "all" | AccountStatus;
  minOvr?: string;
  maxPrice?: string;
  sort?: SortOption;
};

const CATALOG_STATE_KEY = "apex-catalog-state";
const CATALOG_SCROLL_KEY = "apex-catalog-scroll";

function getStoredCatalogState(): StoredCatalogState {
  try { return JSON.parse(window.sessionStorage.getItem(CATALOG_STATE_KEY) || "{}"); } catch { return {}; }
}

export default function Accounts() {
  const previewMode = new URLSearchParams(window.location.search).get("preview");
  const [stored] = useState(getStoredCatalogState);
  const [search, setSearch] = useState(previewMode === "empty" ? "unmatched development record" : stored.search ?? "");
  const [quick, setQuick] = useState<QuickFilter>(stored.quick ?? "all");
  const [status, setStatus] = useState<"all" | AccountStatus>(stored.status ?? "all");
  const [minOvr, setMinOvr] = useState(stored.minOvr ?? "");
  const [maxPrice, setMaxPrice] = useState(stored.maxPrice ?? "");
  const [sort, setSort] = useState<SortOption>(stored.sort ?? "newest");
  const [filtersOpen, setFiltersOpen] = useState(previewMode === "filters");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 380);
    const storedScroll = Number(window.sessionStorage.getItem(CATALOG_SCROLL_KEY));
    if (storedScroll) window.setTimeout(() => window.scrollTo(0, storedScroll), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (previewMode === "filters") setFiltersOpen(true);
    if (previewMode === "empty") setSearch("unmatched development record");
  }, [previewMode]);

  useEffect(() => {
    window.sessionStorage.setItem(CATALOG_STATE_KEY, JSON.stringify({ search, quick, status, minOvr, maxPrice, sort }));
  }, [search, quick, status, minOvr, maxPrice, sort]);

  const accounts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = accountRecords.filter((account) => {
      const searchable = [account.title, account.id, account.rank, ...account.keyPlayers].join(" ").toLowerCase();
      const quickMatch = quick === "all" || (quick === "110" && account.ovr >= 110) || (quick === "115" && account.ovr >= 115) || (quick === "budget" && account.price <= 50) || (quick === "available" && account.status === "available");
      const statusMatch = status === "all" || account.status === status;
      const ovrMatch = !minOvr || account.ovr >= Number(minOvr);
      const priceMatch = !maxPrice || account.price <= Number(maxPrice);
      return (!query || searchable.includes(query)) && quickMatch && statusMatch && ovrMatch && priceMatch;
    });

    return result.sort((a, b) => {
      if (sort === "ovr") return b.ovr - a.ovr;
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [search, quick, status, minOvr, maxPrice, sort]);

  const clearDiscovery = () => { setSearch(""); setQuick("all"); setStatus("all"); setMinOvr(""); setMaxPrice(""); };
  const prepareAccountNavigation = () => window.sessionStorage.setItem(CATALOG_SCROLL_KEY, String(window.scrollY));
  const activeFilterCount = Number(status !== "all") + Number(Boolean(minOvr)) + Number(Boolean(maxPrice));
  const quickFilters: Array<[QuickFilter, string]> = [["all", "All records"], ["110", "110+ OVR"], ["115", "115+ OVR"], ["budget", "Under $50"], ["available", "Available"]];

  return (
    <div className="accounts-page">
      <div className="accounts-grid" aria-hidden="true" />
      <ApexCatalogHeader active="accounts" />
      <main className="accounts-main">
        <section className="catalog-intro" aria-labelledby="accounts-title">
          <div className="catalog-intro-rail"><p className="eyebrow"><i /> APEX / Account archive</p><span>Controlled development index</span></div>
          <div className="catalog-intro-heading"><div><h1 id="accounts-title">Account<br /><em>records.</em></h1><p>Inspect development squad records, resource fields and price markers.</p></div><div className="catalog-count"><strong>{accountRecords.length}</strong><span>Concept<br />records</span></div></div>
          <div className="catalog-dossier-rail" aria-label="Catalog classification"><span>Index / 02</span><span>Classification / Concept preview</span><span>Account object first</span></div>
        </section>

        <section className="catalog-controls" aria-label="Account discovery controls">
          <form className="catalog-search" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="account-search">Search the catalog</label>
            <input id="account-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Account, player or ID" autoComplete="off" />
            {search && <button className="search-clear focus-ring" type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>}
          </form>
          <div className="catalog-control-row">
            <button type="button" className={`filters-trigger focus-ring ${activeFilterCount ? "has-filters" : ""}`} onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={15} /> Filters {activeFilterCount ? <b>{activeFilterCount}</b> : null}</button>
            <label className="sort-select"><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} aria-label="Sort accounts"><option value="newest">Newest</option><option value="ovr">Highest OVR</option><option value="price-low">Lowest price</option><option value="price-high">Highest price</option></select></label>
          </div>
          <div className="quick-filter-scroller" aria-label="Quick filters">{quickFilters.map(([value, label]) => <button className={`quick-filter focus-ring ${quick === value ? "is-selected" : ""}`} type="button" key={value} onClick={() => setQuick(value)}>{label}</button>)}</div>
        </section>

        <section className="catalog-list" aria-live="polite">
          <div className="catalog-list-heading"><p>{loading ? "Retrieving account records" : `${accounts.length} indexed ${accounts.length === 1 ? "record" : "records"}`}</p><span>Archive / 02</span></div>
          {loading ? (
            <div className="account-grid">{Array.from({ length: 3 }, (_, index) => <AccountCardSkeleton key={index} />)}</div>
          ) : accountRecords.length === 0 ? (
            <div className="catalog-empty"><span>00</span><h2>No records loaded</h2><p>The development index is not populated yet. The official APEX channel will be shown here once configured.</p></div>
          ) : accounts.length === 0 ? (
            <div className="catalog-empty"><span>00</span><h2>No matches</h2><p>Nothing in the current development catalog matches this search or filter set.</p><button type="button" className="empty-clear focus-ring" onClick={clearDiscovery}>Clear filters</button></div>
          ) : (
            <div className="account-grid">{accounts.map((account) => <div key={account.id} onClick={prepareAccountNavigation}><AccountCard account={account} /></div>)}</div>
          )}
        </section>
      </main>

      <section className={`filter-sheet ${filtersOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="filter-sheet-title" aria-hidden={!filtersOpen}>
        <button className="filter-sheet-scrim" type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />
        <div className="filter-sheet-body"><div className="filter-sheet-grip" /><div className="filter-sheet-title"><div><p className="eyebrow">APEX / Record filters</p><h2 id="filter-sheet-title">Refine the index</h2></div><button className="filter-close focus-ring" type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={18} /></button></div>
          <div className="filter-fields"><label><span>Minimum OVR</span><input type="number" min="0" inputMode="numeric" placeholder="Any" value={minOvr} onChange={(event) => setMinOvr(event.target.value)} /></label><label><span>Maximum price / USD</span><input type="number" min="0" inputMode="numeric" placeholder="Any" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></label></div>
          <fieldset className="status-options"><legend>Availability</legend><div><button type="button" className={status === "all" ? "is-selected" : ""} onClick={() => setStatus("all")}>All</button><button type="button" className={status === "available" ? "is-selected" : ""} onClick={() => setStatus("available")}>Available</button><button type="button" className={status === "sold" ? "is-selected" : ""} onClick={() => setStatus("sold")}>Sold</button></div></fieldset>
          <div className="filter-sheet-actions"><button className="sheet-reset focus-ring" type="button" onClick={clearDiscovery}>Reset</button><button className="sheet-apply focus-ring" type="button" onClick={() => setFiltersOpen(false)}>Show {accounts.length} records</button></div>
        </div>
      </section>
    </div>
  );
}
