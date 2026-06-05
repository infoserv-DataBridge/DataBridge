# DataBridge — Todo List & Suivi de projet

> Fichier partagé — modifiable par Yannis, Tommy et Claude Code.
> Cochez `[x]` quand c'est terminé. Ajoutez vos notes dans la section Notes en bas.

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
    Étape 5 — Backend API        :done, e5, 2026-06-05, 1d
    section À faire
    Étape 6 — Frontend Vue.js    :e6, 2026-06-06, 10d
    Étape 7 — Auth JWT           :e7, after e6, 5d
    Étape 8 — Tests + Sécu       :e8, after e7, 7d
```

---

## Architecture en production

```mermaid
graph TB
    subgraph EXT["🌐 LAN"]
        U["👤 Utilisateur\n:80"]
        A["🔧 Admin\n:9001"]
    end
    subgraph VM["🖥️ VM 10.4.0.206"]
        subgraph net_app["net_app"]
            NGX["nginx"] <-->|proxy| BCK["backend v0.3"]
        end
        subgraph net_db["net_db (isolé)"]
            PG["postgres\nusers · imports · import_rows"]
        end
        subgraph net_storage["net_storage (isolé)"]
            MN["minio\ndatabridge-files"]
        end
    end
    U --> NGX
    A -->|":9001"| MN
    BCK --- PG
    BCK --- MN
```

---

## ✅ Ce qui est fait

### Étape 1 — Préparation (2026-05-29)
- [x] Organisation GitHub `infoserv-DataBridge` + 2 repos
- [x] VM Proxmox (Debian 12, 10.4.0.206, Docker 29.5.2)
- [x] Structure dossiers + clés SSH GitHub

### Étape 3 — Infrastructure Docker (2026-06-05)
- [x] `docker-compose.yml` — 5 services orchestrés
- [x] 4 réseaux Docker isolés (net_db, net_storage, net_app, net_admin)
- [x] postgres / minio non accessibles depuis le LAN (internal: true)
- [x] nginx seul point d'entrée public (:80)

### Étape 4 — Base de données & stockage (2026-06-05)
- [x] Schéma PostgreSQL : `users`, `imports`, `import_rows` + index GIN
- [x] Bucket MinIO `databridge-files` (auto-créé)
- [x] `GET /api/health` — vérifie postgres + minio

### Étape 5 — Backend API (2026-06-05)
- [x] `POST /api/imports` — upload fichier + parse + stocke dans MinIO + insère en BDD
- [x] Parser Excel (`.xlsx`, `.xls`) via `xlsx`
- [x] Parser CSV via `csv-parser`
- [x] Insert en batch (100 lignes à la fois) pour les gros fichiers
- [x] `GET /api/imports` — liste tous les imports
- [x] `GET /api/imports/:id` — détail d'un import
- [x] `GET /api/imports/:id/rows` — données paginées (`?page=1&limit=50`)
- [x] Gestion erreurs : format invalide, fichier > 10 Mo, statut error en BDD

### Infrastructure & Docs
- [x] `docs/PROJET_COMPLET.md` — référence complète
- [x] `docs/secrets.enc` — credentials chiffrés AES-256 dans le repo
- [x] `docs/architecture.md` — schémas Mermaid (réseau, BDD, flux import)
- [x] `TODO.md` — ce fichier collaboratif
- [x] `infra-proxmox` — specs VM, réseau, journal

---

## ⏳ À faire

### Étape 6 — Frontend Vue.js
- [ ] Init projet Vue.js + Vite dans `frontend/`
- [ ] Page de connexion (login)
- [ ] Interface upload fichier (drag & drop)
- [ ] Tableau de visualisation des données importées
- [ ] Historique des imports avec statut
- [ ] Pagination des données

### Étape 7 — Authentification JWT
- [ ] `POST /api/auth/register` — inscription
- [ ] `POST /api/auth/login` — connexion → token JWT
- [ ] Middleware JWT — protection de toutes les routes `/api/imports`
- [ ] Gestion des rôles : `admin` / `user`
- [ ] Hashage mots de passe (`bcrypt`)

### Étape 8 — Tests, sécurisation, finalisation
- [ ] Tests API (Jest)
- [ ] HTTPS (certificat SSL)
- [ ] Sauvegardes automatiques PostgreSQL
- [ ] Limite upload 10 Mo visible côté frontend
- [ ] Documentation utilisateur final (non-techniciens)

---

## 🏗️ Progression

```mermaid
graph LR
    subgraph FAIT["✅ Fait"]
        A["Infra Docker\n4 réseaux isolés"]
        B["PostgreSQL\n+ MinIO"]
        C["API complète\nimport + lecture"]
    end
    subgraph AFAIRE["⏳ À faire"]
        D["Frontend\nVue.js"]
        E["Auth JWT"]
        F["Tests + HTTPS\n+ Sauvegardes"]
    end
    A --> B --> C --> D --> E --> F
```

---

## 📝 Notes de l'équipe

> Ajoutez vos notes ici avec la date et votre prénom.

<!-- Exemple :
**2026-06-05 — Yannis :** J'ai testé l'upload CSV, ça fonctionne bien.
**2026-06-05 — Tommy :** Je commence le frontend demain.
-->
