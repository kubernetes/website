---
approvers:
- fgrzadkowski
- piosz
title: Core metrics pipeline
---

Resource usage metrics are important for:

- Kubernetes components to operate (e.g. autoscalers to automatically scale user applications)
- Kubernetes users to understand their applications behavior

In Kubernetes they are available through Metrics API.

## Metrics API

Metrics API provides current resource usage metrics for pods and nodes. It doesn't offer historical metrics, so one needs to
archive metrics themselves. In the future Historical API might be defined but it will not be implemented as a part of
the core metrics pipeline.

The API is discoverable through the same endpoint as the other Kubernetes APIs under `/apis/metrics.k8s.io/` path.
It also offers the same security, scalability and reliability guarantees.

The API is defined in [k8s.io/metrics](https://github.com/kubernetes/metrics/tree/master/pkg/apis/metrics) repository,
where the detailed semantic is explained.

### Supported endpoints

The list of supported endpoints in the API:

- `/nodes` - all node metrics; support for `labelSelector` parameter
- `/nodes/{node}` - metrics for the specified node
- `/namespaces/{namespace}/pods` - all pod metrics within the namespace; support for `labelSelector` parameter
- `/namespaces/{namespace}/pods/{pod}` - metrics for the specified pods

## Metrics Server

[Metrics Server](https://github.com/kubernetes-incubator/metrics-server) is a cluster-wide aggregator of monitoring data.
Starting from Kubernetes 1.8 it's work on all Kubernetes setups
and runs as a pod in a user space (on one of the nodes), similar to how any Kubernetes application would run.

It discovers all nodes in the cluster and queries usage information from Summary API exposed by [Kubelet](/docs/admin/kubelet/)s.

Metrics Server use the same authorization/authentication mechanism as the main API server. It's registered there through
[Kubernetes aggregator](https://kubernetes.io/docs/concepts/api-extension/apiserver-aggregation/).

Learn more about the metrics server in [the design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/metrics-server.md).
