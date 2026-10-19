const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory tasks store
let tasks = [];

// Rate limiting map: ip -> lastRequestTimestamp
const rateLimitMap = new Map();

// POST /api/ai/generate-description
// Generates task descriptions with robust error handling and graceful degradation
app.post('/api/ai/generate-description', async (req, res) => {
  const { title } = req.body;
  const clientIp = req.ip || 'anonymous';

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  // Rate Limiting: Max 1 request every 5 seconds per client
  const lastRequest = rateLimitMap.get(clientIp);
  const now = Date.now();
  if (lastRequest && (now - lastRequest) < 5000) {
    return res.status(429).json({ 
      error: 'Too many requests. Please wait 5 seconds between AI generations.' 
    });
  }
  rateLimitMap.set(clientIp, now);

  const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

  // Graceful degradation: If no API key is configured or API fails, return a reliable fallback description
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    console.warn('[AI Service] No valid API key provided. Using fallback generator.');
    return res.json({
      description: `Task focused on completing "${title.trim()}". Steps include gathering initial requirements, breaking down objectives, implementing milestone deliverables, and validating output.`,
      fallback: true,
      provider: 'System Template Fallback'
    });
  }

  try {
    // Calling OpenAI or compatible API server-side
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an intelligent task planner. Generate a crisp, 2-sentence actionable description for the user task title.'
          },
          {
            role: 'user',
            content: `Write a short task description for: "${title.trim()}"`
          }
        ],
        max_tokens: 80,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`External AI API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedDescription = data.choices[0].message.content.trim();

    res.json({
      description: generatedDescription,
      fallback: false,
      provider: 'OpenAI gpt-4o-mini'
    });
  } catch (err) {
    console.error('[AI Integration Error]:', err.message);
    // Graceful degradation response ensures frontend flow never breaks
    res.status(200).json({
      description: `Task plan for "${title.trim()}": Outline prerequisites, execute core action items, and verify completion criteria.`,
      fallback: true,
      errorNotice: 'AI service unavailable; defaulted to safe template.'
    });
  }
});

// Standard CRUD for Task Management
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title, description, priority } = req.body;
  const newTask = {
    id: Date.now().toString(),
    title,
    description: description || 'No description provided',
    priority: priority || 'medium',
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Practical 13 AI Server running on port ${PORT}`));
