import { Schema } from "mongoose";
import User from "../models/user";
import {
    IUserModel,
    IUserCreateDTO
} from "../interfaces/user";
import errors from "../helpers/errors";

const QUERIES = {
    GET_BY_ID: (id: string | Schema.Types.ObjectId) => ({ $and: [{ isDeleted: false }, { _id: id }] }),
    GET_DELETED_BY_ID: (id: string | Schema.Types.ObjectId) => ({ $and: [{ isDeleted: true }, { _id: id }] }),
    NOT_DELETED: { isDeleted: false },
    DELETED: { isDeleted: true }
}

const exists = async (userId: string | Schema.Types.ObjectId): Promise<boolean> => {
    return User.exists(QUERIES.GET_BY_ID(userId));
}

const getById = async (userId: string | Schema.Types.ObjectId): Promise<IUserModel> => {
    const user = await User.findOne(
        QUERIES.GET_BY_ID(userId)
    )
    if (!user)
        throw errors.USER_NOT_FOUND();

    return user;
}

export default {
    exists,
    getById
}