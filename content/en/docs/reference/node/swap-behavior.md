---
content_type: "reference"
title: Linux Node Swap Behaviors
weight: 110
---

To allow Kubernetes workloads to use swap, on a Linux node,
you must disable the kubelet's default behavior of failing when swap is detected,
and specify memory-swap behavior as `LimitedSwap`:

The available choices for swap behavior are:

`NoSwap`
: (default) Workloads running as Pods on this node do not and cannot use swap. However, processes
  outside of Kubernetes' scope, such as system daemons (including the kubelet itself!) **can** utilize swap.
  This behavior is beneficial for protecting the node from system-level memory spikes,
  but it does not safeguard the workloads themselves from such spikes.

`LimitedSwap`
: Kubernetes workloads can utilize swap memory. The amount of swap available to a Pod is determined automatically.

To learn more, read [swap memory management](/docs/concepts/cluster-administration/swap-memory-management/).
