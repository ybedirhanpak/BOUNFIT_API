import { IBaseModel, IBaseCreateDTO, IBaseUpdateDTO } from './base'; 

export interface IFoodModel extends IBaseModel {
    protein:Number;
    carb:Number;
    fat:Number;
    calories:Number;
}

export interface IFoodCreateDTO extends IBaseCreateDTO{
    protein:Number;
    carb:Number;
    fat:Number;
    calories:Number;
}

export interface IFoodUpdateDTO extends IBaseUpdateDTO{
    protein?:Number;
    carb?:Number;
    fat?:Number;
    calories?:Number;
}
