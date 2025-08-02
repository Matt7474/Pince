import pkg from "pg";

const { Pool } = pkg;

// Construction de la DATABASE_URL à partir des variables individuelles
const DATABASE_URL = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Configuration du pool de connexions
const db = new Pool({
	connectionString: DATABASE_URL,
});

export { db };
