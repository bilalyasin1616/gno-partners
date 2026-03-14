import gnoLogo from "../../assets/gno-logo.png";
import { supabase } from "../../lib/supabase";

interface Props {
  toolName: string;
}

export function Navbar({ toolName }: Props) {
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
        <button
          onClick={() => supabase.auth.signOut()}
          className="ml-auto text-xs text-gray-400 hover:text-gray-700"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
