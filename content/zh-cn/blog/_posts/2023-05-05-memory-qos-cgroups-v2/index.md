---
layout: blog
title: 'Kubernetes 1.27：内存资源的服务质量（QoS）Alpha'
date: 2023-05-05
slug: qos-memory-resources
---
<!--
layout: blog
title: 'Kubernetes 1.27: Quality-of-Service for Memory Resources (alpha)'
date: 2023-05-05
slug: qos-memory-resources
-->

<!--
**Authors:** Dixita Narang (Google)
-->
**作者**：Dixita Narang (Google)

**译者**：Wilson Wu (DaoCloud)

<!--
Kubernetes v1.27, released in April 2023, introduced changes to Memory QoS (alpha) to improve memory management capabilites in Linux nodes.
-->
Kubernetes v1.27 于 2023 年 4 月发布，引入了对内存 QoS（Alpha）的更改，用于提高 Linux 节点中的内存管理功能。

<!--
Support for Memory QoS was initially added in Kubernetes v1.22, and later some
[limitations](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2570-memory-qos#reasons-for-changing-the-formula-of-memoryhigh-calculation-in-alpha-v127)
around the formula for calculating `memory.high` were identified. These limitations are addressed in Kubernetes v1.27.
-->
对内存 QoS 的支持最初是在 Kubernetes v1.22 中添加的，后来发现了关于计算 `memory.high`
公式的一些[不足](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2570-memory-qos#reasons-for-changing-the-formula-of-memoryhigh-calculation-in-alpha-v127)。
这些不足在 Kubernetes v1.27 中得到解决。

<!--
## Background
-->
## 背景 {#background}

<!--
Kubernetes allows you to optionally specify how much of each resources a container needs
in the Pod specification. The most common resources to specify are CPU and Memory.
-->
Kubernetes 允许你在 Pod 规约中设置某容器对每类资源的需求。通常要设置的资源是 CPU 和内存。

<!--
For example, a Pod manifest that defines container resource requirements could look like:
-->
例如，定义容器资源需求的 Pod 清单可能如下所示：

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

  <!--
  When you specify the resource request for containers in a Pod, the
  [Kubernetes scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)
  uses this information to decide which node to place the Pod on. The scheduler
  ensures that for each resource type, the sum of the resource requests of the
  scheduled containers is less than the total allocatable resources on the node.
  -->
  当你为 Pod 中的容器设置资源请求时，
  [Kubernetes 调度器](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)使用此信息来决定将 Pod 放置在哪个节点上。
  调度器确保对于每种资源类型，已调度容器的资源请求总和小于节点上可分配资源的总量。

* `spec.containers[].resources.limits`

  <!--
  When you specify the resource limit for containers in a Pod, the kubelet enforces
  those limits so that the running containers are not allowed to use more of those
  resources than the limits you set.
  -->
  当你为 Pod 中的容器设置资源限制时，kubelet 会强制实施这些限制，
  以便运行的容器使用的资源不得超过你设置的限制。

<!--
When the kubelet starts a container as a part of a Pod, kubelet passes the
container's requests and limits for CPU and memory to the container runtime.
The container runtime assigns both CPU request and CPU limit to a container.
Provided the system has free CPU time, the containers are guaranteed to be
allocated as much CPU as they request. Containers cannot use more CPU than
the configured limit i.e. containers CPU usage will be throttled if they
use more CPU than the specified limit within a given time slice.
-->
当 kubelet 将容器作为 Pod 的一部分启动时，kubelet 会将容器的 CPU 和内存请求和限制传递给容器运行时。
容器运行时将 CPU 请求和 CPU 限制设置到容器上。如果系统有空闲的 CPU 时间，
就保证为容器分配它们请求的 CPU 数量。容器使用的 CPU 数量不能超过配置的限制，
即，如果容器在给定时间片内使用的 CPU 数量超过指定的限制，则容器的 CPU 使用率将受到限制。

<!--
Prior to Memory QoS feature, the container runtime only used the memory limit
and discarded the memory `request` (requests were, and still are, also used to
influence [scheduling](/docs/concepts/scheduling-eviction/#scheduling)).
If a container uses more memory than the configured limit, the Linux Out Of Memory (OOM) killer will be invoked.
-->
在内存 QoS 特性出现之前，容器运行时仅使用内存限制并忽略内存的 `request`
（请求值从前到现在一直被用于影响[调度](/zh-cn/docs/concepts/scheduling-eviction/#scheduling)）。
如果容器使用的内存超过所配置的限制，则会调用 Linux 内存不足（OOM）杀手机制。

<!--
Let's compare how the container runtime on Linux typically configures memory request and limit in cgroups, with and without Memory QoS feature:
-->
让我们比较一下在有和没有内存 QoS 特性时，Linux 上的容器运行时通常如何在 cgroup 中配置内存请求和限制：

<!--
* **Memory request**
-->
* **内存请求**

  <!--
  The memory request is mainly used by kube-scheduler during (Kubernetes) Pod scheduling.
  In cgroups v1, there are no controls to specify the minimum amount of memory the cgroups
  must always retain. Hence, the container runtime did not use the value of requested memory set in the Pod spec.
  -->
  内存请求主要由 kube-scheduler 在（Kubernetes）Pod 调度时使用。
  在 cgroups v1 中，没有任何控件来设置 cgroup 必须始终保留的最小内存量。
  因此，容器运行时不使用 Pod 规约中设置的内存请求值。

  <!--
  cgroups v2 introduced a `memory.min` setting, used to specify the minimum amount of memory
  that should remain available to the processes within a given cgroup.
  If the memory usage of a cgroup is within its effective min boundary,
  the cgroup’s memory won’t be reclaimed under any conditions.
  If the kernel cannot maintain at least `memory.min` bytes of memory for the processes within the cgroup,
  the kernel invokes its OOM killer. In other words, the kernel guarantees at least this
  much memory is available or terminates processes (which may be outside the cgroup)
  in order to make memory more available. Memory QoS maps `memory.min` to
  `spec.containers[].resources.requests.memory` to ensure the availability of memory for containers in Kubernetes Pods.
  -->
  cgroups v2 中引入了一个 `memory.min` 设置，用于设置给定 cgroup 中的进程确定可用的最小内存量。
  如果 cgroup 的内存使用量在其有效最小边界内，则该 cgroup 的内存在任何情况下都不会被回收。
  如果内核无法为 cgroup 中的进程维护至少 `memory.min` 字节的内存，内核将调用其 OOM 杀手机制。
  换句话说，内核保证至少有这么多内存可用，或者终止进程（可能在 cgroup 之外）以腾出更多内存。
  MemoryQoS 机制将 `memory.min` 映射到 `spec.containers[].resources.requests.memory`，
  以确保 Kubernetes Pod 中容器的内存可用性。

<!--
* **Memory limit**
-->
* **内存限制**

  <!--
  The `memory.limit` specifies the memory limit, beyond which if the container
  tries to allocate more memory, Linux kernel will terminate a process with an
  OOM (Out of Memory) kill. If the terminated process was the main (or only)
  process inside the container, the container may exit.
  -->
  `memory.limit` 指定内存限制，如果容器尝试分配更多内存，超出该限制，
  Linux 内核将通过 OOM（内存不足）来杀死并终止进程。如果终止的进程是容器内的主
  （或唯一）进程，则容器可能会退出。

  <!--
  In cgroups v1, `memory.limit_in_bytes` interface is used to set the memory usage limit.
  However, unlike CPU, it was not possible to apply memory throttling: as soon as a container
  crossed the memory limit, it would be OOM killed.
  -->
  在 cgroups v1 中，`memory.limit_in_bytes` 接口用于设置内存用量限制。
  然而，与 CPU 不同的是，内存用量是无法抑制的：一旦容器超过内存限制，它就会被 OOM 杀死。

  <!--
  In cgroups v2, `memory.max` is analogous to `memory.limit_in_bytes` in cgroupv1.
  Memory QoS maps `memory.max` to `spec.containers[].resources.limits.memory` to
  specify the hard limit for memory usage. If the memory consumption goes above
  this level, the kernel invokes its OOM Killer.
  -->
  在 cgroups v2 中，`memory.max` 类似于 cgroupv1 中的 `memory.limit_in_bytes`。
  MemoryQoS 机制将 `memory.max` 映射到 `spec.containers[].resources.limits.memory`
  以设置内存用量的硬性限制。如果内存消耗超过此水平，内核将调用其 OOM 杀手机制。

  <!--
  cgroups v2 also added `memory.high` configuration . Memory QoS uses `memory.high`
  to set memory usage throttle limit. If the `memory.high` limit is breached,
  the offending cgroups are throttled, and the kernel tries to reclaim memory which may avoid an OOM kill.
  -->
  cgroups v2 中还添加了 `memory.high` 配置。MemoryQoS 机制使用 `memory.high` 来设置内存用量抑制上限。
  如果超出了 `memory.high` 限制，则违规的 cgroup 会受到抑制，并且内核会尝试回收内存，这可能会避免 OOM 终止。

<!--
## How it works
-->
## 如何工作 {#how-it-works}

<!--
### Cgroups v2 memory controller interfaces & Kubernetes container resources mapping
-->
### Cgroups v2 内存控制器接口和 Kubernetes 容器资源映 {#cgroups-v2-memory-controller-interfaces-kubernetes-container-resources-mapping}

<!--
Memory QoS uses the memory controller of cgroups v2 to guarantee memory resources
in Kubernetes. cgroupv2 interfaces that this feature uses are:
-->
MemoryQoS 机制使用 cgroups v2 的内存控制器来保证 Kubernetes 中的内存资源。
此特性使用的 cgroupv2 接口有：

* `memory.max`
* `memory.min`
* `memory.high`

<!--
{{< figure src="/blog/2023/05/05/qos-memory-resources/memory-qos-cal.svg" title="Memory QoS Levels" alt="Memory QoS Levels" >}}
-->
{{< figure src="/blog/2023/05/05/qos-memory-resources/memory-qos-cal.svg" title="内存 QoS 级别" alt="内存 QoS 级别" >}}

<!--
`memory.max` is mapped to `limits.memory` specified in the Pod spec.
The kubelet and the container runtime configure the limit in the respective cgroup.
The kernel enforces the limit to prevent the container from using more than the
configured resource limit. If a process in a container tries to consume more
than the specified limit, kernel terminates a process(es) with an out of memory Out of Memory (OOM) error.
-->
`memory.max` 映射到 Pod 规约中指定的 `limits.memory`。
kubelet 和容器运行时在对应的 cgroup 中配置限制值。内核强制执行限制机制以防止容器用量超过所配置的资源限制。
如果容器中的进程尝试消耗的资源超过所设置的限制值，内核将终止进程并报告内存不足（OOM）错误。

<!--
{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-max.svg" title="memory.max maps to limits.memory" alt="memory.max maps to limits.memory" >}}
-->
{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-max.svg" title="memory.max 映射到 limit.memory" alt="memory.max 映射到 limit.memory" >}}

<!--
`memory.min` is mapped to `requests.memory`, which results in reservation of
memory resources that should never be reclaimed by the kernel.
This is how Memory QoS ensures the availability of memory for Kubernetes pods.
If there's no unprotected reclaimable memory available, the OOM killer is
invoked to make more memory available.
-->
`memory.min` 被映射到 `requests.memory`，这会导致内存资源被预留而永远不会被内核回收。
这就是 MemoryQoS 机制确保 Kubernetes Pod 内存可用性的方式。
如果没有不受保护的、可回收的内存，则内核会调用 OOM 杀手以提供更多可用内存。

<!--
{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-min.svg" title="memory.min maps to requests.memory" alt="memory.min maps to requests.memory" >}}
-->
{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-min.svg" title="memory.min 映射到 requests.memory" alt="memory.min 映射到 requests.memory" >}}

<!--
For memory protection, in addition to the original way of limiting memory usage,
Memory QoS throttles workload approaching its memory limit, ensuring that the system
is not overwhelmed by sporadic increases in memory usage. A new field, `memoryThrottlingFactor`,
is available in the KubeletConfiguration when you enable MemoryQoS feature. It is set to 0.9 by default.
`memory.high` is mapped to throttling limit calculated by using `memoryThrottlingFactor`,
`requests.memory` and `limits.memory` as in the formula below, and rounding down the value to the nearest page size:
-->
对于内存保护，除了原来的限制内存用量的方式之外，MemoryQoS 机制还会对用量接近其内存限制的工作负载进行抑制，
确保系统不会因内存使用的零星增加而不堪重负。当你启用 MemoryQoS 特性时，
KubeletConfiguration 中将提供一个新字段 `memoryThrottlingFactor`。默认设置为 0.9。
`memory.high` 被映射到通过 `memoryThrottlingFactor`、`requests.memory` 和 `limits.memory`
计算得出的抑制上限，计算方法如下式所示，所得的值向下舍入到最接近的页面大小：

<!--
{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high.svg" title="memory.high formula" alt="memory.high formula" >}}
-->
{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high.svg" title="memory.high 公式" alt="memory.high 公式" >}}

<!--
**Note**: If a container has no memory limits specified, `limits.memory` is substituted for node allocatable memory.
-->
**注意**：如果容器没有指定内存限制，则 `limits.memory` 将被替换为节点可分配内存的值。

<!--
**Summary:**
-->
**总结：**
<table>
    <tr>
        <!--
        <th style="text-align:center">File</th>
        <th style="text-align:center">Description</th>
        -->
        <th style="text-align:center">文件</th>
        <th style="text-align:center">描述</th>
    </tr>
    <tr>
        <td>memory.max</td>
        <!-- <td><code>memory.max</code> specifies the maximum memory limit, a container
        is allowed to use. If a process within the container tries to consume more memory than the configured limit,
        the kernel terminates the process with an Out of Memory (OOM) error.
        <br>
        <br>
        <i>It is mapped to the container's memory limit specified in Pod manifest.</i>
        </td> -->
        <td><code>memory.max</code> 指定允许容器使用的最大内存限制。
        如果容器内的进程尝试使用的内存量超过所配置的限制值，内核将终止该进程并显示内存不足（OOM）错误。
        <br>
        <br>
        <i>此配置映射到 Pod 清单中指定的容器内存限制。</i>
        </td>
    </tr>
    <tr>
        <td>memory.min</td>
        <!--
        <td><code>memory.min</code> specifies a minimum amount of memory the cgroups must always retain, i.e.,
        memory that should never be reclaimed by the system. If there's no unprotected reclaimable memory available, OOM kill is invoked.
        <br>
        <br>
        <i>It is mapped to the container's memory request specified in the Pod manifest.</i>
        </td>
        -->
        <td><code>memory.min</code> 指定 cgroup 必须始终保留的最小内存量，
        即系统永远不应回收的内存。如果没有可用的未受保护的可回收内存，则会调用 OOM 终止程序。
        <br>
        <br>
        <i>此配置映射到 Pod 清单中指定的容器的内存请求。</i>
        </td>
   </tr>
   <tr>
       <td>memory.high</td>
       <!--
       <td><code>memory.high</code> specifies the memory usage throttle limit. This is the main
       mechanism to control a cgroup's memory use. If cgroups memory use goes over the high boundary
       specified here, the cgroups processes are throttled and put under heavy reclaim pressure.
       <br>
       <br>
       <i>Kubernetes uses a formula to calculate <code>memory.high</code>, depending on container's memory request,
        memory limit or node allocatable memory (if container's memory limit is empty) and a throttling factor.
        Please refer to the <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2570-memory-qos">KEP</a> for more details on the formula.</i>
       </td>
       -->
       <td><code>memory.high</code> 指定内存用量抑制上限。这是控制 cgroup 内存用量的主要机制。
       如果 cgroups 内存使用量超过此处指定的上限，则 cgroups 进程将受到抑制并标记回收压力较大。
       <br>
       <br>
       <i>Kubernetes 使用公式来计算 <code>memory.high</code>，具体取决于容器的内存请求、
       内存限制或节点可分配内存（如果容器的内存限制为空）和抑制因子。有关公式的更多详细信息，
       请参阅 <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2570-memory-qos">KEP</a>。</i>
       </td>
   </tr>
</table>

<!--
**Note** `memory.high` is set only on container level cgroups while `memory.min` is set on container, pod, and node level cgroups.
-->
**注意**：`memory.high` 仅可在容器级别的 cgroups 上设置，
而 `memory.min` 则可在容器、Pod 和节点级别的 cgroups 上设置。

<!--
### `memory.min` calculations for cgroups heirarchy
-->
### 针对 cgroup 层次结构的 `memory.min` 计算 {#memory-min-calculations-for-cgroups-heirarchy}

<!--
When container memory requests are made, kubelet passes `memory.min` to the back-end CRI
runtime (such as containerd or CRI-O) via the `Unified` field in CRI during container creation.
The `memory.min` in container level cgroups will be set to:
-->
当发出容器内存请求时，kubelet 在创建容器期间通过 CRI 中的 `Unified` 字段将 `memory.min`
传递给后端 CRI 运行时（例如 containerd 或 CRI-O）。容器级别 cgroup 中的 `memory.min` 将设置为：

$memory.min =  pod.spec.containers[i].resources.requests[memory]$
<!--
<sub>for every i<sup>th</sup> container in a pod</sub>
-->
<sub>对于 Pod 中每个 i<sup>th</sup> 容器</sub>
<br>
<br>
<!--
Since the `memory.min` interface requires that the ancestor cgroups directories are all set,
the pod and node cgroups directories need to be set correctly. 
-->
由于 `memory.min` 接口要求祖先 cgroups 目录全部被设置，
因此需要正确设置 Pod 和节点的 cgroups 目录。

<!--
`memory.min` in pod level cgroup:
-->
Pod 级别 cgroup 中的 `memory.min`：

$memory.min = \sum_{i=0}^{no. of pods}pod.spec.containers[i].resources.requests[memory]$
<!--
<sub>for every i<sup>th</sup> container in a pod</sub>
-->
<sub>对于 Pod 中每个 i<sup>th</sup> 容器</sub>
<br>
<br>
<!--
`memory.min` in node level cgroup:
-->
节点级别 cgroup 中的 `memory.min`：

$memory.min = \sum_{i}^{no. of nodes}\sum_{j}^{no. of pods}pod[i].spec.containers[j].resources.requests[memory]$
<!--
<sub>for every j<sup>th</sup> container in every i<sup>th</sup> pod on a node</sub>
-->
<sub>对于节点中每个 i<sup>th</sup> Pod 中的每个 j<sup>th</sup> 容器</sub>
<br>
<br>
<!--
Kubelet will manage the cgroups hierarchy of the pod level and node level cgroups directly
using the libcontainer library (from the runc project), while container cgroups limits are managed by the container runtime.
-->
Kubelet 将直接使用 libcontainer 库（来自 runc 项目）管理 Pod 级别和节点级别
cgroups 的层次结构，而容器 cgroups 限制由容器运行时管理。

<!--
### Support for Pod QoS classes
-->
### 支持 Pod QoS 类别 {#support-for-pod-qos-classes}

<!--
Based on user feedback for the Alpha feature in Kubernetes v1.22, some users would like
to opt out of MemoryQoS on a per-pod basis to ensure there is no early memory throttling.
Therefore, in Kubernetes v1.27 Memory QOS also supports memory.high to be set as per
Quality of Service(QoS) for Pod classes. Following are the different cases for memory.high as per QOS classes:
-->
根据用户对 Kubernetes v1.22 中 Alpha 特性的反馈，一些用户希望在 Pod 层面选择不启用 MemoryQoS，
以确保不会出现早期内存抑制现象。因此，在 Kubernetes v1.27 中 MemoryQoS 还支持根据
服务质量（QoS）对 Pod 类设置 memory.high。以下是按 QoS 类设置 memory.high 的几种情况：

<!--
1. **Guaranteed pods** by their QoS definition require memory requests=memory limits and are
   not overcommitted. Hence MemoryQoS feature is disabled on those pods by not setting
   memory.high. This ensures that Guaranteed pods can fully use their memory requests up
   to their set limit, and not hit any throttling.
-->
1. **Guaranteed Pods**：根据其 QoS 定义，要求 Pod 的内存请求等于其内存限制，并且不允许超配。
   因此，通过不设置 memory.high，MemoryQoS 特性会针对这些 Pod 被禁用。
   这样做可以确保 **Guaranteed Pod** 充分利用其内存请求，也就是其内存限制，并且不会被抑制。

<!--
2. **Burstable pods** by their QoS definition require at least one container in the Pod with
   CPU or memory request or limit set.
-->
2. **Burstable Pod**：根据其 QoS 定义，要求 Pod 中至少有一个容器具有 CPU 或内存请求或限制设置。

   <!--
   * When requests.memory and limits.memory are set, the formula is used as-is:
   -->
   * 当 requests.memory 和 limits.memory 都被设置时，公式按原样使用：

     <!--
     {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-limit.svg" title="memory.high when requests and limits are set" alt="memory.high when requests and limits are set" >}}
     -->
     {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-limit.svg" title="当请求和限制被设置时的 memory.high" alt="当请求和限制被设置时的 memory.high" >}}

   <!--
   * When requests.memory is set and limits.memory is not set, limits.memory is substituted for node allocatable memory in the formula:
   -->
   * 当设置了 requests.memory 但未设置 limits.memory 时，公式中的 limits.memory 替换为节点可分配内存：

     <!--
     {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-no-limits.svg" title="memory.high when requests and limits are not set" alt="memory.high when requests and limits are not set" >}}
     -->
     {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-no-limits.svg" title="当请求和限制未被设置时的 memory.high" alt="当请求和限制未被设置时的 memory.high" >}}

<!--
3. **BestEffort** by their QoS definition do not require any memory or CPU limits or requests.
   For this case, kubernetes sets requests.memory = 0 and substitute limits.memory for node allocatable
   memory in the formula:
-->
3. **BestEffort Pod**：根据其 QoS 定义，不需要设置内存或 CPU 限制或请求。对于这种情况，
   kubernetes 设置 requests.memory = 0 并将公式中的 limits.memory 替换为节点可分配内存：

   <!--
   {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-best-effort.svg" title="memory.high for BestEffort Pod" alt="memory.high for BestEffort Pod" >}}
   -->
   {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-best-effort.svg" title="BestEffort Pod 的 memory.high" alt="BestEffort Pod 的 memory.high" >}}

<!--
**Summary**: Only Pods in Burstable and BestEffort QoS classes will set `memory.high`. Guaranteed QoS pods do not set `memory.high` as their memory is guaranteed.
-->
**总结**：只有 Burstable 和 BestEffort QoS 类别中的 Pod 才会设置 `memory.high`。
Guaranteed QoS 的 Pod 不会设置 `memory.high`，因为它们的内存是有保证的。

<!--
## How do I use it?
-->
## 我该如何使用它？ {#how-do-i-use-it}

<!--
The prerequisites for enabling Memory QoS feature on your Linux node are:
-->
在 Linux 节点上启用 MemoryQoS 特性的先决条件是：

<!--
1. Verify the [requirements](/docs/concepts/architecture/cgroups/#requirements)
   related to [Kubernetes support for cgroups v2](/docs/concepts/architecture/cgroups)
   are met.
2. Ensure CRI Runtime supports Memory QoS. At the time of writing, only containerd
   and CRI-O provide support compatible with Memory QoS (alpha). This was implemented in the following PRs:
   * Containerd: [Feature: containerd-cri support LinuxContainerResources.Unified #5627](https://github.com/containerd/containerd/pull/5627).
   * CRI-O: [implement kube alpha features for 1.22 #5207](https://github.com/cri-o/cri-o/pull/5207).
-->
1. 验证是否满足
   [Kubernetes 对 cgroup v2 支持](/zh-cn/docs/concepts/architecture/cgroups)的相关[要求](/zh-cn/docs/concepts/architecture/cgroups/#requirements)。

2. 确保 CRI 运行时支持内存 QoS。在撰写本文时，
   只有 Containerd 和 CRI-O 提供与内存 QoS（alpha）兼容的支持。是在以下 PR 中实现的：
    * Containerd：[Feature: containerd-cri support LinuxContainerResources.Unified #5627](https://github.com/containerd/containerd/pull/5627)。
    * CRI-O：[implement kube alpha features for 1.22 #5207](https://github.com/cri-o/cri-o/pull/5207)。

<!--
Memory QoS remains an alpha feature for Kubernetes v1.27. You can enable the feature by setting `MemoryQoS=true` in the kubelet configuration file:
-->
MemoryQoS 在 Kubernetes v1.27 中仍然是 Alpha 特性。
你可以通过在 kubelet 配置文件中设置 `MemoryQoS=true` 来启用该特性：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: true
```

<!--
## How do I get involved?
-->
## 我如何参与？ {#how-do-i-get-involved}

<!--
Huge thank you to all the contributors who helped with the design, implementation, and review of this feature:
-->
非常感谢所有帮助设计、实施和审查此功能的贡献者：

* Dixita Narang ([ndixita](https://github.com/ndixita))
* Tim Xu ([xiaoxubeii](https://github.com/xiaoxubeii))
* Paco Xu ([pacoxu](https://github.com/pacoxu))
* David Porter([bobbypage](https://github.com/bobbypage))
* Mrunal Patel([mrunalp](https://github.com/mrunalp))

<!--
For those interested in getting involved in future discussions on Memory QoS feature,
you can reach out SIG Node by several means:
-->
对于那些有兴趣参与未来内存 QoS 特性讨论的人，你可以通过多种方式联系 SIG Node：

<!--
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
-->
- Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [开放社区 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnode)
