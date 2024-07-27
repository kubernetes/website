---
title: 集群自动扩缩容
linkTitle: 集群自动扩缩容
description: >-
  自动管理集群中的节点以适配需求。
content_type: concept
weight: 120
---
<!--
title: Cluster Autoscaling
linkTitle: Cluster Autoscaling
description: >-
  Automatically manage the nodes in your cluster to adapt to demand.
content_type: concept
weight: 120
-->

<!-- overview -->

<!--
Kubernetes requires {{< glossary_tooltip text="nodes" term_id="node" >}} in your cluster to
run {{< glossary_tooltip text="pods" term_id="pod" >}}. This means providing capacity for
the workload Pods and for Kubernetes itself.

You can adjust the amount of resources available in your cluster automatically:
_node autoscaling_. You can either change the number of nodes, or change the capacity
that nodes provide. The first approach is referred to as _horizontal scaling_, while the
second is referred to as _vertical scaling_.

Kubernetes can even provide multidimensional automatic scaling for nodes.
-->
Kubernetes 需要集群中的{{< glossary_tooltip text="节点" term_id="node" >}}来运行
{{< glossary_tooltip text="Pod" term_id="pod" >}}。
这意味着需要为工作负载 Pod 以及 Kubernetes 本身提供容量。

你可以自动调整集群中可用的资源量：**节点自动扩缩容**。
你可以更改节点的数量，或者更改节点提供的容量。
第一种方法称为**水平扩缩容**，而第二种方法称为**垂直扩缩容**。

Kubernetes 甚至可以为节点提供多维度的自动扩缩容。

<!-- body -->

<!--
## Manual node management

You can manually manage node-level capacity, where you configure a fixed amount of nodes;
you can use this approach even if the provisioning (the process to set up, manage, and
decommission) for these nodes is automated.

This page is about taking the next step, and automating management of the amount of
node capacity (CPU, memory, and other node resources) available in your cluster.
-->
## 手动节点管理   {#manual-node-management}

你可以手动管理节点级别的容量，例如你可以配置固定数量的节点；
即使这些节点的制备（搭建、管理和停用过程）是自动化的，你也可以使用这种方法。

本文介绍的是下一步操作，即自动化管理集群中可用的节点容量（CPU、内存和其他节点资源）。

<!--
## Automatic horizontal scaling {#autoscaling-horizontal}

### Cluster Autoscaler

You can use the [Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) to manage the scale of your nodes automatically.
The cluster autoscaler can integrate with a cloud provider, or with Kubernetes'
[cluster API](https://github.com/kubernetes/autoscaler/blob/c6b754c359a8563050933a590f9a5dece823c836/cluster-autoscaler/cloudprovider/clusterapi/README.md),
to achieve the actual node management that's needed.
-->
## 自动水平扩缩容   {#autoscaling-horizontal}

### Cluster Autoscaler

你可以使用 [Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)
自动管理节点的数目规模。Cluster Autoscaler 可以与云驱动或 Kubernetes 的
[Cluster API](https://github.com/kubernetes/autoscaler/blob/c6b754c359a8563050933a590f9a5dece823c836/cluster-autoscaler/cloudprovider/clusterapi/README.md)
集成，以完成实际所需的节点管理。

<!--
The cluster autoscaler adds nodes when there are unschedulable Pods, and
removes nodes when those nodes are empty.

#### Cloud provider integrations {#cluster-autoscaler-providers}

The [README](https://github.com/kubernetes/autoscaler/tree/c6b754c359a8563050933a590f9a5dece823c836/cluster-autoscaler#readme)
for the cluster autoscaler lists some of the cloud provider integrations
that are available.
-->
当存在不可调度的 Pod 时，Cluster Autoscaler 会添加节点；
当这些节点为空时，Cluster Autoscaler 会移除节点。

#### 云驱动集成组件   {#cluster-autoscaler-providers}

Cluster Autoscaler 的
[README](https://github.com/kubernetes/autoscaler/tree/c6b754c359a8563050933a590f9a5dece823c836/cluster-autoscaler#readme)
列举了一些可用的云驱动集成组件。

<!--
## Cost-aware multidimensional scaling {#autoscaling-multi-dimension}

### Karpenter {#autoscaler-karpenter}

[Karpenter](https://karpenter.sh/) supports direct node management, via
plugins that integrate with specific cloud providers, and can manage nodes
for you whilst optimizing for overall cost.
-->
## 成本感知多维度扩缩容   {#autoscaling-multi-dimension}

### Karpenter   {#autoscaler-karpenter}

[Karpenter](https://karpenter.sh/) 支持通过继承了特定云驱动的插件来直接管理节点，
还可以在优化总体成本的同时为你管理节点。

<!--
> Karpenter automatically launches just the right compute resources to
> handle your cluster's applications. It is designed to let you take
> full advantage of the cloud with fast and simple compute provisioning
> for Kubernetes clusters.
-->
> Karpenter 自动启动适合你的集群应用的计算资源。
> Karpenter 设计为让你充分利用云资源，快速简单地为 Kubernetes 集群制备计算资源。

<!--
The Karpenter tool is designed to integrate with a cloud provider that
provides API-driven server management, and where the price information for
available servers is also available via a web API.

For example, if you start some more Pods in your cluster, the Karpenter
tool might buy a new node that is larger than one of the nodes you are
already using, and then shut down an existing node once the new node
is in service.
-->
Karpenter 工具设计为与云驱动集成，提供 API 驱动的服务器管理，
此工具可以通过 Web API 获取可用服务器的价格信息。

例如，如果你在集群中启动更多 Pod，Karpenter 工具可能会购买一个比你当前使用的节点更大的新节点，
然后在这个新节点投入使用后关闭现有的节点。

<!--
#### Cloud provider integrations {#karpenter-providers}
-->
#### 云驱动集成组件 {#karpenter-providers}

{{% thirdparty-content vendor="true" %}}

<!--
There are integrations available between Karpenter's core and the following
cloud providers:

- [Amazon Web Services](https://github.com/aws/karpenter-provider-aws)
- [Azure](https://github.com/Azure/karpenter-provider-azure)
-->
在 Karpenter 的核心与以下云驱动之间，存在可用的集成组件：

- [Amazon Web Services](https://github.com/aws/karpenter-provider-aws)
- [Azure](https://github.com/Azure/karpenter-provider-azure)

<!--
## Related components

### Descheduler

The [descheduler](https://github.com/kubernetes-sigs/descheduler) can help you
consolidate Pods onto a smaller number of nodes, to help with automatic scale down
when the cluster has space capacity.
-->
## 相关组件   {#related-components}

### Descheduler

[Descheduler](https://github.com/kubernetes-sigs/descheduler)
可以帮助你将 Pod 集中到少量节点上，以便在集群有空闲容量时帮助自动缩容。

<!--
### Sizing a workload based on cluster size

#### Cluster proportional autoscaler

For workloads that need to be scaled based on the size of the cluster (for example
`cluster-dns` or other system components), you can use the
[_Cluster Proportional Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler).<br />

The Cluster Proportional Autoscaler watches the number of schedulable nodes
and cores, and scales the number of replicas of the target workload accordingly.
-->
### 基于集群大小调整工作负载    {#sizing-a-workload-based-on-cluster-size}

#### Cluster Proportional Autoscaler

对于需要基于集群大小进行扩缩容的工作负载（例如 `cluster-dns` 或其他系统组件），
你可以使用 [Cluster Proportional Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)。

Cluster Proportional Autoscaler 监视可调度节点和核心的数量，并相应地调整目标工作负载的副本数量。

<!--
#### Cluster proportional vertical autoscaler

If the number of replicas should stay the same, you can scale your workloads vertically according to the cluster size using
the [_Cluster Proportional Vertical Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler).
This project is in **beta** and can be found on GitHub.

While the Cluster Proportional Autoscaler scales the number of replicas of a workload, the Cluster Proportional Vertical Autoscaler
adjusts the resource requests for a workload (for example a Deployment or DaemonSet) based on the number of nodes and/or cores
in the cluster.
-->
#### Cluster Proportional Vertical Autoscaler

如果副本数量应该保持不变，你可以使用
[Cluster Proportional Vertical Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler)
基于集群大小垂直扩缩你的工作负载。此项目处于 **Beta** 阶段，托管在 GitHub 上。

Cluster Proportional Autoscaler 扩缩工作负载的副本数量，而 Cluster Proportional Vertical Autoscaler
基于集群中的节点和/或核心数量调整工作负载（例如 Deployment 或 DaemonSet）的资源请求。

## {{% heading "whatsnext" %}}

<!--
- Read about [workload-level autoscaling](/docs/concepts/workloads/autoscaling/)
-->
- 参阅[工作负载级别自动扩缩容](/zh-cn/docs/concepts/workloads/autoscaling/)
