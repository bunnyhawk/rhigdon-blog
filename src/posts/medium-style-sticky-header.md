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

```css
/* Defaults and resets */
html {
  box-sizing: border-box;
  font-family: Tahoma, Verdana, Segoe, sans-serif;
}

html,
body {
  height: 100%;
  margin: 0;
}

* {
  font-family: inherit;
  line-height: inherit;
  color: inherit;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

/* Content container */
.wrapper {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

/* Header */
.header {
  align-items: center;
  background: rgba(32, 50, 56, .9);
  color: #00C1BA;
  display: flex;
  height: 70px;
  justify-content: space-between;
  padding: 0 20px;
  position: fixed;
  transition: transform 300ms ease-in-out;
  transform: translateY(0);
  width: 100%;
}

.header.is-hidden {
  transform: translateY(-100%);
}

.header_title {
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
}

.header_nav {
  list-style: none;
  padding: 0;
}

.header_navItem {
  display: inline-block;
  margin-left: 20px;
}

.header_navItem a {
  text-decoration: none;
}
```

I put in some opinionated defaults at the top. This helps me standardize the box model along with the colors, fonts, and line-heights throughout the project. This isn’t important to this project, but helpful on larger scale ones so I tend to always have them.

The general idea of styling the header works like this:

1. The header is always fixed to the top of the window
2. When the “.is-hidden” class gets added, we transition on the y-axis so it sits just above the window.
3. The transition attribute assures a smooth animation while hiding/showing the element over 300 milliseconds.
4. The actual addition of the class is added via javascript on user scroll. In this instance, it’s when the “.wrapper” element is scrolling.

Now on to the javascript portion.

```js
const header = document.querySelector('.header');
const pageWrap = document.querySelector('.wrapper');
var lastScrollTop = 0;

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function onScroll() {
  let currScrollTop = pageWrap.scrollTop;
  let isScrollingDown = currScrollTop > lastScrollTop;
  let isHeaderVisible = currScrollTop < header.height;

  header.classList.toggle('is-hidden', isScrollingDown && !isHeaderVisible);
  lastScrollTop = currScrollTop;
}

pageWrap.addEventListener('scroll', debounce(onScroll, 16));
```

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