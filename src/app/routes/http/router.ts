import { Application } from "express";
import UserRoutes from "./api/user";
import SiteRoutes from "./api/site";

export default function Router(app: Application) {
  UserRoutes(app);
  SiteRoutes(app);
}
