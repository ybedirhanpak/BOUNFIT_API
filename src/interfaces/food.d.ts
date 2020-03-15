import { BaseModel, BaseCreateDTO } from './base';
import { Values } from './values';
import { Ingredient, IngredientCreateDTO } from './ingredient';

export interface FoodModel extends BaseModel {
    ingredients: Ingredient[];
    total: { values: Values, quantity: number }
}

export interface FoodCreateDTO extends BaseCreateDTO {
    ingredients?: Ingredient[];
}

export interface AddIngredientDTO {
    ingredient: IngredientCreateDTO;
}

export interface RemoveIngredientDTO {
    ingredientId: string;
}

export interface UpdateIngredientDTO {
    ingredientId: string;
    quantity: number;
}
