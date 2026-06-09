---
title: PodGroup
id: podgroup
full_link: /docs/concepts/workloads/podgroup-api/
short_description: >
  A PodGroup represents a set of Pods with common scheduling policy and constraints.

aka:
tags:
- core-object
- workload
---
A PodGroup is a runtime object that represents a group of Pods scheduled
together as a single unit. While the
[Workload API](/docs/concepts/workloads/workload-api/) defines scheduling policy
templates, PodGroups are the runtime counterparts that carry both the policy and
the scheduling status for a specific instance of that group.
