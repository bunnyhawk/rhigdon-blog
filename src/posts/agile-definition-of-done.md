---
title: Agile-ish — Definition of Done
date: '2020-12-12'
tags:
  - soft-skills
  - process
  - teamwork
  - agile
---

This is the last (planned) post in my "Agile-ish" series. It focuses on how to know when you should consider a story "finished". Nothing is ever really **done**, right?

I think it's an underrated topic in software development. Truth be told, it's often rarely actually discussed at all in some shops.

If you learn nothing else from this (or don't feel like reading further), remember this: "done" doesn't mean that your feature will never be touched again. Software is never really done, but your stories should absolutely have an end point. When new requests come in or bugs are found in the wild (post-release), you start a new story.

Before we get started, you can checkout the previous posts in this series below:

* [Feature Story Building](https://roberthigdon.dev/posts/agile-feature-building/)
* [Grooming - Preparing stories for your sprint](https://roberthigdon.dev/posts/agile-grooming-for-sprint/)

## Baseline - The "obvious" metrics

We've gotta start somewhere.

### The story is truly complete

This means that the story has been groomed and approved **before** development started.

Wait a minute... We are talking about how to know when something is **finished**, right? The thing is, we can't call something done unless we have a clear definition of what **done actually means**. Are we correctly measuring success?

Stories aren't always going to be perfect. Sometimes they are written just to track minor updates or a proof of concept of an idea. Even still, try to be as thorough as you can. 

I have more on that process in my post on [prepping your stories](https://roberthigdon.dev/posts/agile-grooming-for-sprint/). Do the legwork before you get started. It will save you time down the line.

### All acceptance criteria has been met

These criteria should be coming via:

* The person writing out the "ask" (typically a product manager or business partner)
* The grooming process

Have you addressed all of the asks laid out in the story? Fantastic. Let's move on.

## Me too - The less-than "obvious"

Code complete is a good spot to be, but let's not forget some of the smaller details.

### Unit tests are written and pass

You're writing unit tests, right? Seriously. Write unit tests. Ideally these tests are addressing the specific acceptance criteria laid out by stakeholders in the story. 

There are a million ways to tackle testing, and I'm not going to weigh in on that here, but do your best to cover your ass now. It'll save you a headache later.

### Code is clear and documentation is written (when needed)

Under pressure, I'm as guilty of slipping on these two as anyone. Find the time to do it now though. This shouldn't be "tech debt". You're never going to understand your work quite like you know it **right now**. Write it down, even if it's just some loose comments in the code.

### QA has signed off on look and functionality in a staging environment

Local testing is **not** the same as integration testing. Make absolute sure that everything looks and acts like it's supposed to in an environment that's as **close to production as possible**.

## Choose your own adventure

Every shop is different and it's okay to define your own metrics. Here are a couple of potential extra steps before calling it good.

### End-to-End testing is written

Optional, but ideal. This is especially important when your building out larger features. We want to ensure that a user's happy path is crawled through and working as expected. This should be running (and passing) before any new deployments are allowed in to production.

### Work is checked and signed off in a production environment

To be clear, this isn't optional. What **is** optional is whether or not you call a feature/story "done" before this step. Being part of a production release isn't necessarily critical toward a definition of done. It's up to you and your shop to decide if you're able to check that box and/or move that story across the board ahead of this.

Either way, congratulations! You just finished a thing!

## Perfection is the enemy of a release

The intent of all of this is to keep momentum and to keep releasing. There will always be new requests made or bugs found that weren't previously caught. That's another story for another day. 

