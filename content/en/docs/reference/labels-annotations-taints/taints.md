---
title: Well-Known Taints for Nodes
content_type: concept
weight: 30
---

<!-- overview -->

Kubernetes reserves all taints in the `kubernetes.io` and `k8s.io` namespaces.
All taints are supposed to be used on Node objects.

This document serves both as a reference to the values and as a coordination point for assigning values.

<!-- body -->

<!--For docs contributors: please ensure the taints are in alphabeta order.-->

## Taints used on Node objects

### node.cloudprovider.kubernetes.io/shutdown

Example: `node.cloudprovider.kubernetes.io/shutdown: "NoSchedule"`

If a Node is in a cloud provider specified shutdown state, the Node gets tainted accordingly
with `node.cloudprovider.kubernetes.io/shutdown` and the taint effect of `NoSchedule`.

### node.cloudprovider.kubernetes.io/uninitialized

Example: `node.cloudprovider.kubernetes.io/uninitialized: "NoSchedule"`

Sets this taint on a Node to mark it as unusable, when kubelet is started with the "external"
cloud provider, until a controller from the cloud-controller-manager initializes this Node, and
then removes the taint.

### node.kubernetes.io/disk-pressure

Example: `node.kubernetes.io/disk-pressure :"NoSchedule"`

The kubelet detects disk pressure based on `imagefs.available`, `imagefs.inodesFree`,
`nodefs.available` and `nodefs.inodesFree`(Linux only) observed on a Node.
The observed values are then compared to the corresponding thresholds that can be set on the
kubelet to determine if the Node condition and taint should be added/removed.

### node.kubernetes.io/memory-pressure

Example: `node.kubernetes.io/memory-pressure: "NoSchedule"`

The kubelet detects memory pressure based on `memory.available` and `allocatableMemory.available`
observed on a Node. The observed values are then compared to the corresponding thresholds that can
be set on the kubelet to determine if the Node condition and taint should be added/removed.

### node.kubernetes.io/network-unavailable

Example: `node.kubernetes.io/network-unavailable: "NoSchedule"`

This is initially set by the kubelet when the cloud provider used indicates a requirement for
additional network configuration. Only when the route on the cloud is configured properly will the
taint be removed by the cloud provider.

### node.kubernetes.io/not-ready

Example: `node.kubernetes.io/not-ready: "NoExecute"`

The Node controller detects whether a Node is ready by monitoring its health
and adds or removes this taint accordingly.

### node.kubernetes.io/out-of-service

Example: `node.kubernetes.io/out-of-service:NoExecute`

A user can manually add the taint to a Node marking it out-of-service.
If a Node is marked out-of-service with this taint, the Pods on the node 
will be forcefully deleted if there are no matching tolerations on it and
volume detach operations for the Pods terminating on the node will happen immediately.
This allows the Pods on the out-of-service node to recover quickly on a different node.

{{< caution >}}
Refer to [Non-graceful node shutdown](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)
for further details about when and how to use this taint.
{{< /caution >}}

### node.kubernetes.io/pid-pressure

Example: `node.kubernetes.io/pid-pressure: "NoSchedule"`

The kubelet checks D-value of the size of `/proc/sys/kernel/pid_max` and the PIDs consumed by
Kubernetes on a node to get the number of available PIDs that referred to as the `pid.available`
metric. The metric is then compared to the corresponding threshold that can be set on the kubelet
to determine if the node condition and taint should be added/removed.

### node.kubernetes.io/unreachable

Example: `node.kubernetes.io/unreachable: "NoExecute"`

The Node controller adds the taint to a Node corresponding to the
[NodeCondition](/docs/concepts/architecture/nodes/#condition) `Ready` being `Unknown`.

### node.kubernetes.io/unschedulable

Example: `node.kubernetes.io/unschedulable: "NoSchedule"`

The taint will be added to a node when initializing the node to avoid race condition.

### node-role.kubernetes.io/control-plane

Example: `node-role.kubernetes.io/control-plane:NoSchedule`

Taint that kubeadm applies on control plane nodes to restrict placing Pods and
allow only specific pods to schedule on them.

If this Taint is applied, control plane nodes allow only critical workloads to
be scheduled onto them. You can manually remove this taint with the following
command on a specific node.

```shell
kubectl taint nodes <node-name> node-role.kubernetes.io/control-plane:NoSchedule-
```

## Deprecated Taints

### node-role.kubernetes.io/master

Example: `node-role.kubernetes.io/master:NoSchedule`

Taint that kubeadm previously applied on control plane nodes to allow only critical
workloads to schedule on them. Replaced by the
[`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane-taint)
taint. kubeadm no longer sets or uses this deprecated taint.

