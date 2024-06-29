import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

export default function configExpress(app: Application) {
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(
    express.json({
      limit: "50mb",
    })
  );
  app.use(cookieParser());
  app.use(limiter);
}
