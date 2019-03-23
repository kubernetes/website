---
title: Pod Lifecycle
id: pod-lifecycle
date: 2019-02-17
full-link: /docs/concepts/workloads/pods/pod-lifecycle/
related:
 - pod
 - container
tags:
 - fundamental
short_description: >
  A high-level summary of what phase the Pod is in within its lifecyle.
 
---
 A high-level summary of what phase the Pod is in within its lifecyle.

<!--more--> 

The [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/) is a high level summary of where a Pod is in its lifecyle.  A Pod’s `status` field is a [PodStatus](/docs/reference/generated/kubernetes-api/v1.13/#podstatus-v1-core) object, which has a `phase` field that displays one of the following phases: Running, Pending, Succeeded, Failed, Unknown, Completed, or CrashLoopBackOff.
