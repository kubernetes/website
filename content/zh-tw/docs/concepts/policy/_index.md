---
title: "策略"
weight: 90
no_list: true
description: 通過策略管理安全性和最佳實踐。
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
Kubernetes 策略是管理其他配置或運行時行爲的一些配置。
Kubernetes 提供了各種形式的策略，具體如下所述：

<!-- body -->

<!--
## Apply policies using API objects

 Some API objects act as policies. Here are some examples:
* [NetworkPolicies](/docs/concepts/services-networking/network-policies/) can be used to restrict ingress and egress traffic for a workload.
* [LimitRanges](/docs/concepts/policy/limit-range/) manage resource allocation constraints across different object kinds.
* [ResourceQuotas](/docs/concepts/policy/resource-quotas/) limit resource consumption for a {{< glossary_tooltip text="namespace" term_id="namespace" >}}.
-->
## 使用 API 對象應用策略   {#apply-policies-using-api-objects}

一些 API 對象可用作策略。以下是一些示例：

* [NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies/) 用於限制工作負載的出入站流量。
* [LimitRange](/zh-cn/docs/concepts/policy/limit-range/) 管理多個不同對象類別的資源分配約束。
* [ResourceQuota](/zh-cn/docs/concepts/policy/resource-quotas/)
  限制{{< glossary_tooltip text="名字空間" term_id="namespace" >}}的資源消耗。

<!--
## Apply policies using admission controllers

An {{< glossary_tooltip text="admission controller" term_id="admission-controller" >}}
runs in the API server
and can validate or mutate API requests. Some admission controllers act to apply policies.
For example, the [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) admission controller modifies a new Pod to set the image pull policy to `Always`.
-->
## 使用准入控制器應用策略   {#apply-policies-using-admission-controllers}

{{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}運行在 API 服務器上，
可以驗證或變更 API 請求。某些准入控制器用於應用策略。
例如，[AlwaysPullImages](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
准入控制器會修改新 Pod，將鏡像拉取策略設置爲 `Always`。

<!--
Kubernetes has several built-in admission controllers that are configurable via the API server `--enable-admission-plugins` flag.

Details on admission controllers, with the complete list of available admission controllers, are documented in a dedicated section:

* [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
-->
Kubernetes 具有多個內置的准入控制器，可通過 API 服務器的 `--enable-admission-plugins` 標誌進行配置。

關於准入控制器的詳細信息（包括可用准入控制器的完整列表），請查閱專門的章節：

* [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)

<!--
## Apply policies using ValidatingAdmissionPolicy

Validating admission policies allow configurable validation checks to be executed in the API server using the Common Expression Language (CEL). For example, a `ValidatingAdmissionPolicy` can be used to disallow use of the `latest` image tag.
-->
## 使用 ValidatingAdmissionPolicy 應用策略   {#apply-policies-using-validatingadmissionpolicy}

驗證性的准入策略允許使用通用表達式語言 (CEL) 在 API 服務器中執行可配置的驗證檢查。
例如，`ValidatingAdmissionPolicy` 可用於禁止使用 `latest` 鏡像標籤。

<!--
A `ValidatingAdmissionPolicy` operates on an API request and can be used to block, audit, and warn users about non-compliant configurations.

Details on the `ValidatingAdmissionPolicy` API, with examples, are documented in a dedicated section:
* [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/)
-->
`ValidatingAdmissionPolicy` 對請求 API 進行操作，可就不合規的配置執行阻止、審計和警告用戶等操作。
有關 `ValidatingAdmissionPolicy` API 的詳細信息及示例，請查閱專門的章節：

* [驗證准入策略](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)

<!--
## Apply policies using dynamic admission control

Dynamic admission controllers (or admission webhooks) run outside the API server as separate applications that register to receive webhooks requests to perform validation or mutation of API requests.
-->
## 使用動態准入控制應用策略   {#apply-policies-using-dynamic-admission-control}

動態准入控制器（或准入 Webhook）作爲單獨的應用在 API 服務器之外運行，
這些應用註冊自身後可以接收 Webhook 請求以便對 API 請求進行驗證或變更。

<!--
Dynamic admission controllers can be used to apply policies on API requests and trigger other policy-based workflows. A dynamic admission controller can perform complex checks including those that require retrieval of other cluster resources and external data. For example, an image verification check can lookup data from OCI registries to validate the container image signatures and attestations.

Details on dynamic admission control are documented in a dedicated section:
* [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
-->
動態准入控制器可用於在 API 請求上應用策略並觸發其他基於策略的工作流。
動態准入控制器可以執行一些複雜的檢查，包括需要讀取其他集羣資源和外部數據的複雜檢查。
例如，鏡像驗證檢查可以從 OCI 鏡像倉庫中查找數據，以驗證容器鏡像簽名和證明信息。

有關動態准入控制的詳細信息，請查閱專門的章節：

* [動態准入控制](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)

<!--
### Implementations {#implementations-admission-control}
-->
### 實現 {#implementations-admission-control}

{{% thirdparty-content %}}

<!--
Dynamic Admission Controllers that act as flexible policy engines are being developed in the Kubernetes ecosystem, such as:
- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)
- [Polaris](https://polaris.docs.fairwinds.com/admission-controller/)
-->
Kubernetes 生態系統中正在開發作爲靈活策略引擎的動態准入控制器，例如：

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
## 使用 Kubelet 配置應用策略   {#apply-policies-using-kubelet-configurations}

Kubernetes 允許在每個工作節點上配置 Kubelet。一些 Kubelet 配置可以視爲策略：

* [進程 ID 限制和保留](/zh-cn/docs/concepts/policy/pid-limiting/)用於限制和保留可分配的 PID。
* [節點資源管理器](/zh-cn/docs/concepts/policy/node-resource-managers/)可以爲低延遲和高吞吐量工作負載管理計算、內存和設備資源。
