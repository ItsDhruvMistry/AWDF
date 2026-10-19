import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:5000';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const fetchTasks = () => {
    setLoading(true);
    fetch(${BASE_URL}/tasks)
      .then(res => res.json())
      .then(data => { setTasks(data); setError(''); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return;
    
    // Optimistic UI update
    const tempId = Date.now().toString();
    const newTask = { _id: tempId, title, completed: false };
    setTasks([...tasks, newTask]);
    setTitle('');

    try {
      const res = await fetch(${BASE_URL}/tasks, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (!res.ok) throw new Error('Failed to create');
      const savedTask = await res.json();
      setTasks(prev => prev.map(t => t._id === tempId ? savedTask : t));
      setToast('Task created successfully!');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setError(err.message);
      setTasks(prev => prev.filter(t => t._id !== tempId)); // revert
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(${BASE_URL}/tasks/, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setTasks(prev => prev.filter(t => t._id !== id));
      setToast('Task deleted!');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Task Management (Full Stack)</h1>
      {toast && <div style={{ background: '#4caf50', color: 'white', padding: '10px', marginBottom: '10px' }}>{toast}</div>}
      {error && <div style={{ background: '#f44336', color: 'white', padding: '10px', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleCreate} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="New Task Title" 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px', marginLeft: '5px' }}>Add Task</button>
      </form>

      {loading ? <p>Loading tasks...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(t => (
            <li key={t._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc' }}>
              <span>{t.title}</span>
              <button onClick={() => handleDelete(t._id)} style={{ color: 'red' }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
