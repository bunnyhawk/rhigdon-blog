---
title: Agile-ish ⁠— Grooming - Preparing stories for your sprint
date: '2020-11-19'
tags:
  - teamwork
  - agile
---

Today I'd like to walk through the process of grooming stories for a given sprint. Grooming is the process of walking through stories that have been written as a team and assessing if they have everything they need to be picked up as a task. You also assign out the work so everyone has clarity on what the next few weeks look like.

For most workplaces, a sprint represents about 2 weeks worth of work. This often means code-complete and passing some sort of QA (quality assurance) and/or UAT (user acceptance testing). Some places are looser than others on what a "done" means. My intent is to take up that subject in a future post. It can be tricky to define sometimes, especially when everyone is rushing to a finish line.

Grooming is the our opportunity to look at the work in the backlog and access if it's actually ready for a development cycle. It's important to be critical here. Be honest with yourself and your team. For each of the open questions below, the answer should be "Yes" before adding a story to your next sprint.

## From a developer standpoint

As a developer, run through this checklist.

**Is the acceptance criteria clear?**

Make sure you understand the intended goals. Can you go from start to finish on this work without reaching out to someone for more clarity?

**If No:** You should consider pushing the story back for stronger acceptance criteria.  You can find more details on acceptance criteria in my previous post: [Agile-ish - Feature Story Building](https://roberthigdon.dev/posts/agile-feature-building/).

**Even if you don't understand exactly how you are going to solve the problem, do you understand where you will be looking and potentially what sections of the code you will be touching?**

This can be very important for estimation. Having a little bit of context will go a long way. If you're touching a brittle area of the code, for instance, you might need to pad your estimations to account for any time lost.

**If No:** Consider turning this in to a research story (sometimes called a "spike"). This will give you an opportunity to dive in to the code or documentation further so that you have a better understanding of a possible implementation.

**Do you have everything you need to start and finish the work?**

If you're working on the front-end, are all of the services you need ready for development? Do you have all of the assets you need on hand? Are all of the stakeholders that you need for sign-off available this sprint? 

**If No:** There is a strong risk of the story not getting completed in the alloted time. Does it make sense to prioritize something that can be completely finished over this piece of work? Be critical.
  
**Are the requirements clear enough to give an estimate?**

Estimates are most certainly an educated guess. The more you do them though, the better you will get at them. The question isn't whether you can guess exactly how long a story will take, it's if you can give a reasonable ballpark for the work. I'll touch more on defining what an estimate looks like later on in this post.

**If No:** Similar to above, you should probably make this a research story. Sometimes even 15 mins of digging can shed light on a potential solution. It can also bring forward questions you didn't know you needed to ask. We are looking to get ahead of road-blocks whenever possible.

## From a QA (testing) standpoint?

You're testing your work, right? 

**Are the business needs and requirements clear?**

Don't skimp on thinking through and clearly documenting the requirements at this stage. "Functional" and "useful" are two very different things. It's not worth doing unless it's actually solving the problem at hand.

**If No:** You need to shelve the story and circle back with your business partners and/or team. If you don't clearly understand the work ahead of you, finding the finish line is going to be extremely difficult. 

**Is it test-able?**

Can you prove that your code is correctly working and meets the given requirements?

**If No:** This is the time to figure out why. Folks who are testing this (even if that's you) need a clear vision on what's considered a success. If you can't prove the work, you might need to reconsider the scope of the story. There will be legitimate times where you can't test something, but they are far less common than you might imagine.

## From an estimation standpoint

Agile typically uses a fibonacci scale for estimation. It's an attempt at assigning a value to a given amount of work/effort. It works roughly (but not always exactly) like this. The first part is the assigned estimate number and the second is the effort involved. I've also added notes of how it aligns with a typical 2 week sprint.

```html
1 - A couple of hours or so (I've seen this mean anything under a day)
3 - Less than a quarter of a sprint (roughly a day or two)
5 - About a quarter of a sprint (2 to 3 days)
8 - About half of a sprint (or more)
13 - Roughly a sprint
```

**If the effort is longer than a sprint, can you break it down further?**

We are looking for bite-sized chunks. If you can split the work between multiple developers, even better.

**If No:** If it's looking like more than a full sprint to complete, think through possible <abbr title="minimum viable products">[MVPs](https://roberthigdon.dev/posts/agile-feature-building/#heading-building-out-stories)</abbr>. Can you iterate on a core feature? Can you split out the infrastructure from the feature itself? Can you setup your test suite in a separate story first and run through the feature in full <abbr title="test driven development">[TDD](https://en.wikipedia.org/wiki/Test-driven_development)</abbr> fashion? I have yet to meet a feature that can't be broken down **somehow**.

## From a time management standpoint

Set yourself up for success.

**Be ruthless. Something has to give.**

There isn't an "If No:" step on these next few for a reason. These are critical to your career in technology. If you estimate a story is going to take you a full week, don't pretend or hope that it's going to take you less time. If it does, fantastic; you can pull from the backlog of work. There will always be times when stories take more or less time than originally estimated. The goal is to have them balance each other out. 

Setting your boundaries now is going to help gives your business partners more realistic expectations about the amount of work your team is actually able to achieve over a period of time. This will give you better estimates for your sprints **and** for your project as a whole.

**You can not and should not over-commit. Don't be a martyr.**

As I've said before, you need to be honest with yourself, your team, and your mental sanity. Nobody is going to give you extra credit for the overtime you are putting in. You will always do better work when you have a clear head and a full night's worth of sleep. Never forget that.

### Wrapping up

Again, if you enjoyed this or even if you hated it, feel free to [reach out on Twitter](https://twitter.com/positronicshell).
