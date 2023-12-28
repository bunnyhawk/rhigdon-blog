---
title: Operational Excellence - Part 1 - On-Call
date: '2023-12-28'
tags:
  - soft-skills
  - management
  - beginner
---

In the realm of engineering organizations, the importance of on-call rotations is paramount. Not only do they foster healthier coding practices through a sense of accountability, but they also help boost confidence and trust from customers and stakeholders. Even though being on-call may occasionally involve working during non-standard hours, the burden can be significantly lessened with the correct setup of processes and rotations.

## The Role and Responsibilities of On-Call

The on-call team is primarily focused on operational work. This focus on operations over standard feature work has a significant benefit – it minimizes the risk of essential action items or security risks sitting in the backlog indefinitely.

As the first in line for triaging incoming incidents, the on-call team plays a critical role. They need to verify if the issue at hand is reproducible and whether it has been correctly prioritized. Depending on the incident's severity, they might need to tackle the highest priority items immediately.

When there are no immediate needs based on Service Level Agreements (SLAs), the on-call team should prioritize action items. It's worth noting that failure to fix our processes, monitoring, or other gaps will result in the same issues recurring. This is why action items should always be high on the priority list. Once action items are addressed, security updates should be next in line.

## Rotations: Spreading the Load

To avoid burnout and ensure everyone gets a fair share of responsibilities, spreading the organizational burden through rotations is essential. Depending on the size of your organization and the number of products you manage, you might have a single rotation or multiple rotations handling different areas.

Regardless of the setup, it is vital that everyone understands their responsibilities and has access to everything they need. The goal is to create an environment where the whole organization should feel accountable for and able to dive into any area of the system. This helps spread knowledge and ensures that no single engineer is burdened with handling all major issues.

## Incident Prioritization: Bucketing Incidents

Defining what’s critical for your product and customer needs is a crucial first step in effective incident management. Questions to consider include: Do you have Service Level Agreements (SLAs) defined? Could more monitoring and alarms of your product's uptime be valuable?

It's also important to prioritize the critical services and features to your product. For instance, the downtime of a review platform might not be significant enough to page an engineer at night, but a failing payment system certainly would be.

### Criticality
| Priority | Scope |
| --- | --- |
| P1 (Highest) | • “All hands on deck.”<br>• More than one customer/stakeholder is impacted.<br>• Business-critical functionality blocked. |
| P2 (High) | • Any number of customers/stakeholders severely impacted.<br>• Business-critical functionality for customer blocked or hampered. |
| P3 (Medium) | • Any number of customers/stakeholders impacted.<br>• Service degraded or buggy. |
| P4 (Low) | • A small number of customers/stakeholders are impacted.<br>• Expectations not met. |
| P5 (Lowest) | • Few customers/stakeholders are impacted.<br>• No functionality is impaired. |

### SLAs
| Priority | Response Time | Check-in Frequency | Hours | Mitigation |
| --- | --- | --- | --- | --- |
| P1 (Highest) | 15 minutes | 15 minutes | Any hour of any day | Within 2 hours |
| P2 (High) | 30 minutes | 30 minutes | Any hour of any day  | Within 24 hours |
| P3 (Medium) | 4 business hours | 24 hours | Standard work hours | 5 business days |
| P4 (Low) | 3 business days | 3 business days | Standard work hours | 15 business days |
| P5 (Lowest) | 10 business days | N/A | Standard work hours | No SLA |

## Incident Management: What's Next After Being Paged?

Once you've been paged, the first task is to validate and reproduce the incident. This is part of the triage process that helps better understand the problem. You should then consider yourself the first in line for mitigation. It's critical to understand that the “real” fix can wait for a space to think it through properly, especially in an after-hours situation. The actual fix might be the same as the mitigation, but more substantial work is often required to make systems more robust or issues more easily observable.

## Mitigation: The Paths to Take

Before diving into mitigation, it's vital to ensure that everyone in the rotation has access to the code they oversee, they've got it installed and locally development-ready, and they have a general understanding of the ecosystem. This might seem like a no-brainer, but it is often overlooked.

Moreover, on-call people should be able to push code to production in an off-hours hotfix situation. In such situations, you might need to adjust permissions in “break glass” scenarios you otherwise wouldn’t allow. This could mean ignoring standard code review and merging processes, skipping longer-running tests, or other deployment steps that slow down a release.

If you’re lucky enough to be in a situation where a new feature is the main offender, and your team builds things that are feature-flagged, the quickest path to mitigation is simply toggling that flag. However, many factors could complicate a path to a fix, such as updates to the database and poorly gated code.

## After Care: Following Up

After an incident has been mitigated, there's still work to be done. It's crucial to ensure that there is scope for action items that came out of incidents or retrospectives on major outages. These action items should be considered a very high priority for the person on call and ideally should be tackled right after a P1 or P2 incident if one exists. Remember, the goal is to prevent another disruptive incident, especially off-hours, that could have been avoided if you’d just spent the time needed to address the underlying issue.