import { useState } from "react";

export default function TodoPanel({ selectedDate, todos, onAdd, onToggle, onRemove }) {
  const [input, setInput] = useState("");

  function handleAdd() {
    if (!input.trim()) return;
    onAdd(selectedDate, input.trim());
    setInput("");
  }

  return (
    <div className="todoPanel">
      <h4>{selectedDate} 할 일</h4>

      <div className="todoInput">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일 입력"
        />
        <button className="addBtn" onClick={handleAdd} disabled={!input.trim()}>
          + 추가
        </button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <div className="todoLeft">
              {/* 완료 버튼 */}
              <button
                className={`completeBtn ${todo.done ? "completeActive" : ""}`}
                onClick={() => onToggle(todo.id)}
                aria-label="완료 토글"
              >
                ✓
              </button>
              <span>{todo.text}</span>
            </div>

            <button className="deleteBtn" onClick={() => onRemove(todo.id)}>
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}