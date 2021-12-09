---
reviewers:
- fgrzadkowski
- piosz
title: Resource metrics pipeline
content_type: concept
---

<!-- overview -->

Resource usage metrics, such as container CPU and memory usage,
are available in Kubernetes through the Metrics API. These metrics can be accessed either directly
by the user with the `kubectl top` command, or by a controller in the cluster, for example
Horizontal Pod Autoscaler, to make decisions.

<!-- body -->

## The Metrics API

Through the Metrics API, you can get the amount of resource currently used
by a given node or a given pod. This API doesn't store the metric values,
so it's not possible, for example, to get the amount of resources used by a
given node 10 minutes ago.

The API is no different from any other API:

- it is discoverable through the same endpoint as the other Kubernetes APIs under the path: `/apis/metrics.k8s.io/`
- it offers the same security, scalability, and reliability guarantees

The API is defined in [k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go)
repository. You can find more information about the API there.

{{< note >}}
The API requires the metrics server to be deployed in the cluster. Otherwise it will be not available.
{{< /note >}}

## Measuring Resource Usage

### CPU

CPU is reported as the average usage, in
[CPU cores](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu),
over a period of time. This value is derived by taking a rate over a cumulative CPU counter
provided by the kernel (in both Linux and Windows kernels).
The kubelet chooses the window for the rate calculation.

### Memory

Memory is reported as the working set, in bytes, at the instant the metric was collected.
In an ideal world, the "working set" is the amount of memory in-use that cannot be freed under memory pressure.
However, calculation of the working set varies by host OS, and generally makes heavy use of heuristics to produce an estimate.
It includes all anonymous (non-file-backed) memory since Kubernetes does not support swap.
The metric typically also includes some cached (file-backed) memory, because the host OS cannot always reclaim such pages.

## Metrics Server

[Metrics Server](https://github.com/kubernetes-sigs/metrics-server) is a cluster-wide aggregator of resource usage data.
By default, it is deployed in clusters created by `kube-up.sh` script
as a Deployment object. If you use a different Kubernetes setup mechanism, you can deploy it using the provided
[deployment components.yaml](https://github.com/kubernetes-sigs/metrics-server/releases) file.

Metrics Server collects metrics from the Summary API, exposed by
[Kubelet](/docs/reference/command-line-tools-reference/kubelet/) on each node, and is registered with the main API server via
[Kubernetes aggregator](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).

Learn more about the metrics server in
[the design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md).

### Summary API Source
The [Kubelet](/docs/reference/command-line-tools-reference/kubelet/) gathers stats at node, volume, pod and container level, and omits
them in the [Summary API](https://github.com/kubernetes/kubernetes/blob/7d309e0104fedb57280b261e5677d919cb2a0e2d/staging/src/k8s.io/kubelet/pkg/apis/stats/v1alpha1/types.go)
for consumers to read.

Pre-1.23, these resources have been primarily gathered from [cAdvisor](https://github.com/google/cadvisor). However, in 1.23 with the
introduction of the `PodAndContainerStatsFromCRI` FeatureGate, container and pod level stats can be gathered by the CRI implementation.
Note: this also requires support from the CRI implementations (containerd >= 1.6.0, CRI-O >= 1.23.0).
