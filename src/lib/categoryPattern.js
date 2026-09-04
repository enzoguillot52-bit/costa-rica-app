// Motifs SVG décoratifs générés selon la catégorie (faune / flore / roches),
// utilisés en filigrane sur la face avant des fiches Biodex.
const PATTERNS = {
  faune: `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M14 10a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm10-4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm10 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM18 24c6-3 12-3 18 0 4 2 4 8-2 9-4 .7-6-1-8-1s-4 1.7-8 1c-6-1-6-7-2-9z'/%3E%3C/g%3E%3C/svg%3E`,
  flore: `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M32 6c8 8 8 20 0 28-8-8-8-20 0-28zM10 34c8-4 18-2 22 6-8 4-18 2-22-6zm44 0c-4 8-14 10-22 6 4-8 14-10 22-6z'/%3E%3C/g%3E%3C/svg%3E`,
  roches: `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.5' stroke-width='1.5'%3E%3Cpath d='M6 30 22 12l22 4 10 20-14 16-24-2z'/%3E%3C/g%3E%3C/svg%3E`,
};

export function categoryPatternUrl(cat) {
  const svg = PATTERNS[cat] || PATTERNS.faune;
  return `url("data:image/svg+xml,${svg}")`;
}
