---
title: 污點和容忍度
content_type: concept
weight: 50
---
<!--
reviewers:
- davidopp
- kevin-wangzefeng
- bsalamat
title: Taints and Tolerations
content_type: concept
weight: 50
-->

<!-- overview -->
<!--
[_Node affinity_](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
is a property of {{< glossary_tooltip text="Pods" term_id="pod" >}} that *attracts* them to
a set of {{< glossary_tooltip text="nodes" term_id="node" >}} (either as a preference or a
hard requirement). _Taints_ are the opposite -- they allow a node to repel a set of pods.
-->
[節點親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
是 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的一種屬性，它使 Pod
被吸引到一類特定的{{< glossary_tooltip text="節點" term_id="node" >}}
（這可能出於一種偏好，也可能是硬性要求）。
**污點（Taint）** 則相反——它使節點能夠排斥一類特定的 Pod。

<!--
_Tolerations_ are applied to pods. Tolerations allow the scheduler to schedule pods with matching
taints. Tolerations allow scheduling but don't guarantee scheduling: the scheduler also
[evaluates other parameters](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
as part of its function.

Taints and tolerations work together to ensure that pods are not scheduled
onto inappropriate nodes. One or more taints are applied to a node; this
marks that the node should not accept any pods that do not tolerate the taints.
-->
**容忍度（Toleration）** 是應用於 Pod 上的。容忍度允許調度器調度帶有對應污點的 Pod。
容忍度允許調度但並不保證調度：作爲其功能的一部分，
調度器也會[評估其他參數](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。

污點和容忍度（Toleration）相互配合，可以用來避免 Pod 被分配到不合適的節點上。
每個節點上都可以應用一個或多個污點，這表示對於那些不能容忍這些污點的 Pod，
是不會被該節點接受的。

<!-- body -->

<!--
## Concepts

You add a taint to a node using [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint).
For example,
-->
## 概念  {#concepts}

你可以使用命令 [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)
給節點增加一個污點。比如：

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
```

<!--
places a taint on node `node1`. The taint has key `key1`, value `value1`, and taint effect `NoSchedule`.
This means that no pod will be able to schedule onto `node1` unless it has a matching toleration.

To remove the taint added by the command above, you can run:
-->
給節點 `node1` 增加一個污點，它的鍵名是 `key1`，鍵值是 `value1`，效果是 `NoSchedule`。
這表示只有擁有和這個污點相匹配的容忍度的 Pod 才能夠被分配到 `node1` 這個節點。

若要移除上述命令所添加的污點，你可以執行：

```shell
kubectl taint nodes node1 key1=value1:NoSchedule-
```

<!--
You specify a toleration for a pod in the PodSpec. Both of the following tolerations "match" the
taint created by the `kubectl taint` line above, and thus a pod with either toleration would be able
to schedule onto `node1`:
-->
你可以在 Pod 規約中爲 Pod 設置容忍度。
下面兩個容忍度均與上面例子中使用 `kubectl taint` 命令創建的污點相匹配，
因此如果一個 Pod 擁有其中的任何一個容忍度，都能夠被調度到 `node1`：

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
The default Kubernetes scheduler takes taints and tolerations into account when
selecting a node to run a particular Pod. However, if you manually specify the
`.spec.nodeName` for a Pod, that action bypasses the scheduler; the Pod is then
bound onto the node where you assigned it, even if there are `NoSchedule`
taints on that node that you selected.
If this happens and the node also has a `NoExecute` taint set, the kubelet will
eject the Pod unless there is an appropriate tolerance set.
-->
默認的 Kubernetes 調度器在選擇一個節點來運行特定的 Pod 時會考慮污點和容忍度。
然而，如果你手動爲一個 Pod 指定了 `.spec.nodeName`，那麼選節點操作會繞過調度器；
這個 Pod 將會綁定到你指定的節點上，即使你選擇的節點上有 `NoSchedule` 的污點。
如果這種情況發生，且節點上還設置了 `NoExecute` 的污點，kubelet 會將 Pod 驅逐出去，除非有適當的容忍度設置。

<!--
Here's an example of a pod that has some tolerations defined:
-->
下面是一個定義了一些容忍度的 Pod 的例子：

{{% code_sample file="pods/pod-with-toleration.yaml" %}}

<!--
The default value for `operator` is `Equal`.
-->
`operator` 的默認值是 `Equal`。

<!--
A toleration "matches" a taint if the keys are the same and the effects are the same, and:

* the `operator` is `Exists` (in which case no `value` should be specified), or
* the `operator` is `Equal` and the values should be equal.
-->
一個容忍度和一個污點相“匹配”是指它們有一樣的鍵名和效果，並且：

* 如果 `operator` 是 `Exists`（此時容忍度不能指定 `value`），或者
* 如果 `operator` 是 `Equal`，則它們的值應該相等。

{{< note >}}
<!--
There are two special cases:

If the `key` is empty, then the `operator` must be `Exists`, which matches all keys and values. Note that the `effect` still needs to be matched at the same time.

An empty `effect` matches all effects with key `key1`.
-->
存在兩種特殊情況：

如果 `key` 爲空，那麼 `operator` 必須是 `Exists`，匹配所有 key 和 value。
注意，同時 `effect` 仍然需要匹配。

如果 `effect` 爲空，則可以與所有鍵名 `key1` 的效果相匹配。
{{< /note >}}

<!--
The above example used the `effect` of `NoSchedule`. Alternatively, you can use the `effect` of `PreferNoSchedule`.
-->
上述例子中 `effect` 使用的值爲 `NoSchedule`，你也可以使用另外一個值 `PreferNoSchedule`。

<!--
The allowed values for the `effect` field are:
-->
`effect` 字段的允許值包括：

<!--
`NoExecute`
: This affects pods that are already running on the node as follows:
  * Pods that do not tolerate the taint are evicted immediately
  * Pods that tolerate the taint without specifying `tolerationSeconds` in
    their toleration specification remain bound forever
  * Pods that tolerate the taint with a specified `tolerationSeconds` remain
    bound for the specified amount of time. After that time elapses, the node
    lifecycle controller evicts the Pods from the node.
-->
`NoExecute`
: 這會影響已在節點上運行的 Pod，具體影響如下：
  * 如果 Pod 不能容忍這類污點，會馬上被驅逐。
  * 如果 Pod 能夠容忍這類污點，但是在容忍度定義中沒有指定 `tolerationSeconds`，
    則 Pod 還會一直在這個節點上運行。
  * 如果 Pod 能夠容忍這類污點，而且指定了 `tolerationSeconds`，
    則 Pod 還能在這個節點上繼續運行這個指定的時間長度。
    這段時間過去後，節點生命週期控制器從節點驅除這些 Pod。

<!--
`NoSchedule`
: No new Pods will be scheduled on the tainted node unless they have a matching
  toleration. Pods currently running on the node are **not** evicted.
-->
`NoSchedule`
: 除非具有匹配的容忍度規約，否則新的 Pod 不會被調度到帶有污點的節點上。
  當前正在節點上運行的 Pod **不會**被驅逐。

<!--
`PreferNoSchedule`
: `PreferNoSchedule` is a "preference" or "soft" version of `NoSchedule`.
  The control plane will *try* to avoid placing a Pod that does not tolerate
  the taint on the node, but it is not guaranteed.
-->
`PreferNoSchedule`
: `PreferNoSchedule` 是“偏好”或“軟性”的 `NoSchedule`。
  控制平面將**嘗試**避免將不能容忍污點的 Pod 調度到的節點上，但不能保證完全避免。

<!--
You can put multiple taints on the same node and multiple tolerations on the same pod.
The way Kubernetes processes multiple taints and tolerations is like a filter: start
with all of a node's taints, then ignore the ones for which the pod has a matching toleration; the
remaining un-ignored taints have the indicated effects on the pod. In particular,
-->
你可以給一個節點添加多個污點，也可以給一個 Pod 添加多個容忍度設置。
Kubernetes 處理多個污點和容忍度的過程就像一個過濾器：從一個節點的所有污點開始遍歷，
過濾掉那些 Pod 中存在與之相匹配的容忍度的污點。餘下未被過濾的污點的 effect 值決定了
Pod 是否會被分配到該節點。需要注意以下情況：

<!--
* if there is at least one un-ignored taint with effect `NoSchedule` then Kubernetes will not schedule
the pod onto that node
* if there is no un-ignored taint with effect `NoSchedule` but there is at least one un-ignored taint with
effect `PreferNoSchedule` then Kubernetes will *try* to not schedule the pod onto the node
* if there is at least one un-ignored taint with effect `NoExecute` then the pod will be evicted from
the node (if it is already running on the node), and will not be
scheduled onto the node (if it is not yet running on the node).
-->
* 如果未被忽略的污點中存在至少一個 effect 值爲 `NoSchedule` 的污點，
  則 Kubernetes 不會將 Pod 調度到該節點。
* 如果未被忽略的污點中不存在 effect 值爲 `NoSchedule` 的污點，
  但是存在至少一個 effect 值爲 `PreferNoSchedule` 的污點，
  則 Kubernetes 會**嘗試**不將 Pod 調度到該節點。
* 如果未被忽略的污點中存在至少一個 effect 值爲 `NoExecute` 的污點，
  則 Kubernetes 不會將 Pod 調度到該節點（如果 Pod 還未在節點上運行），
  並且會將 Pod 從該節點驅逐（如果 Pod 已經在節點上運行）。

<!--
For example, imagine you taint a node like this
-->
例如，假設你給一個節點添加了如下污點：

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

<!--
And a pod has two tolerations:
-->
假定某個 Pod 有兩個容忍度：

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
在這種情況下，上述 Pod 不會被調度到上述節點，因爲其沒有容忍度和第三個污點相匹配。
但是如果在給節點添加上述污點之前，該 Pod 已經在上述節點運行，
那麼它還可以繼續運行在該節點上，因爲第三個污點是三個污點中唯一不能被這個 Pod 容忍的。

<!--
Normally, if a taint with effect `NoExecute` is added to a node, then any pods that do
not tolerate the taint will be evicted immediately, and pods that do tolerate the
taint will never be evicted. However, a toleration with `NoExecute` effect can specify
an optional `tolerationSeconds` field that dictates how long the pod will stay bound
to the node after the taint is added. For example,
-->
通常情況下，如果給一個節點添加了一個 effect 值爲 `NoExecute` 的污點，
則任何不能容忍這個污點的 Pod 都會馬上被驅逐，任何可以容忍這個污點的 Pod 都不會被驅逐。
但是，如果 Pod 存在一個 effect 值爲 `NoExecute` 的容忍度指定了可選屬性
`tolerationSeconds` 的值，則表示在給節點添加了上述污點之後，
Pod 還能繼續在節點上運行的時間。例如：

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
這表示如果這個 Pod 正在運行，同時一個匹配的污點被添加到其所在的節點，
那麼 Pod 還將繼續在節點上運行 3600 秒，然後被驅逐。
如果在此之前上述污點被刪除了，則 Pod 不會被驅逐。

<!--
## Example Use Cases

Taints and tolerations are a flexible way to steer pods *away* from nodes or evict
pods that shouldn't be running. A few of the use cases are
-->
## 使用例子  {#example-use-cases}

通過污點和容忍度，可以靈活地讓 Pod **避開**某些節點或者將 Pod 從某些節點驅逐。
下面是幾個使用例子：

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
* **專用節點**：如果想將某些節點專門分配給特定的一組用戶使用，你可以給這些節點添加一個污點（即，
  `kubectl taint nodes nodename dedicated=groupName:NoSchedule`），
  然後給這組用戶的 Pod 添加一個相對應的容忍度
  （通過編寫一個自定義的[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)，
  很容易就能做到）。
  擁有上述容忍度的 Pod 就能夠被調度到上述專用節點，同時也能夠被調度到集羣中的其它節點。
  如果你希望這些 Pod 只能被調度到上述專用節點，
  那麼你還需要給這些專用節點另外添加一個和上述污點類似的 label（例如：`dedicated=groupName`），
  同時還要在上述准入控制器中給 Pod 增加節點親和性要求，要求上述 Pod 只能被調度到添加了
  `dedicated=groupName` 標籤的節點上。

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
Resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
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
* **配備了特殊硬件的節點**：在部分節點配備了特殊硬件（比如 GPU）的集羣中，
  我們希望不需要這類硬件的 Pod 不要被調度到這些特殊節點，以便爲後繼需要這類硬件的 Pod 保留資源。
  要達到這個目的，可以先給配備了特殊硬件的節點添加污點
  （例如 `kubectl taint nodes nodename special=true:NoSchedule` 或
  `kubectl taint nodes nodename special=true:PreferNoSchedule`），
  然後給使用了這類特殊硬件的 Pod 添加一個相匹配的容忍度。
  和專用節點的例子類似，添加這個容忍度的最簡單的方法是使用自定義
  [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)。
  比如，我們推薦使用[擴展資源](/zh-cn/docs/concepts/configuration/manage-resources-containers/#extended-resources)
  來表示特殊硬件，給配置了特殊硬件的節點添加污點時包含擴展資源名稱，
  然後運行一個 [ExtendedResourceToleration](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration)
  准入控制器。此時，因爲節點已經被設置污點了，沒有對應容忍度的 Pod 不會被調度到這些節點。
  但當你創建一個使用了擴展資源的 Pod 時，`ExtendedResourceToleration` 准入控制器會自動給
  Pod 加上正確的容忍度，這樣 Pod 就會被自動調度到這些配置了特殊硬件的節點上。
  這種方式能夠確保配置了特殊硬件的節點專門用於運行需要這些硬件的 Pod，
  並且你無需手動給這些 Pod 添加容忍度。

<!--
* **Taint based Evictions**: A per-pod-configurable eviction behavior
when there are node problems, which is described in the next section.
-->
* **基於污點的驅逐**：這是在每個 Pod 中配置的在節點出現問題時的驅逐行爲，
  接下來的章節會描述這個特性。

<!--
## Taint based Evictions
-->
## 基於污點的驅逐   {#taint-based-evictions}

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
The node controller automatically taints a Node when certain conditions
are true. The following taints are built in:

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
    with an "external" cloud provider, this taint is set on a node to mark it
    as unusable. After a controller from the cloud-controller-manager initializes
    this node, the kubelet removes this taint.
-->
當某種條件爲真時，節點控制器會自動給節點添加一個污點。當前內置的污點包括：

* `node.kubernetes.io/not-ready`：節點未準備好。這相當於節點狀況 `Ready` 的值爲 "`False`"。
* `node.kubernetes.io/unreachable`：節點控制器訪問不到節點. 這相當於節點狀況 `Ready`
  的值爲 "`Unknown`"。
* `node.kubernetes.io/memory-pressure`：節點存在內存壓力。
* `node.kubernetes.io/disk-pressure`：節點存在磁盤壓力。
* `node.kubernetes.io/pid-pressure`：節點的 PID 壓力。
* `node.kubernetes.io/network-unavailable`：節點網絡不可用。
* `node.kubernetes.io/unschedulable`：節點不可調度。
* `node.cloudprovider.kubernetes.io/uninitialized`：如果 kubelet 啓動時指定了一個“外部”雲平臺驅動，
  它將給當前節點添加一個污點將其標誌爲不可用。在 cloud-controller-manager
  的一個控制器初始化這個節點後，kubelet 將刪除這個污點。

<!--
In case a node is to be drained, the node controller or the kubelet adds relevant taints
with `NoExecute` effect. This effect is added by default for the
`node.kubernetes.io/not-ready` and `node.kubernetes.io/unreachable` taints.
If the fault condition returns to normal, the kubelet or node
controller can remove the relevant taint(s).
-->
在節點被排空時，節點控制器或者 kubelet 會添加帶有 `NoExecute` 效果的相關污點。
此效果被默認添加到 `node.kubernetes.io/not-ready` 和 `node.kubernetes.io/unreachable` 污點中。
如果異常狀態恢復正常，kubelet 或節點控制器能夠移除相關的污點。

<!--
In some cases when the node is unreachable, the API server is unable to communicate
with the kubelet on the node. The decision to delete the pods cannot be communicated to
the kubelet until communication with the API server is re-established. In the meantime,
the pods that are scheduled for deletion may continue to run on the partitioned node.
-->
在某些情況下，當節點不可達時，API 服務器無法與節點上的 kubelet 進行通信。
在與 API 服務器的通信被重新建立之前，刪除 Pod 的決定無法傳遞到 kubelet。
同時，被調度進行刪除的那些 Pod 可能會繼續運行在分區後的節點上。

{{< note >}}
<!--
The control plane limits the rate of adding new taints to nodes. This rate limiting
manages the number of evictions that are triggered when many nodes become unreachable at
once (for example: if there is a network disruption).
-->
控制面會限制向節點添加新污點的速率。這一速率限制可以管理多個節點同時不可達時
（例如出現網絡中斷的情況），可能觸發的驅逐的數量。
{{< /note >}}

<!--
You can specify `tolerationSeconds` for a Pod to define how long that Pod stays bound
to a failing or unresponsive Node.
-->
你可以爲 Pod 設置 `tolerationSeconds`，以指定當節點失效或者不響應時，
Pod 維繫與該節點間綁定關係的時長。

<!--
For example, you might want to keep an application with a lot of local state
bound to node for a long time in the event of network partition, hoping
that the partition will recover and thus the pod eviction can be avoided.
The toleration you set for that Pod might look like:
-->
比如，你可能希望在出現網絡分裂事件時，對於一個與節點本地狀態有着深度綁定的應用而言，
仍然停留在當前節點上運行一段較長的時間，以等待網絡恢復以避免被驅逐。
你爲這種 Pod 所設置的容忍度看起來可能是這樣：

```yaml
tolerations:
- key: "node.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

{{< note >}}
<!--
Kubernetes automatically adds a toleration for
`node.kubernetes.io/not-ready` and `node.kubernetes.io/unreachable`
with `tolerationSeconds=300`,
unless you, or a controller, set those tolerations explicitly.

These automatically-added tolerations mean that Pods remain bound to
Nodes for 5 minutes after one of these problems is detected.
-->
Kubernetes 會自動給 Pod 添加針對 `node.kubernetes.io/not-ready` 和
`node.kubernetes.io/unreachable` 的容忍度，且配置 `tolerationSeconds=300`，
除非用戶自身或者某控制器顯式設置此容忍度。

這些自動添加的容忍度意味着 Pod 可以在檢測到對應的問題之一時，在 5
分鐘內保持綁定在該節點上。
{{< /note >}}

<!--
[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) pods are created with
`NoExecute` tolerations for the following taints with no `tolerationSeconds`:

* `node.kubernetes.io/unreachable`
* `node.kubernetes.io/not-ready`

This ensures that DaemonSet pods are never evicted due to these problems.
-->
[DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/) 中的 Pod 被創建時，
針對以下污點自動添加的 `NoExecute` 的容忍度將不會指定 `tolerationSeconds`：

* `node.kubernetes.io/unreachable`
* `node.kubernetes.io/not-ready`

這保證了出現上述問題時 DaemonSet 中的 Pod 永遠不會被驅逐。

{{< note >}}
<!--
The node controller was responsible for adding taints to nodes and evicting pods. But after 1.29,
the taint-based eviction implementation has been moved out of node controller into a separate,
and independent component called taint-eviction-controller. Users can optionally disable taint-based
eviction by setting `--controllers=-taint-eviction-controller` in kube-controller-manager.
-->
在 1.29 之前，節點控制器負責爲節點添加污點並驅逐 Pod。自 1.29 起，
基於污點的驅逐已從節點控制器中抽離，遷移爲一個名爲 taint-eviction-controller 的獨立組件。
用戶如需禁用基於污點的驅逐，可在 kube-controller-manager 中設置 `--controllers=-taint-eviction-controller`。
{{< /note >}}

<!--
## Taint Nodes by Condition

The control plane, using the node {{<glossary_tooltip text="controller" term_id="controller">}},
automatically creates taints with a `NoSchedule` effect for
[node conditions](/docs/concepts/scheduling-eviction/node-pressure-eviction/#node-conditions).
-->
## 基於節點狀態添加污點  {#taint-nodes-by-condition}

控制平面使用節點{{<glossary_tooltip text="控制器" term_id="controller">}}自動創建
與[節點狀況](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/#node-conditions)
對應的、效果爲 `NoSchedule` 的污點。

<!--
The scheduler checks taints, not node conditions, when it makes scheduling
decisions. This ensures that node conditions don't directly affect scheduling.
For example, if the `DiskPressure` node condition is active, the control plane
adds the `node.kubernetes.io/disk-pressure` taint and does not schedule new pods
onto the affected node. If the `MemoryPressure` node condition is active, the
control plane adds the `node.kubernetes.io/memory-pressure` taint.
-->
調度器在進行調度時檢查污點，而不是檢查節點狀況。這確保節點狀況不會直接影響調度。
例如，如果 `DiskPressure` 節點狀況處於活躍狀態，則控制平面添加
`node.kubernetes.io/disk-pressure` 污點並且不會調度新的 Pod 到受影響的節點。
如果 `MemoryPressure` 節點狀況處於活躍狀態，則控制平面添加
`node.kubernetes.io/memory-pressure` 污點。

<!--
You can ignore node conditions for newly created pods by adding the corresponding
Pod tolerations. The control plane also adds the `node.kubernetes.io/memory-pressure`
toleration on pods that have a {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}
other than `BestEffort`. This is because Kubernetes treats pods in the `Guaranteed`
or `Burstable` QoS classes (even pods with no memory request set) as if they are
able to cope with memory pressure, while new `BestEffort` pods are not scheduled
onto the affected node.
-->
對於新創建的 Pod，可以通過添加相應的 Pod 容忍度來忽略節點狀況。
控制平面還在具有除 `BestEffort` 之外的
{{<glossary_tooltip text="QoS 類" term_id="qos-class" >}}的 Pod 上添加
`node.kubernetes.io/memory-pressure` 容忍度。
這是因爲 Kubernetes 將 `Guaranteed` 或 `Burstable` QoS 類中的 Pod（甚至沒有設置內存請求的 Pod）
視爲能夠應對內存壓力，而新創建的 `BestEffort` Pod 不會被調度到受影響的節點上。

<!--
The DaemonSet controller automatically adds the following `NoSchedule`
tolerations to all daemons, to prevent DaemonSets from breaking.

  * `node.kubernetes.io/memory-pressure`
  * `node.kubernetes.io/disk-pressure`
  * `node.kubernetes.io/pid-pressure` (1.14 or later)
  * `node.kubernetes.io/unschedulable` (1.10 or later)
  * `node.kubernetes.io/network-unavailable` (*host network only*)
-->
DaemonSet 控制器自動爲所有守護進程添加如下 `NoSchedule` 容忍度，以防 DaemonSet 崩潰：

* `node.kubernetes.io/memory-pressure`
* `node.kubernetes.io/disk-pressure`
* `node.kubernetes.io/pid-pressure`（1.14 或更高版本）
* `node.kubernetes.io/unschedulable`（1.10 或更高版本）
* `node.kubernetes.io/network-unavailable`（**只適合主機網絡配置**）

<!--
Adding these tolerations ensures backward compatibility. You can also add
arbitrary tolerations to DaemonSets.
-->
添加上述容忍度確保了向後兼容，你也可以選擇自由向 DaemonSet 添加容忍度。

<!--
## Device taints and tolerations

Instead of tainting entire nodes, administrators can also [taint individual devices](/docs/concepts/scheduling-eviction/dynamic-resource-allocation#device-taints-and-tolerations)
when the cluster uses [dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
to manage special hardware. The advantage is that tainting can be targeted towards exactly the hardware that
is faulty or needs maintenance. Tolerations are also supported and can be specified when requesting
devices. Like taints they apply to all pods which share the same allocated device.
-->
## 設備污點與容忍度    {#device-taints-and-tolerations}

在使用[動態資源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation)管理特殊硬件的集羣中，
管理員可以選擇[爲單個設備設置污點](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation#device-taints-and-tolerations)，
而不是爲整個節點打污點。這樣做的好處是，污點可以精確地作用於出現故障或需要維護的硬件。
同時也支持容忍度配置，並且可以在請求設備時指定。
與污點類似，容忍度會應用於共享同一分配設備的所有 Pod。

## {{% heading "whatsnext" %}}

<!--
* Read about [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
  and how you can configure it
* Read about [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
-->
* 閱讀[節點壓力驅逐](/zh-cn/docs/concepts/scheduling-eviction/node-pressure-eviction/)，
  以及如何配置其行爲
* 閱讀 [Pod 優先級](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
