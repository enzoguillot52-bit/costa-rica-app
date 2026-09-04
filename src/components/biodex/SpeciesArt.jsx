import { useState } from "react";
import { motion } from "framer-motion";
import { DANGER, ART } from "../../data/constants.js";
import { categoryPatternUrl } from "../../lib/categoryPattern.js";
import { useUnsplashPhoto } from "../../lib/useUnsplashPhoto.js";
import { speciesQuery } from "../../lib/speciesQuery.js";

export default function SpeciesArt({ entry, category, height, heroMode = false }) {
  const [loaded, setLoaded] = useState(false);
  const d = DANGER[entry.danger];
  const cols = (ART[entry.id] || "#0A1810,#152518,#080F0A").split(",");
  const photo = useUnsplashPhoto(speciesQuery(entry));

  return (
    <div className="relative overflow-hidden w-full" style={{ height }}>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: `linear-gradient(155deg, ${cols[0]}, ${cols[1]}, ${cols[0]})` }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: categoryPatternUrl(category), backgroundSize: "56px 56px" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${d.color}18, transparent 70%)` }}
        />
        <motion.span
          className="relative"
          style={{ fontSize: heroMode ? 88 : 46, filter: "drop-shadow(0 4px 16px rgba(0,0,0,.7))", lineHeight: 1 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {entry.emoji}
        </motion.span>
      </div>
      {photo.status === "loaded" && photo.url && (
        <motion.img
          src={photo.url}
          alt={entry.name}
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </div>
  );
}
