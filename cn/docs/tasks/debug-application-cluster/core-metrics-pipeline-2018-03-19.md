---
reviewers:
- fgrzadkowski
- piosz
title: Core metrics pipeline
---

Starting from Kubernetes 1.8, resource usage metrics, such as container CPU and memory usage,
are available in Kubernetes through the Metrics API. These metrics can be either accessed directly
by user, for example by using `kubectl top` command, or used by a controller in the cluster, e.g.
Horizontal Pod Autoscaler, to make decisions.

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

**Note:** The API requires metrics server to be deployed in the cluster. Otherwise it will be not available.

## Metrics Server

[Metrics Server](https://github.com/kubernetes-incubator/metrics-server) is a cluster-wide aggregator of resource usage data.
Starting from Kubernetes 1.8 it's deployed by default in clusters created by `kube-up.sh` script
as a Deployment object. If you use a different Kubernetes setup mechanism you can deploy it using the provided
[deployment yamls](https://github.com/kubernetes-incubator/metrics-server/tree/master/deploy).
It's supported in Kubernetes 1.7+ (see details below).

Metric server collects metrics from the Summary API, exposed by [Kubelet](/docs/admin/kubelet/) on each node.

Metrics Server registered in the main API server through
[Kubernetes aggregator](https://kubernetes.io/docs/concepts/api-extension/apiserver-aggregation/),
which was introduced in Kubernetes 1.7.

Learn more about the metrics server in [the design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md).
