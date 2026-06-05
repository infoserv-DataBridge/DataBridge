# Architecture technique — DataBridge

## Vue d'ensemble

```mermaid
graph TB
    subgraph EXT["🌐 Réseau externe (LAN)"]
        USER["👤 Utilisateur"]
        ADMIN["🔧 Admin"]
    end

    subgraph VM["🖥️ VM — 10.4.0.206"]
        subgraph net_app["net_app (bridge)"]
            NGINX["nginx :80"]
            BACK["backend :3000"]
        end
        subgraph net_db["net_db (internal)"]
            PG["postgres :5432"]
        end
        subgraph net_storage["net_storage (internal)"]
            MINIO["minio :9000"]
        end
        subgraph net_admin["net_admin (bridge)"]
            MINIO_UI["minio :9001"]
        end
    end

    USER -->|"HTTP :80"| NGINX
    ADMIN -->|"HTTP :9001"| MINIO_UI
    NGINX -->|"/api/*"| BACK
    BACK --- PG
    BACK --- MINIO
    MINIO -.- MINIO_UI
```

## Segmentation réseau Docker

| Réseau | Type | Containers | Accès externe |
|--------|------|-----------|---------------|
| `net_db` | `internal: true` | postgres, backend | ❌ Impossible |
| `net_storage` | `internal: true` | minio, backend, minio-init | ❌ Impossible |
| `net_app` | bridge | nginx, backend | Via nginx:80 seulement |
| `net_admin` | bridge | minio | Console :9001 uniquement |

### Principe du moindre privilège

```
postgres  → UNIQUEMENT joignable par backend (net_db)
minio API → UNIQUEMENT joignable par backend (net_storage)
backend   → UNIQUEMENT joignable par nginx (net_app), aucun port exposé
nginx     → Seul point d'entrée public (port 80)
```

## Containers Docker

| Container | Image | Réseaux | Port exposé | Rôle |
|-----------|-------|---------|-------------|------|
| `databridge_postgres` | postgres:16-alpine | net_db | aucun | BDD |
| `databridge_minio` | minio/minio:latest | net_storage, net_admin | :9001 | Stockage |
| `databridge_minio_init` | minio/mc | net_storage | aucun | Init bucket |
| `databridge_backend` | node:20-alpine | net_db, net_storage, net_app | aucun | API REST |
| `databridge_nginx` | nginx:alpine | net_app | :80 | Reverse proxy |

## Schéma BDD

```mermaid
erDiagram
    users {
        serial id PK
        varchar email UK
        varchar password_hash
        varchar role
        timestamptz created_at
    }
    imports {
        serial id PK
        integer user_id FK
        varchar original_filename
        varchar file_type
        varchar minio_key
        integer row_count
        jsonb columns
        varchar status
        text error_message
        timestamptz created_at
    }
    import_rows {
        bigserial id PK
        integer import_id FK
        integer row_index
        jsonb data
        timestamptz created_at
    }
    users ||--o{ imports : "crée"
    imports ||--o{ import_rows : "contient"
```

## Flux d'import d'un fichier

```mermaid
sequenceDiagram
    actor User
    participant Nginx
    participant Backend
    participant MinIO
    participant PostgreSQL

    User->>Nginx: POST /api/import (fichier)
    Nginx->>Backend: proxy vers backend:3000
    Backend->>MinIO: Stocke fichier original
    Backend->>Backend: Parse Excel/CSV
    Backend->>PostgreSQL: INSERT dans imports
    Backend->>PostgreSQL: INSERT dans import_rows (JSONB)
    Backend-->>Nginx: { importId, rowCount }
    Nginx-->>User: 200 OK
```

## Volumes persistants

| Volume | Données | Survit au `down` |
|--------|---------|-----------------|
| `databridge_postgres_data` | Tables PostgreSQL | ✅ Oui |
| `databridge_minio_data` | Fichiers stockés | ✅ Oui |

> Pour tout effacer : `docker compose down -v` (irréversible)

## Accès admin PostgreSQL (via SSH tunnel)

Postgres n'est pas exposé directement. Pour y accéder avec un outil graphique :

```bash
# Créer un tunnel SSH depuis votre machine locale
ssh -i ~/.ssh/proxmox -L 5432:localhost:5432 databridge@10.4.0.206

# Puis connecter votre outil (DBeaver, TablePlus...) sur localhost:5432
# OU directement via docker exec sur la VM :
docker exec -it databridge_postgres psql -U databridge_user -d databridge
```
