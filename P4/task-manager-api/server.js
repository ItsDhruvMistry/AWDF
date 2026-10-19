const express = require('express');

const app = express();
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Middleware to reject POST/PUT requests missing Content-Type: application/json
app.use((req, res, next) => {
    if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: 'Content-Type must be application/json' });
    }
    next();
});

// In-memory temporary storage
let tasks = [];
let nextId = 1;

// Routes
app.get('/tasks', (req, res, next) => {
    try {
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

app.post('/tasks', (req, res, next) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        const newTask = {
            id: nextId++,
            title,
            description: description || '',
            completed: false,
            createdAt: new Date()
        };
        tasks.push(newTask);
        res.status(201).json(newTask);
    } catch (err) {
        next(err);
    }
});

app.put('/tasks/:id', (req, res, next) => {
    try {
        const taskId = parseInt(req.params.id);
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const { title, description, completed } = req.body;
        if (title) tasks[taskIndex].title = title;
        if (description !== undefined) tasks[taskIndex].description = description;
        if (completed !== undefined) tasks[taskIndex].completed = completed;
        
        res.status(200).json(tasks[taskIndex]);
    } catch (err) {
        next(err);
    }
});

app.delete('/tasks/:id', (req, res, next) => {
    try {
        const taskId = parseInt(req.params.id);
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        tasks.splice(taskIndex, 1);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
