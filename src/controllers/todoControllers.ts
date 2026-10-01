import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";

const getTodos = async (req: Request, res: Response) => {
  const key = "cache:todos";
  const cached = await redis.get(key);
  if (cached) {
    return res.status(200).json({ data: JSON.parse(cached) });
  }

  const todos = await prisma.todo.findMany();
  res.status(200).json({
    message: "Data fetch successfully.",
    data: todos,
  });
  await redis.set(key, JSON.stringify(todos), "EX", 3600);
};

const getTodo = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const key = `cache:todo:${id}`;
  const cached = await redis.get(key);
  if (cached) {
    return res.status(200).json({ data: JSON.parse(cached) });
  }

  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
  });

  if (!todo) {
    return res.status(404).json({ message: "Todo not found." });
  }

  res.status(200).json({ data: todo });
  await redis.set(key, JSON.stringify(todo), "EX", 3600);
};

const addTodo = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized action." });
  }
  const { content } = req.body;
  const todo = await prisma.todo.create({
    data: {
      content,
      authorId: req.user.id,
    },
  });
  res.status(201).json({ message: "Todo created successfully.", data: todo });
  await redis.del("cache:todos");
  await redis.set(`cache:todo:${todo.id}`, JSON.stringify(todo), "EX", 3600);
};

const editTodo = async (req: Request<{ id: string }>, res: Response) => {
  const { content } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized action." });
  }
  const todo = await prisma.todo.findUnique({
    where: { id: req.params.id },
  });
  if (!todo) {
    return res.status(404).json({ message: "Todo not found." });
  }
  if (todo.authorId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized action." });
  }
  const newTodo = await prisma.todo.update({
    where: { id: req.params.id },
    data: { content },
  });
  res
    .status(200)
    .json({ message: "Todo updated successfully.", data: newTodo });
  await redis.del("cache:todos");
  await redis.set(
    `cache:todo:${req.params.id}`,
    JSON.stringify(newTodo),
    "EX",
    3600,
  );
};

const deleteTodo = async (req: Request<{ id: string }>, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized action." });
  }
  const todo = await prisma.todo.findUnique({
    where: { id: req.params.id },
  });
  if (!todo) {
    return res.status(404).json({ message: "Todo not found." });
  }
  if (todo.authorId !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized action." });
  }
  await prisma.todo.delete({
    where: { id: req.params.id },
  });
  res.status(200).json({ message: "Todo deleted successfully." });
  await redis.del("cache:todos");
  await redis.del(`cache:todo:${req.params.id}`);
};

export { getTodos, getTodo, addTodo, editTodo, deleteTodo };
