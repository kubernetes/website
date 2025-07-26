---
layout: blog
title: "Kubernetes v1.34: Mutable CSI Node Allocatable Graduates to Beta"
date: 2025-07-07
slug: kubernetes-1-34-mutable-csi-node-allocatable-count
draft: true
author: Eddie Torres (Amazon Web Services)
---

The *mutable CSI node allocatable count* feature, first introduced as Alpha in Kubernetes v1.33, has graduated to **Beta** and is enabled by default in the Kubernetes v1.34 release! This marks a significant milestone in enhancing the accuracy of stateful pod scheduling by reducing failures due to outdated volume capacity information.

## Background

Traditionally, Kubernetes CSI drivers report a static maximum volume attachment limit when initializing. However, actual attachment capacities can change during a node's lifecycle for various reasons, such as:

- Manual or external operations attaching/detaching volumes outside of Kubernetes control.
- Dynamically attached network interfaces or specialized hardware (GPUs, NICs, etc.) consuming available slots.
- Multi-driver scenarios, where one CSI driver’s operations affect available capacity reported by another.

Static reporting can cause Kubernetes to schedule pods onto nodes that appear to have capacity but don't, leading to pods stuck in a `ContainerCreating` state.

## Dynamically adapting CSI volume limits

With the new feature gate `MutableCSINodeAllocatableCount`, Kubernetes enables CSI drivers to dynamically adjust and report node attachment capacities at runtime. This ensures that the scheduler has the most accurate, up-to-date view of node capacity.

### How it works

When this feature is enabled, Kubernetes supports two mechanisms for updating the reported node volume limits:

- **Periodic Updates:** CSI drivers specify an interval to periodically refresh the node's allocatable capacity.
- **Reactive Updates:** An immediate update triggered when a volume attachment fails due to exhausted resources (`ResourceExhausted` error).

### Enabling the feature

To use this beta feature, the `MutableCSINodeAllocatableCount` feature gate must be enabled in these components:

- `kube-apiserver`
- `kubelet`

The feature gate is enabled by default in Kubernetes 1.34+.

### Example CSI driver configuration

Below is an example of configuring a CSI driver to enable periodic updates every 60 seconds:

```
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: example.csi.k8s.io
spec:
  nodeAllocatableUpdatePeriodSeconds: 60
```

This configuration directs Kubelet to periodically call the CSI driver's `NodeGetInfo` method every 60 seconds, updating the node’s allocatable volume count. Kubernetes enforces a minimum update interval of 10 seconds to balance accuracy and resource usage.

### Immediate updates on attachment failures

In addition to periodic updates, Kubernetes now reacts to attachment failures. Specifically, if a volume attachment fails with a `ResourceExhausted` error (gRPC code `8`), an immediate update is triggered to correct the allocatable count promptly.

This proactive correction prevents repeated scheduling errors and helps maintain cluster health.

## Getting started

To experiment with mutable CSI node allocatable count in your Kubernetes v1.33 cluster:

1. Update your CSI driver configuration by setting `nodeAllocatableUpdatePeriodSeconds`.
2. Monitor and observe improvements in scheduling accuracy and pod placement reliability.

## Next steps

This feature is currently in beta and the Kubernetes community welcomes your feedback. Test it, share your experiences, and help guide its evolution to GA stability.

Join discussions in the [Kubernetes Storage Special Interest Group (SIG-Storage)](https://github.com/kubernetes/community/tree/master/sig-storage) to shape the future of Kubernetes storage capabilities.