import { motion } from "framer-motion";
import { DANGER } from "../../data/constants.js";
import SpeciesArt from "./SpeciesArt.jsx";
import DangerBar from "./DangerBar.jsx";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 20 } },
};

export default function BiodexModal({ entry, category, onClose }) {
  const d = DANGER[entry.danger];
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
          <div className="relative">
            <SpeciesArt entry={entry} category={category} height={340} heroMode />
            <div
              className="absolute inset-x-0 bottom-0 h-40"
              style={{ background: "linear-gradient(to top, #07160C 15%, rgba(7,22,12,.55) 55%, transparent)" }}
            />
            <button
              onClick={onClose}
              className="tap absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center text-[15px]"
            >
              ✕
            </button>
            <div
              className="absolute top-4 right-4 rounded-lg px-3.5 py-1.5 text-[12px] text-white font-extrabold"
              style={{ background: d.color }}
            >
              {d.label}
            </div>
            <div className="absolute left-5 right-5 bottom-4">
              <div className="text-[32px] font-extrabold text-white leading-[1.05] font-display" style={{ textShadow: "0 2px 20px rgba(0,0,0,.6)" }}>{entry.name}</div>
              <div className="text-[13px] text-white/60 italic font-mono-sci mt-1">{entry.latin}</div>
            </div>
          </div>
          <div className="px-5 pt-4 pb-8">
            <div className="flex gap-2 flex-wrap mb-5">
              <div className="rounded-full px-3.5 py-1.5 text-[12px] text-white/55 bg-white/[0.07]">📍 {entry.zone}</div>
              <div className="rounded-full px-3.5 py-1.5 text-[12px] text-white/55 bg-white/[0.07]">🌿 {entry.habitat}</div>
            </div>
            <div className="rounded-2xl px-4 py-4 mb-4" style={{ background: d.bg, border: `1px solid ${d.color}30` }}>
              <div className="text-[10px] tracking-[2px] text-white/35 mb-3">DANGEROSITÉ</div>
              <DangerBar danger={entry.danger} />
            </div>
            <div className="rounded-2xl px-4 py-4 mb-3.5 bg-white/[0.04] border border-white/10">
              <div className="text-[10px] tracking-[2px] text-white/30 mb-3">DESCRIPTION</div>
              <div className="text-[14.5px] text-white/85 leading-relaxed">{entry.desc}</div>
            </div>
            <div className="rounded-2xl px-4 py-4" style={{ background: `${d.color}18`, border: `1px solid ${d.color}35` }}>
              <div className="text-[10px] tracking-[2px] mb-2.5" style={{ color: d.color }}>💡 LE SAVAIS-TU ?</div>
              <div className="text-[14.5px] text-white/85 leading-relaxed">{entry.fact}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
