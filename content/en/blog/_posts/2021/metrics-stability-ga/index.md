---
layout: blog
title: 'Kubernetes 1.21: Metrics Stability hits GA'
date: 2021-04-23
slug: kubernetes-release-1.21-metrics-stability-ga
author: >
  Han Kang (Google),
  Elana Hashman (Red Hat)
---

Kubernetes 1.21 marks the graduation of the metrics stability framework and along with it, the first officially supported stable metrics. Not only do stable metrics come with supportability guarantees, the metrics stability framework brings escape hatches that you can use if you encounter problematic metrics.

See the list of [stable Kubernetes metrics here](https://github.com/kubernetes/kubernetes/blob/master/test/instrumentation/testdata/stable-metrics-list.yaml)

### What are stable metrics and why do we need them?
A stable metric is one which, from a consumption point of view, can be reliably consumed across a number of Kubernetes versions without risk of ingestion failure.

Metrics stability is an ongoing community concern. Cluster monitoring infrastructure often assumes the stability of some control plane metrics, so we have introduced a mechanism for versioning metrics as a proper API, with stability guarantees around a formal metrics deprecation process.

### What are the stability levels for metrics?

Metrics can currently have one of two stability levels: alpha or stable.

_Alpha metrics_ have no stability guarantees; as such they can be modified or deleted at any time. At this time, all Kubernetes metrics implicitly fall into this category.

_Stable metrics_ can be guaranteed to not change, except that the metric may become marked deprecated for a future Kubernetes version. By not change, we mean three things:

1. the metric itself will not be deleted or renamed
2. the type of metric will not be modified
3. no labels can be added or removed from this metric

From an ingestion point of view, it is backwards-compatible to add or remove possible values for labels which already do exist, but not labels themselves. Therefore, adding or removing values from an existing label is permitted. Stable metrics can also be marked as deprecated for a future Kubernetes version, since this is tracked in a metadata field and does not actually change the metric itself.

Removing or adding labels from stable metrics is not permitted. In order to add or remove a label from an existing stable metric, one would have to introduce a new metric and deprecate the stable one; otherwise this would violate compatibility agreements.


#### How are metrics deprecated?

While deprecation policies only affect stability guarantees for stable metrics (and not alpha ones), deprecation information may be optionally provided on alpha metrics to help component owners inform users of future intent and assist with transition plans.

A stable metric undergoing the deprecation process signals that the metric will eventually be deleted. The metrics deprecation lifecycle looks roughly like this (with each stage representing a Kubernetes release):

![Stable metric → Deprecated metric → Hidden metric → Deletion](lifecycle-metric.png)

_Deprecated metrics_ have the same stability guarantees of their stable counterparts. If a stable metric is deprecated, then a deprecated stable metric is guaranteed to not change. When deprecating a stable metric, a future Kubernetes release is specified as the point from which the metric will be considered deprecated.

Deprecated metrics will have their description text prefixed with a deprecation notice string “(Deprecated from x.y)” and a warning log will be emitted during metric registration, in the spirit of the official Kubernetes deprecation policy.

Like their stable metric counterparts, deprecated metrics will be automatically registered to the metrics endpoint. On a subsequent release (when the metric's deprecatedVersion is equal to _current\_kubernetes\_version - 4_)), a deprecated metric will become a _hidden_ metric. _Hidden metrics_ are not automatically registered, and hence are hidden by default from end users. These hidden metrics can be explicitly re-enabled for one release after they reach the hidden state, to provide a migration path for cluster operators.


#### As an owner of a Kubernetes component, how do I add stable metrics?

During metric instantiation, stability can be specified by setting the metadata field, StabilityLevel, to “Stable”. When a StabilityLevel is not explicitly set, metrics default to “Alpha” stability. Note that metrics which have fields determined at runtime cannot be marked as Stable. Stable metrics will be detected during static analysis during the pre-commit phase, and must be reviewed by sig-instrumentation.

```golang
var metricDefinition = kubemetrics.CounterOpts{
    Name: "some_metric",
    Help: "some description",
    StabilityLevel: kubemetrics.STABLE,
}
```
For more examples of setting metrics stability and deprecation, see the [Metrics Stability KEP](http://bit.ly/metrics-stability).


### How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together.
We offer a huge thank you to all the contributors in Kubernetes community who helped review the design and implementation of the project, including but not limited to the following:

- Han Kang (logicalhan)
- Frederic Branczyk (brancz)
- Marek Siarkowicz (serathius)
- Elana Hashman (ehashman)
- Solly Ross (DirectXMan12)
- Stefan Schimanski (sttts)
- David Ashpole (dashpole)
- Yuchen Zhou (yoyinzyc)
- Yu Yi (erain)

If you’re interested in getting involved with the design and development of instrumentation or any part of the Kubernetes metrics system, join the [Kubernetes Instrumentation Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-instrumentation). We’re rapidly growing and always welcome new contributors.
