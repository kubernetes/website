---
layout: blog
title: "Kubernetes Memory Manager moves to beta"
date: 2021-08-11
slug: kubernetes-1-22-feature-memory-manager-moves-to-beta
author: >
  Artyom Lukianov (Red Hat),
  Cezary Zukowski (Samsung) 
---

The blog post explains some of the internals of the _Memory manager_, a beta feature
of Kubernetes 1.22. In Kubernetes, the Memory Manager is a
[kubelet](https://kubernetes.io/docs/concepts/overview/components/#kubelet) subcomponent.
The memory manage provides guaranteed memory (and hugepages)
allocation for pods in the `Guaranteed` [QoS class](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/#qos-classes).

This blog post covers:

1. [Why do you need it?](#Why-do-you-need-it?)
2. [The internal details of how the **MemoryManager** works](#How-does-it-work?)
3. [Current limitations of the **MemoryManager**](#Current-limitations)
4. [Future work for the **MemoryManager**](#Future-work-for-the-Memory-Manager)

## Why do you need it?

Some Kubernetes workloads run on nodes with
[non-uniform memory access](https://en.wikipedia.org/wiki/Non-uniform_memory_access) (NUMA).
Suppose you have NUMA nodes in your cluster. In that case, you'll know about the potential for extra latency when
compute resources need to access memory on the different NUMA locality.

To get the best performance and latency for your workload, container CPUs,
peripheral devices, and memory should all be aligned to the same NUMA
locality.
Before Kubernetes v1.22, the kubelet already provided a set of managers to
align CPUs and PCI devices, but you did not have a way to align memory.
The Linux kernel was able to make best-effort attempts to allocate 
memory for tasks from the same NUMA node where the container is
executing are placed, but without any guarantee about that placement.

## How does it work?

The memory manager is doing two main things:
- provides the topology hint to the Topology Manager
- allocates the memory for containers and updates the state

The overall sequence of the Memory Manager under the Kubelet

![MemoryManagerDiagram](/images/blog/2021-08-11-memory-manager-moves-to-beta/MemoryManagerDiagram.svg "MemoryManagerDiagram")

During the Admission phase:

1. When first handling a new pod, the kubelet calls the TopologyManager's `Admit()` method.
2. The Topology Manager is calling `GetTopologyHints()` for every hint provider including the Memory Manager.
3. The Memory Manager calculates all possible NUMA nodes combinations for every container inside the pod and returns hints to the Topology Manager.
4. The Topology Manager calls to `Allocate()` for every hint provider including the Memory Manager.
5. The Memory Manager allocates the memory under the state according to the hint that the Topology Manager chose.

During Pod creation:

1. The kubelet calls `PreCreateContainer()`.
2. For each container, the Memory Manager looks the NUMA nodes where it allocated the
   memory for the container and then returns that information to the kubelet.
3. The kubelet creates the container, via CRI, using a container specification
   that incorporates information from the Memory Manager information.

### Let's talk about the configuration

By default, the Memory Manager runs with the `None` policy, meaning it will just
relax and not do anything. To make use of the Memory Manager, you should set
two command line options for the kubelet:

- `--memory-manager-policy=Static`
- `--reserved-memory="<numaNodeID>:<resourceName>=<quantity>"`

The value for `--memory-manager-policy` is straightforward: `Static`. Deciding what to specify for `--reserved-memory` takes more thought. To configure it correctly, you should follow two main rules:

- The amount of reserved memory for the `memory` resource must be greater than zero.
- The amount of reserved memory for the resource type must be equal
  to [NodeAllocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
  (`kube-reserved + system-reserved + eviction-hard`) for the resource.
  You can read more about memory reservations in [Reserve Compute Resources for System Daemons](/docs/tasks/administer-cluster/reserve-compute-resources/).

![Reserved memory](/images/blog/2021-08-11-memory-manager-moves-to-beta/ReservedMemory.svg)

## Current limitations

The 1.22 release and promotion to beta brings along enhancements and fixes, but the Memory Manager still has several limitations.

### Single vs Cross NUMA node allocation

The NUMA node can not have both single and cross NUMA node allocations. When the container memory is pinned to two or more NUMA nodes, we can not know from which NUMA node the container will consume the memory.

![Single vs Cross NUMA allocation](/images/blog/2021-08-11-memory-manager-moves-to-beta/SingleCrossNUMAAllocation.svg "SingleCrossNUMAAllocation")

1. The `container1` started on the NUMA node 0 and requests *5Gi* of the memory but currently is consuming only *3Gi* of the memory.
2. For container2 the memory request is 10Gi, and no single NUMA node can satisfy it.
3. The `container2` consumes *3.5Gi* of the memory from the NUMA node 0, but once the `container1` will require more memory, it will not have it, and the kernel will kill one of the containers with the *OOM* error.

To prevent such issues, the Memory Manager will fail the admission of the `container2` until the machine has two NUMA nodes without a single NUMA node allocation.

### Works only for Guaranteed pods

The Memory Manager can not guarantee memory allocation for Burstable pods,
also when the Burstable pod has specified equal memory limit and request.

Let's assume you have two Burstable pods: `pod1` has containers with
equal memory request and limits, and `pod2` has containers only with a
memory request set. You want to guarantee memory allocation for the `pod1`.
To the Linux kernel, processes in either pod have the same *OOM score*,
once the kernel finds that it does not have enough memory, it can kill
processes that belong to pod `pod1`.

### Memory fragmentation

The sequence of Pods and containers that start and stop can fragment the memory on NUMA nodes.
The alpha implementation of the Memory Manager does not have any mechanism to balance pods and defragment memory back.

## Future work for the Memory Manager

We do not want to stop with the current state of the Memory Manager and are looking to
make improvements, including in the following areas.

### Make the Memory Manager allocation algorithm smarter

The current algorithm ignores distances between NUMA nodes during the
calculation of the allocation. If same-node placement isn't available, we can still
provide better performance compared to the current implementation, by changing the
Memory Manager to prefer the closest NUMA nodes for cross-node allocation.

### Reduce the number of admission errors

The default Kubernetes scheduler is not aware of the node's NUMA topology, and it can be a reason for many admission errors during the pod start.
We're hoping to add a KEP (Kubernetes Enhancement Proposal) to cover improvements in this area. 
Follow [Topology aware scheduler plugin in kube-scheduler](https://github.com/kubernetes/enhancements/issues/2044) to see how this idea progresses.


## Conclusion
With the promotion of the Memory Manager to beta in 1.22, we encourage everyone to give it a try and look forward to any feedback you may have. While there are still several limitations, we have a set of enhancements planned to address them and look forward to providing you with many new features in upcoming releases.
If you have ideas for additional enhancements or a desire for certain features, please let us know. The team is always open to suggestions to enhance and improve the Memory Manager.
We hope you have found this blog informative and helpful! Let us know if you have any questions or comments.

You can contact us via:
- The Kubernetes [#sig-node ](https://kubernetes.slack.com/messages/sig-node)
  channel in Slack (visit https://slack.k8s.io/ for an invitation if you need one)
- The SIG Node mailing list, [kubernetes-sig-node@googlegroups.com](https://groups.google.com/g/kubernetes-sig-node)
