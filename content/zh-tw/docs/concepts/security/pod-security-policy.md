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
中[被棄用](/blog/2021/04/08/kubernetes-1-21-release-announcement/#podsecuritypolicy-deprecation)，
在 Kubernetes v1.25 中被移除。
{{% /alert %}}

<!--
Instead of using PodSecurityPolicy, you can enforce similar restrictions on Pods using
either or both:
-->
作爲替代，你可以使用下面任一方式執行類似的限制，或者同時使用下面這兩種方式。

<!--
- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- a 3rd party admission plugin, that you deploy and configure yourself
-->
- [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)
- 自行部署並設定第三方准入插件

<!--
For a migration guide, see [Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/).
For more information on the removal of this API,
see [PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).
-->
有關如何遷移，
參閱[從 PodSecurityPolicy 遷移到內置的 PodSecurity 准入控制器](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)。
有關移除此 API 的更多資訊，參閱
[棄用 PodSecurityPolicy：過去、現在、未來](/zh-cn/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)。

<!--
If you are not running Kubernetes v{{< skew currentVersion >}}, check the documentation for
your version of Kubernetes.
-->
如果所運行的 Kubernetes 不是 v{{< skew currentVersion >}} 版本，則需要查看你所使用的 Kubernetes 版本的對應文檔。
