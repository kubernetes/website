---
reviewers:
- fgrzadkowski
- jszczepkowski
- directxman12
title: Horizontal Pod Autoscaler
---

* TOC
{:toc}

This document describes the current state of the Horizontal Pod Autoscaler in Kubernetes.

## What is the Horizontal Pod Autoscaler?

The Horizontal Pod Autoscaler automatically scales the number of pods
in a replication controller, deployment or replica set based on observed CPU utilization (or, with
[custom metrics](https://git.k8s.io/community/contributors/design-proposals/instrumentation/custom-metrics-api.md)
support, on some other application-provided metrics). Note that Horizontal
Pod Autoscaling does not apply to objects that can't be scaled, for example, DaemonSets.

The Horizontal Pod Autoscaler is implemented as a Kubernetes API resource and a controller.
The resource determines the behavior of the controller.
The controller periodically adjusts the number of replicas in a replication controller or deployment
to match the observed average CPU utilization to the target specified by user.

## How does the Horizontal Pod Autoscaler work?

![Horizontal Pod Autoscaler diagram](/images/docs/horizontal-pod-autoscaler.svg)

The Horizontal Pod Autoscaler is implemented as a control loop, with a period controlled
by the controller manager's `--horizontal-pod-autoscaler-sync-period` flag (with a default
value of 30 seconds).

During each period, the controller manager queries the resource utilization against the
metrics specified in each HorizontalPodAutoscaler definition.  The controller manager
obtains the metrics from either the resource metrics API (for per-pod resource metrics),
or the custom metrics API (for all other metrics).

* For per-pod resource metrics (like CPU), the controller fetches the metrics
  from the resource metrics API for each pod targeted by the HorizontalPodAutoscaler.
  Then, if a target utilization value is set, the controller calculates the utilization
  value as a percentage of the equivalent resource request on the containers in
  each pod.  If a target raw value is set, the raw metric values are used directly.
  The controller then takes the mean of the utilization or the raw value (depending on the type
  of target specified) across all targeted pods, and produces a ratio used to scale
  the number of desired replicas.

  Please note that if some of the pod's containers do not have the relevant resource request set,
  CPU utilization for the pod will not be defined and the autoscaler will not take any action
  for that metric. See the [autoscaling algorithm design document](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#autoscaling-algorithm) for further
  details about how the autoscaling algorithm works.

* For per-pod custom metrics, the controller functions similarly to per-pod resource metrics,
  except that it works with raw values, not utilization values.

* For object metrics, a single metric is fetched (which describes the object
  in question), and compared to the target value, to produce a ratio as above.

The HorizontalPodAutoscaler controller can fetch metrics in two different ways: direct Heapster
access, and REST client access.

When using direct Heapster access, the HorizontalPodAutoscaler queries Heapster directly
through the API server's service proxy subresource.  Heapster needs to be deployed on the
cluster and running in the kube-system namespace.

See [Support for custom metrics](#support-for-custom-metrics) for more details on REST client access.

The autoscaler accesses corresponding replication controller, deployment or replica set by scale sub-resource.
Scale is an interface that allows you to dynamically set the number of replicas and examine each of their current states.
More details on scale sub-resource can be found [here](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource).


## API Object

The Horizontal Pod Autoscaler is an API resource in the Kubernetes `autoscaling` API group.
The current stable version, which only includes support for CPU autoscaling,
can be found in the `autoscaling/v1` API version.

The beta version, which includes support for scaling on memory and custom metrics,
can be found in `autoscaling/v2beta1`. The new fields introduced in `autoscaling/v2beta1`
are preserved as annotations when working with `autoscaling/v1`.

More details about the API object can be found at
[HorizontalPodAutoscaler Object](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object).

## Support for Horizontal Pod Autoscaler in kubectl

Horizontal Pod Autoscaler, like every API resource, is supported in a standard way by `kubectl`.
We can create a new autoscaler using `kubectl create` command.
We can list autoscalers by `kubectl get hpa` and get detailed description by `kubectl describe hpa`.
Finally, we can delete an autoscaler using `kubectl delete hpa`.

In addition, there is a special `kubectl autoscale` command for easy creation of a Horizontal Pod Autoscaler.
For instance, executing `kubectl autoscale rc foo --min=2 --max=5 --cpu-percent=80`
will create an autoscaler for replication controller *foo*, with target CPU utilization set to `80%`
and the number of replicas between 2 and 5.
The detailed documentation of `kubectl autoscale` can be found [here](/docs/user-guide/kubectl/{{page.version}}/#autoscale).


## Autoscaling during rolling update

Currently in Kubernetes, it is possible to perform a [rolling update](/docs/tasks/run-application/rolling-update-replication-controller/) by managing replication controllers directly,
or by using the deployment object, which manages the underlying replica sets for you.
Horizontal Pod Autoscaler only supports the latter approach: the Horizontal Pod Autoscaler is bound to the deployment object,
it sets the size for the deployment object, and the deployment is responsible for setting sizes of underlying replica sets.

Horizontal Pod Autoscaler does not work with rolling update using direct manipulation of replication controllers,
i.e. you cannot bind a Horizontal Pod Autoscaler to a replication controller and do rolling update (e.g. using `kubectl rolling-update`).
The reason this doesn't work is that when rolling update creates a new replication controller,
the Horizontal Pod Autoscaler will not be bound to the new replication controller.

## Support for cooldown/delay

When managing the scale of a group of replicas using the Horizontal Pod Autoscaler,
it is possible that the number of replicas keeps fluctuating frequently due to the
dynamic nature of the metrics evaluated. This is sometimes referred to as *thrashing*.

Starting from v1.6, a cluster operator can mitigate this problem by tuning
the global HPA settings exposed as flags for the `kube-controller-manager` component:

- `--horizontal-pod-autoscaler-downscale-delay`: The value for this option is a
  duration that specifies how long the autoscaler has to wait before another
  downscale operation can be performed after the current one has completed.
  The default value is 5 minutes (`5m0s`).

- `--horizontal-pod-autoscaler-upscale-delay`: The value for this option is a
  duration that specifies how long the autoscaler has to wait before another
  upscale operation can be performed after the current one has completed.
  The default value is 3 minutes (`3m0s`).

**Note**: When tuning these parameter values, a cluster operator should be aware of
the possible consequences. If the delay (cooldown) value is set too long, there
could be complaints that the Horizontal Pod Autoscaler is not responsive to workload
changes. However, if the delay value is set too short, the scale of the replicas set
may keep thrashing as usual.
{: .note}

## Support for multiple metrics

Kubernetes 1.6 adds support for scaling based on multiple metrics. You can use the `autoscaling/v2beta1` API
version to specify multiple metrics for the Horizontal Pod Autoscaler to scale on. Then, the Horizontal Pod
Autoscaler controller will evaluate each metric, and propose a new scale based on that metric. The largest of the
proposed scales will be used as the new scale.

## Support for custom metrics

**Note**: Kubernetes 1.2 added alpha support for scaling based on application-specific metrics using special annotations.
Support for these annotations was removed in Kubernetes 1.6 in favor of the new autoscaling API.  While the old method for collecting
custom metrics is still available, these metrics will not be available for use by the Horizontal Pod Autoscaler, and the former
annotations for specifying which custom metrics to scale on are no longer honored by the Horizontal Pod Autoscaler controller.

Kubernetes 1.6 adds support for making use of custom metrics in the Horizontal Pod Autoscaler.
You can add custom metrics for the Horizontal Pod Autoscaler to use in the `autoscaling/v2beta1` API.
Kubernetes then queries the new custom metrics API to fetch the values of the appropriate custom metrics.

### Requirements

To use custom metrics with your Horizontal Pod Autoscaler, you must set the necessary configurations when deploying your cluster:

* [Enable the API aggregation layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) if you have not already done so.

* Register your resource metrics API, your
custom metrics API and, optionally, external metrics API with the API aggregation layer. All of these API servers must be running *on* your cluster.

  * *Resource Metrics API*: You can use Heapster's implementation of the resource metrics API, by running Heapster with its `--api-server` flag set to true.

  * *Custom Metrics API*: This must be provided by a separate component. To get started with boilerplate code, see the [kubernetes-incubator/custom-metrics-apiserver](https://github.com/kubernetes-incubator/custom-metrics-apiserver) and the [k8s.io/metrics](https://github.com/kubernetes/metrics) repositories.

  * *External Metrics API*: Starting from Kubernetes 1.10 you can use this API if you need to autoscale on metrics not related to any Kubernetes object. Similarly to *Custom Metrics API* this must be provided by a separate component.

* Set the appropriate flags for kube-controller-manager:

  * `--horizontal-pod-autoscaler-use-rest-clients` should be true.

  * `--kubeconfig <path-to-kubeconfig>` OR `--master <ip-address-of-apiserver>`

     Note that either the `--master` or `--kubeconfig` flag can be used; `--master` will override `--kubeconfig` if both are specified. These flags specify the location of the API aggregation layer, allowing the controller manager to communicate to the API server.

     In Kubernetes 1.7, the standard aggregation layer that Kubernetes provides runs in-process with the kube-apiserver, so the target IP address can be found with `kubectl get pods --selector k8s-app=kube-apiserver --namespace kube-system -o jsonpath='{.items[0].status.podIP}'`.

## Further reading

* Design documentation: [Horizontal Pod Autoscaling](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md).
* kubectl autoscale command: [kubectl autoscale](/docs/user-guide/kubectl/{{page.version}}/#autoscale).
* Usage example of [Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
