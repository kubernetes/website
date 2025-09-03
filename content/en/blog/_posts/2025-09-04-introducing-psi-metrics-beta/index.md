---
layout: blog
title: "PSI Metrics for Kubernetes Graduates to Beta"
date: 2025-09-04T10:30:00-08:00
slug: kubernetes-v1-34-introducing-psi-metrics-beta
author: "Haowei Cai (Google)"
---

As Kubernetes clusters grow in size and complexity, understanding the health and performance of individual nodes becomes increasingly critical. We are excited to announce that as of Kubernetes v1.34, **Pressure Stall Information (PSI) Metrics** has graduated to Beta.

## What is Pressure Stall Information (PSI)?

[Pressure Stall Information (PSI)](https://docs.kernel.org/accounting/psi.html) is a feature of the Linux kernel (version 4.20 and later)
that provides a canonical way to quantify pressure on infrastructure resources,
in terms of whether demand for a resource exceeds current supply.
It moves beyond simple resource utilization metrics and instead
measures the amount of time that tasks are stalled due to resource contention.
This is a powerful way to identify and diagnose resource bottlenecks that can impact application performance.

PSI exposes metrics for CPU, memory, and I/O, categorized as either `some` or `full` pressure:

`some`
: The percentage of time that **at least one** task is stalled on a resource. This indicates some level of resource contention.

`full`
: The percentage of time that **all** non-idle tasks are stalled on a resource simultaneously. This indicates a more severe resource bottleneck.

{{< figure src="psi-metrics-some-vs-full.svg" alt="Diagram illustrating the difference between 'some' and 'full' PSI pressure." title="PSI: 'Some' vs. 'Full' Pressure" >}}

These metrics are aggregated over 10-second, 1-minute, and 5-minute rolling windows, providing a comprehensive view of resource pressure over time.

## PSI metrics in Kubernetes

With the `KubeletPSI` feature gate enabled, the kubelet can now collect PSI metrics from the Linux kernel and expose them through two channels: the [Summary API](/docs/reference/instrumentation/node-metrics#summary-api-source) and the `/metrics/cadvisor` Prometheus endpoint. This allows you to monitor and alert on resource pressure at the node, pod, and container level.

The following new metrics are available in Prometheus exposition format via `/metrics/cadvisor`:

*   `container_pressure_cpu_stalled_seconds_total`
*   `container_pressure_cpu_waiting_seconds_total`
*   `container_pressure_memory_stalled_seconds_total`
*   `container_pressure_memory_waiting_seconds_total`
*   `container_pressure_io_stalled_seconds_total`
*   `container_pressure_io_waiting_seconds_total`

These metrics, along with the data from the Summary API, provide a granular view of resource pressure, enabling you to pinpoint the source of performance issues and take corrective action. For example, you can use these metrics to:

*   **Identify memory leaks:** A steadily increasing `some` pressure for memory can indicate a memory leak in an application.
*   **Optimize resource requests and limits:** By understanding the resource pressure of your workloads, you can more accurately tune their resource requests and limits.
*   **Autoscale workloads:** You can use PSI metrics to trigger autoscaling events, ensuring that your workloads have the resources they need to perform optimally.

## How to enable PSI metrics

To enable PSI metrics in your Kubernetes cluster, you need to:

1.  **Ensure your nodes are running a Linux kernel version 4.20 or later and are using cgroup v2.**
2.  **Enable the `KubeletPSI` feature gate on the kubelet.**

Once enabled, you can start scraping the `/metrics/cadvisor` endpoint with your Prometheus-compatible monitoring solution or query the Summary API to collect and visualize the new PSI metrics. Note that PSI is a Linux-kernel feature, so these metrics are not available on Windows nodes. Your cluster can contain a mix of Linux and Windows nodes, and on the Windows nodes the kubelet does not expose PSI metrics.

## What's next?

We are excited to bring PSI metrics to the Kubernetes community and look forward to your feedback. As a beta feature, we are actively working on improving and extending this functionality towards a stable GA release. We encourage you to try it out and share your experiences with us.

To learn more about PSI metrics, check out the official [Kubernetes documentation](/docs/reference/instrumentation/understand-psi-metrics/). You can also get involved in the conversation on the [#sig-node](https://kubernetes.slack.com/messages/sig-node) Slack channel.
