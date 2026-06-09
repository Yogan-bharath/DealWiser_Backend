import { Router } from "express";
import * as authControllers from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", authControllers.userRegister);
authRouter.post("/login", authControllers.login);
authRouter.get("/getMe", authControllers.getMe);
authRouter.get("/refresh", authControllers.refresh);
authRouter.post("/logout", authControllers.logout);
authRouter.post("/logoutAll", authControllers.logoutAll);

export default authRouter;