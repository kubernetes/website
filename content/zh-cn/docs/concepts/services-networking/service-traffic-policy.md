---
title: 服务内部流量策略
content_type: concept
weight: 75
description: >-
   如果集群中的两个 Pod 想要通信，并且两个 Pod 实际上都在同一节点运行，
   **服务内部流量策略** 可以将网络流量限制在该节点内。
   通过集群网络避免流量往返有助于提高可靠性、增强性能（网络延迟和吞吐量）或降低成本。
---
<!-- 
---
reviewers:
- maplain
title: Service Internal Traffic Policy
content_type: concept
weight: 75
description: >-
  If two Pods in your cluster want to communicate, and both Pods are actually running on
  the same node, _Service Internal Traffic Policy_ to keep network traffic within that node.
  Avoiding a round trip via the cluster network can help with reliability, performance
  (network latency and throughput), or cost.
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
**服务内部流量策略**开启了内部流量限制，将内部流量只路由到发起方所处节点内的服务端点。
这里的”内部“流量指当前集群中的 Pod 所发起的流量。
这种机制有助于节省开销，提升效率。

<!-- body -->

<!-- 
## Using Service Internal Traffic Policy
-->
## 使用服务内部流量策略 {#using-service-internal-traffic-policy}

<!-- 
The `ServiceInternalTrafficPolicy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is a Beta feature and enabled by default.
When the feature is enabled, you can enable the internal-only traffic policy for a
{{< glossary_tooltip text="Service" term_id="service" >}}, by setting its
`.spec.internalTrafficPolicy` to `Local`.
This tells kube-proxy to only use node local endpoints for cluster internal traffic.
-->
`ServiceInternalTrafficPolicy`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) 是 Beta 功能，默认启用。
启用该功能后，你就可以通过将 {{< glossary_tooltip text="Service" term_id="service" >}} 的
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
endpoints are considered. When it's `Cluster` or missing, all endpoints are
considered.
When the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`ServiceInternalTrafficPolicy` is enabled, `spec.internalTrafficPolicy` defaults to "Cluster".
-->
kube-proxy 基于 `spec.internalTrafficPolicy` 的设置来过滤路由的目标服务端点。
当它的值设为 `Local` 时，只选择节点本地的服务端点。
当它的值设为 `Cluster` 或缺省时，则选择所有的服务端点。
启用[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
`ServiceInternalTrafficPolicy` 后，
`spec.internalTrafficPolicy` 的值默认设为 `Cluster`。

## {{% heading "whatsnext" %}}

<!-- 
* Read about [Topology Aware Hints](/docs/concepts/services-networking/topology-aware-hints)
* Read about [Service External Traffic Policy](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->
* 请阅读[拓扑感知提示](/zh-cn/docs/concepts/services-networking/topology-aware-hints)
* 请阅读 [Service 的外部流量策略](/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* 请阅读[用 Service 连接应用](/zh-cn/docs/concepts/services-networking/connect-applications-service/)
