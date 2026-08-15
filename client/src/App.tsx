// Elite Traders design: bright, spacious account archive with restrained green emphasis.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { PublicMobileNav } from "./components/PublicMobileNav";
import { ThinkingNineLoader } from "./components/ThinkingNineLoader";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const Accounts = lazy(() => import("./pages/Accounts"));
const AccountRoute = lazy(() => import("./pages/AccountRoute"));
const Admin = lazy(() => import("./pages/Admin"));
const Proofs = lazy(() => import("./pages/Proofs"));
const Sell = lazy(() => import("./pages/Sell"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ArchiveRouteLoading() {
  const [location] = useLocation();
  const destination = location.startsWith("/accounts") ? "BUY" : location === "/sell" ? "SELL" : location === "/proofs" ? "PROOFS" : "LOADING";
  return <ThinkingNineLoader destination={destination} />;
}
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <>
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
      <PublicMobileNav />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster theme="light" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
