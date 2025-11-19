---
reviewers:
- robscott
title: 拓撲感知路由
content_type: concept
weight: 100
description: >-
  **拓撲感知路由**提供了一種機制幫助保持網路流量處於流量發起的區域內。
  在叢集中 Pod 之間優先使用相同區域的流量有助於提高可靠性、性能（網路延遲和吞吐量）或降低成本。
---
<!--
reviewers:
- robscott
title: Topology Aware Routing
content_type: concept
weight: 100
description: >-
  _Topology Aware Routing_ provides a mechanism to help keep network traffic within the zone
  where it originated. Preferring same-zone traffic between Pods in your cluster can help
  with reliability, performance (network latency and throughput), or cost.
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< note >}}
<!--
Prior to Kubernetes 1.27, this feature was known as _Topology Aware Hints_.
-->
在 Kubernetes 1.27 之前，此特性稱爲**拓撲感知提示（Topology Aware Hint）**。
{{</ note >}}

<!--
_Topology Aware Routing_ adjusts routing behavior to prefer keeping traffic in
the zone it originated from. In some cases this can help reduce costs or improve
network performance.
-->
**拓撲感知路由（Toplogy Aware Routing）** 調整路由行爲，以優先保持流量在其發起區域內。
在某些情況下，這有助於降低成本或提高網路性能。

<!-- body -->

<!--
## Motivation

Kubernetes clusters are increasingly deployed in multi-zone environments.
_Topology Aware Routing_ provides a mechanism to help keep traffic within the
zone it originated from. When calculating the endpoints for a {{<
glossary_tooltip term_id="Service" >}}, the EndpointSlice controller considers
the topology (region and zone) of each endpoint and populates the hints field to
allocate it to a zone. Cluster components such as {{< glossary_tooltip
term_id="kube-proxy" text="kube-proxy" >}} can then consume those hints, and use
them to influence how the traffic is routed (favoring topologically closer
endpoints).
-->
## 動機   {#motivation}

Kubernetes 叢集越來越多地部署在多區域環境中。
**拓撲感知路由** 提供了一種機制幫助流量保留在其發起所在的區域內。
計算 {{<glossary_tooltip term_id="Service">}} 的端點時，
EndpointSlice 控制器考慮每個端點的物理拓撲（地區和區域），並填充提示字段以將其分配到區域。
諸如 {{<glossary_tooltip term_id="kube-proxy" text="kube-proxy">}}
等叢集組件可以使用這些提示，影響流量的路由方式（優先考慮物理拓撲上更近的端點）。

<!--
## Enabling Topology Aware Routing
-->
## 啓用拓撲感知路由   {#enabling-topology-aware-routing}

{{< note >}}
<!--
Prior to Kubernetes 1.27, this behavior was controlled using the
`service.kubernetes.io/topology-aware-hints` annotation.
-->
在 Kubernetes 1.27 之前，此行爲是通過 `service.kubernetes.io/topology-aware-hints` 註解來控制的。
{{</ note >}}

<!--
You can enable Topology Aware Routing for a Service by setting the
`service.kubernetes.io/topology-mode` annotation to `Auto`. When there are
enough endpoints available in each zone, Topology Hints will be populated on
EndpointSlices to allocate individual endpoints to specific zones, resulting in
traffic being routed closer to where it originated from.
-->
你可以通過將 `service.kubernetes.io/topology-mode` 註解設置爲 `Auto` 來啓用 Service 的拓撲感知路由。
當每個區域中有足夠的端點可用時，系統將爲 EndpointSlices 填充拓撲提示，把每個端點分配給特定區域，
從而使流量被路由到更接近其來源的位置。

<!--
## When it works best

This feature works best when:
-->
## 何時效果最佳   {#when-it-works-best}

此特性在以下場景中的工作效果最佳：

<!--
### 1. Incoming traffic is evenly distributed

If a large proportion of traffic is originating from a single zone, that traffic
could overload the subset of endpoints that have been allocated to that zone.
This feature is not recommended when incoming traffic is expected to originate
from a single zone.
-->
### 1. 入站流量均勻分佈   {#incoming-traffic-is-evently-distributed}

如果大部分流量源自同一個區域，則該流量可能會使分配到該區域的端點子集過載。
當預計入站流量源自同一區域時，不建議使用此特性。

<!--
### 2. The Service has 3 or more endpoints per zone {#three-or-more-endpoints-per-zone}

In a three zone cluster, this means 9 or more endpoints. If there are fewer than
3 endpoints per zone, there is a high (≈50%) probability that the EndpointSlice
controller will not be able to allocate endpoints evenly and instead will fall
back to the default cluster-wide routing approach.
-->
### 2. 服務在每個區域具有至少 3 個端點 {#three-or-more-endpoints-per-zone}

在一個三區域的叢集中，這意味着有至少 9 個端點。如果每個區域的端點少於 3 個，
則 EndpointSlice 控制器很大概率（約 50％）無法平均分配端點，而是回退到默認的叢集範圍的路由方法。

<!--
## How It Works

The "Auto" heuristic attempts to proportionally allocate a number of endpoints
to each zone. Note that this heuristic works best for Services that have a
significant number of endpoints.
-->
## 工作原理 {#how-it-works}

“自動”啓發式算法會嘗試按比例分配一定數量的端點到每個區域。
請注意，這種啓發方式對具有大量端點的 Service 效果最佳。

<!--
### EndpointSlice controller {#implementation-control-plane}

The EndpointSlice controller is responsible for setting hints on EndpointSlices
when this heuristic is enabled. The controller allocates a proportional amount of
endpoints to each zone. This proportion is based on the
[allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
CPU cores for nodes running in that zone. For example, if one zone had 2 CPU
cores and another zone only had 1 CPU core, the controller would allocate twice
as many endpoints to the zone with 2 CPU cores.
-->
### EndpointSlice 控制器 {#implementation-control-plane}

當啓用此啓發方式時，EndpointSlice 控制器負責在各個 EndpointSlice 上設置提示信息。
控制器按比例給每個區域分配一定比例數量的端點。
這個比例基於在該區域中運行的節點的[可分配](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
CPU 核心數。例如，如果一個區域有 2 個 CPU 核心，而另一個區域只有 1 個 CPU 核心，
那麼控制器將給那個有 2 CPU 的區域分配兩倍數量的端點。

<!--
The following example shows what an EndpointSlice looks like when hints have
been populated:
-->
以下示例展示了提供提示信息後 EndpointSlice 的樣子：

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
kube-proxy 組件依據 EndpointSlice 控制器設置的提示，過濾由它負責路由的端點。
在大多數場合，這意味着 kube-proxy 可以把流量路由到同一個區域的端點。
有時，控制器在另一不同的區域中分配端點，以確保在多個區域之間更平均地分配端點。
這會導致部分流量被路由到其他區域。

<!-- 
## Safeguards
-->
## 保護措施 {#safeguards}

<!--
The Kubernetes control plane and the kube-proxy on each node apply some
safeguard rules before using Topology Aware Hints. If these don't check out,
the kube-proxy selects endpoints from anywhere in your cluster, regardless of the
zone.
-->
Kubernetes 控制平面和每個節點上的 kube-proxy 在使用拓撲感知提示信息前，會應用一些保護措施規則。
如果規則無法順利通過，kube-proxy 將無視區域限制，從叢集中的任意位置選擇端點。

<!--
1. **Insufficient number of endpoints:** If there are less endpoints than zones
   in a cluster, the controller will not assign any hints.
-->
1. **端點數量不足：** 如果一個叢集中，端點數量少於區域數量，控制器不創建任何提示。

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
2. **不可能實現均衡分配：** 在一些場合中，不可能實現端點在區域中的平衡分配。
   例如，假設 zone-a 比 zone-b 大兩倍，但只有 2 個端點，
   那分配到 zone-a 的端點可能收到比 zone-b 多兩倍的流量。
   如果控制器不能確保此“期望的過載”值低於每一個區域可接受的閾值，控制器將不添加提示信息。
   重要的是，這不是基於實時反饋。所以對於特定的端點仍有可能超載。

<!--
3. **One or more Nodes has insufficient information:** If any node does not have
   a `topology.kubernetes.io/zone` label or is not reporting a value for
   allocatable CPU, the control plane does not set any topology-aware endpoint
   hints and so kube-proxy does not filter endpoints by zone.
-->
3. **一個或多個 Node 信息不足：** 如果任一節點沒有設置標籤 `topology.kubernetes.io/zone`，
   或沒有上報可分配的 CPU 數據，控制平面將不會設置任何拓撲感知提示，
   進而 kube-proxy 也就不能根據區域來過濾端點。

<!--
4. **One or more endpoints does not have a zone hint:** When this happens,
   the kube-proxy assumes that a transition from or to Topology Aware Hints is
   underway. Filtering endpoints for a Service in this state would be dangerous
   so the kube-proxy falls back to using all endpoints.
-->
4. **至少一個端點沒有設置區域提示：** 當這種情況發生時，
   kube-proxy 會假設從拓撲感知提示到拓撲感知路由（或反方向）的遷移仍在進行中，
   在這種場合下過濾 Service 的端點是有風險的，所以 kube-proxy 回退到使用所有端點。

<!--
5. **A zone is not represented in hints:** If the kube-proxy is unable to find
   at least one endpoint with a hint targeting the zone it is running in, it falls
   back to using endpoints from all zones. This is most likely to happen as you add
   a new zone into your existing cluster.
-->
5. **提示中不存在某區域：** 如果 kube-proxy 無法找到提示中指向它當前所在的區域的端點，
   它將回退到使用來自所有區域的端點。當你向現有叢集新增新的區域時，這種情況發生概率很高。

<!-- 
## Constraints
-->
## 限制 {#constraints}

<!--
* Topology Aware Hints are not used when `internalTrafficPolicy` is set to `Local`
  on a Service. It is possible to use both features in the same cluster on different
  Services, just not on the same Service.
-->
* 當 Service 的 `internalTrafficPolicy` 值設置爲 `Local` 時，
  系統將不使用拓撲感知提示信息。你可以在同一叢集中的不同 Service 上使用這兩個特性，
  但不能在同一個 Service 上這麼做。

<!--
* This approach will not work well for Services that have a large proportion of
  traffic originating from a subset of zones. Instead this assumes that incoming
  traffic will be roughly proportional to the capacity of the Nodes in each
  zone.
-->
* 這種方法不適用於大部分流量來自於一部分區域的 Service。
  相反，這項技術的假設是入站流量與各區域中節點的服務能力成比例關係。

<!--
* The EndpointSlice controller ignores unready nodes as it calculates the
  proportions of each zone. This could have unintended consequences if a large
  portion of nodes are unready.
-->
* EndpointSlice 控制器在計算各區域的比例時，會忽略未就緒的節點。
  在大部分節點未就緒的場景下，這樣做會帶來非預期的結果。

<!--
* The EndpointSlice controller ignores nodes with the
  `node-role.kubernetes.io/control-plane` or `node-role.kubernetes.io/master`
  label set. This could be problematic if workloads are also running on those
  nodes.
-->
* EndpointSlice 控制器忽略設置了 `node-role.kubernetes.io/control-plane` 或
  `node-role.kubernetes.io/master` 標籤的節點。如果工作負載也在這些節點上運行，也可能會產生問題。

<!--
* The EndpointSlice controller does not take into account {{< glossary_tooltip
  text="tolerations" term_id="toleration" >}} when deploying or calculating the
  proportions of each zone. If the Pods backing a Service are limited to a
  subset of Nodes in the cluster, this will not be taken into account.
-->
* EndpointSlice 控制器在分派或計算各區域的比例時，並不會考慮
  {{< glossary_tooltip text="容忍度" term_id="toleration" >}}。
  如果 Service 背後的各 Pod 被限制只能運行在叢集節點的一個子集上，計算比例時不會考慮這點。

<!--
* This may not work well with autoscaling. For example, if a lot of traffic is
  originating from a single zone, only the endpoints allocated to that zone will
  be handling that traffic. That could result in {{< glossary_tooltip
  text="Horizontal Pod Autoscaler" term_id="horizontal-pod-autoscaler" >}}
  either not picking up on this event, or newly added pods starting in a
  different zone.
-->
* 這項技術和自動擴縮容機制之間可能存在衝突。例如，如果大量流量來源於同一個區域，
  那只有分配到該區域的端點纔可用來處理流量。這會導致
  {{< glossary_tooltip text="Pod 自動水平擴縮容" term_id="horizontal-pod-autoscaler" >}}
  要麼不能處理這種場景，要麼會在別的區域添加 Pod。

<!--
## Custom heuristics
-->
## 自定義啓發方式   {#custom-heuristics}

<!--
Kubernetes is deployed in many different ways, there is no single heuristic for
allocating endpoints to zones will work for every use case. A key goal of this
feature is to enable custom heuristics to be developed if the built in heuristic
does not work for your use case. The first steps to enable custom heuristics
were included in the 1.27 release. This is a limited implementation that may not
yet cover some relevant and plausible situations.
-->
Kubernetes 的部署方式有很多種，沒有一種按區域分配端點的啓發式方法能夠適用於所有場景。
此特性的一個關鍵目標是：如果內置的啓發方式不能滿足你的使用場景，則可以開發自定義的啓發方式。
啓用自定義啓發方式的第一步包含在了 1.27 版本中。
這是一個限制性較強的實現，可能尚未涵蓋一些重要的、可進一步探索的場景。

## {{% heading "whatsnext" %}}

<!--
* Follow the [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/) tutorial
* Learn about the
  [trafficDistribution](/docs/concepts/services-networking/service/#traffic-distribution)
  field, which is closely related to the `service.kubernetes.io/topology-mode`
  annotation and provides flexible options for traffic routing within
  Kubernetes.
-->
* 參閱[使用 Service 連接到應用](/zh-cn/docs/tutorials/services/connect-applications-service/)教程。
* 進一步瞭解 [trafficDistribution](/zh-cn/docs/concepts/services-networking/service/#traffic-distribution)字段，
  該字段與 `service.kubernetes.io/topology-mode` 註解密切相關，併爲 Kubernetes 中的流量路由提供靈活的設定選項。
