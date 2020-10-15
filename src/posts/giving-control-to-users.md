---
title: Giving control back to your users
date: '2019-03-09'
tags:
  - javascript
  - front-end
  - blog
---

I recently had the opportunity to attend [An Event Apart](http://aneventapart.com), a conference geared toward UX and graphic designers and front-end developers. The agenda is broad in scope, covering industry trends, content, accessibility, empathy, and even the social ramifications of the products we all create.

I’ve been lucky enough to attend this event twice in years past and both times had my mind blown. The stand-out sessions centered around revolutionary concepts we now take for granted in development:

* Responsive design — [Ethan Marcotte](https://aneventapart.com/news/post/responsive-patterns-with-ethan-marcotte) schooled me on media queries and how to build a truly responsive website way back in 2010.
* Mobile First — [Luke Wroblewski](https://aneventapart.com/speakers/luke-wroblewski) taught me the how’s and why’s of designing and developing with mobile users in mind first.

This year’s event was no different.

Though the content ran the gamut (as is typical), a common theme emerged across many of the sessions: **give control back to your users**.

## Opting Out — Control through exclusion

Facebook has (rightly) faced a lot of criticism for its questionable data collection and security practices, and it seems they’ve been hard at work to hand at least some control back to their users. One concrete example of this pivot is the [Facebook ad preferences page](http://facebook.com/ads/preferences), which is, frankly, a frightening look at not only the amount of data the tech giant has on you, but the way their algorithms view you as a consumer.

The ad preferences page allows you as a user to see Facebook’s best guess at the brands or products you might be interested in based on browsing data, pages and posts you’ve liked, pictures you’ve posted, and some magic algorithmic number crunching. The good news, however, is users now have an opportunity to both view and, as necessary, correct those assumptions. In essence, you how have the power to alter the way Facebook views you, which can influence the audience segments you might be bucketed into for ad targeting.

Another interesting example of a customer opt-out came from UK-based boxed flower delivery company, Bloom and Wild. The company runs your typical email marketing program, which includes promotions centered around holidays and other special occasions. Last year [Sarah Parmenter](http://aneventapart.com/speakers/sarah-parmenter) (designer, and speaker at the event) received an email from Bloom and Wild promoting their products for the upcoming Mother’s Day holiday. The well-meaning message would not have struck a particular chord for Parmenter, except that her mother had recently passed away and the loss was still very emotionally raw for her.

Parmenter sent Bloom and Wild an email suggesting the company consider allowing users to opt-out of messages centered around specific events like Mother’s Day, lest they result in a painful reminder of loss. Surprisingly, the company was moved enough by Parmenter’s request to decide it was the right thing to do. They got the tech in place to offer this level of personalization and customer-centered control and rolled out the change to [surprising fanfare](https://www.cosmopolitan.com/uk/worklife/a26620029/florist-praised-mothers-day-marketing/); the earned media ended up being an unexpected boon for their business.

## Accessibility — Control through inclusion

While roughly half the speakers touched on accessibility and inclusion by designing with empathy, [Derek Featherstone](https://twitter.com/feather) put it best:

> Disabled people aren’t the edge case. Tech people are the edge case. We represent a small portion of the population and we’re in charge of designing and building. Too often we design for people exactly like us.

In a world of flashy websites and animations, I’d never considered the effect these design elements might have on users with disabilities. The [prefers-reduced-motion media query](https://css-tricks.com/introduction-reduced-motion-media-query/) was mentioned as a potential opt-out set via a user’s browser; tools like this could help hand control back to users, allowing individuals to decide whether or not they see that flashy animation you’ve designed, and giving all users an opportunity to safely browse without the risk of being triggered.

> “As a standard, we should be giving users end-to-end control over how they interact with us.” — Sarah Parmenter

Parmenter made several excellent points that should be considered when building applications:

* Respect privacy.
* Build in a personal level of UX adjustment into every product.
* Outlier data (edge-cases of customized experience) can create superfans of your product.
* Build the most empathetic experience that you can.

As a developer, I am guilty of getting caught in the weeds of my profession, failing to look beyond its narrow scope: Is this the architecture I want to use? Is this performant enough? Would this code be clear enough if I were to hand it off to another developer today? While these are all important questions, it’s equally, if not more important to consider what it is I’m building holistically, taking into account the impact each decision will have on the end user.

Never forget that you are the gatekeeper for a (hopefully) quality product.

Design and build with empathy.