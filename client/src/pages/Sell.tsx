// APEX DESIGN: Seller Intake — a short account-preparation dossier with a truthful review handoff, not an automated self-publishing form.
import { AlertCircle, ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, Check, ChevronRight, ImagePlus, Loader2, Minus, Plus, Trash2, Upload, X } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ApexCatalogHeader } from "@/components/ApexCatalogHeader";
import { emptySellerSubmissionDraft, handoffSellerSubmission, type SellerSubmissionDraft, type SellerContactMethod } from "@/data/sellerSubmission";
import "./Sell.css";

type FieldName = keyof SellerSubmissionDraft;
type PreviewFile = { id: string; file: File; url: string };
type ValidationErrors = Partial<Record<FieldName | "images", string>>;

const requiredFields: FieldName[] = ["sellerName", "sellerContact", "accountTitle", "ovr"];
const numericFields: FieldName[] = ["ovr", "priceExpectation", "coins", "gems", "fcPoints"];

function validateDraft(draft: SellerSubmissionDraft, imageCount: number): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!draft.sellerName.trim()) errors.sellerName = "Add the name you want APEX to use.";
  if (!draft.sellerContact.trim()) errors.sellerContact = "Add a contact detail for review follow-up.";
  if (!draft.accountTitle.trim()) errors.accountTitle = "Give this account a short working title.";
  if (!draft.ovr.trim() || !Number.isFinite(Number(draft.ovr)) || Number(draft.ovr) <= 0) errors.ovr = "Use a valid positive OVR value.";
  if (draft.priceExpectation && (!Number.isFinite(Number(draft.priceExpectation)) || Number(draft.priceExpectation) <= 0)) errors.priceExpectation = "Use a positive price expectation or leave it empty.";
  for (const field of ["coins", "gems", "fcPoints"] as FieldName[]) if (draft[field] && (!Number.isFinite(Number(draft[field])) || Number(draft[field]) < 0)) errors[field] = "Use zero or a positive number.";
  if (imageCount === 0) errors.images = "Add at least one clear account screenshot for review.";
  return errors;
}

function FieldLabel({ children, required }: { children: string; required?: boolean }) { return <label className="sell-field-label">{children}<span>{required ? "Required" : "Optional"}</span></label>; }

export default function Sell() {
  const previewMode = new URLSearchParams(window.location.search).get("preview");
  const [draft, setDraft] = useState<SellerSubmissionDraft>(emptySellerSubmissionDraft);
  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "not-configured" | "failed" | "accepted">("idle");
  const [reference, setReference] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDirty = useMemo(() => Object.values(draft).some((value) => value.trim()) || previews.length > 0, [draft, previews.length]);

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews]);
  useEffect(() => {
    if (previewMode === "validation") {
      const previewErrors = validateDraft(emptySellerSubmissionDraft, 0);
      setTouched({ sellerName: true, sellerContact: true, accountTitle: true, ovr: true });
      setErrors(previewErrors);
    }
    if (previewMode === "service") setSubmitState("not-configured");
  }, [previewMode]);
  useEffect(() => {
    const warnBeforeLeave = (event: BeforeUnloadEvent) => { if (!isDirty || submitState === "accepted") return; event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warnBeforeLeave);
    return () => window.removeEventListener("beforeunload", warnBeforeLeave);
  }, [isDirty, submitState]);

  const setField = (field: FieldName, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    if (touched[field]) { const next = validateDraft({ ...draft, [field]: value }, previews.length); setErrors(next); }
  };
  const touchField = (field: FieldName) => { setTouched((current) => ({ ...current, [field]: true })); setErrors(validateDraft(draft, previews.length)); };
  const addImages = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    const images = selected.filter((file) => file.type.startsWith("image/"));
    if (images.length !== selected.length) setErrors((current) => ({ ...current, images: "Choose image files only." }));
    const remaining = Math.max(0, 6 - previews.length);
    const additions = images.slice(0, remaining).map((file) => ({ id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, file, url: URL.createObjectURL(file) }));
    if (images.length > remaining) setErrors((current) => ({ ...current, images: "This intake accepts up to six screenshot files at a time." }));
    setPreviews((current) => [...current, ...additions]);
    event.target.value = "";
  };
  const removeImage = (id: string) => setPreviews((current) => { const removed = current.find((preview) => preview.id === id); if (removed) URL.revokeObjectURL(removed.url); return current.filter((preview) => preview.id !== id); });
  const moveImage = (index: number, direction: -1 | 1) => setPreviews((current) => { const target = index + direction; if (target < 0 || target >= current.length) return current; const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next; });
  const startSubmission = () => { formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); window.setTimeout(() => document.getElementById("seller-name")?.focus(), 450); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateDraft(draft, previews.length);
    setTouched(Object.fromEntries(requiredFields.map((field) => [field, true])));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(); return; }
    setSubmitState("submitting");
    const result = await handoffSellerSubmission({ ...draft, ovr: Number(draft.ovr), priceExpectation: draft.priceExpectation ? Number(draft.priceExpectation) : undefined, coins: draft.coins ? Number(draft.coins) : undefined, gems: draft.gems ? Number(draft.gems) : undefined, fcPoints: draft.fcPoints ? Number(draft.fcPoints) : undefined, imageFiles: previews.map((preview) => preview.file), createdAt: new Date().toISOString() });
    if (result.kind === "accepted") { setReference(result.reference); setSubmitState("accepted"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setSubmitState(result.kind);
  };

  if (submitState === "accepted") return <div className="sell-page"><ApexCatalogHeader active="sell" /><main className="sell-confirmation"><span className="confirmation-seal"><Check size={26} /></span><p className="eyebrow">APEX / Submission protocol</p><h1>Submission received.</h1><p>Your account information has been sent for review. APEX will use the contact method you provided if a next step is available.</p>{reference && <span className="confirmation-reference">Reference / {reference}</span>}<div><Link className="sell-primary focus-ring" href="/accounts">Browse accounts <ArrowUpRight size={16} /></Link><Link className="sell-secondary focus-ring" href="/">Return home</Link></div></main></div>;

  return <div className="sell-page"><div className="sell-grid" aria-hidden="true" /><ApexCatalogHeader active="sell" /><main className="sell-main">
    <section className="sell-intro" aria-labelledby="sell-title"><div className="sell-rail"><p className="eyebrow"><i /> APEX / Seller intake</p><span>Review protocol / 03</span></div><div className="sell-intro-copy"><h1 id="sell-title">Prepare an<br /><em>account record.</em></h1><p>Compile squad detail and account evidence for review. No record is published until APEX makes an explicit decision.</p><button type="button" className="sell-primary focus-ring" onClick={startSubmission}>Open account record <ArrowDown size={16} /></button></div><aside className="sell-intake-stamp"><span className="sell-a-seal" aria-hidden="true"><img src="/manus-storage/apex-mark_890b511d.png" alt="" /></span><p>Submission review</p><strong>Not a self-publish route</strong><small>Prepared account records are reviewed before any public decision.</small></aside></section>
    <section className="sell-process" aria-labelledby="process-title"><div className="process-heading"><span>001</span><p id="process-title">What happens next</p></div><ol>{[["01", "Share account details", "Create the core record APEX needs to review."], ["02", "Add supporting screenshots", "Include clear account and squad images."], ["03", "APEX reviews the submission", "The information is considered before any listing decision."], ["04", "Continue through direct contact", "Your chosen contact channel is used if follow-up is needed."]].map(([number, title, description]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{description}</p></div></li>)}</ol></section>
    <form ref={formRef} className="seller-form" onSubmit={submit} noValidate aria-labelledby="form-title"><div className="form-header"><div><p className="eyebrow">002 / Assemble account file</p><h2 id="form-title">Submission record</h2></div><p>Fields marked <b>Required</b> are needed for APEX to review your account record.</p></div>
      {submitState !== "idle" && <div className={`form-service-note ${submitState}`} role="status"><AlertCircle size={16} /><p>{submitState === "submitting" ? "Preparing a secure review handoff…" : submitState === "not-configured" ? "Seller submissions are not connected yet. Your details have not been sent or stored." : "The submission handoff could not be reached. Your details have not been sent."}</p></div>}
      <fieldset className="form-section"><legend><span>01</span> Contact for review</legend><div className="form-grid"><div className="sell-field"><FieldLabel required>Preferred name</FieldLabel><input id="seller-name" value={draft.sellerName} onChange={(event) => setField("sellerName", event.target.value)} onBlur={() => touchField("sellerName")} aria-invalid={Boolean(touched.sellerName && errors.sellerName)} aria-describedby={errors.sellerName ? "seller-name-error" : undefined} autoComplete="name" />{touched.sellerName && errors.sellerName && <p id="seller-name-error" className="field-error"><AlertCircle size={13} />{errors.sellerName}</p>}</div><div className="sell-field"><FieldLabel required>Preferred contact</FieldLabel><div className="contact-control"><select value={draft.contactMethod} onChange={(event) => setField("contactMethod", event.target.value as SellerContactMethod)} aria-label="Contact method"><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="other">Other</option></select><input value={draft.sellerContact} onChange={(event) => setField("sellerContact", event.target.value)} onBlur={() => touchField("sellerContact")} placeholder={draft.contactMethod === "email" ? "name@example.com" : "Your contact detail"} aria-invalid={Boolean(touched.sellerContact && errors.sellerContact)} /></div>{touched.sellerContact && errors.sellerContact && <p className="field-error"><AlertCircle size={13} />{errors.sellerContact}</p>}</div></div></fieldset>
      <fieldset className="form-section"><legend><span>02</span> Account overview</legend><div className="form-grid"><div className="sell-field full"><FieldLabel required>Account title</FieldLabel><input value={draft.accountTitle} onChange={(event) => setField("accountTitle", event.target.value)} onBlur={() => touchField("accountTitle")} placeholder="A short working title for the account" aria-invalid={Boolean(touched.accountTitle && errors.accountTitle)} />{touched.accountTitle && errors.accountTitle && <p className="field-error"><AlertCircle size={13} />{errors.accountTitle}</p>}</div><div className="sell-field"><FieldLabel required>OVR</FieldLabel><input inputMode="numeric" type="number" min="1" value={draft.ovr} onChange={(event) => setField("ovr", event.target.value)} onBlur={() => touchField("ovr")} placeholder="e.g. 118" aria-invalid={Boolean(touched.ovr && errors.ovr)} />{touched.ovr && errors.ovr && <p className="field-error"><AlertCircle size={13} />{errors.ovr}</p>}</div><div className="sell-field"><FieldLabel>Price expectation / USD</FieldLabel><input inputMode="decimal" type="number" min="0" value={draft.priceExpectation} onChange={(event) => setField("priceExpectation", event.target.value)} onBlur={() => touchField("priceExpectation")} placeholder="Optional" aria-invalid={Boolean(touched.priceExpectation && errors.priceExpectation)} />{touched.priceExpectation && errors.priceExpectation && <p className="field-error"><AlertCircle size={13} />{errors.priceExpectation}</p>}</div><div className="sell-field"><FieldLabel>Rank</FieldLabel><input value={draft.rank} onChange={(event) => setField("rank", event.target.value)} placeholder="Optional" /></div><div className="sell-field"><FieldLabel>Formation</FieldLabel><input value={draft.formation} onChange={(event) => setField("formation", event.target.value)} placeholder="Optional" /></div></div></fieldset>
      <fieldset className="form-section"><legend><span>03</span> Resources</legend><div className="form-grid resources-grid">{(["coins", "gems", "fcPoints"] as FieldName[]).map((field) => <div className="sell-field" key={field}><FieldLabel>{field === "fcPoints" ? "FC Points" : field[0].toUpperCase() + field.slice(1)}</FieldLabel><input inputMode="numeric" type="number" min="0" value={draft[field]} onChange={(event) => setField(field, event.target.value)} onBlur={() => touchField(field)} placeholder="Optional" aria-invalid={Boolean(touched[field] && errors[field])} />{touched[field] && errors[field] && <p className="field-error"><AlertCircle size={13} />{errors[field]}</p>}</div>)}</div></fieldset>
      <fieldset className="form-section"><legend><span>04</span> Squad &amp; notes</legend><div className="form-grid"><div className="sell-field full"><FieldLabel>Key players</FieldLabel><input value={draft.keyPlayers} onChange={(event) => setField("keyPlayers", event.target.value)} placeholder="Add standout players, separated by commas" /></div><div className="sell-field full"><FieldLabel>Additional details</FieldLabel><textarea rows={4} value={draft.notes} onChange={(event) => setField("notes", event.target.value)} placeholder="Anything APEX should understand during review" /></div></div></fieldset>
      <fieldset className="form-section evidence-section"><legend><span>05</span> Supporting images <small>Required</small></legend><p className="evidence-intro">Upload clear screenshots of your squad and relevant account information. Do not include passwords, recovery codes, payment details, or other authentication secrets.</p><input ref={fileInputRef} id="evidence-upload" className="visually-hidden" type="file" accept="image/*" multiple onChange={addImages} /><button type="button" className="evidence-dropzone focus-ring" onClick={() => fileInputRef.current?.click()}><ImagePlus size={22} /><strong>Add account screenshots</strong><span>{previews.length}/6 selected · Image files only</span></button>{errors.images && <p className="field-error image-error"><AlertCircle size={13} />{errors.images}</p>}{previews.length > 0 && <div className="image-preview-grid" aria-label="Selected evidence images">{previews.map((preview, index) => <article key={preview.id}><img src={preview.url} alt={`Selected screenshot ${index + 1}`} /><span>{String(index + 1).padStart(2, "0")}</span><div><button className="focus-ring" type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} aria-label={`Move screenshot ${index + 1} earlier`}><ArrowUp size={14} /></button><button className="focus-ring" type="button" onClick={() => moveImage(index, 1)} disabled={index === previews.length - 1} aria-label={`Move screenshot ${index + 1} later`}><ArrowDown size={14} /></button><button className="focus-ring remove-image" type="button" onClick={() => removeImage(preview.id)} aria-label={`Remove screenshot ${index + 1}`}><Trash2 size={14} /></button></div></article>)}</div>}</fieldset>
      <div className="form-submit"><p><i /> Submitting sends an account for APEX review. It does not create or approve a public listing.</p><button className="sell-primary focus-ring" type="submit" disabled={submitState === "submitting"}>{submitState === "submitting" ? <><Loader2 className="spin" size={16} /> Preparing handoff</> : <>Submit for review <ChevronRight size={16} /></>}</button></div>
    </form>
  </main></div>;
}
