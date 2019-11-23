export interface IBaseModel {
    _id?:String;
    name:String;
    isDeleted:Boolean;
}

export interface IBaseCreateDTO {
    name:String;
}

export interface IBaseUpdateDTO {
    name?:String;
    isDeleted?:Boolean;
}