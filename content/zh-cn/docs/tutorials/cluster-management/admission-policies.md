---
title: 探索验证与变更准入策略
content_type: tutorial
description: >-
  使用声明式准入策略，在准入时通过通用表达式语言（CEL）验证或变更资源。
weight: 70
min-kubernetes-server-version: v1.32
---
<!--
title: Explore Validating and Mutating Admission Policies
content_type: tutorial
description: >-
  Use declarative admission policies to validate or mutate resources
  at admission time using Common Expression Language (CEL).
weight: 70
min-kubernetes-server-version: v1.32
-->

<!-- overview -->

<!--
This page lets you try out declarative _admission policies_, which allow you to use the Common
Expression Language (CEL) to validate or mutate resources.
-->
本页面让你试用声明式**准入策略**，这类策略允许你使用通用表达式语言（CEL）验证或变更资源。

<!--
Kubernetes {{< skew currentVersion >}} supports two kinds of admission policy:

- [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)
- [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/)

This tutorial covers both kinds of admission policy.
-->
Kubernetes {{< skew currentVersion >}} 支持两种准入策略：

- [ValidatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)
- [MutatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/mutating-admission-policy/)

本教程介绍这两种准入策略。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
To define admission policies, you must be a cluster administrator. Make sure you have administrator
access to the cluster where you are learning.
-->
要定义准入策略，你必须是集群管理员。请确保你对用于学习的集群具有管理员访问权限。

<!--
For ValidatingAdmissionPolicy, you need:
* A cluster running version 1.30 or later.

For MutatingAdmissionPolicy, you need:
* A cluster running version 1.36 or later.
-->
对于 ValidatingAdmissionPolicy，你需要：
* 运行 1.30 或更高版本的集群。

对于 MutatingAdmissionPolicy，你需要：
* 运行 1.36 或更高版本的集群。

<!--
To check the version, run `kubectl version`.
If you are running an older version of Kubernetes, check the documentation for that version.
-->
要检查版本，请运行 `kubectl version`。如果你运行的是较旧版本的 Kubernetes，请查阅对应版本的文档。

<!--
## What are declarative admission policies?

Declarative admission policies offer a declarative,
in-process alternative to admission webhooks.
-->
## 什么是声明式准入策略？ {#what-are-declarative-admission-policies}

声明式准入策略为准入 Webhook 提供了一种声明式的、进程内的替代方案。

<!--
By using the Common Expression Language (CEL) to declare policy rules,
these policies are evaluated directly within the API server.

These policies are highly configurable, enabling policy authors to define logic that can be parameterized
and scoped to resources as needed by cluster administrators.
-->
通过使用通用表达式语言（CEL）来声明策略规则，这些策略直接在 API 服务器内部进行评估。

这些策略高度可配置，使策略作者能够定义可参数化的逻辑，并根据集群管理员的需要限定到特定资源。

<!--
### API types for admission policies

The two types of policy have different purposes.

ValidatingAdmissionPolicy is for _enforcing constraints_.

MutatingAdmissionPolicy is for _modifying resources during admission_.
-->
### 准入策略的 API 类型 {#api-types-for-admission-policies}

这两种策略的用途不同。

ValidatingAdmissionPolicy 用于**强制执行约束**。

MutatingAdmissionPolicy 用于**在准入时修改资源**。

<!--
### Policy elements

Each applied policy always has a _policy_ object (ValidatingAdmissionPolicy or MutatingAdmissionPolicy)
and a separate _binding_ object (ValidatingAdmissionPolicyBinding or MutatingAdmissionPolicyBinding).
-->
### 策略要素 {#policy-elements}

每个被应用的策略都有一个**策略**对象（ValidatingAdmissionPolicy 或 MutatingAdmissionPolicy）
和一个独立的**绑定**对象（ValidatingAdmissionPolicyBinding 或 MutatingAdmissionPolicyBinding）。

<!--
You can also use _parameters_, which are **optional**. To learn more, see
[parameter resources](/docs/reference/access-authn-authz/validating-admission-policy/#parameter-resources) (ValidatingAdmissionPolicy) or
[parameter resources](/docs/reference/access-authn-authz/mutating-admission-policy/#parameter-resources) (MutatingAdmissionPolicy).
-->
你还可以使用**参数**，参数是**可选的**。要了解更多信息，
请参阅[参数资源](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/#parameter-resources)（ValidatingAdmissionPolicy
或[参数资源](/zh-cn/docs/reference/access-authn-authz/mutating-admission-policy/#parameter-resources)（MutatingAdmissionPolicy）。

<!--
Policy objects describe the abstract logic of a policy using Common Expression Language (CEL).
For example, a ValidatingAdmissionPolicy might enforce replica limits or ensure specific labels are present,
while a MutatingAdmissionPolicy can modify resources such as adding a default label to a namespace.
-->
策略对象使用通用表达式语言（CEL）描述策略的抽象逻辑。
例如，ValidatingAdmissionPolicy 可以强制副本数量限制或确保存在特定的标签，
而 MutatingAdmissionPolicy 可以修改资源，例如为命名空间添加默认标签。

<!--
Binding objects link the policy to your cluster and provide scoping.
A ValidatingAdmissionPolicyBinding or MutatingAdmissionPolicyBinding connects the policy to specific resources.
If you only want to enforce a policy for a specific subset of resources, the binding is where you narrow the
scope of the policy (using `matchResources`).
-->
绑定对象将策略与你的集群关联并提供作用域。
ValidatingAdmissionPolicyBinding 或 MutatingAdmissionPolicyBinding 将策略连接到特定资源。
如果你只想对特定子集的资源强制执行策略，
那么绑定就是你缩小策略作用域的地方（使用 `matchResources`）。

<!--
Parameters allow separating configuration for the policy behavior from its definition.
Parameter resources refer to Kubernetes resources available in the API.
They can be built-in API types (such as ConfigMap), or they can be
[custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
A policy binding then uses `spec.paramRef` to reference an actual parameter resource.
-->
参数允许将策略行为的配置与其定义分离。参数资源是指 API 中可用的 Kubernetes 资源。
它们可以是内置的 API 类型（例如 ConfigMap），
也可以是[定制资源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)。
然后，策略绑定使用 `spec.paramRef` 引用实际的参数资源。

<!--
If a policy does not require parameters, you leave `spec.paramKind` unspecified.
-->
如果策略不需要参数，则不设置 `spec.paramKind`。

<!--
### CEL expressions

Both kinds of policy rely on an expression language known as Common Expression Language (CEL).
Read [CEL in Kubernetes](/docs/reference/using-api/cel/) to learn more.
-->
### CEL 表达式 {#cel-expressions}

这两种策略都依赖一种称为通用表达式语言（CEL）的表达式语言。
阅读 [Kubernetes 中的通用表达式语言](/zh-cn/docs/reference/using-api/cel/)以了解更多。

<!--
If you are new to CEL, practice writing a very simple expression, such as `false || true`.
You can test CEL expressions in [CEL Playground](https://playcel.undistro.io).
-->
如果你刚接触 CEL，可以先练习编写一个非常简单的表达式，例如 `false || true`。
你可以在 [CEL Playground](https://playcel.undistro.io) 中测试 CEL 表达式。

<!--
### Policy actions

Each admission policy binding must specify one or more actions to declare how the policy
is enforced.
-->
### 策略操作 {#policy-actions}

每个准入策略绑定必须指定一个或多个操作，以声明策略如何被执行。

<!--
#### ValidatingAdmissionPolicyBinding {#policy-actions-validating}

For ValidatingAdmissionPolicyBinding, the supported `validationActions` are:
-->
#### ValidatingAdmissionPolicyBinding {#policy-actions-validating}

对于 ValidatingAdmissionPolicyBinding，支持的 `validationActions` 包括：

<!--
Audit
: Validation failure is included in the audit event for the API request.

Warn
: Validation failure is reported to the request client as a
  [warning](/blog/2020/09/03/warnings/).

Deny
: Validation failure results in a denied request.
-->
Audit
: 验证失败会记录在 API 请求的审计事件中。

Warn
: 验证失败会作为[警告](/zh-cn/blog/2020/09/03/warnings/)报告给请求客户端。

Deny
: 验证失败会导致请求被拒绝。

<!--
A policy check that fails or an error that occurs is enforced according to these actions.
Failures defined by the `failurePolicy` are enforced according to these actions only if the `failurePolicy`
is set to `Fail` (or not specified).
-->
策略检查失败或发生错误时，会按这些操作执行。
只有当 `failurePolicy` 设为 `Fail`（或未指定）时，
由 `failurePolicy` 定义的失败才会按这些操作执行。

<!--
See [Audit Annotations: validation failures](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure)
for more details about audit logging for policies.
-->
有关策略审计日志的更多细节，
请参见[审计注解：验证失败](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure)。

<!--
You are not allowed to use Deny and Warn together, since this combination would duplicate
the validation failure in both the API response body and the HTTP `Warning:` header.
-->
不能同时使用 Deny 和 Warn，因为这种组合会在 API 响应体和 HTTP `Warning:` 头中重复验证失败信息。

<!--
#### MutatingAdmissionPolicyBinding {#policy-actions-mutating}

For MutatingAdmissionPolicyBinding, the action is always to mutate the object.
-->
#### MutatingAdmissionPolicyBinding {#policy-actions-mutating}

对于 MutatingAdmissionPolicyBinding，操作始终是变更对象。

<!--
You can use a JSON Patch or a Kubernetes _apply configuration_.
-->
你可以使用 JSON Patch 或 Kubernetes 的**应用配置**（apply configuration）。

<!--
## Enforcement through validation

Now, try defining a ValidatingAdmissionPolicy.

The following is an example of a ValidatingAdmissionPolicy that requires that any Deployment has multiple replicas.
-->
## 通过验证强制执行 {#enforcement-through-validation}

现在，试着定义一个 ValidatingAdmissionPolicy。

下面是一个 ValidatingAdmissionPolicy 示例，它要求任何 Deployment 都有多个副本。

{{< code_sample language="yaml" file="access/manifest-admission-control/vap-min-replicas.yaml" >}}

<!--
`spec.validations` contains CEL expressions which use the [Common Expression Language (CEL)](https://github.com/google/cel-spec)
to validate the request.
If an expression evaluates to false, the validation check is enforced according to the `spec.failurePolicy` field.
-->
`spec.validations` 包含 CEL 表达式，
这些表达式使用[通用表达式语言（CEL）](https://github.com/google/cel-spec)验证请求。
如果某个表达式求值为 false，则根据 `spec.failurePolicy` 字段执行验证检查。

<!--
Write a policy like this and apply it.

Or, if you want to apply a ready-made manifest:
-->
编写一个这样的策略并应用它。

或者，如果你想应用一个现成的清单：

```shell
kubectl apply --server-side -f https://k8s.io/examples/access/manifest-admission-control/vap-min-replicas.yaml
```

<!--
On its own, this doesn't do anything.

You can try creating a Deployment with 0 or 1 replicas; it will work (unless some other policy prevents it).
-->
单独来看，这个策略不会起任何作用。

你可以试着创建一个 0 个或 1 个副本的 Deployment；这会成功（除非有其他策略阻止）。

---

<!--
To make it work, you define a ValidatingAdmissionPolicyBinding.

Pick a namespace where you'll enforce the new policy.

The following is an example ValidatingAdmissionPolicyBinding for the policy you made:
-->
要让它生效，你需要定义一个 ValidatingAdmissionPolicyBinding。

选择一个你要在其中执行新策略的命名空间。

下面是你所创建策略的一个示例 ValidatingAdmissionPolicyBinding：

<!--
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: enforce-multiple-replicas-deployments-binding
spec:
  policyName: "enforce-multiple-replicas-deployments"
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchLabels:
        kubernetes.io/metadata.name: default # change this to match the namespace you're using
```
-->
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: enforce-multiple-replicas-deployments-binding
spec:
  policyName: "enforce-multiple-replicas-deployments"
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchLabels:
        kubernetes.io/metadata.name: default # 改成你正在使用的命名空间
```

{{< caution >}}
<!--
Anyone with full / admin access to a namespace can write to its labels. This includes deleting a label from
the namespace.
-->
任何对命名空间有完全／管理员访问权限的人都可以写入其标签。这包括删除命名空间中的标签。

<!--
The `kubernetes.io/metadata.name` label is protected, but if you use a different label, take care to make sure
that only trusted users have a way to remove or edit that label you choose.
-->
`kubernetes.io/metadata.name` 标签是受保护的，但如果你使用其他标签，
请注意确保只有可信用户能够删除或编辑你所选的标签。
{{< /caution >}}

<!--
Write a manifest based on that example YAML (if you're using the `default` namespace, you can use
it without any changes). Apply that manifest using `kubectl apply`.
-->
基于该示例 YAML 编写一个清单（如果你使用的是 `default` 命名空间，可以直接使用而无需任何改动）。
使用 `kubectl apply` 应用该清单。

<!--
### Test the policy {#test-admission-policy-validation}
-->
### 测试策略 {#test-admission-policy-validation}

<!--
Now, test the policy. Try [creating a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/)
and then scale it to 0 replicas using `kubectl scale`. What happens?
-->
现在测试该策略。
试着[创建一个 Deployment](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)，
然后用 `kubectl scale` 将其缩容到 0 个副本。会发生什么？

<!--
You could change the ValidatingAdmissionPolicyBinding to have a different validation action,
instead of Deny. If you choose the Warning validation action and try to scale a Deployment to 0 replicas,
what happens?
-->
你可以把 ValidatingAdmissionPolicyBinding 的验证操作改为 Deny 之外的其他操作。
如果你选择 Warning 验证操作，然后试着把 Deployment 缩容到 0 个副本，会发生什么？

{{< note >}}
<!--
If you did change the ValidatingAdmissionPolicyBinding to just warn people, there's a problem&hellip;

The name is wrong! If you change a ValidatingAdmissionPolicyBinding or the associated ValidatingAdmissionPolicy so
that it only warns people, you should check if you also need to change the name of the policy. You would change the
name to make sure that the naming doesn't mislead people.
-->
如果你确实把 ValidatingAdmissionPolicyBinding 改成只警告用户，就会有一个问题 &hellip;

名字不对！如果你修改 ValidatingAdmissionPolicyBinding 或关联的 ValidatingAdmissionPolicy，
使其只警告用户，你应该检查是否也需要修改策略的名称。
你需要修改名称，以确保命名不会误导他人。
{{< /note >}}

<!--
### Existing resources aren't affected {#limitation-admission-policy-validation}

If you have a Deployment with 0 or 1 replicas, and you change the ValidatingAdmissionPolicyBinding back
to Deny mode, it doesn't affect any existing resources.
-->
### 现有资源不受影响 {#limitation-admission-policy-validation}

如果你有一个 0 个或 1 个副本的 Deployment，
并把 ValidatingAdmissionPolicyBinding 改回 Deny 模式，它不会影响任何现有资源。

<!--
(If you wanted to try to scale out Deployments to have at least 2 replicas, you could achieve that another
way - for example, using a {{< glossary_tooltip text="controller" term_id="controller" >}}).

That's all for the ValidatingAdmissionPolicy. Now you'll learn about MutatingAdmissionPolicies.
-->
（如果你想尝试把 Deployment 扩容到至少 2 个副本，可以用其他方式实现 ——
例如使用 {{< glossary_tooltip text="控制器" term_id="controller" >}}）。

ValidatingAdmissionPolicy 就介绍到这里。接下来你将了解 MutatingAdmissionPolicy。

<!--
## Modifying resources when they are created or changed {#mutation}

For this example, imagine that you want to use [Pod security admission](/docs/concepts/security/pod-security-admission/)
to ensure that namespaces, other than system namespaces, enforce a Pod security standard.
-->
## 在资源创建或变更时修改资源 {#mutation}

在这个例子中，假设你想使用
[Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)，
确保除系统命名空间之外的命名空间都执行某一 Pod 安全性标准。

<!--
Similar to validation, you can create a MutatingAdmissionPolicy that can modify
resources during admission. The API type that you need to modify is Namespace.

Here's a MutatingAdmissionPolicy that does some of this:
-->
与验证类似，你可以创建 MutatingAdmissionPolicy 在准入时修改资源。
你需要修改的 API 类型是 Namespace。

下面是一个实现其中部分功能的 MutatingAdmissionPolicy：

{{< code_sample language="yaml" file="access/manifest-admission-control/default-pod-security-baseline.yaml" >}}

{{< caution >}}
<!--
This policy sets a **default**. Someone with the ability to update a Namespace would be able to remove the
`pod-security.kubernetes.io/enforce` label from a namespace.
-->
此策略设置的是**默认值**。
有能力更新命名空间的人可以移除命名空间上的 `pod-security.kubernetes.io/enforce` 标签。

<!--
If you are not sure what this means, read through the [Security](/docs/concepts/security/) documentation or
get external information security advice.
-->
如果你不确定这意味着什么，请阅读[安全](/zh-cn/docs/concepts/security/)文档，
或征求外部的信息安全建议。
{{< /caution >}}

<!--
To apply that policy:
-->
要应用该策略：

```shell
kubectl apply --server-side -f https://k8s.io/examples/access/manifest-admission-control/default-pod-security-baseline.yaml
```

<!--
A MutatingAdmissionPolicyBinding is required to activate this policy; for example:
-->
需要 MutatingAdmissionPolicyBinding 来激活此策略；例如：

<!--
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: default-pod-security-baseline
spec:
  # the name of the MutatingAdmissionPolicy to apply
  policyName: default-pod-security-baseline
```
-->
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: default-pod-security-baseline
spec:
  # 要应用的 MutatingAdmissionPolicy 名称
  policyName: default-pod-security-baseline
```

<!--
### Test the policy {#test-admission-policy-mutation}

Try creating a new namespace named `example`:
-->
### 测试策略 {#test-admission-policy-mutation}

试着创建一个名为 `example` 的新命名空间：

```shell
kubectl create ns example
```

<!--
Examine its labels:
-->
检查它的标签：

```shell
kubectl describe ns example
```

<!--
Even though you didn't specify a Pod security admission enforcement level, the label has been set.

Next, check whether you can find a way round the security settings.
Create a YAML manifest for a different Namespace:
-->
尽管你没有指定 Pod 安全性准入的执行级别，该标签已被设置。

接下来，看看你能否找到绕过这些安全设置的办法。
为另一个 Namespace 创建一个 YAML 清单：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: another-example
  labels:
    pod-security.kubernetes.io/enforce: privileged
```

<!--
You can create that namespace from the local manifest using `kubectl apply --server-side`. Does it work?

Yes, and the new namespace allows running privileged Pods.
-->
你可以使用 `kubectl apply --server-side` 从本地清单创建该命名空间。这样能行吗？

可以，而且新命名空间允许运行特权 Pod。

<!--
This admission policy was **not** set up to validate or restrict. It provides a default value, but you can set
your own.
However, you can combine mutating admission with a validating admission policy as a way to enforce something,
but also make it easy to comply. (The tutorial doesn't explain this, but you can do it).
-->
这个准入策略**并未**设置为验证或限制。它提供默认值，但你可以设置自己的值。
不过，你可以把变更准入与验证准入策略结合起来，这样既能强制执行某些要求，又能让人容易遵守。
（本教程不解释这一点，但你可以这样做）。

<!--
Providing a useful default means that when people don't set anything, they get a better outcome than just seeing
an error message. Imagine if you did have a validation rule to make sure that all namespaces had to enforce at
least the baseline standard. Anyone who didn't know about that rule might try to deploy something and immediately
see an error message when they try making a namespace.
-->
提供一个有用的默认值意味着，当人们什么都没设置时，
他们得到的结果比只看到一条错误消息要好。
设想你确实有一条验证规则，确保所有命名空间都必须至少执行 baseline 标准。
不知道这条规则的人可能会尝试部署某些东西，
然后在创建命名空间时立刻看到一条错误消息。

<!--
### Use a parameter resource

Parameter resources allow a policy configuration to be separate from its definition.
A policy can define `paramKind`, which outlines the group, version, and kind (also known as GVK)
of the parameter resource. Then, a  policy binding ties that policy to the scope where it is bound,
as configured by a particular parameter resource.
-->
### 使用参数资源 {#use-a-parameter-resource}

参数资源允许策略配置与其定义分离。
策略可以定义 `paramKind`，它概述参数资源的组、版本和类别（也称为 GVK）。
然后，策略绑定将该策略关联到其绑定的作用域，并由特定的参数资源配置。

{{< code_sample language="yaml" file="access/manifest-admission-control/default-pod-security-configurable.yaml" >}}

<!--
Here is a sample MutatingAdmissionPolicyBinding:
-->
下面是一个 MutatingAdmissionPolicyBinding 示例：

<!--
```yaml
---
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: default-pod-security-configurable
spec:
  # the name of the MutatingAdmissionPolicy to apply
  policyName: default-pod-security-configurable

  # parameters to use
  paramRef:
    # if the ConfigMap is missing or empty, don't set a default
    # (but do allow namespace creation)
    parameterNotFoundAction: Allow

    # where to find the parameter
    namespace: kube-system
    name: default-pod-security-standard
```
-->
```yaml
---
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: default-pod-security-configurable
spec:
  # 要应用的 MutatingAdmissionPolicy 名称
  policyName: default-pod-security-configurable

  # 要使用的参数
  paramRef:
    # 如果 ConfigMap 不存在或为空，则不设置默认值
    # （但允许创建命名空间）
    parameterNotFoundAction: Allow

    # 参数所在的位置
    namespace: kube-system
    name: default-pod-security-standard
```

<!--
and here's a sample ConfigMap to put into the kube-system namespace:
-->
下面是放入 kube-system 命名空间的一个示例 ConfigMap：

<!--
```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: kube-system
  name: default-pod-security-standard
data:
  default: baseline # could also be "restricted"
```
-->
```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: kube-system
  name: default-pod-security-standard
data:
  default: baseline # 也可以是 "restricted"
```

<!--
Define both of those. You should **create the ConfigMap first**; the binding expects that the parameter
resource already exists (even if you plan to change it later).

Now, delete the previous MutatingAdmissionPolicyBinding:
-->
定义这两个对象。你应**先创建 ConfigMap**；
绑定要求参数资源已经存在（即使你计划之后修改它）。

现在，删除之前的 MutatingAdmissionPolicyBinding：

```shell
kubectl delete mutatingadmissionpolicybindings/default-pod-security-baseline
```

<!--
and create a new namespace:
-->
并创建一个新的命名空间：

```shell
kubectl create ns yet-another-example
```

```shell
kubectl describe ns yet-another-example
```

<!--
Did the labels get defaulted?
-->
标签是否被设为默认值了？

<!--
### Change the parameter
-->
### 修改参数 {#change-the-parameter}

<!--
```shell
# This starts an editor that lets you change .data.default for the parameter
kubectl --namespace kube-system edit configmap default-pod-security-standard
```
-->
```shell
# 这会启动一个编辑器，让你修改该参数的 .data.default
kubectl --namespace kube-system edit configmap default-pod-security-standard
```

<!--
After you change it, try creating one more namespace. What happens?
-->
修改之后，再试着创建一个命名空间。会发生什么？

<!--
## Clean up

To remove the resources created, run the following commands:
-->
## 清理 {#clean-up}

要删除所创建的资源，请运行以下命令：

```bash
kubectl delete validatingadmissionpolices/enforce-multiple-replicas-deployments \
               validatingadmissionpolicybindings/enforce-multiple-replicas-deployments

kubectl delete mutatingadmissionpolicies/default-pod-security-baseline \
               mutatingadmissionpolicybindings/default-pod-security-baseline

kubectl delete mutatingadmissionpolicies/default-pod-security-configurable \
               mutatingadmissionpolicybindings/default-pod-security-configurable

kubectl --namespace kube-system delete configmaps/default-pod-security-standard

kubectl delete namespaces/example namespaces/another-example namespaces/yet-another-example
```

<!--
If you created any test Pods or test Namespaces, clear those up too.
-->
如果你创建了任何测试 Pod 或测试 Namespace，也请一并清理。
