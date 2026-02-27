import { Router, Response } from "express";
import auth, { AuthRequest } from "../middleware/auth";
import Todo from "../models/Todo";
import { todoRules } from "../middleware/validate";
import { checkValidation } from "../middleware/errorHandler";

const router = Router();

// 할 일 생성
router.post(
  "/",
  auth,
  todoRules,
  checkValidation,
  async (req: AuthRequest, res: Response) => {
    try {
      const { content, date } = req.body;
      if (!content || !date)
        return res.status(400).json({ message: "content와 date는 필수입니다" });

      const todo = await Todo.create({ userId: req.userId, content, date });
      res.status(201).json(todo);
    } catch {
      res.status(500).json({ message: "서버 오류" });
    }
  },
);

// 조회 (전체 또는 날짜별)
router.get("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;
    const filter: Record<string, any> = { userId: req.userId };
    if (date) filter.date = date;

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch {
    res.status(500).json({ message: "서버 오류" });
  }
});

// 할 일 수정
router.patch("/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { content: req.body.content },
      { new: true },
    );
    if (!todo)
      return res.status(404).json({ message: "할 일을 찾을 수 없습니다" });
    res.json(todo);
  } catch {
    res.status(500).json({ message: "서버 오류" });
  }
});

// 완료 토글
router.patch("/:id/toggle", auth, async (req: AuthRequest, res: Response) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
    if (!todo)
      return res.status(404).json({ message: "할 일을 찾을 수 없습니다" });

    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch {
    res.status(500).json({ message: "서버 오류" });
  }
});

// 삭제
router.delete("/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!todo)
      return res.status(404).json({ message: "할 일을 찾을 수 없습니다" });
    res.json({ message: "삭제되었습니다" });
  } catch {
    res.status(500).json({ message: "서버 오류" });
  }
});

export default router;
