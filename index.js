var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
var controller = require('./controller')
var connectionString = 'postgres://brobbiethao@localhost/sandbox';


var app = module.exports = express();
app.use(bodyParser.json());
app.use(cors());


massive(connectionString)
.then(function(dbInstance) {
  app.set('db', dbInstance)

  // dbInstance.new_plane()
  // .then(function(err, planes) {
  //   console.log(err, 'planes added');
  // })
  dbInstance.get_planes()
  .then(function(err, planes) {
      console.log(err, planes)
  })
})

app.get('/api/get_planes', controller.getPlanes);

app.get('/api/get_planes', function(req, res){
  var dbInstance = req.app.get('db');

  dbInstance.get_planes()
  .then(stuff => {
    res.status(200).json(planes);
  })
})


app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
})
