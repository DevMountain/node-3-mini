<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250" align="right">

# Project Summary

In this project, we will go over how to use massive with a node server to connect to a postgres database.

## Setup

* Run `npm install`.
* Review the `index.js` file to get familiar with it.

## Step 1

### Summary

In this step, we'll install massive into our project and require it in `index.js`.

### Instructions

* Run `npm install massive dotenv`
* Require and configure `dotenv` at the top of the file.
* Require `massive` underneath `express`.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const massive = require("massive");

const app = express();

const { SERVER_PORT } = process.env;

app.use(express.json());

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});

```

</details>

## Step 2

### Summary

In this step, we'll connect SQLTabs to our Heroku database. We'll then add a new table to our Heroku database called `airplanes`.

### Instructions

* Open SQLTabs.
* Connect to your Heroku database with SQLTabs by using the URI connection string.
* Create the following `airplanes` table:
  * <details>

    <summary> <code> CREATE TABLE airplanes </code> </summary>

    ```sql
    CREATE TABLE airplanes (
      plane_id SERIAL NOT NULL,
      plane_type varchar(40) NOT NULL,
      passenger_count integer NOT NULL
    );
    ```

    </details>

## Step 3

### Summary

In this step, we'll establish a connection to our database using massive in `index.js`.

### Instructions

* Create a file named `.env`
  * Make sure to add `.env` to your `.gitignore`
* Open your `.env` and add a variable named `SERVER_PORT` and set it to 3000.
* Add a variable named `CONNECTION_STRING` that equals the URI connection string from your Heroku database.
  * There should be no quotes around the connection string.
* Open `index.js`.
* Destructure `CONNECTION_STRING` off of `process.env`.
* Invoke massive and pass in a configuration object containing our connection string which we can access through the `CONNECTION_STRING` variable.  This configuration object should also contain a nested object called ssl with one property, `rejectUnauthorized` set to false.  By passing in this configuration object, massive will return a promise. Chain a `.then` that has one parameter called `dbInstance` and then returns `app.set('db', dbInstance)`. This will give our express application access to our database.

### Solution

<details>

<summary><code> .env </code></summary>

```
SERVER_PORT=3000
CONNECTION_STRING=postgres://username:password@host/dbname
```

</details>

<details>

<summary> <code> index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const massive = require("massive");

const app = express();

const { SERVER_PORT, CONNECTION_STRING } = process.env;

massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
}).then(dbInstance => app.set("db", dbInstance));

app.use(express.json());

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});

```
</details>

## Step 4

### Summary

In this step, we will add some seed data to our database using the the files already created in the `db` folder.

### Instructions

* Open `index.js`.
* Modify the massive `.then` to set `db` on app and also call `dbInstance.new_planes`.
  * Chain a `.then` that has a parameter called `planes`. Return a `console.log` of `planes`.
  * Chain a `.catch` that has a parameter called `err`. Return a `console.log` of `err`.
* Restart/Run the API so the planes get added to the table.
* Comment out `dbInstance.new_planes` so we don't get duplicate planes.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const massive = require("massive");

const app = express();

const { SERVER_PORT, CONNECTION_STRING } = process.env;

massive(CONNECTION_STRING).then(dbInstance =>{
  app.set('db', dbInstance);

  // dbInstance.new_planes()
  //   .then( planes => console.log( planes ) )
  //   .catch( err => console.log( err ) );
});

app.use(express.json());

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});

```

</details>

## Step 5

* Open `index.js`.
* Underneath the comment of `new_planes`, call `dbInstance.get_planes`.
  * Chain a `.then` that has a parameter called `planes`. Return a `console.log` of `planes`.
  * Chain a `.catch` that has a parameter called `err`. Return a `console.log` of `err`.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
require("dotenv").config();
const express = require("express");
const massive = require("massive");

const app = express();

const { SERVER_PORT, CONNECTION_STRING } = process.env;

massive(CONNECTION_STRING).then(dbInstance => {
  app.set("db", dbInstance);

  // dbInstance.new_planes()
  //   .then( planes => console.log( planes ) )
  //   .catch( err => console.log( err ) );

  dbInstance.get_planes()
    .then(planes => console.log(planes))
    .catch(err => console.log(err));
});

app.use(express.json());

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});

```

</details>

## Step 6

### Summary

In this step, we will use our `dbInstance` in a controller file instead of in `index.js`.

### Instructions

* Open `controller.js`.
* Use `module.exports` to export an object.
* Add a `getPlanes` property to the object that equals a function with a `req`, `res`, and `next` parameter.
* Get the `dbInstance` by using `req.app.get('db')`.
* Using the `dbInstace` call `get_planes`.
  * Chain a `.then` with a parameter called `planes`. Then use `res` to send back `planes` and a status of 200.
  * Chain a `.catch` with a parameter called `err`. Console log the `err` and use `res` to send a status 500.
* Open `index.js`.
* Require `controller.js`.
* Create a `GET` endpoint on `/api/planes` that calls `controller.getPlanes`.
* In your index.js file, comment out dbInstance.get_planes as this is now setup in the controller.

### Solution

<details>

<summary> <code> controller.js </code> </summary>

```js
module.exports = {
  getPlanes: (req, res, next) => {
    const dbInstance = req.app.get("db");

    dbInstance.get_planes()
      .then(planes => {
        res.status(200).send(planes);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  }
};

```

</details>

<details>

<summary> <code> index.js </code> </summary>

```js
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

  // dbInstance.get_planes()
  //   .then(planes => console.log(planes))
  //   .catch(err => console.log(err));
});

app.use(express.json());

app.get("/api/planes", controller.getPlanes);

app.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});
```

</details>

## Step 7

### Summary

In this step, we'll modify the `get_planes` SQL file to use a parameter.

### Instructions

* Open `get_planes.sql`.
* At the end of the first line, add `WHERE passenger_count > $1;`
* Open `controller.js`.
* Pass in an array as the first parameter for `dbInstance.get_planes`.
  * Use number `25` as the first element of the array.

### Solution

<details>

<summary> <code> get_planes.sql </code> </summary>

```sql
SELECT * FROM airplanes WHERE passenger_count > $1;
```

</details>

<details>

<summary> <code> controller.js </code> </summary>

```js
module.exports = {
  getPlanes: (req, res, next) => {
    const dbInstance = req.app.get("db");

    dbInstance.get_planes([25])
      .then(planes => {
        res.status(200).send(planes);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  }
};

```

</details>

## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2017. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

<p align="center">
<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250">
</p>
