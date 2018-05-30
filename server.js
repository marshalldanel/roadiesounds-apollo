const express = require('express');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const bodyParser = require('body-parser');
const app = express();

const schema = require('./schema.js');

app.use('/graphql', bodyParser.json(), graphqlExpress({ 
  schema,
  tracing: true,
  cacheControl: true,
}));

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(4000);
console.log('Listening on 0.0.0.0:4000/graphiql :)');
