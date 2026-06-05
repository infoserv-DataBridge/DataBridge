# DataBridge — Instructions Claude Code

## Projet

Plateforme web permettant à des salariés d'importer leurs fichiers Excel/CSV et de les transformer automatiquement en base de données PostgreSQL structurée, sécurisée et accessible via une interface simple.

**Équipe :** Paugy Yannis (@Paugyy) et Etendard Tommy — deux développeurs débutants.

## Stack (arrêtée — ne pas proposer d'alternatives)

| Composant           | Technologie              |
|---------------------|--------------------------|
| Frontend            | Vue.js                   |
| Backend / API       | Node.js + Express        |
| Traitement fichiers | Parser Excel / CSV       |
| Base de données     | PostgreSQL 16            |
| Stockage fichiers   | MinIO (compatible S3)    |
| Authentification    | JWT                      |
| Reverse proxy       | Nginx                    |
| Conteneurs          | Docker + Docker Compose  |
| Infra               | Proxmox VM               |

## Infrastructure

- **VM DataBridge :** `10.4.0.206` — user `databridge` — clé `~/.ssh/proxmox`
- **Repo sur la VM :** `~/databridge/repos/DataBridge/`
- **Docker Compose :** `~/databridge/repos/DataBridge/infra/docker/`
- **GitHub org :** `infoserv-DataBridge`

## Roadmap

- [x] Étape 1 — Préparation environnement & organisation projet
- [x] Étape 3 — Infrastructure Docker (PostgreSQL, MinIO, Backend, Nginx)
- [ ] Étape 4 — Base de données PostgreSQL + stockage MinIO
- [ ] Étape 5 — Backend API (import fichiers + parsing)
- [ ] Étape 6 — Frontend Vue.js
- [ ] Étape 7 — Authentification JWT + gestion des rôles
- [ ] Étape 8 — Tests, sécurisation, documentation finale

## Règles de comportement

### Langue et pédagogie
- Toujours répondre en **français**, vocabulaire simple adapté à des débutants
- Expliquer le **POURQUOI** de chaque choix technique avant d'exécuter
- Avancer **étape par étape** — ne jamais commencer l'étape N+1 sans confirmation

### Git
- Travailler sur `main` uniquement pour l'instant
- Commits au format conventionnel : `feat:` `fix:` `docs:` `chore:`
- Toujours demander confirmation avant toute action irréversible

### Documentation obligatoire après chaque action
Mettre à jour **après chaque modification** :
- `docs/journal.md` : date, ce qui a été fait, pourquoi, ce qui reste
- `CLAUDE.md` : à chaque évolution majeure (roadmap, infra, stack)
