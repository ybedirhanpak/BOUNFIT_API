import mongoose, { Schema } from 'mongoose';
import { BaseModel, BaseOptions, Models } from './base';
import { MealModel } from '../interfaces/meal';

const MealSchema = new Schema({
  ...BaseModel,
  meals: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: Models.FOOD,
      },
    ],
    required: true,
    default: [],
  },
}, {
  ...BaseOptions,
});

export default mongoose.model<MealModel & mongoose.Document>(
  Models.MEAL,
  MealSchema,
);
