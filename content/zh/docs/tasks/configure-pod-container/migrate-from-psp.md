---
title: 从 PodSecurityPolicy 迁移到内置的 PodSecurity 准入控制器
content_type: task
min-kubernetes-server-version: v1.22
---

<!--
title: Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller
reviewers:
- tallclair
- liggitt
content_type: task
min-kubernetes-server-version: v1.22
-->

<!-- overview -->

<!--
This page describes the process of migrating from PodSecurityPolicies to the built-in PodSecurity
admission controller. This can be done effectively using a combination of dry-run and `audit` and
`warn` modes, although this becomes harder if mutating PSPs are used.
-->
本页面描述从 PodSecurityPolicy 迁移到内置的 PodSecurity 准入控制器的过程。
这一迁移过程可以通过综合使用试运行、`audit` 和 `warn` 模式等来实现，
尽管在使用了变更式 PSP 时会变得有些困难。

## {{% heading "prerequisites" %}}

{{% version-check %}}

<!--
- Ensure the `PodSecurity` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) is enabled.
-->
- 确保 `PodSecurity` [特性门控](/docs/reference/command-line-tools-reference/feature-gates/)被启用。

<!-- body -->

<!--
## Steps
-->
## 步骤    {#steps}

<!--
- **Eliminate mutating PodSecurityPolicies, if your cluster has any set up.**
  - Clone all mutating PSPs into a non-mutating version.
  - Update all ClusterRoles authorizing use of those mutating PSPs to also authorize use of the
    non-mutating variant.
  - Watch for Pods using the mutating PSPs and work with code owners to migrate to valid,
    non-mutating resources.
  - Delete mutating PSPs.
-->
-- **如果你的集群中配置了变更式的 PodSecurityPolicy，将它们删除。**
   - 复制所有变更式 PSP 复制到非变更式版本中。
   - 更新所有授权使用那些变更式 PSP 的 ClusterRole，使之也能为非变更式版本鉴权。
   - 检视使用了变更式 PSP 的 Pod，与拥有该代码的人一起将其迁移到合法的、非变更式的资源。
   - 删除变更式 PSP。

<!--
- **Select a compatible policy level for each namespace.** Analyze existing resources in the
  namespace to drive this decision.
  - Review the requirements of the different [Pod Security Standards](/docs/concepts/security/pod-security-standards).
  - Evaluate the difference in privileges that would come from disabling the PSP controller.
  - In the event that a PodSecurityPolicy falls between two levels, consider:
    - Selecting a _less_ permissive PodSecurity level prioritizes security, and may require adjusting
      workloads to fit within the stricter policy.
    - Selecting a _more_ permissive PodSecurity level prioritizes avoiding disrupting or
      changing workloads, but may allow workload authors in the namespace greater permissions
      than desired.
-->
- **为每个名字空间选择一个兼容的策略级别。**
  要分析名字空间中已有的资源才能作出此决定。
  - 审阅不同 [Pod 安全标准](/zh/docs/concepts/security/pod-security-standards)的需求。
  - 评估禁用 PSP 控制器所带来的特权级变化。
  - 当 PodSecurityPolicy 中的设置介于两种策略级别之间时，考虑：
    - 选择一个安全许可*略弱*的 PodSecurity 级别，可能需要调整负载本身，
      使之能够在较严格的策略下工作。
    - 选择一个安全许可*略强*的 PodSecurity 级别，从而避免干扰或变更负载本身。
      不过这样做可能会让负载的作者在名字空间中拥有超出预期的权限。
<!--
- **Apply the selected profiles in `warn` and `audit` mode.** This will give you an idea of how
  your Pods will respond to the new policies, without breaking existing workloads. Iterate on your
  [Pods' configuration](/docs/concepts/security/pod-security-admission#configuring-pods) until
  they are in compliance with the selected profiles.
- Apply the profiles in `enforce` mode.
- Stop including `PodSecurityPolicy` in the `--enable-admission-plugins` flag.
-->
- **在 `warn` 和 `audit` 模式下应用所选的策略。**
  这样做会让你了解 Pod 会如何对新的策略作出反应，同时不会破坏现有负载。
  反复调试你的[Pod 配置](/zh/docs/concepts/security/pod-security-admission#configuring-pods)
  直到它们与所选的策略匹配。
- 用 `enforce` 模式下应用策略。
- 在 `--enable-admission-plugins` 标志中去除 `PodSecurityPolicy`。

