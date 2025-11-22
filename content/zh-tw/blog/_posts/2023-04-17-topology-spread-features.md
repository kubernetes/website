---
layout: blog
title: "Kubernetes 1.27：更多精細粒度的 Pod 拓撲分佈策略進階至 Beta"
date: 2023-04-17
slug: fine-grained-pod-topology-spread-features-beta
---
<!--
layout: blog
title: "Kubernetes 1.27: More fine-grained pod topology spread policies reached beta"
date: 2023-04-17
slug: fine-grained-pod-topology-spread-features-beta
-->

<!--
**Authors:** [Alex Wang](https://github.com/denkensk) (Shopee), [Kante Yin](https://github.com/kerthcet) (DaoCloud), [Kensei Nakada](https://github.com/sanposhiho) (Mercari)
-->
**作者:** [Alex Wang](https://github.com/denkensk) (Shopee),
[Kante Yin](https://github.com/kerthcet) (DaoCloud),
[Kensei Nakada](https://github.com/sanposhiho) (Mercari)

**譯者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
In Kubernetes v1.19, [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
went to general availability (GA).

As time passed, we - SIG Scheduling - received feedback from users,
and, as a result, we're actively working on improving the Topology Spread feature via three KEPs.
All of these features have reached beta in Kubernetes v1.27 and are enabled by default.

This blog post introduces each feature and the use case behind each of them.
-->
在 Kubernetes v1.19 中，
[Pod 拓撲分佈約束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)進階至正式發佈 (GA)。

隨着時間的流逝，SIG Scheduling 收到了許多使用者的反饋，
隨後通過 3 個 KEP 積極改進了 Topology Spread（拓撲分佈）特性。
所有這些特性在 Kubernetes v1.27 中已進階至 Beta 且預設被啓用。

這篇博文介紹了這些特性及其背後的使用場景。

<!--
## KEP-3022: min domains in Pod Topology Spread

Pod Topology Spread has the `maxSkew` parameter to define the degree to which Pods may be unevenly distributed.
-->
## KEP-3022：Pod 拓撲分佈中的最小域數

Pod 拓撲分佈使用 `maxSkew` 參數來定義 Pod 可以不均勻分佈的程度。

<!--
But, there wasn't a way to control the number of domains over which we should spread.
Some users want to force spreading Pods over a minimum number of domains, and if there aren't enough already present, make the cluster-autoscaler provision them.

Kubernetes v1.24 introduced the `minDomains` parameter for pod topology spread constraints,
as an alpha feature.
Via `minDomains` parameter, you can define the minimum number of domains.

For example, assume there are 3 Nodes with the enough capacity,
and a newly created ReplicaSet has the following `topologySpreadConstraints` in its Pod template.
-->
但還有沒有一種方式可以控制應分佈到的域數。
一些使用者想要強制在至少指定個數的若干域內分佈 Pod；並且如果目前存在的域個數還不夠，
則使用 cluster-autoscaler 製備新的域。

Kubernetes v1.24 以 Alpha 特性的形式爲 Pod 拓撲分佈約束引入了 `minDomains` 參數。
通過 `minDomains` 參數，你可以定義最小域數。

例如，假設有 3 個 Node 具有足夠的容量，
且新建的 ReplicaSet 在其 Pod 模板中帶有以下 `topologySpreadConstraints`。

<!--
```yaml
...
topologySpreadConstraints:
- maxSkew: 1
  minDomains: 5 # requires 5 Nodes at least (because each Node has a unique hostname).
  whenUnsatisfiable: DoNotSchedule # minDomains is valid only when DoNotSchedule is used.
  topologyKey: kubernetes.io/hostname
  labelSelector:
    matchLabels:
        foo: bar
```
-->
```yaml
...
topologySpreadConstraints:
- maxSkew: 1
  minDomains: 5 # 需要至少 5 個 Node（因爲每個 Node 都有唯一的 hostname）
  whenUnsatisfiable: DoNotSchedule # 只有使用 DoNotSchedule 時 minDomains 纔有效
  topologyKey: kubernetes.io/hostname
  labelSelector:
    matchLabels:
        foo: bar
```

<!--
In this case, 3 Pods will be scheduled to those 3 Nodes,
but other 2 Pods from this replicaset will be unschedulable until more Nodes join the cluster.

You can imagine that the cluster autoscaler provisions new Nodes based on these unschedulable Pods,
and as a result, the replicas are finally spread over 5 Nodes.
-->
在這個場景中，3 個 Pod 將被分別調度到這 3 個 Node 上，
但 ReplicaSet 中的其它 2 個 Pod 在更多 Node 接入到叢集之前將無法被調度。

你可以想象叢集自動擴縮器基於這些不可調度的 Pod 製備新的 Node，
因此這些副本最後將分佈到 5 個 Node 上。

<!--
## KEP-3094: Take taints/tolerations into consideration when calculating podTopologySpread skew

Before this enhancement, when you deploy a pod with `podTopologySpread` configured, kube-scheduler would
take the Nodes that satisfy the Pod's nodeAffinity and nodeSelector into consideration
in filtering and scoring, but would not care about whether the node taints are tolerated by the incoming pod or not.
This may lead to a node with untolerated taint as the only candidate for spreading, and as a result,
the pod will stuck in Pending if it doesn't tolerate the taint.
-->
## KEP-3094：計算 podTopologySpread 偏差時考慮污點/容忍度

在本次增強之前，當你部署已經設定了 `topologySpreadConstraints` 的 Pod 時，kube-scheduler
將在過濾和評分時考慮滿足 Pod 的 nodeAffinity 和 nodeSelector 的節點，
但不關心傳入的 Pod 是否容忍節點污點。這可能會導致具有不可容忍污點的節點成爲唯一的分佈候選，
因此如果 Pod 不容忍污點，則該 Pod 將卡在 Pending 狀態。

<!--
To allow more fine-gained decisions about which Nodes to account for when calculating spreading skew,
Kubernetes 1.25 introduced two new fields within `topologySpreadConstraints` to define node inclusion policies:
`nodeAffinityPolicy` and `nodeTaintPolicy`.

A manifest that applies these policies looks like the following:
-->
爲了能夠在計算分佈偏差時針對要考慮的節點作出粒度更精細的決策，Kubernetes 1.25
在 `topologySpreadConstraints` 中引入了兩個新字段 `nodeAffinityPolicy`
和 `nodeTaintPolicy` 來定義節點包含策略。

應用這些策略的清單如下所示：

<!--
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # Configure a topology spread constraint
  topologySpreadConstraints:
    - maxSkew: <integer>
      # ...
      nodeAffinityPolicy: [Honor|Ignore]
      nodeTaintsPolicy: [Honor|Ignore]
  # other Pod fields go here
```
-->
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # 配置拓撲分佈約束
  topologySpreadConstraints:
    - maxSkew: <integer>
      # ...
      nodeAffinityPolicy: [Honor|Ignore]
      nodeTaintsPolicy: [Honor|Ignore]
  # 在此處添加其他 Pod 字段
```

<!--
The `nodeAffinityPolicy` field indicates how Kubernetes treats a Pod's `nodeAffinity` or `nodeSelector` for
pod topology spreading.
If `Honor`, kube-scheduler filters out nodes not matching `nodeAffinity`/`nodeSelector` in the calculation of
spreading skew.
If `Ignore`, all nodes will be included, regardless of whether they match the Pod's `nodeAffinity`/`nodeSelector`
or not.

For backwards compatibility, `nodeAffinityPolicy` defaults to `Honor`.
-->
`nodeAffinityPolicy` 字段指示 Kubernetes 如何處理 Pod 的 `nodeAffinity` 或 `nodeSelector`
以計算 Pod 拓撲分佈。如果是 `Honor`，則 kube-scheduler 在計算分佈偏差時會過濾掉不匹配
`nodeAffinity`/`nodeSelector` 的節點。如果是 `Ignore`，則會包括所有節點，不會管它們是否與
Pod 的 `nodeAffinity`/`nodeSelector` 匹配。

爲了向後兼容，`nodeAffinityPolicy` 預設爲 `Honor`。

<!--
The `nodeTaintsPolicy` field defines how Kubernetes considers node taints for pod topology spreading.
If `Honor`, only tainted nodes for which the incoming pod has a toleration, will be included in the calculation of spreading skew.
If `Ignore`, kube-scheduler will not consider the node taints at all in the calculation of spreading skew, so a node with
pod untolerated taint will also be included.

For backwards compatibility, `nodeTaintsPolicy` defaults to `Ignore`.
-->
`nodeTaintsPolicy` 字段定義 Kubernetes 計算 Pod 拓撲分佈時如何對待節點污點。
如果是 `Honor`，則只有設定了污點的節點上的傳入 Pod 帶有容忍標籤時該節點纔會被包括在分佈偏差的計算中。
如果是 `Ignore`，則在計算分佈偏差時 kube-scheduler 根本不會考慮節點污點，
因此帶有未容忍污點的 Pod 的節點也會被包括進去。

爲了向後兼容，`nodeTaintsPolicy` 預設爲 `Ignore`。

<!--
The feature was introduced in v1.25 as alpha. By default, it was disabled, so if you want to use this feature in v1.25,
you had to explictly enable the feature gate `NodeInclusionPolicyInPodTopologySpread`. In the following v1.26
release, that associated feature graduated to beta and is enabled by default.
-->
該特性在 v1.25 中作爲 Alpha 引入。預設被禁用，因此如果要在 v1.25 中使用此特性，
則必須顯式啓用特性門控 `NodeInclusionPolicyInPodTopologySpread`。
在接下來的 v1.26 版本中，相關特性進階至 Beta 並預設被啓用。

<!--
## KEP-3243: Respect Pod topology spread after rolling upgrades
-->
## KEP-3243：滾動升級後關注 Pod 拓撲分佈

<!--
Pod Topology Spread uses the field `labelSelector` to identify the group of pods over which
spreading will be calculated. When using topology spreading with Deployments, it is common
practice to use the `labelSelector` of the Deployment as the `labelSelector` in the topology
spread constraints. However, this implies that all pods of a Deployment are part of the spreading
calculation, regardless of whether they belong to different revisions. As a result, when a new revision
is rolled out, spreading will apply across pods from both the old and new ReplicaSets, and so by the
time the new ReplicaSet is completely rolled out and the old one is rolled back, the actual spreading
we are left with may not match expectations because the deleted pods from the older ReplicaSet will cause
skewed distribution for the remaining pods. To avoid this problem, in the past users needed to add a
revision label to Deployment and update it manually at each rolling upgrade (both the label on the
pod template and the `labelSelector` in the `topologySpreadConstraints`).
-->
Pod 拓撲分佈使用 `labelSelector` 字段來標識要計算分佈的 Pod 組。
在針對 Deployment 進行拓撲分佈時，通常會使用 Deployment 的
`labelSelector` 作爲拓撲分佈約束中的 `labelSelector`。
但這意味着 Deployment 的所有 Pod 都參與分佈計算，與這些 Pod 是否屬於不同的版本無關。
因此，在發佈新版本時，分佈將同時應用到新舊 ReplicaSet 的 Pod，
並在新的 ReplicaSet 完全發佈且舊的 ReplicaSet 被下線時，我們留下的實際分佈可能與預期不符，
這是因爲舊 ReplicaSet 中已刪除的 Pod 將導致剩餘 Pod 的分佈不均勻。
爲了避免這個問題，過去使用者需要向 Deployment 添加修訂版標籤，並在每次滾動升級時手動更新
（包括 Pod 模板上的標籤和 `topologySpreadConstraints` 中的 `labelSelector`）。

<!--
To solve this problem with a simpler API, Kubernetes v1.25 introduced a new field named
`matchLabelKeys` to `topologySpreadConstraints`. `matchLabelKeys` is a list of pod label keys to select
the pods over which spreading will be calculated. The keys are used to lookup values from the labels of
the Pod being scheduled, those key-value labels are ANDed with `labelSelector` to select the group of
existing pods over which spreading will be calculated for the incoming pod.
-->
爲了通過更簡單的 API 解決這個問題，Kubernetes v1.25 引入了一個名爲 `matchLabelKeys`
的新字段到 `topologySpreadConstraints` 中。`matchLabelKeys` 是一個 Pod 標籤鍵列表，
用於選擇計算分佈方式的 Pod。這些鍵用於查找 Pod 被調度時的標籤值，
這些鍵值標籤與 `labelSelector` 進行邏輯與運算，爲新增 Pod 計算分佈方式選擇現有 Pod 組。

<!--
With `matchLabelKeys`, you don't need to update the `pod.spec` between different revisions.
The controller or operator managing rollouts just needs to set different values to the same label key for different revisions.
The scheduler will assume the values automatically based on `matchLabelKeys`.
For example, if you are configuring a Deployment, you can use the label keyed with
[pod-template-hash](/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label),
which is added automatically by the Deployment controller, to distinguish between different
revisions in a single Deployment.
-->
藉助 `matchLabelKeys`，你無需在修訂版變化時更新 `pod.spec`。
控制器或 Operator 管理滾動升級時只需針對不同修訂版爲相同的標籤鍵設置不同的值即可。
調度程式將基於 `matchLabelKeys` 自動完成賦值。例如，如果你正設定 Deployment，
則可以使用由 Deployment 控制器自動添加的
[pod-template-hash](/zh-cn/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label)
的標籤鍵來區分單個 Deployment 中的不同修訂版。

```yaml
topologySpreadConstraints:
    - maxSkew: 1
      topologyKey: kubernetes.io/hostname
      whenUnsatisfiable: DoNotSchedule
      labelSelector:
        matchLabels:
          app: foo
      matchLabelKeys:
        - pod-template-hash
```

<!--
## Getting involved

These features are managed by Kubernetes [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

Please join us and share your feedback. We look forward to hearing from you!
-->
## 參與其中

這些特性歸
Kubernetes [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) 管理。

請加入我們分享反饋。我們期待聆聽你的聲音！

<!--
## How can I learn more?

- [Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/) in the Kubernetes documentation
- [KEP-3022: min domains in Pod Topology Spread](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3022-min-domains-in-pod-topology-spread)
- [KEP-3094: Take taints/tolerations into consideration when calculating PodTopologySpread skew](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3094-pod-topology-spread-considering-taints)
- [KEP-3243: Respect PodTopologySpread after rolling upgrades](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3243-respect-pod-topology-spread-after-rolling-upgrades)
-->
## 瞭解更多

- Kubernetes 文檔中的 [Pod 拓撲分佈約束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)
- [KEP-3022：Pod 拓撲分佈中的最小域數](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3022-min-domains-in-pod-topology-spread)
- [KEP-3094：計算 podTopologySpread 偏差時考慮污點/容忍度](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3094-pod-topology-spread-considering-taints)
- [KEP-3243：滾動升級後關注 Pod 拓撲分佈](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3243-respect-pod-topology-spread-after-rolling-upgrades)
