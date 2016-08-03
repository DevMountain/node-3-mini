# mini-sql-node-massive

## Setup

Run `npm install` to install the pre-requisites

Look over the index.js file to get familiar with your starting point.

## Get your database started

Make sure postgres is running on your computer.

## Install MassiveJS

Run `npm install --save massive`

Require massive at the top of your index file.

`var massive = require('massive');`

## Setup our table

Make a new database in postgres called sandbox

Add a new table to that database ( [pgAdmin tutorial on how to do both of these](https://www.youtube.com/watch?v=1wvDVBjNDys) ) :

```
CREATE TABLE airplanes (
  planeid SERIAL PRIMARY KEY NOT NULL, -- The primary key
  planetype varchar(40) NOT NULL, -- The IP of the host
  passengercount integer NOT NULL -- The name of the host
);
```


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
var massiveInstance = massive.connectSync({connectionString : connectionString})

app.set('db', massiveInstance);
```

Next we can get our db back out of the app

__db__
```
var db = app.get('db');
```


## Add a new plane to the database

Now that we have our db we can use it to add a new plane:

```
db.new_plane(function(err, planes){
    console.log(err, "plane added")
});
```

This works by looking in the `/db` folder in our app fore a file called `new_plane.sql`

We've added a plane, comment those 3 lines of code out so we don't add duplicates.


## Get all planes

Do the same thing to get all planes using the get_planes file

```
db.get_planes(function(err, planes){
    console.log(err, planes)
})
```

## Queries in different files

To use our db in different files we need to do 2 things:

* export the app made by express
* import it and use it in our other file
* call our controller

__export our app__
```
//Replace
var app = express();

//With
var app = module.exports = express();
```

This makes it so index.js exports our app.


__ import it and use it in another file__

Create a controller.js and put this code inside.

```
var app = require('./index');

module.exports = {
    getPlanes: function(){
        var db = app.get('db');

        db.get_planes(function(err, planes){
            console.log(err, planes);
        })
    }
}
```

__call our controller__

Comment out call calls to db in your index.js and replace them with a call to the controller and the get planes function.

```
var controller = require('./controller.js');

controller.getPlanes();
```

## Parameterize our Query

In get_planes.sql uncomment out `where passengercount > $1` by removing the two `--` in front of it.

The $1 acts as a place holder for the 'first' parameter passed in.

To pass that in change the query in controller.js to take parameters before the function.

```
db.get_planes([25], function(err, planes){
    console.log(err, planes);
})
```        

We are now getting all planes with a passenger count greater than 25.


## Copyright

© DevMountain LLC, 2016. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.
