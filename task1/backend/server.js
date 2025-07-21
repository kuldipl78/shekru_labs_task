const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database(path.join(__dirname, "todo.db"), (err) => {
    if (err) {
        console.error("Failed to connect to SQLite database:", err.message);
    } else {
        console.log("Connected to SQLite database (todo.db)");
    }
});

// Create users table if it doesn't exist
// Create 'tasks' and 'subtasks' tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS subtasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER,
            text TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
        )
    `);
});


app.get("/", (req, res) => {
    res.json("Server running successfully..");
});

// Fetch all users
app.get("/tasks", (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, tasks) => {
        if (err) return res.status(500).json({ error: err.message });

        const taskIds = tasks.map((t) => t.id);
        if (taskIds.length === 0) return res.json([]);

        const placeholders = taskIds.map(() => "?").join(",");
        db.all(
            `SELECT * FROM subtasks WHERE task_id IN (${placeholders})`,
            taskIds,
            (err, subtasks) => {
                if (err) return res.status(500).json({ error: err.message });

                const combined = tasks.map((task) => ({
                    ...task,
                    completed: !!task.completed,
                    subtasks: subtasks
                        .filter((st) => st.task_id === task.id)
                        .map((st) => ({ ...st, completed: !!st.completed })),
                }));

                res.json(combined);
            }
        );
    });
});


app.get("/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  db.get("SELECT * FROM tasks WHERE id = ?", [taskId], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Error", error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "Task not found" });
    }

    db.all("SELECT * FROM subtasks WHERE task_id = ?", [taskId], (err, subtasks) => {
      if (err) {
        return res.status(500).json({ message: "Error", error: err.message });
      }

      res.json({
        ...row,
        completed: !!row.completed,
        subtasks: subtasks.map((st) => ({ ...st, completed: !!st.completed }))
      });
    });
  });
});



// Add a new user
app.post("/addTask", (req, res) => {
    const { title, subtasks } = req.body;
    db.run("INSERT INTO tasks (title) VALUES (?)", [title], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const taskId = this.lastID;

        if (!subtasks || subtasks.length === 0) {
            return res.status(200).json({ message: "Task added", taskId });
        }

        const stmt = db.prepare("INSERT INTO subtasks (task_id, text) VALUES (?, ?)");

        subtasks.forEach((sub) => {
            stmt.run(taskId, sub);
        });

        stmt.finalize((err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: "Task & Subtasks added", taskId });
        });
    });
});


// Delete user
app.delete("/deleteuser/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE id = ?";
    db.run(sql, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: `User with ID ${id} deleted successfully` });
    });
});

// Update user
app.put("/editTask/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;

  const query = `UPDATE tasks SET title = ? WHERE id = ?`;

  db.run(query, [title, taskId], function (err) {
    if (err) {
      console.error("Error updating task:", err.message);
      return res.status(500).json({ message: "Error updating task" });
    }

    res.status(200).json({ message: "Task updated successfully", taskId });
  });
});



app.listen(4000, () => {
    console.log("Server running at http://localhost:4000");
});
