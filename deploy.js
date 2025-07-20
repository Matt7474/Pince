import { execSync } from "node:child_process";
import {
	copyFileSync,
	cpSync,
	existsSync,
	mkdirSync,
	rmSync,
	writeFileSync,
	readFileSync,
	readdirSync,
	statSync,
} from "node:fs";
import { join } from "node:path";

console.log("🚀 Déploiement Pince - Version Simplifiée");

const CONFIG = {
	frontendPath: "./front",
	backendPath: "./back",
	distPath: "./deploy",
	frontendOut: "front-dist",
	backendOut: "back-dist",
	serverFile: "server.js",
};

function run(cmd, cwd = process.cwd()) {
	console.log(`📦 ${cmd}`);
	try {
		execSync(cmd, { cwd, stdio: "inherit" });
	} catch (e) {
		console.error(`❌ Erreur: ${cmd}`);
		process.exit(1);
	}
}

function cleanDist() {
	console.log("🧹 Nettoyage du dossier deploy...");
	if (existsSync(CONFIG.distPath)) {
		rmSync(CONFIG.distPath, { recursive: true, force: true });
	}
	mkdirSync(CONFIG.distPath, { recursive: true });
	console.log("✅ Dossier deploy nettoyé");
}

function buildFrontend() {
	console.log("🏗️ Build du frontend...");
	run("pnpm install", CONFIG.frontendPath);
	run("pnpm run build", CONFIG.frontendPath);

	const out = join(CONFIG.frontendPath, "dist");
	const dest = join(CONFIG.distPath, CONFIG.frontendOut);

	if (existsSync(out)) {
		cpSync(out, dest, { recursive: true });
		console.log("✅ Frontend build copié");
	} else {
		console.error("❌ Dossier de build frontend introuvable:", out);
		process.exit(1);
	}
}

function buildBackend() {
	console.log("🏗️ Build du backend...");
	run("pnpm install", CONFIG.backendPath);
	run("pnpm run build", CONFIG.backendPath);

	const out = join(CONFIG.backendPath, "dist");
	const dest = join(CONFIG.distPath, CONFIG.backendOut);

	if (existsSync(out)) {
		cpSync(out, dest, { recursive: true });
		console.log("✅ Backend build copié");
	} else {
		console.error("❌ Dossier de build backend introuvable:", out);
		process.exit(1);
	}

	// Copier le package.json du backend
	const pkg = join(CONFIG.backendPath, "package.json");
	if (existsSync(pkg)) {
		copyFileSync(pkg, join(dest, "package.json"));
		console.log("✅ package.json backend copié");
	}
}

function createPackageJson() {
	console.log("📦 Création du package.json principal...");
	const pkg = {
		name: "pince-deploy",
		version: "1.0.0",
		main: "server.js",
		scripts: {
			start: "node server.js",
		},
		dependencies: {
			express: "^4.18.2",
		},
		engines: {
			node: ">=16.0.0",
		},
	};

	const pkgPath = join(CONFIG.distPath, "package.json");
	writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
	console.log("✅ package.json créé:", pkgPath);
}

function createServer() {
	console.log("🖥️ Création du serveur...");
	const content = `const express = require("express");
const path = require("path");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// API Routes
app.use("/api", (req, res, next) => {
  try {
    const handler = require("./${CONFIG.backendOut}/index.js");
    if (typeof handler === "function") return handler(req, res, next);
    if (handler?.handle) return handler.handle(req, res, next);
    if (handler.default) return handler.default(req, res, next);
    res.status(500).json({ error: "API handler introuvable" });
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: "Erreur serveur API" });
  }
});

// Assets statiques
app.use("/assets", express.static(path.join(__dirname, "assets")));

// SPA - toutes les autres routes
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "index.html");
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`✅ Serveur Pince démarré sur le port \${PORT}\`);
});

module.exports = app;`;

	const serverPath = join(CONFIG.distPath, CONFIG.serverFile);
	writeFileSync(serverPath, content);
	console.log("✅ server.js créé:", serverPath);
}

function copyAssetsAndIndex() {
	console.log("📁 Copie des assets et index...");

	// Copier les assets à la racine
	const frontAssetsPath = join(CONFIG.distPath, CONFIG.frontendOut, "assets");
	const rootAssetsPath = join(CONFIG.distPath, "assets");

	if (existsSync(frontAssetsPath)) {
		cpSync(frontAssetsPath, rootAssetsPath, { recursive: true });
		console.log("✅ Assets copiés à la racine");
	}

	// Copier l'index.html à la racine
	const frontIndexPath = join(
		CONFIG.distPath,
		CONFIG.frontendOut,
		"index.html",
	);
	const rootIndexPath = join(CONFIG.distPath, "index.html");

	if (existsSync(frontIndexPath)) {
		copyFileSync(frontIndexPath, rootIndexPath);
		console.log("✅ index.html copié à la racine");
	} else {
		console.error("❌ index.html introuvable:", frontIndexPath);
	}

	// Copier autres fichiers statiques
	const frontDistPath = join(CONFIG.distPath, CONFIG.frontendOut);
	if (existsSync(frontDistPath)) {
		const files = readdirSync(frontDistPath);
		for (const file of files) {
			if (file !== "index.html" && file !== "assets") {
				const srcPath = join(frontDistPath, file);
				const destPath = join(CONFIG.distPath, file);

				if (statSync(srcPath).isFile()) {
					copyFileSync(srcPath, destPath);
					console.log(`✅ ${file} copié à la racine`);
				}
			}
		}
	}
}

function createHtaccess() {
	console.log("⚙️ Création du .htaccess...");
	const content = `
RewriteEngine On

# Activer Passenger pour Node.js
PassengerEnabled on
PassengerAppType node
PassengerStartupFile server.js
PassengerNodejs /usr/bin/node

# Rediriger toutes les requêtes /api/* vers server.js
RewriteRule ^api/.*$ server.js [L,QSA]

# Si le fichier/dossier n'existe pas (et n'est pas /api), renvoyer index.html (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api
RewriteRule ^(.*)$ /index.html [L,QSA]

# Types MIME pour les fichiers statiques
AddType application/javascript .js
AddType text/css .css
AddType application/json .json

# Compression gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE text/css
</IfModule>
`;
	writeFileSync(join(CONFIG.distPath, ".htaccess"), content);
	console.log("✅ .htaccess créé:", join(CONFIG.distPath, ".htaccess"));
}

function main() {
	try {
		cleanDist();
		buildFrontend();
		buildBackend();
		createPackageJson();
		createServer();
		copyAssetsAndIndex();
		createHtaccess();

		console.log("\n🎉 Déploiement terminé avec succès!");
		console.log(`📂 Fichiers générés dans: ${CONFIG.distPath}`);

		// Vérifier que les fichiers importants sont bien là
		const importantFiles = [
			"package.json",
			"server.js",
			"index.html",
			".htaccess",
		];
		console.log("\n📋 Fichiers vérifiés:");
		for (const file of importantFiles) {
			const filePath = join(CONFIG.distPath, file);
			if (existsSync(filePath)) {
				console.log(`✅ ${file}`);
			} else {
				console.log(`❌ ${file} MANQUANT!`);
			}
		}
	} catch (error) {
		console.error("❌ Erreur lors du déploiement:", error);
		process.exit(1);
	}
}

main();
