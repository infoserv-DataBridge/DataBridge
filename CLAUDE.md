# DataBridge — Contexte Projet

## Description
Plateforme web permettant à des salariés d'importer leurs fichiers Excel/CSV
et de transformer automatiquement ces données en base de données PostgreSQL
structurée, sécurisée et accessible via une interface simple.

## Problème résolu
Les salariés stockent leurs données dans des classeurs Excel isolés.
DataBridge centralise ces données dans une BDD commune sans connaissances techniques.

## Équipe
- Etendard Tommy
- Paugy Yannis

## Stack technique

| Composant           | Technologie             |
|---------------------|-------------------------|
| Frontend            | Vue.js                  |
| Backend / API       | Node.js (Express)       |
| Traitement fichiers | Parser Excel/CSV        |
| Base de données     | PostgreSQL              |
| Stockage fichiers   | MinIO (S3-compatible)   |
| Authentification    | JWT                     |
| Reverse proxy       | Nginx                   |
| Conteneurs          | Docker + Docker Compose |
| Infra               | Proxmox (VMs / LXC)     |
| Versioning          | GitHub (org : infoserv-DataBridge) |

## Structure du projet

```
DataBridge/
├── frontend/        # Interface web Vue.js
├── backend/
│   └── parsers/     # Traitement Excel/CSV → PostgreSQL
├── infra/
│   └── docker/      # docker-compose.yml et Dockerfiles
├── docs/
│   ├── architecture.md
│   ├── setup.md
│   └── journal.md
├── .env.example
├── .gitignore
└── CLAUDE.md
```

## Repos GitHub

| Repo            | Contenu                              |
|-----------------|--------------------------------------|
| DataBridge      | Monorepo principal (ce repo)         |
| infra-proxmox   | Configurations VMs et réseau Proxmox |

## Conventions Git

- **Branches** : `main` (stable) · `dev` · `feat/nom-feature`
- **Commits** : `feat:` `fix:` `docs:` `chore:`
- **Workflow** : toujours passer par Pull Request pour merger dans `main`
- **Issues** : chaque fonctionnalité = une Issue GitHub
- **Kanban** : GitHub Projects → colonnes `Backlog / En cours / Review / Terminé`

## Feuille de route

- [x] Étape 1 — Préparation environnement & organisation projet
- [ ] Étape 2 — Infrastructure Proxmox (VMs/LXC + réseau)
- [ ] Étape 3 — Mise en place Docker + Docker Compose
- [ ] Étape 4 — Base de données PostgreSQL + stockage MinIO
- [ ] Étape 5 — Backend API (import fichiers + parsing)
- [ ] Étape 6 — Frontend Vue.js (interface upload + visualisation)
- [ ] Étape 7 — Authentification JWT + gestion des rôles
- [ ] Étape 8 — Tests, sécurisation, documentation finale

## Instructions pour Claude Code

### Langue et pédagogie
- Toujours répondre en français, vocabulaire simple adapté à des débutants
- Expliquer le POURQUOI de chaque choix technique avant d'exécuter
- Équipe de 2 développeurs débutants — privilégier la simplicité et la clarté

### Stack
- Les choix techniques sont arrêtés : Vue.js · Node.js/Express · JWT · Nginx · PostgreSQL · MinIO
- Ne pas proposer d'alternatives sauf si demandé explicitement

### Git
- Travailler sur `main` uniquement (pas de branche dev pour l'instant)
- Commits au format conventionnel : `feat:` `fix:` `docs:` `chore:`
- Toujours passer par Pull Request pour merger dans `main`

### Progression
- Avancer étape par étape — ne jamais commencer l'étape N+1 sans confirmation explicite
- Toujours demander confirmation avant toute action irréversible

### Documentation & suivi obligatoire
- Après CHAQUE action ou modification, mettre à jour `docs/journal.md` avec :
  - La date
  - Ce qui a été fait
  - Pourquoi
  - Ce qui reste à faire
- Mettre à jour `CLAUDE.md` à chaque évolution majeure du projet
- Tenir un suivi précis : chaque fichier créé, modifié ou supprimé doit être tracé

### Environnement Proxmox
- À compléter lors de l'Étape 2 (IP, ressources, noms des VMs/LXC)
