# Budget19 Backend

Ce dépôt contient une API Express écrite en JavaScript pour servir de backend au projet Budget19. Ce document explique la nouvelle structure du code et donne des points de repère pour démarrer lorsqu'on débute avec ce type d'application.

## Structure générale

- **`index.js`** : point d'entrée minimal qui lance le serveur défini dans `src/server.js`.
- **`src/app.js`** : crée et configure l'application Express (middlewares, routes communes, etc.).
- **`src/server.js`** : orchestre le démarrage du serveur HTTP après avoir vérifié la connexion à la base de données.
- **`src/config/database.js`** : initialise Sequelize et expose l'instance de connexion à SQLite.
- **`database.sqlite`** : fichier de base de données SQLite utilisé par Sequelize pour stocker les données. Il est généré automatiquement par SQLite si besoin.
- **`package.json`** et **`package-lock.json`** : décrivent le projet Node.js, la liste des dépendances et les scripts disponibles.
- **`node_modules/`** : dossier automatiquement généré qui contient le code des dépendances installées. Il n'est généralement pas versionné dans Git.

## Fonctionnement de l'API

1. **Chargement des bibliothèques** : Express pour créer le serveur HTTP, Cors pour accepter les requêtes provenant d'autres domaines, et Sequelize pour gérer la base de données SQLite.
2. **Création de l'application** : `createApp` configure Express, active CORS, l'analyse du JSON et expose des routes de base comme `/` et `/health`.
3. **Connexion à la base SQLite** : `testConnection` valide l'accès au fichier `database.sqlite` via Sequelize avant de lancer le serveur.
4. **Démarrage du serveur** : `startServer` lance l'application sur le port défini dans la variable d'environnement `PORT` (3000 par défaut) et affiche un message dans la console.

## Dépendances principales

- **Express** : framework minimaliste pour créer des serveurs web en Node.js.
- **Cors** : middleware qui permet à des applications front-end hébergées ailleurs d'accéder à cette API.
- **Sequelize** : ORM (Object-Relational Mapping) qui simplifie l'accès à la base de données.
- **sqlite3** : pilote nécessaire à Sequelize pour dialoguer avec le fichier SQLite.

## Démarrer le projet

1. Installer les dépendances (déjà faites si `node_modules` existe) :
   ```bash
   npm install
   ```
2. Lancer le serveur :
   ```bash
   node index.js
   ```
3. Vérifier dans la console que la connexion à SQLite et le démarrage du serveur se sont bien déroulés. Vous pouvez ensuite ouvrir [http://localhost:3000](http://localhost:3000) dans un navigateur pour voir le message de test.

## Étapes suivantes possibles

- **Structurer l'API** : créer des dossiers comme `routes/`, `controllers/` ou `models/` pour séparer la logique métier.
- **Définir des modèles Sequelize** : représenter les entités de l'application (utilisateurs, budgets, dépenses, etc.).
- **Ajouter des routes** : implémenter les opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) en s'appuyant sur les modèles.
- **Gérer les erreurs et la configuration** : ajouter une gestion d'erreurs centralisée et utiliser des variables d'environnement pour la configuration.
- **Écrire des tests** : ajouter un framework de tests (Jest, Mocha...) pour vérifier automatiquement le comportement du backend.

Ce README est volontairement orienté pour un public débutant. N'hésitez pas à compléter chaque section au fur et à mesure de votre apprentissage.
