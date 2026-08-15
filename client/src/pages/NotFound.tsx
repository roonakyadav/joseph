import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { usePageMeta } from "@/lib/seo";

export default function NotFound() {
  usePageMeta({ title: "Archive record unavailable — APEX", description: "The requested APEX archive record is unavailable.", path: window.location.pathname, noIndex: true });
  return (
    <main className="min-h-screen bg-[#0e120f] px-5 py-8 text-[#f0f1ea] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col border border-[#f0f1ea]/15 bg-[#111611] p-6 sm:p-10">
        <header className="flex items-center justify-between border-b border-[#f0f1ea]/15 pb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#aeb4aa]">
          <Link href="/" className="focus-ring flex items-center gap-2 text-[#f0f1ea]" aria-label="APEX home"><span className="font-bold text-[#77d44d]">A</span> APEX</Link>
          <span>Archive exception / 404</span>
        </header>
        <section className="my-auto max-w-2xl py-16" aria-labelledby="missing-record-title">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#77d44d]">Record status / unavailable</p>
          <h1 id="missing-record-title" className="mt-4 text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">This archive<br /><em className="font-normal text-[#aeb4aa]">entry is not indexed.</em></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#c5c9c0]">The requested address does not correspond to a current APEX public record. It may have moved, been archived, or never been published.</p>
          <Link href="/accounts" className="focus-ring mt-9 inline-flex items-center gap-2 border border-[#77d44d] bg-[#77d44d] px-5 py-3 text-sm font-semibold text-[#0e120f] transition-transform duration-150 active:scale-[0.97]">Return to account index <ArrowUpRight size={16} /></Link>
        </section>
        <footer className="border-t border-[#f0f1ea]/15 pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#aeb4aa]">APEX / Public archive · Use the published index to continue.</footer>
      </div>
    </main>
  );
}
