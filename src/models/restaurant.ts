import mongoose, { Schema } from 'mongoose';
import { BaseModel, BaseOptions, Models } from './base';
import { RestaurantModel } from '../interfaces/restaurant';

const RestaurantSchema = new Schema({
  ...BaseModel,
  foods: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: Models.FOOD,
      },
    ],
    required: true,
    default: [],
  },
  meals: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: Models.MEAL,
      },
    ],
    required: true,
    default: [],
  },
}, {
  ...BaseOptions,
});

export default mongoose.model<RestaurantModel & mongoose.Document>(
  Models.RESTAURANT,
  RestaurantSchema,
);
