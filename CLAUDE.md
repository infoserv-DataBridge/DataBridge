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

- Avancer étape par étape, valider chaque étape avant de passer à la suivante
- Toujours documenter les changements dans `docs/journal.md`
- Privilégier des solutions simples et bien commentées (équipe débutante)
- Expliquer le pourquoi des choix techniques, pas seulement le comment
- Mettre à jour ce fichier CLAUDE.md à chaque évolution majeure du projet
- Toujours demander confirmation avant toute action irréversible
