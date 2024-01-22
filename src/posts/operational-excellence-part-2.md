---
title: Operational Excellence - Part 2 - CAPAs
date: '2024-01-22'
tags:
  - soft-skills
  - management
  - process
  - operational health
---

## What is a CAPA?

Hailing from the world of quality management systems, “CAPA” is shorthand for Corrective and Preventive Actions. Understanding the concept can be important to maintaining and improving the standards of any organization.

CAPA is a systematic approach to investigate and correct gaps or deficiencies in an organization's systems or processes. It involves two key steps: corrective actions to eliminate the causes of existing deficiencies and preventive actions to prevent potential future ones. Although CAPAs are used in various industries, this article will focus on their application in engineering teams to improve operational health.

## Incorporating CAPA into Your Workflow

The process starts by identifying a deficiency, followed by an investigation to determine its root cause. In engineering, a high-severity incident often results in a CAPA document. The goal is to retrospectively assess the incident, understand why it occurred, and identify measures to detect or prevent it earlier. Below is a basic template you can use to begin your own process.

| Step | Description |
| --- | --- |
| Reviewers | <em>A list of everyone involved in the reviewing of the CAPA document.</em> |
| Review Date | 12/10/2023 |
| Executive Summary | <em>A high level summary of what happened and who might have been impacted. It’s important to get as specific as possible when talking about impact. Metrics about downtime and lost revenue are important to getting buy-in on the prioritization of future action items.</em> |
| Incident Timeline<br>(We use ISO) | • 2023-12-10T14:48:00.000Z - Alarms went off showing 503 errors on the orders service<br>• 2023-12-10T14:49:00.000Z - On-Call acknowledged the incident<br>• 2023-12-10T14:54:00.000Z - On-Call checked Datadog and noticed CPU spikes in  PostgreSQL where the order tables live<br>• 2023-12-10T15:01:00.000Z - On-Call opened a war room for mitigation support<br><br>…<em>Get as specific as possible!</em> |
| Root Cause | <em>This is where you breakdown the Five Why’s - details below</em> |
| Action Items | <em>List out definitive items that can help prevent this type of incident in the future</em> |

## Investigation and Timeline

A crucial aspect of the CAPA process is a thorough investigation to identify the root cause. You need to document the incident's sequence, its impact, and the involved stakeholders.

If you are the person initially investigating the issue, it's beneficial to keep notes as the triage process unfolds. The aim isn't to distract from mitigation but to help frame what might become a future CAPA timeline.

Ensure this report is blameless. Although an individual's involvement might sometimes be important to the narrative, you can usually use a person's role or title to provide context (e.g., "The Design Lead informed the Engineering Manager that the billing page wasn't loading.").

After creating a detailed timeline, it's time to dissect the situation.

## The “Five Whys”

The "Five Whys" method is simple: when a problem occurs, you drill down to its root cause by asking "Why?" five times. This process enables you to identify countermeasures that can prevent the issue from recurring. For example, when our customer dashboard went down, we traced the problem back to a legacy section of our code that hadn’t been revisited in years by asking "Why?" five times.

*An example:* “Our customer dashboard went down and wasn’t responsive. An enterprise-level customer complained.”

- *Why?* - The APIs that drive the dashboard were throwing 503 errors.
- *Why?* - The database CPUs were spiking and overloaded.
- *Why?* - Long-running queries were causing them to overload under peak demand.
- *Why?* - The relational tables weren’t properly indexed.
- *Why?* - The tables live in a legacy section of our code that hasn’t been revisited in years.

## Meeting to Discuss

After identifying the root cause, it's vital to meet with everyone involved in the incident. This includes the person on-call, everyone who assisted, the manager, and any subject matter experts. We often include one or two unrelated people to provide an outsider's perspective and learning opportunity.

While an asynchronous document review is an option, getting people "in the room" often stimulates more dynamic discussions that help isolate the necessary countermeasures. We prefer to spend the first 15-20 minutes reading and commenting on the document together (we typically use a collaborative tool like Google Docs), followed by a discussion and walk-through of open questions. Despite seeming odd to read something as a group, it allows for focused reading in an otherwise busy workday. Everyone is in the room with a single task and agenda. From there, everyone agrees on the action items and the way forward.

## Formulating Action Items

The "Five Whys" and the subsequent document discussion should yield several potential action items to prevent similar future issues. In our company, we directly create high-priority JIRA tickets for these action items. These could involve adding alarms for increased errors, enhancing database metrics observability, or auditing database tables in production to identify performance bottlenecks.

Here are a few potential action items from the hypothetical incident above:

- Add alarms for increases in errors (like 503s) to detect problems before users do.
- Enhance observability for database metrics that could cause spikes (CPU, memory, etc).
- Audit the database tables in production to spot code smells or performance bottlenecks, leading to additional action items for future development.

## Following Up on Open Action Items

You now have a bunch of new items in your already busy backlog. How do you get the team actually to prioritize them? Prioritizing system health and maintenance is never easy; it requires buy-in from leadership. At our company, we task our on-call rotation with this duty, ensuring that we spend at least 20% of engineering’s time on operational excellence. We touch a little more on this approach in [Part 1 of this series](../operational-excellence-part-1).

## Conclusion

Implementing CAPA is a proactive way to maintain and enhance the quality of your systems, processes, and overall organizational performance. Stay tuned for the third part of our series, where we'll discuss the importance of Runbooks, including how and why to use them in your organization.