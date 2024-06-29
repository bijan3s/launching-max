import { NextFunction, Request, Response } from "express";
import PersonalAccessToken from "../models/personal_access_token/PersonalAccessToken";
import User from "../models/user/User";
import bcrypt from "bcryptjs";

export default async function UserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.headers["authorization"]) {
      return res.unauthorized("unauthorized");
    }
    const headerAuthentication = (req.headers["authorization"] as string)
      ?.split(" ")[1]
      ?.split("|");

    if (!headerAuthentication || headerAuthentication.length !== 2) {
      return res.unauthorized("unauthorized");
    }

    const userId = headerAuthentication[0];
    const token = headerAuthentication[1];
    const personalAccessTokens = await PersonalAccessToken.find({
      personId: userId,
    });

    if (personalAccessTokens?.length === 0) {
      return res.unauthorized("unauthorized");
    }

    for (const item of personalAccessTokens) {
      const isCorrectToken = bcrypt.compareSync(token, item.token);
      if (isCorrectToken) {
        const user = await User.findById(userId);

        if (!user) {
          return res.unauthorized("unauthorized");
        } else {
          req.user = user;
          return next();
        }
      }
    }
    return res.unauthorized("unauthorized");
  } catch (error) {
    return res.unauthorized("unauthorized");
  }
}
