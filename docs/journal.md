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

---

## 2026-05-22 — Finalisation Étape 1 : nettoyage et instructions

### Réalisé
- Fusion des deux fichiers `CLAUDE.md` (racine + DataBridge/) en un seul contenu cohérent
- Ajout des instructions complètes dans `CLAUDE.md` : langue, stack figée, Git, suivi docs
- Suppression des 3 repos inutiles sur GitHub : `services-docker`, `documentation`, `site-vitrine`
- Suppression de la branche `dev` (travail sur `main` uniquement pour l'instant)
- Mise à jour du remote avec le nouveau token GitHub

### Fichiers modifiés
- `CLAUDE.md` — instructions complètes ajoutées
- `docs/journal.md` — ce fichier

### Décisions
- Pas de branche `dev` pour l'instant — équipe débutante, on simplifie le workflow Git
- Stack définitivement arrêtée : Vue.js · Express · JWT · Nginx · PostgreSQL · MinIO

### Prochaine étape
Étape 2 — Infrastructure Proxmox : récupérer les infos de l'environnement disponible (IP, RAM, stockage) et planifier la création des VMs/LXC
