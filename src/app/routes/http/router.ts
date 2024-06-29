import { Application } from "express";
import UserRoutes from "./api/user";

export default function Router(app: Application) {
  UserRoutes(app);
}
