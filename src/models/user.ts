import mongoose, { Schema } from "mongoose";
import { BaseModel, BaseOptions, Models } from "./base";
import { IUserModel } from "../interfaces/user";
import roles from "../helpers/roles";

const UserSchema = new Schema({
    ...BaseModel,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    passwordSalt: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: roles.USER
    },
    foods: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: Models.food
        }],
        required: true,
        default: []
    },
    meals: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: Models.meal
        }],
        required: true,
        default: []
    },
    dailyPlans: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: Models.dailyPlan
        }],
        required: true,
        default: []
    }
}, {
    ...BaseOptions
});

export default mongoose.model<IUserModel & mongoose.Document>(
    Models.user,
    UserSchema
);
