---
reviewers:
- mikedanese
title: Tools for Monitoring Compute, Storage, and Network Resources
---

Understanding how an application behaves when deployed is crucial to scaling the application and providing a reliable service. In a Kubernetes cluster, application performance can be examined at many different levels: containers, [pods](/docs/user-guide/pods), [services](/docs/user-guide/services), and whole clusters. As part of Kubernetes we want to provide users with detailed resource usage information about their running applications at all these levels. This will give users deep insights into how their applications are performing and where possible application bottlenecks may be found.

## Overview

Kubernetes monitoring is designed to be monitoring-solution agnostic.  On many clusters, monitoring is provided via two separate pipelines: the resource metrics pipeline, and full monitoring pipeline.
The resource metrics pipeline provides a limitted set of metrics to cluster components such as the HorizontalPodAutoscaler controller, and `kubectl top`.  These metrics are generally collected by
[metrics-server](https://github.com/kubernetes-incubator/metrics-server), and exposed via the `metrics.k8s.io` API.  metrics-server discovers all nodes on the cluster, and queries their
[Kubelet](/docs/admin/kubelet)s for CPU and memory usage.  The Kubelet itself fetches the data from [cAdvisor](https://github.com/google/cadvisor).

For richer metrics and long-term storage, a full monitoring pipeline should be used.  Kubernetes does not prescribe a specific monitoring solution.  Instead, it exposes the
relevant metrics via both the API used by metrics-server, as well as in Prometheus exposition format.  Monitoring agents can then collect these metrics.  Kubernetes defines
two [APIs](https://github.com/kubernetes/metrics) (`custom.metrics.k8s.io` and `external.metrics.k8s.io`) that monitoring solutions may choose to implement to provide richer
metrics to system components, such as the Horizontal Pod Autoscaler.

### cAdvisor

cAdvisor is an open source container resource usage and performance analysis agent. It is purpose-built for containers and supports Docker containers natively. In Kubernetes, cAdvisor is integrated into the Kubelet binary. cAdvisor auto-discovers all containers in the machine and collects CPU, memory, filesystem, and network usage statistics. cAdvisor also provides the overall machine usage by analyzing the 'root' container on the machine.

On most Kubernetes clusters, cAdvisor exposes a simple UI for on-machine containers on port 4194. Here is a snapshot of part of cAdvisor's UI that shows the overall machine usage:

![cAdvisor](/images/docs/cadvisor.png)

### Kubelet

The Kubelet acts as a bridge between the Kubernetes master and the nodes. It manages the pods and containers running on a machine. Kubelet translates each pod into its constituent containers and fetches individual container usage statistics from cAdvisor. It then exposes the aggregated pod resource usage statistics via a REST API.

## Metrics-Server

metric-server acts as a short-term (single-data-point) in-memory store for CPU and memory metrics.  It's designed to be a lightweight solution for providing a small set of metrics to system components.

## Full Metrics Pipelines

Many full metrics solutions exist for Kubernetes. The following two are popular solutions:

### Prometheus

[Prometheus](https://prometheus.io) is able to natively monitor Prometheus, and the [Prometheus Operator](https://coreos.com/operators/prometheus/docs/latest/) can help simplify setup
on Kubernetes.  It also has support for serving the custom metrics API via the [Prometheus adapter](https://github.com/directxman12/k8s-prometheus-adapter).  Prometheus itself provides
a robust query language for examining your data, a built-in dashboard, and is also a [supported data source for Grafana](https://prometheus.io/docs/visualization/grafana/).

### Google Cloud Monitoring

Google Cloud Monitoring is a hosted monitoring service that allows you to visualize and alert on important metrics in your application. It uses Heapster to automatically push all collected metrics to Google Cloud Monitoring. These metrics are then available in the [Cloud Monitoring Console](https://app.google.stackdriver.com/). This storage backend is the easiest to setup and maintain. The monitoring console allows you to easily create and customize dashboards using the exported data.

Here is a video showing how to setup and run a Google Cloud Monitoring backed Heapster:

[![how to setup and run a Google Cloud Monitoring backed Heapster](http://img.youtube.com/vi/xSMNR2fcoLs/0.jpg)](http://www.youtube.com/watch?v=xSMNR2fcoLs)

Here is a snapshot of the Google Cloud Monitoring dashboard showing cluster-wide resource usage.

![Google Cloud Monitoring dashboard](/images/docs/gcm.png)

