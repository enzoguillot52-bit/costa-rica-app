// ─────────────────────────────────────────────────────────────────────────
// Costa Rica · Carnet de voyage — fichier .jsx unique (portable)
//
// Version condensée en un seul fichier de l'app (normalement répartie dans
// src/data, src/lib, src/components — voir le reste du dépôt pour le projet
// Vite complet). Pratique pour ouvrir/coller l'app dans un aperçu React
// mono-fichier (sandbox, artifact, CodeSandbox...).
//
// Dépendances : react, react-dom, framer-motion, tailwindcss (classes
// utilitaires utilisées partout). Sans Tailwind chargé dans l'environnement
// d'aperçu, la mise en page perdra son style mais restera fonctionnelle.
// Les polices Google Fonts (Playfair Display / Inter) doivent être chargées
// par la page hôte (balise <link>) — ce fichier ne peut pas le faire lui-même.
//
// Optionnel : définissez VITE_UNSPLASH_ACCESS_KEY (ou adaptez ACCESS_KEY
// ci-dessous) pour afficher de vraies photos dans le Biodex. Sans clé,
// chaque fiche retombe automatiquement sur un pattern SVG + emoji.
// ─────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ═══════════════════════════════ DONNÉES ═══════════════════════════════

const DANGER = [
  null,
  { label: "Inoffensif", color: "#2AAB5A", bg: "#1A3D24" },
  { label: "Prudence", color: "#D4A008", bg: "#3A2E08" },
  { label: "Attention", color: "#E0761A", bg: "#3A2010" },
  { label: "Dangereux", color: "#D93025", bg: "#3A1010" },
  { label: "Mortel ☠️", color: "#8B00FF", bg: "#2A1040" },
];

const ZONES = {
  transit: { label: "Transit", color: "#B5722A", light: "#FEF3E4", dark: "#7A4B1A" },
  caraibe: { label: "Caraïbes", color: "#0085A8", light: "#DFF4FB", dark: "#005C78" },
  pacific: { label: "Pacifique", color: "#2E7D4F", light: "#E2F4E8", dark: "#1A5232" },
};

// Palette de fond utilisée pour générer le pattern SVG de chaque fiche Biodex
const ART = {
  f1: "#3D1200,#6B2800,#1A0800", f2: "#000820,#001840,#000A14",
  f3: "#1A0400,#350C00,#0D0200", f4: "#001008,#002815,#000A05",
  f5: "#001515,#002A28,#000D0D", f6: "#1A1200,#302200,#100C00",
  f7: "#001200,#002200,#000A00", f8: "#001525,#002A4A,#000D18",
  f9: "#0A1A05,#182E0A,#060E03", f10: "#0D1800,#1E2D00,#080E00",
  f11: "#1A0000,#360800,#0F0000", f12: "#100800,#201200,#080500",
  f13: "#1A1200,#2D2000,#0D0A00", f14: "#000818,#001030,#00050F",
  f15: "#180A00,#2D1500,#0C0600", p1: "#1A0000,#2D0500,#0F0000",
  p2: "#001200,#002200,#000A00", p3: "#1A0010,#300018,#0E0009",
  p4: "#0F0018,#1E0030,#08000F", p5: "#050A00,#0F1C00,#030600",
  p6: "#1A0A00,#2D1500,#0E0600", p7: "#1A0A00,#2D1600,#100800",
  p8: "#001500,#002800,#000C00", r1: "#080808,#181814,#040404",
  r2: "#020202,#0A0A0C,#010101", r3: "#001A0A,#003020,#000F06",
  r4: "#0A0A12,#15151F,#060610", r5: "#001428,#002040,#000A18",
  r6: "#08001A,#100030,#050010",
};

// 13 jours d'itinéraire : 2j Manzanillo · 2j Cahuita · 3j Tortuguero ·
// 2j Arenal/Monteverde · 4j Côte Pacifique
const DAYS = [
  {
    id: 1, date: "1 Oct", zone: "transit", emoji: "🛬", title: "Arrivée → Manzanillo", region: "Manzanillo",
    weather: { icon: "⛅", label: "Nuageux · averses possibles", temp: "28°C" },
    activities: ["Navette/bus direct SJO → Manzanillo via Puerto Viejo (~5h)", "Installation, premiers pas sur la plage de Manzanillo", "Coucher de soleil sur la côte caribéenne sud"],
    sleep: { name: "Cabinas Manzanillo", price: 30 },
    eat: { name: "Soda Maxi", detail: "Cuisine caribéenne épicée · ~9$" },
    guide: null,
    transport: { type: "Navette / Bus", duration: "~5h" },
    budget: { "🏡": 30, "🍽️": 20, "🚌": 35, "🎯": 0 },
    tip: "Pas de contact fixe pour Manzanillo dans le carnet — réservez l'hébergement sur place ou en ligne avant le départ.",
    highlight: "Premier coucher de soleil sur la côte caribéenne sud 🌅",
  },
  {
    id: 2, date: "2 Oct", zone: "caraibe", emoji: "🐠", title: "Manzanillo — Refuge Gandoca-Manzanillo", region: "Manzanillo",
    weather: { icon: "🌤", label: "Veranillo caribéen", temp: "29°C" },
    activities: ["8h : Snorkeling dans le récif du refuge Gandoca-Manzanillo", "Randonnée le long de la plage — paresseux et singes dans la canopée", "Après-midi libre, baignade eaux turquoise"],
    sleep: { name: "Cabinas Manzanillo", price: 30 },
    eat: { name: "Soda Maxi", detail: "Poisson grillé + patacones · ~10$" },
    guide: null,
    transport: { type: "Sur place", duration: null },
    budget: { "🏡": 30, "🍽️": 25, "🚌": 0, "🎯": 20 },
    tip: "Le refuge est en accès libre à pied — snorkeling selon la marée, meilleure visibilité le matin.",
    highlight: "Snorkeling sauvage dans l'un des récifs les mieux préservés du pays 🐠",
  },
  {
    id: 3, date: "3 Oct", zone: "transit", emoji: "🌴", title: "Manzanillo → Cahuita", region: "Cahuita",
    weather: { icon: "☀️", label: "Veranillo — beau temps !", temp: "30°C" },
    activities: ["Bus/taxi Manzanillo → Cahuita via Puerto Viejo (~1h)", "Installation au lodge de Fernando", "Balade dans le village de Cahuita"],
    sleep: { name: "Wildlife Lodge Cahuita (Fernando)", price: 40 },
    eat: { name: "Soda Kawe", detail: "Poulet caraïbe au feu de bois · ~10$" },
    guide: null,
    transport: { type: "Bus / Taxi", duration: "~1h" },
    budget: { "🏡": 40, "🍽️": 25, "🚌": 15, "🎯": 0 },
    tip: "Fernando au lodge organise tous les tours + night tours + cacao Bribri.",
    highlight: "Arrivée à Cahuita, ambiance village tranquille 🌴",
  },
  {
    id: 4, date: "4 Oct", zone: "caraibe", emoji: "🐠", title: "Cahuita — Récif & plage", region: "Cahuita",
    weather: { icon: "☀️", label: "Octobre = un des meilleurs mois côté Caraïbe", temp: "31°C" },
    activities: ["8h : Parc National Cahuita — snorkeling récif corallien (gratuit !)", "Plage Blanche — baignade, paresseux dans les arbres", "17h : Tour cacao & culture Bribri avec Fernando"],
    sleep: { name: "Wildlife Lodge Cahuita (Fernando)", price: 40 },
    eat: { name: "Soda Kawe", detail: "Casado poisson frais + jus passion · ~10$" },
    guide: { name: "Fernando — Wildlife Lodge", phone: "Via le lodge", price: 30, note: "Tour cacao Bribri inclus" },
    transport: { type: "Sur place", duration: null },
    budget: { "🏡": 40, "🍽️": 30, "🚌": 0, "🎯": 35 },
    tip: "Snorkeling à 8h pour la meilleure visibilité. Parc gratuit. Paresseux quasi garantis !",
    highlight: "Snorkeling récif + paresseux à 2m + tour cacao Bribri 🦥🐠",
  },
  {
    id: 5, date: "5 Oct", zone: "transit", emoji: "🚤", title: "Cahuita → Tortuguero", region: "Tortuguero",
    weather: { icon: "🌦", label: "Variable · nuageux", temp: "28°C" },
    activities: ["Bus Cahuita → Moín via Limón (~1h)", "Bateau Moín → Tortuguero par les canaux (~3h)", "Arrivée au village — accessible à pied seulement"],
    sleep: { name: "Hostal y Cabinas Tortuguero", price: 35 },
    eat: { name: "Soda D'Leite", detail: "Gallo pinto, patacones · ~8$" },
    guide: null,
    transport: { type: "Bus + Bateau", duration: "~4h" },
    budget: { "🏡": 35, "🍽️": 25, "🚌": 35, "🎯": 0 },
    tip: "Le bateau depuis Moín est l'alternative sud à la route classique via La Pavona. L'arrivée en pirogue dans les canaux est déjà un spectacle.",
    highlight: "L'arrivée en pirogue à Tortuguero — bienvenue en Amazonie 🐊",
  },
  {
    id: 6, date: "6 Oct", zone: "caraibe", emoji: "🐊", title: "Tortuguero — Les canaux", region: "Tortuguero",
    weather: { icon: "🌤", label: "Veranillo caribéen", temp: "29°C" },
    activities: ["6h–10h : Canoë dans les canaux avec Arturo", "Caimans, loutres géantes, singes araignées, anacondas", "Après-midi : Musée des tortues marines + village"],
    sleep: { name: "Hostal y Cabinas Tortuguero", price: 35 },
    eat: { name: "El Patio de Tortuguero", detail: "Vue canal · crevettes coco · ~13$" },
    guide: { name: "Arturo — Bio-Eco Adventures", phone: "+506 7210 8753", price: 45, note: "⭐ 5.0" },
    transport: { type: "Sur place", duration: null },
    budget: { "🏡": 35, "🍽️": 30, "🚌": 0, "🎯": 55 },
    tip: "Partir à 6h avant le vent — caimans et singes actifs dans le brouillard matinal.",
    highlight: "Canoë dans des canaux où les arbres se rejoignent au-dessus 🌿",
  },
  {
    id: 7, date: "7 Oct", zone: "caraibe", emoji: "🐆", title: "Tortuguero — Traque du jaguar", region: "Tortuguero",
    weather: { icon: "🌤", label: "Bonnes conditions · veranillo", temp: "28°C" },
    activities: ["6h : Sendero Jaguar 4h avec Pablo Nana", "Après-midi : Kayak libre dans les mangroves", "22h : Tour nocturne plage — ponte de tortues vertes 🐢"],
    sleep: { name: "Hostal y Cabinas Tortuguero", price: 35 },
    eat: { name: "Soda D'Leite", detail: "Poisson du jour + batido passion · ~9$" },
    guide: { name: "Pablo 'Nana' — Nature Native", phone: "+506 8461 5233", price: 25, note: "⭐ 4.8 · Natif de Tortuguero" },
    transport: { type: "Sur place", duration: null },
    budget: { "🏡": 35, "🍽️": 30, "🚌": 0, "🎯": 40 },
    tip: "Départ 6h PILE — les jaguars rentrent de la plage à l'aube. Silencieux et bottes obligatoires.",
    highlight: "Sendero Jaguar à l'aube + affût plage tortues — jour le plus intense 🐆🌙",
  },
  {
    id: 8, date: "8 Oct", zone: "transit", emoji: "🌋", title: "Tortuguero → La Fortuna / Arenal", region: "Arenal",
    weather: { icon: "🌤", label: "Matins clairs · pluie après 15h", temp: "27°C" },
    activities: ["Bateau Tortuguero → La Pavona (1h30)", "Bus La Pavona → La Fortuna (2h)", "Après-midi : Parc Volcan Arenal — sentiers de lave, toucans, coatis", "19h : Night tour Sergio — grenouilles venimeuses, kinkajous"],
    sleep: { name: "Alpha Arenal Hostel", price: 35 },
    eat: { name: "Soda Rodríguez", detail: "La cabane dans les arbres · ~10$" },
    guide: { name: "Sergio — Sloth Tour", phone: "+506 6295 9008", price: 35, note: "⭐ 5.0" },
    transport: { type: "Bateau + Bus", duration: "~3h30" },
    budget: { "🏡": 35, "🍽️": 30, "🚌": 35, "🎯": 50 },
    tip: "Journée chargée : transit le matin, volcan l'après-midi, night tour le soir. Sources thermales gratuites sur la rivière Chollin si le temps le permet.",
    highlight: "Night tour : kinkajous avec bébés, grenouilles dart sous UV 🐸🌙",
  },
  {
    id: 9, date: "9 Oct", zone: "pacific", emoji: "🦜", title: "Arenal → Monteverde — Forêt nuageuse", region: "Monteverde",
    weather: { icon: "🌧", label: "Brumeux · bruine — essence de Monteverde", temp: "18°C" },
    activities: ["7h : Bus La Fortuna → Monteverde, route Jeep-Boat-Jeep (~3h)", "Réserve Monteverde — sentiers suspendus à 50m + quetzal avec Jason", "20h : Night tour — grenouilles yeux rouges, vipères cils"],
    sleep: { name: "OutBox Inn Monteverde", price: 45 },
    eat: { name: "Soda La Amistad", detail: "Bistec, frijoles noirs, jus guanabana · ~11$" },
    guide: { name: "Jason — Monteverde Nature", phone: "+506 8636 0491", price: 50, note: "⭐ 5.0 · Le chuchoteur de quetzals" },
    transport: { type: "Bus (Jeep-Boat-Jeep)", duration: "~3h" },
    budget: { "🏡": 45, "🍽️": 35, "🚌": 25, "🎯": 65 },
    tip: "Il fait 18°C — emportez un pull ! Le brouillard fait partie de l'expérience.",
    highlight: "Voir un quetzal resplendissant — l'oiseau le plus beau des Amériques 🦜",
  },
  {
    id: 10, date: "10 Oct", zone: "transit", emoji: "🚌", title: "Monteverde → Uvita", region: "Pacifique Sud",
    weather: { icon: "🌧", label: "Pluies Pacifique — normales en octobre", temp: "30°C" },
    activities: ["Bus Monteverde → Puntarenas (2h30)", "Bus côtier Puntarenas → Uvita (4h — mer à gauche !)", "Arrivée Uvita, repérage Parc Marino Ballena"],
    sleep: { name: "Karandi Hostel Uvita", price: 30 },
    eat: { name: "Soda Ranchito Doña Maria", detail: "Arroz camarones + smoothie · ~9$" },
    guide: null,
    transport: { type: "Bus (2 étapes)", duration: "~6h30" },
    budget: { "🏡": 30, "🍽️": 25, "🚌": 20, "🎯": 0 },
    tip: "La route Costanera est une des plus belles du pays — Pacifique à gauche toute la route.",
    highlight: "Premier aperçu de la queue de baleine de Punta Uvita 🐋",
  },
  {
    id: 11, date: "11 Oct", zone: "pacific", emoji: "🐋", title: "Uvita — Baleines à bosse", region: "Pacifique Sud",
    weather: { icon: "🌦", label: "Pluies mais sorties en mer possibles le matin", temp: "31°C" },
    activities: ["7h : Whale watching baleines à bosse + baleineaux", "Snorkeling île Caño avec dauphins et tortues", "Après-midi : Plage queue de baleine à marée basse !"],
    sleep: { name: "Karandi Hostel Uvita", price: 30 },
    eat: { name: "Soda Los Papuchones", detail: "Casado + fresco maison · ~8$" },
    guide: { name: "La Ballena Tour", phone: "+506 8845 1233", price: 85, note: "⭐ 4.8 · Whale watching" },
    transport: { type: "Sur place", duration: null },
    budget: { "🏡": 30, "🍽️": 25, "🚌": 0, "🎯": 95 },
    tip: "Octobre = pic saison baleines à bosse. Tour le matin — mer plus calme.",
    highlight: "Baleines à bosse et baleineaux à 20m du bateau 🐋🐋",
  },
  {
    id: 12, date: "12 Oct", zone: "transit", emoji: "✈️", title: "Uvita → Péninsule d'Osa", region: "Péninsule d'Osa",
    weather: { icon: "🌧", label: "Très humide — pic saison des pluies", temp: "30°C" },
    activities: ["Option ✈️ : Petit avion SJO → Puerto Jiménez (30min, via San José)", "Option 🚌 : Bus Uvita → San Isidro → Puerto Jiménez (6-7h)", "Arrivée Drake Bay — nuit chez Emilio (pension complète)"],
    sleep: { name: "Rio Agujitas Farm (Emilio)", price: 35 },
    eat: { name: "Pension complète incluse 🍽️", detail: "Emilio cuisine avec les produits locaux" },
    guide: null,
    transport: { type: "Avion interne ou Bus", duration: "30min – 7h" },
    budget: { "🏡": 35, "🍽️": 0, "🚌": 120, "🎯": 0 },
    tip: "L'avion interne vaut le coup pour la vue sur l'Osa. Piste en herbe — expérience en soi.",
    highlight: "L'approche aérienne de la péninsule d'Osa — jungle primaire vue du ciel 🌿✈️",
  },
  {
    id: 13, date: "13 Oct", zone: "pacific", emoji: "🌅", title: "Péninsule d'Osa — Faune primaire & retour", region: "Retour",
    weather: { icon: "🌧", label: "Humide — les animaux très actifs !", temp: "30°C" },
    activities: ["5h30 : Tour aube avec Emilio — tapirs, 4 espèces de singes", "Randonnée forêt primaire de Drake Bay", "Vol Puerto Jiménez → San José (Sansa, ~30min) puis vol international · Pura Vida !"],
    sleep: { name: "Aéroport / Vol", price: 0 },
    eat: { name: "Dernière noix de coco 🥥", detail: "Pension Emilio le matin + patacones à l'aéroport" },
    guide: { name: "Emilio — Rio Agujitas Farm", phone: "+506 8698 1841", price: 40, note: "⭐ 4.8 · Natif + pension" },
    transport: { type: "Vol interne (Sansa)", duration: "~30min" },
    budget: { "🏡": 35, "🍽️": 15, "🚌": 120, "🎯": 50 },
    tip: "Corcovado fermé tout octobre — Drake Bay offre une forêt primaire comparable. Aéroport Puerto Jiménez : arriver 1h avant le vol.",
    highlight: "Tapirs à l'aube et dernier lever de soleil sur l'Osa · Pura Vida pour toujours 🌅",
  },
];

const FAUNE = [
  { id: "f1", emoji: "🐆", name: "Jaguar", latin: "Panthera onca", img: "https://source.unsplash.com/featured/400x300/?jaguar,wildcat", habitat: "Forêt primaire", zone: "Tortuguero · Osa", danger: 4, desc: "Le plus grand félin des Amériques chasse de nuit, souvent sur les plages de ponte. À Tortuguero en octobre, il est documenté chassant les tortues marines. C'est votre objectif principal du voyage — armez-vous de patience et faites confiance au guide.", fact: "Sa morsure est la plus puissante de tous les félins — il peut perforer un crâne d'alligator d'un seul coup de mâchoire. Il nage et grimpe parfaitement." },
  { id: "f2", emoji: "🐸", name: "Dendrobate azuré", latin: "Dendrobates azureus", img: "https://source.unsplash.com/featured/400x300/?poison,dart,frog,blue", habitat: "Forêt humide de plaine", zone: "Caraïbes · Osa", danger: 5, desc: "Ses couleurs éclatantes sont un avertissement fatal. Elle concentre les toxines des fourmis ingérées dans sa peau. En captivité sans proies sauvages, elle perd sa toxicité.", fact: "Un gramme de batrachotoxine suffit à tuer 1 000 adultes. Les peuples amérindiens frottaient leurs flèches sur son dos avant de chasser." },
  { id: "f3", emoji: "🐍", name: "Terciopelo", latin: "Bothrops asper", img: "https://source.unsplash.com/featured/400x300/?venomous,snake,rainforest", habitat: "Forêt, rivières, nuit", zone: "Tout le Costa Rica", danger: 5, desc: "Responsable de 80% des morsures de serpent au Costa Rica. Venin hémotoxique qui détruit les tissus et bloque la coagulation. Nocturne, cryptique, très réactif si dérangé.", fact: "'Maître de la nuit' — son surnom local. Il sort exclusivement après les pluies tropicales. Lampe torche et bottes imperméables obligatoires." },
  { id: "f4", emoji: "🐊", name: "Crocodile d'Amérique", latin: "Crocodylus acutus", img: "https://source.unsplash.com/featured/400x300/?crocodile,reptile", habitat: "Fleuves et estuaires", zone: "Tárcoles · Côte Pacifique", danger: 4, desc: "Le plus grand reptile d'Amérique centrale, atteignant 6m. Le pont de Tárcoles héberge des dizaines de crocodiles visibles depuis le parapet. Ne jamais nager dans les rivières côtières.", fact: "40 crocodiles peuvent être comptés simultanément sous le pont de Tárcoles. Arrêt libre et gratuit à 45 min de San José." },
  { id: "f5", emoji: "🦎", name: "Caïman à lunettes", latin: "Caiman crocodilus", img: "https://source.unsplash.com/featured/400x300/?caiman,alligator,water", habitat: "Canaux et lagunes", zone: "Tortuguero · Caraïbes", danger: 3, desc: "Plus petit que le croco (max 2,5m). Très commun dans les canaux de Tortuguero. La nuit, leurs yeux brillent rouge orangé dans une lampe torche — vision inoubliable depuis la pirogue.", fact: "Ses dents ne coupent pas — elles saisissent. Il fait tournoyer sa proie pour la noyer ou arracher des morceaux." },
  { id: "f6", emoji: "🦁", name: "Puma", latin: "Puma concolor", img: "https://source.unsplash.com/featured/400x300/?puma,mountain,lion,cat", habitat: "Forêt et montagne", zone: "Monteverde · Arenal", danger: 3, desc: "Nocturne et extrêmement discret, il évite activement l'humain. Si rencontre : ne fuyez jamais, faites-vous grand, parlez calmement, reculez lentement sans perdre le contact visuel.", fact: "Il détient le record de distribution géographique des mammifères terrestres des Amériques — du Yukon à la Patagonie." },
  { id: "f7", emoji: "🐒", name: "Singe hurleur", latin: "Alouatta palliata", img: "https://source.unsplash.com/featured/400x300/?howler,monkey,primate", habitat: "Canopée tropicale", zone: "Tortuguero · Arenal", danger: 2, desc: "Son rugissement porte à 5 km — l'un des sons les plus forts produits par un mammifère. Si stressé, il peut défécaliser depuis la canopée. Prévenu = préparé.", fact: "Le hurlement collectif à 5h du matin dans la jungle de Tortuguero est l'une des expériences sonores les plus impressionnantes du voyage." },
  { id: "f8", emoji: "🐢", name: "Tortue verte", latin: "Chelonia mydas", img: "https://source.unsplash.com/featured/400x300/?sea,turtle,ocean,green", habitat: "Océan + plages de ponte", zone: "Tortuguero (juil–oct)", danger: 1, desc: "Parcourt jusqu'à 2 000 km pour revenir pondre sur la plage exacte de sa naissance. Tortuguero est l'un des plus grands sites de ponte au monde. Observation uniquement de nuit avec guide SINAC.", fact: "Une femelle pond jusqu'à 7 fois par saison (~100 œufs à chaque fois). Elle ne reverra jamais ses petits — ils rejoignent l'océan seuls." },
  { id: "f9", emoji: "🦥", name: "Paresseux à 3 doigts", latin: "Bradypus variegatus", img: "https://source.unsplash.com/featured/400x300/?sloth,animal,tropical", habitat: "Canopée tropicale", zone: "Partout au Costa Rica", danger: 1, desc: "Descend de son arbre une seule fois par semaine pour déféquer. Des algues vertes colonisent sa fourrure comme camouflage. Son métabolisme est si lent qu'il peut mettre un mois à digérer une feuille.", fact: "Il a 9 vertèbres cervicales contre 7 pour les mammifères — il peut tourner la tête à 270°. Son cœur bat 6 fois par minute." },
  { id: "f10", emoji: "🦜", name: "Toucan à bec caréné", latin: "Ramphastos sulfuratus", img: "https://source.unsplash.com/featured/400x300/?toucan,bird,tropical", habitat: "Forêt et lisières", zone: "Tortuguero · Caraïbes", danger: 1, desc: "Son bec démesuré représente un tiers de sa longueur mais est creux et ultraléger — un radiateur naturel rempli de vaisseaux sanguins. Vole en groupes bruyants à l'aube.", fact: "En dormant, le toucan replie son bec sur son dos et enroule sa queue — pour tenir dans un trou d'arbre exactement à sa dimension." },
  { id: "f11", emoji: "🦜", name: "Ara rouge", latin: "Ara macao", img: "https://source.unsplash.com/featured/400x300/?scarlet,macaw,parrot", habitat: "Forêt primaire côtière", zone: "Osa · Carara · Quepos", danger: 1, desc: "Monogame pour la vie — la perte du partenaire peut provoquer une dépression. Son cri strident annonce l'aube. Les gardes de l'Osa reconnaissent les couples individuellement.", fact: "Il vit jusqu'à 75 ans et développe une personnalité distincte. Certains aras de l'Osa sont suivis par des biologistes depuis les années 1990." },
  { id: "f12", emoji: "🕷️", name: "Tarantule du CR", latin: "Brachypelma sp.", img: "https://source.unsplash.com/featured/400x300/?tarantula,spider", habitat: "Terriers en forêt", zone: "Pacifique · zone sèche", danger: 2, desc: "Non mortelle pour un adulte. Morsure douloureuse avec nausées. Défense principale : projeter des poils urticants de son abdomen — irritation oculaire grave possible.", fact: "La femelle vit 25-30 ans. Elle mue toute sa carapace chaque année — y compris ses yeux, ses poumons et ses crochets venimeux." },
  { id: "f13", emoji: "🦂", name: "Scorpion forestier", latin: "Centruroides limbatus", img: "https://source.unsplash.com/featured/400x300/?scorpion,arachnid", habitat: "Sous pierres et écorce", zone: "Côtes Pacifique et Caraïbe", danger: 3, desc: "Piqûre : engourdissements, crampes, parfois difficultés respiratoires. Rarement mortelle pour un adulte — sérieuse pour les enfants. Actif exclusivement la nuit.", fact: "Règle absolue en trek : secouer ses chaussures chaque matin. Les scorpions se glissent dans la chaleur résiduelle pendant la nuit." },
  { id: "f14", emoji: "🐋", name: "Baleine à bosse", latin: "Megaptera novaeangliae", img: "https://source.unsplash.com/featured/400x300/?humpback,whale,ocean", habitat: "Eaux côtières chaudes", zone: "Marino Ballena · Uvita", danger: 1, desc: "Migre depuis le Pacifique nord ET sud pour mettre bas à Uvita — phénomène unique au monde. Octobre est le pic de présence. Les sauts sont spectaculaires depuis un petit bateau.", fact: "Sa chanson peut durer 20h et s'entendre à 800 km. Toutes les baleines d'un même bassin chantent la même chanson, qui évolue collectivement chaque saison." },
  { id: "f15", emoji: "🐍", name: "Boa constricteur", latin: "Boa constrictor", img: "https://source.unsplash.com/featured/400x300/?boa,constrictor,snake", habitat: "Forêt et lisières", zone: "Tout le Costa Rica", danger: 2, desc: "Non venimeux, tue par constriction en synchronisant la pression avec les expirations. Peut atteindre 4m. Évite l'humain. Une morsure reste douloureuse (100 petites dents).", fact: "Il peut digérer un cerf entier sur plusieurs semaines, puis ne plus manger pendant 6 mois. Sa mâchoire se désarticule pour avaler des proies 4x plus larges." },
];
const FLORE = [
  { id: "p1", emoji: "🌳", name: "Mancenillier", latin: "Hippomane mancinella", img: "https://source.unsplash.com/featured/400x300/?tropical,beach,tree,danger", habitat: "Plages côtières", zone: "Côtes Caraïbe et Pacifique", danger: 5, desc: "Classé arbre le plus dangereux du monde (Guinness). Sa sève provoque des brûlures chimiques graves. S'abriter dessous sous la pluie = cloques garanties. Fumée du bois brûlé = lésions pulmonaires.", fact: "Les Conquistadors l'appelaient 'árbol de la muerte'. Ses fruits ressemblent à des pommes parfumées et sont mortels à ingérer." },
  { id: "p2", emoji: "🌿", name: "Dieffenbachia", latin: "Dieffenbachia seguine", img: "https://source.unsplash.com/featured/400x300/?tropical,plant,green,leaves", habitat: "Sous-bois humide", zone: "Tortuguero · Caraïbes", danger: 3, desc: "Commune en bord de sentier. Mâcher une feuille provoque un gonflement de la langue et de la gorge pouvant bloquer les voies respiratoires pendant des heures.", fact: "Son surnom anglais est 'dumb cane' — elle prive sa victime de la parole. Vendue comme plante d'intérieur dans le monde entier." },
  { id: "p3", emoji: "🌺", name: "Héliconie", latin: "Heliconia rostrata", img: "https://source.unsplash.com/featured/400x300/?heliconia,tropical,flower", habitat: "Lisières de forêt", zone: "Partout au Costa Rica", danger: 1, desc: "Ses bractées en toboggan recueillent 0,5 à 2L d'eau par rosette — de vraies mini-mares aériennes hébergeant des dendrobates, larves et micro-crustacés.", fact: "Chaque courbe de sa fleur correspond exactement au bec d'un oiseau-mouche précis — co-évolution parfaite sur des millions d'années." },
  { id: "p4", emoji: "💐", name: "Orchidée épiphyte", latin: "Cattleya dowiana", img: "https://source.unsplash.com/featured/400x300/?orchid,tropical,flower", habitat: "Canopée forêt nuageuse", zone: "Monteverde · Arenal", danger: 1, desc: "Le Costa Rica abrite plus de 1 400 espèces d'orchidées. Les épiphytes poussent sur l'écorce sans parasiter l'arbre, captant eau et nutriments de l'air seul.", fact: "Certaines orchidées imitent l'odeur et la forme de femelles insectes pour attirer les mâles pollinisateurs — manipulation évolutive pure." },
  { id: "p5", emoji: "🌲", name: "Figuier étrangleur", latin: "Ficus obtusifolia", img: "https://source.unsplash.com/featured/400x300/?strangler,fig,tree,roots", habitat: "Forêt tropicale primaire", zone: "Tortuguero · Osa", danger: 1, desc: "La graine germe en canopée et envoie des racines vers le sol pendant 50-100 ans, ensserrant l'hôte jusqu'à l'étouffer — un meurtre végétal au ralenti.", fact: "Une fois l'hôte mort, le figuier forme une cathédrale creuse de racines entrelacées — habitat pour des dizaines d'espèces simultanées." },
  { id: "p6", emoji: "🌸", name: "Broméliade géante", latin: "Tillandsia fasciculata", img: "https://source.unsplash.com/featured/400x300/?bromeliad,tropical,plant", habitat: "Branches d'arbres", zone: "Monteverde · Caraïbes", danger: 1, desc: "Accumule l'eau dans ses rosettes — de vraies mares aériennes. Ces réservoirs sont des écosystèmes complets où grenouilles et crustacés passent toute leur vie.", fact: "L'ananas que vous mangez est une broméliacée domestiquée. Ses ancêtres sauvages poussent librement dans les forêts costaricaines." },
  { id: "p7", emoji: "🫘", name: "Cacao sauvage", latin: "Theobroma cacao", img: "https://source.unsplash.com/featured/400x300/?cacao,chocolate,pod,tropical", habitat: "Sous-bois forêt tropicale", zone: "Zone Bribri · Caraïbes Sud", danger: 1, desc: "L'ancêtre du chocolat pousse naturellement en forêt caribéenne. Les Bribri le cultivent depuis 3 000 ans. Les cabosses poussent directement sur le tronc.", fact: "Theobroma = 'nourriture des dieux' en grec. À Cahuita, les guides Bribri vous apprendront à faire du chocolat en 30 min avec des pods sauvages." },
  { id: "p8", emoji: "🌱", name: "Ortie géante", latin: "Urera baccifera", img: "https://source.unsplash.com/featured/400x300/?stinging,nettle,plant", habitat: "Forêt secondaire, lisières", zone: "Tout le Costa Rica", danger: 2, desc: "Poils urticants sur tiges ET feuilles injectant de l'acide formique au moindre contact. Brûlure intense de 30min à plusieurs heures. Commune en bord de sentier.", fact: "Les peuples amérindiens l'utilisent pour traiter les douleurs arthritiques — la brûlure locale provoque une réaction anti-inflammatoire naturelle." },
];
const ROCHES = [
  { id: "r1", emoji: "🪨", name: "Basalte volcanique", latin: "Roche magmatique basique", img: "https://source.unsplash.com/featured/400x300/?volcanic,lava,rock", habitat: "Coulées de lave refroidies", zone: "Arenal · Poás · Irazú", danger: 1, desc: "Roche la plus commune du Costa Rica. Va du lisse (presque vitreux) au très rugueux (scorie). Noire à gris sombre selon le taux de refroidissement.", fact: "Les sentiers du Parc Arenal serpentent sur les coulées de basalte de l'éruption de 1968 qui rasa 3 villages — encore visibles 55 ans après." },
  { id: "r2", emoji: "⬛", name: "Obsidienne", latin: "Verre volcanique naturel", img: "https://source.unsplash.com/featured/400x300/?obsidian,black,volcanic,glass", habitat: "Zones de refroidissement rapide", zone: "Volcans du Costa Rica", danger: 2, desc: "Verre naturel formé par le refroidissement quasi-instantané de lave. Tranchant au niveau moléculaire — plus fin qu'un rasoir en acier. Maniement avec précaution absolue.", fact: "Les Mayas fabriquaient leurs instruments chirurgicaux en obsidienne. Certains chirurgiens modernes l'utilisent encore en microchirurgie oculaire." },
  { id: "r3", emoji: "💚", name: "Jade (Jadéite)", latin: "NaAlSi₂O₆", img: "https://source.unsplash.com/featured/400x300/?jade,green,gemstone", habitat: "Zones de subduction", zone: "Vallée centrale du CR", danger: 1, desc: "Le Costa Rica possède les seuls gisements de jadéite de qualité d'Amérique centrale. Plus précieux que l'or pour les cultures précolombiennes. Vert pomme distinctif.", fact: "Le Musée du Jade à San José a la plus grande collection précolombienne au monde. Un masque en jadéite peut valoir plusieurs millions d'euros." },
  { id: "r4", emoji: "🔮", name: "Sphères de pierre", latin: "Esferas Diquís (200–1500)", img: "https://source.unsplash.com/featured/400x300/?ancient,stone,sphere,mystery", habitat: "Delta du Diquís, Osa", zone: "Péninsule d'Osa", danger: 1, desc: "Sphères de granite parfaitement rondes, de 10cm à 2,6m et jusqu'à 16 tonnes. Créées par la culture Diquís. Fonction inconnue. Patrimoine Mondial UNESCO 2014.", fact: "Comment tailler une sphère parfaite sans outils métalliques ni instruments de mesure reste un mystère archéologique total non résolu." },
  { id: "r5", emoji: "🪸", name: "Calcaire corallien", latin: "Calcite biogénique", img: "https://source.unsplash.com/featured/400x300/?coral,reef,underwater,ocean", habitat: "Plateformes récifales", zone: "Cahuita · Isla del Caño", danger: 1, desc: "Chaque bloc blanc qui affleure à Cahuita était un récif vivant — siècles de squelettes de coraux calcifiés. Le seul récif costaricain est en danger critique.", fact: "Les sédiments agricoles de la rivière Estrella ont étouffé 70% du récif de Cahuita depuis les années 90. Ce que vous snorkelerez est peut-être en train de disparaître." },
  { id: "r6", emoji: "💎", name: "Opale cristalline", latin: "SiO₂·nH₂O", img: "https://source.unsplash.com/featured/400x300/?opal,gemstone,crystal", habitat: "Veines hydrothermales", zone: "Zone volcanique centrale", danger: 1, desc: "Formée dans les fissures volcaniques par des fluides hydrothermaux. Diffracte la lumière en arcs-en-ciel irisés selon l'angle de vue.", fact: "L'opale contient jusqu'à 20% d'eau emprisonnée. Si elle sèche trop vite, elle se fissure irrémédiablement — toujours garder une opale brute humide." },
];

const CATS = {
  faune: { label: "Faune", emoji: "🦁", data: FAUNE, accent: "#C47210" },
  flore: { label: "Flore", emoji: "🌿", data: FLORE, accent: "#1F7A45" },
  roches: { label: "Roches", emoji: "🪨", data: ROCHES, accent: "#3A6B8F" },
};

const GUIDES = [
  { name: "Pablo \"Nana\"", org: "Nature Native Guides", zone: "Tortuguero", phone: "+506 8461 5233" },
  { name: "Sergio", org: "Sloth Tour", zone: "La Fortuna", phone: "+506 6295 9008" },
  { name: "Arturo", org: "Bio-Eco Adventures", zone: "Tortuguero", phone: "+506 7210 8753" },
  { name: "Jason", org: "Monteverde Nature Tours", zone: "Monteverde", phone: "+506 8636 0491" },
  { name: "La Ballena Tour", org: "Whale watching", zone: "Uvita", phone: "+506 8845 1233" },
  { name: "Emilio", org: "Rio Agujitas Farm", zone: "Drake Bay", phone: "+506 8698 1841" },
  { name: "Fernando", org: "Wildlife Lodge Cahuita", zone: "Cahuita", phone: null, note: "Contact via le lodge" },
];
const LODGING = [
  { name: "Alpha Arenal Hostel", zone: "La Fortuna", phone: "+506 8770 5858" },
  { name: "Hostal y Cabinas Tortuguero", zone: "Tortuguero", phone: "+506 2709 8114" },
  { name: "Wildlife Lodge Cahuita", zone: "Cahuita", phone: null, note: "Via Fernando" },
  { name: "OutBox Inn Monteverde", zone: "Monteverde", phone: "+506 8980 5656" },
  { name: "Karandi Hostel Uvita", zone: "Uvita", phone: "+506 8667 0890" },
  { name: "Rio Agujitas Farm", zone: "Drake Bay", phone: "+506 8698 1841" },
];

// ═══════════════════════════════ UTILS / HOOKS ═══════════════════════════

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // stockage indisponible (navigation privée, quota) — on continue sans persister
    }
  }, [key, value]);

  return [value, setValue];
}

function useDayOverrides() {
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

// Clé Unsplash optionnelle. Sous Vite, VITE_UNSPLASH_ACCESS_KEY est lue depuis
// import.meta.env ; l'accès est protégé pour ne pas planter hors d'un contexte Vite.
const ACCESS_KEY =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_UNSPLASH_ACCESS_KEY) || undefined;
const PHOTO_CACHE_KEY = "cr_photo_cache";

function readPhotoCache() {
  try {
    return JSON.parse(window.localStorage.getItem(PHOTO_CACHE_KEY)) || {};
  } catch {
    return {};
  }
}
function writePhotoCache(cache) {
  try {
    window.localStorage.setItem(PHOTO_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // quota / navigation privée — on continue sans cache persistant
  }
}

// Recherche une photo réelle via l'API Unsplash Search, mise en cache localement.
// Sans clé configurée ou en cas d'échec réseau, le statut retombe sur
// "unavailable" et l'appelant affiche son fallback (pattern SVG + emoji).
function useUnsplashPhoto(query) {
  const [state, setState] = useState(() => {
    const cached = readPhotoCache()[query];
    return cached ? { status: "loaded", url: cached } : { status: ACCESS_KEY ? "loading" : "unavailable", url: null };
  });

  useEffect(() => {
    if (!ACCESS_KEY || !query) return;
    const cached = readPhotoCache()[query];
    if (cached) {
      setState({ status: "loaded", url: cached });
      return;
    }
    let cancelled = false;
    setState({ status: "loading", url: null });
    fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish&client_id=${ACCESS_KEY}`
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (cancelled) return;
        const url = data?.results?.[0]?.urls?.small;
        if (url) {
          const cache = readPhotoCache();
          cache[query] = url;
          writePhotoCache(cache);
          setState({ status: "loaded", url });
        } else {
          setState({ status: "unavailable", url: null });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: "unavailable", url: null });
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  return state;
}

function speciesQuery(entry) {
  const match = entry.img?.match(/\?([^)]+)$/);
  const terms = match ? match[1].replace(/,/g, " ") : entry.name;
  return `${entry.name} ${terms}`;
}

// Motifs SVG décoratifs générés selon la catégorie (faune / flore / roches),
// utilisés en filigrane sur la face avant des fiches Biodex.
const CATEGORY_PATTERNS = {
  faune: `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M14 10a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm10-4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm10 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM18 24c6-3 12-3 18 0 4 2 4 8-2 9-4 .7-6-1-8-1s-4 1.7-8 1c-6-1-6-7-2-9z'/%3E%3C/g%3E%3C/svg%3E`,
  flore: `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M32 6c8 8 8 20 0 28-8-8-8-20 0-28zM10 34c8-4 18-2 22 6-8 4-18 2-22-6zm44 0c-4 8-14 10-22 6 4-8 14-10 22-6z'/%3E%3C/g%3E%3C/svg%3E`,
  roches: `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.5' stroke-width='1.5'%3E%3Cpath d='M6 30 22 12l22 4 10 20-14 16-24-2z'/%3E%3C/g%3E%3C/svg%3E`,
};
function categoryPatternUrl(cat) {
  const svg = CATEGORY_PATTERNS[cat] || CATEGORY_PATTERNS.faune;
  return `url("data:image/svg+xml,${svg}")`;
}

// ═══════════════════════════════ COMPOSANTS ═══════════════════════════════

function BottomNav({ tab, onChange }) {
  const TABS = [
    { id: "voyage", emoji: "🗺️", label: "Voyage" },
    { id: "biodex", emoji: "🔍", label: "Biodex" },
    { id: "contacts", emoji: "📞", label: "Contacts" },
  ];
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[100] flex bg-[#08180E]/95 backdrop-blur-xl border-t border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {TABS.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="tap flex-1 min-h-[56px] flex flex-col items-center justify-center gap-1 py-2 bg-transparent border-none cursor-pointer relative"
          >
            {active && (
              <motion.div
                layoutId="navHighlight"
                className="absolute inset-x-2 inset-y-1 rounded-2xl bg-white/5"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            <span
              className="relative text-[22px] leading-none transition-transform duration-200"
              style={{
                filter: active ? "drop-shadow(0 0 8px #52B78888)" : "none",
                transform: active ? "translateY(-1px) scale(1.05)" : "none",
              }}
            >
              {t.emoji}
            </span>
            <span className={`relative text-[10px] ${active ? "font-bold text-[#52B788]" : "font-medium text-white/35"}`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function DayTimeline({ activeDay, onSelect }) {
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
      <div ref={scrollerRef} className="overflow-x-auto py-3" style={{ WebkitOverflowScrolling: "touch" }}>
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
                <span className="relative text-[10px] font-bold" style={{ color: active ? "white" : "rgba(255,255,255,0.4)" }}>
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

function BudgetDonut({ budget }) {
  const COLORS = { "🏡": "#5B9CF6", "🍽️": "#F4845F", "🚌": "#52B788", "🎯": "#E9C46A" };
  const LABELS = { "🏡": "Logement", "🍽️": "Repas", "🚌": "Transport", "🎯": "Activités" };
  const entries = Object.entries(budget).filter(([, v]) => v > 0);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const size = 104;
  const stroke = 15;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  let acc = 0;
  const segments = entries.map(([k, v]) => {
    const frac = total > 0 ? v / total : 0;
    const seg = { key: k, value: v, color: COLORS[k] || "#888", frac, offset: acc };
    acc += frac;
    return seg;
  });

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EFEDE2" strokeWidth={stroke} />
          {segments.map((seg) => (
            <motion.circle
              key={seg.key}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeLinecap="butt"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - seg.frac) }}
              style={{ transform: `rotate(${seg.offset * 360}deg)`, transformOrigin: "50% 50%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[15px] font-extrabold text-[#1A1A1A] tabular-nums">{total}$</div>
          <div className="text-[8px] text-[#888] tracking-wide">/ pers.</div>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[k] || "#888" }} />
            <div>
              <div className="text-[12px] font-bold text-[#222] tabular-nums leading-tight">{v}$</div>
              <div className="text-[9px] text-[#888] leading-tight">{LABELS[k] || k}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditField({ label, children }) {
  return (
    <label className="block mb-3">
      <div className="text-[10px] tracking-[1.5px] text-white/40 mb-1.5">{label}</div>
      {children}
    </label>
  );
}

const EDIT_INPUT_CLS =
  "w-full box-border px-3 py-2.5 rounded-xl bg-white/[0.07] border border-white/15 text-white text-[13.5px] placeholder:text-white/25";

function DayEditForm({ edited, onSave, onReset, onClose }) {
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
          <EditField label="TITRE">
            <input className={EDIT_INPUT_CLS} value={form.title} onChange={update("title")} />
          </EditField>
          <EditField label="DESTINATION / RÉGION">
            <input className={EDIT_INPUT_CLS} value={form.region} onChange={update("region")} />
          </EditField>
          <EditField label="PROGRAMME (une activité par ligne)">
            <textarea className={EDIT_INPUT_CLS} rows={4} value={form.activities} onChange={update("activities")} />
          </EditField>
          <div className="grid grid-cols-2 gap-3">
            <EditField label="LOGEMENT">
              <input className={EDIT_INPUT_CLS} value={form.sleepName} onChange={update("sleepName")} />
            </EditField>
            <EditField label="PRIX / NUIT ($)">
              <input className={EDIT_INPUT_CLS} type="number" value={form.sleepPrice} onChange={update("sleepPrice")} />
            </EditField>
          </div>
          <EditField label="RESTAURANT">
            <input className={EDIT_INPUT_CLS} value={form.eatName} onChange={update("eatName")} />
          </EditField>
          <EditField label="DÉTAIL RESTAURANT">
            <input className={EDIT_INPUT_CLS} value={form.eatDetail} onChange={update("eatDetail")} />
          </EditField>
          <EditField label="CONSEIL">
            <textarea className={EDIT_INPUT_CLS} rows={2} value={form.tip} onChange={update("tip")} />
          </EditField>
          <EditField label="MOMENT CLÉ">
            <textarea className={EDIT_INPUT_CLS} rows={2} value={form.highlight} onChange={update("highlight")} />
          </EditField>
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

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard indisponible — on ignore silencieusement
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="tap shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-bold bg-black/10 text-[#333]">
      {copied ? "✓ Copié" : "Copier"}
    </button>
  );
}

const dayCardVariants = {
  enter: { y: 40, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

function DayCard({ day, edited, onEdit, onReset }) {
  const [editing, setEditing] = useState(false);
  const z = ZONES[day.zone];

  return (
    <motion.div
      key={day.id}
      variants={dayCardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className="rounded-[22px] overflow-hidden"
      style={{ background: "#FEFBF4", boxShadow: `0 24px 64px rgba(0,0,0,.5), 0 0 0 1px ${z.color}22` }}
    >
      <div className="relative px-[22px] py-5 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${z.color}, ${z.dark})` }}>
        <div
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative flex justify-between items-start">
          <div className="flex-1 pr-3">
            <div className="text-[10px] opacity-75 tracking-[2px] mb-1.5">
              JOUR {day.id} · {day.date} · {edited.region}
            </div>
            <div className="text-[19px] font-extrabold leading-tight font-display">
              {day.emoji} {edited.title}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white/20 rounded-xl px-2.5 py-2 text-center">
              <div className="text-[18px] leading-none">{day.weather.icon}</div>
              <div className="text-[11px] font-bold mt-0.5">{day.weather.temp}</div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="tap w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-[13px]"
              aria-label="Modifier ce jour"
            >
              ✎
            </button>
          </div>
        </div>
        <div className="relative mt-2.5 text-[12px] italic opacity-85">{day.weather.label}</div>
      </div>

      <div className="px-5 pt-[18px]">
        <div className="text-[10px] tracking-[2px] text-[#AAA] mb-3">PROGRAMME</div>
        {edited.activities.map((a, i) => (
          <div key={i} className="flex gap-2.5 mb-2.5 items-start">
            <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-px" style={{ background: z.light, color: z.dark }}>
              {i + 1}
            </div>
            <div className="text-[13.5px] text-[#333] leading-relaxed">{a}</div>
          </div>
        ))}
      </div>

      {day.transport && (
        <div className="px-5 pt-4">
          <div className="rounded-2xl px-3.5 py-3 flex items-center gap-3" style={{ background: z.light }}>
            <div className="text-[20px]">🧭</div>
            <div className="flex-1">
              <div className="text-[9px] tracking-[1.5px] mb-0.5" style={{ color: z.dark }}>
                TRANSPORT VERS L'ÉTAPE SUIVANTE
              </div>
              <div className="text-[13px] font-bold text-[#1A1A1A]">{day.transport.type}</div>
            </div>
            {day.transport.duration && (
              <div className="text-[13px] font-extrabold shrink-0" style={{ color: z.dark }}>
                {day.transport.duration}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-5 pt-4 flex gap-2.5">
        {[
          { icon: "🏡", lbl: "LOGEMENT", name: edited.sleep.name, sub: edited.sleep.price > 0 ? `~${edited.sleep.price}$/nuit` : "Transit" },
          { icon: "🍽️", lbl: "RESTAURANT", name: edited.eat.name, sub: edited.eat.detail },
        ].map((it, i) => (
          <div key={i} className="flex-1 rounded-2xl px-3.5 py-3 bg-[#F6F6F0]">
            <div className="text-[9px] text-[#AAA] tracking-[1.5px] mb-1.5">
              {it.icon} {it.lbl}
            </div>
            <div className="text-[13px] font-bold text-[#1A1A1A] leading-tight">{it.name}</div>
            <div className="text-[11px] text-[#777] mt-0.5 leading-snug">{it.sub}</div>
          </div>
        ))}
      </div>

      {day.guide && (
        <div className="px-5 pt-3">
          <div className="rounded-2xl px-4 py-3 flex justify-between items-center" style={{ background: z.light }}>
            <div className="flex-1 min-w-0">
              <div className="text-[9px] tracking-[1.5px] mb-1" style={{ color: z.dark }}>
                👤 GUIDE RECOMMANDÉ
              </div>
              <div className="text-[13px] font-bold text-[#1A1A1A] truncate">{day.guide.name}</div>
              {day.guide.phone.startsWith("+") ? (
                <a href={`tel:${day.guide.phone.replace(/\s/g, "")}`} className="text-[11px] text-[#0085A8] mt-0.5 block font-semibold">
                  📞 {day.guide.phone}
                </a>
              ) : (
                <div className="text-[11px] text-[#666] mt-0.5">{day.guide.phone}</div>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="text-[10px] italic" style={{ color: z.dark }}>{day.guide.note}</div>
                {day.guide.phone.startsWith("+") && <CopyButton text={day.guide.phone} />}
              </div>
            </div>
            <div className="rounded-xl px-3.5 py-2 text-[15px] font-extrabold shrink-0 ml-2.5 text-white" style={{ background: z.color }}>
              ~{day.guide.price}$
            </div>
          </div>
        </div>
      )}

      <div className="px-5 pt-4">
        <div className="text-[10px] tracking-[2px] text-[#AAA] mb-2.5">BUDGET ESTIMÉ / PERSONNE</div>
        <BudgetDonut budget={day.budget} />
      </div>

      <div className="px-5 pt-3.5">
        <div className="rounded-xl px-3.5 py-3 bg-[#FFFCEE]" style={{ borderLeft: "3px solid #D4A017" }}>
          <div className="text-[9px] text-[#A07010] tracking-[1.5px] mb-1">💡 CONSEIL</div>
          <div className="text-[13px] text-[#555] leading-relaxed">{edited.tip}</div>
        </div>
      </div>

      <div className="px-5 pt-3 pb-5">
        <div className="rounded-xl px-3.5 py-3" style={{ background: z.light }}>
          <div className="text-[9px] tracking-[1.5px] mb-1" style={{ color: z.dark }}>✨ MOMENT CLÉ</div>
          <div className="text-[14px] font-semibold text-[#1A1A1A] leading-relaxed">{edited.highlight}</div>
        </div>
      </div>

      {editing && (
        <DayEditForm
          edited={edited}
          onClose={() => setEditing(false)}
          onSave={(patch) => {
            onEdit(patch);
            setEditing(false);
          }}
          onReset={() => {
            onReset();
            setEditing(false);
          }}
        />
      )}
    </motion.div>
  );
}

function Planner() {
  const [activeDay, setActiveDay] = useLocalStorage("cr_active_day", 1);
  const { setOverride, resetOverride, applyOverride } = useDayOverrides();

  const day = DAYS.find((d) => d.id === activeDay) || DAYS[0];
  const edited = applyOverride(day);
  const grandTotal = DAYS.reduce((s, d) => s + Object.values(d.budget).reduce((a, b) => a + b, 0), 0);

  const goto = (id) => setActiveDay(Math.min(DAYS.length, Math.max(1, id)));

  return (
    <div>
      <div className="px-5 pt-[22px] pb-2.5">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[10px] tracking-[2.5px] text-white/40 mb-1.5">Voyage en couple · 13 jours</div>
            <div className="text-[24px] font-extrabold text-white font-display">🌴 Costa Rica</div>
            <div className="text-[12px] text-white/45 mt-1">1 — 13 Octobre 2026</div>
          </div>
          <div className="rounded-xl px-3 py-2.5 bg-white/[0.06] text-[11px] text-white/50 text-right">
            <div className="tabular-nums font-semibold text-white/70">~{grandTotal}$ / pers.</div>
            <div className="text-[9px] opacity-60 mt-0.5">hors vols int'l</div>
          </div>
        </div>
        <div className="mt-3 px-3 py-2.5 rounded-xl text-[11px] text-white/75 leading-relaxed" style={{ background: "rgba(0,157,196,0.12)", borderLeft: "3px solid #009DC4" }}>
          🌤️ <strong>Météo oct. :</strong> Caraïbes d'abord (veranillo) → volcans et Pacifique ensuite.
        </div>
      </div>

      <DayTimeline activeDay={activeDay} onSelect={goto} />

      <div className="px-4 pb-[90px]">
        <AnimatePresence mode="wait" initial={false}>
          <DayCard
            key={day.id}
            day={day}
            edited={edited}
            onEdit={(patch) => setOverride(day.id, patch)}
            onReset={() => resetOverride(day.id)}
          />
        </AnimatePresence>

        <div className="flex gap-2.5 mt-3.5">
          <button
            onClick={() => goto(activeDay - 1)}
            disabled={activeDay === 1}
            className="tap flex-1 py-3.5 rounded-2xl font-semibold text-[14px] border-none"
            style={{
              background: activeDay === 1 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)",
              color: activeDay === 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.75)",
              cursor: activeDay === 1 ? "default" : "pointer",
            }}
          >
            ← Jour {activeDay > 1 ? activeDay - 1 : ""}
          </button>
          <button
            onClick={() => goto(activeDay + 1)}
            disabled={activeDay === DAYS.length}
            className="tap flex-1 py-3.5 rounded-2xl font-bold text-[14px] border-none text-white"
            style={{
              background: activeDay === DAYS.length ? "rgba(255,255,255,0.04)" : "#2E7D4F",
              color: activeDay === DAYS.length ? "rgba(255,255,255,0.15)" : "white",
              cursor: activeDay === DAYS.length ? "default" : "pointer",
            }}
          >
            Jour {activeDay < DAYS.length ? activeDay + 1 : ""} →
          </button>
        </div>
      </div>
    </div>
  );
}

const contactsContainerVariants = { show: { transition: { staggerChildren: 0.05 } } };
const contactsRowVariants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function ContactRow({ c }) {
  const digits = c.phone ? c.phone.replace(/[^\d+]/g, "") : null;
  return (
    <motion.div variants={contactsRowVariants} className="rounded-2xl bg-white/[0.05] border border-white/10 px-4 py-3.5 mb-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[14px] font-bold text-white truncate">{c.name}</div>
          {c.org && <div className="text-[11.5px] text-white/50 mt-0.5">{c.org}</div>}
          <div className="text-[10.5px] text-[#52B788] mt-1 font-semibold">📍 {c.zone}</div>
        </div>
      </div>
      {digits ? (
        <div className="flex gap-2 mt-3">
          <a href={`tel:${digits}`} className="tap flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#2E7D4F] text-white text-[12.5px] font-bold min-h-[44px]">
            📞 Appeler
          </a>
          <a
            href={`https://wa.me/${digits.replace("+", "")}`}
            target="_blank"
            rel="noreferrer"
            className="tap flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#25D366] text-white text-[12.5px] font-bold min-h-[44px]"
          >
            💬 WhatsApp
          </a>
        </div>
      ) : (
        <div className="mt-3 text-[11.5px] text-white/40 italic px-1">{c.note || "Contact sur place"}</div>
      )}
    </motion.div>
  );
}

function Contacts() {
  return (
    <div className="pb-[90px]">
      <div className="px-5 pt-[22px] pb-3">
        <div className="text-[10px] tracking-[2.5px] text-white/40 mb-1.5">Carnet d'adresses</div>
        <div className="text-[24px] font-extrabold text-white font-display">📞 Contacts</div>
        <div className="text-[12px] text-white/35 mt-1">Guides et hébergements du voyage</div>
      </div>

      <div className="px-5 mb-2">
        <div className="text-[11px] tracking-[2px] text-white/40 font-semibold mb-2.5">👤 GUIDES</div>
        <motion.div variants={contactsContainerVariants} initial="hidden" animate="show">
          {GUIDES.map((g) => (
            <ContactRow key={g.name} c={g} />
          ))}
        </motion.div>
      </div>

      <div className="px-5 mt-4">
        <div className="text-[11px] tracking-[2px] text-white/40 font-semibold mb-2.5">🏡 HÉBERGEMENTS</div>
        <motion.div variants={contactsContainerVariants} initial="hidden" animate="show">
          {LODGING.map((l) => (
            <ContactRow key={l.name} c={l} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function SpeciesArt({ entry, category, height, heroMode = false }) {
  const [loaded, setLoaded] = useState(false);
  const d = DANGER[entry.danger];
  const cols = (ART[entry.id] || "#0A1810,#152518,#080F0A").split(",");
  const photo = useUnsplashPhoto(speciesQuery(entry));

  return (
    <div className="relative overflow-hidden w-full" style={{ height }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: `linear-gradient(155deg, ${cols[0]}, ${cols[1]}, ${cols[0]})` }}>
        <div className="absolute inset-0" style={{ backgroundImage: categoryPatternUrl(category), backgroundSize: "56px 56px" }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${d.color}18, transparent 70%)` }} />
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

function DangerBar({ danger, size = "md" }) {
  const d = DANGER[danger];
  const h = size === "sm" ? 8 : 12;
  const isDeadly = danger === 5;

  return (
    <div>
      <div className="flex gap-1.5 mb-1" style={{ height: h }}>
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= danger;
          return (
            <div key={i} className="flex-1 rounded-full overflow-hidden relative" style={{ background: "rgba(255,255,255,0.1)" }}>
              {filled && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ transformOrigin: "left", background: d.color, boxShadow: `0 0 10px ${d.color}66` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              {filled && isDeadly && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)", width: "40%" }}
                  initial={{ x: "-120%" }}
                  animate={{ x: "220%" }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 1.1, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-[13px] font-bold" style={{ color: d.color }}>{d.label}</div>
        <div className="text-[15px] font-extrabold tabular-nums" style={{ color: d.color }}>
          {danger}<span className="text-[10px] opacity-50"> / 5</span>
        </div>
      </div>
    </div>
  );
}

const biodexModalVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 20 } },
};

function BiodexModal({ entry, category, onClose }) {
  const d = DANGER[entry.danger];
  return (
    <>
      <motion.div className="fixed inset-0 z-[200] bg-black/75" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        className="fixed inset-x-0 bottom-0 top-6 z-[201] mx-auto w-full max-w-[480px] bg-[#07160C] rounded-t-[28px] overflow-hidden flex flex-col"
        variants={biodexModalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="relative">
            <SpeciesArt entry={entry} category={category} height={280} heroMode />
            <div className="absolute bottom-0 left-0 right-0 h-28" style={{ background: "linear-gradient(to top, #07160C, transparent)" }} />
            <button onClick={onClose} className="tap absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center text-[15px]">
              ✕
            </button>
            <div className="absolute top-4 right-4 rounded-lg px-3.5 py-1.5 text-[12px] text-white font-extrabold" style={{ background: d.color }}>
              {d.label}
            </div>
          </div>
          <div className="px-5 pb-8">
            <div className="-mt-2 relative z-[2] mb-4">
              <div className="text-[28px] font-extrabold text-white leading-tight font-display">{entry.name}</div>
              <div className="text-[12px] text-white/40 italic font-mono-sci mt-1">{entry.latin}</div>
            </div>
            <div className="flex gap-2 flex-wrap mb-5">
              <div className="rounded-full px-3.5 py-1.5 text-[12px] text-white/55 bg-white/[0.07]">📍 {entry.zone}</div>
              <div className="rounded-full px-3.5 py-1.5 text-[12px] text-white/55 bg-white/[0.07]">🌿 {entry.habitat}</div>
            </div>
            <div className="rounded-2xl px-4 py-4 mb-4" style={{ background: d.bg, border: `1px solid ${d.color}30` }}>
              <div className="text-[10px] tracking-[2px] text-white/35 mb-3">DANGEROSITÉ</div>
              <DangerBar danger={entry.danger} />
            </div>
            <div className="rounded-2xl px-4 py-4 mb-3.5 bg-white/[0.04] border border-white/10">
              <div className="text-[10px] tracking-[2px] text-white/30 mb-3">DESCRIPTION</div>
              <div className="text-[14.5px] text-white/85 leading-relaxed">{entry.desc}</div>
            </div>
            <div className="rounded-2xl px-4 py-4" style={{ background: `${d.color}18`, border: `1px solid ${d.color}35` }}>
              <div className="text-[10px] tracking-[2px] mb-2.5" style={{ color: d.color }}>💡 LE SAVAIS-TU ?</div>
              <div className="text-[14.5px] text-white/85 leading-relaxed">{entry.fact}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

const biodexCardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
};

function BiodexCard({ entry, category, onOpenModal }) {
  const [flipped, setFlipped] = useState(false);
  const d = DANGER[entry.danger];
  const isDeadly = entry.danger === 5;

  return (
    <motion.div
      variants={biodexCardVariants}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="tap rounded-2xl overflow-hidden cursor-pointer relative"
      style={{ height: 208, border: `1.5px solid ${d.color}44`, perspective: 900 }}
      onClick={() => setFlipped((f) => !f)}
    >
      {isDeadly && (
        <motion.div
          className="absolute -inset-px rounded-2xl pointer-events-none z-10"
          style={{ boxShadow: `0 0 0 1.5px ${d.color}`, opacity: 0.7 }}
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <AnimatePresence initial={false} mode="wait">
        {!flipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            <SpeciesArt entry={entry} category={category} height={208} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.02) 55%)" }} />
            <div className="absolute top-[9px] right-[9px] rounded-lg px-2 py-0.5 text-[9px] font-extrabold text-white" style={{ background: `${d.color}EE` }}>
              {entry.danger}/5
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-[11px] py-2">
              <div className="flex gap-[3px] mb-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-[7px] h-[7px] rounded-full"
                    style={{ background: i <= entry.danger ? d.color : "rgba(255,255,255,0.2)", boxShadow: i <= entry.danger ? `0 0 4px ${d.color}` : "none" }}
                  />
                ))}
              </div>
              <div className="text-[13.5px] font-extrabold text-white leading-tight">{entry.name}</div>
              <div className="text-[9.5px] text-white/40 italic font-mono-sci mt-0.5">{entry.latin.split(" ").slice(0, 2).join(" ")}</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="absolute inset-0 px-3 py-2.5 flex flex-col"
            style={{ background: d.bg, transformStyle: "preserve-3d" }}
          >
            <div className="text-[12px] font-extrabold text-white leading-tight mb-1.5">{entry.name}</div>
            <DangerBar danger={entry.danger} size="sm" />
            <div className="text-[10.5px] text-white/75 leading-snug mt-2 flex-1 overflow-hidden">{entry.desc.slice(0, 92)}…</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(entry);
              }}
              className="tap mt-1.5 text-[10.5px] font-bold text-white rounded-lg py-2 text-center"
              style={{ background: d.color }}
            >
              Voir la fiche complète →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const biodexGridVariants = { show: { transition: { staggerChildren: 0.05 } } };

function Biodex() {
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
        (e) => e.name.toLowerCase().includes(q) || e.latin.toLowerCase().includes(q) || e.zone.toLowerCase().includes(q) || e.habitat.toLowerCase().includes(q)
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
        <div className="text-[12px] text-white/35 mt-1">{FAUNE.length + FLORE.length + ROCHES.length} espèces · Toucher pour la fiche</div>
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
          <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/50 text-[16px]">
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

      <motion.div className="px-3.5 grid grid-cols-2 gap-3" variants={biodexGridVariants} initial="hidden" animate="show" key={cat + search + dangerFilter + sortBy}>
        {filtered.map((entry) => (
          <BiodexCard key={entry.id} entry={entry} category={cat} onOpenModal={setModalEntry} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="px-5 py-12 text-center">
          <div className="text-[40px] mb-3">🔍</div>
          <div className="text-white/40 text-[14px]">Aucune espèce trouvée dans cette zone{search && ` pour "${search}"`}...</div>
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

      <AnimatePresence>{modalEntry && <BiodexModal entry={modalEntry} category={cat} onClose={() => setModalEntry(null)} />}</AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════ APP ═══════════════════════════════

export default function App() {
  const [tab, setTab] = useLocalStorage("cr_active_tab", "voyage");

  return (
    <div className="min-h-screen select-none" style={{ background: "linear-gradient(160deg, #08180E 0%, #0D2318 100%)" }}>
      <style>{`
        .tap { -webkit-tap-highlight-color: transparent; touch-action: manipulation; transition: transform .12s ease; }
        .tap:active { transform: scale(0.96); }
        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono-sci { font-family: 'Courier New', monospace; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
        select option { background: #0d1f14; color: white; }
      `}</style>
      <div style={{ paddingBottom: "calc(70px + env(safe-area-inset-bottom, 0px))" }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
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
