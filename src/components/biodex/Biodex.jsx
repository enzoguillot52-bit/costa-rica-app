import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATS, FAUNE, FLORE, ROCHES } from "../../data/biodex.js";
import BiodexCard from "./BiodexCard.jsx";
import BiodexModal from "./BiodexModal.jsx";

const containerVariants = { show: { transition: { staggerChildren: 0.05 } } };

export default function Biodex() {
  const [cat, setCat] = useState("faune");
  const [modalEntry, setModalEntry] = useState(null);
  const [search, setSearch] = useState("");
  const [dangerFilter, setDangerFilter] = useState("tous");
  const [sortBy, setSortBy] = useState("default");
  const { data, accent } = CATS[cat];

  const handleCat = (c) => {
    setCat(c);
    setSearch("");
    setDangerFilter("tous");
    setSortBy("default");
  };

  useEffect(() => setModalEntry(null), [cat]);

  const filtered = useMemo(() => {
    let res = [...data];
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.latin.toLowerCase().includes(q) ||
          e.zone.toLowerCase().includes(q) ||
          e.habitat.toLowerCase().includes(q)
      );
    }
    if (dangerFilter === "dangereux") res = res.filter((e) => e.danger >= 3);
    if (dangerFilter === "mortels") res = res.filter((e) => e.danger === 5);
    if (sortBy === "name") res.sort((a, b) => a.name.localeCompare(b.name, "fr"));
    if (sortBy === "danger_desc") res.sort((a, b) => b.danger - a.danger);
    if (sortBy === "danger_asc") res.sort((a, b) => a.danger - b.danger);
    return res;
  }, [data, search, dangerFilter, sortBy]);

  const counts = useMemo(
    () => ({
      tous: data.length,
      dangereux: data.filter((e) => e.danger >= 3).length,
      mortels: data.filter((e) => e.danger === 5).length,
    }),
    [data]
  );

  return (
    <div className="pb-[90px]">
      <div className="px-5 pt-[22px] pb-3.5">
        <div className="text-[10px] tracking-[2.5px] text-white/40 mb-1.5">Encyclopédie de terrain</div>
        <div className="text-[24px] font-extrabold text-white font-display">🔍 Biodex Costa Rica</div>
        <div className="text-[12px] text-white/35 mt-1">
          {FAUNE.length + FLORE.length + ROCHES.length} espèces · Toucher pour la fiche
        </div>
      </div>

      <div className="flex gap-2 px-5 pb-3.5">
        {Object.entries(CATS).map(([k, c]) => {
          const active = cat === k;
          return (
            <button
              key={k}
              onClick={() => handleCat(k)}
              className="tap flex-1 py-2.5 px-1.5 rounded-xl text-[12px] border-none"
              style={{
                background: active ? c.accent : "rgba(255,255,255,0.07)",
                color: active ? "white" : "rgba(255,255,255,0.4)",
                fontWeight: active ? 700 : 500,
                boxShadow: active ? `0 4px 14px ${c.accent}55` : "none",
              }}
            >
              {c.emoji} {c.label} <span className="text-[10px] opacity-70">({c.data.length})</span>
            </button>
          );
        })}
      </div>

      <div className="relative mx-5 mb-2.5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] opacity-40">🔎</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un nom, une zone, un habitat..."
          className="w-full box-border py-2.5 pl-[34px] pr-[34px] rounded-xl bg-white/[0.07] border border-white/10 text-white text-[13px]"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/50 text-[16px]"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex gap-[7px] px-5 pb-2.5 overflow-x-auto">
        {[
          { id: "tous", l: "Tous", c: counts.tous },
          { id: "dangereux", l: "⚠️ Danger 3+", c: counts.dangereux },
          { id: "mortels", l: "☠️ Mortels", c: counts.mortels },
        ].map((f) => {
          const active = dangerFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setDangerFilter(f.id)}
              className="tap px-3 py-1.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap shrink-0"
              style={{
                border: active ? "none" : "1px solid rgba(255,255,255,0.14)",
                background: active ? accent : "transparent",
                color: active ? "white" : "rgba(255,255,255,0.5)",
              }}
            >
              {f.l} ({f.c})
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center px-5 pb-3">
        <div className="text-[12px] text-white/40 font-semibold">
          {filtered.length} espèce{filtered.length > 1 ? "s" : ""}
          {(search || dangerFilter !== "tous") && <span style={{ color: accent, marginLeft: 4 }}>· filtré</span>}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white/[0.07] border border-white/10 rounded-lg text-white/60 text-[11px] px-2 py-1.5"
        >
          <option value="default">Ordre par défaut</option>
          <option value="name">Nom A → Z</option>
          <option value="danger_desc">Plus dangereux d'abord</option>
          <option value="danger_asc">Plus sûrs d'abord</option>
        </select>
      </div>

      <motion.div
        className="px-3.5 grid grid-cols-2 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        key={cat + search + dangerFilter + sortBy}
      >
        {filtered.map((entry) => (
          <BiodexCard key={entry.id} entry={entry} category={cat} onOpenModal={setModalEntry} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="px-5 py-12 text-center">
          <div className="text-[40px] mb-3">🔍</div>
          <div className="text-white/40 text-[14px]">
            Aucune espèce trouvée dans cette zone{search && ` pour "${search}"`}...
          </div>
          <button
            onClick={() => {
              setSearch("");
              setDangerFilter("tous");
            }}
            className="tap mt-4 px-[18px] py-2.5 rounded-xl border border-white/20 bg-white/[0.08] text-white/70 text-[13px]"
          >
            Réinitialiser
          </button>
        </div>
      )}

      <AnimatePresence>
        {modalEntry && <BiodexModal entry={modalEntry} category={cat} onClose={() => setModalEntry(null)} />}
      </AnimatePresence>
    </div>
  );
}
