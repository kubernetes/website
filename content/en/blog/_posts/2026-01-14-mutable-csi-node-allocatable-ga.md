---
layout: blog
title: "Kubernetes v1.36: Mutable CSI Node Allocatable Graduates to GA"
date: 2026-01-14T10:30:00-08:00
slug: kubernetes-v1-36-mutable-csi-node-allocatable-ga
draft: true
author: Eddie Torres (Amazon Web Services)
---

On behalf of Kubernetes SIG Storage, I am pleased to announce that the _mutable CSI node allocatable count_ feature has graduated to General Availability (GA) in Kubernetes v1.36!

This feature, first introduced as alpha in Kubernetes v1.33 and promoted to beta in v1.34, allows [Container Storage Interface (CSI)](https://kubernetes-csi.github.io/docs/introduction.html) drivers to dynamically update the reported maximum number of volumes that a node can handle. This capability significantly enhances the accuracy of pod scheduling decisions and reduces scheduling failures caused by outdated volume capacity information.

## Background

Traditionally, Kubernetes CSI drivers report a static maximum volume attachment limit when initializing. However, actual attachment capacities can change during a node's lifecycle for various reasons, such as:

- Manual or external operations attaching/detaching volumes outside of Kubernetes control.
- Dynamically attached network interfaces or specialized hardware (GPUs, NICs, etc.) consuming available slots.
- Multi-driver scenarios, where one CSI driver's operations affect available capacity reported by another.

Static reporting can cause Kubernetes to schedule pods onto nodes that appear to have capacity but don't, leading to pods stuck in a `ContainerCreating` state.

## Dynamically adapting CSI volume limits

With this feature now GA, Kubernetes enables CSI drivers to dynamically adjust and report node attachment capacities at runtime. This ensures that the scheduler, as well as other components relying on this information, have the most accurate, up-to-date view of node capacity.

### How it works

Kubernetes supports two mechanisms for updating the reported node volume limits:

- **Periodic Updates:** CSI drivers specify an interval to periodically refresh the node's allocatable capacity.
- **Reactive Updates:** An immediate update triggered when a volume attachment fails due to exhausted resources (`ResourceExhausted` error).

### Example CSI driver configuration

Below is an example of configuring a CSI driver to enable periodic updates every 60 seconds:

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: example.csi.k8s.io
spec:
  nodeAllocatableUpdatePeriodSeconds: 60
```

This configuration directs kubelet to periodically call the CSI driver's `NodeGetInfo` method every 60 seconds, updating the node's allocatable volume count. Kubernetes enforces a minimum update interval of 10 seconds to balance accuracy and resource usage.

### Immediate updates on attachment failures

When a volume attachment operation fails due to a `ResourceExhausted` error (gRPC code `8`), Kubernetes immediately updates the allocatable count instead of waiting for the next periodic update. The kubelet then marks the affected pods as Failed, enabling their controllers to recreate them. This prevents pods from getting permanently stuck in the `ContainerCreating` state.

## What's new in GA

With the graduation to GA in Kubernetes v1.36, the `MutableCSINodeAllocatableCount` feature gate is now enabled by default. This means:

- The `.spec.drivers[*].allocatable.count` field of a CSINode is now mutable.
- The `nodeAllocatableUpdatePeriodSeconds` field is available in the CSIDriver object.
- No additional configuration is required to enable this feature in your cluster.

## Getting started

To take advantage of this feature in your Kubernetes v1.36 cluster:

1. Update your CSI driver configuration by setting `nodeAllocatableUpdatePeriodSeconds` to your desired update interval.
2. Monitor and observe improvements in scheduling accuracy and pod placement reliability.

## References

- [KEP-4876: Mutable CSI Node Allocatable Count](https://kep.k8s.io/4876)
- [Alpha Release Blog (v1.33)](/blog/2025/05/02/kubernetes-1-33-mutable-csi-node-allocatable-count/)
- [Beta Release Blog (v1.34)](/blog/2025/09/11/kubernetes-v1-34-mutable-csi-node-allocatable-count/)

## Getting involved

This feature was driven by the [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage) community. Please join us to connect with the community and share your ideas and feedback around the above feature and beyond. We look forward to hearing from you!
