import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  fullname: string;
  age?: string;
  address?: string;
  gender?: string;
  role?: mongoose.Schema.Types.ObjectId;
}
