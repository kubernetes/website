---
title: Pod 开销
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

<!--
When you run a Pod on a Node, the Pod itself takes an amount of system resources. These
resources are additional to the resources needed to run the container(s) inside the Pod.
_Pod Overhead_ is a feature for accounting for the resources consumed by the pod infrastructure
on top of the container requests & limits.
-->

在节点上运行 Pod 时，Pod 本身占用大量系统资源。这些资源是运行 Pod 内容器所需资源的附加资源。
_POD 开销_ 是一个特性，用于计算 Pod 基础设施在容器请求和限制之上消耗的资源。

{{% /capture %}}


{{% capture body %}}

<!--
## Pod Overhead
-->

## Pod 开销

<!--
In Kubernetes, the pod's overhead is set at
[admission](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
time according to the overhead associated with the pod's
[RuntimeClass](/docs/concepts/containers/runtime-class/).
-->

在 Kubernetes 中，Pod 的开销是根据与 Pod 的 [RuntimeClass](/docs/concepts/containers/runtime-class/) 相关联的开销在[准入](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)时设置的。

<!--
When Pod Overhead is enabled, the overhead is considered in addition to the sum of container
resource requests when scheduling a pod. Similarly, Kubelet will include the pod overhead when sizing
the pod cgroup, and when carrying out pod eviction ranking.
-->
当启用 Pod 开销时，在调度 Pod 时，除了考虑容器资源请求的总和外，还要考虑 Pod 开销。类似地，Kubelet 将在确定 pod cgroup 的大小和执行 Pod 驱逐排序时包含 Pod 开销。

<!--
### Set Up
-->
### 设置

<!--
You need to make sure that the `PodOverhead`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled (it is off by default)
across your cluster. This means:
-->
您需要确保在集群中启用了 `PodOverhead` [特性门](/docs/reference/command-line-tools-reference/feature-gates/)（默认情况下是关闭的）。这意味着：

<!--
- in {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
- in {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}}
- in the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} on each Node
- in any custom API servers that use feature gates
-->
- 在 {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
- 在 {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}}
- 在每一个 Node 的 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
- 在任何使用特性门的自定义api服务器中


{{< note >}}
<!--
Users who can write to RuntimeClass resources are able to have cluster-wide impact on
workload performance. You can limit access to this ability using Kubernetes access controls.
See [Authorization Overview](/docs/reference/access-authn-authz/authorization/) for more details.
-->
能够写入运行时类资源的用户能够对工作负载性能产生集群范围的影响。可以使用 Kubernetes 访问控制来限制对此功能的访问。
有关详细信息，请参见[授权概述](/docs/reference/access-authn-authz/authorization/)。
{{< /note >}}


{{% /capture %}}

{{% capture whatsnext %}}

<!--
* [RuntimeClass](/docs/concepts/containers/runtime-class/)
* [PodOverhead Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)
-->

{{% /capture %}}
