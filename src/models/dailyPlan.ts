import mongoose, { Schema } from "mongoose";
import { BaseModel, BaseOptions, Models } from "./base";
import { IDailyPlanModel } from "../interfaces/dailyPlan";

const DailyPlanSchema = new Schema({
    ...BaseModel,
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
}, {
    ...BaseOptions
});

export default mongoose.model<IDailyPlanModel & mongoose.Document>(
    Models.dailyPlan,
    DailyPlanSchema
);
