import { Schema } from 'mongoose';
import { BaseModel, BaseCreateDTO } from './base';

export interface GroceryStoreModel extends BaseModel {
    rawFoods: Schema.Types.ObjectId[]
}

export interface GroceryStoreCreateDTO extends BaseCreateDTO {
    rawFoods?: Schema.Types.ObjectId[]
}

export interface AddRemoveRawFoodDTO {
    rawFood: Schema.Types.ObjectId
}
