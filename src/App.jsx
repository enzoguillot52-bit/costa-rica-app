import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "./components/BottomNav.jsx";
import Planner from "./components/planner/Planner.jsx";
import Biodex from "./components/biodex/Biodex.jsx";
import Contacts from "./components/contacts/Contacts.jsx";
import { useLocalStorage } from "./lib/useLocalStorage.js";

export default function App() {
  const [tab, setTab] = useLocalStorage("cr_active_tab", "voyage");

  return (
    <div
      className="min-h-screen select-none"
      style={{ background: "linear-gradient(160deg, #08180E 0%, #0D2318 100%)" }}
    >
      <div style={{ paddingBottom: "calc(70px + env(safe-area-inset-bottom, 0px))" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "voyage" && <Planner />}
            {tab === "biodex" && <Biodex />}
            {tab === "contacts" && <Contacts />}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}
