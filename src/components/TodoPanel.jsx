import { useState } from "react";

export default function TodoPanel({
  selectedDate,
  todos,
  onAdd,
  onToggle,
  onRemove,
  onUpdate,
}) {
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  function handleAdd() {
    if (!input.trim()) return;
    onAdd(selectedDate, input.trim());
    setInput("");
  }

  function handleEditStart(todo) {
    setEditId(todo.id);
    setEditText(todo.text);
  }

  function handleEditSave(id) {
    if (!editText.trim()) return;
    onUpdate(id, editText.trim());
    setEditId(null);
    setEditText("");
  }

  function handleCancel() {
    setEditId(null);
    setEditText("");
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
        <button
          className="addBtn"
          onClick={handleAdd}
          disabled={!input.trim()}
        >
          + 추가
        </button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <div className="todoLeft">
              <button
                className={`completeBtn ${
                  todo.done ? "completeActive" : ""
                }`}
                onClick={() => onToggle(todo.id)}
              >
                ✓
              </button>

              {editId === todo.id ? (
                <input
                  className="editInput"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <span>{todo.text}</span>
              )}
            </div>

            <div className="todoActions">
              {editId === todo.id ? (
                <>
                  <button
                    className="saveBtn"
                    onClick={() => handleEditSave(todo.id)}
                  >
                    저장
                  </button>
                  <button
                    className="cancelBtn"
                    onClick={handleCancel}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="editBtn"
                    onClick={() => handleEditStart(todo)}
                  >
                    수정
                  </button>
                  <button
                    className="deleteBtn"
                    onClick={() => onRemove(todo.id)}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}