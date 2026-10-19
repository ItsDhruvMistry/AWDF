export default function Header({ name, themeColor }) {
  return (
    <header style={{ backgroundColor: themeColor || '#333', color: 'white', padding: '1rem' }}>
      <h1>{name}'s Portfolio</h1>
    </header>
  );
}
