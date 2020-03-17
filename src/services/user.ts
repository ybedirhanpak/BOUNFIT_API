import { Types } from 'mongoose';
import User from '../models/user';
import {
  UserModel,
  UserCreateDTO,
} from '../interfaces/user';
import errors from '../helpers/errors';
import BaseService, { QUERIES as BASE_QUERIES } from './base';

const QUERIES = {
  ...BASE_QUERIES,
  GET_BY_EMAIL: (email: string) => ({ $and: [{ isDeleted: false }, { email }] }),
};


export default {
  Exists: (id: string | Types.ObjectId) => BaseService.Exists<UserModel>(id, User),
  GetAll: () => BaseService.GetAll<UserModel>(User),
};
