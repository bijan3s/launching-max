import mongoose, { Types } from "mongoose";
import paginate from "mongoose-paginate-v2";

export type TUserDoc = {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  role: "user" | "author" | "admin" | "seller";
  deletedAt: null | Date;
  createdAt: Date;
  updatedAt: Date;
};

export type TUser = mongoose.Document & TUserDoc;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "author", "admin", "seller"],
      required: true,
      trim: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      index: { unique: true, sparse: true },
      trim: true,
      set: (v: string) => v.toLowerCase(),
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(paginate);

const User = mongoose.model<TUser, mongoose.PaginateModel<TUser>>(
  "users",
  UserSchema
);
export default User;
