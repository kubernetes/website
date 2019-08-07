---
title: Horizontal Pod Autoscaler
content_template: templates/concept
---

{{% capture overview %}}

The Horizontal Pod Autoscaler automatically scales the number of Pods
in a {{< glossary_tooltip text="Deployment" term_id="deployment" >}}, {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} or other scalable resource.
This controller scales the number of Pods based on observed CPU utilization (or, with
[custom metrics](https://git.k8s.io/community/contributors/design-proposals/instrumentation/custom-metrics-api.md)
support, on some other application-provided metrics).

{{% /capture %}}
{{% capture body %}}

## Automatic scaling

The controller periodically adjusts the number of replicas in Deployment (or ReplicationController),
so as to to match the observed average resource utilization to the target specified by user.

![Horizontal Pod Autoscaler diagram](/images/docs/horizontal-pod-autoscaler.svg)

The Horizontal Pod Autoscaler is implemented as a control loop, with a period controlled
by the controller manager's `--horizontal-pod-autoscaler-sync-period` flag.
The default synchronization period is 15 seconds.

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

  If some of the Pod's containers do not have the relevant resource request set,
  CPU utilization for the pod will not be defined and the autoscaler will
  not take any action for that metric. See [algorithm
  details](#algorithm-details) for more information about
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

The autoscaler accesses corresponding scalable controllers (such as replication controllers,
deployments, and replica sets) by using the scale sub-resource. Scale is an interface that
allows you to dynamically set the number of replicas and examine each of their current states.

## Algorithm Details

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

The controller ignores failed Pods and Pods with a deletion timestamp set.
If Pods have a deletion timestamp set, it means they are in the process
of being shut down.

If a particular Pod is missing metrics, it is set aside for later; Pods
with missing metrics will be used to adjust the final scaling amount.

When scaling on CPU, if any Pod has yet to become ready (i.e. it's still
initializing) *or* the most recent metric point for the Pod was recorded
before the Pod became ready, that Pod is set aside as well.

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

{{< note >}}
The *original* value for the average utilization is reported
back via the HorizontalPodAutoscaler status, without factoring in the
not-yet-ready pods or missing metrics, even when the new usage ratio is
used.
{{< /note >}}

### Multiple metrics

If multiple metrics are specified in a HorizontalPodAutoscaler, this
calculation is done for each metric, and then the largest of the desired
replica counts is chosen.  If any of those metrics cannot be converted
into a desired replica count (e.g. due to an error fetching the metrics
from the metrics APIs), scaling is skipped.

Finally, just before HPA scales the target, the scale recommendation is recorded.  The
controller considers all recommendations within a configurable window choosing the
highest recommendation from within that window. You can configure this value via the
`--horizontal-pod-autoscaler-downscale-stabilization` flag, which defaults to 5 minutes.

This means that scaledowns will occur gradually, smoothing out the impact of rapidly
fluctuating metric values.

{{% /capture %}}
{{% capture whatsnext %}}

* Read the design proposal for [scale subresources](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource)

{{% /capture %}}
