# Architecture DataBridge

## Vue d'ensemble

```
Navigateur
    │
    ▼
[Vue.js Frontend]
    │  HTTP/HTTPS
    ▼
[Nginx - Reverse Proxy]
    │
    ├──▶ [Node.js / Express - API REST]
    │         │
    │         ├──▶ [Parser Excel/CSV]
    │         │         │
    │         │         ▼
    │         ├──▶ [PostgreSQL - Base de données]
    │         │
    │         └──▶ [MinIO - Stockage fichiers originaux]
    │
    └──▶ [Frontend static files]
```

## Composants

### Frontend (Vue.js)
- Interface d'upload de fichiers
- Visualisation des données importées
- Gestion des utilisateurs (admin)
- Port : 5173 (dev) / 80 (prod via Nginx)

### Backend (Node.js / Express)
- API REST pour gérer les imports
- Parsing des fichiers Excel/CSV (librairie `xlsx` ou `csv-parser`)
- Insertion des données en base PostgreSQL
- Gestion de l'authentification JWT
- Port : 3000

### PostgreSQL
- Stockage des données transformées
- Une table par "import" avec les colonnes détectées automatiquement
- Port : 5432

### MinIO
- Stockage des fichiers originaux (Excel, CSV)
- Compatible S3 — accessible via API
- Ports : 9000 (API) / 9001 (console web)

### Nginx
- Reverse proxy : redirige vers frontend ou backend selon l'URL
- Point d'entrée unique : port 80/443

## Flux d'import d'un fichier

1. L'utilisateur upload un fichier Excel via le frontend
2. Le backend reçoit le fichier et le stocke dans MinIO
3. Le parser analyse le fichier et détecte les colonnes
4. Les données sont insérées dans PostgreSQL
5. Le frontend affiche un aperçu des données importées
