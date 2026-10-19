import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRepos = () => {
    setLoading(true);
    setError(null);
    fetch('https://api.github.com/users/defunkt/repos')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => setRepos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="projects" style={{ padding: '2rem' }}>
      <h2>Projects</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <input 
          type="text" 
          placeholder="Search repositories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', width: '100%', maxWidth: '300px' }}
        />
      </div>

      {loading && <Spinner />}
      
      {error && (
        <div>
          <ErrorMessage message={error} />
          <button onClick={fetchRepos} style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {filteredRepos.map((repo) => (
            <li key={repo.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </h3>
              <p style={{ margin: 0 }}>⭐ Stars: {repo.stargazers_count}</p>
            </li>
          ))}
          {filteredRepos.length === 0 && <p>No repositories found.</p>}
        </ul>
      )}
    </section>
  );
}
