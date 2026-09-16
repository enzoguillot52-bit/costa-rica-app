import { useState } from "react";
import { motion } from "framer-motion";
import { ZONES } from "../../data/constants.js";
import { zonePatternUrl, zonePatternSize } from "../../lib/zonePattern.js";
import SectionLabel from "../SectionLabel.jsx";
import BudgetDonut from "./BudgetDonut.jsx";
import DayEditForm from "./DayEditForm.jsx";

const dayVariants = {
  enter: { y: 40, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard indisponible — on ignore silencieusement
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="tap shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-bold bg-black/10 text-[#333]">
      {copied ? "✓ Copié" : "Copier"}
    </button>
  );
}

export default function DayCard({ day, edited, onEdit, onReset, direction }) {
  const [editing, setEditing] = useState(false);
  const z = ZONES[day.zone];

  return (
    <motion.div
      key={day.id}
      variants={dayVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className="rounded-[22px] overflow-hidden"
      style={{ background: "#FEFBF4", boxShadow: `0 24px 64px rgba(0,0,0,.5), 0 0 0 1px ${z.color}22` }}
    >
      <div
        className="relative px-[22px] py-5 text-white overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${z.color}, ${z.dark} 78%)` }}
      >
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 90% at 100% 0%, rgba(255,255,255,.16), transparent 55%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: zonePatternUrl(day.zone), backgroundSize: zonePatternSize(day.zone), backgroundPosition: "bottom" }} />
        <div className="absolute inset-x-0 bottom-0 h-10" style={{ background: `linear-gradient(to top, ${z.dark}55, transparent)` }} />
        <div className="relative flex justify-between items-start">
          <div className="flex-1 pr-3">
            <div className="text-[10px] opacity-75 tracking-[2px] mb-1.5">
              JOUR {day.id} · {day.date} · {edited.region}
            </div>
            <div className="text-[19px] font-extrabold leading-tight font-display">
              {day.emoji} {edited.title}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white/20 rounded-xl px-2.5 py-2 text-center">
              <div className="text-[18px] leading-none">{day.weather.icon}</div>
              <div className="text-[11px] font-bold mt-0.5">{day.weather.temp}</div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="tap w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-[13px]"
              aria-label="Modifier ce jour"
            >
              ✎
            </button>
          </div>
        </div>
        <div className="relative mt-2.5 text-[12px] italic opacity-85">{day.weather.label}</div>
        <svg className="absolute left-0 right-0 bottom-[-1px] w-full" height="14" viewBox="0 0 100 14" preserveAspectRatio="none">
          <path d="M0 14 Q 25 0 50 8 T 100 6 L100 14 Z" fill="#FEFBF4" />
        </svg>
      </div>

      <div className="px-5 pt-[20px]">
        <SectionLabel color={z.color}>PROGRAMME</SectionLabel>
        {edited.activities.map((a, i) => (
          <div key={i} className="flex gap-2.5 mb-2.5 items-start">
            <div
              className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-px"
              style={{ background: z.light, color: z.dark }}
            >
              {i + 1}
            </div>
            <div className="text-[13.5px] text-[#333] leading-relaxed">{a}</div>
          </div>
        ))}
      </div>

      {day.transport && (
        <div className="px-5 pt-4">
          <div
            className="rounded-2xl px-3.5 py-3 flex items-center gap-3"
            style={{ background: z.light }}
          >
            <div className="text-[20px]">🧭</div>
            <div className="flex-1">
              <div className="text-[9px] tracking-[1.5px] mb-0.5" style={{ color: z.dark }}>
                TRANSPORT VERS L'ÉTAPE SUIVANTE
              </div>
              <div className="text-[13px] font-bold text-[#1A1A1A]">{day.transport.type}</div>
            </div>
            {day.transport.duration && (
              <div className="text-[13px] font-extrabold shrink-0" style={{ color: z.dark }}>
                {day.transport.duration}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-5 pt-4 flex gap-2.5">
        {[
          { icon: "🏡", lbl: "LOGEMENT", name: edited.sleep.name, sub: edited.sleep.price > 0 ? `~${edited.sleep.price}$/nuit` : "Transit" },
          { icon: "🍽️", lbl: "RESTAURANT", name: edited.eat.name, sub: edited.eat.detail },
        ].map((it, i) => (
          <div key={i} className="flex-1 rounded-2xl px-3.5 py-3 bg-[#F6F6F0] relative overflow-hidden">
            <div className="absolute -right-3 -top-3 w-12 h-12 rounded-full opacity-[0.35]" style={{ background: z.light }} />
            <div className="relative w-7 h-7 rounded-full flex items-center justify-center text-[13px] mb-2" style={{ background: z.light }}>{it.icon}</div>
            <div className="relative text-[8.5px] text-[#AAA] tracking-[1.5px] mb-1">{it.lbl}</div>
            <div className="relative text-[13px] font-bold text-[#1A1A1A] leading-tight">{it.name}</div>
            <div className="relative text-[11px] text-[#777] mt-0.5 leading-snug">{it.sub}</div>
          </div>
        ))}
      </div>

      {day.guide && (
        <div className="px-5 pt-3">
          <div className="rounded-2xl px-4 py-3 flex justify-between items-center" style={{ background: z.light }}>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] tracking-[1.5px] mb-1" style={{ color: z.dark }}>
                👤 GUIDE RECOMMANDÉ
              </div>
              <div className="text-[13px] font-bold text-[#1A1A1A] truncate">{day.guide.name}</div>
              {day.guide.phone.startsWith("+") ? (
                <a href={`tel:${day.guide.phone.replace(/\s/g, "")}`} className="text-[11px] text-[#0085A8] mt-0.5 block font-semibold">
                  📞 {day.guide.phone}
                </a>
              ) : (
                <div className="text-[11px] text-[#666] mt-0.5">{day.guide.phone}</div>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="text-[10px] italic" style={{ color: z.dark }}>{day.guide.note}</div>
                {day.guide.phone.startsWith("+") && <CopyButton text={day.guide.phone} />}
              </div>
            </div>
            <div className="rounded-xl px-3.5 py-2 text-[15px] font-extrabold shrink-0 ml-2.5 text-white" style={{ background: z.color }}>
              ~{day.guide.price}$
            </div>
          </div>
        </div>
      )}

      <div className="px-5 pt-4">
        <SectionLabel color={z.color}>BUDGET ESTIMÉ / PERSONNE</SectionLabel>
        <BudgetDonut budget={day.budget} />
      </div>

      <div className="px-5 pt-3.5">
        <div className="rounded-xl px-3.5 py-3 bg-[#FFFCEE]" style={{ borderLeft: "3px solid #D4A017" }}>
          <div className="text-[9px] text-[#A07010] tracking-[1.5px] mb-1">💡 CONSEIL</div>
          <div className="text-[13px] text-[#555] leading-relaxed">{edited.tip}</div>
        </div>
      </div>

      <div className="px-5 pt-3 pb-5">
        <div className="rounded-xl px-3.5 py-3" style={{ background: z.light }}>
          <div className="text-[9px] tracking-[1.5px] mb-1" style={{ color: z.dark }}>✨ MOMENT CLÉ</div>
          <div className="text-[14px] font-semibold text-[#1A1A1A] leading-relaxed">{edited.highlight}</div>
        </div>
      </div>

      {editing && (
        <DayEditForm
          day={day}
          edited={edited}
          onClose={() => setEditing(false)}
          onSave={(patch) => {
            onEdit(patch);
            setEditing(false);
          }}
          onReset={() => {
            onReset();
            setEditing(false);
          }}
        />
      )}
    </motion.div>
  );
}
