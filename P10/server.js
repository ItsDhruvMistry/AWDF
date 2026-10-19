const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('./models/Task');
const taskEvents = require('./events');
// Register event listeners at startup
require('./listeners');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskdb_p10')
  .then(() => console.log('MongoDB connected for Practical 10'))
  .catch(err => console.error('MongoDB error:', err));

// GET /tasks
app.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// POST /tasks - Creates task, responds immediately, then triggers asynchronous event
app.post('/tasks', async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    const apiResponseTimestamp = new Date().toISOString();
    console.log(`[API Response] Task created and HTTP 201 sent at: ${apiResponseTimestamp}`);
    
    // Send response immediately to client
    res.status(201).json(task);

    // Asynchronously emit event decoupled from response cycle
    setImmediate(() => {
      taskEvents.emit('task-created', task);
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted successfully' });

    setImmediate(() => {
      taskEvents.emit('task-deleted', task);
    });
  } catch (err) {
    next(err);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Practical 10 Server running on port ${PORT}`));
