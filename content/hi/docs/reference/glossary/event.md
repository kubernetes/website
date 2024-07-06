---
title: Event
id: event
date: 2022-01-16
full_link: /docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
   Events are Kubernetes objects that describe some state change in the system.
aka: 
tags:
- core-object
- fundamental
---
Event is a Kubernetes object that describes state change/notable occurrences in the system.

<!--more-->
Events have a limited retention time and triggers and messages may evolve with time. 
Event consumers should not rely on the timing of an event with a given reason reflecting a consistent underlying trigger, 
or the continued existence of events with that reason. 


Events should be treated as informative, best-effort, supplemental data.

In Kubernetes, [auditing](/docs/tasks/debug/debug-cluster/audit/) generates a different kind of
Event record (API group `audit.k8s.io`).
