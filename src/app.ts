import express, { type Express, type Request, type Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { config } from "dotenv";

config();

const app: Express = express();
app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () =>
  console.log("Server hosting on post: ", process.env.PORT),
);
