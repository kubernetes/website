---
reviewers:
- johnbelamaric
- imroc
title: Service 拓扑
feature:
  title: Service 拓扑
  description: >
    基于集群拓扑的服务流量路由。

content_type: concept
weight: 10
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

<!--
_Service Topology_ enables a service to route traffic based upon the Node
topology of the cluster. For example, a service can specify that traffic be
preferentially routed to endpoints that are on the same Node as the client, or
in the same availability zone.
-->

`Service` 拓扑可以让一个服务基于集群的 `Node` 拓扑进行流量路由。例如，一个服务可以指定流量是被优先路由到一个和客户端在同一个 `Node` 或者在同一可用区域的端点。



<!-- body -->

<!--
## Introduction

By default, traffic sent to a `ClusterIP` or `NodePort` Service may be routed to
any backend address for the Service. Since Kubernetes 1.7 it has been possible
to route "external" traffic to the Pods running on the Node that received the
traffic, but this is not supported for `ClusterIP` Services, and more complex
topologies &mdash; such as routing zonally &mdash; have not been possible. The
_Service Topology_ feature resolves this by allowing the Service creator to
define a policy for routing traffic based upon the Node labels for the
originating and destination Nodes.

By using Node label matching between the source and destination, the operator
may designate groups of Nodes that are "closer" and "farther" from one another,
using whatever metric makes sense for that operator's requirements. For many
operators in public clouds, for example, there is a preference to keep service
traffic within the same zone, because interzonal traffic has a cost associated
with it, while intrazonal traffic does not. Other common needs include being able
to route traffic to a local Pod managed by a DaemonSet, or keeping traffic to
Nodes connected to the same top-of-rack switch for the lowest latency.
-->

## 介绍 {#introduction}

默认情况下，发往 `ClusterIP` 或者 `NodePort` 服务的流量可能会被路由到任意一个服务后端的地址上。从 Kubernetes 1.7 开始，可以将“外部”流量路由到节点上运行的 pod 上，但不支持 `ClusterIP` 服务，更复杂的拓扑 &mdash; 比如分区路由 &mdash; 也还不支持。通过允许 `Service` 创建者根据源 `Node` 和目的 `Node` 的标签来定义流量路由策略，`Service` 拓扑特性实现了服务流量的路由。

通过对源 `Node` 和目的 `Node` 标签的匹配，运营者可以使用任何符合运营者要求的度量值来指定彼此“较近”和“较远”的节点组。例如，对于在公有云上的运营者来说，更偏向于把流量控制在同一区域内，因为区域间的流量是有费用成本的，而区域内的流量没有。其它常用需求还包括把流量路由到由 `DaemonSet` 管理的本地 Pod 上，或者把保持流量在连接同一机架交换机的 `Node` 上，以获得低延时。

<!--
## Prerequisites 

The following prerequisites are needed in order to enable topology aware service
routing:

   * Kubernetes 1.17 or later
   * Kube-proxy running in iptables mode or IPVS mode
   * Enable [Endpoint Slices](/zh/docs/concepts/services-networking/endpoint-slices/)
-->

## 前提条件 {#prerequisites}

为了启用拓扑感知服务路由功能，必须要满足以下一些前提条件：

   * Kubernetes 的版本不低于 1.17
   * Kube-proxy 运行在 iptables 模式或者 IPVS 模式
   * 启用 [端点切片](/zh/docs/concepts/services-networking/endpoint-slices/)功能

<!--
## Enable Service Topology

To enable service topology, enable the `ServiceTopology` feature gate for
kube-apiserver and kube-proxy:

```
--feature-gates="ServiceTopology=true"
```
-->

## 启用 `Service` 拓扑 {#enable-service-topology}

要启用 `Service` 拓扑，就要给 kube-apiserver 和 kube-proxy 启用 `ServiceTopology` 功能：

```
--feature-gates="ServiceTopology=true"
```

<!--
## Using Service Topology

If your cluster has Service Topology enabled, you can control Service traffic
routing by specifying the `topologyKeys` field on the Service spec. This field
is a preference-order list of Node labels which will be used to sort endpoints
when accessing this Service. Traffic will be directed to a Node whose value for
the first label matches the originating Node's value for that label. If there is
no backend for the Service on a matching Node, then the second label will be
considered, and so forth, until no labels remain.

If no match is found, the traffic will be rejected, just as if there were no
backends for the Service at all. That is, endpoints are chosen based on the first
topology key with available backends. If this field is specified and all entries
have no backends that match the topology of the client, the service has no
backends for that client and connections should fail. The special value `"*"` may
be used to mean "any topology". This catch-all value, if used, only makes sense
as the last value in the list.
-->

## 使用 `Service` 拓扑 {#using-service-topology}

如果集群启用了 `Service` 拓扑功能后，就可以在 `Service` 配置中指定 `topologyKeys` 字段，从而控制 `Service` 的流量路由。此字段是 `Node` 标签的优先顺序字段，将用于在访问这个 `Service` 时对端点进行排序。流量会被定向到第一个标签值和源 `Node` 标签值相匹配的 `Node`。如果这个 `Service` 没有匹配的后端 `Node`，那么第二个标签会被使用做匹配，以此类推，直到没有标签。

如果没有匹配到，流量会被拒绝，就如同这个 `Service` 根本没有后端。这是根据有可用后端的第一个拓扑键来选择端点的。如果这个字段被配置了而没有后端可以匹配客户端拓扑，那么这个 `Service` 对那个客户端是没有后端的，链接应该是失败的。这个字段配置为 `"*"` 意味着任意拓扑。这个通配符值如果使用了，那么只有作为配置值列表中的最后一个才有用。

<!--
If `topologyKeys` is not specified or empty, no topology constraints will be applied.

Consider a cluster with Nodes that are labeled with their hostname, zone name,
and region name. Then you can set the `topologyKeys` values of a service to direct
traffic as follows.

* Only to endpoints on the same node, failing if no endpoint exists on the node:
  `["kubernetes.io/hostname"]`.
* Preferentially to endpoints on the same node, falling back to endpoints in the
  same zone, followed by the same region, and failing otherwise: `["kubernetes.io/hostname",
  "topology.kubernetes.io/zone", "topology.kubernetes.io/region"]`.
  This may be useful, for example, in cases where data locality is critical.
* Preferentially to the same zone, but fallback on any available endpoint if
  none are available within this zone:
  `["topology.kubernetes.io/zone", "*"]`.
-->

如果 `topologyKeys` 没有指定或者为空，就没有启用这个拓扑功能。

一个集群中，其 `Node` 的标签被打为其主机名，区域名和地区名。那么就可以设置 `Service` 的 `topologyKeys` 的值，像下面的做法一样定向流量了。

* 只定向到同一个 `Node` 上的端点，`Node` 上没有端点存在时就失败：配置 `["kubernetes.io/hostname"]`。
* 偏向定向到同一个 `Node`  上的端点，回退同一区域的端点上，然后是同一地区，其它情况下就失败：配置 `["kubernetes.io/hostname",  "topology.kubernetes.io/zone", "topology.kubernetes.io/region"]`。这或许很有用，例如，数据局部性很重要的情况下。
* 偏向于同一区域，但如果此区域中没有可用的终结点，则回退到任何可用的终结点：配置 `["topology.kubernetes.io/zone", "*"]`。

<!--
## Constraints

* Service topology is not compatible with `externalTrafficPolicy=Local`, and
  therefore a Service cannot use both of these features. It is possible to use
  both features in the same cluster on different Services, just not on the same
  Service.

* Valid topology keys are currently limited to `kubernetes.io/hostname`,
  `topology.kubernetes.io/zone`, and `topology.kubernetes.io/region`, but will
  be generalized to other node labels in the future.

* Topology keys must be valid label keys and at most 16 keys may be specified.

* The catch-all value, `"*"`, must be the last value in the topology keys, if
  it is used.
-->

## 约束条件 {#constraints}

* `Service` 拓扑和 `externalTrafficPolicy=Local` 是不兼容的，所以 `Service` 不能同时使用这两种特性。但是在同一个集群的不同 `Service` 上是可以分别使用这两种特性的，只要不在同一个 `Service` 上就可以。

* 有效的拓扑键目前只有：`kubernetes.io/hostname`，`topology.kubernetes.io/zone` 和 `topology.kubernetes.io/region`，但是未来会推广到其它的 `Node` 标签。

* 拓扑键必须是有效的标签，并且最多指定16个。

* 通配符：`"*"`，如果要用，那必须是拓扑键值的最后一个值。 



## {{% heading "whatsnext" %}}


<!--
* Read about [enabling Service Topology](/docs/tasks/administer-cluster/enabling-service-topology)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->

* 阅读关于[启用服务拓扑](/docs/tasks/administer-cluster/enabling-service-topology)
* 阅读[用 `Services` 连接应用程序](/zh/docs/concepts/services-networking/connect-applications-service/)


