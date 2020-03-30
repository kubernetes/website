---
reviewers:
- fgrzadkowski
- piosz
title: Resource metrics pipeline
content_template: templates/concept
---

{{% capture overview %}}

Resource usage metrics, such as container CPU and memory usage,
are available in Kubernetes through the Metrics API. These metrics can be either accessed directly
by user, for example by using `kubectl top` command, or used by a controller in the cluster, e.g.
Horizontal Pod Autoscaler, to make decisions.

{{% /capture %}}


{{% capture body %}}

## The Metrics API

Through the Metrics API you can get the amount of resource currently used
by a given node or a given pod. This API doesn't store the metric values,
so it's not possible for example to get the amount of resources used by a
given node 10 minutes ago.

The API is no different from any other API:

- it is discoverable through the same endpoint as the other Kubernetes APIs under `/apis/metrics.k8s.io/` path
- it offers the same security, scalability and reliability guarantees

The API is defined in [k8s.io/metrics](https://github.com/kubernetes/metrics/blob/master/pkg/apis/metrics/v1beta1/types.go)
repository. You can find more information about the API there.

{{< note >}}
The API requires metrics server to be deployed in the cluster. Otherwise it will be not available.
{{< /note >}}

## Measuring Resource Usage

### CPU

CPU is reported as the average usage, in [CPU cores](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#meaning-of-cpu), over a period of time. This value is derived by taking a rate over a cumulative CPU counter provided by the kernel (in both Linux and Windows kernels). The kubelet chooses the window  for the rate calculation.

### Memory

Memory is reported as the working set, in bytes, at the instant the metric was collected. In an ideal world, the "working set" is the amount of memory in-use that cannot be freed under memory pressure.  However, calculation of the working set varies by host OS, and generally makes heavy use of heuristics to produce an estimate.  It includes all anonymous (non-file-backed) memory since kubernetes does not support swap. The metric typically also includes some cached (file-backed) memory, because the host OS cannot always reclaim such pages.

## Metrics Server

[Metrics Server](https://github.com/kubernetes-incubator/metrics-server) is a cluster-wide aggregator of resource usage data.
It is deployed by default in clusters created by `kube-up.sh` script
as a Deployment object. If you use a different Kubernetes setup mechanism you can deploy it using the provided
[deployment yamls](https://github.com/kubernetes-incubator/metrics-server/tree/master/deploy).

Metric server collects metrics from the Summary API, exposed by [Kubelet](/docs/admin/kubelet/) on each node.

Metrics Server is registered with the main API server through
[Kubernetes aggregator](/docs/concepts/api-extension/apiserver-aggregation/).

Learn more about the metrics server in [the design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md).

{{% /capture %}}
