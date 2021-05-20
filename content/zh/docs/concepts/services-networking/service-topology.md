---
title: 使用拓扑键实现拓扑感知的流量路由
content_type: concept
weight: 10
---
<!--
reviewers:
- johnbelamaric
- imroc
title: Topology-aware traffic routing with topology keys
content_type: concept
weight: 10
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

{{< note >}}
<!--
This feature, specifically the alpha `topologyKeys` API, is deprecated since
Kubernetes v1.21.
[Topology Aware Hints](/docs/concepts/services-networking/topology-aware-hints/),
introduced in Kubernetes v1.21, provide similar functionality.
-->
此功能特性，尤其是 Alpha 阶段的 `topologyKeys` API，在 Kubernetes v1.21
版本中已被废弃。Kubernetes v1.21 版本中引入的
[拓扑感知的提示](/zh/docs/concepts/services-networking/topology-aware-hints/),
提供类似的功能。
{{</ note >}}

<!--
_Service Topology_ enables a service to route traffic based upon the Node
topology of the cluster. For example, a service can specify that traffic be
preferentially routed to endpoints that are on the same Node as the client, or
in the same availability zone.
-->
服务拓扑（Service Topology）可以让一个服务基于集群的 Node 拓扑进行流量路由。
例如，一个服务可以指定流量是被优先路由到一个和客户端在同一个 Node 或者在同一可用区域的端点。

<!-- body -->

<!--
## Topology-aware traffic routing

By default, traffic sent to a `ClusterIP` or `NodePort` Service may be routed to
any backend address for the Service. Kubernetes 1.7 made it possible to
route "external" traffic to the Pods running on the same Node that received the
traffic. For `ClusterIP` Services, the equivalent same-node preference for
routing wasn't possible; nor could you configure your cluster to favor routing
to endpoints within the same zone.
By setting `topologyKeys` on a Service, you're able to define a policy for routing
traffic based upon the Node labels for the originating and destination Nodes.
-->
## 拓扑感知的流量路由 

默认情况下，发往 `ClusterIP` 或者 `NodePort` 服务的流量可能会被路由到
服务的任一后端的地址。Kubernetes 1.7 允许将“外部”流量路由到接收到流量的
节点上的 Pod。对于 `ClusterIP` 服务，无法完成同节点优先的路由，你也无法
配置集群优选路由到同一可用区中的端点。
通过在 Service 上配置 `topologyKeys`，你可以基于来源节点和目标节点的
标签来定义流量路由策略。

<!--
The label matching between the source and destination lets you, as a cluster
operator, designate sets of Nodes that are "closer" and "farther" from one another.
You can define labels to represent whatever metric makes sense for your own
requirements.
In public clouds, for example, you might prefer to keep network traffic within the
same zone, because interzonal traffic has a cost associated with it (and intrazonal
traffic typically does not). Other common needs include being able to route traffic
to a local Pod managed by a DaemonSet, or directing traffic to Nodes connected to the
same top-of-rack switch for the lowest latency.
-->
通过对源和目的之间的标签匹配，作为集群操作者的你可以根据节点间彼此“较近”和“较远”
来定义节点集合。你可以基于符合自身需求的任何度量值来定义标签。
例如，在公有云上，你可能更偏向于把流量控制在同一区内，因为区间流量是有费用成本的，
而区内流量则没有。
其它常见需求还包括把流量路由到由 `DaemonSet` 管理的本地 Pod 上，或者
把将流量转发到连接在同一机架交换机的节点上，以获得低延时。

<!--
## Using Service Topology

If your cluster has the `ServiceTopology`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled, you can control Service traffic
routing by specifying the `topologyKeys` field on the Service spec. This field
is a preference-order list of Node labels which will be used to sort endpoints
when accessing this Service. Traffic will be directed to a Node whose value for
the first label matches the originating Node's value for that label. If there is
no backend for the Service on a matching Node, then the second label will be
considered, and so forth, until no labels remain.

If no match is found, the traffic will be rejected, as if there were no
backends for the Service at all. That is, endpoints are chosen based on the first
topology key with available backends. If this field is specified and all entries
have no backends that match the topology of the client, the service has no
backends for that client and connections should fail. The special value `"*"` may
be used to mean "any topology". This catch-all value, if used, only makes sense
as the last value in the list.
-->

## 使用服务拓扑 {#using-service-topology}

如果集群启用了 `ServiceTopology`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)，
你就可以在 Service 规约中设定 `topologyKeys` 字段，从而控制其流量路由。
此字段是 `Node` 标签的优先顺序字段，将用于在访问这个 `Service` 时对端点进行排序。
流量会被定向到第一个标签值和源 `Node` 标签值相匹配的 `Node`。
如果这个 `Service` 没有匹配的后端 `Node`，那么第二个标签会被使用做匹配，
以此类推，直到没有标签。

如果没有匹配到，流量会被拒绝，就如同这个 `Service` 根本没有后端。
换言之，系统根据可用后端的第一个拓扑键来选择端点。
如果这个字段被配置了而没有后端可以匹配客户端拓扑，那么这个 `Service` 
对那个客户端是没有后端的，链接应该是失败的。
这个字段配置为 `"*"` 意味着任意拓扑。
这个通配符值如果使用了，那么只有作为配置值列表中的最后一个才有用。

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
如果 `topologyKeys` 没有指定或者为空，就没有启用这个拓扑约束。

一个集群中，其 `Node` 的标签被打为其主机名，区域名和地区名。
那么就可以设置 `Service` 的 `topologyKeys` 的值，像下面的做法一样定向流量了。

* 只定向到同一个 `Node` 上的端点，`Node` 上没有端点存在时就失败：
  配置 `["kubernetes.io/hostname"]`。
* 偏向定向到同一个 `Node`  上的端点，回退同一区域的端点上，然后是同一地区，
  其它情况下就失败：配置 `["kubernetes.io/hostname", "topology.kubernetes.io/zone", "topology.kubernetes.io/region"]`。
  这或许很有用，例如，数据局部性很重要的情况下。
* 偏向于同一区域，但如果此区域中没有可用的终结点，则回退到任何可用的终结点：
  配置 `["topology.kubernetes.io/zone", "*"]`。

<!--
## Constraints

* Service topology is not compatible with `externalTrafficPolicy=Local`, and
  therefore a Service cannot use both of these features. It is possible to use
  both features in the same cluster on different Services, only not on the same
  Service.

* Valid topology keys are currently limited to `kubernetes.io/hostname`,
  `topology.kubernetes.io/zone`, and `topology.kubernetes.io/region`, but will
  be generalized to other node labels in the future.

* Topology keys must be valid label keys and at most 16 keys may be specified.

* The catch-all value, `"*"`, must be the last value in the topology keys, if
  it is used.
-->
## 约束条件 {#constraints}

* 服务拓扑和 `externalTrafficPolicy=Local` 是不兼容的，所以 `Service` 不能同时使用这两种特性。
  但是在同一个集群的不同 `Service` 上是可以分别使用这两种特性的，只要不在同一个
  `Service` 上就可以。

* 有效的拓扑键目前只有：`kubernetes.io/hostname`、`topology.kubernetes.io/zone` 和
  `topology.kubernetes.io/region`，但是未来会推广到其它的 `Node` 标签。

* 拓扑键必须是有效的标签，并且最多指定16个。

* 通配符：`"*"`，如果要用，则必须是拓扑键值的最后一个值。 

<!--
## Examples

The following are common examples of using the Service Topology feature.
-->
## 示例

以下是使用服务拓扑功能的常见示例。

<!--
### Only Node Local Endpoints

A Service that only routes to node local endpoints. If no endpoints exist on the node, traffic is dropped:
-->
### 仅节点本地端点

仅路由到节点本地端点的一种服务。如果节点上不存在端点，流量则被丢弃：

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
-->
### 首选节点本地端点

首选节点本地端点，如果节点本地端点不存在，则回退到集群范围端点的一种服务：

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
-->
### 仅地域或区域端点

首选地域端点而不是区域端点的一种服务。 如果以上两种范围内均不存在端点，
流量则被丢弃。

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
-->
### 优先选择节点本地端点、地域端点，然后是区域端点

优先选择节点本地端点，地域端点，然后是区域端点，最后才是集群范围端点的
一种服务。

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
<!--
* Read about [enabling Service Topology](/docs/tasks/administer-cluster/enabling-service-topology)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->
* 阅读关于[启用服务拓扑](/zh/docs/tasks/administer-cluster/enabling-service-topology/)
* 阅读[用服务连接应用程序](/zh/docs/concepts/services-networking/connect-applications-service/)

