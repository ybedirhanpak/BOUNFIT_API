import mongoose, { Schema } from "mongoose";
import { BaseModel, BaseOptions, Models } from "./base";
import { IMealModel } from "../interfaces/meal";

const MealSchema = new Schema({
    ...BaseModel,
    ingredients: {
        type: [
            {
                quantity: Number,
                food: {
                    type: Schema.Types.ObjectId,
                    ref: Models.food
                }
            }
        ],
        required: true,
        default: []
    }
}, {
    ...BaseOptions
});

export default mongoose.model<IMealModel & mongoose.Document>(
    Models.meal,
    MealSchema
);