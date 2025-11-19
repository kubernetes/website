---
title: 強制實施 Pod 安全性標準
weight: 40
---

<!--
reviewers:
- tallclair
- liggitt
title: Enforcing Pod Security Standards
weight: 40
-->

<!-- overview -->

<!--
This page provides an overview of best practices when it comes to enforcing
[Pod Security Standards](/docs/concepts/security/pod-security-standards).
-->
本頁提供實施 [Pod 安全標準（Pod Security Standards）](/zh-cn/docs/concepts/security/pod-security-standards)
時的一些最佳實踐。

<!-- body -->

<!--
## Using the built-in Pod Security Admission Controller
-->
## 使用內置的 Pod 安全性准入控制器

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
The [Pod Security Admission Controller](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
intends to replace the deprecated PodSecurityPolicies. 
-->
[Pod 安全性准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
嘗試替換已被廢棄的 PodSecurityPolicies。

<!--
### Configure all cluster namespaces
-->
### 配置所有集羣名字空間    {#configure-all-cluster-namespaces}

<!--
Namespaces that lack any configuration at all should be considered significant gaps in your cluster
security model. We recommend taking the time to analyze the types of workloads occurring in each
namespace, and by referencing the Pod Security Standards, decide on an appropriate level for
each of them. Unlabeled namespaces should only indicate that they've yet to be evaluated.
-->
完全未經配置的名字空間應該被視爲集羣安全模型中的重大缺陷。
我們建議花一些時間來分析在每個名字空間中執行的負載的類型，
並通過引用 Pod 安全性標準來確定每個負載的合適級別。
未設置標籤的名字空間應該視爲尚未被評估。

<!--
In the scenario that all workloads in all namespaces have the same security requirements,
we provide an [example](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces)
that illustrates how the PodSecurity labels can be applied in bulk.
-->
針對所有名字空間中的所有負載都具有相同的安全性需求的場景，
我們提供了一個[示例](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces)
用來展示如何批量應用 Pod 安全性標籤。

<!--
### Embrace the principle of least privilege

In an ideal world, every pod in every namespace would meet the requirements of the `restricted`
policy. However, this is not possible nor practical, as some workloads will require elevated
privileges for legitimate reasons.
-->
### 擁抱最小特權原則

在一個理想環境中，每個名字空間中的每個 Pod 都會滿足 `restricted` 策略的需求。
不過，這既不可能也不現實，某些負載會因爲合理的原因而需要特權上的提升。

<!--
- Namespaces allowing `privileged` workloads should establish and enforce appropriate access controls.
- For workloads running in those permissive namespaces, maintain documentation about their unique
  security requirements. If at all possible, consider how those requirements could be further
  constrained.
-->
- 允許 `privileged` 負載的名字空間需要建立並實施適當的訪問控制機制。
- 對於運行在特權寬鬆的名字空間中的負載，需要維護其獨特安全性需求的文檔。
  如果可能的話，要考慮如何進一步約束這些需求。

<!--
### Adopt a multi-mode strategy

The `audit` and `warn` modes of the Pod Security Standards admission controller make it easy to
collect important security insights about your pods without breaking existing workloads.
-->
### 採用多種模式的策略

Pod 安全性標準准入控制器的 `audit` 和 `warn` 模式（mode）
能夠在不影響現有負載的前提下，讓該控制器更方便地收集關於 Pod 的重要的安全信息。

<!--
It is good practice to enable these modes for all namespaces, setting them to the _desired_ level
and version you would eventually like to `enforce`. The warnings and audit annotations generated in
this phase can guide you toward that state. If you expect workload authors to make changes to fit
within the desired level, enable the `warn` mode. If you expect to use audit logs to monitor/drive
changes to fit within the desired level, enable the `audit` mode.
-->
針對所有名字空間啓用這些模式是一種好的實踐，將它們設置爲你最終打算 `enforce` 的
 _期望的_ 級別和版本。這一階段中所生成的警告和審計註解信息可以幫助你到達這一狀態。
如果你期望負載的作者能夠作出變更以便適應期望的級別，可以啓用 `warn` 模式。
如果你希望使用審計日誌了監控和驅動變更，以便負載能夠適應期望的級別，可以啓用 `audit` 模式。

<!--
When you have the `enforce` mode set to your desired value, these modes can still be useful in a
few different ways:

- By setting `warn` to the same level as `enforce`, clients will receive warnings when attempting
  to create Pods (or resources that have Pod templates) that do not pass validation. This will help
  them update those resources to become compliant.
- In Namespaces that pin `enforce` to a specific non-latest version, setting the `audit` and `warn`
  modes to the same level as `enforce`, but to the `latest` version, gives visibility into settings
  that were allowed by previous versions but are not allowed per current best practices.
-->
當你將 `enforce` 模式設置爲期望的取值時，這些模式在不同的場合下仍然是有用的：

- 通過將 `warn` 設置爲 `enforce` 相同的級別，客戶可以在嘗試創建無法通過合法檢查的 Pod
  （或者包含 Pod 模板的資源）時收到警告信息。這些信息會幫助於更新資源使其合規。
- 在將 `enforce` 鎖定到特定的非最新版本的名字空間中，將 `audit` 和 `warn`
  模式設置爲 `enforce` 一樣的級別而非 `latest` 版本，
  這樣可以方便看到之前版本所允許但當前最佳實踐中被禁止的設置。

<!--
## Third-party alternatives
-->
## 第三方替代方案     {#third-party-alternatives}

{{% thirdparty-content %}}

<!--
Other alternatives for enforcing security profiles are being developed in the Kubernetes
ecosystem:
-->
Kubernetes 生態系統中也有一些其他強制實施安全設置的替代方案處於開發狀態中：

- [Kubewarden](https://github.com/kubewarden).
- [Kyverno](https://kyverno.io/policies/).
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper).

<!--
The decision to go with a _built-in_ solution (e.g. PodSecurity admission controller) versus a
third-party tool is entirely dependent on your own situation. When evaluating any solution,
trust of your supply chain is crucial. Ultimately, using _any_ of the aforementioned approaches
will be better than doing nothing.
-->
採用 _內置的_ 方案（例如 PodSecurity 准入控制器）還是第三方工具，
這一決策完全取決於你自己的情況。在評估任何解決方案時，對供應鏈的信任都是至關重要的。
最終，使用前述方案中的 _任何_ 一種都好過放任自流。

