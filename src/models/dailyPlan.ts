import mongoose, { Schema } from "mongoose";
import { BaseModel, Models } from "./base";
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
});

export default mongoose.model<IDailyPlanModel & mongoose.Document>(
    Models.dailyPlan,
    DailyPlanSchema
);
