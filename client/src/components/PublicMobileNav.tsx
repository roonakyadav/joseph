import { Archive, House, PlusSquare, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";
import "./PublicMobileNav.css";

const navigationItems = [
  { href: "/", label: "Home", icon: House, matches: (path: string) => path === "/" },
  { href: "/accounts", label: "Buy", icon: ShoppingBag, matches: (path: string) => path === "/accounts" || path.startsWith("/accounts/") },
  { href: "/sell", label: "Sell", icon: PlusSquare, matches: (path: string) => path === "/sell" },
  { href: "/proofs", label: "Proofs", icon: Archive, matches: (path: string) => path === "/proofs" },
];

export function PublicMobileNav() {
  const [location] = useLocation();

  if (location.startsWith("/admin")) return null;

  return (
    <nav className="public-mobile-nav" aria-label="Primary navigation">
      {navigationItems.map(({ href, label, icon: Icon, matches }) => {
        const isActive = matches(location);
        return (
          <Link key={href} href={href} className={`public-mobile-nav-item focus-ring${isActive ? " is-active" : ""}`} aria-current={isActive ? "page" : undefined}>
            <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
