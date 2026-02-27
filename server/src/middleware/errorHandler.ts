import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// 검증 결과 체크 미들웨어
export const checkValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

// 글로벌 에러 핸들러
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 내부 오류가 발생했습니다' });
};
