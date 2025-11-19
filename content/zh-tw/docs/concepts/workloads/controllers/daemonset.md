---
title: DaemonSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "DaemonSet"
description: >-
  DaemonSet 定義了提供節點本地設施的 Pod。這些設施可能對於集羣的運行至關重要，例如網絡輔助工具，或者作爲 add-on 的一部分。
content_type: concept
weight: 40
hide_summary: true # 在章節索引中單獨列出
---
<!--
reviewers:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
title: DaemonSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "DaemonSet"
description: >-
 A DaemonSet defines Pods that provide node-local facilities. These might be fundamental to the operation of your cluster, such as a networking helper tool, or be part of an add-on.
content_type: concept
weight: 40
hide_summary: true # Listed separately in section index
--->

<!-- overview -->

<!--
A _DaemonSet_ ensures that all (or some) Nodes run a copy of a Pod.  As nodes are added to the
cluster, Pods are added to them.  As nodes are removed from the cluster, those Pods are garbage
collected.  Deleting a DaemonSet will clean up the Pods it created.
--->
**DaemonSet** 確保全部（或者某些）節點上運行一個 Pod 的副本。
當有節點加入集羣時， 也會爲他們新增一個 Pod 。
當有節點從集羣移除時，這些 Pod 也會被回收。刪除 DaemonSet 將會刪除它創建的所有 Pod。

<!--
Some typical uses of a DaemonSet are:

- running a cluster storage daemon on every node
- running a logs collection daemon on every node
- running a node monitoring daemon on every node
-->
DaemonSet 的一些典型用法：

- 在每個節點上運行集羣守護進程
- 在每個節點上運行日誌收集守護進程
- 在每個節點上運行監控守護進程

<!--
In a simple case, one DaemonSet, covering all nodes, would be used for each type of daemon.
A more complex setup might use multiple DaemonSets for a single type of daemon, but with
different flags and/or different memory and cpu requests for different hardware types.
-->
一種簡單的用法是爲每種類型的守護進程在所有的節點上都啓動一個 DaemonSet。
一個稍微複雜的用法是爲同一種守護進程部署多個 DaemonSet；每個具有不同的標誌，
並且對不同硬件類型具有不同的內存、CPU 要求。

<!-- body -->

<!--
## Writing a DaemonSet Spec

### Create a DaemonSet
-->
## 編寫 DaemonSet 規約   {#writing-a-daemonset-spec}

### 創建 DaemonSet   {#create-a-daemonset}

<!--
You can describe a DaemonSet in a YAML file. For example, the `daemonset.yaml` file below
describes a DaemonSet that runs the fluentd-elasticsearch Docker image:
-->
你可以在 YAML 文件中描述 DaemonSet。
例如，下面的 `daemonset.yaml` 文件描述了一個運行 fluentd-elasticsearch Docker 鏡像的 DaemonSet：

{{% code_sample file="controllers/daemonset.yaml" %}}

<!--
Create a DaemonSet based on the YAML file:
-->
基於 YAML 文件創建 DaemonSet：

```shell
kubectl apply -f https://k8s.io/examples/controllers/daemonset.yaml
```

<!--
### Required Fields

As with all other Kubernetes config, a DaemonSet needs `apiVersion`, `kind`, and `metadata` fields.  For
general information about working with config files, see
[running stateless applications](/docs/tasks/run-application/run-stateless-application-deployment/)
and [object management using kubectl](/docs/concepts/overview/working-with-objects/object-management/).

The name of a DaemonSet object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

A DaemonSet also needs a
[`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
section.
-->
### 必需字段   {#required-fields}

與所有其他 Kubernetes 配置一樣，DaemonSet 也需要 `apiVersion`、`kind` 和 `metadata` 字段。
有關使用這些配置文件的通用信息，
參見[運行無狀態應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)和[使用 kubectl 管理對象](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)。

DaemonSet 對象的名稱必須是一個合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

DaemonSet 也需要
[`.spec` 部分](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。

<!--
### Pod Template

The `.spec.template` is one of the required fields in `.spec`.

The `.spec.template` is a [pod template](/docs/concepts/workloads/pods/#pod-templates).
It has exactly the same schema as a {{< glossary_tooltip text="Pod" term_id="pod" >}},
except it is nested and does not have an `apiVersion` or `kind`.

In addition to required fields for a Pod, a Pod template in a DaemonSet has to specify appropriate
labels (see [pod selector](#pod-selector)).

A Pod Template in a DaemonSet must have a [`RestartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
 equal to `Always`, or be unspecified, which defaults to `Always`.
-->
### Pod 模板   {#pod-template}

`.spec` 中唯一必需的字段是 `.spec.template`。

`.spec.template` 是一個 [Pod 模板](/zh-cn/docs/concepts/workloads/pods/#pod-templates)。
除了它是嵌套的，因而不具有 `apiVersion` 或 `kind` 字段之外，它與
{{< glossary_tooltip text="Pod" term_id="pod" >}} 具有相同的模式。

除了 Pod 必需字段外，在 DaemonSet 中的 Pod 模板必須指定合理的標籤（查看 [Pod 選擇算符](#pod-selector)）。

在 DaemonSet 中的 Pod 模板必須具有一個值爲 `Always` 的
[`RestartPolicy`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)。
當該值未指定時，默認是 `Always`。

<!--
### Pod Selector

The `.spec.selector` field is a pod selector.  It works the same as the `.spec.selector` of
a [Job](/docs/concepts/workloads/controllers/job/).

You must specify a pod selector that matches the labels of the
`.spec.template`.
Also, once a DaemonSet is created,
its `.spec.selector` can not be mutated. Mutating the pod selector can lead to the
unintentional orphaning of Pods, and it was found to be confusing to users.
-->
### Pod 選擇算符     {#pod-selector}

`.spec.selector` 字段表示 Pod 選擇算符，它與
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的 `.spec.selector` 的作用是相同的。

你必須指定與 `.spec.template` 的標籤匹配的 Pod 選擇算符。
此外，一旦創建了 DaemonSet，它的 `.spec.selector` 就不能修改。
修改 Pod 選擇算符可能導致 Pod 意外懸浮，並且這對用戶來說是費解的。

<!--
The `.spec.selector` is an object consisting of two fields:
-->
`spec.selector` 是一個對象，如下兩個字段組成：

<!--
* `matchLabels` - works the same as the `.spec.selector` of a
  [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).
* `matchExpressions` - allows to build more sophisticated selectors by specifying key,
  list of values and an operator that relates the key and values.
-->
* `matchLabels` - 與 [ReplicationController](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/)
  的 `.spec.selector` 的作用相同。
* `matchExpressions` - 允許構建更加複雜的選擇算符，可以通過指定 key、value
  列表以及將 key 和 value 列表關聯起來的 Operator。

<!--
When the two are specified the result is ANDed.
-->
當上述兩個字段都指定時，結果會按邏輯與（AND）操作處理。

<!--
The `.spec.selector` must match the `.spec.template.metadata.labels`.
Config with these two not matching will be rejected by the API.
-->
`.spec.selector` 必須與 `.spec.template.metadata.labels` 相匹配。
如果配置中這兩個字段不匹配，則會被 API 拒絕。

<!--
### Running Pods on select Nodes

If you specify a `.spec.template.spec.nodeSelector`, then the DaemonSet controller will
create Pods on nodes which match that [node selector](/docs/concepts/scheduling-eviction/assign-pod-node/).
Likewise if you specify a `.spec.template.spec.affinity`,
then DaemonSet controller will create Pods on nodes which match that
[node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/).
If you do not specify either, then the DaemonSet controller will create Pods on all nodes.
-->
### 在選定的節點上運行 Pod   {#running-pods-on-select-nodes}

如果指定了 `.spec.template.spec.nodeSelector`，DaemonSet 控制器將在能夠與
[Node 選擇算符](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)匹配的節點上創建 Pod。
類似這種情況，可以指定 `.spec.template.spec.affinity`，之後 DaemonSet
控制器將在能夠與[節點親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)匹配的節點上創建 Pod。
如果根本就沒有指定，則 DaemonSet Controller 將在所有節點上創建 Pod。

<!--
## How Daemon Pods are scheduled
-->
## Daemon Pod 是如何被調度的   {#how-daemon-pods-are-scheduled}

<!--
A DaemonSet can be used to ensure that all eligible nodes run a copy of a Pod.
The DaemonSet controller creates a Pod for each eligible node and adds the
`spec.affinity.nodeAffinity` field of the Pod to match the target host. After
the Pod is created, the default scheduler typically takes over and then binds
the Pod to the target host by setting the `.spec.nodeName` field.  If the new
Pod cannot fit on the node, the default scheduler may preempt (evict) some of
the existing Pods based on the
[priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority)
of the new Pod.
-->
DaemonSet 可用於確保所有符合條件的節點都運行該 Pod 的一個副本。
DaemonSet 控制器爲每個符合條件的節點創建一個 Pod，並添加 Pod 的 `spec.affinity.nodeAffinity`
字段以匹配目標主機。Pod 被創建之後，默認的調度程序通常通過設置 `.spec.nodeName` 字段來接管 Pod 並將
Pod 綁定到目標主機。如果新的 Pod 無法放在節點上，則默認的調度程序可能會根據新 Pod
的[優先級](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority)搶佔
（驅逐）某些現存的 Pod。

{{< note >}}
<!--
If it's important that the DaemonSet pod run on each node, it's often desirable
to set the `.spec.template.spec.priorityClassName` of the DaemonSet to a
[PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
with a higher priority to ensure that this eviction occurs.
-->
當 DaemonSet 中的 Pod 必須運行在每個節點上時，通常需要將 DaemonSet
的 `.spec.template.spec.priorityClassName` 設置爲具有更高優先級的
[PriorityClass](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)，
以確保可以完成驅逐。
{{< /note >}}

<!--
The user can specify a different scheduler for the Pods of the DaemonSet, by
setting the `.spec.template.spec.schedulerName` field of the DaemonSet.

The original node affinity specified at the
`.spec.template.spec.affinity.nodeAffinity` field (if specified) is taken into
consideration by the DaemonSet controller when evaluating the eligible nodes,
but is replaced on the created Pod with the node affinity that matches the name
of the eligible node.
-->
用戶通過設置 DaemonSet 的 `.spec.template.spec.schedulerName` 字段，可以爲 DaemonSet
的 Pod 指定不同的調度程序。

當評估符合條件的節點時，原本在 `.spec.template.spec.affinity.nodeAffinity` 字段上指定的節點親和性將由
DaemonSet 控制器進行考量，但在創建的 Pod 上會被替換爲與符合條件的節點名稱匹配的節點親和性。

<!--
`ScheduleDaemonSetPods` allows you to schedule DaemonSets using the default
scheduler instead of the DaemonSet controller, by adding the `NodeAffinity` term
to the DaemonSet pods, instead of the `.spec.nodeName` term. The default
scheduler is then used to bind the pod to the target host. If node affinity of
the DaemonSet pod already exists, it is replaced (the original node affinity was
taken into account before selecting the target host). The DaemonSet controller only
performs these operations when creating or modifying DaemonSet pods, and no
changes are made to the `spec.template` of the DaemonSet.
-->
`ScheduleDaemonSetPods` 允許你使用默認調度器而不是 DaemonSet 控制器來調度這些 DaemonSet，
方法是將 `NodeAffinity` 條件而不是 `.spec.nodeName` 條件添加到這些 DaemonSet Pod。
默認調度器接下來將 Pod 綁定到目標主機。
如果 DaemonSet Pod 的節點親和性配置已存在，則被替換
（原始的節點親和性配置在選擇目標主機之前被考慮）。
DaemonSet 控制器僅在創建或修改 DaemonSet Pod 時執行這些操作，
並且不會更改 DaemonSet 的 `spec.template`。

```yaml
nodeAffinity:
  requiredDuringSchedulingIgnoredDuringExecution:
    nodeSelectorTerms:
    - matchFields:
      - key: metadata.name
        operator: In
        values:
        - target-host-name
```

<!--
### Taints and tolerations

The DaemonSet controller automatically adds a set of {{< glossary_tooltip
text="tolerations" term_id="toleration" >}} to DaemonSet Pods:
-->
### 污點和容忍度   {#taints-and-tolerations}

DaemonSet 控制器會自動將一組容忍度添加到 DaemonSet Pod：

<!--
Tolerations for DaemonSet pods
-->
{{< table caption="DaemonSet Pod 適用的容忍度" >}}

<!--
| Toleration key                                                                                                        | Effect       | Details                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [`node.kubernetes.io/not-ready`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-not-ready)             | `NoExecute`  | DaemonSet Pods can be scheduled onto nodes that are not healthy or ready to accept Pods. Any DaemonSet Pods running on such nodes will not be evicted. |
| [`node.kubernetes.io/unreachable`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-unreachable)         | `NoExecute`  | DaemonSet Pods can be scheduled onto nodes that are unreachable from the node controller. Any DaemonSet Pods running on such nodes will not be evicted. |
| [`node.kubernetes.io/disk-pressure`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-disk-pressure)     | `NoSchedule` | DaemonSet Pods can be scheduled onto nodes with disk pressure issues.                                                                         |
| [`node.kubernetes.io/memory-pressure`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-memory-pressure) | `NoSchedule` | DaemonSet Pods can be scheduled onto nodes with memory pressure issues.                                                                        |
| [`node.kubernetes.io/pid-pressure`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-pid-pressure) | `NoSchedule` | DaemonSet Pods can be scheduled onto nodes with process pressure issues.                                                                        |
| [`node.kubernetes.io/unschedulable`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-unschedulable)   | `NoSchedule` | DaemonSet Pods can be scheduled onto nodes that are unschedulable.                                                                            |
| [`node.kubernetes.io/network-unavailable`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-network-unavailable) | `NoSchedule` | **Only added for DaemonSet Pods that request host networking**, i.e., Pods having `spec.hostNetwork: true`. Such DaemonSet Pods can be scheduled onto nodes with unavailable network.|
-->
| 容忍度鍵名                                                | 效果       | 描述                    |
| -------------------------------------------------------- | ---------- | ----------------------- |
| [`node.kubernetes.io/not-ready`](/zh-cn/docs/reference/labels-annotations-taints/#node-kubernetes-io-not-ready) | `NoExecute`  | DaemonSet Pod 可以被調度到不健康或還不準備接受 Pod 的節點上。在這些節點上運行的所有 DaemonSet Pod 將不會被驅逐。 |
| [`node.kubernetes.io/unreachable`](/zh-cn/docs/reference/labels-annotations-taints/#node-kubernetes-io-unreachable)  | `NoExecute`  | DaemonSet Pod 可以被調度到從節點控制器不可達的節點上。在這些節點上運行的所有 DaemonSet Pod 將不會被驅逐。 |
| [`node.kubernetes.io/disk-pressure`](/zh-cn/docs/reference/labels-annotations-taints/#node-kubernetes-io-disk-pressure) | `NoSchedule` | DaemonSet Pod 可以被調度到具有磁盤壓力問題的節點上。   |
| [`node.kubernetes.io/memory-pressure`](/zh-cn/docs/reference/labels-annotations-taints/#node-kubernetes-io-memory-pressure) | `NoSchedule` | DaemonSet Pod 可以被調度到具有內存壓力問題的節點上。 |
| [`node.kubernetes.io/pid-pressure`](/zh-cn/docs/reference/labels-annotations-taints/#node-kubernetes-io-pid-pressure) | `NoSchedule` | DaemonSet Pod 可以被調度到具有進程壓力問題的節點上。 |
| [`node.kubernetes.io/unschedulable`](/zh-cn/docs/reference/labels-annotations-taints/#node-kubernetes-io-unschedulable) | `NoSchedule` | DaemonSet Pod 可以被調度到不可調度的節點上。 |
| [`node.kubernetes.io/network-unavailable`](/zh-cn/docs/reference/labels-annotations-taints/#node-kubernetes-io-network-unavailable) | `NoSchedule` | **僅針對請求主機聯網的 DaemonSet Pod 添加此容忍度**，即 Pod 具有 `spec.hostNetwork: true`。這些 DaemonSet Pod 可以被調度到網絡不可用的節點上。|

{{< /table >}}

<!--
You can add your own tolerations to the Pods of a DaemonSet as well, by
defining these in the Pod template of the DaemonSet.

Because the DaemonSet controller sets the
`node.kubernetes.io/unschedulable:NoSchedule` toleration automatically,
Kubernetes can run DaemonSet Pods on nodes that are marked as _unschedulable_.
-->
你也可以在 DaemonSet 的 Pod 模板中定義自己的容忍度並將其添加到 DaemonSet Pod。

因爲 DaemonSet 控制器自動設置 `node.kubernetes.io/unschedulable:NoSchedule` 容忍度，
所以 Kubernetes 可以在標記爲**不可調度**的節點上運行 DaemonSet Pod。

<!--
If you use a DaemonSet to provide an important node-level function, such as
[cluster networking](/docs/concepts/cluster-administration/networking/), it is
helpful that Kubernetes places DaemonSet Pods on nodes before they are ready.
For example, without that special toleration, you could end up in a deadlock
situation where the node is not marked as ready because the network plugin is
not running there, and at the same time the network plugin is not running on
that node because the node is not yet ready.
-->
如果你使用 DaemonSet 提供重要的節點級別功能，
例如[集羣聯網](/zh-cn/docs/concepts/cluster-administration/networking/)，
Kubernetes 在節點就緒之前將 DaemonSet Pod 放到節點上會很有幫助。
例如，如果沒有這種特殊的容忍度，因爲網絡插件未在節點上運行，所以你可能會在未標記爲就緒的節點上陷入死鎖狀態，
同時因爲該節點還未就緒，所以網絡插件不會在該節點上運行。

<!--
## Communicating with Daemon Pods
-->
## 與 Daemon Pod 通信   {#communicating-with-daemon-pods}

<!--
Some possible patterns for communicating with Pods in a DaemonSet are:

- **Push**: Pods in the DaemonSet are configured to send updates to another service, such
  as a stats database.  They do not have clients.
- **NodeIP and Known Port**: Pods in the DaemonSet can use a `hostPort`, so that the pods
  are reachable via the node IPs.
  Clients know the list of node IPs somehow, and know the port by convention.
- **DNS**: Create a [headless service](/docs/concepts/services-networking/service/#headless-services)
  with the same pod selector, and then discover DaemonSets using the `endpoints`
  resource or retrieve multiple A records from DNS.
- **Service**: Create a service with the same Pod selector, and use the service to reach a
  daemon on a random node. Use [Service Internal Traffic Policy](/docs/concepts/services-networking/service-traffic-policy/)
  to limit to pods on the same node.
-->
與 DaemonSet 中的 Pod 進行通信的幾種可能模式如下：

- **推送（Push）**：配置 DaemonSet 中的 Pod，將更新發送到另一個服務，例如統計數據庫。
  這些服務沒有客戶端。

- **NodeIP 和已知端口**：DaemonSet 中的 Pod 可以使用 `hostPort`，從而可以通過節點 IP
  訪問到 Pod。客戶端能通過某種方法獲取節點 IP 列表，並且基於此也可以獲取到相應的端口。

- **DNS**：創建具有相同 Pod 選擇算符的[無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)，
  通過使用 `endpoints` 資源或從 DNS 中檢索到多個 A 記錄來發現 DaemonSet。

- **Service**：創建具有相同 Pod 選擇算符的服務，並使用該服務隨機訪問到某個節點上的守護進程。
  使用 [Service 內部流量策略](/zh-cn/docs/concepts/services-networking/service-traffic-policy/)限制同一節點上的 Pod。

<!--
## Updating a DaemonSet

If node labels are changed, the DaemonSet will promptly add Pods to newly matching nodes and delete
Pods from newly not-matching nodes.

You can modify the Pods that a DaemonSet creates.  However, Pods do not allow all
fields to be updated.  Also, the DaemonSet controller will use the original template the next
time a node (even with the same name) is created.
-->
## 更新 DaemonSet   {#updating-a-daemonset}

如果節點的標籤被修改，DaemonSet 將立刻向新匹配上的節點添加 Pod，
同時刪除不匹配的節點上的 Pod。

你可以修改 DaemonSet 創建的 Pod。不過並非 Pod 的所有字段都可更新。
下次當某節點（即使具有相同的名稱）被創建時，DaemonSet 控制器還會使用最初的模板。

<!--
You can delete a DaemonSet.  If you specify `--cascade=orphan` with `kubectl`, then the Pods
will be left on the nodes.  If you subsequently create a new DaemonSet with the same selector,
the new DaemonSet adopts the existing Pods. If any Pods need replacing the DaemonSet replaces
them according to its `updateStrategy`.

You can [perform a rolling update](/docs/tasks/manage-daemon/update-daemon-set/) on a DaemonSet.
-->
你可以刪除一個 DaemonSet。如果使用 `kubectl` 並指定 `--cascade=orphan` 選項，
則 Pod 將被保留在節點上。接下來如果創建使用相同選擇算符的新 DaemonSet，
新的 DaemonSet 會收養已有的 Pod。
如果有 Pod 需要被替換，DaemonSet 會根據其 `updateStrategy` 來替換。

你可以對 DaemonSet [執行滾動更新](/zh-cn/docs/tasks/manage-daemon/update-daemon-set/)操作。

<!--
## Alternatives to DaemonSet

### Init scripts
-->
## DaemonSet 的替代方案   {#alternatives-to-daemonset}

### init 腳本   {#init-scripts}

<!--
It is certainly possible to run daemon processes by directly starting them on a node (e.g. using
`init`, `upstartd`, or `systemd`).  This is perfectly fine.  However, there are several advantages to
running such processes via a DaemonSet:

- Ability to monitor and manage logs for daemons in the same way as applications.
- Same config language and tools (e.g. Pod templates, `kubectl`) for daemons and applications.
- Running daemons in containers with resource limits increases isolation between daemons from app
  containers.  However, this can also be accomplished by running the daemons in a container but not in a Pod.
-->
直接在節點上啓動守護進程（例如使用 `init`、`upstartd` 或 `systemd`）的做法當然是可行的。
不過，基於 DaemonSet 來運行這些進程有如下一些好處：

- 像所運行的其他應用一樣，DaemonSet 具備爲守護進程提供監控和日誌管理的能力。

- 爲守護進程和應用所使用的配置語言和工具（如 Pod 模板、`kubectl`）是相同的。

- 在資源受限的容器中運行守護進程能夠增加守護進程和應用容器的隔離性。
  然而，這一點也可以通過在容器中運行守護進程但卻不在 Pod 中運行之來實現。

<!--
### Bare Pods

It is possible to create Pods directly which specify a particular node to run on.  However,
a DaemonSet replaces Pods that are deleted or terminated for any reason, such as in the case of
node failure or disruptive node maintenance, such as a kernel upgrade. For this reason, you should
use a DaemonSet rather than creating individual Pods.
-->
### 裸 Pod   {#bare-pods}

直接創建 Pod並指定其運行在特定的節點上也是可以的。
然而，DaemonSet 能夠替換由於任何原因（例如節點失敗、例行節點維護、內核升級）
而被刪除或終止的 Pod。
由於這個原因，你應該使用 DaemonSet 而不是單獨創建 Pod。

<!--
### Static Pods

It is possible to create Pods by writing a file to a certain directory watched by Kubelet.  These
are called [static pods](/docs/tasks/configure-pod-container/static-pod/).
Unlike DaemonSet, static Pods cannot be managed with kubectl
or other Kubernetes API clients.  Static Pods do not depend on the apiserver, making them useful
in cluster bootstrapping cases.  Also, static Pods may be deprecated in the future.
-->
### 靜態 Pod   {#static-pods}

通過在一個指定的、受 kubelet 監視的目錄下編寫文件來創建 Pod 也是可行的。
這類 Pod 被稱爲[靜態 Pod](/zh-cn/docs/tasks/configure-pod-container/static-pod/)。
不像 DaemonSet，靜態 Pod 不受 kubectl 和其它 Kubernetes API 客戶端管理。
靜態 Pod 不依賴於 API 服務器，這使得它們在啓動引導新集羣的情況下非常有用。
此外，靜態 Pod 在將來可能會被廢棄。

<!--
### Deployments

DaemonSets are similar to [Deployments](/docs/concepts/workloads/controllers/deployment/) in that
they both create Pods, and those Pods have processes which are not expected to terminate (e.g. web servers,
storage servers).

Use a Deployment for stateless services, like frontends, where scaling up and down the
number of replicas and rolling out updates are more important than controlling exactly which host
the Pod runs on.  Use a DaemonSet when it is important that a copy of a Pod always run on
all or certain hosts, if the DaemonSet provides node-level functionality that allows other Pods to run correctly on that particular node.

For example, [network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
often include a component that runs as a DaemonSet. The DaemonSet component makes sure
that the node where it's running has working cluster networking.
-->
### Deployment {#deployments}

DaemonSet 與 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 非常類似，
它們都能創建 Pod，並且 Pod 中的進程都不希望被終止（例如，Web 服務器、存儲服務器）。

建議爲無狀態的服務使用 Deployment，比如前端服務。
對這些服務而言，對副本的數量進行擴縮容、平滑升級，比精確控制 Pod 運行在某個主機上要重要得多。
當需要 Pod 副本總是運行在全部或特定主機上，並且當該 DaemonSet 提供了節點級別的功能（允許其他 Pod 在該特定節點上正確運行）時，
應該使用 DaemonSet。

例如，[網絡插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)通常包含一個以
DaemonSet 運行的組件。這個 DaemonSet 組件確保它所在的節點的集羣網絡正常工作。

## {{% heading "whatsnext" %}}

<!--
* Learn about [Pods](/docs/concepts/workloads/pods):
  * Learn about [static Pods](/docs/tasks/configure-pod-container/static-pod/), which are useful for running Kubernetes
    {{< glossary_tooltip text="control plane" term_id="control-plane" >}} components.
* Find out how to use DaemonSets:
  * [Perform a rolling update on a DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).
  * [Perform a rollback on a DaemonSet](/docs/tasks/manage-daemon/rollback-daemon-set/)
    (for example, if a roll out didn't work how you expected).
* Understand [how Kubernetes assigns Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/).
* Learn about [device plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) and
  [add ons](/docs/concepts/cluster-administration/addons/), which often run as DaemonSets.
* `DaemonSet` is a top-level resource in the Kubernetes REST API.
  Read the {{< api-reference page="workload-resources/daemon-set-v1" >}}
  object definition to understand the API for daemon sets.
-->
* 瞭解 [Pod](/zh-cn/docs/concepts/workloads/pods):
  * 瞭解[靜態 Pod](/zh-cn/docs/tasks/configure-pod-container/static-pod/)，這對運行 Kubernetes
    {{< glossary_tooltip text="控制面" term_id="control-plane" >}}組件有幫助。
* 瞭解如何使用 DaemonSet:
  * [對 DaemonSet 執行滾動更新](/zh-cn/docs/tasks/manage-daemon/update-daemon-set/)。
  * [對 DaemonSet 執行回滾](/zh-cn/docs/tasks/manage-daemon/rollback-daemon-set/)（例如：新的版本沒有達到你的預期）
* 理解 [Kubernetes 如何將 Pod 分配給節點](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)。
* 瞭解[設備插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)和
  [擴展（Addons）](/zh-cn/docs/concepts/cluster-administration/addons/)，它們常以 DaemonSet 運行。
* `DaemonSet` 是 Kubernetes REST API 中的頂級資源。閱讀 {{< api-reference page="workload-resources/daemon-set-v1" >}}
   對象定義理解關於該資源的 API。
