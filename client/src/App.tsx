// APEX DESIGN: Account Archive — keep the application shell dark, quiet, and product-document focused.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const Accounts = lazy(() => import("./pages/Accounts"));
const AccountRoute = lazy(() => import("./pages/AccountRoute"));
const Admin = lazy(() => import("./pages/Admin"));
const Proofs = lazy(() => import("./pages/Proofs"));
const Sell = lazy(() => import("./pages/Sell"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ArchiveRouteLoading() {
  return <main className="min-h-screen bg-[#0e120f] p-5 text-[#f0f1ea]"><div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-5xl flex-col border border-[#f0f1ea]/15 bg-[#111611] p-6 sm:p-10"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#77d44d]">APEX / Archive relay</p><div className="my-auto"><h1 className="text-3xl font-semibold tracking-[-0.04em]">Opening record index.</h1><p className="mt-3 text-sm text-[#aeb4aa]">Loading the requested archive surface.</p></div></div></main>;
}
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<ArchiveRouteLoading />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/accounts" component={Accounts} />
        <Route path="/accounts/:slug" component={AccountRoute} />
        <Route path="/proofs" component={Proofs} />
        <Route path="/sell" component={Sell} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/:section" component={Admin} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster theme="dark" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
