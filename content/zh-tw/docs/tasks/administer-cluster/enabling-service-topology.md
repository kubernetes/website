---
title: 開啟服務拓撲
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
這項功能，特別是 Alpha 狀態的 `topologyKeys` 欄位，在 kubernetes v1.21 中已經棄用。
在 kubernetes v1.21 加入的[拓撲感知提示](/zh-cn/docs/concepts/services-networking/topology-aware-hints/)
提供了類似的功能。

## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
_Service Topology_ enables a {{< glossary_tooltip term_id="service">}} to route traffic based upon the Node
topology of the cluster. For example, a service can specify that traffic be
preferentially routed to endpoints that are on the same Node as the client, or
in the same availability zone.
-->

_服務拓撲（Service Topology）_ 使 {{< glossary_tooltip term_id="service"  text="服務">}} 
能夠根據叢集中的 Node 拓撲來路由流量。
比如，服務可以指定將流量優先路由到與客戶端位於同一節點或者同一可用區域的端點上。

## {{% heading "prerequisites" %}}

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
The following prerequisites are needed in order to enable topology aware service
routing:

   * Kubernetes v1.17 or later
   * Configure {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} to run in iptables mode or IPVS mode
-->
需要下面列的先決條件，才能啟用拓撲感知的服務路由：

   * Kubernetes 1.17 或更新版本
   * 配置 {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} 以 iptables 或者 IPVS 模式執行
<!-- steps -->

<!--
## Enable Service Topology

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

To enable service topology, enable the `ServiceTopology`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for all Kubernetes components:
-->
## 啟用服務拓撲

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

要啟用服務拓撲功能，需要為所有 Kubernetes 元件啟用 `ServiceTopology` 
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)：

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

* 閱讀[拓撲感知提示](/zh-cn/docs/concepts/services-networking/topology-aware-hints/)，該技術是用來替換 `topologyKeys` 欄位的。
* 閱讀[端點切片](/zh-cn/docs/concepts/services-networking/endpoint-slices)
* 閱讀[服務拓撲](/zh-cn/docs/concepts/services-networking/service-topology)概念
* 閱讀[透過服務來連線應用](/zh-cn/docs/concepts/services-networking/connect-applications-service/)