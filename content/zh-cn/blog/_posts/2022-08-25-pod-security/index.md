---
layout: blog
title: "Kubernetes v1.25: Pod 安全准入控制器处于稳定状态"
date: 2022-08-25
slug: pod-security-admission-stable
---

<!--
layout: blog
title: "Kubernetes v1.25: Pod Security Admission Controller in Stable"
date: 2022-08-25
slug: pod-security-admission-stable
-->

<!--
**Authors:** Tim Allclair (Google), Sam Stoelinga (Google)
-->
**作者：** Tim Allclair (Google)，Sam Stoelinga (Google)

<!--
The release of Kubernetes v1.25 marks a major milestone for Kubernetes out-of-the-box pod security
controls: Pod Security admission (PSA) graduated to stable, and Pod Security Policy (PSP) has been
removed.
-->
Kubernetes v1.25 的发布标志着 Kubernetes 开箱即用的 Pod 安全控制的一个重要里程碑：Pod 安全准入（PSA）逐渐稳定，
而 Pod 安全策略（PSP）已被移除。

<!--
[PSP was deprecated in Kubernetes v1.21](https://kubernetes.io/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/),
and no longer functions in Kubernetes v1.25 and later.
-->
[PSP 在 Kubernetes v1.21 中被弃用](/zh-cn/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)，
在 Kubernetes v1.25 及更高版本中不再起作用。

<!--
The Pod Security admission controller replaces PodSecurityPolicy, making it easier to enforce predefined
[Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) by
simply adding a label to a namespace. The Pod Security Standards are maintained by the K8s
community, which means you automatically get updated security policies whenever new
security-impacting Kubernetes features are introduced.
-->
Pod 安全准入控制器取代了 PodSecurityPolicy，只需向命名空间添加标签，
就可以更轻松地执行预定义的 [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards/)。
Pod 安全标准由 K8s 社区维护，这意味着每当引入新的影响安全的 Kubernetes 功能时，你都会自动获得更新的安全策略。

<!--
## What’s new since Beta?

Pod Security Admission hasn’t changed much since the Beta in Kubernetes v1.23. The focus has been on
improving the user experience, while continuing to maintain a high quality bar.
-->
## 自 Beta 版以来有什么新功能？

自 Kubernetes v1.23 中的 Beta 版以来，Pod  安全准入的变化不大。重点是改善用户体验，同时继续保持高质量的标准。

<!--
### Improved violation messages

We improved violation messages so that you get
[fewer duplicate messages](https://github.com/kubernetes/kubernetes/pull/107698). For example,
instead of the following message when the Baseline and Restricted policies check the same
capability:
-->
### 改进的违规消息

我们改进了违规消息，因此你收到的[重复消息减少](https://github.com/kubernetes/kubernetes/pull/107698)。 
例如，当基线和受限策略检查相同的权能时不会出现以下消息：

```
pods "admin-pod" is forbidden: violates PodSecurity "restricted:latest": non-default capabilities (container "admin" must not include "SYS_ADMIN" in securityContext.capabilities.add), unrestricted capabilities (container "admin" must not include "SYS_ADMIN" in securityContext.capabilities.add)
```

<!--
You get this message:
-->
而是会看到这样的消息：

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

### 改进的命名空间警告

当你修改命名空间上的 `enforce` Pod 安全标签时，Pod 安全准入控制器会检查所有现有 Pod 是否存在违规行为，
如果有任何违规行为，则会显示[警告](/blog/2020/09/03/warnings/)。
针对具有相同违规行为的 Pod，这些[警告现已聚合](https://github.com/kubernetes/kubernetes/pull/105889)，
使得具有许多副本的大型命名空间更易于管理。例如：

```
Warning: frontend-h23gf2: allowPrivilegeEscalation != false
Warning: myjob-g342hj (and 6 other pods): host namespaces, allowPrivilegeEscalation != false Warning: backend-j23h42 (and 1 other pod): non-default capabilities, unrestricted capabilities
```

<!--
Additionally, when you apply a non-privileged label to a namespace that has been
[configured to be exempt](https://kubernetes.io/docs/concepts/security/pod-security-admission/#exemptions),
you will now get a warning alerting you to this fact:
-->
此外，当你将一个非特权标签应用于已经[配置为豁免](/zh-cn/docs/concepts/security/pod-security-admission/#exemptions)
的命名空间时，你现在会得到一个警告，提醒你注意这一事实：

```
Warning: namespace 'kube-system' is exempt from Pod Security, and the policy (enforce=baseline:latest) will be ignored
```

<!--
### Changes to the Pod Security Standards
-->
### Pod 安全标准的更改

<!--
The [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/),
which Pod Security admission enforces, have been updated with support for the new Pod OS
field. In v1.25 and later, if you use the Restricted policy, the following Linux-specific restrictions will no
longer be required if you explicitly set the pod's `.spec.os.name` field to `windows`:
-->
Pod 安全准入执行的 [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards/)已经更新，
支持新的 Pod OS 字段。在 v1.25 及更高版本中，如果你使用限制策略，
如果你使用限制策略且明确将 Pod 的 `.spec.os.name` 字段设置为 `windows`，
则不再需要以下 Linux 特定的限制：

<!--
* Seccomp - The `seccompProfile.type` field for Pod and container security contexts
* Privilege escalation - The `allowPrivilegeEscalation` field on container security contexts
* Capabilities - The requirement to drop `ALL` capabilities in the `capabilities` field on containers
-->
* Seccomp - Pod 和容器安全上下文的 `seccompProfile.type` 字段
* Privilege escalation - 容器安全上下文中的 `allowPrivilegeEscalation` 字段
* Capabilities - 要求在容器的 `capabilities` 字段中删除 `ALL` 功能

<!--
In Kubernetes v1.23 and earlier, the kubelet didn't enforce the Pod OS field.
If your cluster includes nodes running a v1.23 or older kubelet, you should explicitly
[pin Restricted policies](https://kubernetes.io/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces)
to a version prior to v1.25.
-->
在 Kubernetes v1.23 及更早版本中，kubelet 没有强制执行 Pod OS 字段。
如果你的集群包含运行 v1.23 或更早版本的 kubelet 的节点，
你应该明确地[锁定受限的策略](/zh-cn/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces)
到 v1.25 之前的版本。

<!--
## Migrating from PodSecurityPolicy to the Pod Security admission controller
-->
## 从 PodSecurityPolicy 迁移到 Pod Security 准入控制器

<!--
For instructions to migrate from PodSecurityPolicy to the Pod Security admission controller, and
for help choosing a migration strategy, refer to the
[migration guide](https://kubernetes.io/docs/tasks/configure-pod-container/migrate-from-psp/).
We're also developing a tool called
[pspmigrator](https://github.com/kubernetes-sigs/pspmigrator) to automate parts
of the migration process.
-->
有关从 PodSecurityPolicy 迁移到 Pod Security 准入控制器的说明，以及选择迁移策略的帮助，
准入控制器的说明以及选择迁移策略的帮助，
请参阅[迁移指南](/zh-cn/do cs/tasks/configure-pod-container/migrate-from-psp/)。
我们还在开发一个名为 [pspmigrator](https://github.com/kubernetes-sigs/pspmigrator) 的工具来自动化部分迁移过程。

<!--
We'll be talking about PSP migration in more detail at our upcoming KubeCon 2022 NA talk,
[*Migrating from Pod Security Policy*](https://sched.co/182Jx). Use the
[KubeCon NA schedule](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/schedule/)
to learn more.
-->
我们将在即将到来的 KubeCon 2022 NA 演讲中更详细地讨论 PSP 迁移，
[**Migrating from Pod Security Policy**](https://sched.co/182Jx) 使用
[KubeCon NA schedule](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/schedule/) 了解更多信息。