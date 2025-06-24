# ISMS Document Search

This project demonstrates a simple setup for searching ISMS documents stored in a `temp` directory using Elasticsearch. The front-end is written in React with Tailwind CSS, while the back-end uses Python and Flask.

## Backend

1. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Ensure Elasticsearch is running locally at `http://localhost:9200`.
3. Index the contents of the `temp` folder (and all subdirectories) into the `docs` index:
   ```bash
   python backend/indexer.py --dir temp --index docs
   ```
4. Start the Flask server:
   ```bash
   python backend/app.py
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

