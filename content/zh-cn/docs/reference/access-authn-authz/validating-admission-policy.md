---
title: 验证准入策略（ValidatingAdmissionPolicy）
content_type: concept
---
<!--
reviewers:
- liggitt
- jpbetz
- cici37
title: Validating Admission Policy
content_type: concept
-->

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.30" >}}

<!--
This page provides an overview of Validating Admission Policy.
-->
本页面提供验证准入策略（Validating Admission Policy）的概述。

<!-- body -->

<!--
## What is Validating Admission Policy?

Validating admission policies offer a declarative, in-process alternative to validating admission webhooks.

Validating admission policies use the Common Expression Language (CEL) to declare the validation
rules of a policy.
Validation admission policies are highly configurable, enabling policy authors to define policies
that can be parameterized and scoped to resources as needed by cluster administrators.
-->
## 什么是验证准入策略？ {#what-is-validating-admission-policy}

验证准入策略提供一种声明式的、进程内的替代方案来验证准入 Webhook。

验证准入策略使用通用表达语言 (Common Expression Language，CEL) 来声明策略的验证规则。
验证准入策略是高度可配置的，使配置策略的作者能够根据集群管理员的需要，
定义可以参数化并限定到资源的策略。

<!--
## What Resources Make a Policy

A policy is generally made up of three resources:
-->
## 哪些资源构成策略  {#what-resources-make-a-policy}

策略通常由三种资源构成：

<!--
- The `ValidatingAdmissionPolicy` describes the abstract logic of a policy
  (think: "this policy makes sure a particular label is set to a particular value").

- A `ValidatingAdmissionPolicyBinding` links the above resources together and provides scoping.
  If you only want to require an `owner` label to be set for `Pods`, the binding is where you would
  specify this restriction.

- A parameter resource provides information to a ValidatingAdmissionPolicy to make it a concrete
  statement (think "the `owner` label must be set to something that ends in `.company.com`").
  A native type such as ConfigMap or a CRD defines the schema of a parameter resource.
  `ValidatingAdmissionPolicy` objects specify what Kind they are expecting for their parameter resource.
-->
- `ValidatingAdmissionPolicy` 描述策略的抽象逻辑（想想看：“这个策略确保一个特定标签被设置为一个特定值”）。

- 一个 `ValidatingAdmissionPolicyBinding` 将上述资源联系在一起，并提供作用域。
  如果你只想为 `Pods` 设置一个 `owner` 标签，你就需要在这个绑定中指定这个限制。

- 参数资源为 `ValidatingAdmissionPolicy` 提供信息，使其成为一个具体的声明
  （想想看：“`owner` 标签必须被设置为以 `.company.com` 结尾的形式"）。
  参数资源的模式（Schema）使用诸如 ConfigMap 或 CRD 这类原生类型定义。
  `ValidatingAdmissionPolicy` 对象指定它们期望参数资源所呈现的类型。

<!--
At least a `ValidatingAdmissionPolicy` and a corresponding `ValidatingAdmissionPolicyBinding`
must be defined for a policy to have an effect.

If a `ValidatingAdmissionPolicy` does not need to be configured via parameters, simply leave
`spec.paramKind` in  `ValidatingAdmissionPolicy` not specified.
-->
至少要定义一个 `ValidatingAdmissionPolicy` 和一个相对应的 `ValidatingAdmissionPolicyBinding` 才能使策略生效。

如果 `ValidatingAdmissionPolicy` 不需要参数配置，不设置 `ValidatingAdmissionPolicy` 中的
`spec.paramKind` 即可。

<!--
## Getting Started with Validating Admission Policy

Validating Admission Policy is part of the cluster control-plane. You should write and deploy them
with great caution. The following describes how to quickly experiment with Validating Admission Policy.
-->
## 开始使用验证准入策略  {#getting-started-with-validating-admission-policy}

验证准入策略是集群控制平面的一部分。你应该非常谨慎地编写和部署它们。下面介绍如何快速试验验证准入策略。

<!--
### Creating a ValidatingAdmissionPolicy

The following is an example of a ValidatingAdmissionPolicy.
-->
### 创建一个 ValidatingAdmissionPolicy

以下是一个 ValidatingAdmissionPolicy 的示例：

{{% code_sample language="yaml" file="validatingadmissionpolicy/basic-example-policy.yaml" %}}

<!--
`spec.validations` contains CEL expressions which use the [Common Expression Language (CEL)](https://github.com/google/cel-spec)
to validate the request. If an expression evaluates to false, the validation check is enforced
according to the `spec.failurePolicy` field.
-->
`spec.validations` 包含使用[通用表达式语言 (CEL)](https://github.com/google/cel-spec)
来验证请求的 CEL 表达式。
如果表达式的计算结果为 false，则根据 `spec.failurePolicy` 字段强制执行验证检查处理。

{{< note >}}
<!--
You can quickly test CEL expressions in [CEL Playground](https://playcel.undistro.io).
-->
你可以在 [CEL Playground](https://playcel.undistro.io) 中快速验证 CEL 表达式。
{{< /note >}}

<!--
To configure a validating admission policy for use in a cluster, a binding is required.
The following is an example of a ValidatingAdmissionPolicyBinding:
-->
要配置一个在某集群中使用的验证准入策略，需要一个绑定。
以下是一个 ValidatingAdmissionPolicyBinding 的示例：

{{% code_sample language="yaml" file="validatingadmissionpolicy/basic-example-binding.yaml" %}}

<!--
When trying to create a deployment with replicas set not satisfying the validation expression, an
error will return containing message:
-->
尝试创建副本集合不满足验证表达式的 Deployment 时，将返回包含以下消息的错误：

```none
ValidatingAdmissionPolicy 'demo-policy.example.com' with binding 'demo-binding-test.example.com' denied request: failed expression: object.spec.replicas <= 5
```

<!--
The above provides a simple example of using ValidatingAdmissionPolicy without a parameter configured.
-->
上面提供的是一个简单的、无配置参数的 ValidatingAdmissionPolicy。

<!--
#### Validation actions

Each `ValidatingAdmissionPolicyBinding` must specify one or more
`validationActions` to declare how `validations` of a policy are enforced.
-->
#### 验证操作

每个 `ValidatingAdmissionPolicyBinding` 必须指定一个或多个
`validationActions` 来声明如何执行策略的 `validations`。

<!--
The supported `validationActions` are:
-->
支持的 `validationActions` 包括：

<!--
- `Deny`: Validation failure results in a denied request.
- `Warn`: Validation failure is reported to the request client
  as a [warning](/blog/2020/09/03/warnings/).
- `Audit`: Validation failure is included in the audit event for the API request.
-->
- `Deny`：验证失败会导致请求被拒绝。
- `Warn`：验证失败会作为[警告](/zh-cn/blog/2020/09/03/warnings/)报告给请求客户端。
- `Audit`：验证失败会包含在 API 请求的审计事件中。

<!--
For example, to both warn clients about a validation failure and to audit the
validation failures, use:
-->
例如，要同时向客户端发出验证失败的警告并记录验证失败的审计记录，请使用以下配置：

```yaml
validationActions: [Warn, Audit]
```
<!--
`Deny` and `Warn` may not be used together since this combination
needlessly duplicates the validation failure both in the
API response body and the HTTP warning headers.
-->
`Deny` 和 `Warn` 不能一起使用，因为这种组合会不必要地将验证失败重复输出到
API 响应体和 HTTP 警告头中。

<!--
A `validation` that evaluates to false is always enforced according to these
actions. Failures defined by the `failurePolicy` are enforced
according to these actions only if the `failurePolicy` is set to `Fail` (or not specified),
otherwise the failures are ignored.
-->
如果 `validation` 求值为 false，则始终根据这些操作执行。
由 `failurePolicy` 定义的失败仅在 `failurePolicy` 设置为 `Fail`（或未指定）时根据这些操作执行，
否则这些失败将被忽略。

<!-- 
See [Audit Annotations: validation failures](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure) for more details about the validation failure audit annotation.
-->
有关验证失败审计注解的详细信息，
请参见[审计注解：验证失败](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation_failure)。

<!--
### Parameter resources

Parameter resources allow a policy configuration to be separate from its definition.
A policy can define paramKind, which outlines GVK of the parameter resource,
and then a policy binding ties a policy by name (via policyName) to a particular parameter resource via paramRef.

If parameter configuration is needed, the following is an example of a ValidatingAdmissionPolicy
with parameter configuration.
-->
### 参数资源    {#parameter-resources}

参数资源允许策略配置与其定义分开。
一个策略可以定义 paramKind，给出参数资源的 GVK，
然后一个策略绑定可以通过名称（通过 policyName）将某策略与某特定的参数资源（通过 paramRef）联系起来。

如果需要参数配置，下面是一个带有参数配置的 ValidatingAdmissionPolicy 的例子：

{{% code_sample language="yaml" file="validatingadmissionpolicy/policy-with-param.yaml" %}}

<!--
The `spec.paramKind` field of the ValidatingAdmissionPolicy specifies the kind of resources used
to parameterize this policy. For this example, it is configured by ReplicaLimit custom resources.
Note in this example how the CEL expression references the parameters via the CEL params variable,
e.g. `params.maxReplicas`. `spec.matchConstraints` specifies what resources this policy is
designed to validate. Note that the native types such like `ConfigMap` could also be used as
parameter reference.
-->
ValidatingAdmissionPolicy 的 `spec.paramKind` 字段指定用于参数化此策略的资源类型。
在这个例子中，它是由自定义资源 ReplicaLimit 配置的。
在这个例子中请注意 CEL 表达式是如何通过 CEL params 变量引用参数的，如：`params.maxReplicas`。
`spec.matchConstraints` 指定此策略要检查哪些资源。
请注意，诸如 `ConfigMap` 之类的原生类型也可以用作参数引用。

<!--
The `spec.validations` fields contain CEL expressions. If an expression evaluates to false, the
validation check is enforced according to the `spec.failurePolicy` field.

The validating admission policy author is responsible for providing the ReplicaLimit parameter CRD.

To configure an validating admission policy for use in a cluster, a binding and parameter resource
are created. The following is an example of a ValidatingAdmissionPolicyBinding
that uses a **cluster-wide** param - the same param will be used to validate
every resource request that matches the binding:
-->
`spec.validations` 字段包含 CEL 表达式。
如果表达式的计算结果为 false，则根据 `spec.failurePolicy` 字段强制执行验证检查操作。

验证准入策略的作者负责提供 ReplicaLimit 参数 CRD。

要配置一个在某集群中使用的验证准入策略，需要创建绑定和参数资源。
以下是 ValidatingAdmissionPolicyBinding **集群范围**参数的示例 - 相同的参数将用于验证与绑定匹配的每个资源请求：

{{% code_sample language="yaml" file="validatingadmissionpolicy/binding-with-param.yaml" %}}

<!--
Notice this binding applies a parameter to the policy for all resources which
are in the `test` environment.
-->
请注意，此绑定将参数应用于 `test` 环境中所有资源的策略中。

<!--
The parameter resource could be as following:
-->
参数资源可以如下：

{{% code_sample language="yaml" file="validatingadmissionpolicy/replicalimit-param.yaml" %}}

<!--
This policy parameter resource limits deployments to a max of 3 replicas.
An admission policy may have multiple bindings. To bind all other environments
to have a maxReplicas limit of 100, create another ValidatingAdmissionPolicyBinding:
-->
此策略参数资源将限制 Deployment 最多有 3 个副本。
一个准入策略可以有多个绑定。
要绑定所有的其他环境，限制 maxReplicas 为 100，请创建另一个 ValidatingAdmissionPolicyBinding：

{{% code_sample language="yaml" file="validatingadmissionpolicy/binding-with-param-prod.yaml" %}}

<!--
Notice this binding applies a different parameter to resources which
are not in the `test` environment.
-->
请注意，此绑定将不同的参数应用于不在 `test` 环境中的资源。

<!--
And have a parameter resource:
-->
并有一个参数资源：

{{% code_sample language="yaml" file="validatingadmissionpolicy/replicalimit-param-prod.yaml" %}}

<!--
For each admission request, the API server evaluates CEL expressions of each 
(policy, binding, param) combination that match the request. For a request
to be admitted it must pass **all** evaluations.

If multiple bindings match the request, the policy will be evaluated for each,
and they must all pass evaluation for the policy to be considered passed.
-->
对于每个准入请求，API 服务器都会评估与请求匹配的每个（策略、绑定、参数）组合的 CEL 表达式。
要获得准入资格，必须通过**所有**评估。

如果多个绑定与请求匹配，则将为每个绑定评估策略，并且它们必须全部通过评估，策略才会被视为通过。

<!--
If multiple parameters match a single binding, the policy rules will be evaluated
for each param, and they too must all pass for the binding to be considered passed.
Bindings can have overlapping match criteria. The policy is evaluated for each 
matching binding-parameter combination. A policy may even be evaluated multiple
times if multiple bindings match it, or a single binding that matches multiple 
parameters.
-->
如果多个参数与同一个绑定匹配，则系统将为每个参数评估策略规则，并且这些规则也必须全部通过才能认为该绑定通过。
多个绑定之间可以在匹配条件存在重叠。系统针对匹配的绑定参数所有组合来评估策略。如果多个绑定与其匹配，
或者同一个绑定与多个参数匹配，则策略甚至可以被多次评估。

<!--
Bindings can have overlapping match criteria. The policy is evaluated for each matching binding.
In the above example, the "nontest" policy binding could instead have been defined as a global policy:
-->
绑定可以包含相互重叠的匹配条件。策略会针对每个匹配的绑定进行计算。
在上面的例子中，`nontest` 策略绑定可以被定义为一个全局策略：

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "replicalimit-binding-global"
spec:
  policyName: "replicalimit-policy.example.com"
  validationActions: [Deny]
  params: "replica-limit-clusterwide.example.com"
  matchResources:
    namespaceSelector:
      matchExpressions:
      - key: environment
        operator: Exists
```

<!--
The params object representing a parameter resource will not be set if a parameter resource has
not been bound, so for policies requiring a parameter resource, it can be useful to add a check to
ensure one has been bound. A parameter resource will not be bound and `params` will be null
if `paramKind` of the policy, or `paramRef` of the binding are not specified.

For the use cases require parameter configuration, we recommend to add a param check in
`spec.validations[0].expression`:
-->
如果参数资源尚未被绑定，代表参数资源的 params 对象将不会被设置，
所以对于需要参数资源的策略，添加一个检查来确保参数资源被绑定，这会很有用。
如果策略的 `paramKind` 未指定或绑定的 `paramRef` 未指定，则不会绑定参数资源，
并且 `params` 将为空。

对于需要参数配置的场景，我们建议在 `spec.validations[0].expression` 中添加一个参数检查：

```
- expression: "params != null"
  message: "params missing but required to bind to this policy"
```

<!--
#### Optional parameters

It can be convenient to be able to have optional parameters as part of a parameter resource, and
only validate them if present. CEL provides `has()`, which checks if the key passed to it exists.
CEL also implements Boolean short-circuiting. If the first half of a logical OR evaluates to true,
it won’t evaluate the other half (since the result of the entire OR will be true regardless).

Combining the two, we can provide a way to validate optional parameters:
-->
#### 可选参数

将可选参数作为参数资源的一部分，并且只在参数存在时执行检查操作，这样做会比较方便。
CEL 提供了 `has()` 方法，它检查传递给它的键是否存在。CEL 还实现了布尔短路逻辑。
如果逻辑 OR 的前半部分计算为 true，则不会计算另一半（因为无论如何整个 OR 的结果都为真）。

结合这两者，我们可以提供一种验证可选参数的方法：

```
!has(params.optionalNumber) || (params.optionalNumber >= 5 && params.optionalNumber <= 10)
```

<!--
Here, we first check that the optional parameter is present with `!has(params.optionalNumber)`.
- If `optionalNumber` hasn’t been defined, then the expression short-circuits since
  `!has(params.optionalNumber)` will evaluate to true.
- If `optionalNumber` has been defined, then the latter half of the CEL expression will be
  evaluated, and optionalNumber will be checked to ensure that it contains a value between 5 and
  10 inclusive.
-->
在这里，我们首先用 `!has(params.optionalNumber)` 检查可选参数是否存在。

- 如果 `optionalNumber` 没有被定义，那么表达式就会短路，因为 `!has(params.optionalNumber)` 的计算结果为 true。
- 如果 `optionalNumber` 被定义了，那么将计算 CEL 表达式的后半部分，
  并且 `optionalNumber` 将被检查以确保它包含一个 5 到 10 之间的值（含 5 到 10）。

<!--
#### Per-namespace Parameters

As the author of a ValidatingAdmissionPolicy and its ValidatingAdmissionPolicyBinding, 
you can choose to specify cluster-wide, or per-namespace parameters. 
If you specify a `namespace` for the binding's `paramRef`, the control plane only
searches for parameters in that namespace.
-->
#### 按命名空间设置的参数

作为 ValidatingAdmissionPolicy 及其 ValidatingAdmissionPolicyBinding 的作者，
你可以选择指定其作用于集群范围还是某个命名空间。如果你为绑定的 `paramRef` 指定 `namespace`，
则控制平面仅在该命名空间中搜索参数。

<!--
However, if `namespace` is not specified in the ValidatingAdmissionPolicyBinding, the
API server can search for relevant parameters in the namespace that a request is against.
For example, if you make a request to modify a ConfigMap in the `default` namespace and
there is a relevant ValidatingAdmissionPolicyBinding with no `namespace` set, then the
API server looks for a parameter object in `default`.
This design enables policy configuration that depends on the namespace
of the resource being manipulated, for more fine-tuned control.
-->
但是，如果 ValidatingAdmissionPolicyBinding 中未指定 `namespace`，则 API
服务器可以在请求所针对的命名空间中搜索相关参数。
例如，如果你请求修改 `default` 命名空间中的 ConfigMap，并且存在未设置 `namespace` 的相关
ValidatingAdmissionPolicyBinding，则 API 服务器在 `default` 命名空间中查找参数对象。
此设计支持依赖于所操作资源的命名空间的策略配置，以实现更精细的控制。

<!--
#### Parameter selector

In addition to specify a parameter in a binding by `name`, you may
choose instead to specify label selector, such that all resources of the
policy's `paramKind`, and the param's `namespace` (if applicable) that match the
label selector are selected for evaluation. See {{< glossary_tooltip text="selector" term_id="selector">}} for more information on how label selectors match resources.
-->
#### 参数选择算符

除了在绑定中用 `name` 来指定参数之外，你还可以选择设置标签选择算符，
这样对于与策略的 `paramKind` 参数匹配，且位于参数的 `namespace`（如果适用）内的所有资源，
如果与标签选择算符匹配，都会被评估。有关标签选择算符如何匹配资源的更多信息，
请参阅{{<glossary_tooltip text="选择算符" term_id="selector">}}。

<!--
If multiple parameters are found to meet the condition, the policy's rules are
evaluated for each parameter found and the results will be ANDed together.

If `namespace` is provided, only objects of the `paramKind` in the provided
namespace are eligible for selection. Otherwise, when `namespace` is empty and 
`paramKind` is namespace-scoped, the `namespace` used in the request being 
admitted will be used.
-->
如果发现多个参数满足条件，则会针对所找到的每个参数来评估策略规则，并将结果进行“与”运算。

如果设置了 `namespace`，则只有所提供的命名空间中类别为 `paramKind` 的对象才会被匹配。
否则，当 `namespace` 为空且 `paramKind` 为命名空间作用域的资源时，使用被准入请求中指定的 `namespace`。

<!--
#### Authorization Check

We introduced the authorization check for parameter resources.
User is expected to have `read` access to the resources referenced by `paramKind` in
`ValidatingAdmissionPolicy` and `paramRef` in `ValidatingAdmissionPolicyBinding`.

Note that if a resource in `paramKind` fails resolving via the restmapper, `read` access to all
resources of groups is required.
-->
#### 鉴权检查

我们为参数资源引入了鉴权检查。
用户应该对 `ValidatingAdmissionPolicy` 中的 `paramKind`
和 `ValidatingAdmissionPolicyBinding` 中的 `paramRef` 所引用的资源有 `read` 权限。

请注意，如果 `paramKind` 中的资源没能通过 restmapper 解析，则用户需要拥有对组的所有资源的
`read` 访问权限。

<!--
### Failure Policy

`failurePolicy` defines how mis-configurations and CEL expressions evaluating to error from the
admission policy are handled. Allowed values are `Ignore` or `Fail`.

- `Ignore` means that an error calling the ValidatingAdmissionPolicy is ignored and the API
  request is allowed to continue.
- `Fail` means that an error calling the ValidatingAdmissionPolicy causes the admission to fail
  and the API request to be rejected.

Note that the `failurePolicy` is defined inside `ValidatingAdmissionPolicy`:
-->
### 失效策略   {#failure-policy}

`failurePolicy` 定义了如何处理错误配置和准入策略的 CEL 表达式取值为 error 的情况。

允许的值是 `Ignore` 或 `Fail`。

- `Ignore` 意味着调用 ValidatingAdmissionPolicy 的错误被忽略，允许 API 请求继续。
- `Fail` 意味着调用 ValidatingAdmissionPolicy 的错误导致准入失败并拒绝 API 请求。

请注意，`failurePolicy` 是在 `ValidatingAdmissionPolicy` 中定义的：

{{% code_sample language="yaml" file="validatingadmissionpolicy/failure-policy-ignore.yaml" %}}

<!--
### Validation Expression

`spec.validations[i].expression` represents the expression which will be evaluated by CEL.
To learn more, see the [CEL language specification](https://github.com/google/cel-spec)
CEL expressions have access to the contents of the Admission request/response, organized into CEL
variables as well as some other useful variables:
-->
### 检查表达式   {#validation-expression}

`spec.validations[i].expression` 代表将使用 CEL 来计算表达式。
要了解更多信息，请参阅 [CEL 语言规范](https://github.com/google/cel-spec)。
CEL 表达式可以访问按 CEL 变量来组织的 Admission 请求/响应的内容，以及其他一些有用的变量 :

<!--
- 'object' - The object from the incoming request. The value is null for DELETE requests.
- 'oldObject' - The existing object. The value is null for CREATE requests.
- 'request' - Attributes of the [admission request](/docs/reference/config-api/apiserver-admission.v1/#admission-k8s-io-v1-AdmissionRequest).
- 'params' - Parameter resource referred to by the policy binding being evaluated. The value is
  null if `ParamKind` is not specified.
- `authorizer` - A CEL Authorizer. May be used to perform authorization checks for the principal
  (authenticated user) of the request. See
  [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz) in the Kubernetes CEL library
  documentation for more details.
- `authorizer.requestResource` - A shortcut for an authorization check configured with the request
  resource (group, resource, (subresource), namespace, name).
-->
- 'object' - 来自传入请求的对象。对于 DELETE 请求，该值为 null。
- 'oldObject' - 现有对象。对于 CREATE 请求，该值为 null。
- 'request' - [准入请求](/zh-cn/docs/reference/config-api/apiserver-admission.v1/#admission-k8s-io-v1-AdmissionRequest)的属性。
- 'params' - 被计算的策略绑定引用的参数资源。如果未设置 `paramKind`，该值为 null。
- `authorizer` - 一个 CEL 鉴权组件。可以用来为请求的主体（经过身份验证的用户）执行鉴权检查。
  更多细节可以参考 Kubernetes CEL 库的文档中的 [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz)。
- `authorizer.requestResource` - 针对请求资源（组、资源、（子资源）、命名空间、名称）所配置的鉴权检查的快捷方式。

<!--
The `apiVersion`, `kind`, `metadata.name` and `metadata.generateName` are always accessible from
the root of the object. No other metadata properties are accessible.
-->
总是可以从对象的根访问的属性有 `apiVersion`、`kind`、`metadata.name` 和 `metadata.generateName`。
其他元数据属性不能访问。

<!--
Equality on arrays with list type of 'set' or 'map' ignores element order, i.e. [1, 2] == [2, 1].
Concatenation on arrays with x-kubernetes-list-type use the semantics of the list type:

- 'set': `X + Y` performs a union where the array positions of all elements in `X` are preserved and
  non-intersecting elements in `Y` are appended, retaining their partial order.
- 'map': `X + Y` performs a merge where the array positions of all keys in `X` are preserved but the values
  are overwritten by values in `Y` when the key sets of `X` and `Y` intersect. Elements in `Y` with
  non-intersecting keys are appended, retaining their partial order.
-->
列表类型为 "set" 或 "map" 的数组上的等价关系比较会忽略元素顺序，即 [1, 2] == [2, 1]。
使用 x-kubernetes-list-type 连接数组时使用列表类型的语义：

- 'set'：`X + Y` 执行并集，其中 `X` 中所有元素的数组位置被保留，`Y` 中不相交的元素被追加，保留其元素的偏序关系。
- 'map'：`X + Y` 执行合并，保留 `X` 中所有键的数组位置，但是当 `X` 和 `Y` 的键集相交时，其值被 `Y` 的值覆盖。
  `Y` 中键值不相交的元素被追加，保留其元素之间的偏序关系。

<!--
#### Validation expression examples
-->
#### 检查表达式示例

| 表达式                                                                                        | 目的                                                                     |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `object.minReplicas <= object.replicas && object.replicas <= object.maxReplicas`              | 检查定义副本的三个字段是否大小关系正确                                   |
| `'Available' in object.stateCounts`                                                           | 检查映射中是否存在键为 `Available` 的条目                                |
| `(size(object.list1) == 0) != (size(object.list2) == 0)`                                      | 检查两个列表是否有且只有一个非空                                         |
| <code>!('MY_KEY' in object.map1) &#124;&#124; object['MY_KEY'].matches('^[a-zA-Z]\*$')</code> | 检查映射中存在特定的键时其取值符合某规则                                 |
| `object.envars.filter(e, e.name == 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$')`           | 验证 listMap 中所有键名为 "MY_ENV" 的条目的 “value” 字段，确保其符合规则 |
| `has(object.expired) && object.created + object.ttl < object.expired`                         | 检查 expired 日期在 create 日期加上 ttl 时长之后                         |
| `object.health.startsWith('ok')`                                                              | 检查 health 字符串字段的取值有 “ok” 前缀                                 |
| `object.widgets.exists(w, w.key == 'x' && w.foo < 10)`                                        | 对于 listMap 中键为 “x” 的条目，检查该条目的 "foo" 属性的值是否小于 10   |
| `type(object) == string ? object == '100%' : object == 1000`                                  | 对于 int-or-string 字段，分别处理类型为 int 或 string 的情况             |
| `object.metadata.name.startsWith(object.prefix)`                                              | 检查对象名称是否以另一个字段值为前缀                                     |
| `object.set1.all(e, !(e in object.set2))`                                                     | 检查两个 listSet 是否不相交                                              |
| `size(object.names) == size(object.details) && object.names.all(n, n in object.details)`      | 检查映射 “details” 所有的键和 listSet “names” 中的条目是否一致           |
| `size(object.clusters.filter(c, c.name == object.primary)) == 1`                              | 检查 “primary” 字段的值在 listMap “clusters” 中只出现一次                |

<!--
Read [Supported evaluation on CEL](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#evaluation)
for more information about CEL rules.
-->
了解关于 CEL 规则的更多信息, 请阅读
[CEL 支持的求值表达式](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#evaluation)。

<!--
`spec.validation[i].reason` represents a machine-readable description of why this validation failed.
If this is the first validation in the list to fail, this reason, as well as the corresponding
HTTP response code, are used in the HTTP response to the client.
The currently supported reasons are: `Unauthorized`, `Forbidden`, `Invalid`, `RequestEntityTooLarge`.
If not set, `StatusReasonInvalid` is used in the response to the client.
-->
`spec.validation[i].reason` 表示一个机器可读的描述，说明为什么这次检查失败。
如果这是列表中第一个失败的检查，其原因以及相应的 HTTP 响应代码会被用在给客户端的 HTTP 响应中。
目前支持的原因有：`Unauthorized`、`Forbidden`、`Invalid`、`RequestEntityTooLarge`。
如果未设置，将在对客户端的响应中使用 `StatusReasonInvalid`。

<!--
### Matching requests: `matchConditions`

You can define _match conditions_ for a `ValidatingAdmissionPolicy` if you need fine-grained request filtering. These
conditions are useful if you find that match rules, `objectSelectors` and `namespaceSelectors` still
doesn't provide the filtering you want. Match conditions are
[CEL expressions](/docs/reference/using-api/cel/). All match conditions must evaluate to true for the
resource to be evaluated.
-->
### 匹配请求：`matchConditions`

如果需要进行精细的请求过滤，可以为 `ValidatingAdmissionPolicy` 定义 **匹配条件（match conditions）**。
如果发现匹配规则、`objectSelectors` 和 `namespaceSelectors` 仍无法提供所需的过滤功能，则使用这些条件非常有用。
匹配条件是 [CEL 表达式](/zh-cn/docs/reference/using-api/cel/)。
所有匹配条件必须求值为 true 时才会对资源进行评估。

<!--
Here is an example illustrating a few different uses for match conditions:
-->
以下示例说明了匹配条件的几个不同用法：

{{% code_sample file="access/validating-admission-policy-match-conditions.yaml" %}}

<!--
Match conditions have access to the same CEL variables as validation expressions.

In the event of an error evaluating a match condition the policy is not evaluated. Whether to reject
the request is determined as follows:

1. If **any** match condition evaluated to `false` (regardless of other errors), the API server skips the policy.
2. Otherwise:
   - for [`failurePolicy: Fail`](#failure-policy), reject the request (without evaluating the policy).
   - for [`failurePolicy: Ignore`](#failure-policy), proceed with the request but skip the policy.
-->
这些匹配条件可以访问与验证表达式相同的 CEL 变量。

在评估匹配条件时出现错误时，将不会评估策略。根据以下方式确定是否拒绝请求：

1. 如果**任何一个**匹配条件求值结果为 `false`（不管其他错误），API 服务器将跳过 Webhook。
2. 否则：

   - 对于 [`failurePolicy: Fail`](#failure-policy)，拒绝请求（不调用 Webhook）。
   - 对于 [`failurePolicy: Ignore`](#failure-policy)，继续处理请求但跳过 Webhook。

<!--
### Audit annotations

`auditAnnotations` may be used to include audit annotations in the audit event of the API request.

For example, here is an admission policy with an audit annotation:
-->
### 审计注解   {#audit-annotations}

`auditAnnotations` 可用于在 API 请求的审计事件中包括审计注解。

例如，以下是带有审计注解的准入策略：

{{% code_sample file="access/validating-admission-policy-audit-annotation.yaml" %}}

<!--
When an API request is validated with this admission policy, the resulting audit event will look like:
-->
当使用此准入策略验证 API 请求时，生成的审计事件将如下所示：

<!--
```
# the audit event recorded
{
    "kind": "Event",
    "apiVersion": "audit.k8s.io/v1",
    "annotations": {
        "demo-policy.example.com/high-replica-count": "Deployment spec.replicas set to 128"
        # other annotations
        ...
    }
    # other fields
    ...
}
```
-->
```
# 记录的审计事件
{
    "kind": "Event",
    "apiVersion": "audit.k8s.io/v1",
    "annotations": {
        "demo-policy.example.com/high-replica-count": "Deployment spec.replicas set to 128"
        # 其他注解
        ...
    }
    # 其他字段
    ...
}
```

<!--
In this example the annotation will only be included if the `spec.replicas` of the Deployment is more than
50, otherwise the CEL expression evaluates to null and the annotation will not be included.

Note that audit annotation keys are prefixed by the name of the `ValidatingAdmissionWebhook` and a `/`. If
another admission controller, such as an admission webhook, uses the exact same audit annotation key, the 
value of the first admission controller to include the audit annotation will be included in the audit
event and all other values will be ignored.
-->
在此示例中，只有 Deployment 的 `spec.replicas` 大于 50 时才会包含注解，
否则 CEL 表达式将求值为 null，并且不会包含注解。

请注意，审计注解键以 `ValidatingAdmissionWebhook` 的名称和 `/` 为前缀。
如果另一个准入控制器（例如准入 Webhook）使用完全相同的审计注解键，
则第一个包括审计注解值的准入控制器将出现在审计事件中，而所有其他值都将被忽略。

<!--
### Message expression

To return a more friendly message when the policy rejects a request, we can use a CEL expression
to composite a message with `spec.validations[i].messageExpression`. Similar to the validation expression,
a message expression has access to `object`, `oldObject`, `request`, and `params`. Unlike validations,
message expression must evaluate to a string.

For example, to better inform the user of the reason of denial when the policy refers to a parameter,
we can have the following validation:
-->
### 消息表达式   {#message-expression}

为了在策略拒绝请求时返回更友好的消息，我们在 `spec.validations[i].messageExpression`
中使用 CEL 表达式来构造消息。
与验证表达式类似，消息表达式可以访问 `object`、`oldObject`、`request` 和 `params`。
但是，与验证不同，消息表达式必须求值为字符串。

例如，为了在策略引用参数时更好地告知用户拒绝原因，我们可以有以下验证：

{{% code_sample file="access/deployment-replicas-policy.yaml" %}}

<!--
After creating a params object that limits the replicas to 3 and setting up the binding,
when we try to create a deployment with 5 replicas, we will receive the following message.
-->
在创建限制副本为 3 的 Params 对象并设置绑定之后，当我们尝试创建具有 5 个副本的 Deployment
时，我们将收到以下消息：

```
$ kubectl create deploy --image=nginx nginx --replicas=5
error: failed to create deployment: deployments.apps "nginx" is forbidden: ValidatingAdmissionPolicy 'deploy-replica-policy.example.com' with binding 'demo-binding-test.example.com' denied request: object.spec.replicas must be no greater than 3
```

<!--
This is more informative than a static message of "too many replicas".

The message expression takes precedence over the static message defined in `spec.validations[i].message` if both are defined.
However, if the message expression fails to evaluate, the static message will be used instead.
Additionally, if the message expression evaluates to a multi-line string,
the evaluation result will be discarded and the static message will be used if present.
Note that static message is validated against multi-line strings.
-->
这比静态消息 "too many replicas" 更具说明性。

如果既定义了消息表达式，又在 `spec.validations[i].message` 中定义了静态消息，
则消息表达式优先于静态消息。但是，如果消息表达式求值失败，则将使用静态消息。
此外，如果消息表达式求值为多行字符串，则会丢弃求值结果并使用静态消息（如果存在）。
请注意，静态消息也要检查是否存在多行字符串。

<!--
### Type checking

When a policy definition is created or updated, the validation process parses the expressions it contains
and reports any syntax errors, rejecting the definition if any errors are found. 
Afterward, the referred variables are checked for type errors, including missing fields and type confusion,
against the matched types of `spec.matchConstraints`.
The result of type checking can be retrieved from `status.typeChecking`.
The presence of `status.typeChecking` indicates the completion of type checking,
and an empty `status.typeChecking` means that no errors were detected.

For example, given the following policy definition:
-->
### 类型检查   {#type-checking}

创建或更新策略定义时，验证过程将解析它包含的表达式，在发现错误时报告语法错误并拒绝该定义。
之后，引用的变量将根据 `spec.matchConstraints` 的匹配类型检查类型错误，包括缺少字段和类型混淆。
类型检查的结果可以从 `status.typeChecking` 中获得。
`status.typeChecking` 的存在表示类型检查已完成，而空的 `status.typeChecking` 表示未发现错误。

例如，给定以下策略定义：

{{% code_sample language="yaml" file="validatingadmissionpolicy/typechecking.yaml" %}}

<!--
The status will yield the following information:
-->
status 字段将提供以下信息：

```yaml
status:
  typeChecking:
    expressionWarnings:
    - fieldRef: spec.validations[0].expression
      warning: |-
        apps/v1, Kind=Deployment: ERROR: <input>:1:7: undefined field 'replicas'
         | object.replicas > 1
         | ......^
```

<!--
If multiple resources are matched in `spec.matchConstraints`, all of matched resources will be checked against.
For example, the following policy definition
-->
如果在 `spec.matchConstraints` 中匹配了多个资源，则所有匹配的资源都将进行检查。
例如，以下策略定义：

{{% code_sample language="yaml" file="validatingadmissionpolicy/typechecking-multiple-match.yaml" %}}

<!--
will have multiple types and type checking result of each type in the warning message.
-->
将具有多个类型，并在警告消息中提供每种类型的类型检查结果。

```yaml
status:
  typeChecking:
    expressionWarnings:
    - fieldRef: spec.validations[0].expression
      warning: |-
        apps/v1, Kind=Deployment: ERROR: <input>:1:7: undefined field 'replicas'
         | object.replicas > 1
         | ......^
        apps/v1, Kind=ReplicaSet: ERROR: <input>:1:7: undefined field 'replicas'
         | object.replicas > 1
         | ......^
```
<!--
Type Checking has the following limitation:

- No wildcard matching. If `spec.matchConstraints.resourceRules` contains `"*"` in any of `apiGroups`, `apiVersions` or `resources`,
  the types that `"*"` matches will not be checked.
- The number of matched types is limited to 10. This is to prevent a policy that manually specifying too many types.
  to consume excessive computing resources. In the order of ascending group, version, and then resource, 11th combination and beyond are ignored.
- Type Checking does not affect the policy behavior in any way. Even if the type checking detects errors, the policy will continue
  to evaluate. If errors do occur during evaluate, the failure policy will decide its outcome.
- Type Checking does not apply to CRDs, including matched CRD types and reference of paramKind. The support for CRDs will come in future release.
-->
类型检查具有以下限制：

- 没有通配符匹配。
  如果 `spec.matchConstraints.resourceRules` 中的任何一个 `apiGroups`、`apiVersions`
  或 `resources` 包含 `"\*"`，则不会检查与 `"\*"` 匹配的类型。
- 匹配的类型数量最多为 10 种。这是为了防止手动指定过多类型的策略消耗过多计算资源。
  按升序处理组、版本，然后是资源，忽略第 11 个及其之后的组合。
- 类型检查不会以任何方式影响策略行为。即使类型检查检测到错误，策略也将继续评估。
  如果在评估期间出现错误，则失败策略将决定其结果。
- 类型检查不适用于 CRD（自定义资源定义），包括匹配的 CRD 类型和 paramKind 的引用。
  对 CRD 的支持将在未来发布中推出。

<!--
### Variable composition

If an expression grows too complicated, or part of the expression is reusable and computationally expensive to evaluate,
you can extract some part of the expressions into variables. A variable is a named expression that can be referred later
in `variables` in other expressions.
-->
### 变量组合   {#variable-composition}

如果表达式变得太复杂，或者表达式的一部分可重用且进行评估时计算开销较大，可以将表达式的某些部分提取为变量。
变量是一个命名表达式，后期可以在其他表达式中的 `variables` 中引用。

```yaml
spec:
  variables:
    - name: foo
      expression: "'foo' in object.spec.metadata.labels ? object.spec.metadata.labels['foo'] : 'default'"
  validations:
    - expression: variables.foo == 'bar'
```

<!--
A variable is lazily evaluated when it is first referred. Any error that occurs during the evaluation will be
reported during the evaluation of the referring expression. Both the result and potential error are memorized and
count only once towards the runtime cost.

The order of variables are important because a variable can refer to other variables that are defined before it.
This ordering prevents circular references.

The following is a more complex example of enforcing that image repo names match the environment defined in its namespace.
-->
变量在首次引用时会被延迟求值。评估期间发生的任何错误都将在评估引用表达式期间报告，
结果和可能的错误都会被记录下来，且在运行时开销中仅计为一次。

变量的顺序很重要，因为一个变量可以引用在它之前定义的其他变量。
对顺序的要求可以防止循环引用。

以下是强制镜像仓库名称与其命名空间中定义的环境相匹配的一个较复杂示例。

{{< code_sample file="access/image-matches-namespace-environment.policy.yaml" >}}

<!--
With the policy bound to the namespace `default`, which is labeled `environment: prod`,
the following attempt to create a deployment would be rejected.
-->
在此策略被绑定到 `default` 命名空间（标签为 `environment: prod`）的情况下，
以下创建 Deployment 的尝试将被拒绝。

```shell
kubectl create deploy --image=dev.example.com/nginx invalid
```

<!--
The error message is similar to this.
-->
错误信息类似于：

```console
error: failed to create deployment: deployments.apps "invalid" is forbidden: ValidatingAdmissionPolicy 'image-matches-namespace-environment.policy.example.com' with binding 'demo-binding-test.example.com' denied request: only prod images are allowed in namespace default
```
