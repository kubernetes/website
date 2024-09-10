---
title: "策略"
weight: 90
no_list: true
description: 通过策略管理安全性和最佳实践。
---
<!--
title: "Policies"
weight: 90
no_list: true
description: >
  Manage security and best-practices with policies.
-->

<!-- overview -->

<!--
Kubernetes policies are configurations that manage other configurations or runtime behaviors. Kubernetes offers various forms of policies, described below:
-->
Kubernetes 策略是管理其他配置或运行时行为的一些配置。
Kubernetes 提供了各种形式的策略，具体如下所述：

<!-- body -->

<!--
## Apply policies using API objects

 Some API objects act as policies. Here are some examples:
* [NetworkPolicies](/docs/concepts/services-networking/network-policies/) can be used to restrict ingress and egress traffic for a workload.
* [LimitRanges](/docs/concepts/policy/limit-range/) manage resource allocation constraints across different object kinds.
* [ResourceQuotas](/docs/concepts/policy/resource-quotas/) limit resource consumption for a {{< glossary_tooltip text="namespace" term_id="namespace" >}}.
-->
## 使用 API 对象应用策略   {#apply-policies-using-api-objects}

一些 API 对象可用作策略。以下是一些示例：

* [NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies/) 用于限制工作负载的出入站流量。
* [LimitRange](/zh-cn/docs/concepts/policy/limit-range/) 管理多个不同对象类别的资源分配约束。
* [ResourceQuota](/zh-cn/docs/concepts/policy/resource-quotas/)
  限制{{< glossary_tooltip text="名字空间" term_id="namespace" >}}的资源消耗。

<!--
## Apply policies using admission controllers

An {{< glossary_tooltip text="admission controller" term_id="admission-controller" >}}
runs in the API server
and can validate or mutate API requests. Some admission controllers act to apply policies.
For example, the [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) admission controller modifies a new Pod to set the image pull policy to `Always`.
-->
## 使用准入控制器应用策略   {#apply-policies-using-admission-controllers}

{{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}运行在 API 服务器上，
可以验证或变更 API 请求。某些准入控制器用于应用策略。
例如，[AlwaysPullImages](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
准入控制器会修改新 Pod，将镜像拉取策略设置为 `Always`。

<!--
Kubernetes has several built-in admission controllers that are configurable via the API server `--enable-admission-plugins` flag.

Details on admission controllers, with the complete list of available admission controllers, are documented in a dedicated section:

* [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
-->
Kubernetes 具有多个内置的准入控制器，可通过 API 服务器的 `--enable-admission-plugins` 标志进行配置。

关于准入控制器的详细信息（包括可用准入控制器的完整列表），请查阅专门的章节：

* [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)

<!--
## Apply policies using ValidatingAdmissionPolicy

Validating admission policies allow configurable validation checks to be executed in the API server using the Common Expression Language (CEL). For example, a `ValidatingAdmissionPolicy` can be used to disallow use of the `latest` image tag.
-->
## 使用 ValidatingAdmissionPolicy 应用策略   {#apply-policies-using-validatingadmissionpolicy}

验证性的准入策略允许使用通用表达式语言 (CEL) 在 API 服务器中执行可配置的验证检查。
例如，`ValidatingAdmissionPolicy` 可用于禁止使用 `latest` 镜像标签。

<!--
A `ValidatingAdmissionPolicy` operates on an API request and can be used to block, audit, and warn users about non-compliant configurations.

Details on the `ValidatingAdmissionPolicy` API, with examples, are documented in a dedicated section:
* [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/)
-->
`ValidatingAdmissionPolicy` 对请求 API 进行操作，可就不合规的配置执行阻止、审计和警告用户等操作。
有关 `ValidatingAdmissionPolicy` API 的详细信息及示例，请查阅专门的章节：

* [验证准入策略](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)

<!--
## Apply policies using dynamic admission control

Dynamic admission controllers (or admission webhooks) run outside the API server as separate applications that register to receive webhooks requests to perform validation or mutation of API requests.
-->
## 使用动态准入控制应用策略   {#apply-policies-using-dynamic-admission-control}

动态准入控制器（或准入 Webhook）作为单独的应用在 API 服务器之外运行，
这些应用注册自身后可以接收 Webhook 请求以便对 API 请求进行验证或变更。

<!--
Dynamic admission controllers can be used to apply policies on API requests and trigger other policy-based workflows. A dynamic admission controller can perform complex checks including those that require retrieval of other cluster resources and external data. For example, an image verification check can lookup data from OCI registries to validate the container image signatures and attestations.

Details on dynamic admission control are documented in a dedicated section:
* [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
-->
动态准入控制器可用于在 API 请求上应用策略并触发其他基于策略的工作流。
动态准入控制器可以执行一些复杂的检查，包括需要读取其他集群资源和外部数据的复杂检查。
例如，镜像验证检查可以从 OCI 镜像仓库中查找数据，以验证容器镜像签名和证明信息。

有关动态准入控制的详细信息，请查阅专门的章节：

* [动态准入控制](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)

<!--
### Implementations {#implementations-admission-control}
-->
### 实现 {#implementations-admission-control}

{{% thirdparty-content %}}

<!--
Dynamic Admission Controllers that act as flexible policy engines are being developed in the Kubernetes ecosystem, such as:
- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
- [Polaris](https://polaris.docs.fairwinds.com/admission-controller/)
-->
Kubernetes 生态系统中正在开发作为灵活策略引擎的动态准入控制器，例如：

- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
- [Polaris](https://polaris.docs.fairwinds.com/admission-controller/)

<!--
## Apply policies using Kubelet configurations

Kubernetes allows configuring the Kubelet on each worker node.  Some Kubelet configurations act as policies:
* [Process ID limits and reservations](/docs/concepts/policy/pid-limiting/) are used to limit and reserve allocatable PIDs.
* [Node Resource Managers](/docs/concepts/policy/node-resource-managers/) can manage compute, memory, and device resources for latency-critical and high-throughput workloads.
-->
## 使用 Kubelet 配置应用策略   {#apply-policies-using-kubelet-configurations}

Kubernetes 允许在每个工作节点上配置 Kubelet。一些 Kubelet 配置可以视为策略：

* [进程 ID 限制和保留](/zh-cn/docs/concepts/policy/pid-limiting/)用于限制和保留可分配的 PID。
* [节点资源管理器](/zh-cn/docs/concepts/policy/node-resource-managers/)可以为低延迟和高吞吐量工作负载管理计算、内存和设备资源。
