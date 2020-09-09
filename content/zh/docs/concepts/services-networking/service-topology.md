---
title: Service Topology
weight: 20
date: 2020-09-09
publishdate: 2020-09-09
content_type: concept
---

<!--
---
reviewers:
- johnbelamaric
- imroc
title: Service Topology
feature:
  title: Service Topology
  description: >
    Routing of service traffic based upon cluster topology.

content_type: concept
weight: 10
---
 -->

<!-- overview -->
<!--
{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

_Service Topology_ enables a service to route traffic based upon the Node
topology of the cluster. For example, a service can specify that traffic be
preferentially routed to endpoints that are on the same Node as the client, or
in the same availability zone.
 -->
{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

_Service Topology_ 让 Service 可以根据集群中节点的拓扑结构来路由流量。 例如， 一个 Service
可以配置为 流量优先路由到与客户端相同的节点或在同一个可用区的 Endpoint.

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

## 介绍

默认情况下， 发送到 Service  `ClusterIP` 或 `NodePort` 的流量会路由到 Service 的任意一个
后端实例地址。 从 k8s 1.7 开始让外部流量路由到接收到流量的节点上运行的 Pod 上成功可能。
但是这不支持 `ClusterIP` 类型的 Service。 更复杂的拓扑结构  &mdash; 例如根据分区路由 &mdash;
也不可能。 _Service Topology_  提供了让 Service 创建者基于流量源和目标节点标签定义一个流量路由策略来解决定个问题

通过比对源和目标节点的标签， 使用一些必要的度量，就可以推断出这一组节点相对于另一组节点是更近还是更远，
许多在公有云的操作器，例如, 优先将 Service 的流量保持在同一个区里面， 因为一般在公有云跨区流量是
收费的，但区内流量是免费的。其它常见的包括能够路由流量到一个由 DaemonSet 管理的本地 Pod， 或
保持流量在同一个架顶式交换机以达到较低的延迟。

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

## 使用 Service Topology

如果集群启用了 Service Topology， 可以通过 Service 配置的 `topologyKeys` 字段来控制
Service 流量路由方式。 这个字段是一个用于在访问该 Service 时对 Endpoint 排序的一个节点标签的
优先顺序列表。 流量会优先转发到第一个标签与源节点同一个标签有相同值的节点。 如果 Service 后端
的所有节点都没有匹配到，就会尝试使用下一个，直至所有标签都试完。

如果最终一个匹配都没有找到，则这个流量就会被拒绝，就像 Service 根本就没有后端一样。 也就是说，
Endpoint 是基于第一个有可用后端的拓扑键来选择的。 如果设置了这个字段，但所以有条目都没有
与客户端的条目相匹配的，则 Service 便就有针对该客户端的后端，连接就会失败。 有一个特殊的值可以
用来表示 "任意拓扑"。 这是一个匹配所有的值，如果要使用，只有作为列表的最后一个值才有意义。

如果 `topologyKeys` 没有设置或值为空，则不会应用任何拓扑约束。

假定有一个集群中的节点都打上它们的主机名，分区名，地区名。则可以设置 `topologyKeys` 如果值来转发流量


- `["kubernetes.io/hostname"]`: 只匹配同一个节点上的 Endpoint, 如果节点上没有对应的 Endpoint 则失败

- 优先使用同节点上匹配的 Endpoint, 如果没则使用同分区匹配的 Endpoint, 要是还没有则使用同地区
  匹配的 Endpoint, 最后都没匹配则失败。

- `["topology.kubernetes.io/zone", "*"]`: 优先使用同分区匹配的 Endpoint，
  如果没则任意该 Service 的可用 Endpoint 都可以。

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


## 限制

- Service Topology 与 `externalTrafficPolicy=Local` 不兼容，因此同一个 Serice
  不能同时使用这两个特性。 但可以在同一个集群中的不同的 Service 中分别使用一个特性。

- 目前有效的键只有 `kubernetes.io/hostname`, `topology.kubernetes.io/zone`,
 `topology.kubernetes.io/region`，未来可能包含其它的节点标签

- Topology 必须是有效的标签键，最多只能有 16 个键

- 匹配所有的 `"*"`，如果要用，只能用作最后一个键
<!--
## Examples

The following are common examples of using the Service Topology feature.

### Only Node Local Endpoints

A Service that only routes to node local endpoints. If no endpoints exist on the node, traffic is dropped:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
```
 -->

## 示例

The following are common examples of using the Service Topology feature.
以下为 Service Topology 特性常见用法的示例

### 仅限当前节点的 Endpoint

这个 Service 只路由到本节点的 Endpoint， 如果本节点没有匹配的 Endpoint，流量被丢弃:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
```
<!--
### Prefer Node Local Endpoints

A Service that prefers node local Endpoints but falls back to cluster wide endpoints if node local endpoints do not exist:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
    - "*"
```
 -->

### 优先使用本节点的 Endpoint

这个 Service 优先使用本节点匹配的 Endpoint，如果没则使用集群中可用的 Endpoint:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
    - "*"
```

<!--
### Only Zonal or Regional Endpoints

A Service that prefers zonal then regional endpoints. If no endpoints exist in either, traffic is dropped.


```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "topology.kubernetes.io/zone"
    - "topology.kubernetes.io/region"
```
-->

### 仅限本分区或本地区的 Endpoint

这个 Service 优先使用本分区匹配的 Endpoint, 要是没有则使用同地区匹配的 Endpoint, 要是还没有就丢弃流量。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "topology.kubernetes.io/zone"
    - "topology.kubernetes.io/region"
```
<!--
### Prefer Node Local, Zonal, then Regional Endpoints

A Service that prefers node local, zonal, then regional endpoints but falls back to cluster wide endpoints.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
    - "topology.kubernetes.io/zone"
    - "topology.kubernetes.io/region"
    - "*"
```
 -->

### 本节点，本分区，本地区依次优先

这个 Service 按照 本节点，本分区，本地区 的顺序依次匹配，如果三个都没有匹配到，则匹配全集群的 Endpoint

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
    - "topology.kubernetes.io/zone"
    - "topology.kubernetes.io/region"
    - "*"
```

## {{% heading "whatsnext" %}}


* 实践 [启用 Service Topology](/zh/docs/tasks/administer-cluster/enabling-service-topology)
* 概念 [通过 Service 连接应用](/zh/docs/concepts/services-networking/connect-applications-service/)
