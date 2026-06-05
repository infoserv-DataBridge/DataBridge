# Guide d'installation — DataBridge

## Prérequis

- Git
- Docker + Docker Compose v2
- Accès SSH à la VM (clé `~/.ssh/proxmox`)

---

## Déploiement sur la VM (méthode principale)

### 1. Se connecter à la VM

```bash
ssh -i ~/.ssh/proxmox databridge@10.4.0.206
```

### 2. Cloner le repo

```bash
mkdir -p ~/databridge/repos && cd ~/databridge/repos
git clone git@github.com:infoserv-DataBridge/DataBridge.git
cd DataBridge
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
nano .env
# Remplir : POSTGRES_PASSWORD, MINIO_SECRET_KEY, JWT_SECRET

# Copier pour Docker Compose (cherche .env dans son propre dossier)
cp .env infra/docker/.env
```

### 4. Lancer tous les containers

```bash
cd infra/docker
docker compose up -d
```

### 5. Vérifier

```bash
docker compose ps
# Les containers postgres, minio, backend, nginx doivent être "Up"

curl http://localhost/api/health
# {"status":"ok","services":{"postgres":"ok","minio":"ok"}}
```

### 6. Mettre à jour après un git pull

```bash
cd ~/databridge/repos/DataBridge
git pull origin main
cd infra/docker

# Si le backend a changé :
docker compose build backend && docker compose up -d backend

# Si le frontend a changé :
docker compose build nginx && docker compose up -d nginx

# Si les deux ont changé :
docker compose build && docker compose up -d
```

---

## Développement local (sur votre machine)

> Pour travailler sur le code sans toucher à la VM. Nécessite Node.js 20+.

```bash
git clone https://github.com/infoserv-DataBridge/DataBridge.git
cd DataBridge
cp .env.example .env
# Modifier .env : POSTGRES_HOST=localhost, MINIO_ENDPOINT=localhost

# Lancer BDD et MinIO uniquement
cd infra/docker && docker compose up -d postgres minio && cd ../..

# Backend
cd backend && npm install && npm run dev
# → http://localhost:3000/api/health

# Frontend
cd ../frontend && npm install && npm run dev
# → http://localhost:5173
```

---

## Containers Docker

| Container | Image | Port exposé | Réseau(x) | Rôle |
|-----------|-------|-------------|-----------|------|
| `databridge_postgres` | postgres:16-alpine | aucun | net_db (isolé) | BDD |
| `databridge_minio` | minio/minio:latest | :9001 | net_storage, net_admin | Stockage |
| `databridge_backend` | node:20-alpine | aucun | net_db, net_storage, net_app | API |
| `databridge_nginx` | nginx+vue build | :80 | net_app | Frontend + proxy |

> `databridge_minio_init` s'exécute une fois au démarrage pour créer le bucket, puis s'arrête.

---

## Schéma BDD

```sql
users       (id, email, password_hash, role, created_at)
imports     (id, user_id, original_filename, file_type, minio_key,
             row_count, columns, status, error_message, created_at)
import_rows (id, import_id, row_index, data JSONB, created_at)
```

## API disponible

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/health` | Statut API + postgres + minio |
| POST | `/api/imports` | Upload Excel/CSV |
| GET | `/api/imports` | Liste imports |
| GET | `/api/imports/:id` | Détail import |
| GET | `/api/imports/:id/rows` | Données paginées |
