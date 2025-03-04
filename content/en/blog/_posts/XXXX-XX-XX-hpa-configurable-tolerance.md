---
layout: blog
title: "Horizontal Autoscaling Configurable Tolerance"
slug: hpa-configurable-tolerance
date: XXXX-XX-XX
author: "Jean-Marc François"
---

This post describes _Configurable Tolerance for Pod Horizontal Autoscaling_,
a new alpha feature first available in Kubernetes 1.33.

## What is it?

Horizontal Pod Autoscaling (HPA) is a well-known Kubernetes feature that
allows your workload to automatically resize by adding or removing replicas
based on resource utilization.

To decide how many replicas a workload requires, users configure their HPA
with a metric (e.g. CPU utilization) and an expected value for this metric (e.g.
80%). The HPA updates the number of replica based on the ratio between the
current and desired metric value. (For example, if there are currently 100
replicas, the CPU utilization is 88%, and the desired utilization is 80%, the
HPA will ask for `100 * (88/80)` replicas).

In order to avoid replicas being created or deleted whenever a small metric
fluctuation occurs, Kubernetes require that the current and desired metrics
differ by more than 10%.

This tolerance of 10% is cluster-wide and typically cannot be fine-tuned. It's
a suitable value for most usage, but too coarse for large deployments, where a
10% tolerance represents tens of pods. As a result,
[users have long asked](https://github.com/kubernetes/kubernetes/issues/116984)
to be able to tune this value.

Thanks to the _Configurable Tolerance for Pod Horizontal Autoscaling_ feature,
this is now possible.

## How do I use it?

Just add the tolerance you want an HPA to use to your `HorizontalPodAutoscaler`
resource.

Tolerances appear under the `spec.behavior.scaleDown` and
`spec.behavior.scaleUp` fields and can thus be different for scale up and scale
down. A typical usage would be to specify a small tolerance on scale up (to
react quickly to spikes), but lower on scale down (to avoid adding and removing
replicas too quickly in response to small metric fluctuations).

For example, an HPA with a tolerance of 5% on scale-down, and no
tolerance on scale-up, would look like the following:

```yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app
spec:
  behavior:
    scaleDown:
      tolerance: 0.05
    scaleUp:
      tolerance: 0
```

Note: This feature is in alpha in Kubernetes 1.33, gated by the
`HPAConfigurableTolerance` flag.

## I want all the details!

Get all the technical details by reading
[KEP-4951](https://github.com/kubernetes/enhancements/tree/master/keps/sig-autoscaling/4951-configurable-hpa-tolerance)
and follow [issue 4951](https://github.com/kubernetes/enhancements/issues/4951)
to be notified of the feature graduation.
