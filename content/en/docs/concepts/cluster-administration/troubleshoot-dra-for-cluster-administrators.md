---
title: Troubleshoot DRA as a Cluster Administrator
content_type: task
weight: 60
---

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!-- overview -->
This page contains a high level background on the third-party and Kubernetes built-in components involved in providing the Dynamic Resource Allocation feature, in the context of cluster administration and operations. This page then explains how to troubleshoot Dynamic Resource Allocation (DRA) drivers in your cluster.

# Background

TODO: component diagram

## Troubleshooting your DRA driver

Many different symptoms could appear that might be caused by an issue with your DRA driver. These include:

- Pods with claims failing to be scheduled
- Pods with claims stuck in a `Pending` state
- Pods with claims stuck in a `Terminating` state
- `ResourceSlice` objects not being created or updated, or repeatedly being deleted and recreated

It is important to note that DRA driver issues are not the only reasons that the above issues might occur. The following sections describe how to determine if your DRA driver is the cause of the issue, and what options you have to mitigate it.

### Driver application errors

If your DRA driver is deployed as a Kubernetes daemonset, as shown in this task page, you can use standard Kubernetes tooling to inspect the health of the daemonset and its logs in order to troubleshoot runtime application errors specific to the driver.

TODO: show examples of doing that

### Driver registration errors

Internally, all DRA drivers implement a specific interface and call a helper package in Kubernetes (`kubelet:dra:kubeletplugin`) that registers themselves with the kubelet by placing a Unix domain socket in `/var/lib/kubelet/plugins_registry/`. An internal kubelet client watches this directory and discovers new drivers as they appear. Other internal kubelet clients connect over this Unix socket at different points in the DRA lifecycle to allocate, prepare, or unprepare your workload's claims. If your DRA driver becomes unhealthy, variations in connection timeouts and log level patterns by these clients can compete for your attention. This section explains the different error logs you must be able to understand in order to diagnose what happened.

TODO: more logs and where they fit in in the architecture diagram

```shell
May 28 17:18:20 kind-worker kubelet[234]: I0528 17:18:20.598764     234 plugin_watcher.go:159] "Handling create event" event="CREATE        \"/var/lib/kubelet/plugins_registry/gpu.example.com.sock\""
May 28 17:18:20 kind-worker kubelet[234]: I0528 17:18:20.598839     234 plugin_watcher.go:194] "Adding socket path or updating timestamp to desired state cache" path="/var/lib/kubelet/plugins_registry/gpu.example.com.sock"
```