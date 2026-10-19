export default function Projects() {
  const projects = [
    { title: 'Portfolio Website', description: 'A personal portfolio built with React and Vite.' },
    { title: 'Task Manager API', description: 'A RESTful API built using Node.js and Express.' },
    { title: 'Database System', description: 'A NoSQL database implementation using MongoDB.' },
  ];

  return (
    <section id="projects" style={{ padding: '2rem' }}>
      <h2>Projects</h2>
      <ul>
        {projects.map((p, index) => (
          <li key={index}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
