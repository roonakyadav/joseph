import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { usePageMeta } from "@/lib/seo";

export default function NotFound() {
  usePageMeta({ title: "Archive record unavailable — Elite Traders", description: "The requested Elite Traders archive record is unavailable.", path: window.location.pathname, noIndex: true });
  return (
    <main className="min-h-screen bg-[#f4f9f2] px-5 py-8 text-[#17301d] sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col border border-[#17301d]/15 bg-white p-6 shadow-[0_1rem_2.5rem_rgba(25,55,31,0.06)] sm:p-10">
        <header className="flex items-center justify-between border-b border-[#17301d]/15 pb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#607161]">
          <Link href="/" className="focus-ring flex items-center gap-2 text-[#17301d]" aria-label="Elite Traders home"><span className="font-bold text-[#4fba32]">E</span> Elite Traders</Link>
          <span>Archive exception / 404</span>
        </header>
        <section className="my-auto max-w-2xl py-16" aria-labelledby="missing-record-title">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#419b2b]">Record status / unavailable</p>
          <h1 id="missing-record-title" className="mt-4 text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">This archive<br /><em className="font-normal text-[#607161]">entry is not indexed.</em></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#607161]">The requested address does not correspond to a current Elite Traders public record. It may have moved, been archived, or never been published.</p>
          <Link href="/accounts" className="focus-ring mt-9 inline-flex items-center gap-2 border border-[#4fba32] bg-[#4fba32] px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.97]">Return to account index <ArrowUpRight size={16} /></Link>
        </section>
        <footer className="border-t border-[#17301d]/15 pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#607161]">Elite Traders / Public archive · Use the published index to continue.</footer>
      </div>
    </main>
  );
}
