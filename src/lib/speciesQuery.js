export function speciesQuery(entry) {
  const match = entry.img?.match(/\?([^)]+)$/);
  const terms = match ? match[1].replace(/,/g, " ") : entry.name;
  return `${entry.name} ${terms}`;
}
