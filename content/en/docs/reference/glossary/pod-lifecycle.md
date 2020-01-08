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
  A high-level summary of what phase the Pod is in its lifecyle.
 
---
 A high-level summary of what phase the Pod is in its lifecyle.

<!--more--> 

The [Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/) is a high level summary of where a Pod is in its lifecyle.  A Pod’s `status` field is a [PodStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core) object, which has a `phase` field that displays one of the following phases: Pending, Running, Succeeded, Failed, or Unknown.
