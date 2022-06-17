---
title: DaemonSet
content_type: concept
weight: 50
---

<!--
title: DaemonSet
content_type: concept
weight: 50
--->

<!-- overview -->

<!--
A _DaemonSet_ ensures that all (or some) Nodes run a copy of a Pod.  As nodes are added to the
cluster, Pods are added to them.  As nodes are removed from the cluster, those Pods are garbage
collected.  Deleting a DaemonSet will clean up the Pods it created.
--->
_DaemonSet_ 確保全部（或者某些）節點上執行一個 Pod 的副本。
當有節點加入叢集時， 也會為他們新增一個 Pod 。
當有節點從叢集移除時，這些 Pod 也會被回收。刪除 DaemonSet 將會刪除它建立的所有 Pod。

<!--
Some typical uses of a DaemonSet are:

- running a cluster storage daemon on every node
- running a logs collection daemon on every node
- running a node monitoring daemon on every node
-->
DaemonSet 的一些典型用法：

- 在每個節點上執行叢集守護程序
- 在每個節點上執行日誌收集守護程序
- 在每個節點上執行監控守護程序

<!--
In a simple case, one DaemonSet, covering all nodes, would be used for each type of daemon.
A more complex setup might use multiple DaemonSets for a single type of daemon, but with
different flags and/or different memory and cpu requests for different hardware types.
-->
一種簡單的用法是為每種型別的守護程序在所有的節點上都啟動一個 DaemonSet。
一個稍微複雜的用法是為同一種守護程序部署多個 DaemonSet；每個具有不同的標誌，
並且對不同硬體型別具有不同的記憶體、CPU 要求。

<!-- body -->

<!--
## Writing a DaemonSet Spec

### Create a DaemonSet
-->
## 編寫 DaemonSet Spec   {#writing-a-daemon-set-spec}

### 建立 DaemonSet   {#create-a-daemon-set}

<!--
You can describe a DaemonSet in a YAML file. For example, the `daemonset.yaml` file below
describes a DaemonSet that runs the fluentd-elasticsearch Docker image:
-->
你可以在 YAML 檔案中描述 DaemonSet。
例如，下面的 daemonset.yaml 檔案描述了一個執行 fluentd-elasticsearch Docker 映象的 DaemonSet：

{{< codenew file="controllers/daemonset.yaml" >}}

<!--
Create a DaemonSet based on the YAML file:
-->
基於 YAML 檔案建立 DaemonSet：

```
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
### 必需欄位   {#required-fields}

和所有其他 Kubernetes 配置一樣，DaemonSet 需要 `apiVersion`、`kind` 和 `metadata` 欄位。
有關配置檔案的基本資訊，參見
[部署應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)、
[配置容器](/zh-cn/docs/tasks/)和
[使用 kubectl 進行物件管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)
文件。

DaemonSet 物件的名稱必須是一個合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

DaemonSet 也需要一個 [`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) 配置段。

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

`.spec` 中唯一必需的欄位是 `.spec.template`。

`.spec.template` 是一個 [Pod 模板](/zh-cn/docs/concepts/workloads/pods/#pod-templates)。
除了它是巢狀的，因而不具有 `apiVersion` 或 `kind` 欄位之外，它與
{{< glossary_tooltip text="Pod" term_id="pod" >}} 具有相同的 schema。

除了 Pod 必需欄位外，在 DaemonSet 中的 Pod 模板必須指定合理的標籤（檢視 [Pod 選擇算符](#pod-selector)）。

在 DaemonSet 中的 Pod 模板必須具有一個值為 `Always` 的
[`RestartPolicy`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)。
當該值未指定時，預設是 `Always`。

<!--
### Pod Selector

The `.spec.selector` field is a pod selector.  It works the same as the `.spec.selector` of
a [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/).

You must specify a pod selector that matches the labels of the
`.spec.template`.
Also, once a DaemonSet is created,
its `.spec.selector` can not be mutated. Mutating the pod selector can lead to the
unintentional orphaning of Pods, and it was found to be confusing to users.
-->
### Pod 選擇算符     {#pod-selector}

`.spec.selector` 欄位表示 Pod 選擇算符，它與
[Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的 `.spec.selector` 的作用是相同的。

你必須指定與 `.spec.template` 的標籤匹配的 Pod 選擇算符。
此外，一旦建立了 DaemonSet，它的 `.spec.selector` 就不能修改。
修改 Pod 選擇算符可能導致 Pod 意外懸浮，並且這對使用者來說是費解的。

<!--
The `.spec.selector` is an object consisting of two fields:
-->
`spec.selector` 是一個物件，如下兩個欄位組成：

<!--
* `matchLabels` - works the same as the `.spec.selector` of a
  [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).
* `matchExpressions` - allows to build more sophisticated selectors by specifying key,
  list of values and an operator that relates the key and values.
-->
* `matchLabels` - 與 [ReplicationController](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/)
  的 `.spec.selector` 的作用相同。
* `matchExpressions` - 允許構建更加複雜的選擇器，可以透過指定 key、value
  列表以及將 key 和 value 列表關聯起來的 operator。

<!--
When the two are specified the result is ANDed.
-->
當上述兩個欄位都指定時，結果會按邏輯與（AND）操作處理。

<!--
The `.spec.selector` must match the `.spec.template.metadata.labels`.
Config with these two not matching will be rejected by the API.
-->
`.spec.selector` 必須與 `.spec.template.metadata.labels` 相匹配。
如果配置中這兩個欄位不匹配，則會被 API 拒絕。

<!--
### Running Pods on Only Some Nodes

If you specify a `.spec.template.spec.nodeSelector`, then the DaemonSet controller will
create Pods on nodes which match that [node selector](/docs/concepts/scheduling-eviction/assign-pod-node/).
Likewise if you specify a `.spec.template.spec.affinity`,
then DaemonSet controller will create Pods on nodes which match that
[node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/).
If you do not specify either, then the DaemonSet controller will create Pods on all nodes.
-->
### 僅在某些節點上執行 Pod   {#running-pods-on-only-some-nodes}

如果指定了 `.spec.template.spec.nodeSelector`，DaemonSet 控制器將在能夠與
[Node 選擇算符](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/) 匹配的節點上建立 Pod。
類似這種情況，可以指定 `.spec.template.spec.affinity`，之後 DaemonSet 控制器
將在能夠與[節點親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)
匹配的節點上建立 Pod。
如果根本就沒有指定，則 DaemonSet Controller 將在所有節點上建立 Pod。

<!--
## How Daemon Pods are Scheduled

### Scheduled by default scheduler
-->
## Daemon Pods 是如何被排程的   {#how-daemon-pods-are-scheduled}

### 透過預設排程器排程   {#scheduled-by-default-scheduler}

{{< feature-state for_k8s_version="1.17" state="stable" >}}

<!--
A DaemonSet ensures that all eligible nodes run a copy of a Pod. Normally, the
node that a Pod runs on is selected by the Kubernetes scheduler. However,
DaemonSet pods are created and scheduled by the DaemonSet controller instead.
That introduces the following issues:

* Inconsistent Pod behavior: Normal Pods waiting to be scheduled are created
  and in `Pending` state, but DaemonSet pods are not created in `Pending`
  state. This is confusing to the user.
* [Pod preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
  is handled by default scheduler. When preemption is enabled, the DaemonSet controller
  will make scheduling decisions without considering pod priority and preemption.
-->
DaemonSet 確保所有符合條件的節點都執行該 Pod 的一個副本。
通常，執行 Pod 的節點由 Kubernetes 排程器選擇。
不過，DaemonSet Pods 由 DaemonSet 控制器建立和排程。這就帶來了以下問題：

* Pod 行為的不一致性：正常 Pod 在被建立後等待排程時處於 `Pending` 狀態，
  DaemonSet Pods 建立後不會處於 `Pending` 狀態下。這使使用者感到困惑。
* [Pod 搶佔](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
  由預設排程器處理。啟用搶佔後，DaemonSet 控制器將在不考慮 Pod 優先順序和搶佔
  的情況下制定排程決策。

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
`ScheduleDaemonSetPods` 允許你使用預設排程器而不是 DaemonSet 控制器來排程 DaemonSets，
方法是將 `NodeAffinity` 條件而不是 `.spec.nodeName` 條件新增到 DaemonSet Pods。
預設排程器接下來將 Pod 繫結到目標主機。
如果 DaemonSet Pod 的節點親和性配置已存在，則被替換
（原始的節點親和性配置在選擇目標主機之前被考慮）。
DaemonSet 控制器僅在建立或修改 DaemonSet Pod 時執行這些操作，
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
In addition, `node.kubernetes.io/unschedulable:NoSchedule` toleration is added
automatically to DaemonSet Pods. The default scheduler ignores
`unschedulable` Nodes when scheduling DaemonSet Pods.
-->
此外，系統會自動新增 `node.kubernetes.io/unschedulable：NoSchedule` 容忍度到
DaemonSet Pods。在排程 DaemonSet Pod 時，預設排程器會忽略 `unschedulable` 節點。

<!--
### Taints and Tolerations

Although Daemon Pods respect
[taints and tolerations](/docs/concepts/configuration/taint-and-toleration),
the following tolerations are added to DaemonSet Pods automatically according to
the related features.
-->
### 汙點和容忍度   {#taint-and-toleration}

儘管 Daemon Pods 遵循[汙點和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration)
規則，根據相關特性，控制器會自動將以下容忍度新增到 DaemonSet Pod：

| 容忍度鍵名                               | 效果       | 版本    | 描述                                                         |
| ---------------------------------------- | ---------- | ------- | ------------------------------------------------------------ |
| `node.kubernetes.io/not-ready`           | NoExecute  | 1.13+   | 當出現類似網路斷開的情況導致節點問題時，DaemonSet Pod 不會被逐出。 |
| `node.kubernetes.io/unreachable`         | NoExecute  | 1.13+   | 當出現類似於網路斷開的情況導致節點問題時，DaemonSet Pod 不會被逐出。 |
| `node.kubernetes.io/disk-pressure`       | NoSchedule | 1.8+    | DaemonSet Pod 被預設排程器排程時能夠容忍磁碟壓力屬性。 |
| `node.kubernetes.io/memory-pressure`     | NoSchedule | 1.8+    | DaemonSet Pod 被預設排程器排程時能夠容忍記憶體壓力屬性。 |
| `node.kubernetes.io/unschedulable`       | NoSchedule | 1.12+   | DaemonSet Pod 能夠容忍預設排程器所設定的 `unschedulable` 屬性.  |
| `node.kubernetes.io/network-unavailable` | NoSchedule | 1.12+   | DaemonSet 在使用宿主網路時，能夠容忍預設排程器所設定的 `network-unavailable` 屬性。 |

<!--
## Communicating with Daemon Pods
-->

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
  daemon on a random node. (No way to reach specific node.)
-->
## 與 Daemon Pods 通訊   {#communicating-with-daemon-pods}

與 DaemonSet 中的 Pod 進行通訊的幾種可能模式如下：

- **推送（Push）**：配置 DaemonSet 中的 Pod，將更新發送到另一個服務，例如統計資料庫。
  這些服務沒有客戶端。

- **NodeIP 和已知埠**：DaemonSet 中的 Pod 可以使用 `hostPort`，從而可以透過節點 IP
  訪問到 Pod。客戶端能透過某種方法獲取節點 IP 列表，並且基於此也可以獲取到相應的埠。

- **DNS**：建立具有相同 Pod 選擇算符的
  [無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)，
  透過使用 `endpoints` 資源或從 DNS 中檢索到多個 A 記錄來發現 DaemonSet。

- **Service**：建立具有相同 Pod 選擇算符的服務，並使用該服務隨機訪問到某個節點上的
  守護程序（沒有辦法訪問到特定節點）。

<!--
## Updating a DaemonSet

If node labels are changed, the DaemonSet will promptly add Pods to newly matching nodes and delete
Pods from newly not-matching nodes.

You can modify the Pods that a DaemonSet creates.  However, Pods do not allow all
fields to be updated.  Also, the DaemonSet controller will use the original template the next
time a node (even with the same name) is created.
-->
## 更新 DaemonSet   {#updating-a-daemon-set}

如果節點的標籤被修改，DaemonSet 將立刻向新匹配上的節點新增 Pod，
同時刪除不匹配的節點上的 Pod。

你可以修改 DaemonSet 建立的 Pod。不過並非 Pod 的所有欄位都可更新。
下次當某節點（即使具有相同的名稱）被建立時，DaemonSet 控制器還會使用最初的模板。

<!--
You can delete a DaemonSet.  If you specify `--cascade=orphan` with `kubectl`, then the Pods
will be left on the nodes.  If you subsequently create a new DaemonSet with the same selector,
the new DaemonSet adopts the existing Pods. If any Pods need replacing the DaemonSet replaces
them according to its `updateStrategy`.

You can [perform a rolling update](/docs/tasks/manage-daemon/update-daemon-set/) on a DaemonSet.
-->
你可以刪除一個 DaemonSet。如果使用 `kubectl` 並指定 `--cascade=orphan` 選項，
則 Pod 將被保留在節點上。接下來如果建立使用相同選擇算符的新 DaemonSet，
新的 DaemonSet 會收養已有的 Pod。
如果有 Pod 需要被替換，DaemonSet 會根據其 `updateStrategy` 來替換。

你可以對 DaemonSet [執行滾動更新](/zh-cn/docs/tasks/manage-daemon/update-daemon-set/)操作。

<!--
## Alternatives to DaemonSet

### Init Scripts
-->
## DaemonSet 的替代方案   {#alternatives-to-daemon-set}

### init 指令碼   {#init-scripts}

<!--
It is certainly possible to run daemon processes by directly starting them on a node (e.g. using
`init`, `upstartd`, or `systemd`).  This is perfectly fine.  However, there are several advantages to
running such processes via a DaemonSet:

- Ability to monitor and manage logs for daemons in the same way as applications.
- Same config language and tools (e.g. Pod templates, `kubectl`) for daemons and applications.
- Running daemons in containers with resource limits increases isolation between daemons from app
  containers.  However, this can also be accomplished by running the daemons in a container but not in a Pod
  (e.g. start directly via Docker).
-->
直接在節點上啟動守護程序（例如使用 `init`、`upstartd` 或 `systemd`）的做法當然是可行的。
不過，基於 DaemonSet 來執行這些程序有如下一些好處：

- 像所執行的其他應用一樣，DaemonSet 具備為守護程序提供監控和日誌管理的能力。

- 為守護程序和應用所使用的配置語言和工具（如 Pod 模板、`kubectl`）是相同的。

- 在資源受限的容器中執行守護程序能夠增加守護程序和應用容器的隔離性。
  然而，這一點也可以透過在容器中執行守護程序但卻不在 Pod 中執行之來實現。
  例如，直接基於 Docker 啟動。

<!--
### Bare Pods

It is possible to create Pods directly which specify a particular node to run on.  However,
a DaemonSet replaces Pods that are deleted or terminated for any reason, such as in the case of
node failure or disruptive node maintenance, such as a kernel upgrade. For this reason, you should
use a DaemonSet rather than creating individual Pods.
-->
### 裸 Pod   {#bare-pods}

直接建立 Pod並指定其執行在特定的節點上也是可以的。
然而，DaemonSet 能夠替換由於任何原因（例如節點失敗、例行節點維護、核心升級）
而被刪除或終止的 Pod。
由於這個原因，你應該使用 DaemonSet 而不是單獨建立 Pod。

<!--
### Static Pods

It is possible to create Pods by writing a file to a certain directory watched by Kubelet.  These
are called [static pods](/docs/tasks/configure-pod-container/static-pod/).
Unlike DaemonSet, static Pods cannot be managed with kubectl
or other Kubernetes API clients.  Static Pods do not depend on the apiserver, making them useful
in cluster bootstrapping cases.  Also, static Pods may be deprecated in the future.
-->
### 靜態 Pod   {#static-pods}

透過在一個指定的、受 `kubelet` 監視的目錄下編寫檔案來建立 Pod 也是可行的。
這類 Pod 被稱為[靜態 Pod](/zh-cn/docs/tasks/configure-pod-container/static-pod/)。
不像 DaemonSet，靜態 Pod 不受 `kubectl` 和其它 Kubernetes API 客戶端管理。
靜態 Pod 不依賴於 API 伺服器，這使得它們在啟動引導新叢集的情況下非常有用。
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

For example, [network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) often include a component that runs as a DaemonSet. The DaemonSet component makes sure that the node where it's running has working cluster networking.
-->
### Deployments

DaemonSet 與 [Deployments](/zh-cn/docs/concepts/workloads/controllers/deployment/) 非常類似，
它們都能建立 Pod，並且 Pod 中的程序都不希望被終止（例如，Web 伺服器、儲存伺服器）。

建議為無狀態的服務使用 Deployments，比如前端服務。
對這些服務而言，對副本的數量進行擴縮容、平滑升級，比精確控制 Pod 執行在某個主機上要重要得多。
當需要 Pod 副本總是執行在全部或特定主機上，並且當該 DaemonSet 提供了節點級別的功能（允許其他 Pod 在該特定節點上正確執行）時，
應該使用 DaemonSet。

例如，[網路外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)通常包含一個以 DaemonSet 執行的元件。
這個 DaemonSet 元件確保它所在的節點的叢集網路正常工作。

## {{% heading "whatsnext" %}}
<!--
* Learn about [Pods](/docs/concepts/workloads/pods).
  * Learn about [static Pods](#static-pods), which are useful for running Kubernetes
    {{< glossary_tooltip text="control plane" term_id="control-plane" >}} components.
* Find out how to use DaemonSets
  * [Perform a rolling update on a DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/)
  * [Perform a rollback on a DaemonSet](/docs/tasks/manage-daemon/rollback-daemon-set/)
    (for example, if a roll out didn't work how you expected).
* Understand [how Kubernetes assigns Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/).
* Learn about [device plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) and
  [add ons](/docs/concepts/cluster-administration/addons/), which often run as DaemonSets.
* `DaemonSet` is a top-level resource in the Kubernetes REST API.
  Read the {{< api-reference page="workload-resources/daemon-set-v1" >}}
  object definition to understand the API for daemon sets.
-->
* 瞭解 [Pods](/zh-cn/docs/concepts/workloads/pods)。
  * 瞭解[靜態 Pod](#static-pods)，這對執行 Kubernetes {{< glossary_tooltip text="控制面" term_id="control-plane" >}}元件有幫助。
* 瞭解如何使用 DaemonSet
  * [對 DaemonSet 執行滾動更新](/zh-cn/docs/tasks/manage-daemon/update-daemon-set/)
  * [對 DaemonSet 執行回滾](/zh-cn/docs/tasks/manage-daemon/rollback-daemon-set/)（例如：新的版本沒有達到你的預期）
* 理解[Kubernetes 如何將 Pod 分配給節點](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)。
* 瞭解[裝置外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)和
  [擴充套件（Addons）](/zh-cn/docs/concepts/cluster-administration/addons/)，它們常以 DaemonSet 執行。
* `DaemonSet` 是 Kubernetes REST API 中的頂級資源。閱讀 {{< api-reference page="workload-resources/daemon-set-v1" >}}
   物件定義理解關於該資源的 API。

