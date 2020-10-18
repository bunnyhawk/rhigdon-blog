---
title: Sending an Email with Nodemailer, AWS Lambda, and Serverless
date: '2020-10-18'
tags:
  - javascript
  - back-end
  - node
  - serverless
  - aws
  - aws lambda
  - blog
---

I spent the last few months helping organize an especially heavy project with some new friends called [Remembering COVID-19](https://www.rememberingcovid19.co/). It's meant to serve as a digital memorial for Americans that have lost their lives due to COVID. I agreed to help develop it in my spare time in while in-between jobs. It is obviously a good cause and gave me some room to play around with some fresh technology. 

What's live is actually a second iteration entirely. The original was a React [SPA](https://en.wikipedia.org/wiki/Single-page_application). It worked fine, but I wasn't happy with the overall performance with so many DOM elements on the homepage. I should have realized early on that it was all overkill for my actual needs, but bad software decisions can sneak up on you like that sometimes. I took it as an opportunity to write some honest, top-to-bottom, back-to-basics, vanilla javascript.

For me, the contact form was a surprisingly complicated section to build. I had a few basic needs that added to the complexity of the ask:
* This was a non-profit and the budget was essentially non-existent. Free (or at least very cheap) tools are a must.
* I needed the form to mail to a contact alias (or a personal inbox).
* Because we needed "proof", the form had to pass along user submitted files.

This last bullet in particular was what nixed most of the out-of-box solutions. Beyond that, most of the mailers (Mailgun, Sendgrid, et al.) I'd researched for this were very much overkill for my needs. I wasn't looking to send to an entire list of contacts and I didn't need it to be very sophisticated in terms of functionality; just pass along the details and approved file types to our alias.

I finally settled on a combo of an API built in [AWS Lambda](https://aws.amazon.com/lambda/) via [Serverless](https://www.serverless.com/) and [Nodemailer](https://nodemailer.com/about/). If you're starting from scratch, you can initialize the project with the [quick start guide](https://www.serverless.com/framework/docs/providers/aws/guide/quick-start/) in the Serverless docs.

## Getting it right; Writing our Serverless config

I had a particularly frustrating time piecing together all of these bits, so I decided to do a post on this in case anyone else might struggle with it in the future. The following is how I ultimately setup my serverless config (YAML). Commented for your pleasure.

**serverless.yml**
```yaml
service: covid-api # The name of our service in AWS

package:
  exclude:
    - secrets.yml

custom:
  stage: ${opt:stage, self:provider.stage}
  secrets: ${file(secrets.yml):${self:custom.stage}}

provider:
  name: aws
  runtime: nodejs12.x
  stage: dev # Using dev here, but could be stage or production as well
  region: us-west-2 # Use whatever region makes sense for your location / project
  apiGateway:
    binaryMediaTypes:
      - "*/*" # Make sure the form is ready to pass data and files
  environment:
    MAIL_ACCESS: "${self:custom.secrets.MAIL_ACCESS}" # Our password via a secrets config. More on this below

functions:
  covidApi:
    handler: handler.covidApi # This is our exported handler value
    name: ${self:provider.stage}-covidApi-lambda # for dev, lambda would be named "dev-covidApi-lambda"
    events:
      - http:
          path: send-mail # this will be our eventual API path
          method: post
          cors: true
          private: false
          request:
            parameters:
              headers:
                - "Accept"
                - "Content-Type"
```

## Keeping Secrets

You'll note that I'm calling the password via a separate `secrets.yml` file. Make sure this is in your `.gitignore` file. We don't want it to end up public facing in logs or Github itself.

Here is a general example on the format for that file:

**secrets.yml**
```yaml
default: &default # Shared variables
  <<: *default
  EXAMPLE_DEFAULT_KEY: "EXAMPLE_VALUE"

dev: # Environment specific variables
  <<: *default
  MAIL_ACCESS: "YOUR_PASSWORD_HERE"
```

## Building routes and handling data with handler.js

Below is our handler file. Once again, I'm marking it up with comments to help you follow along with the hows and whys of each piece. This one is a bit longer, but there are essentially three main pieces.
* Setting up the server along with the initial route
* Parse the incoming data from `/send-mail` with busboy and prep files to pass along
* Build the email template with Nodemailer and send. 

**handler.js**
```js
"use strict";

// Express is our server here. It will host any routes we need to leverage (in this case, just the one)
const express = require("express");
const sls = require("serverless-http"); // Serverless wrapper
const bodyParser = require("body-parser"); // Middleware that parses our incoming requests
const Busboy = require("busboy"); // Busboy is used to parse HTML data from our form
const nodemailer = require("nodemailer");
const { Logger } = require("lambda-logger-node"); // Optional: Provides cleaner error logging in AWS

const app = express(); // Kick off the server
const logger = Logger(); // Start a logger to better understand errors

// Setting up our server and making sure it's ready to handle outside (non-CORS) incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *"
  );
  next();
});

// This is our POST route that the form will leverage
app.post("/send-mail", async (req, res, next) => {
  const result = {
    files: [],
  };

  // Initial headers for our request
  var busboy = new Busboy({
    headers: {
      ...req.headers,
      "content-type":
        req.headers["Content-Type"] || req.headers["content-type"],
    },
  });

  // Busboy is watching for attached files and setting up our object(s) to pass along
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    let currentFile = {
      filename,
      encoding,
      contentType: mimetype,
      data: [],
    };

    // Building a data array from the incoming stream
    file.on("data", function (data) {
      currentFile.data.push(data);
    });

    // Once finished, concat the data in to a single Buffer object
    file.on("end", function () {
      currentFile.data = Buffer.concat(currentFile.data);
      result.files.push(currentFile);
    });
  });

  // Busboy is watching for the remaining fields and building a result map
  busboy.on("field", function (fieldname, value) {
    try {
      result[fieldname] = JSON.parse(value);
    } catch (err) {
      result[fieldname] = value;
    }
  });

  // Once data is handled, kick off the transport message
  busboy.on("finish", function () {
    main();
  });

  req.pipe(busboy);

  function main() {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Notes on this below
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "example@gmail.com",
        pass: process.env.MAIL_ACCESS, // Passed in via the YAML
      },
    });

    // Build the message
    const message = {
      from: '"Mike" <example@gmail.com>', // sender address
      to: "receiver@gmail.com", // list of receivers
      subject: "Honor A Loved One: Submission",
      text: "A submission for consideration on the COVID Memorial", // plain text body
      html: `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body>
          <h1>Honor A Loved One: Submission</h1>
          <p>THE DECEASED</p>
          <ul>
            <li>First Name: ${result.firstName}</li>
            <li>Last Name: ${result.lastName}</li>
            <li>Age: ${result.age}</li>
            <li>Location: ${result.location}</li>
            <li>What were they like?: ${result.about}</li>
          </ul>
          <p>SUBMITTER</p>
          <ul>
            <li>Name: ${result.submitName}</li>
            <li>Relation: ${result.submitRelation}</li>
            <li>Email: ${result.email}</li>
          </ul>
        </body>
      </html>`,
      attachments: result.files.map((file, index) => ({
        filename: file.filename,
        content: new Buffer.from(file.data, "binary"),
        contentType: file.contentType,
      })),
    };

    // Send it out!
    transporter.sendMail(message, function (err, info) {
      if (err) {
        logger.error(err);
      } else {
        res.status(200).send("Submit is a success");
      }
    });
  }
});

// Matches up with in our YAML as functions: -> covidApi: -> handler:
module.exports.covidApi = sls(app);
```

You might notice that I'm sending mail via gmail in nodemailer. This is probably not a production-ready solution for most, but it's an easy way to get up and running for free while learning about the systems in place. Nodemailer has some more info on [gmail integration here](https://nodemailer.com/usage/using-gmail/). This can easily be swapped out with any ESP that meets your needs.

Below is my submit function that I've hooked up to the form. I've mostly added it for clarity on a decent way to setup the file data for our API. In this scenario, `submissionProof` is the name and ID of our file input.

## Example submit function
```js
const API_URL = 'https://XXXXXXXXX.execute-api.us-west-2.amazonaws.com/dev/send-mail';

const onSubmit = async (event) => {
  event.preventDefault();

  submitButton.disabled = true;

  const { submissionProof, ...rest } = Object.fromEntries(new FormData(event.target).entries());
  const body = new FormData();

  Object.keys(rest).forEach((name) => {
    body.append(name, rest[name]);
  });

  [...fileSubmit.files].forEach((file) => {
    body.append(file.name, file);
  });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body,
    });
  } catch (err) {
    submitButton.disabled = false;
  }

  submitButton.disabled = false;
  window.location.href = '/submitted/';
};
```

That is essentially it. You can see the full code up in my [COVID Memorial API](https://github.com/bunnyhawk/covid-memorial-api) in Github. You're also welcome to check out how it was integrated by [our front-end](https://github.com/bunnyhawk/covid-names). Thank you for taking the time to read.
