import { Response } from "express";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import User from "src/app/models/user/User";
import PersonalAccessToken from "src/app/models/personal_access_token/PersonalAccessToken";
import { Types } from "mongoose";

export default class AuthService {
  private personType: "admin" | "user" = "user";

  constructor(personType?: "admin" | "user") {
    if (personType) {
      this.personType = personType;
    }
  }

  async login(loginFactor: string, password: string, res: Response) {
    let person: any | null = null;

    person = await User.findOne({
      $or: [{ email: loginFactor }, { username: loginFactor }],
    }).select("+password");

    if (!person || !(await bcrypt.compare(password, person.password || ""))) {
      return res.unauthorized();
    }

    const token = CryptoJS.lib.WordArray.random(128 / 8).toString(
      CryptoJS.enc.Hex
    );
    const hashedToken = bcrypt.hashSync(token, 10);

    await PersonalAccessToken.create({
      personId: person._id,
      token: hashedToken,
      type: this.personType,
    });

    return res.status(200).json({ token: person._id + "|" + token });
  }

  async signup(
    data: {
      username: string;
      password: string;
      email: string;
    },
    res: Response
  ) {
    console.log(data);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
      role: "user",
    });

    const token = CryptoJS.lib.WordArray.random(128 / 8).toString(
      CryptoJS.enc.Hex
    );
    const hashedToken = bcrypt.hashSync(token, 10);

    await PersonalAccessToken.create({
      personId: user._id,
      token: hashedToken,
      type: this.personType,
    });

    return res.status(201).json({ token: user._id + "|" + token });
  }

  async verifyToken(token: string, personId: Types.ObjectId) {
    const storedTokens = await PersonalAccessToken.find({
      personId: personId,
    });
    for (const storedToken of storedTokens) {
      if (bcrypt.compareSync(token, storedToken.token)) {
        return true;
      }
    }
    return false;
  }

  async logout(token: string, personId: Types.ObjectId) {
    const storedTokens = await PersonalAccessToken.find({
      personId: personId,
    });
    if (!storedTokens) {
      return;
    }
    for (const storedToken of storedTokens) {
      if (bcrypt.compareSync(token, storedToken.token)) {
        await PersonalAccessToken.deleteOne({ _id: storedToken._id });
      }
    }
  }

  async logoutAllDevices(personId: Types.ObjectId) {
    await PersonalAccessToken.deleteMany({ personId: personId });
  }
}
