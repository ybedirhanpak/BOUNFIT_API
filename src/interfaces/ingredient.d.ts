import { Schema } from 'mongoose';
import { RawFoodModel } from './rawFood';

export interface Ingredient {
    _id?: Schema.Types.ObjectId,
    rawFood: RawFoodModel;
    quantity: Number;
}
