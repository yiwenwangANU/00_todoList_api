import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { config } from "dotenv";
import { connectDB } from "./lib/prisma";
import { connectRedis } from "./lib/redis";
import todoRoute from "./routes/todoRoutes";

config();
connectDB();
connectRedis();

const app: Express = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("api/todo", todoRoute);

app.listen(process.env.PORT, () =>
  console.log("Server hosting on post: ", process.env.PORT),
);
