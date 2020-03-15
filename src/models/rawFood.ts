import mongoose, { Schema } from 'mongoose';
import { BaseModel, BaseOptions, Models } from './base';
import { RawFoodModel } from '../interfaces/rawFood';

const RawFoodSchema = new Schema({
  ...BaseModel,
  protein: {
    type: Number,
    required: true,
    default: 0,
  },
  carb: {
    type: Number,
    required: true,
    default: 0,
  },
  fat: {
    type: Number,
    required: true,
    default: 0,
  },
  calories: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  ...BaseOptions,
});

export default mongoose.model<RawFoodModel & mongoose.Document>(
  Models.RAW_FOOD,
  RawFoodSchema,
);
