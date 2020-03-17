import { Types } from 'mongoose';
import { BaseModel, BaseCreateDTO } from './base';

export interface UserModel extends BaseModel {
    passwordHash: string;
    passwordSalt: string;
    email: string;
    foods: Types.ObjectId[];
    meals: Types.ObjectId[];
    dailyPlans: Types.ObjectId[];
}

export interface UserCreateDTO extends BaseCreateDTO {
    email: string;
    password: string;
    foods?: [];
    meals?: [];
    dailyPlans?: [];
}
