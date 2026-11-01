---
layout: blog
title: "Kubernetes v1.34: Pods Report DRA Resource Health"
slug: kubernetes-v1-34-pods-report-dra-resource-health
date: 2025-09-17T10:30:00-08:00
author: >
  John-Paul Sassine (Google)
---

The rise of AI/ML and other high-performance workloads has made specialized hardware like GPUs, TPUs, and FPGAs a critical component of many Kubernetes clusters. However, as discussed in a [previous blog post about navigating failures in Pods with devices](/blog/2025/07/03/navigating-failures-in-pods-with-devices/), when this hardware fails, it can be difficult to diagnose, leading to significant downtime. With the release of Kubernetes v1.34, we are excited to announce a new alpha feature that brings much-needed visibility into the health of these devices.

This work extends the functionality of [KEP-4680](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4680-add-resource-health-to-pod-status), which first introduced a mechanism for reporting the health of devices managed by Device Plugins. Now, this capability is being extended to *Dynamic Resource Allocation (DRA)*. Controlled by the `ResourceHealthStatus` feature gate, this enhancement allows DRA drivers to report device health directly into a Pod's `.status` field, providing crucial insights for operators and developers.

## Why expose device health in Pod status?

For stateful applications or long-running jobs, a device failure can be disruptive and costly. By exposing device health in the `.status` field for a Pod, Kubernetes provides a standardized way for users and automation tools to quickly diagnose issues. If a Pod is failing, you can now check its status to see if an unhealthy device is the root cause, saving valuable time that might otherwise be spent debugging application code.

## How it works

This feature introduces a new, optional communication channel between the Kubelet and DRA drivers, built on three core components.

### A new gRPC health service
A new gRPC service, `DRAResourceHealth`, is defined in the `dra-health/v1alpha1` API group. DRA drivers can implement this service to stream device health updates to the Kubelet. The service includes a `NodeWatchResources` server-streaming RPC that sends the health status (`Healthy`, `Unhealthy`, or `Unknown`) for the devices it manages.

### Kubelet integration
The Kubelet’s `DRAPluginManager` discovers which drivers implement the health service. For each compatible driver, it starts a long-lived `NodeWatchResources` stream to receive health updates. The DRA Manager then consumes these updates and stores them in a persistent `healthInfoCache` that can survive Kubelet restarts.

### Populating the Pod status
When a device's health changes, the DRA manager identifies all Pods affected by the change and triggers a Pod status update. A new field, `allocatedResourcesStatus`, is now part of the `v1.ContainerStatus` API object. The Kubelet populates this field with the current health of each device allocated to the container.

## A practical example

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

Now you can improve the failure detection logic to react on the unhealthy devices associated with the Pod by de-scheduling a Pod.

## How to use this feature

As this is an alpha feature in Kubernetes v1.34, you must take the following steps to use it:

1. Enable the `ResourceHealthStatus` feature gate on your kube-apiserver and kubelets.
2. Ensure you are using a DRA driver that implements the `v1alpha1 DRAResourceHealth` gRPC service.

## DRA drivers

If you are developing a DRA driver, make sure to think about device failure detection strategy and ensure that your driver is integrated with this feature. This way, your driver will improve the user experience and simplify debuggability of hardware issues.

## What's next?

This is the first step in a broader effort to improve how Kubernetes handles device failures. As we gather feedback on this alpha feature, the community is planning several key enhancements before graduating to Beta:

* *Detailed health messages:* To improve the troubleshooting experience, we plan to add a human-readable message field to the gRPC API. This will allow DRA drivers to provide specific context for a health status, such as "GPU temperature exceeds threshold" or "NVLink connection lost".
* *Configurable health timeouts:* The timeout for marking a device's health as "Unknown" is currently hardcoded. We plan to make this configurable, likely on a per-driver basis, to better accommodate the different health-reporting characteristics of various hardware.
* *Improved post-mortem troubleshooting:* We will address a known limitation where health updates may not be applied to pods that have already terminated. This fix will ensure that the health status of a device at the time of failure is preserved, which is crucial for troubleshooting batch jobs and other "run-to-completion" workloads.

This feature was developed as part of [KEP-4680](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4680-add-resource-health-to-pod-status), and community feedback is crucial as we work toward graduating it to Beta. We have more improvements of device failure handling in k8s and encourage you to try it out and share your experiences with the SIG Node community!
