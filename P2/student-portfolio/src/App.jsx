import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Projects from './components/Projects';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Footer from './components/Footer';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div style={{ fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      <Header name="Dhruv" themeColor="#4A90E2" />
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem 1rem' }}>
        <button onClick={toggleTheme} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
      <NavBar />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem', minHeight: '60vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
