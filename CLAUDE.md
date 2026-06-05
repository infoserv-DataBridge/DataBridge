# DataBridge — Instructions Claude Code

## Projet

Plateforme web permettant à des salariés d'importer leurs fichiers Excel/CSV et de les transformer automatiquement en base de données PostgreSQL structurée, sécurisée et accessible via une interface simple.

**Équipe :** Paugy Yannis (@Paugyy) et Etendard Tommy — deux développeurs débutants.

## Stack (arrêtée — ne pas proposer d'alternatives)

| Composant | Technologie |
|-----------|-------------|
| Frontend | Vue.js + Vite |
| Backend / API | Node.js + Express |
| Traitement fichiers | xlsx + csv-parser |
| Base de données | PostgreSQL 16 |
| Stockage fichiers | MinIO (compatible S3) |
| Authentification | JWT + bcrypt |
| Reverse proxy | Nginx |
| Conteneurs | Docker + Docker Compose |
| Infra | Proxmox VM |

## Infrastructure

- **VM :** `10.4.0.206` — user `databridge` — clé `~/.ssh/proxmox`
- **Repo VM :** `~/databridge/repos/DataBridge/`
- **Docker :** `~/databridge/repos/DataBridge/infra/docker/`
- **GitHub org :** `infoserv-DataBridge`
- **Credentials chiffrés :** `docs/secrets.enc` (mdp dans `~/databridge/.secrets/credentials.md`)

## Roadmap

- [x] Étape 1 — Préparation environnement
- [x] Étape 3 — Infrastructure Docker (4 réseaux isolés)
- [x] Étape 4 — PostgreSQL (3 tables) + MinIO (bucket)
- [x] Étape 5 — Backend API (import, parse, routes CRUD)
- [ ] Étape 6 — Frontend Vue.js
- [ ] Étape 7 — Authentification JWT
- [ ] Étape 8 — Tests, HTTPS, sauvegardes

## Architecture backend actuelle

```
backend/
├── routes/
│   ├── health.js       GET /api/health
│   └── imports.js      POST/GET /api/imports, GET /api/imports/:id/rows
├── services/
│   ├── database.js     Pool PostgreSQL
│   ├── storage.js      Client MinIO (upload)
│   └── parser.js       Parse Excel/CSV → tableau d'objets
├── db/
│   └── schema.sql      Tables: users, imports, import_rows
├── server.js
└── package.json        v0.3.0
```

## Règles de comportement

- Toujours répondre en **français**, vocabulaire simple adapté à des débutants
- Expliquer le **POURQUOI** avant d'exécuter
- Avancer **étape par étape** — confirmation avant chaque nouvelle étape
- Toujours demander confirmation avant toute action irréversible

## Documentation à maintenir après chaque action

- `TODO.md` : cocher les tâches terminées, ajouter les nouvelles
- `docs/journal.md` : date, ce qui a été fait, ce qui reste
- `CLAUDE.md` : mettre à jour roadmap et architecture si évolution majeure
