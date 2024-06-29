import AbstractController from "@controllers/AbstractController";
import { Request, Response, response } from "express";
import User from "src/app/models/user/User";
import Validator from "src/app/services/validator/validator";
import bcryptjs from "bcryptjs";

class ManagerUserController extends AbstractController {
  async index(request: Request, response: Response) {
    try {
      const s = super.search(
        request,
        ["username", "email"],
        [{ col: "role", allowed_values: ["user", "admin", "author", "seller"] }]
      );
      const _sort = super.sort(request, ["createdAt", "role"]);
      const users = await User.paginate(s, {
        page: Number(request.query.page) || 1,
        limit: 10,
        sort: _sort,
      });
      return response.send(users);
    } catch (e) {
      //   console.log(`${e}`);
      return response.internalError();
    }
  }

  async show(request: Request, response: Response) {
    try {
      const user = await User.findById(request.params.id);
      if (!user) return response.notFound("کاربر مورد نظر پیدا نشد");
      return response.success(user);
    } catch (e) {
      return response.internalError();
    }
  }

  async create(req: Request, res: Response) {
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
      validator
        .body("role")
        .required()
        .enum(["user", "author", "seller", "admin"]);

      validator.body("password").required().minLength(8).maxLength(32);

      if (validator.hasErrors()) {
        return res.validationError(validator.errors());
      }

      const user = await User.create({
        username,
        role,
        email,
        password: bcryptjs.hashSync(String(password)),
      });
      if (!user) return res.internalError();
      return res.created();
    } catch (e) {
      console.log(`${e}`);
      return res.internalError();
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { username, role, email, password } = req.body;
      const { id } = req.params;

      const validator = new Validator(req);

      await validator
        .body("username")
        .optional()
        .minLength(2)
        .maxLength(32)
        .custom(async (val) => {
          const user = await User.findOne({ username: val });
          if (user) return "unique";
          else return true;
        });

      await validator
        .body("email")
        .optional()
        .email()
        .custom(async (val) => {
          const user = await User.findOne({ email: val });
          if (!user || user._id.toString() === id) return true;
          else return "unique";
        });
      validator
        .body("role")
        .optional()
        .enum(["user", "author", "seller", "admin"]);

      validator.body("password").optional().minLength(8).maxLength(32);

      if (validator.hasErrors()) {
        return res.validationError(validator.errors());
      }

      const user = await User.findById(id);
      if (!user) {
        return response.notFound("کاربر مورد نظر پیدا نشد.");
      }
      const data: { [key: string]: any } = {};
      if (password) {
        data.password = bcryptjs.hashSync(String(password));
      }
      if (username) {
        data.username = username;
      }
      if (role) {
        data.role = role;
      }
      if (email) {
        data.email = email;
      }
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

      if (!updatedUser) return res.internalError();

      return res.updated();
    } catch (e) {
      return res.internalError();
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const result = await User.findByIdAndUpdate(req.params.id, {
        deletedAt: new Date(),
      });
      if (!result) return res.internalError();
      return res.success("کاربر با موفقیت حذف شد.");
    } catch (e) {
      return res.internalError();
    }
  }
}

export default new ManagerUserController();
