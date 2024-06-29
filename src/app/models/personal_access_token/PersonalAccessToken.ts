import mongoose, { Types } from "mongoose";

export type TPersonalAccessTokenDoc = {
  _id: Types.ObjectId;
  personId: string;
  token: string;
  type: "user" | "admin";
  deletedAt: null | Date;
  createdAt: Date;
  updatedAt: Date;
};

export type TPersonalAccessToken = mongoose.Document & TPersonalAccessTokenDoc;

const PersonalAccessTokenSchema = new mongoose.Schema(
  {
    personId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PersonalAccessToken = mongoose.model<
  TPersonalAccessToken,
  mongoose.PaginateModel<TPersonalAccessToken>
>("PersonalAccessTokens", PersonalAccessTokenSchema);
export default PersonalAccessToken;
