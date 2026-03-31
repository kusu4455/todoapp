"use client";

import { useState, useCallback } from "react";

type Priority = "high" | "mid" | "low";
type Category = "work" | "personal" | "other";

interface Task {
  id: number;
  text: string;
  done: boolean;
  priority: Priority;
  category: Category;
  deadline: string;
  completing: boolean;
  removing: boolean;
}

const PRIORITY_LABELS: Record<Priority, string> = {
  high: "高",
  mid: "中",
  low: "低",
};

const CATEGORY_LABELS: Record<Category, string> = {
  work: "仕事",
  personal: "プライベート",
  other: "その他",
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("mid");
  const [category, setCategory] = useState<Category>("work");
  const [deadline, setDeadline] = useState("");

  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");

  const addTask = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [
      {
        id: Date.now(),
        text,
        done: false,
        priority,
        category,
        deadline,
        completing: false,
        removing: false,
      },
      ...prev,
    ]);
    setInput("");
    setDeadline("");
  }, [input, priority, category, deadline]);

  const toggleTask = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completing: !t.done, done: !t.done } : t
      )
    );
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completing: false } : t))
      );
    }, 500);
  }, []);

  const deleteTask = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
    );
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const filtered = tasks.filter((t) => {
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    return true;
  });

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.done).length;
  const remaining = total - doneCount;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const isOverdue = (d: string) => {
    if (!d) return false;
    return new Date(d) < new Date(new Date().toDateString());
  };

  const formatDate = (d: string) => {
    if (!d) return "";
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="container">
      <div className="header">
        <h1>
          <span className="logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </span>
          ToDo
        </h1>
        {total > 0 && (
          <div className="header-sub">{remaining}件の未完了タスク</div>
        )}
      </div>

      {total > 0 && (
        <div className="stats-card">
          <div className="stats-row">
            <div className="stats-numbers">
              <div className="stat-item">
                <div className="stat-value">{total}</div>
                <div className="stat-label">全体</div>
              </div>
              <div className="stat-item">
                <div className="stat-value completed">{doneCount}</div>
                <div className="stat-label">完了</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{remaining}</div>
                <div className="stat-label">残り</div>
              </div>
            </div>
            <div className="stat-percentage">{percent}%</div>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <form
        className="form-card"
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <div className="form-main">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="新しいタスクを入力..."
            autoFocus
          />
          <button type="submit" className="add-btn">
            追加
          </button>
        </div>
        <div className="form-options">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="high">優先度：高</option>
            <option value="mid">優先度：中</option>
            <option value="low">優先度：低</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="work">仕事</option>
            <option value="personal">プライベート</option>
            <option value="other">その他</option>
          </select>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
      </form>

      {total > 0 && (
        <div className="filters">
          <div className="filter-group">
            <button
              className={`filter-btn ${filterCategory === "all" ? "active" : ""}`}
              onClick={() => setFilterCategory("all")}
            >
              全て
            </button>
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
              <button
                key={c}
                className={`filter-btn ${filterCategory === c ? "active" : ""}`}
                onClick={() => setFilterCategory(c)}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
          <div className="filter-divider" />
          <div className="filter-group">
            <button
              className={`filter-btn ${filterPriority === "all" ? "active" : ""}`}
              onClick={() => setFilterPriority("all")}
            >
              全て
            </button>
            {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
              <button
                key={p}
                className={`filter-btn ${filterPriority === p ? "active" : ""}`}
                onClick={() => setFilterPriority(p)}
              >
                {PRIORITY_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="task-list">
        {filtered.length === 0 && (
          <div className="empty">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }}>
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            {total === 0
              ? "タスクがありません。上から追加しましょう。"
              : "該当するタスクがありません。"}
          </div>
        )}

        {filtered.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.completing ? "completing" : ""} ${task.removing ? "removing" : ""}`}
          >
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

            <div className="task-content">
              <span className={`task-text ${task.done ? "done" : ""}`}>
                {task.text}
              </span>
              <div className="task-meta">
                <span className={`tag tag-priority-${task.priority}`}>
                  {PRIORITY_LABELS[task.priority]}
                </span>
                <span className={`tag tag-cat-${task.category}`}>
                  {CATEGORY_LABELS[task.category]}
                </span>
                {task.deadline && (
                  <span
                    className={`tag tag-deadline ${!task.done && isOverdue(task.deadline) ? "overdue" : ""}`}
                  >
                    {formatDate(task.deadline)}
                  </span>
                )}
              </div>
            </div>

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
