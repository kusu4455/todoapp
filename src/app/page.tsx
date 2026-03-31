"use client";

import { useState } from "react";

interface Task {
  id: number;
  text: string;
  done: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [{ id: Date.now(), text, done: false }, ...prev]);
    setInput("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div className="container">
      <h1>
        ToDo
        {tasks.length > 0 && (
          <span>
            {remaining}件の未完了
          </span>
        )}
      </h1>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新しいタスクを入力..."
          autoFocus
        />
        <button type="submit">追加</button>
      </form>

      <div className="task-list">
        {tasks.length === 0 && (
          <div className="empty">タスクがありません。上から追加しましょう。</div>
        )}

        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <button
              className={`checkbox ${task.done ? "checked" : ""}`}
              onClick={() => toggleTask(task.id)}
              aria-label={task.done ? "未完了に戻す" : "完了にする"}
            >
              {task.done && (
                <svg viewBox="0 0 16 16">
                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
                </svg>
              )}
            </button>

            <span className={`task-text ${task.done ? "done" : ""}`}>
              {task.text}
            </span>

            <button
              className="delete-btn"
              onClick={() => deleteTask(task.id)}
              aria-label="削除"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
