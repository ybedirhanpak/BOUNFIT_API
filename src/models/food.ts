import mongoose, { Schema } from 'mongoose';
import { BaseModel, BaseOptions, Models } from './base';
import { FoodModel } from '../interfaces/food';

const FoodSchema = new Schema({
  ...BaseModel,
  ingredients: {
    type: [
      {
        _id: Schema.Types.ObjectId,
        rawFood: {
          type: Schema.Types.ObjectId,
          ref: Models.RAW_FOOD,
        },
        quantity: Number,
      },
    ],
    required: true,
    default: [],
  },
  total: {
    values: {
      type: {
        protein: Number,
        carb: Number,
        fat: Number,
        calories: Number,
      },
      required: true,
      default: {
        protein: 0,
        carb: 0,
        fat: 0,
        calories: 0,
      },
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
}, {
  ...BaseOptions,
});

export default mongoose.model<FoodModel & mongoose.Document>(
  Models.FOOD,
  FoodSchema,
);
