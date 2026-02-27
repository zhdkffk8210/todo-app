# 📌 Todo App (Full Stack)

이 저장소는 **React 기반 프론트엔드**와 **Express + MongoDB 기반 백엔드**가 통합된 Todo 애플리케이션 전체 코드입니다.  
사용자는 회원가입 · 로그인 후 Todo를 CRUD 할 수 있습니다.

---

## 🧱 프로젝트 구조


my-todo-app/
├── client/ # React 프론트엔드
├── server/ # Express 백엔드
├── .gitignore
├── package.json
└── README.md # (이 파일)


---

## 💻 기술 스택

| Frontend | Backend | Database |
|----------|---------|----------|
| React (Vite) | Node.js + Express | MongoDB Atlas |
| TailwindCSS (선택) | JWT 인증 | Mongoose ODM |

---

## 🚀 설치 및 실행

### 1) 클론 후 프로젝트 루트로 이동

```bash
git clone https://github.com/zhdkffk8210/todo-app.git
cd todo-app
2) 백엔드 실행
cd server
npm install


백엔드 환경 변수 설정:

MONGODB_URI=<MongoDB Atlas 연결 문자열>
JWT_SECRET=<JWT 시크릿 키>

실행:

npm run dev

서버는 기본적으로 http://localhost:3000에서 실행됩니다.

3) 프론트엔드 실행
cd client
npm install
npm run dev

브라우저에서 http://localhost:5173로 접속하면 앱이 열립니다.

🔐 환경 변수
서버 (server/.env)
변수	설명
MONGODB_URI	MongoDB Atlas 연결 문자열
JWT_SECRET	JWT 토큰 서명용 비밀 키

⚠️ .env 파일은 커밋 금지입니다. .gitignore에 포함되어 있어야 합니다.

📌 주요 기능
✅ 회원가입 / 로그인

이메일/비밀번호로 회원 생성

JWT 인증 방식

로그인 시 토큰 발급

✅ Todo CRUD (인증 필요)

Todo 추가

Todo 조회 (전체 / 날짜별)

Todo 수정 / 삭제

완료 상태 토글

📁 API 요약
Method	URL	설명
POST	/api/auth/register	회원가입
POST	/api/auth/login	로그인
POST	/api/todos	Todo 생성
GET	/api/todos	Todo 전체 조회
GET	/api/todos?date=YYYY-MM-DD	날짜별 Todo 조회
PATCH	/api/todos/:id	Todo 수정
PATCH	/api/todos/:id/toggle	완료 토글
DELETE	/api/todos/:id	Todo 삭제

🧪 테스트 가이드

Postman 또는 Insomnia로 아래 API를 테스트하세요:

회원가입

로그인 (Bearer 토큰 포함)

Todo API 전체

📌 참고

client/README.md에는 프론트 세부 설명이 있습니다.

server/README.md에는 백엔드 상세 설명이 포함됩니다.


📄 개발자

풀스택 개발자 20회차 3팀 ( 전성우 편대호 김영환 )

Todo App 풀스택 프로젝트