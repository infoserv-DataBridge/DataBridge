# Accès aux services — DataBridge

## VM de développement

**IP :** `10.4.0.206` — **OS :** Debian 12 — **SSH :** `ssh -i ~/.ssh/proxmox databridge@10.4.0.206`

---

## Services accessibles depuis le LAN

| Service | URL | Notes |
|---------|-----|-------|
| **Application** | http://10.4.0.206 | Interface web principale (nginx) |
| **API health** | http://10.4.0.206/api/health | Vérifie postgres + minio |
| **MinIO Console** | http://10.4.0.206:9001 | Admin stockage fichiers |

## Services accessibles uniquement depuis la VM

| Service | Accès | Notes |
|---------|-------|-------|
| **Backend API** | `localhost:3000` (sur la VM) | Nginx proxifie, pas exposé LAN |
| **PostgreSQL** | `docker exec` uniquement | Réseau `net_db` isolé |
| **MinIO API S3** | interne Docker (`minio:9000`) | Réseau `net_storage` isolé |

---

## Identifiants

Les mots de passe sont dans le fichier `.env` sur la VM (jamais sur GitHub) :

```bash
ssh -i ~/.ssh/proxmox databridge@10.4.0.206
cat ~/databridge/repos/DataBridge/.env
```

---

## Segmentation réseau

```
LAN ──:80──► nginx ──(net_app)──► backend ──(net_db)──► postgres
                                           ──(net_storage)──► minio:9000
LAN ──:9001──► minio console (net_admin)
```

- **postgres** : 0 port exposé, joignable uniquement par le backend
- **minio API** : 0 port exposé, joignable uniquement par le backend
- **backend** : 0 port exposé, nginx gère tout le trafic entrant
- **nginx** : seul point d'entrée public (port 80)

---

## Commandes Docker utiles

```bash
# Depuis la VM :
cd ~/databridge/repos/DataBridge/infra/docker

# État des containers et réseaux
docker compose ps
docker network ls | grep databridge

# Logs
docker compose logs backend
docker compose logs postgres

# Accès direct à PostgreSQL
docker exec -it databridge_postgres psql -U databridge_user -d databridge

# Redémarrer un service
docker compose restart backend

# Mettre à jour après git pull
git pull origin main && docker compose build backend && docker compose up -d
```
