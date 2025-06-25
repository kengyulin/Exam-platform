# ISMS Document Search

This project demonstrates a simple setup for searching ISMS documents stored in a `temp` directory using Elasticsearch. The search index uses a Chinese text analyzer so that queries work well with Chinese content. The front-end is written in React with Tailwind CSS, while the back-end uses Python and Flask.

## Backend

1. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Ensure Elasticsearch is running locally at `http://localhost:9200`.
3. The indexer creates the `docs` index with the built-in Chinese analyzer `smartcn` (or another analyzer if supplied with `--analyzer`).
   Index the contents of the `temp` folder (and all subdirectories) into this index:
   ```bash
   python backend/indexer.py --dir temp --index docs
   ```
4. Start the Flask server:
   ```bash
   python backend/app.py
   ```

Use the `/sync` endpoint to reindex the `temp` directory whenever its
contents change. For example:
```bash
curl -X POST http://localhost:5000/sync
```

The `/search` endpoint accepts a query parameter `q` and returns fuzzy matched documents along with their file names.

## Frontend

This example React component uses Tailwind for styling and fetches results from the `/search` endpoint.

1. Install Node dependencies (requires Node.js and npm):
   ```bash
   cd frontend
   npm install
   ```
2. Run the development server:
   ```bash
   npm start
   ```

The page displays a search box and shows matched document titles and excerpts.
It also has a **Sync** button that triggers a reindex of the `temp` directory
by calling the `/sync` endpoint.

## Security Considerations

The application indexes arbitrary files from the `temp` directory. Ensure that
only trusted documents are placed in this directory to avoid indexing
malicious content. React escapes HTML by default when displaying file content,
which helps mitigate cross-site scripting (XSS) attacks, but additional
sanitization may be required if you change the rendering logic.

Queries sent to the backend are passed directly to Elasticsearch. While this
demo does not use SQL, always validate user input and avoid executing
untrusted commands to guard against injection attacks.

