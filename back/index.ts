import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import "dotenv/config";
import path from "node:path";
import { notFound } from "./src/middlewares/notFound";
import { router } from "./src/router";

const envFile =
	process.env.NODE_ENV === "docker"
		? ".env.docker"
		: process.env.NODE_ENV === "production"
			? ".env.production"
			: ".env.dev";
require("dotenv").config({ path: envFile });

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
	res.send("API Pince est en ligne 🚀🚀🚀");
});

app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

const swaggerPath = path.resolve(__dirname, "src/swagger/swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(helmet());
app.use(express.json());
app.use(router);

app.use(notFound);

// Export toujours présent
export default app;

app.listen(PORT, () => {
	console.log(`🚀 API démarrée sur le port ${PORT}`);
	if (process.env.NODE_ENV === "production") {
		console.log("📄 Swagger UI disponible sur /api-docs");
	} else {
		console.log(
			`📄 Swagger UI disponible sur http://localhost:${PORT}/api-docs`,
		);
	}
});

// // Différent comportement selon l'environnement
// if (process.env.NODE_ENV === "production") {
// 	console.log("🚀 API démarrée en production");
// 	console.log("📄 Swagger UI disponible sur /api-docs");
// } else {
// 	app.listen(PORT, () => {
// 		console.log("🚀 API démarrée sur http://localhost:3000");
// 		console.log(
// 			`📄 Swagger UI disponible sur http://localhost:${PORT}/api-docs`,
// 		);
// 	});
// }
