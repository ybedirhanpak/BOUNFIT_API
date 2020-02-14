import { IBaseModel, IBaseCreateDTO } from "./base";
import { Schema } from "mongoose";

export interface IDailyPlanModel extends IBaseModel {
    meals: [Schema.Types.ObjectId];
}

export interface IDailyPlanCreateDTO extends IBaseCreateDTO {
    meals: [Schema.Types.ObjectId];
}

export interface IAddRemoveMealDTO {
    meal: Schema.Types.ObjectId;
}
