---
title: Working with Google Maps asynchronously
date: '2015-11-07'
tags:
  - javascript
  - front-end
  - google
  - blog
---

I was working on a stupid-simple static website for a friend’s new bar this last weekend. There wasn’t much content to work with, so we decided to add a google map on the page for easy reference.

In looking over the documentation for setting up a [basic map](https://developers.google.com/maps/documentation/javascript/examples/map-simple), I noticed that there is a real lack of context of how to handle the code asynchronously. If you pull your initialization off of the page, you run in to errors and/or race conditions. Obviously it’s not Google’s job to explain javascript to developers, but I saw a lot of confusion in my limited search regarding the topic.

This is the basic API script that Google gives you to help render your map. With the ‘async’ attribute, it doesn’t block the rendering of the page. With the ‘defer’ attribute, it will wait until the document has been parsed (at least in modern browsers).

```js
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
```

There is a querystring on the end of the source that will fire a function on callback. Once the API is loaded successfully, you can initialize a function of your choosing. In most of their examples, it’s an initMap function.

```js
<script>
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
  });
}
</script>
```

For my purposes, inline code like this isn’t a big deal. There isn’t a whole lot going on in my static page. There are a couple of issues with this for most developers though.

* The callback is expecting the function to be global (inside of the window object).
* The code is polluting the global namespace as it is currently written. Any of the variables and functions can easily be overwritten.
* Any broken code would stop the page from fully rendering.

I wanted to define even more variables to add a marker and exact location and ran the risk of polluting global further.

I decided to keep the basic callback method, but setup the map code as a [module export](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html) and pass that along to the callback. This can either be in a separate file (ideally for easy caching) or inside of the same script on the page.

<script src="https://gist.github.com/bunnyhawk/126fb1508e71088f1be1.js"></script>

I could get the same thing done with a little bit less code, but this pattern gives me the ability to easily extend it for any future needs (updated directions, new markers, whatever).

The best part about it is that we only have 1 thing declared in the global window object (googleMap) instead of multiple. Everything remains asynchronous and un-blocking. The worst case scenario would be an API error and the map itself doesn’t ever load. The rest of the content is still accessible.