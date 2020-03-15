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
}, {
  ...BaseOptions,
});

export default mongoose.model<FoodModel & mongoose.Document>(
  Models.FOOD,
  FoodSchema,
);
