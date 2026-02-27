import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { registerRules, loginRules } from '../middleware/validate';
import { checkValidation } from '../middleware/errorHandler';

const router = Router();

// 회원가입
router.post('/register', registerRules, checkValidation, async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: '이미 사용 중인 이메일입니다' });
    }

    const user = await User.create({ email, password, name });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 로그인
router.post('/login', loginRules, checkValidation, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;
