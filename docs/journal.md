# Journal de bord — DataBridge

---

## 2026-06-05 — Nettoyage et documentation complète du repo

### Ce qui a été fait

Refonte complète de toute la documentation GitHub et correction de l'infrastructure Docker.

**Fichiers réécrits :**
- `README.md` — structure claire, accès VM, roadmap à jour, conventions Git
- `docs/setup.md` — deux sections : VM (production) et local (développement)
- `docs/architecture.md` — architecture complète avec réseau Docker, volumes, flux d'import
- `CLAUDE.md` — instructions Claude mises à jour, roadmap à jour

**Fichiers créés :**
- `docs/acces.md` — toutes les URLs, ports, logins (sans mots de passe), commandes Docker

**Code corrigé :**
- `backend/server.js` — encodage du console.log corrigé

---

## 2026-06-05 — Étape 3 : Infrastructure Docker complète

### Ce qui a été fait

Mise en place complète de l'infrastructure Docker.

**4 containers démarrés :**

| Container            | Image               | Port(s)    | État    |
|----------------------|---------------------|------------|---------|
| databridge_postgres  | postgres:16-alpine  | 5432       | healthy |
| databridge_minio     | minio/minio:latest  | 9000, 9001 | healthy |
| databridge_backend   | node:20-alpine      | 3000       | running |
| databridge_nginx     | nginx:alpine        | 80         | running |

**Fichiers créés :**
- `infra/docker/docker-compose.yml`
- `infra/docker/Dockerfile.backend`
- `infra/docker/Dockerfile.frontend`
- `infra/docker/nginx/nginx.conf`
- `backend/package.json` + `backend/server.js`
- `frontend/index.html`
- `.env` (local, non versionné)

### Architecture réseau

```
http://10.4.0.206     → nginx → frontend statique
http://10.4.0.206/api → nginx → backend:3000
http://10.4.0.206:9001 → console MinIO
```

### Ce qui reste à faire (Étape 4)

- Créer le schéma PostgreSQL (tables)
- Créer le bucket MinIO `databridge-files` automatiquement
- Connecter le backend à PostgreSQL et MinIO

---

## 2026-05-29 — Étape 1 : Préparation environnement

- Création organisation GitHub `infoserv-DataBridge`
- Création des repos `DataBridge` et `infra-proxmox`
- Mise en place structure dossiers sur la VM (10.4.0.206)
- Clonage des repos sur la VM
- Configuration clés SSH GitHub
- Création fichiers de base (CLAUDE.md, README.md, .gitignore, .env.example)
- Création diagramme d'infrastructure (Excalidraw + SVG)
