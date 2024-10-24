---
layout: blog
title: "Windows Memory Pressure Eviction"
slug: windows-memory-pressure-eviction
canonicalUrl: TBD
date: TBD
author: >
  Mark Rossetti (Microsoft)
---

In Kubernetes 1.31, support for memory-pressure based eviction was added for Windows nodes.

This post describes what these changes mean for you and how they may differ from usage on Linux nodes.

## How Memory Pressure Eviction Works on Windows Nodes

Kubernetes nodes can be configured to report memory pressure when the available memory falls below a defined threshold (either a percentage of the total node memory or a specific value). When this signal is raised, the kubelet attempts to evict pods to maintain stability on the node.

For Windows, the available memory is derived from the node's global memory commit levels, which are queried through the [GetPerformanceInfo()](https://](https://learn.microsoft.com/windows/win32/api/psapi/nf-psapi-getperformanceinfo)) system call. Available memory is calculated by subtracting the node's global `CommitTotal` (the amount of memory committed by all processes on the node) from the `CommitLimit` (the total amount of virtual memory that can be committed without extending the page file(s) on the node).

> Important note: The `CommitLimit` (capacity) can change dynamically based on current memory usage if Windows is configured to automatically adjust page file sizes, which is the default behavior on Windows Client machines.

This approach differs from Linux, where available memory is reported based on **Working Set** memory usage.

## Why Use Commit Memory on Windows?

Before diving into the reasons for using commit memory on Windows for eviction signalling, it's helpful to understand the difference between **Working Set** and **Commit** memory.

**Working Set** memory represents the amount of physical memory currently used by processes. It includes the pages of memory that are actively in use and exludes memory pages that have been swapped out to disk (if paging is enabled).

**Commit** memory, on the other hand, represents the total amount of virtual memory that has been reserved by processes - including memory that has been swapped out to disk. When memory is "committed", it means that the system has allocated the backing storage (either physical RAM or space in the paging file(s)) to ensure that the memory will be available if needed.

Using global commit levels to measure available memory on Windows was implemented for two key reasons:

1. **Memory limits for containers in Pods running on Windows nodes are enforced using Commit** (not WorkingSet) **memory**. Windows memory management enforces limits on processes based on the total amount of memory committed, not just the memory in use. 
This also means that memory limits specified for containers in Kubernetes Pods are enforced on the total amount of virtual memory committed by all processes in the container. Consistenty in how memory usage is tracked and enforced is essential for workload stability.

2. **Paging (swap) is automatically enabled on Windows**, and it plays an essential role in the operating system's memory management. Disabling paging is not recommended because it can lead to system instability.

## Eviction Thresholds

By default, Windows nodes have a default "hard" eviction threadhold of `--eviction-hard=memory.available<500Mi`. This means that if the system's availalbe memory is less than 500 Mi the Kubelet will try and start evicting pods.

For more information on configuring memory-pressure based eviction and understanding the eviction signals and threadhols, refer to the official Kubernetes documentation on [memory-pressure-eviction](https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/#eviction-signals-and-thresholds).


## Monitoring Commit Memory for Windows nodes

Understanding the distinction between **Working Set** and **Commit** memory and being able to monitor both is critical for maintaining the stability of individual Pod workloads and the entire Windows node.

Currently, `kubectl top` continues to report Working Set memory. As a result, a Pod may be evicted for exceeding its memory requests or encounter memory allocation failures due to exceeding its Commit limit, even when the WorkingSet appears to be well within the expected bounds. This discrepancy can lead to confusion.

Starting with v1.31, Windows nodes now report the global `CommitTotal` and `CommitLimit` for each node through the `/stats/summary` API endpoint. This information is available under the `windows-global-commit-memory` syscontainer.

```json=
kubectl get --raw http://{cluster-endpoint}/api/v1/nodes/{node-name}/proxy/stats/summary

{
 "node": {
  "nodeName": "{node-name},
  "systemContainers": [
   ...
   {
    "name": "windows-global-commit-memory",
    "startTime": "2024-10-02T19:14:33Z",
    "memory": {
     "time": "2024-10-02T19:14:33Z",
     "availableBytes": 4563402752,
     "usageBytes": 1212754432
    }
   }
  ...
  ],
}

```


Additionally, exposing the Commit usage for individial Pods and Containers through the `/stats/summary` API is being worked on as part of the [cAdvisor-les, CRI-full Container and Pod Stats](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2371-cri-pod-container-stats/README.md) enhancement.

[windows-exporter](https://github.com/prometheus-community/windows_exporter) can also be configured to monitor and report on Commit memory usage.

## Additional Resources

To gain a deeper understanding of how memory is managed on Windows, you may also find this article on [Physical and Virtual Memory in Windows 10](https://answers.microsoft.com/en-us/windows/forum/all/physical-and-virtual-memory-in-windows-10/e36fb5bc-9ac8-49af-951c-e7d39b979938) helpful.
