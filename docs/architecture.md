# Architecture technique — DataBridge

## Vue d'ensemble

```
Navigateur
    │
    ▼ :80
[Nginx — Reverse proxy]
    │
    ├─ /         → Fichiers statiques frontend (Vue.js)
    │
    └─ /api/     → [Node.js / Express :3000]
                        │
                        ├─ [Parser Excel/CSV]
                        │
                        ├─ [PostgreSQL :5432]
                        │    Données transformées
                        │
                        └─ [MinIO :9000]
                             Fichiers originaux

MinIO Console :9001 (administration directe)
```

---

## Composants

### Nginx (reverse proxy)
- Point d'entrée unique sur le port 80
- Route `/api/*` vers le backend Node.js
- Sert les fichiers statiques Vue.js pour tout le reste
- Container : `databridge_nginx`

### Frontend (Vue.js)
- Interface d'upload de fichiers
- Visualisation des données importées
- Gestion des utilisateurs (admin)
- Port dev : 5173 — Port prod (via Nginx) : 80

### Backend (Node.js / Express)
- API REST pour gérer les imports
- Parsing des fichiers Excel/CSV
- Insertion des données en base PostgreSQL
- Gestion de l'authentification JWT
- Port : 3000
- Container : `databridge_backend`

### PostgreSQL
- Stockage des données transformées
- Une table par import avec colonnes détectées automatiquement
- Port : 5432
- Container : `databridge_postgres`

### MinIO
- Stockage des fichiers originaux (Excel, CSV)
- Compatible S3 — accessible via API
- Port API : 9000 — Port console : 9001
- Container : `databridge_minio`

---

## Réseau Docker

Tous les containers sont sur le réseau interne `databridge_network`.
Ils communiquent entre eux par leur nom de service (ex: `backend` contacte `postgres` via l'hôte `postgres`).

```
databridge_network (bridge)
├── databridge_postgres   (postgres:5432)
├── databridge_minio      (minio:9000, minio:9001)
├── databridge_backend    (backend:3000)
└── databridge_nginx      (nginx:80)
```

Ports exposés à l'extérieur (VM 10.4.0.206) :

| Port | Service   |
|------|-----------|
| 80   | Nginx     |
| 3000 | Backend   |
| 5432 | PostgreSQL|
| 9000 | MinIO API |
| 9001 | MinIO UI  |

---

## Flux d'import d'un fichier

```
1. L'utilisateur upload un fichier Excel via le frontend
2. Le frontend envoie le fichier à POST /api/import
3. Le backend stocke le fichier original dans MinIO
4. Le parser analyse le fichier et détecte les colonnes
5. Les données sont insérées dans PostgreSQL
6. Le frontend affiche un aperçu des données importées
```

---

## Volumes Docker (données persistantes)

| Volume                  | Contenu                          |
|-------------------------|----------------------------------|
| `databridge_postgres_data` | Données PostgreSQL            |
| `databridge_minio_data`    | Fichiers stockés dans MinIO   |

Ces volumes survivent aux redémarrages et aux `docker compose down`.
Pour effacer les données : `docker compose down -v` (irréversible).

---

## Diagramme d'infrastructure

Le schéma complet est disponible dans :
- [`docs/databridge-infrastructure.excalidraw`](databridge-infrastructure.excalidraw) — éditable sur excalidraw.com
- [`docs/databridge-infrastructure.svg`](databridge-infrastructure.svg) — export visuel
