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

## Connect with Massive to our database

We need to get a copy of massive ot use.  We need : `connectionString > connection > db`

Add a connection string under your call to require massive.  Change the part that says jeremyrobertson to have your user name.  (If you included password it will look like `username:password@localhost/sandbox`

__connectionString__
```
var massive = require('massive');
var connectionString = "postgres://jeremyrobertson@localhost/sandbox";
```

Use our connection string to get a copy/instance of massive to use.  Then add it to our app as a variable called db.

__connection__
```
var app = express();
massive(connectionString).then(dbInstance => app.set('db', dbInstance))
```

Express will help you retrieve the dbInstance in each of your routes, like so:

```
app.get('/api/stuff', function(req, res) {
    var dbInstance = req.app.get('db');

    dbInstance.get_stuff().then(stuff => {
        res.status(200).json(stuff);
    })
})
```

## Add a new plane to the database

We can add some seed data to our database in the promise callback after massive:

```
var app = express()
massive(connectionString).then(function(dbInstance) {
    app.set('db', dbInstance);

    dbInstance.new_plane(function(err, planes) {
        console.log(err, "planes added");
    })
})
```

This works by looking in the `/db` folder in our app for a file called `new_plane.sql`

We've added some planes, so comment out those 3 lines of code so we don't add duplicates.


## Get all planes

Do the same thing to get all planes using the get_planes file

```
db.get_planes(function(err, planes){
    console.log(err, planes)
})
```

Remember this has to be done in the callback from the massive connection

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

