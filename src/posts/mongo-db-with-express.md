---
title: Running MongoDb with NodeJS & Express
date: '2015-07-01'
tags:
  - javascript
  - mongo-db
  - express
  - back-end
  - node
  - blog
---

In my years of development, I’ve spent a lot of time deep in the nitty-gritty of front-end development. Whether it was banging my head on browser quirks, pixel pushing, or deep in network performance waterfalls, I’ve never really had much chance to play around with the back-end. Because it so closely integrates with NodeJS, [MongoDB](https://www.mongodb.org/) seems like just the right depth of water to jump in to.

We are going to “generate” an express server with Express’ application generator. First we need to start in our root folder (or wherever you want your application to be).

Open up terminal.

We want to install express along with express-generator to our global npm packages (-g). This will insure that you have them available for future installs on your machine.

```bash
$ cd ~
$ npm install -g express express-generator
```

The generator builds a directory for you, so you just need to provide a folder name in the command line. The -e says that we want to install [EJS](https://www.npmjs.com/package/ejs) as a dependency for this project. It’s similar to Jade or Handlebars and makes it easy to template using pure Javascript.

```bash
$ express todo-app -e
$ cd todo-app
```

We are going to install our dependencies and create an empty folder which we will use later for our database files.

```bash
$ npm install mongodb monk --save
```

Just to make sure that everything is up and running. Start a quick server

```bash
$ npm start
```

Point your web-browser to http://localhost:3000

We are going to install Homebrew in order to download and setup MongoDb. Homebrew is a package manager of sorts for OSX. Once that is downloaded, you can grab MongoDb pretty easily.

```bash
$ ruby -e “$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew update
$ brew install mongodb
```

Set up your current path for MongoDb

```bash
$ mongod --dbpath ~/todo-app/data
([initandlisten] waiting for connections on port 27017)
```

Open a new terminal window. It will default to “test”. Switch it over to replicate your application folder name.

```bash
$ mongo
> use todo-app
```

You can start your first database entry directly in the mongo terminal.

```bash
> db.usercollection.insert({
 "username" : "user1",
 "todos" :  [
  "example 1",
  "example 2"
 ]
});
> db.usercollection.find().pretty()
```

Open your index.js file in the “routes” folder. You’ll need to require the correct dependencies to get you application to talk to the database. This goes at the top of your file.

```js
var express = require(‘express’),
  router = express.Router(),
  mongo = require(‘mongodb’),
  monk = require(‘monk’),
  db = monk(‘localhost:27017/todo-app’),
  collection = db.get(‘usercollection’);
```

Create a partials folder inside of “views” and create two new files.

```bash
$ cd views
$ mkdir partials
$ cd partials
$ touch todos.ejs inputTodo.ejs.
```

We are going to setup our index.ejs with a basic template.

```ejs
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
  <link rel=’stylesheet’ href=’/stylesheets/style.css’ />
</head>
<body>
  <main>
  <% include partials/inputTodo %>
<div class=”todos”>
  <% include partials/todos %>
  </div>
  </main>
</body>
</html>
```

For the sake of getting some basic visual styling down, we are going to add the bootstrap CSS via a CDN. This will give us some classes to hook on to for mocking this project up.

Add this to your `<head>` in `index.ejs` above your personal stylesheet.

```html
<link rel="stylesheet" href=”//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css” />
<link rel="stylesheet" href="/stylesheets/style.css" />
```

In your index.js file, we are going to setup the rendering structure so that our ejs files know what variables to look for. In this instance, we are looking at the root of our application ‘/’ and looking through our ‘usercollection’ collection and rendering everything under ‘userlist’.

```js
router.get('/', function(req, res) {
  collection.find({}, {}, function(e,docs) {
    res.render('index', {
      title: 'Todo List',
      userlist : docs
    });
  });
});
```

Inside of your todos.ejs file, we are going to template out a list structure to display the current todos.

```ejs
<! — views/partials/users.ejs ->
<% userlist.forEach(function(user) { %>
<ul class="list-group">
  <% user.todos.forEach(function(todo) { %>
    <li class="list-group-item">
      <%- todo %>
      <a href="#" rel="<%- todo %>" class="btn btn-default navbar-btn">Delete</a>
    </li>
 <% }); %>
</ul>
<% }); %>
```

This will loop through our userlist (right now it’s just ‘user1’, and create an unordered list for each todo that is in the user’s ‘todos’ array. After the text, we also are setting up a delete button which we will hook on to later so we can get rid of todo items individually.

Next we will setup a small form in order to add a new todo to our user’s list.

```ejs
<! — views/partials/inputUser.ejs →
<div class=”panel panel-default”>
  <form name=”addTodo” method=”post” action=”/user/user1/lists/”>
    <div class=”input-group”>
      <input type=”text” name=”todoitem” class=”form-control”>
      <div class=”input-group-btn”>
        <button id=”btnSubmitTodo” type=”submit” class=”btn btn-default”>Add an item</button>
      </div>
    </div>
  </form>
</div>
```

The action on this form is setup as a start to an eventual REST style API. The basic structure could look something like this:

```js
// List GET /user/:id/lists
// Get GET /user/:id/lists/todo
// Insert POST /user/:id/lists
// Update PUT /user/:id/lists/todo
// Delete DELETE /user/:id/lists/todo
// Patch PATCH /user/:id/lists/todo
```

For now, we are keeping it simple and hard-coding in our user’s username. Jump back in to your index.js file. We will setup the router so that it knows what to do with this action.

```js
router.post(‘/user/:id/lists/’, function(req, res) {
  var username = req.params.id.toString(),
      todo = req.body.todoitem;
if (todo) {
  collection.update({
    username: username
  },{
    $push: { todos: todo }
  }, function (err, doc) {
    if (err) {
      res.send(‘There was a problem adding the information to the database.’);
  }
    res.redirect(‘/’);
  });
  } else {
    res.redirect(‘/’);
    res.end();
  }
});
```

The username variable grabs the value provided in the url (‘:id’) and the todo variable is dependent on the form input with the name ‘todoitem’. It’s updating the user’s todos list with mongo’s $push function. Assuming everything works, it should add the todo and refresh the list.

```bash
$ cd ~/todo-app
$ npm start
```

Head back in to our index.js file. We are going to setup the route for deleting a todo.

```js
router.delete(‘/user/:id/lists/:todo’, function(req, res) {
  var username = req.params.id.toString(),
  todo = req.params.todo;
if (todo) {
  collection.update({
    username: username
  },{
    $pull: { todos: todo }
  }, function (err, doc) {
    if (err) {
      res.send(‘There was a problem adding the information to the database.’);
    }
    res.send({redirect: '/'});
  });
  } else {
    res.redirect(‘/’);
    res.end();
  }
});
```

This is much like the post, except we are using Mongo’s $pull function to remove the todo from the user’s list. The main difference is the redirect url is being sent via res.send.

We now need to create some javascript in order to hook up the API with the button itself via AJAX. I put this in in a file called todo.js.

```js
function deleteTodo(event) {
  event.preventDefault();
  var $self = $(this),
      todo = $self.attr(‘rel’),
      url = ‘/user/user1/lists/’ + todo
  $.ajax({
    datatype: ‘json’,
    method: ‘DELETE’,
    url: url
  }).done(function( data, textStatus, jqXHR ) {
    if (typeof data.redirect === ‘string’) {
      window.location = data.redirect;
    }
  });
}
$(‘.list-group-item’).on(‘click’, ‘a’, deleteTodo);
```

This should cover a basic add and remove on our todo list for now. In the next course we will build out the remainder (or the “rest”…) of the REST API.
