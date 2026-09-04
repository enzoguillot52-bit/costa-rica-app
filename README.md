# Costa Rica · Carnet de voyage 🌴

App mobile-first (React + Vite + Tailwind + Framer Motion) pour un voyage de 13 jours au Costa Rica :
un planificateur jour par jour éditable, un carnet de contacts, et un Biodex (encyclopédie faune/flore/roches).

## Démarrer

```bash
npm install
npm run dev
```

## Photos réelles du Biodex (optionnel)

Par défaut, chaque fiche du Biodex affiche un pattern SVG + emoji. Pour afficher de vraies photos :

1. Créez une clé API gratuite sur https://unsplash.com/developers
2. Copiez `.env.example` vers `.env`
3. Renseignez `VITE_UNSPLASH_ACCESS_KEY=votre_clé`
4. Relancez `npm run dev`

Les photos sont mises en cache dans le navigateur (localStorage) pour limiter les appels API.
Sans clé, ou en cas d'échec réseau, l'app retombe automatiquement sur le pattern SVG — jamais d'erreur visible.

## Éditer l'itinéraire

Chaque jour du planificateur est modifiable via le bouton ✎ dans son en-tête (titre, destination,
programme, logement, restaurant, conseil, moment clé). Les modifications sont sauvegardées en local
(localStorage) et peuvent être réinitialisées à tout moment. Aucune donnée n'est envoyée sur internet.

## Structure

```
src/
├── App.jsx
├── data/            # itinéraire, biodex, contacts, constantes (zones, dangerosité)
├── components/
│   ├── BottomNav.jsx
│   ├── planner/     # timeline, carte du jour, budget, formulaire d'édition
│   ├── biodex/      # grille, carte flip, modal détail, barre de danger
│   └── contacts/
└── lib/             # hooks (localStorage, overrides, photos Unsplash)
```
