import mongoose from 'mongoose';

export interface Ingredient {
    _id?: mongoose.Types.ObjectId,
    rawFood: mongoose.Types.ObjectId;
    quantity: number;
}

export interface IngredientCreateDTO {
    rawFood: string;
    quantity: number;
}
