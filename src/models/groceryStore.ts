import mongoose, { Schema } from 'mongoose';
import { BaseModel, BaseOptions, Models } from './base';
import { GroceryStoreModel } from '../interfaces/groceryStore';

const GroceryStoreSchema = new Schema({
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
}, {
  ...BaseOptions,
});

export default mongoose.model<GroceryStoreModel & mongoose.Document>(
  Models.GROCERY_STORE,
  GroceryStoreSchema,
);
