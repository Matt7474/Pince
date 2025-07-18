import path from "node:path";
import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { authRouter } from "./authRouter";
import { budgetRouter } from "./budgetRouter";
import { expenditureRouter } from "./expenditureRouter";
import { userRouter } from "./userRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/expenses", expenditureRouter);
router.use("/budgets", budgetRouter);
router.use("/users", userRouter);

// En développement, swagger est dans src/swagger/
// En production (compilé), swagger est dans dist/src/swagger/
const swaggerPath = path.resolve(__dirname, "../swagger/swagger.yaml");
console.log("Swagger path:", swaggerPath); // Pour debug
const swaggerDocument = YAML.load(swaggerPath);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { router };
