"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const node_path_1 = __importDefault(require("node:path"));
const express_1 = require("express");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const authRouter_1 = require("./authRouter");
const budgetRouter_1 = require("./budgetRouter");
const expenditureRouter_1 = require("./expenditureRouter");
const userRouter_1 = require("./userRouter");
const router = (0, express_1.Router)();
exports.router = router;
router.use("/auth", authRouter_1.authRouter);
router.use("/expenses", expenditureRouter_1.expenditureRouter);
router.use("/budgets", budgetRouter_1.budgetRouter);
router.use("/users", userRouter_1.userRouter);
// En développement, swagger est dans src/swagger/
// En production (compilé), swagger est dans dist/src/swagger/
const swaggerPath = node_path_1.default.resolve(__dirname, "../swagger/swagger.yaml");
console.log("Swagger path:", swaggerPath); // Pour debug
const swaggerDocument = yamljs_1.default.load(swaggerPath);
router.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
