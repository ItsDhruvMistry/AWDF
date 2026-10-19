import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error('Fetch error:', e);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (res.ok) {
        setTitle('');
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Containerized Task Manager</h1>
      <p style={{ color: '#666' }}>Running with Docker Compose (React + Node + MongoDB)</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="New Task Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          style={{ flex: 1, padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#0066cc', color: '#fff', border: 'none' }}>
          Add Task
        </button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(t => (
          <li key={t._id} style={{ padding: '10px', background: '#f5f5f5', marginBottom: '8px', borderRadius: '4px' }}>
            {t.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
