# elastic-tools

CLI Utilities to export/import JSON from elasticsearch

## Usage

### Exporting data to json

```bash
elastic-export --host 127.0.0.1:9200 --index MyIndex --out ./data.json
```

The \_id of the document from elastic's index will be part of the body of the exported document: 

For example, this document from elastic:

```json
{
  "_index": "users",
  "_type": "_doc",
  "_id": "1",
  "_score": 1,
  "_source": {
    "active": true,
    "name": "User 1",
    "email": "email1"
  }
}
```
will be exported to JSON like this:

```json
{
  "_id": "1",
  "active": true,
  "name": "User 1",
  "email": "email1"
}
```


### Importing data from json array

```bash
elastic-import --host 127.0.0.1:9200 --index MyIndex --data ./data.json
```
