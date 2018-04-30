# elastic-tools
CLI Utilities to export/import JSON from elasticsearch


## Usage
### Exporting data to json
```bash
elastic-export --host 127.0.0.1:9200 --index MyIndex --out ./data.json
```

### Importing data from json array
```bash
elastic-import --host 127.0.0.1:9200 --index MyIndex --data ./data.json
```