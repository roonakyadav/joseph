import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { startLogin } from "@/const";
import { imageFileToUpload } from "@/lib/imageUpload";
import { usePageMeta } from "@/lib/seo";
import { trpc } from "@/lib/trpc";
import {
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  CircleOff,
  ExternalLink,
  FileCheck2,
  ImagePlus,
  Inbox,
  Loader2,
  Pencil,
  Plus,
  Save,
  Send,
  Settings2,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import "./AdminLight.css";

type AccountMediaRecord = { id: string; url: string; alt: string; isPrimary: boolean; sortOrder: number };
type AccountRecord = {
  id: string;
  slug: string;
  title: string;
  ovr: number;
  price: number;
  currency: string;
  status: "available" | "sold";
  lifecycle: "draft" | "published" | "archived";
  coins: number;
  gems: number;
  fcPoints: number;
  rank: string;
  formation: string | null;
  keyPlayers: string[];
  description: string;
  featured: boolean;
  sellerWhatsapp: string | null;
  media: AccountMediaRecord[];
};

type AccountForm = {
  slug: string;
  title: string;
  ovr: string;
  price: string;
  currency: string;
  status: "available" | "sold";
  lifecycle: "draft" | "published" | "archived";
  coins: string;
  gems: string;
  fcPoints: string;
  rank: string;
  formation: string;
  keyPlayers: string;
  description: string;
  featured: boolean;
  sellerWhatsapp: string;
};

const blankAccountForm = (): AccountForm => ({
  slug: "",
  title: "",
  ovr: "",
  price: "",
  currency: "USD",
  status: "available",
  lifecycle: "draft",
  coins: "0",
  gems: "0",
  fcPoints: "0",
  rank: "",
  formation: "",
  keyPlayers: "",
  description: "",
  featured: false,
  sellerWhatsapp: "",
});

function formFromAccount(account: AccountRecord): AccountForm {
  return {
    slug: account.slug,
    title: account.title,
    ovr: String(account.ovr),
    price: String(account.price),
    currency: account.currency,
    status: account.status,
    lifecycle: account.lifecycle,
    coins: String(account.coins),
    gems: String(account.gems),
    fcPoints: String(account.fcPoints),
    rank: account.rank,
    formation: account.formation ?? "",
    keyPlayers: account.keyPlayers.join(", "),
    description: account.description,
    featured: account.featured,
    sellerWhatsapp: account.sellerWhatsapp ?? "",
  };
}

function parseAccountForm(form: AccountForm) {
  return {
    slug: form.slug.trim().toLowerCase(),
    title: form.title.trim(),
    ovr: Number(form.ovr),
    price: Number(form.price),
    currency: form.currency.trim().toUpperCase(),
    status: form.status,
    lifecycle: form.lifecycle,
    coins: Number(form.coins || 0),
    gems: Number(form.gems || 0),
    fcPoints: Number(form.fcPoints || 0),
    rank: form.rank.trim(),
    formation: form.formation.trim() || null,
    keyPlayers: form.keyPlayers.split(",").map(item => item.trim()).filter(Boolean),
    description: form.description.trim(),
    featured: form.featured,
    sellerWhatsapp: form.sellerWhatsapp.trim() || null,
  };
}

function formatQuantity(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function PageHeading({ eyebrow, title, note, action }: { eyebrow: string; title: string; note: string; action?: React.ReactNode }) {
  return (
    <header className="mb-7 flex flex-col gap-4 border-b border-[#f0f1ea]/15 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#77d44d]">{eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#f0f1ea]">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#aeb4aa]">{note}</p>
      </div>
      {action}
    </header>
  );
}

function ActionButton({ children, onClick, disabled, tone = "signal", type = "button" }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; tone?: "signal" | "quiet" | "danger"; type?: "button" | "submit" }) {
  const tones = {
    signal: "border-[#77d44d] bg-[#77d44d] text-[#0e120f] hover:bg-[#94e775]",
    quiet: "border-[#f0f1ea]/20 bg-transparent text-[#f0f1ea] hover:border-[#77d44d]/70 hover:text-[#77d44d]",
    danger: "border-[#f97969]/70 bg-transparent text-[#f97969] hover:bg-[#f97969]/10",
  };
  return <button type={type} onClick={onClick} disabled={disabled} className={`inline-flex min-h-10 items-center justify-center gap-2 border px-3 font-mono text-[10px] uppercase tracking-[0.12em] transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45 ${tones[tone]}`}>{children}</button>;
}

function StatusTag({ value }: { value: string }) {
  const signal = value === "published" || value === "available" || value === "approved";
  const critical = value === "sold" || value === "rejected" || value === "archived";
  return <span className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.13em] ${signal ? "border-[#77d44d]/45 text-[#77d44d]" : critical ? "border-[#f97969]/45 text-[#f97969]" : "border-[#f0f1ea]/20 text-[#b5b9b2]"}`}>{value}</span>;
}

function EmptyState({ icon: Icon, title, note }: { icon: typeof Archive; title: string; note: string }) {
  return <div className="border border-dashed border-[#f0f1ea]/20 p-8 text-center"><Icon className="mx-auto mb-3 h-5 w-5 text-[#77d44d]" /><p className="text-sm font-medium text-[#f0f1ea]">{title}</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#aeb4aa]">{note}</p></div>;
}

function AdminDashboard() {
  const stats = trpc.admin.dashboard.useQuery();
  const cards = stats.data ? [
    ["Published inventory", stats.data.available + stats.data.sold, "Listings visible to public storefronts"],
    ["Available now", stats.data.available, "Published accounts with a live contact path"],
    ["Review queue", stats.data.openSubmissions, "Pending or actively reviewing seller submissions"],
    ["Proof drafts", stats.data.draftProofs, "Non-development evidence awaiting a publishing decision"],
  ] : [];

  return <>
    <PageHeading eyebrow="Elite Traders / Operations" title="Archive control room" note="A live record of controlled inventory, seller review, evidence publication, and public contact configuration." />
    {stats.isLoading ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-36 animate-pulse border border-[#f0f1ea]/10 bg-[#f0f1ea]/5" />)}</div> : stats.error ? <EmptyState icon={CircleOff} title="Operations data is unavailable" note="The server did not return current counts. Refresh the workspace or check the database connection." /> : <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, note]) => <section key={label} className="border border-[#f0f1ea]/15 bg-[#141914] p-5"><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#aeb4aa]">{label}</p><p className="mt-5 text-4xl font-semibold tracking-tight text-[#f0f1ea]">{value}</p><p className="mt-3 text-xs leading-5 text-[#aeb4aa]">{note}</p></section>)}</div>
      <section className="mt-5 grid gap-4 border border-[#f0f1ea]/15 bg-[#141914] p-5 lg:grid-cols-[auto_1fr]"><ShieldCheck className="h-6 w-6 text-[#77d44d]" /><div><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#77d44d]">Publication rule</p><p className="mt-2 text-sm leading-6 text-[#f0f1ea]">Public pages read only intentionally published records. Archiving removes listings immediately, sold listings remain inspectable but suppress seller contact, and development proof specimens can never publish.</p></div></section>
    </>}
  </>;
}

function AccountEditor({ account, onClose }: { account: AccountRecord | null; onClose: () => void }) {
  const utils = trpc.useUtils();
  const create = trpc.admin.accounts.create.useMutation({ onSuccess: () => { utils.admin.accounts.list.invalidate(); onClose(); } });
  const update = trpc.admin.accounts.update.useMutation({ onSuccess: () => { utils.admin.accounts.list.invalidate(); onClose(); } });
  const [form, setForm] = useState<AccountForm>(() => account ? formFromAccount(account) : blankAccountForm());
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const addMedia = trpc.admin.accounts.addMedia.useMutation({ onSuccess: () => utils.admin.accounts.list.invalidate() });
  const setPrimary = trpc.admin.accounts.setPrimaryMedia.useMutation({ onSuccess: () => utils.admin.accounts.list.invalidate() });
  const updateMedia = trpc.admin.accounts.updateMedia.useMutation({ onSuccess: () => utils.admin.accounts.list.invalidate() });
  const removeMedia = trpc.admin.accounts.removeMedia.useMutation({ onSuccess: () => utils.admin.accounts.list.invalidate() });

  useEffect(() => setForm(account ? formFromAccount(account) : blankAccountForm()), [account]);

  const set = <K extends keyof AccountForm>(key: K, value: AccountForm[K]) => setForm(current => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const data = parseAccountForm(form);
    if (!data.slug || !data.title || !data.rank || !data.description || data.keyPlayers.length === 0 || !Number.isFinite(data.ovr) || !Number.isFinite(data.price)) {
      setError("Complete the required account identity, squad, price, and description fields before saving.");
      return;
    }
    if (account) update.mutate({ id: account.id, data }); else create.mutate(data);
  };

  const uploadImage = async (file: File | null) => {
    if (!file || !account) return;
    setUploading(true); setError("");
    try {
      const image = await imageFileToUpload(file, `${account.title} account evidence`);
      await addMedia.mutateAsync({ id: account.id, image, isPrimary: account.media.length === 0, sortOrder: account.media.length });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to add the selected image."); }
    finally { setUploading(false); }
  };

  return <section className="border border-[#77d44d]/40 bg-[#111611] p-4 md:p-6">
    <div className="mb-5 flex items-center justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#77d44d]">{account ? `Editing ${account.id}` : "New inventory record"}</p><h2 className="mt-1 text-xl font-semibold text-[#f0f1ea]">{account ? account.title : "Create account"}</h2></div><button type="button" onClick={onClose} className="p-2 text-[#aeb4aa] hover:text-[#f0f1ea]" aria-label="Close editor"><X className="h-5 w-5" /></button></div>
    <form onSubmit={submit} className="grid gap-4 lg:grid-cols-2">
      <Field label="Listing title" required><input value={form.title} onChange={e => { set("title", e.target.value); if (!form.slug) set("slug", slugify(e.target.value)); }} /></Field>
      <Field label="Public slug" required><input value={form.slug} onChange={e => set("slug", slugify(e.target.value))} placeholder="catalyst-xi" /></Field>
      <Field label="OVR" required><input inputMode="numeric" value={form.ovr} onChange={e => set("ovr", e.target.value)} /></Field>
      <Field label="Price" required><input inputMode="numeric" value={form.price} onChange={e => set("price", e.target.value)} /></Field>
      <Field label="Currency" required><input value={form.currency} onChange={e => set("currency", e.target.value)} /></Field>
      <Field label="Rank" required><input value={form.rank} onChange={e => set("rank", e.target.value)} placeholder="Legend" /></Field>
      <Field label="Coins"><input inputMode="numeric" value={form.coins} onChange={e => set("coins", e.target.value)} /></Field>
      <Field label="Gems"><input inputMode="numeric" value={form.gems} onChange={e => set("gems", e.target.value)} /></Field>
      <Field label="FC Points"><input inputMode="numeric" value={form.fcPoints} onChange={e => set("fcPoints", e.target.value)} /></Field>
      <Field label="Formation"><input value={form.formation} onChange={e => set("formation", e.target.value)} placeholder="4–3–3" /></Field>
      <Field label="Availability"><select value={form.status} onChange={e => set("status", e.target.value as AccountForm["status"])}><option value="available">Available</option><option value="sold">Sold</option></select></Field>
      <Field label="Public lifecycle"><select value={form.lifecycle} onChange={e => set("lifecycle", e.target.value as AccountForm["lifecycle"])}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></Field>
      <Field label="Key players" required className="lg:col-span-2"><input value={form.keyPlayers} onChange={e => set("keyPlayers", e.target.value)} placeholder="Ronaldo, Zidane, Gullit" /></Field>
      <Field label="Seller WhatsApp number" className="lg:col-span-2"><input value={form.sellerWhatsapp} onChange={e => set("sellerWhatsapp", e.target.value)} placeholder="Country code and number; shown only for available published listings" /></Field>
      <Field label="Account description" required className="lg:col-span-2"><textarea rows={4} value={form.description} onChange={e => set("description", e.target.value)} /></Field>
      <label className="flex items-center gap-3 border border-[#f0f1ea]/15 px-3 py-3 text-sm text-[#f0f1ea] lg:col-span-2"><input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="accent-[#77d44d]" /> Feature this account when it is published.</label>
      {error && <p className="border border-[#f97969]/40 bg-[#f97969]/10 p-3 text-sm text-[#ffd6d0] lg:col-span-2">{error}</p>}
      <div className="flex flex-wrap gap-2 lg:col-span-2"><ActionButton type="submit" disabled={create.isPending || update.isPending}>{create.isPending || update.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}{account ? "Save changes" : "Create draft"}</ActionButton><ActionButton tone="quiet" onClick={onClose}>Cancel</ActionButton></div>
    </form>
    {account && <div className="mt-7 border-t border-[#f0f1ea]/15 pt-5"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#77d44d]">Controlled media</p><p className="mt-1 text-xs text-[#aeb4aa]">Upload files go to private storage first. Choose one primary image for public display.</p></div><label className="cursor-pointer"><span className="sr-only">Add account image</span><input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => { uploadImage(e.target.files?.[0] ?? null); e.currentTarget.value = ""; }} /><span className="inline-flex min-h-10 items-center gap-2 border border-[#f0f1ea]/20 px-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#f0f1ea] hover:border-[#77d44d] hover:text-[#77d44d]">{uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImagePlus className="h-3 w-3" />}Add image</span></label></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{account.media.map((media, index) => <article key={media.id} className="overflow-hidden border border-[#f0f1ea]/15 bg-[#0e120f]"><img src={media.url} alt={media.alt} className="aspect-[4/3] w-full object-cover" /><div className="space-y-3 p-3"><div className="flex items-center justify-between gap-2"><span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#aeb4aa]">Image {index + 1}</span>{media.isPrimary && <StatusTag value="primary" />}</div><p className="line-clamp-2 text-xs leading-5 text-[#d5d8d0]">{media.alt}</p><div className="flex flex-wrap gap-2"><ActionButton tone="quiet" onClick={() => setPrimary.mutate({ accountId: account.id, mediaId: media.id })} disabled={media.isPrimary}>Primary</ActionButton><ActionButton tone="quiet" onClick={() => updateMedia.mutate({ id: media.id, sortOrder: Math.max(0, media.sortOrder - 1) })}><ArrowUp className="h-3 w-3" /></ActionButton><ActionButton tone="quiet" onClick={() => updateMedia.mutate({ id: media.id, sortOrder: media.sortOrder + 1 })}><ArrowDown className="h-3 w-3" /></ActionButton><ActionButton tone="danger" onClick={() => { if (window.confirm("Remove this media record? The file will no longer be referenced by Elite Traders.")) removeMedia.mutate({ id: media.id }); }}><Trash2 className="h-3 w-3" /></ActionButton></div></div></article>)}</div>
      {account.media.length === 0 && <EmptyState icon={ImagePlus} title="No media linked" note="Add at least one verified image before publishing an inventory record." />}
    </div>}
  </section>;
}

function Field({ label, required, className = "", children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return <label className={`block ${className}`}><span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.12em] text-[#aeb4aa]">{label}{required ? <b className="ml-1 text-[#77d44d]">*</b> : null}</span>{children}</label>;
}

function AdminAccounts() {
  const utils = trpc.useUtils();
  const accounts = trpc.admin.accounts.list.useQuery();
  const [editing, setEditing] = useState<AccountRecord | null | undefined>(undefined);
  const publish = trpc.admin.accounts.publish.useMutation({ onSuccess: () => utils.admin.accounts.list.invalidate() });
  const archive = trpc.admin.accounts.archive.useMutation({ onSuccess: () => utils.admin.accounts.list.invalidate() });
  const toggleFeature = trpc.admin.accounts.setFeatured.useMutation({ onSuccess: () => utils.admin.accounts.list.invalidate() });
  const status = trpc.admin.accounts.setStatus.useMutation({ onSuccess: () => utils.admin.accounts.list.invalidate() });

  return <>
    <PageHeading eyebrow="Elite Traders / Inventory" title="Account records" note="Create controlled drafts, attach reviewed media, publish deliberately, and archive rather than delete operational history." action={<ActionButton onClick={() => setEditing(null)}><Plus className="h-3 w-3" />New account</ActionButton>} />
    {editing !== undefined && <div className="mb-6"><AccountEditor account={editing} onClose={() => setEditing(undefined)} /></div>}
    {accounts.isLoading ? <div className="h-52 animate-pulse border border-[#f0f1ea]/10 bg-[#f0f1ea]/5" /> : accounts.error ? <EmptyState icon={CircleOff} title="Account inventory is unavailable" note="No private inventory could be loaded from the database." /> : accounts.data?.length === 0 ? <EmptyState icon={Archive} title="No account records" note="Create a draft listing, add verified media, then publish it when it is ready for the public archive." /> : <div className="overflow-x-auto border border-[#f0f1ea]/15"><table className="min-w-[960px] w-full border-collapse text-left"><thead className="border-b border-[#f0f1ea]/15 bg-[#141914]"><tr className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#aeb4aa]"><th className="p-3">Record</th><th className="p-3">State</th><th className="p-3">OVR</th><th className="p-3">Price</th><th className="p-3">Media</th><th className="p-3 text-right">Actions</th></tr></thead><tbody>{(accounts.data as AccountRecord[]).map(account => <tr key={account.id} className="border-b border-[#f0f1ea]/10 last:border-0"><td className="p-3"><p className="font-medium text-[#f0f1ea]">{account.title}</p><p className="mt-1 font-mono text-[10px] text-[#aeb4aa]">{account.slug}</p></td><td className="p-3"><div className="flex flex-wrap gap-1"><StatusTag value={account.lifecycle} /><StatusTag value={account.status} />{account.featured && <StatusTag value="featured" />}</div></td><td className="p-3 text-sm text-[#f0f1ea]">{account.ovr}</td><td className="p-3 text-sm text-[#f0f1ea]">{account.currency} {account.price}</td><td className="p-3 text-sm text-[#aeb4aa]">{account.media.length}</td><td className="p-3"><div className="flex justify-end gap-2"><ActionButton tone="quiet" onClick={() => setEditing(account)}><Pencil className="h-3 w-3" />Edit</ActionButton>{account.lifecycle === "draft" && <ActionButton onClick={() => publish.mutate({ id: account.id })}><Send className="h-3 w-3" />Publish</ActionButton>}{account.lifecycle === "published" && <ActionButton tone="quiet" onClick={() => toggleFeature.mutate({ id: account.id, featured: !account.featured })}>{account.featured ? "Unfeature" : "Feature"}</ActionButton>}{account.status === "available" && account.lifecycle === "published" && <ActionButton tone="quiet" onClick={() => status.mutate({ id: account.id, status: "sold" })}>Mark sold</ActionButton>}{account.lifecycle !== "archived" && <ActionButton tone="danger" onClick={() => { if (window.confirm(`Archive ${account.title}? It will immediately disappear from public pages.`)) archive.mutate({ id: account.id }); }}><Archive className="h-3 w-3" />Archive</ActionButton>}</div></td></tr>)}</tbody></table></div>}
  </>;
}

type SubmissionRecord = { id: string; sellerName: string; contactMethod: string; sellerContact: string; accountTitle: string; ovr: number; priceExpectation: number; coins: number; gems: number; fcPoints: number; rank: string | null; formation: string | null; keyPlayers: string[]; notes: string | null; status: "pending" | "reviewing" | "changes-requested" | "approved" | "rejected"; convertedAccountId: string | null };

function AdminSubmissions() {
  const utils = trpc.useUtils();
  const submissions = trpc.admin.submissions.list.useQuery();
  const [selected, setSelected] = useState<SubmissionRecord | null>(null);
  const [convertOpen, setConvertOpen] = useState(false);
  const updateStatus = trpc.admin.submissions.setStatus.useMutation({ onSuccess: (_, variables) => { utils.admin.submissions.list.invalidate(); setSelected(current => current?.id === variables.id ? { ...current, status: variables.status } : current); } });
  const convert = trpc.admin.submissions.convertToAccount.useMutation({ onSuccess: () => { utils.admin.submissions.invalidate(); utils.admin.accounts.list.invalidate(); setConvertOpen(false); setSelected(null); } });
  const seed = useMemo<AccountForm>(() => selected ? { ...blankAccountForm(), slug: slugify(selected.accountTitle), title: selected.accountTitle, ovr: String(selected.ovr), price: String(selected.priceExpectation), coins: String(selected.coins), gems: String(selected.gems), fcPoints: String(selected.fcPoints), rank: selected.rank ?? "", formation: selected.formation ?? "", keyPlayers: selected.keyPlayers.join(", "), description: selected.notes || "Seller-submitted profile awaiting an editorial listing description." } : blankAccountForm(), [selected]);
  const [convertForm, setConvertForm] = useState<AccountForm>(blankAccountForm());
  useEffect(() => setConvertForm(seed), [seed]);

  const submitConversion = (event: FormEvent) => { event.preventDefault(); if (!selected) return; const account = parseAccountForm(convertForm); if (!account.slug || !account.title || !account.rank || account.keyPlayers.length === 0) return; convert.mutate({ submissionId: selected.id, account }); };

  return <>
    <PageHeading eyebrow="Elite Traders / Seller review" title="Submission queue" note="Seller submissions are private operational records. Progress status without promising approval; convert only after your own review." />
    {selected && <section className="mb-6 border border-[#77d44d]/40 bg-[#111611] p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#77d44d]">Selected submission</p><h2 className="mt-1 text-xl font-semibold text-[#f0f1ea]">{selected.accountTitle}</h2></div><button onClick={() => { setSelected(null); setConvertOpen(false); }} className="p-2 text-[#aeb4aa] hover:text-[#f0f1ea]" aria-label="Close submission detail"><X className="h-5 w-5" /></button></div><dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Detail label="Seller" value={selected.sellerName} /><Detail label="Contact" value={`${selected.contactMethod}: ${selected.sellerContact}`} /><Detail label="OVR / rank" value={`${selected.ovr} / ${selected.rank ?? "—"}`} /><Detail label="Expected price" value={`USD ${selected.priceExpectation}`} /></dl>{selected.notes && <p className="mt-4 border-l-2 border-[#77d44d] pl-3 text-sm leading-6 text-[#d5d8d0]">{selected.notes}</p>}<div className="mt-5 flex flex-wrap gap-2"><ActionButton tone="quiet" onClick={() => updateStatus.mutate({ id: selected.id, status: "reviewing" })}>Set reviewing</ActionButton><ActionButton tone="quiet" onClick={() => updateStatus.mutate({ id: selected.id, status: "changes-requested" })}>Request changes</ActionButton><ActionButton tone="quiet" onClick={() => updateStatus.mutate({ id: selected.id, status: "approved" })}>Approve</ActionButton><ActionButton tone="danger" onClick={() => { if (window.confirm("Reject this seller submission? It will remain in private history.")) updateStatus.mutate({ id: selected.id, status: "rejected" }); }}>Reject</ActionButton>{!selected.convertedAccountId && selected.status === "approved" ? <ActionButton onClick={() => setConvertOpen(value => !value)}><Plus className="h-3 w-3" />Prepare listing</ActionButton> : !selected.convertedAccountId ? <p className="self-center font-mono text-[10px] uppercase tracking-[0.1em] text-[#aeb4aa]">Approve before preparing a listing</p> : null}</div>{selected.status === "changes-requested" && <p className="mt-4 border-l-2 border-[#f0f1ea]/30 pl-3 text-xs leading-5 text-[#aeb4aa]">Changes have been requested. Use the submitted contact channel to coordinate the follow-up; this status does not publish or approve the record.</p>}{convertOpen && selected.status === "approved" && <form onSubmit={submitConversion} className="mt-6 grid gap-3 border-t border-[#f0f1ea]/15 pt-5 md:grid-cols-2"><Field label="Listing title" required><input value={convertForm.title} onChange={e => setConvertForm(value => ({ ...value, title: e.target.value }))} /></Field><Field label="Public slug" required><input value={convertForm.slug} onChange={e => setConvertForm(value => ({ ...value, slug: slugify(e.target.value) }))} /></Field><Field label="OVR" required><input value={convertForm.ovr} onChange={e => setConvertForm(value => ({ ...value, ovr: e.target.value }))} /></Field><Field label="Price" required><input value={convertForm.price} onChange={e => setConvertForm(value => ({ ...value, price: e.target.value }))} /></Field><Field label="Rank" required><input value={convertForm.rank} onChange={e => setConvertForm(value => ({ ...value, rank: e.target.value }))} /></Field><Field label="Key players" required><input value={convertForm.keyPlayers} onChange={e => setConvertForm(value => ({ ...value, keyPlayers: e.target.value }))} /></Field><Field label="Description" required className="md:col-span-2"><textarea rows={3} value={convertForm.description} onChange={e => setConvertForm(value => ({ ...value, description: e.target.value }))} /></Field><div className="md:col-span-2"><ActionButton type="submit" disabled={convert.isPending}>{convert.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}Create draft from submission</ActionButton></div></form>}</section>}
    {submissions.isLoading ? <div className="h-48 animate-pulse border border-[#f0f1ea]/10 bg-[#f0f1ea]/5" /> : submissions.error ? <EmptyState icon={CircleOff} title="Submission queue is unavailable" note="The private seller review queue did not return from the database." /> : submissions.data?.length === 0 ? <EmptyState icon={Inbox} title="No seller submissions" note="New records submitted from the public sell form will appear here for review." /> : <div className="grid gap-3 lg:grid-cols-2">{(submissions.data as SubmissionRecord[]).map(submission => <button key={submission.id} onClick={() => { setSelected(submission); setConvertOpen(false); }} className={`border p-4 text-left transition hover:border-[#77d44d]/60 ${selected?.id === submission.id ? "border-[#77d44d] bg-[#141914]" : "border-[#f0f1ea]/15 bg-[#111611]"}`}><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] text-[#aeb4aa]">{submission.id.slice(-8)}</p><p className="mt-1 font-medium text-[#f0f1ea]">{submission.accountTitle}</p></div><StatusTag value={submission.status} /></div><p className="mt-3 text-sm text-[#aeb4aa]">{submission.ovr} OVR · {submission.rank ?? "Rank not supplied"} · USD {submission.priceExpectation}</p><p className="mt-2 text-xs text-[#aeb4aa]">Seller: {submission.sellerName}</p></button>)}</div>}
  </>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div><dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#aeb4aa]">{label}</dt><dd className="mt-1 text-sm text-[#f0f1ea]">{value}</dd></div>; }

type ProofRecord = { id: string; accountId: string | null; ovr: number | null; imageUrl: string; imageAlt: string; kind: "handover" | "account-record" | "confirmation"; caption: string | null; isDevelopment: boolean; isPublished: boolean; lifecycle: "draft" | "published" | "archived" };

function AdminProofs() {
  const utils = trpc.useUtils();
  const proofs = trpc.admin.proofs.list.useQuery();
  const accounts = trpc.admin.accounts.list.useQuery();
  const create = trpc.admin.proofs.create.useMutation({ onSuccess: () => { utils.admin.proofs.list.invalidate(); setFormOpen(false); } });
  const publish = trpc.admin.proofs.publish.useMutation({ onSuccess: () => utils.admin.proofs.list.invalidate() });
  const archive = trpc.admin.proofs.archive.useMutation({ onSuccess: () => utils.admin.proofs.list.invalidate() });
  const [formOpen, setFormOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [kind, setKind] = useState<ProofRecord["kind"]>("handover");
  const [caption, setCaption] = useState("");
  const [accountId, setAccountId] = useState("");
  const [ovr, setOvr] = useState("");
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => { event.preventDefault(); if (!file) { setError("Choose a redacted image before creating a proof record."); return; } setError(""); try { const image = await imageFileToUpload(file, "Redacted Elite Traders sale proof"); await create.mutateAsync({ accountId: accountId || null, ovr: ovr ? Number(ovr) : null, image, kind, caption: caption || null, isDevelopment }); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to create proof record."); } };

  return <>
    <PageHeading eyebrow="Elite Traders / Evidence" title="Proof control" note="Create proof records privately, redact identifying information before upload, and publish only authentic non-development evidence." action={<ActionButton onClick={() => setFormOpen(value => !value)}><Plus className="h-3 w-3" />New proof</ActionButton>} />
    {formOpen && <form onSubmit={submit} className="mb-6 grid gap-4 border border-[#77d44d]/40 bg-[#111611] p-5 md:grid-cols-2"><Field label="Redacted image" required><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files?.[0] ?? null)} /></Field><Field label="Evidence type"><select value={kind} onChange={e => setKind(e.target.value as ProofRecord["kind"])}><option value="handover">Handover</option><option value="account-record">Account record</option><option value="confirmation">Confirmation</option></select></Field><Field label="Linked account"><select value={accountId} onChange={e => setAccountId(e.target.value)}><option value="">No linked account</option>{(accounts.data as AccountRecord[] | undefined)?.map(account => <option value={account.id} key={account.id}>{account.title}</option>)}</select></Field><Field label="OVR"><input inputMode="numeric" value={ovr} onChange={e => setOvr(e.target.value)} /></Field><Field label="Caption" className="md:col-span-2"><textarea rows={3} value={caption} onChange={e => setCaption(e.target.value)} placeholder="No customer names, payment references, device IDs, or contact details." /></Field><label className="flex items-start gap-3 border border-[#f97969]/35 bg-[#f97969]/5 p-3 text-sm leading-5 text-[#ffd6d0] md:col-span-2"><input type="checkbox" checked={isDevelopment} onChange={e => setIsDevelopment(e.target.checked)} className="mt-1 accent-[#f97969]" /><span><b>Development specimen.</b> Leave this on for any internal test image. Development specimens are forced to draft and cannot be published.</span></label>{error && <p className="border border-[#f97969]/40 p-3 text-sm text-[#ffd6d0] md:col-span-2">{error}</p>}<div className="flex gap-2 md:col-span-2"><ActionButton type="submit" disabled={create.isPending}>{create.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}Create private proof</ActionButton><ActionButton tone="quiet" onClick={() => setFormOpen(false)}>Cancel</ActionButton></div></form>}
    <div className="mb-5 flex gap-3 border border-[#f97969]/35 bg-[#f97969]/5 p-4 text-sm leading-6 text-[#ffd6d0]"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><p><b>Privacy checkpoint:</b> redact names, order numbers, payment data, contact details, player IDs, and device identifiers before evidence enters storage. Publishing authentic evidence is a deliberate second step.</p></div>
    {proofs.isLoading ? <div className="h-52 animate-pulse border border-[#f0f1ea]/10 bg-[#f0f1ea]/5" /> : proofs.error ? <EmptyState icon={CircleOff} title="Proof records are unavailable" note="The private evidence archive did not return from the database." /> : proofs.data?.length === 0 ? <EmptyState icon={FileCheck2} title="No proof records" note="Authentic redacted evidence can be uploaded privately, then published after review." /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{(proofs.data as ProofRecord[]).map(proof => <article key={proof.id} className="overflow-hidden border border-[#f0f1ea]/15 bg-[#111611]"><img src={proof.imageUrl} alt={proof.imageAlt} className="aspect-[4/3] w-full object-cover" /><div className="p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#aeb4aa]">{proof.kind}</p><div className="flex gap-1"><StatusTag value={proof.lifecycle} />{proof.isDevelopment && <StatusTag value="development" />}</div></div><p className="mt-3 min-h-10 text-sm leading-5 text-[#d5d8d0]">{proof.caption || "No public caption set."}</p><div className="mt-4 flex flex-wrap gap-2">{proof.lifecycle === "draft" && !proof.isDevelopment && <ActionButton onClick={() => publish.mutate({ id: proof.id })}><Send className="h-3 w-3" />Publish</ActionButton>}{proof.lifecycle !== "archived" && <ActionButton tone="danger" onClick={() => { if (window.confirm("Archive this proof? It will immediately be removed from the public evidence archive.")) archive.mutate({ id: proof.id }); }}><Archive className="h-3 w-3" />Archive</ActionButton>}</div></div></article>)}</div>}
  </>;
}

function AdminSettings() {
  const settings = trpc.admin.settings.get.useQuery();
  const utils = trpc.useUtils();
  const update = trpc.admin.settings.update.useMutation({ onSuccess: () => { utils.admin.settings.get.invalidate(); utils.settings.getPublic.invalidate(); } });
  const [form, setForm] = useState({ storeName: "Elite Traders", whatsappNumber: "", whatsappCommunityUrl: "", defaultCurrency: "USD" });
  useEffect(() => { if (settings.data) setForm({ storeName: settings.data.storeName, whatsappNumber: settings.data.whatsappNumber ?? "", whatsappCommunityUrl: settings.data.whatsappCommunityUrl ?? "", defaultCurrency: settings.data.defaultCurrency }); }, [settings.data]);
  const submit = (event: FormEvent) => { event.preventDefault(); update.mutate({ ...form, whatsappNumber: form.whatsappNumber || null, whatsappCommunityUrl: form.whatsappCommunityUrl || null }); };
  return <><PageHeading eyebrow="Elite Traders / Public configuration" title="Store settings" note="Only intentionally public contact values live here. Changes propagate through the shared public settings query without code changes." />{settings.isLoading ? <div className="h-52 animate-pulse border border-[#f0f1ea]/10 bg-[#f0f1ea]/5" /> : <form onSubmit={submit} className="max-w-2xl space-y-4 border border-[#f0f1ea]/15 bg-[#111611] p-5"><Field label="Store name" required><input value={form.storeName} onChange={e => setForm(value => ({ ...value, storeName: e.target.value }))} /></Field><Field label="WhatsApp contact number"><input value={form.whatsappNumber} onChange={e => setForm(value => ({ ...value, whatsappNumber: e.target.value }))} placeholder="Country code and number, digits only preferred" /></Field><Field label="WhatsApp community URL"><input type="url" value={form.whatsappCommunityUrl} onChange={e => setForm(value => ({ ...value, whatsappCommunityUrl: e.target.value }))} placeholder="https://chat.whatsapp.com/..." /></Field><Field label="Default currency" required><input value={form.defaultCurrency} onChange={e => setForm(value => ({ ...value, defaultCurrency: e.target.value.toUpperCase() }))} /></Field><p className="border-l-2 border-[#77d44d] pl-3 text-sm leading-6 text-[#aeb4aa]">Contact numbers are used only to construct customer-initiated WhatsApp links. No payment data, account credentials, or private operational settings belong here.</p><ActionButton type="submit" disabled={update.isPending}>{update.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}Save public settings</ActionButton></form>}</>;
}

function AdminWorkspace() {
  const [location] = useLocation();
  if (location === "/admin/accounts") return <AdminAccounts />;
  if (location === "/admin/submissions") return <AdminSubmissions />;
  if (location === "/admin/proofs") return <AdminProofs />;
  if (location === "/admin/settings") return <AdminSettings />;
  return <AdminDashboard />;
}

export default function Admin() {
  usePageMeta({ title: "Private operations — Elite Traders", description: "Private Elite Traders operations workspace.", path: "/admin", noIndex: true });
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-[#f4f9f2] text-[#17301d]"><Loader2 className="h-5 w-5 animate-spin text-[#4fba32]" /></div>;
  if (!user) return <div className="grid min-h-screen place-items-center bg-[#f4f9f2] p-6 text-center text-[#17301d]"><div className="max-w-md border border-[#17301d]/15 bg-white p-7 shadow-[0_1rem_2rem_rgba(25,55,31,0.06)]"><ShieldCheck className="mx-auto h-6 w-6 text-[#4fba32]" /><h1 className="mt-4 text-2xl font-semibold">Private Elite Traders operations</h1><p className="mt-3 text-sm leading-6 text-[#607161]">Sign in to check whether your authenticated account has operations access.</p><div className="mt-6"><ActionButton onClick={() => startLogin()}>Sign in</ActionButton></div></div></div>;
  if (user.role !== "admin") return <div className="grid min-h-screen place-items-center bg-[#f4f9f2] p-6 text-center text-[#17301d]"><div className="max-w-md border border-[#b65b2f]/35 bg-white p-7 shadow-[0_1rem_2rem_rgba(25,55,31,0.06)]"><CircleOff className="mx-auto h-6 w-6 text-[#b65b2f]" /><h1 className="mt-4 text-2xl font-semibold">Operations access restricted</h1><p className="mt-3 text-sm leading-6 text-[#607161]">This authenticated account does not have the administrative role required for private Elite Traders operations.</p><Link href="/" className="mt-6 inline-flex min-h-10 items-center gap-2 border border-[#17301d]/20 bg-white px-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#17301d] hover:border-[#4fba32] hover:text-[#419b2b]"><ChevronLeft className="h-3 w-3" />Return to Elite Traders</Link></div></div>;
  return <DashboardLayout><div className="admin-light"><AdminWorkspace /></div></DashboardLayout>;
}
