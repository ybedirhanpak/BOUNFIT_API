import { IBaseModel } from './base';
import { Schema } from 'mongoose';

export interface IUserModel extends IBaseModel {
    passwordHash: string;
    passwordSalt: string;
    email: string;
    foods: Schema.Types.ObjectId[];
    meals: Schema.Types.ObjectId[];
    dailyPlans: Schema.Types.ObjectId[];
}