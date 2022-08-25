---
title: 开启服务拓扑
content_type: task
min-kubernetes-server-version: 1.17
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}
<!--
This feature, specifically the alpha `topologyKeys` field, is deprecated since
Kubernetes v1.21.
[Topology Aware Hints](/docs/concepts/services-networking/topology-aware-hints/),
introduced in Kubernetes v1.21, provide similar functionality.
-->
这项功能，特别是 Alpha 状态的 `topologyKeys` 字段，在 kubernetes v1.21 中已经弃用。
在 kubernetes v1.21 加入的[拓扑感知提示](/zh-cn/docs/concepts/services-networking/topology-aware-hints/)
提供了类似的功能。

## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
_Service Topology_ enables a {{< glossary_tooltip term_id="service">}} to route traffic based upon the Node
topology of the cluster. For example, a service can specify that traffic be
preferentially routed to endpoints that are on the same Node as the client, or
in the same availability zone.
-->

_服务拓扑（Service Topology）_ 使 {{< glossary_tooltip term_id="service"  text="服务">}} 
能够根据集群中的 Node 拓扑来路由流量。
比如，服务可以指定将流量优先路由到与客户端位于同一节点或者同一可用区域的端点上。

## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
The following prerequisites are needed in order to enable topology aware service
routing:

   * Kubernetes v1.17 or later
   * Configure {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} to run in iptables mode or IPVS mode
-->
需要下面列的先决条件，才能启用拓扑感知的服务路由：

   * Kubernetes 1.17 或更新版本
   * 配置 {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} 以 iptables 或者 IPVS 模式运行
<!-- steps -->

<!--
## Enable Service Topology

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

To enable service topology, enable the `ServiceTopology`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for all Kubernetes components:
-->
## 启用服务拓扑

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

要启用服务拓扑功能，需要为所有 Kubernetes 组件启用 `ServiceTopology` 
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)：

```
--feature-gates="ServiceTopology=true`
```


## {{% heading "whatsnext" %}}

<!--
* Read about [Topology Aware Hints](/docs/concepts/services-networking/topology-aware-hints/), the replacement for the `topologyKeys` field.
* Read about [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
* Read about the [Service Topology](/docs/concepts/services-networking/service-topology/) concept
* Read [Connecting Applications with Services](/docs/concepts/services-networking/connect-applications-service/)
-->

* 阅读[拓扑感知提示](/zh-cn/docs/concepts/services-networking/topology-aware-hints/)，该技术是用来替换 `topologyKeys` 字段的。
* 阅读[端点切片](/zh-cn/docs/concepts/services-networking/endpoint-slices)
* 阅读[服务拓扑](/zh-cn/docs/concepts/services-networking/service-topology)概念
* 阅读[通过服务来连接应用](/zh-cn/docs/concepts/services-networking/connect-applications-service/)