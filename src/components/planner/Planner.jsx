import { AnimatePresence } from "framer-motion";
import { DAYS } from "../../data/days.js";
import { ZONES } from "../../data/constants.js";
import { useLocalStorage } from "../../lib/useLocalStorage.js";
import { useDayOverrides } from "../../lib/useDayOverrides.js";
import { TOPO_PATTERN_URL } from "../../lib/zonePattern.js";
import DayTimeline from "./DayTimeline.jsx";
import DayCard from "./DayCard.jsx";

// Composition du parcours (jours par étape) affichée en frise sous le titre.
const ROUTE_BLOCKS = [
  { label: "Manzanillo", days: 2, color: ZONES.caraibe.color },
  { label: "Cahuita", days: 2, color: ZONES.caraibe.color },
  { label: "Tortuguero", days: 3, color: ZONES.caraibe.color },
  { label: "Arenal/MTV", days: 2, color: ZONES.pacific.color },
  { label: "Pacifique", days: 4, color: ZONES.pacific.color },
];

export default function Planner() {
  const [activeDay, setActiveDay] = useLocalStorage("cr_active_day", 1);
  const { setOverride, resetOverride, applyOverride } = useDayOverrides();

  const day = DAYS.find((d) => d.id === activeDay) || DAYS[0];
  const edited = applyOverride(day);
  const grandTotal = DAYS.reduce((s, d) => s + Object.values(d.budget).reduce((a, b) => a + b, 0), 0);

  const goto = (id) => setActiveDay(Math.min(DAYS.length, Math.max(1, id)));

  return (
    <div>
      <div className="relative px-5 pt-[22px] pb-3 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: TOPO_PATTERN_URL, backgroundSize: "160px 90px", backgroundPosition: "top right" }} />
        <div className="relative flex justify-between items-start">
          <div>
            <div className="text-[10px] tracking-[2.5px] text-white/40 mb-1.5">Voyage en couple · 13 jours</div>
            <div className="text-[26px] font-extrabold text-white font-display" style={{ textShadow: "0 2px 18px rgba(82,183,136,.35)" }}>🌴 Costa Rica</div>
            <div className="text-[12px] text-white/45 mt-1">1 — 13 Octobre 2026</div>
          </div>
          <div className="rounded-2xl px-3.5 py-2.5 text-right" style={{ background: "linear-gradient(160deg, rgba(82,183,136,.18), rgba(82,183,136,.05))", border: "1px solid rgba(82,183,136,.3)" }}>
            <div className="tabular-nums font-extrabold text-[15px] text-[#8FE0B8]">~{grandTotal}$</div>
            <div className="text-[9px] text-white/45 mt-0.5">/ pers. · hors vols int'l</div>
          </div>
        </div>

        <div className="relative mt-4">
          <div className="flex gap-[3px] h-[7px]">
            {ROUTE_BLOCKS.map((b, i) => (
              <div key={i} className="rounded-full" style={{ flex: b.days, background: b.color, opacity: 0.85 }} />
            ))}
          </div>
          <div className="flex gap-[3px] mt-1.5">
            {ROUTE_BLOCKS.map((b, i) => (
              <div key={i} className="text-[8.5px] font-semibold truncate" style={{ flex: b.days, color: b.color }}>{b.label}</div>
            ))}
          </div>
        </div>

        <div
          className="relative mt-3.5 px-3 py-2.5 rounded-xl text-[11px] text-white/75 leading-relaxed"
          style={{ background: "rgba(0,157,196,0.12)", borderLeft: "3px solid #009DC4" }}
        >
          🌤️ <strong>Météo oct. :</strong> Caraïbes d'abord (veranillo) → volcans et Pacifique ensuite.
        </div>
      </div>

      <DayTimeline activeDay={activeDay} onSelect={goto} />

      <div className="px-4 pb-[90px]">
        <AnimatePresence mode="wait" initial={false}>
          <DayCard
            key={day.id}
            day={day}
            edited={edited}
            onEdit={(patch) => setOverride(day.id, patch)}
            onReset={() => resetOverride(day.id)}
          />
        </AnimatePresence>

        <div className="flex gap-2.5 mt-3.5">
          <button
            onClick={() => goto(activeDay - 1)}
            disabled={activeDay === 1}
            className="tap flex-1 py-3.5 rounded-2xl font-semibold text-[14px] border-none"
            style={{
              background: activeDay === 1 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)",
              color: activeDay === 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.75)",
              cursor: activeDay === 1 ? "default" : "pointer",
            }}
          >
            ← Jour {activeDay > 1 ? activeDay - 1 : ""}
          </button>
          <button
            onClick={() => goto(activeDay + 1)}
            disabled={activeDay === DAYS.length}
            className="tap flex-1 py-3.5 rounded-2xl font-bold text-[14px] border-none text-white"
            style={{
              background: activeDay === DAYS.length ? "rgba(255,255,255,0.04)" : "#2E7D4F",
              color: activeDay === DAYS.length ? "rgba(255,255,255,0.15)" : "white",
              cursor: activeDay === DAYS.length ? "default" : "pointer",
            }}
          >
            Jour {activeDay < DAYS.length ? activeDay + 1 : ""} →
          </button>
        </div>
      </div>
    </div>
  );
}
