import express from "express";
import { authRouter } from "./routes/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { userRouter } from "./routes/user.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { AuthRequest } from "./types/express.types";

const app = express();

app.use(express.json()); // Check headers and parse body as json (req.body)
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("API is working");
});

app.get("/me", authMiddleware, (req: AuthRequest, res) => {
  res.json(req.user);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

