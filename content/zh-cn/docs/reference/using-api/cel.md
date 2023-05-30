---
title: Kubernetes 中的通用表达式语言
content_type: concept
weight: 35
min-kubernetes-server-version: 1.25
---
<!--
title: Common Expression Language in Kubernetes
reviewers:
- jpbetz
- cici37
content_type: concept
weight: 35
min-kubernetes-server-version: 1.25
-->

<!-- overview -->

<!--
The [Common Expression Language (CEL)](https://github.com/google/cel-go) is used
in the Kubernetes API to declare validation rules, policy rules, and other
constraints or conditions.

CEL expressions are evaluated directly in the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}, making CEL a
convenient alternative to out-of-process mechanisms, such as webhooks, for many
extensibility use cases. Your CEL expressions continue to execute so long as the
control plane's API server component remains available.
-->
[通用表达式语言 (Common Expression Language, CEL)](https://github.com/google/cel-go)
用于声明 Kubernetes API 的验证规则、策略规则和其他限制或条件。

CEL 表达式在{{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}中直接进行评估，
这使得 CEL 成为许多可扩展性用例的便捷替代方案，而无需使用类似 Webhook 这种进程外机制。
只要控制平面的 API 服务器组件保持可用状态，你的 CEL 表达式就会继续执行。

<!-- body -->

<!--
## Language overview

The [CEL
language](https://github.com/google/cel-spec/blob/master/doc/langdef.md) has a
straightforward syntax that is similar to the expressions in C, C++, Java,
JavaScript and Go.

CEL was designed to be embedded into applications. Each CEL "program" is a
single expression that evaluates to a single value. CEL expressions are
typically short "one-liners" that inline well into the string fields of Kubernetes
API resources.
-->
## 语言概述 {#language-overview}

[CEL 语言](https://github.com/google/cel-spec/blob/master/doc/langdef.md)的语法直观简单，
类似于 C、C++、Java、JavaScript 和 Go 中的表达式。

CEL 的设计目的是嵌入应用程序中。每个 CEL "程序" 都是一个单独的表达式，其评估结果为单个值。
CEL 表达式通常是短小的 "一行式"，可以轻松嵌入到 Kubernetes API 资源的字符串字段中。

<!--
Inputs to a CEL program are "variables". Each Kubernetes API field that contains
CEL declares in the API documentation which variables are available to use for
that field. For example, in the `x-kubernetes-validations[i].rules` field of
CustomResourceDefinitions, the `self` and `oldSelf` variables are available and
refer to the previous and current state of the custom resource data to be
validated by the CEL expression. Other Kubernetes API fields may declare
different variables. See the API documentation of the API fields to learn which
variables are available for that field.
-->
对 CEL 程序的输入是各种 “变量”。包含 CEL 的每个 Kubernetes API 字段都在 API
文档中声明了字段可使用哪些变量。例如，在 CustomResourceDefinitions 的
`x-kubernetes-validations[i].rules` 字段中，`self` 和 `oldSelf` 变量可用，
并且分别指代要由 CEL 表达式验证的自定义资源数据的前一个状态和当前状态。
其他 Kubernetes API 字段可能声明不同的变量。请查阅 API 字段的 API 文档以了解该字段可使用哪些变量。

<!--
Example CEL expressions:
-->
CEL 表达式示例：

<!--
{{< table caption="Examples of CEL expressions and the purpose of each" >}}
| Rule                                                                               | Purpose                                                                           |
|------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| `self.minReplicas <= self.replicas && self.replicas <= self.maxReplicas`           | Validate that the three fields defining replicas are ordered appropriately        |
| `'Available' in self.stateCounts`                                                  | Validate that an entry with the 'Available' key exists in a map                   |
| `(self.list1.size() == 0) != (self.list2.size() == 0)`                             | Validate that one of two lists is non-empty, but not both                         |
| `self.envars.filter(e, e.name = 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$')`   | Validate the 'value' field of a listMap entry where key field 'name' is 'MY_ENV'  |
| `has(self.expired) && self.created + self.ttl < self.expired`                      | Validate that 'expired' date is after a 'create' date plus a 'ttl' duration       |
| `self.health.startsWith('ok')`                                                     | Validate a 'health' string field has the prefix 'ok'                              |
| `self.widgets.exists(w, w.key == 'x' && w.foo < 10)`                               | Validate that the 'foo' property of a listMap item with a key 'x' is less than 10 |
| `type(self) == string ? self == '99%' : self == 42`                                | Validate an int-or-string field for both the int and string cases                 |
| `self.metadata.name == 'singleton'`                                                | Validate that an object's name matches a specific value (making it a singleton)   |
| `self.set1.all(e, !(e in self.set2))`                                              | Validate that two listSets are disjoint                                           |
| `self.names.size() == self.details.size() && self.names.all(n, n in self.details)` | Validate the 'details' map is keyed by the items in the 'names' listSet           |
{{< /table >}}
-->
{{< table caption="CEL 表达式例子和每个表达式的用途" >}}
| 规则 | 用途 |
|---------------------------------------------------------------------------|--------------------------------------------------------------|
| `self.minReplicas <= self.replicas && self.replicas <= self.maxReplicas`  | 验证定义副本的三个字段被正确排序                                   |
| `'Available' in self.stateCounts`                                         | 验证映射中存在主键为 'Available' 的条目                           |
| `(self.list1.size() == 0) != (self.list2.size() == 0)`                    | 验证两个列表中有一个非空，但不是两个都非空                           |
| `self.envars.filter(e, e.name = 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$')` | 验证 listMap 条目的 'value' 字段，其主键字段 'name' 是 'MY_ENV' |
| `has(self.expired) && self.created + self.ttl < self.expired`             | 验证 'expired' 日期在 'create' 日期加上 'ttl' 持续时间之后         |
| `self.health.startsWith('ok')`                                            | 验证 'health' 字符串字段具有前缀 'ok'                             |
| `self.widgets.exists(w, w.key == 'x' && w.foo < 10)`                      | 验证具有键 'x' 的 listMap 项的 'foo' 属性小于 10                  |
| `type(self) == string ? self == '99%' : self == 42`                       | 验证 int-or-string 字段是否同时具备 int 和 string 的属性           |
| `self.metadata.name == 'singleton'`                                       | 验证某对象的名称与特定的值匹配（使其成为一个特例）                     |
| `self.set1.all(e, !(e in self.set2))`                                     | 验证两个 listSet 不相交                                          |
| `self.names.size() == self.details.size() && self.names.all(n, n in self.details)` | 验证 'details' 映射是由 'names' listSet 中的各项键入的 |
{{< /table >}}

<!--
## CEL community libraries

Kubernetes CEL expressions have access to the following CEL community libraries:
-->
## CEL 社区库 {#cel-community-libraries}

Kubernetes CEL 表达式能够访问以下 CEL 社区库：

<!--
- CEL standard functions, defined in the [list of standard definitions](https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions)
- CEL standard [macros](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros)
- CEL [extended string function library](https://pkg.go.dev/github.com/google/cel-go/ext#Strings)
-->
- [标准定义列表](https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions)中定义的
  CEL 标准函数
- CEL 标准[宏](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros)
- CEL [扩展字符串函数库](https://pkg.go.dev/github.com/google/cel-go/ext#Strings)

<!--
## Kubernetes CEL libraries

In additional to the CEL community libraries, Kubernetes includes CEL libraries
that are available everywhere CEL is used in Kubernetes.
-->
## Kubernetes CEL 库 {#kubernetes-cel-libraries}

除了 CEL 社区库之外，Kubernetes 还包括在 Kubernetes 中使用 CEL 时所有可用的 CEL 库。

<!--
### Kubernetes list library

The list library includes `indexOf` and `lastIndexOf`, which work similar to the
strings functions of the same names. These functions either the first or last
positional index of the provided element in the list.

The list library also includes `min`, `max` and `sum`. Sum is supported on all
number types as well as the duration type. Min and max are supported on all
comparable types.
-->
### Kubernetes 列表库 {#kubernetes-list-library}

列表库包括 `indexOf` 和 `lastIndexOf`，这两个函数的功能类似于同名的字符串函数。
这些函数返回提供的元素在列表中的第一个或最后一个位置索引。

列表库还包括 `min`、`max` 和 `sum`。
`sum` 可以用于所有数字类型以及持续时间类型。
`min` 和 `max` 可用于所有可比较的类型。

<!--
`isSorted` is also provided as a convenience function and is supported on all
comparable types.

Examples:
-->
`isSorted` 也作为一个便捷的函数提供，并且支持所有可比较的类型。

例如：

<!--
{{< table caption="Examples of CEL expressions using list library functions" >}}
| CEL Expression                                                                     | Purpose                                                   |
|------------------------------------------------------------------------------------|-----------------------------------------------------------|
| `names.isSorted()`                                                                 | Verify that a list of names is kept in alphabetical order |
| `items.map(x, x.weight).sum() == 1.0`                                              | Verify that the "weights" of a list of objects sum to 1.0 |
| `lowPriorities.map(x, x.priority).max() < highPriorities.map(x, x.priority).min()` | Verify that two sets of priorities do not overlap         |
| `names.indexOf('should-be-first') == 1`                                            | Require that the first name in a list if a specific value |
{{< /table >}}
-->
{{< table caption="使用列表库函数的 CEL 表达式例子" >}}
| CEL 表达式                                                                          | 用途 |
|------------------------------------------------------------------------------------|-----------------------------------|
| `names.isSorted()`                                                                 | 验证名称列表是否按字母顺序排列         |
| `items.map(x, x.weight).sum() == 1.0`                                              | 验证对象列表的 “weight” 总和为 1.0   |
| `lowPriorities.map(x, x.priority).max() < highPriorities.map(x, x.priority).min()` | 验证两组优先级不重叠                 |
| `names.indexOf('should-be-first') == 1`                                            | 如果是特定值，则使用列表中的第一个名称  |

<!--
See the [Kubernetes List Library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Lists)
godoc for more information.
-->
更多信息请查阅 Go 文档：
[Kubernetes 列表库](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Lists)。
{{< /table >}}

<!--
### Kubernetes regex library

In addition to the `matches` function provided by the CEL standard library, the
regex library provides `find` and `findAll`, enabling a much wider range of
regex operations.

Examples:
-->
### Kubernetes 正则表达式库 {#kubernete-regex-library}

除了 CEL 标准库提供的 `matches` 函数外，正则表达式库还提供了 `find` 和 `findAll`，
使得更多种类的正则表达式运算成为可能。

例如：

<!--
{{< table caption="Examples of CEL expressions using regex library functions" >}}
| CEL Expression                                              | Purpose                                                  |
|-------------------------------------------------------------|----------------------------------------------------------|
| `"abc 123".find('[0-9]*')`                                  | Find the first number in a string                        |
| `"1, 2, 3, 4".findAll('[0-9]*').map(x, int(x)).sum() < 100` | Verify that the numbers in a string sum to less than 100 |
{{< /table >}}
-->
{{< table caption="使用正则表达式库函数的 CEL 表达式例子" >}}
| CEL 表达式                                                   | 用途                       |
|-------------------------------------------------------------|----------------------------|
| `"abc 123".find('[0-9]*')`                                  | 找到字符串中的第一个数字       |
| `"1, 2, 3, 4".findAll('[0-9]*').map(x, int(x)).sum() < 100` | 验证字符串中的数字之和小于 100 |
{{< /table >}}

<!--
See the [Kubernetes regex library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Regex)
godoc for more information.
-->
更多信息请查阅 Go 文档：
[Kubernetes 正则表达式库](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Regex)。

<!--
### Kubernetes URL library

To make it easier and safer to process URLs, the following functions have been added:

- `isURL(string)` checks if a string is a valid URL according to the [Go's
  net/url](https://pkg.go.dev/net/url#URL) package. The string must be an
  absolute URL.
- `url(string) URL` converts a string to a URL or results in an error if the
  string is not a valid URL.
-->
### Kubernetes URL 库 {#kubernetes-url-library}

为了更轻松、更安全地处理 URL，添加了以下函数：

- `isURL(string)` 按照
  [Go 的 net/url](https://pkg.go.dev/net/url#URL)
  检查字符串是否是一个有效的 URL。该字符串必须是一个绝对 URL。
- `url(string) URL` 将字符串转换为 URL，如果字符串不是一个有效的 URL，则返回错误。

<!--
Once parsed via the `url` function, the resulting URL object has `getScheme`,
`getHost`, `getHostname`, `getPort`, `getEscapedPath` and `getQuery` accessors.

Examples:
-->
一旦通过 `url` 函数解析，所得到的 URL 对象就具有
`getScheme`、`getHost`、`getHostname`、`getPort`、`getEscapedPath` 和 `getQuery` 访问器。

例如：

<!--
{{< table caption="Examples of CEL expressions using URL library functions" >}}
| CEL Expression                                                  | Purpose                                        |
|-----------------------------------------------------------------|------------------------------------------------|
| `url('https://example.com:80/').getHost()`                      | Get the 'example.com:80' host part of the URL. |
| `url('https://example.com/path with spaces/').getEscapedPath()` | Returns '/path%20with%20spaces/'               |
{{< /table >}}
-->
{{< table caption="使用 URL 库函数的 CEL 表达式例子" >}}
| CEL 表达式                                                       | 用途                                |
|-----------------------------------------------------------------|------------------------------------|
| `url('https://example.com:80/').getHost()`                      | 获取 URL 的 'example.com:80' 主机部分 |
| `url('https://example.com/path with spaces/').getEscapedPath()` | 返回 '/path%20with%20spaces/'       |
{{< /table >}}

<!--
See the [Kubernetes URL library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#URLs)
godoc for more information.
-->
更多信息请查阅 Go 文档：
[Kubernetes URL 库](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#URLs)。

<!--
### Kubernetes authorizer library

For CEL expressions in the API where a variable of type `Authorizer` is available,
the authorizer may be used to perform authorization checks for the principal
(authenticated user) of the request.

API resource checks are performed as follows:
-->
### Kubernetes 鉴权组件库

在 API 中使用 CEL 表达式，可以使用类型为 `Authorizer` 的变量，
这个鉴权组件可用于对请求的主体（已认证用户）执行鉴权检查。

API 资源检查的过程如下：

<!--
1. Specify the group and resource to check: `Authorizer.group(string).resource(string) ResourceCheck`
2. Optionally call any combination of the following builder functions to further narrow the authorization check.
   Note that these functions return the receiver type and can be chained:
  - `ResourceCheck.subresource(string) ResourceCheck`
  - `ResourceCheck.namespace(string) ResourceCheck`
  - `ResourceCheck.name(string) ResourceCheck` 
3. Call `ResourceCheck.check(verb string) Decision` to perform the authorization check.
4. Call `allowed() bool` or `reason() string` to inspect the result of the authorization check.
-->
1. 指定要检查的组和资源：`Authorizer.group(string).resource(string) ResourceCheck`
2. 可以调用以下任意组合的构建器函数（Builder Function），以进一步缩小鉴权检查范围。
   注意这些函数将返回接收者的类型，并且可以串接起来：
   - `ResourceCheck.subresource(string) ResourceCheck`
   - `ResourceCheck.namespace(string) ResourceCheck`
   - `ResourceCheck.name(string) ResourceCheck` 
3. 调用 `ResourceCheck.check(verb string) Decision` 来执行鉴权检查。
4. 调用 `allowed() bool` 或 `reason() string` 来查验鉴权检查的结果。

<!--
Non-resource authorization performed are used as follows:

1. specify only a path: `Authorizer.path(string) PathCheck`
1. Call `PathCheck.check(httpVerb string) Decision` to perform the authorization check.
1. Call `allowed() bool` or `reason() string` to inspect the result of the authorization check.
-->
对非资源访问的鉴权过程如下：

1. 仅指定路径：`Authorizer.path(string) PathCheck`
1. 调用 `PathCheck.check(httpVerb string) Decision` 来执行鉴权检查。
1. 调用 `allowed() bool` 或 `reason() string` 来查验鉴权检查的结果。

<!--
To perform an authorization check for a service account:
-->
对于服务账号执行鉴权检查的方式：

- `Authorizer.serviceAccount(namespace string, name string) Authorizer`

<!--
{{< table caption="Examples of CEL expressions using URL library functions" >}}
| CEL Expression                                                                                               | Purpose                                        |
|--------------------------------------------------------------------------------------------------------------|------------------------------------------------|
| `authorizer.group('').resource('pods').namespace('default').check('create').allowed()`                       | Returns true if the principal (user or service account) is allowed create pods in the 'default' namespace. |
| `authorizer.path('/healthz').check('get').allowed()`                                                         | Checks if the principal (user or service account) is authorized to make HTTP GET requests to the /healthz API path. |
| `authorizer.serviceAccount('default', 'myserviceaccount').resource('deployments').check('delete').allowed()` | Checks if the service account is authorized to delete deployments. |
{{< /table >}}
-->
{{< table caption="使用 URL 库函数的 CEL 表达式示例" >}}
| CEL 表达式                                       | 用途                                           |
|-------------------------------------------------|------------------------------------------------|
| `authorizer.group('').resource('pods').namespace('default').check('create').allowed()`  | 如果主体（用户或服务账号）被允许在 `default` 名字空间中创建 Pod，返回 true。 |
| `authorizer.path('/healthz').check('get').allowed()`   | 检查主体（用户或服务账号）是否有权限向 /healthz API 路径发出 HTTP GET 请求。 |
| `authorizer.serviceAccount('default', 'myserviceaccount').resource('deployments').check('delete').allowed()` | 检查服务账号是否有权限删除 Deployment。 |
{{< /table >}}

<!--
See the [Kubernetes Authz library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz)
godoc for more information.
-->
更多信息请参阅 Go 文档：
[Kubernetes Authz library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz)。

<!--
## Type checking

CEL is a [gradually typed language](https://github.com/google/cel-spec/blob/master/doc/langdef.md#gradual-type-checking).

Some Kubernetes API fields contain fully type checked CEL expressions. For
example, [CustomResourceDefinitions Validation
Rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
are fully type checked.
-->
## 类型检查 {#type-checking}

CEL 是一种[逐渐类型化的语言](https://github.com/google/cel-spec/blob/master/doc/langdef.md#gradual-type-checking)。

一些 Kubernetes API 字段包含完全经过类型检查的 CEL 表达式。
例如，[CustomResourceDefinitions 验证规则](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)就是完全经过类型检查的。

<!--
Some Kubernetes API fields contain partially type checked CEL expressions. A
partially type checked expression is an experessions where some of the variables
are statically typed but others are dynamically typed. For example, in the CEL
expressions of
[ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/)
the `request` variable is typed, but the `object` variable is dynamically typed.
As a result, an expression containing `request.namex` would fail type checking
because the `namex` field is not defined. However, `object.namex` would pass
type checking even when the `namex` field is not defined for the resource kinds
that `object` refers to, because `object` is dynamically typed.
-->
一些 Kubernetes API 字段包含部分经过类型检查的 CEL 表达式。
部分经过类型检查的表达式是指一些变量是静态类型，而另一些变量是动态类型的表达式。
例如在 [ValidatingAdmissionPolicies](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)
的 CEL 表达式中，`request` 变量是有类型的，但 `object` 变量是动态类型的。
因此，包含 `request.namex` 的表达式将无法通过类型检查，因为 `namex` 字段未定义。
然而，即使对于 `object` 所引用的资源种类没有定义 `namex` 字段，
`object.namex` 也会通过类型检查，因为 `object` 是动态类型。

<!--
The `has()` macro in CEL may be used in CEL expressions to check if a field of a
dynamically typed variable is accessible before attempting to access the field's
value. For example:
-->
在 CEL 中，`has()` 宏可用于检查动态类型变量的字段是否可访问，然后再尝试访问该字段的值。
例如：

```cel
has(object.namex) ? object.namex == 'special' : request.name == 'special'
```

<!--
## Type system integration
-->
## 类型系统集成 {#type-system-integration}

<!--
{{< table caption="Table showing the relationship between OpenAPIv3 types and CEL types" >}}
| OpenAPIv3 type                                     | CEL type                                                                                                                     |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| 'object' with Properties                           | object / "message type" (`type(<object>)` evaluates to `selfType<uniqueNumber>.path.to.object.from.self`                     |
| 'object' with AdditionalProperties                 | map                                                                                                                          |
| 'object' with x-kubernetes-embedded-type           | object / "message type", 'apiVersion', 'kind', 'metadata.name' and 'metadata.generateName' are implicitly included in schema |
| 'object' with x-kubernetes-preserve-unknown-fields | object / "message type", unknown fields are NOT accessible in CEL expression                                                 |
| x-kubernetes-int-or-string                         | union of int or string,  `self.intOrString < 100 \|\| self.intOrString == '50%'` evaluates to true for both `50` and `"50%"` |
| 'array                                             | list                                                                                                                         |
| 'array' with x-kubernetes-list-type=map            | list with map based Equality & unique key guarantees                                                                         |
| 'array' with x-kubernetes-list-type=set            | list with set based Equality & unique entry guarantees                                                                       |
| 'boolean'                                          | boolean                                                                                                                      |
| 'number' (all formats)                             | double                                                                                                                       |
| 'integer' (all formats)                            | int (64)                                                                                                                     |
| _no equivalent_                                    | uint (64)                                                                                                                    |
| 'null'                                             | null_type                                                                                                                    |
| 'string'                                           | string                                                                                                                       |
| 'string' with format=byte (base64 encoded)         | bytes                                                                                                                        |
| 'string' with format=date                          | timestamp (google.protobuf.Timestamp)                                                                                        |
| 'string' with format=datetime                      | timestamp (google.protobuf.Timestamp)                                                                                        |
| 'string' with format=duration                      | duration (google.protobuf.Duration)                                                                                          |
{{< /table >}}
-->
{{< table caption="表格显示了 OpenAPIv3 类型和 CEL 类型之间的关系" >}}
| OpenAPIv3 类型                                      | CEL 类型                                                                                          |
|----------------------------------------------------|---------------------------------------------------------------------------------------------------|
| 设置了 properties 的 'object'                       | object / "message type" (`type(<object>)` 评估为 `selfType<uniqueNumber>.path.to.object.from.self` |
| 设置了 AdditionalProperties 的 'object'             | map                                                                                               |
| 设置了 x-kubernetes-embedded-type 的 'object'       | object / "message type"，'apiVersion'、'kind'、'metadata.name' 和 'metadata.generateName' 被隐式包含在模式中 |
| 设置了 x-kubernetes-preserve-unknown-fields 的 'object' | object / "message type"，CEL 表达式中不可访问的未知字段                                            |
| x-kubernetes-int-or-string                      | int 或 string 的并集，`self.intOrString < 100 \|\| self.intOrString == '50%'` 对于 `50` 和 `"50%"`都评估为 true |
| 'array'                                        | list                                                                                                 |
| 设置了 x-kubernetes-list-type=map 的 'array'    | list，具有基于 Equality 和唯一键保证的 map                                                               |
| 设置了 x-kubernetes-list-type=set 的 'array'    | list，具有基于 Equality 和唯一条目保证的 set                                                             |
| 'boolean'                                     | boolean                                                                                              |
| 'number' (所有格式)                            | double                                                                                                |
| 'integer' (所有格式)                           | int (64)                                                                                              |
| **非等价 **                                    | uint (64)                                                                                             |
| 'null'                                        | null_type                                                                                             |
| 'string'                                      | string                                                                                                |
| 设置了 format=byte 的 'string'（以 base64 编码） | bytes                                                                                                 |
| 设置了 format=date 的 'string'                 | timestamp (google.protobuf.Timestamp)                                                                 |
| 设置了 format=datetime 的 'string'             | timestamp (google.protobuf.Timestamp)                                                                 |
| 设置了 format=duration 的 'string'             | duration (google.protobuf.Duration)                                                                   |
{{< /table >}}

<!--
Also see: [CEL types](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#values),
[OpenAPI types](https://swagger.io/specification/#data-types),
[Kubernetes Structural Schemas](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).
-->
另见：[CEL 类型](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#values)、
[OpenAPI 类型](https://swagger.io/specification/#data-types)、
[Kubernetes 结构化模式](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema)。

<!--
Equality comparison for arrays with `x-kubernetes-list-type` of `set` or `map` ignores element
order. For example `[1, 2] == [2, 1]` if the arrays represent Kubernetes `set` values.

Concatenation on arrays with `x-kubernetes-list-type` use the semantics of the
list type:
-->
`x-kubernetes-list-type` 为 `set` 或 `map` 的数组进行相等比较时会忽略元素顺序。
例如，如果这些数组代表 Kubernetes 的 `set` 值，则 `[1, 2] == [2, 1]`。

使用 `x-kubernetes-list-type` 的数组进行串接时，使用 list 类型的语义：

<!--
- `set`: `X + Y` performs a union where the array positions of all elements in
  `X` are preserved and non-intersecting elements in `Y` are appended, retaining
  their partial order.
- `map`: `X + Y` performs a merge where the array positions of all keys in `X`
  are preserved but the values are overwritten by values in `Y` when the key
  sets of `X` and `Y` intersect. Elements in `Y` with non-intersecting keys are
  appended, retaining their partial order.
-->
- `set`：`X + Y` 执行并集操作，保留 `X` 中所有元素的数组位置，
  将 `Y` 中非交集元素追加到 `X` 中，保留它们的部分顺序。
- `map`：`X + Y` 执行合并操作，保留 `X` 中所有键的数组位置，
  但是当 `X` 和 `Y` 的键集相交时，将 `Y` 中的值覆盖 `X` 中的值。
  将 `Y` 中非交集键的元素附加到 `X` 中，保留它们的部分顺序。

<!--
## Escaping

Only Kubernetes resource property names of the form
`[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible from CEL. Accessible property
names are escaped according to the following rules when accessed in the
expression:
-->
## 转义 {#escaping}

仅形如 `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` 的 Kubernetes 资源属性名可以从 CEL 中访问。
当在表达式中访问可访问的属性名时，会根据以下规则进行转义：

<!--
{{< table caption="Table of CEL identifier escaping rules" >}}
| escape sequence   | property name equivalent                                                                     |
|-------------------|----------------------------------------------------------------------------------------------|
| `__underscores__` | `__`                                                                                         |
| `__dot__`         | `.`                                                                                          |
| `__dash__`        | `-`                                                                                          |
| `__slash__`       | `/`                                                                                          |
| `__{keyword}__`   | [CEL **RESERVED** keyword](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#syntax) |
{{< /table >}}
-->
{{< table caption="CEL 标识符转义规则表" >}}
| 转义序列            | 等价的属性名                                                                              |
|-------------------|------------------------------------------------------------------------------------------|
| `__underscores__` | `__`                                                                                     |
| `__dot__`         | `.`                                                                                      |
| `__dash__`        | `-`                                                                                      |
| `__slash__`       | `/`                                                                                      |
| `__{keyword}__` | [CEL **保留的** 关键字](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#syntax) |
{{< /table >}}

<!--
When you escape any of CEL's **RESERVED** keywords you need to match the exact property name
use the underscore escaping
(for example, `int` in the word `sprint` would not be escaped and nor would it need to be).

Examples on escaping:
-->
当你需要转义 CEL 的任一 **保留的** 关键字时，你需要使用下划线转义来完全匹配属性名
（例如，`sprint` 这个单词中的 `int` 不会被转义，也不需要被转义）。

转义示例：

<!--
{{< table caption="Examples escaped CEL identifiers" >}}
| property name | rule with escaped property name   |
|---------------|-----------------------------------|
| `namespace`   | `self.__namespace__ > 0`          |
| `x-prop`      | `self.x__dash__prop > 0`          |
| `redact__d`   | `self.redact__underscores__d > 0` |
| `string`      | `self.startsWith('kube')`         |
{{< /table >}}
-->
{{< table caption="转义的 CEL 标识符例子" >}}
| 属性名称       | 带有转义的属性名称的规则              |
|---------------|-----------------------------------|
| `namespace`   | `self.__namespace__ > 0`          |
| `x-prop`      | `self.x__dash__prop > 0`          |
| `redact__d`   | `self.redact__underscores__d > 0` |
| `string`      | `self.startsWith('kube')`         |
{{< /table >}}

<!--
## Resource constraints

CEL is non-Turing complete and offers a variety of production safety controls to
limit execution time. CEL's _resource constraint_ features provide feedback to
developers about expression complexity and help protect the API server from
excessive resource consumption during evaluation. CEL's resource constraint
features are used to prevent CEL evaluation from consuming excessive API server
resources.
-->
## 资源约束 {#resource-constraints}

CEL 不是图灵完备的，提供了多种生产安全控制手段来限制执行时间。
CEL 的**资源约束**特性提供了关于表达式复杂性的反馈，并帮助保护 API 服务器免受过度的资源消耗。
CEL 的资源约束特性用于防止 CEL 评估消耗过多的 API 服务器资源。

<!--
A key element of the resource constraint features is a _cost unit_ that CEL
defines as a way of tracking CPU utilization. Cost units are independent of
system load and hardware. Cost units are also deterministic; for any given CEL
expression and input data, evaluation of the expression by the CEL interpreter
will always result in the same cost.
-->
资源约束特性的一个关键要素是 CEL 定义的**成本单位**，它是一种跟踪 CPU 利用率的方式。
成本单位独立于系统负载和硬件。成本单位也是确定性的；对于任何给定的 CEL 表达式和输入数据，
由 CEL 解释器评估表达式将始终产生相同的成本。

<!--
Many of CEL's core operations have fixed costs. The simplest operations, such as
comparisons (e.g. `<`) have a cost of 1. Some have a higher fixed cost, for
example list literal declarations have a fixed base cost of 40 cost units.
-->
CEL 的许多核心运算具有固定成本。例如比较（例如 `<`）这类最简单的运算成本为 1。
有些运算具有更高的固定成本，例如列表字面声明具有 40 个成本单位的固定基础成本。

<!--
Calls to functions implemented in native code approximate cost based on the time
complexity of the operation. For example: operations that use regular
expressions, such as `match` and `find`, are estimated using an approximated
cost of `length(regexString)*length(inputString)`. The approximated cost
reflects the worst case time complexity of Go's RE2 implementation.
-->
调用本地代码实现的函数时，基于运算的时间复杂度估算其成本。
举例而言：`match` 和 `find` 这类使用正则表达式的运算使用
`length(regexString)*length(inputString)` 的近似成本进行估算。
这个近似的成本反映了 Go 的 RE2 实现的最坏情况的时间复杂度。

<!--
### Runtime cost budget

All CEL expressions evaluated by Kubernetes are constrained by a runtime cost
budget. The runtime cost budget is an estimate of actual CPU utilization
computed by incrementing a cost unit counter while interpreting a CEL
expression. If the CEL interpreter executes too many instructions, the runtime
cost budget will be exceeded, execution of the expressions will be halted, and
an error will result.
-->
### 运行时成本预算 {#runtime-cost-budget}

所有由 Kubernetes 评估的 CEL 表达式都受到运行时成本预算的限制。
运行时成本预算是通过在解释 CEL 表达式时增加成本单元计数器来计算实际 CPU 利用率的估算值。
如果 CEL 解释器执行的指令太多，将超出运行时成本预算，表达式的执行将停止，并将出现错误。

<!--
Some Kubernetes resources define an additional runtime cost budget that bounds
the execution of multiple expressions. If the sum total of the cost of
expressions exceed the budget, execution of the expressions will be halted, and
an error will result. For example the validation of a custom resource has a
_per-validation_ runtime cost budget for all [Validation
Rules](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
evaluated to validate the custom resource.
-->
一些 Kubernetes 资源定义了额外的运行时成本预算，用于限制多个表达式的执行。
如果所有表达式的成本总和超过预算，表达式的执行将停止，并将出现错误。
例如，自定义资源的验证具有针对验证自定义资源所评估的所有
[验证规则](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)的
**每个验证** 运行时成本预算。

<!--
### Estimated cost limits

For some Kubernetes resources, the API server may also check if worst case
estimated running time of CEL expressions would be prohibitively expensive to
execute. If so, the API server prevent the CEL expression from being written to
API resources by rejecting create or update operations containing the CEL
expression to the API resources. This feature offers a stronger assurance that
CEL expressions written to the API resource will be evaluate at runtime without
exceeding the runtime cost budget.
-->
### 估算的成本限制 {#estimated-cost-limits}

对于某些 Kubernetes 资源，API 服务器还可能检查 CEL 表达式的最坏情况估计运行时间是否过于昂贵而无法执行。
如果是，则 API 服务器会拒绝包含 CEL 表达式的创建或更新操作，以防止 CEL 表达式被写入 API 资源。
此特性提供了更强的保证，即写入 API 资源的 CEL 表达式将在运行时进行评估，而不会超过运行时成本预算。
