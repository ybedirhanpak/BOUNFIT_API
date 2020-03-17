import { Types } from 'mongoose';
import { BaseModel, BaseCreateDTO } from './base';
import { Values } from './values';

export interface MealModel extends BaseModel {
    foods: Types.ObjectId[];
    totalValues: Values;
}

export interface MealCreateDTO extends BaseCreateDTO {
    foods?: Types.ObjectId[]
}

export interface AddRemoveFoodDTO {
    foodId: string;
}
