---
layout: blog
title: "Kubernetes 1.28：在 Linux 上使用交换内存的 Beta 支持"
date: 2023-08-24T10:00:00-08:00
slug: swap-linux-beta
---
<!--
layout: blog
title: "Kubernetes 1.28: Beta support for using swap on Linux"
date: 2023-08-24T10:00:00-08:00
slug: swap-linux-beta
-->

<!--
**Author:** Itamar Holder (Red Hat)
-->
**作者**：Itamar Holder (Red Hat)

**译者**：Wilson Wu (DaoCloud)

<!--
The 1.22 release [introduced Alpha support](/blog/2021/08/09/run-nodes-with-swap-alpha/) for configuring swap memory usage for Kubernetes workloads running on Linux on a per-node basis. Now, in release 1.28, support for swap on Linux nodes has graduated to Beta, along with many new improvements.
-->
Kubernetes 1.22 版本为交换内存[引入了一项 Alpha 支持](/blog/2021/08/09/run-nodes-with-swap-alpha/)，
用于为在 Linux 节点上运行的 Kubernetes 工作负载逐个节点地配置交换内存使用。
现在，在 1.28 版中，对 Linux 节点上的交换内存的支持已升级为 Beta 版，并有许多新的改进。

<!--
Prior to version 1.22, Kubernetes did not provide support for swap memory on Linux systems. This was due to the inherent difficulty in guaranteeing and accounting for pod memory utilization when swap memory was involved. As a result, swap support was deemed out of scope in the initial design of Kubernetes, and the default behavior of a kubelet was to fail to start if swap memory was detected on a node.
-->
在 1.22 版之前，Kubernetes 不提供对 Linux 系统上交换内存的支持。
这是由于在涉及交换内存时保证和计算 Pod 内存利用率的固有困难。
因此，交换内存支持被认为超出了 Kubernetes 的初始设计范围，并且如果在节点上检测到交换内存，
kubelet 的默认行为是无法启动。

<!--
In version 1.22, the swap feature for Linux was initially introduced in its Alpha stage. This represented a significant advancement, providing Linux users with the opportunity to experiment with the swap feature for the first time. However, as an Alpha version, it was not fully developed and had several issues, including inadequate support for cgroup v2, insufficient metrics and summary API statistics, inadequate testing, and more.
-->
在 1.22 版中，Linux 的交换特性以 Alpha 阶段初次引入。
这代表着一项重大进步，首次为 Linux 用户提供了尝试交换内存特性的机会。
然而，作为 Alpha 版本，它尚未开发完成，并存在一些问题，
包括对 cgroup v2 支持的不足、指标和 API 统计摘要不足、测试不足等等。

<!--
Swap in Kubernetes has numerous [use cases](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md#user-stories) for a wide range of users. As a result, the node special interest group within the Kubernetes project has invested significant effort into supporting swap on Linux nodes for beta. Compared to the alpha, the kubelet's support for running with swap enabled is more stable and robust, more user-friendly, and addresses many known shortcomings. This graduation to beta represents a crucial step towards achieving the goal of fully supporting swap in Kubernetes.
-->
Kubernetes 中的交换内存有许多[用例](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md#user-stories)，
并适用于大量用户。因此，Kubernetes 项目内的节点特别兴趣小组投入了大量精力来支持
Linux 节点上的交换内存特性的 Beta 版本。
与 Alpha 版本相比，启用交换内存后 kubelet 的运行更加稳定和健壮，更加用户友好，并且解决了许多已知缺陷。
这次升级到 Beta 版代表朝着实现在 Kubernetes 中完全支持交换内存的目标迈出了关键一步。

<!--
## How do I use it?
-->
## 如何使用此特性？ {#how-do-i-use-it}

<!--
The utilization of swap memory on a node where it has already been provisioned can be facilitated by the activation of the `NodeSwap` feature gate on the kubelet. Additionally, you must disable the `failSwapOn` configuration setting, or the deprecated `--fail-swap-on` command line flag must be deactivated.
-->
通过激活 kubelet 上的 `NodeSwap` 特性门控，可以在已配置交换内存的节点上使用此特性。
此外，你必须禁用 `failSwapOn` 设置，或者停用已被弃用的 `--fail-swap-on` 命令行标志。

<!--
It is possible to configure the `memorySwap.swapBehavior` option to define the manner in which a node utilizes swap memory. For instance,
-->
可以配置 `memorySwap.swapBehavior` 选项来定义节点使用交换内存的方式。例如：

<!--
```yaml
# this fragment goes into the kubelet's configuration file
memorySwap:
  swapBehavior: UnlimitedSwap
```
-->
```yaml
# 将此段内容放入 kubelet 配置文件
memorySwap:
  swapBehavior: UnlimitedSwap
```

<!--
The available configuration options for `swapBehavior` are:
-->
`swapBehavior` 的可用配置选项有：

<!--
- `UnlimitedSwap` (default): Kubernetes workloads can use as much swap memory as they request, up to the system limit.
- `LimitedSwap`: The utilization of swap memory by Kubernetes workloads is subject to limitations. Only Pods of [Burstable](/docs/concepts/workloads/pods/pod-qos/#burstable) QoS are permitted to employ swap.
-->
- `UnlimitedSwap`（默认）：Kubernetes 工作负载可以根据请求使用尽可能多的交换内存，最多可达到系统限制。
- `LimitedSwap`：Kubernetes 工作负载对交换内存的使用受到限制。
  只有 [Burstable](/zh-cn/docs/concepts/workloads/pods/pod-qos/#burstable) QoS Pod 才允许使用交换内存。

<!--
If configuration for `memorySwap` is not specified and the feature gate is enabled, by default the kubelet will apply the same behaviour as the `UnlimitedSwap` setting.
-->
如果未指定 `memorySwap` 的配置并且启用了特性门控，则默认情况下，
kubelet 将应用与 `UnlimitedSwap` 设置相同的行为。

<!--
Note that `NodeSwap` is supported for **cgroup v2** only. For Kubernetes v1.28, using swap along with cgroup v1 is no longer supported.
-->
请注意，仅 **cgroup v2** 支持 `NodeSwap`。针对 Kubernetes v1.28，不再支持将交换内存与 cgroup v1 一起使用。

<!--
## Install a swap-enabled cluster with kubeadm
-->
## 使用 kubeadm 安装支持交换内存的集群 {#install-a-swap-enabled-cluster-with-kubeadm}

<!--
### Before you begin
-->
### 开始之前 {#before-you-begin}

<!--
It is required for this demo that the kubeadm tool be installed, following the steps outlined in the [kubeadm installation guide](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm). If swap is already enabled on the node, cluster creation may proceed. If swap is not enabled, please refer to the provided instructions for enabling swap.
-->
此演示需要安装 kubeadm 工具，
安装过程按照 [kubeadm 安装指南](/zh-cn/docs/setup/product-environment/tools/kubeadm/create-cluster-kubeadm)中描述的步骤进行操作。
如果节点上已启用交换内存，则可以继续创建集群。如果未启用交换内存，请参阅提供的启用交换内存说明。

<!--
### Create a swap file and turn swap on
-->
### 创建交换内存文件并开启交换内存功能 {#create-a-swap-file-and-turn-swap-on}

<!--
I'll demonstrate creating 4GiB of unencrypted swap.
-->
我将演示创建 4GiB 的未加密交换内存。

<!--
```bash
dd if=/dev/zero of=/swapfile bs=128M count=32
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
swapon -s # enable the swap file only until this node is rebooted
```
-->
```bash
dd if=/dev/zero of=/swapfile bs=128M count=32
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
swapon -s # 仅在该节点被重新启动后启用该交换内存文件
```

<!--
To start the swap file at boot time, add line like `/swapfile swap swap defaults 0 0` to `/etc/fstab` file.
-->
要在引导时启动交换内存文件，请将诸如 `/swapfile swap swap defaults 0 0` 的内容添加到 `/etc/fstab` 文件中。

<!--
### Set up a Kubernetes cluster that uses swap-enabled nodes
-->
### 在 Kubernetes 集群中设置开启交换内存的节点  {#set-up-a-kubernetes-cluster-that-uses-swap-enabled-nodes}

<!--
To make things clearer, here is an example kubeadm configuration file `kubeadm-config.yaml` for the swap enabled cluster.
-->
清晰起见，这里给出启用交换内存特性的集群的 kubeadm 配置文件示例 `kubeadm-config.yaml`。

```yaml
---
apiVersion: "kubeadm.k8s.io/v1beta3"
kind: InitConfiguration
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
failSwapOn: false
featureGates:
  NodeSwap: true
memorySwap:
  swapBehavior: LimitedSwap
```

<!--
Then create a single-node cluster using `kubeadm init --config kubeadm-config.yaml`. During init, there is a warning that swap is enabled on the node and in case the kubelet `failSwapOn` is set to true. We plan to remove this warning in a future release.
-->
接下来使用 `kubeadm init --config kubeadm-config.yaml` 创建单节点集群。
在初始化过程中，如果 kubelet `failSwapOn` 设置为 true，则会出现一条警告，告知节点上启用了交换内存特性。
我们计划在未来的版本中删除此警告。

<!--
## How is the swap limit being determined with LimitedSwap?
-->
## 如何通过 LimitedSwap 确定交换内存限额？ {#how-is-the-swap-limit-being-determined-with-limitedswap}

<!--
The configuration of swap memory, including its limitations, presents a significant challenge. Not only is it prone to misconfiguration, but as a system-level property, any misconfiguration could potentially compromise the entire node rather than just a specific workload. To mitigate this risk and ensure the health of the node, we have implemented Swap in Beta with automatic configuration of limitations.
-->
交换内存的配置（包括其局限性）是一项挑战。不仅容易出现配置错误，而且作为系统级属性，
任何错误配置都可能危及整个节点而不仅仅是特定的工作负载。
为了减轻这种风险并确保节点的健康，我们在交换内存的 Beta 版本中实现了对缺陷的自动配置。

<!--
With `LimitedSwap`, Pods that do not fall under the Burstable QoS classification (i.e. `BestEffort`/`Guaranteed` Qos Pods) are prohibited from utilizing swap memory. `BestEffort` QoS Pods exhibit unpredictable memory consumption patterns and lack information regarding their memory usage, making it difficult to determine a safe allocation of swap memory. Conversely, `Guaranteed` QoS Pods are typically employed for applications that rely on the precise allocation of resources specified by the workload, with memory being immediately available. To maintain the aforementioned security and node health guarantees, these Pods are not permitted to use swap memory when `LimitedSwap` is in effect.
-->
使用 `LimitedSwap`，不属于 Burstable QoS 类别的 Pod（即 `BestEffort`/`Guaranteed` QoS Pod）被禁止使用交换内存。
`BestEffort` QoS Pod 表现出不可预测的内存消耗模式，并且缺乏有关其内存使用情况的信息，
因此很难完成交换内存的安全分配。相反，`Guaranteed` QoS Pod 通常用于根据工作负载的设置精确分配资源的应用，
其中的内存资源立即可用。
为了维持上述安全和节点健康保证，当 `LimitedSwap` 生效时，这些 Pod 将不允许使用交换内存。

<!--
Prior to detailing the calculation of the swap limit, it is necessary to define the following terms:
-->
在详细计算交换内存限制之前，有必要定义以下术语：

<!--
* `nodeTotalMemory`: The total amount of physical memory available on the node.
* `totalPodsSwapAvailable`: The total amount of swap memory on the node that is available for use by Pods (some swap memory may be reserved for system use).
* `containerMemoryRequest`: The container's memory request.
-->
* `nodeTotalMemory`：节点上可用的物理内存总量。
* `totalPodsSwapAvailable`：节点上可供 Pod 使用的交换内存总量（可以保留一些交换内存供系统使用）。
* `containerMemoryRequest`：容器的内存请求。

<!--
Swap limitation is configured as: `(containerMemoryRequest / nodeTotalMemory) × totalPodsSwapAvailable`
-->
交换内存限制配置为：`(containerMemoryRequest / nodeTotalMemory) × totalPodsSwapAvailable`

<!--
In other words, the amount of swap that a container is able to use is proportionate to its memory request, the node's total physical memory and the total amount of swap memory on the node that is available for use by Pods.
-->
换句话说，容器能够使用的交换内存量与其内存请求、节点的总物理内存以及节点上可供 Pod
使用的交换内存总量呈比例关系。

<!--
It is important to note that, for containers within Burstable QoS Pods, it is possible to opt-out of swap usage by specifying memory requests that are equal to memory limits. Containers configured in this manner will not have access to swap memory.
-->
值得注意的是，对于 Burstable QoS Pod 中的容器，可以通过设置内存限制与内存请求相同来选择不使用交换内存。
以这种方式配置的容器将无法访问交换内存。

<!--
## How does it work?
-->
## 此特性如何工作？ {#how-does-it-work}

<!--
There are a number of possible ways that one could envision swap use on a node. When swap is already provisioned and available on a node, SIG Node have [proposed](https://github.com/kubernetes/enhancements/blob/9d127347773ad19894ca488ee04f1cd3af5774fc/keps/sig-node/2400-node-swap/README.md#proposal) the kubelet should be able to be configured so that:
-->
我们可以想象可以在节点上使用交换内存的多种可能方式。当节点上提供了交换内存并可用时，
SIG 节点[建议](https://github.com/kubernetes/enhancements/blob/9d127347773ad19894ca488ee04f1cd3af5774fc/keps/sig-node/2400-node-swap/README.md#proposal)
kubelet 应该能够遵循如下的配置：

<!--
- It can start with swap on.
- It will direct the Container Runtime Interface to allocate zero swap memory to Kubernetes workloads by default.
-->
- 在交换内存特性被启用时能够启动。
- 默认情况下，kubelet 将指示容器运行时接口（CRI）不为 Kubernetes 工作负载分配交换内存。

<!--
Swap configuration on a node is exposed to a cluster admin via the [`memorySwap` in the KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1). As a cluster administrator, you can specify the node's behaviour in the presence of swap memory by setting `memorySwap.swapBehavior`.
-->
节点上的交换内存配置通过 [KubeletConfiguration 中的 `memorySwap`](/zh-cn/docs/reference/config-api/kubelet-config.v1) 向集群管理员公开。
作为集群管理员，你可以通过设置 `memorySwap.swapBehavior` 来指定存在交换内存时节点的行为。

<!--
The kubelet [employs the CRI](/docs/concepts/architecture/cri/) (container runtime interface) API to direct the CRI to configure specific cgroup v2 parameters (such as `memory.swap.max`) in a manner that will enable the desired swap configuration for a container. The CRI is then responsible to write these settings to the container-level cgroup.
-->
kubelet [使用 CRI](/zh-cn/docs/concepts/architecture/cri/)
（容器运行时接口）API 来指示 CRI 配置特定的 cgroup v2 参数（例如 `memory.swap.max`），
配置方式要支持容器所期望的交换内存配置。接下来，CRI 负责将这些设置写入容器级的 cgroup。

<!--
## How can I monitor swap?
-->
## 如何对交换内存进行监控？ {#how-can-i-monitor-swap}

<!--
A notable deficiency in the Alpha version was the inability to monitor and introspect swap usage. This issue has been addressed in the Beta version introduced in Kubernetes 1.28, which now provides the capability to monitor swap usage through several different methods.
-->
Alpha 版本的一个显著缺陷是无法监控或检视交换内存的使用情况。
这个问题已在 Kubernetes 1.28 引入的 Beta 版本中得到解决，该版本现在提供了通过多种不同方法监控交换内存使用情况的能力。

<!--
The beta version of kubelet now collects [node-level metric statistics](/docs/reference/instrumentation/node-metrics/), which can be accessed at the `/metrics/resource` and `/stats/summary` kubelet HTTP endpoints. This allows clients who can directly interrogate the kubelet to monitor swap usage and remaining swap memory when using LimitedSwap. Additionally, a `machine_swap_bytes` metric has been added to cadvisor to show the total physical swap capacity of the machine.
-->
kubelet 的 Beta 版本现在支持收集[节点级指标统计信息](/zh-cn/docs/reference/instrumentation/node-metrics/)，
可以通过 `/metrics/resource` 和 `/stats/summary` kubelet HTTP 端点进行访问。
这些信息使得客户端能够在使用 LimitedSwap 时直接访问 kubelet 来监控交换内存使用情况和剩余交换内存情况。
此外，cadvisor 中还添加了 `machine_swap_bytes` 指标，以显示机器上总的物理交换内存容量。

<!--
## Caveats
-->
## 注意事项 {#caveats}

<!--
Having swap available on a system reduces predictability. Swap's performance is worse than regular memory, sometimes by many orders of magnitude, which can cause unexpected performance regressions. Furthermore, swap changes a system's behaviour under memory pressure. Since enabling swap permits greater memory usage for workloads in Kubernetes that cannot be predictably accounted for, it also increases the risk of noisy neighbours and unexpected packing configurations, as the scheduler cannot account for swap memory usage.
-->
在系统上提供可用交换内存会降低可预测性。由于交换内存的性能比常规内存差，
有时差距甚至在多个数量级，因而可能会导致意外的性能下降。此外，交换内存会改变系统在内存压力下的行为。
由于启用交换内存允许 Kubernetes 中的工作负载使用更大的内存量，而这一用量是无法预测的，
因此也会增加嘈杂邻居和非预期的装箱配置的风险，因为调度程序无法考虑交换内存使用情况。

<!--
The performance of a node with swap memory enabled depends on the underlying physical storage. When swap memory is in use, performance will be significantly worse in an I/O operations per second (IOPS) constrained environment, such as a cloud VM with I/O throttling, when compared to faster storage mediums like solid-state drives or NVMe.
-->
启用交换内存的节点的性能取决于底层物理存储。当使用交换内存时，与固态硬盘或 NVMe 等更较快的存储介质相比，
在每秒 I/O 操作数（IOPS）受限的环境（例如具有 I/O 限制的云虚拟机）中，性能会明显变差。

<!--
As such, we do not advocate the utilization of swap memory for workloads or environments that are subject to performance constraints. Furthermore, it is recommended to employ `LimitedSwap`, as this significantly mitigates the risks posed to the node.
-->
因此，我们不提倡针对有性能约束的工作负载或环境使用交换内存。
此外，建议使用 `LimitedSwap`，因为这可以显著减轻给节点带来的风险。

<!--
Cluster administrators and developers should benchmark their nodes and applications before using swap in production scenarios, and [we need your help](#how-do-i-get-involved) with that!
-->
集群管理员和开发人员应该在生产场景中使用交换内存之前对其节点和应用进行基准测试，
[我们需要你的帮助](#how-do-i-get-involved)！

<!--
### Security risk
-->
### 安全风险 {#security-risk}

<!--
Enabling swap on a system without encryption poses a security risk, as critical information, such as volumes that represent Kubernetes Secrets, [may be swapped out to the disk](/docs/concepts/configuration/secret/#information-security-for-secrets). If an unauthorized individual gains access to the disk, they could potentially obtain these confidential data. To mitigate this risk, the Kubernetes project strongly recommends that you encrypt your swap space. However, handling encrypted swap is not within the scope of kubelet; rather, it is a general OS configuration concern and should be addressed at that level. It is the administrator's responsibility to provision encrypted swap to mitigate this risk.
-->
在没有加密的系统上启用交换内存会带来安全风险，因为关键信息（例如代表 Kubernetes Secret 的卷）
[可能会被交换到磁盘](/zh-cn/docs/concepts/configuration/secret/#information-security-for-secrets)。
如果未经授权的个人访问磁盘，他们就有可能获得这些机密数据。为了减轻这种风险，
Kubernetes 项目强烈建议你对交换内存空间进行加密。但是，处理加密交换内存不是 kubelet 的责任；
相反，它其实是操作系统配置通用问题，应在该级别解决。管理员有责任提供加密交换内存来减轻这种风险。

<!--
Furthermore, as previously mentioned, with `LimitedSwap` the user has the option to completely disable swap usage for a container by specifying memory requests that are equal to memory limits. This will prevent the corresponding containers from accessing swap memory.
-->
此外，如前所述，启用 `LimitedSwap` 模式时，用户可以选择通过设置内存限制与内存请求相同来完全禁止容器使用交换内存。
这种设置会阻止相应的容器访问交换内存。

<!--
## Looking ahead
-->
## 展望未来 {#looking-ahead}

<!--
The Kubernetes 1.28 release introduced Beta support for swap memory on Linux nodes, and we will continue to work towards [general availability](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages) for this feature. I hope that this will include:
-->
Kubernetes 1.28 版本引入了对 Linux 节点上交换内存的 Beta 支持，
我们将继续为这项特性的[正式发布](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-stages)而努力。
我希望这将包括：

<!--
* Add the ability to set a system-reserved quantity of swap from what kubelet detects on the host.
* Adding support for controlling swap consumption at the Pod level via cgroups.
  * This point is still under discussion.
* Collecting feedback from test user cases.
  * We will consider introducing new configuration modes for swap, such as a node-wide swap limit for workloads.
-->
* 添加根据 kubelet 在主机上检测到的内容来设置系统预留交换内存量的功能。
* 添加对通过 cgroup 在 Pod 级别控制交换内存用量的支持。
  * 这一点仍在讨论中。
* 收集测试用例的反馈。
  * 我们将考虑引入新的交换内存配置模式，例如在节点层面为工作负载设置交换内存限制。

<!--
## How can I learn more?
-->
## 如果进一步学习？ {#how-can-i-learn-more}

<!--
You can review the current [documentation](/docs/concepts/architecture/nodes/#swap-memory) for using swap with Kubernetes.
-->
你可以查看当前[文档](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)以了解如何在 Kubernetes 中使用交换内存。

<!--
For more information, and to assist with testing and provide feedback, please see [KEP-2400](https://github.com/kubernetes/enhancements/issues/4128) and its [design proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md).
-->
如需了解更多信息，以及协助测试和提供反馈，请参阅 [KEP-2400](https://github.com/kubernetes/enhancements/issues/4128)
及其[设计提案](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md)。

<!--
## How do I get involved?
-->
## 参与其中 {#how-do-i-get-involved}

<!--
Your feedback is always welcome! SIG Node [meets regularly](https://github.com/kubernetes/community/tree/master/sig-node#meetings) and [can be reached](https://github.com/kubernetes/community/tree/master/sig-node#contact) via [Slack](https://slack.k8s.io/) (channel **#sig-node**), or the SIG's [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node). A Slack channel dedicated to swap is also available at **#sig-node-swap**.
-->
随时欢迎你的反馈！SIG Node [定期举行会议](https://github.com/kubernetes/community/tree/master/sig-node#meetings)并可以通过
[Slack](https://slack.k8s.io/)（**#sig-node** 频道）
或 SIG 的 [邮件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
[进行联系](https://github.com/kubernetes/community/tree/master/sig-node#contact)。
Slack 还提供了专门讨论交换内存的 **#sig-node-swap** 频道。

<!--
Feel free to reach out to me, Itamar Holder (**@iholder101** on Slack and GitHub) if you'd like to help or ask further questions.
-->
如果你想提供帮助或提出进一步的问题，请随时联系 Itamar Holder（Slack 和 GitHub 账号为 **@iholder101**）。
