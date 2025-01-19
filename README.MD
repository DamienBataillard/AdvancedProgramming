# Advanced_Programming Project

## Description
Ce projet est une application backend utilisant Node.js, Express et MySQL.

## Prérequis
- Node.js (version 16 ou supérieure)
- MySQL (version 8 ou supérieure)
- Un gestionnaire de packages comme `npm`

## Installation

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/mon-projet.git
   cd mon-projet
   ```

2. **Configurer l'environnement (Créez un fichier .env dans le dossier backend et ajoutez-y les informations suivantes)** :
    ```bash
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=VotreMotDePasse
    DB_NAME=advanced_programming
    PORT=5000
    JWT_SECRET=VotreSecretJWT
    ```

3. **Installer les dépendances** :

   ```bash
   cd backend
   npm install
   ```

   ```bash
   cd frontend
   npm install --force
   ```

4. **Lancer l'application**
    Pour démarrer le serveur backend :

    ```bash
    node initDB.js
    npm start
    ```


    Pour démarrer le serveur frontend :

    ```bash
    npm start
    ```

