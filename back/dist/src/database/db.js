"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
if (process.env.NODE_ENV === "test") {
    dotenv_1.default.config({ path: ".env.test" });
}
else {
    dotenv_1.default.config(); // équivalent de dotenv.config({ path: '.env' })
}
// Configuration du pool de connexions
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    /* user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database:  process.env.PG_NAME,
    password:  process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || "5432"), */
    /* ssl: {

      rejectUnauthorized: false, // Nécessaire pour Render

    },*/
});
exports.db = db;
db.connect();
