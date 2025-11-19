---
title: 節點
api_metadata:
- apiVersion: "v1"
  kind: "Node"
content_type: concept
weight: 10
---
<!--
reviewers:
- caesarxuchao
- dchen1107
title: Nodes
api_metadata:
- apiVersion: "v1"
  kind: "Node"
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
Kubernetes runs your {{< glossary_tooltip text="workload" term_id="workload" >}}
by placing containers into Pods to run on _Nodes_.
A node may be a virtual or physical machine, depending on the cluster. Each node
is managed by the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}
and contains the services necessary to run
{{< glossary_tooltip text="Pods" term_id="pod" >}}.

Typically you have several nodes in a cluster; in a learning or resource-limited
environment, you might have only one node.

The [components](/docs/concepts/architecture/#node-components) on a node include the
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, a
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, and the
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}.
-->
Kubernetes 通過將容器放入在節點（Node）上運行的 Pod
中來執行你的{{< glossary_tooltip text="工作負載" term_id="workload" >}}。
節點可以是一個虛擬機或者物理機器，取決於所在的叢集設定。
每個節點包含運行 {{< glossary_tooltip text="Pod" term_id="pod" >}} 所需的服務；
這些節點由{{< glossary_tooltip text="控制面" term_id="control-plane" >}}負責管理。

通常叢集中會有若干個節點；而在一個學習所用或者資源受限的環境中，你的叢集中也可能只有一個節點。

節點上的[組件](/zh-cn/docs/concepts/architecture/#node-components)包括
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}、
{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}以及
{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}。

<!-- body -->
<!--
## Management

There are two main ways to have Nodes added to the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}:

1. The kubelet on a node self-registers to the control plane
2. You (or another human user) manually add a Node object

After you create a Node {{< glossary_tooltip text="object" term_id="object" >}},
or the kubelet on a node self-registers, the control plane checks whether the new Node object
is valid. For example, if you try to create a Node from the following JSON manifest:
-->
## 管理  {#management}

向 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}添加節點的方式主要有兩種：

1. 節點上的 kubelet 向控制面執行自注冊；
2. 你（或者別的什麼人）手動添加一個 Node 對象。

在你創建了 Node {{< glossary_tooltip text="對象" term_id="object" >}}或者節點上的
kubelet 執行了自注冊操作之後，控制面會檢查新的 Node 對象是否合法。
例如，如果你嘗試使用下面的 JSON 對象來創建 Node 對象：

```json
{
  "kind": "Node",
  "apiVersion": "v1",
  "metadata": {
    "name": "10.240.79.157",
    "labels": {
      "name": "my-first-k8s-node"
    }
  }
}
```

<!--
Kubernetes creates a Node object internally (the representation). Kubernetes checks
that a kubelet has registered to the API server that matches the `metadata.name`
field of the Node. If the node is healthy (i.e. all necessary services are running),
then it is eligible to run a Pod. Otherwise, that node is ignored for any cluster activity
until it becomes healthy.
-->
Kubernetes 會在內部創建一個 Node 對象作爲節點的表示。Kubernetes 檢查 kubelet
向 API 伺服器註冊節點時使用的 `metadata.name` 字段是否匹配。
如果節點是健康的（即所有必要的服務都在運行中），則該節點可以用來運行 Pod。
否則，直到該節點變爲健康之前，所有的叢集活動都會忽略該節點。

{{< note >}}
<!--
Kubernetes keeps the object for the invalid Node and continues checking to see whether
it becomes healthy.

You, or a {{< glossary_tooltip term_id="controller" text="controller">}}, must explicitly
delete the Node object to stop that health checking.
-->
Kubernetes 會一直保存着非法節點對應的對象，並持續檢查該節點是否已經變得健康。

你，或者某個{{< glossary_tooltip term_id="controller" text="控制器">}}必須顯式地刪除該
Node 對象以停止健康檢查操作。
{{< /note >}}

<!--
The name of a Node object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
Node 對象的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

<!--
### Node name uniqueness

The [name](/docs/concepts/overview/working-with-objects/names#names) identifies a Node. Two Nodes
cannot have the same name at the same time. Kubernetes also assumes that a resource with the same
name is the same object. In case of a Node, it is implicitly assumed that an instance using the
same name will have the same state (e.g. network settings, root disk contents) and attributes like
node labels. This may lead to inconsistencies if an instance was modified without changing its name.
If the Node needs to be replaced or updated significantly, the existing Node object needs to be
removed from API server first and re-added after the update.
-->
### 節點名稱唯一性     {#node-name-uniqueness}

節點的[名稱](/zh-cn/docs/concepts/overview/working-with-objects/names#names)用來標識 Node 對象。
沒有兩個 Node 可以同時使用相同的名稱。 Kubernetes 還假定名字相同的資源是同一個對象。
就 Node 而言，隱式假定使用相同名稱的實例會具有相同的狀態（例如網路設定、根磁盤內容）
和類似節點標籤這類屬性。這可能在節點被更改但其名稱未變時導致系統狀態不一致。
如果某個 Node 需要被替換或者大量變更，需要從 API 伺服器移除現有的 Node 對象，
之後再在更新之後重新將其加入。

<!--
### Self-registration of Nodes

When the kubelet flag `--register-node` is true (the default), the kubelet will attempt to
register itself with the API server. This is the preferred pattern, used by most distros.

For self-registration, the kubelet is started with the following options:
-->
### 節點自注冊    {#self-registration-of-nodes}

當 kubelet 標誌 `--register-node` 爲 true（默認）時，它會嘗試向 API 服務註冊自己。
這是首選模式，被絕大多數發行版選用。

對於自注冊模式，kubelet 使用下列參數啓動：

<!--
- `--kubeconfig` - Path to credentials to authenticate itself to the API server.
- `--cloud-provider` - How to talk to a {{< glossary_tooltip text="cloud provider" term_id="cloud-provider" >}}
  to read metadata about itself.
- `--register-node` - Automatically register with the API server.
- `--register-with-taints` - Register the node with the given list of
  {{< glossary_tooltip text="taints" term_id="taint" >}} (comma separated `<key>=<value>:<effect>`).

  No-op if `register-node` is false.
-->
- `--kubeconfig` - 用於向 API 伺服器執行身份認證所用的憑據的路徑。
- `--cloud-provider` - 與某{{< glossary_tooltip text="雲驅動" term_id="cloud-provider" >}}
  進行通信以讀取與自身相關的元數據的方式。
- `--register-node` - 自動向 API 伺服器註冊。
- `--register-with-taints` - 使用所給的{{< glossary_tooltip text="污點" term_id="taint" >}}列表
  （逗號分隔的 `<key>=<value>:<effect>`）註冊節點。當 `register-node` 爲 false 時無效。
<!--
- `--node-ip` - Optional comma-separated list of the IP addresses for the node.
  You can only specify a single address for each address family.
  For example, in a single-stack IPv4 cluster, you set this value to be the IPv4 address that the
  kubelet should use for the node.
  See [configure IPv4/IPv6 dual stack](/docs/concepts/services-networking/dual-stack/#configure-ipv4-ipv6-dual-stack)
  for details of running a dual-stack cluster.

  If you don't provide this argument, the kubelet uses the node's default IPv4 address, if any;
  if the node has no IPv4 addresses then the kubelet uses the node's default IPv6 address.
-->
- `--node-ip` - 可選的以英文逗號隔開的節點 IP 地址列表。你只能爲每個地址簇指定一個地址。
  例如在單協議棧 IPv4 叢集中，需要將此值設置爲 kubelet 應使用的節點 IPv4 地址。
  參閱[設定 IPv4/IPv6 雙協議棧](/zh-cn/docs/concepts/services-networking/dual-stack/#configure-ipv4-ipv6-dual-stack)瞭解運行雙協議棧叢集的詳情。

  如果你未提供這個參數，kubelet 將使用節點默認的 IPv4 地址（如果有）；
  如果節點沒有 IPv4 地址，則 kubelet 使用節點的默認 IPv6 地址。
<!--
- `--node-labels` - {{< glossary_tooltip text="Labels" term_id="label" >}} to add when registering the node
  in the cluster (see label restrictions enforced by the
  [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)).
- `--node-status-update-frequency` - Specifies how often kubelet posts its node status to the API server.
-->
- `--node-labels` - 在叢集中註冊節點時要添加的{{< glossary_tooltip text="標籤" term_id="label" >}}。
  （參見 [NodeRestriction 准入控制插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)所實施的標籤限制）。
- `--node-status-update-frequency` - 指定 kubelet 向 API 伺服器發送其節點狀態的頻率。

<!--
When the [Node authorization mode](/docs/reference/access-authn-authz/node/) and
[NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
are enabled, kubelets are only authorized to create/modify their own Node resource.
-->
當 [Node 鑑權模式](/zh-cn/docs/reference/access-authn-authz/node/)和
[NodeRestriction 准入插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)被啓用後，
僅授權 kubelet 創建/修改自己的 Node 資源。

{{< note >}}
<!--
As mentioned in the [Node name uniqueness](#node-name-uniqueness) section,
when Node configuration needs to be updated, it is a good practice to re-register
the node with the API server. For example, if the kubelet is being restarted with
a new set of `--node-labels`, but the same Node name is used, the change will
not take effect, as labels are only set (or modified) upon Node registration with the API server.
-->
正如[節點名稱唯一性](#node-name-uniqueness)一節所述，當 Node 的設定需要被更新時，
一種好的做法是重新向 API 伺服器註冊該節點。例如，如果 kubelet 重啓時其 `--node-labels`
是新的值集，但同一個 Node 名稱已經被使用，則所作變更不會起作用，
因爲節點標籤是在 Node 註冊到 API 伺服器時完成（或修改）的。

<!--
Pods already scheduled on the Node may misbehave or cause issues if the Node
configuration will be changed on kubelet restart. For example, already running
Pod may be tainted against the new labels assigned to the Node, while other
Pods, that are incompatible with that Pod will be scheduled based on this new
label. Node re-registration ensures all Pods will be drained and properly
re-scheduled.
-->
如果在 kubelet 重啓期間 Node 設定發生了變化，已經被調度到某 Node 上的 Pod
可能會出現行爲不正常或者出現其他問題，例如，已經運行的 Pod
可能通過污點機制設置了與 Node 上新設置的標籤相排斥的規則，也有一些其他 Pod，
本來與此 Pod 之間存在不兼容的問題，也會因爲新的標籤設置而被調到同一節點。
節點重新註冊操作可以確保節點上所有 Pod 都被排空並被正確地重新調度。
{{< /note >}}

<!--
### Manual Node administration

You can create and modify Node objects using
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}.

When you want to create Node objects manually, set the kubelet flag `--register-node=false`.

You can modify Node objects regardless of the setting of `--register-node`.
For example, you can set labels on an existing Node or mark it unschedulable.

You can set optional node role(s) for nodes by adding one or more
`node-role.kubernetes.io/<role>: <role>` labels to the node where characters of `<role>` are limited by the
[syntax](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set) rules for labels.

Kubernetes ignores the label value for node roles; by convention, you can set it to the same string you used for the node role in the label key.
-->
### 手動節點管理 {#manual-node-administration}

你可以使用 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
來創建和修改 Node 對象。

如果你希望手動創建節點對象時，請設置 kubelet 標誌 `--register-node=false`。

你可以修改 Node 對象（忽略 `--register-node` 設置）。
例如，你可以修改節點上的標籤或並標記其爲不可調度。

你可以通過在節點上添加一個或多個 `node-role.kubernetes.io/<role>: <role>` 標籤，
來爲節點設置可選的節點角色。其中，`<role>`
的字符受[標籤鍵名格式](/zh-cn/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)規則限制。

Kubernetes 會忽略節點角色標籤的值；按照慣例，你可以將其設置爲與標籤鍵中的 `<role>` 相同的字符串。

<!--
You can use labels on Nodes in conjunction with node selectors on Pods to control
scheduling. For example, you can constrain a Pod to only be eligible to run on
a subset of the available nodes.

Marking a node as unschedulable prevents the scheduler from placing new pods onto
that Node but does not affect existing Pods on the Node. This is useful as a
preparatory step before a node reboot or other maintenance.

To mark a Node unschedulable, run:
-->
你可以結合使用 Node 上的標籤和 Pod 上的選擇算符來控制調度。
例如，你可以限制某 Pod 只能在符合要求的節點子集上運行。

如果標記節點爲不可調度（unschedulable），將阻止新 Pod 調度到該 Node 之上，
但不會影響任何已經在其上的 Pod。
這是重啓節點或者執行其他維護操作之前的一個有用的準備步驟。

要標記一個 Node 爲不可調度，執行以下命令：

```shell
kubectl cordon $NODENAME
```

<!--
See [Safely Drain a Node](/docs/tasks/administer-cluster/safely-drain-node/)
for more details.
-->
更多細節參考[安全地騰空節點](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)。

{{< note >}}
<!--
Pods that are part of a {{< glossary_tooltip term_id="daemonset" >}} tolerate
being run on an unschedulable Node. DaemonSets typically provide node-local services
that should run on the Node even if it is being drained of workload applications.
-->
被 {{< glossary_tooltip term_id="daemonset" text="DaemonSet" >}} 控制器創建的 Pod
能夠容忍節點的不可調度屬性。
DaemonSet 通常提供節點本地的服務，即使節點上的負載應用已經被騰空，
這些服務也仍需運行在節點之上。
{{< /note >}}

<!--
## Node status

A Node's status contains the following information:

* [Addresses](/docs/reference/node/node-status/#addresses)
* [Conditions](/docs/reference/node/node-status/#condition)
* [Capacity and Allocatable](/docs/reference/node/node-status/#capacity)
* [Info](/docs/reference/node/node-status/#info)
-->
## 節點狀態   {#node-status}

一個節點的狀態包含以下信息:

* [地址（Addresses）](/zh-cn/docs/reference/node/node-status/#addresses)
* [狀況（Condition）](/zh-cn/docs/reference/node/node-status/#condition)
* [容量與可分配（Capacity）](/zh-cn/docs/reference/node/node-status/#capacity)
* [信息（Info）](/zh-cn/docs/reference/node/node-status/#info)

<!--
You can use `kubectl` to view a Node's status and other details:

```shell
kubectl describe node <insert-node-name-here>
```
-->
你可以使用 `kubectl` 來查看節點狀態和其他細節信息：

```shell
kubectl describe node <節點名稱>
```

<!-- 
See [Node Status](/docs/reference/node/node-status/) for more details.
-->
更多細節參見 [Node Status](/zh-cn/docs/reference/node/node-status)。

<!--
## Node heartbeats

Heartbeats, sent by Kubernetes nodes, help your cluster determine the
availability of each node, and to take action when failures are detected.

For nodes there are two forms of heartbeats:
-->
## 節點心跳  {#node-heartbeats}

Kubernetes 節點發送的心跳幫助你的叢集確定每個節點的可用性，並在檢測到故障時採取行動。

對於節點，有兩種形式的心跳：

<!--
* Updates to the [`.status`](/docs/reference/node/node-status/) of a Node.
* [Lease](/docs/concepts/architecture/leases/) objects
  within the `kube-node-lease`
  {{< glossary_tooltip term_id="namespace" text="namespace">}}.
  Each Node has an associated Lease object.
-->
* 更新節點的 [`.status`](/zh-cn/docs/reference/node/node-status/)
* `kube-node-lease` {{<glossary_tooltip term_id="namespace" text="名字空間">}}中的
  [Lease（租約）](/zh-cn/docs/concepts/architecture/leases/)對象。
  每個節點都有一個關聯的 Lease 對象。

<!--
## Node controller

The node {{< glossary_tooltip text="controller" term_id="controller" >}} is a
Kubernetes control plane component that manages various aspects of nodes.

The node controller has multiple roles in a node's life. The first is assigning a
CIDR block to the node when it is registered (if CIDR assignment is turned on).
-->
## 節點控制器  {#node-controller}

節點{{< glossary_tooltip text="控制器" term_id="controller" >}}是 Kubernetes 控制面組件，
管理節點的方方面面。

節點控制器在節點的生命週期中扮演多個角色。
第一個是當節點註冊時爲它分配一個 CIDR 區段（如果啓用了 CIDR 分配）。

<!--
The second is keeping the node controller's internal list of nodes up to date with
the cloud provider's list of available machines. When running in a cloud
environment and whenever a node is unhealthy, the node controller asks the cloud
provider if the VM for that node is still available. If not, the node
controller deletes the node from its list of nodes.
-->
第二個是保持節點控制器內的節點列表與雲服務商所提供的可用機器列表同步。
如果在雲環境下運行，只要某節點不健康，節點控制器就會詢問雲服務是否節點的虛擬機仍可用。
如果不可用，節點控制器會將該節點從它的節點列表刪除。

<!--
The third is monitoring the nodes' health. The node controller is
responsible for:

- In the case that a node becomes unreachable, updating the `Ready` condition
  in the Node's `.status` field. In this case the node controller sets the
  `Ready` condition to `Unknown`.
- If a node remains unreachable: triggering
  [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/)
  for all of the Pods on the unreachable node. By default, the node controller
  waits 5 minutes between marking the node as `Unknown` and submitting
  the first eviction request.

By default, the node controller checks the state of each node every 5 seconds.
This period can be configured using the `--node-monitor-period` flag on the
`kube-controller-manager` component.
-->
第三個是監控節點的健康狀況。節點控制器負責：

- 在節點不可達的情況下，在 Node 的 `.status` 中更新 `Ready` 狀況。
  在這種情況下，節點控制器將 NodeReady 狀況更新爲 `Unknown`。
- 如果節點仍然無法訪問：對於不可達節點上的所有 Pod 觸發
  [API 發起的逐出](/zh-cn/docs/concepts/scheduling-eviction/api-eviction/)操作。
  默認情況下，節點控制器在將節點標記爲 `Unknown` 後等待 5 分鐘提交第一個驅逐請求。

默認情況下，節點控制器每 5 秒檢查一次節點狀態，可以使用 `kube-controller-manager`
組件上的 `--node-monitor-period` 參數來設定週期。

<!--
### Rate limits on eviction

In most cases, the node controller limits the eviction rate to
`--node-eviction-rate` (default 0.1) per second, meaning it won't evict pods
from more than 1 node per 10 seconds.
-->
### 逐出速率限制  {#rate-limits-on-eviction}

大部分情況下，節點控制器把逐出速率限制在每秒 `--node-eviction-rate` 個（默認爲 0.1）。
這表示它每 10 秒鐘內至多從一個節點驅逐 Pod。

<!--
The node eviction behavior changes when a node in a given availability zone
becomes unhealthy. The node controller checks what percentage of nodes in the zone
are unhealthy (the `Ready` condition is `Unknown` or `False`) at
the same time:
-->
當一個可用區域（Availability Zone）中的節點變爲不健康時，節點的驅逐行爲將發生改變。
節點控制器會同時檢查可用區域中不健康（`Ready` 狀況爲 `Unknown` 或 `False`）
的節點的百分比：

<!--
- If the fraction of unhealthy nodes is at least `--unhealthy-zone-threshold`
  (default 0.55), then the eviction rate is reduced.
- If the cluster is small (i.e. has less than or equal to
  `--large-cluster-size-threshold` nodes - default 50), then evictions are stopped.
- Otherwise, the eviction rate is reduced to `--secondary-node-eviction-rate`
  (default 0.01) per second.
-->
- 如果不健康節點的比例超過 `--unhealthy-zone-threshold`（默認爲 0.55），
  驅逐速率將會降低。
- 如果叢集較小（意即小於等於 `--large-cluster-size-threshold` 個節點 - 默認爲 50），
  驅逐操作將會停止。
- 否則驅逐速率將降爲每秒 `--secondary-node-eviction-rate` 個（默認爲 0.01）。

<!--
The reason these policies are implemented per availability zone is because one
availability zone might become partitioned from the control plane while the others remain
connected. If your cluster does not span multiple cloud provider availability zones,
then the eviction mechanism does not take per-zone unavailability into account.
-->
在逐個可用區域中實施這些策略的原因是，
當一個可用區域可能從控制面脫離時其它可用區域可能仍然保持連接。
如果你的叢集沒有跨越雲服務商的多個可用區域，那（整個叢集）就只有一個可用區域。

<!--
A key reason for spreading your nodes across availability zones is so that the
workload can be shifted to healthy zones when one entire zone goes down.
Therefore, if all nodes in a zone are unhealthy, then the node controller evicts at
the normal rate of `--node-eviction-rate`. The corner case is when all zones are
completely unhealthy (none of the nodes in the cluster are healthy). In such a
case, the node controller assumes that there is some problem with connectivity
between the control plane and the nodes, and doesn't perform any evictions.
(If there has been an outage and some nodes reappear, the node controller does
evict pods from the remaining nodes that are unhealthy or unreachable).
-->
跨多個可用區域部署你的節點的一個關鍵原因是當某個可用區域整體出現故障時，
工作負載可以轉移到健康的可用區域。
因此，如果一個可用區域中的所有節點都不健康時，節點控制器會以正常的速率
`--node-eviction-rate` 進行驅逐操作。
在所有的可用區域都不健康（也即叢集中沒有健康節點）的極端情況下，
節點控制器將假設控制面與節點間的連接出了某些問題，它將停止所有驅逐動作
（如果故障後部分節點重新連接，節點控制器會從剩下不健康或者不可達節點中驅逐 Pod）。

<!--
The node controller is also responsible for evicting pods running on nodes with
`NoExecute` taints, unless those pods tolerate that taint.
The node controller also adds {{< glossary_tooltip text="taints" term_id="taint" >}}
corresponding to node problems like node unreachable or not ready. This means
that the scheduler won't place Pods onto unhealthy nodes.
-->
節點控制器還負責驅逐運行在擁有 `NoExecute` 污點的節點上的 Pod，
除非這些 Pod 能夠容忍此污點。
節點控制器還負責根據節點故障（例如節點不可訪問或沒有就緒）
爲其添加{{< glossary_tooltip text="污點" term_id="taint" >}}。
這意味着調度器不會將 Pod 調度到不健康的節點上。

<!--
## Resource capacity tracking {#node-capacity}

Node objects track information about the Node's resource capacity: for example, the amount
of memory available and the number of CPUs.
Nodes that [self register](#self-registration-of-nodes) report their capacity during
registration. If you [manually](#manual-node-administration) add a Node, then
you need to set the node's capacity information when you add it.
-->
### 資源容量跟蹤   {#node-capacity}

Node 對象會跟蹤節點上資源的容量（例如可用內存和 CPU 數量）。
通過[自注冊](#self-registration-of-nodes)機制生成的 Node 對象會在註冊期間報告自身容量。
如果你[手動](#manual-node-administration)添加了 Node，
你就需要在添加節點時手動設置節點容量。

<!--
The Kubernetes {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}} ensures that
there are enough resources for all the Pods on a Node. The scheduler checks that the sum
of the requests of containers on the node is no greater than the node's capacity.
That sum of requests includes all containers managed by the kubelet, but excludes any
containers started directly by the container runtime, and also excludes any
processes running outside of the kubelet's control.
-->
Kubernetes {{< glossary_tooltip text="調度器" term_id="kube-scheduler" >}}
保證節點上有足夠的資源供其上的所有 Pod 使用。
它會檢查節點上所有容器的請求的總和不會超過節點的容量。
總的請求包括由 kubelet 啓動的所有容器，但不包括由容器運行時直接啓動的容器，
也不包括不受 kubelet 控制的其他進程。

{{< note >}}
<!--
If you want to explicitly reserve resources for non-Pod processes, see
[reserve resources for system daemons](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved).
-->
如果要爲非 Pod 進程顯式保留資源。
請參考[爲系統守護進程預留資源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved)。
{{< /note >}}

<!--
## Node topology
-->
## 節點拓撲  {#node-topology}

{{< feature-state feature_gate_name="TopologyManager" >}}

<!--
If you have enabled the `TopologyManager`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/), then
the kubelet can use topology hints when making resource assignment decisions.
See [Control Topology Management Policies on a Node](/docs/tasks/administer-cluster/topology-manager/)
for more information.
-->
如果啓用了 `TopologyManager` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
kubelet 可以在作出資源分配決策時使用拓撲提示。
參考[控制節點上拓撲管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)瞭解詳細信息。

## {{% heading "whatsnext" %}}

<!--
Learn more about the following:
* [Components](/docs/concepts/architecture/#node-components) that make up a node.
* [API definition for Node](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).
* [Node](https://git.k8s.io/design-proposals-archive/architecture/architecture.md#the-kubernetes-node) section of the architecture design document.
* [Node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/) to
  manage the number and size of nodes in your cluster.
* [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
* [Node Resource Managers](/docs/concepts/policy/node-resource-managers/).
* [Resource Management for Windows nodes](/docs/concepts/configuration/windows-resource-management/).
-->
進一步瞭解以下資料：

* 構成節點的[組件](/zh-cn/docs/concepts/architecture/#node-components) 。
* [Node 的 API 定義](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core)。
* 架構設計文檔中有關
  [Node](https://git.k8s.io/design-proposals-archive/architecture/architecture.md#the-kubernetes-node)
  的章節。
* [節點自動擴縮](/zh-cn/docs/concepts/cluster-administration/node-autoscaling/)
  以管理叢集中節點的數量和規模。
* [污點和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
* [節點資源管理器](/zh-cn/docs/concepts/policy/node-resource-managers/)。
* [Windows 節點的資源管理](/zh-cn/docs/concepts/configuration/windows-resource-management/)。
