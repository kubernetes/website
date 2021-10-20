---
title: Pod 安全性准入
content_type: concept
description: >
  Pod 安全性准入控制器概述，可用于实施 Pod 安全性标准。
weight: 10
---
<!--
reviewers:
- tallclair
- liggitt
title: Pod Security Admission
description: >
  An overview of the Pod Security Admission Controller, which can enforce the Pod Security
  Standards.
content_type: concept
weight: 20
min-kubernetes-server-version: v1.22
-->
  <!-- overview -->
<!--

{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

The Kubernetes [Pod Security Standards](/docs/concepts/security/pod-security-standards/) define
different isolation levels for Pods. These standards let you define how you want to restrict the
behavior of pods in a clear, consistent fashion.

As an Alpha feature, Kubernetes offers a built-in _Pod Security_ {{< glossary_tooltip
text="admission controller" term_id="admission-controller" >}}, the successor
to [PodSecurityPolicies](/docs/concepts/policy/pod-security-policy/). Pod security restrictions
are applied at the {{< glossary_tooltip text="namespace" term_id="namespace" >}} level when pods
are created.

{{< note >}}
The PodSecurityPolicy API is deprecated and will be 
[removed](/docs/reference/using-api/deprecation-guide/#v1-25) from Kubernetes in v1.25.
{{< /note >}}

-->
{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

Kubernetes [Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards/) 为 Pod 定义了不同的隔离级别。
这些标准让你可以明确、一致地定义如何限制 Pod 的行为。

作为 Alpha 功能，Kubernetes 提供了内置的 Pod 安全性{{< glossary_tooltip
text="准入控制器" term_id="admission-controller" >}}，
它是 [Pod 安全策略](/zh/docs/concepts/policy/pod-security-policy/) 的继承者。
当 Pod 被创建时，Pod 安全限制应用于{{< glossary_tooltip text="命名空间" term_id="namespace" >}}级别。

{{< note >}}
Pod 安全策略 （PodSecurityPolicy） API 已被废弃并将在 Kubernetes v1.25 中
[移除](/docs/reference/using-api/deprecation-guide/#v1-25)。
{{< /note >}}

<!-- body -->

## 启用 Alpha 特性

<!--
Setting pod security controls by namespace is an alpha feature. You must enable the `PodSecurity`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) in order to use it.

```shell
--feature-gates="...,PodSecurity=true"
```
-->

通过命名空间设置 Pod 安全控制是一项 alpha 功能。
你必须启用 `PodSecurity`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/) 才能使用它.

```shell
--feature-gates="...,PodSecurity=true"
```

## Pod 安全级别
<!--
Pod Security admission places requirements on a Pod's [Security
Context](/docs/tasks/configure-pod-container/security-context/) and other related fields according
to the three levels defined by the [Pod Security
Standards](/docs/concepts/security/pod-security-standards): `privileged`, `baseline`, and
`restricted`. Refer to the [Pod Security Standards](/docs/concepts/security/pod-security-standards)
page for an in-depth look at those requirements.
-->

Pod 安全性准入根据 [Pod 安全性标准](/zh/docs/tasks/configure-pod-container/security-context/) 定义的三个级别: `privileged`, `baseline`, 和
`restricted` 对 Pod 的 [安全上下文](/zh/docs/tasks/configure-pod-container/security-context/)和其他相关字段进行要求。
要深入理解具体的要求，请参阅 [Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards) 页面。

## 命名空间的 Pod 安全性准入标签
<!--
Provided that you have enabled this feature, you can configure namespaces to define the admission
control mode you want to use for pod security in each namespace. Kubernetes defines a set of 
{{< glossary_tooltip term_id="label" text="labels" >}} that you can set to define which of the 
predefined Pod Security Standard levels you want to use for a namespace. The label you select
defines what action the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
takes if a potential violation is detected:

{{< table caption="Pod Security Admission modes" >}}
Mode | Description
:---------|:------------
**enforce** | Policy violations will cause the pod to be rejected.
**audit** | Policy violations will trigger the addition of an audit annotation to the event recorded in the [audit log](/docs/tasks/debug-application-cluster/audit/), but are otherwise allowed.
**warn** | Policy violations will trigger a user-facing warning, but are otherwise allowed.
{{< /table >}}
-->
假设你已启用此功能，你可以配置命名空间来定义要用于每个命名空间中的 Pod 安全性的准入控制模式。
Kubernetes 定义了一组 {{< glossary_tooltip term_id="label" text="标签" >}} 你可以设置以定义要用于命名空间的预定义 Pod 安全标准级别。
你选择的标签定义了要执行的操作，{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}如果检测到潜在的违规行为，则采取以下措施：
{{< table caption="Pod Security Admission modes" >}}
模式 | 描述
:---------|:------------
**enforce** | 违反策略将导致 Pod 被拒绝。
**audit** | 违反策略将触发在 [审计日志](/docs/tasks/debug-application-cluster/audit/) 添加事件审计注释, 但其他方面是被允许的。
**warn** | 违反策略将触发发送给用户界面的警告, 但其他方面是被允许的。
{{< /table >}}

<!--
A namespace can configure any or all modes, or even set a different level for different modes.

For each mode, there are two labels that determine the policy used:
-->
命名空间可以配置任何或所有模式，甚至可以为不同的模式设置不同的级别。

对于每种模式，有两个标签决定所使用的策略：

```yaml
# 每种模式级别标签指明应用于该模式的策略的级别。
#
# MODE 必须是 `enforce`, `audit`, or `warn` 之一。
# LEVEL 必须是 `privileged`, `baseline`, or `restricted`之一。
pod-security.kubernetes.io/<MODE>: <LEVEL>

# 非必选的: 每种模式的版本标签可用于将策略固定于给定的 Kubernetes minor version (例如 v{{< skew latestVersion >}}).
#
# MODE 必须是 `enforce`, `audit`, or `warn`之一。
# VERSION 必须是一个有效的 Kubernetes minor version, 或者 `latest`.
pod-security.kubernetes.io/<MODE>-version: <VERSION>
```
<!--
Check out [Enforce Pod Security Standards with Namespace Labels](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels) to see example usage.
-->
查看 [用名称空间标签执行 Pod 安全性标准](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels) 以了解示用法示例。

## 工作负载资源和 Pod 模板
<!--
Pods are often created indirectly, by creating a [workload
object](/docs/concepts/workloads/controllers/) such as a {{< glossary_tooltip
term_id="deployment" >}} or {{< glossary_tooltip term_id="job">}}. The workload object defines a
_Pod template_ and a {{< glossary_tooltip term_id="controller" text="controller" >}} for the
workload resource creates Pods based on that template. To help catch violations early, both the
audit and warning modes are applied to the workload resources. However, enforce mode is **not**
applied to workload resources, only to the resulting pod objects.
-->

Pod 通常是通过创建[工作负载对象](/zh/docs/concepts/workloads/controllers/)（例如{{< glossary_tooltip
term_id="deployment" >}} 或者 {{< glossary_tooltip term_id="job">}} 。 
工作负载对象定义了一个 Pod 模板和一个{{< glossary_tooltip term_id="controller" text="控制器" >}}对于工作负载资源，基于该模板创建 Pod。
为了帮助及早发现违规，审计和警告模式都应用于工作负载资源。
但是，强制模式**不适** 用于工作负载资源，仅适用于生成的 Pod 对象。

## 豁免（Exemptions）
<!--
You can define _exemptions_ from pod security enforcement in order allow the creation of pods that
would have otherwise been prohibited due to the policy associated with a given namespace.
Exemptions can be statically configured in the
[Admission Controller configuration](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller).

Exemptions must be explicitly enumerated. Requests meeting exemption criteria are _ignored_ by the
Admission Controller (all `enforce`, `audit` and `warn` behaviors are skipped). Exemption dimensions include:

- **Usernames:** requests from users with an exempt authenticated (or impersonated) username are
  ignored.
- **RuntimeClassNames:** pods and [workload resources](#workload-resources-and-pod-templates) specifying an exempt runtime class name are
  ignored.
- **Namespaces:** pods and [workload resources](#workload-resources-and-pod-templates) in an exempt namespace are ignored.

{{< caution >}}

Most pods are created by a controller in response to a [workload
resource](#workload-resources-and-pod-templates), meaning that exempting an end user will only
exempt them from enforcement when creating pods directly, but not when creating a workload resource.
Controller service accounts (such as `system:serviceaccount:kube-system:replicaset-controller`)
should generally not be exempted, as doing so would implicitly exempt any user that can create the
corresponding workload resource.

{{< /caution >}}
-->
你可以定义 Pod 安全实施的豁免，以允许创建由于与给定命名空间相关联的策略而被禁止的 pod 。豁免可以在
[Admission Controller configuration](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller)静态配置。

必须明确列举豁免。准入控制器忽略满足豁免标准的请求（所有enforce、audit和warn行为都被跳过）。豁免维度包括:

- **Usernames:** 来自于具有豁免认证（或者 impersonated）用户名用户的请求被忽略。
- **RuntimeClassNames:** 指定豁免运行时类名的 Pod 或 [工作负载资源](#workload-resources-and-pod-templates) 被忽略。
- **Namespaces:** 指定豁免命名空的 Pods 或 [工作负载资源](#workload-resources-and-pod-templates) 被忽略。

{{< caution >}}

大多数 Pod 是由控制器创建的，以响应 [工作负载资源](#workload-resources-and-pod-templates), 这意味着豁免最终用户只会在直接创建 Pod 时免除他们的强制执行，而在创建工作负载资源时则不会。
通常不应免除控制器服务帐户（例如 system:serviceaccount:kube-system:replicaset-controller），因为这样做会隐式免除任何可以创建相应工作负载资源的用户。

{{< /caution >}}
<!--
Updates to the following pod fields are exempt from policy checks, meaning that if a pod update
request only changes these fields, it will not be denied even if the pod is in violation of the
current policy level:

- Any metadata updates **except** changes to the seccomp or AppArmor annotations:
  - `seccomp.security.alpha.kubernetes.io/pod` (deprecated)
  - `container.seccomp.security.alpha.kubernetes.io/*` (deprecated)
  - `container.apparmor.security.beta.kubernetes.io/*`
- Valid updates to `.spec.activeDeadlineSeconds`
- Valid updates to `.spec.tolerations`
-->
对以下 pod 字段的更新免于策略检查，这意味着如果 Pod 更新请求仅更改这些字段，即使 pod 违反当前策略级别也不会被拒绝：

- 任何对元数据的更新 **除了** 对 Seccomp 或 AppArmor 注解的更改:
  - `seccomp.security.alpha.kubernetes.io/pod` （已弃用）
  - `container.seccomp.security.alpha.kubernetes.io/*` （已弃用）
  - `container.apparmor.security.beta.kubernetes.io/*`
- 对 `.spec.activeDeadlineSeconds` 的有效更新
- 对 `.spec.tolerations` 的有效更新

## {{% heading "whatsnext" %}}

- [Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards)
- [实施 Pod 安全标准](/docs/setup/best-practices/enforcing-pod-security-standards)
- [通过配置内置的准入控制器实施 Pod 安全性标准](/docs/tasks/configure-pod-container/enforce-standards-admission-controller)
- [通过命名空间标签实施 Pod 安全性标准](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels)
- [迁移 Pod 安全策略到内置的 Pod 安全准入控制器](/docs/tasks/configure-pod-container/migrate-from-psp)
