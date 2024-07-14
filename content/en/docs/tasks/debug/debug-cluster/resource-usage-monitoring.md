---
reviewers:
- mikedanese
content_type: concept
title: Tools for Monitoring Resources
weight: 15
---

<!-- overview -->

To scale an application and provide a reliable service, you need to
understand how the application behaves when it is deployed. You can examine
application performance in a Kubernetes cluster by examining the containers,
[pods](/docs/concepts/workloads/pods/),
[services](/docs/concepts/services-networking/service/), and
the characteristics of the overall cluster. Kubernetes provides detailed
information about an application's resource usage at each of these levels.
This information allows you to evaluate your application's performance and
where bottlenecks can be removed to improve overall performance. 

<!-- body -->

In Kubernetes, application monitoring does not depend on a single monitoring solution.
On new clusters, you can use [resource metrics](#resource-metrics-pipeline) or
[full metrics](#full-metrics-pipeline) pipelines to collect monitoring statistics.

## Resource metrics pipeline

The resource metrics pipeline provides a limited set of metrics related to
cluster components such as the
[Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/)
controller, as well as the `kubectl top` utility.
These  metrics are collected by the lightweight, short-term, in-memory 
[metrics-server](https://github.com/kubernetes-sigs/metrics-server) and
 are exposed via the `metrics.k8s.io` API. 

metrics-server discovers all nodes on the cluster and 
queries each node's 
[kubelet](/docs/reference/command-line-tools-reference/kubelet/) for CPU and 
memory usage. The kubelet acts as a bridge between the Kubernetes master and 
the nodes, managing the pods and containers running on a machine. The kubelet 
translates each pod into its constituent containers and fetches individual 
container usage statistics from the container runtime through the container 
runtime interface. If you use a container runtime that uses Linux cgroups and
namespaces to implement containers, and the container runtime does not publish
usage statistics, then the kubelet can look up those statistics directly
(using code from [cAdvisor](https://github.com/google/cadvisor)).
No matter how those statistics arrive, the kubelet then exposes the aggregated pod
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


Kubernetes is designed to work with [OpenMetrics](https://openmetrics.io/), 
which is one of the
[CNCF Observability and Analysis - Monitoring Projects](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#observability-and-analysis--monitoring),
built upon and carefully extending [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/)
in almost 100% backwards-compatible ways.

If you glance over at the
[CNCF Landscape](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#observability-and-analysis--monitoring),
you can see a number of monitoring projects that can work with Kubernetes by _scraping_
metric data and using that to help you observe your cluster. It is up to you to select the tool
or tools that suit your needs. The CNCF landscape for observability and analytics includes a
mix of open-source software, paid-for software-as-a-service, and other commercial products.

When you design and implement a full metrics pipeline you can make that monitoring data
available back to Kubernetes. For example, a HorizontalPodAutoscaler can use the processed
metrics to work out how many Pods to run for a component of your workload.

Integration of a full metrics pipeline into your Kubernetes implementation is outside
the scope of Kubernetes documentation because of the very wide scope of possible
solutions.

The choice of monitoring platform depends heavily on your needs, budget, and technical resources.
Kubernetes does not recommend any specific metrics pipeline; [many options](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#observability-and-analysis--monitoring) are available.
Your monitoring system should be capable of handling the [OpenMetrics](https://openmetrics.io/) metrics
transmission standard and needs to be chosen to best fit into your overall design and deployment of
your infrastructure platform.


## {{% heading "whatsnext" %}}


Learn about additional debugging tools, including:

* [Logging](/docs/concepts/cluster-administration/logging/)
* [Monitoring](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
* [Getting into containers via `exec`](/docs/tasks/debug/debug-application/get-shell-running-container/)
* [Connecting to containers via proxies](/docs/tasks/extend-kubernetes/http-proxy-access-api/)
* [Connecting to containers via port forwarding](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* [Inspect Kubernetes node with crictl](/docs/tasks/debug/debug-cluster/crictl/)
