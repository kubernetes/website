---
layout: blog
title: 'Kubernetes 1.31：podAffinity 中的 matchLabelKeys 進階至 Beta'
date: 2024-08-16
slug: matchlabelkeys-podaffinity
author: >
  Kensei Nakada (Tetrate)
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes 1.31: MatchLabelKeys in PodAffinity graduates to beta'
date: 2024-08-16
slug: matchlabelkeys-podaffinity
author: >
  Kensei Nakada (Tetrate)
-->

<!--
Kubernetes 1.29 introduced new fields `matchLabelKeys` and `mismatchLabelKeys` in `podAffinity` and `podAntiAffinity`.

In Kubernetes 1.31, this feature moves to beta and the corresponding feature gate (`MatchLabelKeysInPodAffinity`) gets enabled by default.
-->
Kubernetes 1.29 在 `podAffinity` 和 `podAntiAffinity` 中引入了新的字段 `matchLabelKeys` 和 `mismatchLabelKeys`。

在 Kubernetes 1.31 中，此特性進階至 Beta，並且相應的特性門控（`MatchLabelKeysInPodAffinity`）默認啓用。

<!--
## `matchLabelKeys` - Enhanced scheduling for versatile rolling updates

During a workload's (e.g., Deployment) rolling update, a cluster may have Pods from multiple versions at the same time.
However, the scheduler cannot distinguish between old and new versions based on the `labelSelector` specified in `podAffinity` or `podAntiAffinity`. As a result, it will co-locate or disperse Pods regardless of their versions.
-->
## `matchLabelKeys` - 爲多樣化滾動更新增強了調度

在工作負載（例如 Deployment）的滾動更新期間，集羣中可能同時存在多個版本的 Pod。  
然而，調度器無法基於 `podAffinity` 或 `podAntiAffinity` 中指定的 `labelSelector` 區分新舊版本。
結果，調度器將並置或分散調度 Pod，不會考慮這些 Pod 的版本。

<!--
This can lead to sub-optimal scheduling outcome, for example:
- New version Pods are co-located with old version Pods (`podAffinity`), which will eventually be removed after rolling updates.
- Old version Pods are distributed across all available topologies, preventing new version Pods from finding nodes due to `podAntiAffinity`.
-->
這可能導致次優的調度結果，例如：

- 新版本的 Pod 與舊版本的 Pod（`podAffinity`）並置在一起，這些舊版本的 Pod 最終將在滾動更新後被移除。  
- 舊版本的 Pod 被分佈在所有可用的拓撲中，導致新版本的 Pod 由於 `podAntiAffinity` 無法找到節點。

<!--
`matchLabelKeys` is a set of Pod label keys and addresses this problem.
The scheduler looks up the values of these keys from the new Pod's labels and combines them with `labelSelector`
so that podAffinity matches Pods that have the same key-value in labels.

By using label [pod-template-hash](/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label) in `matchLabelKeys`,
you can ensure that only Pods of the same version are evaluated for `podAffinity` or `podAntiAffinity`.
-->
`matchLabelKeys` 是一組 Pod 標籤鍵，可以解決上述問題。  
調度器從新 Pod 的標籤中查找這些鍵的值，並將其與 `labelSelector` 結合，
以便 `podAffinity` 匹配到具有相同標籤鍵值的 Pod。

通過在 `matchLabelKeys` 中使用標籤
[pod-template-hash](/zh-cn/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label)，  
你可以確保對 `podAffinity` 或 `podAntiAffinity` 進行評估時僅考慮相同版本的 Pod。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: application-server
...
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - database
        topologyKey: topology.kubernetes.io/zone
        matchLabelKeys:
        - pod-template-hash
```

<!--
The above `matchLabelKeys` will be translated in Pods like:
-->
上述 Pod 中的 `matchLabelKeys` 將被轉換爲：

<!--
# Added from matchLabelKeys; Only Pods from the same replicaset will match this affinity.
-->
```yaml
kind: Pod
metadata:
  name: application-server
  labels:
    pod-template-hash: xyz
...
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - database
          - key: pod-template-hash # 從 matchLabelKeys 添加; 只有來自同一 ReplicaSet 的 Pod 將與此親和性匹配
            operator: In
            values:
            - xyz 
        topologyKey: topology.kubernetes.io/zone
        matchLabelKeys: 
        - pod-template-hash
```

<!--
## `mismatchLabelKeys` - Service isolation

`mismatchLabelKeys` is a set of Pod label keys, like `matchLabelKeys`,
which looks up the values of these keys from the new Pod's labels, and merge them with `labelSelector` as `key notin (value)`
so that `podAffinity` does _not_ match Pods that have the same key-value in labels.

Suppose all Pods for each tenant get `tenant` label via a controller or a manifest management tool like Helm.
-->
## `mismatchLabelKeys` - 服務隔離

`mismatchLabelKeys` 是一組 Pod 標籤鍵，類似於 `matchLabelKeys`，  
它在新 Pod 的標籤中查找這些鍵的值，並將其與 `labelSelector` 合併爲 `key notin (value)`，
以便 `podAffinity` **不**會匹配到具有相同標籤鍵值的 Pod。

假設每個租戶的所有 Pod 通過控制器或像 Helm 這樣的清單管理工具得到 `tenant` 標籤。

<!--
Although the value of `tenant` label is unknown when composing each workload's manifest,
the cluster admin wants to achieve exclusive 1:1 tenant to domain placement for a tenant isolation.

`mismatchLabelKeys` works for this usecase;
By applying the following affinity globally using a mutating webhook,
the cluster admin can ensure that the Pods from the same tenant will land on the same domain exclusively,
meaning Pods from other tenants won't land on the same domain.
-->
儘管在組合每個工作負載的清單時，`tenant` 標籤的值是未知的，  
但集羣管理員希望實現租戶與域之間形成排他性的 1:1 對應關係，以便隔離租戶。

`mismatchLabelKeys` 適用於這一使用場景；  
通過使用變更性質的 Webhook 在全局應用以下親和性，
集羣管理員可以確保來自同一租戶的 Pod 將以獨佔方式落到同一域上，  
這意味着來自其他租戶的 Pod 不會落到同一域上。

<!--
```yaml
affinity:
  podAffinity:      # ensures the pods of this tenant land on the same node pool
    requiredDuringSchedulingIgnoredDuringExecution:
    - matchLabelKeys:
        - tenant
      topologyKey: node-pool
  podAntiAffinity:  # ensures only Pods from this tenant lands on the same node pool
    requiredDuringSchedulingIgnoredDuringExecution:
    - mismatchLabelKeys:
        - tenant
      labelSelector:
        matchExpressions:
        - key: tenant
          operator: Exists
      topologyKey: node-pool
```
-->
```yaml
affinity:
  podAffinity:      # 確保此租戶的 Pod 落在同一節點池上
    requiredDuringSchedulingIgnoredDuringExecution:
    - matchLabelKeys:
        - tenant
      topologyKey: node-pool
  podAntiAffinity:  # 確保只有此租戶的 Pod 落在同一節點池上
    requiredDuringSchedulingIgnoredDuringExecution:
    - mismatchLabelKeys:
        - tenant
      labelSelector:
        matchExpressions:
        - key: tenant
          operator: Exists
      topologyKey: node-pool
```

<!--
The above `matchLabelKeys` and `mismatchLabelKeys` will be translated to like:
-->
上述的 `matchLabelKeys` 和 `mismatchLabelKeys` 將被轉換爲：

<!--
```yaml
kind: Pod
metadata:
  name: application-server
  labels:
    tenant: service-a
spec: 
  affinity:
    podAffinity:      # ensures the pods of this tenant land on the same node pool
      requiredDuringSchedulingIgnoredDuringExecution:
      - matchLabelKeys:
          - tenant
        topologyKey: node-pool
        labelSelector:
          matchExpressions:
          - key: tenant
            operator: In
            values:
            - service-a 
    podAntiAffinity:  # ensures only Pods from this tenant lands on the same node pool
      requiredDuringSchedulingIgnoredDuringExecution:
      - mismatchLabelKeys:
          - tenant
        labelSelector:
          matchExpressions:
          - key: tenant
            operator: Exists
          - key: tenant
            operator: NotIn
            values:
            - service-a
        topologyKey: node-pool
```
-->
```yaml
kind: Pod
metadata:
  name: application-server
  labels:
    tenant: service-a
spec: 
  affinity:
    podAffinity:      # 確保此租戶的 Pod 落在同一節點池上
      requiredDuringSchedulingIgnoredDuringExecution:
      - matchLabelKeys:
          - tenant
        topologyKey: node-pool
        labelSelector:
          matchExpressions:
          - key: tenant
            operator: In
            values:
            - service-a 
    podAntiAffinity:  # 確保只有此租戶的 Pod 落在同一節點池上
      requiredDuringSchedulingIgnoredDuringExecution:
      - mismatchLabelKeys:
          - tenant
        labelSelector:
          matchExpressions:
          - key: tenant
            operator: Exists
          - key: tenant
            operator: NotIn
            values:
            - service-a 
        topologyKey: node-pool
```

<!--
## Getting involved

These features are managed by Kubernetes [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

Please join us and share your feedback. We look forward to hearing from you!
-->
## 參與其中

這些特性由 Kubernetes
[SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) 管理。

請加入我們並分享你的反饋。我們期待聽到你的聲音！

<!--
## How can I learn more?

- [The official document of podAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
- [KEP-3633: Introduce matchLabelKeys and mismatchLabelKeys to podAffinity and podAntiAffinity](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3633-matchlabelkeys-to-podaffinity/README.md#story-2)
-->
## 瞭解更多

- [podAffinity 的官方文檔](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)  
- [KEP-3633：將 matchLabelKeys 和 mismatchLabelKeys 引入 podAffinity 和 podAntiAffinity](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3633-matchlabelkeys-to-podaffinity/README.md#story-2)
