---
reviewers:
- fgrzadkowski
- jszczepkowski
- directxman12
title: Horizontal Pod Autoscaler
feature:
  title: Horizontal scaling
  description: >
    Scale your application up and down with a simple command, with a UI, or automatically based on CPU usage.

content_template: templates/concept
weight: 90
---

{{% capture overview %}}

The Horizontal Pod Autoscaler automatically scales the number of pods
in a replication controller, deployment or replica set based on observed CPU utilization (or, with
[custom metrics](https://git.k8s.io/community/contributors/design-proposals/instrumentation/custom-metrics-api.md)
support, on some other application-provided metrics). Note that Horizontal
Pod Autoscaling does not apply to objects that can't be scaled, for example, DaemonSets.

The Horizontal Pod Autoscaler is implemented as a Kubernetes API resource and a controller.
The resource determines the behavior of the controller.
The controller periodically adjusts the number of replicas in a replication controller or deployment
to match the observed average CPU utilization to the target specified by user.

{{% /capture %}}


{{% capture body %}}

## How does the Horizontal Pod Autoscaler work?

![Horizontal Pod Autoscaler diagram](/images/docs/horizontal-pod-autoscaler.svg)

The Horizontal Pod Autoscaler is implemented as a control loop, with a period controlled
by the controller manager's `--horizontal-pod-autoscaler-sync-period` flag (with a default
value of 15 seconds).

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
  CPU utilization for the pod will not be defined and the autoscaler will
  not take any action for that metric. See the [algorithm
  details](#algorithm-details) section below for more information about
  how the autoscaling algorithm works.

* For per-pod custom metrics, the controller functions similarly to per-pod resource metrics,
  except that it works with raw values, not utilization values.

* For object metrics and external metrics, a single metric is fetched, which describes
  the object in question. This metric is compared to the target
  value, to produce a ratio as above. In the `autoscaling/v2beta2` API
  version, this value can optionally be divided by the number of pods before the
  comparison is made.

The HorizontalPodAutoscaler normally fetches metrics from a series of aggregated APIs (`metrics.k8s.io`,
`custom.metrics.k8s.io`, and `external.metrics.k8s.io`).  The `metrics.k8s.io` API is usually provided by
metrics-server, which needs to be launched separately. See
[metrics-server](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server)
for instructions. The HorizontalPodAutoscaler can also fetch metrics directly from Heapster.

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="1.11" >}}
Fetching metrics from Heapster is deprecated as of Kubernetes 1.11.
{{< /note >}}

See [Support for metrics APIs](#support-for-metrics-apis) for more details.

The autoscaler accesses corresponding scalable controllers (such as replication controllers, deployments, and replica sets)
by using the scale sub-resource. Scale is an interface that allows you to dynamically set the number of replicas and examine
each of their current states. More details on scale sub-resource can be found
[here](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource).

### Algorithm Details

From the most basic perspective, the Horizontal Pod Autoscaler controller
operates on the ratio between desired metric value and current metric
value:

```
desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]
```

For example, if the current metric value is `200m`, and the desired value
is `100m`, the number of replicas will be doubled, since `200.0 / 100.0 ==
2.0` If the current value is instead `50m`, we'll halve the number of
replicas, since `50.0 / 100.0 == 0.5`.  We'll skip scaling if the ratio is
sufficiently close to 1.0 (within a globally-configurable tolerance, from
the `--horizontal-pod-autoscaler-tolerance` flag, which defaults to 0.1).

When a `targetAverageValue` or `targetAverageUtilization` is specified,
the `currentMetricValue` is computed by taking the average of the given
metric across all Pods in the HorizontalPodAutoscaler's scale target.
Before checking the tolerance and deciding on the final values, we take
pod readiness and missing metrics into consideration, however.

All Pods with a deletion timestamp set (i.e. Pods in the process of being
shut down) and all failed Pods are discarded.

If a particular Pod is missing metrics, it is set aside for later; Pods
with missing metrics will be used to adjust the final scaling amount.

When scaling on CPU, if any pod has yet to become ready (i.e. it's still
initializing) *or* the most recent metric point for the pod was before it
became ready, that pod is set aside as well.

Due to technical constraints, the HorizontalPodAutoscaler controller
cannot exactly determine the first time a pod becomes ready when
determining whether to set aside certain CPU metrics. Instead, it
considers a Pod "not yet ready" if it's unready and transitioned to
unready within a short, configurable window of time since it started.
This value is configured with the `--horizontal-pod-autoscaler-initial-readiness-delay` flag, and its default is 30
seconds.  Once a pod has become ready, it considers any transition to
ready to be the first if it occurred within a longer, configurable time
since it started. This value is configured with the `--horizontal-pod-autoscaler-cpu-initialization-period` flag, and its
default is 5 minutes.

The `currentMetricValue / desiredMetricValue` base scale ratio is then
calculated using the remaining pods not set aside or discarded from above.

If there were any missing metrics, we recompute the average more
conservatively, assuming those pods were consuming 100% of the desired
value in case of a scale down, and 0% in case of a scale up.  This dampens
the magnitude of any potential scale.

Furthermore, if any not-yet-ready pods were present, and we would have
scaled up without factoring in missing metrics or not-yet-ready pods, we
conservatively assume the not-yet-ready pods are consuming 0% of the
desired metric, further dampening the magnitude of a scale up.

After factoring in the not-yet-ready pods and missing metrics, we
recalculate the usage ratio.  If the new ratio reverses the scale
direction, or is within the tolerance, we skip scaling.  Otherwise, we use
the new ratio to scale.

Note that the *original* value for the average utilization is reported
back via the HorizontalPodAutoscaler status, without factoring in the
not-yet-ready pods or missing metrics, even when the new usage ratio is
used.

If multiple metrics are specified in a HorizontalPodAutoscaler, this
calculation is done for each metric, and then the largest of the desired
replica counts is chosen. If any of these metrics cannot be converted
into a desired replica count (e.g. due to an error fetching the metrics
from the metrics APIs) and a scale down is suggested by the metrics which
can be fetched, scaling is skipped. This means that the HPA is still capable
of scaling up if one or more metrics give a `desiredReplicas` greater than
the current value.

Finally, just before HPA scales the target, the scale recommendation is recorded.  The
controller considers all recommendations within a configurable window choosing the
highest recommendation from within that window. This value can be configured using the `--horizontal-pod-autoscaler-downscale-stabilization` flag, which defaults to 5 minutes.
This means that scaledowns will occur gradually, smoothing out the impact of rapidly
fluctuating metric values.

## API Object

The Horizontal Pod Autoscaler is an API resource in the Kubernetes `autoscaling` API group.
The current stable version, which only includes support for CPU autoscaling,
can be found in the `autoscaling/v1` API version.

The beta version, which includes support for scaling on memory and custom metrics,
can be found in `autoscaling/v2beta2`. The new fields introduced in `autoscaling/v2beta2`
are preserved as annotations when working with `autoscaling/v1`.

More details about the API object can be found at
[HorizontalPodAutoscaler Object](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object).

## Support for Horizontal Pod Autoscaler in kubectl

Horizontal Pod Autoscaler, like every API resource, is supported in a standard way by `kubectl`.
We can create a new autoscaler using `kubectl create` command.
We can list autoscalers by `kubectl get hpa` and get detailed description by `kubectl describe hpa`.
Finally, we can delete an autoscaler using `kubectl delete hpa`.

In addition, there is a special `kubectl autoscale` command for easy creation of a Horizontal Pod Autoscaler.
For instance, executing `kubectl autoscale rs foo --min=2 --max=5 --cpu-percent=80`
will create an autoscaler for replication set *foo*, with target CPU utilization set to `80%`
and the number of replicas between 2 and 5.
The detailed documentation of `kubectl autoscale` can be found [here](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).


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

Starting from v1.12, a new algorithmic update removes the need for the
upscale delay.

- `--horizontal-pod-autoscaler-downscale-stabilization`: The value for this option is a
  duration that specifies how long the autoscaler has to wait before another
  downscale operation can be performed after the current one has completed.
  The default value is 5 minutes (`5m0s`).

{{< note >}}
When tuning these parameter values, a cluster operator should be aware of the possible
consequences. If the delay (cooldown) value is set too long, there could be complaints
that the Horizontal Pod Autoscaler is not responsive to workload changes. However, if
the delay value is set too short, the scale of the replicas set may keep thrashing as
usual.
{{< /note >}}

## Support for multiple metrics

Kubernetes 1.6 adds support for scaling based on multiple metrics. You can use the `autoscaling/v2beta2` API
version to specify multiple metrics for the Horizontal Pod Autoscaler to scale on. Then, the Horizontal Pod
Autoscaler controller will evaluate each metric, and propose a new scale based on that metric. The largest of the
proposed scales will be used as the new scale.

## Support for custom metrics

{{< note >}}
Kubernetes 1.2 added alpha support for scaling based on application-specific metrics using special annotations.
Support for these annotations was removed in Kubernetes 1.6 in favor of the new autoscaling API.  While the old method for collecting
custom metrics is still available, these metrics will not be available for use by the Horizontal Pod Autoscaler, and the former
annotations for specifying which custom metrics to scale on are no longer honored by the Horizontal Pod Autoscaler controller.
{{< /note >}}

Kubernetes 1.6 adds support for making use of custom metrics in the Horizontal Pod Autoscaler.
You can add custom metrics for the Horizontal Pod Autoscaler to use in the `autoscaling/v2beta2` API.
Kubernetes then queries the new custom metrics API to fetch the values of the appropriate custom metrics.

See [Support for metrics APIs](#support-for-metrics-apis) for the requirements.

## Support for metrics APIs

By default, the HorizontalPodAutoscaler controller retrieves metrics from a series of APIs.  In order for it to access these
APIs, cluster administrators must ensure that:

* The [API aggregation layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) is enabled.

* The corresponding APIs are registered:

   * For resource metrics, this is the `metrics.k8s.io` API, generally provided by [metrics-server](https://github.com/kubernetes-incubator/metrics-server).
     It can be launched as a cluster addon.

   * For custom metrics, this is the `custom.metrics.k8s.io` API.  It's provided by "adapter" API servers provided by metrics solution vendors.
     Check with your metrics pipeline, or the [list of known solutions](https://github.com/kubernetes/metrics/blob/master/IMPLEMENTATIONS.md#custom-metrics-api).
     If you would like to write your own, check out the [boilerplate](https://github.com/kubernetes-incubator/custom-metrics-apiserver) to get started.

   * For external metrics, this is the `external.metrics.k8s.io` API.  It may be provided by the custom metrics adapters provided above.

* The `--horizontal-pod-autoscaler-use-rest-clients` is `true` or unset.  Setting this to false switches to Heapster-based autoscaling, which is deprecated.

For more information on these different metrics paths and how they differ please see the relevant design proposals for
[the HPA V2](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/autoscaling/hpa-v2.md),
[custom.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/custom-metrics-api.md)
and [external.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/external-metrics-api.md).

For examples of how to use them see [the walkthrough for using custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)
and [the walkthrough for using external metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-metrics-not-related-to-kubernetes-objects).

{{% /capture %}}

{{% capture whatsnext %}}

* Design documentation: [Horizontal Pod Autoscaling](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md).
* kubectl autoscale command: [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
* Usage example of [Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).

{{% /capture %}}
