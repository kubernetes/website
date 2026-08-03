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

CEL 表达式在 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}中直接进行处理，
这使得 CEL 成为许多可扩展性用例的便捷替代方案，而无需使用类似 Webhook 这种进程外机制。
只要控制平面的 API 服务器组件保持可用状态，你的 CEL 表达式就会继续执行。

<!-- body -->

<!--
## Language overview

The [CEL language](https://github.com/google/cel-spec/blob/master/doc/langdef.md)
has a straightforward syntax that is similar to the expressions in C, C++, Java,
JavaScript and Go.

CEL was designed to be embedded into applications. Each CEL "program" is a
single expression that evaluates to a single value. CEL expressions are
typically short "one-liners" that inline well into the string fields of Kubernetes
API resources.
-->
## 语言概述   {#language-overview}

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
文档中声明了字段可使用哪些变量。例如，在 CustomResourceDefinition 的
`x-kubernetes-validations[i].rules` 字段中，`self` 和 `oldSelf` 变量可用，
并且分别指代要由 CEL 表达式验证的自定义资源数据的前一个状态和当前状态。
其他 Kubernetes API 字段可能声明不同的变量。请查阅 API 字段的 API 文档以了解该字段可使用哪些变量。

<!--
Example CEL expressions:
-->
CEL 表达式示例：

<table>
<caption><!-- Examples of CEL expressions and the purpose of each -->CEL 表达式例子和每个表达式的用途</caption>
<thead>
<tr>
  <th><!-- Rule -->规则</th>
  <th><!-- Purpose -->用途</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>self.minReplicas &lt;= self.replicas && self.replicas &lt;= self.maxReplicas</tt></td>
  <td><!-- Validate that the three fields defining replicas are ordered appropriately -->验证定义副本的三个字段被正确排序</td>
</tr>
<tr>
  <td><tt>'Available' in self.stateCounts</tt></td>
  <td><!-- Validate that an entry with the 'Available' key exists in a map -->验证映射中存在主键为 'Available' 的条目</td>
</tr>
<tr>
  <td><tt>(self.list1.size() == 0) != (self.list2.size() == 0)</tt></td>
  <td><!-- Validate that one of two lists is non-empty, but not both -->验证两个列表中有一个非空，但不是两个都非空</td>
</tr>
<tr>
  <td><tt>self.envars.filter(e, e.name = 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$'))</tt></td>
  <td><!-- Validate the 'value' field of a listMap entry where key field 'name' is 'MY_ENV' -->
  验证 listMap 条目的 'value' 字段，其主键字段 'name' 是 'MY_ENV'</td>
</tr>
<tr>
  <td><tt>has(self.expired) && self.created + self.ttl &lt; self.expired</tt></td>
  <td><!-- Validate that 'expired' date is after a 'create' date plus a 'ttl' duration -->
  验证 'expired' 日期在 'create' 日期加上 'ttl' 持续时间之后</td>
</tr>
<tr>
  <td><tt>self.health.startsWith('ok')</tt></td>
  <td><!-- Validate a 'health' string field has the prefix 'ok' -->验证 'health' 字符串字段具有前缀 'ok'</td>
</tr>
<tr>
  <td><tt>self.widgets.exists(w, w.key == 'x' && w.foo &lt; 10)</tt></td>
  <td><!-- Validate that the 'foo' property of a listMap item with a key 'x' is less than 10 -->
  验证具有键 'x' 的 listMap 项的 'foo' 属性小于 10</td>
</tr>
<tr>
  <td><tt>type(self) == string ? self == '99%' : self == 42</tt></td>
  <td><!-- Validate an int-or-string field for both the int and string cases -->
  验证 int-or-string 字段是否同时具备 int 和 string 的属性</td>
</tr>
<tr>
  <td><tt>self.metadata.name == 'singleton'</tt></td>
  <td><!-- Validate that an object's name matches a specific value (making it a singleton) -->
  验证某对象的名称与特定的值匹配（使其成为一个特例）</td>
</tr>
<tr>
  <td><tt>self.set1.all(e, !(e in self.set2))</tt></td>
  <td><!-- Validate that two listSets are disjoint -->验证两个 listSet 不相交</td>
</tr>
<tr>
  <td><tt>self.names.size() == self.details.size() && self.names.all(n, n in self.details)</tt></td>
  <td><!-- Validate the 'details' map is keyed by the items in the 'names' listSet -->
  验证 'details' 映射是由 'names' listSet 中的各项键入的</td>
</tr>
<tr>
  <td><tt>self.details.all(key, key.matches('^[a-zA-Z]*$'))</tt></td>
  <td><!-- Validate the keys of the 'details' map -->验证 'details' 映射的主键</td>
</tr>
<tr>
  <td><tt>self.details.all(key, self.details[key].matches('^[a-zA-Z]*$'))</tt></td>
  <td><!-- Validate the values of the 'details' map -->验证 'details' 映射的值</td>
</tr>
</tbody>
</table>

<!--
## CEL options, language features, and libraries

CEL is configured with the following options, libraries and language features, introduced at the specified Kubernetes versions:
-->
## CEL 选项、语言特性和库   {#cel-options-language-features-and-libraries}

CEL 配置了以下选项、库和语言特性，这些特性是在所列的 Kubernetes 版本中引入的：

<table>
<thead>
<tr>
  <th><!-- CEL option, library or language feature -->CEL 选项、库或语言特性</th>
  <th><!-- Included -->包含的内容</th>
  <th><!-- Availability -->可用性</th>
</tr>
</thead>
<tbody>
<tr>
  <td><!-- <a href="https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros">Standard macros</a> -->
  <a href="https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros">标准宏</a></td>
  <td><code>has</code>, <code>all</code>, <code>exists</code>, <code>exists_one</code>, <code>map</code>, <code>filter</code></td>
  <td><!-- All Kubernetes versions -->所有 Kubernetes 版本</td>
</tr>
<tr>
  <td><!-- <a href="https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions">Standard functions</a> -->
  <a href="https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions">标准函数</a></td>
  <td><!-- See
    <a href="https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions">
      official list of standard definitions
    </a>
   -->参见
    <a href="https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions">
      官方标准定义列表
    </a>
  </td>
  <td><!-- All Kubernetes versions -->所有 Kubernetes 版本</td>
</tr>
<tr>
  <td>
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#HomogeneousAggregateLiterals">
      <!-- Homogeneous Aggregate Literals -->同质聚合字面量
    </a>
  </td>
  <td>-</td>
  <td><!-- All Kubernetes versions -->所有 Kubernetes 版本</td>
</tr>
<tr>
  <td><!-- <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#DefaultUTCTimeZone">Default UTC Time Zone</a> -->
  <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#DefaultUTCTimeZone">默认 UTC 时区</a></td>
  <td>-</td>
  <td><!-- All Kubernetes versions -->所有 Kubernetes 版本</td>
</tr>
<tr>
  <td>
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#EagerlyValidateDeclarations">
      <!-- Eagerly Validate Declarations -->迫切验证声明
    </a>
  </td>
  <td>-</td>
  <td><!-- All Kubernetes versions -->所有 Kubernetes 版本</td>
</tr>
<tr>
  <td><!-- <a href="https://pkg.go.dev/github.com/google/cel-go/ext#Strings">Extended strings library</a>, Version 1 -->
  <a href="https://pkg.go.dev/github.com/google/cel-go/ext#Strings">扩展字符串库</a>，v1</td>
  <td>
    <code>charAt</code>, <code>indexOf</code>, <code>lastIndexOf</code>, <code>lowerAscii</code>,
    <code>upperAscii</code>, <code>replace</code>, <code>split</code>, <code>join</code>, <code>substring</code>,
    <code>trim</code>
  </td>
  <td><!-- Kubernetes versions between 1.25 and 1.30 -->Kubernetes 1.25 至 1.30 版本</td>
</tr>
<tr>
  <td><!-- <a href="https://pkg.go.dev/github.com/google/cel-go/ext#Strings">Extended strings library</a>, Version 2 -->
  <a href="https://pkg.go.dev/github.com/google/cel-go/ext#Strings">扩展字符串库</a>，v2</td>
  <td>
    <code>charAt</code>, <code>indexOf</code>, <code>lastIndexOf</code>, <code>lowerAscii</code>,
    <code>upperAscii</code>, <code>replace</code>, <code>split</code>, <code>join</code>, <code>substring</code>,
    <code>trim</code>
  </td>
  <td><!-- Kubernetes versions 1.30+ -->Kubernetes 1.30+ 版本</td>
</tr>
<tr>
  <td><!-- Kubernetes list library -->Kubernetes 列表库</td>
  <td><!-- See
    <a href="#kubernetes-list-library">
      Kubernetes list library
    </a>
   -->参见
    <a href="#kubernetes-list-library">
      Kubernetes 列表库
    </a>
  </td>
  <td><!-- All Kubernetes versions -->所有 Kubernetes 版本</td>
</tr>
<tr>
  <td><!-- Kubernetes regex library -->Kubernetes 正则表达式库</td>
  <td>See
    <a href="#kubernetes-regex-library">
      <!-- Kubernetes regex library -->Kubernetes 正则表达式库
    </a>
  </td>
  <td><!-- All Kubernetes versions -->所有 Kubernetes 版本</td>
</tr>
<tr>
  <td><!-- Kubernetes URL library -->Kubernetes URL 库</td>
  <td>See
    <a href="#kubernetes-url-library">
      <!-- Kubernetes URL library -->Kubernetes URL 库
    </a>
  </td>
  <td><!-- All Kubernetes versions -->所有 Kubernetes 版本</td>
</tr>
<tr>
  <td><!-- Kubernetes IP address library -->Kubernetes IP 地址库</td>
  <td>See
    <a href="#kubernetes-ip-address-library">
      <!-- Kubernetes IP address library -->Kubernetes IP 地址库
    </a>
  </td>
  <td><!-- Kubernetes versions 1.31+ -->Kubernetes 1.31+ 版本</td>
</tr>
<tr>
  <td><!-- Kubernetes CIDR library -->Kubernetes CIDR 库</td>
  <td>See
    <a href="#kubernetes-cidr-library">
      <!-- Kubernetes CIDR library -->Kubernetes CIDR 库
    </a>
  </td>
  <td><!-- Kubernetes versions 1.31+ -->Kubernetes 1.31+ 版本</td>
</tr>
<tr>
  <td><!-- Kubernetes authorizer library -->Kubernetes 鉴权组件库</td>
  <td><!-- See
    <a href="#kubernetes-authorizer-library">
      Kubernetes authorizer library
    </a>
    -->
    参见
    <a href="#kubernetes-authorizer-library">
      Kubernetes 鉴权组件库
    </a>
  </td>
  <td><!-- All Kubernetes versions -->所有 Kubernetes 版本</td>
</tr>
<tr>
  <td><!-- Kubernetes quantity library -->Kubernetes 数量库</td>
  <td><!-- See
    <a href="#kubernetes-quantity-library">
      Kubernetes quantity library
    </a>
    -->
    参见
    <a href="#kubernetes-quantity-library">
      Kubernetes 数量库
    </a>
  </td>
  <td><!-- Kubernetes versions 1.29+ -->Kubernetes 1.29+ 版本</td>
</tr>
<tr>
  <td><!-- Kubernetes format library -->Kubernetes 格式库</td>
  <td>See
    <a href="#kubernetes-format-library">
      <!-- Kubernetes format library -->Kubernetes 格式库
    </a>
  </td>
  <td><!-- Kubernetes versions 1.32+ -->Kubernetes 1.32+ 版本</td>
</tr>
<tr>
  <td><!-- Kubernetes semver library -->Kubernetes semver 库</td>
  <td>See
    <a href="#kubernetes-semver-library">
      <!-- Kubernetes semver library -->Kubernetes semver 库
    </a>
  </td>
  <td><!-- Kubernetes versions 1.34+ -->Kubernetes 1.34+ 版本</td>
</tr>
<tr>
  <td><!-- CEL optional types -->CEL 可选类型</td>
  <td><!-- See
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#OptionalTypes">
      CEL optional types
    </a>
    -->
    参见
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#OptionalTypes">
      CEL 可选类型
    </a>
  </td>
  <td><!-- Kubernetes versions 1.29+ -->Kubernetes v1.29+</td>
</tr>
<tr>
  <td>CEL CrossTypeNumericComparisons</td>
  <td><!-- See
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#CrossTypeNumericComparisons">
      CEL CrossTypeNumericComparisons
    </a>
    -->
    参见
    <a href="https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#CrossTypeNumericComparisons">
      CEL CrossTypeNumericComparisons
   </a>
  </td>
  <td><!-- Kubernetes versions 1.29+ -->Kubernetes v1.29+</td>
</tr>
</tbody>
</table>

<!--
CEL functions, features and language settings support Kubernetes control plane
rollbacks. For example, _CEL Optional Values_ was introduced at Kubernetes 1.29
and so only API servers at that version or newer will accept write requests to
CEL expressions that use _CEL Optional Values_. However, when a cluster is
rolled back to Kubernetes 1.28 CEL expressions using "CEL Optional Values" that
are already stored in API resources will continue to evaluate correctly.
-->
CEL 函数、特性和语言设置支持 Kubernetes 控制平面回滚。
例如，__CEL 可选值（Optional Values）__ 是在 Kubernetes 1.29 引入的，因此只有该版本或更新的
API 服务器才会接受使用 __CEL Optional Values__ 的 CEL 表达式的写入请求。
但是，当集群回滚到 Kubernetes 1.28 时，已经存储在 API 资源中的使用了
"CEL Optional Values" 的 CEL 表达式将继续正确评估。

<!--
## Kubernetes CEL libraries

In additional to the CEL community libraries, Kubernetes includes CEL libraries
that are available everywhere CEL is used in Kubernetes.
-->
## Kubernetes CEL 库   {#kubernetes-cel-libraries}

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
### Kubernetes 列表库   {#kubernetes-list-library}

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

<table>
<caption><!-- Examples of CEL expressions using list library functions -->使用列表库函数的 CEL 表达式例子</caption>
<thead>
<tr>
  <td><!-- CEL Expression -->CEL 表达式</td>
  <td><!-- Purpose -->用途</td>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>names.isSorted()</tt></td>
  <td><!-- Verify that a list of names is kept in alphabetical order -->验证名称列表是否按字母顺序排列</td>
</tr>
<tr>
  <td><tt>items.map(x, x.weight).sum() == 1.0</tt></td>
  <td><!-- Verify that the "weights" of a list of objects sum to 1.0 -->验证对象列表的 “weight” 总和为 1.0</td>
</tr>
<tr>
  <td><tt>lowPriorities.map(x, x.priority).max() &lt; highPriorities.map(x, x.priority).min()</tt></td>
  <td><!-- Verify that two sets of priorities do not overlap -->验证两组优先级不重叠</td>
</tr>
<tr>
  <td><tt>names.indexOf('should-be-first') == 1</tt></td>
  <td><!-- Require that the first name in a list if a specific value -->如果是特定值，则使用列表中的第一个名称</td>
</tr>
</tbody>
</table>

<!--
See the [Kubernetes List Library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Lists)
godoc for more information.
-->
更多信息请查阅 Go 文档：
[Kubernetes 列表库](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Lists)。

<!--
### Kubernetes regex library

In addition to the `matches` function provided by the CEL standard library, the
regex library provides `find` and `findAll`, enabling a much wider range of
regex operations.

Examples:
-->
### Kubernetes 正则表达式库   {#kubernete-regex-library}

除了 CEL 标准库提供的 `matches` 函数外，正则表达式库还提供了 `find` 和 `findAll`，
使得更多种类的正则表达式运算成为可能。

例如：

<table>
<caption><!-- Examples of CEL expressions using regex library functions -->使用正则表达式库函数的 CEL 表达式例子</caption>
<thead>
<tr>
  <td><!-- CEL Expression -->CEL 表达式</td>
  <td><!-- Purpose -->用途</td>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>"abc 123".find('[0-9]+')</tt></td>
  <td><!-- Find the first number in a string -->找到字符串中的第一个数字</td>
</tr>
<tr>
  <td><tt>"1, 2, 3, 4".findAll('[0-9]+').map(x, int(x)).sum() &lt; 100</tt></td>
  <td><!-- Verify that the numbers in a string sum to less than 100 -->验证字符串中的数字之和小于 100</td>
</tr>
</tbody>
</table>

<!--
See the [Kubernetes regex library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Regex)
godoc for more information.
-->
更多信息请查阅 Go 文档：
[Kubernetes 正则表达式库](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Regex)。

<!--
### Kubernetes URL library

To make it easier and safer to process URLs, the following functions have been added:

- `isURL(string)` checks if a string is a valid URL according to the
  [Go's net/url](https://pkg.go.dev/net/url#URL) package. The string must be an
  absolute URL.
- `url(string) URL` converts a string to a URL or results in an error if the
  string is not a valid URL.
-->
### Kubernetes URL 库   {#kubernetes-url-library}

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

<table>
<caption><!-- Examples of CEL expressions using URL library functions -->使用 URL 库函数的 CEL 表达式例子</caption>
<thead>
<tr>
  <td><!-- CEL Expression -->CEL 表达式</td>
  <td><!-- Purpose -->用途</td>
</tr>
</thead>
<tbody>
</tr>
<tr>
  <td><tt>url('https://example.com:80/').getHost()</tt></td>
  <td><!-- Gets the 'example.com:80' host part of the URL -->获取 URL 的 'example.com:80' 主机部分</td>
</tr>
<tr>
  <td><tt>url('https://example.com/path with spaces/').getEscapedPath()</tt></td>
  <td><!-- Returns '/path%20with%20spaces/' -->返回 '/path%20with%20spaces/'</td>
</tr>
</tbody>
</table>

<!--
See the [Kubernetes URL library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#URLs)
godoc for more information.
-->
更多信息请查阅 Go 文档：
[Kubernetes URL 库](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#URLs)。

<!--
### Kubernetes IP address library

To make it easier and safer to process IP addresses, the following functions have been added:

- `isIP(string)` checks if a string is a valid IP address.
- `ip(string) IP` converts a string to an IP address object or results in an error if the string is not a valid IP address.

For both functions, the IP address must be an IPv4 or IPv6 address.
IPv4-mapped IPv6 addresses (e.g. `::ffff:1.2.3.4`) are not allowed.
IP addresses with zones (e.g. `fe80::1%eth0`) are not allowed.
Leading zeros in IPv4 address octets are not allowed.

Once parsed via the `ip` function, the resulting IP object has the
following library of member functions:

<table>
<caption>Available member functions of an IP address object</caption>
<thead>
<tr>
  <th>Member Function</th>
  <th>CEL Return Value</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isCanonical()</tt></td>
  <td>bool</td>
  <td>
    Returns true if the IP address is in its canonical form.
    There is exactly one canonical form for every IP address, so fields containing
    IPs in canonical form can just be treated as strings when checking for equality or uniqueness.
  </td>
</tr>
<tr>
  <td><tt>family()</tt></td>
  <td>int</td>
  <td>Returns the IP address family, <tt>4</tt> for IPv4 and <tt>6</tt> for IPv6.</td>
</tr>
<tr>
  <td><tt>isUnspecified()</tt></td>
  <td>bool</td>
  <td>
    Returns true if the IP address is the unspecified address.
    Either the IPv4 address "0.0.0.0" or the IPv6 address "::".
  </td>
</tr>
<tr>
  <td><tt>isLoopback()</tt></td>
  <td>bool</td>
  <td>
    Returns true if the IP address is the loopback address.
    Either an IPv4 address with a value of 127.x.x.x or an IPv6 address with a value of ::1.
  </td>
</tr>
<tr>
  <td><tt>isLinkLocalMulticast()</tt></td>
  <td>bool</td>
  <td>
    Returns true if the IP address is a link-local multicast address.
    Either an IPv4 address with a value of 224.0.0.x or an IPv6 address in the network ff00::/8.
  </td>
</tr>
<tr>
  <td><tt>isLinkLocalUnicast()</tt></td>
  <td>bool</td>
  <td>
    Returns true if the IP address is a link-local unicast address.
    Either an IPv4 address with a value of 169.254.x.x or an IPv6 address in the network fe80::/10.
  </td>
</tr>
<tr>
  <td><tt>isGlobalUnicast()</tt></td>
  <td>bool</td>
  <td>
    Returns true if the IP address is a global unicast address.
    Either an IPv4 address that is not zero or 255.255.255.255 or an IPv6 address that is not a link-local unicast, loopback or multicast address.
  </td>
</tr>
</tbody>
</table>

Examples:

<table>
<caption>Examples of CEL expressions using IP address library functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isIP('127.0.0.1')</tt></td>
  <td>Returns true for a valid IP.</td>
</tr>
<tr>
  <td><tt>ip('2001:db8::abcd').isCanonical()</tt></td>
  <td>Returns true for a canonical IPv6.</td>
</tr>
<tr>
  <td><tt>ip('2001:DB8::ABCD').isCanonical()</tt></td>
  <td>Returns false because the canonical form is lowercase.</td>
</tr>
<tr>
  <td><tt>ip('127.0.0.1').family() == 4</tt></td>
  <td>Check the address family of an IP.</td>
</tr>
<tr>
  <td><tt>ip('::1').isLoopback()</tt></td>
  <td>Check if an IP is a loopback address.</td>
</tr>
<tr>
  <td><tt>ip('192.168.0.1').isGlobalUnicast()</tt></td>
  <td>Check if an IP is a global unicast address.</td>
</tr>
</tbody>
</table>

See the [Kubernetes IP address library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#IP) godoc for more information.
-->
### Kubernetes IP 地址库   {#kubernetes-ip-address-library}

为更方便、更安全地处理 IP 地址，新增了以下函数：

- `isIP(string)` 检查一个字符串是否是有效的 IP 地址。
- `ip(string) IP` 将字符串转换为 IP 地址对象；如果字符串不是有效的 IP 地址，则返回错误。

对于上述两个函数，IP 地址必须是 IPv4 或 IPv6 地址。
不允许使用 IPv4 映射的 IPv6 地址（例如 `::ffff:1.2.3.4`）。
不允许使用带区域的 IP 地址（例如 `fe80::1%eth0`）。
IPv4 地址各字节中不允许出现前导零。

通过 `ip` 函数解析后，生成的 IP 对象具有以下成员函数库：

<table>
<caption><!-- Available member functions of an IP address object -->IP 地址对象可用的成员函数</caption>
<thead>
<tr>
  <th><!-- Member Function -->成员函数</th>
  <th><!-- CEL Return Value -->CEL 返回值</th>
  <th><!-- Description -->描述</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isCanonical()</tt></td>
  <td>bool</td>
  <td><!-- Returns true if the IP address is in its canonical form. There is exactly one canonical form for every IP address, so fields containing IPs in canonical form can just be treated as strings when checking for equality or uniqueness. -->如果 IP 地址处于规范形式，则返回 true。每个 IP 地址只有一种规范形式，因此在检查相等性或唯一性时，包含规范形式 IP 的字段可以当作字符串处理。</td>
</tr>
<tr>
  <td><tt>family()</tt></td>
  <td>int</td>
  <td><!-- Returns the IP address family, 4 for IPv4 and 6 for IPv6. -->返回 IP 地址族，IPv4 为 <tt>4</tt>，IPv6 为 <tt>6</tt>。</td>
</tr>
<tr>
  <td><tt>isUnspecified()</tt></td>
  <td>bool</td>
  <td><!-- Returns true if the IP address is the unspecified address. Either the IPv4 address "0.0.0.0" or the IPv6 address "::". -->如果 IP 地址是未指定地址，则返回 true。即 IPv4 地址 "0.0.0.0" 或 IPv6 地址 "::"。</td>
</tr>
<tr>
  <td><tt>isLoopback()</tt></td>
  <td>bool</td>
  <td><!-- Returns true if the IP address is the loopback address. Either an IPv4 address with a value of 127.x.x.x or an IPv6 address with a value of ::1. -->如果 IP 地址是回环地址，则返回 true。即值为 127.x.x.x 的 IPv4 地址或值为 ::1 的 IPv6 地址。</td>
</tr>
<tr>
  <td><tt>isLinkLocalMulticast()</tt></td>
  <td>bool</td>
  <td><!-- Returns true if the IP address is a link-local multicast address. Either an IPv4 address with a value of 224.0.0.x or an IPv6 address in the network ff00::/8. -->如果 IP 地址是链路本地组播地址，则返回 true。即值为 224.0.0.x 的 IPv4 地址或 ff00::/8 网络中的 IPv6 地址。</td>
</tr>
<tr>
  <td><tt>isLinkLocalUnicast()</tt></td>
  <td>bool</td>
  <td><!-- Returns true if the IP address is a link-local unicast address. Either an IPv4 address with a value of 169.254.x.x or an IPv6 address in the network fe80::/10. -->如果 IP 地址是链路本地单播地址，则返回 true。即值为 169.254.x.x 的 IPv4 地址或 fe80::/10 网络中的 IPv6 地址。</td>
</tr>
<tr>
  <td><tt>isGlobalUnicast()</tt></td>
  <td>bool</td>
  <td><!-- Returns true if the IP address is a global unicast address. Either an IPv4 address that is not zero or 255.255.255.255 or an IPv6 address that is not a link-local unicast, loopback or multicast address. -->如果 IP 地址是全局单播地址，则返回 true。即非零或非 255.255.255.255 的 IPv4 地址，或不是链路本地单播、回环或组播地址的 IPv6 地址。</td>
</tr>
</tbody>
</table>

示例：

<table>
<caption><!-- Examples of CEL expressions using IP address library functions -->使用 IP 地址库函数的 CEL 表达式示例</caption>
<thead>
<tr>
  <th><!-- CEL Expression -->CEL 表达式</th>
  <th><!-- Purpose -->用途</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isIP('127.0.0.1')</tt></td>
  <td><!-- Returns true for a valid IP. -->对有效 IP 返回 true。</td>
</tr>
<tr>
  <td><tt>ip('2001:db8::abcd').isCanonical()</tt></td>
  <td><!-- Returns true for a canonical IPv6. -->对规范形式的 IPv6 返回 true。</td>
</tr>
<tr>
  <td><tt>ip('2001:DB8::ABCD').isCanonical()</tt></td>
  <td><!-- Returns false because the canonical form is lowercase. -->返回 false，因为规范形式是小写。</td>
</tr>
<tr>
  <td><tt>ip('127.0.0.1').family() == 4</tt></td>
  <td><!-- Check the address family of an IP. -->检查 IP 的地址族。</td>
</tr>
<tr>
  <td><tt>ip('::1').isLoopback()</tt></td>
  <td><!-- Check if an IP is a loopback address. -->检查 IP 是否是回环地址。</td>
</tr>
<tr>
  <td><tt>ip('192.168.0.1').isGlobalUnicast()</tt></td>
  <td><!-- Check if an IP is a global unicast address. -->检查 IP 是否是全局单播地址。</td>
</tr>
</tbody>
</table>

更多信息请查阅 Go 文档：
[Kubernetes IP 地址库](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#IP)。

<!--
### Kubernetes CIDR library

CIDR provides a CEL function library extension of {{< glossary_tooltip text="CIDR" term_id="CIDR" >}} notation parsing functions.

#### `cidr`

Converts a string in CIDR notation to a network address representation or results in an error if the string is not a valid CIDR notation.
The CIDR must be an IPv4 or IPv6 subnet address with a mask.
Leading zeros in IPv4 address octets are not allowed.
IPv4-mapped IPv6 addresses (e.g. `::ffff:1.2.3.4/24`) are not allowed.

<tt>cidr(&lt;string&gt;) &lt;CIDR&gt;</tt>

Examples:

<tt>cidr('192.168.0.0/16')</tt> // returns an IPv4 address with a CIDR mask
<tt>cidr('::1/128')</tt> // returns an IPv6 address with a CIDR mask
<tt>cidr('192.168.0.0/33')</tt> // error
<tt>cidr('::1/129')</tt> // error
<tt>cidr('192.168.0.1/16')</tt> // error, because there are non-0 bits after the prefix

#### `isCIDR`

Returns true if a string is a valid CIDR notation representation of a subnet with mask.
The CIDR must be an IPv4 or IPv6 subnet address with a mask.
Leading zeros in IPv4 address octets are not allowed.
IPv4-mapped IPv6 addresses (e.g. `::ffff:1.2.3.4/24`) are not allowed.

<tt>isCIDR(&lt;string&gt;) &lt;bool&gt;</tt>

Examples:

<tt>isCIDR('192.168.0.0/16')</tt> // returns true
<tt>isCIDR('::1/128')</tt> // returns true
<tt>isCIDR('192.168.0.0/33')</tt> // returns false
<tt>isCIDR('::1/129')</tt> // returns false

#### `containsIP` / `containsCIDR` / `ip` / `masked` / `prefixLength`

- `containsIP`: Returns true if a the CIDR contains the given IP address.
The IP address must be an IPv4 or IPv6 address.
May take either a string or IP address as an argument.

- `containsCIDR`: Returns true if a the CIDR contains the given CIDR.
The CIDR must be an IPv4 or IPv6 subnet address with a mask.
May take either a string or CIDR as an argument.

- `ip`: Returns the IP address representation of the CIDR.

- `masked`: Returns the CIDR representation of the network address with a masked prefix.
This can be used to return the canonical form of the CIDR network.

- `prefixLength`: Returns the prefix length of the CIDR in bits.
This is the number of bits in the mask.

Examples:

<table>
<caption>Examples of CEL expressions using CIDR library functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP(ip('192.168.0.1'))</tt></td>
  <td>Checks if a CIDR contains a given IP address (IP object).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP(ip('192.168.1.1'))</tt></td>
  <td>Checks if a CIDR contains a given IP address (IP object).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP('192.168.0.1')</tt></td>
  <td>Checks if a CIDR contains a given IP address (string).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP('192.168.1.1')</tt></td>
  <td>Checks if a CIDR contains a given IP address (string).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/16').containsCIDR(cidr('192.168.10.0/24'))</tt></td>
  <td>Checks if a CIDR contains another given CIDR (CIDR object).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.1.0/24').containsCIDR(cidr('192.168.2.0/24'))</tt></td>
  <td>Checks if a CIDR contains another given CIDR (CIDR object).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/16').containsCIDR('192.168.10.0/24')</tt></td>
  <td>Checks if a CIDR contains another given CIDR (string).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.1.0/24').containsCIDR('192.168.2.0/24')</tt></td>
  <td>Checks if a CIDR contains another given CIDR (string).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24').ip()</tt></td>
  <td>Returns the IP address part of a CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24').ip().family()</tt></td>
  <td>Returns the family of the IP address part of a CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('::1/128').ip()</tt></td>
  <td>Returns the IP address part of an IPv6 CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('::1/128').ip().family()</tt></td>
  <td>Returns the family of the IP address part of an IPv6 CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').masked()</tt></td>
  <td>Returns the canonical form of a CIDR network.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24').masked()</tt></td>
  <td>Returns the canonical form of a CIDR network, masking non-prefix bits.</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24') == cidr('192.168.0.0/24').masked()</tt></td>
  <td>Compares a CIDR to its canonical form (already canonical).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24') == cidr('192.168.0.1/24').masked()</tt></td>
  <td>Compares a CIDR to its canonical form (not canonical).</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/16').prefixLength()</tt></td>
  <td>Returns the prefix length of an IPv4 CIDR.</td>
</tr>
<tr>
  <td><tt>cidr('::1/128').prefixLength()</tt></td>
  <td>Returns the prefix length of an IPv6 CIDR.</td>
</tr>
</tbody>
</table>

See the [Kubernetes CIDR library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#CIDR) godoc for more information.
-->
### Kubernetes CIDR 库   {#kubernetes-cidr-library}

CIDR 提供了 {{< glossary_tooltip text="CIDR" term_id="CIDR" >}} 表示法解析函数的 CEL 函数库扩展。

#### `cidr`

将 CIDR 表示法字符串转换为网络地址表示形式；如果字符串不是有效的 CIDR 表示法，则返回错误。
CIDR 必须是带掩码的 IPv4 或 IPv6 子网地址。
IPv4 地址各字节中不允许出现前导零。
不允许使用 IPv4 映射的 IPv6 地址（例如 `::ffff:1.2.3.4/24`）。

<tt>cidr(&lt;string&gt;) &lt;CIDR&gt;</tt>

示例：

<tt>cidr('192.168.0.0/16')</tt> // 返回带 CIDR 掩码的 IPv4 地址
<tt>cidr('::1/128')</tt> // 返回带 CIDR 掩码的 IPv6 地址
<tt>cidr('192.168.0.0/33')</tt> // 错误
<tt>cidr('::1/129')</tt> // 错误
<tt>cidr('192.168.0.1/16')</tt> // 错误，因为前缀之后存在非 0 位

#### `isCIDR`

如果字符串是带掩码的子网的有效 CIDR 表示法，则返回 true。
CIDR 必须是带掩码的 IPv4 或 IPv6 子网地址。
IPv4 地址各字节中不允许出现前导零。
不允许使用 IPv4 映射的 IPv6 地址（例如 `::ffff:1.2.3.4/24`）。

<tt>isCIDR(&lt;string&gt;) &lt;bool&gt;</tt>

示例：

<tt>isCIDR('192.168.0.0/16')</tt> // 返回 true
<tt>isCIDR('::1/128')</tt> // 返回 true
<tt>isCIDR('192.168.0.0/33')</tt> // 返回 false
<tt>isCIDR('::1/129')</tt> // 返回 false

#### `containsIP` / `containsCIDR` / `ip` / `masked` / `prefixLength`

- `containsIP`：如果 CIDR 包含给定的 IP 地址，则返回 true。
  IP 地址必须是 IPv4 或 IPv6 地址。
  参数可以是字符串或 IP 地址对象。

- `containsCIDR`：如果 CIDR 包含给定的 CIDR，则返回 true。
  CIDR 必须是带掩码的 IPv4 或 IPv6 子网地址。
  参数可以是字符串或 CIDR 对象。

- `ip`：返回 CIDR 的 IP 地址表示形式。

- `masked`：返回带掩码前缀的网络地址的 CIDR 表示形式。
  可用于返回 CIDR 网络的规范形式。

- `prefixLength`：返回 CIDR 的前缀长度（以位为单位）。
  即掩码中的位数。

示例：

<table>
<caption><!-- Examples of CEL expressions using CIDR library functions -->使用 CIDR 库函数的 CEL 表达式示例</caption>
<thead>
<tr>
  <th><!-- CEL Expression -->CEL 表达式</th>
  <th><!-- Purpose -->用途</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP(ip('192.168.0.1'))</tt></td>
  <td><!-- Checks if a CIDR contains a given IP address (IP object). -->检查 CIDR 是否包含给定的 IP 地址（IP 对象）。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP(ip('192.168.1.1'))</tt></td>
  <td><!-- Checks if a CIDR contains a given IP address (IP object). -->检查 CIDR 是否包含给定的 IP 地址（IP 对象）。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP('192.168.0.1')</tt></td>
  <td><!-- Checks if a CIDR contains a given IP address (string). -->检查 CIDR 是否包含给定的 IP 地址（字符串）。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').containsIP('192.168.1.1')</tt></td>
  <td><!-- Checks if a CIDR contains a given IP address (string). -->检查 CIDR 是否包含给定的 IP 地址（字符串）。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/16').containsCIDR(cidr('192.168.10.0/24'))</tt></td>
  <td><!-- Checks if a CIDR contains another given CIDR (CIDR object). -->检查 CIDR 是否包含另一个给定的 CIDR（CIDR 对象）。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.1.0/24').containsCIDR(cidr('192.168.2.0/24'))</tt></td>
  <td><!-- Checks if a CIDR contains another given CIDR (CIDR object). -->检查 CIDR 是否包含另一个给定的 CIDR（CIDR 对象）。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/16').containsCIDR('192.168.10.0/24')</tt></td>
  <td><!-- Checks if a CIDR contains another given CIDR (string). -->检查 CIDR 是否包含另一个给定的 CIDR（字符串）。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.1.0/24').containsCIDR('192.168.2.0/24')</tt></td>
  <td><!-- Checks if a CIDR contains another given CIDR (string). -->检查 CIDR 是否包含另一个给定的 CIDR（字符串）。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24').ip()</tt></td>
  <td><!-- Returns the IP address part of a CIDR. -->返回 CIDR 的 IP 地址部分。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24').ip().family()</tt></td>
  <td><!-- Returns the family of the IP address part of a CIDR. -->返回 CIDR 的 IP 地址部分的地址族。</td>
</tr>
<tr>
  <td><tt>cidr('::1/128').ip()</tt></td>
  <td><!-- Returns the IP address part of an IPv6 CIDR. -->返回 IPv6 CIDR 的 IP 地址部分。</td>
</tr>
<tr>
  <td><tt>cidr('::1/128').ip().family()</tt></td>
  <td><!-- Returns the family of the IP address part of an IPv6 CIDR. -->返回 IPv6 CIDR 的 IP 地址部分的地址族。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24').masked()</tt></td>
  <td><!-- Returns the canonical form of a CIDR network. -->返回 CIDR 网络的规范形式。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24').masked()</tt></td>
  <td><!-- Returns the canonical form of a CIDR network, masking non-prefix bits. -->返回 CIDR 网络的规范形式，掩蔽非前缀位。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/24') == cidr('192.168.0.0/24').masked()</tt></td>
  <td><!-- Compares a CIDR to its canonical form (already canonical). -->将 CIDR 与其规范形式进行比较（已是规范形式）。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.1/24') == cidr('192.168.0.1/24').masked()</tt></td>
  <td><!-- Compares a CIDR to its canonical form (not canonical). -->将 CIDR 与其规范形式进行比较（非规范形式）。</td>
</tr>
<tr>
  <td><tt>cidr('192.168.0.0/16').prefixLength()</tt></td>
  <td><!-- Returns the prefix length of an IPv4 CIDR. -->返回 IPv4 CIDR 的前缀长度。</td>
</tr>
<tr>
  <td><tt>cidr('::1/128').prefixLength()</tt></td>
  <td><!-- Returns the prefix length of an IPv6 CIDR. -->返回 IPv6 CIDR 的前缀长度。</td>
</tr>
</tbody>
</table>

更多信息请查阅 Go 文档：
[Kubernetes CIDR 库](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#CIDR)。

<!--
### Kubernetes authorizer library

For CEL expressions in the API where a variable of type `Authorizer` is available,
the authorizer may be used to perform authorization checks for the principal
(authenticated user) of the request.

API resource checks are performed as follows:
-->
### Kubernetes 鉴权组件库   {#kubernetes-authorizer-library}

在 API 中使用 CEL 表达式，可以使用类型为 `Authorizer` 的变量，
这个鉴权组件可用于对请求的主体（已认证用户）执行鉴权检查。

API 资源检查的过程如下：

<!--
1. Specify the group and resource to check: `Authorizer.group(string).resource(string) ResourceCheck`
1. Optionally call any combination of the following builder functions to further narrow the authorization check.
   Note that these functions return the receiver type and can be chained:
   - `ResourceCheck.subresource(string) ResourceCheck`
   - `ResourceCheck.namespace(string) ResourceCheck`
   - `ResourceCheck.name(string) ResourceCheck`
1. Call `ResourceCheck.check(verb string) Decision` to perform the authorization check.
1. Call `allowed() bool` or `reason() string` to inspect the result of the authorization check.
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

1. Specify only a path: `Authorizer.path(string) PathCheck`
1. Call `PathCheck.check(httpVerb string) Decision` to perform the authorization check.
1. Call `allowed() bool` or `reason() string` to inspect the result of the authorization check.
-->
对非资源访问的鉴权过程如下：

1. 仅指定路径：`Authorizer.path(string) PathCheck`。
1. 调用 `PathCheck.check(httpVerb string) Decision` 来执行鉴权检查。
1. 调用 `allowed() bool` 或 `reason() string` 来查验鉴权检查的结果。

<!--
To perform an authorization check for a service account:
-->
对于服务账号执行鉴权检查的方式：

- `Authorizer.serviceAccount(namespace string, name string) Authorizer`

<table>
<caption><!-- Examples of CEL expressions using URL library functions -->使用 URL 库函数的 CEL 表达式示例</caption>
<thead>
<tr>
  <th><!-- CEL Expression -->CEL 表达式</th>
  <th><!-- Purpose -->用途</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>authorizer.group('').resource('pods').namespace('default').check('create').allowed()</tt></td>
  <td><!-- Returns true if the principal (user or service account) is allowed create pods in the 'default' namespace. -->
  如果主体（用户或服务账号）被允许在 `default` 名字空间中创建 Pod，返回 true。</td>
</tr>
<tr>
  <td><tt>authorizer.path('/healthz').check('get').allowed()</tt></td>
  <td><!-- Checks if the principal (user or service account) is authorized to make HTTP GET requests to the /healthz API path. -->
  检查主体（用户或服务账号）是否有权限向 /healthz API 路径发出 HTTP GET 请求。</td>
</tr>
<tr>
  <td><tt>authorizer.serviceAccount('default', 'myserviceaccount').resource('deployments').check('delete').allowed()<tt></td>
  <td><!-- Checks if the service account is authorized to delete deployments. -->检查服务账号是否有权限删除 Deployment。</td>
</tr>
</tbody>
</table>

{{< feature-state state="alpha" for_k8s_version="v1.31" >}}

<!--
With the alpha `AuthorizeWithSelectors` feature enabled, field and label selectors can be added to authorization checks.
-->
启用 Alpha 级别的 `AuthorizeWithSelectors` 特性后，字段和标签选择算符可以被添加到鉴权检查中。

<table>
<caption><!-- Examples of CEL expressions using selector authorization functions -->使用选择算符鉴权函数的 CEL 表达式示例</caption>
<thead>
<tr>
  <th><!-- CEL Expression -->CEL 表达式</th>
  <th><!-- Purpose -->用途</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>authorizer.group('').resource('pods').fieldSelector('spec.nodeName=mynode').check('list').allowed()</tt></td>
  <td>
    <!-- Returns true if the principal (user or service account) is allowed
    to list pods with the field selector <tt>spec.nodeName=mynode</tt>. -->
    如果主体（用户或服务账号）被允许使用字段选择算符 <tt>spec.nodeName=mynode<tt> 列举 Pod，返回 true。
  </td>
</tr>
<tr>
  <td><tt>authorizer.group('').resource('pods').labelSelector('example.com/mylabel=myvalue').check('list').allowed()</tt></td>
  <td>
    <!-- Returns true if the principal (user or service account) is allowed
    to list pods with the label selector <tt>example.com/mylabel=myvalue</tt>. -->
    如果主体（用户或服务账号）被允许使用标签选择算符 <tt>example.com/mylabel=myvalue<tt> 列举 Pod，返回 true。
  </td>
</tr>
</tbody>
</table>

<!--
See the [Kubernetes Authz library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz)
and [Kubernetes AuthzSelectors library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors)
godoc for more information.
-->
更多信息请参阅 Go 文档：
[Kubernetes Authz library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz)
和 [Kubernetes AuthzSelectors library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors)。

<!--
### Kubernetes format library

The `format` library provides functions for validating common Kubernetes string formats.
This can be useful in the `messageExpression` of validation rules to provide more specific error messages.

The library provides `format()` functions for each named format, and a generic `format.named()` function.

- `format.named(string)` &rarr; `?Format`: Returns the `Format` object for the given format name, if it exists. Otherwise, returns `optional.none`.
- `format.<formatName>() -> Format`: Convenience functions for all the named formats are also available. For example, `format.dns1123Label()` returns the `Format` object for DNS-1123 labels.
- `<Format>.validate(string) -> list<string>?`: Validates the given string against the format. Returns `optional.none` if the string is valid, otherwise an optional containing a list of validation error strings.

**Available Formats:**

The following format names are supported:

<table>
<caption>Available formats for the format library</caption>
<thead>
<tr>
  <th>Format Name</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>dns1123Label</tt></td>
  <td>Validates if the string is a valid DNS-1123 label.</td>
</tr>
<tr>
  <td><tt>dns1123Subdomain</tt></td>
  <td>Validates if the string is a valid DNS-1123 subdomain.</td>
</tr>
<tr>
  <td><tt>dns1035Label</tt></td>
  <td>Validates if the string is a valid DNS-1035 label.</td>
</tr>
<tr>
  <td><tt>qualifiedName</tt></td>
  <td>Validates if the string is a valid qualified name.</td>
</tr>
<tr>
  <td><tt>dns1123LabelPrefix</tt></td>
  <td>Validates if the string is a valid DNS-1123 label prefix.</td>
</tr>
<tr>
  <td><tt>dns1123SubdomainPrefix</tt></td>
  <td>Validates if the string is a valid DNS-1123 subdomain prefix.</td>
</tr>
<tr>
  <td><tt>dns1035LabelPrefix</tt></td>
  <td>Validates if the string is a valid DNS-1035 label prefix.</td>
</tr>
<tr>
  <td><tt>labelValue</tt></td>
  <td>Validates if the string is a valid label value.</td>
</tr>
<tr>
  <td><tt>uri</tt></td>
  <td>Validates if the string is a valid URI. Uses the same pattern as `isURL`, but returns an error list.</td>
</tr>
<tr>
  <td><tt>uuid</tt></td>
  <td>Validates if the string is a valid UUID.</td>
</tr>
<tr>
  <td><tt>byte</tt></td>
  <td>Validates if the string is a valid base64 encoded string.</td>
</tr>
<tr>
  <td><tt>date</tt></td>
  <td>Validates if the string is a valid date in `YYYY-MM-DD` format.</td>
</tr>
<tr>
  <td><tt>datetime</tt></td>
  <td>Validates if the string is a valid datetime in RFC3339 format.</td>
</tr>
</tbody>
</table>

**Examples:**

<table>
<caption>Examples of CEL expressions using format library functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>!format.dns1123Label().validate(self.metadata.name).hasValue()</tt></td>
  <td>A validation rule that checks if an object's name is a valid DNS-1123 label.</td>
</tr>
<tr>
  <td><tt>format.dns1123Label().validate(self.metadata.name).orValue([]).join("\\n")</tt></td>
  <td>A `messageExpression` that returns specific validation errors for a field. If the field is valid, `validate` returns `optional.none`, and `orValue` provides an empty list, resulting in an empty string.</td>
</tr>
</tbody>
</table>

See the [Kubernetes Format library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Format) godoc for more information.
-->
### Kubernetes 格式库   {#kubernetes-format-library}

`format` 库提供用于验证常见 Kubernetes 字符串格式的函数。
这在校验规则的 `messageExpression` 中可用于提供更具体的错误消息。

该库为每个命名格式提供 `format()` 函数，以及一个通用的 `format.named()` 函数。

- `format.named(string)` &rarr; `?Format`：返回给定格式名称对应的 `Format` 对象（如果存在），否则返回 `optional.none`。
- `format.<formatName>() -> Format`：同时提供所有命名格式的便捷函数。例如，`format.dns1123Label()` 返回 DNS-1123 标签对应的 `Format` 对象。
- `<Format>.validate(string) -> list<string>?`：根据格式验证给定字符串。如果字符串有效，返回 `optional.none`；否则返回包含验证错误字符串列表的 optional。

**可用格式：**

支持以下格式名称：

<table>
<caption><!-- Available formats for the format library -->格式库可用的格式</caption>
<thead>
<tr>
  <th><!-- Format Name -->格式名称</th>
  <th><!-- Description -->描述</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>dns1123Label</tt></td>
  <td><!-- Validates if the string is a valid DNS-1123 label. -->验证字符串是否是有效的 DNS-1123 标签。</td>
</tr>
<tr>
  <td><tt>dns1123Subdomain</tt></td>
  <td><!-- Validates if the string is a valid DNS-1123 subdomain. -->验证字符串是否是有效的 DNS-1123 子域。</td>
</tr>
<tr>
  <td><tt>dns1035Label</tt></td>
  <td><!-- Validates if the string is a valid DNS-1035 label. -->验证字符串是否是有效的 DNS-1035 标签。</td>
</tr>
<tr>
  <td><tt>qualifiedName</tt></td>
  <td><!-- Validates if the string is a valid qualified name. -->验证字符串是否是有效的限定名称。</td>
</tr>
<tr>
  <td><tt>dns1123LabelPrefix</tt></td>
  <td><!-- Validates if the string is a valid DNS-1123 label prefix. -->验证字符串是否是有效的 DNS-1123 标签前缀。</td>
</tr>
<tr>
  <td><tt>dns1123SubdomainPrefix</tt></td>
  <td><!-- Validates if the string is a valid DNS-1123 subdomain prefix. -->验证字符串是否是有效的 DNS-1123 子域前缀。</td>
</tr>
<tr>
  <td><tt>dns1035LabelPrefix</tt></td>
  <td><!-- Validates if the string is a valid DNS-1035 label prefix. -->验证字符串是否是有效的 DNS-1035 标签前缀。</td>
</tr>
<tr>
  <td><tt>labelValue</tt></td>
  <td><!-- Validates if the string is a valid label value. -->验证字符串是否是有效的标签值。</td>
</tr>
<tr>
  <td><tt>uri</tt></td>
  <td><!-- Validates if the string is a valid URI. Uses the same pattern as `isURL`, but returns an error list. -->验证字符串是否是有效的 URI。使用与 `isURL` 相同的模式，但返回错误列表。</td>
</tr>
<tr>
  <td><tt>uuid</tt></td>
  <td><!-- Validates if the string is a valid UUID. -->验证字符串是否是有效的 UUID。</td>
</tr>
<tr>
  <td><tt>byte</tt></td>
  <td><!-- Validates if the string is a valid base64 encoded string. -->验证字符串是否是有效的 base64 编码字符串。</td>
</tr>
<tr>
  <td><tt>date</tt></td>
  <td><!-- Validates if the string is a valid date in `YYYY-MM-DD` format. -->验证字符串是否是 `YYYY-MM-DD` 格式的有效日期。</td>
</tr>
<tr>
  <td><tt>datetime</tt></td>
  <td><!-- Validates if the string is a valid datetime in RFC3339 format. -->验证字符串是否是 RFC3339 格式的有效日期时间。</td>
</tr>
</tbody>
</table>

**示例：**

<table>
<caption><!-- Examples of CEL expressions using format library functions -->使用格式库函数的 CEL 表达式示例</caption>
<thead>
<tr>
  <th><!-- CEL Expression -->CEL 表达式</th>
  <th><!-- Purpose -->用途</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>!format.dns1123Label().validate(self.metadata.name).hasValue()</tt></td>
  <td><!-- A validation rule that checks if an object's name is a valid DNS-1123 label. -->校验规则，检查对象的名称是否是有效的 DNS-1123 标签。</td>
</tr>
<tr>
  <td><tt>format.dns1123Label().validate(self.metadata.name).orValue([]).join("\\n")</tt></td>
  <td><!-- A `messageExpression` that returns specific validation errors for a field. If the field is valid, `validate` returns `optional.none`, and `orValue` provides an empty list, resulting in an empty string. -->返回字段具体校验错误的 `messageExpression`。如果字段有效，`validate` 返回 `optional.none`，`orValue` 提供空列表，从而得到空字符串。</td>
</tr>
</tbody>
</table>

更多信息请查阅 Go 文档：
[Kubernetes 格式库](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Format)。

<!--
### Kubernetes quantity library

Kubernetes 1.28 adds support for manipulating quantity strings (ex 1.5G, 512k, 20Mi)
-->
### Kubernetes 数量库   {#kubernetes-quantity-library}

Kubernetes 1.28 添加了对数量字符串（例如 1.5G、512k、20Mi）的操作支持。

<!--
- `isQuantity(string)` checks if a string is a valid Quantity according to
  [Kubernetes' resource.Quantity](https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity).
- `quantity(string) Quantity` converts a string to a Quantity or results in an error if the
  string is not a valid quantity.
-->
- `isQuantity(string)` 根据 [Kubernetes 的 resource.Quantity](https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity)，
  检查字符串是否是有效的 Quantity。
- `quantity(string) Quantity` 将字符串转换为 Quantity，如果字符串不是有效的数量，则会报错。

<!--
Once parsed via the `quantity` function, the resulting Quantity object has the
following library of member functions:
-->
一旦通过 `quantity` 函数解析，得到的 Quantity 对象将具有以下成员函数库：

<table>
<caption><!-- Available member functions of a Quantity -->Quantity 的可用成员函数</caption>
<thead>
<tr>
  <th><!-- Member Function -->成员函数</th>
  <th><!-- CEL Return Value -->CEL 返回值</th>
  <th><!-- Description -->描述</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isInteger()</tt></td>
  <td>bool</td>
  <td><!-- Returns true if and only if asInteger is safe to call without an error -->
  仅当 asInteger 可以被安全调用且不出错时，才返回 true</td>
</tr>
<tr>
  <td><tt>asInteger()</tt></td>
  <td>int</td>
  <td>
    <!-- Returns a representation of the current value as an <tt>int64</tt> if possible
    or results in an error if conversion would result in overflowor loss of precision. -->
    将当前值作为 int64 的表示返回，如果转换会导致溢出或精度丢失，则会报错
  </td>
</tr>
<tr>
  <td><tt>asApproximateFloat()</tt></td>
  <td>float</td>
  <td>
    <!-- Returns a <tt>float64</tt> representation of the quantity which may lose precision.
    If the value of the quantity is outside the range of a <tt>float64</tt>,
    <tt>+Inf/-Inf</tt> will be returned. -->
    返回数量的 float64 表示，可能会丢失精度。如果数量的值超出了 float64 的范围，则返回 +Inf/-Inf
    </td>
</tr>
<tr>
  <td><tt>sign()</tt></td>
  <td>int</td>
  <td>
    <!-- Returns <tt>1</tt> if the quantity is positive, <tt>-1</tt> if it is negative.
    <tt>0</tt> if it is zero. -->如果数量为正，则返回 1；如果数量为负，则返回 -1；如果数量为零，则返回 0
  </td>
</tr>
<tr>
  <td><tt>add(&lt;Quantity&gt;)</tt></td>
  <td>Quantity</td>
  <td><!-- Returns sum of two quantities -->返回两个数量的和</td>
</tr>
<tr>
  <td><tt>add(&lt;int&gt;)</tt></td>
  <td>Quantity</td>
  <td><!-- Returns sum of quantity and an integer -->返回数量和整数的和</td>
  <td>
<tr>
  <td><tt>sub(&lt;Quantity&gt;)</tt></td>
  <td>Quantity</td>
  <td><!-- Returns difference between two quantities -->返回两个数量的差</td>
</tr>
<tr>
  <td><tt>sub(&lt;int&gt;)</tt></td>
  <td>Quantity</td>
  <td><!-- Returns difference between a quantity and an integer -->返回数量减去整数的差</td>
</tr>
<tr>
  <td><tt>isLessThan(&lt;Quantity&gt;)</tt></td>
  <td>bool</td>
  <td><!-- Returns true if and only if the receiver is less than the operand -->如果接收值小于操作数，则返回 true</td>
</tr>
<tr>
  <td><tt>isGreaterThan(&lt;Quantity&gt;)</tt></td>
  <td>bool</td>
  <td><!-- Returns true if and only if the receiver is greater than the operand -->如果接收值大于操作数，则返回 true</td>
</tr>
<tr>
  <td><tt>compareTo(&lt;Quantity&gt;)</tt></td>
  <td>int</td>
  <td>
    <!-- Compares receiver to operand and returns 0 if they are equal,
    1 if the receiver is greater, or -1 if the receiver is less than the operand -->
    将接收值与操作数进行比较，如果它们相等，则返回 0；如果接收值大于操作数，则返回 1；如果接收值小于操作数，则返回 -1
  </td>
</tr>
</tbody>
</table>

<!--
Examples:
-->
例如：

<table>
<caption><!-- Examples of CEL expressions using URL library functions -->使用 URL 库函数的 CEL 表达式示例</caption>
<thead>
<tr>
  <th><!-- CEL Expression -->CEL 表达式</th>
  <th><!-- Purpose -->用途</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>quantity("500000G").isInteger()</tt></td>
  <td><!-- Test if conversion to integer would throw an error -->测试转换为整数是否会报错</td>
</tr>
<tr>
  <td><tt>quantity("50k").asInteger()</tt></td>
  <td><!-- Precise conversion to integer -->精确转换为整数</td>
</tr>
<tr>
  <td><tt>quantity("9999999999999999999999999999999999999G").asApproximateFloat()</tt></td>
  <td><!-- Lossy conversion to float -->松散转换为浮点数</td>
</tr>
<tr>
  <td><tt>quantity("50k").add(quantity("20k"))</tt></td>
  <td><!-- Add two quantities -->两个数量相加</td>
</tr>
<tr>
  <td><tt>quantity("50k").sub(20000)</tt></td>
  <td><!-- Subtract an integer from a quantity -->从数量中减去整数</td>
</tr>
<tr>
  <td><tt>quantity("50k").add(20).sub(quantity("100k")).sub(-50000)</tt></td>
  <td><!-- Chain adding and subtracting integers and quantities -->链式相加和减去整数和数量</td>
</tr>
<tr>
  <td><tt>quantity("200M").compareTo(quantity("0.2G"))</tt></td>
  <td><!-- Compare two quantities -->比较两个数量</td>
</tr>
<tr>
  <td><tt>quantity("150Mi").isGreaterThan(quantity("100Mi"))</tt></td>
  <td><!-- Test if a quantity is greater than the receiver -->测试数量是否大于接收值</td>
</tr>
<tr>
  <td><tt>quantity("50M").isLessThan(quantity("100M"))</tt></td>
  <td><!-- Test if a quantity is less than the receiver -->测试数量是否小于接收值</td>
</tr>
</tbody>
</table>

<!--
### Kubernetes semver library

Kubernetes v1.34 adds support for parsing and comparing strings that follow the Semantic Versioning 2.0.0 specification.
Refer to the [semver.org](https://semver.org/) documentation for information on accepted patterns.

- `isSemver(string)` checks if a string is a valid semantic version.
- `semver(string)` converts a string to a Semver object or results in an error.

An optional boolean `normalize` argument can be passed to `isSemver` and `semver`. If `true`, normalization removes any "v" prefix, adds a 0 minor and patch numbers to versions with only major or major.minor components specified, and removes any leading 0s.

Once parsed via the `semver` function, the resulting Semver object has the
following library of member functions:

<table>
<caption>Available member functions of a Semver object</caption>
<thead>
<tr>
  <th>Member Function</th>
  <th>CEL Return Value</th>
  <th>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>major()</tt></td>
  <td>int</td>
  <td>Returns the major version number.</td>
</tr>
<tr>
  <td><tt>minor()</tt></td>
  <td>int</td>
  <td>Returns the minor version number.</td>
</tr>
<tr>
  <td><tt>patch()</tt></td>
  <td>int</td>
  <td>Returns the patch version number.</td>
</tr>
<tr>
  <td><tt>isLessThan(&lt;Semver&gt;)</tt></td>
  <td>bool</td>
  <td>Returns true if and only if the receiver is less than the operand.</td>
</tr>
<tr>
  <td><tt>isGreaterThan(&lt;Semver&gt;)</tt></td>
  <td>bool</td>
  <td>Returns true if and only if the receiver is greater than the operand.</td>
</tr>
<tr>
  <td><tt>compareTo(&lt;Semver&gt;)</tt></td>
  <td>int</td>
  <td>
    Compares receiver to operand and returns 0 if they are equal,
    1 if the receiver is greater, or -1 if the receiver is less than the operand.
  </td>
</tr>
</tbody>
</table>

Examples:

<table>
<caption>Examples of CEL expressions using semver library functions</caption>
<thead>
<tr>
  <th>CEL Expression</th>
  <th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isSemver('1.0.0')</tt></td>
  <td>Returns true for a valid Semver string.</td>
</tr>
<tr>
  <td><tt>isSemver('v1.0', true)</tt></td>
  <td>Returns true for a normalizable Semver string.</td>
</tr>
<tr>
  <td><tt>semver('1.2.3').major()</tt></td>
  <td>Returns the major version of a Semver.</td>
</tr>
<tr>
  <td><tt>semver('1.2.3').compareTo(semver('2.0.0')) &lt; 0</tt></td>
  <td>Compare two Semver strings.</td>
</tr>
</tbody>
</table>

See the [Kubernetes Semver library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#SemverLib) godoc for more information.
-->
### Kubernetes semver 库   {#kubernetes-semver-library}

Kubernetes v1.34 增加了对遵循语义化版本 2.0.0 规范的字符串进行解析和比较的支持。
关于可接受模式的详细信息，请参阅 [semver.org](https://semver.org/) 文档。

- `isSemver(string)` 检查一个字符串是否是有效的语义化版本。
- `semver(string)` 将字符串转换为 Semver 对象；如果出错则返回错误。

可以向 `isSemver` 和 `semver` 传递一个可选的布尔参数 `normalize`。如果为 `true`，规范化会移除任何 "v" 前缀，为仅指定了 major 或 major.minor 组件的版本补充 0 的 minor 和 patch 数字，并移除任何前导 0。

通过 `semver` 函数解析后，生成的 Semver 对象具有以下成员函数库：

<table>
<caption><!-- Available member functions of a Semver object -->Semver 对象可用的成员函数</caption>
<thead>
<tr>
  <th><!-- Member Function -->成员函数</th>
  <th><!-- CEL Return Value -->CEL 返回值</th>
  <th><!-- Description -->描述</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>major()</tt></td>
  <td>int</td>
  <td><!-- Returns the major version number. -->返回主版本号。</td>
</tr>
<tr>
  <td><tt>minor()</tt></td>
  <td>int</td>
  <td><!-- Returns the minor version number. -->返回次版本号。</td>
</tr>
<tr>
  <td><tt>patch()</tt></td>
  <td>int</td>
  <td><!-- Returns the patch version number. -->返回补丁版本号。</td>
</tr>
<tr>
  <td><tt>isLessThan(&lt;Semver&gt;)</tt></td>
  <td>bool</td>
  <td><!-- Returns true if and only if the receiver is less than the operand. -->当且仅当接收值小于操作数时返回 true。</td>
</tr>
<tr>
  <td><tt>isGreaterThan(&lt;Semver&gt;)</tt></td>
  <td>bool</td>
  <td><!-- Returns true if and only if the receiver is greater than the operand. -->当且仅当接收值大于操作数时返回 true。</td>
</tr>
<tr>
  <td><tt>compareTo(&lt;Semver&gt;)</tt></td>
  <td>int</td>
  <td><!-- Compares receiver to operand and returns 0 if they are equal, 1 if the receiver is greater, or -1 if the receiver is less than the operand. -->将接收值与操作数比较，相等时返回 0，接收值更大时返回 1，接收值更小时返回 -1。</td>
</tr>
</tbody>
</table>

示例：

<table>
<caption><!-- Examples of CEL expressions using semver library functions -->使用 semver 库函数的 CEL 表达式示例</caption>
<thead>
<tr>
  <th><!-- CEL Expression -->CEL 表达式</th>
  <th><!-- Purpose -->用途</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>isSemver('1.0.0')</tt></td>
  <td><!-- Returns true for a valid Semver string. -->对有效的 Semver 字符串返回 true。</td>
</tr>
<tr>
  <td><tt>isSemver('v1.0', true)</tt></td>
  <td><!-- Returns true for a normalizable Semver string. -->对可规范化的 Semver 字符串返回 true。</td>
</tr>
<tr>
  <td><tt>semver('1.2.3').major()</tt></td>
  <td><!-- Returns the major version of a Semver. -->返回 Semver 的主版本号。</td>
</tr>
<tr>
  <td><tt>semver('1.2.3').compareTo(semver('2.0.0')) &lt; 0</tt></td>
  <td><!-- Compare two Semver strings. -->比较两个 Semver 字符串。</td>
</tr>
</tbody>
</table>

更多信息请查阅 Go 文档：
[Kubernetes semver 库](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#SemverLib)。

<!--
## Type checking

CEL is a [gradually typed language](https://github.com/google/cel-spec/blob/master/doc/langdef.md#gradual-type-checking).

Some Kubernetes API fields contain fully type checked CEL expressions. For example,
[CustomResourceDefinitions Validation Rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
are fully type checked.
-->
## 类型检查   {#type-checking}

CEL 是一种[逐渐类型化的语言](https://github.com/google/cel-spec/blob/master/doc/langdef.md#gradual-type-checking)。

一些 Kubernetes API 字段包含完全经过类型检查的 CEL 表达式。
例如，[CustomResourceDefinition 验证规则](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)就是完全经过类型检查的。

<!--
Some Kubernetes API fields contain partially type checked CEL expressions. A
partially type checked expression is an expressions where some of the variables
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
例如在 [ValidatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)
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
## 类型系统集成   {#type-system-integration}

<table>
<caption><!-- Table showing the relationship between OpenAPIv3 types and CEL types -->
表格显示了 OpenAPIv3 类型和 CEL 类型之间的关系</caption>
<thead>
<tr>
  <th><!-- OpenAPIv3 type -->OpenAPIv3 类型</th>
  <th><!-- CEL type -->CEL 类型</th>
</tr>
</thead>
<tbody>
<tr>
  <td><!-- 'object' with Properties -->设置了 properties 的 'object'</td>
  <td>
    <!-- object / "message type"
    (<tt>type(&lt;object&gt;)</tt> evaluates to
     <tt>selfType&lt;uniqueNumber&gt;.path.to.object.from.self</tt>) -->
    object / "message type"（<tt>type(<object>)<tt> 评估为 <tt>selfType<uniqueNumber>.path.to.object.from.self<tt>）
  </td>
</tr>
<tr>
  <td><!-- 'object' with <tt>additionalProperties</tt> -->设置了 <tt>additionalProperties</tt> 的 'object'</td>
  <td>map</td>
</tr>
<tr>
  <td><!-- 'object' with <tt>x-kubernetes-embedded-type</tt> -->
  设置了 <tt>x-kubernetes-embedded-type</tt> 的 'object'</td>
  <td>
    <!-- object / "message type", 'apiVersion', 'kind', 'metadata.name'
    and 'metadata.generateName' are implicitly included in schema -->
    object / "message type"，'apiVersion'、'kind'、'metadata.name' 和
    'metadata.generateName' 被隐式包含在模式中
  </td>
</tr>
<tr>
  <td><!-- 'object' with x-kubernetes-preserve-unknown-fields -->
  设置了 x-kubernetes-preserve-unknown-fields 的 'object'</td>
  <td><!-- object / "message type", unknown fields are NOT accessible in CEL expression -->
  object / "message type"，CEL 表达式中不可访问的未知字段</td>
</tr>
<tr>
  <td><tt>x-kubernetes-int-or-string</tt></td>
  <td>
    <!-- Union of <tt>int</tt> or <tt>string</tt>,
    <tt>self.intOrString < 100 | self.intOrString == '50%'</tt>
    evaluates to true for both <tt>50</tt> and <tt>"50%"</tt> -->
    int 或 string 的并集，<tt>self.intOrString < 100 || self.intOrString == '50%'<tt>
    对于 50 和 "50%" 都评估为 true
  </td>
</tr>
<tr>
  <td>'array'</td>
  <td>list</td>
</tr>
<tr>
  <td><!-- 'array' with <tt>x-kubernetes-list-type=map</tt> -->设置了 <tt>x-kubernetes-list-type=map</tt> 的 'array'</td>
  <td><!-- list with map based Equality & unique key guarantees -->list，具有基于 Equality 和唯一键保证的 map</td>
</tr>
<tr>
  <td><!-- 'array' with <tt>x-kubernetes-list-type=set</tt> -->设置了 <tt>x-kubernetes-list-type=set</tt> 的 'array'</td>
  <td><!-- list with set based Equality & unique entry guarantees -->list，具有基于 Equality 和唯一条目保证的 set</td>
</tr>
<tr>
  <td>'boolean'</td>
  <td>boolean</td>
</tr>
<tr>
  <td><!-- 'number' (all formats) -->'number' (所有格式)</td>
  <td>double</td>
</tr>
<tr>
  <td><!-- 'integer' (all formats) -->'integer' (所有格式)</td>
  <td>int (64)</td>
</tr>
<tr>
  <td><!-- <i>no equivalent</i> --><i>非等价</i></td>
  <td>uint (64)</td>
</tr>
<tr>
  <td>'null'</td>
  <td>null_type</td>
</tr>
<tr>
  <td>'string'</td>
  <td>string</td>
</tr>
<tr>
  <td><!-- 'string' with format=byte (base64 encoded) -->设置了 format=byte 的 'string'（以 base64 编码）</td>
  <td>bytes</td>
</tr>
<tr>
  <td><!-- 'string' with format=date -->设置了 format=date 的 'string'</td>
  <td>timestamp (<tt>google.protobuf.Timestamp</tt>)</td>
</tr>
<tr>
  <td><!-- 'string' with format=datetime -->设置了 format=datetime 的 'string'</td>
  <td>timestamp (<tt>google.protobuf.Timestamp</tt>)</td>
</tr>
<tr>
  <td><!-- 'string' with format=duration -->设置了 format=duration 的 'string'</td>
  <td>duration (<tt>google.protobuf.Duration</tt>)</td>
</tr>
</tbody>
</table>

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
`set`
: `X + Y` performs a union where the array positions of all elements in
  `X` are preserved and non-intersecting elements in `Y` are appended, retaining
  their partial order.

`map`
: `X + Y` performs a merge where the array positions of all keys in `X`
  are preserved but the values are overwritten by values in `Y` when the key
  sets of `X` and `Y` intersect. Elements in `Y` with non-intersecting keys are
  appended, retaining their partial order.
-->
`set`
: `X + Y` 执行并集操作，保留 `X` 中所有元素的数组位置，
  将 `Y` 中非交集元素追加到 `X` 中，保留它们的部分顺序。

`map`
: `X + Y` 执行合并操作，保留 `X` 中所有键的数组位置，
  但是当 `X` 和 `Y` 的键集相交时，将 `Y` 中的值覆盖 `X` 中的值。
  将 `Y` 中非交集键的元素附加到 `X` 中，保留它们的部分顺序。

<!--
## Escaping

Only Kubernetes resource property names of the form
`[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible from CEL. Accessible property
names are escaped according to the following rules when accessed in the
expression:
-->
## 转义   {#escaping}

仅形如 `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` 的 Kubernetes 资源属性名可以从 CEL 中访问。
当在表达式中访问可访问的属性名时，会根据以下规则进行转义：

<table>
<caption><!-- Table of CEL identifier escaping rules -->CEL 标识符转义规则表</caption>
<thead>
<tr>
  <th><!-- escape sequence -->转义序列</th>
  <th><!-- property name equivalent -->等价的属性名</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>__underscores__</tt></td>
  <td><tt>__</tt></td>
</tr>
<tr>
  <td><tt>__dot__</tt></td>
  <td><tt>.</tt></td>
</tr>
<tr>
  <td><tt>__dash__</tt></td>
  <td><tt>-</tt></td>
</tr>
<tr>
  <td><tt>__slash__</tt></td>
  <td><tt>/</tt></td>
</tr>
<tr>
  <td><tt>__{keyword}__</tt></td>
  <td>
    <a href="https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#syntax">
      <!-- CEL <b>RESERVED</b> keyword -->CEL <b>保留的</b>关键字
    </a>
  </td>
</tr>
</tbody>
</table>

<!--
When you escape any of CEL's **RESERVED** keywords you need to match the exact property name
use the underscore escaping
(for example, `int` in the word `sprint` would not be escaped and nor would it need to be).

Examples on escaping:
-->
当你需要转义 CEL 的任一 **保留的** 关键字时，你需要使用下划线转义来完全匹配属性名
（例如，`sprint` 这个单词中的 `int` 不会被转义，也不需要被转义）。

转义示例：

<table>
<caption><!-- Examples escaped CEL identifiers -->转义的 CEL 标识符例子</caption>
<thead>
<tr>
  <th><!-- property name -->属性名称</th>
  <th><!-- rule with escaped property name -->带有转义的属性名称的规则</th>
</tr>
</thead>
<tbody>
<tr>
  <td><tt>namespace</tt></td>
  <td><tt>self.__namespace__ &gt; 0</tt></td>
</tr>
<tr>
  <td><tt>x-prop</tt></td>
  <td><tt>self.x__dash__prop &gt; 0</tt></td>
</tr>
<tr>
  <td><tt>redact_d</tt></td>
  <td><tt>self.redact__underscores__d &gt; 0</tt></td>
</tr>
<tr>
  <td><tt>string</tt></td>
  <td><tt>self.startsWith('kube')</tt></td>
</tr>
</tbody>
</table>

<!--
## Resource constraints

CEL is non-Turing complete and offers a variety of production safety controls to
limit execution time. CEL's _resource constraint_ features provide feedback to
developers about expression complexity and help protect the API server from
excessive resource consumption during evaluation. CEL's resource constraint
features are used to prevent CEL evaluation from consuming excessive API server
resources.
-->
## 资源约束   {#resource-constraints}

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
### 运行时成本预算   {#runtime-cost-budget}

所有由 Kubernetes 评估的 CEL 表达式都受到运行时成本预算的限制。
运行时成本预算是通过在解释 CEL 表达式时增加成本单元计数器来计算实际 CPU 利用率的估算值。
如果 CEL 解释器执行的指令太多，将超出运行时成本预算，表达式的执行将停止，并将出现错误。

<!--
Some Kubernetes resources define an additional runtime cost budget that bounds
the execution of multiple expressions. If the sum total of the cost of
expressions exceed the budget, execution of the expressions will be halted, and
an error will result. For example the validation of a custom resource has a
_per-validation_ runtime cost budget for all
[Validation Rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
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
CEL expressions written to the API resource will be evaluated at runtime without
exceeding the runtime cost budget.
-->
### 估算的成本限制   {#estimated-cost-limits}

对于某些 Kubernetes 资源，API 服务器还可能检查 CEL 表达式的最坏情况估计运行时间是否过于昂贵而无法执行。
如果是，则 API 服务器会拒绝包含 CEL 表达式的创建或更新操作，以防止 CEL 表达式被写入 API 资源。
此特性提供了更强的保证，即写入 API 资源的 CEL 表达式将在运行时进行评估，而不会超过运行时成本预算。
