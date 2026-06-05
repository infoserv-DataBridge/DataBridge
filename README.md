# DataBridge

> Centralisez vos fichiers Excel et CSV dans une base de données structurée, accessible à tous sans compétences techniques.

## Problème résolu

Les salariés stockent leurs données dans des classeurs Excel isolés. DataBridge permet d'importer ces fichiers via une interface web simple et de les transformer automatiquement en base de données PostgreSQL centralisée.

## Stack technique

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

## Structure du projet

```
DataBridge/
├── backend/
│   ├── parsers/         # Traitement Excel/CSV → PostgreSQL
│   ├── server.js        # Point d'entrée API Express
│   └── package.json
├── frontend/            # Interface web Vue.js
├── infra/
│   └── docker/
│       ├── docker-compose.yml
│       ├── Dockerfile.backend
│       ├── Dockerfile.frontend
│       └── nginx/
│           └── nginx.conf
├── docs/
│   ├── acces.md         # URLs et accès aux services
│   ├── architecture.md  # Architecture technique détaillée
│   ├── journal.md       # Journal de bord
│   └── setup.md         # Guide d'installation
├── .env.example         # Variables d'environnement (template)
├── .gitignore
├── CLAUDE.md            # Instructions pour Claude Code
└── README.md
```

## Accès — VM de développement

| Service          | URL                            |
|------------------|--------------------------------|
| Application      | http://10.4.0.206              |
| API (health)     | http://10.4.0.206:3000/api/health |
| MinIO Console    | http://10.4.0.206:9001         |
| PostgreSQL       | 10.4.0.206:5432                |

> Les identifiants sont dans le fichier `.env` sur la VM.
> Voir [`docs/acces.md`](docs/acces.md) pour le détail complet.

## Lancer le projet

```bash
# Cloner le repo
git clone https://github.com/infoserv-DataBridge/DataBridge.git
cd DataBridge

# Configurer les variables d'environnement
cp .env.example .env
# Remplir les valeurs dans .env

# Démarrer tous les containers
cd infra/docker
docker compose up -d

# Vérifier que tout tourne
docker compose ps
```

## Roadmap

- [x] Étape 1 — Préparation environnement & organisation projet
- [x] Étape 3 — Infrastructure Docker (PostgreSQL, MinIO, Backend, Nginx)
- [ ] Étape 4 — Base de données PostgreSQL + stockage MinIO
- [ ] Étape 5 — Backend API (import fichiers + parsing)
- [ ] Étape 6 — Frontend Vue.js
- [ ] Étape 7 — Authentification JWT + gestion des rôles
- [ ] Étape 8 — Tests, sécurisation, documentation finale

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
