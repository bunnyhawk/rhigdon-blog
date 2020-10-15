---
title: Scrape a site with X-Ray and build a D3 graph
date: '2015-08-28'
tags:
  - javascript
  - node
  - d3
  - blog
---
I’ve been looking for a reason to tinker with D3 for a while now but I haven’t been able to find a legitimate use case. I figure this hole in the wall I call a blog was as good as any.

D3 can build pretty amazing graphs and charts out of a number of types of data. I thought it would be fun to pair it with X-Ray, a web-scraper created by the guy who wrote Cherrio (another popular tool used for that purpose). The idea is that we could scrape a particular website, X-ray will build a JSON file with some data that we might want, then we’d build a representation graph out of said data.

Full disclosure: this post took me a ridiculous amount of time to pull together. Wrapping my head around building SVGs around the data took me longer than I’m proud to admit. You don’t learn much by succeeding on the first try though, so follow along the best that you can.

Create a directory for your project and a package.json file with the dependencies that you’ll need for this project inside of it.

There aren’t a ton of dependencies here. We’ve got Express for a web-server, Jade as a template engine (though we’ll only get minimal usage out of it), path and request for http service and routing, and X-ray.

Here, we also have our scripts setup to eventually (once the files are in place), run our server and our scraper.

This will be our basic file structure for this project. Feel free to setup the files and folders ahead of time, if that’s your thing.

``` html
root
|__ node_modules
|
|__ routes
|   |__ index.js
|
|__ scripts
|   |__ histogram.js
|
|__ stylesheets
|   |__ style.css
|
|__ views
|   |__ index.jade
|
|__ package.json
|__ scraper.js
|__ package.json
```

Let’s start with our server. It’s quite basic and just meets the needs of our project. We are just displaying one page that will eventually hold our data in graph form. For this project, I’m referencing the node_modules so I can access d3's javascript file later on (via the HTML) under “/node”.

We have a super down and dirty index.js in our routes folder.

Here is the jade that will render our page.

Let’s circle back and look at what we need to build a scraper. I went through a list of things in my head that I might want to gleam from any particular website. Data analysis isn’t my strong suit though… it took a while. I settled on just scraping a major website Reddit and looking at their top stories.

<script src="https://gist.github.com/bunnyhawk/64faa0e49d685c5e5889.js"></script>

We have a super down and dirty index.js in our routes folder.

<script src="https://gist.github.com/bunnyhawk/e3d64ec4331b7fe923ee.js"></script>

Here is the jade that will render our page.

<script src="https://gist.github.com/bunnyhawk/bb9b9ba3227c1ff45e00.js"></script>

Let’s circle back and look at what we need to build a scraper. I went through a list of things in my head that I might want to gleam from any particular website. Data analysis isn’t my strong suit though… it took a while. I settled on just scraping a major website Reddit and looking at their top stories.

<!-- https://miro.medium.com/max/1400/1*OZI6133DFOCVWXzWiRcqXw.png -->

I knew that I could get a few things just from the homepage. I decided to make a graph comparing the amount of likes a particular post gets to the amount of comments. It’s not super insightful, but it gave me something to work with.
Here is the scraper that I came up with.

<script src="https://gist.github.com/bunnyhawk/e49ad1f6429c8e2c777b.js"></script>

Because we setup our package.json this way, you would run the scrape with this.

```bash
$ npm run scrape
```

X-ray is just looking for jQuery-style DOM elements. I just inspected the page searching out the data that I wanted to grab. Each story is in the #siteTable div under a “thing” class. Inside of each story lives the data that I wanted to grab. In this case it was the title of the story, the amount of likes, and the number of comments.

X-ray also lets you click a “next page” button and set an overall limit on the amount of times that you want to do this. After all of this, it spits out a JSON file with the key value pairs that you setup above.

<script src="https://gist.github.com/bunnyhawk/c8f7e9013a1aedfe715f.js"></script>

Now comes the actual graph itself. I went through a couple of variations of this, including a very beautiful (and basically useless) bubble graph. I ultimately decided that this data would be best represented with a bar graph (histogram). I wanted the comments and the likes to overlay each other. I cheated a little in just assuming that the amount of likes would always be larger than the comments, but you could solve for that with some extra code. The titles were a bit long, so I decided that they should display on mouseover (a title tag).

Here is where the magic happens. It’s long, but be patient with me. We can walk through it together. Everything is also commented to help give some context. You are commenting your code right?!

<script src="https://gist.github.com/bunnyhawk/6b7ac1e45a8629ee0cde.js"></script>

At the top, we are setting an object with all of our major values for the SVG. At the top, they are easy to edit in the future if we need the graph a different size.

Right below that I’ve set a function that takes either of our two types of values (likes and comments), each of their maximum values, and calculates them against the height we’ve set for our scale above.

Then we call the d3.json function in order to parse the values of our flare.json. This will give us access to d3's extensive API for playing with the data.

```js
d3.json("./scripts/flare.json", function(error, root) {
```

Below the variables, I’m looping through the data and making sure it’s in a format that I want it. The comments specifically are trouble because they have a string with the word “comments”, so I’m stripping that and making sure it’s converted to a real number, not just a string.

```js
children.forEach(function(data) {
    data.name = data.name;
    data.likes = +data.likes || 0;
    data.comments = data.comments.split(' ')[0];
    data.comments = +data.comments || 0;
});
```

I mentioned the maximum values earlier, well d3 has an easy helper function to grab this value as shown.

```js
commentsMax = d3.max(children, function(d) { return d.comments; }),
likesMax = d3.max(children, function(d) { return d.likes; });
```

From there, we are building out the x and y axis for our graph using a number of helper functions from the d3 API. This includes d3.scale, d3.layout, and d3.svg.axis.

### d3.scale
With the linear scale, you asses your values on a [0–1] scale by default. We are setting it for 0 to the number of children in our data for the X-axis and 0 to the number of maximum “likes” in our data.

```js
x = d3.scale.linear()
    .domain([0, childrenLength])
    .range([0, width]);

y = d3.scale.linear()
    .domain([0, likesMax])
    .range([height, 0])
```

### d3.layout
Layout helps you build your graph visually. There are a number of functions allowing you to stack, sort, and build with your data. There is a lot I still need to learn here, and I’m sure that I could have arranged my code even cleaner. Here we are making sure our graph is evenly spaced based on the amount of children our data has.

```js
data = d3.layout.histogram()
    .bins(x.ticks(childrenLength))
    (children);
```

### d3.svg.axis
The axis function is just a quick way to build out the reference lines and ticks for any given graph. You can do this manually, but save yourself the headache.

```js
xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

yAxis = d3.svg.axis()
    .scale(y)
    .orient("right");
```

From here, we are building out the graph as a series of SVG elements. Wrapping my head around the math needed for this took me most of the time that I spent on the project. I don’t have any real backgound with data analysis, so this was a fun test.

The last bit is some styling for our graph. Here comes the CSS.

<script src="https://gist.github.com/bunnyhawk/79163ff502f1681c3a09.js"></script>

You should have something similar to the picture at the top of the post.

I’m heading off to vacation and fresh out of ideas for this blog. Give me a heads up if you want to see anything in particular. It doesn’t have to be Node based.