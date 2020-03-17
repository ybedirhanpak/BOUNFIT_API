import { Types } from 'mongoose';
import { BaseModel, BaseCreateDTO } from './base';
import { Values } from './values';

export interface DailyPlanModel extends BaseModel {
    meals: Types.ObjectId[];
    totalValues: Values;
}

export interface DailyPlanCreateDTO extends BaseCreateDTO {
    meals?: Types.ObjectId[];
}

export interface AddRemoveMealDTO {
    mealId: string;
}
