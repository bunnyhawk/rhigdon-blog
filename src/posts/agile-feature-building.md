---
title: Agile-ish — Feature Story Building
date: '2020-11-14'
tags:
  - soft-skills
  - process
  - teamwork
  - agile
---

In software development, I try not to hold much of anything sacred. Actually... scratch that. In **life**, I try not to hold much of anything sacred. Times changes, patterns change, and people most certainly change.

Agile is one of those tools that you'll hear a lot about as you're looking to break in to this field. It's a set of practices or methodologies that teams use to approach software development. It's typically defined by it's short sprints of work (2'ish weeks) and a frequent re-assessment of current work given shifting business requirements.

It's a very valuable tool; it's also a bit cult-like. There are literal evangelists, certification (for money, obviously), and the meetings (ceremonies) are basically rituals that you're required to follow if you're strictly adhering to the methodology.

Here is the thing though, for most teams, it can add a ton of value. More importantly, you don't need to go all-in on Agile to get something out of it. This can be true even if you're developing something on your own.

I want to talk about how teams I've been on in the past have tackled the preparation for a typical feature. There are bits and pieces of Agile sprinkled in, but nothing is dogmatic. It's important to **find what works for you and your team**.

## Building Features

For the purposes of this article, "feature" can mean anything from major enhancements to a full-fledged application. It's ideal that you're developing in as bite-sized chunks as possible. More on this shortly.

### Building out stories

**1) Decide on what's critical as a team**

Spitball ideas and assess possible technical implementation issues as well as debt that might be accrued. This is your chance to talk through the challenges that you're going to be facing as you attempt to pull this feature together. This list will help solve some of the limitations in the next step.

**2) What's your actual Minimum Viable Product (MVP)?**

What is the smallest amount of work you can do to release something of value? Business and stakeholders might be needed here. Be cut-throat about what's actually important for launch.

This doesn't mean that you release and forget it. This is ideally going to be a phased approach, building out enhancements along the way. It will help you release quickly and give you an opportunity to watch how your users interact with your software incrementally. 

Open and honest dialog about feature complexity is critical at this stage. If there are large knowledge gaps on implementation, make sure this is well documented. There is always going to be a level of "educated guessing" at this stage. Things will inevitably surprise you.

**3) Whiteboard / Notepad a high-level checklist**

Don't get too granular. Do your best to piece out chunks of split-able work, even if you're the only one who is going to be doing that work.

An example: Let's say you want to build a "Sign Up To Win" contest to a website. You might think of a checklist like this.

```html
* Frontend - Build "Sign Up" form
* Frontend - Form validation
* Frontend - Build transactional email template
* Backend - Build Lambda for API (could have separate validation task if warranted)
* Backend - Setup DB table to hold submissions
* Backend - Build transactional email service
```

**4) Split out each task and build their acceptance criteria**

In our last example, each of these could likely be considered small enough tasks to build out acceptance criteria for. If your feature is more complex, it will make sense to break it even further down. You might need to run this step a couple of times.

The goal is to have chunks that are taking roughly a day or two (possibly up to a week). This is a North Star goal. There are legitimately times where this isn't possible. I'd argue that it's possible more often than not though.

Acceptance criteria styles are a little wild-west, but a common pattern is to right stories that are user or scenario-oriented. 

```html
"Given {some condition}, when I {some action}, then I expect {this result}"
```

Another possible style is just a set of bullet points that should be considered. 

```html
* Name, email, and address form fields are required
* Email must validate that user entered a real email
* There is a success message that says "Thank you for your entry" on submit
...
```

**5) Circle back with your business/organization and get buy-in BEFORE you start any development**

Sign-off is key. If things go sideways, you at least did your homework in the setup phase.

**6) From those discussions, assess importance of next possible features and start to break them out.**

Proper iteration ensures trust between developers and stakeholders. Showing that you aren't going to let a project die gives them comfort to sign off on the next MVP. The smaller the project, the quicker the development cycle, and the faster to market. It's a win for everyone involved.

I'm hoping to make this the first in a series of my learnings over the years. You don't have to go all in on a methodology to make it worthwhile. If you enjoyed this or even if you hated it, feel free to [reach out on Twitter](https://twitter.com/positronicshell).