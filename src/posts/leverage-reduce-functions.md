---
title: Mastering Reduce Functions
date: '2020-10-20'
tags:
  - javascript
  - front-end
  - blog
  - beginner
  - intermediate
---

## Basics: Understanding Reduce

The `reduce()` method is one of the most underrated ES6 additions to the Javascript landscape. It's a tool in my toolbox that I find myself using on an almost daily basis. It's also a method that junior developers seem to have a tough time wrapping their heads around. 

```js
arr.reduce((accumulator, currentValue, currentIndex, sourceArray) => {
  // accumulator: the current running "total"
  // currentValue: the current value of the arr (we are looping through them, one by one)
  // currentIndex: where you are in the loop (0 based, as usual)
  // sourceArray: access to the unmodified original arr array

  // Return a function here leveraging the accumulator or currentValue
}, initialValue);
```

There can be confusion around proper usage. Here are a few reasons for this:
1) Your function should be **returning a value**. In most cases, that is an updated accumulator.
2) Your initial value can be anything (a string, a number, an object, etc.), **or nothing**. If it's nothing, **the first value is used as the initialValue**.

## Common Reduce Use Cases

### Gathering a Sum of Numbers

```js
// Standard
[1, 2, 3, 4, 5, 6, 7].reduce((total, num) => total + num);

// Reusable functional style
const add = (...nums) => nums.reduce((total, num) => total + num);
add(1, 2, 3, 4, 5, 6, 7);

// Returns: 28
```

### Tallying values - Convert an Array to an Object Map

The logic here looks a little more complicated, but it's very much the same structure. I'll show you the old school javascript version first to help with clarity. If you find it more readable than the newer version, that's perfectly valid as well.

```js
const counties = [
  { name: 'Clackamas', state: 'Oregon', population: 380000 },
  { name: 'King', state: 'Washington', population: 2000000 },
  { name: 'Kitsap', state: 'Washington', population: 250000 },
  { name: 'Multinomah', state: 'Oregon', population: 750000 },
  { name: 'Snohomish', state: 'Washington', population: 720000 },
  { name: 'Wasco', state: 'Oregon', population: 25000 },
];

const oldStateCountyMap = counties.reduce((acc, county) => {
  const currentCounty = { name: county.name, population: county.population };

  if (acc[county.state]) {
    acc[county.state] = acc[county.state].concat(currentCounty)
  } else {
    acc[county.state] = [currentCounty]
  }
  return acc;
}, {}); // Setting our initialValue as an object to map against

const newStateCountyMap = counties.reduce((acc, { name, state, population }) => {
  const currentCounty = { name, population };

  acc[state] = acc[state] ? [...acc[state], currentCounty] : [currentCounty];

  return acc;
}, {});

// Both return:
// {
//   'Oregon': [
//     { name: 'Multinomah', population: 750000 },
//     { name: 'Clackamas', population: 380000 },
//     { name: 'Wasco', population: 25000 },
//   ],
//   'Washington': [
//     { name: 'King', population: 2000000 },
//     { name: 'Snohomish', population: 720000 },
//     { name: 'Kitsap', population: 250000 },
//   ]
// }
```

The only real difference with `newStateCountyMap` is that it uses some [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) and the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) to handle some basic functionality. If this feels foreign to you, I'd argue that it's a good time to start to studying these techniques. They are getting more and more common in the wild as folks pick up modern javascript tooling.

### Avoiding extra loops - Replacing dual Filter and Map calls

If you find yourself wanting to chain together multiple loops to achieve a goal, you should absolutely consider if it could be handled with a single reduce instead. On larger data sets, this could save you some serious run time.

```js
const counties = [
  { name: 'Clackamas', state: 'Oregon', population: 380000 },
  { name: 'King', state: 'Washington', population: 2000000 },
  { name: 'Kitsap', state: 'Washington', population: 250000 },
  { name: 'Multinomah', state: 'Oregon', population: 750000 },
  { name: 'Snohomish', state: 'Washington', population: 720000 },
  { name: 'Wasco', state: 'Oregon', population: 25000 },
];

const highPopulousCounties = counties.reduce((acc, { name, state, population }) => {
  // This filters out anything smaller than 700000
  if (population <= 700000) return acc;

  // Again using a spread here. If the array is already started,
  // it will fill, otherwise it'll initialize a new array.
  const updatedAcc = [...acc]; 
  updatedAcc.push({ fullName: `${name} County, ${state}`, population });

  return updatedAcc;
}, []);

// Returns:
// [
//   { fullName: 'King County, Washington', population: 2000000 },
//   { fullName: 'Multinomah County, Oregon', population: 750000 },
//   { fullName: 'Snohomish County, Oregon', population: 720000 },
// ]
```

## Function Composition

Generally speaking, function composition is when you combine multiple functions to create a new function. Our `pipe` function is stolen from the amazing [Eric Elliot](https://medium.com/javascript-scene/curry-and-function-composition-2c208d774983). He's got a whole series on [function composition](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-function-composition-20dfb109a1a0) and why you might want to leverage functional programming in your projects.

Here is a trivial, but informative example on how you might chain together functions in a sequence using reduce. In this example, the functions supplied to `pipe` could be doing anything.

```js
const pipe = (...fns) => x => fns.reduce((y, fn) => fn(y), x);
const addOne = num => num + 1;
const subtractTwo = num => num - 2;
const square = num => num * num;

const quickMaths = pipe(addOne, subtractTwo, square);

quickMaths(20);
// Returns: 361
```

## Promise Chaining

When you're leveraging `fetch()` to call APIs, most applications are just fine with a standard [Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) call when waiting for everything to finish. 

What if you need to chain those promises a synchronous fashion? Let's say our `user` API is expecting users to be grabbed in a specific order. In this scenario, we can leverage the `reduce` function.

```js
const getUser = (email) => fetch(`/api/${email}`).then(res => res.json());

const promiseQueue = (values, func) => {
  const reducer = (promises, value) =>
    promises.then((promise) => func(value).then(res => promise.push(res) && res));

  return values.reduce(reducer, Promise.result([]));
};

promiseQueue(["test@example.com", "another@example.com", "thirdOne@example.com"], getUser);
```

I hope this gives you some insight on how you can use `reduce()` in your projects. If you enjoyed this or want me to help explain anything else, feel free to [let me know on Twitter](https://twitter.com/positronicshell).
