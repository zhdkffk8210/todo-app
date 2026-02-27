import { useEffect, useMemo, useState } from "react";
import Calendar from "../components/Calendar";
import TodoPanel from "../components/TodoPanel";

const LS_KEY = "todos_array_v1";

function monthKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
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
  } catch (e) {
    console.error("localStorage 저장 실패", e);
  }
}

export default function HomePage({ user, onLogout }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentMonthKey = monthKey(currentMonth);

  const todosByDate = useMemo(() => groupByDate(todos), [todos]);

  const selectedTodos = useMemo(() => {
    if (!selectedDate) return [];
    return todos.filter((t) => t.date === selectedDate);
  }, [todos, selectedDate]);

  useEffect(() => {
    setLoading(true);
    setError("");

    try {
      const all = readAllTodos();
      const monthTodos = all.filter((t) =>
        (t.date || "").startsWith(currentMonthKey)
      );
      setTodos(monthTodos);
    } catch (e) {
      setError(e?.message || "데이터 로딩 실패");
    } finally {
      setLoading(false);
    }
  }, [currentMonthKey]);

  function addTodo(date, text) {
    const newTodo = {
      id: Date.now(),
      date,
      text,
      done: false,
    };

    setTodos((prev) => [newTodo, ...prev]);

    const all = readAllTodos();
    writeAllTodos([newTodo, ...all]);
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

    const all = readAllTodos();
    writeAllTodos(
      all.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function removeTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));

    const all = readAllTodos();
    writeAllTodos(all.filter((t) => t.id !== id));
  }

  function updateTodo(id, newText) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );

    const all = readAllTodos();
    writeAllTodos(
      all.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
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
          onUpdate={updateTodo}
        />
      )}
    </div>
  );
}