import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingSubtaskId, setEditingSubtaskId] = useState(null);
  const [editText, setEditText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Failed to load tasks:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (title.trim()) {
      const newTask = {
        id: Date.now(),
        title,
        completed: false,
        subtasks: [],
      };
      setTasks([newTask, ...tasks]);
      setTitle("");
    }
  };

  const handleAddSubtask = (taskId) => {
    if (subtaskInput.trim()) {
      const updated = tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [
              ...task.subtasks,
              { id: Date.now(), text: subtaskInput, completed: false },
            ],
          };
        }
        return task;
      });
      setTasks(updated);
      setSubtaskInput("");
    }
  };

  const handleToggleComplete = (taskId, subtaskId = null) => {
    const updated = tasks.map((task) => {
      if (task.id === taskId) {
        if (subtaskId === null) {
          return { ...task, completed: !task.completed };
        } else {
          const updatedSubtasks = task.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...task, subtasks: updatedSubtasks };
        }
      }
      return task;
    });
    setTasks(updated);
  };

  const handleDelete = (taskId, subtaskId = null) => {
    if (subtaskId === null) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    } else {
      const updated = tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.filter((st) => st.id !== subtaskId),
          };
        }
        return task;
      });
      setTasks(updated);
    }
  };

  const handleEditStart = (taskId, subtaskId = null, currentText = "") => {
    setEditingTaskId(taskId);
    setEditingSubtaskId(subtaskId);
    setEditText(currentText);
  };

  const handleEditSubmit = () => {
    if (editingSubtaskId === null) {
      const updated = tasks.map((task) =>
        task.id === editingTaskId ? { ...task, title: editText } : task
      );
      setTasks(updated);
    } else {
      const updated = tasks.map((task) => {
        if (task.id === editingTaskId) {
          const updatedSubtasks = task.subtasks.map((st) =>
            st.id === editingSubtaskId ? { ...st, text: editText } : st
          );
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      });
      setTasks(updated);
    }
    setEditingTaskId(null);
    setEditingSubtaskId(null);
    setEditText("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "uncompleted") return !task.completed;
    return true;
  });

  return (
    <div className="main-container">
      <h1 className="main-heading">Todo Task Manager</h1>
      <div className="form-container">
        <input
          className="input-element"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
        <button className="onsubmit" onClick={handleAddTask}>
          Add Task
        </button>
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
        </select>
      </div>
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
            <div>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
              />
              {editingTaskId === task.id && editingSubtaskId === null ? (
                <input
                  className="input-element"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={handleEditSubmit}
                  onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
                  autoFocus
                />
              ) : (
                <span onDoubleClick={() => handleEditStart(task.id, null, task.title)}>
                  {task.title}
                </span>
              )}
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
            <div className="subtask-section">
              <input
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                placeholder="Add subtask"
              />
              <button onClick={() => handleAddSubtask(task.id)}>+ Subtask</button>
              <ul>
                {task.subtasks.map((sub) => (
                  <li
                    key={sub.id}
                    className={`subtask-item ${sub.completed ? "completed" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => handleToggleComplete(task.id, sub.id)}
                    />
                    {editingTaskId === task.id && editingSubtaskId === sub.id ? (
                      <input
                        className="input-element"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleEditSubmit}
                        onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
                        autoFocus
                      />
                    ) : (
                      <span
                        onDoubleClick={() => handleEditStart(task.id, sub.id, sub.text)}
                      >
                        {sub.text}
                      </span>
                    )}
                    <button onClick={() => handleDelete(task.id, sub.id)}>
                      Delete
                    </button>
                    <button onClick={() => navigate(`/edit/${task.id}`)}>Edit</button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;