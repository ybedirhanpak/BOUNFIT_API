import { IBaseModel, IBaseCreateDTO, IBaseUpdateDTO } from './base';
import { Schema } from 'mongoose';

export interface Ingredient {
    _id?: Schema.Types.ObjectId,
    quantity: Number,
    food: Schema.Types.ObjectId;
}

interface IngredientUpdateDTO {
    quantity?: Number,
    food?: Schema.Types.ObjectId;
}

export interface IMealModel extends IBaseModel {
    ingredients: Ingredient[]
}

export interface IMealCreateDTO extends IBaseCreateDTO {
    ingredients?: Ingredient[]
}

export interface IAddIngredientDTO {
    ingredient: Ingredient
}

export interface IRemoveIngredientDTO {
    ingredient: Schema.Types.ObjectId
}

export interface IUpdateIngredientDTO {
    ingredientId: Schema.Types.ObjectId;
    ingredient: IngredientUpdateDTO
}