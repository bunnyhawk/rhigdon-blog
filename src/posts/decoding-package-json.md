---
title: Decoding package.json
date: '2015-08-21'
tags:
  - javascript
  - front-end
  - npm
  - blog
---

When I first got in to NPM (and Node in general), I took the build process for granted. I wasn’t much concerned with how it worked, just that it did. It wasn’t until I had a couple of projects beyond what could be built with a generator that I truly appreciated the power of the `package.json` file.

The package.json contains all of the data about the application you are building. This includes the metadata, info on how to kick off the build tools from the command line, and the dependencies of your application.

Here is an example package.json:

```json
{
  "name": "example/app",
  "version": "1.0.0",
  "description": "Example application for a medium blog on package.json files",
   "scripts": {
    "analyze": "eslint",
    "build": "npm run scripts && npm run styles",
    "scripts": "browserify ./example.docs.jsx -o ./example.docs.js",
    "styles": "sass ./example.docs.scss ./example.docs.css",
    "test": "test-jest",
    "watch": "npm run scripts -- -wd & npm run styles -- -d -w './**/*.scss' & browser-sync start --files '*.(css|html|js)' --server"
  },
  "author": "Your name here",
  "dependencies": {
  },
  "devDependencies": {
    "babelify": "*",
    "bootstrap": "^3.3.5",
    "browserify": "11.0.1",
    "eslint": "~1.2.1",
    "gulp": "^3.9.0",
    "gulp-concat": "^2.6.0",
    "gulp-connect": "^2.2.0",
    "gulp-file-include": "^0.13.7",
    "gulp-sass": "^3.0.3",
    "gulp-minify-css": "^1.2.0",
    "gulp-sourcemaps": "^1.5.2",
    "jquery": "^2.1.4",
    "react": "*"
  },
  "esLint": {
    "file": [
      "./**/*.jsx"
    ]
  },
  "private": true
}
```

Though the `name` and `version` might seem throw-away, they are actually very important to this file. NPM won’t run an install without them. There are other bits of metadata in here as well that help users find your application, provided that you haven’t set the package to `“private”: true` like I did here. You can include a lot of things I don’t have listed in this sample, including keywords, contributors, and a homepage url.

## Scripts

Node has a few defaults set for running your application, but here you can define exactly what you want each command to do. In this case, `npm run analyze` will kick off the code linting while `npm run test` will start our unit testing.

## Dependencies
The dependencies down below can get a little confusing. You’ll sometimes see package files containing `dependencies`, `devDependencies`, and `peerDependencies`. They basically break down like this:

**dependencies** — Required to run the application. They will be installed when npm install is run, but it will also be installed if your application/module is part of a package. So if you have A-module nested in B-module and you run “npm install” on B-module, any dependencies in A-module will also be installed.

**devDependencies** — Required to develop on the application. These are often build tools (compilers, unit tests, etc). These dependencies install when “npm install” is run on the directory in which package.json lives. So in that last scenario, A-module’s devDepencies would not be installed.

**peerDependencies** — These dependencies on the developer/user to already have installed in order to run the application. You will get a warning in the console on “npm install” if the dependency is missing.

If you aren’t planning on publishing your work, there is no real difference between `dependencies` and `devDependencies`. That said, separating is a good habit to get in to as it helps you see the bigger picture on your application and keeps it ready for use as a module if needed in a larger application.

How versioning works. Developers are encouraged to use what’s called a semantic versioning scheme for their packages. You’ll notice that we defined our at the top as `1.0.0`.

Each of the three numbers has a role. The first number changes on major releases. “Major” is usually defined as a potential breaking change to people using the old version. The second number is a minor change. This typically means there is added functionality, but that the change is backward compatible. The last number is usually reserved for bug-fixes, patches, and performance updates.

When you look at our dependencies, you’ll see some characters that you might not recognize in there. They have different meanings on `npm install` or `npm update` (which looks for new versions of dependencies).

```json
“babelify”: “*”,
“bootstrap”: “^3.3.5”, 
“eslint”: “~1.2.1”,
```

The `*` is a wildcard. It means that you will accept the latest, regardless of version number. This will keep you completely up to date, but it can be dangerous if used in a production application. You’ll never quite know what changes might effect your application when introduced with major version updates.

The `^` (or caret) means that you will accept updates on minor versions. So with my bootstrap example, we would be willing to update to `3.6.2` if it were available to us on `npm update`. This is generally considered fairly safe since changes to these are supposed to be backwards compatible.

To keep things extra locked down, you can use the `~` (or tilde). This will only grab patch updates.

That just about wraps up most of magic happening in the file. Hopefully you’ll be a little more comfortable mucking around in it.