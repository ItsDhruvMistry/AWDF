import React from 'react';

export default function ErrorMessage({ message }) {
  return (
    <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>
      <p>Error: {message}</p>
    </div>
  );
}
