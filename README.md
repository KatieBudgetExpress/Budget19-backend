# Budget19 Backend

Ce dépôt contient une petite API Express écrite en JavaScript pour servir de backend au projet Budget19. Ce document explique la structure du code et donne des points de repère pour démarrer lorsqu'on débute avec ce type d'application.

## Structure générale

- **`index.js`** : point d'entrée de l'application. Il configure Express, active les middlewares et lance le serveur HTTP.
- **`database.sqlite`** : fichier de base de données SQLite utilisé par Sequelize pour stocker les données. Il est généré automatiquement par SQLite si besoin.
- **`package.json`** et **`package-lock.json`** : décrivent le projet Node.js, la liste des dépendances et les scripts disponibles.
- **`node_modules/`** : dossier automatiquement généré qui contient le code des dépendances installées. Il n'est généralement pas versionné dans Git.

## Fonctionnement d'`index.js`

1. **Chargement des bibliothèques** : Express pour créer le serveur HTTP, Cors pour accepter les requêtes provenant d'autres domaines, et Sequelize pour gérer la base de données SQLite.
2. **Initialisation d'Express** : l'application est créée, CORS est activé et le serveur sait lire du JSON en entrée.
3. **Connexion à la base SQLite** : Sequelize ouvre le fichier `database.sqlite` et vérifie que la connexion fonctionne.
4. **Définition d'une route de test** : la route `GET /` renvoie un message confirmant que l'API fonctionne.
5. **Lancement du serveur** : l'application écoute sur le port 3000 et affiche un message dans la console.

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
