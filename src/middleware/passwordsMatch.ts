import { NextFunction, Request, Response } from "express";

const passwordsMatch = (req: Request, res: Response, next: NextFunction) => {
  const { password, repassword } = req.body;
  if (password === repassword) next();
  else res.status(400).send("Passwords do not match");
};

export default passwordsMatch;
