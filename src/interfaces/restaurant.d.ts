import { Schema } from 'mongoose';
import { BaseModel, BaseCreateDTO } from './base';

export interface RestaurantModel extends BaseModel {
    foods: Schema.Types.ObjectId[];
    meals: Schema.Types.ObjectId[];
}

export interface RestaurantCreateDTO extends BaseCreateDTO {
    foods?: Schema.Types.ObjectId[];
    meals?: Schema.Types.ObjectId[];
}

export interface AddRemoveFoodDTO {
    food: Schema.Types.ObjectId;
}

export interface AddRemoveMealDTO {
    meal: Schema.Types.ObjectId;
}
