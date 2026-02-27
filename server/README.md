# MyTodo API

이메일/비밀번호 기반 인증과 Todo 관리 기능을 제공하는 RESTful API 서버입니다.

## 기술 스택

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator

## 주요 기능

### 인증
- 이메일/비밀번호 회원가입 (비밀번호 8자 이상)
- 이메일/비밀번호 로그인
- JWT 토큰 기반 인증

### Todo 관리
- Todo 생성 (날짜별)
- Todo 전체 조회 / 날짜별 조회
- Todo 수정
- Todo 완료 토글
- Todo 삭제

### 1. 개발 서버 실행
```bash
npm run dev
```

서버 주소 예: `http://localhost:3000`

### 2. 프로덕션 빌드
```bash
npm run build
npm start
```

## API 엔드포인트

### 인증 (Auth)
| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| POST | `/api/auth/register` | 회원가입 | ❌ |
| POST | `/api/auth/login` | 로그인 | ❌ |

### Todo
| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|-----------|
| POST | `/api/todos` | Todo 생성 | ✅ |
| GET | `/api/todos` | Todo 전체 조회 | ✅ |
| GET | `/api/todos?date=YYYY-MM-DD` | Todo 날짜별 조회 | ✅ |
| PATCH | `/api/todos/:id` | Todo 수정 | ✅ |
| PATCH | `/api/todos/:id/toggle` | 완료 토글 | ✅ |
| DELETE | `/api/todos/:id` | Todo 삭제 | ✅ |

## 테스트

Postman을 사용한 API 테스트 가이드는 [POSTMAN_TEST.md](./POSTMAN_TEST.md)를 참고하세요.

## 프로젝트 구조

```
mytodo-api/
├── src/
│   ├── config/
│   │   └── db.ts              # MongoDB 연결 설정
│   ├── middleware/
│   │   ├── auth.ts            # JWT 인증 미들웨어
│   │   ├── validate.ts        # 입력 검증 규칙
│   │   └── errorHandler.ts    # 에러 핸들러
│   ├── models/
│   │   ├── User.ts            # User 스키마
│   │   └── Todo.ts            # Todo 스키마
│   ├── routes/
│   │   ├── auth.ts            # 인증 라우트
│   │   └── todos.ts           # Todo 라우트
│   └── app.ts                 # Express 앱 진입점
├── .env                       # 환경 변수 (git 제외, 직접 생성)
├── .env.example               # 환경 변수 템플릿
├── package.json
├── tsconfig.json
├── POSTMAN_TEST.md           # Postman 테스트 가이드
└── README.md
```

## 데이터베이스 스키마

### User
```typescript
{
  email: string;           // unique, required
  password: string;        // hashed, min 8자
  name: string;            // required
  createdAt: Date;
}
```

### Todo
```typescript
{
  userId: ObjectId;        // User 참조, required
  content: string;         // required
  date: string;            // YYYY-MM-DD, required
  completed: boolean;      // default: false
  createdAt: Date;
  updatedAt: Date;
}
```

## 검증 규칙

### 회원가입
- `email`: 유효한 이메일 형식
- `password`: 최소 8자 이상
- `name`: 필수

### Todo 생성
- `content`: 필수
- `date`: YYYY-MM-DD 형식

## 보안

- 비밀번호는 bcrypt로 해싱 (salt rounds: 10)
- JWT 토큰 유효기간: 7일
- 인증이 필요한 엔드포인트는 `Authorization: Bearer <token>` 헤더 필요

## 에러 응답 형식

### 검증 에러 (400)
```json
{
    "errors": [
        {
            "msg": "비밀번호는 최소 8자 이상이어야 합니다",
            "param": "password"
        }
    ]
}
```

### 인증 에러 (401)
```json
{
    "message": "인증 토큰이 필요합니다"
}
```

### 서버 에러 (500)
```json
{
    "message": "서버 오류"
}
```
