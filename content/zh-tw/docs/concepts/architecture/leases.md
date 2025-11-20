---
title: 租約（Lease）
api_metadata:
- apiVersion: "coordination.k8s.io/v1"
  kind: "Lease"
content_type: concept
weight: 30
---
<!--
title: Leases
api_metadata:
- apiVersion: "coordination.k8s.io/v1"
  kind: "Lease"
content_type: concept
weight: 30
-->

<!-- overview -->

<!--
Distributed systems often have a need for _leases_, which provide a mechanism to lock shared resources
and coordinate activity between members of a set.
In Kubernetes, the lease concept is represented by [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/)
objects in the `coordination.k8s.io` {{< glossary_tooltip text="API Group" term_id="api-group" >}},
which are used for system-critical capabilities such as node heartbeats and component-level leader election.
-->
分佈式系統通常需要**租約（Lease）**；租約提供了一種機制來鎖定共享資源並協調集合成員之間的活動。
在 Kubernetes 中，租約概念表示爲 `coordination.k8s.io`
{{< glossary_tooltip text="API 組" term_id="api-group" >}}中的
[Lease](/zh-cn/docs/reference/kubernetes-api/cluster-resources/lease-v1/) 對象，
常用於類似節點心跳和組件級領導者選舉等系統核心能力。

<!-- body -->

<!--
## Node heartbeats {#node-heart-beats}

Kubernetes uses the Lease API to communicate kubelet node heartbeats to the Kubernetes API server.
For every `Node` , there is a `Lease` object with a matching name in the `kube-node-lease`
namespace. Under the hood, every kubelet heartbeat is an **update** request to this `Lease` object, updating
the `spec.renewTime` field for the Lease. The Kubernetes control plane uses the time stamp of this field
to determine the availability of this `Node`.

See [Node Lease objects](/docs/concepts/architecture/nodes/#node-heartbeats) for more details.
-->
## 節點心跳  {#node-heart-beats}

Kubernetes 使用 Lease API 將 kubelet 節點心跳傳遞到 Kubernetes API 伺服器。
對於每個 `Node`，在 `kube-node-lease` 名字空間中都有一個具有匹配名稱的 `Lease` 對象。
在此基礎上，每個 kubelet 心跳都是對該 `Lease` 對象的 **update** 請求，更新該 Lease 的 `spec.renewTime` 字段。
Kubernetes 控制平面使用此字段的時間戳來確定此 `Node` 的可用性。

更多細節請參閱 [Node Lease 對象](/zh-cn/docs/concepts/architecture/nodes/#node-heartbeats)。

<!--
## Leader election

Kubernetes also uses Leases to ensure only one instance of a component is running at any given time.
This is used by control plane components like `kube-controller-manager` and `kube-scheduler` in
HA configurations, where only one instance of the component should be actively running while the other
instances are on stand-by.
-->
## 領導者選舉  {#leader-election}

Kubernetes 也使用 Lease 確保在任何給定時間某個組件只有一個實例在運行。
這在高可用設定中由 `kube-controller-manager` 和 `kube-scheduler` 等控制平面組件進行使用，
這些組件只應有一個實例激活運行，而其他實例待機。

<!--
Read [coordinated leader election](/docs/concepts/cluster-administration/coordinated-leader-election)
to learn about how Kubernetes builds on the Lease API to select which component instance
acts as leader.
-->
參閱[協調領導者選舉](/zh-cn/docs/concepts/cluster-administration/coordinated-leader-election)以瞭解
Kubernetes 如何基於 Lease API 來選擇哪個組件實例充當領導者。

<!--
## API server identity
-->
## API 伺服器身份   {#api-server-identity}

{{< feature-state feature_gate_name="APIServerIdentity" >}}

<!--
Starting in Kubernetes v1.26, each `kube-apiserver` uses the Lease API to publish its identity to the
rest of the system. While not particularly useful on its own, this provides a mechanism for clients to
discover how many instances of `kube-apiserver` are operating the Kubernetes control plane.
Existence of kube-apiserver leases enables future capabilities that may require coordination between
each kube-apiserver.

You can inspect Leases owned by each kube-apiserver by checking for lease objects in the `kube-system` namespace
with the name `apiserver-<sha256-hash>`. Alternatively you can use the label selector `apiserver.kubernetes.io/identity=kube-apiserver`:
-->
從 Kubernetes v1.26 開始，每個 `kube-apiserver` 都使用 Lease API 將其身份發佈到系統中的其他位置。
雖然它本身並不是特別有用，但爲客戶端提供了一種機制來發現有多少個 `kube-apiserver` 實例正在操作
Kubernetes 控制平面。kube-apiserver 租約的存在使得未來可以在各個 kube-apiserver 之間協調新的能力。

你可以檢查 `kube-system` 名字空間中名爲 `apiserver-<sha256-hash>` 的 Lease 對象來查看每個
kube-apiserver 擁有的租約。你還可以使用標籤選擇算符 `apiserver.kubernetes.io/identity=kube-apiserver`：

```shell
kubectl -n kube-system get lease -l apiserver.kubernetes.io/identity=kube-apiserver
```

```
NAME                                        HOLDER                                                                           AGE
apiserver-07a5ea9b9b072c4a5f3d1c3702        apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05        5m33s
apiserver-7be9e061c59d368b3ddaf1376e        apiserver-7be9e061c59d368b3ddaf1376e_84f2a85d-37c1-4b14-b6b9-603e62e4896f        4m23s
apiserver-1dfef752bcb36637d2763d1868        apiserver-1dfef752bcb36637d2763d1868_c5ffa286-8a9a-45d4-91e7-61118ed58d2e        4m43s
```

<!--
The SHA256 hash used in the lease name is based on the OS hostname as seen by that API server. Each kube-apiserver should be
configured to use a hostname that is unique within the cluster. New instances of kube-apiserver that use the same hostname
will take over existing Leases using a new holder identity, as opposed to instantiating new Lease objects. You can check the
hostname used by kube-apiserver by checking the value of the `kubernetes.io/hostname` label:
-->
租約名稱中使用的 SHA256 哈希基於 API 伺服器所看到的操作系統主機名生成。
每個 kube-apiserver 都應該被設定爲使用叢集中唯一的主機名。
使用相同主機名的 kube-apiserver 新實例將使用新的持有者身份接管現有 Lease，而不是實例化新的 Lease 對象。
你可以通過檢查 `kubernetes.io/hostname` 標籤的值來查看 kube-apiserver 所使用的主機名：

```shell
kubectl -n kube-system get lease apiserver-07a5ea9b9b072c4a5f3d1c3702 -o yaml
```

```yaml
apiVersion: coordination.k8s.io/v1
kind: Lease
metadata:
  creationTimestamp: "2023-07-02T13:16:48Z"
  labels:
    apiserver.kubernetes.io/identity: kube-apiserver
    kubernetes.io/hostname: master-1
  name: apiserver-07a5ea9b9b072c4a5f3d1c3702
  namespace: kube-system
  resourceVersion: "334899"
  uid: 90870ab5-1ba9-4523-b215-e4d4e662acb1
spec:
  holderIdentity: apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05
  leaseDurationSeconds: 3600
  renewTime: "2023-07-04T21:58:48.065888Z"
```

<!--
Expired leases from kube-apiservers that no longer exist are garbage collected by new kube-apiservers after 1 hour.

You can disable API server identity leases by disabling the `APIServerIdentity`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
-->
kube-apiserver 中不再存續的已到期租約將在到期 1 小時後被新的 kube-apiserver 作爲垃圾收集。

你可以通過禁用 `APIServerIdentity`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)來禁用 API 伺服器身份租約。

<!--
## Workloads {#custom-workload}

Your own workload can define its own use of Leases. For example, you might run a custom
{{< glossary_tooltip term_id="controller" text="controller" >}} where a primary or leader member
performs operations that its peers do not. You define a Lease so that the controller replicas can select
or elect a leader, using the Kubernetes API for coordination.
If you do use a Lease, it's a good practice to define a name for the Lease that is obviously linked to
the product or component. For example, if you have a component named Example Foo, use a Lease named
`example-foo`.
-->
## 工作負載    {#custom-workload}

你自己的工作負載可以定義自己使用的 Lease。例如，
你可以運行自定義的{{< glossary_tooltip term_id="controller" text="控制器" >}}，
讓主要成員或領導者成員在其中執行其對等方未執行的操作。
你定義一個 Lease，以便控制器副本可以使用 Kubernetes API 進行協調以選擇或選舉一個領導者。
如果你使用 Lease，良好的做法是爲明顯關聯到產品或組件的 Lease 定義一個名稱。
例如，如果你有一個名爲 Example Foo 的組件，可以使用名爲 `example-foo` 的 Lease。

<!--
If a cluster operator or another end user could deploy multiple instances of a component, select a name
prefix and pick a mechanism (such as hash of the name of the Deployment) to avoid name collisions
for the Leases.

You can use another approach so long as it achieves the same outcome: different software products do
not conflict with one another.
-->
如果叢集操作員或其他終端使用者可以部署一個組件的多個實例，
則選擇名稱前綴並挑選一種機制（例如 Deployment 名稱的哈希）以避免 Lease 的名稱衝突。

你可以使用另一種方式來達到相同的效果：不同的軟體產品不相互衝突。
