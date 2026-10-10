---
layout: blog
title: 'Kubernetes 1.31：podAffinity 中的 matchLabelKeys 进阶至 Beta'
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

在 Kubernetes 1.31 中，此特性进阶至 Beta，并且相应的特性门控（`MatchLabelKeysInPodAffinity`）默认启用。

<!--
## `matchLabelKeys` - Enhanced scheduling for versatile rolling updates

During a workload's (e.g., Deployment) rolling update, a cluster may have Pods from multiple versions at the same time.
However, the scheduler cannot distinguish between old and new versions based on the `labelSelector` specified in `podAffinity` or `podAntiAffinity`. As a result, it will co-locate or disperse Pods regardless of their versions.
-->
## `matchLabelKeys` - 为多样化滚动更新增强了调度

在工作负载（例如 Deployment）的滚动更新期间，集群中可能同时存在多个版本的 Pod。  
然而，调度器无法基于 `podAffinity` 或 `podAntiAffinity` 中指定的 `labelSelector` 区分新旧版本。
结果，调度器将并置或分散调度 Pod，不会考虑这些 Pod 的版本。

<!--
This can lead to sub-optimal scheduling outcome, for example:
- New version Pods are co-located with old version Pods (`podAffinity`), which will eventually be removed after rolling updates.
- Old version Pods are distributed across all available topologies, preventing new version Pods from finding nodes due to `podAntiAffinity`.
-->
这可能导致次优的调度结果，例如：

- 新版本的 Pod 与旧版本的 Pod（`podAffinity`）并置在一起，这些旧版本的 Pod 最终将在滚动更新后被移除。  
- 旧版本的 Pod 被分布在所有可用的拓扑中，导致新版本的 Pod 由于 `podAntiAffinity` 无法找到节点。

<!--
`matchLabelKeys` is a set of Pod label keys and addresses this problem.
The scheduler looks up the values of these keys from the new Pod's labels and combines them with `labelSelector`
so that podAffinity matches Pods that have the same key-value in labels.

By using label [pod-template-hash](/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label) in `matchLabelKeys`,
you can ensure that only Pods of the same version are evaluated for `podAffinity` or `podAntiAffinity`.
-->
`matchLabelKeys` 是一组 Pod 标签键，可以解决上述问题。  
调度器从新 Pod 的标签中查找这些键的值，并将其与 `labelSelector` 结合，
以便 `podAffinity` 匹配到具有相同标签键值的 Pod。

通过在 `matchLabelKeys` 中使用标签
[pod-template-hash](/zh-cn/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label)，  
你可以确保对 `podAffinity` 或 `podAntiAffinity` 进行评估时仅考虑相同版本的 Pod。

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
上述 Pod 中的 `matchLabelKeys` 将被转换为：

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
          - key: pod-template-hash # 从 matchLabelKeys 添加; 只有来自同一 ReplicaSet 的 Pod 将与此亲和性匹配
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
## `mismatchLabelKeys` - 服务隔离

`mismatchLabelKeys` 是一组 Pod 标签键，类似于 `matchLabelKeys`，  
它在新 Pod 的标签中查找这些键的值，并将其与 `labelSelector` 合并为 `key notin (value)`，
以便 `podAffinity` **不**会匹配到具有相同标签键值的 Pod。

假设每个租户的所有 Pod 通过控制器或像 Helm 这样的清单管理工具得到 `tenant` 标签。

<!--
Although the value of `tenant` label is unknown when composing each workload's manifest,
the cluster admin wants to achieve exclusive 1:1 tenant to domain placement for a tenant isolation.

`mismatchLabelKeys` works for this usecase;
By applying the following affinity globally using a mutating webhook,
the cluster admin can ensure that the Pods from the same tenant will land on the same domain exclusively,
meaning Pods from other tenants won't land on the same domain.
-->
尽管在组合每个工作负载的清单时，`tenant` 标签的值是未知的，  
但集群管理员希望实现租户与域之间形成排他性的 1:1 对应关系，以便隔离租户。

`mismatchLabelKeys` 适用于这一使用场景；  
通过使用变更性质的 Webhook 在全局应用以下亲和性，
集群管理员可以确保来自同一租户的 Pod 将以独占方式落到同一域上，  
这意味着来自其他租户的 Pod 不会落到同一域上。

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
  podAffinity:      # 确保此租户的 Pod 落在同一节点池上
    requiredDuringSchedulingIgnoredDuringExecution:
    - matchLabelKeys:
        - tenant
      topologyKey: node-pool
  podAntiAffinity:  # 确保只有此租户的 Pod 落在同一节点池上
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
上述的 `matchLabelKeys` 和 `mismatchLabelKeys` 将被转换为：

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
    podAffinity:      # 确保此租户的 Pod 落在同一节点池上
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
    podAntiAffinity:  # 确保只有此租户的 Pod 落在同一节点池上
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
## 参与其中

这些特性由 Kubernetes
[SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) 管理。

请加入我们并分享你的反馈。我们期待听到你的声音！

<!--
## How can I learn more?

- [The official document of podAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
- [KEP-3633: Introduce matchLabelKeys and mismatchLabelKeys to podAffinity and podAntiAffinity](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3633-matchlabelkeys-to-podaffinity/README.md#story-2)
-->
## 了解更多

- [podAffinity 的官方文档](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)  
- [KEP-3633：将 matchLabelKeys 和 mismatchLabelKeys 引入 podAffinity 和 podAntiAffinity](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3633-matchlabelkeys-to-podaffinity/README.md#story-2)
