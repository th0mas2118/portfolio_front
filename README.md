# Portfolio Front-end

Portfolio personnel développé avec Vue.js 3 et TypeScript.

## Technologies utilisées

- **Vue.js 3** avec Composition API
- **TypeScript** pour le typage
- **Vue Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Vite** comme bundler
- **Bun** comme package manager

## Structure du projet

```
src/
├── components/     # Composants réutilisables
├── views/         # Pages/vues principales
├── router/        # Configuration du routeur
├── types/         # Types TypeScript
├── assets/        # Assets statiques
└── main.ts        # Point d'entrée

```

## Installation et développement

```bash
# Installation des dépendances
bun install

# Serveur de développement
bun run dev

# Build de production
bun run build

# Vérification des types
bun run type-check
```

## Pages

- **Accueil** : Présentation et compétences
- **Projets** : Portfolio des réalisations
- **API Demo** : Interface de test de l'API Laravel (à développer)
- **Contact** : Formulaire de contact

## Fonctionnalités

- Design responsive avec Tailwind CSS
- Navigation fluide avec Vue Router
- Typage strict avec TypeScript
- Architecture modulaire et maintenable
- Interface pour tester l'API backend (prévue)

## À venir

- Intégration avec l'API Laravel
- Page de démonstration API interactive
- Animations avancées
- Tests unitaires
