import { Request, Response, NextFunction } from 'express';

interface RequestWithUser extends Request {
    currentUser: any;
}

export default (requiredRole: string) => (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  if (req.currentUser.role === requiredRole) {
    return next();
  }
  res.status(401).send('User not authorized.');
};
