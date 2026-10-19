import { useState } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';

function App() {
  const skills = ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Express', 'MongoDB'];
  const [activeSection, setActiveSection] = useState('About');

  return (
    <div style={{ fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      <Header name="Dhruv" themeColor="#4A90E2" />
      <NavBar activeSection={activeSection} />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        <About />
        <Skills skillList={skills} />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}

export default App;
