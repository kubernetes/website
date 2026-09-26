---
layout: blog
title: "Kubernetes v1.33：存储动态制备模式下的节点存储容量评分（Alpha 版）"
date: 2025-04-30T10:30:00-08:00
slug: kubernetes-v1-33-storage-capacity-scoring-feature
author: >
  Yuma Ogami (Cybozu)
translator: Xin Li (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.33: Storage Capacity Scoring of Nodes for Dynamic Provisioning (alpha)"
date: 2025-04-30T10:30:00-08:00
slug: kubernetes-v1-33-storage-capacity-scoring-feature
author: >
  Yuma Ogami (Cybozu)
-->

<!--
Kubernetes v1.33 introduces a new alpha feature called `StorageCapacityScoring`. This feature adds a scoring method for pod scheduling
with [the topology-aware volume provisioning](/blog/2018/10/11/topology-aware-volume-provisioning-in-kubernetes/).
This feature eases to schedule pods on nodes with either the most or least available storage capacity.
-->
Kubernetes v1.33 引入了一个名为 `StorageCapacityScoring` 的新 Alpha 级别**特性**。
此**特性**添加了一种为 Pod 调度评分的方法，
并与[拓扑感知卷制备](/blog/2018/10/11/topology-aware-volume-provisioning-in-kubernetes/)相关。
此**特性**可以轻松地选择在具有最多或最少可用存储容量的节点上调度 Pod。

<!--
## About this feature

This feature extends the kube-scheduler's VolumeBinding plugin to perform scoring using node storage capacity information
obtained from [Storage Capacity](/docs/concepts/storage/storage-capacity/). Currently, you can only filter out nodes with insufficient storage capacity.
So, you have to use a scheduler extender to achieve storage-capacity-based pod scheduling.
-->
## 关于此特性   {#about-this-feature}

此特性扩展了 kube-scheduler 的 VolumeBinding 插件，
以使用从[存储容量](/zh-cn/docs/concepts/storage/storage-capacity/)获得的节点存储容量信息进行评分。
目前，你只能过滤掉存储容量不足的节点。因此，你必须使用调度器扩展程序来实现基于存储容量的 Pod 调度。

<!--
This feature is useful for provisioning node-local PVs, which have size limits based on the node's storage capacity. By using this feature,
you can assign the PVs to the nodes with the most available storage space so that you can expand the PVs later as much as possible.

In another use case, you might want to reduce the number of nodes as much as possible for low operation costs in cloud environments by choosing
the least storage capacity node. This feature helps maximize resource utilization by filling up nodes more sequentially, starting with the most
utilized nodes first that still have enough storage capacity for the requested volume size.
-->
此特性对于制备节点本地的 PV 非常有用，这些 PV 的大小限制取决于节点的存储容量。
通过使用此特性，你可以将 PV 指派给具有最多可用存储空间的节点，
以便以后尽可能多地扩展 PV。

在另一个用例中，你可能希望通过选择存储容量最小的节点，
在云环境中尽可能减少节点数量以降低运维成本。
此特性通过从利用率最高的节点开始填充节点，从而帮助最大化资源利用率，
前提是这些节点仍有足够的存储容量来满足请求的卷大小。

<!--
## How to use

### Enabling the feature

In the alpha phase, `StorageCapacityScoring` is disabled by default. To use this feature, add `StorageCapacityScoring=true`
to the kube-scheduler command line option `--feature-gates`.
-->
## 如何使用   {#how-to-use}

### 启用此特性   {#enabling-the-feature}

在 Alpha 阶段，`StorageCapacityScoring` 默认是禁用的。要使用此特性，请将
`StorageCapacityScoring=true` 添加到 kube-scheduler 命令行选项
`--feature-gates` 中。

<!--
### Configuration changes

You can configure node priorities based on storage utilization using the `shape` parameter in the VolumeBinding plugin configuration.
This allows you to prioritize nodes with higher available storage capacity (default) or, conversely, nodes with lower available storage capacity.
For example, to prioritize lower available storage capacity, configure `KubeSchedulerConfiguration` as follows:
-->
### 配置更改   {#configuration-changes}

你可以使用 VolumeBinding 插件配置中的 `shape` 参数，根据存储利用率来配置节点优先级。
这允许你优先考虑具有更高可用存储容量（默认）的节点，或者相反，优先考虑具有更低可用存储容量的节点。
例如，要优先考虑更低的可用存储容量，请按如下方式配置 `KubeSchedulerConfiguration`：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  ...
  pluginConfig:
  - name: VolumeBinding
    args:
      ...
      shape:
      - utilization: 0
        score: 0
      - utilization: 100
        score: 10
```

<!--
For more details, please refer to the [documentation](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-VolumeBindingArgs).
-->
详情请参阅[文档](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-VolumeBindingArgs)。

<!--
## Further reading
-->
## 进一步阅读   {#further-reading}

- [KEP-4049: Storage Capacity Scoring of Nodes for Dynamic Provisioning](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/4049-storage-capacity-scoring-of-nodes-for-dynamic-provisioning/README.md)

<!--
## Additional note: Relationship with VolumeCapacityPriority

The alpha feature gate `VolumeCapacityPriority`, which performs node scoring based on available storage capacity during static provisioning,
will be deprecated and replaced by `StorageCapacityScoring`.
-->
## 附加说明：与 VolumeCapacityPriority 的关系

基于静态配置期间的可用存储容量进行节点评分的 Alpha **特性门控**
`VolumeCapacityPriority`，将被弃用，并由 `StorageCapacityScoring` 替代。

<!--
Please note that while `VolumeCapacityPriority` prioritizes nodes with lower available storage capacity by default,
`StorageCapacityScoring` prioritizes nodes with higher available storage capacity by default.
-->
请注意，虽然 `VolumeCapacityPriority` 默认优先考虑可用存储容量较低的节点，
但 `StorageCapacityScoring` 默认优先考虑可用存储容量较高的节点。
