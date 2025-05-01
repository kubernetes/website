---
title: 节点指标数据
content_type: reference
weight: 50
description: >-
  访问 kubelet 所观测到的节点、卷、Pod 和容器级别指标的机制。
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
在节点、卷、Pod 和容器级别收集统计信息，
并在[概要 API](zh-cn/docs/reference/config-api/kubelet-stats.v1alpha1/)
中输出这些信息。

<!--
You can send a proxied request to the stats summary API via the
Kubernetes API server.

Here is an example of a Summary API request for a node named `minikube`:
-->
你可以通过 Kubernetes API 服务器将代理的请求发送到 stats 概要 API。

下面是一个名为 `minikube` 的节点的概要 API 请求示例：

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
下面是使用 `curl` 所执行的相同 API 调用：

```shell
# 你需要先运行 "kubectl proxy"
# 更改 8080 为 "kubectl proxy" 指派的端口
curl http://localhost:8080/api/v1/nodes/minikube/proxy/stats/summary
```

{{< note >}}
<!--
Beginning with `metrics-server` 0.6.x, `metrics-server` queries the `/metrics/resource`
kubelet endpoint, and not `/stats/summary`.
-->
从 `metrics-server` 0.6.x 开始，`metrics-server` 查询 `/metrics/resource`
kubelet 端点，不查询 `/stats/summary`。
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
## 概要指标 API 源  {#summary-api-source}

默认情况下，Kubernetes 使用 kubelet 内运行的嵌入式 [cAdvisor](https://github.com/google/cadvisor)
获取节点概要指标数据。如果你在自己的集群中启用 `PodAndContainerStatsFromCRI`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
且你通过{{< glossary_tooltip term_id="cri" text="容器运行时接口">}}（CRI）使用支持统计访问的容器运行时，
则 kubelet [将使用 CRI 来获取 Pod 和容器级别的指标数据](/zh-cn/docs/reference/instrumentation/cri-pod-container-metrics)，
而不是 cAdvisor 来获取。

<!--
## Pressure Stall Information (PSI) {#psi}
-->
## 压力停滞信息（PSI）

{{< feature-state for_k8s_version="v1.33" state="alpha" >}}

<!--
As an alpha feature, Kubernetes lets you configure kubelet to collect Linux kernel
[Pressure Stall Information](https://docs.kernel.org/accounting/psi.html)
(PSI) for CPU, memory and IO usage. The information is collected at node, pod and container level.
See [Summary API](/docs/reference/config-api/kubelet-stats.v1alpha1/) for detailed schema.
You must enable the `KubeletPSI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
to use this feature. The information is also exposed in
[Prometheus metrics](/docs/concepts/cluster-administration/system-metrics#psi-metrics).
-->
作为 Alpha 级别特性，Kubernetes 允许你配置 kubelet 来收集 Linux
内核的[压力停滞信息](https://docs.kernel.org/accounting/psi.html)（PSI）
的 CPU、内存和 IO 使用情况。这些信息是在节点、Pod 和容器级别上收集的。
详细模式请参见 [Summary API](/zh-cn/docs/reference/config-api/kubelet-stats.v1alpha1/)。
你必须启用 `KubeletPSI`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)才能使用此特性。
这些信息也在
[Prometheus 指标](/zh-cn/docs/concepts/cluster-administration/system-metrics#psi-metrics)中暴露。

<!--
### Requirements

Pressure Stall Information requires:

- [Linux kernel versions 4.20 or later](/docs/reference/node/kernel-version-requirements#requirements-psi).
- [cgroup v2](/docs/concepts/architecture/cgroups)
-->
### 要求

压力停滞信息要求：

- [Linux 内核版本 4.20 或更新](/zh-cn/docs/reference/node/kernel-version-requirements#requirements-psi)。
- [CGroup v2](/zh-cn/docs/concepts/architecture/cgroups)

## {{% heading "whatsnext" %}}

<!--
The task pages for [Troubleshooting Clusters](/docs/tasks/debug/debug-cluster/) discuss
how to use a metrics pipeline that rely on these data.
-->
[集群故障排查](/zh-cn/docs/tasks/debug/debug-cluster/)任务页面讨论了如何使用依赖这些数据的指标管道。
