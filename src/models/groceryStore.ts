import mongoose, { Schema } from "mongoose";
import { BaseModel, Models } from "./base";
import { IGroceryStoreModel } from "../interfaces/groceryStore";

const GroceryStoreSchema = new Schema({
    ...BaseModel,
    foods: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: Models.food
            }
        ],
        required: true,
        default: []
    }
});

export default mongoose.model<IGroceryStoreModel & mongoose.Document>(
    Models.groceryStore,
    GroceryStoreSchema
);
