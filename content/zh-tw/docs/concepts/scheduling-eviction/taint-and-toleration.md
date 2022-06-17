---
title: 汙點和容忍度
content_type: concept
weight: 40
---

<!-- overview -->
<!--
[_Node affinity_](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
is a property of {{< glossary_tooltip text="Pods" term_id="pod" >}} that *attracts* them to
a set of {{< glossary_tooltip text="nodes" term_id="node" >}} (either as a preference or a
hard requirement). _Taints_ are the opposite -- they allow a node to repel a set of pods.
-->
[_節點親和性_](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
是 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的一種屬性，它使 Pod
被吸引到一類特定的{{< glossary_tooltip text="節點" term_id="node" >}}
（這可能出於一種偏好，也可能是硬性要求）。
_汙點_（Taint）則相反——它使節點能夠排斥一類特定的 Pod。

<!--
_Tolerations_ are applied to pods, and allow (but do not require) the pods to schedule
onto nodes with matching taints.

Taints and tolerations work together to ensure that pods are not scheduled
onto inappropriate nodes. One or more taints are applied to a node; this
marks that the node should not accept any pods that do not tolerate the taints.
-->
容忍度（Toleration）是應用於 Pod 上的，允許（但並不要求）Pod
排程到帶有與之匹配的汙點的節點上。

汙點和容忍度（Toleration）相互配合，可以用來避免 Pod 被分配到不合適的節點上。
每個節點上都可以應用一個或多個汙點，這表示對於那些不能容忍這些汙點的 Pod，是不會被該節點接受的。

<!-- body -->

<!--
## Concepts
-->
## 概念

<!--
You add a taint to a node using [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint).
For example,
-->
你可以使用命令 [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint) 給節點增加一個汙點。比如，

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
```

<!--
places a taint on node `node1`. The taint has key `key1`, value `value1`, and taint effect `NoSchedule`.
This means that no pod will be able to schedule onto `node1` unless it has a matching toleration.

```shell
kubectl taint nodes node1 key:NoSchedule
```

To remove the taint added by the command above, you can run:
```shell
kubectl taint nodes node1 key1=value1:NoSchedule-
```
-->
給節點 `node1` 增加一個汙點，它的鍵名是 `key1`，鍵值是 `value1`，效果是 `NoSchedule`。
這表示只有擁有和這個汙點相匹配的容忍度的 Pod 才能夠被分配到 `node1` 這個節點。

若要移除上述命令所新增的汙點，你可以執行：

```shell
kubectl taint nodes node1 key1=value1:NoSchedule-
```

<!--
You specify a toleration for a pod in the PodSpec. Both of the following tolerations "match" the
taint created by the `kubectl taint` line above, and thus a pod with either toleration would be able
to schedule onto `node1`:
-->
你可以在 PodSpec 中定義 Pod 的容忍度。
下面兩個容忍度均與上面例子中使用 `kubectl taint` 命令建立的汙點相匹配，
因此如果一個 Pod 擁有其中的任何一個容忍度都能夠被分配到 `node1` ：

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
```

```yaml
tolerations:
- key: "key1"
  operator: "Exists"
  effect: "NoSchedule"
```

<!--
Here’s an example of a pod that uses tolerations:
-->
這裡是一個使用了容忍度的 Pod：

{{< codenew file="pods/pod-with-toleration.yaml" >}}

<!--
The default value for `operator` is `Equal`.
-->
`operator` 的預設值是 `Equal`。

<!--
A toleration "matches" a taint if the keys are the same and the effects are the same, and:

* the `operator` is `Exists` (in which case no `value` should be specified), or
* the `operator` is `Equal` and the `value`s are equal
-->
一個容忍度和一個汙點相“匹配”是指它們有一樣的鍵名和效果，並且：

* 如果 `operator` 是 `Exists` （此時容忍度不能指定 `value`），或者
* 如果 `operator` 是 `Equal` ，則它們的 `value` 應該相等

<!--
There are two special cases:

An empty `key` with operator `Exists` matches all keys, values and effects which means this
will tolerate everything.

An empty `effect` matches all effects with key `key1`.
-->
{{< note >}}
存在兩種特殊情況：

如果一個容忍度的 `key` 為空且 operator 為 `Exists`，
表示這個容忍度與任意的 key 、value 和 effect 都匹配，即這個容忍度能容忍任意 taint。

如果 `effect` 為空，則可以與所有鍵名 `key1` 的效果相匹配。
{{< /note >}}

<!--
The above example used `effect` of `NoSchedule`. Alternatively, you can use `effect` of `PreferNoSchedule`.
This is a "preference" or "soft" version of `NoSchedule` - the system will *try* to avoid placing a
pod that does not tolerate the taint on the node, but it is not required. The third kind of `effect` is
`NoExecute`, described later.
-->
上述例子中 `effect` 使用的值為 `NoSchedule`，你也可以使用另外一個值 `PreferNoSchedule`。
這是“最佳化”或“軟”版本的 `NoSchedule` —— 系統會 *儘量* 避免將 Pod 排程到存在其不能容忍汙點的節點上，
但這不是強制的。`effect` 的值還可以設定為 `NoExecute`，下文會詳細描述這個值。

<!--
You can put multiple taints on the same node and multiple tolerations on the same pod.
The way Kubernetes processes multiple taints and tolerations is like a filter: start
with all of a node's taints, then ignore the ones for which the pod has a matching toleration; the
remaining un-ignored taints have the indicated effects on the pod. In particular,
-->
你可以給一個節點新增多個汙點，也可以給一個 Pod 新增多個容忍度設定。
Kubernetes 處理多個汙點和容忍度的過程就像一個過濾器：從一個節點的所有汙點開始遍歷，
過濾掉那些 Pod 中存在與之相匹配的容忍度的汙點。餘下未被過濾的汙點的 effect 值決定了
Pod 是否會被分配到該節點，特別是以下情況：

<!--
* if there is at least one un-ignored taint with effect `NoSchedule` then Kubernetes will not schedule
the pod onto that node
* if there is no un-ignored taint with effect `NoSchedule` but there is at least one un-ignored taint with
effect `PreferNoSchedule` then Kubernetes will *try* to not schedule the pod onto the node
* if there is at least one un-ignored taint with effect `NoExecute` then the pod will be evicted from
the node (if it is already running on the node), and will not be
scheduled onto the node (if it is not yet running on the node).
-->
* 如果未被過濾的汙點中存在至少一個 effect 值為 `NoSchedule` 的汙點，
  則 Kubernetes 不會將 Pod 分配到該節點。
* 如果未被過濾的汙點中不存在 effect 值為 `NoSchedule` 的汙點，
  但是存在 effect 值為 `PreferNoSchedule` 的汙點，
  則 Kubernetes 會 *嘗試* 不將 Pod 分配到該節點。
* 如果未被過濾的汙點中存在至少一個 effect 值為 `NoExecute` 的汙點，
  則 Kubernetes 不會將 Pod 分配到該節點（如果 Pod 還未在節點上執行），
  或者將 Pod 從該節點驅逐（如果 Pod 已經在節點上執行）。

<!--
For example, imagine you taint a node like this
-->
例如，假設你給一個節點添加了如下汙點

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

<!--
And a pod has two tolerations:
-->
假定有一個 Pod，它有兩個容忍度：

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
```

<!--
In this case, the pod will not be able to schedule onto the node, because there is no
toleration matching the third taint. But it will be able to continue running if it is
already running on the node when the taint is added, because the third taint is the only
one of the three that is not tolerated by the pod.
-->
在這種情況下，上述 Pod 不會被分配到上述節點，因為其沒有容忍度和第三個汙點相匹配。
但是如果在給節點新增上述汙點之前，該 Pod 已經在上述節點執行，
那麼它還可以繼續執行在該節點上，因為第三個汙點是三個汙點中唯一不能被這個 Pod 容忍的。

<!--
Normally, if a taint with effect `NoExecute` is added to a node, then any pods that do
not tolerate the taint will be evicted immediately, and any pods that do tolerate the
taint will never be evicted. However, a toleration with `NoExecute` effect can specify
an optional `tolerationSeconds` field that dictates how long the pod will stay bound
to the node after the taint is added. For example,
-->
通常情況下，如果給一個節點添加了一個 effect 值為 `NoExecute` 的汙點，
則任何不能忍受這個汙點的 Pod 都會馬上被驅逐，
任何可以忍受這個汙點的 Pod 都不會被驅逐。
但是，如果 Pod 存在一個 effect 值為 `NoExecute` 的容忍度指定了可選屬性
`tolerationSeconds` 的值，則表示在給節點添加了上述汙點之後，
Pod 還能繼續在節點上執行的時間。例如，

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
  tolerationSeconds: 3600
```

<!--
means that if this pod is running and a matching taint is added to the node, then
the pod will stay bound to the node for 3600 seconds, and then be evicted. If the
taint is removed before that time, the pod will not be evicted.
-->
這表示如果這個 Pod 正在執行，同時一個匹配的汙點被新增到其所在的節點，
那麼 Pod 還將繼續在節點上執行 3600 秒，然後被驅逐。
如果在此之前上述汙點被刪除了，則 Pod 不會被驅逐。

<!--
## Example Use Cases
-->
## 使用例子

<!--
Taints and tolerations are a flexible way to steer pods *away* from nodes or evict
pods that shouldn't be running. A few of the use cases are
-->
透過汙點和容忍度，可以靈活地讓 Pod **避開** 某些節點或者將 Pod 從某些節點驅逐。下面是幾個使用例子：

<!--
* **Dedicated Nodes**: If you want to dedicate a set of nodes for exclusive use by
a particular set of users, you can add a taint to those nodes (say,
`kubectl taint nodes nodename dedicated=groupName:NoSchedule`) and then add a corresponding
toleration to their pods (this would be done most easily by writing a custom
[admission controller](/docs/reference/access-authn-authz/admission-controllers/)).
The pods with the tolerations will then be allowed to use the tainted (dedicated) nodes as
well as any other nodes in the cluster. If you want to dedicate the nodes to them *and*
ensure they *only* use the dedicated nodes, then you should additionally add a label similar
to the taint to the same set of nodes (e.g. `dedicated=groupName`), and the admission
controller should additionally add a node affinity to require that the pods can only schedule
onto nodes labeled with `dedicated=groupName`.
-->
* **專用節點**：如果你想將某些節點專門分配給特定的一組使用者使用，你可以給這些節點新增一個汙點（即，
  `kubectl taint nodes nodename dedicated=groupName:NoSchedule`），
  然後給這組使用者的 Pod 新增一個相對應的 toleration（透過編寫一個自定義的
  [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)，很容易就能做到）。
  擁有上述容忍度的 Pod 就能夠被分配到上述專用節點，同時也能夠被分配到叢集中的其它節點。
  如果你希望這些 Pod 只能被分配到上述專用節點，那麼你還需要給這些專用節點另外新增一個和上述
  汙點類似的 label （例如：`dedicated=groupName`），同時 還要在上述准入控制器中給 Pod
  增加節點親和性要求上述 Pod 只能被分配到添加了 `dedicated=groupName` 標籤的節點上。

<!--
* **Nodes with Special Hardware**: In a cluster where a small subset of nodes have specialized
hardware (for example GPUs), it is desirable to keep pods that don't need the specialized
hardware off of those nodes, thus leaving room for later-arriving pods that do need the
specialized hardware. This can be done by tainting the nodes that have the specialized
hardware (e.g. `kubectl taint nodes nodename special=true:NoSchedule` or
`kubectl taint nodes nodename special=true:PreferNoSchedule`) and adding a corresponding
toleration to pods that use the special hardware. As in the dedicated nodes use case,
it is probably easiest to apply the tolerations using a custom
[admission controller](/docs/reference/access-authn-authz/admission-controllers/).
For example, it is recommended to use [Extended
Resources](/docs/concepts/configuration/manage-compute-resources-container/#extended-resources)
to represent the special hardware, taint your special hardware nodes with the
extended resource name and run the
[ExtendedResourceToleration](/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration)
admission controller. Now, because the nodes are tainted, no pods without the
toleration will schedule on them. But when you submit a pod that requests the
extended resource, the `ExtendedResourceToleration` admission controller will
automatically add the correct toleration to the pod and that pod will schedule
on the special hardware nodes. This will make sure that these special hardware
nodes are dedicated for pods requesting such hardware and you don't have to
manually add tolerations to your pods.
-->
* **配備了特殊硬體的節點**：在部分節點配備了特殊硬體（比如 GPU）的叢集中，
  我們希望不需要這類硬體的 Pod 不要被分配到這些特殊節點，以便為後繼需要這類硬體的 Pod 保留資源。
  要達到這個目的，可以先給配備了特殊硬體的節點新增 taint
  （例如 `kubectl taint nodes nodename special=true:NoSchedule` 或
  `kubectl taint nodes nodename special=true:PreferNoSchedule`)，
  然後給使用了這類特殊硬體的 Pod 新增一個相匹配的 toleration。
  和專用節點的例子類似，新增這個容忍度的最簡單的方法是使用自定義
  [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)。
  比如，我們推薦使用[擴充套件資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)
  來表示特殊硬體，給配置了特殊硬體的節點新增汙點時包含擴充套件資源名稱，
  然後執行一個 [ExtendedResourceToleration](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration)
  准入控制器。此時，因為節點已經被設定汙點了，沒有對應容忍度的 Pod
  不會被排程到這些節點。但當你建立一個使用了擴充套件資源的 Pod 時，
  `ExtendedResourceToleration` 准入控制器會自動給 Pod 加上正確的容忍度，
  這樣 Pod 就會被自動排程到這些配置了特殊硬體件的節點上。
  這樣就能夠確保這些配置了特殊硬體的節點專門用於執行需要使用這些硬體的 Pod，
  並且你無需手動給這些 Pod 新增容忍度。

<!--
* **Taint based Evictions**: A per-pod-configurable eviction behavior
when there are node problems, which is described in the next section.
-->
* **基於汙點的驅逐**: 這是在每個 Pod 中配置的在節點出現問題時的驅逐行為，接下來的章節會描述這個特性。

<!--
## Taint based Evictions
-->
## 基於汙點的驅逐  {#taint-based-evictions}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
The `NoExecute` taint effect, which affects pods that are already
running on the node as follows

 * pods that do not tolerate the taint are evicted immediately
 * pods that tolerate the taint without specifying `tolerationSeconds` in
   their toleration specification remain bound forever
 * pods that tolerate the taint with a specified `tolerationSeconds` remain
   bound for the specified amount of time
-->
前文提到過汙點的 effect 值 `NoExecute` 會影響已經在節點上執行的 Pod

 * 如果 Pod 不能忍受 effect 值為 `NoExecute` 的汙點，那麼 Pod 將馬上被驅逐
 * 如果 Pod 能夠忍受 effect 值為 `NoExecute` 的汙點，但是在容忍度定義中沒有指定
   `tolerationSeconds`，則 Pod 還會一直在這個節點上執行。
 * 如果 Pod 能夠忍受 effect 值為 `NoExecute` 的汙點，而且指定了 `tolerationSeconds`，
   則 Pod 還能在這個節點上繼續執行這個指定的時間長度。

<!--
The node controller automatically taints a node when certain conditions are
true. The following taints are built in:

 * `node.kubernetes.io/not-ready`: Node is not ready. This corresponds to
   the NodeCondition `Ready` being "`False`".
 * `node.kubernetes.io/unreachable`: Node is unreachable from the node
   controller. This corresponds to the NodeCondition `Ready` being "`Unknown`".
 * `node.kubernetes.io/memory-pressure`: Node has memory pressure.
 * `node.kubernetes.io/disk-pressure`: Node has disk pressure.
 * `node.kubernetes.io/pid-pressure`: Node has PID pressure.
 * `node.kubernetes.io/network-unavailable`: Node's network is unavailable.
 * `node.kubernetes.io/unschedulable`: Node is unschedulable.
 * `node.cloudprovider.kubernetes.io/uninitialized`: When the kubelet is started
    with "external" cloud provider, this taint is set on a node to mark it
    as unusable. After a controller from the cloud-controller-manager initializes
    this node, the kubelet removes this taint.
  -->
當某種條件為真時，節點控制器會自動給節點新增一個汙點。當前內建的汙點包括：

 * `node.kubernetes.io/not-ready`：節點未準備好。這相當於節點狀態 `Ready` 的值為 "`False`"。
 * `node.kubernetes.io/unreachable`：節點控制器訪問不到節點. 這相當於節點狀態 `Ready` 的值為 "`Unknown`"。
 * `node.kubernetes.io/memory-pressure`：節點存在記憶體壓力。
 * `node.kubernetes.io/disk-pressure`：節點存在磁碟壓力。
 * `node.kubernetes.io/pid-pressure`: 節點的 PID 壓力。
 * `node.kubernetes.io/network-unavailable`：節點網路不可用。
 * `node.kubernetes.io/unschedulable`: 節點不可排程。
 * `node.cloudprovider.kubernetes.io/uninitialized`：如果 kubelet 啟動時指定了一個 "外部" 雲平臺驅動，
   它將給當前節點新增一個汙點將其標誌為不可用。在 cloud-controller-manager
   的一個控制器初始化這個節點後，kubelet 將刪除這個汙點。

<!--
In case a node is to be evicted, the node controller or the kubelet adds relevant taints
with `NoExecute` effect. If the fault condition returns to normal the kubelet or node
controller can remove the relevant taint(s).
-->
在節點被驅逐時，節點控制器或者 kubelet 會新增帶有 `NoExecute` 效應的相關汙點。
如果異常狀態恢復正常，kubelet 或節點控制器能夠移除相關的汙點。

<!--
To maintain the existing [rate limiting](/docs/concepts/architecture/nodes/)
behavior of pod evictions due to node problems, the system actually adds the taints
in a rate-limited way. This prevents massive pod evictions in scenarios such
as the master becoming partitioned from the nodes.
-->
{{< note >}}
為了保證由於節點問題引起的 Pod 驅逐
[速率限制](/zh-cn/docs/concepts/architecture/nodes/)行為正常，
系統實際上會以限定速率的方式新增汙點。在像主控節點與工作節點間通訊中斷等場景下，
這樣做可以避免 Pod 被大量驅逐。
{{< /note >}}

<!--
This feature, in combination with `tolerationSeconds`, allows a pod
to specify how long it should stay bound to a node that has one or both of these problems.
-->
使用這個功能特性，結合 `tolerationSeconds`，Pod 就可以指定當節點出現一個
或全部上述問題時還將在這個節點上執行多長的時間。

<!--
For example, an application with a lot of local state might want to stay
bound to node for a long time in the event of network partition, in the hope
that the partition will recover and thus the pod eviction can be avoided.
The toleration the pod would use in that case would look like
-->
比如，一個使用了很多本地狀態的應用程式在網路斷開時，仍然希望停留在當前節點上執行一段較長的時間，
願意等待網路恢復以避免被驅逐。在這種情況下，Pod 的容忍度可能是下面這樣的：

```yaml
tolerations:
- key: "node.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

<!--
Note that Kubernetes automatically adds a toleration for
`node.kubernetes.io/not-ready` with `tolerationSeconds=300`
unless the pod configuration provided
by the user already has a toleration for `node.kubernetes.io/not-ready`.
Likewise it adds a toleration for
`node.kubernetes.io/unreachable` with `tolerationSeconds=300`
unless the pod configuration provided
by the user already has a toleration for `node.kubernetes.io/unreachable`.
-->

{{< note >}}
Kubernetes 會自動給 Pod 新增一個 key 為 `node.kubernetes.io/not-ready` 的容忍度
並配置 `tolerationSeconds=300`，除非使用者提供的 Pod 配置中已經已存在了 key 為
`node.kubernetes.io/not-ready` 的容忍度。

同樣，Kubernetes 會給 Pod 新增一個 key 為 `node.kubernetes.io/unreachable` 的容忍度
並配置 `tolerationSeconds=300`，除非使用者提供的 Pod 配置中已經已存在了 key 為
`node.kubernetes.io/unreachable` 的容忍度。
{{< /note >}}

<!--
These automatically-added tolerations mean that Pods remain bound to
Nodes for 5 minutes after one of these problems is detected.
-->
這種自動新增的容忍度意味著在其中一種問題被檢測到時 Pod
預設能夠繼續停留在當前節點執行 5 分鐘。

<!--
[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) pods are created with
`NoExecute` tolerations for the following taints with no `tolerationSeconds`:

  * `node.kubernetes.io/unreachable`
  * `node.kubernetes.io/not-ready`

This ensures that DaemonSet pods are never evicted due to these problems.
-->
[DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/) 中的 Pod 被建立時，
針對以下汙點自動新增的 `NoExecute` 的容忍度將不會指定 `tolerationSeconds`：

  * `node.kubernetes.io/unreachable`
  * `node.kubernetes.io/not-ready`

這保證了出現上述問題時 DaemonSet 中的 Pod 永遠不會被驅逐。

<!--
## Taint Nodes by Condition
-->
## 基於節點狀態新增汙點

<!--
The control plane, using the node {{<glossary_tooltip text="controller" term_id="controller">}},
automatically creates taints with a `NoSchedule` effect for [node conditions](/docs/concepts/scheduling-eviction/node-pressure-eviction/#node-conditions).

The scheduler checks taints, not node conditions, when it makes scheduling
decisions. This ensures that node conditions don't directly affect scheduling.
For example, if the `DiskPressure` node condition is active, the control plane
adds the `node.kubernetes.io/disk-pressure` taint and does not schedule new pods
onto the affected node. If the `MemoryPressure` node condition is active, the
control plane adds the `node.kubernetes.io/memory-pressure` taint. 
-->

控制平面使用節點{{<glossary_tooltip text="控制器" term_id="controller">}}自動建立
與[節點狀況](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/#node-conditions)對應的帶有 `NoSchedule` 效應的汙點。

排程器在進行排程時檢查汙點，而不是檢查節點狀況。這確保節點狀況不會直接影響排程。
例如，如果 `DiskPressure` 節點狀況處於活躍狀態，則控制平面
新增 `node.kubernetes.io/disk-pressure` 汙點並且不會排程新的 pod
到受影響的節點。如果 `MemoryPressure` 節點狀況處於活躍狀態，則
控制平面新增 `node.kubernetes.io/memory-pressure` 汙點。

<!--
You can ignore node conditions for newly created pods by adding the corresponding
Pod tolerations. The control plane also adds the `node.kubernetes.io/memory-pressure` 
toleration on pods that have a {{< glossary_tooltip text="QoS class" term_id="qos-class" >}} 
other than `BestEffort`. This is because Kubernetes treats pods in the `Guaranteed` 
or `Burstable` QoS classes (even pods with no memory request set) as if they are
able to cope with memory pressure, while new `BestEffort` pods are not scheduled
onto the affected node. 
-->

對於新建立的 Pod，可以透過新增相應的 Pod 容忍度來忽略節點狀況。
控制平面還在具有除 `BestEffort` 之外的 {{<glossary_tooltip text="QoS 類" term_id="qos-class" >}}的 Pod 上
新增 `node.kubernetes.io/memory-pressure` 容忍度。
這是因為 Kubernetes 將 `Guaranteed` 或 `Burstable` QoS 類中的 Pod（甚至沒有設定記憶體請求的 Pod）
視為能夠應對記憶體壓力，而新建立的 `BestEffort` Pod 不會被排程到受影響的節點上。

<!--
The DaemonSet controller automatically adds the
following `NoSchedule` tolerations to all daemons, to prevent DaemonSets from
breaking.

  * `node.kubernetes.io/memory-pressure`
  * `node.kubernetes.io/disk-pressure`
  * `node.kubernetes.io/pid-pressure` (1.14 or later)
  * `node.kubernetes.io/unschedulable` (1.10 or later)
  * `node.kubernetes.io/network-unavailable` (*host network only*)
-->

DaemonSet 控制器自動為所有守護程序新增如下 `NoSchedule` 容忍度以防 DaemonSet 崩潰：

  * `node.kubernetes.io/memory-pressure`
  * `node.kubernetes.io/disk-pressure`
  * `node.kubernetes.io/pid-pressure` (1.14 或更高版本)
  * `node.kubernetes.io/unschedulable` (1.10 或更高版本)
  * `node.kubernetes.io/network-unavailable` (**只適合主機網路配置**)

<!--
Adding these tolerations ensures backward compatibility. You can also add
arbitrary tolerations to DaemonSets.
-->

新增上述容忍度確保了向後相容，你也可以選擇自由向 DaemonSet 新增容忍度。

## {{% heading "whatsnext" %}}

<!--
* Read about [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/) and how you can configure it
* Read about [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
-->
* 閱讀[節點壓力驅逐](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)，以及如何配置其行為
* 閱讀 [Pod 優先順序](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
