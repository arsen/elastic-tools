#!/usr/bin/env node

const fs = require('fs');
const args = require('commander');
const elasticsearch = require('elasticsearch');

args
  .option('-H, --host <host>', 'Elastic search hostname', '127.0.0.1:9200')
  .option('-I, --index <index>', 'Index name to export')
  .option('-D, --data <file>', 'Data file to import')
  .option('-T, --type [type]', 'Index type name to import', '_doc')
  .parse(process.argv);

if (!args.host) {
  console.error('Host is required, -H <elastic hostname:port>');
  process.exit();
}
if (!args.index) {
  console.error('Index name is required, -I <index name>');
  process.exit();
}
if (!args.data) {
  console.error('Data file is required, -D <file name>');
  process.exit();
}

const client = new elasticsearch.Client({
  host: args.host
});

let data;

try {
  let source = fs.readFileSync(args.data);
  data = JSON.parse(source);
} catch (err) {
  console.error(err);
}

let elasticActions = [];
for (let i = 0; i < data.length; i++) {
  let { _id, ..._source } = data[i];
  elasticActions.push({
    index: {
      _index: args.index,
      _type: args.type,
      _id
    }
  });
  elasticActions.push(_source);
}

client
  .bulk({ body: elasticActions })
  .then(resp => {
    console.log(`Done. Imported ${data.length} documents`);
  })
  .catch(err => {
    console.error(err);
  });
