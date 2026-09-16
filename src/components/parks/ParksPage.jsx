import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PARKS, PARK_REGIONS, COCO_ISLAND } from "../../data/parks.js";
import ParksMap from "./ParksMap.jsx";
import ParkModal from "./ParkModal.jsx";

function SectionLabel({ children, color }) {
  return (
    <div className="flex items-center gap-1.5 mb-2.5">
      <div className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: color }} />
      <div className="text-[11px] tracking-[2px] text-white/40 font-semibold">{children}</div>
    </div>
  );
}

export default function ParksPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="pb-[90px]">
      <div className="px-5 pt-[22px] pb-3">
        <div className="text-[10px] tracking-[2.5px] text-white/40 mb-1.5">Système national des aires protégées</div>
        <div className="text-[24px] font-extrabold text-white font-display">🏞️ Parcs du Costa Rica</div>
        <div className="text-[12px] text-white/35 mt-1">{PARKS.length} parcs & réserves · Carte OpenStreetMap</div>
      </div>

      <div className="px-4">
        <div
          className="relative rounded-[22px] overflow-hidden"
          style={{ boxShadow: "0 24px 64px rgba(0,0,0,.5)" }}
        >
          <div className="relative w-full" style={{ aspectRatio: "0.95" }}>
            <ParksMap selectedId={selected?.id} onSelect={setSelected} />
          </div>
          <div className="flex gap-3 px-4 py-3 bg-[#0A2E3D] border-t border-white/10">
            {Object.entries(PARK_REGIONS).map(([k, r]) => (
              <div key={k} className="flex items-center gap-[5px] text-[10px] text-white/45">
                <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                {r.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        <SectionLabel color="#8FE0B8">TOUS LES PARCS</SectionLabel>
        <div className="flex flex-col gap-2">
          {PARKS.map((p, i) => {
            const r = PARK_REGIONS[p.region];
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <button
                  onClick={() => setSelected(p)}
                  className="tap w-full text-left rounded-2xl px-4 py-3 bg-white/[0.05] border border-white/10 flex items-center gap-3"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[16px] shrink-0"
                    style={{ background: `${r.color}2A` }}
                  >
                    {p.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-bold text-white truncate">{p.name}</div>
                    <div className="text-[11px] text-white/40 mt-0.5">
                      {p.type} · {p.province}
                    </div>
                  </div>
                  {p.onProgram && (
                    <div className="shrink-0 text-[9.5px] font-bold px-2 py-1 rounded-lg text-white" style={{ background: r.color }}>
                      🗓️
                    </div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="px-5 mt-5">
        <SectionLabel color="#8FE0B8">HORS CARTE</SectionLabel>
        <div className="rounded-2xl px-4 py-4 bg-white/[0.05] border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-[22px]">{COCO_ISLAND.emoji}</div>
            <div>
              <div className="text-[14px] font-bold text-white">{COCO_ISLAND.name}</div>
              <div className="text-[11px] text-white/40">{COCO_ISLAND.province}</div>
            </div>
          </div>
          <div className="text-[12.5px] text-white/70 leading-relaxed mb-2">{COCO_ISLAND.desc}</div>
          <div className="text-[11.5px] text-white/40 italic">{COCO_ISLAND.tip}</div>
        </div>
      </div>

      <AnimatePresence>{selected && <ParkModal park={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </div>
  );
}
