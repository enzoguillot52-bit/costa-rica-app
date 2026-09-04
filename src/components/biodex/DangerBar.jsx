import { motion } from "framer-motion";
import { DANGER } from "../../data/constants.js";

export default function DangerBar({ danger, size = "md" }) {
  const d = DANGER[danger];
  const h = size === "sm" ? 8 : 12;
  const isDeadly = danger === 5;

  return (
    <div>
      <div className="flex gap-1.5 mb-1" style={{ height: h }}>
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= danger;
          return (
            <div key={i} className="flex-1 rounded-full overflow-hidden relative" style={{ background: "rgba(255,255,255,0.1)" }}>
              {filled && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ transformOrigin: "left", background: d.color, boxShadow: `0 0 10px ${d.color}66` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: i * 0.12,
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1], // easing exponentiel
                  }}
                />
              )}
              {filled && isDeadly && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
                    width: "40%",
                  }}
                  initial={{ x: "-120%" }}
                  animate={{ x: "220%" }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 1.1, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-[13px] font-bold" style={{ color: d.color }}>{d.label}</div>
        <div className="text-[15px] font-extrabold tabular-nums" style={{ color: d.color }}>
          {danger}<span className="text-[10px] opacity-50"> / 5</span>
        </div>
      </div>
    </div>
  );
}
