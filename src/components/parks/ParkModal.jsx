import { motion } from "framer-motion";
import { PARK_REGIONS } from "../../data/parks.js";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 20 } },
};

function SectionLabel({ children, color }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <div className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: color }} />
      <div className="text-[10px] tracking-[2px] text-white/40 font-semibold">{children}</div>
    </div>
  );
}

export default function ParkModal({ park, onClose }) {
  const r = PARK_REGIONS[park.region];
  return (
    <>
      <motion.div
        className="fixed inset-0 z-[200] bg-black/75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-0 bottom-0 top-6 z-[201] mx-auto w-full max-w-[480px] bg-[#07160C] rounded-t-[28px] overflow-hidden flex flex-col"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: "touch" }}>
          <div
            className="relative px-[22px] pt-14 pb-7 text-white overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${r.color}, ${r.dark} 78%)` }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(120% 90% at 100% 0%, rgba(255,255,255,.16), transparent 55%)" }}
            />
            <button
              onClick={onClose}
              className="tap absolute top-4 left-4 w-9 h-9 rounded-full bg-black/25 backdrop-blur text-white flex items-center justify-center text-[15px]"
            >
              ✕
            </button>
            {park.onProgram && (
              <div className="absolute top-4 right-4 rounded-lg px-3 py-1.5 text-[11px] text-white font-extrabold bg-black/25 backdrop-blur">
                🗓️ {park.onProgram}
              </div>
            )}
            <div className="relative text-[44px] leading-none mb-2">{park.emoji}</div>
            <div className="relative text-[28px] font-extrabold leading-[1.05] font-display">{park.name}</div>
            <div className="relative text-[12px] opacity-80 mt-1.5">
              {park.type} · {park.province}
            </div>
          </div>
          <div className="px-5 pt-4 pb-8">
            <div className="flex gap-2 flex-wrap mb-5">
              <div className="rounded-full px-3.5 py-1.5 text-[12px] text-white/55 bg-white/[0.07]">📐 {park.size}</div>
              <div className="rounded-full px-3.5 py-1.5 text-[12px] text-white/55 bg-white/[0.07]">📅 Créé en {park.founded}</div>
            </div>
            <div className="rounded-2xl px-4 py-4 mb-3.5 bg-white/[0.04] border border-white/10">
              <SectionLabel color={r.color}>DESCRIPTION</SectionLabel>
              <div className="text-[14.5px] text-white/85 leading-relaxed">{park.desc}</div>
            </div>
            <div className="rounded-2xl px-4 py-4 mb-3.5" style={{ background: `${r.color}18`, border: `1px solid ${r.color}35` }}>
              <SectionLabel color={r.color}>À NE PAS MANQUER</SectionLabel>
              {park.highlights.map((h, i) => (
                <div key={i} className="flex gap-2 items-start mb-1.5 last:mb-0">
                  <div className="text-[12px] mt-0.5" style={{ color: r.color }}>●</div>
                  <div className="text-[13.5px] text-white/85 leading-relaxed">{h}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl px-3.5 py-3 bg-white/[0.06]" style={{ borderLeft: "3px solid #D4A017" }}>
              <div className="text-[9px] text-[#D4A017] tracking-[1.5px] mb-1 font-semibold">💡 INFO PRATIQUE</div>
              <div className="text-[13px] text-white/75 leading-relaxed">{park.tip}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
