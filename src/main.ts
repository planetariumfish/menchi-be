import express, { Request, Response, Application } from "express";
import "dotenv/config";

const app: Application = express();
const PORT = process.env.PORT || 2501;

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello Typescript with Node.js!");
});

app.listen(PORT, (): void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
