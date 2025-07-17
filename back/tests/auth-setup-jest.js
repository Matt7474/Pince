"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
dotenv_1.default.config({ path: ".env.test" });
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
(0, globals_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield pool.query(`TRUNCATE TABLE "users", "budget" RESTART IDENTITY CASCADE;`);
    // Seeding : ajout de données nécessaires aux tests
    yield pool.query(`
    INSERT INTO "users" (email, last_name, first_name, "password")
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
}));
//Supppression de l'utilisateur test@oclock.io après chaque test
(0, globals_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield pool.query(`DELETE FROM "users" where email='test@oclock.io';`);
}));
(0, globals_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield pool.end();
}));
