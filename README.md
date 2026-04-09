# Systeme Intelligent de Detection des Maladies des Plantes

Ce projet contient un frontend React (dossier `le code`) et un backend FastAPI (dossier `app`) pour:
- Authentification utilisateur (inscription, connexion, token JWT)
- Analyse d'images de plantes
- Historique des diagnostics par utilisateur

## Lancer le backend

1. Installer les dependances:
   - `pip install -r requirements.txt`
2. Demarrer l'API:
   - `uvicorn app.main:app --reload`
3. Ouvrir la documentation:
   - `http://127.0.0.1:8000/docs`

## Endpoints principaux

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/google`
- `GET /auth/me` (Bearer token requis)
- `POST /predict/analyze` (Bearer token + image)
- `GET /predict/history` (Bearer token requis)
- `DELETE /predict/history` (Bearer token requis)

## Configuration Google Login

Pour activer Google Login:
- Backend: definir la variable d'environnement `GOOGLE_CLIENT_ID`
- Frontend: remplacer `GOOGLE_CLIENT_ID` dans `le code/app.js`
