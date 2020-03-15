import mongoose, { Schema } from 'mongoose';
import { BaseModel, BaseOptions, Models } from './base';
import { UserModel } from '../interfaces/user';
import roles from '../helpers/roles';

const UserSchema = new Schema({
  ...BaseModel,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  passwordSalt: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: roles.USER,
  },
  foods: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: Models.FOOD,
    }],
    required: true,
    default: [],
  },
  meals: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: Models.MEAL,
    }],
    required: true,
    default: [],
  },
  dailyPlans: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: Models.DAILY_PLAN,
    }],
    required: true,
    default: [],
  },
}, {
  ...BaseOptions,
});

export default mongoose.model<UserModel & mongoose.Document>(
  Models.USER,
  UserSchema,
);
