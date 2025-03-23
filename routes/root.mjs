import express from "express";
import HomeController from "../controllers/home_controller.mjs";

const rootRouter = express.Router();
// rootRouter.get("/", checkLogin, HomeController.index);
rootRouter.get("/", HomeController.index);

rootRouter.get("/login", HomeController.login);
rootRouter.post("/login", HomeController.createLogin);
rootRouter.get("/signup", HomeController.signup);
rootRouter.post("/signup", HomeController.createSignup);
rootRouter.get("/dashboard", HomeController.dashboard);



export default rootRouter;