---
layout: blog
title: 'Quality-of-Service for Memory Resources'
date: 2021-11-26
slug: qos-memory-resources
author: >
   Tim Xu (Tencent Cloud)
---

Kubernetes v1.22, released in August 2021, introduced a new alpha feature that improves how Linux nodes implement memory resource requests and limits.

In prior releases, Kubernetes did not support memory quality guarantees. 
For example, if you set container resources as follows:
```
apiVersion: v1
kind: Pod
metadata:
  name: example
spec:
  containers:
  - name: nginx
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "64Mi"
        cpu: "500m"
```
`spec.containers[].resources.requests`(e.g. cpu, memory) is designed for scheduling. When you create a Pod, the Kubernetes scheduler selects a node for the Pod to run on. Each node has a maximum capacity for each of the resource types: the amount of CPU and memory it can provide for Pods. The scheduler ensures that, for each resource type, the sum of the resource requests of the scheduled Containers is less than the capacity of the node.

`spec.containers[].resources.limits` is passed to the container runtime when the kubelet starts a container. CPU is considered a "compressible" resource. If your app starts hitting your CPU limits, Kubernetes starts throttling your container, giving your app potentially worse performance. However, it won’t be terminated. That is what "compressible" means.

In cgroup v1, and prior to this feature, the container runtime never took into account and effectively ignored spec.containers[].resources.requests["memory"]. This is unlike CPU, in which the container runtime consider both requests and limits. Furthermore, memory actually can't be compressed in cgroup v1. Because there is no way to throttle memory usage, if a container goes past its memory limit it will be terminated by the kernel with an OOM (Out of Memory) kill.

Fortunately, cgroup v2 brings a new design and implementation to achieve full protection on memory. The new feature relies on cgroups v2 which most current operating system releases for Linux already provide. With this experimental feature, [quality-of-service for pods and containers](/docs/tasks/configure-pod-container/quality-service-pod/) extends to cover not just CPU time but memory as well.

## How does it work?
Memory QoS uses the memory controller of cgroup v2 to guarantee memory resources in Kubernetes. Memory requests and limits of containers in pod are used to set specific interfaces `memory.min` and `memory.high` provided by the memory controller. When `memory.min` is set to memory requests, memory resources are reserved and never reclaimed by the kernel; this is how Memory QoS ensures the availability of memory for Kubernetes pods. And if memory limits are set in the container, this means that the system needs to limit container memory usage, Memory QoS uses `memory.high` to throttle workload approaching it's memory limit, ensuring that the system is not overwhelmed by instantaneous memory allocation.

![](./memory-qos-cal.svg)

The following table details the specific functions of these two parameters and how they correspond to Kubernetes container resources.

<table>
    <tr>
        <th style="text-align:center">File</th>
        <th style="text-align:center">Description</th>
   </tr>
   <tr>
        <td>memory.min</td>
        <td><code>memory.min</code> specifies a minimum amount of memory the cgroup must always retain, i.e., memory that can never be reclaimed by the system. If the cgroup's memory usage reaches this low limit and can’t be increased, the system OOM killer will be invoked.
        <br>
        <br>
        <i>We map it to the container's memory request</i>
        </td>
   </tr>
   <tr>
       <td>memory.high</td>
       <td><code>memory.high</code> is the memory usage throttle limit. This is the main mechanism to control a cgroup's memory use. If a cgroup's memory use goes over the high boundary specified here, the cgroup’s processes are throttled and put under heavy reclaim pressure. The default is max, meaning there is no limit. 
       <br>
       <br>
       <i>We use a formula to calculate <code>memory.high</code>, depending on container's memory limit or node allocatable memory (if container's memory limit is empty) and a throttling factor. Please refer to the KEP for more details on the formula.</i>
       </td>
   </tr>
</table>

When container memory requests are made, kubelet passes `memory.min` to the back-end CRI runtime (possibly containerd, cri-o) via the `Unified` field in CRI during container creation. The `memory.min` in container level cgroup will be set to:  

![](./container-memory-min.svg)  
<sub>i: the i<sup>th</sup> container in one pod</sub>

Since the `memory.min` interface requires that the ancestor cgroup directories are all set, the pod and node cgroup directories need to be set correctly. 

`memory.min` in pod level cgroup:  
![](./pod-memory-min.svg)  
<sub>i: the i<sup>th</sup> container in one pod</sub>

`memory.min` in node level cgroup:  
![](./node-memory-min.svg)  
<sub>i: the i<sup>th</sup> pod in one node, j: the j<sup>th</sup> container in one pod</sub>

Kubelet will manage the cgroup hierarchy of the pod level and node level cgroups directly using runc libcontainer library, while container cgroup limits are managed by the container runtime.

For memory limits, in addition to the original way of limiting memory usage, Memory QoS adds an additional feature of throttling memory allocation. A throttling factor is introduced as a multiplier (default is 0.8). If the result of multiplying memory limits by the factor is greater than memory requests, kubelet will set `memory.high` to the value and use `Unified` via CRI. And if the container does not specify memory limits, kubelet will use node allocatable memory instead. The `memory.high` in container level cgroup is set to:

![](./container-memory-high.svg)  
<sub>i: the i<sup>th</sup> container in one pod</sub>

This can can help improve stability when pod memory usage increases, ensuring that memory is throttled as it approaches the memory limit.

## How do I use it?
Here are the prerequisites for enabling Memory QoS on your Linux node, some of these are related to [Kubernetes support for cgroup v2](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2254-cgroup-v2).

1. Kubernetes since v1.22
2. [runc](https://github.com/opencontainers/runc) since v1.0.0-rc93; [containerd](https://containerd.io/) since 1.4; [cri-o](https://cri-o.io/) since 1.20
3. Linux kernel minimum version: 4.15, recommended version: 5.2+
4. Linux image with cgroupv2 enabled or enabling cgroupv2 unified_cgroup_hierarchy manually

OCI runtimes such as runc and crun already support cgroups v2 [`Unified`](https://github.com/opencontainers/runtime-spec/blob/master/config-linux.md#unified), and Kubernetes CRI has also made the desired changes to support passing [`Unified`](https://github.com/kubernetes/kubernetes/pull/102578). However, CRI Runtime support is required as well. Memory QoS in Alpha phase is designed to support containerd and cri-o. Related PR [Feature: containerd-cri support LinuxContainerResources.Unified #5627](https://github.com/containerd/containerd/pull/5627) has been merged and will be released in containerd 1.6. CRI-O [implement kube alpha features for 1.22 #5207](https://github.com/cri-o/cri-o/pull/5207) is still in WIP.

With those prerequisites met, you can enable the memory QoS feature gate (see [Set kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)).
    
## How can I learn more?

You can find more details as follows:
- [Support Memory QoS with cgroup v2](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2570-memory-qos/#readme)
- [cgroup v2](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2254-cgroup-v2/#readme)

## How do I get involved?
You can reach SIG Node by several means:
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)

You can also contact me directly:
- GitHub / Slack: @xiaoxubeii
- Email: xiaoxubeii@gmail.com