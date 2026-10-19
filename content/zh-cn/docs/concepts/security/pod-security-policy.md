---
title: Pod 安全策略
content_type: concept
weight: 30
---
<!--
title: Pod Security Policies
content_type: concept
weight: 30
-->

<!-- overview -->

{{% alert title="被移除的特性" color="warning" %}}
<!--
PodSecurityPolicy was [deprecated](/blog/2021/04/08/kubernetes-1-21-release-announcement/#podsecuritypolicy-deprecation)
in Kubernetes v1.21, and removed from Kubernetes in v1.25.
-->
PodSecurityPolicy 在 Kubernetes v1.21
中[被弃用](/blog/2021/04/08/kubernetes-1-21-release-announcement/#podsecuritypolicy-deprecation)，
在 Kubernetes v1.25 中被移除。
{{% /alert %}}

<!--
Instead of using PodSecurityPolicy, you can enforce similar restrictions on Pods using
either or both:
-->
作为替代，你可以使用下面任一方式执行类似的限制，或者同时使用下面这两种方式。

<!--
- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- a 3rd party admission plugin, that you deploy and configure yourself
-->
- [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)
- 自行部署并配置第三方准入插件

<!--
For a migration guide, see [Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/).
For more information on the removal of this API,
see [PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).
-->
有关如何迁移，
参阅[从 PodSecurityPolicy 迁移到内置的 PodSecurity 准入控制器](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)。
有关移除此 API 的更多信息，参阅
[弃用 PodSecurityPolicy：过去、现在、未来](/zh-cn/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)。

<!--
If you are not running Kubernetes v{{< skew currentVersion >}}, check the documentation for
your version of Kubernetes.
-->
如果所运行的 Kubernetes 不是 v{{< skew currentVersion >}} 版本，则需要查看你所使用的 Kubernetes 版本的对应文档。
