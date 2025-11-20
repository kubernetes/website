---
layout: blog
title: "Kubernetes v1.33：儲存動態製備模式下的節點儲存容量評分（Alpha 版）"
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
Kubernetes v1.33 引入了一個名爲 `StorageCapacityScoring` 的新 Alpha 級別**特性**。
此**特性**添加了一種爲 Pod 調度評分的方法，
並與[拓撲感知卷製備](/blog/2018/10/11/topology-aware-volume-provisioning-in-kubernetes/)相關。
此**特性**可以輕鬆地選擇在具有最多或最少可用儲存容量的節點上調度 Pod。

<!--
## About this feature

This feature extends the kube-scheduler's VolumeBinding plugin to perform scoring using node storage capacity information
obtained from [Storage Capacity](/docs/concepts/storage/storage-capacity/). Currently, you can only filter out nodes with insufficient storage capacity.
So, you have to use a scheduler extender to achieve storage-capacity-based pod scheduling.
-->
## 關於此特性   {#about-this-feature}

此特性擴展了 kube-scheduler 的 VolumeBinding 插件，
以使用從[儲存容量](/zh-cn/docs/concepts/storage/storage-capacity/)獲得的節點儲存容量資訊進行評分。
目前，你只能過濾掉儲存容量不足的節點。因此，你必須使用調度器擴展程式來實現基於儲存容量的 Pod 調度。

<!--
This feature is useful for provisioning node-local PVs, which have size limits based on the node's storage capacity. By using this feature,
you can assign the PVs to the nodes with the most available storage space so that you can expand the PVs later as much as possible.

In another use case, you might want to reduce the number of nodes as much as possible for low operation costs in cloud environments by choosing
the least storage capacity node. This feature helps maximize resource utilization by filling up nodes more sequentially, starting with the most
utilized nodes first that still have enough storage capacity for the requested volume size.
-->
此特性對於製備節點本地的 PV 非常有用，這些 PV 的大小限制取決於節點的儲存容量。
通過使用此特性，你可以將 PV 指派給具有最多可用儲存空間的節點，
以便以後儘可能多地擴展 PV。

在另一個用例中，你可能希望通過選擇儲存容量最小的節點，
在雲環境中儘可能減少節點數量以降低運維成本。
此特性通過從利用率最高的節點開始填充節點，從而幫助最大化資源利用率，
前提是這些節點仍有足夠的儲存容量來滿足請求的卷大小。

<!--
## How to use

### Enabling the feature

In the alpha phase, `StorageCapacityScoring` is disabled by default. To use this feature, add `StorageCapacityScoring=true`
to the kube-scheduler command line option `--feature-gates`.
-->
## 如何使用   {#how-to-use}

### 啓用此特性   {#enabling-the-feature}

在 Alpha 階段，`StorageCapacityScoring` 預設是禁用的。要使用此特性，請將
`StorageCapacityScoring=true` 添加到 kube-scheduler 命令列選項
`--feature-gates` 中。

<!--
### Configuration changes

You can configure node priorities based on storage utilization using the `shape` parameter in the VolumeBinding plugin configuration.
This allows you to prioritize nodes with higher available storage capacity (default) or, conversely, nodes with lower available storage capacity.
For example, to prioritize lower available storage capacity, configure `KubeSchedulerConfiguration` as follows:
-->
### 設定更改   {#configuration-changes}

你可以使用 VolumeBinding 插件設定中的 `shape` 參數，根據儲存利用率來設定節點優先級。
這允許你優先考慮具有更高可用儲存容量（預設）的節點，或者相反，優先考慮具有更低可用儲存容量的節點。
例如，要優先考慮更低的可用儲存容量，請按如下方式設定 `KubeSchedulerConfiguration`：

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
詳情請參閱[文檔](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-VolumeBindingArgs)。

<!--
## Further reading
-->
## 進一步閱讀   {#further-reading}

- [KEP-4049: Storage Capacity Scoring of Nodes for Dynamic Provisioning](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/4049-storage-capacity-scoring-of-nodes-for-dynamic-provisioning/README.md)

<!--
## Additional note: Relationship with VolumeCapacityPriority

The alpha feature gate `VolumeCapacityPriority`, which performs node scoring based on available storage capacity during static provisioning,
will be deprecated and replaced by `StorageCapacityScoring`.
-->
## 附加說明：與 VolumeCapacityPriority 的關係

基於靜態設定期間的可用儲存容量進行節點評分的 Alpha **特性門控**
`VolumeCapacityPriority`，將被棄用，並由 `StorageCapacityScoring` 替代。

<!--
Please note that while `VolumeCapacityPriority` prioritizes nodes with lower available storage capacity by default,
`StorageCapacityScoring` prioritizes nodes with higher available storage capacity by default.
-->
請注意，雖然 `VolumeCapacityPriority` 預設優先考慮可用儲存容量較低的節點，
但 `StorageCapacityScoring` 預設優先考慮可用儲存容量較高的節點。
