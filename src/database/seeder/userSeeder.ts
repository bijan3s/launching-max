import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User, { TUserDoc } from "src/app/models/user/User";

export const UserSeeder = async () => {
  const users: TUserDoc[] = [
    {
      _id: new mongoose.Types.ObjectId(),
      username: "bijan3s",
      email: "bijannct@gmail.com",
      role: "seller",
      password: bcrypt.hashSync("12345678"),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      username: "launchingmax",
      email: "launchingmax@gmail.com",
      role: "admin",
      password: bcrypt.hashSync("12345678"),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  for (const userData of users) {
    const user = new User(userData);
    await user.save();
  }
};
