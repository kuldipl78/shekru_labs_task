import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function AddTask() {
    const [task, setTask] = useState({ title: "" });
    const [subtasks, setSubtasks] = useState([""]);
    const navigate = useNavigate();

    const handleTaskChange = (e) => {
        setTask({ ...task, title: e.target.value });
    };

    const handleSubtaskChange = (index, value) => {
        const updatedSubtasks = [...subtasks];
        updatedSubtasks[index] = value;
        setSubtasks(updatedSubtasks);
    };

    const addSubtaskField = () => {
        setSubtasks([...subtasks, ""]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...task, subtasks };

        fetch("http://localhost:4000/addTask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Response:", data);
                navigate("/");
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    };

    return (
        <div className="main-container">
            <h1 className="main-heading">Task Manager</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <input
                        className="input-element"
                        type="text"
                        name="title"
                        placeholder="Enter Task Title"
                        value={task.title}
                        onChange={handleTaskChange}
                        required
                    />
                    <h3 style={{ color: "black", marginTop: "15px" }}>Subtasks:</h3>
                    {subtasks.map((subtask, index) => (
                        <input
                            key={index}
                            className="input-element"
                            type="text"
                            placeholder={`Subtask ${index + 1}`}
                            value={subtask}
                            onChange={(e) => handleSubtaskChange(index, e.target.value)}
                            required
                        />
                    ))}
                    <button type="button" className="onsubmit" onClick={addSubtaskField}>
                        + Add Subtask
                    </button>
                    <br />
                    <button className="onsubmit" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddTask;