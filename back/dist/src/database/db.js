"use strict";
// import dotenv from "dotenv";
// import pkg from "pg";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// const { Pool } = pkg;
// if (process.env.NODE_ENV === "test") {
// 	dotenv.config({ path: ".env.test" });
// } else {
// 	dotenv.config(); // équivalent de dotenv.config({ path: '.env' })
// }
// // Configuration du pool de connexions
// const db = new Pool({
// 	connectionString: process.env.DATABASE_URL,
// 	/* user: process.env.PG_USER,
//     host: process.env.PG_HOST,
//     database:  process.env.PG_NAME,
//     password:  process.env.PG_PASSWORD,
//     port: parseInt(process.env.PG_PORT || "5432"), */
// 	/* ssl: {
//       rejectUnauthorized: false, // Nécessaire pour Render
//     },*/
// });
// db.connect();
// // .then(() => console.log("Connexion réussie à PostgreSQL"))
// // .catch((err) => console.error("Erreur de connexion à PostgreSQL :", err));
// export { db };
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
// Construction de la DATABASE_URL à partir des variables individuelles
const DATABASE_URL = `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_NAME}`;
console.log("DATABASE_URL construite:", DATABASE_URL);
// Configuration du pool de connexions
const db = new Pool({
    connectionString: DATABASE_URL,
});
exports.db = db;
