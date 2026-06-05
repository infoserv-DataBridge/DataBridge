# DataBridge — Todo List & Suivi de projet

> Fichier partagé — modifiable par Yannis, Tommy et Claude Code.
> Cochez `[x]` quand c'est terminé. Ajoutez vos notes dans la section prévue en bas.
> Claude met aussi ce fichier à jour après chaque session de travail.

---

## Statut global

```mermaid
gantt
    title Roadmap DataBridge
    dateFormat  YYYY-MM-DD
    section Terminé
    Étape 1 — Environnement      :done, e1, 2026-05-29, 1d
    Étape 3 — Docker + Réseaux   :done, e3, 2026-06-05, 1d
    Étape 4 — PostgreSQL + MinIO :done, e4, 2026-06-05, 1d
    section En cours
    Étape 5 — Backend API        :active, e5, 2026-06-05, 7d
    section À faire
    Étape 6 — Frontend Vue.js    :e6, after e5, 10d
    Étape 7 — Auth JWT           :e7, after e6, 5d
    Étape 8 — Tests + Sécu       :e8, after e7, 7d
```

---

## Architecture actuelle (ce qui tourne)

```mermaid
graph TB
    subgraph EXT["🌐 Réseau externe (LAN)"]
        USER["👤 Utilisateur\nhttp://10.4.0.206"]
        ADMIN["🔧 Admin\nhttp://10.4.0.206:9001"]
    end

    subgraph VM["🖥️ VM DataBridge — 10.4.0.206 (Debian 12, 4CPU, 2Go)"]

        subgraph net_app["🔵 net_app (bridge)"]
            NGINX["nginx:80\n✅ Reverse proxy + frontend"]
            BACKEND["backend:3000\n✅ API Node.js v0.2"]
        end

        subgraph net_db["🔴 net_db (internal — isolé)"]
            POSTGRES["postgres:5432\n✅ PostgreSQL 16\n3 tables créées"]
        end

        subgraph net_storage["🟡 net_storage (internal — isolé)"]
            MINIO_API["minio:9000\n✅ MinIO API\nbucket: databridge-files"]
        end

        subgraph net_admin["🟢 net_admin (bridge)"]
            MINIO_UI["minio:9001\n✅ Console MinIO"]
        end

    end

    USER -->|":80"| NGINX
    ADMIN -->|":9001"| MINIO_UI
    NGINX <-->|"/api/*"| BACKEND
    BACKEND <-->|"SQL"| POSTGRES
    BACKEND <-->|"S3 API"| MINIO_API
    MINIO_API -.- MINIO_UI

    style net_db fill:#ffe0e0,stroke:#cc0000
    style net_storage fill:#fff3cd,stroke:#cc8800
    style net_app fill:#d0e8ff,stroke:#0055cc
    style net_admin fill:#d4edda,stroke:#155724
```

---

## ✅ Ce qui est fait

### Étape 1 — Préparation (2026-05-29)
- [x] Organisation GitHub créée (`infoserv-DataBridge`)
- [x] Repos créés : `DataBridge` + `infra-proxmox`
- [x] VM DataBridge créée sur Proxmox (Debian 12, 10.4.0.206)
- [x] Docker 29.5.2 + Docker Compose v5.1.4 installés
- [x] Structure dossiers sur la VM
- [x] Diagramme infrastructure Excalidraw créé

### Étape 3 — Infrastructure Docker (2026-06-05)
- [x] `docker-compose.yml` avec 5 services (postgres, minio, minio-init, backend, nginx)
- [x] `Dockerfile.backend` (Node.js 20 Alpine)
- [x] `Dockerfile.frontend` (multi-stage Vue.js, prêt pour étape 6)
- [x] `nginx.conf` (reverse proxy `/api/` → backend, `/` → frontend)
- [x] **Segmentation réseau** : 4 réseaux isolés (net_db, net_storage, net_app, net_admin)
  - postgres : accessible UNIQUEMENT par le backend (net_db internal)
  - minio API : accessible UNIQUEMENT par le backend (net_storage internal)
  - minio console : accessible admin via net_admin (port 9001)
  - backend : aucun port exposé vers l'extérieur
  - nginx : seul point d'entrée public (port 80)

### Étape 4 — Base de données & stockage (2026-06-05)
- [x] Schéma PostgreSQL : `users`, `imports`, `import_rows` + index GIN
- [x] Bucket MinIO `databridge-files` créé automatiquement (service minio-init)
- [x] Backend connecté à PostgreSQL et MinIO (`pg` + `minio` npm)
- [x] `GET /api/health` vérifie les 3 services (API + postgres + minio)

### Documentation & infrastructure
- [x] `README.md` : accès VM, roadmap, structure, conventions Git
- [x] `docs/acces.md` : toutes les URLs, ports, commandes Docker
- [x] `docs/setup.md` : installation VM et local séparés
- [x] `docs/architecture.md` : architecture complète avec schémas
- [x] `docs/journal.md` : historique de toutes les sessions
- [x] `infra-proxmox` : specs VM, réseau, journal infra
- [x] `.env.example` : commenté Docker vs local

---

## 🔄 En cours

### Étape 5 — Backend API (import fichiers)
- [ ] `POST /api/import` — upload d'un fichier Excel ou CSV
- [ ] Parser Excel (`xlsx`)
- [ ] Parser CSV (`csv-parser`)
- [ ] Sauvegarde du fichier original dans MinIO
- [ ] Insertion des données dans `import_rows` (PostgreSQL)
- [ ] `GET /api/imports` — liste de tous les imports
- [ ] `GET /api/imports/:id` — détail d'un import
- [ ] `GET /api/imports/:id/rows` — données ligne par ligne
- [ ] Gestion des erreurs (fichier invalide, doublon, taille max)

---

## ⏳ À faire

### Étape 6 — Frontend Vue.js
- [ ] Initialiser projet Vue.js (Vite)
- [ ] Page de connexion (login)
- [ ] Interface upload de fichier (drag & drop)
- [ ] Tableau de visualisation des données importées
- [ ] Historique des imports
- [ ] Indicateur de statut (en cours, terminé, erreur)

### Étape 7 — Authentification JWT
- [ ] `POST /api/auth/register` — inscription
- [ ] `POST /api/auth/login` — connexion, retourne un token JWT
- [ ] Middleware JWT — protège les routes `/api/*`
- [ ] Gestion des rôles : `admin` / `user`
- [ ] Hashage des mots de passe (`bcrypt`)

### Étape 8 — Tests, sécurisation, documentation finale
- [ ] Tests API (Jest ou Vitest)
- [ ] HTTPS (certificat SSL via Let's Encrypt ou auto-signé)
- [ ] Sauvegardes automatiques PostgreSQL (cron + script)
- [ ] Limites de taille de fichier (max 10 Mo)
- [ ] Documentation utilisateur finale (guide non-technicien)
- [ ] Revue de sécurité (OWASP top 10)

---

## 🏗️ Ce qu'il restera à construire

```mermaid
graph LR
    subgraph FAIT["✅ Fait"]
        A["Infra Docker\n+ Réseaux isolés"]
        B["BDD PostgreSQL\n+ MinIO"]
        C["API health check"]
    end

    subgraph ENCOURS["🔄 En cours"]
        D["Routes API\nimport fichiers"]
    end

    subgraph AFAIRE["⏳ À faire"]
        E["Frontend Vue.js"]
        F["Auth JWT"]
        G["Tests + HTTPS\n+ Sauvegardes"]
    end

    A --> B --> C --> D --> E --> F --> G
```

---

## 📝 Notes de l'équipe

> Ajoutez vos notes ici avec la date et votre prénom.
> Exemple : `**2026-06-05 — Yannis :** J'ai testé l'API, tout fonctionne.`

<!-- Espace pour vos notes -->

