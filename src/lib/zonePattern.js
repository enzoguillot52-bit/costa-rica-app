// Motifs décoratifs par zone — vagues pour les Caraïbes, canopée pour le
// Pacifique, route/relief pour les jours de transit — utilisés en filigrane
// sur l'en-tête de chaque carte de jour.
const ZONE_PATTERNS = {
  caraibe: {
    svg: "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='40'%3E%3Cpath d='M0 22 Q15 6 30 22 T60 22 T90 22 T120 22' fill='none' stroke='%23ffffff' stroke-opacity='0.4' stroke-width='2'/%3E%3Cpath d='M0 32 Q15 16 30 32 T60 32 T90 32 T120 32' fill='none' stroke='%23ffffff' stroke-opacity='0.22' stroke-width='2'/%3E%3C/svg%3E",
    size: "120px 40px",
  },
  pacific: {
    svg: "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='36'%3E%3Cpath d='M0 36 Q8 8 16 36 Q24 4 32 36 Q40 10 48 36 Q56 6 64 36 Q72 12 80 36 Q88 6 96 36 L100 36 L100 0 L0 0 Z' fill='%23ffffff' fill-opacity='0.16'/%3E%3C/svg%3E",
    size: "100px 36px",
  },
  transit: {
    svg: "<svg xmlns='http://www.w3.org/2000/svg' width='110' height='36'%3E%3Cpath d='M0 28 L18 10 L34 22 L54 4 L74 24 L92 12 L110 28' fill='none' stroke='%23ffffff' stroke-opacity='0.32' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
    size: "110px 36px",
  },
};

export function zonePatternUrl(zone) {
  const p = ZONE_PATTERNS[zone] || ZONE_PATTERNS.transit;
  return `url("data:image/svg+xml,${p.svg}")`;
}

export function zonePatternSize(zone) {
  return (ZONE_PATTERNS[zone] || ZONE_PATTERNS.transit).size;
}

export const TOPO_PATTERN_URL =
  "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='90'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.07' stroke-width='1'%3E%3Cellipse cx='80' cy='45' rx='70' ry='34'/%3E%3Cellipse cx='80' cy='45' rx='48' ry='22'/%3E%3Cellipse cx='80' cy='45' rx='26' ry='11'/%3E%3C/g%3E%3C/svg%3E\")";
