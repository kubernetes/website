---
assignees:
- fgrzadkowski
- jszczepkowski
- directxman12
title: Horizontal Pod Autoscaling
---

This document describes the current state of Horizontal Pod Autoscaling in Kubernetes.

## What is Horizontal Pod Autoscaling?

With Horizontal Pod Autoscaling, Kubernetes automatically scales the number of pods
in a replication controller, deployment or replica set based on observed CPU utilization
(or, with alpha support, on some other, application-provided metrics).

The Horizontal Pod Autoscaler is implemented as a Kubernetes API resource and a controller.
The resource determines the behavior of the controller.
The controller periodically adjusts the number of replicas in a replication controller or deployment
to match the observed average CPU utilization to the target specified by user.

## How does the Horizontal Pod Autoscaler work?

![Horizontal Pod Autoscaler diagram](/images/docs/horizontal-pod-autoscaler.svg)

The autoscaler is implemented as a control loop
(The period of the autoscaler is controlled by `--horizontal-pod-autoscaler-sync-period` flag of controller manager.
The default value is 30 seconds).

For each HorizontalPodAutoscaler, the controller fetches the metrics that
it targets from either the resource metrics API (for per-pod resource metrics),
or the custom metrics API (for all other metrics).

For per-pod resource metrics (like CPU), the controller fetches the metrics
from the resource metrics API for each pod targeted by the HorizontalPodAutoscaler.
Then, if a target utilization value is set, the controller calculates the utilization
value as a percentage of the equivalent resource request on the containers in
each pod.  If a target raw value is set, the raw metric values are used directly.
It then takes the mean of the utilization or the raw value (depending on the type
of target specified) across all targeted pods, and produces a ratio used to scale
the number of desired replicas.

Please note that if some of the pod's containers do not have the relevant resource request set,
CPU utilization for the pod will not be defined and the autoscaler will not take any action
for that metric. Further details of the autoscaling algorithm are given [here](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/horizontal-pod-autoscaler.md#autoscaling-algorithm).

Per-pod custom metrics work similarly to per-pod resource metrics, except that they only
work with raw values, not utilization values.

Finally, for object metrics, a single metric is fetched (which describes the object
in question), and compared to the target value, to produce a ratio as above.

The HorizontalPodAutoscaler controller can fetch metrics in two different ways: direct Heapster
access, and REST client access.

In the former case, the HorizontalPodAutoscaler queries Heapster directly through the API server's
service proxy subresource.  Heapster needs to be deployed on the cluster, running in the
kube-system namespace.

More details in the latter case can be found in the section [Support for custom metrics](#prerequisites).

The autoscaler accesses corresponding replication controller, deployment or replica set by scale sub-resource.
Scale is an interface which allows to dynamically set the number of replicas and to learn the current state of them.
More details on scale sub-resource can be found [here](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/horizontal-pod-autoscaler.md#scale-subresource).


## API Object

The Horizontal Pod Autoscaler is an API resource in the Kubernetes `autoscaling` API group.
The current stable version, which only includes support for CPU autoscaling,
can be found in the `autoscaling/v1` API version.

The alpha version, which includes support for scaling on memory and custom metrics,
can be found in `autoscaling/v2alpha1`. The new fields introduced in `autoscaling/v2alpha1`
are preserved as annotations when working with `autoscaling/v1`.

More details about the API object can be found at
[HorizontalPodAutoscaler Object](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object).

## Support for Horizontal Pod Autoscaler in kubectl

Horizontal Pod Autoscaler, like every API resource, is supported in a standard way by `kubectl`.
We can create a new autoscaler using `kubectl create` command.
We can list autoscalers by `kubectl get hpa` and get detailed description by `kubectl describe hpa`.
Finally, we can delete an autoscaler using `kubectl delete hpa`.

In addition, there is a special `kubectl autoscale` command for easy creation of a Horizontal Pod Autoscaler.
For instance, executing `kubectl autoscale rc foo --min=2 --max=5 --cpu-percent=80`
will create an autoscaler for replication controller *foo*, with target CPU utilization set to `80%`
and the number of replicas between 2 and 5.
The detailed documentation of `kubectl autoscale` can be found [here](/docs/user-guide/kubectl/kubectl_autoscale).


## Autoscaling during rolling update

Currently in Kubernetes, it is possible to perform a [rolling update](/docs/user-guide/rolling-updates/) by managing replication controllers directly,
or by using the deployment object, which manages the underlying replication controllers for you.
Horizontal Pod Autoscaler only supports the latter approach: the Horizontal Pod Autoscaler is bound to the deployment object,
it sets the size for the deployment object, and the deployment is responsible for setting sizes of underlying replication controllers.

Horizontal Pod Autoscaler does not work with rolling update using direct manipulation of replication controllers,
i.e. you cannot bind a Horizontal Pod Autoscaler to a replication controller and do rolling update (e.g. using `kubectl rolling-update`).
The reason this doesn't work is that when rolling update creates a new replication controller,
the Horizontal Pod Autoscaler will not be bound to the new replication controller.

## Support for multiple metrics

Kubernetes 1.6 adds support for scaling based on multiple metrics. You can use the `autoscaling/v2alpha1` API
version to specify multiple metrics for the Horizontal Pod Autoscaler to scale on. Then, the Horizontal Pod
Autoscaler controller will evaluate each metric, and propose a new scale based on that metric. The largest of the
proposed scales will be used as the new scale.

## Support for custom metrics

**Note**: Kubernetes 1.2 added alpha support for scaling based on application-specific metrics using special annotations.
Support for this was removed in Kubernetes 1.6 in favor of the `autoscaling/v2alpha1` API.  While the old method for collecting
custom metrics is still available, these metrics will not be available for use by the Horizontal Pod Autoscaler, and the former
annotations for specifying which custom metrics to scale on are no longer honored by the Horizontal Pod Autoscaler controller.

Kubernetes 1.6 adds supports for making use of custom metrics in the Horizontal Pod Autoscaler.
You can custom metrics for the Horizontal Pod Autoscaler to use in the `autoscaling/v2alpha1` API.
Kubernetes then queries the new custom metrics API to fetch the values of the appropriate custom metrics.

### Prerequisites

In order to use custom metrics in the Horizontal Pod Autoscaler, you must have deployed the cluster with the
`--horizontal-pod-autoscaler-use-rest-clients` flag on the controller manager set to true.  You must then configure
your controller manager to speak to the API server through the API server aggregator.  The resource metrics API and
custom metrics API must also be registered with the API server aggregator, and must be served by API servers running
on the cluster.

Currently, Heapster provides an implementation of the resource metrics API when run with the `--api-server` flag set
to true. A separate component must provide the custom metrics API (more information on the custom metrics API is
available at [the k8s.io/metrics repository](https://github.com.com/kubernetes/metrics)).

## Further reading

* Design documentation: [Horizontal Pod Autoscaling](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/horizontal-pod-autoscaler.md).
* kubectl autoscale command: [kubectl autoscale](/docs/user-guide/kubectl/kubectl_autoscale).
* Usage example of [Horizontal Pod Autoscaler](/docs/user-guide/horizontal-pod-autoscaling/walkthrough/).
