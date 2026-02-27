import { body } from 'express-validator';

export const registerRules = [
  body('email').isEmail().withMessage('유효한 이메일을 입력하세요'),
  body('password').isLength({ min: 8 }).withMessage('비밀번호는 최소 8자 이상이어야 합니다'),
  body('name').notEmpty().withMessage('이름은 필수입니다'),
];

export const loginRules = [
  body('email').isEmail().withMessage('유효한 이메일을 입력하세요'),
  body('password').notEmpty().withMessage('비밀번호를 입력하세요'),
];

export const todoRules = [
  body('content').notEmpty().withMessage('내용은 필수입니다'),
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('날짜 형식은 YYYY-MM-DD입니다'),
];
