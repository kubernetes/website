---
title: Good practices for Dynamic Resource Allocation as a Cluster Admin
content_type: concept
weight: 60
---

<!-- overview -->
This page describes good practices when configuring a Kubernetes cluster
utilizing Dynamic Resource Allocation (DRA). These instructions are for cluster
administrators.

<!-- body -->
## Separate permissions to DRA related APIs

DRA is orchestrated through a number of different APIs. Use authorization tools
(like RBAC, or another solution) to control access to the right APIs depending
on the persona of your user.

In general, DeviceClasses and ResourceSlices should be restricted to admins and
the DRA drivers. Cluster operators that will be deploying Pods with claims will
need access to ResourceClaim and ResourceClaimTemplate APIs; both of these APIs
are namespace scoped.

## DRA driver deployment and maintenance

DRA drivers are third-party applications that run on each node of your cluster
to interface with the hardware of that node and Kubernetes' native DRA
components. The installation procedure depends on the driver you choose, but is
likely deployed as a DaemonSet to all or a selection of the nodes (using node
selectors or similar mechanisms) in your cluster.

### Use drivers with seamless upgrade if available

DRA drivers implement the [`kubeletplugin` package
interface](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin).
Your driver may support _seamless upgrades_ by implementing a property of this
interface that allows two versions of the same DRA driver to coexist for a short
time. This is only available for kubelet versions 1.33 and above and may not be
supported by your driver for heterogeneous clusters with attached nodes running
older versions of Kubernetes - check your driver's documentation to be sure.

If seamless upgrades are available for your situation, consider using it to
minimize scheduling delays when your driver updates.

If you cannot use seamless upgrades, during driver downtime for upgrades you may
observe that:
* Pods cannot start unless the claims they depend on were already prepared for
  use.
* Cleanup after the last pod which used a claim gets delayed until the driver is
  available again. The pod is not marked as terminated. This prevents reusing
  the resources used by the pod for other pods.
* Running pods will continue to run.

### Confirm your DRA driver exposes a liveness probe and utilize it

Your DRA driver likely implements a gRPC socket for healthchecks as part of DRA
driver good practices. The easiest way to utilize this grpc socket is to
configure it as a liveness probe for the DaemonSet deploying your DRA driver.
Your driver's documentation or deployment tooling may already include this, but
if you are building your configuration separately or not running your DRA driver
as a Kubernetes pod, be sure that your orchestration tooling restarts the DRA
driver on failed healthchecks to this grpc socket. Doing so will minimize any
accidental downtime of the DRA driver and give it more opportunities to self
heal, reducing scheduling delays or troubleshooting time.

### When draining a node, drain the DRA driver as late as possible

The DRA driver is responsible for unpreparing any devices that were allocated to
Pods, and if the DRA driver is {{< glossary_tooltip text="drained"
term_id="drain" >}} before Pods with claims have been deleted, it will not be
able to finalize its cleanup. If you implement custom drain logic for nodes,
consider checking that there are no allocated/reserved ResourceClaim or
ResourceClaimTemplates before terminating the DRA driver itself.


## Monitor and tune components for higher load, especially in high scale environments

Control plane component {{< glossary_tooltip text="kube-scheduler"
term_id="kube-scheduler" >}} and the internal ResourceClaim controller
orchestrated by the component {{< glossary_tooltip
text="kube-controller-manager" term_id="kube-controller-manager" >}} do the
heavy lifting during scheduling of Pods with claims based on metadata stored in
the DRA APIs. Compared to non-DRA scheduled Pods, the number of API server
calls, memory, and CPU utilization needed by these components is increased for
Pods using DRA claims. In addition, node local components like the DRA driver
and kubelet utilize DRA APIs to allocated the hardware request at Pod sandbox
creation time. Especially in high scale environments where clusters have many
nodes, and/or deploy many workloads that heavily utilize DRA defined resource
claims, the cluster administrator should configure the relevant components to
anticipate the increased load. 

The effects of mistuned components can have direct or snowballing affects
causing different symptoms during the Pod lifecycle. If the `kube-scheduler`
component's QPS and burst configurations are too low, the scheduler might
quickly identify a suitable node for a Pod but take longer to bind the Pod to
that node. With DRA, during Pod scheduling, the QPS and Burst parameters in the
client-go configuration within `kube-controller-manager` are critical.

The specific values to tune your cluster to depend on a variety of factors like
number of nodes/pods, rate of pod creation, churn, even in non-DRA environments;
see the [SIG Scalability README on Kubernetes scalability
 thresholds](https://github.com/kubernetes/community/blob/master/sig-scalability/configs-and-limits/thresholds.md)
for more information. In scale tests performed against a DRA enabled cluster
with 100 nodes, involving 720 long-lived pods (90% saturation) and 80 churn pods
(10% churn, 10 times), with a job creation QPS of 10, `kube-controller-manager`
QPS could be set to as low as 75 and Burst to 150 to meet equivalent metric
targets for non-DRA deployments. At this lower bound, it was observed that the
client side rate limiter was triggered enough to protect the API server from
explosive burst but was high enough that pod startup SLOs were not impacted.
While this is a good starting point, you can get a better idea of how to tune
the different components that have the biggest effect on DRA performance for
your deployment by monitoring the following metrics. For more information on all
the stable metrics in Kubernetes, see the [Kubernetes Metrics
Reference](/docs/reference/generated/metrics/).

### `kube-controller-manager` metrics

The following metrics look closely at the internal ResourceClaim controller
managed by the `kube-controller-manager` component.

* Workqueue Add Rate: Monitor {{< highlight promql "hl_inline=true"  >}} sum(rate(workqueue_adds_total{name="resource_claim"}[5m])) {{< /highlight >}} to gauge how quickly items are added to the ResourceClaim controller.
* Workqueue Depth: Track
  {{< highlight promql "hl_inline=true" >}}sum(workqueue_depth{endpoint="kube-controller-manager",
  name="resource_claim"}){{< /highlight >}} to identify any backlogs in the ResourceClaim
  controller.
* Workqueue Work Duration: Observe {{< highlight promql "hl_inline=true">}}histogram_quantile(0.99,
  sum(rate(workqueue_work_duration_seconds_bucket{name="resource_claim"}[5m]))
  by (le)){{< /highlight >}} to understand the speed at which the ResourceClaim controller
  processes work.

If you are experiencing low Workqueue Add Rate, high Workqueue Depth, and/or
high Workqueue Work Duration, this suggests the controller isn't performing
optimally. Consider tuning parameters like QPS, burst, and CPU/memory
configurations.

If you are experiencing high Workequeue Add Rate, high Workqueue Depth, but
reasonable Workqueue Work Duration, this indicates the controller is processing
work, but concurrency might be insufficient. Concurrency is hardcoded in the
controller, so as a cluster administrator, you can tune for this by reducing the
pod creation QPS, so the add rate to the resource claim workqueue is more
manageable.

### `kube-scheduler` metrics

The following scheduler metrics are high level metrics aggregating performance
across all Pods scheduled, not just those using DRA. It is important to note
that the end-to-end metrics are ultimately influenced by the
`kube-controller-manager`'s performance in creating ResourceClaims from
ResourceClainTemplates in deployments that heavily use ResourceClainTemplates.

* Scheduler End-to-End Duration: Monitor {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(increase(scheduler_pod_scheduling_sli_duration_seconds_bucket[5m])) by
  (le)){{< /highlight >}}.
* Scheduler Algorithm Latency: Track {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(increase(scheduler_scheduling_algorithm_duration_seconds_bucket[5m])) by
  (le)){{< /highlight >}}.

### `kubelet` metrics

When a Pod bound to a node must have a ResourceClaim satisfied, kubelet calls
the `NodePrepareResources` and `NodeUnprepareResources` methods of the DRA
driver. You can observe this behavior from the kubelet's point of view with the
following metrics.

* Kubelet NodePrepareResources: Monitor {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(rate(dra_operations_duration_seconds_bucket{operation_name="PrepareResources"}[5m]))
  by (le)){{< /highlight >}}.
* Kubelet NodeUnprepareResources: Track {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(rate(dra_operations_duration_seconds_bucket{operation_name="UnprepareResources"}[5m]))
  by (le)){{< /highlight >}}.

### DRA kubeletplugin operations

DRA drivers implement the [`kubeletplugin` package
interface](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
which surfaces its own metric for the underlying gRPC operation
`NodePrepareResources` and `NodeUnprepareResources`. You can observe this
behavior from the point of view of the internal kubeletplugin with the following
metrics.

* DRA kubeletplugin gRPC NodePrepareResources operation: Observe {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodePrepareResources"}[5m]))
  by (le)){{< /highlight >}}.
* DRA kubeletplugin gRPC NodeUnprepareResources operation: Observe {{< highlight promql "hl_inline=true" >}} histogram_quantile(0.99,
  sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodeUnprepareResources"}[5m]))
  by (le)){{< /highlight >}}.


## {{% heading "whatsnext" %}}

* [Learn more about
  DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
* Read the [Kubernetes Metrics
Reference](/docs/reference/generated/metrics/)