import { Link, useLocation } from "wouter";
import gnoLogo from "../../assets/gno-logo.png";
import { supabase } from "../../lib/supabase";

const NAV_LINKS = [
  { href: "/badge-hunter", label: "Badge Hunter" },
  { href: "/bidding-optimization", label: "Bidding Optimization" },
] as const;

interface Props {
  toolName: string;
}

export function Navbar({ toolName }: Props) {
  const [location] = useLocation();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-3">
        <img src={gnoLogo} alt="GNO Partners" className="size-8 object-contain" />
        <div>
          <p className="text-sm font-bold leading-none text-gray-900">GNO Partners</p>
          <p className="text-xs font-medium uppercase tracking-widest text-gold-500">
            {toolName}
          </p>
        </div>
        <nav className="ml-auto flex items-center gap-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs font-medium ${
                location === href
                  ? "text-gold-600"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs text-gray-400 hover:text-gray-700"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
