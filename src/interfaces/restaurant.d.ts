import { Types } from 'mongoose';
import { BaseModel, BaseCreateDTO } from './base';

export interface RestaurantModel extends BaseModel {
    foods: Types.ObjectId[];
    meals: Types.ObjectId[];
}

export interface RestaurantCreateDTO extends BaseCreateDTO {
    foods?: Types.ObjectId[];
    meals?: Types.ObjectId[];
}

export interface AddRemoveFoodDTO {
    foodId: string;
}

export interface AddRemoveMealDTO {
    mealId: string;
}
