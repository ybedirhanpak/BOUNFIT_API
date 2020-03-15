import mongoose from 'mongoose';
import { BaseModel, BaseCreateDTO } from './base';
import { Values } from './values';

export interface MealModel extends BaseModel {
    foods: mongoose.Types.ObjectId[];
    totalValues: Values;
}

export interface MealCreateDTO extends BaseCreateDTO {
    foods?: mongoose.Types.ObjectId[]
}

export interface AddRemoveFoodDTO {
    foodId: string;
}
