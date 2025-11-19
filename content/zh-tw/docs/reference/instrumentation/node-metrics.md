---
title: 節點指標數據
content_type: reference
weight: 50
description: >-
  訪問 kubelet 所觀測到的節點、卷、Pod 和容器級別指標的機制。
---
<!--
title: Node metrics data
content_type: reference
weight: 50
description: >-
  Mechanisms for accessing metrics at node, volume, pod and container level,
  as seen by the kubelet.
-->

<!--
The [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
gathers metric statistics at the node, volume, pod and container level,
and emits this information in the
[Summary API](/docs/reference/config-api/kubelet-stats.v1alpha1/).
-->
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
在節點、卷、Pod 和容器級別收集統計信息，
並在 [Summary API](zh-cn/docs/reference/config-api/kubelet-stats.v1alpha1/)
中輸出這些信息。

<!--
You can send a proxied request to the stats summary API via the
Kubernetes API server.

Here is an example of a Summary API request for a node named `minikube`:
-->
你可以通過 Kubernetes API 伺服器將代理的請求發送到 stats Summary API。

下面是一個名爲 `minikube` 的節點的 Summary API 請求示例：

```shell
kubectl get --raw "/api/v1/nodes/minikube/proxy/stats/summary"
```

<!--
Here is the same API call using `curl`:

```shell
# You need to run "kubectl proxy" first
# Change 8080 to the port that "kubectl proxy" assigns
curl http://localhost:8080/api/v1/nodes/minikube/proxy/stats/summary
```
-->
下面是使用 `curl` 所執行的相同 API 調用：

```shell
# 你需要先運行 "kubectl proxy"
# 更改 8080 爲 "kubectl proxy" 指派的端口
curl http://localhost:8080/api/v1/nodes/minikube/proxy/stats/summary
```

{{< note >}}
<!--
Beginning with `metrics-server` 0.6.x, `metrics-server` queries the `/metrics/resource`
kubelet endpoint, and not `/stats/summary`.
-->
從 `metrics-server` 0.6.x 開始，`metrics-server` 查詢 `/metrics/resource`
kubelet 端點，不查詢 `/stats/summary`。
{{< /note >}}

<!--
## Summary metrics API source {#summary-api-source}

By default, Kubernetes fetches node summary metrics data using an embedded
[cAdvisor](https://github.com/google/cadvisor) that runs within the kubelet. If you 
enable the `PodAndContainerStatsFromCRI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) 
in your cluster, and you use a container runtime that supports statistics access via
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI), then
the kubelet [fetches Pod- and container-level metric data using CRI](/docs/reference/instrumentation/cri-pod-container-metrics), and not via cAdvisor.
-->
## 概要指標 API 源  {#summary-api-source}

默認情況下，Kubernetes 使用 kubelet 內運行的嵌入式 [cAdvisor](https://github.com/google/cadvisor)
獲取節點概要指標數據。如果你在自己的叢集中啓用 `PodAndContainerStatsFromCRI`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
且你通過{{< glossary_tooltip term_id="cri" text="容器運行時接口">}}（CRI）使用支持統計訪問的容器運行時，
則 kubelet [將使用 CRI 來獲取 Pod 和容器級別的指標數據](/zh-cn/docs/reference/instrumentation/cri-pod-container-metrics)，
而不是 cAdvisor 來獲取。

<!--
## Pressure Stall Information (PSI) {#psi}
-->
## 壓力停滯信息（PSI）

{{< feature-state for_k8s_version="v1.34" state="beta" >}}

<!--
As a beta feature, Kubernetes lets you configure kubelet to collect Linux kernel
[Pressure Stall Information](https://docs.kernel.org/accounting/psi.html)
(PSI) for CPU, memory and I/O usage. The information is collected at node, pod and container level.
See [Summary API](/docs/reference/config-api/kubelet-stats.v1alpha1/) for detailed schema.
This feature is enabled by default, by setting the `KubeletPSI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/). The information is also exposed in
[Prometheus metrics](/docs/concepts/cluster-administration/system-metrics#psi-metrics).
-->
作爲 Beta 級別特性，Kubernetes 允許你設定 kubelet 來收集 Linux
內核的[壓力停滯信息](https://docs.kernel.org/accounting/psi.html)（PSI）
的 CPU、內存和 I/O 使用情況。這些信息是在節點、Pod 和容器級別上收集的。
詳細模式請參見 [Summary API](/zh-cn/docs/reference/config-api/kubelet-stats.v1alpha1/)。
此特性默認啓用，通過 `KubeletPSI`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)管理。
這些信息也在
[Prometheus 指標](/zh-cn/docs/concepts/cluster-administration/system-metrics#psi-metrics)中暴露。

<!--
You can learn how to interpret the PSI metrics in [Understand PSI Metrics](/docs/reference/instrumentation/understand-psi-metrics/).
-->
參見[瞭解 PSI 指標](/zh-cn/docs/reference/instrumentation/understand-psi-metrics/)，
學習如何解讀 PSI 指標。

<!--
### Requirements

Pressure Stall Information requires:

- [Linux kernel versions 4.20 or later](/docs/reference/node/kernel-version-requirements#requirements-psi).
- [cgroup v2](/docs/concepts/architecture/cgroups)
-->
### 要求

壓力停滯信息要求：

- [Linux 內核版本 4.20 或更新](/zh-cn/docs/reference/node/kernel-version-requirements#requirements-psi)。
- [CGroup v2](/zh-cn/docs/concepts/architecture/cgroups)

## {{% heading "whatsnext" %}}

<!--
The task pages for [Troubleshooting Clusters](/docs/tasks/debug/debug-cluster/) discuss
how to use a metrics pipeline that rely on these data.
-->
[叢集故障排查](/zh-cn/docs/tasks/debug/debug-cluster/)任務頁面討論瞭如何使用依賴這些數據的指標管道。
