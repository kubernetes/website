---
title: 服務內部流量策略
content_type: concept
weight: 45
---
<!-- 
---
reviewers:
- maplain
title: Service Internal Traffic Policy
content_type: concept
weight: 45
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

<!-- 
_Service Internal Traffic Policy_ enables internal traffic restrictions to only route
internal traffic to endpoints within the node the traffic originated from. The
"internal" traffic here refers to traffic originated from Pods in the current
cluster. This can help to reduce costs and improve performance.
-->
_服務內部流量策略_ 開啟了內部流量限制，只路由內部流量到和發起方處於相同節點的服務端點。
這裡的”內部“流量指當前叢集中的 Pod 所發起的流量。
這種機制有助於節省開銷，提升效率。

<!-- body -->

<!-- 
## Using Service Internal Traffic Policy
-->
## 使用服務內部流量策略 {#using-service-internal-traffic-policy}

<!-- 
The `ServiceInternalTrafficPolicy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is a Beta feature and enabled by default.
When the feature is enabled, you can enable the internal-only traffic policy for a
{{< glossary_tooltip text="Services" term_id="service" >}}, by setting its
`.spec.internalTrafficPolicy` to `Local`.
This tells kube-proxy to only use node local endpoints for cluster internal traffic.
-->
`ServiceInternalTrafficPolicy` 
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) 是 Beta 功能，預設啟用。
啟用該功能後，你就可以透過將 {{< glossary_tooltip text="Services" term_id="service" >}} 的 
`.spec.internalTrafficPolicy` 項設定為 `Local`，
來為它指定一個內部專用的流量策略。
此設定就相當於告訴 kube-proxy 對於叢集內部流量只能使用本地的服務埠。

<!-- 
For pods on nodes with no endpoints for a given Service, the Service
behaves as if it has zero endpoints (for Pods on this node) even if the service
does have endpoints on other nodes.
-->
{{< note >}}
如果某節點上的 Pod 均不提供指定 Service 的服務端點，
即使該 Service 在其他節點上有可用的服務端點，
Service 的行為看起來也像是它只有 0 個服務端點（只針對此節點上的 Pod）。
{{< /note >}}

<!-- 
The following example shows what a Service looks like when you set
`.spec.internalTrafficPolicy` to `Local`:
-->
以下示例展示了把 Service 的 `.spec.internalTrafficPolicy` 項設為 `Local` 時，
Service 的樣子：


```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
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
endpoints are considered. When it's `Cluster` or missing, all endpoints are
considered.
When the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`ServiceInternalTrafficPolicy` is enabled, `spec.internalTrafficPolicy` defaults to "Cluster".
-->
kube-proxy 基於 `spec.internalTrafficPolicy` 的設定來過濾路由的目標服務端點。
當它的值設為 `Local` 時，只選擇節點本地的服務端點。
當它的值設為 `Cluster` 或預設時，則選擇所有的服務端點。
啟用[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
`ServiceInternalTrafficPolicy` 後，
`spec.internalTrafficPolicy` 的值預設設為 `Cluster`。

<!-- 
## Constraints
-->
## 限制 {#constraints}

<!-- 
* Service Internal Traffic Policy is not used when `externalTrafficPolicy` is set
  to `Local` on a Service. It is possible to use both features in the same cluster
  on different Services, just not on the same Service.
-->
* 在一個Service上，當 `externalTrafficPolicy` 已設定為 `Local`時，服務內部流量策略無法使用。
  換句話說，在一個叢集的不同 Service 上可以同時使用這兩個特性，但在一個 Service 上不行。

## {{% heading "whatsnext" %}}

<!-- 
* Read about [Topology Aware Hints](/docs/concepts/services-networking/topology-aware-hints)
* Read about [Service External Traffic Policy](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->
* 請閱讀[拓撲感知提示](/zh-cn/docs/concepts/services-networking/topology-aware-hints)
* 請閱讀[Service 的外部流量策略](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* 請閱讀[用 Service 連線應用](/zh-cn/docs/concepts/services-networking/connect-applications-service/)
