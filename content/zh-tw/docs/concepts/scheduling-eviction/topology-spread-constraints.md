---
title: Pod 拓撲分佈約束
content_type: concept
weight: 40
---
<!--
title: Pod Topology Spread Constraints
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
You can use _topology spread constraints_ to control how
{{< glossary_tooltip text="Pods" term_id="Pod" >}} are spread across your cluster
among failure-domains such as regions, zones, nodes, and other user-defined topology
domains. This can help to achieve high availability as well as efficient resource
utilization.

You can set [cluster-level constraints](#cluster-level-default-constraints) as a default,
or configure topology spread constraints for individual workloads.
-->
你可以使用 **拓撲分佈約束（Topology Spread Constraints）** 來控制
{{< glossary_tooltip text="Pod" term_id="Pod" >}} 在集羣內故障域之間的分佈，
例如區域（Region）、可用區（Zone）、節點和其他用戶自定義拓撲域。
這樣做有助於實現高可用並提升資源利用率。

你可以將[集羣級約束](#cluster-level-default-constraints)設爲默認值，
或爲個別工作負載配置拓撲分佈約束。

<!-- body -->

<!--
## Motivation

Imagine that you have a cluster of up to twenty nodes, and you want to run a
{{< glossary_tooltip text="workload" term_id="workload" >}}
that automatically scales how many replicas it uses. There could be as few as
two Pods or as many as fifteen.
When there are only two Pods, you'd prefer not to have both of those Pods run on the
same node: you would run the risk that a single node failure takes your workload
offline.

In addition to this basic usage, there are some advanced usage examples that
enable your workloads to benefit on high availability and cluster utilization.
-->
## 動機 {#motivation}

假設你有一個最多包含二十個節點的集羣，你想要運行一個自動擴縮的
{{< glossary_tooltip text="工作負載" term_id="workload" >}}，請問要使用多少個副本？
答案可能是最少 2 個 Pod，最多 15 個 Pod。
當只有 2 個 Pod 時，你傾向於這 2 個 Pod 不要同時在同一個節點上運行：
你所遭遇的風險是如果放在同一個節點上且單節點出現故障，可能會讓你的工作負載下線。

除了這個基本的用法之外，還有一些高級的使用案例，能夠讓你的工作負載受益於高可用性並提高集羣利用率。

<!--
As you scale up and run more Pods, a different concern becomes important. Imagine
that you have three nodes running five Pods each. The nodes have enough capacity
to run that many replicas; however, the clients that interact with this workload
are split across three different datacenters (or infrastructure zones). Now you
have less concern about a single node failure, but you notice that latency is
higher than you'd like, and you are paying for network costs associated with
sending network traffic between the different zones.
-->
隨着你的工作負載擴容，運行的 Pod 變多，將需要考慮另一個重要問題。
假設你有 3 個節點，每個節點運行 5 個 Pod。這些節點有足夠的容量能夠運行許多副本；
但與這個工作負載互動的客戶端分散在三個不同的數據中心（或基礎設施可用區）。
現在你可能不太關注單節點故障問題，但你會注意到延遲高於自己的預期，
在不同的可用區之間發送網絡流量會產生一些網絡成本。

<!--
You decide that under normal operation you'd prefer to have a similar number of replicas
[scheduled](/docs/concepts/scheduling-eviction/) into each infrastructure zone,
and you'd like the cluster to self-heal in the case that there is a problem.

Pod topology spread constraints offer you a declarative way to configure that.
-->
你決定在正常運營時傾向於將類似數量的副本[調度](/zh-cn/docs/concepts/scheduling-eviction/)
到每個基礎設施可用區，且你想要該集羣在遇到問題時能夠自愈。

Pod 拓撲分佈約束使你能夠以聲明的方式進行配置。

<!--
## `topologySpreadConstraints` field

The Pod API includes a field, `spec.topologySpreadConstraints`. The usage of this field looks like
the following:
-->
## `topologySpreadConstraints` 字段   {#topologyspreadconstraints-field}

Pod API 包括一個 `spec.topologySpreadConstraints` 字段。這個字段的用法如下所示：

<!--
```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # Configure a topology spread constraint
  topologySpreadConstraints:
    - maxSkew: <integer>
      minDomains: <integer> # optional
      topologyKey: <string>
      whenUnsatisfiable: <string>
      labelSelector: <object>
      matchLabelKeys: <list> # optional; beta since v1.27
      nodeAffinityPolicy: [Honor|Ignore] # optional; beta since v1.26
      nodeTaintsPolicy: [Honor|Ignore] # optional; beta since v1.26
  ### other Pod fields go here
```
-->
```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # 配置一個拓撲分佈約束
  topologySpreadConstraints:
    - maxSkew: <integer>
      minDomains: <integer> # 可選
      topologyKey: <string>
      whenUnsatisfiable: <string>
      labelSelector: <object>
      matchLabelKeys: <list> # 可選；從 v1.27 開始成爲 Beta
      nodeAffinityPolicy: [Honor|Ignore] # 可選；從 v1.26 開始成爲 Beta
      nodeTaintsPolicy: [Honor|Ignore] # 可選；從 v1.26 開始成爲 Beta
  ### 其他 Pod 字段置於此處
```

{{< note >}}
<!--
There can only be one `topologySpreadConstraint` for a given `topologyKey` and `whenUnsatisfiable` value. For example, if you have defined a `topologySpreadConstraint` that uses the `topologyKey` "kubernetes.io/hostname" and `whenUnsatisfiable` value "DoNotSchedule", you can only add another `topologySpreadConstraint` for the `topologyKey` "kubernetes.io/hostname" if you use a different `whenUnsatisfiable` value.
-->
對於特定的 `topologyKey` 和 `whenUnsatisfiable` 值，只能有一個 `topologySpreadConstraint`。
例如，如果你已經定義了一個 `topologySpreadConstraint`，其 `topologyKey`
爲 "kubernetes.io/hostname"，`whenUnsatisfiable` 值爲 "DoNotSchedule"，
那麼你在添加另一個 `topologyKey` 爲 "kubernetes.io/hostname" 的 `topologySpreadConstraint`
時，`whenUnsatisfiable` 需要使用不同的值。
{{< /note >}}

<!--
You can read more about this field by running `kubectl explain Pod.spec.topologySpreadConstraints` or
refer to [scheduling](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling) section of the API reference for Pod.
-->
你可以運行 `kubectl explain Pod.spec.topologySpreadConstraints` 或參閱 Pod API
參考的[調度](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling)一節，
瞭解有關此字段的更多信息。

<!--
### Spread constraint definition

You can define one or multiple `topologySpreadConstraints` entries to instruct the
kube-scheduler how to place each incoming Pod in relation to the existing Pods across
your cluster. Those fields are:
-->
### 分佈約束定義   {#spread-constraint-definition}

你可以定義一個或多個 `topologySpreadConstraints` 條目以指導 kube-scheduler
如何將每個新來的 Pod 與跨集羣的現有 Pod 相關聯。這些字段包括：

<!--
- **maxSkew** describes the degree to which Pods may be unevenly distributed. You must
  specify this field and the number must be greater than zero. Its semantics differ
  according to the value of `whenUnsatisfiable`:

  - if you select `whenUnsatisfiable: DoNotSchedule`, then `maxSkew` defines the
    maximum permitted difference between the number of matching pods in the target
    topology and the _global minimum_
    (the minimum number of matching pods in an eligible domain or zero if the number of eligible domains is less than MinDomains).
    For example, if you have 3 zones with 2, 2 and 1 matching pods respectively,
    `MaxSkew` is set to 1 then the global minimum is 1.
  - if you select `whenUnsatisfiable: ScheduleAnyway`, the scheduler gives higher
    precedence to topologies that would help reduce the skew.
-->
- **maxSkew** 描述這些 Pod 可能被不均勻分佈的程度。你必須指定此字段且該數值必須大於零。
  其語義將隨着 `whenUnsatisfiable` 的值發生變化：

  - 如果你選擇 `whenUnsatisfiable: DoNotSchedule`，則 `maxSkew` 定義目標拓撲中匹配 Pod
    的數量與**全局最小值**（符合條件的域中匹配的最小 Pod 數量，如果符合條件的域數量小於 MinDomains 則爲零）
    之間的最大允許差值。例如，如果你有 3 個可用區，分別有 2、2 和 1 個匹配的 Pod，則 `MaxSkew` 設爲 1，
    且全局最小值爲 1。
  - 如果你選擇 `whenUnsatisfiable: ScheduleAnyway`，則該調度器會更爲偏向能夠降低偏差值的拓撲域。

<!--
- **minDomains** indicates a minimum number of eligible domains. This field is optional.
  A domain is a particular instance of a topology. An eligible domain is a domain whose
  nodes match the node selector.
-->
- **minDomains** 表示符合條件的域的最小數量。此字段是可選的。域是拓撲的一個特定實例。
  符合條件的域是其節點與節點選擇器匹配的域。

  {{< note >}}
  <!--
  Before Kubernetes v1.30, the `minDomains` field was only available if the
  `MinDomainsInPodTopologySpread` [feature gate](/docs/reference/command-line-tools-reference/feature-gates-removed/)
  was enabled (default since v1.28). In older Kubernetes clusters it might be explicitly
  disabled or the field might not be available.
  -->
  在 Kubernetes v1.30 之前，`minDomains` 字段只有在啓用 `MinDomainsInPodTopologySpread`
  [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates-removed/)時纔可用
 （自 v1.28 起默認啓用）。
  在早期的 Kubernetes 集羣中，此特性門控可能被顯式禁用或此字段可能不可用。
  {{< /note >}}

  <!--
  - The value of `minDomains` must be greater than 0, when specified.
    You can only specify `minDomains` in conjunction with `whenUnsatisfiable: DoNotSchedule`.
  - When the number of eligible domains with match topology keys is less than `minDomains`,
    Pod topology spread treats global minimum as 0, and then the calculation of `skew` is performed.
    The global minimum is the minimum number of matching Pods in an eligible domain,
    or zero if the number of eligible domains is less than `minDomains`.
  - When the number of eligible domains with matching topology keys equals or is greater than
    `minDomains`, this value has no effect on scheduling.
  - If you do not specify `minDomains`, the constraint behaves as if `minDomains` is 1.
  -->

  - 指定的 `minDomains` 值必須大於 0。你可以結合 `whenUnsatisfiable: DoNotSchedule` 僅指定 `minDomains`。
  - 當符合條件的、拓撲鍵匹配的域的數量小於 `minDomains` 時，拓撲分佈將“全局最小值”（global minimum）設爲 0，
    然後進行 `skew` 計算。“全局最小值”是一個符合條件的域中匹配 Pod 的最小數量，
    如果符合條件的域的數量小於 `minDomains`，則全局最小值爲零。
  - 當符合條件的拓撲鍵匹配域的個數等於或大於 `minDomains` 時，該值對調度沒有影響。
  - 如果你未指定 `minDomains`，則約束行爲類似於 `minDomains` 等於 1。

<!--
- **topologyKey** is the key of [node labels](#node-labels). Nodes that have a label with this key
	and identical values are considered to be in the same topology.
  We call each instance of a topology (in other words, a <key, value> pair) a domain. The scheduler
  will try to put a balanced number of pods into each domain.
	Also, we define an eligible domain as a domain whose nodes meet the requirements of
	nodeAffinityPolicy and nodeTaintsPolicy.
-->
- **topologyKey** 是[節點標籤](#node-labels)的鍵。如果節點使用此鍵標記並且具有相同的標籤值，
  則將這些節點視爲處於同一拓撲域中。我們將拓撲域中（即鍵值對）的每個實例稱爲一個域。
  調度器將嘗試在每個拓撲域中放置數量均衡的 Pod。
  另外，我們將符合條件的域定義爲其節點滿足 nodeAffinityPolicy 和 nodeTaintsPolicy 要求的域。

<!--
- **whenUnsatisfiable** indicates how to deal with a Pod if it doesn't satisfy the spread constraint:
  - `DoNotSchedule` (default) tells the scheduler not to schedule it.
  - `ScheduleAnyway` tells the scheduler to still schedule it while prioritizing nodes that minimize the skew.

- **labelSelector** is used to find matching Pods. Pods
  that match this label selector are counted to determine the
  number of Pods in their corresponding topology domain.
  See [Label Selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
  for more details.
-->
- **whenUnsatisfiable** 指示如果 Pod 不滿足分佈約束時如何處理：
  - `DoNotSchedule`（默認）告訴調度器不要調度。
  - `ScheduleAnyway` 告訴調度器仍然繼續調度，只是根據如何能將偏差最小化來對節點進行排序。

- **labelSelector** 用於查找匹配的 Pod。匹配此標籤的 Pod 將被統計，以確定相應拓撲域中 Pod 的數量。
  有關詳細信息，請參考[標籤選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)。

<!--
- **matchLabelKeys** is a list of pod label keys to select the group of pods over which 
  the spreading skew will be calculated. At a pod creation, 
  the kube-apiserver uses those keys to lookup values from the incoming pod labels,
  and those key-value labels will be merged with any existing `labelSelector`.
  The same key is forbidden to exist in both `matchLabelKeys` and `labelSelector`. 
  `matchLabelKeys` cannot be set when `labelSelector` isn't set. 
  Keys that don't exist in the pod labels will be ignored. 
  A null or empty list means only match against the `labelSelector`.
-->
- - **matchLabelKeys** 是一個 Pod 標籤鍵的列表，用於選擇計算分佈偏差的 Pod 組。在創建 Pod 時，
  kube-apiserver 使用這些鍵從傳入的 Pod 標籤中查找值，並將這些鍵值標籤與現有的 `labelSelector` 合併。
  相同的鍵不允許同時出現在 `matchLabelKeys` 和 `labelSelector` 中。
  當 `labelSelector` 未設置時，不能設置 `matchLabelKeys`。
  如果鍵在 Pod 標籤中不存在，則會被忽略。
  一個空或 `null` 的列表意味着僅與 `labelSelector` 匹配。

  {{< caution >}}
  <!--
  It's not recommended to use `matchLabelKeys` with labels that might be updated directly on pods.
  Even if you edit the pod's label that is specified at `matchLabelKeys` **directly**,
  (that is, you edit the Pod and not a Deployment),
  kube-apiserver doesn't reflect the label update onto the merged `labelSelector`.
  -->
  不建議將 `matchLabelKeys` 與可能直接在 Pod 上更新的標籤一起使用。
  即使你**直接**編輯了位於 `matchLabelKeys` 中指定的 Pod 標籤，
  （也就是說，你編輯的是 Pod 而不是 Deployment），
  kube-apiserver 不會將標籤更新反映到合併的 `labelSelector` 上。
  {{< /caution >}}


<!--
  With `matchLabelKeys`, you don't need to update the `pod.spec` between different revisions.
  The controller/operator just needs to set different values to the same label key for different
  revisions. For example, if you are configuring a Deployment, you can use the label keyed with
  [pod-template-hash](/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label), which
  is added automatically by the Deployment controller, to distinguish between different revisions
  in a single Deployment.
-->
  藉助 `matchLabelKeys`，你無需在變更 Pod 修訂版本時更新 `pod.spec`。
  控制器或 Operator 只需要將不同修訂版的標籤鍵設爲不同的值。
  例如，如果你正在配置一個 Deployment，則可以使用由 Deployment
  控制器自動添加的、以
  [pod-template-hash](/zh-cn/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label)
  爲鍵的標籤來區分同一個 Deployment 的不同修訂版。

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

  {{< note >}}
  <!--
  The `matchLabelKeys` field is a beta-level field and enabled by default in 1.27. You can disable it by disabling the
  `MatchLabelKeysInPodTopologySpread` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
  -->
  `matchLabelKeys` 字段是 1.27 中默認啓用的一個 Beta 級別字段。
  你可以通過禁用 `MatchLabelKeysInPodTopologySpread`
  [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)來禁用此字段。

  <!--
  Before v1.34, `matchLabelKeys` was handled implicitly.
  Since v1.34, key-value labels corresponding to `matchLabelKeys` are explicitly merged into `labelSelector`.
  You can disable it and revert to the previous behavior by disabling the `MatchLabelKeysInPodTopologySpreadSelectorMerge` 
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) of kube-apiserver.
  -->
  在 v1.34 之前，`matchLabelKeys` 是隱式處理的。
  從 v1.34 開始，與 `matchLabelKeys` 對應的鍵值標籤會被明確地合併到 `labelSelector` 中。
  你可以通過禁用 kube-apiserver 的 `MatchLabelKeysInPodTopologySpreadSelectorMerge`
  [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)來禁用此行爲並恢復到之前的行爲。
  {{< /note >}}

<!--
- **nodeAffinityPolicy** indicates how we will treat Pod's nodeAffinity/nodeSelector
  when calculating pod topology spread skew. Options are:
  - Honor: only nodes matching nodeAffinity/nodeSelector are included in the calculations.
  - Ignore: nodeAffinity/nodeSelector are ignored. All nodes are included in the calculations.

  If this value is null, the behavior is equivalent to the Honor policy.
-->
- **nodeAffinityPolicy** 表示我們在計算 Pod 拓撲分佈偏差時將如何處理 Pod 的 nodeAffinity/nodeSelector。
  選項爲：
  - Honor：只有與 nodeAffinity/nodeSelector 匹配的節點纔會包括到計算中。
  - Ignore：nodeAffinity/nodeSelector 被忽略。所有節點均包括到計算中。

  如果此值爲 nil，此行爲等同於 Honor 策略。

  {{< note >}}
  <!--
  The `nodeAffinityPolicy` became beta in 1.26 and graduated to GA in 1.33.
  It's enabled by default in beta, you can disable it by disabling the
  `NodeInclusionPolicyInPodTopologySpread` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
  -->
  `nodeAffinityPolicy` 在 1.26 版本中進入 Beta 階段，並在 1.33 版本中升級爲 GA（正式可用）。
  該功能在 Beta 階段默認啓用，你可以通過禁用 `NodeInclusionPolicyInPodTopologySpread`
  [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)來禁用此字段。
  {{< /note >}}

<!--
- **nodeTaintsPolicy** indicates how we will treat node taints when calculating
  pod topology spread skew. Options are:
  - Honor: nodes without taints, along with tainted nodes for which the incoming pod
    has a toleration, are included.
  - Ignore: node taints are ignored. All nodes are included.

  If this value is null, the behavior is equivalent to the Ignore policy.
-->
- **nodeTaintsPolicy** 表示我們在計算 Pod 拓撲分佈偏差時將如何處理節點污點。選項爲：
  - Honor：包括不帶污點的節點以及污點被新 Pod 所容忍的節點。
  - Ignore：節點污點被忽略。包括所有節點。

  如果此值爲 null，此行爲等同於 Ignore 策略。

  {{< note >}}
  <!--
  The `nodeTaintsPolicy` became beta in 1.26 and graduated to GA in 1.33.
  It's enabled by default in beta, you can disable it by disabling the
  `NodeInclusionPolicyInPodTopologySpread` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
  -->
  `nodeTaintsPolicy` 在 1.26 版本中進入 Beta 階段，並在 1.33 版本中升級爲 GA（正式可用）。
  該功能在 Beta 階段默認啓用，你可以通過禁用 `NodeInclusionPolicyInPodTopologySpread`
  [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)來禁用此字段。
  {{< /note >}}

<!--
When a Pod defines more than one `topologySpreadConstraint`, those constraints are
combined using a logical AND operation: the kube-scheduler looks for a node for the incoming Pod
that satisfies all the configured constraints.
-->
當 Pod 定義了不止一個 `topologySpreadConstraint`，這些約束之間是邏輯與的關係。
kube-scheduler 會爲新的 Pod 尋找一個能夠滿足所有約束的節點。

<!--
### Node labels

Topology spread constraints rely on node labels to identify the topology
domain(s) that each {{< glossary_tooltip text="node" term_id="node" >}} is in.
For example, a node might have labels:
-->
### 節點標籤 {#node-labels}

拓撲分佈約束依賴於節點標籤來標識每個{{< glossary_tooltip text="節點" term_id="node" >}}所在的拓撲域。
例如，某節點可能具有標籤：

```yaml
  region: us-east-1
  zone: us-east-1a
```

{{< note >}}
<!--
For brevity, this example doesn't use the
[well-known](/docs/reference/labels-annotations-taints/) label keys
`topology.kubernetes.io/zone` and `topology.kubernetes.io/region`. However,
those registered label keys are nonetheless recommended rather than the private
(unqualified) label keys `region` and `zone` that are used here.

You can't make a reliable assumption about the meaning of a private label key
between different contexts.
-->
爲了簡便，此示例未使用[衆所周知](/zh-cn/docs/reference/labels-annotations-taints/)的標籤鍵
`topology.kubernetes.io/zone` 和 `topology.kubernetes.io/region`。
但是，建議使用那些已註冊的標籤鍵，而不是此處使用的私有（不合格）標籤鍵 `region` 和 `zone`。

你無法對不同上下文之間的私有標籤鍵的含義做出可靠的假設。
{{< /note >}}

<!--
Suppose you have a 4-node cluster with the following labels:
-->
假設你有一個 4 節點的集羣且帶有以下標籤：

```
NAME    STATUS   ROLES    AGE     VERSION   LABELS
node1   Ready    <none>   4m26s   v1.16.0   node=node1,zone=zoneA
node2   Ready    <none>   3m58s   v1.16.0   node=node2,zone=zoneA
node3   Ready    <none>   3m17s   v1.16.0   node=node3,zone=zoneB
node4   Ready    <none>   2m43s   v1.16.0   node=node4,zone=zoneB
```

<!--
Then the cluster is logically viewed as below:
-->
那麼，從邏輯上看集羣如下：

{{<mermaid>}}
graph TB
    subgraph "zoneB"
        n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        n1(Node1)
        n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

<!--
## Consistency

You should set the same Pod topology spread constraints on all pods in a group.

Usually, if you are using a workload controller such as a Deployment, the pod template
takes care of this for you. If you mix different spread constraints then Kubernetes
follows the API definition of the field; however, the behavior is more likely to become
confusing and troubleshooting is less straightforward.
-->
## 一致性 {#Consistency}

你應該爲一個組中的所有 Pod 設置相同的 Pod 拓撲分佈約束。

通常，如果你正使用一個工作負載控制器，例如 Deployment，則 Pod 模板會幫你解決這個問題。
如果你混合不同的分佈約束，則 Kubernetes 會遵循該字段的 API 定義；
但是，該行爲可能更令人困惑，並且故障排除也沒那麼簡單。

<!--
You need a mechanism to ensure that all the nodes in a topology domain (such as a
cloud provider region) are labelled consistently.
To avoid you needing to manually label nodes, most clusters automatically
populate well-known labels such as `kubernetes.io/hostname`. Check whether
your cluster supports this.
-->
你需要一種機制來確保拓撲域（例如雲提供商區域）中的所有節點具有一致的標籤。
爲了避免你需要手動爲節點打標籤，大多數集羣會自動填充知名的標籤，
例如 `kubernetes.io/hostname`。檢查你的集羣是否支持此功能。

<!--
## Topology spread constraint examples

### Example: one topology spread constraint {#example-one-topologyspreadconstraint}

Suppose you have a 4-node cluster where 3 Pods labelled `foo: bar` are located in
node1, node2 and node3 respectively:
-->
## 拓撲分佈約束示例 {#topology-spread-constraint-examples}

### 示例：一個拓撲分佈約束 {#example-one-topologyspreadconstraint}

假設你擁有一個 4 節點集羣，其中標記爲 `foo: bar` 的 3 個 Pod 分別位於 node1、node2 和 node3 中：

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

<!--
If you want an incoming Pod to be evenly spread with existing Pods across zones, you
can use a manifest similar to:
-->
如果你希望新來的 Pod 均勻分佈在現有的可用區域，則可以按如下設置其清單：

{{% code_sample file="pods/topology-spread-constraints/one-constraint.yaml" %}}

<!--
From that manifest, `topologyKey: zone` implies the even distribution will only be applied
to nodes that are labeled `zone: <any value>` (nodes that don't have a `zone` label
are skipped). The field `whenUnsatisfiable: DoNotSchedule` tells the scheduler to let the
incoming Pod stay pending if the scheduler can't find a way to satisfy the constraint.

If the scheduler placed this incoming Pod into zone `A`, the distribution of Pods would
become `[3, 1]`. That means the actual skew is then 2 (calculated as `3 - 1`), which
violates `maxSkew: 1`. To satisfy the constraints and context for this example, the
incoming Pod can only be placed onto a node in zone `B`:
-->
從此清單看，`topologyKey: zone` 意味着均勻分佈將只應用於存在標籤鍵值對爲 `zone: <any value>` 的節點
（沒有 `zone` 標籤的節點將被跳過）。如果調度器找不到一種方式來滿足此約束，
則 `whenUnsatisfiable: DoNotSchedule` 字段告訴該調度器將新來的 Pod 保持在 pending 狀態。

如果該調度器將這個新來的 Pod 放到可用區 `A`，則 Pod 的分佈將成爲 `[3, 1]`。
這意味着實際偏差是 2（計算公式爲 `3 - 1`），這違反了 `maxSkew: 1` 的約定。
爲了滿足這個示例的約束和上下文，新來的 Pod 只能放到可用區 `B` 中的一個節點上：

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

或者

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n3
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

<!--
You can tweak the Pod spec to meet various kinds of requirements:

- Change `maxSkew` to a bigger value - such as `2` -  so that the incoming Pod can
  be placed into zone `A` as well.
- Change `topologyKey` to `node` so as to distribute the Pods evenly across nodes
  instead of zones. In the above example, if `maxSkew` remains `1`, the incoming
  Pod can only be placed onto the node `node4`.
- Change `whenUnsatisfiable: DoNotSchedule` to `whenUnsatisfiable: ScheduleAnyway`
  to ensure the incoming Pod to be always schedulable (suppose other scheduling APIs
  are satisfied). However, it's preferred to be placed into the topology domain which
  has fewer matching Pods. (Be aware that this preference is jointly normalized
  with other internal scheduling priorities such as resource usage ratio).
-->
你可以調整 Pod 規約以滿足各種要求：

- 將 `maxSkew` 更改爲更大的值，例如 `2`，這樣新來的 Pod 也可以放在可用區 `A` 中。
- 將 `topologyKey` 更改爲 `node`，以便將 Pod 均勻分佈在節點上而不是可用區中。
  在上面的例子中，如果 `maxSkew` 保持爲 `1`，則新來的 Pod 只能放到 `node4` 節點上。
- 將 `whenUnsatisfiable: DoNotSchedule` 更改爲 `whenUnsatisfiable: ScheduleAnyway`，
  以確保新來的 Pod 始終可以被調度（假設滿足其他的調度 API）。但是，最好將其放置在匹配 Pod 數量較少的拓撲域中。
  請注意，這一優先判定會與其他內部調度優先級（如資源使用率等）排序準則一起進行標準化。

<!--
### Example: multiple topology spread constraints {#example-multiple-topologyspreadconstraints}

This builds upon the previous example. Suppose you have a 4-node cluster where 3
existing Pods labeled `foo: bar` are located on node1, node2 and node3 respectively:
-->
### 示例：多個拓撲分佈約束 {#example-multiple-topologyspreadconstraints}

下面的例子建立在前面例子的基礎上。假設你擁有一個 4 節點集羣，
其中 3 個標記爲 `foo: bar` 的 Pod 分別位於 node1、node2 和 node3 上：

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

<!--
You can combine two topology spread constraints to control the spread of Pods both
by node and by zone:
-->
可以組合使用 2 個拓撲分佈約束來控制 Pod 在節點和可用區兩個維度上的分佈：

{{% code_sample file="pods/topology-spread-constraints/two-constraints.yaml" %}}

<!--
In this case, to match the first constraint, the incoming Pod can only be placed onto
nodes in zone `B`; while in terms of the second constraint, the incoming Pod can only be
scheduled to the node `node4`. The scheduler only considers options that satisfy all
defined constraints, so the only valid placement is onto node `node4`.
-->
在這種情況下，爲了匹配第一個約束，新的 Pod 只能放置在可用區 `B` 中；
而在第二個約束中，新來的 Pod 只能調度到節點 `node4` 上。
該調度器僅考慮滿足所有已定義約束的選項，因此唯一可行的選擇是放置在節點 `node4` 上。

<!--
### Example: conflicting topology spread constraints {#example-conflicting-topologyspreadconstraints}

Multiple constraints can lead to conflicts. Suppose you have a 3-node cluster across 2 zones:
-->
### 示例：有衝突的拓撲分佈約束 {#example-conflicting-topologyspreadconstraints}

多個約束可能導致衝突。假設有一個跨 2 個可用區的 3 節點集羣：

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p4(Pod) --> n3(Node3)
        p5(Pod) --> n3
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n1
        p3(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3,p4,p5 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

<!--
If you were to apply
[`two-constraints.yaml`](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/topology-spread-constraints/two-constraints.yaml)
(the manifest from the previous example)
to **this** cluster, you would see that the Pod `mypod` stays in the `Pending` state.
This happens because: to satisfy the first constraint, the Pod `mypod` can only
be placed into zone `B`; while in terms of the second constraint, the Pod `mypod`
can only schedule to node `node2`. The intersection of the two constraints returns
an empty set, and the scheduler cannot place the Pod.

To overcome this situation, you can either increase the value of `maxSkew` or modify
one of the constraints to use `whenUnsatisfiable: ScheduleAnyway`. Depending on
circumstances, you might also decide to delete an existing Pod manually - for example,
if you are troubleshooting why a bug-fix rollout is not making progress.
-->
如果你將 [`two-constraints.yaml`](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/topology-spread-constraints/two-constraints.yaml)
（來自上一個示例的清單）應用到**這個**集羣，你將看到 Pod `mypod` 保持在 `Pending` 狀態。
出現這種情況的原因爲：爲了滿足第一個約束，Pod `mypod` 只能放置在可用區 `B` 中；
而在第二個約束中，Pod `mypod` 只能調度到節點 `node2` 上。
兩個約束的交集將返回一個空集，且調度器無法放置該 Pod。

爲了應對這種情形，你可以提高 `maxSkew` 的值或修改其中一個約束才能使用 `whenUnsatisfiable: ScheduleAnyway`。
根據實際情形，例如若你在故障排查時發現某個漏洞修復工作毫無進展，你還可能決定手動刪除一個現有的 Pod。

<!--
#### Interaction with node affinity and node selectors

The scheduler will skip the non-matching nodes from the skew calculations if the
incoming Pod has `spec.nodeSelector` or `spec.affinity.nodeAffinity` defined.
-->
#### 與節點親和性和節點選擇算符的相互作用 {#interaction-with-node-affinity-and-node-selectors}

如果 Pod 定義了 `spec.nodeSelector` 或 `spec.affinity.nodeAffinity`，
調度器將在偏差計算中跳過不匹配的節點。

<!--
### Example: topology spread constraints with node affinity {#example-topologyspreadconstraints-with-nodeaffinity}

Suppose you have a 5-node cluster ranging across zones A to C:
-->
### 示例：帶節點親和性的拓撲分佈約束 {#example-topologyspreadconstraints-with-nodeaffinity}

假設你有一個跨可用區 A 到 C 的 5 節點集羣：

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n1,n2,n3,n4,p1,p2,p3 k8s;
class p4 plain;
class zoneA,zoneB cluster;
{{< /mermaid >}}

{{<mermaid>}}
graph BT
    subgraph "zoneC"
        n5(Node5)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n5 k8s;
class zoneC cluster;
{{< /mermaid >}}

<!--
and you know that zone `C` must be excluded. In this case, you can compose a manifest
as below, so that Pod `mypod` will be placed into zone `B` instead of zone `C`.
Similarly, Kubernetes also respects `spec.nodeSelector`.
-->
而且你知道可用區 `C` 必須被排除在外。在這種情況下，可以按如下方式編寫清單，
以便將 Pod `mypod` 放置在可用區 `B` 上，而不是可用區 `C` 上。
同樣，Kubernetes 也會一樣處理 `spec.nodeSelector`。

{{% code_sample file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" %}}

<!--
## Implicit conventions

There are some implicit conventions worth noting here:

- Only the Pods holding the same namespace as the incoming Pod can be matching candidates.

- The scheduler only considers nodes that have all `topologySpreadConstraints[*].topologyKey` present at the same time.
  Nodes missing any of these `topologyKeys` are bypassed. This implies that:

  1. any Pods located on those bypassed nodes do not impact `maxSkew` calculation - in the
     above [example](#example-conflicting-topologyspreadconstraints), suppose the node `node1`
     does not have a label "zone", then the 2 Pods will
     be disregarded, hence the incoming Pod will be scheduled into zone `A`.
  2. the incoming Pod has no chances to be scheduled onto this kind of nodes -
     in the above example, suppose a node `node5` has the **mistyped** label `zone-typo: zoneC`
     (and no `zone` label set). After node `node5` joins the cluster, it will be bypassed and
     Pods for this workload aren't scheduled there.
-->
## 隱式約定 {#implicit-conventions}

這裏有一些值得注意的隱式約定：

- 只有與新來的 Pod 具有相同命名空間的 Pod 才能作爲匹配候選者。

- 調度器只會考慮同時具有全部 `topologySpreadConstraints[*].topologyKey` 的節點。
  缺少任一 `topologyKey` 的節點將被忽略。這意味着：

  1. 位於這些節點上的 Pod 不影響 `maxSkew` 計算，在上面的[例子](#example-conflicting-topologyspreadconstraints)中，
     假設節點 `node1` 沒有標籤 "zone"，則 2 個 Pod 將被忽略，因此新來的
     Pod 將被調度到可用區 `A` 中。
  2. 新的 Pod 沒有機會被調度到這類節點上。在上面的例子中，
     假設節點 `node5` 帶有**拼寫錯誤的**標籤 `zone-typo: zoneC`（且沒有設置 `zone` 標籤）。
     節點 `node5` 接入集羣之後，該節點將被忽略且針對該工作負載的 Pod 不會被調度到那裏。

<!--
- Be aware of what will happen if the incoming Pod's
  `topologySpreadConstraints[*].labelSelector` doesn't match its own labels. In the
  above example, if you remove the incoming Pod's labels, it can still be placed onto
  nodes in zone `B`, since the constraints are still satisfied. However, after that
  placement, the degree of imbalance of the cluster remains unchanged - it's still zone `A`
  having 2 Pods labeled as `foo: bar`, and zone `B` having 1 Pod labeled as
  `foo: bar`. If this is not what you expect, update the workload's
  `topologySpreadConstraints[*].labelSelector` to match the labels in the pod template.
-->
- 注意，如果新 Pod 的 `topologySpreadConstraints[*].labelSelector` 與自身的標籤不匹配，將會發生什麼。
  在上面的例子中，如果移除新 Pod 的標籤，則 Pod 仍然可以放置到可用區 `B` 中的節點上，因爲這些約束仍然滿足。
  然而，在放置之後，集羣的不平衡程度保持不變。可用區 `A` 仍然有 2 個 Pod 帶有標籤 `foo: bar`，
  而可用區 `B` 有 1 個 Pod 帶有標籤 `foo: bar`。如果這不是你所期望的，
  更新工作負載的 `topologySpreadConstraints[*].labelSelector` 以匹配 Pod 模板中的標籤。

<!--
## Cluster-level default constraints

It is possible to set default topology spread constraints for a cluster. Default
topology spread constraints are applied to a Pod if, and only if:

- It doesn't define any constraints in its `.spec.topologySpreadConstraints`.
- It belongs to a Service, ReplicaSet, StatefulSet or ReplicationController.

Default constraints can be set as part of the `PodTopologySpread` plugin
arguments in a [scheduling profile](/docs/reference/scheduling/config/#profiles).
The constraints are specified with the same [API above](#topologyspreadconstraints-field), except that
`labelSelector` must be empty. The selectors are calculated from the Services,
ReplicaSets, StatefulSets or ReplicationControllers that the Pod belongs to.

An example configuration might look like follows:
-->
## 集羣級別的默認約束 {#cluster-level-default-constraints}

爲集羣設置默認的拓撲分佈約束也是可能的。默認拓撲分佈約束在且僅在以下條件滿足時纔會被應用到 Pod 上：

- Pod 沒有在其 `.spec.topologySpreadConstraints` 中定義任何約束。
- Pod 隸屬於某個 Service、ReplicaSet、StatefulSet 或 ReplicationController。

默認約束可以設置爲[調度方案](/zh-cn/docs/reference/scheduling/config/#profiles)中
`PodTopologySpread` 插件參數的一部分。約束的設置採用[如前所述的 API](#topologyspreadconstraints-field)，
只是 `labelSelector` 必須爲空。
選擇算符是根據 Pod 所屬的 Service、ReplicaSet、StatefulSet 或 ReplicationController 來設置的。

配置的示例可能看起來像下面這個樣子：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints:
            - maxSkew: 1
              topologyKey: topology.kubernetes.io/zone
              whenUnsatisfiable: ScheduleAnyway
          defaultingType: List
```

<!--
### Built-in default constraints {#internal-default-constraints}
-->
### 內置默認約束 {#internal-default-constraints}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
If you don't configure any cluster-level default constraints for pod topology spreading,
then kube-scheduler acts as if you specified the following default topology constraints:
-->
如果你沒有爲 Pod 拓撲分佈配置任何集羣級別的默認約束，
kube-scheduler 的行爲就像你指定了以下默認拓撲約束一樣：

```yaml
defaultConstraints:
  - maxSkew: 3
    topologyKey: "kubernetes.io/hostname"
    whenUnsatisfiable: ScheduleAnyway
  - maxSkew: 5
    topologyKey: "topology.kubernetes.io/zone"
    whenUnsatisfiable: ScheduleAnyway
```

<!--
Also, the legacy `SelectorSpread` plugin, which provides an equivalent behavior,
is disabled by default.
-->
此外，原來用於提供等同行爲的 `SelectorSpread` 插件默認被禁用。

{{< note >}}
<!--
The `PodTopologySpread` plugin does not score the nodes that don't have
the topology keys specified in the spreading constraints. This might result
in a different default behavior compared to the legacy `SelectorSpread` plugin when
using the default topology constraints.

If your nodes are not expected to have **both** `kubernetes.io/hostname` and
`topology.kubernetes.io/zone` labels set, define your own constraints
instead of using the Kubernetes defaults.
-->
對於分佈約束中所指定的拓撲鍵而言，`PodTopologySpread` 插件不會爲不包含這些拓撲鍵的節點評分。
這可能導致在使用默認拓撲約束時，其行爲與原來的 `SelectorSpread` 插件的默認行爲不同。

如果你的節點不會**同時**設置 `kubernetes.io/hostname` 和 `topology.kubernetes.io/zone` 標籤，
你應該定義自己的約束而不是使用 Kubernetes 的默認約束。
{{< /note >}}

<!--
If you don't want to use the default Pod spreading constraints for your cluster,
you can disable those defaults by setting `defaultingType` to `List` and leaving
empty `defaultConstraints` in the `PodTopologySpread` plugin configuration:
-->
如果你不想爲集羣使用默認的 Pod 分佈約束，你可以通過設置 `defaultingType` 參數爲 `List`，
並將 `PodTopologySpread` 插件配置中的 `defaultConstraints` 參數置空來禁用默認 Pod 分佈約束：

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints: []
          defaultingType: List
```

<!--
## Comparison with podAffinity and podAntiAffinity {#comparison-with-podaffinity-podantiaffinity}

In Kubernetes, [inter-Pod affinity and anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
control how Pods are scheduled in relation to one another - either more packed
or more scattered.

`podAffinity`
: attracts Pods; you can try to pack any number of Pods into qualifying
  topology domain(s).

`podAntiAffinity`
: repels Pods. If you set this to `requiredDuringSchedulingIgnoredDuringExecution` mode then
  only a single Pod can be scheduled into a single topology domain; if you choose
  `preferredDuringSchedulingIgnoredDuringExecution` then you lose the ability to enforce the
  constraint.
-->
## 比較 podAffinity 和 podAntiAffinity {#comparison-with-podaffinity-podantiaffinity}

在 Kubernetes 中，
[Pod 間親和性和反親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)控制
Pod 彼此的調度方式（更密集或更分散）。

`podAffinity`
: 吸引 Pod；你可以嘗試將任意數量的 Pod 集中到符合條件的拓撲域中。

`podAntiAffinity`
: 驅逐 Pod。如果將此設爲 `requiredDuringSchedulingIgnoredDuringExecution` 模式，
  則只有單個 Pod 可以調度到單個拓撲域；如果你選擇 `preferredDuringSchedulingIgnoredDuringExecution`，
  則你將丟失強制執行此約束的能力。

<!--
For finer control, you can specify topology spread constraints to distribute
Pods across different topology domains - to achieve either high availability or
cost-saving. This can also help on rolling update workloads and scaling out
replicas smoothly.

For more context, see the
[Motivation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation)
section of the enhancement proposal about Pod topology spread constraints.
-->
要實現更細粒度的控制，你可以設置拓撲分佈約束來將 Pod 分佈到不同的拓撲域下，從而實現高可用性或節省成本。
這也有助於工作負載的滾動更新和平穩地擴展副本規模。

有關詳細信息，請參閱有關 Pod 拓撲分佈約束的增強倡議的
[動機](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation)一節。

<!--
## Known limitations

- There's no guarantee that the constraints remain satisfied when Pods are removed. For
  example, scaling down a Deployment may result in imbalanced Pods distribution.

  You can use a tool such as the [Descheduler](https://github.com/kubernetes-sigs/descheduler)
  to rebalance the Pods distribution.
- Pods matched on tainted nodes are respected.
  See [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921).
-->
## 已知侷限性 {#known-limitations}

- 當 Pod 被移除時，無法保證約束仍被滿足。例如，縮減某 Deployment 的規模時，Pod 的分佈可能不再均衡。

  你可以使用 [Descheduler](https://github.com/kubernetes-sigs/descheduler) 來重新實現 Pod 分佈的均衡。

- 具有污點的節點上匹配的 Pod 也會被統計。
  參考 [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)。

<!--
- The scheduler doesn't have prior knowledge of all the zones or other topology
  domains that a cluster has. They are determined from the existing nodes in the
  cluster. This could lead to a problem in autoscaled clusters, when a node pool (or
  node group) is scaled to zero nodes, and you're expecting the cluster to scale up,
  because, in this case, those topology domains won't be considered until there is
  at least one node in them.

  You can work around this by using a Node autoscaler that is aware of
  Pod topology spread constraints and is also aware of the overall set of topology
  domains.
-->
- 該調度器不會預先知道集羣擁有的所有可用區和其他拓撲域。
  拓撲域由集羣中存在的節點確定。在自動擴縮的集羣中，如果一個節點池（或節點組）的節點數量縮減爲零，
  而用戶正期望其擴容時，可能會導致調度出現問題。
  因爲在這種情況下，調度器不會考慮這些拓撲域，直至這些拓撲域中至少包含有一個節點。

  你可以通過使用感知 Pod 拓撲分佈約束並感知整個拓撲域集的節點自動擴縮工具來解決此問題。

<!--
- Pods that don't match their own labelSelector create "ghost pods". If a pod's
  labels don't match the `labelSelector` in its topology spread constraint, the pod
  won't count itself in spread calculations. This means:
  - Multiple such pods can just accumulate on the same topology (until matching pods are newly created/deleted) because those pod's schedule don't change a spreading calculation result.
  - The spreading constraint works in an unintended way, most likely not matching your expectations

  Ensure your pod's labels match the `labelSelector` in your spread constraints.
  Typically, a pod should match its own topology spread constraint selector.
-->
- 與自身的 labelSelector 不匹配的 Pod 會產生“幽靈 Pod”。
  如果某個 Pod 的標籤與其拓撲分佈約束中的 `labelSelector` 不匹配，
  那麼該 Pod 無法參與拓撲分佈的計算。這意味着：
  - 這類 Pod 可能會持續堆積在同一個拓撲域上（直到新創建或刪除了選擇算符相匹配的 Pod），
    因爲這些 Pod 的調度不會改變分佈計算結果。
  - 分佈約束會以非預期的方式工作，很可能與你的期望不一致。
  
  請確保 Pod 的標籤與分佈約束中的 `labelSelector` 相匹配。
  通常，Pod 應當能夠匹配到它自己定義的拓撲分佈約束選擇算符。

## {{% heading "whatsnext" %}}

<!--
- The blog article [Introducing PodTopologySpread](/blog/2020/05/introducing-podtopologyspread/)
  explains `maxSkew` in some detail, as well as covering some advanced usage examples.
- Read the [scheduling](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling) section of
  the API reference for Pod.
-->
- 博客：[PodTopologySpread 介紹](/blog/2020/05/introducing-podtopologyspread/)詳細解釋了 `maxSkew`，
  並給出了一些進階的使用示例。
- 閱讀針對 Pod 的 API
  參考的[調度](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling)一節。
