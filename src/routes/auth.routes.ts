import { Router } from "express";
import { signup, login, findRefreshToken, logout } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.route("/signup").post(signup);
authRouter.route("/login").post(login);
authRouter.route("/refresh").post(findRefreshToken);
authRouter.route("/logout").post(logout);

export default authRouter;