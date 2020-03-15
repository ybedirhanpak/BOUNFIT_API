import { BaseModel, BaseCreateDTO, BaseUpdateDTO } from './base';
import { Values, ValuesUpdateDTO } from './values';

export interface RawFood extends BaseModel, Values {
}

export interface RawFoodCreateDTO extends BaseCreateDTO, Values {
}

export interface RawFoodUpdateDTO extends BaseUpdateDTO, ValuesUpdateDTO {
}
