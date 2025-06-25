import os
from elasticsearch import Elasticsearch


def _ensure_index(es, index_name, analyzer):
    """Create the index with a Chinese analyzer if it doesn't exist."""
    if es.indices.exists(index=index_name):
        return
    es.indices.create(
        index=index_name,
        body={
            "mappings": {
                "properties": {
                    "file_name": {"type": "keyword"},
                    "content": {"type": "text", "analyzer": analyzer},
                }
            }
        },
    )


def index_directory(
    root_dir='temp',
    index_name='docs',
    es_host='http://localhost:9200',
    analyzer='smartcn',
):
    """Recursively index files under root_dir into Elasticsearch."""
    es = Elasticsearch(es_host)
    _ensure_index(es, index_name, analyzer)
    for dirpath, _, filenames in os.walk(root_dir):
        for fname in filenames:
            file_path = os.path.join(dirpath, fname)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception as e:
                print(f"Skipping {file_path}: {e}")
                continue
            doc = {
                'file_name': os.path.relpath(file_path, root_dir),
                'content': content
            }
            es.index(index=index_name, body=doc)
            print(f"Indexed {file_path}")


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Index documents from a directory')
    parser.add_argument('--dir', default='temp', help='Root directory of documents')
    parser.add_argument('--index', default='docs', help='Elasticsearch index name')
    parser.add_argument('--host', default='http://localhost:9200', help='Elasticsearch host URL')
    parser.add_argument('--analyzer', default='smartcn', help='Analyzer to use for text fields')
    args = parser.parse_args()

    index_directory(args.dir, args.index, args.host, args.analyzer)
