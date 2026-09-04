import { motion } from "framer-motion";

const COLORS = { "🏡": "#5B9CF6", "🍽️": "#F4845F", "🚌": "#52B788", "🎯": "#E9C46A" };
const LABELS = { "🏡": "Logement", "🍽️": "Repas", "🚌": "Transport", "🎯": "Activités" };

export default function BudgetDonut({ budget }) {
  const entries = Object.entries(budget).filter(([, v]) => v > 0);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const size = 104;
  const stroke = 15;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  let acc = 0;
  const segments = entries.map(([k, v]) => {
    const frac = total > 0 ? v / total : 0;
    const seg = { key: k, value: v, color: COLORS[k] || "#888", frac, offset: acc };
    acc += frac;
    return seg;
  });

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EFEDE2" strokeWidth={stroke} />
          {segments.map((seg) => (
            <motion.circle
              key={seg.key}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeLinecap="butt"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset: circumference * (1 - seg.frac),
              }}
              style={{ transform: `rotate(${seg.offset * 360}deg)`, transformOrigin: "50% 50%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[15px] font-extrabold text-[#1A1A1A] tabular-nums">{total}$</div>
          <div className="text-[8px] text-[#888] tracking-wide">/ pers.</div>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[k] || "#888" }} />
            <div>
              <div className="text-[12px] font-bold text-[#222] tabular-nums leading-tight">{v}$</div>
              <div className="text-[9px] text-[#888] leading-tight">{LABELS[k] || k}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
