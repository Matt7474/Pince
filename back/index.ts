import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { notFound } from "./src/middlewares/notFound";
import { router } from "./src/router";

const envFile = process.env.NODE_ENV === "docker" ? ".env.docker" : ".env.dev";
require("dotenv").config({ path: envFile });

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
	cors({
		origin: "*", // à restreindre en prod !
		methods: ["GET", "POST", "PATCH", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);
const swaggerDocument = YAML.load("./src/swagger/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(helmet());
app.use(express.json());
app.use(router);

app.use(notFound);

app.listen(PORT, () => {
	console.log("🚀 API démarrée sur http://localhost:3000");
	console.log("📄 Swagger UI disponible sur ");
});
