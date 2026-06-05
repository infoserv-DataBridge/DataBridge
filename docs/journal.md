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

---

## 2026-06-05 — Étape 4 : Base de données PostgreSQL + stockage MinIO

### Ce qui a été fait

**PostgreSQL — schéma créé :**
- `backend/db/schema.sql` : 3 tables + 4 index
- `users` : gestion des utilisateurs (email, mot de passe hashé, rôle)
- `imports` : métadonnées de chaque fichier importé (nom, type, chemin MinIO, colonnes détectées, statut)
- `import_rows` : données importées en JSONB (flexible, s'adapte à n'importe quelles colonnes)
- Script monté dans docker-compose → s'exécute automatiquement au premier démarrage de postgres

**MinIO — bucket créé :**
- Bucket `databridge-files` créé automatiquement via `minio-init` (service docker-compose)
- Utilise l'image officielle `minio/mc:latest`
- Idempotent : `--ignore-existing` évite l'erreur si le bucket existe déjà

**Backend — connexions ajoutées :**
- `pg` : client PostgreSQL (v8.11)
- `minio` : client MinIO (v8.0)
- `GET /api/health` vérifie maintenant les 3 services : API + PostgreSQL + MinIO

### Résultat du health check

```json
{
  "status": "ok",
  "version": "0.2.0",
  "services": {
    "postgres": "ok",
    "minio": "ok"
  }
}
```

### Ce qui reste à faire (Étape 5)

- Routes API : POST /api/import (upload fichier)
- Parser Excel/CSV → extraction colonnes et données
- Sauvegarde fichier dans MinIO
- Insertion des données dans PostgreSQL (import_rows)
- Routes GET pour consulter les imports

---

## 2026-06-05 — Segmentation réseau Docker + documentation complète

### Ce qui a été fait

**Sécurité réseau — 4 réseaux Docker isolés :**

| Réseau | Type | Containers |
|--------|------|-----------|
| `net_db` | `internal: true` | postgres ↔ backend |
| `net_storage` | `internal: true` | minio ↔ backend |
| `net_app` | bridge | nginx ↔ backend |
| `net_admin` | bridge | minio console |

**Résultat :** nginx ne peut plus joindre postgres (testé et confirmé). Backend non exposé. Seuls les ports 80 (nginx) et 9001 (minio console) sont accessibles depuis le LAN.

**Documentation mise à jour :**
- `TODO.md` créé : checklist collaborative avec schémas Mermaid (roadmap, architecture, ce qui reste)
- `docs/architecture.md` : schémas Mermaid (réseau Docker, BDD ERD, flux d'import)
- `docs/acces.md` : distinction services LAN vs services internes VM
- `infra-proxmox/network/README.md` : mise à jour segmentation

### Ce qui reste à faire
- Étape 5 : routes API backend (import fichiers, parsing Excel/CSV)

---

## 2026-06-05 — Sécurisation credentials + nettoyage général

### Ce qui a été fait

**Credentials sécurisés :**
- `~/databridge/.secrets/credentials.md` sur la VM (chmod 600, jamais dans git)
- `docs/secrets.enc` : version chiffrée AES-256 dans le repo (openssl)
- `docs/PROJET_COMPLET.md` : référence complète non-sensible dans le repo

**Nettoyage docker-compose.yml :**
- Correction bug `ports:` orpheline après suppression binding postgres
- Validation YAML confirmée

**Audit :**
- Aucun mot de passe en clair dans git
- `.env`, `infra/docker/.env`, `.secrets/` tous exclus par gitignore

---

## 2026-06-05 — Étape 5 : Backend API complet

### Ce qui a été fait

**Nouvelle structure backend :**
- `backend/services/database.js` — Pool PostgreSQL partagé
- `backend/services/storage.js` — Client MinIO + fonction uploadFile
- `backend/services/parser.js` — Parseur Excel (xlsx) et CSV (csv-parser)
- `backend/routes/health.js` — GET /api/health v0.3.0
- `backend/routes/imports.js` — Routes import complètes

**Routes API disponibles :**

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/health` | Statut API + postgres + minio |
| POST | `/api/imports` | Upload fichier → parse → MinIO → PostgreSQL |
| GET | `/api/imports` | Liste tous les imports |
| GET | `/api/imports/:id` | Détail d'un import |
| GET | `/api/imports/:id/rows` | Données paginées (`?page=&limit=`) |

**Limites et validations :**
- Formats acceptés : `.xlsx`, `.xls`, `.csv`
- Taille max : 10 Mo
- Statut import en base : `pending` → `processing` → `done` / `error`
- Insert par batch de 100 lignes (performances)

**Test réussi** — fichier CSV 5 lignes importé, données dans PostgreSQL et fichier dans MinIO (`2026/06/...`)

**Nettoyage repo :**
- Suppression des `.gitkeep` inutiles (backend/, parsers/, frontend/, infra/, infra/docker/)
- Suppression du dossier `backend/parsers/` (remplacé par `backend/services/parser.js`)

### Ce qui reste à faire (Étape 6)
- Initialiser Vue.js dans `frontend/`
- Page login, upload, tableau de données

---

## 2026-06-05 — Étape 6 : Frontend Vue.js

### Ce qui a été fait

**Application Vue.js 3 complète :**

| Fichier | Rôle |
|---------|------|
| `src/main.js` | Entrée de l'app, monte Vue + router |
| `src/App.vue` | Layout global (NavBar + RouterView) |
| `src/router/index.js` | 3 routes : `/`, `/imports`, `/imports/:id` |
| `src/api.js` | Fonctions fetch vers le backend |
| `src/style.css` | CSS global minimaliste |
| `src/components/NavBar.vue` | Barre de navigation |
| `src/views/ImportView.vue` | Upload drag & drop + résultat + imports récents |
| `src/views/ImportsView.vue` | Tableau de tous les imports |
| `src/views/ImportDetailView.vue` | Données tabulaires paginées |

**Docker :**
- `Dockerfile.frontend` mis à jour : build multi-stage (Node → nginx)
- `docker-compose.yml` : nginx utilise maintenant `Dockerfile.frontend` (plus de volume mount)
- Build Vite : 36 modules, 101kb JS, 6kb CSS

**Testé :**
- `GET /` → HTTP 200, Vue.js chargé
- `GET /imports` → HTTP 200 (SPA routing)
- `GET /api/health` via nginx → OK

### Prochaine étape (Étape 7)
- Routes auth : register, login
- Middleware JWT
- Page login Vue.js
