import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import "dotenv/config";
import userRoutes from "./routes/users.routes";
import petRoutes from "./routes/pets.routes";

const app = express();
const PORT = process.env.PORT || 2501;

const allowedOrigins = ["http://localhost:5173"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(options));
app.use(express.json());
app.use(cookieparser());
app.use(express.static("dist"));

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.statusCode).send({ ok: false, message: err.message });
};
app.use(errorHandler);

app.use("/users", userRoutes);

app.use("/pets", petRoutes);

app.get("/", (req, res) => {
  res.send("⚡️ Hello Typescript with Node.js! 🦾");
});

app.get("*", (req, res) => {
  res.status(404).send("Nobody here. :(");
});

app.listen(PORT, () => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
