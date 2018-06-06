---
reviewers:
- mikedanese
title: Tools for Monitoring Compute, Storage, and Network Resources
---

To scale and application and provide a reliable service, you need to
understand how an application behaves when it is deployed. You can examine
application performance in a Kubernetes cluster by examining the containers,
[pods](/docs/user-guide/pods), [services](/docs/user-guide/services), and
the characteristics of the overall cluster. Kubernetes provides detailed
information about an application's resource usage at each of these levels.
This information allows you to evaluate your application's performance and
where bottlenecks can be removed to improve overall performance.

## Overview

In Kubernetes, application monitoring does not depend on a single monitoring
solution. On new clusters, you can use two separate pipelines to collect
monitoring statistics by default:

- The **resource metrics pipeline** provides a limited set of metrics related
  to cluster components such as the HorizontalPodAutoscaler controller, as well
  as the `kubectl top` utility. These metrics are collected by
  [metrics-server](https://github.com/kubernetes-incubator/metrics-server)
  and are exposed via the `metrics.k8s.io` API. `metrics-server` discovers
  all nodes on the cluster and queries each node's [Kubelet](/docs/admin/kubelet)
  for CPU and memory usage. The Kubelet fetches the data from
  [cAdvisor](https://github.com/google/cadvisor). `metrics-server` is a
  lightweight short-term in-memory store.
  

- A **full monitoring pipeline** provides richer metrics and long-term
  storage of data. Kubernetes does not provide a specific monitoring
  solution, but exposes the relevant metrics via the API used by
  `metrics-server` and also in Prometheus exposition format. You can collect
  these metrics using a monitoring agent that is compatible with either of
  these mechanisms. Kubernetes defines two different APIs for use by
  monitoring agents: `custom.metrics.k8s.io` and `external.metrics.k8s.io`. 
  These APIs provide richer metrics to system components such as the
  Horizontal Pod Autoscaler. See [Full metrics pipeline](#full-metrics-pipelines)
  for more information about some popular pipelines.


### cAdvisor

cAdvisor is an open source container resource usage and performance analysis agent. It is purpose-built for containers and supports Docker containers natively. In Kubernetes, cAdvisor is integrated into the Kubelet binary. cAdvisor auto-discovers all containers in the machine and collects CPU, memory, filesystem, and network usage statistics. cAdvisor also provides the overall machine usage by analyzing the 'root' container on the machine.

On most Kubernetes clusters, cAdvisor exposes a simple UI for on-machine containers on port 4194. Here is a snapshot of part of cAdvisor's UI that shows the overall machine usage:

![cAdvisor](/images/docs/cadvisor.png)

### Kubelet

The Kubelet acts as a bridge between the Kubernetes master and the nodes. It manages the pods and containers running on a machine. Kubelet translates each pod into its constituent containers and fetches individual container usage statistics from cAdvisor. It then exposes the aggregated pod resource usage statistics via a REST API.

## Full Metrics Pipelines

Many full metrics solutions exist for Kubernetes. Prometheus and Google Cloud
Monitoring are two of the most popular.

### Prometheus

[Prometheus](https://prometheus.io) natively monitors Prometheus.
The [Prometheus Operator](https://coreos.com/operators/prometheus/docs/latest/)
simplifies Prometheus setup on Kubernetes, and allows you to serve the
custom metrics API using the
[Prometheus adapter](https://github.com/directxman12/k8s-prometheus-adapter).
Prometheus provides a robust query language and a built-in dashboard for
querying and visualizing your data. Prometheus is also a supported
data source for [Grafana](https://prometheus.io/docs/visualization/grafana/).

### Google Cloud Monitoring

Google Cloud Monitoring is a hosted monitoring service you can use to
visualize and alert on important metrics in your application. It uses
Heapster to collect metrics from Kubernetes, and gives access to them
through the [Cloud Monitoring Console](https://app.google.stackdriver.com/).
You can create and customize dashboards to visualize the data gathered
from your Kubernetes cluster.

This video shows how to configure and run a Google Cloud Monitoring backed Heapster:

[![how to setup and run a Google Cloud Monitoring backed Heapster](http://img.youtube.com/vi/xSMNR2fcoLs/0.jpg)](http://www.youtube.com/watch?v=xSMNR2fcoLs)


{{< figure src="/images/docs/gcm.png" alt="Google Cloud Monitoring dashboard example" title="Google Cloud Monitoring dashboard example" caption="This dashboard shows cluster-wide resource usage."> }}

