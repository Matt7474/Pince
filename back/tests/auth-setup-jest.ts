import { afterAll, afterEach, beforeAll } from "@jest/globals";
import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config({ path: ".env.test" });

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

beforeAll(async () => {
	await pool.query(`TRUNCATE TABLE "user", "budget" RESTART IDENTITY CASCADE;`);

	// Seeding : ajout de données nécessaires aux tests
	await pool.query(`
    INSERT INTO "user" (email, last_name, first_name, "password")
VALUES ('martin.fretto@gmail.com', 'Fretto', 'Martin', '$argon2id$v=19$m=65536,t=3,p=4$+C4A2vvar25ppRrrUFyRQw$dNtz7oRLpJuRi4GdQNr8QC2CVF8hCzsQlvhAL0CWAPI'),
('bobby@gmail.com', 'Brown', 'Bobby', '$argon2id$v=19$m=65536,t=3,p=4$+C4A2vvar25ppRrrUFyRQw$dNtz7oRLpJuRi4GdQNr8QC2CVF8hCzsQlvhAL0CWAPI'),
('johnny@gmail.com', 'Brown', 'Johnny', '$argon2id$v=19$m=65536,t=3,p=4$+C4A2vvar25ppRrrUFyRQw$dNtz7oRLpJuRi4GdQNr8QC2CVF8hCzsQlvhAL0CWAPI');
INSERT INTO "budget" (name, warning_amount, spent_amount, allocated_amount, user_id)
VALUES ('alimentation', 600, 0, 700, 1),
('santé', 100, 0, 150, 1),
('loisir', 600, 0, 700, 2),
('logement', 100, 0, 150, 2),
('habits', 600, 0, 700, 3),
('transport', 100, 0, 150, 3);
  `);
});

//Supppression de l'utilisateur test@oclock.io après chaque test
afterEach(async () => {
	await pool.query(`DELETE FROM "user" where email='test@oclock.io';`);
});

afterAll(async () => {
	await pool.end();
});
