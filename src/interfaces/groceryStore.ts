import { IBaseModel } from './base'; 
import { Schema } from 'mongoose';

export interface IGroceryStoreModel extends IBaseModel {
    foods:[Schema.Types.ObjectId]
}