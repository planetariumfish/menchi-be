import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import "dotenv/config";
import path from "path";
import userRoutes from "./routes/users.routes";
import petRoutes from "./routes/pets.routes";
import errorHandler from "./middleware/error-handler.middleware";

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
app.use(express.static("public"));

// keep this last
app.use(errorHandler);

app.use("/users", userRoutes);

app.use("/pets", petRoutes);

app.get("/", (req, res) => {
  res.send("⚡️ Hello Typescript with Node.js! 🦾");
});

app.get("/*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"), (err) => {
    if (err) {
      next(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
