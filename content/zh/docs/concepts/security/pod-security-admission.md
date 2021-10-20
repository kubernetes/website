---
title: Pod 安全性准入
content_type: concept
weight: 10
---
<!--
reviewers:
- tallclair
- liggitt
  title: Pod 安全性准入
  description: >
  An overview of the Pod Security Admission Controller, which can enforce the Pod Security
  Standards.
  content_type: concept
  weight: 20
  min-kubernetes-server-version: v1.22
-->
<!-- overview -->

{{< feature-state for_k8s_version="v1.22" state="alpha" >}}

Kubernetes [安全性标准](/docs/concepts/security/pod-security-standards/) 为Pod定义了不同的隔离级别。这些标准让您可以明确、一致地定义如何限制 Pod 的行为。

作为 Alpha 功能，Kubernetes 提供了内置的Pod 安全性 准入控制器，PodSecurityPolicies的继承者。Pod 安全限制适用于命名空间 创建 pod 时的级别。

{{< note >}}
The PodSecurityPolicy API is deprecated and will be
[removed](/docs/reference/using-api/deprecation-guide/#v1-25) from Kubernetes in v1.25.
{{< /note >}}

<!-- body -->

## 启用 Alpha 特性

通过命名空间设置 pod 安全控制是一项 alpha 功能。 您必须启用 `PodSecurity`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) 特性门控才能使用它.

```shell
--feature-gates="...,PodSecurity=true"
```

## Pod 安全 级别

Pod安全性准入根据[Pod安全性标准](/docs/tasks/configure-pod-container/security-context/)定义的三个级别: `privileged`, `baseline`, 和
`restricted`对pod的[Security Context](/docs/tasks/configure-pod-container/security-context/)和其他相关字段进行要求。要深入理解具体的要求，请参阅[Pod Security Standards](/docs/concepts/security/pod-security-standards)页面。
<!--
Pod Security admission places requirements on a Pod's [Security
Context](/docs/tasks/configure-pod-container/security-context/) and other related fields according
to the three levels defined by the [Pod Security
Standards](/docs/concepts/security/pod-security-standards): `privileged`, `baseline`, and
`restricted`. Refer to the [Pod Security Standards](/docs/concepts/security/pod-security-standards)
page for an in-depth look at those requirements.
-->
## 命名空间的 Pod 安全性准入标签

假设您已启用此功能，您可以配置命名空间来定义要用于每个命名空间中的 pod 安全性的准入控制模式。Kubernetes 定义了一组 标签您可以设置以定义要用于命名空间的预定义 Pod 安全标准级别。您选择的标签定义了要执行的操作控制平面 如果检测到潜在的违规行为，则采取以下措施：
{{< table caption="Pod Security Admission modes" >}}
Mode | Description
:---------|:------------
**enforce** | Policy violations will cause the pod to be rejected.
**audit** | Policy violations will trigger the addition of an audit annotation to the event recorded in the [audit log](/docs/tasks/debug-application-cluster/audit/), but are otherwise allowed.
**warn** | Policy violations will trigger a user-facing warning, but are otherwise allowed.
{{< /table >}}

命名空间可以配置任何或所有模式，甚至可以为不同的模式设置不同的级别。

对于每种模式，有两个标签决定所使用的策略：
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

A namespace can configure any or all modes, or even set a different level for different modes.

For each mode, there are two labels that determine the policy used:
-->
```yaml
# The per-mode level label indicates which policy level to apply for the mode.
#
# MODE must be one of `enforce`, `audit`, or `warn`.
# LEVEL must be one of `privileged`, `baseline`, or `restricted`.
pod-security.kubernetes.io/<MODE>: <LEVEL>

# Optional: per-mode version label that can be used to pin the policy to the
# version that shipped with a given Kubernetes minor version (for example v{{< skew latestVersion >}}).
#
# MODE must be one of `enforce`, `audit`, or `warn`.
# VERSION must be a valid Kubernetes minor version, or `latest`.
pod-security.kubernetes.io/<MODE>-version: <VERSION>
```

查看 [Enforce Pod Security Standards with Namespace Labels](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels) 以了解示用法示例.

## 工作负载资源和 Pod 模板
Pod 通常是通过创建[工作负载对象](/docs/concepts/workloads/controllers/)（例如{{< glossary_tooltip
term_id="deployment" >}} 或者 {{< glossary_tooltip term_id="job">}}. 工作负载对象定义了一个 Pod 模板和一个{{< glossary_tooltip term_id="controller" text="controller" >}}对于工作负载资源，基于该模板创建 Pod。为了帮助及早发现违规，审计和警告模式都应用于工作负载资源。但是，强制模式**不适** 用于工作负载资源，仅适用于生成的 pod 对象。
<!--
Pods are often created indirectly, by creating a [workload
object](/docs/concepts/workloads/controllers/) such as a {{< glossary_tooltip
term_id="deployment" >}} or {{< glossary_tooltip term_id="job">}}. The workload object defines a
_Pod template_ and a {{< glossary_tooltip term_id="controller" text="controller" >}} for the
workload resource creates Pods based on that template. To help catch violations early, both the
audit and warning modes are applied to the workload resources. However, enforce mode is **not**
applied to workload resources, only to the resulting pod objects.
-->
## Exemptions

Y您可以定义pod 安全实施的豁免，以允许创建由于与给定命名空间相关联的策略而被禁止的 pod。豁免可以在
[Admission Controller configuration](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller)静态 配置。

必须明确列举豁免。准入控制器忽略满足豁免标准的请求（所有enforce、audit和warn行为都被跳过）。豁免维度包括:

- **Usernames:** requests from users with an exempt authenticated (or impersonated) username are
  ignored.
- **RuntimeClassNames:** pods and [workload resources](#workload-resources-and-pod-templates) specifying an exempt runtime class name are
  ignored.
- **Namespaces:** pods and [workload resources](#workload-resources-and-pod-templates) in an exempt namespace are ignored.

{{< caution >}}

大多数 Pod 是由控制器创建的，以响应 [workload
resource](#workload-resources-and-pod-templates), 这意味着豁免最终用户只会在直接创建 Pod 时免除他们的强制执行，而在创建工作负载资源时则不会。system:serviceaccount:kube-system:replicaset-controller通常不应免除控制器服务帐户（例如），因为这样做会隐式免除任何可以创建相应工作负载资源的用户。

{{< /caution >}}

对以下 pod 字段的更新免于策略检查，这意味着如果 pod 更新请求仅更改这些字段，即使 pod 违反当前策略级别也不会被拒绝：:

- Any metadata updates **except** changes to the seccomp or AppArmor annotations:
  - `seccomp.security.alpha.kubernetes.io/pod` (deprecated)
  - `container.seccomp.security.alpha.kubernetes.io/*` (deprecated)
  - `container.apparmor.security.beta.kubernetes.io/*`
- Valid updates to `.spec.activeDeadlineSeconds`
- Valid updates to `.spec.tolerations`

## {{% heading "whatsnext" %}}

- [Pod Security Standards](/docs/concepts/security/pod-security-standards)
- [Enforcing Pod Security Standards](/docs/setup/best-practices/enforcing-pod-security-standards)
- [Enforce Pod Security Standards by Configuring the Built-in Admission Controller](/docs/tasks/configure-pod-container/enforce-standards-admission-controller)
- [Enforce Pod Security Standards with Namespace Labels](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels)
- [Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp)
