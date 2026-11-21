---
layout: blog
title: "Kubernetes v1.25：Pod 安全准入控制器进入稳定阶段"
date: 2022-08-25
slug: pod-security-admission-stable
author: >
  Tim Allclair (Google),
  Sam Stoelinga (Google)
translator: >
  [Jin Li](https://github.com/qlijin) (UOS)
---

<!--
layout: blog
title: "Kubernetes v1.25: Pod Security Admission Controller in Stable"
date: 2022-08-25
slug: pod-security-admission-stable
author: >
  Tim Allclair (Google),
  Sam Stoelinga (Google)
-->

<!--
The release of Kubernetes v1.25 marks a major milestone for Kubernetes out-of-the-box pod security
controls: Pod Security admission (PSA) graduated to stable, and Pod Security Policy (PSP) has been
removed.
[PSP was deprecated in Kubernetes v1.21](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/),
and no longer functions in Kubernetes v1.25 and later.

The Pod Security admission controller replaces PodSecurityPolicy, making it easier to enforce predefined
[Pod Security Standards](/docs/concepts/security/pod-security-standards/) by
simply adding a label to a namespace. The Pod Security Standards are maintained by the K8s
community, which means you automatically get updated security policies whenever new
security-impacting Kubernetes features are introduced.
-->
Kubernetes v1.25 的发布标志着 Kubernetes 开箱即用的 Pod 安全控制迎来一个重要里程碑：
Pod 安全准入（Pod Security Admission，PSA）进入稳定阶段，
Pod 安全策略（Pod Security Policy，PSP）已被移除。
[PSP 在 Kubernetes v1.21 中已被弃用](/zh-cn/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)，
在 Kubernetes v1.25 及更高版本中不再生效。

Pod 安全准入控制器取代了 PodSecurityPolicy，只需为命名空间添加一个标签，
就能更轻松地强制执行预定义的
[Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards/)。
Pod 安全标准由 Kubernetes 社区维护，这意味着每当 Kubernetes 引入新的影响安全性的特性时，
你都会自动获得更新后的安全策略。

<!--
## What’s new since Beta?

Pod Security Admission hasn’t changed much since the Beta in Kubernetes v1.23. The focus has been on
improving the user experience, while continuing to maintain a high quality bar.
-->
## 自 Beta 以来有哪些新变化？ {#whats-new-since-beta}

Pod 安全准入自 Kubernetes v1.23 进入 Beta 以来变化不大。
我们的重点一直是提升用户体验，同时继续保持高质量标准。

<!--
### Improved violation messages

We improved violation messages so that you get
[fewer duplicate messages](https://github.com/kubernetes/kubernetes/pull/107698). For example,
instead of the following message when the Baseline and Restricted policies check the same
capability:
-->
### 改进违例消息 {#improved-violation-messages}

我们改进了违例消息，
让你收到[更少的重复消息](https://github.com/kubernetes/kubernetes/pull/107698)。
例如，当 Baseline 和 Restricted 策略检查同一权能时，你不会再收到以下消息：

```
pods "admin-pod" is forbidden: violates PodSecurity "restricted:latest": non-default capabilities (container "admin" must not include "SYS_ADMIN" in securityContext.capabilities.add), unrestricted capabilities (container "admin" must not include "SYS_ADMIN" in securityContext.capabilities.add)
```

<!--
You get this message:
-->
你会收到这条消息：

```
pods "admin-pod" is forbidden: violates PodSecurity "restricted:latest": unrestricted capabilities (container "admin" must not include "SYS_ADMIN" in securityContext.capabilities.add)
```

<!--
### Improved namespace warnings

When you modify the `enforce` Pod Security labels on a namespace, the Pod Security
admission controller checks all existing pods for
violations and surfaces a [warning](/blog/2020/09/03/warnings/) if any are out of compliance. These
[warnings are now aggregated](https://github.com/kubernetes/kubernetes/pull/105889) for pods with
identical violations, making large namespaces with many replicas much more manageable. For example:
-->
### 改进命名空间警告 {#improved-namespace-warnings}

当你修改命名空间上的 `enforce` Pod 安全标签时，
Pod 安全准入控制器会检查所有现存 Pod 是否存在违例行为；
如果有任何 Pod 不合规，就会显示[警告](/zh-cn/blog/2020/09/03/warnings/)。
现在，对于具有相同违例的 Pod，
这些[警告会被聚合](https://github.com/kubernetes/kubernetes/pull/105889)，
从而使包含很多副本的大型命名空间更易于管理。例如：

```
Warning: frontend-h23gf2: allowPrivilegeEscalation != false
Warning: myjob-g342hj (and 6 other pods): host namespaces, allowPrivilegeEscalation != false Warning: backend-j23h42 (and 1 other pod): non-default capabilities, unrestricted capabilities
```

<!--
Additionally, when you apply a non-privileged label to a namespace that has been
[configured to be exempt](/docs/concepts/security/pod-security-admission/#exemptions),
you will now get a warning alerting you to this fact:
-->
此外，当你为一个已[配置为豁免](/zh-cn/docs/concepts/security/pod-security-admission/#exemptions)
的命名空间应用非特权标签时，就会收到一条警告，提醒你这一情况：

```
Warning: namespace 'kube-system' is exempt from Pod Security, and the policy (enforce=baseline:latest) will be ignored
```

<!--
### Changes to the Pod Security Standards

The [Pod Security Standards](/docs/concepts/security/pod-security-standards/),
which Pod Security admission enforces, have been updated with support for the new Pod OS
field. In v1.25 and later, if you use the Restricted policy, the following Linux-specific restrictions will no
longer be required if you explicitly set the pod's `.spec.os.name` field to `windows`:
-->
### Pod 安全标准的变更 {#changes-to-the-pod-security-standards}

Pod 安全准入所强制执行的
[Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards/)已更新，
以支持新的 Pod 操作系统（Pod OS）字段。在 v1.25 及更高版本中，
如果你使用 Restricted 策略，并且显式地将 Pod 的 `.spec.os.name` 字段设置为 `windows`，
就不再需要满足以下 Linux 专用限制：

<!--
* Seccomp - The `seccompProfile.type` field for Pod and container security contexts
* Privilege escalation - The `allowPrivilegeEscalation` field on container security contexts
* Capabilities - The requirement to drop `ALL` capabilities in the `capabilities` field on containers
-->
* Seccomp：Pod 和容器安全上下文中的 `seccompProfile.type` 字段
* 特权提升：容器安全上下文中的 `allowPrivilegeEscalation` 字段
* 权能：容器 `capabilities` 字段中必须丢弃 `ALL` 权能的要求

<!--
In Kubernetes v1.23 and earlier, the kubelet didn't enforce the Pod OS field.
If your cluster includes nodes running a v1.23 or older kubelet, you should explicitly
[pin Restricted policies](/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces)
to a version prior to v1.25.
-->
在 Kubernetes v1.23 及更早版本中，kubelet 未强制执行 Pod OS 字段。
如果你的集群包含运行 v1.23 或更早版本 kubelet 的节点，
应显式[将 Restricted 策略固定](/zh-cn/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces)到
v1.25 之前的版本。

<!--
## Migrating from PodSecurityPolicy to the Pod Security admission controller

For instructions to migrate from PodSecurityPolicy to the Pod Security admission controller, and
for help choosing a migration strategy, refer to the
[migration guide](/docs/tasks/configure-pod-container/migrate-from-psp/).
We're also developing a tool called
[pspmigrator](https://github.com/kubernetes-sigs/pspmigrator) to automate parts
of the migration process.
-->
## 从 PodSecurityPolicy 迁移到 Pod 安全准入控制器 {#migrating-from-podsecuritypolicy-to-the-pod-security-admission-controller}

有关从 PodSecurityPolicy 迁移到 Pod 安全准入控制器的说明，
以及在选择迁移策略方面的帮助，
请参阅[迁移指南](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)。
我们还在开发一款名为
[pspmigrator](https://github.com/kubernetes-sigs/pspmigrator) 的工具，
用于将部分迁移流程自动化。

<!--
We'll be talking about PSP migration in more detail at our upcoming KubeCon 2022 NA talk,
[*Migrating from Pod Security Policy*](https://sched.co/182Jx). Use the
[KubeCon NA schedule](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/schedule/)
to learn more.
-->
我们将在即将举行的 KubeCon 2022 NA 大会的演讲
[**Migrating from Pod Security Policy**](https://sched.co/182Jx)
中更详细地讨论 PSP 迁移。更多信息请查看
[KubeCon NA 日程](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/schedule/)。
