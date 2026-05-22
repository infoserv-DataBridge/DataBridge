# DataBridge

Plateforme web permettant d'importer des fichiers (Excel, CSV) et de transformer automatiquement les données en base de données structurée, sécurisée et accessible.

## Problème résolu

De nombreux salariés stockent leurs données dans des classeurs Excel isolés. DataBridge centralise ces données dans une base de données commune, accessible via une interface web simple — sans connaissances techniques requises.

## Fonctionnalités

- Import de fichiers Excel / CSV via interface web
- Transformation automatique des données en base de données PostgreSQL
- Authentification sécurisée avec gestion des rôles
- Consultation et export des données importées
- Interface pensée pour des utilisateurs non-techniciens

## Stack technique

| Composant           | Technologie             |
|---------------------|-------------------------|
| Frontend            | Vue.js                  |
| Backend / API       | Node.js (Express)       |
| Traitement fichiers | Parser Excel/CSV        |
| Base de données     | PostgreSQL              |
| Stockage fichiers   | MinIO (S3-compatible)   |
| Authentification    | JWT                     |
| Conteneurs          | Docker + Docker Compose |
| Infra               | Proxmox                 |

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
└── CLAUDE.md
```

## Équipe

- Etendard Tommy
- Paugy Yannis

## Lancer le projet

```bash
git clone https://github.com/infoserv-DataBridge/DataBridge.git
cd DataBridge
cp .env.example .env
# Remplir les variables dans .env
docker compose up -d
```

## Conventions Git

- Branches : `main` · `dev` · `feat/nom-feature`
- Commits : `feat:` `fix:` `docs:` `chore:`
- Toujours passer par Pull Request pour merger dans `main`
