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

### 2. Cloner le repo (si pas encore fait)

```bash
mkdir -p ~/databridge/repos
cd ~/databridge/repos
git clone git@github.com:infoserv-DataBridge/DataBridge.git
cd DataBridge
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
nano .env   # ou vim .env
# Modifier les valeurs POSTGRES_PASSWORD, MINIO_SECRET_KEY, JWT_SECRET
```

### 4. Copier le .env pour Docker Compose

```bash
cp .env infra/docker/.env
```

> Docker Compose cherche le `.env` dans son propre dossier.
> Le fichier racine `.env` sert au backend à l'exécution.
> Les deux doivent être identiques.

### 5. Lancer tous les containers

```bash
cd infra/docker
docker compose up -d
```

### 6. Vérifier que tout fonctionne

```bash
docker compose ps
# Les 4 containers doivent être "Up"

curl http://localhost:3000/api/health
# Doit retourner : {"status":"ok",...}
```

### 7. Mettre à jour le code (après un git pull)

```bash
cd ~/databridge/repos/DataBridge
git pull origin main

# Reconstruire et relancer le backend si modifié
cd infra/docker
docker compose build backend
docker compose up -d
```

---

## Développement local (sur votre machine)

> Pour travailler sur le code sans toucher à la VM.

### Prérequis supplémentaires

- Node.js 20+
- Docker Desktop

### Installation

```bash
git clone https://github.com/infoserv-DataBridge/DataBridge.git
cd DataBridge
cp .env.example .env
# Modifier .env (POSTGRES_HOST=localhost, MINIO_ENDPOINT=localhost)

# Lancer uniquement la BDD et MinIO
cd infra/docker
docker compose up -d postgres minio
cd ../..

# Lancer le backend
cd backend
npm install
npm run dev

# Lancer le frontend (Étape 6)
cd ../frontend
npm install
npm run dev
```

### Accès en local

| Service       | URL                      |
|---------------|--------------------------|
| Frontend      | http://localhost:5173    |
| API Backend   | http://localhost:3000    |
| MinIO Console | http://localhost:9001    |
| PostgreSQL    | localhost:5432           |

---

## Containers Docker

| Container            | Image               | Port(s)      | Rôle                      |
|----------------------|---------------------|--------------|---------------------------|
| databridge_postgres  | postgres:16-alpine  | 5432         | Base de données           |
| databridge_minio     | minio/minio:latest  | 9000, 9001   | Stockage fichiers         |
| databridge_backend   | node:20-alpine      | 3000         | API REST Node.js          |
| databridge_nginx     | nginx:alpine        | 80           | Reverse proxy + frontend  |
