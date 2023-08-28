---
title: 强制实施 Pod 安全性标准
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
本页提供实施 [Pod 安全标准（Pod Security Standards）](/zh-cn/docs/concepts/security/pod-security-standards)
时的一些最佳实践。

<!-- body -->

<!--
## Using the built-in Pod Security Admission Controller
-->
## 使用内置的 Pod 安全性准入控制器

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
The [Pod Security Admission Controller](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
intends to replace the deprecated PodSecurityPolicies. 
-->
[Pod 安全性准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
尝试替换已被废弃的 PodSecurityPolicies。

<!--
### Configure all cluster namespaces
-->
### 配置所有集群名字空间    {#configure-all-cluster-namespaces}

<!--
Namespaces that lack any configuration at all should be considered significant gaps in your cluster
security model. We recommend taking the time to analyze the types of workloads occurring in each
namespace, and by referencing the Pod Security Standards, decide on an appropriate level for
each of them. Unlabeled namespaces should only indicate that they've yet to be evaluated.
-->
完全未经配置的名字空间应该被视为集群安全模型中的重大缺陷。
我们建议花一些时间来分析在每个名字空间中执行的负载的类型，
并通过引用 Pod 安全性标准来确定每个负载的合适级别。
未设置标签的名字空间应该视为尚未被评估。

<!--
In the scenario that all workloads in all namespaces have the same security requirements,
we provide an [example](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces)
that illustrates how the PodSecurity labels can be applied in bulk.
-->
针对所有名字空间中的所有负载都具有相同的安全性需求的场景，
我们提供了一个[示例](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces)
用来展示如何批量应用 Pod 安全性标签。

<!--
### Embrace the principle of least privilege

In an ideal world, every pod in every namespace would meet the requirements of the `restricted`
policy. However, this is not possible nor practical, as some workloads will require elevated
privileges for legitimate reasons.
-->
### 拥抱最小特权原则

在一个理想环境中，每个名字空间中的每个 Pod 都会满足 `restricted` 策略的需求。
不过，这既不可能也不现实，某些负载会因为合理的原因而需要特权上的提升。

<!--
- Namespaces allowing `privileged` workloads should establish and enforce appropriate access controls.
- For workloads running in those permissive namespaces, maintain documentation about their unique
  security requirements. If at all possible, consider how those requirements could be further
  constrained.
-->
- 允许 `privileged` 负载的名字空间需要建立并实施适当的访问控制机制。
- 对于运行在特权宽松的名字空间中的负载，需要维护其独特安全性需求的文档。
  如果可能的话，要考虑如何进一步约束这些需求。

<!--
### Adopt a multi-mode strategy

The `audit` and `warn` modes of the Pod Security Standards admission controller make it easy to
collect important security insights about your pods without breaking existing workloads.
-->
### 采用多种模式的策略

Pod 安全性标准准入控制器的 `audit` 和 `warn` 模式（mode）
能够在不影响现有负载的前提下，让该控制器更方便地收集关于 Pod 的重要的安全信息。

<!--
It is good practice to enable these modes for all namespaces, setting them to the _desired_ level
and version you would eventually like to `enforce`. The warnings and audit annotations generated in
this phase can guide you toward that state. If you expect workload authors to make changes to fit
within the desired level, enable the `warn` mode. If you expect to use audit logs to monitor/drive
changes to fit within the desired level, enable the `audit` mode.
-->
针对所有名字空间启用这些模式是一种好的实践，将它们设置为你最终打算 `enforce` 的
 _期望的_ 级别和版本。这一阶段中所生成的警告和审计注解信息可以帮助你到达这一状态。
如果你期望负载的作者能够作出变更以便适应期望的级别，可以启用 `warn` 模式。
如果你希望使用审计日志了监控和驱动变更，以便负载能够适应期望的级别，可以启用 `audit` 模式。

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
当你将 `enforce` 模式设置为期望的取值时，这些模式在不同的场合下仍然是有用的：

- 通过将 `warn` 设置为 `enforce` 相同的级别，客户可以在尝试创建无法通过合法检查的 Pod
  （或者包含 Pod 模板的资源）时收到警告信息。这些信息会帮助于更新资源使其合规。
- 在将 `enforce` 锁定到特定的非最新版本的名字空间中，将 `audit` 和 `warn`
  模式设置为 `enforce` 一样的级别而非 `latest` 版本，
  这样可以方便看到之前版本所允许但当前最佳实践中被禁止的设置。

<!--
## Third-party alternatives
-->
## 第三方替代方案     {#third-party-alternatives}

{{% thirdparty-content %}}

<!--
Other alternatives for enforcing security profiles are being developed in the Kubernetes
ecosystem:
-->
Kubernetes 生态系统中也有一些其他强制实施安全设置的替代方案处于开发状态中：

- [Kubewarden](https://github.com/kubewarden).
- [Kyverno](https://kyverno.io/policies/).
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper).

<!--
The decision to go with a _built-in_ solution (e.g. PodSecurity admission controller) versus a
third-party tool is entirely dependent on your own situation. When evaluating any solution,
trust of your supply chain is crucial. Ultimately, using _any_ of the aforementioned approaches
will be better than doing nothing.
-->
采用 _内置的_ 方案（例如 PodSecurity 准入控制器）还是第三方工具，
这一决策完全取决于你自己的情况。在评估任何解决方案时，对供应链的信任都是至关重要的。
最终，使用前述方案中的 _任何_ 一种都好过放任自流。

