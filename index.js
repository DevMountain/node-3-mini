const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = module.exports = express();
app.use( bodyParser.json() );
app.use( cors() );

const port = 3000;
app.listen( port , () => { console.log(`Server listening on port ${port}`); } );

