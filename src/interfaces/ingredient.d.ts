import { Types } from 'mongoose';

export interface Ingredient {
    rawFood: Types.ObjectId;
    quantity: number;
}

export interface IngredientCreateDTO {
    rawFood: string;
    quantity: number;
}
