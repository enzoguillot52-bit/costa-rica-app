import { useState, useMemo, useEffect } from "react";

const CSS = `
  @keyframes cardIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes slideUp { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:none} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes imgFadeIn { from{opacity:0} to{opacity:1} }
  input::placeholder{color:rgba(255,255,255,0.28)}
  input:focus{outline:none;border-color:rgba(255,255,255,0.3)!important}
  select option{background:#0D1F14;color:white}
  ::-webkit-scrollbar{display:none}
  .tap:active{transform:scale(0.96)!important;transition:transform .1s!important}
`;

const DANGER = [
  null,
  { label:"Inoffensif", color:"#2AAB5A", bg:"#1A3D24" },
  { label:"Prudence",   color:"#D4A008", bg:"#3A2E08" },
  { label:"Attention",  color:"#E07615", bg:"#3A2010" },
  { label:"Dangereux",  color:"#D93025", bg:"#3A1010" },
  { label:"Mortel ☠️",  color:"#9B30FF", bg:"#2A1040" },
];

const ART = {
  f1: "#3D1200,#6B2800,#1A0800", f2: "#000820,#001840,#000A14",
  f3: "#1A0400,#350C00,#0D0200", f4: "#001008,#002815,#000A05",
  f5: "#001515,#002A28,#000D0D", f6: "#1A1200,#302200,#100C00",
  f7: "#001200,#002200,#000A00", f8: "#001525,#002A4A,#000D18",
  f9: "#0A1A05,#182E0A,#060E03", f10:"#0D1800,#1E2D00,#080E00",
  f11:"#1A0000,#360800,#0F0000", f12:"#100800,#201200,#080500",
  f13:"#1A1200,#2D2000,#0D0A00", f14:"#000818,#001030,#00050F",
  f15:"#180A00,#2D1500,#0C0600", p1: "#1A0000,#2D0500,#0F0000",
  p2: "#001200,#002200,#000A00", p3: "#1A0010,#300018,#0E0009",
  p4: "#0F0018,#1E0030,#08000F", p5: "#050A00,#0F1C00,#030600",
  p6: "#1A0A00,#2D1500,#0E0600", p7: "#1A0A00,#2D1600,#100800",
  p8: "#001500,#002800,#000C00", r1: "#080808,#181814,#040404",
  r2: "#020202,#0A0A0C,#010101", r3: "#001A0A,#003020,#000F06",
  r4: "#0A0A12,#15151F,#060610", r5: "#001428,#002040,#000A18",
  r6: "#08001A,#100030,#050010",
};

// Composant photo hybride : photo réelle → fallback CSS si échec
function EntryArt({ entry, height, heroMode }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  const d = DANGER[entry.danger];
  const cols = (ART[entry.id] || "#0A1810,#152518,#080F0A").split(",");

  const CSSFallback = (
    <div style={{
      position:"absolute", inset:0,
      background:`linear-gradient(155deg,${cols[0]},${cols[1]},${cols[0]})`,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    }}>
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 60% 60% at 50% 50%,${d.color}12,transparent 70%)` }} />
      <span style={{ fontSize: heroMode?"88px":"52px", filter:"drop-shadow(0 4px 16px rgba(0,0,0,.7))", animation:"float 4s ease-in-out infinite", lineHeight:1 }}>{entry.emoji}</span>
    </div>
  );

  return (
    <div style={{ width:"100%", height, position:"relative", overflow:"hidden" }}>
      {/* Fallback CSS toujours présent en dessous */}
      {CSSFallback}
      {/* Photo réelle par-dessus si elle charge */}
      {!err && entry.img && (
        <img
          src={entry.img}
          alt={entry.name}
          onLoad={() => setLoaded(true)}
          onError={() => setErr(true)}
          style={{
            position:"absolute", inset:0,
            width:"100%", height:"100%", objectFit:"cover",
            opacity: loaded ? 1 : 0,
            transition:"opacity .6s ease",
            animation: loaded ? "imgFadeIn .6s ease" : "none",
          }}
        />
      )}
    </div>
  );
}

// ─── DONNÉES ────────────────────────────────────────────────────────────────
const FAUNE = [
  { id:"f1",  emoji:"🐆", name:"Jaguar",              latin:"Panthera onca",          img:"https://source.unsplash.com/featured/400x300/?jaguar,wildcat",         habitat:"Forêt primaire",          zone:"Tortuguero · Osa",          danger:4, desc:"Le plus grand félin des Amériques chasse de nuit, souvent sur les plages de ponte. À Tortuguero en octobre, il est documenté chassant les tortues marines. C'est votre objectif principal du voyage — armez-vous de patience et faites confiance au guide.", fact:"Sa morsure est la plus puissante de tous les félins — il peut perforer un crâne d'alligator d'un seul coup de mâchoire. Il nage et grimpe parfaitement." },
  { id:"f2",  emoji:"🐸", name:"Dendrobate azuré",    latin:"Dendrobates azureus",    img:"https://source.unsplash.com/featured/400x300/?poison,dart,frog,blue",  habitat:"Forêt humide de plaine", zone:"Caraïbes · Osa",            danger:5, desc:"Ses couleurs éclatantes sont un avertissement fatal. Elle concentre les toxines des fourmis ingérées dans sa peau. En captivité sans proies sauvages, elle perd sa toxicité.", fact:"Un gramme de batrachotoxine suffit à tuer 1 000 adultes. Les peuples amérindiens frottaient leurs flèches sur son dos avant de chasser." },
  { id:"f3",  emoji:"🐍", name:"Terciopelo",          latin:"Bothrops asper",         img:"https://source.unsplash.com/featured/400x300/?venomous,snake,rainforest", habitat:"Forêt, rivières, nuit", zone:"Tout le Costa Rica",        danger:5, desc:"Responsable de 80% des morsures de serpent au Costa Rica. Venin hémotoxique qui détruit les tissus et bloque la coagulation. Nocturne, cryptique, très réactif si dérangé.", fact:"'Maître de la nuit' — son surnom local. Il sort exclusivement après les pluies tropicales. Lampe torche et bottes imperméables obligatoires." },
  { id:"f4",  emoji:"🐊", name:"Crocodile d'Amérique",latin:"Crocodylus acutus",      img:"https://source.unsplash.com/featured/400x300/?crocodile,reptile",      habitat:"Fleuves et estuaires",   zone:"Tárcoles · Côte Pacifique", danger:4, desc:"Le plus grand reptile d'Amérique centrale, atteignant 6m. Le pont de Tárcoles héberge des dizaines de crocodiles visibles depuis le parapet. Ne jamais nager dans les rivières côtières.", fact:"40 crocodiles peuvent être comptés simultanément sous le pont de Tárcoles. Arrêt libre et gratuit à 45 min de San José." },
  { id:"f5",  emoji:"🦎", name:"Caïman à lunettes",   latin:"Caiman crocodilus",      img:"https://source.unsplash.com/featured/400x300/?caiman,alligator,water", habitat:"Canaux et lagunes",      zone:"Tortuguero · Caraïbes",     danger:3, desc:"Plus petit que le croco (max 2,5m). Très commun dans les canaux de Tortuguero. La nuit, leurs yeux brillent rouge orangé dans une lampe torche — vision inoubliable depuis la pirogue.", fact:"Ses dents ne coupent pas — elles saisissent. Il fait tournoyer sa proie pour la noyer ou arracher des morceaux." },
  { id:"f6",  emoji:"🦁", name:"Puma",                latin:"Puma concolor",          img:"https://source.unsplash.com/featured/400x300/?puma,mountain,lion,cat", habitat:"Forêt et montagne",      zone:"Monteverde · Arenal",       danger:3, desc:"Nocturne et extrêmement discret, il évite activement l'humain. Si rencontre : ne fuyez jamais, faites-vous grand, parlez calmement, reculez lentement sans perdre le contact visuel.", fact:"Il détient le record de distribution géographique des mammifères terrestres des Amériques — du Yukon à la Patagonie." },
  { id:"f7",  emoji:"🐒", name:"Singe hurleur",       latin:"Alouatta palliata",      img:"https://source.unsplash.com/featured/400x300/?howler,monkey,primate",  habitat:"Canopée tropicale",      zone:"Tortuguero · Arenal",       danger:2, desc:"Son rugissement porte à 5 km — l'un des sons les plus forts produits par un mammifère. Si stressé, il peut défécaliser depuis la canopée. Prévenu = préparé.", fact:"Le hurlement collectif à 5h du matin dans la jungle de Tortuguero est l'une des expériences sonores les plus impressionnantes du voyage." },
  { id:"f8",  emoji:"🐢", name:"Tortue verte",        latin:"Chelonia mydas",         img:"https://source.unsplash.com/featured/400x300/?sea,turtle,ocean,green", habitat:"Océan + plages de ponte",zone:"Tortuguero (juil–oct)",     danger:1, desc:"Parcourt jusqu'à 2 000 km pour revenir pondre sur la plage exacte de sa naissance. Tortuguero est l'un des plus grands sites de ponte au monde. Observation uniquement de nuit avec guide SINAC.", fact:"Une femelle pond jusqu'à 7 fois par saison (~100 œufs à chaque fois). Elle ne reverra jamais ses petits — ils rejoignent l'océan seuls." },
  { id:"f9",  emoji:"🦥", name:"Paresseux à 3 doigts",latin:"Bradypus variegatus",    img:"https://source.unsplash.com/featured/400x300/?sloth,animal,tropical",  habitat:"Canopée tropicale",      zone:"Partout au Costa Rica",     danger:1, desc:"Descend de son arbre une seule fois par semaine pour déféquer. Des algues vertes colonisent sa fourrure comme camouflage. Son métabolisme est si lent qu'il peut mettre un mois à digérer une feuille.", fact:"Il a 9 vertèbres cervicales contre 7 pour les mammifères — il peut tourner la tête à 270°. Son cœur bat 6 fois par minute." },
  { id:"f10", emoji:"🦜", name:"Toucan à bec caréné", latin:"Ramphastos sulfuratus",  img:"https://source.unsplash.com/featured/400x300/?toucan,bird,tropical",   habitat:"Forêt et lisières",      zone:"Tortuguero · Caraïbes",     danger:1, desc:"Son bec démesuré représente un tiers de sa longueur mais est creux et ultraléger — un radiateur naturel rempli de vaisseaux sanguins. Vole en groupes bruyants à l'aube.", fact:"En dormant, le toucan replie son bec sur son dos et enroule sa queue — pour tenir dans un trou d'arbre exactement à sa dimension." },
  { id:"f11", emoji:"🦜", name:"Ara rouge",           latin:"Ara macao",              img:"https://source.unsplash.com/featured/400x300/?scarlet,macaw,parrot",   habitat:"Forêt primaire côtière", zone:"Osa · Carara · Quepos",     danger:1, desc:"Monogame pour la vie — la perte du partenaire peut provoquer une dépression. Son cri strident annonce l'aube. Les gardes de l'Osa reconnaissent les couples individuellement.", fact:"Il vit jusqu'à 75 ans et développe une personnalité distincte. Certains aras de l'Osa sont suivis par des biologistes depuis les années 1990." },
  { id:"f12", emoji:"🕷️",name:"Tarantule du CR",     latin:"Brachypelma sp.",        img:"https://source.unsplash.com/featured/400x300/?tarantula,spider",       habitat:"Terriers en forêt",      zone:"Pacifique · zone sèche",    danger:2, desc:"Non mortelle pour un adulte. Morsure douloureuse avec nausées. Défense principale : projeter des poils urticants de son abdomen — irritation oculaire grave possible.", fact:"La femelle vit 25-30 ans. Elle mue toute sa carapace chaque année — y compris ses yeux, ses poumons et ses crochets venimeux." },
  { id:"f13", emoji:"🦂", name:"Scorpion forestier",  latin:"Centruroides limbatus",  img:"https://source.unsplash.com/featured/400x300/?scorpion,arachnid",     habitat:"Sous pierres et écorce", zone:"Côtes Pacifique et Caraïbe",danger:3, desc:"Piqûre : engourdissements, crampes, parfois difficultés respiratoires. Rarement mortelle pour un adulte — sérieuse pour les enfants. Actif exclusivement la nuit.", fact:"Règle absolue en trek : secouer ses chaussures chaque matin. Les scorpions se glissent dans la chaleur résiduelle pendant la nuit." },
  { id:"f14", emoji:"🐋", name:"Baleine à bosse",     latin:"Megaptera novaeangliae", img:"https://source.unsplash.com/featured/400x300/?humpback,whale,ocean",   habitat:"Eaux côtières chaudes",  zone:"Marino Ballena · Uvita",    danger:1, desc:"Migre depuis le Pacifique nord ET sud pour mettre bas à Uvita — phénomène unique au monde. Octobre est le pic de présence. Les sauts sont spectaculaires depuis un petit bateau.", fact:"Sa chanson peut durer 20h et s'entendre à 800 km. Toutes les baleines d'un même bassin chantent la même chanson, qui évolue collectivement chaque saison." },
  { id:"f15", emoji:"🐍", name:"Boa constricteur",    latin:"Boa constrictor",        img:"https://source.unsplash.com/featured/400x300/?boa,constrictor,snake",  habitat:"Forêt et lisières",      zone:"Tout le Costa Rica",        danger:2, desc:"Non venimeux, tue par constriction en synchronisant la pression avec les expirations. Peut atteindre 4m. Évite l'humain. Une morsure reste douloureuse (100 petites dents).", fact:"Il peut digérer un cerf entier sur plusieurs semaines, puis ne plus manger pendant 6 mois. Sa mâchoire se désarticule pour avaler des proies 4x plus larges." },
];
const FLORE = [
  { id:"p1", emoji:"🌳", name:"Mancenillier",       latin:"Hippomane mancinella",  img:"https://source.unsplash.com/featured/400x300/?tropical,beach,tree,danger",    habitat:"Plages côtières",           zone:"Côtes Caraïbe et Pacifique",danger:5, desc:"Classé arbre le plus dangereux du monde (Guinness). Sa sève provoque des brûlures chimiques graves. S'abriter dessous sous la pluie = cloques garanties. Fumée du bois brûlé = lésions pulmonaires.", fact:"Les Conquistadors l'appelaient 'árbol de la muerte'. Ses fruits ressemblent à des pommes parfumées et sont mortels à ingérer." },
  { id:"p2", emoji:"🌿", name:"Dieffenbachia",      latin:"Dieffenbachia seguine", img:"https://source.unsplash.com/featured/400x300/?tropical,plant,green,leaves",   habitat:"Sous-bois humide",          zone:"Tortuguero · Caraïbes",      danger:3, desc:"Commune en bord de sentier. Mâcher une feuille provoque un gonflement de la langue et de la gorge pouvant bloquer les voies respiratoires pendant des heures.", fact:"Son surnom anglais est 'dumb cane' — elle prive sa victime de la parole. Vendue comme plante d'intérieur dans le monde entier." },
  { id:"p3", emoji:"🌺", name:"Héliconie",          latin:"Heliconia rostrata",    img:"https://source.unsplash.com/featured/400x300/?heliconia,tropical,flower",     habitat:"Lisières de forêt",         zone:"Partout au Costa Rica",      danger:1, desc:"Ses bractées en toboggan recueillent 0,5 à 2L d'eau par rosette — de vraies mini-mares aériennes hébergeant des dendrobates, larves et micro-crustacés.", fact:"Chaque courbe de sa fleur correspond exactement au bec d'un oiseau-mouche précis — co-évolution parfaite sur des millions d'années." },
  { id:"p4", emoji:"💐", name:"Orchidée épiphyte",  latin:"Cattleya dowiana",      img:"https://source.unsplash.com/featured/400x300/?orchid,tropical,flower",        habitat:"Canopée forêt nuageuse",    zone:"Monteverde · Arenal",        danger:1, desc:"Le Costa Rica abrite plus de 1 400 espèces d'orchidées. Les épiphytes poussent sur l'écorce sans parasiter l'arbre, captant eau et nutriments de l'air seul.", fact:"Certaines orchidées imitent l'odeur et la forme de femelles insectes pour attirer les mâles pollinisateurs — manipulation évolutive pure." },
  { id:"p5", emoji:"🌲", name:"Figuier étrangleur", latin:"Ficus obtusifolia",     img:"https://source.unsplash.com/featured/400x300/?strangler,fig,tree,roots",      habitat:"Forêt tropicale primaire",  zone:"Tortuguero · Osa",           danger:1, desc:"La graine germe en canopée et envoie des racines vers le sol pendant 50-100 ans, ensserrant l'hôte jusqu'à l'étouffer — un meurtre végétal au ralenti.", fact:"Une fois l'hôte mort, le figuier forme une cathédrale creuse de racines entrelacées — habitat pour des dizaines d'espèces simultanées." },
  { id:"p6", emoji:"🌸", name:"Broméliade géante",  latin:"Tillandsia fasciculata", img:"https://source.unsplash.com/featured/400x300/?bromeliad,tropical,plant",      habitat:"Branches d'arbres",         zone:"Monteverde · Caraïbes",      danger:1, desc:"Accumule l'eau dans ses rosettes — de vraies mares aériennes. Ces réservoirs sont des écosystèmes complets où grenouilles et crustacés passent toute leur vie.", fact:"L'ananas que vous mangez est une broméliacée domestiquée. Ses ancêtres sauvages poussent librement dans les forêts costaricaines." },
  { id:"p7", emoji:"🫘", name:"Cacao sauvage",      latin:"Theobroma cacao",       img:"https://source.unsplash.com/featured/400x300/?cacao,chocolate,pod,tropical",  habitat:"Sous-bois forêt tropicale", zone:"Zone Bribri · Caraïbes Sud", danger:1, desc:"L'ancêtre du chocolat pousse naturellement en forêt caribéenne. Les Bribri le cultivent depuis 3 000 ans. Les cabosses poussent directement sur le tronc.", fact:"Theobroma = 'nourriture des dieux' en grec. À Cahuita, les guides Bribri vous apprendront à faire du chocolat en 30 min avec des pods sauvages." },
  { id:"p8", emoji:"🌱", name:"Ortie géante",       latin:"Urera baccifera",       img:"https://source.unsplash.com/featured/400x300/?stinging,nettle,plant",          habitat:"Forêt secondaire, lisières",zone:"Tout le Costa Rica",         danger:2, desc:"Poils urticants sur tiges ET feuilles injectant de l'acide formique au moindre contact. Brûlure intense de 30min à plusieurs heures. Commune en bord de sentier.", fact:"Les peuples amérindiens l'utilisent pour traiter les douleurs arthritiques — la brûlure locale provoque une réaction anti-inflammatoire naturelle." },
];
const ROCHES = [
  { id:"r1", emoji:"🪨", name:"Basalte volcanique", latin:"Roche magmatique basique", img:"https://source.unsplash.com/featured/400x300/?volcanic,lava,rock",           habitat:"Coulées de lave refroidies",  zone:"Arenal · Poás · Irazú",   danger:1, desc:"Roche la plus commune du Costa Rica. Va du lisse (presque vitreux) au très rugueux (scorie). Noire à gris sombre selon le taux de refroidissement.", fact:"Les sentiers du Parc Arenal serpentent sur les coulées de basalte de l'éruption de 1968 qui rasa 3 villages — encore visibles 55 ans après." },
  { id:"r2", emoji:"⬛", name:"Obsidienne",          latin:"Verre volcanique naturel",  img:"https://source.unsplash.com/featured/400x300/?obsidian,black,volcanic,glass", habitat:"Zones de refroidissement rapide",zone:"Volcans du Costa Rica",  danger:2, desc:"Verre naturel formé par le refroidissement quasi-instantané de lave. Tranchant au niveau moléculaire — plus fin qu'un rasoir en acier. Maniement avec précaution absolue.", fact:"Les Mayas fabriquaient leurs instruments chirurgicaux en obsidienne. Certains chirurgiens modernes l'utilisent encore en microchirurgie oculaire." },
  { id:"r3", emoji:"💚", name:"Jade (Jadéite)",     latin:"NaAlSi₂O₆",                img:"https://source.unsplash.com/featured/400x300/?jade,green,gemstone",            habitat:"Zones de subduction",        zone:"Vallée centrale du CR",   danger:1, desc:"Le Costa Rica possède les seuls gisements de jadéite de qualité d'Amérique centrale. Plus précieux que l'or pour les cultures précolombiennes. Vert pomme distinctif.", fact:"Le Musée du Jade à San José a la plus grande collection précolombienne au monde. Un masque en jadéite peut valoir plusieurs millions d'euros." },
  { id:"r4", emoji:"🔮", name:"Sphères de pierre",  latin:"Esferas Diquís (200–1500)", img:"https://source.unsplash.com/featured/400x300/?ancient,stone,sphere,mystery",  habitat:"Delta du Diquís, Osa",       zone:"Péninsule d'Osa",         danger:1, desc:"Sphères de granite parfaitement rondes, de 10cm à 2,6m et jusqu'à 16 tonnes. Créées par la culture Diquís. Fonction inconnue. Patrimoine Mondial UNESCO 2014.", fact:"Comment tailler une sphère parfaite sans outils métalliques ni instruments de mesure reste un mystère archéologique total non résolu." },
  { id:"r5", emoji:"🪸", name:"Calcaire corallien", latin:"Calcite biogénique",        img:"https://source.unsplash.com/featured/400x300/?coral,reef,underwater,ocean",   habitat:"Plateformes récifales",      zone:"Cahuita · Isla del Caño", danger:1, desc:"Chaque bloc blanc qui affleure à Cahuita était un récif vivant — siècles de squelettes de coraux calcifiés. Le seul récif costaricain est en danger critique.", fact:"Les sédiments agricoles de la rivière Estrella ont étouffé 70% du récif de Cahuita depuis les années 90. Ce que vous snorkelerez est peut-être en train de disparaître." },
  { id:"r6", emoji:"💎", name:"Opale cristalline",  latin:"SiO₂·nH₂O",                img:"https://source.unsplash.com/featured/400x300/?opal,gemstone,crystal",          habitat:"Veines hydrothermales",      zone:"Zone volcanique centrale", danger:1, desc:"Formée dans les fissures volcaniques par des fluides hydrothermaux. Diffracte la lumière en arcs-en-ciel irisés selon l'angle de vue.", fact:"L'opale contient jusqu'à 20% d'eau emprisonnée. Si elle sèche trop vite, elle se fissure irrémédiablement — toujours garder une opale brute humide." },
];

const CATS = { faune:{label:"Faune",emoji:"🦁",data:FAUNE,accent:"#C47210"}, flore:{label:"Flore",emoji:"🌿",data:FLORE,accent:"#1F7A45"}, roches:{label:"Roches",emoji:"🪨",data:ROCHES,accent:"#3A6B8F"} };
const ZONES = { transit:{label:"Transit",color:"#B5722A",light:"#FEF3E4",dark:"#7A4B1A"}, caraibe:{label:"Caraïbes",color:"#0085A8",light:"#DFF4FB",dark:"#005C78"}, pacific:{label:"Pacifique",color:"#2E7D4F",light:"#E2F4E8",dark:"#1A5232"} };
const DAYS=[{id:1,date:"1 Oct",zone:"transit",emoji:"🛬",title:"Arrivée → La Fortuna",region:"Arenal",weather:{icon:"⛅",label:"Nuageux · averses PM",temp:"26°C"},activities:["Navette directe SJO → La Fortuna (3h, Interbus)","Départ direct de l'aéroport — zéro San José !","Arrivée, premiers pas en jungle tico"],sleep:{name:"Alpha Arenal Hostel",price:35},eat:{name:"Soda El Turnito",detail:"Casado local + jus de fruits · ~9$"},guide:null,budget:{"🏡":35,"🍽️":25,"🚌":30,"🎯":0},tip:"La navette Interbus repart directement de l'aéroport. Évitez San José.",highlight:"Premier contact avec la nature tico — le volcan Arenal vous accueille 🌋"},{id:2,date:"2 Oct",zone:"pacific",emoji:"🌋",title:"La Fortuna / Arenal",region:"Arenal",weather:{icon:"🌤",label:"Matins clairs · pluie après 15h",temp:"27°C"},activities:["7h : Parc Volcan Arenal — sentiers de lave, toucans, coatis","13h : Sources thermales naturelles gratuites (Río Chollin)","19h : Night tour Sergio — grenouilles venimeuses, kinkajous"],sleep:{name:"Alpha Arenal Hostel",price:35},eat:{name:"Soda Rodríguez",detail:"La cabane dans les arbres · ~10$"},guide:{name:"Sergio — Sloth Tour",phone:"+506 6295 9008",price:35,note:"⭐ 5.0"},budget:{"🏡":35,"🍽️":30,"🚌":0,"🎯":50},tip:"Activités avant 14h — la pluie arrive à l'heure. Sources thermales gratuites sur la rivière.",highlight:"Night tour : kinkajous avec bébés, grenouilles dart sous UV 🐸🌙"},{id:3,date:"3 Oct",zone:"transit",emoji:"🚤",title:"La Fortuna → Tortuguero",region:"Tortuguero",weather:{icon:"🌦",label:"Variable · nuageux",temp:"28°C"},activities:["7h30 : Bus La Fortuna → Caño Blanco (3h)","10h30 : Bateau La Pavona → Tortuguero (1h30 en jungle)","Arrivée au village — accessible à pied seulement"],sleep:{name:"Hostal y Cabinas Tortuguero",price:35},eat:{name:"Soda D'Leite",detail:"Gallo pinto, patacones · ~8$"},guide:null,budget:{"🏡":35,"🍽️":25,"🚌":35,"🎯":0},tip:"Pas besoin de San José ! L'arrivée en bateau dans les canaux est déjà un spectacle.",highlight:"L'arrivée en pirogue à Tortuguero — bienvenue en Amazonie 🐊"},{id:4,date:"4 Oct",zone:"caraibe",emoji:"🐊",title:"Tortuguero — Les canaux",region:"Tortuguero",weather:{icon:"🌤",label:"Veranillo caribéen",temp:"29°C"},activities:["6h–10h : Canoë dans les canaux avec Arturo","Caimans, loutres géantes, singes araignées, anacondas","Après-midi : Musée des tortues marines + village"],sleep:{name:"Hostal y Cabinas Tortuguero",price:35},eat:{name:"El Patio de Tortuguero",detail:"Vue canal · crevettes coco · ~13$"},guide:{name:"Arturo — Bio-Eco Adventures",phone:"+506 7210 8753",price:45,note:"⭐ 5.0"},budget:{"🏡":35,"🍽️":30,"🚌":0,"🎯":55},tip:"Partir à 6h avant le vent — caimans et singes actifs dans le brouillard matinal.",highlight:"Canoë dans des canaux où les arbres se rejoignent au-dessus 🌿"},{id:5,date:"5 Oct",zone:"caraibe",emoji:"🐆",title:"Tortuguero — Traque du jaguar",region:"Tortuguero",weather:{icon:"🌤",label:"Bonnes conditions · veranillo",temp:"28°C"},activities:["6h : Sendero Jaguar 4h avec Pablo Nana","Après-midi : Kayak libre dans les mangroves","22h : Tour nocturne plage — ponte de tortues vertes 🐢"],sleep:{name:"Hostal y Cabinas Tortuguero",price:35},eat:{name:"Soda D'Leite",detail:"Poisson du jour + batido passion · ~9$"},guide:{name:"Pablo 'Nana' — Nature Native",phone:"+506 8461 5233",price:25,note:"⭐ 4.8 · Natif de Tortuguero"},budget:{"🏡":35,"🍽️":30,"🚌":0,"🎯":40},tip:"Départ 6h PILE — les jaguars rentrent de la plage à l'aube. Silencieux et bottes obligatoires.",highlight:"Sendero Jaguar à l'aube + affût plage tortues — jour le plus intense 🐆🌙"},{id:6,date:"6 Oct",zone:"transit",emoji:"🌴",title:"Tortuguero → Cahuita",region:"Caraïbes Sud",weather:{icon:"☀️",label:"Veranillo — beau temps !",temp:"30°C"},activities:["Matin : Bateau Tortuguero → La Pavona","Bus via Limón → Cahuita (3h, Limón = transit rapide)","Arrivée Cahuita — première vraie baignade dans les Caraïbes !"],sleep:{name:"Wildlife Lodge Cahuita (Fernando)",price:40},eat:{name:"Soda Kawe",detail:"Poulet caraïbe au feu de bois · ~10$"},guide:null,budget:{"🏡":40,"🍽️":25,"🚌":30,"🎯":0},tip:"Fernando au lodge organise tous les tours + night tours + cacao Bribri.",highlight:"Première baignade dans les eaux turquoise des Caraïbes 🏊‍♀️"},{id:7,date:"7 Oct",zone:"caraibe",emoji:"🐠",title:"Cahuita — Récif & plage",region:"Caraïbes Sud",weather:{icon:"☀️",label:"Octobre = un des meilleurs mois côté Caraïbe",temp:"31°C"},activities:["8h : Parc National Cahuita — snorkeling récif corallien (gratuit !)","Plage Blanche — baignade, paresseux dans les arbres","17h : Tour cacao & culture Bribri avec Fernando"],sleep:{name:"Wildlife Lodge Cahuita (Fernando)",price:40},eat:{name:"Soda Kawe",detail:"Casado poisson frais + jus passion · ~10$"},guide:{name:"Fernando — Wildlife Lodge",phone:"Via le lodge",price:30,note:"Tour cacao Bribri inclus"},budget:{"🏡":40,"🍽️":30,"🚌":0,"🎯":35},tip:"Snorkeling à 8h pour la meilleure visibilité. Parc gratuit. Paresseux quasi garantis !",highlight:"Snorkeling récif + paresseux à 2m + tour cacao Bribri 🦥🐠"},{id:8,date:"8 Oct",zone:"transit",emoji:"🏄",title:"Puerto Viejo → Monteverde",region:"Transition",weather:{icon:"🌤",label:"Matin caraïbe doux · brouillard Monteverde",temp:"28°C"},activities:["7h : Surf Playa Cocles (Tony — Pirate's Surf School)","10h : Bus Puerto Viejo → San José (4h)","15h : Bus San José → Monteverde (3h)"],sleep:{name:"OutBox Inn Monteverde",price:45},eat:{name:"Soda La Herencia MTV",detail:"Nachos, empanadas, jus mangue · ~10$"},guide:null,budget:{"🏡":45,"🍽️":25,"🚌":25,"🎯":40},tip:"Long jour de transit — le surf tôt matin compense ! Juste le terminal à San José.",highlight:"L'adieu aux Caraïbes sur une planche de surf 🏄🌅"},{id:9,date:"9 Oct",zone:"pacific",emoji:"🦜",title:"Monteverde — Forêt nuageuse",region:"Monteverde",weather:{icon:"🌧",label:"Brumeux · bruine — essence de Monteverde",temp:"18°C"},activities:["Matin : Réserve Monteverde — sentiers suspendus à 50m","Observation quetzal resplendissant avec guide Jason","20h : Night tour — grenouilles yeux rouges, vipères cils"],sleep:{name:"OutBox Inn Monteverde",price:45},eat:{name:"Soda La Amistad",detail:"Bistec, frijoles noirs, jus guanabana · ~11$"},guide:{name:"Jason — Monteverde Nature",phone:"+506 8636 0491",price:50,note:"⭐ 5.0 · Le chuchoteur de quetzals"},budget:{"🏡":45,"🍽️":35,"🚌":0,"🎯":65},tip:"Il fait 18°C — emportez un pull ! Le brouillard fait partie de l'expérience.",highlight:"Voir un quetzal resplendissant — l'oiseau le plus beau des Amériques 🦜"},{id:10,date:"10 Oct",zone:"transit",emoji:"🚌",title:"Monteverde → Uvita",region:"Pacifique Sud",weather:{icon:"🌧",label:"Pluies Pacifique — normales en octobre",temp:"30°C"},activities:["Bus Monteverde → Puntarenas (2h30)","Bus côtier Puntarenas → Uvita (4h — mer à gauche !)","Arrivée Uvita, repérage Parc Marino Ballena"],sleep:{name:"Karandi Hostel Uvita",price:30},eat:{name:"Soda Ranchito Doña Maria",detail:"Arroz camarones + smoothie · ~9$"},guide:null,budget:{"🏡":30,"🍽️":25,"🚌":20,"🎯":0},tip:"La route Costanera est une des plus belles du pays — Pacifique à gauche toute la route.",highlight:"Premier aperçu de la queue de baleine de Punta Uvita 🐋"},{id:11,date:"11 Oct",zone:"pacific",emoji:"🐋",title:"Uvita — Baleines à bosse",region:"Pacifique Sud",weather:{icon:"🌦",label:"Pluies mais sorties en mer possibles le matin",temp:"31°C"},activities:["7h : Whale watching baleines à bosse + baleineaux","Snorkeling île Caño avec dauphins et tortues","Après-midi : Plage queue de baleine à marée basse !"],sleep:{name:"Karandi Hostel Uvita",price:30},eat:{name:"Soda Los Papuchones",detail:"Casado + fresco maison · ~8$"},guide:{name:"La Ballena Tour",phone:"+506 8845 1233",price:85,note:"⭐ 4.8 · Whale watching"},budget:{"🏡":30,"🍽️":25,"🚌":0,"🎯":95},tip:"Octobre = pic saison baleines à bosse. Tour le matin — mer plus calme.",highlight:"Baleines à bosse et baleineaux à 20m du bateau 🐋🐋"},{id:12,date:"12 Oct",zone:"transit",emoji:"✈️",title:"Uvita → Péninsule d'Osa",region:"Péninsule d'Osa",weather:{icon:"🌧",label:"Très humide — pic saison des pluies",temp:"30°C"},activities:["Option ✈️ : Petit avion SJO → Puerto Jiménez (30min)","Option 🚌 : Bus Uvita → San Isidro → Puerto Jiménez (6-7h)","Arrivée Drake Bay — nuit chez Emilio (pension complète)"],sleep:{name:"Rio Agujitas Farm (Emilio)",price:35},eat:{name:"Pension complète incluse 🍽️",detail:"Emilio cuisine avec les produits locaux"},guide:null,budget:{"🏡":35,"🍽️":0,"🚌":120,"🎯":0},tip:"L'avion interne vaut le coup pour la vue sur l'Osa. Piste en herbe — expérience en soi.",highlight:"L'approche aérienne de la péninsule d'Osa — jungle primaire vue du ciel 🌿✈️"},{id:13,date:"13 Oct",zone:"pacific",emoji:"🌿",title:"Péninsule d'Osa — Faune primaire",region:"Péninsule d'Osa",weather:{icon:"🌧",label:"Humide — les animaux très actifs !",temp:"30°C"},activities:["5h30 : Tour aube avec Emilio — tapirs, 4 espèces de singes","Randonnée forêt primaire de Drake Bay","Soir : Bioluminescence dans l'estuaire"],sleep:{name:"Rio Agujitas Farm (Emilio)",price:35},eat:{name:"Pension complète incluse 🍽️",detail:"Fruits locaux, poisson frais, cuisine maison"},guide:{name:"Emilio — Rio Agujitas Farm",phone:"+506 8698 1841",price:40,note:"⭐ 4.8 · Natif + pension"},budget:{"🏡":35,"🍽️":0,"🚌":0,"🎯":50},tip:"Corcovado fermé tout octobre. Drake Bay = forêt primaire comparable avec Emilio.",highlight:"Tapirs et 4 espèces de singes à l'aube + bioluminescence 🌿🌊"},{id:14,date:"14 Oct",zone:"transit",emoji:"🌅",title:"Osa → San José — Retour",region:"Retour",weather:{icon:"🌧",label:"Dernier matin tropical",temp:"30°C"},activities:["5h–8h : Dernier tour alba — tapirs sur la plage","Vol Puerto Jiménez → San José (Sansa, ~13h)","Vol international depuis SJO · Pura Vida !"],sleep:{name:"Aéroport / Vol",price:0},eat:{name:"Dernière noix de coco 🥥",detail:"Et patacones à l'aéroport !"},guide:null,budget:{"🏡":0,"🍽️":15,"🚌":120,"🎯":0},tip:"Aéroport Puerto Jiménez : arriver 1h avant. Piste en herbe — une dernière aventure.",highlight:"Dernier lever de soleil sur l'Osa · Pura Vida pour toujours 🌅"}];

// ─── FICHE DÉTAIL ──────────────────────────────────────────────────────────
function DetailPage({ entry, onBack }) {
  const d = DANGER[entry.danger];
  return (
    <div style={{ minHeight:"100vh", background:"#07160C", paddingBottom:40, animation:"slideUp .3s ease" }}>
      <div style={{ position:"sticky",top:0,zIndex:20,background:"rgba(7,22,12,0.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",padding:"12px 16px",gap:10 }}>
        <button onClick={onBack} className="tap" style={{ background:`${d.color}22`,border:`1px solid ${d.color}55`,borderRadius:10,padding:"8px 16px",color:d.color,fontSize:13,fontWeight:700,cursor:"pointer" }}>← Retour</button>
        <div style={{ flex:1,textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:2 }}>BIODEX · FICHE</div>
        <div style={{ width:60 }} />
      </div>
      <div style={{ position:"relative",overflow:"hidden" }}>
        <EntryArt entry={entry} height={300} heroMode={true} />
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:120,background:"linear-gradient(to top,#07160C,transparent)" }} />
        <div style={{ position:"absolute",top:16,right:16,background:d.color,borderRadius:10,padding:"5px 14px",fontSize:12,color:"white",fontWeight:800 }}>{d.label}</div>
      </div>
      <div style={{ padding:"0 20px" }}>
        <div style={{ marginTop:-10,zIndex:2,position:"relative",marginBottom:16 }}>
          <div style={{ fontSize:30,fontWeight:800,color:"white",lineHeight:1.1 }}>{entry.name}</div>
          <div style={{ fontSize:12,color:"rgba(255,255,255,0.38)",fontStyle:"italic",fontFamily:"'Courier New',monospace",marginTop:5 }}>{entry.latin}</div>
        </div>
        <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20 }}>
          <div style={{ background:"rgba(255,255,255,0.07)",borderRadius:20,padding:"5px 13px",fontSize:12,color:"rgba(255,255,255,0.55)" }}>📍 {entry.zone}</div>
          <div style={{ background:"rgba(255,255,255,0.07)",borderRadius:20,padding:"5px 13px",fontSize:12,color:"rgba(255,255,255,0.55)" }}>🌿 {entry.habitat}</div>
        </div>
        <div style={{ background:`${d.bg}`,borderRadius:16,padding:"16px 18px",marginBottom:18,border:`1px solid ${d.color}30` }}>
          <div style={{ fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.35)",marginBottom:12 }}>DANGEROSITÉ</div>
          <div style={{ display:"flex",gap:8,marginBottom:10 }}>
            {[1,2,3,4,5].map(i=><div key={i} style={{ flex:1,height:12,borderRadius:6,background:i<=entry.danger?d.color:"rgba(255,255,255,0.1)",boxShadow:i<=entry.danger?`0 0 10px ${d.color}66`:"none" }}/>)}
          </div>
          <div style={{ display:"flex",justifyContent:"space-between" }}>
            <div style={{ fontSize:16,fontWeight:700,color:d.color }}>{d.label}</div>
            <div style={{ fontSize:22,fontWeight:900,color:d.color }}>{entry.danger}<span style={{ fontSize:13,opacity:.5 }}> / 5</span></div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:16,padding:"18px",marginBottom:14,border:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize:10,letterSpacing:2,color:"rgba(255,255,255,0.3)",marginBottom:12 }}>DESCRIPTION</div>
          <div style={{ fontSize:14.5,color:"rgba(255,255,255,0.85)",lineHeight:1.75 }}>{entry.desc}</div>
        </div>
        <div style={{ background:`${d.color}18`,borderRadius:16,padding:"18px",border:`1px solid ${d.color}35` }}>
          <div style={{ fontSize:10,letterSpacing:2,color:d.color,marginBottom:10 }}>💡 LE SAVAIS-TU ?</div>
          <div style={{ fontSize:14.5,color:"rgba(255,255,255,0.85)",lineHeight:1.75 }}>{entry.fact}</div>
        </div>
      </div>
    </div>
  );
}

function BiodexCard({ entry, idx, onSelect }) {
  const d = DANGER[entry.danger];
  return (
    <div className="tap" onClick={onSelect} style={{ borderRadius:16,overflow:"hidden",cursor:"pointer",height:190,position:"relative",animation:`cardIn .3s ease ${Math.min(idx*.04,.5)}s both`,border:`1.5px solid ${d.color}44`,transition:"transform .2s" }}>
      <EntryArt entry={entry} height={190} heroMode={false} />
      <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.02) 55%)" }} />
      <div style={{ position:"absolute",top:9,right:9,background:`${d.color}EE`,borderRadius:8,padding:"2px 8px",fontSize:9,color:"white",fontWeight:800 }}>{entry.danger}/5</div>
      <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"8px 11px" }}>
        <div style={{ display:"flex",gap:3,marginBottom:5 }}>{[1,2,3,4,5].map(i=><div key={i} style={{ width:7,height:7,borderRadius:"50%",background:i<=entry.danger?d.color:"rgba(255,255,255,0.2)",boxShadow:i<=entry.danger?`0 0 4px ${d.color}`:"none" }}/>)}</div>
        <div style={{ fontSize:13.5,fontWeight:800,color:"white",lineHeight:1.2 }}>{entry.name}</div>
        <div style={{ fontSize:9.5,color:"rgba(255,255,255,0.4)",fontStyle:"italic",fontFamily:"'Courier New',monospace",marginTop:2 }}>{entry.latin.split(" ").slice(0,2).join(" ")}</div>
      </div>
      <div style={{ position:"absolute",bottom:13,right:11,fontSize:16,color:"rgba(255,255,255,0.4)" }}>›</div>
    </div>
  );
}

function Biodex() {
  const [cat,setCat]=useState("faune");
  const [selected,setSelected]=useState(null);
  const [search,setSearch]=useState("");
  const [dangerFilter,setDangerFilter]=useState("tous");
  const [sortBy,setSortBy]=useState("default");
  const { data,accent }=CATS[cat];
  const handleCat=(c)=>{setCat(c);setSearch("");setDangerFilter("tous");setSortBy("default");setSelected(null);};
  useEffect(()=>{setSelected(null);},[search,dangerFilter,sortBy]);
  const filtered=useMemo(()=>{let res=[...data];if(search.trim()){const q=search.toLowerCase();res=res.filter(e=>e.name.toLowerCase().includes(q)||e.latin.toLowerCase().includes(q)||e.zone.toLowerCase().includes(q)||e.habitat.toLowerCase().includes(q));}if(dangerFilter==="dangereux")res=res.filter(e=>e.danger>=3);if(dangerFilter==="mortels")res=res.filter(e=>e.danger===5);if(sortBy==="name")res.sort((a,b)=>a.name.localeCompare(b.name,"fr"));if(sortBy==="danger_desc")res.sort((a,b)=>b.danger-a.danger);if(sortBy==="danger_asc")res.sort((a,b)=>a.danger-b.danger);return res;},[data,search,dangerFilter,sortBy]);
  const counts=useMemo(()=>({tous:data.length,dangereux:data.filter(e=>e.danger>=3).length,mortels:data.filter(e=>e.danger===5).length}),[data]);
  if(selected)return <DetailPage entry={selected} onBack={()=>setSelected(null)}/>;
  return (
    <div style={{ paddingBottom:90 }}>
      <div style={{ padding:"22px 20px 14px" }}>
        <div style={{ fontSize:10,letterSpacing:2.5,color:"rgba(255,255,255,0.38)",marginBottom:5 }}>Encyclopédie de terrain</div>
        <div style={{ fontSize:24,fontWeight:800,color:"white" }}>🔍 Biodex Costa Rica</div>
        <div style={{ fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:3 }}>{FAUNE.length+FLORE.length+ROCHES.length} espèces · Photos Unsplash · Toucher pour la fiche</div>
      </div>
      <div style={{ display:"flex",gap:8,padding:"0 20px 14px" }}>
        {Object.entries(CATS).map(([k,c])=>{const active=cat===k;return <button key={k} onClick={()=>handleCat(k)} className="tap" style={{ flex:1,padding:"10px 6px",borderRadius:12,border:"none",background:active?c.accent:"rgba(255,255,255,0.07)",color:active?"white":"rgba(255,255,255,0.4)",fontSize:12,fontWeight:active?700:500,cursor:"pointer",transition:"all .2s",boxShadow:active?`0 4px 14px ${c.accent}55`:"none" }}>{c.emoji} {c.label} <span style={{ fontSize:10,opacity:.7 }}>({c.data.length})</span></button>;})}
      </div>
      <div style={{ position:"relative",margin:"0 20px 10px" }}>
        <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,opacity:.4 }}>🔎</span>
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ width:"100%",boxSizing:"border-box",padding:"10px 34px 10px 34px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.11)",borderRadius:12,color:"white",fontSize:13 }}/>
        {search&&<button onClick={()=>setSearch("")} style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:16,cursor:"pointer",padding:0 }}>✕</button>}
      </div>
      <div style={{ display:"flex",gap:7,padding:"0 20px 10px",overflowX:"auto" }}>
        {[{id:"tous",l:"Tous",c:counts.tous},{id:"dangereux",l:"⚠️ Danger 3+",c:counts.dangereux},{id:"mortels",l:"☠️ Mortels",c:counts.mortels}].map(f=>{const active=dangerFilter===f.id;return <button key={f.id} onClick={()=>setDangerFilter(f.id)} className="tap" style={{ padding:"6px 12px",borderRadius:20,border:active?"none":"1px solid rgba(255,255,255,0.14)",cursor:"pointer",background:active?accent:"transparent",color:active?"white":"rgba(255,255,255,0.5)",fontSize:11.5,fontWeight:600,whiteSpace:"nowrap",flexShrink:0 }}>{f.l} ({f.c})</button>;})}
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 20px 12px" }}>
        <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",fontWeight:600 }}>{filtered.length} espèce{filtered.length>1?"s":""}{(search||dangerFilter!=="tous")&&<span style={{ color:accent,marginLeft:4 }}>· filtré</span>}</div>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.11)",borderRadius:8,color:"rgba(255,255,255,0.6)",fontSize:11,padding:"5px 8px",cursor:"pointer" }}>
          <option value="default">Ordre par défaut</option>
          <option value="name">Nom A → Z</option>
          <option value="danger_desc">Plus dangereux d'abord</option>
          <option value="danger_asc">Plus sûrs d'abord</option>
        </select>
      </div>
      <div style={{ padding:"0 14px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        {filtered.map((entry,idx)=><BiodexCard key={entry.id} entry={entry} idx={idx} onSelect={()=>setSelected(entry)}/>)}
        {filtered.length===0&&<div style={{ gridColumn:"1/-1",padding:"50px 20px",textAlign:"center" }}><div style={{ fontSize:40,marginBottom:12 }}>🔍</div><div style={{ color:"rgba(255,255,255,0.4)",fontSize:14 }}>Aucune espèce trouvée{search&&` pour "${search}"`}</div><button onClick={()=>{setSearch("");setDangerFilter("tous");}} style={{ marginTop:16,padding:"9px 18px",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.7)",fontSize:13,cursor:"pointer" }}>Réinitialiser</button></div>}
      </div>
    </div>
  );
}

function BudgetBar({ budget }) {
  const cats=Object.entries(budget),total=cats.reduce((s,[,v])=>s+v,0),colors=["#5B9CF6","#F4845F","#52B788","#E9C46A"];
  return <div><div style={{ display:"flex",height:6,borderRadius:4,overflow:"hidden",marginBottom:8 }}>{cats.map(([,v],i)=>v>0?<div key={i} style={{ flex:v,background:colors[i] }}/>:null)}</div><div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>{cats.map(([k,v],i)=><div key={k} style={{ display:"flex",alignItems:"center",gap:4,background:"#F3F3EC",borderRadius:8,padding:"5px 9px",flex:"1 1 60px" }}><div style={{ width:8,height:8,borderRadius:2,background:colors[i],flexShrink:0 }}/><div><div style={{ fontSize:11,fontWeight:700,color:"#222" }}>{v}$</div><div style={{ fontSize:9,color:"#888" }}>{k}</div></div></div>)}<div style={{ display:"flex",alignItems:"center",justifyContent:"center",background:"#1A1A1A",borderRadius:8,padding:"5px 10px",flex:"1 1 60px" }}><div style={{ textAlign:"center" }}><div style={{ fontSize:13,fontWeight:800,color:"white" }}>{total}$</div><div style={{ fontSize:9,color:"rgba(255,255,255,.6)" }}>TOTAL</div></div></div></div></div>;
}

function Planner() {
  const [activeDay,setActiveDay]=useState(1);
  const d=DAYS[activeDay-1],z=ZONES[d.zone];
  const grandTotal=DAYS.reduce((s,day)=>s+Object.values(day.budget).reduce((a,b)=>a+b,0),0);
  return (
    <div>
      <div style={{ padding:"22px 20px 10px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div><div style={{ fontSize:10,letterSpacing:2.5,color:"rgba(255,255,255,0.4)",marginBottom:5 }}>Voyage en couple · 2 semaines</div><div style={{ fontSize:24,fontWeight:800,color:"white" }}>🌴 Costa Rica</div><div style={{ fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:3 }}>1 — 14 Octobre 2026</div></div>
          <div style={{ background:"rgba(255,255,255,0.06)",borderRadius:12,padding:"10px 12px",fontSize:11,color:"rgba(255,255,255,0.5)",textAlign:"right" }}><div>~{grandTotal}$ / pers.</div><div style={{ fontSize:9,opacity:.6 }}>hors vols int'l</div></div>
        </div>
        <div style={{ marginTop:12,padding:"9px 12px",background:"rgba(0,157,196,0.12)",borderRadius:10,borderLeft:"3px solid #009DC4",fontSize:11,color:"rgba(255,255,255,0.75)",lineHeight:1.55 }}>🌤️ <strong>Météo oct. :</strong> Caraïbes d'abord (veranillo) → Pacifique ensuite.</div>
      </div>
      <div style={{ overflowX:"auto",padding:"10px 0 4px" }}>
        <div style={{ display:"flex",gap:7,padding:"0 20px 4px",minWidth:"max-content" }}>
          {DAYS.map(day=>{const zz=ZONES[day.zone],active=day.id===activeDay;return <button key={day.id} onClick={()=>setActiveDay(day.id)} className="tap" style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:active?"8px 10px":"6px 8px",minWidth:42,borderRadius:12,border:active?`2px solid ${zz.color}`:"2px solid transparent",background:active?zz.color:"rgba(255,255,255,0.08)",color:active?"white":"rgba(255,255,255,0.4)",cursor:"pointer",transition:"all .18s",boxShadow:active?`0 4px 14px ${zz.color}55`:"none",transform:active?"scale(1.08)":"scale(1)" }}><span style={{ fontSize:15 }}>{day.emoji}</span><span style={{ fontSize:10,fontWeight:700 }}>{day.id}</span></button>;})}
        </div>
      </div>
      <div style={{ display:"flex",gap:12,padding:"0 20px 10px" }}>{Object.entries(ZONES).map(([k,zn])=><div key={k} style={{ display:"flex",alignItems:"center",gap:5,fontSize:10,color:"rgba(255,255,255,0.35)" }}><div style={{ width:8,height:8,borderRadius:"50%",background:zn.color }}/>{zn.label}</div>)}</div>
      <div style={{ padding:"0 16px 90px" }}>
        <div style={{ background:"#FEFBF4",borderRadius:22,overflow:"hidden",boxShadow:`0 24px 64px rgba(0,0,0,.5),0 0 0 1px ${z.color}22` }}>
          <div style={{ background:`linear-gradient(135deg,${z.color},${z.dark})`,padding:"20px 22px",color:"white" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div style={{ flex:1,paddingRight:12 }}><div style={{ fontSize:10,opacity:.75,letterSpacing:2,marginBottom:6 }}>JOUR {d.id} · {d.date} · {d.region}</div><div style={{ fontSize:19,fontWeight:800,lineHeight:1.25 }}>{d.emoji} {d.title}</div></div>
              <div style={{ background:"rgba(255,255,255,.18)",borderRadius:12,padding:"8px 10px",textAlign:"center",flexShrink:0 }}><div style={{ fontSize:18 }}>{d.weather.icon}</div><div style={{ fontSize:11,fontWeight:700,marginTop:2 }}>{d.weather.temp}</div></div>
            </div>
            <div style={{ marginTop:10,fontSize:12,opacity:.85,fontStyle:"italic" }}>{d.weather.label}</div>
          </div>
          <div style={{ padding:"18px 20px 0" }}><div style={{ fontSize:10,letterSpacing:2,color:"#AAA",marginBottom:12 }}>PROGRAMME</div>{d.activities.map((a,i)=><div key={i} style={{ display:"flex",gap:10,marginBottom:9,alignItems:"flex-start" }}><div style={{ width:22,height:22,borderRadius:"50%",background:z.light,color:z.dark,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,flexShrink:0,marginTop:1 }}>{i+1}</div><div style={{ fontSize:13.5,color:"#333",lineHeight:1.5 }}>{a}</div></div>)}</div>
          <div style={{ padding:"16px 20px 0",display:"flex",gap:10 }}>{[{icon:"🏡",lbl:"LOGEMENT",name:d.sleep.name,sub:d.sleep.price>0?`~${d.sleep.price}$/nuit`:"Transit"},{icon:"🍽️",lbl:"RESTAURANT",name:d.eat.name,sub:d.eat.detail}].map((it,i)=><div key={i} style={{ flex:1,background:"#F6F6F0",borderRadius:14,padding:"12px 14px" }}><div style={{ fontSize:9,color:"#AAA",letterSpacing:1.5,marginBottom:5 }}>{it.icon} {it.lbl}</div><div style={{ fontSize:13,fontWeight:700,color:"#1A1A1A",lineHeight:1.3 }}>{it.name}</div><div style={{ fontSize:11,color:"#777",marginTop:3,lineHeight:1.4 }}>{it.sub}</div></div>)}</div>
          {d.guide&&<div style={{ padding:"12px 20px 0" }}><div style={{ background:z.light,borderRadius:14,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center" }}><div><div style={{ fontSize:9,color:z.dark,letterSpacing:1.5,marginBottom:4 }}>👤 GUIDE RECOMMANDÉ</div><div style={{ fontSize:13,fontWeight:700,color:"#1A1A1A" }}>{d.guide.name}</div><div style={{ fontSize:11,color:"#666",marginTop:2 }}>{d.guide.phone}</div><div style={{ fontSize:10,color:z.dark,marginTop:2,fontStyle:"italic" }}>{d.guide.note}</div></div><div style={{ background:z.color,color:"white",borderRadius:10,padding:"8px 14px",fontSize:15,fontWeight:800,flexShrink:0,marginLeft:10 }}>~{d.guide.price}$</div></div></div>}
          <div style={{ padding:"16px 20px 0" }}><div style={{ fontSize:10,letterSpacing:2,color:"#AAA",marginBottom:10 }}>BUDGET ESTIMÉ / PERSONNE</div><BudgetBar budget={d.budget}/></div>
          <div style={{ padding:"14px 20px 0" }}><div style={{ background:"#FFFCEE",borderRadius:12,padding:"12px 14px",borderLeft:"3px solid #D4A017" }}><div style={{ fontSize:9,color:"#A07010",letterSpacing:1.5,marginBottom:5 }}>💡 CONSEIL</div><div style={{ fontSize:13,color:"#555",lineHeight:1.6 }}>{d.tip}</div></div></div>
          <div style={{ padding:"12px 20px 20px" }}><div style={{ background:z.light,borderRadius:12,padding:"12px 14px" }}><div style={{ fontSize:9,color:z.dark,letterSpacing:1.5,marginBottom:5 }}>✨ MOMENT CLÉ</div><div style={{ fontSize:14,fontWeight:600,color:"#1A1A1A",lineHeight:1.55 }}>{d.highlight}</div></div></div>
        </div>
        <div style={{ display:"flex",gap:10,marginTop:14 }}>
          <button onClick={()=>setActiveDay(Math.max(1,activeDay-1))} disabled={activeDay===1} className="tap" style={{ flex:1,padding:14,borderRadius:14,border:"none",background:activeDay===1?"rgba(255,255,255,0.04)":"rgba(255,255,255,0.1)",color:activeDay===1?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.75)",fontSize:14,fontWeight:600,cursor:activeDay===1?"default":"pointer" }}>← Jour {activeDay>1?activeDay-1:""}</button>
          <button onClick={()=>setActiveDay(Math.min(14,activeDay+1))} disabled={activeDay===14} className="tap" style={{ flex:1,padding:14,borderRadius:14,border:"none",background:activeDay===14?"rgba(255,255,255,0.04)":z.color,color:activeDay===14?"rgba(255,255,255,0.15)":"white",fontSize:14,fontWeight:700,cursor:activeDay===14?"default":"pointer",boxShadow:activeDay<14?`0 4px 16px ${z.color}55`:"none" }}>Jour {activeDay<14?activeDay+1:""} →</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab,setTab]=useState("voyage");
  return (
    <div style={{ minHeight:"100vh",background:"linear-gradient(160deg,#08180E 0%,#0D2318 100%)",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",userSelect:"none" }}>
      <style>{CSS}</style>
      <div style={{ paddingBottom:70 }}>
        {tab==="voyage"&&<Planner/>}
        {tab==="biodex"&&<Biodex/>}
      </div>
      <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"rgba(8,24,14,0.96)",backdropFilter:"blur(16px)",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",zIndex:100 }}>
        {[{id:"voyage",emoji:"🗺️",label:"Voyage"},{id:"biodex",emoji:"🔍",label:"Biodex"}].map(item=>{const active=tab===item.id;return <button key={item.id} onClick={()=>setTab(item.id)} style={{ flex:1,padding:"12px 0 14px",border:"none",background:"none",color:active?"#52B788":"rgba(255,255,255,0.35)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"color .2s" }}><span style={{ fontSize:22,filter:active?"drop-shadow(0 0 8px #52B78888)":"none" }}>{item.emoji}</span><span style={{ fontSize:10,fontWeight:active?700:500 }}>{item.label}</span></button>;})}
      </div>
    </div>
  );
}
