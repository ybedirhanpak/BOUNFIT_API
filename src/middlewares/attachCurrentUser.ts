import UserService from "../services/user";
import { Request, Response, NextFunction } from "express";
import { IUserModel } from "../interfaces/user";
import errors, { errorNames } from "../helpers/errors";

interface RequestWithToken extends Request {
    token: {
        data: any
    };
    currentUser: any;
}

/**
 * This middleware is dependent to isAuth.
 */
export default async (req: RequestWithToken, res: Response, next: NextFunction) => {
    try {
        const decodedUser = req.token.data;
        const user = await UserService.getById(decodedUser._id);
        req.currentUser = user;
        return next();
    } catch (err) {
        if (err.name === errorNames.USER_NOT_FOUND ||
            err.name === errorNames.JWT_SECRET_ERROR) {
            res.status(400).send(err);
        } else {
            res.status(500).send(errors.INTERNAL_ERROR(err));
        }
    }
}