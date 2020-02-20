import { Schema } from "mongoose";

export interface IBaseModel {
    _id?: string | Schema.Types.ObjectId;
    name: string;
    isDeleted: boolean;
}

export interface IBaseCreateDTO {
    name: string;
}

export interface IBaseUpdateDTO {
    name?: string;
    isDeleted?: boolean;
}