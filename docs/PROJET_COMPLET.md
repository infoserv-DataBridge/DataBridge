# DataBridge — Référence complète du projet

> Ce fichier centralise TOUTES les informations du projet.
> Les mots de passe sont dans `docs/secrets.enc` (chiffré) et sur la VM.

---

## Accès rapide

| Ce que tu cherches | Où |
|--------------------|-----|
| URLs des services | [Section URLs](#urls-des-services) |
| Logins & mots de passe | [docs/secrets.enc](#credentials--mots-de-passe) |
| Lancer les containers | [Section Docker](#gérer-les-containers-docker) |
| Structure du projet | [Section Structure](#structure-du-projet) |
| Ce qu'il reste à faire | [`TODO.md`](../TODO.md) |
| Journal de bord | [`docs/journal.md`](journal.md) |

---

## URLs des services

| Service | URL | Description |
|---------|-----|-------------|
| **Application web** | http://10.4.0.206 | Interface utilisateur (nginx) |
| **API health check** | http://10.4.0.206/api/health | Statut postgres + minio |
| **Console MinIO** | http://10.4.0.206:9001 | Admin stockage fichiers |

---

## VM DataBridge

| Propriété | Valeur |
|-----------|--------|
| IP | `10.4.0.206` |
| OS | Debian 12 Bookworm |
| CPU | 4 vCPU |
| RAM | 2 Go |
| Disque | 6 Go |

```bash
# Connexion SSH
ssh -i ~/.ssh/proxmox databridge@10.4.0.206
```

---

## Credentials & mots de passe

Les mots de passe ne sont **jamais stockés en clair sur GitHub**.
Ils sont disponibles à deux endroits :

### 1. Sur la VM (référence principale)

```bash
# Se connecter à la VM puis :
cat ~/databridge/.secrets/credentials.md
```

### 2. Fichier chiffré dans le repo (`docs/secrets.enc`)

Ce fichier contient TOUS les credentials chiffrés avec AES-256.
Le mot de passe de déchiffrement vous a été communiqué lors de la session du 2026-06-05.

```bash
# Déchiffrer (remplacer MOT_DE_PASSE par le vrai mot de passe) :
openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 \
  -in docs/secrets.enc \
  -out /tmp/credentials.txt \
  -k "MOT_DE_PASSE"

# Lire le résultat :
cat /tmp/credentials.txt

# Supprimer le fichier temporaire après lecture :
rm /tmp/credentials.txt
```

> Le mot de passe de déchiffrement est : **`DataBridge@Secure2026!`**
> Notez-le dans votre gestionnaire de mots de passe.

### Logins (sans les mots de passe)

| Service | Login | Mot de passe |
|---------|-------|-------------|
| SSH VM | `databridge` | clé `~/.ssh/proxmox` |
| PostgreSQL | `databridge_user` | dans `secrets.enc` |
| MinIO console | `databridge_admin` | dans `secrets.enc` |
| GitHub | comptes Yannis + Tommy | personnel |

---

## Architecture réseau

```
LAN
 │
 ├─ :80  ──► nginx ──(net_app)──► backend ──(net_db)──► postgres
 │                                         ──(net_storage)──► minio:9000
 └─ :9001 ──► minio console (net_admin)
```

| Réseau Docker | Type | Containers | Port LAN |
|---------------|------|-----------|----------|
| `net_db` | internal | postgres + backend | ❌ |
| `net_storage` | internal | minio + backend | ❌ |
| `net_app` | bridge | nginx + backend | :80 via nginx |
| `net_admin` | bridge | minio | :9001 |

---

## Structure du projet

```
DataBridge/
├── TODO.md                    ← checklist collaborative
├── backend/
│   ├── db/schema.sql          ← schéma PostgreSQL (users, imports, import_rows)
│   ├── server.js              ← API Express
│   └── package.json
├── frontend/
│   └── index.html             ← placeholder (Vue.js à l'étape 6)
├── infra/docker/
│   ├── docker-compose.yml     ← 5 services + 4 réseaux isolés
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── nginx/nginx.conf
│   └── .env                   ← copie du .env racine (gitignore)
├── docs/
│   ├── PROJET_COMPLET.md      ← ce fichier
│   ├── secrets.enc            ← credentials chiffrés AES-256
│   ├── acces.md               ← URLs et commandes rapides
│   ├── architecture.md        ← schémas Mermaid
│   ├── setup.md               ← guide installation
│   └── journal.md             ← historique de tout ce qui a été fait
├── .env.example               ← template (sans mots de passe)
├── .env                       ← vraies valeurs (gitignore)
└── CLAUDE.md                  ← instructions pour Claude Code
```

---

## API — Routes disponibles (v0.3.0)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/health` | Statut API, postgres, minio |
| POST | `/api/imports` | Upload fichier (Excel/CSV) → traitement complet |
| GET | `/api/imports` | Liste tous les imports |
| GET | `/api/imports/:id` | Détail d'un import |
| GET | `/api/imports/:id/rows` | Données paginées (`?page=1&limit=50`) |

### Exemple upload

```bash
curl -X POST http://10.4.0.206/api/imports   -F "file=@mon_fichier.xlsx"
```

### Exemple lecture données

```bash
# Page 1, 50 lignes par page
curl "http://10.4.0.206/api/imports/1/rows?page=1&limit=50"
```

**Formats acceptés :** `.xlsx`, `.xls`, `.csv` — **Taille max :** 10 Mo


---

## Gérer les containers Docker

```bash
# Se connecter à la VM
ssh -i ~/.ssh/proxmox databridge@10.4.0.206

# Aller dans le dossier Docker
cd ~/databridge/repos/DataBridge/infra/docker

# Voir l'état de tous les containers
docker compose ps

# Logs en direct
docker compose logs -f backend
docker compose logs -f postgres

# Redémarrer un service
docker compose restart backend

# Arrêter tout
docker compose down

# Démarrer tout
docker compose up -d

# Mettre à jour après un git pull
cd ~/databridge/repos/DataBridge
git pull origin main
cd infra/docker
docker compose build backend
docker compose up -d

# Accéder directement à PostgreSQL
docker exec -it databridge_postgres psql -U databridge_user -d databridge
```

---

## Conventions Git

| Préfixe | Usage |
|---------|-------|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `docs:` | Documentation |
| `chore:` | Maintenance |

- Branche principale : `main`
- Toujours passer par **Pull Request** pour merger

---

## Repos GitHub

| Repo | URL | Contenu |
|------|-----|---------|
| DataBridge | https://github.com/infoserv-DataBridge/DataBridge | Application |
| infra-proxmox | https://github.com/infoserv-DataBridge/infra-proxmox | Infrastructure Proxmox |
