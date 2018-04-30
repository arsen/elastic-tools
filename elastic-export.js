#!/usr/bin/env node

const fs = require('fs');
const args = require('commander');
const elasticsearch = require('elasticsearch');

let defaultFilename = './elastic-export-index.json';

const getFileName = (indexName, out) => {
  if (out === defaultFilename){
    return './elastic-export-'+indexName+'.json';
  }
  return out;
};

args
  .option('-H, --host <host>', 'Elastic search hostname', '127.0.0.1:9200')
  .option('-I, --index <index>', 'Index name to export')
  .option(
    '-O, --out <file>',
    'Output filename to save the result',
    defaultFilename
  )
  .option('-L, --limit <limit>', 'Limit number of documents', parseInt, 50)
  .parse(process.argv);

if (!args.host) {
  console.error('Host is required, -H <elastic hostname:port>');
  process.exit();
}
if (!args.index) {
  console.error('Index name is required, -I <index name>');
  process.exit();
}

const client = new elasticsearch.Client({
  host: args.host
});

let result = client.search({
  index: args.index,
  body: {
    from: 0,
    size: args.limit
  }
});

result
  .then(resp => {
    let data = resp.hits.hits.map(item =>
      Object.assign({}, { _id: item._id }, item._source)
    );
    let fileName = getFileName(args.index, args.out);
    console.log(`Exported ${data.length} documents (${fileName})`);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 4));
    // console.log(data);
  })
  .catch(err => {
    console.error(err);
  });
