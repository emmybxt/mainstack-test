import bcrypt from 'bcrypt';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  deleted?: boolean;
  comparePassword(password: string): boolean;
  deletedAt?: Date;
}

const userSchema = new Schema(
  {
    email: {
      index: true,
      lowercase: true,
      required: true,
      type: String,
      unique: true,
    },
    firstname: { type: String },
    lastname: { type: String },
    deleted: { type: Boolean, default: false },
    password: { type: String },
    phoneNumber: {
      required: false,
      type: String,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = async function comparePassword(
  password: string,
) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
