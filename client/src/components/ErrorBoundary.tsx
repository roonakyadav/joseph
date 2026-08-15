import { RotateCcw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <main className="min-h-screen bg-[#f4f9f2] p-5 text-[#17301d]"><section className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-4xl flex-col border border-[#17301d]/15 bg-white p-6 shadow-[0_1rem_2.5rem_rgba(25,55,31,0.06)] sm:p-10"><header className="border-b border-[#17301d]/15 pb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#607161]"><b className="mr-2 text-[#4fba32]">E</b>Elite Traders / Recovery record</header><div className="my-auto max-w-xl py-14"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#419b2b]">Archive relay interrupted</p><h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">This record cannot be displayed right now.</h1><p className="mt-5 leading-7 text-[#607161]">No account or personal information was exposed. Reload the archive to restore the current public record.</p><button type="button" onClick={() => window.location.reload()} className="focus-ring mt-8 inline-flex items-center gap-2 border border-[#4fba32] bg-[#4fba32] px-5 py-3 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.97]"><RotateCcw size={16} />Reload archive</button></div><footer className="border-t border-[#17301d]/15 pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#607161]">Elite Traders / Safe recovery state</footer></section></main>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
