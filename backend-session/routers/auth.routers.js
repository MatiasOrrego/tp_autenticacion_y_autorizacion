import express from "express";
import { controllers } from "../controllers/auth.controllers";

export const authRouter = express.Router();

authRouter.post('/register', controllers.register);
authRouter.post('/login', controllers.login);
authRouter.get('/session', controllers.session);
authRouter.post('/logout', controllers.logout);

export default authRouter;