---
title: 租约（Lease）
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
分布式系统通常需要**租约（Lease）**；租约提供了一种机制来锁定共享资源并协调集合成员之间的活动。
在 Kubernetes 中，租约概念表示为 `coordination.k8s.io`
{{< glossary_tooltip text="API 组" term_id="api-group" >}}中的
[Lease](/zh-cn/docs/reference/kubernetes-api/cluster-resources/lease-v1/) 对象，
常用于类似节点心跳和组件级领导者选举等系统核心能力。

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
## 节点心跳  {#node-heart-beats}

Kubernetes 使用 Lease API 将 kubelet 节点心跳传递到 Kubernetes API 服务器。
对于每个 `Node`，在 `kube-node-lease` 名字空间中都有一个具有匹配名称的 `Lease` 对象。
在此基础上，每个 kubelet 心跳都是对该 `Lease` 对象的 **update** 请求，更新该 Lease 的 `spec.renewTime` 字段。
Kubernetes 控制平面使用此字段的时间戳来确定此 `Node` 的可用性。

更多细节请参阅 [Node Lease 对象](/zh-cn/docs/concepts/architecture/nodes/#node-heartbeats)。

<!--
## Leader election

Kubernetes also uses Leases to ensure only one instance of a component is running at any given time.
This is used by control plane components like `kube-controller-manager` and `kube-scheduler` in
HA configurations, where only one instance of the component should be actively running while the other
instances are on stand-by.
-->
## 领导者选举  {#leader-election}

Kubernetes 也使用 Lease 确保在任何给定时间某个组件只有一个实例在运行。
这在高可用配置中由 `kube-controller-manager` 和 `kube-scheduler` 等控制平面组件进行使用，
这些组件只应有一个实例激活运行，而其他实例待机。

<!--
Read [coordinated leader election](/docs/concepts/cluster-administration/coordinated-leader-election)
to learn about how Kubernetes builds on the Lease API to select which component instance
acts as leader.
-->
参阅[协调领导者选举](/zh-cn/docs/concepts/cluster-administration/coordinated-leader-election)以了解
Kubernetes 如何基于 Lease API 来选择哪个组件实例充当领导者。

<!--
## API server identity
-->
## API 服务器身份   {#api-server-identity}

{{< feature-state feature_gate_name="APIServerIdentity" >}}

<!--
Starting in Kubernetes v1.26, each `kube-apiserver` uses the Lease API to publish its identity to the
rest of the system. While not particularly useful on its own, this provides a mechanism for clients to
discover how many instances of `kube-apiserver` are operating the Kubernetes control plane.
Existence of kube-apiserver leases enables future capabilities that may require coordination between
each kube-apiserver.

You can inspect Leases owned by each kube-apiserver by checking for lease objects in the `kube-system` namespace
with the name `kube-apiserver-<sha256-hash>`. Alternatively you can use the label selector `apiserver.kubernetes.io/identity=kube-apiserver`:
-->
从 Kubernetes v1.26 开始，每个 `kube-apiserver` 都使用 Lease API 将其身份发布到系统中的其他位置。
虽然它本身并不是特别有用，但为客户端提供了一种机制来发现有多少个 `kube-apiserver` 实例正在操作
Kubernetes 控制平面。kube-apiserver 租约的存在使得未来可以在各个 kube-apiserver 之间协调新的能力。

你可以检查 `kube-system` 名字空间中名为 `kube-apiserver-<sha256-hash>` 的 Lease 对象来查看每个
kube-apiserver 拥有的租约。你还可以使用标签选择算符 `apiserver.kubernetes.io/identity=kube-apiserver`：

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
hostname used by kube-apisever by checking the value of the `kubernetes.io/hostname` label:
-->
租约名称中使用的 SHA256 哈希基于 API 服务器所看到的操作系统主机名生成。
每个 kube-apiserver 都应该被配置为使用集群中唯一的主机名。
使用相同主机名的 kube-apiserver 新实例将使用新的持有者身份接管现有 Lease，而不是实例化新的 Lease 对象。
你可以通过检查 `kubernetes.io/hostname` 标签的值来查看 kube-apisever 所使用的主机名：

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
kube-apiserver 中不再存续的已到期租约将在到期 1 小时后被新的 kube-apiserver 作为垃圾收集。

你可以通过禁用 `APIServerIdentity`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)来禁用 API 服务器身份租约。

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
## 工作负载    {#custom-workload}

你自己的工作负载可以定义自己使用的 Lease。例如，
你可以运行自定义的{{< glossary_tooltip term_id="controller" text="控制器" >}}，
让主要成员或领导者成员在其中执行其对等方未执行的操作。
你定义一个 Lease，以便控制器副本可以使用 Kubernetes API 进行协调以选择或选举一个领导者。
如果你使用 Lease，良好的做法是为明显关联到产品或组件的 Lease 定义一个名称。
例如，如果你有一个名为 Example Foo 的组件，可以使用名为 `example-foo` 的 Lease。

<!--
If a cluster operator or another end user could deploy multiple instances of a component, select a name
prefix and pick a mechanism (such as hash of the name of the Deployment) to avoid name collisions
for the Leases.

You can use another approach so long as it achieves the same outcome: different software products do
not conflict with one another.
-->
如果集群操作员或其他终端用户可以部署一个组件的多个实例，
则选择名称前缀并挑选一种机制（例如 Deployment 名称的哈希）以避免 Lease 的名称冲突。

你可以使用另一种方式来达到相同的效果：不同的软件产品不相互冲突。
