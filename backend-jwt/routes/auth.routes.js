import { Router } from "express";
import { controller } from "../controllers/auth.controllers.js"; // Incluye la extensión .js

const authRouter = Router();

authRouter.post('/register', controller.register);
authRouter.post('/login', controller.login);
authRouter.post('/logout', controller.logout);
authRouter.get('/session', controller.session);

export default authRouter;