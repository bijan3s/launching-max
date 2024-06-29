import UserAuthController from "@controllers/user/UserAuthController";
import UserManagementController from "@controllers/user/UserManagementController";
import express, { Application } from "express";
import UserMiddleware from "src/app/middleware/UserMiddleware";

export default function (app: Application) {
  const Router = express.Router();

  //user management routes
  Router.get("/users", UserManagementController.index);
  Router.get("/users/:id", UserManagementController.show);
  Router.post("/users", UserManagementController.create);
  Router.put("/users/:id", UserManagementController.update);
  Router.delete("/users/:id", UserManagementController.delete);

  //auth routes
  Router.post("/logout", UserAuthController.logout);
  Router.post("/logout-all", UserAuthController.logoutAll);

  Router.all("/*", (req, res) => {
    return res.notFound();
  });
  // Apply Router
  app.use("/api/user/", UserMiddleware, Router);
}
