---
title: Medium-style sticky header
date: '2017-01-15'
tags:
  - javascript
  - front-end
  - blog
---

There are many styles of navigation out on the web right now. One of my personal favorites is the header that remains near the top of the window (typically termed “sticky”), hides when a user scrolls down, and then reappears when they start to scroll up. Medium makes use of this (scroll back up a bit) to great effect. I’m hoping to show you how to make this happen with CSS and a little bit of vanilla javascript.

First we will put down some basic markup for the HTML. I’m using a div to wrap all of my content and hooking a class to that instead of the body. This will help later when we need to look for a scroll event on touch devices like the iPhone.

Everything in the header is wrapped in the “header” class and element. Below it is an empty div that we will attach a large background image to for display purposes.

<script src="https://gist.github.com/bunnyhawk/8ab8b72474c46e3bdb73214411bf1c21.js"></script>

<script src="https://gist.github.com/bunnyhawk/51cfae82fe83c91bba74bf5d7338a8a6.js"></script>

I put in some opinionated defaults at the top. This helps me standardize the box model along with the colors, fonts, and line-heights throughout the project. This isn’t important to this project, but helpful on larger scale ones so I tend to always have them.

The general idea of styling the header works like this:

1. The header is always fixed to the top of the window
2. When the “.is-hidden” class gets added, we transition on the y-axis so it sits just above the window.
3. The transition attribute assures a smooth animation while hiding/showing the element over 300 milliseconds.
4. The actual addition of the class is added via javascript on user scroll. In this instance, it’s when the “.wrapper” element is scrolling.

Now on to the javascript portion.

<script src="https://gist.github.com/bunnyhawk/8bfb39f1fd7206665dcd0e1954f793f2.js"></script>

At the top we are grabbing a couple of elements from the page that we need to hook on to within “const” variables. Const is a block scope variable (much like “let”) introduced in ES2015. It can’t be reassigned and is read-only.

I’m setting a placeholder variable called lastScrollTop as a number. This is going to be updated on user scroll, so made it a “var” instead of a “const”.

At the bottom is an event listener watching the “wrapper” div for the scroll event. Whenever it’s triggered, it will run the “onHeaderScroll” function. We are wrapping it in the debounce function to make sure that it doesn’t run more than the expected 60FPS (roughly). You can find a bunch of variations on the debounce function online. Libraries like underscore come with [their own versions](http://underscorejs.org/#debounce) too.

The `onScroll` function is where the magic happens.

1. Find out how far away the top of the window is from the top of the “wrapper” div (via scrollTop)
2. Do some basic checks to see if the header is currently visible and if the user is scrolling up or down. We know the user is scrolling up if the scrollTop is smaller than the last time we checked it.
3. If the user is scrolling down and we are past where the header starts, add the “.is-hidden” class.
4. Update the lastScrollTop variable so we can check again later which direction the user is scrolling.

That’s the bulk of it. I did a stylized version (mobile-first) of it up on Codepen.

[http://codepen.io/bunnyhawk/pen/EZaeQv](http://codepen.io/bunnyhawk/pen/EZaeQv)