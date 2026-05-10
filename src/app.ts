import express from "express";
import { authRouter } from "./routes/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { userRouter } from "./routes/user.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { AuthRequest } from "./types/express.types";
import { errorMiddleware } from "./middlewares/error.middleware";
import helmet from "helmet";
import cors from "cors";
import { globalLimiter } from "./middlewares/rate-limit.middleware";

const app = express();

app.use(globalLimiter);

app.use(
  helmet({
    crossOriginResourcePolicy: false, // For Swagger UI
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json()); // Check headers and parse body as json (req.body)

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.use(errorMiddleware);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("API is working");
});

app.get("/me", authMiddleware, (req: AuthRequest, res) => {
  res.json(req.user);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

