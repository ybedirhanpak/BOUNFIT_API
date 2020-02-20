import { Request, Response, NextFunction } from "express";

interface RequestWithUser extends Request {
    currentUser: any;
}

export default (requiredRole: string) => {
    return (req: RequestWithUser, res: Response, next: NextFunction) => {
        if (req.currentUser.role === requiredRole) {
            return next();
        } else {
            res.status(401).send("User not authorized.");
        }
    }
}