---
layout: blog
title: "Kubernetes 1.27：关于加快 Pod 启动的进展"
date: 2023-05-15T00:00:00+0000
slug: speed-up-pod-startup
---
<!--
layout: blog
title: "Kubernetes 1.27: updates on speeding up Pod startup"
date: 2023-05-15T00:00:00+0000
slug: speed-up-pod-startup
-->

<!--
**Authors**: Paco Xu (DaoCloud), Sergey Kanzhelev (Google), Ruiwen Zhao (Google)
-->
**作者**：Paco Xu (DaoCloud), Sergey Kanzhelev (Google), Ruiwen Zhao (Google)
**译者**：Michael Yao (DaoCloud)

<!--
How can Pod start-up be accelerated on nodes in large clusters? This is a common issue that
cluster administrators may face.

This blog post focuses on methods to speed up pod start-up from the kubelet side. It does not
involve the creation time of pods by controller-manager through kube-apiserver, nor does it
include scheduling time for pods or webhooks executed on it.
-->
如何在大型集群中加快节点上的 Pod 启动？这是集群管理员可能面临的常见问题。

本篇博文重点介绍了从 kubelet 一侧加快 Pod 启动的方法。它不涉及通过
kube-apiserver 由 controller-manager 创建 Pod 所用的时间，
也不包括 Pod 的调度时间或在其上执行 Webhook 的时间。

<!--
We have mentioned some important factors here to consider from the kubelet's perspective, but
this is not an exhaustive list. As Kubernetes v1.27 is released, this blog highlights
significant changes in v1.27 that aid in speeding up pod start-up.
-->
我们从 kubelet 的角度考虑，在本文提到了一些重要的影响因素，但这并不是详尽罗列。
随着 Kubernetes v1.27 的发布，本文强调了在 v1.27 中有助于加快 Pod 启动的重大变更。

<!--
## Parallel container image pulls

Pulling images always takes some time and what's worse is that image pulls are done serially by
default. In other words, kubelet will send only one image pull request to the image service at
a time. Other image pull requests have to wait until the one being processed is complete.
-->
## 并行容器镜像拉取

拉取镜像总是需要一些时间的，更糟糕的是，镜像拉取默认是串行作业。
换句话说，kubelet 一次只会向镜像服务发送一个镜像拉取请求。
其他的镜像拉取请求必须等到正在处理的拉取请求完成。

<!--
To enable parallel image pulls, set the `serializeImagePulls` field to false in the kubelet
configuration. When `serializeImagePulls` is disabled, requests for image pulls are immediately
sent to the image service and multiple images can be pulled concurrently.
-->
要启用并行镜像拉取，请在 kubelet 配置中将 `serializeImagePulls` 字段设置为 false。
当 `serializeImagePulls` 被禁用时，将立即向镜像服务发送镜像拉取请求，并可以并行拉取多个镜像。

<!--
### Maximum parallel image pulls will help secure your node from overloading on image pulling

We introduced a new feature in kubelet that sets a limit on the number of parallel image
pulls at the node level. This limit restricts the maximum number of images that can be pulled
simultaneously. If there is an image pull request beyond this limit, it will be blocked until
one of the ongoing image pulls finishes. Before enabling this feature, please ensure that your
container runtime's image service can handle parallel image pulls effectively.
-->
### 设定并行镜像拉取最大值有助于防止节点因镜像拉取而过载

我们在 kubelet 中引入了一个新特性，可以在节点级别设置并行镜像拉取的限值。
此限值限制了可以同时拉取的最大镜像数量。如果有个镜像拉取请求超过了这个限值，
该请求将被阻止，直到其中一个正在进行的镜像拉取完成为止。
在启用此特性之前，请确保容器运行时的镜像服务可以有效处理并行镜像拉取。

<!--
To limit the number of simultaneous image pulls, you can configure the `maxParallelImagePulls`
field in kubelet. By setting `maxParallelImagePulls` to a value of _n_, only _n_ images will
be pulled concurrently. Any additional image pulls beyond this limit will wait until at least
one ongoing pull is complete.

You can find more details in the associated KEP: [Kubelet limit of Parallel Image Pulls](https://kep.k8s.io/3673)
 (KEP-3673).
 -->
要限制并行镜像拉取的数量，你可以在 kubelet 中配置 `maxParallelImagePulls` 字段。
将 `maxParallelImagePulls` 的值设置为 **n** 后，并行拉取的镜像数将不能超过 **n** 个。
超过此限值的任何其他镜像拉取请求都需要等到至少一个正在进行的拉取被完成为止。

你可以在关联的 KEP 中找到更多细节：
[Kubelet 并行镜像拉取数限值](https://kep.k8s.io/3673) (KEP-3673)。

<!--
## Raised default API query-per-second limits for kubelet

To improve pod startup in scenarios with multiple pods on a node, particularly sudden scaling
situations, it is necessary for Kubelet to synchronize the pod status and prepare configmaps,
secrets, or volumes. This requires a large bandwidth to access kube-apiserver.
-->
## 提高了 kubelet 默认 API 每秒查询限值

为了在节点上具有多个 Pod 的场景中加快 Pod 启动，特别是在突然扩缩的情况下，
kubelet 需要同步 Pod 状态并准备 ConfigMap、Secret 或卷。这就需要大带宽访问 kube-apiserver。

<!--
In versions prior to v1.27, the default `kubeAPIQPS` was 5 and `kubeAPIBurst` was 10. However,
the kubelet in v1.27 has increased these defaults to 50 and 100 respectively for better performance during
pod startup. It's worth noting that this isn't the only reason why we've bumped up the API QPS
limits for Kubelet.
-->
在 v1.27 之前的版本中，`kubeAPIQPS` 的默认值为 5，`kubeAPIBurst` 的默认值为 10。
然而在 v1.27 中，kubelet 为了提高 Pod 启动性能，将这些默认值分别提高到了 50 和 100。
值得注意的是，这并不是我们提高 kubelet 的 API QPS 限值的唯一原因。

<!--
1. It has a potential to be hugely throttled now (default QPS = 5)
2. In large clusters they can generate significant load anyway as there are a lot of them
3. They have a dedicated PriorityLevel and FlowSchema that we can easily control
-->
1. 现在的情况是 API 请求可能会被过度限制（默认 QPS = 5）
2. 在大型集群中，API 请求仍然可能产生相当大的负载，因为数量很多
3. 我们现在可以轻松控制一个专门为此设计的 PriorityLevel 和 FlowSchema

<!--
Previously, we often encountered `volume mount timeout` on kubelet in node with more than 50 pods
during pod start up. We suggest that cluster operators bump `kubeAPIQPS` to 20 and `kubeAPIBurst` to 40,
 especially if using bare metal nodes.

More detials can be found in the KEP <https://kep.k8s.io/1040> and the pull request [#116121](https://github.com/kubernetes/kubernetes/pull/116121).
-->
以前在具有 50 个以上 Pod 的节点中，我们经常在 Pod 启动期间在 kubelet 上遇到 `volume mount timeout`。
特别是在使用裸金属节点时，我们建议集群操作员将 `kubeAPIQPS` 提高到 20，`kubeAPIBurst` 提高到 40。

更多细节请参阅 KEP <https://kep.k8s.io/1040> 和
[PR#116121](https://github.com/kubernetes/kubernetes/pull/116121)。

<!--
## Event triggered updates to container status

`Evented PLEG` (PLEG is short for "Pod Lifecycle Event Generator") is set to be in beta for v1.27,
Kubernetes offers two ways for the kubelet to detect Pod lifecycle events, such as the last
process in a container shutting down.
In Kubernetes v1.27, the _event based_ mechanism has graduated to beta but remains
disabled by default. If you do explicitly switch to event-based lifecycle change detection,
the kubelet is able to start Pods more quickly than with the default approach that relies on polling.
The default mechanism, polling for lifecycle changes, adds a noticeable overhead; this affects
the kubelet's ability to handle different tasks in parallel, and leads to poor performance and
reliability issues. For these reasons, we recommend that you switch your nodes to use
event-based pod lifecycle change detection.
-->
## 事件驱动的容器状态更新

在 v1.27 中，`Evented PLEG`
（PLEG 是英文 Pod Lifecycle Event Generator 的缩写，表示 “Pod 生命周期事件生成器”）
进阶至 Beta 阶段。Kubernetes 为 kubelet 提供了两种方法来检测 Pod 的生命周期事件，
例如容器中最后一个进程关闭。在 Kubernetes v1.27 中，**基于事件的** 机制已进阶至 Beta，
但默认被禁用。如果你显式切换为基于事件的生命周期变更检测，则 kubelet
能够比依赖轮询的默认方法更快地启动 Pod。默认的轮询生命周期变化机制会增加明显的开销，
这会影响 kubelet 处理不同任务的并行能力，并导致性能和可靠性问题。
出于这些原因，我们建议你将节点切换为使用基于事件的 Pod 生命周期变更检测。

<!--
Further details can be found in the KEP <https://kep.k8s.io/3386> and
[Switching From Polling to CRI Event-based Updates to Container Status](/docs/tasks/administer-cluster/switch-to-evented-pleg/).
-->
更多细节请参阅 KEP <https://kep.k8s.io/3386>
和[容器状态从轮询切换为基于 CRI 事件更新](/zh-cn/docs/tasks/administer-cluster/switch-to-evented-pleg/)。

<!--
## Raise your pod resource limit if needed

During start-up, some pods may consume a considerable amount of CPU or memory. If the CPU limit is
low, this can significantly slow down the pod start-up process. To improve the memory management,
Kubernetes v1.22 introduced a feature gate called MemoryQoS to kubelet. This feature enables
kubelet to set memory QoS at container, pod, and QoS levels for better protection and guaranteed
quality of memory when running with cgroups v2. Although it has benefits, it is possible that
enabling this feature gate may affect the start-up speed of the pod if the pod startup consumes
a large amount of memory.
-->
## 必要时提高 Pod 资源限值

某些 Pod 在启动过程中可能会耗用大量的 CPU 或内存。
如果 CPU 限值较低，则可能会显著降低 Pod 启动过程的速度。
为了改善内存管理，Kubernetes v1.22 引入了一个名为 MemoryQoS 的特性门控。
该特性使 kubelet 能够在容器、Pod 和 QoS 级别上设置内存 QoS，以便更好地保护和确保在运行
CGroup V2 时的内存质量。尽管此特性门控有一定的好处，但如果 Pod 启动消耗大量内存，
启用此特性门控可能会影响 Pod 的启动速度。

<!--
Kubelet configuration now includes `memoryThrottlingFactor`. This factor is multiplied by
the memory limit or node allocatable memory to set the cgroupv2 `memory.high` value for enforcing
MemoryQoS. Decreasing this factor sets a lower high limit for container cgroups, increasing reclaim
pressure. Increasing this factor will put less reclaim pressure. The default value is 0.8 initially
and will change to 0.9 in Kubernetes v1.27. This parameter adjustment can reduce the potential
impact of this feature on pod startup speed.

Further details can be found in the KEP <https://kep.k8s.io/2570>.
-->
Kubelet 配置现在包括 `memoryThrottlingFactor`。该因子乘以内存限制或节点可分配内存，
可以设置 cgroupv2  `memory.high` 值来执行 MemoryQoS。
减小该因子将为容器 cgroup 设置较低的上限，同时增加了回收压力。
提高此因子将减少回收压力。默认值最初为 0.8，并将在 Kubernetes v1.27 中更改为 0.9。
调整此参数可以减少此特性对 Pod 启动速度的潜在影响。

更多细节请参阅 KEP <https://kep.k8s.io/2570>。

<!--
## What's more?

In Kubernetes v1.26, a new histogram metric `pod_start_sli_duration_seconds` was added for Pod
startup latency SLI/SLO details. Additionally, the kubelet log will now display more information
about pod start-related timestamps, as shown below:
-->
## 更多说明

在 Kubernetes v1.26 中，新增了一个名为 `pod_start_sli_duration_seconds` 的直方图指标，
用于显示 Pod 启动延迟 SLI/SLO 详情。此外，kubelet 日志现在会展示更多与 Pod 启动相关的时间戳信息，如下所示：

> Dec 30 15:33:13.375379 e2e-022435249c-674b9-minion-group-gdj4 kubelet[8362]: I1230 15:33:13.375359    8362 pod_startup_latency_tracker.go:102] "Observed pod startup duration" pod="kube-system/konnectivity-agent-gnc9k" podStartSLOduration=-9.223372029479458e+09 pod.CreationTimestamp="2022-12-30 15:33:06 +0000 UTC" firstStartedPulling="2022-12-30 15:33:09.258791695 +0000 UTC m=+13.029631711" lastFinishedPulling="0001-01-01 00:00:00 +0000 UTC" observedRunningTime="2022-12-30 15:33:13.375009262 +0000 UTC m=+17.145849275" watchObservedRunningTime="2022-12-30 15:33:13.375317944 +0000 UTC m=+17.146157970"

<!--
The SELinux Relabeling with Mount Options feature moved to Beta in v1.27. This feature speeds up
container startup by mounting volumes with the correct SELinux label instead of changing each file
on the volumes recursively. Further details can be found in the KEP <https://kep.k8s.io/1710>.

To identify the cause of slow pod startup, analyzing metrics and logs can be helpful. Other
factors that may impact pod startup include container runtime, disk speed, CPU and memory
resources on the node.
-->
SELinux 挂载选项重标记功能在 v1.27 中升至 Beta 版本。
该特性通过挂载具有正确 SELinux 标签的卷来加快容器启动速度，
而不是递归地更改卷上的每个文件。更多细节请参阅 KEP <https://kep.k8s.io/1710>。

为了确定 Pod 启动缓慢的原因，分析指标和日志可能会有所帮助。
其他可能会影响 Pod 启动的因素包括容器运行时、磁盘速度、节点上的 CPU 和内存资源。

<!--
SIG Node is responsible for ensuring fast Pod startup times, while addressing issues in large
clusters falls under the purview of SIG Scalability as well.
-->
SIG Node 负责确保 Pod 快速启动，而解决大型集群中的问题则属于 SIG Scalability 的范畴。
