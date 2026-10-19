import { useState } from 'react';

export default function Contact() {
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  return (
    <section id="contact" style={{ padding: '2rem' }}>
      <h2>Contact</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setShowHelp(!showHelp)}>
          {showHelp ? 'Hide Help' : 'Show Help'}
        </button>
        {showHelp && (
          <p style={{ fontStyle: 'italic', color: '#555', marginTop: '0.5rem' }}>
            Please write your message in the text area below. We will get back to you soon.
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="message">Your Message:</label>
        <textarea 
          id="message"
          rows="5"
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          style={{ width: '100%', maxWidth: '400px', padding: '0.5rem' }}
        />
        <p>Character count: {message.length}</p>
      </div>
    </section>
  );
}
