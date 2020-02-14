import { Schema, Types } from "mongoose";
import Food from "../models/food";

export const isFoodValid = (food: Schema.Types.ObjectId): boolean => {
    let result = false;
    Food.exists({ $and: [{ isDeleted: false }, { _id: food }] }, (err, res) => {
        if (!err)
            result = res;
    });
    return result;
}

export default {
    getAll: async () => {
        return await Food.find({ isDeleted: false }).then();
    }
}