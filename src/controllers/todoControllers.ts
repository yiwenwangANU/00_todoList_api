import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const getTodos = async (req: Request, res: Response) => {
  const todos = await prisma.todo.findMany();
  res.status(200).json({
    message: "Data fetch successfully.",
    data: todos,
  });
};

export { getTodos };
