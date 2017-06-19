---
assignees:
- erictune
- foxish
- davidopp
title: Disruptions
redirect_from:
- "/docs/admin/disruptions/"
- "/docs/admin/disruptions.html"
- "/docs/tasks/configure-pod-container/configure-pod-disruption-budget/"
- "/docs/tasks/configure-pod-container/configure-pod-disruption-budget/"
- "/docs/tasks/administer-cluster/configure-pod-disruption-budget/"
---

{% capture overview %}
This page provides an overview of Disruptions that can happen to Pods,
which are events that cause pods to be terminated, and how application
owners can limit and cope with these events.
{% endcapture %}

{:toc}

{% capture body %}
## Understanding Pod Disruptions

A [Pod](/docs/concepts/abstractions/pod/) can be terminated for a number of reasons:

- reason 1
- reason 2

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

{% endcapture %}


{% include templates/concept.md %}
