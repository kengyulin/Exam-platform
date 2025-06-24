import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = async () => {
    const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">ISMS Document Search</h1>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 flex-grow"
        />
        <button onClick={search} className="bg-blue-500 text-white p-2">Search</button>
      </div>
      <ul>
        {results.map((r, idx) => (
          <li key={idx} className="mb-2">
            <h2 className="font-bold">{r.file_name}</h2>
            <p>{r.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
