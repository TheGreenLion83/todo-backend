const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/todo") // Usa 127.0.0.1 per forzare IPv4
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Schema and Model
const TaskSchema = new mongoose.Schema({ task: String });
const Task = mongoose.model("Task", TaskSchema);

// Routes
// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a new task
app.post("/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Update a task
app.put("/tasks/:id", async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id, // ID dell'attività da aggiornare
        { task: req.body.task }, // Nuovo valore dell'attività
        { new: true } // Restituisce il documento aggiornato
      );
      res.json(updatedTask);
    } catch (err) {
      res.status(500).send("Errore durante l'aggiornamento dell'attività.");
    }
  });
  
  