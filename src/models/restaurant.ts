import mongoose, { Schema } from "mongoose";
import { BaseModel, Models } from "./base";
import { IRestaurantModel } from "../interfaces/restaurant";

const RestaurantSchema = new Schema({
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
    },
    meals: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: Models.meal
            }
        ],
        required: true,
        default: []
    }
});

export default mongoose.model<IRestaurantModel & mongoose.Document>(
    Models.restaurant,
    RestaurantSchema
);
