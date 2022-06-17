---
title: 使用拓撲鍵實現拓撲感知的流量路由
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
此功能特性，尤其是 Alpha 階段的 `topologyKeys` API，在 Kubernetes v1.21
版本中已被廢棄。Kubernetes v1.21 版本中引入的
[拓撲感知的提示](/zh-cn/docs/concepts/services-networking/topology-aware-hints/),
提供類似的功能。
{{</ note >}}

<!--
_Service Topology_ enables a service to route traffic based upon the Node
topology of the cluster. For example, a service can specify that traffic be
preferentially routed to endpoints that are on the same Node as the client, or
in the same availability zone.
-->
服務拓撲（Service Topology）可以讓一個服務基於叢集的 Node 拓撲進行流量路由。
例如，一個服務可以指定流量是被優先路由到一個和客戶端在同一個 Node 或者在同一可用區域的端點。

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
## 拓撲感知的流量路由 

預設情況下，發往 `ClusterIP` 或者 `NodePort` 服務的流量可能會被路由到
服務的任一後端的地址。Kubernetes 1.7 允許將“外部”流量路由到接收到流量的
節點上的 Pod。對於 `ClusterIP` 服務，無法完成同節點優先的路由，你也無法
配置叢集優選路由到同一可用區中的端點。
透過在 Service 上配置 `topologyKeys`，你可以基於來源節點和目標節點的
標籤來定義流量路由策略。

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
透過對源和目的之間的標籤匹配，作為叢集操作者的你可以根據節點間彼此“較近”和“較遠”
來定義節點集合。你可以基於符合自身需求的任何度量值來定義標籤。
例如，在公有云上，你可能更偏向於把流量控制在同一區內，因為區間流量是有費用成本的，
而區內流量則沒有。
其它常見需求還包括把流量路由到由 `DaemonSet` 管理的本地 Pod 上，或者
把將流量轉發到連線在同一機架交換機的節點上，以獲得低延時。

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

## 使用服務拓撲 {#using-service-topology}

如果叢集啟用了 `ServiceTopology`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
你就可以在 Service 規約中設定 `topologyKeys` 欄位，從而控制其流量路由。
此欄位是 `Node` 標籤的優先順序欄位，將用於在訪問這個 `Service` 時對端點進行排序。
流量會被定向到第一個標籤值和源 `Node` 標籤值相匹配的 `Node`。
如果這個 `Service` 沒有匹配的後端 `Node`，那麼第二個標籤會被使用做匹配，
以此類推，直到沒有標籤。

如果沒有匹配到，流量會被拒絕，就如同這個 `Service` 根本沒有後端。
換言之，系統根據可用後端的第一個拓撲鍵來選擇端點。
如果這個欄位被配置了而沒有後端可以匹配客戶端拓撲，那麼這個 `Service` 
對那個客戶端是沒有後端的，連結應該是失敗的。
這個欄位配置為 `"*"` 意味著任意拓撲。
這個萬用字元值如果使用了，那麼只有作為配置值列表中的最後一個才有用。

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
如果 `topologyKeys` 沒有指定或者為空，就沒有啟用這個拓撲約束。

一個叢集中，其 `Node` 的標籤被打為其主機名，區域名和地區名。
那麼就可以設定 `Service` 的 `topologyKeys` 的值，像下面的做法一樣定向流量了。

* 只定向到同一個 `Node` 上的端點，`Node` 上沒有端點存在時就失敗：
  配置 `["kubernetes.io/hostname"]`。
* 偏向定向到同一個 `Node`  上的端點，回退同一區域的端點上，然後是同一地區，
  其它情況下就失敗：配置 `["kubernetes.io/hostname", "topology.kubernetes.io/zone", "topology.kubernetes.io/region"]`。
  這或許很有用，例如，資料區域性性很重要的情況下。
* 偏向於同一區域，但如果此區域中沒有可用的終結點，則回退到任何可用的終結點：
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
## 約束條件 {#constraints}

* 服務拓撲和 `externalTrafficPolicy=Local` 是不相容的，所以 `Service` 不能同時使用這兩種特性。
  但是在同一個叢集的不同 `Service` 上是可以分別使用這兩種特性的，只要不在同一個
  `Service` 上就可以。

* 有效的拓撲鍵目前只有：`kubernetes.io/hostname`、`topology.kubernetes.io/zone` 和
  `topology.kubernetes.io/region`，但是未來會推廣到其它的 `Node` 標籤。

* 拓撲鍵必須是有效的標籤，並且最多指定16個。

* 萬用字元：`"*"`，如果要用，則必須是拓撲鍵值的最後一個值。 

<!--
## Examples

The following are common examples of using the Service Topology feature.
-->
## 示例

以下是使用服務拓撲功能的常見示例。

<!--
### Only Node Local Endpoints

A Service that only routes to node local endpoints. If no endpoints exist on the node, traffic is dropped:
-->
### 僅節點本地端點

僅路由到節點本地端點的一種服務。如果節點上不存在端點，流量則被丟棄：

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
### 首選節點本地端點

首選節點本地端點，如果節點本地端點不存在，則回退到叢集範圍端點的一種服務：

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
### 僅地域或區域端點

首選地域端點而不是區域端點的一種服務。 如果以上兩種範圍內均不存在端點，
流量則被丟棄。

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
### 優先選擇節點本地端點、地域端點，然後是區域端點

優先選擇節點本地端點，地域端點，然後是區域端點，最後才是叢集範圍端點的
一種服務。

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
* 閱讀關於[啟用服務拓撲](/zh-cn/docs/tasks/administer-cluster/enabling-service-topology/)
* 閱讀[用服務連線應用程式](/zh-cn/docs/concepts/services-networking/connect-applications-service/)

