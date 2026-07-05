import { Menu, Wallet } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/format";

export default function Navbar({ onMenuClick }) {
  const { stats } = useApp();

  return (
    <header className="glass sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border/70 px-4 py-3.5 lg:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-muted hover:bg-white/5 hover:text-ink lg:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <h1 className="font-display text-base font-semibold text-ink sm:text-lg">Overview</h1>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
        <Wallet size={15} className="text-gold" />
        <span className="hidden text-xs text-muted sm:inline">Balance</span>
        <span className={`font-mono-num text-sm font-semibold ${stats.balance >= 0 ? "text-ink" : "text-coral"}`}>
          {formatCurrency(stats.balance)}
        </span>
      </div>
    </header>
  );
}
