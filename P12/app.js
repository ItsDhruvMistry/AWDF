const express = require('express');
const app = express();

app.use(express.json());

// In-memory data store for CI automated testing without DB dependencies
let tasks = [
  { id: 1, title: 'Learn GitHub Actions', completed: true },
  { id: 2, title: 'Configure CI Pipeline', completed: false }
];

// GET /tasks - returns list of tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// GET /tasks/:id - returns single task
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.status(200).json(task);
});

// POST /tasks - creates a new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = { id: tasks.length + 1, title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

module.exports = app;
