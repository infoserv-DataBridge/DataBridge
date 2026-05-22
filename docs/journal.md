# Journal de bord — DataBridge

## 2026-05-22 — Étape 1 : Organisation du projet

### Réalisé
- Création de l'organisation GitHub `infoserv-DataBridge`
- Mise en place du monorepo principal `DataBridge`
- Définition de la stack technique finale
- Clarification du périmètre projet : import Excel/CSV → PostgreSQL
- Création de la structure de dossiers (`frontend/`, `backend/parsers/`, `infra/docker/`, `docs/`)
- Rédaction du `README.md`, `CLAUDE.md`, `.env.example`, `.gitignore`
- Archivage des repos inutiles (`site-vitrine`, `services-docker`, `documentation`)
- Création de la branche `dev`

### Décisions techniques
- **Vue.js** retenu pour le frontend (simplicité, courbe d'apprentissage douce)
- **Node.js / Express** retenu pour le backend
- **JWT** préféré à Keycloak pour commencer (moins de complexité)
- **Nginx** comme reverse proxy
- Architecture **monorepo** : tout le code dans un seul repo `DataBridge`

### Prochaine étape
Étape 2 — Infrastructure Proxmox : création des VMs/LXC et configuration réseau
