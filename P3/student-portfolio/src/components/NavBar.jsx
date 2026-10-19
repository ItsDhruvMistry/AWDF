import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();
  const routes = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' }
  ];
  
  return (
    <nav className="nav-bar" style={{ padding: '1rem', position: 'sticky', top: 0 }}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem', margin: 0, padding: 0, justifyContent: 'center' }}>
        {routes.map(route => (
          <li key={route.path}>
            <Link 
              to={route.path} 
              style={{ 
                fontWeight: location.pathname === route.path ? 'bold' : 'normal', 
                textDecoration: 'none' 
              }}
              className="nav-link"
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
