---
layout: blog
title: "Kubernetes v1.34: Pods Report DRA Resource Health"
slug: pods-report-dra-resource-health-1-34
draft: true
date: 2025-08-XX
author: >
  John-Paul Sassine (Google)
---

The rise of AI/ML and other high-performance workloads has made specialized hardware like GPUs, TPUs, and FPGAs a critical component of many Kubernetes clusters. However, when this hardware fails, it can be difficult to diagnose, leading to significant downtime. With the release of Kubernetes v1.34, we are excited to announce a new alpha feature that brings much-needed visibility into the health of these devices.

This work extends the functionality of [KEP-4680](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4680-add-resource-health-to-pod-status), which first introduced a mechanism for reporting the health of devices managed by Device Plugins. Now, this capability is being extended to **Dynamic Resource Allocation (DRA)**. Controlled by the `ResourceHealthStatus` feature gate, this enhancement allows DRA plugins to report device health directly into the Pod's status, providing crucial insights for operators and developers.

### Why Expose Device Health in Pod Status?

For stateful applications or long-running jobs, a device failure can be disruptive and costly. By exposing device health in the `PodStatus`, Kubernetes provides a standardized way for users and automation tools to quickly diagnose issues. If a Pod is failing, you can now check its status to see if an unhealthy device is the root cause, saving valuable time that might otherwise be spent debugging application code.

### How It Works

This feature introduces a new, optional communication channel between the Kubelet and DRA plugins, built on three core components.

1.  **A New gRPC Health Service:** A new gRPC service, `DRAResourceHealth`, is defined in the `dra-health/v1alpha1` API group. DRA plugins can implement this service to stream device health updates to the Kubelet. The service includes a `NodeWatchResources` server-streaming RPC that sends the health status (`Healthy`, `Unhealthy`, or `Unknown`) for the devices it manages.

2.  **Kubelet Integration:** The Kubelet’s `DRAPluginManager` discovers which plugins implement the health service. For each compatible plugin, it starts a long-lived `NodeWatchResources` stream to receive health updates. The DRA Manager then consumes these updates and stores them in a persistent `healthInfoCache` that can survive Kubelet restarts.

3.  **Populating the Pod Status:** When a device's health changes, the DRA manager identifies all Pods affected by the change and triggers a Pod status update. A new field, `allocatedResourcesStatus`, is now part of the `v1.ContainerStatus` API object. The Kubelet populates this field with the current health of each device allocated to the container.

### A Practical Example

If a Pod is in a `CrashLoopBackOff` state, you can use `kubectl describe pod <pod-name>` to inspect its status. If an allocated device has failed, the output will now include the `allocatedResourcesStatus` field, clearly indicating the problem:

```yaml
status:
  containerStatuses:
  - name: my-gpu-intensive-container
    # ... other container statuses
    allocatedResourcesStatus:
    - name: "claim:my-gpu-claim"
      resources:
      - resourceID: "example.com/gpu-a1b2-c3d4"
        health: "Unhealthy"
```

This explicit status makes it clear that the issue is with the underlying hardware, not the application.

### How to Use This Feature

As this is an alpha feature in Kubernetes v1.34, you must take the following steps to use it:

1. Enable the `ResourceHealthStatus` feature gate on your kube-apiserver and kubelets.
2. Ensure you are using a DRA driver that implements the `v1alpha1 DRAResourceHealth` gRPC service.

### What's Next?

This is the first step in a broader effort to improve how Kubernetes handles device failures. As we gather feedback on this alpha feature, the community is planning several key enhancements before graduating to Beta:

* **Detailed Health Messages:** To improve the troubleshooting experience, we plan to add a human-readable message field to the gRPC API. This will allow DRA drivers to provide specific context for a health status, such as "GPU temperature exceeds threshold" or "NVLink connection lost".
* **Configurable Health Timeouts:** The timeout for marking a device's health as "Unknown" is currently hardcoded. We plan to make this configurable, likely on a per-plugin basis, to better accommodate the different health-reporting characteristics of various hardware.
* **Improved Post-Mortem Troubleshooting:** We will address a known limitation where health updates may not be applied to pods that have already terminated. This fix will ensure that the health status of a device at the time of failure is preserved, which is crucial for troubleshooting batch jobs and other "run-to-completion" workloads.

This feature was developed as part of [KEP-4680](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4680-add-resource-health-to-pod-status), and community feedback is crucial as we work toward graduating it to Beta. We encourage you to try it out and share your experiences with the SIG Node community!
