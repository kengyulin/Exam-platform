from flask import Flask, request, jsonify
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

if __name__ == '__main__':
    app.run(debug=True)
