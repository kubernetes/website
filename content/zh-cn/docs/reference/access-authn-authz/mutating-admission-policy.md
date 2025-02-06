---
title: 变更性准入策略
content_type: concept
---
<!--
reviewers:
- deads2k
- sttts
- cici37
title: Mutating Admission Policy
content_type: concept
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.32" state="alpha" >}}
<!-- due to feature gate history, use manual version specification here -->

<!--
This page provides an overview of _MutatingAdmissionPolicies_.
-->
本页概要介绍 **MutatingAdmissionPolicy（变更性准入策略）**。

<!-- body -->

<!--
## What are MutatingAdmissionPolicies?

Mutating admission policies offer a declarative, in-process alternative to mutating admission webhooks.
-->
## 什么是 MutatingAdmissionPolicy？   {#what-are-mutatingadmissionpolicies}

变更性准入策略（Mutating Admission Policy）提供了一种声明式的、进程内的方案，
可以用来替代变更性准入 Webhook。

<!--
Mutating admission policies use the Common Expression Language (CEL) to declare mutations to resources.
Mutations can be defined either with an *apply configuration* that is merged using the
[server side apply merge strategy](/docs/reference/using-api/server-side-apply/#merge-strategy),
or a [JSON patch](https://jsonpatch.com/).

Mutating admission policies are highly configurable, enabling policy authors to define policies
that can be parameterized and scoped to resources as needed by cluster administrators.
-->
变更性准入策略使用通用表达语言（Common Expression Language，CEL）来声明对资源的变更。
变更操作可以通过使用[服务器端应用合并策略](/zh-cn/docs/reference/using-api/server-side-apply/#merge-strategy)所合并的**应用配置**来定义，
也可以使用 [JSON 补丁](https://jsonpatch.com/)来定义。

变更性准入策略的可配置能力很强，策略的编写者可以根据集群管理员的需要，定义参数化的策略以及限定到某类资源的策略。

<!--
## What resources make a policy

A policy is generally made up of three resources:

- The MutatingAdmissionPolicy describes the abstract logic of a policy
  (think: "this policy sets a particular label to a particular value").
-->
## 策略包含哪些资源   {#what-resources-make-a-policy}

策略通常由三种资源组成：

- MutatingAdmissionPolicy 描述策略的抽象逻辑（可以理解为：“此策略将特定标签设置为特定值”）。

<!--
- A _parameter resource_ provides information to a MutatingAdmissionPolicy to make it a concrete
  statement (think "set the `owner` label to something like `company.example.com`").
  Parameter resources refer to Kubernetes resources, available in the Kubernetes API. They can be built-in types or extensions,
  such as a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} (CRD). For example, you can use a ConfigMap as a parameter.
- A MutatingAdmissionPolicyBinding links the above (MutatingAdmissionPolicy and parameter) resources together and provides scoping.
  If you only want to set an `owner` label for `Pods`, and not other API kinds, the binding is where you
  specify this mutation.
-->
- 为 MutatingAdmissionPolicy 提供信息的一个**参数资源（parameter resource）**，
  有了参数之后，策略成为一条具体的语句
 （假想：“将 `owner` 标签设置为类似 `company.example.com` 的值”）。
  参数资源引用 Kubernetes API 中可用的 Kubernetes 某种资源。被引用的资源可以是内置类别或类似
  {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}（CRD）这种扩展资源。
  例如，你可以使用 ConfigMap 作为参数。

- MutatingAdmissionPolicyBinding 将上述两种资源（MutatingAdmissionPolicy 和参数）关联在一起，
  并提供作用域限定。如果你只想为 `Pods` 设置 `owner` 标签，而不想为其他 API 类别设置标签，
  则绑定就是你用来限定此变更的地方。

<!--
At least a MutatingAdmissionPolicy and a corresponding MutatingAdmissionPolicyBinding
must be defined for a policy to have an effect.

If a MutatingAdmissionPolicy does not need to be configured via parameters, simply leave
`spec.paramKind` in  MutatingAdmissionPolicy not specified.
-->
你必须定义至少一个 MutatingAdmissionPolicy 和一个相应的 MutatingAdmissionPolicyBinding，
才能使策略生效。

如果 MutatingAdmissionPolicy 不需要通过参数进行配置，在
MutatingAdmissionPolicy 中不指定 `spec.paramKind` 即可。

<!--
## Getting Started with MutatingAdmissionPolicies

Mutating admission policy is part of the cluster control-plane. You should write
and deploy them with great caution. The following describes how to quickly
experiment with Mutating admission policy.
-->
## 开始使用 MutatingAdmissionPolicy   {#getting-started-with-mutatingadmissionpolicies}

变更性准入策略是集群控制平面的一部分。你在编写和部署这些策略时要非常谨慎。
下文描述如何快速试用变更性准入策略。

<!--
### Create a MutatingAdmissionPolicy

The following is an example of a MutatingAdmissionPolicy. This policy mutates newly created Pods to have a sidecar container if it does not exist.
-->
### 创建 MutatingAdmissionPolicy   {#create-a-mutatingadmissionpolicy}

以下是一个 MutatingAdmissionPolicy 的示例。
此策略会将变更新建的 Pod，为其添加一个边车容器（如果以前没有边车容器的话）。

{{% code_sample language="yaml" file="mutatingadmissionpolicy/applyconfiguration-example.yaml" %}}

<!--
The `.spec.mutations` field consists of a list of expressions that evaluate to resource patches.
The emitted patches may be either [apply configurations](#patch-type-apply-configuration) or [JSON Patch](#patch-type-json-patch)
patches. You cannot specify an empty list of mutations. After evaluating all the
expressions, the API server applies those changes to the resource that is
passing through admission.
-->
`.spec.mutations` 字段由一系列表达式组成，这些表达式求值后将形成资源补丁。
所生成的补丁可以是[应用配置](#patch-type-apply-configuration)或 [JSON 补丁](#patch-type-json-patch)。
你不能将 mutations 设置为空列表。在对所有表达式求值后，API 服务器将所得到的变更应用到正在通过准入阶段的资源。

<!--
To configure a mutating admission policy for use in a cluster, a binding is
required. The MutatingAdmissionPolicy will only be active if a corresponding
binding exists with the referenced `spec.policyName` matching the `spec.name` of
a policy.

Once the binding and policy are created, any resource request that matches the
`spec.matchConditions` of a policy will trigger the set of mutations defined.

In the example above, creating a Pod will add the `mesh-proxy` initContainer mutation:
-->
要配置变更准入策略以便用于某个集群中，需要先创建绑定。
只有存在 `spec.policyName` 字段值与某策略的 `spec.name` 相匹配的绑定时，该策略才会生效。

一旦创建了绑定和策略，策略的 `spec.matchConditions` 相匹配的所有资源请求都会触发已定义的所有变更集合。

在上面的示例中，创建 Pod 将触发添加 `mesh-proxy` initContainer 这一变更：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
  namespace: default
spec:
  ...
  initContainers:
  - name: mesh-proxy
    image: mesh/proxy:v1.0.0
    args: ["proxy", "sidecar"]
    restartPolicy: Always
  - name: myapp-initializer
    image: example/initializer:v1.0.0
  ...
```

<!--
#### Parameter resources

Parameter resources allow a policy configuration to be separate from its
definition. A policy can define `paramKind`, which outlines GVK of the parameter
resource, and then a policy binding ties a policy by name (via `policyName`) to a
particular parameter resource via `paramRef`.

Please refer to [parameter resources](/docs/reference/access-authn-authz/validating-admission-policy/#parameter-resources) for more information.
-->
#### 参数资源   {#parameter-resources}

使用参数资源，我们可以将策略配置与其定义分隔开。策略可以定义 `paramKind`，划定参数资源的 GVK，
随后的策略绑定操作会通过 `paramRef` 按名称（通过 `policyName`）将某个策略绑定到特定参数资源。

有关细节参阅[参数资源](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/#parameter-resources)。

#### `ApplyConfiguration` {#patch-type-apply-configuration}

<!--
MutatingAdmissionPolicy expressions are always CEL. Each apply configuration
`expression` must evaluate to a CEL object (declared using `Object()`
initialization).

Apply configurations may not modify atomic structs, maps or arrays due to the risk of accidental deletion of
values not included in the apply configuration.
-->
MutatingAdmissionPolicy 表达式始终是 CEL 格式的。
每个应用配置 `expression` 必须求值为（使用 `Object()` 初始化声明的）CEL 对象。

这些应用配置不能修改原子结构、映射或数组，因为这类修改可能导致意外删除未包含在应用配置中的值。

<!--
CEL expressions have access to the object types needed to create apply configurations:

- `Object` - CEL type of the resource object.
- `Object.<fieldName>` - CEL type of object field (such as `Object.spec`)
- `Object.<fieldName1>.<fieldName2>...<fieldNameN>` - CEL type of nested field (such as `Object.spec.containers`)
-->
CEL 表达式可以访问以 CEL 变量组织起来的 API 请求内容及一些其他有用变量：

- `Object` - 资源对象的 CEL 类型。
- `Object.<fieldName>` - 对象字段的 CEL 类型（例如 `Object.spec`）
- `Object.<fieldName1>.<fieldName2>...<fieldNameN>` - 嵌套字段的 CEL 类型（例如 `Object.spec.containers`）

<!--
CEL expressions have access to the contents of the API request, organized into CEL variables as well as some other useful variables:

- `object` - The object from the incoming request. The value is null for DELETE requests.
- `oldObject` - The existing object. The value is null for CREATE requests.
- `request` - Attributes of the API request.
- `params` - Parameter resource referred to by the policy binding being evaluated. Only populated if the policy has a ParamKind.
-->
CEL 表达式可以访问以 CEL 变量组织起来的 API 请求内容及一些其他有用变量：

- `object` - 来自传入请求的对象。对于 DELETE 请求，取值为 null。
- `oldObject` - 现有对象。对于 CREATE 请求，取值为 null。
- `request` - API 请求的属性。
- `params` - 正被评估的策略绑定所引用到的参数资源。仅在策略设置了 `paramKind` 时填充。
<!--
- `namespaceObject` - The namespace object that the incoming object belongs to. The value is null for cluster-scoped resources.
- `variables` - Map of composited variables, from its name to its lazily evaluated value.
  For example, a variable named `foo` can be accessed as `variables.foo`.
- `authorizer` - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.
  See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
- `authorizer.requestResource` - A CEL ResourceCheck constructed from the `authorizer` and configured with the
  request resource.
-->
- `namespaceObject` - 传入对象所属的命名空间对象。对于集群范围的资源，取值为 null。
- `variables` - 组合变量的映射，包含从变量名称到其惰性评估值的映射。
  例如，名为 `foo` 的变量可以以 `variables.foo` 的方式访问。
- `authorizer` - 一个 CEL 鉴权器。可用于对请求的主体（用户或服务账户）进行鉴权检查。
  参阅 https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
- `authorizer.requestResource` - 从 `authorizer` 构建并使用请求资源配置的 CEL ResourceCheck。

<!--
The `apiVersion`, `kind`, `metadata.name`, `metadata.generateName` and `metadata.labels` are always accessible from the root of the  
object. No other metadata properties are accessible.
-->
`apiVersion`、`kind`、`metadata.name`、`metadata.generateName` 和 `metadata.labels`
始终可以从对象的根进行访问。其他元数据属性不可访问。

#### `JSONPatch` {#patch-type-json-patch}

<!--
The same mutation can be written as a [JSON Patch](https://jsonpatch.com/) as follows:
-->
相同的变更可以被写成以下的 [JSON 补丁](https://jsonpatch.com/)：

{{% code_sample language="yaml" file="mutatingadmissionpolicy/json-patch-example.yaml" %}}

<!--
The expression will be evaluated by CEL to create a [JSON patch](https://jsonpatch.com/).
ref: https://github.com/google/cel-spec

Each evaluated `expression` must return an array of `JSONPatch` values. The  
`JSONPatch` type represents one operation from a JSON patch.

For example, this CEL expression returns a JSON patch to conditionally modify a value:
-->
表达式将通过 CEL 求值，以创建 [JSON 补丁](https://jsonpatch.com/)。
参阅 https://github.com/google/cel-spec

每个被求值的 `expression` 必须返回 `JSONPatch` 值形成的数组。
`JSONPatch` 类型表示 JSON 补丁中的一个操作。

例如，下面的 CEL 表达式返回 JSON 补丁，用于有条件地修改某个值：

```
  [
    JSONPatch{op: "test", path: "/spec/example", value: "Red"},
    JSONPatch{op: "replace", path: "/spec/example", value: "Green"}
  ]
```

<!--
To define a JSON object for the patch operation `value`, use CEL `Object` types. For example:
-->
要为补丁操作 `value` 定义 JSON 对象，可以使用 CEL `Object` 类型。例如：

```
  [
    JSONPatch{
      op: "add",
      path: "/spec/selector",
      value: Object.spec.selector{matchLabels: {"environment": "test"}}
    }
  ]
```

<!--
To use strings containing '/' and '~' as JSONPatch path keys, use `jsonpatch.escapeKey()`. For example:
-->
要使用包含 '/' 和 '~' 的字符串作为 JSONPatch 路径键，可以使用 `jsonpatch.escapeKey()`。例如：

```
  [
    JSONPatch{
      op: "add",
      path: "/metadata/labels/" + jsonpatch.escapeKey("example.com/environment"),
      value: "test"
    },
  ]
```

<!--
CEL expressions have access to the types needed to create JSON patches and objects:

- `JSONPatch` - CEL type of JSON Patch operations. JSONPatch has the fields `op`, `from`, `path` and `value`.
  See [JSON patch](https://jsonpatch.com/) for more details. The `value` field may be set to any of: string,
  integer, array, map or object.  If set, the `path` and `from` fields must be set to a
  [JSON pointer](https://datatracker.ietf.org/doc/html/rfc6901/) string, where the `jsonpatch.escapeKey()` CEL
  function may be used to escape path keys containing `/` and `~`.
-->
CEL 表达式可以访问创建 JSON 补丁和对象所需的类型：

- `JSONPatch` - JSON 补丁操作的 CEL 类型。JSONPatch 具有 `op`、`from`、`path` 和 `value` 字段。
  有关细节参阅 [JSON 补丁](https://jsonpatch.com/)。
  `value` 字段可以设置为字符串、整数、数组、映射或对象。
  如果设置，`path` 和 `from` 字段的值必须为
  [JSON 指针](https://datatracker.ietf.org/doc/html/rfc6901/)字符串，
  可以在指针中使用 `jsonpatch.escapeKey()` CEL 函数来转义包含 `/` 和 `~` 的路径键。
<!--
- `Object` - CEL type of the resource object.
- `Object.<fieldName>` - CEL type of object field (such as `Object.spec`)
- `Object.<fieldName1>.<fieldName2>...<fieldNameN>` - CEL type of nested field (such as `Object.spec.containers`)
-->
- `Object` - 资源对象的 CEL 类型。
- `Object.<fieldName>` - 对象字段的 CEL 类型（例如 `Object.spec`）
- `Object.<fieldName1>.<fieldName2>...<fieldNameN>` - 嵌套字段的 CEL 类型（例如 `Object.spec.containers`）

<!--
CEL expressions have access to the contents of the API request, organized into CEL variables as well as some other useful variables:

- `object` - The object from the incoming request. The value is null for DELETE requests.
- `oldObject` - The existing object. The value is null for CREATE requests.
- `request` - Attributes of the API request.
- `params` - Parameter resource referred to by the policy binding being evaluated. Only populated if the policy has a ParamKind.
-->
CEL 表达式可以访问以 CEL 变量组织的 API 请求的内容及一些其他有用变量：

- `object` - 来自传入请求的对象。对于 DELETE 请求，取值为 null。
- `oldObject` - 现有对象。对于 CREATE 请求，取值为 null。
- `request` - API 请求的属性。
- `params` - 正被评估的策略绑定所引用的参数资源。仅在策略具有 `paramKind` 时填充。
<!--
- `namespaceObject` - The namespace object that the incoming object belongs to. The value is null for cluster-scoped resources.
- `variables` - Map of composited variables, from its name to its lazily evaluated value.
  For example, a variable named `foo` can be accessed as `variables.foo`.
- `authorizer` - A CEL Authorizer. May be used to perform authorization checks for the principal (user or service account) of the request.
  See https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
- `authorizer.requestResource` - A CEL ResourceCheck constructed from the `authorizer` and configured with the
  request resource.
-->
- `namespaceObject` - 传入对象所属的命名空间对象。对于集群范围的资源，取值为 null。
- `variables` - 组合变量的映射，包含从变量名称到其惰性评估值的映射。
  例如，名为 `foo` 的变量可以以 `variables.foo` 的形式访问。
- `authorizer` - 一个 CEL 鉴权组件。可用于对请求的主体（用户或服务账户）执行鉴权检查。
  参阅 https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz
- `authorizer.requestResource` - 从 `authorizer` 构建并以请求资源配置的 CEL ResourceCheck。

<!--
CEL expressions have access to [Kubernetes CEL function libraries](/docs/reference/using-api/cel/#cel-options-language-features-and-libraries)
as well as:

- `jsonpatch.escapeKey` - Performs JSONPatch key escaping. `~` and  `/` are escaped as `~0` and `~1` respectively.

Only property names of the form `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible.
-->
CEL 表达式可以访问
[Kubernetes CEL 函数库](/zh-cn/docs/reference/using-api/cel/#cel-options-language-features-and-libraries)以及：

- `jsonpatch.escapeKey` - 执行 JSONPatch 键转义。`~` 和 `/` 分别被转义为 `~0` 和 `~1`。

只有格式为 `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` 的属性名称是可访问的。
