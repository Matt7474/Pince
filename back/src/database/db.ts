import pkg from "pg";

const { Pool } = pkg;
// console.log("→ DB_USER =", process.env.DB_USER);
// console.log("→ DB_PASSWORD =", process.env.DB_PASSWORD);
// console.log("→ DB_HOST =", process.env.DB_HOST);
// console.log("→ DB_PORT =", process.env.DB_PORT);
// console.log("→ DB_NAME =", process.env.DB_NAME);

// Construction de la DATABASE_URL à partir des variables individuelles
const DATABASE_URL = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
// console.log("→ DATABASE_URL construite:", DATABASE_URL);

// Configuration du pool de connexions
const db = new Pool({
	connectionString: DATABASE_URL,
});

export { db };
