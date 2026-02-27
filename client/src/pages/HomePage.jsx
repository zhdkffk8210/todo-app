import { useEffect, useMemo, useState } from "react";
import Calendar from "../components/Calendar";
import TodoPanel from "../components/TodoPanel";
import {
  createTodoApi,
  deleteTodoApi,
  fetchTodosApi,
  toggleTodoApi,
  updateTodoApi,
} from "../api/todos";

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

export default function HomePage({ user, onLogout }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(null);

  // ✅ 서버에서 받은 "전체 Todo"
  const [allTodos, setAllTodos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentMonthKey = monthKey(currentMonth);

  // ✅ 현재 달 Todo만 필터 (캘린더 dot 용)
  const monthTodos = useMemo(() => {
    return allTodos.filter((t) => (t.date || "").startsWith(currentMonthKey));
  }, [allTodos, currentMonthKey]);

  const todosByDate = useMemo(() => groupByDate(monthTodos), [monthTodos]);

  const selectedTodos = useMemo(() => {
    if (!selectedDate) return [];
    return allTodos.filter((t) => t.date === selectedDate);
  }, [allTodos, selectedDate]);

  // ✅ 최초 1회(또는 필요 시) 전체 로딩
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchTodosApi(); // date 없으면 전체
        setAllTodos(Array.isArray(data) ? data : []);
      } catch (err) {
        const resData = err?.response?.data;
        setError(resData?.message || "데이터 로딩 실패");
        // 토큰 만료/없음 등으로 401이면 로그아웃 처리
        if (err?.response?.status === 401) onLogout();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addTodo(date, text) {
    if (!date) return;
    setError("");
    try {
      const created = await createTodoApi({ content: text, date });
      setAllTodos((prev) => [created, ...prev]);
    } catch (err) {
      const resData = err?.response?.data;
      setError(resData?.message || "추가 실패");
      if (err?.response?.status === 401) onLogout();
    }
  }

  async function toggleTodo(id) {
    setError("");
    try {
      const updated = await toggleTodoApi(id);
      setAllTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      const resData = err?.response?.data;
      setError(resData?.message || "토글 실패");
      if (err?.response?.status === 401) onLogout();
    }
  }

  async function removeTodo(id) {
    setError("");
    try {
      await deleteTodoApi(id);
      setAllTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      const resData = err?.response?.data;
      setError(resData?.message || "삭제 실패");
      if (err?.response?.status === 401) onLogout();
    }
  }

  async function updateTodo(id, newText) {
    setError("");
    try {
      const updated = await updateTodoApi(id, { content: newText });
      setAllTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      const resData = err?.response?.data;
      setError(resData?.message || "수정 실패");
      if (err?.response?.status === 401) onLogout();
    }
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
        <p>{user.bio || "자기소개 없음"}</p>
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
          onUpdate={updateTodo}
        />
      )}
    </div>
  );
}