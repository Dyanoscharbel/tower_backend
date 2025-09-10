# Backend tour0001

Backend Express.js avec MongoDB pour l'application Devvit tour0001.

## Installation

```bash
npm install
```

## Configuration

Copiez `.env.example` vers `.env` et configurez les variables :

```bash
cp .env.example .env
```

## Développement

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## API Endpoints

### Joueurs

- `POST /api/joueurs` - Créer ou récupérer un joueur
- `GET /api/joueurs/:reddit_id` - Récupérer un joueur
- `PUT /api/joueurs/:reddit_id/score` - Mettre à jour le score
- `GET /api/joueurs/leaderboard/top` - Leaderboard

### Health Check

- `GET /health` - Vérifier l'état du serveur

## Structure

```
src/
├── config/         # Configuration (base de données)
├── controllers/    # Contrôleurs
├── middleware/     # Middlewares
├── models/         # Modèles MongoDB
├── routes/         # Routes API
└── index.ts        # Point d'entrée
```
