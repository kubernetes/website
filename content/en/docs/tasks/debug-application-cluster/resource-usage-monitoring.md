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

In Kubernetes, application monitoring does not depend on a single monitoring
solution. On new clusters, you can use two separate pipelines to collect
monitoring statistics by default:

- The [**resource metrics pipeline**](#resource-metrics-pipeline) provides a limited set of metrics related
  to cluster components such as the HorizontalPodAutoscaler controller, as well
  as the `kubectl top` utility. These metrics are collected by
  [metrics-server](https://github.com/kubernetes-incubator/metrics-server)
  and are exposed via the `metrics.k8s.io` API. `metrics-server` discovers
  all nodes on the cluster and queries each node's [Kubelet](/docs/admin/kubelet)
  for CPU and memory usage. The Kubelet fetches the data from
  [cAdvisor](https://github.com/google/cadvisor). `metrics-server` is a
  lightweight short-term in-memory store.
  
- A [**full metrics pipeline**](#full-metrics-pipelines), such as Prometheus, gives you access to richer
  metrics. In addition, Kubernetes can respond to these metrics by automatically
  scaling or adapting the cluster based on its current state, using mechanisms
  such as the Horizontal Pod Autoscaler. The monitoring pipeline fetches
  metrics from the Kubelet, and then exposes them to Kubernetes via an adapter
  by implementing either the `custom.metrics.k8s.io` or
  `external.metrics.k8s.io` API.

## Resource metrics pipeline

### Kubelet

The Kubelet acts as a bridge between the Kubernetes master and the nodes. It manages the pods and containers running on a machine. Kubelet translates each pod into its constituent containers and fetches individual container usage statistics from the container runtime, through the container runtime interface. For the legacy docker integration, it fetches this information from cAdvisor.  It then exposes the aggregated pod resource usage statistics through the kubelet resource metrics api.  This api is served at `/metrics/resource/v1alpha1` on the kubelet's authenticated and read-only ports.

### cAdvisor

cAdvisor is an open source container resource usage and performance analysis agent. It is purpose-built for containers and supports Docker containers natively. In Kubernetes, cAdvisor is integrated into the Kubelet binary. cAdvisor auto-discovers all containers in the machine and collects CPU, memory, filesystem, and network usage statistics. cAdvisor also provides the overall machine usage by analyzing the 'root' container on the machine.

Kubelet exposes a simple cAdvisor UI for containers on a machine, via the default port 4194.
The picture below is an example showing the overall machine usage. However, this feature has been marked
deprecated in v1.10 and completely removed in v1.12.

![cAdvisor](/images/docs/cadvisor.png)

Starting from v1.13, you can [deploy cAdvisor as a DaemonSet](https://github.com/google/cadvisor/tree/master/deploy/kubernetes) for an access to the cAdvisor UI.

## Full metrics pipelines

Many full metrics solutions exist for Kubernetes.

### Prometheus

[Prometheus](https://prometheus.io) can natively monitor kubernetes, nodes, and prometheus itself.
The [Prometheus Operator](https://coreos.com/operators/prometheus/docs/latest/)
simplifies Prometheus setup on Kubernetes, and allows you to serve the
custom metrics API using the
[Prometheus adapter](https://github.com/directxman12/k8s-prometheus-adapter).
Prometheus provides a robust query language and a built-in dashboard for
querying and visualizing your data. Prometheus is also a supported
data source for [Grafana](https://prometheus.io/docs/visualization/grafana/).

### Sysdig
[Sysdig](http://sysdig.com) provides full spectrum container and platform intelligence, and is a
true container native solution. Sysdig pulls together data from system calls, Kubernetes events,
Prometheus metrics, statsD, JMX, and more into a single pane that gives you a comprehensive picture 
of your environment. Sysdig also provides an API to query for providing robust and customizable 
solutions. Sysdig is built on Open Source. [Sysdig and Sysdig Inspect](https://sysdig.com/opensource/inspect/) give you the 
ability to freely perform troubleshooting, performance analyis and forensics. 

### Google Cloud Monitoring

Google Cloud Monitoring is a hosted monitoring service you can use to
visualize and alert on important metrics in your application. You can collect
metrics from Kubernetes, and you can access them
using the [Cloud Monitoring Console](https://app.google.stackdriver.com/).
You can create and customize dashboards to visualize the data gathered
from your Kubernetes cluster.

This video shows how to configure and run a Google Cloud Monitoring backed Heapster:

[![how to setup and run a Google Cloud Monitoring backed Heapster](https://img.youtube.com/vi/xSMNR2fcoLs/0.jpg)](https://www.youtube.com/watch?v=xSMNR2fcoLs)


{{< figure src="/images/docs/gcm.png" alt="Google Cloud Monitoring dashboard example" title="Google Cloud Monitoring dashboard example" caption="This dashboard shows cluster-wide resource usage." >}}

## CronJob monitoring

### Kubernetes Job Monitor

With the [Kubernetes Job Monitor](https://github.com/pietervogelaar/kubernetes-job-monitor) dashboard a Cluster Administrator can see which jobs are running and view the status of completed jobs.

### New Relic Kubernetes monitoring integration

[New Relic Kubernetes](https://docs.newrelic.com/docs/integrations/host-integrations/host-integrations-list/kubernetes-monitoring-integration) integration provides increased visibility into the performance of your Kubernetes environment. New Relic's Kubernetes integration instruments the container orchestration layer by reporting metrics from Kubernetes objects. The integration gives you insight into your Kubernetes nodes, namespaces, deployments, replica sets, pods, and containers.

Marquee capabilities:
View your data in pre-built dashboards for immediate insight into your Kubernetes environment.
Create your own custom queries and charts in Insights from automatically reported data.
Create alert conditions on Kubernetes data.
Learn more on this [page](https://docs.newrelic.com/docs/integrations/host-integrations/host-integrations-list/kubernetes-monitoring-integration).

{{% /capture %}}
