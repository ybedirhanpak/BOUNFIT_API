import mongoose, { Schema } from 'mongoose';
import { BaseModel, BaseOptions, Models } from './base';
import { DailyPlanModel } from '../interfaces/dailyPlan';

const DailyPlanSchema = new Schema({
  ...BaseModel,
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

export default mongoose.model<DailyPlanModel & mongoose.Document>(
  Models.DAILY_PLAN,
  DailyPlanSchema,
);
