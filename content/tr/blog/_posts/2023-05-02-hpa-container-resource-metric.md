---
layout: blog
title: "Kubernetes 1.27: HorizontalPodAutoscaler ContainerResource type metric moves to beta"
date: 2023-05-02T12:00:00+0800
slug: hpa-container-resource-metric
author: >
   [Kensei Nakada](https://github.com/sanposhiho) (Mercari)
---

Kubernetes 1.20 introduced the [`ContainerResource` type metric](/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)
in HorizontalPodAutoscaler (HPA).

In Kubernetes 1.27, this feature moves to beta and the corresponding feature gate (`HPAContainerMetrics`) gets enabled by default. 

## What is the ContainerResource type metric

The ContainerResource type metric allows us to configure the autoscaling based on resource usage of individual containers.

In the following example, the HPA controller scales the target 
so that the average utilization of the cpu in the application container of all the pods is around 60%.
(See [the algorithm details](/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)
to know how the desired replica number is calculated exactly)

```yaml
type: ContainerResource
containerResource:
  name: cpu
  container: application
  target:
    type: Utilization
    averageUtilization: 60
```

## The difference from the Resource type metric

HPA already had a [Resource type metric](/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-resource-metrics).

You can define the target resource utilization like the following,
and then HPA will scale up/down the replicas based on the current utilization.

```yaml
type: Resource
resource:
  name: cpu
  target:
    type: Utilization
    averageUtilization: 60
```

But, this Resource type metric refers to the average utilization of the **Pods**.

In case a Pod has multiple containers, the utilization calculation would be:

```
sum{the resource usage of each container} / sum{the resource request of each container}
```

The resource utilization of each container may not have a direct correlation or may grow at different rates as the load changes.

For example:
- A sidecar container is only providing an auxiliary service such as log shipping.
  If the application does not log very frequently or does not produce logs in its hotpath
  then the usage of the log shipper will not grow.
- A sidecar container which provides authentication. Due to heavy caching
  the usage will only increase slightly when the load on the main container increases.
  In the current blended usage calculation approach this usually results in
  the HPA not scaling up the deployment because the blended usage is still low.
- A sidecar may be injected without resources set which prevents scaling
  based on utilization. In the current logic the HPA controller can only scale
  on absolute resource usage of the pod when the resource requests are not set.

And, in such case, if only one container's resource utilization goes high, 
the Resource type metric may not suggest scaling up.

So, for the accurate autoscaling, you may want to use the ContainerResource type metric for such Pods instead.

## What's new for the beta?

For Kubernetes v1.27, the ContainerResource type metric is available by default as described at the beginning
of this article.
(You can still disable it by the `HPAContainerMetrics` feature gate.)

Also, we've improved the observability of HPA controller by exposing some metrics from the kube-controller-manager:
- `metric_computation_total`: Number of metric computations. 
- `metric_computation_duration_seconds`: The time that the HPA controller takes to calculate one metric.
- `reconciliations_total`: Number of reconciliation of HPA controller. 
- `reconciliation_duration_seconds`: The time that the HPA controller takes to reconcile a HPA object once.

These metrics have labels `action` (`scale_up`, `scale_down`, `none`) and `error` (`spec`, `internal`, `none`).
And, in addition to them, the first two metrics have the `metric_type` label
which corresponds to `.spec.metrics[*].type` for a HorizontalPodAutoscaler.

All metrics are useful for general monitoring of HPA controller,
you can get deeper insight into which part has a problem, where it takes time, how much scaling tends to happen at which time on your cluster etc.

Another minor stuff, we've changed the `SuccessfulRescale` event's messages
so that everyone can check whether the events came from the resource metric or
the container resource metric (See [the related PR](https://github.com/kubernetes/kubernetes/pull/116045)).

## Getting involved 

This feature is managed by [SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling). 
Please join us and share your feedback. We look forward to hearing from you!

## How can I learn more?

- [The official document of the ContainerResource type metric](/docs/tasks/run-application/horizontal-pod-autoscale/#container-resource-metrics)
- [KEP-1610: Container Resource based Autoscaling](https://github.com/kubernetes/enhancements/tree/master/keps/sig-autoscaling/1610-container-resource-autoscaling)