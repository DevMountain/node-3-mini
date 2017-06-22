const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');

const app = module.exports = express();
app.use( bodyParser.json() );
app.use( cors() );

const port = 3000;
app.listen('3000', () => { console.log(`Server listening on port ${port}`) } );