# Règles du projet : techno, architecture, conventions

## Stack
- HTML5 / CSS3 / JavaScript ES6+ (modules natifs, pas de framework, pas de bundler/build tool).
- Données statiques en JSON (`data/*.json`), chargées côté client par `fetch`.
- EmailJS (`@emailjs/browser`) pour l'envoi du formulaire de contact.
- Google Analytics (`gtag.js`) pour le suivi d'audience.
- Icônes via Devicon et Font Awesome (CDN).
- Hébergement GitHub Pages (pas de serveur ni de backend).

## Architecture
- `index.html` : point d'entrée unique (SPA à onglets, pas de routage d'URL).
- `js/main.js` → `js/load.js` : orchestre l'initialisation (thème, onglets, puis fetch des données).
- `js/init/*.js` : un module par section (about, contact, experience, formation, info, project, skill, theme, tabs), chacun responsable de charger ses données JSON et de peupler le DOM.
- `js/function/*.js` : fonctions utilitaires partagées (ex. `skills.js`).
- `css/component/*.css` : une feuille de style par composant/section, importées depuis `css/style.css`.
- `data/*.json` : contenu éditorial (expérience, formation, projets, compétences, infos perso) séparé du code.
- `data/projects.json` : généré automatiquement en CI (jamais édité à la main) par agrégation des `portfolio.json` publiés sur le `gh-pages` de chaque dépôt de Luka (découverte via l'API GitHub, pas de liste à maintenir ici) — voir `docs/design/project-auto-discovery.md` pour le détail du pipeline, le mapping des champs et les questions encore ouvertes.

## Conventions spécifiques
- Pas de bundler : les imports JS sont des modules ES natifs (`type="module"`), chemins relatifs directs.
- Un module `init/*.js` = une section de la page ; ajouter une section = ajouter un fichier JSON dans `data/` + un module dans `js/init/` + son appel dans `load.js`.
- Thèmes visuels multiples gérés par `theme.css` + `init/theme.js` (attribut/classe sur le document, pas de variables CSS par défaut à casser).
