export default function SectionLabel({ children, color }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      <div className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: color || "#AAA" }} />
      <div className="text-[10px] tracking-[2px] text-[#AAA] font-semibold">{children}</div>
    </div>
  );
}
