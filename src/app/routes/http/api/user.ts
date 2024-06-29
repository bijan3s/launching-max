import UserManagementController from "@controllers/user/UserManagementController";
import express, { Application } from "express";

export default function (app: Application) {
  const Router = express.Router();

  //user management routes
  Router.get("/users", UserManagementController.index);
  Router.get("/users/:id", UserManagementController.show);
  Router.post("/users", UserManagementController.create);
  Router.put("/users/:id", UserManagementController.update);
  Router.delete("/users/:id", UserManagementController.delete);

  Router.all("/*", (req, res) => {
    return res.notFound();
  });
  // Apply Router
  app.use("/api/user/", Router);
}
