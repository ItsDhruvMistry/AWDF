const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Task = require('./models/Task');

const app = express();
app.use(cors());
app.use(express.json());

// In Docker Compose, the service name is "mongodb"
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/taskdb';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully inside Docker container'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Containerized backend listening on port ${PORT}`));
