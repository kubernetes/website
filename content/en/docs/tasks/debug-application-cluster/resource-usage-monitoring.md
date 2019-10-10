---
reviewers:
- mikedanese
content_template: templates/concept
title: Tools for Monitoring Resources
---

{{% capture overview %}}

To scale an application and provide a reliable service, you need to
understand how the application behaves when it is deployed. You can examine
application performance in a Kubernetes cluster by examining the containers,
[pods](/docs/user-guide/pods), [services](/docs/user-guide/services), and
the characteristics of the overall cluster. Kubernetes provides detailed
information about an application's resource usage at each of these levels.
This information allows you to evaluate your application's performance and
where bottlenecks can be removed to improve overall performance.

{{% /capture %}}

{{% capture body %}}

In Kubernetes, application monitoring does not depend on a single monitoring solution. On new clusters, you can use [resource metrics](#resource-metrics-pipeline) or [full metrics](#full-metrics-pipeline) pipelines to collect monitoring statistics.

## Resource metrics pipeline

The resource metrics pipeline provides a limited set of metrics related to
cluster components such as the [Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale) controller, as well as the `kubectl top` utility.
These  metrics are collected by the lightweight, short-term, in-memory 
[metrics-server](https://github.com/kubernetes-incubator/metrics-server) and
 are exposed via the `metrics.k8s.io` API. 

metrics-server discovers all nodes on the cluster and 
queries each node's 
[kubelet](/docs/reference/command-line-tools-reference/kubelet) for CPU and 
memory usage. The kubelet acts as a bridge between the Kubernetes master and 
the nodes, managing the pods and containers running on a machine. The kubelet 
translates each pod into its constituent containers and fetches individual 
container usage statistics from the container runtime through the container 
runtime interface. The kubelet fetches this information from the integrated 
cAdvisor for the legacy Docker integration.  It then exposes the aggregated pod 
resource usage statistics through the metrics-server Resource Metrics API.
This API is served at `/metrics/resource/v1beta1` on the kubelet's authenticated and 
read-only ports. 

## Full metrics pipeline

A full metrics pipeline gives you access to richer metrics. Kubernetes can
respond to these metrics by  automatically scaling or adapting the cluster
based on its current state, using mechanisms such as the Horizontal Pod
Autoscaler. The monitoring pipeline fetches metrics from the kubelet and
then exposes them to Kubernetes via an adapter by implementing either the
`custom.metrics.k8s.io` or `external.metrics.k8s.io` API. 

[Prometheus](https://prometheus.io), a CNCF project, can natively monitor Kubernetes, nodes, and Prometheus itself.
Full metrics pipeline projects that are not part of the CNCF are outside the scope of Kubernetes documentation.  

{{% /capture %}}
