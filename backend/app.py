from flask import Flask, request, jsonify

from indexer import index_directory
from elasticsearch import Elasticsearch

# Connect to Elasticsearch running on localhost
es = Elasticsearch('http://localhost:9200')

app = Flask(__name__)

@app.route('/search')
def search():
    """Search documents with fuzzy matching."""
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    es_query = {
        "query": {
            "match": {
                "content": {
                    "query": query,
                    "fuzziness": "AUTO"
                }
            }
        }
    }
    result = es.search(index="docs", body=es_query)
    hits = [
        {
            "file_name": hit['_source'].get('file_name'),
            "content": hit['_source'].get('content')
        }
        for hit in result['hits']['hits']
    ]
    return jsonify(hits)


@app.route('/sync', methods=['POST'])
def sync():
    """Reindex the temp directory into Elasticsearch."""
    index_directory('temp', 'docs')
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)
