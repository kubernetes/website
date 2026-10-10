---
layout: blog
title: "Kubernetes v1.33: HorizontalPodAutoscaler Configurable Tolerance"
slug: kubernetes-v1-33-hpa-configurable-tolerance
math: true # for formulae
date: 2025-04-28T10:30:00-08:00
author: "Jean-Marc François (Google)"
---

This post describes _configurable tolerance for horizontal Pod autoscaling_,
a new alpha feature first available in Kubernetes 1.33.

## What is it?

[Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/)
is a well-known Kubernetes feature that allows your workload to
automatically resize by adding or removing replicas based on resource
utilization.

Let's say you have a web application running in a Kubernetes cluster with 50
replicas. You configure the HorizontalPodAutoscaler (HPA) to scale based on
CPU utilization, with a target of 75% utilization. Now, imagine that the current
CPU utilization across all replicas is 90%, which is higher than the desired
75%. The HPA will calculate the required number of replicas using the formula:
```math
desiredReplicas = ceil\left\lceil currentReplicas \times \frac{currentMetricValue}{desiredMetricValue} \right\rceil
```

In this example:
```math
50 \times (90/75) = 60
```

So, the HPA will increase the number of replicas from 50 to 60 to reduce the
load on each pod. Similarly, if the CPU utilization were to drop below 75%, the
HPA would scale down the number of replicas accordingly. The Kubernetes
documentation provides a
[detailed description of the scaling algorithm](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details).

In order to avoid replicas being created or deleted whenever a small metric
fluctuation occurs, Kubernetes applies a form of hysteresis: it only changes the
number of replicas when the current and desired metric values differ by more
than 10%. In the example above, since the ratio between the current and desired
metric values is \\(90/75\\), or 20% above target, exceeding the 10% tolerance,
the scale-up action will proceed.

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

## I want all the details!

Get all the technical details by reading
[KEP-4951](https://github.com/kubernetes/enhancements/tree/master/keps/sig-autoscaling/4951-configurable-hpa-tolerance)
and follow [issue 4951](https://github.com/kubernetes/enhancements/issues/4951)
to be notified of the feature graduation.
