import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DAYS } from "../../data/days.js";
import { ZONES } from "../../data/constants.js";

export default function DayTimeline({ activeDay, onSelect }) {
  const scrollerRef = useRef(null);
  const dotRefs = useRef({});

  useEffect(() => {
    const el = dotRefs.current[activeDay];
    const scroller = scrollerRef.current;
    if (!el || !scroller) return;
    const target = el.offsetLeft - scroller.clientWidth / 2 + el.clientWidth / 2;
    scroller.scrollTo({ left: target, behavior: "smooth" });
  }, [activeDay]);

  return (
    <div>
      <div
        ref={scrollerRef}
        className="overflow-x-auto py-3"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="relative flex items-center gap-[6px] px-5 pb-1" style={{ minWidth: "max-content" }}>
          <div className="absolute left-5 right-5 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-white/10" />
          <motion.div
            className="absolute left-5 top-1/2 -translate-y-1/2 h-[3px] rounded-full"
            style={{ background: "linear-gradient(90deg,#0085A8,#2E7D4F)" }}
            initial={false}
            animate={{ width: `${(activeDay - 1) * 48 + 21}px` }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
          />
          {DAYS.map((day) => {
            const zone = ZONES[day.zone];
            const active = day.id === activeDay;
            return (
              <button
                key={day.id}
                ref={(el) => (dotRefs.current[day.id] = el)}
                onClick={() => onSelect(day.id)}
                className="tap relative flex flex-col items-center gap-1 py-2 px-2 rounded-xl border-2 cursor-pointer bg-transparent"
                style={{
                  minWidth: 42,
                  borderColor: active ? zone.color : "transparent",
                  background: active ? zone.color : "rgba(255,255,255,0.08)",
                  transform: active ? "scale(1.08)" : "scale(1)",
                  transition: "transform .18s, background .18s, border-color .18s",
                  boxShadow: active ? `0 4px 14px ${zone.color}55` : "none",
                }}
              >
                {active && (
                  <motion.span
                    className="absolute -inset-1 rounded-xl"
                    style={{ background: zone.color }}
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <span className="relative text-[15px] leading-none">{day.emoji}</span>
                <span
                  className="relative text-[10px] font-bold"
                  style={{ color: active ? "white" : "rgba(255,255,255,0.4)" }}
                >
                  {day.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex gap-3 px-5 pb-2">
        {Object.entries(ZONES).map(([k, zn]) => (
          <div key={k} className="flex items-center gap-[5px] text-[10px] text-white/35">
            <div className="w-2 h-2 rounded-full" style={{ background: zn.color }} />
            {zn.label}
          </div>
        ))}
      </div>
    </div>
  );
}
