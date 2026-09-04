import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <div className="text-[10px] tracking-[1.5px] text-white/40 mb-1.5">{label}</div>
      {children}
    </label>
  );
}

const inputCls =
  "w-full box-border px-3 py-2.5 rounded-xl bg-white/[0.07] border border-white/15 text-white text-[13.5px] placeholder:text-white/25";

export default function DayEditForm({ day, edited, onSave, onReset, onClose }) {
  const [form, setForm] = useState({
    title: edited.title,
    region: edited.region,
    activities: edited.activities.join("\n"),
    sleepName: edited.sleep.name,
    sleepPrice: edited.sleep.price,
    eatName: edited.eat.name,
    eatDetail: edited.eat.detail,
    tip: edited.tip,
    highlight: edited.highlight,
  });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSave({
      title: form.title,
      region: form.region,
      activities: form.activities.split("\n").map((s) => s.trim()).filter(Boolean),
      sleep: { name: form.sleepName, price: Number(form.sleepPrice) || 0 },
      eat: { name: form.eatName, detail: form.eatDetail },
      tip: form.tip,
      highlight: form.highlight,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[201] bg-[#0D2318] rounded-t-3xl border-t border-white/10 max-h-[88vh] overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
      >
        <div className="sticky top-0 bg-[#0D2318]/95 backdrop-blur-md px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/10">
          <div className="text-[15px] font-bold text-white">Modifier ce jour</div>
          <button onClick={onClose} className="tap w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/70 text-[16px]">
            ✕
          </button>
        </div>
        <form onSubmit={submit} className="px-5 py-4">
          <Field label="TITRE">
            <input className={inputCls} value={form.title} onChange={update("title")} />
          </Field>
          <Field label="DESTINATION / RÉGION">
            <input className={inputCls} value={form.region} onChange={update("region")} />
          </Field>
          <Field label="PROGRAMME (une activité par ligne)">
            <textarea className={inputCls} rows={4} value={form.activities} onChange={update("activities")} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="LOGEMENT">
              <input className={inputCls} value={form.sleepName} onChange={update("sleepName")} />
            </Field>
            <Field label="PRIX / NUIT ($)">
              <input className={inputCls} type="number" value={form.sleepPrice} onChange={update("sleepPrice")} />
            </Field>
          </div>
          <Field label="RESTAURANT">
            <input className={inputCls} value={form.eatName} onChange={update("eatName")} />
          </Field>
          <Field label="DÉTAIL RESTAURANT">
            <input className={inputCls} value={form.eatDetail} onChange={update("eatDetail")} />
          </Field>
          <Field label="CONSEIL">
            <textarea className={inputCls} rows={2} value={form.tip} onChange={update("tip")} />
          </Field>
          <Field label="MOMENT CLÉ">
            <textarea className={inputCls} rows={2} value={form.highlight} onChange={update("highlight")} />
          </Field>
          <div className="flex gap-2 mt-2 pb-2">
            <button type="button" onClick={onReset} className="tap flex-1 py-3 rounded-xl bg-white/10 text-white/60 text-[13px] font-semibold">
              Réinitialiser
            </button>
            <button type="submit" className="tap flex-[2] py-3 rounded-xl bg-[#2E7D4F] text-white text-[13px] font-bold">
              Enregistrer
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
