---
assignees:
- davidopp
- foxish
- kow3ns
title: Configuring a Pod Disruption Budget
redirect_from:
- "/docs/admin/disruptions/"
- "/docs/admin/disruptions.html"
- "/docs/tasks/configure-pod-container/configure-pod-disruption-budget/"
- "/docs/tasks/configure-pod-container/configure-pod-disruption-budget/"
---

This guide is for anyone wishing to specify safety constraints on pods or anyone
wishing to write software (typically automation software) that respects those
constraints.

* TOC
{:toc}

## Rationale

Various cluster management operations may voluntarily evict pods.  "Voluntary"
means an eviction can be safely delayed for a reasonable period of time. The
principal examples today are draining a node for maintenance or upgrade
(`kubectl drain`), and cluster autoscaling down. In the future the
[rescheduler](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/rescheduling.md)
may also perform voluntary evictions.  By contrast, something like evicting pods
because a node has become unreachable or reports `NotReady`, is not "voluntary."

For voluntary evictions, it can be useful for applications to be able to limit
the number of pods that are down simultaneously.  For example, a quorum-based application would
like to ensure that the number of replicas running is never brought below the
number needed for a quorum, even temporarily. Or a web front end might want to
ensure that the number of replicas serving load never falls below a certain
percentage of the total, even briefly.  `PodDisruptionBudget` is an API object
that specifies the minimum number or percentage of replicas of a collection that
must be up at a time.  Components that wish to evict a pod subject to disruption
budget use the `/eviction` subresource; unlike a regular pod deletion, this
operation may be rejected by the API server if the eviction would cause a
disruption budget to be violated.

