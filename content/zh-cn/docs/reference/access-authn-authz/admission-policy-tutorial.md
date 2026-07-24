---
title: 验证和变更准入策略（Validating and Mutating Admission Policies）
content_type: tutorial
description: >-
  使用声明式准入策略在准入时通过通用表达语言（CEL）验证或变更资源。
weight: 120
min-kubernetes-server-version: v1.32
---
<!--
title: Validating and Mutating Admission Policies
content_type: tutorial
description: >-
  Use declarative admission policies to validate or mutate resources
  at admission time using Common Expression Language (CEL).
weight: 120
min-kubernetes-server-version: v1.32
-->

<!-- overview -->

<!--
This page provides an overview of declarative admission policies,
which allow you to use the Common Expression Language (CEL)
to validate or mutate resources.
-->
本页面提供声明式准入策略的概述，此策略允许你使用通用表达语言（Common Expression Language，CEL）
来验证或变更资源。

<!--
`MutatingAdmissionPolicy` (beta)
: Modifies an object before it is stored
  (example: adding a default label).
-->
`MutatingAdmissionPolicy`（Beta）
: 在对象被存储之前对其进行修改（例如：添加默认标签）。

<!--
`ValidatingAdmissionPolicy`
: Configures whether to allow or deny a request
  that would modify a resource,
  based on specific rules.
-->
`ValidatingAdmissionPolicy`
: 根据特定规则配置是否允许或拒绝会修改资源的请求。

{{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
For ValidatingAdmissionPolicy,
ensure your cluster is version 1.30 or later.
-->
对于 ValidatingAdmissionPolicy，请确保你的集群版本为 1.30 或更高。

<!--
For MutatingAdmissionPolicy, you need:
* A cluster running version 1.32 or later.
* The `MutatingAdmissionPolicy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled.
* The `admissionregistration.k8s.io/v1beta1` [API group](/docs/concepts/overview/kubernetes-api/#api-groups) enabled.
-->
对于 MutatingAdmissionPolicy，你需要：
* 运行版本 1.32 或更高的集群。
* 启用 `MutatingAdmissionPolicy` [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
* 启用 `admissionregistration.k8s.io/v1beta1` [API 组](/zh-cn/docs/concepts/overview/kubernetes-api/#api-groups)。

<!--
### Local testing
-->
### 本地测试

{{< tabs name="local_cluster_setup" >}}
{{% tab name="kind" %}}
<!--
If you are using [kind](https://kind.sigs.k8s.io/), 
use this configuration to enable the necessary features:
-->
如果你正在使用 [kind](https://kind.sigs.k8s.io/)，请使用此配置来启用必要的特性：

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
featureGates:
  "MutatingAdmissionPolicy": true
runtimeConfig:
  "admissionregistration.k8s.io/v1beta1": "true"
nodes:
- role: control-plane
  image: kindest/node:v1.32.0
```

{{% /tab %}} 
{{% tab name="minikube" %}} 
<!--
If you are using minikube, 
run:
-->
如果你正在使用 minikube，请运行：

```bash
minikube start --feature-gates=MutatingAdmissionPolicy=true \
  --runtime-config=admissionregistration.k8s.io/v1beta1=true
```

{{% /tab %}} 
{{< /tabs >}}

<!--
## What are declarative admission policies?

Declarative admission policies offer a declarative, 
in-process alternative to admission webhooks.
By using the Common Expression Language (CEL) 
to declare policy rules,
these policies are evaluated directly within the API server.
-->
## 什么是声明式准入策略？ {#what-are-declarative-admission-policies}

声明式准入策略提供了一种声明式的、进程内的准入 Webhook 替代方案。
通过使用通用表达语言（CEL）来声明策略规则，这些策略直接在 API 服务器内进行评估。

<!--
These policies are highly configurable,
enabling policy authors to define logic that can be parameterized
and scoped to resources as needed by cluster administrators.
They are divided into two types:
-->
这些策略高度可配置，使策略作者能够定义可参数化的逻辑，并根据集群管理员的需要限定到特定资源。
它们分为两种类型：

<!--
ValidatingAdmissionPolicy 
: for enforcing constraints.

MutatingAdmissionPolicy (beta) 
: for modifying resources during admission.
-->
ValidatingAdmissionPolicy
: 用于强制执行约束条件。

MutatingAdmissionPolicy（Beta）
: 用于在准入过程中修改资源。

<!--
## API types for admission policies

A declarative policy requires a Policy and a Binding. 
Parameter resources are optional and provide runtime configuration.
-->
## 准入策略的 API 类型 {#api-types-for-admission-policies}

声明式策略需要一个 Policy 和一个 Binding。参数资源是可选的，用于提供运行时配置。

<!--
The `policy` resource
: Describes the abstract logic of a policy using Common Expression Language (CEL). 
  For example, a ValidatingAdmissionPolicy might enforce replica limits 
  or ensure specific labels are present, 
  while a MutatingAdmissionPolicy can modify resources 
  such as adding a default label to a namespace.
-->
`policy` 资源
: 使用通用表达语言（CEL）描述策略的抽象逻辑。
  例如，ValidatingAdmissionPolicy 可以强制执行副本限制或确保特定标签存在，
  而 MutatingAdmissionPolicy 可以修改资源，例如为命名空间添加默认标签。

<!--
The `binding` resource
: Links the policy to your cluster and provides scoping. 
  A ValidatingAdmissionPolicyBinding or MutatingAdmissionPolicyBinding 
  connects the policy to specific resources. 
  If you only want to enforce a policy for a specific subset of resources, 
  the binding is where you narrow the scope of the policy using `matchResources`.
-->
`binding` 资源
: 将策略链接到你的集群并提供作用域。
  ValidatingAdmissionPolicyBinding 或 MutatingAdmissionPolicyBinding
  将策略连接到特定资源。如果你只想对特定资源子集强制执行策略，
  `binding` 就是你使用 `matchResources` 来缩小策略作用域的地方。

<!--
The `parameter` resource (optional)
: Allows a policy configuration to be separate from its definition. 
  Parameter resources refer to Kubernetes resources available in the API. 
  They can be built-in types like `ConfigMap` 
  or extensions such as a CustomResourceDefinition (CRD). 
  A policy binding then uses `spec.paramRef` to reference an actual parameter resource. 
  If a policy does not require parameters, leave `spec.paramKind` unspecified.
-->
`parameter` 资源（可选）
: 允许策略配置与其定义分离。参数资源是指 API 中可用的 Kubernetes 资源。
  它们可以是像 `ConfigMap` 这样的内置类型，也可以是像 CustomResourceDefinition（CRD）这样的扩展。
  策略绑定然后使用 `spec.paramRef` 来引用实际的参数资源。
  如果策略不需要参数，则不指定 `spec.paramKind`。

<!--
### ValidatingAdmissionPolicy

The following is an example of a `ValidatingAdmissionPolicy`
that limits deployment replicas.
-->
### ValidatingAdmissionPolicy

以下是限制 Deployment 副本数的 `ValidatingAdmissionPolicy` 示例。

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "replica-limit-prod.example.com"
spec:
  matchConstraints:
    resourceRules:
    - apiGroups:   ["apps"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["deployments"]
  validations:
    - expression: "object.spec.replicas <= 5"
```

<!--
`spec.validations` contains CEL Expressions which use the [Common Expression Language (CEL)](https://github.com/google/cel-spec)
to validate the request. 
If an expression evaluates to false, 
the validation check is enforced
according to the `spec.failurePolicy` field.
-->
`spec.validations` 包含使用[通用表达语言（CEL）](https://github.com/google/cel-spec)的 CEL 表达式，
用于验证请求。如果表达式求值为 false，则根据 `spec.failurePolicy` 字段强制执行验证检查。

{{< note >}}
<!--
You can quickly test CEL expressions in [CEL Playground](https://playcel.undistro.io).
-->
你可以在 [CEL Playground](https://playcel.undistro.io) 中快速测试 CEL 表达式。
{{< /note >}}

<!--
To configure a validating admission policy for use in a cluster, 
a binding is required.
The following is an example of a `ValidatingAdmissionPolicyBinding`:
-->
要配置在集群中使用的验证准入策略，需要一个绑定。
以下是 `ValidatingAdmissionPolicyBinding` 的示例：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "demo-binding-test.example.com"
spec:
  policyName: "replica-limit-prod.example.com"
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchLabels:
        environment: test
```

<!--
### MutatingAdmissionPolicy (beta) {#mutatingadmissionpolicy}

Similar to validation, you can create a MutatingAdmissionPolicy that can modify 
resources during admission.
The following example enforces the baseline Pod Security Standard on newly created
namespaces that are not system namespaces and have no pod security admission label set.
-->
### MutatingAdmissionPolicy（Beta）{#mutatingadmissionpolicy}

与验证类似，你可以创建一个 MutatingAdmissionPolicy，它可以在准入过程中修改资源。
以下示例对新创建的、不是系统命名空间且未设置 Pod 安全准入标签的命名空间强制执行基线 Pod 安全标准。

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingAdmissionPolicy
metadata:
  name: "set-baseline-pod-security"
spec:
  reinvocationPolicy: Never
  matchConstraints:
    resourceRules:
    - apiGroups:   [""]
      apiVersions: ["v1"]
      operations:  ["CREATE"]
      resources:   ["namespaces"]
  matchConditions:                                              
    - name: "exclude-system-namespaces"
      expression: "!object.metadata.name.startsWith('kube-')"
    - name: "no-existing-pod-security-label"
      expression: "!('pod-security.kubernetes.io/enforce' in object.metadata.labels)"
  mutations:
    - patchType: "ApplyConfiguration"
      applyConfiguration:
        expression: "Object{metadata: Object.metadata{labels: {'pod-security.kubernetes.io/enforce': 'baseline'}}}"
```

<!--
A MutatingAdmissionPolicyBinding is required to activate this policy:
-->
需要一个 MutatingAdmissionPolicyBinding 来激活此策略：

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: "set-baseline-pod-security-binding"
spec:
  policyName: "set-baseline-pod-security"
```

<!--
#### Policy actions

Each admission policy binding must specify one or more actions
to declare how the policy is enforced.

For ValidatingAdmissionPolicyBinding,
the supported `validationActions` are:
-->
#### 策略操作 {#policy-actions}

每个准入策略绑定必须指定一个或多个操作来声明策略的执行方式。

对于 ValidatingAdmissionPolicyBinding，支持的 `validationActions` 包括：

<!--
`Audit`
: Validation failure is included in the audit event for the API request.
-->
`Audit`
: 验证失败被包含在 API 请求的审计事件中。

<!--
`Warn`
: Validation failure is reported to the request client as a
  [warning](/blog/2020/09/03/warnings/).
-->
`Warn`
: 验证失败作为[警告](/zh-cn/blog/2020/09/03/warnings/)报告给请求客户端。

<!--
`Deny`
: Validation failure results in a denied request.
-->
`Deny`
: 验证失败导致请求被拒绝。

<!--
`Deny` and `Warn` may not be used together,
since this combination duplicates the validation failure
in both the API response body and the HTTP warning headers.
-->
`Deny` 和 `Warn` 不能一起使用，因为这种组合会在 API 响应体和 HTTP 警告头中重复验证失败信息。

<!--
For MutatingAdmissionPolicyBinding,
the supported `mutationActions` include:
-->
对于 MutatingAdmissionPolicyBinding，支持的 `mutationActions` 包括：

<!--
`Apply`
: Applies the CEL-based mutation to the resource.
-->
`Apply`
: 将基于 CEL 的变更应用到资源。

<!--
A policy check that fails or an error that occurs
is enforced according to these actions.
Failures defined by the `failurePolicy` are enforced
according to these actions only if the `failurePolicy`
is set to `Fail` (or not specified).
-->
失败的策略检查或发生的错误将根据这些操作执行。
只有当 `failurePolicy` 设置为 `Fail`（或未指定）时，`failurePolicy` 定义的失败才会根据这些操作执行。

<!--
See [Audit Annotations: validation failures](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure)
for more details about audit logging for policies.
-->
有关策略审计日志的更多详情，
请参见[审计注解：验证失败](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure)。

<!--
### Parameter resources

Parameter resources allow a policy configuration to be separate from its definition.
A policy can define `paramKind`,
which outlines the Group, Version, and Kind (GVK) of the parameter resource,
and then a policy binding ties a policy by name (via `policyName`)
to a particular parameter resource via `paramRef`.
-->
### 参数资源  {#parameter-resources}

参数资源允许策略配置与其定义分离。策略可以定义 `paramKind`，
它概述了参数资源的 Group、Version 和 Kind（GVK），
然后策略绑定通过名称（通过 `policyName`）将策略与特定的参数资源通过 `paramRef` 关联起来。

<!--
Parameter resources decouple policy logic from its configuration. 
To use them, define a ValidatingAdmissionPolicy with a paramKind 
that references your configuration resource:
-->
参数资源将策略逻辑与其配置解耦。要使用它们，请定义一个带有 `paramKind` 的 ValidatingAdmissionPolicy，
此 `paramKind` 引用你的配置资源：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "replica-limit-prod.example.com"
spec:
  paramKind:
    apiVersion: rules.example.com/v1
    kind: ReplicaLimit
  matchConstraints:
    resourceRules:
    - apiGroups:   ["apps"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["deployments"]
  validations:
    - expression: "object.spec.replicas <= params.maxReplicas"
      messageExpression: "'object.spec.replicas must be no greater than ' + string(params.maxReplicas)"
```

<!--
The `spec.paramKind` field specifies the kind of resources 
used to parameterize the policy.
In this example,
it is configured by `ReplicaLimit` custom resources.
-->
`spec.paramKind` 字段指定用于参数化策略的资源类型。
在此示例中，它由 `ReplicaLimit` 自定义资源配置。

<!--
Note how the CEL expression references the parameters 
via the CEL `params` variable (e.g., `params.maxReplicas`).
The `spec.matchConstraints` specifies what resources 
this policy is designed to evaluate.
Native types such as `ConfigMap` 
can also be used as parameter references.
-->
注意 CEL 表达式如何通过 CEL `params` 变量引用参数（例如 `params.maxReplicas`）。
`spec.matchConstraints` 指定此策略旨在评估哪些资源。
像 `ConfigMap` 这样的原生类型也可以用作参数引用。

<!--
For each admission request, 
the API server evaluates CEL expressions 
of each (`policy`, `binding`, `param`) combination 
that match the request.
For a request to be admitted, 
it must pass all evaluations.
-->
对于每个准入请求，API 服务器评估与请求匹配的每个（`policy`、`binding`、`param`）组合的 CEL 表达式。
要使请求被准入，它必须通过所有评估。

<!--
## Clean up

To remove the resources created, run the following commands:
-->
## 清理 {#clean-up}

要删除创建的资源，请运行以下命令：

```bash
kubectl delete validatingadmissionpolicy replica-limit-prod.example.com
kubectl delete validatingadmissionpolicybinding demo-binding-test.example.com
kubectl delete mutatingadmissionpolicy set-baseline-pod-security
kubectl delete mutatingadmissionpolicybinding set-baseline-pod-security-binding
```