import jwt from "express-jwt";
import { Request } from "express";
import config from "../config";
import errors from "../helpers/errors";

const getTokenFromHeader = (req: Request) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
    }
}

if (!config.jwtSecret) {
    throw errors.JWT_SECRET_ERROR("No Jwt secret found in configuration");
}

export default jwt({
    secret: config.jwtSecret,
    userProperty: "token",
    getToken: getTokenFromHeader
})