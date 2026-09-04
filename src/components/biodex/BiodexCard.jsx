import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DANGER } from "../../data/constants.js";
import SpeciesArt from "./SpeciesArt.jsx";
import DangerBar from "./DangerBar.jsx";

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function BiodexCard({ entry, category, onOpenModal }) {
  const [flipped, setFlipped] = useState(false);
  const d = DANGER[entry.danger];
  const isDeadly = entry.danger === 5;

  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="tap rounded-2xl overflow-hidden cursor-pointer relative"
      style={{ height: 208, border: `1.5px solid ${d.color}44`, perspective: 900 }}
      onClick={() => setFlipped((f) => !f)}
    >
      {isDeadly && (
        <motion.div
          className="absolute -inset-px rounded-2xl pointer-events-none z-10"
          style={{ boxShadow: `0 0 0 1.5px ${d.color}`, opacity: 0.7 }}
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <AnimatePresence initial={false} mode="wait">
        {!flipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            <SpeciesArt entry={entry} category={category} height={208} />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.02) 55%)" }}
            />
            <div
              className="absolute top-[9px] right-[9px] rounded-lg px-2 py-0.5 text-[9px] font-extrabold text-white"
              style={{ background: `${d.color}EE` }}
            >
              {entry.danger}/5
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-[11px] py-2">
              <div className="flex gap-[3px] mb-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-[7px] h-[7px] rounded-full"
                    style={{
                      background: i <= entry.danger ? d.color : "rgba(255,255,255,0.2)",
                      boxShadow: i <= entry.danger ? `0 0 4px ${d.color}` : "none",
                    }}
                  />
                ))}
              </div>
              <div className="text-[13.5px] font-extrabold text-white leading-tight">{entry.name}</div>
              <div className="text-[9.5px] text-white/40 italic font-mono-sci mt-0.5">
                {entry.latin.split(" ").slice(0, 2).join(" ")}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="absolute inset-0 px-3 py-2.5 flex flex-col"
            style={{ background: d.bg, transformStyle: "preserve-3d" }}
          >
            <div className="text-[12px] font-extrabold text-white leading-tight mb-1.5">{entry.name}</div>
            <DangerBar danger={entry.danger} size="sm" />
            <div className="text-[10.5px] text-white/75 leading-snug mt-2 flex-1 overflow-hidden">
              {entry.desc.slice(0, 92)}…
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(entry);
              }}
              className="tap mt-1.5 text-[10.5px] font-bold text-white rounded-lg py-2 text-center"
              style={{ background: d.color }}
            >
              Voir la fiche complète →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
