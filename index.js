const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const connectionString = "postgres://jameslemire@localhost/sandbox";
const controller = require('./controller');

const app = module.exports = express();
massive( connectionString ).then( dbInstance => {
  app.set('db', dbInstance);

  // dbInstance.new_planes()
  //   .then( planes => console.log( planes ) )
  //   .catch( err => console.log( err ) );

  dbInstance.get_planes()
    .then( planes => console.log( planes ) )
    .catch( err => console.log( err ) );
});

app.use( bodyParser.json() );
app.use( cors() );

app.get('/api/planes', controller.getPlanes);

const port = 3000;
app.listen('3000', () => { console.log(`Server listening on port ${port}`) } );