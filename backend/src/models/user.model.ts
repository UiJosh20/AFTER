import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId?: string;
  deviceId?: string;
  name?: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    deviceId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    name: String,

    email: String,

    avatar: String,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);