import { useLocalStorage } from "./useLocalStorage.js";

export function useDayOverrides() {
  const [overrides, setOverrides] = useLocalStorage("cr_day_overrides", {});

  const setOverride = (dayId, patch) => {
    setOverrides((prev) => ({ ...prev, [dayId]: { ...prev[dayId], ...patch } }));
  };

  const resetOverride = (dayId) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[dayId];
      return next;
    });
  };

  const applyOverride = (day) => {
    const o = overrides[day.id];
    if (!o) return day;
    return {
      ...day,
      ...o,
      sleep: o.sleep ? { ...day.sleep, ...o.sleep } : day.sleep,
      eat: o.eat ? { ...day.eat, ...o.eat } : day.eat,
    };
  };

  return { overrides, setOverride, resetOverride, applyOverride };
}
