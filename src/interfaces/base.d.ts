import { Schema } from 'mongoose';

export interface BaseModel {
    _id?: string | Schema.Types.ObjectId;
    name: string;
    isDeleted: boolean;
}

export interface BaseCreateDTO {
    name: string;
}

export interface BaseUpdateDTO {
    name?: string;
    isDeleted?: boolean;
}
