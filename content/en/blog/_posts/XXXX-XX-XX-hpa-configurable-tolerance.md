---
layout: blog
title: "Kubernetes v1.33 and Horizontal Autoscaling Configurable Tolerance"
slug: hpa-configurable-tolerance
# after the v1.33 release, set a future publication date and remove the draft marker
# the release comms team can confirm which date has been assigned
#
# PRs to remove the draft marker should be opened BEFORE release day
draft: true
math: true # for formulae
date: XXXX-XX-XX
author: "Jean-Marc François (Google)"
---

This post describes _configurable tolerance for horizontal Pod autoscaling_,
a new alpha feature first available in Kubernetes 1.33.

## What is it?

[Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/)
(HPA) is a well-known Kubernetes feature that allows your workload to
automatically resize by adding or removing replicas based on resource
utilization.

To decide how many replicas a workload requires, users configure their HPA
with a metric (e.g. CPU utilization) and an expected value for this metric (e.g.
80%). The HPA updates the number of replica based on the ratio between the
current and desired metric value. (For example, if there are currently 100
replicas, the CPU utilization is 84%, and the desired utilization is 80%, the
HPA will ask for \\(100 \times (84/80)\\)) replicas).

In order to avoid replicas being created or deleted whenever a small metric
fluctuation occurs, Kubernetes applies a form of hysteresis: it only changes the
number of replicas when the the current and desired metric values differ by more
than 10%.

This default tolerance of 10% is cluster-wide; in older Kubernetes releases, it
could not be fine-tuned. It's a suitable value for most usage, but too coarse
for large deployments, where a 10% tolerance represents tens of pods. As a
result, the community has long
[asked](https://github.com/kubernetes/kubernetes/issues/116984) to be able to
tune this value.

In Kubernetes v1.33, this is now possible.

## How do I use it?

After enabling the `HPAConfigurableTolerance`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) in
your Kubernetes v1.33 cluster, you can add your desired tolerance for your
HorizontalPodAutoscaler object.

Tolerances appear under the `spec.behavior.scaleDown` and
`spec.behavior.scaleUp` fields and can thus be different for scale up and scale
down. A typical usage would be to specify a small tolerance on scale up (to
react quickly to spikes), but higher on scale down (to avoid adding and removing
replicas too quickly in response to small metric fluctuations).

For example, an HPA with a tolerance of 5% on scale-down, and no tolerance on
scale-up, would look like the following:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app
spec:
  ...
  behavior:
    scaleDown:
      tolerance: 0.05
    scaleUp:
      tolerance: 0
```

Consider the previous scenario where the ratio of current to desired metric
values is \\(84/80\\), a 5% increase. With the default 10% scale-up tolerance,
no scaling occurs. However, with the HPA configured as shown, featuring a 0%
scale-up tolerance, the 5% increase triggers scaling.

## I want all the details!

Get all the technical details by reading
[KEP-4951](https://github.com/kubernetes/enhancements/tree/master/keps/sig-autoscaling/4951-configurable-hpa-tolerance)
and follow [issue 4951](https://github.com/kubernetes/enhancements/issues/4951)
to be notified of the feature graduation.
