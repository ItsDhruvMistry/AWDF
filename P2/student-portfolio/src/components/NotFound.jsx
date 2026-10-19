import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go back to Home</Link>
    </section>
  );
}
