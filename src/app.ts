import "./setPath";
import express from "express";
import HTTP from "http";
import configExpress from "./configs/express";
import router from "src/app/routes/http/router";
import customResponseMethods from "./providers/response";
import cors from "cors";
import corsConfigs from "@configs/corsConfigs";
import mongoose from "mongoose";
import { mongoConnection } from "./database";
import { serverConfig } from "@configs/server";
import dotenv from "dotenv";

// Here we import .env configs
dotenv.config();

const app = express();
app.use(customResponseMethods);
app.use(cors(corsConfigs));

configExpress(app);
router(app);

const server = HTTP.createServer(app);

(async () => {
  try {
    await mongoConnection(mongoose).connectToMongo();
    serverConfig(app, mongoose, server).startServer();
  } catch (error) {
    console.error("Failed to start server:", error);
  }
})();
