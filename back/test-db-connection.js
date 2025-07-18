// test-db-connection.js
const { Client } = require("pg");
require("dotenv").config({
	path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

async function testConnection() {
	const client = new Client({
		user: process.env.PG_USER,
		host: process.env.PG_HOST,
		database: process.env.PG_NAME,
		password: process.env.PG_PASSWORD,
		port: Number(process.env.PG_PORT),
	});

	try {
		await client.connect();
		console.log("Connexion à la base réussie ✅");
	} catch (err) {
		console.error("Erreur de connexion à la base ❌", err);
	} finally {
		await client.end();
	}
}

testConnection();
