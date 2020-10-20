---
title: Avoiding Common Arrow Function Mistakes
date: '2020-10-20'
tags:
  - javascript
  - front-end
  - blog
---

All of us nerds love this fancy pants arrow function pattern (released in 2015? Good lord... I am getting old). They are concise, easy to read, and lend themselves beautifully to one-liners. Bonus: If you leave off the brackets, there is an inferred return. 

```js
const scareMe = function (name) {
  return `Hey, ${name}! Boo!`;
};
```

becomes

```js
const scareMe = (name) => `Hey, ${name}! Boo!`;
```

Is it just [syntactic sugar](https://en.wikipedia.org/wiki/Syntactic_sugar)? Of course. Is it awesome? Absolutely.

It's tempting to shorthand all of your functions with it, but there are clear moments where you need to watch out for it's hidden "gotchas". I'd say there are really two major "smells" that should have you extra cautious. 

1) When you are accessing `this` in your function.
2) When you want to call `arguments` in your function.

Let's walk through a few examples.

## Working with Prototypes

This is a classic example. Our `shoutOut` function has no idea what the Monster's construction looks like. An arrow function does not have its own bindings to `this` or `super` (in the instance of a `class`). An arrow function is definitely more limited than a standard function in this scenario.

```js 
function Monster(name, species, age) {
  this.name = name;
  this.species = species;
  this.age = age;
}

Monster.prototype.shoutOut = () => {
  console.log(`Everyone welcome ${this.name}. They are a ${this.age} year old ${this.species}`);
}

const Dave = new Monster('Dave McDavidson', 'werewolf', 38);

Dave.shoutOut();
```

Poor Dave.

## Fixing our prototype

1) Avoid using an arrow function
```js
Monster.prototype.shoutOut = function() {
  console.log(`Everyone welcome ${this.name}. They are a ${this.age} year old ${this.species}`)
}
```

Converting to a standard function, `this` is bound back to our initial `Monster` function. We can access it's internals freely (spooky).

## Accessing this.value in an event handler

Much like our last example, `this` will be referencing the function itself instead of the event. `this.value` will return has `undefined`.

```html
<input type="number" name="count" id="count" value="10" min="0" max="20">
<div id="currentCount">Current Bodies: 10</div>
```
```js
const bodyCounter = document.querySelector('#count');
const currentCountContainer = document.querySelector('#currentCount');

bodyCounter.addEventListener('change', () => {
  currentCountContainer.textContent = `Current Bodies: ${this.value}`;
});
```

### Fixing our event handlers
1) Avoid using an arrow function
```js
counter.addEventListener('change', function () {
  currentCountContainer.textContent = `Current Value: ${this.value}`;
});
```
2) Pass the event in to the arrow function
```js
counter.addEventListener('change', (event) => {
  currentCountContainer.textContent = `Current Value: ${event.target.value}`;
});
```

## Methods on an Object

```js
const socialFeed = {
  user: 'David S. Pumpkins',
  likes: 234543,
  addLike: () => { this.likes++; },
  removeLike: () => { this.likes--; },
};
```

### Fixing our Object Methods
1) Avoid using an arrow function (do you see a theme running here?)
```js
const socialFeed = {
  user: 'David S. Pumpkins',
  likes: 234543,
  addLike: function () { this.likes++; },
  removeLike: function () { this.likes--; },
};
```

2) Shorthand a standard function
```js
const socialFeed = {
  user: 'David S. Pumpkins',
  likes: 234543,
  addLike() { this.likes++; },
  removeLike() { this.likes--; },
};
```

The second version is just more syntactic sugar for our functions. Same / Same but with more 😍 

## Attempting to access arguments

```js
const monsterRank = () => {
  const monsters = Array.from(arguments);
  console.log(
    `In order of "most to least frightening": ${monsters.map((monster, index) => `${monster} is #${index + 1}`)}`
  );
}

monsterRank('Dracula', 'Mummy', 'Frankenstein', 'Creature From the Black Lagoon');
```
### Fixing our arguments call
1) Avoid using an arrow function
```js
const monsterRank = function() {
  const monsters = Array.from(arguments);
  console.log(
    `In order of "most to least frightening": ${monsters.map((monster, index) => `${monster} is #${index + 1}`)}`
  );
}
```

2) Pass arguments as a rest parameter (honestly, my preferred method)
```js
const monsterRank = (...args) => {
  const monsters = Array.from(args);
  console.log(
    `In order of "most to least frightening": ${monsters.map((monster, index) => `${monster} is #${index + 1}`)}`
  );
}
```

I'm struggling to think of an instance where I wouldn't prefer the second fix in this scenario. I have a strong bias towards using arrow functions when I'm able to, and I love the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax).

## Wrap it up, buddy

That's it for now. I hope you're enjoying the posts so far. They are a little scatter-shot at the moment, but I'm working on organizing them in a more digestible fashion moving forward. 