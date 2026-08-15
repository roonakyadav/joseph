// APEX DESIGN: Account Archive — a mobile product catalog where the account specimen leads and controls remain compact, explicit, and thumb-native.
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ApexCatalogHeader } from "@/components/ApexCatalogHeader";
import { AccountCard, AccountCardSkeleton } from "@/components/AccountCard";
import { mapPublicAccount, type AccountStatus } from "@/data/accounts";
import { trackApexEvent } from "@/lib/analytics";
import { usePageMeta } from "@/lib/seo";
import { trpc } from "@/lib/trpc";
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
  usePageMeta({ title: "Account records — Elite Traders", description: "Browse published FC Mobile account records by OVR, availability, resource fields, and price marker.", path: "/accounts" });
  const [stored] = useState(getStoredCatalogState);
  const [search, setSearch] = useState(stored.search ?? "");
  const [quick, setQuick] = useState<QuickFilter>(stored.quick ?? "all");
  const [status, setStatus] = useState<"all" | AccountStatus>(stored.status ?? "all");
  const [minOvr, setMinOvr] = useState(stored.minOvr ?? "");
  const [maxPrice, setMaxPrice] = useState(stored.maxPrice ?? "");
  const [sort, setSort] = useState<SortOption>(stored.sort ?? "newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const recordsQuery = trpc.accounts.list.useQuery();

  useEffect(() => {
    const storedScroll = Number(window.sessionStorage.getItem(CATALOG_SCROLL_KEY));
    if (storedScroll) window.setTimeout(() => window.scrollTo(0, storedScroll), 0);
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(CATALOG_STATE_KEY, JSON.stringify({ search, quick, status, minOvr, maxPrice, sort }));
  }, [search, quick, status, minOvr, maxPrice, sort]);

  useEffect(() => {
    const queryLength = search.trim().length;
    if (queryLength < 2) return;
    const timer = window.setTimeout(() => trackApexEvent("catalog_search", { query_length: queryLength }), 700);
    return () => window.clearTimeout(timer);
  }, [search]);

  const allAccounts = useMemo(() => (recordsQuery.data ?? []).map(mapPublicAccount), [recordsQuery.data]);
  const accounts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = allAccounts.filter((account) => {
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
  }, [allAccounts, search, quick, status, minOvr, maxPrice, sort]);

  const clearDiscovery = () => { trackApexEvent("catalog_filter", { action: "clear" }); setSearch(""); setQuick("all"); setStatus("all"); setMinOvr(""); setMaxPrice(""); };
  const prepareAccountNavigation = () => window.sessionStorage.setItem(CATALOG_SCROLL_KEY, String(window.scrollY));
  const activeFilterCount = Number(status !== "all") + Number(Boolean(minOvr)) + Number(Boolean(maxPrice));
  const quickFilters: Array<[QuickFilter, string]> = [["all", "All records"], ["110", "110+ OVR"], ["115", "115+ OVR"], ["budget", "Under $50"], ["available", "Available"]];

  return (
    <div className="accounts-page">
      <div className="accounts-grid" aria-hidden="true" />
      <ApexCatalogHeader active="accounts" />
      <main className="accounts-main">
        <section className="catalog-intro" aria-labelledby="accounts-title">
          <div className="catalog-intro-rail"><p className="eyebrow"><i /> Elite Traders / Account archive</p><span>Controlled public index</span></div>
          <div className="catalog-intro-heading"><div><h1 id="accounts-title">Account<br /><em>records.</em></h1><p>Inspect published squad records, resource context and price detail.</p></div><div className="catalog-count"><strong>{allAccounts.length}</strong><span>Public<br />records</span></div></div>
          <div className="catalog-dossier-rail" aria-label="Catalog classification"><span>Index / 02</span><span>Classification / Published records</span><span>Account object first</span></div>
        </section>

        <section className="catalog-controls" aria-label="Account discovery controls">
          <form className="catalog-search" onSubmit={(event) => { event.preventDefault(); if (search.trim()) trackApexEvent("catalog_search", { query_length: search.trim().length, action: "submit" }); }}>
            <label htmlFor="account-search">Search the archive</label>
            <input id="account-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Account, player or ID" autoComplete="off" />
            {search && <button className="search-clear focus-ring" type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>}
          </form>
          <div className="catalog-control-row">
            <button type="button" className={`filters-trigger focus-ring ${activeFilterCount ? "has-filters" : ""}`} onClick={() => { trackApexEvent("catalog_filter", { action: "open", active_filters: activeFilterCount }); setFiltersOpen(true); }}><SlidersHorizontal size={15} /> Refine {activeFilterCount ? <b>{activeFilterCount}</b> : null}</button>
            <label className="sort-select"><span>Order</span><select value={sort} onChange={(event) => { const nextSort = event.target.value as SortOption; trackApexEvent("catalog_sort", { order: nextSort }); setSort(nextSort); }} aria-label="Order account records"><option value="newest">Recently indexed</option><option value="ovr">Highest OVR</option><option value="price-low">Lowest price</option><option value="price-high">Highest price</option></select></label>
          </div>
          <div className="quick-filter-scroller" aria-label="Quick filters">{quickFilters.map(([value, label]) => <button className={`quick-filter focus-ring ${quick === value ? "is-selected" : ""}`} type="button" key={value} onClick={() => { trackApexEvent("catalog_filter", { quick_filter: value }); setQuick(value); }}>{label}</button>)}</div>
        </section>

        <section className="catalog-list" aria-live="polite">
          <div className="catalog-list-heading"><p>{recordsQuery.isLoading ? "Retrieving account records" : `${accounts.length} indexed ${accounts.length === 1 ? "record" : "records"}`}</p><span>Archive / 02</span></div>
          {recordsQuery.isLoading ? (
            <div className="account-grid">{Array.from({ length: 3 }, (_, index) => <AccountCardSkeleton key={index} />)}</div>
          ) : recordsQuery.isError ? (
            <div className="catalog-empty"><span>00</span><h2>Archive unavailable</h2><p>The public account index could not be loaded right now. Please try again shortly.</p></div>
          ) : allAccounts.length === 0 ? (
            <div className="catalog-empty catalog-empty--dossier"><div className="empty-dossier-head"><span>00 / Record pending</span><b>Index clear</b></div><div className="empty-dossier-specs" aria-label="Record fields awaiting publication"><span>OVR <b>—</b></span><span>Resources <b>—</b></span><span>State <b>Pending</b></span></div><h2>No public records</h2><p>Published account records appear here when they are ready to enter the public index.</p></div>
          ) : accounts.length === 0 ? (
            <div className="catalog-empty"><span>00</span><h2>No matches</h2><p>Nothing in the current account archive matches this search or filter set.</p><button type="button" className="empty-clear focus-ring" onClick={clearDiscovery}>Clear filters</button></div>
          ) : (
            <div className="account-grid">{accounts.map((account) => <div key={account.id} onClick={() => { trackApexEvent("account_record_open", { account_ovr: account.ovr }); prepareAccountNavigation(); }}><AccountCard account={account} /></div>)}</div>
          )}
        </section>
      </main>

      <section className={`filter-sheet ${filtersOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="filter-sheet-title" aria-hidden={!filtersOpen}>
        <button className="filter-sheet-scrim" type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />
        <div className="filter-sheet-body"><div className="filter-sheet-grip" /><div className="filter-sheet-title"><div><p className="eyebrow">Elite Traders / Record filters</p><h2 id="filter-sheet-title">Refine the index</h2></div><button className="filter-close focus-ring" type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={18} /></button></div>
          <div className="filter-fields"><label><span>Minimum OVR</span><input type="number" min="0" inputMode="numeric" placeholder="Any" value={minOvr} onChange={(event) => setMinOvr(event.target.value)} /></label><label><span>Maximum price / USD</span><input type="number" min="0" inputMode="numeric" placeholder="Any" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></label></div>
          <fieldset className="status-options"><legend>Availability</legend><div><button type="button" className={status === "all" ? "is-selected" : ""} onClick={() => setStatus("all")}>All</button><button type="button" className={status === "available" ? "is-selected" : ""} onClick={() => setStatus("available")}>Available</button><button type="button" className={status === "sold" ? "is-selected" : ""} onClick={() => setStatus("sold")}>Sold</button></div></fieldset>
          <div className="filter-sheet-actions"><button className="sheet-reset focus-ring" type="button" onClick={clearDiscovery}>Reset</button><button className="sheet-apply focus-ring" type="button" onClick={() => setFiltersOpen(false)}>Show {accounts.length} records</button></div>
        </div>
      </section>
    </div>
  );
}
