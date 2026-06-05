# DataBridge — Instructions Claude Code

## Projet

Plateforme web permettant à des salariés d'importer leurs fichiers Excel/CSV et de les transformer automatiquement en base de données PostgreSQL, accessible via une interface web simple.

**Équipe :** Paugy Yannis (@Paugyy) + Etendard Tommy — développeurs débutants.

## Stack (arrêtée)

| Composant | Technologie |
|-----------|-------------|
| Frontend | Vue.js 3 + Vite + Vue Router |
| Backend | Node.js + Express |
| Parseurs | xlsx + csv-parser |
| BDD | PostgreSQL 16 |
| Stockage | MinIO |
| Auth | JWT + bcrypt |
| Proxy | Nginx |
| Conteneurs | Docker + Compose |
| Infra | Proxmox VM |

## Infrastructure

- **VM :** `10.4.0.206` — `ssh -i ~/.ssh/proxmox databridge@10.4.0.206`
- **Repo VM :** `~/databridge/repos/DataBridge/`
- **Docker :** `infra/docker/` — 5 services, 4 réseaux isolés
- **Credentials :** `docs/secrets.enc` + `~/databridge/.secrets/credentials.md` sur VM

## Roadmap

- [x] Étape 1 — Environnement
- [x] Étape 3 — Docker (4 réseaux isolés)
- [x] Étape 4 — PostgreSQL + MinIO
- [x] Étape 5 — Backend API complète
- [x] Étape 6 — Frontend Vue.js
- [ ] Étape 7 — Auth JWT
- [ ] Étape 8 — Tests + HTTPS + Sauvegardes

## Architecture

```
frontend/
├── src/
│   ├── views/        ImportView, ImportsView, ImportDetailView
│   ├── components/   NavBar
│   ├── router/       index.js
│   ├── api.js        fetch vers /api/*
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── package.json      vue@3, vue-router@4, vite@5
└── vite.config.js

backend/
├── routes/           health.js, imports.js
├── services/         database.js, storage.js, parser.js
├── db/               schema.sql
├── server.js
└── package.json      v0.3.0

infra/docker/
├── docker-compose.yml        5 services, 4 réseaux
├── Dockerfile.backend        node:20-alpine
├── Dockerfile.frontend       multi-stage: node build → nginx
└── nginx/nginx.conf
```

## Règles

- Répondre en **français**, vocabulaire simple
- Expliquer le **POURQUOI** avant d'exécuter
- **Étape par étape** — jamais N+1 sans confirmation
- Après chaque action : mettre à jour `TODO.md`, `docs/journal.md`, `CLAUDE.md`
