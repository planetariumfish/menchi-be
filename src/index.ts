import express from "express";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./routes/users.routes";
import petRoutes from "./routes/pets.routes";

const app = express();
const PORT = process.env.PORT || 2501;

const allowedOrigins = ["http://localhost:5173"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());

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
