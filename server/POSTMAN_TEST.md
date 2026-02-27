# Postman 테스트 가이드

## 환경 설정

### 1. 서버 실행
```bash
npm run dev
```

서버 주소: `http://localhost:3000`

---

## API 테스트 순서

### 1️⃣ 회원가입 (실패 케이스 - 비밀번호 8자 미만)

**Method:** `POST`
**URL:** `http://localhost:3000/api/auth/register`
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@test.com",
  "password": "1234567",
  "name": "테스트유저"
}
```

**예상 응답 (400):**
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

---

### 2️⃣ 회원가입 (성공)

**Method:** `POST`
**URL:** `http://localhost:3000/api/auth/register`
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@test.com",
  "password": "12345678",
  "name": "테스트유저"
}
```

**예상 응답 (201):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "507f1f77bcf86cd799439011",
        "email": "test@test.com",
        "name": "테스트유저"
    }
}
```

> ⚠️ **중요:** '이미 존재하는 유저...'응답 확인되면 다른 이메일로 가입해야함.
> ⚠️ **중요:** `token` 값을 복사해서 이후 요청의 Authorization 헤더에 사용하세요!

---

### 3️⃣ 로그인

**Method:** `POST`
**URL:** `http://localhost:3000/api/auth/login`
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test4@test.com",
  "password": "12345678"
}
```

**예상 응답 (200):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTFhMmVlNDY2NDA2MjZiMjAxMDNmZCIsImlhdCI6MTc3MjIwMDc5NiwiZXhwIjoxNzcyODA1NTk2fQ.ArprHN2PjhRYcC4nfusmPZpeq1GYLL00pg9WtUlP4ow",
    "user": {
        "id": "69a1a2ee46640626b20103fd",
        "email": "test4@test.com",
        "name": "테스트유저"
    }
}
```

---

### 4️⃣ Todo 생성

**Method:** `POST`
**URL:** `http://localhost:3000/api/todos`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (raw JSON):**
```json
{
  "content": "프로젝트 발표 자료 작성",
  "date": "2026-02-27"
}
```

**예상 응답 (201):**
```json
{
    "userId": "69a1a2ee46640626b20103fd",
    "content": "프로젝트 발표 자료 작성",
    "date": "2026-02-27",
    "completed": false,
    "_id": "69a1a38446640626b2010400",
    "createdAt": "2026-02-27T14:00:36.995Z",
    "updatedAt": "2026-02-27T14:00:36.995Z",
    "__v": 0
}
```

---

### 5️⃣ Todo 전체 조회

**Method:** `GET`
**URL:** `http://localhost:3000/api/todos`
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**예상 응답 (200):**
```json
[
    {
        "_id": "69a1a38446640626b2010400",
        "userId": "69a1a2ee46640626b20103fd",
        "content": "프로젝트 발표 자료 작성",
        "date": "2026-02-27",
        "completed": false,
        "createdAt": "2026-02-27T14:00:36.995Z",
        "updatedAt": "2026-02-27T14:00:36.995Z",
        "__v": 0
    }
]
```

> date 파라미터 없이 요청하면 해당 사용자의 모든 Todo를 반환합니다.

---

### 6️⃣ Todo 조회 (날짜별)

**Method:** `GET`
**URL:** `http://localhost:3000/api/todos?date=2026-02-27`
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**예상 응답 (200):**
```json
[
    {
        "_id": "69a1a38446640626b2010400",
        "userId": "69a1a2ee46640626b20103fd",
        "content": "프로젝트 발표 자료 작성",
        "date": "2026-02-27",
        "completed": false,
        "createdAt": "2026-02-27T14:00:36.995Z",
        "updatedAt": "2026-02-27T14:00:36.995Z",
        "__v": 0
    }
]
```

---

### 7️⃣ Todo 수정

**Method:** `PATCH`
**URL:** `http://localhost:3000/api/todos/{todo_id}`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (raw JSON):**
```json
{
  "content": "프로젝트 발표 자료 작성 완료"
}
```

**예상 응답 (200):**
```json
{
    "_id": "69a1a38446640626b2010400",
    "userId": "69a1a2ee46640626b20103fd",
    "content": "프로젝트 발표 자료 작성 완료",
    "date": "2026-02-27",
    "completed": false,
    "createdAt": "2026-02-27T14:00:36.995Z",
    "updatedAt": "2026-02-27T14:04:31.611Z",
    "__v": 0
}
```

---

### 8️⃣ Todo 완료 토글

**Method:** `PATCH`
**URL:** `http://localhost:3000/api/todos/{todo_id}/toggle`
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**예상 응답 (200):**
```json
{
    "_id": "69a1a38446640626b2010400",
    "userId": "69a1a2ee46640626b20103fd",
    "content": "프로젝트 발표 자료 작성 완료",
    "date": "2026-02-27",
    "completed": true,
    "createdAt": "2026-02-27T14:00:36.995Z",
    "updatedAt": "2026-02-27T14:05:36.397Z",
    "__v": 0
}
```

---

### 9️⃣ Todo 삭제

**Method:** `DELETE`
**URL:** `http://localhost:3000/api/todos/{todo_id}`
**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**예상 응답 (200):**
```json
{
    "message": "삭제되었습니다"
}
```

---

## 에러 케이스 테스트

### ❌ 인증 없이 Todo 접근

**Method:** `GET`
**URL:** `http://localhost:3000/api/todos`
**Headers:** (Authorization 헤더 없음)

**예상 응답 (401):**
```json
{
    "message": "인증 토큰이 필요합니다"
}
```

---

### ❌ 중복 이메일 회원가입

**Method:** `POST`
**URL:** `http://localhost:3000/api/auth/register`
**Body:**
```json
{
  "email": "test@test.com",
  "password": "12345678",
  "name": "중복유저"
}
```

**예상 응답 (400):**
```json
{
    "message": "이미 사용 중인 이메일입니다"
}
```

---

### ❌ 잘못된 비밀번호 로그인

**Method:** `POST`
**URL:** `http://localhost:3000/api/auth/login`
**Body:**
```json
{
  "email": "test@test.com",
  "password": "wrongpassword"
}
```

**예상 응답 (401):**
```json
{
    "message": "이메일 또는 비밀번호가 올바르지 않습니다"
}
```

---

## Postman 환경 변수 설정 (선택사항)

### 1. Environment 생성
- 이름: `MyTodo Local`
- 변수 추가:
  - `baseUrl`: `http://localhost:3000`
  - `token`: (회원가입/로그인 후 자동 설정)

### 2. Tests 탭에서 토큰 자동 저장

**회원가입/로그인 요청의 Tests 탭에 추가:**
```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
}
```

### 3. Authorization 헤더 자동화
- Type: `Bearer Token`
- Token: `{{token}}`

---

## 체크리스트

- [ ] 서버 실행 확인 (`npm run dev`)
- [ ] MongoDB 연결 확인
- [ ] 비밀번호 8자 미만 회원가입 실패 확인
- [ ] 회원가입 성공 및 토큰 발급 확인
- [ ] 로그인 성공 확인
- [ ] Todo 생성 확인
- [ ] Todo 전체 조회 확인
- [ ] Todo 날짜별 조회 확인
- [ ] Todo 수정 확인
- [ ] Todo 완료 토글 확인
- [ ] Todo 삭제 확인
- [ ] 인증 없이 접근 시 401 에러 확인
- [ ] 중복 이메일 가입 시 400 에러 확인
- [ ] 잘못된 비밀번호 로그인 시 401 에러 확인
