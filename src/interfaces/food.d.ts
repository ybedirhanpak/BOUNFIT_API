import { Schema } from 'mongoose';
import { BaseModel, BaseCreateDTO } from './base';
import { Values } from './values';
import { Ingredient } from './ingredient';

export interface FoodModel extends BaseModel {
    ingredients: Ingredient[];
    total: { values: Values, quantity: Number }
}

export interface FoodCreateDTO extends BaseCreateDTO {
    ingredients?: Ingredient[];
}

export interface AddIngredientDTO {
    ingredient: Ingredient;
}

export interface RemoveIngredientDTO {
    ingredientId: Schema.Types.ObjectId;
}

export interface UpdateIngredientDTO {
    ingredientId: Schema.Types.ObjectId;
    quantity: Number;
}
