import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [facets, setFacets] = useState([]);
  const [fileName, setFileName] = useState('');
  const [content, setContent] = useState('');
  const [selected, setSelected] = useState(null);

  const sync = async () => {
    await fetch('/sync', { method: 'POST' });
  };

  const search = async () => {
    const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setSelected(null);
  };

  const loadFacets = async () => {
    const res = await fetch('/facets');
    const data = await res.json();
    setFacets(data);
  };

  const save = async () => {
    await fetch('/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_name: fileName, content })
    });
    setFileName('');
    setContent('');
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
        <button onClick={sync} className="bg-green-500 text-white p-2">Sync</button>
        <button onClick={loadFacets} className="bg-indigo-500 text-white p-2">Facets</button>
      </div>

      {selected ? (
        <div>
          <button
            onClick={() => setSelected(null)}
            className="bg-gray-300 p-2 mb-2"
          >
            Back
          </button>
          <h2 className="font-bold text-xl mb-2">{selected.file_name}</h2>
          <pre className="whitespace-pre-wrap border p-2">
            {selected.content}
          </pre>
        </div>
      ) : (
        <>
          <ul>
            {results.map((r, idx) => (
              <li key={idx} className="mb-2 border-b pb-2">
                <h2 className="font-bold">
                  {r.file_name}
                  <button
                    onClick={() => setSelected(r)}
                    className="ml-2 text-sm text-blue-600"
                  >
                    View
                  </button>
                </h2>
                <p>{r.content.slice(0, 100)}...</p>
              </li>
            ))}
          </ul>
          {facets.length > 0 && (
            <ul className="mt-4">
              {facets.map((f, idx) => (
                <li key={idx}>{f.folder}: {f.count}</li>
              ))}
            </ul>
          )}
        </>
      )}
      <div className="my-6">
        <h2 className="text-xl mb-2">Add Document</h2>
        <input
          type="text"
          placeholder="File name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
        />
        <button onClick={save} className="bg-purple-600 text-white p-2 mt-2">
          Save
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-4">
        Results are displayed as plain text. React escapes HTML output to help
        prevent XSS. Always upload trusted files to avoid malware or injection
        attacks.
      </p>
    </div>
  );
}

export default App;
