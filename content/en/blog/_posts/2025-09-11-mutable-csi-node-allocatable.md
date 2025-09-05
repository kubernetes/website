---
layout: blog
title: "Kubernetes v1.34: Mutable CSI Node Allocatable Graduates to Beta"
date: 2025-09-11T10:30:00-08:00
slug: kubernetes-v1-34-mutable-csi-node-allocatable-count
author: Eddie Torres (Amazon Web Services)
---

The [functionality for CSI drivers to update information about attachable volume count on the nodes](https://kep.k8s.io/4876), first introduced as Alpha in Kubernetes v1.33, has graduated to **Beta** in the Kubernetes v1.34 release! This marks a significant milestone in enhancing the accuracy of stateful pod scheduling by reducing failures due to outdated attachable volume capacity information.

## Background

Traditionally, Kubernetes [CSI drivers](https://kubernetes-csi.github.io/docs/introduction.html) report a static maximum volume attachment limit when initializing. However, actual attachment capacities can change during a node's lifecycle for various reasons, such as:

- Manual or external operations attaching/detaching volumes outside of Kubernetes control.
- Dynamically attached network interfaces or specialized hardware (GPUs, NICs, etc.) consuming available slots.
- Multi-driver scenarios, where one CSI driver’s operations affect available capacity reported by another.

Static reporting can cause Kubernetes to schedule pods onto nodes that appear to have capacity but don't, leading to pods stuck in a `ContainerCreating` state.

## Dynamically adapting CSI volume limits

With this new feature, Kubernetes enables CSI drivers to dynamically adjust and report node attachment capacities at runtime. This ensures that the scheduler, as well as other components relying on this information, have the most accurate, up-to-date view of node capacity.

### How it works

Kubernetes supports two mechanisms for updating the reported node volume limits:

- **Periodic Updates:** CSI drivers specify an interval to periodically refresh the node's allocatable capacity.
- **Reactive Updates:** An immediate update triggered when a volume attachment fails due to exhausted resources (`ResourceExhausted` error).

### Enabling the feature

To use this beta feature, the `MutableCSINodeAllocatableCount` feature gate must be enabled in these components:

- `kube-apiserver`
- `kubelet`

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

This configuration directs kubelet to periodically call the CSI driver's `NodeGetInfo` method every 60 seconds, updating the node’s allocatable volume count. Kubernetes enforces a minimum update interval of 10 seconds to balance accuracy and resource usage.

### Immediate updates on attachment failures

When a volume attachment operation fails due to a `ResourceExhausted` error (gRPC code `8`), Kubernetes immediately updates the allocatable count instead of waiting for the next periodic update. The Kubelet then marks the affected pods as Failed, enabling their controllers to recreate them. This prevents pods from getting permanently stuck in the `ContainerCreating` state.

## Getting started

To enable this feature in your Kubernetes v1.34 cluster:

1. Enable the feature gate `MutableCSINodeAllocatableCount` on the `kube-apiserver` and `kubelet` components.
2. Update your CSI driver configuration by setting `nodeAllocatableUpdatePeriodSeconds`.
3. Monitor and observe improvements in scheduling accuracy and pod placement reliability.

## Next steps

This feature is currently in beta and the Kubernetes community welcomes your feedback. Test it, share your experiences, and help guide its evolution to GA stability.

Join discussions in the [Kubernetes Storage Special Interest Group (SIG-Storage)](https://github.com/kubernetes/community/tree/master/sig-storage) to shape the future of Kubernetes storage capabilities.