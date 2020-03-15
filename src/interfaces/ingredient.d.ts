import { Schema } from 'mongoose';
import { RawFood } from './rawFood';

export interface Ingredient {
    _id?: Schema.Types.ObjectId,
    rawFood: RawFood;
    quantity: Number;
}
