const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('./models/Task');
const cache = require('./cache');

const app = express();
app.use(express.json());

// In-memory hit/miss counters for analysis
let stats = { hits: 0, misses: 0 };

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskdb_p9')
  .then(() => console.log('MongoDB connected for Practical 9'))
  .catch(err => console.error('MongoDB connection error:', err));

// GET /tasks - Fetch all tasks with caching
app.get('/tasks', async (req, res, next) => {
  const startTime = Date.now();
  const cacheKey = 'all_tasks';

  try {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      stats.hits++;
      const duration = Date.now() - startTime;
      return res.json({
        source: 'cache',
        responseTimeMs: duration,
        data: cachedData
      });
    }

    // Cache miss -> Query database
    stats.misses++;
    const tasks = await Task.find().sort({ createdAt: -1 });
    cache.set(cacheKey, tasks);
    const duration = Date.now() - startTime;

    res.json({
      source: 'database',
      responseTimeMs: duration,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id - Single task retrieval with item caching
app.get('/tasks/:id', async (req, res, next) => {
  const cacheKey = `task_${req.params.id}`;
  try {
    const cachedTask = cache.get(cacheKey);
    if (cachedTask) {
      stats.hits++;
      return res.json({ source: 'cache', data: cachedTask });
    }

    stats.misses++;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    cache.set(cacheKey, task);
    res.json({ source: 'database', data: task });
  } catch (err) {
    next(err);
  }
});

// POST /tasks - Create task & invalidate cache
app.post('/tasks', async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    // Invalidate list cache so newly created task appears immediately
    cache.del('all_tasks');
    console.log('[Cache] Invalidation performed on POST /tasks');
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id - Update task & invalidate cache
app.put('/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Invalidate both collection and specific item cache
    cache.del('all_tasks');
    cache.del(`task_${req.params.id}`);
    console.log(`[Cache] Invalidation performed on PUT /tasks/${req.params.id}`);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id - Delete task & invalidate cache
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    cache.del('all_tasks');
    cache.del(`task_${req.params.id}`);
    console.log(`[Cache] Invalidation performed on DELETE /tasks/${req.params.id}`);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// Debug stats endpoint
app.get('/cache/stats', (req, res) => {
  res.json({
    cacheStats: stats,
    keys: cache.keys()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Practical 9 Server running on port ${PORT}`));
