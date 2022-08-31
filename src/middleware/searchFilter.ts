import { NextFunction, Request, Response } from "express";
import { advancedSearch } from "../schemas/search.schema";

const searchFilter = (req: Request, res: Response, next: NextFunction) => {
  // parse search query
  const result = advancedSearch.safeParse(req.query);
  if (!result.success) {
    res.status(400).send(result.error);
    console.log(result.error);
  } else {
    // set types and filter out empty values
    if (result.data.status === "") delete result.data.status;
    if (result.data.height && result.data.height[1] === "0")
      delete result.data.height;
    if (result.data.weight && result.data.weight[1] === "0")
      delete result.data.weight;
    if (result.data.query === "") delete result.data.query;
    req.query = result.data;
    next();
  }
};

export default searchFilter;
