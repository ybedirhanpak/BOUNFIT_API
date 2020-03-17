import { Types } from 'mongoose';

export interface Ingredient {
    _id?: Types.ObjectId,
    rawFood: Types.ObjectId;
    quantity: number;
}

export interface IngredientCreateDTO {
    rawFood: string;
    quantity: number;
}
