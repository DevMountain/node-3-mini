<img src="https://devmounta.in/img/logowhiteblue.png" width="250" align="right">

# Project Summary

In this project, we will go over how to use massive with a node server to connect to a postgres database.

## Setup

* Run `npm install`.
* Review the `index.js` file to get familiar with it.

## Step 1

### Summary

In this step, we'll install massive into our project and require it in `index.js`.

### Instructions

* Run `npm install --save massive dotenv`
* Require `massive` underneath `cors`.
* Require and configure dotenv below massive. 

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
require('dotenv').config()

const app = express();
app.use( bodyParser.json() );
app.use( cors() );

const port = process.env.PORT || 3000
app.listen(port, () => { console.log(`Server listening on port ${port}`) } );
```

</details> 

## Step 2

### Summary

In this step, we'll connect SQLTabs to our Heroku databse. We'll then add a new table to our Heroku database called `airplanes`.

### Instructions

* Open SQLTabs.
* Connect to your Heroku database with SQLTabs by using the URI connection string.
* Create the following `airplanes` table:
  * <details>
    
    <summary> <code> CREATE TABLE airplanes </code> </summary>
    
    ```sql
    CREATE TABLE airplanes (
      PlaneID SERIAL PRIMARY KEY NOT NULL,
      PlaneType varchar(40) NOT NULL,
      PassengerCount integer NOT NULL
    );
    ```
    
    </details>

## Step 3

### Summary

In this step, we'll establish a connection to our database using massive in `index.js`.

### Instructions

* Open `index.js`.
* Create a file named `.env`
  * Make sure to add `.env` to your `.gitignore`
* Open your `.env` and add a variable named `CONNECTION_STRING` that equals the URI connection string from your Heroku database.
  * Make sure to add `?ssl=true` at end of your connection string.
  * There should be no quotes around the connection string.
* Invoke massive and pass in the connection string by accessing the variable `CONNECTION_STRING` from the `.env` file on the process object `process.env.CONNECTION_STRING`. This will return a promise. Chain a `.then` that has one parameter called `dbInstance` and then returns `app.set('db', dbInstance)`. This will give our express application access to our database.

### Solution

<details>

<summary><code> .env </code></summary>

`CONNECTION_STRING=postgres://username:password@host/dbname?ssl=true`

</details>

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
require('dotenv').config()

const app = express();
massive( process.env.CONNECTION_STRING ).then( dbInstance => app.set('db', dbInstance) );

app.use( bodyParser.json() );
app.use( cors() );

const port = process.env.PORT || 3000
app.listen(port, () => { console.log(`Server listening on port ${port}`) } );
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
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
require('dotenv').config()

const app = express();
massive( process.env.CONNECTION_STRING ).then( dbInstance => {
  app.set('db', dbInstance);

  // dbInstance.new_planes()
  //   .then( planes => console.log( planes ) )
  //   .catch( err => console.log( err ) );
});

app.use( bodyParser.json() );
app.use( cors() );

const port = process.env.PORT || 3000
app.listen(port, () => { console.log(`Server listening on port ${port}`) } );
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
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
require('dotenv').config()

const app = express();
massive( process.env.CONNECTION_STRING ).then( dbInstance => {
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

const port = process.env.PORT || 3000
app.listen(port, () => { console.log(`Server listening on port ${port}`) } );
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
* Create a `GET` endpoint on `/api/planes/` that calls `controller.getPlanes`.
* In your index.js file, comment out dbInstance.get_planes as this is now setup in the controller.

### Solution

<details>

<summary> <code> controller.js </code> </summary>

```js
module.exports = {
  getPlanes: ( req, res, next ) => {
    const dbInstance = req.app.get('db');

    dbInstance.get_planes()
      .then(planes => { res.status(200).send(planes); })
      .catch( err => { 
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
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
require('dotenv').config()
const controller = require('./controller');

const app = express();
massive( process.env.CONNECTION_STRING ).then( dbInstance => {
  app.set('db', dbInstance);

  // dbInstance.new_planes()
  //   .then( planes => console.log( planes ) )
  //   .catch( err => console.log( err ) );

  //dbInstance.get_planes()
  //  .then( planes => console.log( planes ) )
  //  .catch( err => console.log( err ) );
});

app.use( bodyParser.json() );
app.use( cors() );

app.get('/api/planes', controller.getPlanes);

const port = process.env.PORT || 3000
app.listen(port, () => { console.log(`Server listening on port ${port}`) } );
```

</details>

## Step 7

### Summary

In this step, we'll modify the `get_planes` SQL file to use a parameter.

### Instructions

* Open `get_planes.sql`.
* At the end of the first line, add `WHERE PassengerCount > $1;`
* Open `controller.js`.
* Pass in an array as the first parameter for `dbInstance.get_planes`.
  * Use number `25` as the first element of the array.

### Solution

<details>

<summary> <code> get_planes.sql </code> </summary>

```sql
SELECT * FROM airplanes WHERE PassengerCount > $1;
```

</details>

<details>

<summary> <code> controller.js </code> </summary>

```js
module.exports = {
  getPlanes: ( req, res, next ) => {
    const dbInstance = req.app.get('db');

    dbInstance.get_planes([25])
      .then(planes => { res.status(200).send(planes); })
      .catch( err => { 
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
<img src="https://devmounta.in/img/logowhiteblue.png" width="250">
</p>
