import UserAuthController from "@controllers/user/UserAuthController";
import express, { Application } from "express";

export default function (app: Application) {
  const Router = express.Router();

  //user auth routes
  Router.post("/signup", UserAuthController.signup);
  Router.post("/login", UserAuthController.login);

  //  not found user api.
  Router.all("/*", (req, res) => {
    return res.notFound();
  });

  // Apply Router
  app.use("/api/site/", Router);
}
