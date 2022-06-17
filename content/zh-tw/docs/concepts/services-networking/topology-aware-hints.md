---
title: 拓撲感知提示
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

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

<!-- 
_Topology Aware Hints_ enable topology aware routing by including suggestions
for how clients should consume endpoints. This approach adds metadata to enable
consumers of EndpointSlice and / or Endpoints objects, so that traffic to
those network endpoints can be routed closer to where it originated.

For example, you can route traffic within a locality to reduce
costs, or to improve network performance.
-->
_拓撲感知提示_ 包含客戶怎麼使用服務端點的建議，從而實現了拓撲感知的路由功能。
這種方法添加了元資料，以啟用 EndpointSlice 和/或 Endpoints 物件的呼叫者，
這樣，訪問這些網路端點的請求流量就可以在它的發起點附近就近路由。

例如，你可以在一個地域內路由流量，以降低通訊成本，或提高網路效能。

<!-- 
The "topology-aware hints" feature is at Beta stage and it is **NOT** enabled
by default. To try out this feature, you have to enable the `TopologyAwareHints`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
-->

{{< note >}}
“拓撲感知提示”特性處於 Beta 階段，並且預設情況下**未**啟用。 
要試用此特性，你必須啟用 `TopologyAwareHints`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
{{< /note >}}

<!-- body -->

<!-- 
## Motivation
-->
## 動機 {#motivation}

<!-- 
Kubernetes clusters are increasingly deployed in multi-zone environments.
_Topology Aware Hints_ provides a mechanism to help keep traffic within the zone
it originated from. This concept is commonly referred to as "Topology Aware
Routing". When calculating the endpoints for a {{< glossary_tooltip term_id="Service" >}},
the EndpointSlice controller considers the topology (region and zone) of each endpoint
and populates the hints field to allocate it to a zone.
Cluster components such as the {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
can then consume those hints, and use them to influence how the traffic to is routed
(favoring topologically closer endpoints).
-->
Kubernetes 叢集越來越多的部署到多區域環境中。
_拓撲感知提示_ 提供了一種把流量限制在它的發起區域之內的機制。
這個概念一般被稱之為 “拓撲感知路由”。
在計算 {{< glossary_tooltip term_id="Service" >}} 的端點時，
EndpointSlice 控制器會評估每一個端點的拓撲（地域和區域），填充提示欄位，並將其分配到某個區域。
叢集元件，例如{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}
就可以使用這些提示資訊，並用他們來影響流量的路由（傾向於拓撲上相鄰的端點）。

<!-- 
## Using Topology Aware Hints
-->
## 使用拓撲感知提示 {#using-topology-aware-hints}

<!-- 
You can activate Topology Aware Hints for a Service by setting the
`service.kubernetes.io/topology-aware-hints` annotation to `auto`. This tells
the EndpointSlice controller to set topology hints if it is deemed safe.
Importantly, this does not guarantee that hints will always be set.
-->

你可以透過把註解 `service.kubernetes.io/topology-aware-hints` 的值設定為 `auto`，
來啟用服務的拓撲感知提示功能。
這告訴 EndpointSlice 控制器在它認為安全的時候來設定拓撲提示。
重要的是，這並不能保證總會設定提示（hints）。

<!-- 
## How it works {#implementation}
-->
## 工作原理 {#implementation}

<!-- 
The functionality enabling this feature is split into two components: The
EndpointSlice controller and the kube-proxy. This section provides a high level overview
of how each component implements this feature.
-->
此特性啟用的功能分為兩個元件：EndpointSlice 控制器和 kube-proxy。
本節概述每個元件如何實現此特性。

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
此特性開啟後，EndpointSlice 控制器負責在 EndpointSlice 上設定提示資訊。
控制器按比例給每個區域分配一定比例數量的端點。
這個比例來源於此區域中執行節點的
[可分配](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
CPU 核心數。
例如，如果一個區域擁有 2 CPU 核心，而另一個區域只有 1 CPU 核心，
那控制器將給那個有 2 CPU 的區域分配兩倍數量的端點。

<!-- 
The following example shows what an EndpointSlice looks like when hints have
been populated:
-->
以下示例展示了提供提示資訊後 EndpointSlice 的樣子：

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
kube-proxy 元件依據 EndpointSlice 控制器設定的提示，過濾由它負責路由的端點。
在大多數場合，這意味著 kube-proxy 可以把流量路由到同一個區域的端點。
有時，控制器從某個不同的區域分配端點，以確保在多個區域之間更平均的分配端點。
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
Kubernetes 控制平面和每個節點上的 kube-proxy，在使用拓撲感知提示功能前，會應用一些保護措施規則。
如果沒有檢出，kube-proxy 將無視區域限制，從叢集中的任意節點上選擇端點。

<!-- 
1. **Insufficient number of endpoints:** If there are less endpoints than zones
   in a cluster, the controller will not assign any hints.
-->
1. **端點數量不足：** 如果一個叢集中，端點數量少於區域數量，控制器不建立任何提示。

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
   那分配到 zone-a 的端點可能收到比 zone-b多兩倍的流量。
   如果控制器不能確定此“期望的過載”值低於每一個區域可接受的閾值，控制器將不指派提示資訊。
   重要的是，這不是基於實時反饋。所以對於單獨的端點仍有可能超載。

<!-- 
3. **One or more Nodes has insufficient information:** If any node does not have
   a `topology.kubernetes.io/zone` label or is not reporting a value for
   allocatable CPU, the control plane does not set any topology-aware endpoint
   hints and so kube-proxy does not filter endpoints by zone.
-->
3. **一個或多個節點資訊不足：** 如果任一節點沒有設定標籤 `topology.kubernetes.io/zone`，
   或沒有上報可分配的 CPU 資料，控制平面將不會設定任何拓撲感知提示，
   繼而 kube-proxy 也就不能透過區域過濾端點。

<!-- 
4. **One or more endpoints does not have a zone hint:** When this happens,
   the kube-proxy assumes that a transition from or to Topology Aware Hints is
   underway. Filtering endpoints for a Service in this state would be dangerous
   so the kube-proxy falls back to using all endpoints.
-->
4. **一個或多個端點沒有設定區域提示：** 當這類事情發生時，
   kube-proxy 會假設這是正在執行一個從/到拓撲感知提示的轉移。
   在這種場合下過濾Service 的端點是有風險的，所以 kube-proxy 回撤為使用所有的端點。

<!-- 
5. **A zone is not represented in hints:** If the kube-proxy is unable to find
   at least one endpoint with a hint targeting the zone it is running in, it falls
   to using endpoints from all zones. This is most likely to happen as you add
   a new zone into your existing cluster.
-->
5. **不在提示中的區域：** 如果 kube-proxy 不能根據一個指示在它所在的區域中發現一個端點，
   它回撤為使用所有節點的端點。當你的叢集新增一個新的區域時，這種情況發生機率很高。

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
* 當 Service 的 `externalTrafficPolicy` 或 `internalTrafficPolicy` 設定值為 `Local` 時，
  拓撲感知提示功能不可用。
  你可以在一個叢集的不同服務中使用這兩個特性，但不能在同一個服務中這麼做。

<!-- 
* This approach will not work well for Services that have a large proportion of
  traffic originating from a subset of zones. Instead this assumes that incoming
  traffic will be roughly proportional to the capacity of the Nodes in each
  zone.
-->
* 這種方法不適用於大部分流量來自於一部分割槽域的服務。
  相反的，這裡假設入站流量將根據每個區域中節點的服務能力按比例的分配。

<!-- 
* The EndpointSlice controller ignores unready nodes as it calculates the
  proportions of each zone. This could have unintended consequences if a large
  portion of nodes are unready.
-->
* EndpointSlice 控制器在計算每一個區域的容量比例時，會忽略未就緒的節點。
  在大量節點未就緒的場景下，這樣做會帶來非預期的結果。

<!-- 
* The EndpointSlice controller does not take into account {{< glossary_tooltip
  text="tolerations" term_id="toleration" >}} when deploying calculating the
  proportions of each zone. If the Pods backing a Service are limited to a
  subset of Nodes in the cluster, this will not be taken into account.
-->
* EndpointSlice 控制器在計算每一個區域的部署比例時，並不會考慮
  {{< glossary_tooltip text="容忍度" term_id="toleration" >}}。
  如果服務後臺的 Pod 被限制只能執行在叢集節點的一個子集上，這些資訊並不會被使用。

<!-- 
* This may not work well with autoscaling. For example, if a lot of traffic is
  originating from a single zone, only the endpoints allocated to that zone will
  be handling that traffic. That could result in {{< glossary_tooltip
  text="Horizontal Pod Autoscaler" term_id="horizontal-pod-autoscaler" >}}
  either not picking up on this event, or newly added pods starting in a
  different zone.
-->
* 這種方法和自動擴充套件機制之間不能很好的協同工作。例如，如果大量流量來源於一個區域，
  那只有分配到該區域的端點才可用來處理流量。這會導致
  {{< glossary_tooltip text="Pod 自動水平擴充套件" term_id="horizontal-pod-autoscaler" >}}
  要麼不能拾取此事件，要麼新增 Pod 被啟動到其他區域。

## {{% heading "whatsnext" %}}

<!-- 
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->

* 參閱[透過服務連通應用](/zh-cn/docs/concepts/services-networking/connect-applications-service/)
