---
layout: blog
title: 'Kubernetes 1.27: Quality-of-Service for Memory Resources (alpha)'
date: 2023-05-05
slug: qos-memory-resources
author: >
  Dixita Narang (Google)
---

Kubernetes v1.27, released in April 2023, introduced changes to
Memory QoS (alpha) to improve memory management capabilites in Linux nodes.  

Support for Memory QoS was initially added in Kubernetes v1.22, and later some
[limitations](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2570-memory-qos#reasons-for-changing-the-formula-of-memoryhigh-calculation-in-alpha-v127)
around the formula for calculating `memory.high` were identified. These limitations are
addressed in Kubernetes v1.27.

## Background

Kubernetes allows you to optionally specify how much of each resources a container needs
in the Pod specification. The most common resources to specify are CPU and Memory.

For example, a Pod manifest that defines container resource requirements could look like:

```yaml
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

* `spec.containers[].resources.requests`

  When you specify the resource request for containers in a Pod, the
  [Kubernetes scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)
  uses this information to decide which node to place the Pod on. The scheduler
  ensures that for each resource type, the sum of the resource requests of the
  scheduled containers is less than the total allocatable resources on the node.

* `spec.containers[].resources.limits`

  When you specify the resource limit for containers in a Pod, the kubelet enforces
  those limits so that the running containers are not allowed to use more of those
  resources than the limits you set.

When the kubelet starts a container as a part of a Pod, kubelet passes the
container's requests and limits for CPU and memory to the container runtime.
The container runtime assigns both CPU request and CPU limit to a container.
Provided the system has free CPU time, the containers are guaranteed to be
allocated as much CPU as they request. Containers cannot use more CPU than
the configured limit i.e. containers CPU usage will be throttled if they
use more CPU than the specified limit within a given time slice.

Prior to Memory QoS feature, the container runtime only used the memory
limit and discarded the memory `request` (requests were, and still are,
also used to influence [scheduling](/docs/concepts/scheduling-eviction/#scheduling)).
If a container uses more memory than the configured limit,
the Linux Out Of Memory (OOM) killer will be invoked.

Let's compare how the container runtime on Linux typically configures memory
request and limit in cgroups, with and without Memory QoS feature:

* **Memory request**

  The memory request is mainly used by kube-scheduler during (Kubernetes) Pod
  scheduling. In cgroups v1, there are no controls to specify the minimum amount
  of memory the cgroups must always retain. Hence, the container runtime did not
  use the value of requested memory set in the Pod spec.

  cgroups v2 introduced a `memory.min` setting, used to specify the minimum
  amount of memory that should remain available to the processes within
  a given cgroup. If the memory usage of a cgroup is within its effective
  min boundary, the cgroup’s memory won’t be reclaimed under any conditions.
  If the kernel cannot maintain at least `memory.min` bytes of memory for the
  processes within the cgroup, the kernel invokes its OOM killer. In other words,
  the kernel guarantees at least this much memory is available or terminates
  processes (which may be outside the cgroup) in order to make memory more available.
  Memory QoS maps `memory.min` to `spec.containers[].resources.requests.memory`
  to ensure the availability of memory for containers in Kubernetes Pods.

* **Memory limit**
  
  The `memory.limit` specifies the memory limit, beyond which if the container tries
  to allocate more memory, Linux kernel will terminate a process with an
  OOM (Out of Memory) kill. If the terminated process was the main (or only) process
  inside the container, the container may exit.

  In cgroups v1, `memory.limit_in_bytes` interface is used to set the memory usage limit.
  However, unlike CPU, it was not possible to apply memory throttling: as soon as a
  container crossed the memory limit, it would be OOM killed.

  In cgroups v2, `memory.max` is analogous to `memory.limit_in_bytes` in cgroupv1.
  Memory QoS maps `memory.max` to `spec.containers[].resources.limits.memory` to
  specify the hard limit for memory usage. If the memory consumption goes above this
  level, the kernel invokes its OOM Killer.

  cgroups v2 also added `memory.high` configuration. Memory QoS uses `memory.high`
  to set memory usage throttle limit. If the `memory.high` limit is breached,
  the offending cgroups are throttled, and the kernel tries to reclaim memory
  which may avoid an OOM kill.

## How it works

### Cgroups v2 memory controller interfaces & Kubernetes container resources mapping

Memory QoS uses the memory controller of cgroups v2 to guarantee memory resources in
Kubernetes. cgroupv2 interfaces that this feature uses are:

* `memory.max`
* `memory.min`
* `memory.high`.

{{< figure src="/blog/2023/05/05/qos-memory-resources/memory-qos-cal.svg" title="Memory QoS Levels" alt="Memory QoS Levels" >}}

`memory.max` is mapped to `limits.memory` specified in the Pod spec. The kubelet and
the container runtime configure the limit in the respective cgroup. The kernel
enforces the limit to prevent the container from using more than the configured
resource limit. If a process in a container tries to consume more than the
specified limit, kernel terminates a process(es) with an Out of Memory (OOM) error.

{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-max.svg" title="memory.max maps to limits.memory" alt="memory.max maps to limits.memory" >}}

`memory.min` is mapped to `requests.memory`, which results in reservation of memory resources
that should never be reclaimed by the kernel. This is how Memory QoS ensures the availability of
memory for Kubernetes pods. If there's no unprotected reclaimable memory available, the OOM
killer is invoked to make more memory available.

{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-min.svg" title="memory.min maps to requests.memory" alt="memory.min maps to requests.memory" >}}

For memory protection, in addition to the original way of limiting memory usage, Memory QoS
throttles workload approaching its memory limit, ensuring that the system is not overwhelmed
by sporadic increases in memory usage. A new field, `memoryThrottlingFactor`, is available in
the KubeletConfiguration when you enable MemoryQoS feature. It is set to 0.9 by default.
`memory.high` is mapped to throttling limit calculated by using `memoryThrottlingFactor`,
`requests.memory` and `limits.memory` as in the formula below, and rounding down the
value to the nearest page size:

{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high.svg" title="memory.high formula" alt="memory.high formula" >}} 

{{< note >}}
If a container has no memory limits specified, `limits.memory` is substituted for node allocatable memory.
{{< /note >}}

**Summary:**
<table>
    <tr>
        <th style="text-align:center">File</th>
        <th style="text-align:center">Description</th>
   </tr>
   <tr>
        <td>memory.max</td>
        <td><code>memory.max</code> specifies the maximum memory limit,
        a container is allowed to use. If a process within the container
        tries to consume more memory than the configured limit,
        the kernel terminates the process with an Out of Memory (OOM) error.
        <br>
        <br>
        <i>It is mapped to the container's memory limit specified in Pod manifest.</i>
        </td>
   </tr>
   <tr>
        <td>memory.min</td>
        <td><code>memory.min</code> specifies a minimum amount of memory
        the cgroups must always retain, i.e., memory that should never be
        reclaimed by the system.
        If there's no unprotected reclaimable memory available, OOM kill is invoked.
        <br>
        <br>
        <i>It is mapped to the container's memory request specified in the Pod manifest.</i>
        </td>
   </tr>
   <tr>
       <td>memory.high</td>
       <td><code>memory.high</code> specifies the memory usage throttle limit.
       This is the main mechanism to control a cgroup's memory use. If
       cgroups memory use goes over the high boundary specified here,
       the cgroups processes are throttled and put under heavy reclaim pressure.
       <br>
       <br>
       <i>Kubernetes uses a formula to calculate <code>memory.high</code>,
       depending on container's memory request, memory limit or node allocatable memory
      (if container's memory limit is empty) and a throttling factor.
      Please refer to the <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2570-memory-qos">KEP</a>
      for more details on the formula.</i>
       </td>
   </tr>
</table>

{{< note >}}
`memory.high` is set only on container level cgroups while `memory.min` is set on
container, pod, and node level cgroups.
{{< /note >}}

### `memory.min` calculations for cgroups heirarchy

When container memory requests are made, kubelet passes `memory.min` to the back-end 
CRI runtime (such as containerd or CRI-O) via the `Unified` field in CRI during 
container creation. For every i<sup>th</sup> container in a pod, the `memory.min`
in container level cgroups will be set to:  

```formula
memory.min =  pod.spec.containers[i].resources.requests[memory]
```

Since the `memory.min` interface requires that the ancestor cgroups directories are all
set, the pod and node cgroups directories need to be set correctly.

For every i<sup>th</sup> container in a pod, `memory.min` in pod level cgroup:

```formula
memory.min = \sum_{i=0}^{no. of pods}pod.spec.containers[i].resources.requests[memory]
```

For every j<sup>th</sup> container in every i<sup>th</sup> pod on a node, `memory.min` in node level cgroup:

```formula
memory.min = \sum_{i}^{no. of nodes}\sum_{j}^{no. of pods}pod[i].spec.containers[j].resources.requests[memory]
```

Kubelet will manage the cgroups hierarchy of the pod level and node level cgroups
directly using the libcontainer library (from the runc project), while container
cgroups limits are managed by the container runtime.

### Support for Pod QoS classes

Based on user feedback for the Alpha feature in Kubernetes v1.22, some users would like
to opt out of MemoryQoS on a per-pod basis to ensure there is no early memory throttling.
Therefore, in Kubernetes v1.27 Memory QOS also supports memory.high to be set as per
Quality of Service(QoS) for Pod classes. Following are the different cases for memory.high
as per QOS classes:

1. **Guaranteed pods** by their QoS definition require memory requests=memory limits and are
   not overcommitted. Hence MemoryQoS feature is disabled on those pods by not setting
   memory.high. This ensures that Guaranteed pods can fully use their memory requests up
   to their set limit, and not hit any throttling.

1. **Burstable pods** by their QoS definition require at least one container in the Pod with
   CPU or memory request or limit set.
    
   * When requests.memory and limits.memory are set, the formula is used as-is:

     {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-limit.svg" title="memory.high when requests and limits are set" alt="memory.high when requests and limits are set" >}}

   * When requests.memory is set and limits.memory is not set, limits.memory is substituted
     for node allocatable memory in the formula:

     {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-no-limits.svg" title="memory.high when requests and limits are not set" alt="memory.high when requests and limits are not set" >}}

1. **BestEffort** by their QoS definition do not require any memory or CPU limits or requests.
   For this case, kubernetes sets requests.memory = 0 and substitute limits.memory for node allocatable
   memory in the formula:

   {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-best-effort.svg" title="memory.high for BestEffort Pod" alt="memory.high for BestEffort Pod" >}}

**Summary**: Only Pods in Burstable and BestEffort QoS classes will set `memory.high`.
Guaranteed QoS pods do not set `memory.high` as their memory is guaranteed.

## How do I use it?

The prerequisites for enabling Memory QoS feature on your Linux node are:

1. Verify the [requirements](/docs/concepts/architecture/cgroups/#requirements)
   related to [Kubernetes support for cgroups v2](/docs/concepts/architecture/cgroups)
   are met.
1. Ensure CRI Runtime supports Memory QoS. At the time of writing, only containerd
   and CRI-O provide support compatible with Memory QoS (alpha). This was implemented
   in the following PRs:
   * Containerd: [Feature: containerd-cri support LinuxContainerResources.Unified #5627](https://github.com/containerd/containerd/pull/5627).
   * CRI-O: [implement kube alpha features for 1.22 #5207](https://github.com/cri-o/cri-o/pull/5207).

Memory QoS remains an alpha feature for Kubernetes v1.27. You can enable the feature by setting
`MemoryQoS=true` in the kubelet configuration file:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: true
```

## How do I get involved?

Huge thank you to all the contributors who helped with the design, implementation,
and review of this feature:

* Dixita Narang ([ndixita](https://github.com/ndixita))
* Tim Xu ([xiaoxubeii](https://github.com/xiaoxubeii))
* Paco Xu ([pacoxu](https://github.com/pacoxu))
* David Porter([bobbypage](https://github.com/bobbypage))
* Mrunal Patel([mrunalp](https://github.com/mrunalp))

For those interested in getting involved in future discussions on Memory QoS feature,
you can reach out SIG Node by several means:

- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
