export default function NavBar({ activeSection }) {
  const sections = ['About', 'Skills', 'Projects', 'Contact'];
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#eee', position: 'sticky', top: 0 }}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem', margin: 0, padding: 0 }}>
        {sections.map(section => (
          <li key={section}>
            <a 
              href={`#${section.toLowerCase()}`} 
              style={{ fontWeight: activeSection === section ? 'bold' : 'normal', color: '#333', textDecoration: 'none' }}
            >
              {section}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
