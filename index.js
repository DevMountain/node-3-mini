const express = require("express");

const app = express();

const { SERVER_PORT } = process.env;

app.use(express.json());

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});
