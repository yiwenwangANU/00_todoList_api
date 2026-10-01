import { Router } from "express";
import {
  addTodo,
  deleteTodo,
  editTodo,
  getTodo,
  getTodos,
} from "../controllers/todoControllers";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getTodos);
router.get("/:id", getTodo);
router.post("/", authMiddleware, addTodo);
router.put("/:id", authMiddleware, editTodo);
router.delete("/:id", authMiddleware, deleteTodo);

export default router;
