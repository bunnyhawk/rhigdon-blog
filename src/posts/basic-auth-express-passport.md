---
title: Basic User Authentication in Express with Passport JS
date: '2015-07-11'
tags:
  - javascript
  - back-end
  - npm
  - node
  - blog
---

I have never had trouble scaffolding basic applications with various frameworks. The one piece that always seemed to throw me off was user authentication.

I’m not certain if it’s because I came from a design background and not a computer science one, but there is a lot of jargon and implied knowledge is most articles I’ve read on the subject. I’m going to do my best to help you (us) get a basic login form with a secure password up and running. As always, there is a lot to learn beyond the basics, but we’ve got to start somewhere.

Install Express, a generator, and MongoDB globally if you don’t have them already.

```bash
$ npm install -g express express-generator mongodb
```

Then start a new project called login-example

```bash
$ express login-example
$ cd login-example
```

Take a look at your package.json in the new folder. It should look something like this.

```bash
{
 “name”: “login-example”,
 “version”: “0.0.0”,
 “private”: true,
 “scripts”: {
   “start”: “node ./bin/www”
 },
 “dependencies”: {
   “body-parser”: “~1.13.1”,
   “cookie-parser”: “~1.3.5”,
   “debug”: “~2.2.0”,
   “express”: “~4.13.0”,
   “jade”: “~1.11.0”,
   “morgan”: “~1.6.1”,
   “serve-favicon”: “~2.3.0”
 }
}
```

We need to add some dependencies for this project. Just to mix it up, we are going to use [Mongoose](http://mongoosejs.com/index.html) instead of Monk this time around. We are going to use it to build a schema for a basic “account” model. Also, we are going to add [passport](http://www.passportjs.org/) for user authentication and [passport-local-mongoose](https://github.com/saintedlama/passport-local-mongoose) to simplify our work getting the forms up and running a bit.

```bash
$ npm install express-session mongoose passport passport-local passport-local-mongoose --save
$ npm install
```

Start your server

```bash
$ npm start
```

Point your browser to http://localhost:3000/ and make sure everything is still working as expected.

Create models/account.js

```bash
$ mkdir models
$ touch models/account.js
```

We are going to create our schema model in `account.js`.

```js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  username: String,
  password: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
```

Take a look at your `app.js` file. We are going to hook up passport and mongoose to our application.

```js
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var Account = require('./models/account');

/*
* Setup Jade as a Views Engine
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
 secret: 'keyboard cat',
 resave: false,
 saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

/*
* Configure Passport for authetication
* Use the Account model for serialization
*/
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/login-example');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
});

/*
* Error Handlers
*/

// development error handler - will print stacktrace
if (app.get('env') === 'development') {
 app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
   message: err.message,
   error: err
  });
 });
}

// production error handler - no stacktraces leaked to user
app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
  message: err.message,
  error: {}
 });
});

module.exports = app;
```

This time around, we are using Jade as a template engine. I’ve always strayed towards templating systems that feel more like straight HTML, so it put me out of my comfort zone. Once I got the hang of it though, I came to really like working in Jade. Because of it’s rigid spacing requirements, I’ve switched over to github embeds for my code views on this blog.

Add bootstrap to your `layout.jade` file in the `views` folder. Spacing is very important in Jade, so make sure you are using either spaces or tabs, but not both.

To speed up the creative side of this, I’ve added [bootstrap](http://getbootstrap.com/) so we can quickly hook on to classes for styling.

```pug
doctype html
html
  head
    title= title
    meta(name='viewport', content='width=device-width, initial-scale=1.0')
    link(href='//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css', rel='stylesheet', media='screen')
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
  block content

 script(src='//code.jquery.com/jquery.js')
 script(src='//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js')
```

Fill out `index.jade` next.

```pug
extends layout

block content
 if (!user)
   h1 Sign in to your account
   p.lead You’re one step away from this awesome app.
   a.btn.btn-primary.btn-lg.btn-block(href='/login', role='button') Login
   br
   a.btn.btn-default.btn-lg.btn-block(href='/register', role='button') Register
 if (user)
   p You are currently logged in as #{user.username}
   a(href='/logout') Logout
```

Create `login.jade`

```pug
extends layout

block content
 .container
   h1 Login
   p.lead
     | Sign in with your account. Don’t have one?
     a(href='/register')  Register Now.
     form(role='form', action='/login', method='post')
       .form-group
         label(for='username') Username
         input.form-control(type='text', id='user', name='username', placeholder='enter a username')
       .form-group
         label(for='password') Password
         input.form-control(type='password', id='password', name='password', placeholder='enter a password')
       button.btn.btn-primary(type='submit') Submit
       &nbsp;
       a.btn.btn-default(role='button', href='/') Cancel
```

Create `register.jade`

```pug
extends layout

block content
 .container
   h1 Registration
   p.lead Create an account. Already have one?
     a(href='/login')  Login Now.
   form(role='form', action='/register', method='post')
     .form-group
       label(for='username') Username
       input.form-control(type='text', id='username', name='username', placeholder='enter a username')
     .form-group
       label(for='password') Password
       input.form-control(type='password', id='password', name='password', placeholder='enter a password')
     button.btn.btn-primary(type='submit') Submit
     &nbsp;
     a.btn.btn-default(href='/', role='button') Cancel

  h4.text-danger= info
```

Now that we have our templates, we need to add the routes to our `routes/index.js` file.

```js
var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/', function(req, res, next) {
 res.render('index', { user : req.user });
});

router.route('/register')
  .get(function(req, res) {
    res.render('register', { });
  })
  .post(function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
      if (err) {
        return res.render('register', {info: 'Sorry. That username already exists. Try again.'});
      }
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    });
  });

router.route('/login')
  .get(function(req, res) {
    res.render('login', { user: req.user });
  })
  .post(passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
```

This gets us up and running with a basic login functionality. We don’t want our users logging in to an un-secure site though, right?

We can setup a local version of a SSL certificate with the steps listed [here](http://greengeckodesign.com:8880/blog/2013/06/15/creating-an-ssl-certificate-for-node-dot-js/).

```bash
$ mkdir ssl
$ cd ssl
$ openssl genrsa -des3 -out ca.key 1024
$ openssl req -new -key ca.key -out ca.csr
$ openssl x509 -req -days 365 -in ca.csr -out ca.crt -signkey ca.key
$ openssl genrsa -des3 -out server.key 1024 
$ openssl req -new -key server.key -out server.csr
$ cp server.key server.key.org
$ openssl rsa -in server.key.org -out server.key
$ openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

It looks like a different language and there is a lot happening, but we are creating a self-signed server certificate. It’s un-registered, since we don’t want to spend money on a test project.

Since we are testing this on localhost, don’t worry about errors that browsers throw about the certificate not being trusted.

Head back to `app.js` and add the secure logic above the Jade setup.

```js
var app = express();
var Account = require('./models/account');
var https = require('https'),
var fs = require('fs');
var sslOptions = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt'),
  ca: fs.readFileSync('./ca.crt'),
  requestCert: true,
  rejectUnauthorized: false
};
var secureServer = https.createServer(sslOptions,app).listen('3030');
/*
** Setup Jade as a Views Engine
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
```

Fire your website back up again.

```bash
$ npm start
```

Point your browser to your newly secure site.
https://localhost:3030/

You should be able to register a name & password and then sign in with that account.

