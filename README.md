# DataBridge

> Centralisez vos fichiers Excel et CSV dans une base de données structurée, accessible à tous sans compétences techniques.

## Problème résolu

Les salariés stockent leurs données dans des classeurs Excel isolés. DataBridge permet d'importer ces fichiers via une interface web simple et de les transformer automatiquement en base de données PostgreSQL centralisée.

## Stack technique

| Composant           | Technologie              |
|---------------------|--------------------------|
| Frontend            | Vue.js 3 + Vite          |
| Backend / API       | Node.js + Express        |
| Traitement fichiers | xlsx + csv-parser        |
| Base de données     | PostgreSQL 16            |
| Stockage fichiers   | MinIO (compatible S3)    |
| Authentification    | JWT + bcrypt             |
| Reverse proxy       | Nginx                    |
| Conteneurs          | Docker + Docker Compose  |
| Infra               | Proxmox VM               |

## Structure du projet

```
DataBridge/
├── backend/
│   ├── db/schema.sql        # Tables : users, imports, import_rows
│   ├── routes/              # health.js, imports.js
│   ├── services/            # database.js, storage.js, parser.js
│   ├── server.js
│   └── package.json         # v0.3.0
├── frontend/
│   ├── src/
│   │   ├── views/           # ImportView, ImportsView, ImportDetailView
│   │   ├── components/      # NavBar
│   │   ├── router/          # index.js
│   │   ├── api.js           # Appels fetch vers /api/*
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── style.css
│   ├── package.json
│   └── vite.config.js
├── infra/docker/
│   ├── docker-compose.yml   # 5 services, 4 réseaux isolés
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend  # Multi-stage : Vite build → nginx
│   └── nginx/nginx.conf
├── docs/
│   ├── PROJET_COMPLET.md    # Référence complète (URLs, commandes, API)
│   ├── secrets.enc          # Credentials chiffrés AES-256
│   ├── acces.md             # Accès services + commandes Docker
│   ├── architecture.md      # Schémas Mermaid
│   ├── journal.md           # Journal de bord
│   └── setup.md             # Guide d'installation
├── TODO.md                  # Checklist collaborative (Yannis + Tommy + Claude)
├── .env.example             # Template variables d'environnement
├── CLAUDE.md                # Instructions pour Claude Code
└── README.md
```

## Accès — VM de développement

| Service          | URL                               |
|------------------|-----------------------------------|
| **Application**  | http://10.4.0.206                 |
| **API health**   | http://10.4.0.206/api/health      |
| **MinIO Console**| http://10.4.0.206:9001            |

> Identifiants dans `docs/secrets.enc` (chiffré) ou sur la VM : `~/databridge/.secrets/credentials.md`
> Voir [`docs/acces.md`](docs/acces.md) pour le détail complet.

## Lancer le projet

```bash
# Cloner le repo
git clone https://github.com/infoserv-DataBridge/DataBridge.git
cd DataBridge

# Configurer les variables d'environnement
cp .env.example .env
nano .env   # Remplir les mots de passe

# Copier .env pour Docker Compose
cp .env infra/docker/.env

# Démarrer tous les containers
cd infra/docker
docker compose up -d

# Vérifier
docker compose ps
curl http://localhost/api/health
```

## Roadmap

- [x] Étape 1 — Préparation environnement
- [x] Étape 3 — Infrastructure Docker (4 réseaux isolés)
- [x] Étape 4 — PostgreSQL + MinIO
- [x] Étape 5 — Backend API (import Excel/CSV, routes CRUD)
- [x] Étape 6 — Frontend Vue.js (upload, liste, détail)
- [ ] Étape 7 — Authentification JWT + gestion des rôles
- [ ] Étape 8 — Tests, HTTPS, sauvegardes

## Conventions Git

| Type     | Usage                            |
|----------|----------------------------------|
| `feat:`  | Nouvelle fonctionnalité          |
| `fix:`   | Correction de bug                |
| `docs:`  | Documentation uniquement         |
| `chore:` | Maintenance, config, dépendances |

Branches : `main` (stable) · `feat/nom-feature`
Toujours passer par **Pull Request** pour merger dans `main`.

## Équipe

- **Paugy Yannis** — [@Paugyy](https://github.com/Paugyy)
- **Etendard Tommy**
