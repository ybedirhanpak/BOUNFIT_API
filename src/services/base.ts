import { Model, Types, Document } from 'mongoose';
import errors from '../helpers/errors';
import { BaseModel } from '../interfaces/base';

export const QUERIES = {
  GET_BY_ID: (id: string | Types.ObjectId) => ({
    $and: [{ isDeleted: false },
      { _id: id }],
  }),
  GET_DELETED_BY_ID: (id: string | Types.ObjectId) => ({
    $and: [{ isDeleted: true },
      { _id: id }],
  }),
  NOT_DELETED: { isDeleted: false },
  DELETED: { isDeleted: true },
};

const Exists = async <T> (
  id: string | Types.ObjectId,
  DB_MODEL: Model<T & Document>,
): Promise<boolean> => {
  DB_MODEL.exists(QUERIES.GET_BY_ID(id));
  return false;
};

const FindInvalidElement = async <T> (
  list: Types.ObjectId[],
  DB_MODEL: Model<T & Document>,
): Promise<number> => {
  const promises = list.map((element) => Exists<T>(element, DB_MODEL));
  const existsList = await Promise.all(promises);
  const falseIndex = existsList.findIndex((e) => !e);
  if (falseIndex > -1) {
    return falseIndex;
  }
  return -1;
};


const GetAll = async<T> (
  DB_MODEL: Model<T & Document>,
) : Promise<T[]> => DB_MODEL.find(QUERIES.NOT_DELETED);

const GetAllDeleted = async<T> (
  DB_MODEL: Model<T & Document>,
) : Promise<T[]> => DB_MODEL.find(QUERIES.DELETED);

const GetById = async<T> (
  id: string | Types.ObjectId,
  DB_MODEL: Model<T & Document>,
): Promise<T> => {
  const instance = await DB_MODEL.findOne(
    QUERIES.GET_BY_ID(id),
  );
  if (!instance) throw errors.INSTANCE_NOT_FOUND(`${DB_MODEL.modelName} with id: ${id} not found in GetById.`);
  return instance;
};

const DeleteById = async<T> (
  id: string | Types.ObjectId,
  DB_MODEL: Model<T & Document & BaseModel>,
): Promise<T> => {
  const instance = await DB_MODEL.findOne(
    QUERIES.GET_BY_ID(id),
  );
  if (!instance) throw errors.INSTANCE_NOT_FOUND(`${DB_MODEL.modelName} with id: ${id} not found in GetById.`);
  instance.isDeleted = true;
  return instance.save();
};

const RestoreById = async<T> (
  id: string | Types.ObjectId,
  DB_MODEL: Model<T & Document & BaseModel>,
): Promise<T> => {
  const instance = await DB_MODEL.findOne(
    QUERIES.GET_BY_ID(id),
  );
  if (!instance) throw errors.INSTANCE_NOT_FOUND(`${DB_MODEL.modelName} with id: ${id} not found in GetById.`);
  instance.isDeleted = false;
  return instance.save();
};


export default {
  Exists,
  FindInvalidElement,
  GetAll,
  GetAllDeleted,
  GetById,
  DeleteById,
  RestoreById,
};
