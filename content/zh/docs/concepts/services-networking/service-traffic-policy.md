---
title: 服务内部流量策略
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

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

<!-- 
_Service Internal Traffic Policy_ enables internal traffic restrictions to only route
internal traffic to endpoints within the node the traffic originated from. The
"internal" traffic here refers to traffic originated from Pods in the current
cluster. This can help to reduce costs and improve performance.
-->
_服务内部流量策略_ 开启了内部流量限制，只路由内部流量到和发起方处于相同节点的服务端点。
这里的”内部“流量指当前集群中的 Pod 所发起的流量。
这种机制有助于节省开销，提升效率。

<!-- body -->

<!-- 
## Using Service Internal Traffic Policy
-->
## 使用服务内部流量策略 {#using-service-internal-traffic-policy}

<!-- 
Once you have enabled the `ServiceInternalTrafficPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
you can enable an internal-only traffic policy for a
{{< glossary_tooltip text="Services" term_id="service" >}}, by setting its
`.spec.internalTrafficPolicy` to `Local`.
This tells kube-proxy to only use node local endpoints for cluster internal traffic.
-->
一旦你启用了 `ServiceInternalTrafficPolicy` 这个
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/),
你就可以通过将 {{< glossary_tooltip text="Services" term_id="service" >}} 的 
`.spec.internalTrafficPolicy` 项设置为 `Local`，
来为它指定一个内部专用的流量策略。
此设置就相当于告诉 kube-proxy 对于集群内部流量只能使用本地的服务端口。

<!-- 
For pods on nodes with no endpoints for a given Service, the Service
behaves as if it has zero endpoints (for Pods on this node) even if the service
does have endpoints on other nodes.
-->
{{< note >}}
如果某节点上的 Pod 均不提供指定 Service 的服务端点，
即使该 Service 在其他节点上有可用的服务端点，
Service 的行为看起来也像是它只有 0 个服务端点（只针对此节点上的 Pod）。
{{< /note >}}

<!-- 
The following example shows what a Service looks like when you set
`.spec.internalTrafficPolicy` to `Local`:
-->
以下示例展示了把 Service 的 `.spec.internalTrafficPolicy` 项设为 `Local` 时，
Service 的样子：


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
kube-proxy 基于 `spec.internalTrafficPolicy` 的设置来过滤路由的目标服务端点。
当它的值设为 `Local` 时，只选择节点本地的服务端点。
当它的值设为 `Cluster` 或缺省时，则选择所有的服务端点。
启用[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)
`ServiceInternalTrafficPolicy` 后，
`spec.internalTrafficPolicy` 的值默认设为 `Cluster`。

<!-- 
## Constraints
-->
## 限制 {#constraints}

<!-- 
* Service Internal Traffic Policy is not used when `externalTrafficPolicy` is set
  to `Local` on a Service. It is possible to use both features in the same cluster
  on different Services, just not on the same Service.
-->
* 在一个Service上，当 `externalTrafficPolicy` 已设置为 `Local`时，服务内部流量策略无法使用。
  换句话说，在一个集群的不同 Service 上可以同时使用这两个特性，但在一个 Service 上不行。

## {{% heading "whatsnext" %}}

<!-- 
* Read about [enabling Topology Aware Hints](/docs/tasks/administer-cluster/enabling-topology-aware-hints)
* Read about [Service External Traffic Policy](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->
* 请阅读[启用拓扑感知提示](/zh/docs/tasks/administer-cluster/enabling-topology-aware-hints)
* 请阅读[Service 的外部流量策略](/zh/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* 请阅读[用 Service 连接应用](/zh/docs/concepts/services-networking/connect-applications-service/)
