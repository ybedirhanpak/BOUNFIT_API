import mongoose, { Schema } from "mongoose";
import { BaseModel, Models } from "./base";
import { IUserModel } from "../interfaces/user";

const UserSchema = new Schema({
    ...BaseModel,
    passwordHash: {
        type:String,
        required:true
    },
    passwordSalt: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    foods: {
        type:[{
            type: Schema.Types.ObjectId,
            ref: Models.food    
        }],
        required:true,
        default:[]
    },
    meals: {
        type:[{
            type: Schema.Types.ObjectId,
            ref: Models.meal    
        }],
        required:true,
        default:[]
    },
    dailyPlans: {
        type:[{
            type: Schema.Types.ObjectId,
            ref: Models.dailyPlan    
        }],
        required:true,
        default:[]
    }
});

export default mongoose.model<IUserModel & mongoose.Document>(
    Models.user,
    UserSchema
);
