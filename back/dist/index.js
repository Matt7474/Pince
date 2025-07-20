"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
require("dotenv/config");
const node_path_1 = __importDefault(require("node:path"));
const notFound_1 = require("./src/middlewares/notFound");
const router_1 = require("./src/router");
const envFile = process.env.NODE_ENV === "docker"
    ? ".env.docker"
    : process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.dev";
require("dotenv").config({ path: envFile });
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("API Pince est en ligne 🚀🚀🚀");
});
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
const swaggerPath = node_path_1.default.resolve(__dirname, "src/swagger/swagger.yaml");
const swaggerDocument = yamljs_1.default.load(swaggerPath);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(router_1.router);
app.use(notFound_1.notFound);
app.listen(PORT, () => {
    console.log(`🚀 API démarrée sur le port ${PORT}`);
    if (process.env.NODE_ENV === "production") {
        console.log("📄 Swagger UI disponible sur /api-docs");
    }
    else {
        console.log(`📄 Swagger UI disponible sur http://localhost:${PORT}/api-docs`);
    }
});
// Export toujours présent
exports.default = app;
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
