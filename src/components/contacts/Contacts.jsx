import { motion } from "framer-motion";
import { GUIDES, LODGING } from "../../data/contacts.js";

const containerVariants = { show: { transition: { staggerChildren: 0.05 } } };
const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function ContactRow({ c }) {
  const digits = c.phone ? c.phone.replace(/[^\d+]/g, "") : null;
  return (
    <motion.div variants={rowVariants} className="rounded-2xl bg-white/[0.05] border border-white/10 px-4 py-3.5 mb-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[14px] font-bold text-white truncate">{c.name}</div>
          {c.org && <div className="text-[11.5px] text-white/50 mt-0.5">{c.org}</div>}
          <div className="text-[10.5px] text-[#52B788] mt-1 font-semibold">📍 {c.zone}</div>
        </div>
      </div>
      {digits ? (
        <div className="flex gap-2 mt-3">
          <a
            href={`tel:${digits}`}
            className="tap flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#2E7D4F] text-white text-[12.5px] font-bold min-h-[44px]"
          >
            📞 Appeler
          </a>
          <a
            href={`https://wa.me/${digits.replace("+", "")}`}
            target="_blank"
            rel="noreferrer"
            className="tap flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366] text-white text-[12.5px] font-bold min-h-[44px]"
          >
            💬 WhatsApp
          </a>
        </div>
      ) : (
        <div className="mt-3 text-[11.5px] text-white/40 italic px-1">{c.note || "Contact sur place"}</div>
      )}
    </motion.div>
  );
}

export default function Contacts() {
  return (
    <div className="pb-[90px]">
      <div className="px-5 pt-[22px] pb-3">
        <div className="text-[10px] tracking-[2.5px] text-white/40 mb-1.5">Carnet d'adresses</div>
        <div className="text-[24px] font-extrabold text-white font-display">📞 Contacts</div>
        <div className="text-[12px] text-white/35 mt-1">Guides et hébergements du voyage</div>
      </div>

      <div className="px-5 mb-2">
        <div className="text-[11px] tracking-[2px] text-white/40 font-semibold mb-2.5">👤 GUIDES</div>
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          {GUIDES.map((g) => (
            <ContactRow key={g.name} c={g} />
          ))}
        </motion.div>
      </div>

      <div className="px-5 mt-4">
        <div className="text-[11px] tracking-[2px] text-white/40 font-semibold mb-2.5">🏡 HÉBERGEMENTS</div>
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          {LODGING.map((l) => (
            <ContactRow key={l.name} c={l} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
