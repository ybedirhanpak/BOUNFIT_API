import mongoose, { Schema } from "mongoose";
import { BaseModel, BaseOptions, Models } from "./base";
import { IFoodModel } from "../interfaces/food";

const FoodSchema = new Schema({
    ...BaseModel,
    protein: {
        type: Number,
        required: true
    },
    carb: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    calories: {
        type: Number,
        required: true
    }
}, {
    ...BaseOptions
});

export default mongoose.model<IFoodModel & mongoose.Document>(
    Models.food,
    FoodSchema
);
