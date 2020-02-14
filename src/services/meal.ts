import { Schema } from "mongoose";
import Meal from "../models/meal";

export const isMealValid = (meal: Schema.Types.ObjectId): boolean => {
    let result = false;
    Meal.exists({ $and: [{ isDeleted: false }, { _id: meal }] }, (err, res) => {
        if (!err)
            result = res;
    });
    return result;
}