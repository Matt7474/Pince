"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const notFound_1 = require("./src/middlewares/notFound");
const router_1 = require("./src/router");
const envFile = process.env.NODE_ENV === "docker" ? ".env.docker" : ".env.dev";
require("dotenv").config({ path: envFile });
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*", // à restreindre en prod !
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
const swaggerDocument = yamljs_1.default.load("./src/swagger/swagger.yaml");
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(router_1.router);
app.use(notFound_1.notFound);
app.listen(PORT, () => {
    console.log("🚀 API démarrée sur http://localhost:3000");
    console.log("📄 Swagger UI disponible sur ");
});
