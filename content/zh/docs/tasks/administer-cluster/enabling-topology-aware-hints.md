---
title: 启用拓扑感知提示
content_type: task
min-kubernetes-server-version: 1.21
---
<!-- 
---
reviewers:
- robscott
title: Enabling Topology Aware Hints
content_type: task
min-kubernetes-server-version: 1.21
---
-->

<!-- overview -->
{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

<!-- 
_Topology Aware Hints_ enable topology aware routing with topology hints
included in {{< glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}}.
This approach tries to keep traffic close to where it originated from;
you might do this to reduce costs, or to improve network performance.
-->
_拓扑感知提示_ 启用具有拓扑感知能力的路由，其中拓扑感知信息包含在
{{< glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}} 中。
此功能尽量将流量限制在它的发起区域附近；
可以降低成本，或者提高网络性能。

## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- 
The following prerequisite is needed in order to enable topology aware hints:

* Configure the {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} to run in
  iptables mode or IPVS mode
* Ensure that you have not disabled EndpointSlices
-->
为了启用拓扑感知提示，先要满足以下先决条件：

* 配置 {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}
  以 iptables 或 IPVS 模式运行
* 确保未禁用 EndpointSlices

<!-- 
## Enable Topology Aware Hints
-->
## 启动拓扑感知提示 {#enable-topology-aware-hints}

<!-- 
To enable service topology hints, enable the `TopologyAwareHints` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) for the
kube-apiserver, kube-controller-manager, and kube-proxy:
-->
要启用服务拓扑感知，请启用 kube-apiserver、kube-controller-manager、和 kube-proxy 的
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)
`TopologyAwareHints`。

```
--feature-gates="TopologyAwareHints=true"
```

## {{% heading "whatsnext" %}}

<!-- 
* Read about [Topology Aware Hints](/docs/concepts/services-networking/topology-aware-hints) for Services
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->
* 参阅面向服务的[拓扑感知提示](/zh/docs/concepts/services-networking/topology-aware-hints) 
* 参阅[用服务连通应用](/zh/docs/concepts/services-networking/connect-applications-service/)
