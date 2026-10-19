export default function Home() {
  const skills = ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Express', 'MongoDB'];

  return (
    <section id="home" style={{ padding: '2rem' }}>
      <h2>About Me</h2>
      <p>Hello! I am a passionate web developer learning React and modern frameworks.</p>
      
      <h3 style={{ marginTop: '2rem' }}>Skills</h3>
      <ul>
        {skills.map((s, idx) => (
          <li key={idx}>{s}</li>
        ))}
      </ul>
    </section>
  );
}
