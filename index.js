const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const connectionString = "postgres://jameslemire@localhost/sandbox";

const app = module.exports = express();
massive( connectionString ).then( dbInstance => {
  app.set('db', dbInstance);

  // dbInstance.new_planes();
  dbInstance.get_planes( (err, planes) => { consol.log(err, planes); } );
});

app.use( bodyParser.json() );
app.use( cors() );

const port = 3000;
app.listen('3000', () => { console.log(`Server listening on port ${port}`) } );