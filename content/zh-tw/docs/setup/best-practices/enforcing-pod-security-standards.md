---
title: 強制實施 Pod 安全標準
weight: 40
---
<!--
---
reviewers:
- tallclair
- liggitt
title: Enforcing Pod Security Standards
weight: 40
---
-->

<!-- overview -->

<!--
This page provides an overview of best practices when it comes to enforcing
[Pod Security Standards](/docs/concepts/security/pod-security-standards).
-->
本頁面提供關於強制實施 [Pod 安全標準](/docs/concepts/security/pod-security-standards)
的最佳實務概述。

<!-- body -->

<!--
## Using the built-in Pod Security Admission Controller
-->
## 使用內建的 Pod 安全准入控制器 {#using-the-built-in-pod-security-admission-controller}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
The [Pod Security Admission Controller](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
intends to replace the deprecated PodSecurityPolicies. 
-->
[Pod 安全准入控制器](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
旨在取代已棄用的 PodSecurityPolicies。

<!--
### Configure all cluster namespaces
-->
### 配置所有叢集命名空間 {#configure-all-cluster-namespaces}

<!--
Namespaces that lack any configuration at all should be considered significant gaps in your cluster
security model. We recommend taking the time to analyze the types of workloads occurring in each
namespace, and by referencing the Pod Security Standards, decide on an appropriate level for
each of them. Unlabeled namespaces should only indicate that they've yet to be evaluated.
-->
完全未設定任何配置的命名空間，應視為叢集安全模型中的重要缺口。
我們建議花時間分析各命名空間中執行的工作負載類型，
並參考 Pod 安全標準為每個命名空間選擇適當的安全層級。未加上標籤的命名空間，應僅表示尚未完成評估。

<!--
In the scenario that all workloads in all namespaces have the same security requirements,
we provide an [example](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces)
that illustrates how the PodSecurity labels can be applied in bulk.
-->
在所有命名空間中的所有工作負載都具有相同安全需求的情境下，
我們提供了一個[範例](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces)，
說明如何批次套用 PodSecurity 標籤。

<!--
### Embrace the principle of least privilege
-->
### 採用最小權限原則 {#embrace-the-principle-of-least-privilege}

<!--
In an ideal world, every pod in every namespace would meet the requirements of the `restricted`
policy. However, this is not possible nor practical, as some workloads will require elevated
privileges for legitimate reasons.
-->
在理想的情況下，每個命名空間中的每個 Pod 都應符合 `restricted` 政策的要求。
然而，這既不可能也不切實際，因為某些工作負載基於合理的理由仍需要提升權限。

<!--
- Namespaces allowing `privileged` workloads should establish and enforce appropriate access controls.
- For workloads running in those permissive namespaces, maintain documentation about their unique
  security requirements. If at all possible, consider how those requirements could be further
  constrained.
-->
- 允許 `privileged` 工作負載的命名空間，應建立並強制實施適當的存取控制。
- 對於在這些權限較為寬鬆的命名空間中執行的工作負載，應維護關於其獨特安全需求的文件。
  若情況允許，應考量該如何進一步限制這些需求。

<!--
### Adopt a multi-mode strategy
-->
### 採用多重模式策略 {#adopt-a-multi-mode-strategy}

<!--
The `audit` and `warn` modes of the Pod Security Standards admission controller make it easy to
collect important security insights about your pods without breaking existing workloads.
-->
Pod 安全標準准入控制器的 `audit` 與 `warn` 模式，讓您能輕鬆收集關於 Pod 的重要安全深入分析，
且不會中斷現有的工作負載。

<!--
It is good practice to enable these modes for all namespaces, setting them to the _desired_ level
and version you would eventually like to `enforce`. The warnings and audit annotations generated in
this phase can guide you toward that state. If you expect workload authors to make changes to fit
within the desired level, enable the `warn` mode. If you expect to use audit logs to monitor/drive
changes to fit within the desired level, enable the `audit` mode.
-->
為所有命名空間啟用這些模式是一項良好的做法，將其設定為最終會切換成 `enforce` 模式的目標層級與版本。
在這個階段產生的警告與稽核註解，可以指引您達成此目標狀態。
若您預期工作負載的作者會配合修改以符合目標層級，請啟用 `warn` 模式。
若您預期透過稽核日誌來監控或推動變更以符合目標層級，請啟用 `audit` 模式。

<!--
When you have the `enforce` mode set to your desired value, these modes can still be useful in a
few different ways:
-->
當您已將 `enforce` 模式設定至目標層級時，這些模式在以下幾個方面仍能發揮作用：

<!--
- By setting `warn` to the same level as `enforce`, clients will receive warnings when attempting
  to create Pods (or resources that have Pod templates) that do not pass validation. This will help
  them update those resources to become compliant.
- In Namespaces that pin `enforce` to a specific non-latest version, setting the `audit` and `warn`
  modes to the same level as `enforce`, but to the `latest` version, gives visibility into settings
  that were allowed by previous versions but are not allowed per current best practices.
-->
- 透過將 `warn` 設定為與 `enforce` 相同的層級，
  當使用者嘗試建立未通過驗證的 Pod（或有 Pod 範本的資源）時，將會收到警告。
  這能協助他們更新這些資源以符合規範。
- 在將 `enforce` 固定為某個非最新版本的命名空間中
  若將 `audit` 與 `warn` 模式設定為與 `enforce` 相同的層級，但版本設為 `latest`，
  可讓您發現那些雖然在舊版本中被允許、但根據目前最佳實務已不再被允許的設定。

<!--
## Third-party alternatives
-->
## 第三方替代方案 {#third-party-alternatives}

{{% thirdparty-content %}}

<!--
Other alternatives for enforcing security profiles are being developed in the Kubernetes
ecosystem:
-->
Kubernetes 生態系中也在開發其他用於強制實施安全設定檔的替代方案：

- [Kubewarden](https://github.com/kubewarden).
- [Kyverno](https://kyverno.io/policies/).
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper).

<!--
The decision to go with a _built-in_ solution (e.g. PodSecurity admission controller) versus a
third-party tool is entirely dependent on your own situation. When evaluating any solution,
trust of your supply chain is crucial. Ultimately, using _any_ of the aforementioned approaches
will be better than doing nothing.
-->
選擇使用**內建**方案（例如 Pod 安全准入控制器）還是第三方工具，完全視您的實際情況而定。
在評估任何方案時，對供應鏈的信任至關重要。
總之，採用上述**任何**一種做法，都比完全不做來得更好。