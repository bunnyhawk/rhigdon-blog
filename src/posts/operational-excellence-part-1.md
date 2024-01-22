---
title: Operational Excellence - Part 1 - On-Call
date: '2023-12-30'
tags:
  - soft-skills
  - management
  - process
  - operational health
---

In engineering organizations, on-call rotations are crucial. They promote responsible coding practices through accountability and enhance trust from customers and stakeholders. Although being on-call sometimes requires working during non-standard hours, a well-structured process and rotation system can substantially reduce this burden.

## The Role and Responsibilities of On-Call

The on-call is primarily tasked with operational responsibilities. This includes:

- Triaging incoming incidents, which could be reported bugs or automated alerts from observability
- Resolving incidents according to the company's Service Level Agreements (SLAs) or predefined priorities
- Following up on issues identified during incident resolution (implementing more robust fixes without the pressure of an SLA deadline)
- Addressing action items identified in retrospectives or [Corrective and Preventive Actions (CAPAs)](../operational-excellence-part-2/)

Focusing on these tasks rather than standard feature work minimizes the risk of essential action items, which are critical to operational health, being left unattended in the backlog.

As first responders to incidents, the on-call team plays a vital role. They must verify if a reported issue can be replicated and if it has been prioritized correctly. Depending on the severity, high-priority issues may need immediate attention.

When there are no pressing demands based on SLAs, the on-call team should focus on action items. Remember, failing to address gaps in our processes or monitoring could result in recurring issues.

## Rotations: Distributing Responsibilities

To prevent burnout and ensure fair task distribution, it's essential to implement on-call rotations in an organization. Depending on the size and product range of your organization, you can have a single rotation or several, each targeting different areas.

Regardless of the structure, everyone must understand their responsibilities and have all necessary resources, including secure production deployment capabilities. The goal is to encourage a shared sense of responsibility, allowing everyone to explore any part of the system. This approach spreads knowledge and prevents any one engineer from handling all significant issues in a given system area.

All members of a rotation should have access to and understand the code they manage, and have it ready for local development. This point may seem evident but is often overlooked.

Additionally, on-call staff should be able to push code to production in off-hour hotfix situations. This could involve adjusting permissions in emergency cases, possibly bypassing standard code review and merging processes, skipping longer-running tests, or other deployment steps that could slow down release.

## Incident Prioritization: Bucketing Incidents

Defining what’s critical for your product and customer needs is a crucial first step in effective incident management. Questions to consider include:
- Do you have SLA defined?
- Could more monitoring and alarms of your product's uptime be valuable?

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

If a new feature is causing issues and your team uses feature flags, the quickest mitigation strategy is to toggle that flag. However, other factors like database schema updates or poorly gated code could complicate this process.

When toggling a feature flag isn't viable, there are two primary strategies for handling incidents: rolling back code or fixing it forward. Rolling back reverts the system to a previous, functional state. It can be quick but might also undo recent updates. Fixing it forward involves identifying and correcting the current problem without reverting. This may take more time but is typically a more sustainable solution as it directly addresses the issue. The choice between these strategies depends on the incident's severity, the system's complexity, and the available troubleshooting and repair resources.

**Writing recommendations for each production release** is a good practice. Generally, the engineers who wrote the code can provide the best advice on safely reverting changes. This gives on-call personnel a quick guide for proceeding.

## After Care: Following Up

After an incident has been mitigated, there's still work to be done. It's crucial to ensure that there is space for action items that came out of incidents or retrospectives on major outages. These action items should be considered a very high priority for the person on call and ideally should be tackled right after a P1 or P2 incident if one exists. Remember, the goal is to prevent another disruptive incident, especially off-hours, that could have been avoided if you’d just spent the time needed to address the underlying issue.

**Update:** Check out [Part 2 of this series](../operational-excellence-part-2), a deep dive into CAPAs.