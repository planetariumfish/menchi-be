import { NextFunction, Request, Response } from "express";

const removeUserFromBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.user) delete req.body.user;
  next();
};

export default removeUserFromBody;
