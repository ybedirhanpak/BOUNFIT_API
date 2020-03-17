import { Types } from 'mongoose';
import { BaseModel, BaseCreateDTO } from './base';

export interface GroceryStoreModel extends BaseModel {
    rawFoods: Types.ObjectId[];
}

export interface GroceryStoreCreateDTO extends BaseCreateDTO {
    rawFoods?: Types.ObjectId[];
}

export interface AddRemoveRawFoodDTO {
    rawFoodId: string;
}
