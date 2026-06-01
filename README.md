# Breezy API

API REST pour le réseau social **Breezy** (Node.js, TypeScript, Express, PostgreSQL, JWT).

## Prérequis

- Node.js 20+
- Docker (recommandé) ou PostgreSQL 16

## Démarrage rapide (Docker)

```bash
cp .env.example .env
docker compose up --build
```

L'API est disponible sur `http://localhost:3000`.

## Démarrage local

```bash
cp .env.example .env
npm install
npm run dev
```

Assurez-vous que PostgreSQL tourne avec les identifiants définis dans `.env`.

## Endpoints principaux

### Authentification (Fx1, Fx2)

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Création de compte |
| POST | `/api/auth/login` | Connexion JWT |
| GET | `/api/auth/me` | Profil connecté |

### Utilisateurs (Fx9, Fx10, Fx11)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/users/:userId` | Profil public |
| PATCH | `/api/users/me` | Modifier son profil |
| GET | `/api/users/:userId/posts` | Posts du profil |
| POST | `/api/users/:userId/follow` | Suivre |
| DELETE | `/api/users/:userId/follow` | Ne plus suivre |

### Posts (Fx3–Fx8)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/posts/feed` | Fil d'actualités |
| POST | `/api/posts` | Publier (280 car. max) |
| PATCH | `/api/posts/:postId` | Modifier son post |
| POST | `/api/posts/:postId/like` | Liker |
| POST | `/api/posts/:postId/comments` | Commenter |
| POST | `/api/posts/comments/:commentId/replies` | Répondre à un commentaire |

## Authentification

Envoyer le header `Authorization: Bearer <token>` pour les routes protégées.

## Rôles

- `user` — utilisateur standard
- `moderator` — suspension d'utilisateurs (Fx21)
- `admin` — administration complète

## Scripts API

- `npm run dev` — développement avec rechargement
- `npm run build` — compilation TypeScript
- `npm start` — production
- `npm run lint` — vérification TypeScript

## Front-end (React)

Interface moderne inspirée de X, dans le dossier `client/`.

```bash
cd client
npm install
npm run dev
```

Ouvrir **http://localhost:5173** (proxy API vers le port 3000).

### Pages

- `/login`, `/register` — authentification
- `/` — fil d'actualités + composer un post
- `/user/:userId` — profil, follow, posts
- `/post/:postId` — détail, commentaires, réponses
- `/settings` — modifier bio, photo, nom
- `/compose` — nouveau post
