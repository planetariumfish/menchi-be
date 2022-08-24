import { NextFunction, Request, Response } from "express";
import { Schema } from "zod";

const validateContent = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).send(result.error);
      console.log(result.error);
    } else {
      next();
    }
  };
};

export default validateContent;
