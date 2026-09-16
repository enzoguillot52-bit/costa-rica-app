import { motion } from "framer-motion";

const TABS = [
  { id: "voyage", emoji: "🗺️", label: "Voyage" },
  { id: "parcs", emoji: "🏞️", label: "Parcs" },
  { id: "biodex", emoji: "🔍", label: "Biodex" },
  { id: "contacts", emoji: "📞", label: "Contacts" },
];

export default function BottomNav({ tab, onChange }) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[100] flex bg-[#08180E]/95 backdrop-blur-xl border-t border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {TABS.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="tap flex-1 min-h-[56px] flex flex-col items-center justify-center gap-1 py-2 bg-transparent border-none cursor-pointer relative"
          >
            {active && (
              <motion.div
                layoutId="navHighlight"
                className="absolute inset-x-2 inset-y-1 rounded-2xl bg-white/5"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            <span
              className="relative text-[22px] leading-none transition-transform duration-200"
              style={{
                filter: active ? "drop-shadow(0 0 8px #52B78888)" : "none",
                transform: active ? "translateY(-1px) scale(1.05)" : "none",
              }}
            >
              {t.emoji}
            </span>
            <span
              className={`relative text-[10px] ${active ? "font-bold text-[#52B788]" : "font-medium text-white/35"}`}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
