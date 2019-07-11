---
toc_hide: true
title: Horizontal Pod Autoscaler
content_template: templates/concept
---

{{% capture overview %}}

A HorizontalPodAutoscaler automatically scales the number of
{{< glossary_tooltip text="Pods" term_id="pod" >}}
in a {{< glossary_tooltip text="Deployment," term_id="deployment" >}}
{{< glossary_tooltip text="StatefulSet," term_id="statefulset" >}} or other scalable resource.

This {{< glossary_tooltip term_id="controller" text="controller" >}} scales the
number of Pods based on observed metrics.

{{% /capture %}}
{{% capture body %}}

The HorizontalPodAutoscaler controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

The controller periodically adjusts the number of replicas for a workload resource,
so as to to match the observed average resource utilization to the target you specified.

## Controller behavior

This controller runs as an continuous control loop that takes measurements over a period
controlled by kube-controller-manager's `--horizontal-pod-autoscaler-sync-period` flag.
The default synchronization period is 15 seconds.

During each period, the Horizontal Pod Autoscaler queries the resource utilization against the
metrics specified in each HorizontalPodAutoscaler resource. The controller
obtains the metrics from either the resource metrics API (for per-Pod resource metrics),
or the custom metrics API (for all other metrics).

* For per-Pod resource metrics, like CPU, this controller fetches the metrics
  from the resource metrics API for each Pod that the HorizontalPodAutoscaler object
  targets.
  Then, if a target utilization value is set, the controller calculates the utilization
  value as a percentage of the equivalent resource request on the containers in
  each pod.  If a target raw value is set, the raw metric values are used directly.
  This controller takes the mean of the utilization or the raw value (depending on the type
  of target specified) across all targeted Pods, and produces a ratio used to scale
  the number of desired replicas.

  If some of the Pod's containers do not have the relevant resource request set,
  CPU utilization for the Pod will not be defined and the autoscaler will
  not take any action for that metric. See
  [algorithm details](/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details) for
  more information about autoscaling works.

* For per-Pod custom metrics, this controller functions similarly to per-Pod resource metrics,
  except that it works with raw values, not utilization values.

* For object metrics and external metrics, this controller fetches a single metric that
  describes the object in question. Optionally (based on the HorizontalPodAutoscaler spec),
  this controller divides the fetched value by the number of Pods. Next, the controller compares
  the processed metric value against its configured target.

The HorizontalPodAutoscaler conteoller accesses corresponding scalable resources
(such as Deployments and ReplicaSets) by using their `scale` sub-resource.

## Multiple metrics

If multiple metrics are specified in a HorizontalPodAutoscaler, the controller
calculates scaling for each metric and then combines those scale values,
choosing the largest. If the controller cannot determine a desired replica
count based on any metric, it skips scaling.
For example, this could be due to an error fetching a single metric.

## Smoothing

Before this controller updates the target's scale, it records a
_scale recommendation_ is recorded.  The controller considers all scale
 recommendations within a window, choosing the highest scale recommendation
from within that window.

This windowing smooths out the impact of rapidly fluctuating metric values.

{{% /capture %}}
{{% capture whatsnext %}}

* Read about other [Pod management controllers](/docs/reference/controllers/pod-management-controllers/)
* Read the design proposal for [scale subresources](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource)

{{% /capture %}}
