import React, { lazy, Suspense, useState } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

export default function App() {
  const [route, setRoute] = useState('home');

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Performance Optimization with Lazy Loading</h1>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setRoute('home')} style={{ marginRight: '10px' }}>Home</button>
        <button onClick={() => setRoute('projects')} style={{ marginRight: '10px' }}>Projects</button>
        <button onClick={() => setRoute('contact')}>Contact</button>
      </nav>

      <Suspense fallback={<div style={{ padding: '20px', background: '#f0f0f0' }}>Loading Route...</div>}>
        {route === 'home' && <Home />}
        {route === 'projects' && <Projects />}
        {route === 'contact' && <Contact />}
      </Suspense>
    </div>
  );
}
