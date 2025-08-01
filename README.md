# 🦀 Projet La Pince

Bienvenue sur le dépôt du projet **La Pince** !  
Cette application propose une gestion simple des budgets et des dépenses.

## 🧭 Sommaire

- [Prérequis](#prérequis)
- [Cloner le dépôt](#cloner-le-dépôt)
- [Installation du back-end](#installation-du-back-end)

- [Création de la base de données principale](#création-de-la-base-de-données-principale)

- [Création de la base de données de test](#création-de-la-base-de-données-de-test)

- [Installation du front-end](#installation-du-front-end)
- [Essai de l'application ](#essai-de-lapplication)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Documentation Swagger](#documentation-swagger)
- [Structure du projet](#structure-du-projet)
- [Auteur](#auteur)
- [Licence](#licence)


## Prérequis

Avant de commencer, assurez-vous d’avoir les éléments suivants installés sur votre machine :

- 🟢 [Node.js](https://nodejs.org/) (version **≥ 18** recommandée)  
- 📦 [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)
- 🐘 [PostgreSQL](https://www.postgresql.org/) (version **≥ 16** recommandée)


## Cloner le dépôt  

```bash
bash

git clone https://github.com/Matt7474/Pince
cd Pince
```
## Installation du back-end

📦 Installation des dépendances
```bash
bash

cd back
npm install
# ou pnpm install
```

🔐 Configuration des variables d’environnement   
```bash
bash

# Copier le fichier d’exemple
cp .env.example .env.dev
```

---
## Création de la base de données principale

🐘 Se connecter à l’instance PostgreSQL
```bash
bash

sudo -i -u postgres psql
```
🧾 Entrez ensuite les commandes SQL suivantes :
```bash
sql

# -- Création du rôle et du mot de passe
CREATE ROLE pinceapp WITH LOGIN PASSWORD 'pinceapp';

# -- Création de la base de données
CREATE DATABASE pinceapp OWNER pinceapp;
```
---

### 🗂️ 1. Création des tables et insertion de données

Depuis le dossier : Pince/back/

```bash
bash

# Création des tables
psql -U pinceapp -d pinceapp -f ./data/create_data.sql

# Ajout de données d’essai
psql -U pinceapp -d pinceapp -f ./data/seeding.sql

🔑 Mot de passe attendu : pinceapp
```
---

### ▶️ 2. Démarrer le serveur backend
Depuis le dossier : Pince/back/
```bash
bash

npm run dev
# ou pnpm run dev
```

---
## Création de la base de données de test

🐘 Se connecter à l’instance PostgreSQL
```bash
bash

sudo -i -u postgres psql
```
🧾 Entrez ensuite les commandes SQL suivantes :
```bash
sql

# -- Création du rôle et du mot de passe
CREATE ROLE pincetest WITH LOGIN PASSWORD 'pincetest';

# -- Création de la base de données
CREATE DATABASE pincetest OWNER pincetest;
```
---

### 🗂️ 1. Création des tables de test

Depuis le dossier : Pince/back/

```bash
bash

psql -U pincetest -d pincetest -f ./data/create_data.sql

🔑 Mot de passe attendu : pincetest
```
🔐 1.2 Configuration des variables d’environnement   
```bash
bash

# Copier le fichier d’exemple
cp .env.test.example .env.test
```
---
### 🧪 6. Lancer les tests backend

Depuis le dossier : Pince/back/

Pour exécuter les tests un par un :
```bash
bash

npm run test:func:auth
npm run test:func:budget
npm run test:func:expenditure
```

Pour exécuter tous les tests d'un coup :
```bash
bash

npm run test
```


---
## Installation du front-end

### 🖼️ 1. Frontend (front)

📦 1.1 Installation des dépendances
```bash
bash

cd front
npm install
# ou pnpm install
```

🔑 1.2 Configuration des variables d’environnement   
```bash
bash

# Copier le fichier d’exemple
cp .env.example .env.development
```
### ▶️ 2. Démarrer le serveur frontend
Depuis le dossier : Pince/front/
```bash
bash

npm run dev
# ou pnpm run dev
```
---  


## Essai de l'application 

🧪 Un jeu de données est fourni automatiquement via le script `seeding.sql`.


### 👤 Compte de démonstration

Vous pouvez utiliser ce compte pour tester immédiatement l'application :

- **Email** : `demo@pince.app`
- **Mot de passe** : `Password1`

**📌 Ce compte dispose déjà de 3 budgets créés et de dépenses associée.**

Vous pouvez également créer votre propre compte si vous préférez.

Bonne exploration ! 🎉


## Fonctionnalités principales

- Création et gestion de plusieurs budgets
- Ajout, modification et suppression de dépenses
- Suivi visuel de la consommation des budgets
- Authentification sécurisée via JWT
- Et bien plus encore à découvrir !

## Documentation Swagger
📖 https://pince-api.matt-dev.fr/api-docs


## Structure du projet

📂 Pince/  
├── back/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Code backend (Node.js + PostgreSQL)    
│   ├── data/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Scripts SQL (création & seed)  
│   ├── src/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Code source (routes, services, etc.)  
│   └── .env.*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Variables d’environnement  
│  
├── front/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Code Frontend (React)  
│   ├── src/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Code source (routes, composants, etc.)  
│   ├── .env.*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Variables d’environnement   
│   └── public/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Fichiers statiques (favicon, images, vidéos, ...)  
│  
└──.github/workflows/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Dossier de déploiement  
&nbsp;&nbsp;&nbsp;&nbsp;└── deploy.yml&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← Instructions github Action

## Auteur
🧑‍💻 Matthieu Dimier

## Licence
📝 Ce projet est distribué sous la licence **MIT**.  
Consultez le fichier [LICENSE](./LICENSE) pour plus d’informations.