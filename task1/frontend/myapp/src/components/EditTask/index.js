import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./index.css";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/tasks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTask(data);
        setTitle(data.title);
      })
      .catch((err) => console.error("Failed to fetch task:", err));
  }, [id]);

  const handleUpdate = () => {
    fetch(`http://localhost:4000/editTask/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then(() => navigate("/"))
      .catch((err) => console.error("Update failed:", err));
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div className="edit-container">
      <h2>Edit Task</h2>
      <input
        className="input-element"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Edit title"
      />
      <button className="onsubmit" onClick={handleUpdate}>
        Save Changes
      </button>
    </div>
  );
}

export default EditTask;
