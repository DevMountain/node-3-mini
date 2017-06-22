<img src="https://devmounta.in/img/logowhiteblue.png" width="250" align="right">

# Project Summary

In this project, we will go over how to use massive with a node server to connect to a postgres database.

## Setup

* Run `npm install`.
* Review the `index.js` file to get familiar with it.
* Make sure postgres is running on your computer.

## Step 1

### Summary

In this step, we'll install massive into our project and require it in `index.js`.

### Instructions

* Run `npm install --save massive@3.0.0-rc1`
* Require `massive` underneath `cors`.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');

const app = module.exports = express();
app.use( bodyParser.json() );
app.use( cors() );

const port = 3000;
app.listen('3000', () => { console.log(`Server listening on port ${port}`) } );
```

</details> 

## Step 2

### Summary

In this step, we'll create a new database in postgres called `sandbox`. We'll then add a new table to the database called `airplanes`.

### Instructions

* Open a terminal and run `psql`.
* Create a database named `sandbox`.
* Connect to the newly created `sanbox` database.
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

## Solution

<b> insert 1.png here </b>

## Step 3

### Summary

In this step, we'll establish a connection to our database using massive in `index.js`.

### Instructions

* Create a variable called `connectionString` that equals `"postgres://username:password@localhost/sandbox"`.
  * Replace `username` with your username.
  * Replace `password` with your password.
* Invoke massive and pass in the connection string. This will return a promise. Chain a `.then` that has one parameter called `dbInstance` and then returns `app.set('db', dbInstance)`. This will give our express application access to our database.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const connectionString = "postgres://jameslemire@localhost/sandbox";

const app = module.exports = express();
massive( connectionString ).then( dbInstance => app.set('db', dbInstance) );

app.use( bodyParser.json() );
app.use( cors() );

const port = 3000;
app.listen('3000', () => { console.log(`Server listening on port ${port}`) } );
```

</details>

## Step 4

### Summary

In this step, we will add some seed data to our database using the the files already created in the `db` folder.

### Instructions

* Modify the massive `.then` to set `db` on app and also call `dbInstance.new_planes` with the first parameter being a callback function.
  * The first parameter of the call back function will always be the error.
* Restart/Run the API so the planes get added to the table.
* Comment out `dbInstance.new_planes();` so we don't get duplicate planes.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const connectionString = "postgres://jameslemire@localhost/sandbox";

const app = module.exports = express();
massive( connectionString ).then( dbInstance => {
  app.set('db', dbInstance);

  // dbInstance.new_planes();
});

app.use( bodyParser.json() );
app.use( cors() );

const port = 3000;
app.listen('3000', () => { console.log(`Server listening on port ${port}`) } );
```

</details>

## Step 5

* Underneath the comment of `new_planes`, call `dbInstance.get_planes`.
* This time we'll provide a callback function to see the results of the query.
* The callback function should be the first argument and the callback function should have two of its own parameters.
  * The first parameter should be called `err`.
  * The second parameter should be called `planes`.

### Solution

<details>

<summary> <code> index.js </code> </summary>

```js
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
```

</details>

## Queries in different files

We can use our db anywhere req is made available to us. We can use it in a controller like so:

__index.js__


```
var massive = require('massive');
var controller = require('./controller')
var connectionString = 'postgres://Brett@localhost/sandbox'

var app = express()
massive(connectionString).then(dbInstance => {
    app.set('db', dbInstance)
})

app.get('/api/planes', controller.getPlanes);

```

__controller.js__
```
exports.getPlanes = function(req, res) {
  var dbInstance = req.app.get('db')

  dbInstance.get_planes().then(planes => {
      res.status(200).json(planes)
  })
})
```


## Parameterize our Query

In get_planes.sql add `where passengercount > $1`.

The $1 acts as a place holder for the 'first' parameter passed in.

To pass that in change the query in controller.js to take parameters before the function.

```
exports.getPlanes = function(req, res) {
  var dbInstance = req.app.get('db')

  dbInstance.get_planes([25]).then(planes => {
      res.status(200).json(planes)
  })
}
```        

We are now getting all planes with a passenger count greater than 25.

## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2017. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

<p align="center">
<img src="https://devmounta.in/img/logowhiteblue.png" width="250">
</p>

