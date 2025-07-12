import { afterAll } from "@jest/globals";
import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config({ path: ".env.test" });

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

afterAll(async () => {
	await pool.end();
});
