import { Schema } from 'mongoose';
import { BaseModel, BaseCreateDTO } from './base';
import { Values } from './values';

export interface MealModel extends BaseModel {
    foods: Schema.Types.ObjectId[];
    totalValues: Values;
}

export interface MealCreateDTO extends BaseCreateDTO {
    foods?: Schema.Types.ObjectId[]
}

export interface AddRemoveFoodDTO {
    foodId: Schema.Types.ObjectId;
}
