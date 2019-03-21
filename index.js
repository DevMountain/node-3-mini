require("dotenv").config();
const express = require("express");
const massive = require("massive");
const controller = require("./controller");

const app = express();

const { SERVER_PORT, CONNECTION_STRING } = process.env;

massive(CONNECTION_STRING).then(dbInstance => {
  app.set("db", dbInstance);

  // dbInstance.new_planes()
  //   .then( planes => console.log( planes ) )
  //   .catch( err => console.log( err ) );

  // dbInstance
  //   .get_planes()
  //   .then(planes => console.log(planes))
  //   .catch(err => console.log(err));
});

app.use(express.json());

app.get("/api/planes", controller.getPlanes);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});
