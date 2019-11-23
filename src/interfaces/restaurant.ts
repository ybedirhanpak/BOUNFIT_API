import { IBaseModel } from './base'; 
import { Schema } from 'mongoose';

export interface IRestaurantModel extends IBaseModel {
    foods:[Schema.Types.ObjectId];
    meals:[Schema.Types.ObjectId];
}