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

## Lancer avec Docker

1. Copier le fichier d'environnement:
   - `cp .env.example .env`
2. Construire et lancer:
   - `docker compose up --build`
3. Ouvrir la documentation:
   - `http://127.0.0.1:8000/docs`

## Mode prediction (sans executer le modele en local)

Variables dans `.env`:
- `PREDICT_MODE=mock` pour la demo locale (prediction simulee)
- `PREDICT_MODE=remote` pour appeler un endpoint de modele distant
- `REMOTE_PREDICT_URL` URL du service d'inference distant (obligatoire en mode `remote`)
- `REMOTE_PREDICT_API_KEY` si le service distant demande une cle

Format attendu de la reponse distante (JSON):
- `disease_name`
- `severity`
- `treatment`
- `prevention`
- `confidence` (0..1 ou 0..100)

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
- Backend: definir la variable d'environnement `GOOGLE_CLIENT_ID` (meme valeur que le frontend)
- Frontend: remplacer `GOOGLE_CLIENT_ID` dans `le code/app.js`

### Erreur `400: origin_mismatch` (bloque la connexion Google)

Google compare l'URL de la page avec les **origines JavaScript** declarees pour votre **Client ID OAuth** (type **Application Web**). Si elles ne correspondent pas exactement, la connexion est refusee.

1. Ouvrez [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**
2. Cliquez sur le **OAuth 2.0 Client ID** dont l'ID correspond a celui dans `le code/app.js` (ex. `...apps.googleusercontent.com`)
3. Sous **Authorized JavaScript origins**, ajoutez **exactement** (meme protocole, hote et port que dans la barre d'adresse du navigateur), par exemple pour un serveur local sur le port 5500:
   - `http://127.0.0.1:5500`
   - `http://localhost:5500`
4. Enregistrez, attendez 1 a 2 minutes, puis rechargez la page du site

**Important:** `http://127.0.0.1:5500` et `http://localhost:5500` sont deux origines differentes pour Google. Utilisez toujours la meme URL que celle affichee dans le navigateur, ou declarez les deux.

Documentation Google sur cette erreur: [Authorization errors / origin mismatch](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#authorization-errors-origin-mismatch)
