---
title: Pod 安全性准入
description: >
  对 Pod 安全性准入控制器的概述，Pod 安全性准入控制器可以实施 Pod 安全性标准。

content_type: concept
weight: 20
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
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
The Kubernetes [Pod Security Standards](/docs/concepts/security/pod-security-standards/) define
different isolation levels for Pods. These standards let you define how you want to restrict the
behavior of pods in a clear, consistent fashion.
-->
Kubernetes [Pod 安全性标准（Security Standard）](/zh-cn/docs/concepts/security/pod-security-standards/)
为 Pod 定义不同的隔离级别。这些标准能够让你以一种清晰、一致的方式定义如何限制 Pod 行为。

<!--
Kubernetes offers a built-in _Pod Security_ {{< glossary_tooltip text="admission controller"
term_id="admission-controller" >}} to enforce the Pod Security Standards. Pod security restrictions
are applied at the {{< glossary_tooltip text="namespace" term_id="namespace" >}} level when pods are
created.
-->
Kubernetes 提供了一个内置的 **Pod Security**
{{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}来执行 Pod 安全标准
（Pod Security Standard）。
创建 Pod 时在{{< glossary_tooltip text="名字空间" term_id="namespace" >}}级别应用这些 Pod 安全限制。

<!--
### Built-in Pod Security admission enforcement

This page is part of the documentation for Kubernetes v{{< skew currentVersion >}}.
If you are running a different version of Kubernetes, consult the documentation for that release.
-->
### 内置 Pod 安全准入强制执行 {#built-in-pod-security-admission-enforcement}

本页面是 Kubernetes v{{< skew currentVersion >}} 文档的一部分。
如果你运行的是其他版本的 Kubernetes，请查阅该版本的文档。

<!-- body -->

<!--
## Pod Security levels
-->
## Pod 安全性级别   {#pod-security-levels}

<!--
Pod Security admission places requirements on a Pod's [Security
Context](/docs/tasks/configure-pod-container/security-context/) and other related fields according
to the three levels defined by the [Pod Security
Standards](/docs/concepts/security/pod-security-standards): `privileged`, `baseline`, and
`restricted`. Refer to the [Pod Security Standards](/docs/concepts/security/pod-security-standards)
page for an in-depth look at those requirements.
-->
Pod 安全性准入插件对 Pod
的[安全性上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)有一定的要求，
并且依据 [Pod 安全性标准](/zh-cn/docs/concepts/security/pod-security-standards)所定义的三个级别
（`privileged`、`baseline` 和 `restricted`）对其他字段也有要求。
关于这些需求的更进一步讨论，请参阅
[Pod 安全性标准](/zh-cn/docs/concepts/security/pod-security-standards/)页面。

<!--
## Pod Security Admission labels for namespaces

Once the feature is enabled or the webhook is installed, you can configure namespaces to define the admission
control mode you want to use for pod security in each namespace. Kubernetes defines a set of 
{{< glossary_tooltip term_id="label" text="labels" >}} that you can set to define which of the 
predefined Pod Security Standard levels you want to use for a namespace. The label you select
defines what action the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
takes if a potential violation is detected:
-->
## 为名字空间设置 Pod 安全性准入控制标签 {#pod-security-admission-labels-for-namespaces}

一旦特性被启用或者安装了 Webhook，你可以配置名字空间以定义每个名字空间中
Pod 安全性准入控制模式。
Kubernetes 定义了一组{{< glossary_tooltip term_id="label" text="标签" >}}，
你可以设置这些标签来定义某个名字空间上要使用的预定义的 Pod 安全性标准级别。
你所选择的标签定义了检测到潜在违例时，
{{< glossary_tooltip text="控制面" term_id="control-plane" >}}要采取什么样的动作。

<!--
Mode | Description
:---------|:------------
**enforce** | Policy violations will cause the pod to be rejected.
**audit** | Policy violations will trigger the addition of an audit annotation to the event recorded in the [audit log](/docs/tasks/debug/debug-cluster/audit/), but are otherwise allowed.
**warn** | Policy violations will trigger a user-facing warning, but are otherwise allowed.
-->
{{< table caption="Pod 安全准入模式" >}}
模式 | 描述
:---------|:------------
**enforce** | 策略违例会导致 Pod 被拒绝
**audit** | 策略违例会触发[审计日志](/zh-cn/docs/tasks/debug/debug-cluster/audit/)中记录新事件时添加审计注解；但是 Pod 仍是被接受的。
**warn** | 策略违例会触发用户可见的警告信息，但是 Pod 仍是被接受的。
{{< /table >}}

<!--
A namespace can configure any or all modes, or even set a different level for different modes.

For each mode, there are two labels that determine the policy used:
-->
名字空间可以配置任何一种或者所有模式，或者甚至为不同的模式设置不同的级别。

对于每种模式，决定所使用策略的标签有两个：

<!--
# The per-mode level label indicates which policy level to apply for the mode.
#
# MODE must be one of `enforce`, `audit`, or `warn`.
# LEVEL must be one of `privileged`, `baseline`, or `restricted`.
pod-security.kubernetes.io/<MODE>: <LEVEL>

# Optional: per-mode version label that can be used to pin the policy to the
# version that shipped with a given Kubernetes minor version (for example v{{< skew currentVersion >}}).
#
# MODE must be one of `enforce`, `audit`, or `warn`.
# VERSION must be a valid Kubernetes minor version, or `latest`.
pod-security.kubernetes.io/<MODE>-version: <VERSION>
-->
```yaml
# 模式的级别标签用来标示对应模式所应用的策略级别
#
# MODE 必须是 `enforce`、`audit` 或 `warn` 之一
# LEVEL 必须是 `privileged`、baseline` 或 `restricted` 之一
pod-security.kubernetes.io/<MODE>: <LEVEL>

# 可选：针对每个模式版本的版本标签可以将策略锁定到
# 给定 Kubernetes 小版本号所附带的版本（例如 v{{< skew currentVersion >}}）
#
# MODE 必须是 `enforce`、`audit` 或 `warn` 之一
# VERSION 必须是一个合法的 Kubernetes 小版本号或者 `latest`
pod-security.kubernetes.io/<MODE>-version: <VERSION>
```

<!--
Check out [Enforce Pod Security Standards with Namespace Labels](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels) to see example usage.
-->
关于用法示例，可参阅[使用名字空间标签来强制实施 Pod 安全标准](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)。

<!--
## Workload resources and Pod templates

Pods are often created indirectly, by creating a [workload
object](/docs/concepts/workloads/controllers/) such as a {{< glossary_tooltip
term_id="deployment" >}} or {{< glossary_tooltip term_id="job">}}. The workload object defines a
_Pod template_ and a {{< glossary_tooltip term_id="controller" text="controller" >}} for the
workload resource creates Pods based on that template. To help catch violations early, both the
audit and warning modes are applied to the workload resources. However, enforce mode is **not**
applied to workload resources, only to the resulting pod objects.
-->
## 负载资源和 Pod 模板    {#workload-resources-and-pod-templates}

Pod 通常是通过创建 {{< glossary_tooltip term_id="deployment" >}} 或
{{< glossary_tooltip term_id="job">}}
这类[工作负载对象](/zh-cn/docs/concepts/workloads/controllers/)来间接创建的。
工作负载对象为工作负载资源定义一个 **Pod 模板**和一个对应的负责基于该模板来创建
Pod 的{{< glossary_tooltip term_id="controller" text="控制器" >}}。
为了尽早地捕获违例状况，`audit` 和 `warn` 模式都应用到负载资源。
不过，`enforce` 模式并**不**应用到工作负载资源，仅应用到所生成的 Pod 对象上。

<!--
## Exemptions

You can define _exemptions_ from pod security enforcement in order to allow the creation of pods that
would have otherwise been prohibited due to the policy associated with a given namespace.
Exemptions can be statically configured in the
[Admission Controller configuration](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller).
-->
## 豁免   {#exemptions}

你可以为 Pod 安全性的实施设置**豁免（Exemptions）** 规则，
从而允许创建一些本来会被与给定名字空间相关的策略所禁止的 Pod。
豁免规则可以在[准入控制器配置](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller)
中静态配置。

<!--
Exemptions must be explicitly enumerated. Requests meeting exemption criteria are _ignored_ by the
Admission Controller (all `enforce`, `audit` and `warn` behaviors are skipped). Exemption dimensions include:
-->
豁免规则必须显式枚举。满足豁免标准的请求会被准入控制器**忽略**
（所有 `enforce`、`audit` 和 `warn` 行为都会被略过）。
豁免的维度包括：

<!--
- **Usernames:** requests from users with an exempt authenticated (or impersonated) username are
  ignored.
- **RuntimeClassNames:** pods and [workload resources](#workload-resources-and-pod-templates) specifying an exempt runtime class name are
  ignored.
- **Namespaces:** pods and [workload resources](#workload-resources-and-pod-templates) in an exempt namespace are ignored.
-->
- **Username：** 来自用户名已被豁免的、已认证的（或伪装的）的用户的请求会被忽略。
- **RuntimeClassName：** 指定了已豁免的运行时类名称的 Pod
  和[负载资源](#workload-resources-and-pod-templates)会被忽略。
- **Namespace：** 位于被豁免的名字空间中的 Pod 和[负载资源](#workload-resources-and-pod-templates)会被忽略。

{{< caution >}}
<!--
Most pods are created by a controller in response to a [workload
resource](#workload-resources-and-pod-templates), meaning that exempting an end user will only
exempt them from enforcement when creating pods directly, but not when creating a workload resource.
Controller service accounts (such as `system:serviceaccount:kube-system:replicaset-controller`)
should generally not be exempted, as doing so would implicitly exempt any user that can create the
corresponding workload resource.
-->
大多数 Pod 是作为对[工作负载资源](#workload-resources-and-pod-templates)的响应，
由控制器所创建的，这意味着为某最终用户提供豁免时，只会当该用户直接创建 Pod
时对其实施安全策略的豁免。用户创建工作负载资源时不会被豁免。
控制器服务账号（例如：`system:serviceaccount:kube-system:replicaset-controller`）
通常不应该被豁免，因为豁免这类服务账号隐含着对所有能够创建对应工作负载资源的用户豁免。
{{< /caution >}}

<!--
Updates to the following pod fields are exempt from policy checks, meaning that if a pod update
request only changes these fields, it will not be denied even if the pod is in violation of the
current policy level:
-->
策略检查时会对以下 Pod 字段的更新操作予以豁免，这意味着如果 Pod
更新请求仅改变这些字段时，即使 Pod 违反了当前的策略级别，请求也不会被拒绝。

<!--
- Any metadata updates **except** changes to the seccomp or AppArmor annotations:
  - `seccomp.security.alpha.kubernetes.io/pod` (deprecated)
  - `container.seccomp.security.alpha.kubernetes.io/*` (deprecated)
  - `container.apparmor.security.beta.kubernetes.io/*` (deprecated)
- Valid updates to `.spec.activeDeadlineSeconds`
- Valid updates to `.spec.tolerations`
-->
- 除了对 seccomp 或 AppArmor 注解之外的所有元数据（Metadata）更新操作：
  - `seccomp.security.alpha.kubernetes.io/pod` （已弃用）
  - `container.seccomp.security.alpha.kubernetes.io/*` （已弃用）
  - `container.apparmor.security.beta.kubernetes.io/*`（已弃用）
- 对 `.spec.activeDeadlineSeconds` 的合法更新
- 对 `.spec.tolerations` 的合法更新

<!--
## Metrics

Here are the Prometheus metrics exposed by kube-apiserver:
-->
## 指标   {#metrics}

以下是 kube-apiserver 公开的 Prometheus 指标：

<!--
- `pod_security_errors_total`: This metric indicates the number of errors preventing normal evaluation.
  Non-fatal errors may result in the latest restricted profile being used for enforcement.
- `pod_security_evaluations_total`: This metric indicates the number of policy evaluations that have occurred,
  not counting ignored or exempt requests during exporting.
- `pod_security_exemptions_total`: This metric indicates the number of exempt requests, not counting ignored
  or out of scope requests.
-->
- `pod_security_errors_total`：此指标表示妨碍正常评估的错误数量。
  如果错误是非致命的，kube-apiserver 可能会强制实施最新的受限配置。
- `pod_security_evaluations_total`：此指标表示已发生的策略评估的数量，
  不包括导出期间被忽略或豁免的请求。
- `pod_security_exemptions_total`：该指标表示豁免请求的数量，
  不包括被忽略或超出范围的请求。

## {{% heading "whatsnext" %}}

<!--
- [Pod Security Standards](/docs/concepts/security/pod-security-standards)
- [Enforcing Pod Security Standards](/docs/setup/best-practices/enforcing-pod-security-standards)
- [Enforce Pod Security Standards by Configuring the Built-in Admission Controller](/docs/tasks/configure-pod-container/enforce-standards-admission-controller)
- [Enforce Pod Security Standards with Namespace Labels](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels)
-->
- [Pod 安全性标准](/zh-cn/docs/concepts/security/pod-security-standards/)
- [强制实施 Pod 安全性标准](/zh-cn/docs/setup/best-practices/enforcing-pod-security-standards/)
- [通过配置内置的准入控制器强制实施 Pod 安全性标准](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)
- [使用名字空间标签来实施 Pod 安全性标准](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)

<!--
If you are running an older version of Kubernetes and want to upgrade
to a version of Kubernetes that does not include PodSecurityPolicies,
read [migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp).
-->
如果你正运行较老版本的 Kubernetes，想要升级到不包含 PodSecurityPolicy 的 Kubernetes 版本，
可以参阅[从 PodSecurityPolicy 迁移到内置的 PodSecurity 准入控制器](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp)。
