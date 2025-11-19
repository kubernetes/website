---
title: 服務內部流量策略
content_type: concept
weight: 120
description: >-
   如果集羣中的兩個 Pod 想要通信，並且兩個 Pod 實際上都在同一節點運行，
   **服務內部流量策略** 可以將網絡流量限制在該節點內。
   通過集羣網絡避免流量往返有助於提高可靠性、增強性能（網絡延遲和吞吐量）或降低成本。
---
<!-- 
---
reviewers:
- maplain
title: Service Internal Traffic Policy
content_type: concept
weight: 120
description: >-
  If two Pods in your cluster want to communicate, and both Pods are actually running on
  the same node, _Service Internal Traffic Policy_ to keep network traffic within that node.
  Avoiding a round trip via the cluster network can help with reliability, performance
  (network latency and throughput), or cost.
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!-- 
_Service Internal Traffic Policy_ enables internal traffic restrictions to only route
internal traffic to endpoints within the node the traffic originated from. The
"internal" traffic here refers to traffic originated from Pods in the current
cluster. This can help to reduce costs and improve performance.
-->
**服務內部流量策略**開啓了內部流量限制，將內部流量只路由到發起方所處節點內的服務端點。
這裏的”內部“流量指當前集羣中的 Pod 所發起的流量。
這種機制有助於節省開銷，提升效率。

<!-- body -->

<!-- 
## Using Service Internal Traffic Policy
-->
## 使用服務內部流量策略 {#using-service-internal-traffic-policy}

<!--
You can enable the internal-only traffic policy for a
{{< glossary_tooltip text="Service" term_id="service" >}}, by setting its
`.spec.internalTrafficPolicy` to `Local`. This tells kube-proxy to only use node local
endpoints for cluster internal traffic.
-->
你可以通過將 {{< glossary_tooltip text="Service" term_id="service" >}} 的
`.spec.internalTrafficPolicy` 項設置爲 `Local`，
來爲它指定一個內部專用的流量策略。
此設置就相當於告訴 kube-proxy 對於集羣內部流量只能使用節點本地的服務端口。

<!-- 
For pods on nodes with no endpoints for a given Service, the Service
behaves as if it has zero endpoints (for Pods on this node) even if the service
does have endpoints on other nodes.
-->
{{< note >}}
如果某節點上的 Pod 均不提供指定 Service 的服務端點，
即使該 Service 在其他節點上有可用的服務端點，
Service 的行爲看起來也像是它只有 0 個服務端點（只針對此節點上的 Pod）。
{{< /note >}}

<!-- 
The following example shows what a Service looks like when you set
`.spec.internalTrafficPolicy` to `Local`:
-->
以下示例展示了把 Service 的 `.spec.internalTrafficPolicy` 項設爲 `Local` 時，
Service 的樣子：


```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  internalTrafficPolicy: Local
```

<!-- 
## How it works
-->
## 工作原理 {#how-it-works}

<!--
The kube-proxy filters the endpoints it routes to based on the
`spec.internalTrafficPolicy` setting. When it's set to `Local`, only node local
endpoints are considered. When it's `Cluster` (the default), or is not set,
Kubernetes considers all endpoints.
-->
kube-proxy 基於 `spec.internalTrafficPolicy` 的設置來過濾路由的目標服務端點。
當它的值設爲 `Local` 時，只會選擇節點本地的服務端點。
當它的值設爲 `Cluster` 或缺省時，Kubernetes 會選擇所有的服務端點。

## {{% heading "whatsnext" %}}

<!-- 
* Read about [Topology Aware Routing](/docs/concepts/services-networking/topology-aware-routing)
* Read about [Service External Traffic Policy](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Follow the [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/) tutorial
-->
* 請閱讀[拓撲感知路由](/zh-cn/docs/concepts/services-networking/topology-aware-routing/)
* 請閱讀 [Service 的外部流量策略](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* 遵循[使用 Service 連接到應用](/zh-cn/docs/tutorials/services/connect-applications-service/)教程
