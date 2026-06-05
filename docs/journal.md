# Journal de bord — DataBridge

---

## 2026-06-05 — Étape 3 : Infrastructure Docker complète

### Ce qui a été fait

Mise en place complète de l'infrastructure Docker (Étape 3 de la roadmap).

**Fichiers créés :**
- `infra/docker/docker-compose.yml` — orchestration des 4 containers
- `infra/docker/Dockerfile.backend` — image Docker pour l'API Node.js
- `infra/docker/Dockerfile.frontend` — image Docker pour Vue.js (multi-stage, pour l'Étape 6)
- `infra/docker/nginx/nginx.conf` — configuration du reverse proxy Nginx
- `backend/package.json` — dépendances Express, cors, dotenv
- `backend/server.js` — serveur Express minimal avec endpoint /api/health
- `frontend/index.html` — page placeholder (sera remplacée à l'Étape 6)
- `.env` — variables d'environnement (exclu de Git par .gitignore)
- `infra/docker/.env` — copie du .env pour Docker Compose (exclu de Git)

**4 containers Docker démarrés :**

| Container | Image | Port | État |
|-----------|-------|------|------|
| databridge_postgres | postgres:16-alpine | 5432 | healthy |
| databridge_minio | minio/minio:latest | 9000, 9001 | healthy |
| databridge_backend | custom (Node.js 20) | 3000 | running |
| databridge_nginx | nginx:alpine | 80 | running |

### Pourquoi ces choix

- **postgres:16-alpine** : image officielle légère, version LTS stable
- **minio/minio:latest** : stockage objet compatible S3, console web sur :9001
- **Node.js 20 Alpine** : légère, LTS, adaptée à la production
- **nginx:alpine** : reverse proxy + serveur de fichiers statiques

### Architecture réseau Docker

```
Internet → nginx:80 → /      → frontend (fichiers statiques)
                    → /api/  → backend:3000 → postgres:5432
                                             → minio:9000
```

### Accès aux services (depuis la VM 10.4.0.206)

- Frontend : http://10.4.0.206
- API Backend : http://10.4.0.206:3000/api/health
- MinIO Console : http://10.4.0.206:9001
- PostgreSQL : 10.4.0.206:5432

### Commandes utiles

```bash
# Depuis ~/databridge/repos/DataBridge/infra/docker/

# Voir l'état des containers
docker compose ps

# Voir les logs d'un container
docker compose logs backend
docker compose logs postgres

# Redémarrer un container
docker compose restart backend

# Arrêter tout
docker compose down

# Démarrer tout
docker compose up -d
```

### Ce qui reste à faire

- Étape 4 : Configurer la base de données PostgreSQL (tables, schéma)
- Étape 4 : Créer le bucket MinIO "databridge-files" automatiquement
- Étape 5 : Développer l'API backend (import fichiers, parsing Excel/CSV)
- Étape 6 : Développer le frontend Vue.js (interface utilisateur)

---

## 2026-05-29 — Étape 1 : Préparation environnement

- Création de l'organisation GitHub `infoserv-DataBridge`
- Création des repos `DataBridge` et `infra-proxmox`
- Mise en place de la structure de dossiers sur la VM (10.4.0.206)
- Clonage des repos sur la VM
- Configuration des clés SSH GitHub
- Création des fichiers de documentation (CLAUDE.md, README.md, .gitignore, .env.example)
