'use client';

import { useState } from 'react';

export default function ImageProcessingButton() {
  const [message, setMessage] = useState<string | null>(null);
  const [results, setResults] = useState<Array<{ imagePath: string, recognizedAs: string }> | null>(null);

  const handleRunScript = async () => {
    setMessage('Processing...');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
      });

      if (response.ok) {
        const responseData = await response.json();
        setMessage('Processing completed');
        setResults(responseData.results);
      } else {
        setMessage('Processing failed. Please check the console for errors.');
      }
    } catch (error) {
      console.error('Error during processing:', error);
      setMessage('An error occurred. Please check the console for details.');
    }
  };

  return (
    <div>
      <button
        onClick={handleRunScript}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        Run Image Processing Script
      </button>
      {message && <p>{message}</p>}
      {results && (
        <div>
          <h3>Results:</h3>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                <img src={`/downloads/${result.imagePath.split('/').pop()}`} alt={result.recognizedAs} style={{ width: '200px' }} />
                <p>Recognized as: {result.recognizedAs}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
