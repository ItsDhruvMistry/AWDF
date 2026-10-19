export default function Skills({ skillList }) {
  return (
    <section id="skills" style={{ padding: '2rem', backgroundColor: '#f9f9f9' }}>
      <h2>Skills</h2>
      <ul>
        {skillList.map((s) => <li key={s}>{s}</li>)}
      </ul>
    </section>
  );
}
