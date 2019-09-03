---
title: Events
id: k8s-events
date: 2019-08-30
full_link: /docs/concepts/cluster-administration/events/
short_description: >
  Events are objects that provide insight into what is happening inside a cluster.

aka:
tags:
- architecture
- fundamental
- core-object
---
 In Kubernetes, Events are objects that record occurrences or actions inside your cluster, such as what decisions were made by the scheduler or why some Pods were evicted from a Node.

<!--more-->

 Some resources use Events to broadcast information about errors, changes in
 their state, or other information that should be recorded and made available to
 cluster operators. You can read more about using Events for debugging your
 application in the [Application Introspection and Debugging](/docs/tasks/debug-application-cluster/debug-application-introspection/)
 section.
