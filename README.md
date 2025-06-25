# ISMS Document Search

This project demonstrates a simple setup for searching ISMS documents stored in a `temp` directory using Elasticsearch. The search index uses a Chinese text analyzer so that queries work well with Chinese content. The front-end is written in React with Tailwind CSS, while the back-end uses Python and Flask.

Elasticsearch provides powerful full-text search with fuzzy matching, relevance ranking, faceted aggregations, and near real-time indexing. These capabilities are showcased in this example.

## Backend

1. Install Python 3 dependencies:
   ```bash
 pip install -r backend/requirements.txt
  ```
  The requirements include `python-docx` so `.docx` files can be parsed during indexing.
   Make sure the `python3` command is available on your system.
2. Ensure Elasticsearch is running locally at `http://localhost:9200`.
3. The indexer creates the `docs` index with the built-in Chinese analyzer `smartcn` (or another analyzer if supplied with `--analyzer`).
   The `temp` folder may contain regular text files or `.docx` documents.
   The indexer extracts text from both and loads them into Elasticsearch:
   ```bash
   python3 backend/indexer.py --dir temp --index docs
   ```
4. Start the Flask server:
   ```bash
   python3 backend/app.py
   ```

Use the `/sync` endpoint to reindex the `temp` directory whenever its
contents change. For example:
```bash
curl -X POST http://localhost:5000/sync
```

The `/search` endpoint accepts a query parameter `q` and returns fuzzy matched
documents along with their file names. Use `/add` to index a new document
immediately by posting JSON with `file_name` and `content` fields.

The `/facets` endpoint performs a simple faceted search by returning the number
of documents in each folder. This demonstrates Elasticsearch's aggregation
features for faceted navigation.

## Frontend

This example React component uses Tailwind for styling and fetches results from the `/search` endpoint.

1. Install Node dependencies (requires Node.js and npm):
   ```bash
   cd frontend
   npm install  # installs React, Tailwind and CKEditor packages
   ```
2. Run the development server:
   ```bash
   npm start
   ```

The page displays a search box and shows matched document titles and excerpts.
Each result has a **View** button that opens a simple viewer to read the full
document content. The interface also has a **Sync** button that triggers a
reindex of the `temp` directory by calling the `/sync` endpoint.

The React app also exposes a basic WYSIWYG editor powered by CKEditor. Use it to
enter a file name and rich-text content, then press **Save** to POST the
document to the `/add` endpoint so that it is immediately indexed.

## Security Considerations

The application indexes arbitrary files from the `temp` directory. Ensure that
only trusted documents are placed in this directory to avoid indexing
malicious content. React escapes HTML by default when displaying file content,
which helps mitigate cross-site scripting (XSS) attacks, but additional
sanitization may be required if you change the rendering logic.

Queries sent to the backend are passed directly to Elasticsearch. While this
demo does not use SQL, always validate user input and avoid executing
untrusted commands to guard against injection attacks.

