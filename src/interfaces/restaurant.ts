import { IBaseModel, IBaseCreateDTO } from './base';
import { Schema } from 'mongoose';

export interface IRestaurantModel extends IBaseModel {
    foods: [Schema.Types.ObjectId];
    meals: [Schema.Types.ObjectId];
}

export interface IRestaurantCreateDTO extends IBaseCreateDTO {
    foods: [Schema.Types.ObjectId];
    meals: [Schema.Types.ObjectId];
}

export interface IAddRemoveFoodDTO {
    food: Schema.Types.ObjectId;
}

export interface IAddRemoveMealDTO {
    meal: Schema.Types.ObjectId;
}