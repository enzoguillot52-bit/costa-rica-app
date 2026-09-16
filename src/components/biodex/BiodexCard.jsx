import { motion } from "framer-motion";
import { DANGER } from "../../data/constants.js";
import SpeciesArt from "./SpeciesArt.jsx";

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function BiodexCard({ entry, category, onOpenModal }) {
  const d = DANGER[entry.danger];
  const isDeadly = entry.danger === 5;

  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="tap rounded-2xl overflow-hidden cursor-pointer relative"
      style={{ height: 208, border: `1.5px solid ${d.color}44` }}
      onClick={() => onOpenModal(entry)}
    >
      {isDeadly && (
        <motion.div
          className="absolute -inset-px rounded-2xl pointer-events-none z-10"
          style={{ boxShadow: `0 0 0 1.5px ${d.color}`, opacity: 0.7 }}
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
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
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[13.5px] font-extrabold text-white leading-tight truncate">{entry.name}</div>
            <div className="text-[9.5px] text-white/40 italic font-mono-sci mt-0.5">
              {entry.latin.split(" ").slice(0, 2).join(" ")}
            </div>
          </div>
          <div className="tap shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[12px] text-white/70 bg-white/10">🔍</div>
        </div>
      </div>
    </motion.div>
  );
}
