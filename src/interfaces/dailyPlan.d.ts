import { Schema } from 'mongoose';
import { BaseModel, BaseCreateDTO } from './base';
import { Values } from './values';

export interface DailyPlanModel extends BaseModel {
    meals: Schema.Types.ObjectId[];
    totalValues: Values;
}

export interface DailyPlanCreateDTO extends BaseCreateDTO {
    meals?: Schema.Types.ObjectId[];
}

export interface AddRemoveMealDTO {
    mealId: Schema.Types.ObjectId;
}
