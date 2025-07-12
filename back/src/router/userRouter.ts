import { Router } from "express";
import * as userController from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { catchErrors } from "../middlewares/catchErrors";

const userRouter = Router();

userRouter.get("/me", authMiddleware, catchErrors(userController.getUserInfo));

userRouter.patch(
	"/me",
	authMiddleware,
	catchErrors(userController.updateUserProfile),
);

userRouter.patch(
	"/theme",
	authMiddleware,
	catchErrors(userController.updateTheme),
);

userRouter.patch(
	"/me/password",
	authMiddleware,
	catchErrors(userController.updatePassword),
);

userRouter.delete(
	"/me",
	authMiddleware,
	catchErrors(userController.deleteUser),
);

export { userRouter };
