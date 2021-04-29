---
title: 拓扑感知提示
content_type: concept
weight: 45
---
<!-- 
---
reviewers:
- robscott
title: Topology Aware Hints
content_type: concept
weight: 45
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

<!-- 
_Topology Aware Hints_ enable topology aware routing by including suggestions
for how clients should consume endpoints. This approach adds metadata to enable
consumers of EndpointSlice and / or and Endpoints objects, so that traffic to
those network endpoints can be routed closer to where it originated.

For example, you can route traffic within a locality to reduce
costs, or to improve network performance.
-->
_拓扑感知提示_ 包含客户怎么使用服务端点的建议，从而实现了拓扑感知的路由功能。
这种方法添加了元数据，以启用 EndpointSlice 和/或 Endpoints 对象的调用者，
这样，访问这些网络端点的请求流量就可以在它的发起点附近就近路由。

例如，你可以在一个地域内路由流量，以降低通信成本，或提高网络性能。

<!-- body -->

<!-- 
## Motivation
-->
## 动机 {#motivation}

<!-- 
Kubernetes clusters are increasingly deployed in multi-zone environments.
_Topology Aware Hints_ provides a mechanism to help keep traffic within the zone
it originated from. This concept is commonly referred to as "Topology Aware
Routing". When calculating the endpoints for a {{< glossary_tooltip term_id="Service" >}},
the EndpointSlice controller considers the topology (region and zone) of each endpoint
and populates the hints field to allocate it to a zone.
Cluster components such as the {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
can then consume those hints, and use them to influence how traffic to is routed
(favoring topologically closer endpoints).
-->
Kubernetes 集群越来越多的部署到多区域环境中。
_拓扑感知提示_ 提供了一种把流量限制在它的发起区域之内的机制。
这个概念一般被称之为 “拓扑感知路由”。
在计算 {{< glossary_tooltip term_id="Service" >}} 的端点时，
EndpointSlice 控制器会评估每一个端点的拓扑（地域和区域），填充提示字段，并将其分配到某个区域。
集群组件，例如{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
就可以使用这些提示信息，并用他们来影响流量的路由（倾向于拓扑上相邻的端点）。

<!-- 
## Using Topology Aware Hints
-->
## 使用拓扑感知提示 {#using-topology-aware-hints}

<!-- 
If you have [enabled](/docs/tasks/administer-cluster/enabling-topology-aware-hints) the
overall feature, you can activate Topology Aware Hints for a Service by setting the
`service.kubernetes.io/topology-aware-hints` annotation to `auto`. This tells
the EndpointSlice controller to set topology hints if it is deemed safe.
Importantly, this does not guarantee that hints will always be set.
-->
如果你已经[启用](/zh/docs/tasks/administer-cluster/enabling-topology-aware-hints)了整个特性，
就可以通过把注解 `service.kubernetes.io/topology-aware-hints` 的值设置为 `auto`，
来激活服务的拓扑感知提示功能。
这告诉 EndpointSlice 控制器在它认为安全的时候来设置拓扑提示。
重要的是，这并不能保证总会设置提示（hints）。

<!-- 
## How it works {#implementation}
-->
## 工作原理 {#implementation}

<!-- 
The functionality enabling this feature is split into two components: The
EndpointSlice controller and the kube-proxy. This section provides a high level overview
of how each component implements this feature.
-->
此特性启用的功能分为两个组件：EndpointSlice 控制器和 kube-proxy。
本节概述每个组件如何实现此特性。

<!-- 
### EndpointSlice controller {#implementation-control-plane}
-->
### EndpointSlice 控制器 {#implementation-control-plane}

<!-- 
The EndpointSlice controller is responsible for setting hints on EndpointSlices
when this feature is enabled. The controller allocates a proportional amount of
endpoints to each zone. This proportion is based on the
[allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
CPU cores for nodes running in that zone. For example, if one zone had 2 CPU
cores and another zone only had 1 CPU core, the controller would allocated twice
as many endpoints to the zone with 2 CPU cores.
-->
此特性开启后，EndpointSlice 控制器负责在 EndpointSlice 上设置提示信息。
控制器按比例给每个区域分配一定比例数量的端点。
这个比例来源于此区域中运行节点的
[可分配](/zh/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
CPU 核心数。
例如，如果一个区域拥有 2 CPU 核心，而另一个区域只有 1 CPU 核心，
那控制器将给那个有 2 CPU 的区域分配两倍数量的端点。

<!-- 
The following example shows what an EndpointSlice looks like when hints have
been populated:
-->
以下示例展示了提供提示信息后 EndpointSlice 的样子：

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: example-hints
  labels:
    kubernetes.io/service-name: example-svc
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    zone: zone-a
    hints:
      forZones:
        - name: "zone-a"
```

### kube-proxy {#implementation-kube-proxy}

<!-- 
The kube-proxy component filters the endpoints it routes to based on the hints set by
the EndpointSlice controller. In most cases, this means that the kube-proxy is able
to route traffic to endpoints in the same zone. Sometimes the controller allocates endpoints
from a different zone to ensure more even distribution of endpoints between zones.
This would result in some traffic being routed to other zones.
-->
kube-proxy 组件依据 EndpointSlice 控制器设置的提示，过滤由它负责路由的端点。
在大多数场合，这意味着 kube-proxy 可以把流量路由到同一个区域的端点。
有时，控制器从某个不同的区域分配端点，以确保在多个区域之间更平均的分配端点。
这会导致部分流量被路由到其他区域。

<!-- 
## Safeguards
-->
## 保护措施 {#safeguards}

<!-- 
The Kubernetes control plane and the kube-proxy on each node apply some
safeguard rules before using Topology Aware Hints. If these don't check out,
the kube-proxy selects endpoints from anywhere in your cluster, regardless of the
zone.
-->
Kubernetes 控制平面和每个节点上的 kube-proxy，在使用拓扑感知提示功能前，会应用一些保护措施规则。
如果没有检出，kube-proxy 将无视区域限制，从集群中的任意节点上选择端点。

<!-- 
1. **Insufficient number of endpoints:** If there are less endpoints than zones
   in a cluster, the controller will not assign any hints.
-->
1. **端点数量不足：** 如果一个集群中，端点数量少于区域数量，控制器不创建任何提示。

<!-- 
2. **Impossible to achieve balanced allocation:** In some cases, it will be
   impossible to achieve a balanced allocation of endpoints among zones. For
   example, if zone-a is twice as large as zone-b, but there are only 2
   endpoints, an endpoint allocated to zone-a may receive twice as much traffic
   as zone-b. The controller does not assign hints if it can't get this "expected
   overload" value below an acceptable threshold for each zone. Importantly this
   is not based on real-time feedback. It is still possible for individual
   endpoints to become overloaded.
-->
2. **不可能实现均衡分配：** 在一些场合中，不可能实现端点在区域中的平衡分配。
   例如，假设 zone-a 比 zone-b 大两倍，但只有 2 个端点，
   那分配到 zone-a 的端点可能收到比 zone-b多两倍的流量。
   如果控制器不能确定此“期望的过载”值低于每一个区域可接受的阈值，控制器将不指派提示信息。
   重要的是，这不是基于实时反馈。所以对于单独的端点仍有可能超载。

<!-- 
3. **One or more Nodes has insufficient information:** If any node does not have
   a `topology.kubernetes.io/zone` label or is not reporting a value for
   allocatable CPU, the control plane does not set any topology-aware endpoint
   hints and so kube-proxy does not filter endpoints by zone.
-->
3. **一个或多个节点信息不足：** 如果任一节点没有设置标签 `topology.kubernetes.io/zone`，
   或没有上报可分配的 CPU 数据，控制平面将不会设置任何拓扑感知提示，
   继而 kube-proxy 也就不能通过区域过滤端点。

<!-- 
4. **One or more endpoints does not have a zone hint:** When this happens,
   the kube-proxy assumes that a transition from or to Topology Aware Hints is
   underway. Filtering endpoints for a Service in this state would be dangerous
   so the kube-proxy falls back to using all endpoints.
-->
4. **一个或多个端点没有设置区域提示：** 当这类事情发生时，
   kube-proxy 会假设这是正在执行一个从/到拓扑感知提示的转移。
   在这种场合下过滤Service 的端点是有风险的，所以 kube-proxy 回撤为使用所有的端点。

<!-- 
5. **A zone is not represented in hints:** If the kube-proxy is unable to find
   at least one endpoint with a hint targeting the zone it is running in, it falls
   to using endpoints from all zones. This is most likely to happen as you add
   a new zone into your existing cluster.
-->
5. **不在提示中的区域：** 如果 kube-proxy 不能根据一个指示在它所在的区域中发现一个端点，
   它回撤为使用所有节点的端点。当你的集群新增一个新的区域时，这种情况发生概率很高。

<!-- 
## Constraints
-->
## 限制 {#constraints}

<!-- 
* Topology Aware Hints are not used when either `externalTrafficPolicy` or
  `internalTrafficPolicy` is set to `Local` on a Service. It is possible to use
  both features in the same cluster on different Services, just not on the same
  Service.
-->
* 当 Service 的 `externalTrafficPolicy` 或 `internalTrafficPolicy` 设置值为 `Local` 时，
  拓扑感知提示功能不可用。
  你可以在一个集群的不同服务中使用这两个特性，但不能在同一个服务中这么做。

<!-- 
* This approach will not work well for Services that have a large proportion of
  traffic originating from a subset of zones. Instead this assumes that incoming
  traffic will be roughly proportional to the capacity of the Nodes in each
  zone.
-->
* 这种方法不适用于大部分流量来自于一部分区域的服务。
  相反的，这里假设入站流量将根据每个区域中节点的服务能力按比例的分配。

<!-- 
* The EndpointSlice controller ignores unready nodes as it calculates the
  proportions of each zone. This could have unintended consequences if a large
  portion of nodes are unready.
-->
* EndpointSlice 控制器在计算每一个区域的容量比例时，会忽略未就绪的节点。
  在大量节点未就绪的场景下，这样做会带来非预期的结果。

<!-- 
* The EndpointSlice controller does not take into account {{< glossary_tooltip
  text="tolerations" term_id="toleration" >}} when deploying calculating the
  proportions of each zone. If the Pods backing a Service are limited to a
  subset of Nodes in the cluster, this will not be taken into account.
-->
* EndpointSlice 控制器在计算每一个区域的部署比例时，并不会考虑
  {{< glossary_tooltip text="容忍度" term_id="toleration" >}}。
  如果服务后台的 Pod 被限制只能运行在集群节点的一个子集上，这些信息并不会被使用。

<!-- 
* This may not work well with autoscaling. For example, if a lot of traffic is
  originating from a single zone, only the endpoints allocated to that zone will
  be handling that traffic. That could result in {{< glossary_tooltip
  text="Horizontal Pod Autoscaler" term_id="horizontal-pod-autoscaler" >}}
  either not picking up on this event, or newly added pods starting in a
  different zone.
-->
* 这种方法和自动扩展机制之间不能很好的协同工作。例如，如果大量流量来源于一个区域，
  那只有分配到该区域的端点才可用来处理流量。这会导致
  {{< glossary_tooltip text="Pod 自动水平扩展" term_id="horizontal-pod-autoscaler" >}}
  要么不能拾取此事件，要么新增 Pod 被启动到其他区域。

## {{% heading "whatsnext" %}}

<!-- 
* Read about [enabling Topology Aware Hints](/docs/tasks/administer-cluster/enabling-topology-aware-hints/)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->
* 参阅[启用拓扑感知提示](/zh/docs/tasks/administer-cluster/enabling-topology-aware-hints/)
* 参阅[通过服务连通应用](/zh/docs/concepts/services-networking/connect-applications-service/)
