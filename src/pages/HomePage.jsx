import { useEffect, useMemo, useState } from "react";
import Calendar from "../components/Calendar";
import TodoPanel from "../components/TodoPanel";

// 로컬 임시 저장 (백엔드 붙이면 제거/대체)
const LS_KEY = "todos_array_v1";

function monthKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // YYYY-MM
}

function groupByDate(list) {
  const map = {};
  for (const t of list) {
    if (!map[t.date]) map[t.date] = [];
    map[t.date].push(t);
  }
  return map;
}

function readAllTodos() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAllTodos(all) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export default function HomePage({ user, onLogout }) {
  // 캘린더 “현재 월”
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // 선택 날짜
  const [selectedDate, setSelectedDate] = useState(null);

  // ✅ A안: todos는 배열(서버 응답 형태 그대로)
  const [todos, setTodos] = useState([]);

  // loading / error (백엔드 붙이면 그대로 유지)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentMonthKey = monthKey(currentMonth);

  // A안이지만 달력 점 표시용으로만 “파생” map 생성(상태는 배열 유지)
  const todosByDate = useMemo(() => groupByDate(todos), [todos]);

  const selectedTodos = useMemo(() => {
    if (!selectedDate) return [];
    return todos.filter((t) => t.date === selectedDate);
  }, [todos, selectedDate]);

  // ✅ 월 변경 시 “해당 월 데이터 fetch” 자리 (지금은 localStorage에서 가져오는 임시 구현)
  useEffect(() => {
    setLoading(true);
    setError("");

    try {
      // --- 나중에 백엔드 붙이면 여기만 axios/fetch로 교체 ---
      // 예: GET /api/todos?month=YYYY-MM
      // const res = await axios.get(`${VITE_API_BASE}/api/todos?month=${currentMonthKey}`)
      // setTodos(res.data.todos)

      // 임시: 로컬 저장된 전체 todos에서 이번 달만 필터
      const all = readAllTodos();
      const monthTodos = all.filter((t) => (t.date || "").startsWith(currentMonthKey));
      setTodos(monthTodos);
    } catch (e) {
      setError(e?.message || "데이터 로딩 실패");
    } finally {
      setLoading(false);
    }
  }, [currentMonthKey]);

  function addTodo(date, text) {
    const newTodo = {
      id: Date.now(), // 서버 붙이면 서버 id로 대체
      date,
      text,
      done: false,
    };

    // 현재 달 상태 업데이트
    setTodos((prev) => [newTodo, ...prev]);

    // 임시 저장: 전체 목록에 반영
    const all = readAllTodos();
    const nextAll = [newTodo, ...all];
    writeAllTodos(nextAll);
  }

  function toggleTodo(id) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

    const all = readAllTodos();
    const nextAll = all.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    writeAllTodos(nextAll);
  }

  function removeTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));

    const all = readAllTodos();
    const nextAll = all.filter((t) => t.id !== id);
    writeAllTodos(nextAll);
  }

  return (
    <div className="home">
      <div className="topBar">
        <h1 className="logo">TODO</h1>
        <button className="logout" onClick={onLogout}>
          로그아웃
        </button>
      </div>

      <div className="profileBox">
        <h2>{user.name}</h2>
        <p>{user.bio}</p>
      </div>

      <Calendar
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        todosByDate={todosByDate}
      />

      {loading && <div className="infoBox">로딩 중...</div>}
      {error && <div className="errorBox">{error}</div>}

      {selectedDate && (
        <TodoPanel
          selectedDate={selectedDate}
          todos={selectedTodos}
          onAdd={addTodo}
          onToggle={toggleTodo}
          onRemove={removeTodo}
        />
      )}
    </div>
  );
}