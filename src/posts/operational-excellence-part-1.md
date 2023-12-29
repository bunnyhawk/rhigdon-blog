---
title: Operational Excellence - Part 1 - On-Call
date: '2023-12-28'
tags:
  - soft-skills
  - management
  - beginner
---

In engineering organizations, on-call rotations are crucial. They promote responsible coding practices through accountability and enhance trust from customers and stakeholders. Although being on-call sometimes requires working during non-standard hours, a well-structured process and rotation system can substantially reduce this burden.

## The Role and Responsibilities of On-Call

The on-call is primarily tasked with operational responsibilities. Focusing on these tasks rather than standard feature work minimizes the risk of essential action items, which are critical to operational health, being left unattended in the backlog.

As the first responders to incoming incidents, the on-call plays a crucial role. They must verify whether the reported issue can be replicated and if it has been prioritized appropriately. Depending on the issue's severity, high-priority matters may need to be addressed immediately.

When there are no immediate demands based on Service Level Agreements (SLAs), the on-call team should focus on action items. It's important to remember that failing to address gaps in our processes or monitoring could lead to recurring issues.

## Rotations: Spreading the Load

To avoid burnout and ensure everyone gets a fair share of responsibilities, spreading the organizational burden through rotations is essential. Depending on the size of your organization and the number of products you manage, you might have a single rotation or multiple rotations handling different areas.

Regardless of the setup, it is vital that everyone understands their responsibilities and has access to everything they need. The goal is to create an environment where the whole organization should feel accountable for and able to dive into any area of the system. This helps spread knowledge and ensures that no single engineer is burdened with handling all major issues.

## Incident Prioritization: Bucketing Incidents

Defining what’s critical for your product and customer needs is a crucial first step in effective incident management. Questions to consider include: Do you have SLA defined? Could more monitoring and alarms of your product's uptime be valuable?

It's also important to prioritize the critical services and features to your product. For instance, the downtime of a review platform might not be significant enough to page an engineer at night, but a failing payment system certainly would be.

### Example of a potential Priority Matrix
| Priority | Scope |
| --- | --- |
| P1 (Highest) | • “All hands on deck.”<br>• More than one customer/stakeholder is impacted.<br>• Business-critical functionality blocked. |
| P2 (High) | • Any number of customers/stakeholders severely impacted.<br>• Business-critical functionality for customer blocked or hampered. |
| P3 (Medium) | • Any number of customers/stakeholders impacted.<br>• Service degraded or buggy. |
| P4 (Low) | • A small number of customers/stakeholders are impacted.<br>• Expectations not met. |
| P5 (Lowest) | • Few customers/stakeholders are impacted.<br>• No functionality is impaired. |

### Example of potential SLAs
| Priority | Response Time | Check-in Frequency | Hours | Mitigation |
| --- | --- | --- | --- | --- |
| P1 (Highest) | 15 minutes | 15 minutes | Any hour of any day | Within 2 hours |
| P2 (High) | 30 minutes | 30 minutes | Any hour of any day  | Within 24 hours |
| P3 (Medium) | 4 business hours | 24 hours | Standard work hours | 5 business days |
| P4 (Low) | 3 business days | 3 business days | Standard work hours | 15 business days |
| P5 (Lowest) | 10 business days | N/A | Standard work hours | No SLA |

## Incident Management: What's Next After Being Paged?

Once you've been paged, your initial task is to confirm and recreate the incident. This is part of the triage process, which aids in comprehending the problem better. After that, consider yourself as the primary person for mitigation, not necessarily the whole fix. It's important to realize that sometimes the "actual" fix can be deferred until there's sufficient time to think it through, particularly during after-hours incidents. The final solution may align with the mitigation, but often, more substantial work is necessary to enhance system robustness or make issues more observable.

## Mitigation

Before discussing mitigation, it's critical that everyone in the rotation has access to, and an understanding of, the code they oversee. They should have it installed and ready for local development. This may seem obvious, but it's often overlooked.

Additionally, on-call personnel should be able to push code to production in off-hour hotfix situations. This may require adjusting permissions in emergency scenarios, potentially bypassing standard code review, merging processes, skipping longer-running tests, or other deployment steps that could slow release.

If a new feature is causing issues and your team uses feature flags, the quickest mitigation strategy is to toggle that flag. However, other factors like database updates or poorly gated code could complicate this process.

When toggling a feature flag isn't viable, there are two primary strategies for handling incidents: rolling back code or fixing it forward. Rolling back reverts the system to a previous, functional state. It can be quick but might also undo recent updates. Fixing it forward involves identifying and correcting the current problem without reverting. This may take more time but is typically a more sustainable solution as it directly addresses the issue. The choice between these strategies depends on the incident's severity, the system's complexity, and the available troubleshooting and repair resources.

**Writing recommendations for each production release** is a good practice. Generally, the engineers who wrote the code can provide the best advice on safely reverting changes. This gives on-call personnel a quick guide for proceeding.

## After Care: Following Up

After an incident has been mitigated, there's still work to be done. It's crucial to ensure that there is space for action items that came out of incidents or retrospectives on major outages. These action items should be considered a very high priority for the person on call and ideally should be tackled right after a P1 or P2 incident if one exists. Remember, the goal is to prevent another disruptive incident, especially off-hours, that could have been avoided if you’d just spent the time needed to address the underlying issue.