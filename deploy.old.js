import { execSync } from "node:child_process";
import {
	copyFileSync,
	cpSync,
	existsSync,
	mkdirSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";

console.log("🚀 Déploiement Pince - Démarrage...");

// Configuration
const CONFIG = {
	frontendPath: "./front",
	backendPath: "./back",
	distPath: "./deploy",
	serverFile: "server.js",
};

// Fonction utilitaire pour exécuter des commandes
function run(command, cwd = process.cwd()) {
	console.log(`📦 Exécution: ${command}`);
	try {
		execSync(command, { cwd, stdio: "inherit" });
	} catch (_error) {
		console.error(`❌ Erreur lors de l'exécution de: ${command}`);
		process.exit(1);
	}
}

// Nettoyer le dossier de déploiement
function cleanDist() {
	console.log("🧹 Nettoyage du dossier de déploiement...");
	if (existsSync(CONFIG.distPath)) {
		rmSync(CONFIG.distPath, { recursive: true, force: true });
	}
	mkdirSync(CONFIG.distPath, { recursive: true });
}

// Build du frontend
function buildFrontend() {
	console.log("⚛️  Build du frontend React...");
	run("pnpm install", CONFIG.frontendPath);
	run("pnpm run build", CONFIG.frontendPath);

	// Copier les fichiers buildés
	const frontDistPath = join(CONFIG.frontendPath, "dist");
	if (existsSync(frontDistPath)) {
		cpSync(frontDistPath, CONFIG.distPath, { recursive: true });
		console.log("✅ Frontend copié vers deploy/");
	} else {
		console.error("❌ Dossier dist du frontend introuvable");
		process.exit(1);
	}
}

// Build du backend
function buildBackend() {
	console.log("🔧 Build du backend Node.js...");
	run("pnpm install", CONFIG.backendPath);
	run("pnpm run build", CONFIG.backendPath);

	// Créer le dossier api dans deploy
	const apiPath = join(CONFIG.distPath, "api");
	mkdirSync(apiPath, { recursive: true });

	// Copier les fichiers buildés du backend
	const backDistPath = join(CONFIG.backendPath, "dist");
	if (existsSync(backDistPath)) {
		cpSync(backDistPath, apiPath, { recursive: true });
		console.log("✅ Backend copié vers deploy/api/");
	} else {
		console.error("❌ Dossier dist du backend introuvable");
		process.exit(1);
	}

	// Copier package.json du backend
	const backendPackageJson = join(CONFIG.backendPath, "package.json");
	if (existsSync(backendPackageJson)) {
		copyFileSync(backendPackageJson, join(apiPath, "package.json"));
	}
}

// Créer le serveur unifié
// Créer le serveur unifié
function createUnifiedServer() {
	console.log("🌐 Création du serveur unifié...");

	const serverContent = `
const express = require('express');
const path = require('path');
const app = express();

// Log global des requêtes
app.use((req, res, next) => {
  console.log("📥 Reçu:", req.method, req.url);
  next();
});

// Configuration importante
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS si nécessaire
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes API - AVANT les fichiers statiques
app.use('/api', (req, res, next) => {
  console.log(\`API Request: \${req.method} \${req.url}\`);

  try {
    const backendPath = path.join(__dirname, 'api', 'index.js');
    delete require.cache[require.resolve(backendPath)]; // Éviter le cache
    
    const backendApp = require(backendPath);

    if (typeof backendApp === 'function') {
      backendApp(req, res, next);
    } else if (backendApp && typeof backendApp.handle === 'function') {
      backendApp.handle(req, res, next);
    } else {
      res.status(500).json({
        error: 'Configuration backend incorrecte',
        path: req.path,
        method: req.method
      });
    }
  } catch (error) {
    console.error('Erreur backend:', error);
    res.status(500).json({
      error: 'Erreur serveur backend',
      message: error.message,
      path: req.path
    });
  }
});

// Route de test pour vérifier que l'API fonctionne
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API fonctionne !',
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// Servir les assets statiques à la racine /assets
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
  index: false,
}));

// Servir index.html pour toutes les routes frontend (hors /api)
app.get(['/', '/*'], (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all pour les routes API non trouvées
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Route API non trouvée',
    path: req.path,
    availableRoutes: ['/api/test', '/api/login']
  });
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({
    error: 'Erreur serveur interne',
    message: error.message
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 Serveur Pince démarré sur le port \${PORT}\`);
  console.log(\`📍 Frontend: http://localhost:\${PORT}/\`);
  console.log(\`🔧 API: http://localhost:\${PORT}/api\`);
});

module.exports = app;
`;

	writeFileSync(join(CONFIG.distPath, CONFIG.serverFile), serverContent);
	console.log("✅ Serveur unifié créé");
}

// Créer le package.json pour le déploiement
function createDeployPackageJson() {
	console.log("📦 Création du package.json de déploiement...");

	const packageJson = {
		name: "pince-deploy",
		version: "1.0.0",
		description: "Pince - Application déployée",
		main: "server.js",
		scripts: {
			start: "node server.js",
			"start:prod": "NODE_ENV=production node server.js",
		},
		dependencies: {
			express: "^4.18.2",
		},
		engines: {
			node: ">=16.0.0",
		},
	};

	writeFileSync(
		join(CONFIG.distPath, "package.json"),
		JSON.stringify(packageJson, null, 2),
	);
	console.log("✅ package.json créé");
}

// Créer le fichier .htaccess pour O2Switch
function createHtaccess() {
	console.log("🔧 Création du fichier .htaccess...");

	const htaccessContent = `AddType application/javascript .js
AddType text/css .css

# Redirection vers Node.js pour les routes API
RewriteEngine On

# Forcer l'exécution de Node.js pour toutes les requêtes
PassengerEnabled on
PassengerStartupFile server.js
PassengerAppType node
PassengerNodejs /usr/bin/node

# Redirection pour les routes API vers Node.js
RewriteCond %{REQUEST_URI} ^/api/.*$
RewriteRule ^(.*)$ server.js [L,QSA]

# Redirection pour tous les autres fichiers vers Node.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ server.js [L,QSA]

# Headers pour les API
<FilesMatch "\.js$">
    Header set Content-Type application/javascript
</FilesMatch>

<FilesMatch "\.json$">
    Header set Content-Type application/json
</FilesMatch>
# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE application/javascript
</IfModule>

# Cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType application/json "access plus 0 seconds"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>`;

	writeFileSync(join(CONFIG.distPath, ".htaccess"), htaccessContent);
	console.log("✅ .htaccess créé");
}

// Fonction principale
async function main() {
	try {
		cleanDist();
		buildFrontend();
		buildBackend();
		createUnifiedServer();
		createDeployPackageJson();
		createHtaccess();

		console.log("\n🎉 Déploiement préparé avec succès !");
		console.log("📁 Fichiers prêts dans le dossier: ./deploy");
		console.log("\n📋 Étapes suivantes :");
		console.log("1. Uploadez le contenu du dossier deploy/ vers public_html/");
		console.log("2. Installez les dépendances : npm install");
		console.log("3. Configurez Node.js dans cPanel O2Switch");
		console.log("4. Pointez vers server.js comme fichier de démarrage");
	} catch (error) {
		console.error("❌ Erreur lors du déploiement:", error);
		process.exit(1);
	}
}

main();
