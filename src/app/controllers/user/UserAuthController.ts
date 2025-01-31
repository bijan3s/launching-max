import AbstractController from "@controllers/AbstractController";
import { Request, Response, response } from "express";
import { ObjectId, Types } from "mongoose";
import User from "src/app/models/user/User";
import AuthService from "src/app/services/authentication/AuthService";
import Validator from "src/app/services/validator/validator";

const authService = new AuthService("user");

class UserAuthController extends AbstractController {
  async login(req: Request, res: Response) {
    try {
      const validator = new Validator(req);
      validator.body("loginFactor").required();
      validator.body("password").required().minLength(8);
      if (validator.hasErrors()) {
        return res.validationError(validator.errors());
      }

      const { loginFactor, password } = req.body;
      authService.login(loginFactor, password, res);
    } catch (error) {
      return res.internalError();
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const { username, email, password, role } = req.body;

      const validator = new Validator(req);
      await validator
        .body("username")
        .required()
        .minLength(2)
        .maxLength(32)
        .custom(async (val) => {
          const user = await User.findOne({ username: val });
          if (user) return "unique";
          else return true;
        });

      await validator
        .body("email")
        .required()
        .email()
        .custom(async (val) => {
          const user = await User.findOne({ email: val });
          if (user) return "unique";
          else return true;
        });

      validator.body("password").required().minLength(8).maxLength(32);

      if (validator.hasErrors()) {
        return res.validationError(validator.errors());
      }
      authService.signup({ email, password, username }, res);
    } catch (error) {
      return res.internalError(`${error}`);
    }
  }
  async logout(req: Request, res: Response) {
    try {
      const headerAuthentication = (req.headers["authorization"] as string)
        ?.split(" ")[1]
        ?.split("|");

      const token = headerAuthentication[1];
      const userId = headerAuthentication[0];
      await authService.logout(token, userId as any);
      return res.success("شما با موفقیت از حساب خود خارج شدید");
    } catch (error) {
      console.log(`${error}`);
      return res.internalError();
    }
  }

  async logoutAll(req: Request, res: Response) {
    try {
      const headerAuthentication = (req.headers["authorization"] as string)
        ?.split(" ")[1]
        ?.split("|");
      const userId = headerAuthentication[0];
      await authService.logoutAllDevices(userId as any);
      return res.success("تمام دستگاه های متصل از حساب خارج شدند");
    } catch (error) {
      return res.internalError();
    }
  }
}

export default new UserAuthController();
