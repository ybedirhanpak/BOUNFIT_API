import { Schema } from 'mongoose';
import { BaseModel, BaseCreateDTO } from './base';

export interface UserModel extends BaseModel {
    passwordHash: string;
    passwordSalt: string;
    email: string;
    foods: Schema.Types.ObjectId[];
    meals: Schema.Types.ObjectId[];
    dailyPlans: Schema.Types.ObjectId[];
}

export interface UserCreateDTO extends BaseCreateDTO {
    email: string;
    password: string;
    foods?: [];
    meals?: [];
    dailyPlans?: [];
}
