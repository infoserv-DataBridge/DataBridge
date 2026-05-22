# Guide d'installation — DataBridge

## Prérequis

- Git
- Docker + Docker Compose
- Node.js 20+

## Installation locale (développement)

```bash
# 1. Cloner le repo
git clone https://github.com/infoserv-DataBridge/DataBridge.git
cd DataBridge

# 2. Copier et configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 3. Lancer les services (BDD + MinIO)
docker compose -f infra/docker/docker-compose.yml up -d

# 4. Lancer le backend
cd backend
npm install
npm run dev

# 5. Lancer le frontend
cd ../frontend
npm install
npm run dev
```

## Accès aux services

| Service        | URL                        |
|----------------|----------------------------|
| Frontend       | http://localhost:5173       |
| Backend API    | http://localhost:3000       |
| MinIO console  | http://localhost:9001       |
| PostgreSQL     | localhost:5432              |
