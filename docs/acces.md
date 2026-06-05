# Accès aux services — DataBridge

## VM de développement

**IP :** `10.4.0.206`
**Connexion SSH :** `ssh -i ~/.ssh/proxmox databridge@10.4.0.206`

---

## Services disponibles

### Application web (Frontend)
- **URL :** http://10.4.0.206
- **Port :** 80
- **Container :** `databridge_nginx`

### API Backend
- **URL :** http://10.4.0.206:3000
- **Health check :** http://10.4.0.206:3000/api/health
- **Port :** 3000
- **Container :** `databridge_backend`

### MinIO — Console d'administration (stockage fichiers)
- **URL :** http://10.4.0.206:9001
- **API S3 :** http://10.4.0.206:9000
- **Login :** voir `.env` → `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY`
- **Container :** `databridge_minio`

### PostgreSQL — Base de données
- **Host :** `10.4.0.206`
- **Port :** `5432`
- **Base :** voir `.env` → `POSTGRES_DB`
- **Login :** voir `.env` → `POSTGRES_USER` / `POSTGRES_PASSWORD`
- **Container :** `databridge_postgres`

---

## Où sont les identifiants ?

Les mots de passe sont dans le fichier `.env` sur la VM (jamais sur GitHub) :

```bash
# Se connecter à la VM
ssh -i ~/.ssh/proxmox databridge@10.4.0.206

# Lire le fichier .env
cat ~/databridge/repos/DataBridge/.env
```

---

## Gérer les containers Docker

```bash
# Se connecter à la VM puis :
cd ~/databridge/repos/DataBridge/infra/docker

# Voir l'état de tous les containers
docker compose ps

# Voir les logs d'un service
docker compose logs backend
docker compose logs postgres
docker compose logs minio
docker compose logs nginx

# Redémarrer un service
docker compose restart backend

# Arrêter tous les containers
docker compose down

# Démarrer tous les containers
docker compose up -d

# Reconstruire l'image backend (après modification du code)
docker compose build backend
docker compose up -d backend
```

---

## Architecture réseau Docker

```
Internet
    │
    ▼
[nginx :80]
    ├─ /        → fichiers frontend statiques
    └─ /api/    → [backend :3000]
                       ├─ [postgres :5432]
                       └─ [minio :9000]

Console MinIO : port 9001 (accès direct, hors nginx)
PostgreSQL    : port 5432 (accès direct, pour outils DB)
```
