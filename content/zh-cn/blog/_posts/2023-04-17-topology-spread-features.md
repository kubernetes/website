---
layout: blog
title: "Kubernetes 1.27：更多精细粒度的 Pod 拓扑分布策略进阶至 Beta"
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

**译者:** [Michael Yao](https://github.com/windsonsea) (DaoCloud)

<!--
In Kubernetes v1.19, [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
went to general availability (GA).

As time passed, we - SIG Scheduling - received feedback from users,
and, as a result, we're actively working on improving the Topology Spread feature via three KEPs.
All of these features have reached beta in Kubernetes v1.27 and are enabled by default.

This blog post introduces each feature and the use case behind each of them.
-->
在 Kubernetes v1.19 中，
[Pod 拓扑分布约束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)进阶至正式发布 (GA)。

随着时间的流逝，SIG Scheduling 收到了许多用户的反馈，
随后通过 3 个 KEP 积极改进了 Topology Spread（拓扑分布）特性。
所有这些特性在 Kubernetes v1.27 中已进阶至 Beta 且默认被启用。

这篇博文介绍了这些特性及其背后的使用场景。

<!--
## KEP-3022: min domains in Pod Topology Spread

Pod Topology Spread has the `maxSkew` parameter to define the degree to which Pods may be unevenly distributed.
-->
## KEP-3022：Pod 拓扑分布中的最小域数

Pod 拓扑分布使用 `maxSkew` 参数来定义 Pod 可以不均匀分布的程度。

<!--
But, there wasn't a way to control the number of domains over which we should spread.
Some users want to force spreading Pods over a minimum number of domains, and if there aren't enough already present, make the cluster-autoscaler provision them.

Kubernetes v1.24 introduced the `minDomains` parameter for pod topology spread constraints,
as an alpha feature.
Via `minDomains` parameter, you can define the minimum number of domains.

For example, assume there are 3 Nodes with the enough capacity,
and a newly created ReplicaSet has the following `topologySpreadConstraints` in its Pod template.
-->
但还有没有一种方式可以控制应分布到的域数。
一些用户想要强制在至少指定个数的若干域内分布 Pod；并且如果目前存在的域个数还不够，
则使用 cluster-autoscaler 制备新的域。

Kubernetes v1.24 以 Alpha 特性的形式为 Pod 拓扑分布约束引入了 `minDomains` 参数。
通过 `minDomains` 参数，你可以定义最小域数。

例如，假设有 3 个 Node 具有足够的容量，
且新建的 ReplicaSet 在其 Pod 模板中带有以下 `topologySpreadConstraints`。

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
  minDomains: 5 # 需要至少 5 个 Node（因为每个 Node 都有唯一的 hostname）
  whenUnsatisfiable: DoNotSchedule # 只有使用 DoNotSchedule 时 minDomains 才有效
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
在这个场景中，3 个 Pod 将被分别调度到这 3 个 Node 上，
但 ReplicaSet 中的其它 2 个 Pod 在更多 Node 接入到集群之前将无法被调度。

你可以想象集群自动扩缩器基于这些不可调度的 Pod 制备新的 Node，
因此这些副本最后将分布到 5 个 Node 上。

<!--
## KEP-3094: Take taints/tolerations into consideration when calculating podTopologySpread skew

Before this enhancement, when you deploy a pod with `podTopologySpread` configured, kube-scheduler would
take the Nodes that satisfy the Pod's nodeAffinity and nodeSelector into consideration
in filtering and scoring, but would not care about whether the node taints are tolerated by the incoming pod or not.
This may lead to a node with untolerated taint as the only candidate for spreading, and as a result,
the pod will stuck in Pending if it doesn't tolerate the taint.
-->
## KEP-3094：计算 podTopologySpread 偏差时考虑污点/容忍度

在本次增强之前，当你部署已经配置了 `topologySpreadConstraints` 的 Pod 时，kube-scheduler
将在过滤和评分时考虑满足 Pod 的 nodeAffinity 和 nodeSelector 的节点，
但不关心传入的 Pod 是否容忍节点污点。这可能会导致具有不可容忍污点的节点成为唯一的分布候选，
因此如果 Pod 不容忍污点，则该 Pod 将卡在 Pending 状态。

<!--
To allow more fine-gained decisions about which Nodes to account for when calculating spreading skew,
Kubernetes 1.25 introduced two new fields within `topologySpreadConstraints` to define node inclusion policies:
`nodeAffinityPolicy` and `nodeTaintPolicy`.

A manifest that applies these policies looks like the following:
-->
为了能够在计算分布偏差时针对要考虑的节点作出粒度更精细的决策，Kubernetes 1.25
在 `topologySpreadConstraints` 中引入了两个新字段 `nodeAffinityPolicy`
和 `nodeTaintPolicy` 来定义节点包含策略。

应用这些策略的清单如下所示：

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
  # 配置拓扑分布约束
  topologySpreadConstraints:
    - maxSkew: <integer>
      # ...
      nodeAffinityPolicy: [Honor|Ignore]
      nodeTaintsPolicy: [Honor|Ignore]
  # 在此处添加其他 Pod 字段
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
`nodeAffinityPolicy` 字段指示 Kubernetes 如何处理 Pod 的 `nodeAffinity` 或 `nodeSelector`
以计算 Pod 拓扑分布。如果是 `Honor`，则 kube-scheduler 在计算分布偏差时会过滤掉不匹配
`nodeAffinity`/`nodeSelector` 的节点。如果是 `Ignore`，则会包括所有节点，不会管它们是否与
Pod 的 `nodeAffinity`/`nodeSelector` 匹配。

为了向后兼容，`nodeAffinityPolicy` 默认为 `Honor`。

<!--
The `nodeTaintsPolicy` field defines how Kubernetes considers node taints for pod topology spreading.
If `Honor`, only tainted nodes for which the incoming pod has a toleration, will be included in the calculation of spreading skew.
If `Ignore`, kube-scheduler will not consider the node taints at all in the calculation of spreading skew, so a node with
pod untolerated taint will also be included.

For backwards compatibility, `nodeTaintsPolicy` defaults to `Ignore`.
-->
`nodeTaintsPolicy` 字段定义 Kubernetes 计算 Pod 拓扑分布时如何对待节点污点。
如果是 `Honor`，则只有配置了污点的节点上的传入 Pod 带有容忍标签时该节点才会被包括在分布偏差的计算中。
如果是 `Ignore`，则在计算分布偏差时 kube-scheduler 根本不会考虑节点污点，
因此带有未容忍污点的 Pod 的节点也会被包括进去。

为了向后兼容，`nodeTaintsPolicy` 默认为 `Ignore`。

<!--
The feature was introduced in v1.25 as alpha. By default, it was disabled, so if you want to use this feature in v1.25,
you had to explictly enable the feature gate `NodeInclusionPolicyInPodTopologySpread`. In the following v1.26
release, that associated feature graduated to beta and is enabled by default.
-->
该特性在 v1.25 中作为 Alpha 引入。默认被禁用，因此如果要在 v1.25 中使用此特性，
则必须显式启用特性门控 `NodeInclusionPolicyInPodTopologySpread`。
在接下来的 v1.26 版本中，相关特性进阶至 Beta 并默认被启用。

<!--
## KEP-3243: Respect Pod topology spread after rolling upgrades
-->
## KEP-3243：滚动升级后关注 Pod 拓扑分布

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
Pod 拓扑分布使用 `labelSelector` 字段来标识要计算分布的 Pod 组。
在针对 Deployment 进行拓扑分布时，通常会使用 Deployment 的
`labelSelector` 作为拓扑分布约束中的 `labelSelector`。
但这意味着 Deployment 的所有 Pod 都参与分布计算，与这些 Pod 是否属于不同的版本无关。
因此，在发布新版本时，分布将同时应用到新旧 ReplicaSet 的 Pod，
并在新的 ReplicaSet 完全发布且旧的 ReplicaSet 被下线时，我们留下的实际分布可能与预期不符，
这是因为旧 ReplicaSet 中已删除的 Pod 将导致剩余 Pod 的分布不均匀。
为了避免这个问题，过去用户需要向 Deployment 添加修订版标签，并在每次滚动升级时手动更新
（包括 Pod 模板上的标签和 `topologySpreadConstraints` 中的 `labelSelector`）。

<!--
To solve this problem with a simpler API, Kubernetes v1.25 introduced a new field named
`matchLabelKeys` to `topologySpreadConstraints`. `matchLabelKeys` is a list of pod label keys to select
the pods over which spreading will be calculated. The keys are used to lookup values from the labels of
the Pod being scheduled, those key-value labels are ANDed with `labelSelector` to select the group of
existing pods over which spreading will be calculated for the incoming pod.
-->
为了通过更简单的 API 解决这个问题，Kubernetes v1.25 引入了一个名为 `matchLabelKeys`
的新字段到 `topologySpreadConstraints` 中。`matchLabelKeys` 是一个 Pod 标签键列表，
用于选择计算分布方式的 Pod。这些键用于查找 Pod 被调度时的标签值，
这些键值标签与 `labelSelector` 进行逻辑与运算，为新增 Pod 计算分布方式选择现有 Pod 组。

<!--
With `matchLabelKeys`, you don't need to update the `pod.spec` between different revisions.
The controller or operator managing rollouts just needs to set different values to the same label key for different revisions.
The scheduler will assume the values automatically based on `matchLabelKeys`.
For example, if you are configuring a Deployment, you can use the label keyed with
[pod-template-hash](/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label),
which is added automatically by the Deployment controller, to distinguish between different
revisions in a single Deployment.
-->
借助 `matchLabelKeys`，你无需在修订版变化时更新 `pod.spec`。
控制器或 Operator 管理滚动升级时只需针对不同修订版为相同的标签键设置不同的值即可。
调度程序将基于 `matchLabelKeys` 自动完成赋值。例如，如果你正配置 Deployment，
则可以使用由 Deployment 控制器自动添加的
[pod-template-hash](/zh-cn/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label)
的标签键来区分单个 Deployment 中的不同修订版。

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
## 参与其中

这些特性归
Kubernetes [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) 管理。

请加入我们分享反馈。我们期待聆听你的声音！

<!--
## How can I learn more?

- [Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/) in the Kubernetes documentation
- [KEP-3022: min domains in Pod Topology Spread](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3022-min-domains-in-pod-topology-spread)
- [KEP-3094: Take taints/tolerations into consideration when calculating PodTopologySpread skew](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3094-pod-topology-spread-considering-taints)
- [KEP-3243: Respect PodTopologySpread after rolling upgrades](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3243-respect-pod-topology-spread-after-rolling-upgrades)
-->
## 了解更多

- Kubernetes 文档中的 [Pod 拓扑分布约束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)
- [KEP-3022：Pod 拓扑分布中的最小域数](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3022-min-domains-in-pod-topology-spread)
- [KEP-3094：计算 podTopologySpread 偏差时考虑污点/容忍度](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3094-pod-topology-spread-considering-taints)
- [KEP-3243：滚动升级后关注 Pod 拓扑分布](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/3243-respect-pod-topology-spread-after-rolling-upgrades)
