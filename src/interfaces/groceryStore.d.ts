import { IBaseModel, IBaseCreateDTO } from './base';
import { Schema } from 'mongoose';

export interface IGroceryStoreModel extends IBaseModel {
    foods: Schema.Types.ObjectId[]
}

export interface IGroceryStoreCreateDTO extends IBaseCreateDTO {
    foods?: Schema.Types.ObjectId[]
}

export interface IAddRemoveFoodDTO {
    food: Schema.Types.ObjectId
}