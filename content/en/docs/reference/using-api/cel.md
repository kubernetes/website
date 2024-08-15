---
title: Common Expression Language in Kubernetes
reviewers:
- jpbetz
- cici37
content_type: concept
weight: 35
min-kubernetes-server-version: 1.25
---

<!-- overview -->

The [Common Expression Language (CEL)](https://github.com/google/cel-go) is used
in the Kubernetes API to declare validation rules, policy rules, and other
constraints or conditions.

CEL expressions are evaluated directly in the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}, making CEL a
convenient alternative to out-of-process mechanisms, such as webhooks, for many
extensibility use cases. Your CEL expressions continue to execute so long as the
control plane's API server component remains available.

<!-- body -->

## Language overview

The [CEL
language](https://github.com/google/cel-spec/blob/master/doc/langdef.md) has a
straightforward syntax that is similar to the expressions in C, C++, Java,
JavaScript and Go.

CEL was designed to be embedded into applications. Each CEL "program" is a
single expression that evaluates to a single value. CEL expressions are
typically short "one-liners" that inline well into the string fields of Kubernetes
API resources.

Inputs to a CEL program are "variables". Each Kubernetes API field that contains
CEL declares in the API documentation which variables are available to use for
that field. For example, in the `x-kubernetes-validations[i].rules` field of
CustomResourceDefinitions, the `self` and `oldSelf` variables are available and
refer to the previous and current state of the custom resource data to be
validated by the CEL expression. Other Kubernetes API fields may declare
different variables. See the API documentation of the API fields to learn which
variables are available for that field.

Example CEL expressions:

{{< table caption="Examples of CEL expressions and the purpose of each" >}}
| Rule                                                                               | Purpose                                                                           |
|------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| `self.minReplicas <= self.replicas && self.replicas <= self.maxReplicas`           | Validate that the three fields defining replicas are ordered appropriately        |
| `'Available' in self.stateCounts`                                                  | Validate that an entry with the 'Available' key exists in a map                   |
| `(self.list1.size() == 0) != (self.list2.size() == 0)`                             | Validate that one of two lists is non-empty, but not both                         |
| `self.envars.filter(e, e.name = 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$'))`  | Validate the 'value' field of a listMap entry where key field 'name' is 'MY_ENV'  |
| `has(self.expired) && self.created + self.ttl < self.expired`                      | Validate that 'expired' date is after a 'create' date plus a 'ttl' duration       |
| `self.health.startsWith('ok')`                                                     | Validate a 'health' string field has the prefix 'ok'                              |
| `self.widgets.exists(w, w.key == 'x' && w.foo < 10)`                               | Validate that the 'foo' property of a listMap item with a key 'x' is less than 10 |
| `type(self) == string ? self == '99%' : self == 42`                                | Validate an int-or-string field for both the int and string cases                 |
| `self.metadata.name == 'singleton'`                                                | Validate that an object's name matches a specific value (making it a singleton)   |
| `self.set1.all(e, !(e in self.set2))`                                              | Validate that two listSets are disjoint                                           |
| `self.names.size() == self.details.size() && self.names.all(n, n in self.details)` | Validate the 'details' map is keyed by the items in the 'names' listSet           |
| `self.details.all(key, key.matches('^[a-zA-Z]*$'))`                                | Validate the keys of the 'details' map                                            |
| `self.details.all(key, self.details[key].matches('^[a-zA-Z]*$'))`                  | Validate the values of the 'details' map                                          |
{{< /table >}}

## CEL options, language features, and libraries

CEL is configured with the following options, libraries and language features, introduced at the specified Kubernetes versions:

| CEL option, library or language feature                                                                                | Included                                                                                                                                  | Availablity               |
|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| [Standard macros](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros)                                | `has`, `all`, `exists`, `exists_one`, `map`, `filter`                                                                                     | All Kubernetes versions   |
| [Standard functions](https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions)       | See [official list of standard definitions](https://github.com/google/cel-spec/blob/master/doc/langdef.md#list-of-standard-definitions)   | All Kubernetes versions   |
| [Homogeneous Aggregate Literals](https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#HomogeneousAggregateLiterals) |                                                                                                                                           | All Kubernetes versions   |
| [Default UTC Time Zone](https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#DefaultUTCTimeZone)                    |                                                                                                                                           | All Kubernetes versions   |
| [Eagerly Validate Declarations](https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#EagerlyValidateDeclarations)   |                                                                                                                                           | All Kubernetes versions   |
| [extended strings library](https://pkg.go.dev/github.com/google/cel-go/ext#Strings), Version 1                         | `charAt`, `indexOf`, `lastIndexOf`, `lowerAscii`, `upperAscii`, `replace`, `split`, `join`, `substring`, `trim`                           | All Kubernetes versions   |
| Kubernetes list library                                                                                                | See [Kubernetes list library](#kubernetes-list-library)                                                                                   | All Kubernetes versions   |
| Kubernetes regex library                                                                                               | See [Kubernetes regex library](#kubernetes-regex-library)                                                                                 | All Kubernetes versions   |
| Kubernetes URL library                                                                                                 | See [Kubernetes URL library](#kubernetes-url-library)                                                                                     | All Kubernetes versions   |
| Kubernetes authorizer library                                                                                          | See [Kubernetes authorizer library](#kubernetes-authorizer-library)                                                                       | All Kubernetes versions   |
| Kubernetes quantity library                                                                                            | See [Kubernetes quantity library](#kubernetes-quantity-library)                                                                           | Kubernetes versions 1.29+ |
| CEL optional types                                                                                                     | See [CEL optional types](https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#OptionalTypes)                                           | Kubernetes versions 1.29+ |
| CEL CrossTypeNumericComparisons                                                                                        | See [CEL CrossTypeNumericComparisons](https://pkg.go.dev/github.com/google/cel-go@v0.17.4/cel#CrossTypeNumericComparisons)                | Kubernetes versions 1.29+ |

CEL functions, features and language settings support Kubernetes control plane
rollbacks. For example, _CEL Optional Values_ was introduced at Kubernetes 1.29
and so only API servers at that version or newer will accept write requests to
CEL expressions that use _CEL Optional Values_. However, when a cluster is
rolled back to Kubernetes 1.28 CEL expressions using "CEL Optional Values" that
are already stored in API resources will continue to evaluate correctly.

## Kubernetes CEL libraries

In additional to the CEL community libraries, Kubernetes includes CEL libraries
that are available everywhere CEL is used in Kubernetes.

### Kubernetes list library

The list library includes `indexOf` and `lastIndexOf`, which work similar to the
strings functions of the same names. These functions either the first or last
positional index of the provided element in the list.

The list library also includes `min`, `max` and `sum`. Sum is supported on all
number types as well as the duration type. Min and max are supported on all
comparable types.

`isSorted` is also provided as a convenience function and is supported on all
comparable types.

Examples:

{{< table caption="Examples of CEL expressions using list library functions" >}}
| CEL Expression                                                                     | Purpose                                                   |
|------------------------------------------------------------------------------------|-----------------------------------------------------------|
| `names.isSorted()`                                                                 | Verify that a list of names is kept in alphabetical order |
| `items.map(x, x.weight).sum() == 1.0`                                              | Verify that the "weights" of a list of objects sum to 1.0 |
| `lowPriorities.map(x, x.priority).max() < highPriorities.map(x, x.priority).min()` | Verify that two sets of priorities do not overlap         |
| `names.indexOf('should-be-first') == 1`                                            | Require that the first name in a list if a specific value | 
{{< /table >}}

See the [Kubernetes List Library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Lists)
godoc for more information.

### Kubernetes regex library

In addition to the `matches` function provided by the CEL standard library, the
regex library provides `find` and `findAll`, enabling a much wider range of
regex operations.

Examples:

{{< table caption="Examples of CEL expressions using regex library functions" >}}
| CEL Expression                                              | Purpose                                                  |
|-------------------------------------------------------------|----------------------------------------------------------|
| `"abc 123".find('[0-9]+')`                                  | Find the first number in a string                        |
| `"1, 2, 3, 4".findAll('[0-9]+').map(x, int(x)).sum() < 100` | Verify that the numbers in a string sum to less than 100 |
{{< /table >}}

See the [Kubernetes regex library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#Regex)
godoc for more information.

### Kubernetes URL library

To make it easier and safer to process URLs, the following functions have been added:

- `isURL(string)` checks if a string is a valid URL according to the [Go's
  net/url](https://pkg.go.dev/net/url#URL) package. The string must be an
  absolute URL.
- `url(string) URL` converts a string to a URL or results in an error if the
  string is not a valid URL.

Once parsed via the `url` function, the resulting URL object has `getScheme`,
`getHost`, `getHostname`, `getPort`, `getEscapedPath` and `getQuery` accessors.

Examples:

{{< table caption="Examples of CEL expressions using URL library functions" >}}
| CEL Expression                                                  | Purpose                                        |
|-----------------------------------------------------------------|------------------------------------------------|
| `url('https://example.com:80/').getHost()`                      | Get the 'example.com:80' host part of the URL. |
| `url('https://example.com/path with spaces/').getEscapedPath()` | Returns '/path%20with%20spaces/'               |
{{< /table >}}

See the [Kubernetes URL library](https://pkg.go.dev/k8s.io/apiextensions-apiserver/pkg/apiserver/schema/cel/library#URLs)
godoc for more information.

### Kubernetes authorizer library

For CEL expressions in the API where a variable of type `Authorizer` is available,
the authorizer may be used to perform authorization checks for the principal
(authenticated user) of the request.

API resource checks are performed as follows:

1. Specify the group and resource to check: `Authorizer.group(string).resource(string) ResourceCheck`
2. Optionally call any combination of the following builder functions to further narrow the authorization check.
   Note that these functions return the receiver type and can be chained:
  - `ResourceCheck.subresource(string) ResourceCheck`
  - `ResourceCheck.namespace(string) ResourceCheck`
  - `ResourceCheck.name(string) ResourceCheck` 
3. Call `ResourceCheck.check(verb string) Decision` to perform the authorization check.
4. Call `allowed() bool` or `reason() string` to inspect the result of the authorization check.

Non-resource authorization performed are used as follows:

1. specify only a path: `Authorizer.path(string) PathCheck`
1. Call `PathCheck.check(httpVerb string) Decision` to perform the authorization check.
1. Call `allowed() bool` or `reason() string` to inspect the result of the authorization check.

To perform an authorization check for a service account:

- `Authorizer.serviceAccount(namespace string, name string) Authorizer`

{{< table caption="Examples of CEL expressions using URL library functions" >}}
| CEL Expression                                                                                               | Purpose                                        |
|--------------------------------------------------------------------------------------------------------------|------------------------------------------------|
| `authorizer.group('').resource('pods').namespace('default').check('create').allowed()`                       | Returns true if the principal (user or service account) is allowed create pods in the 'default' namespace. |
| `authorizer.path('/healthz').check('get').allowed()`                                                         | Checks if the principal (user or service account) is authorized to make HTTP GET requests to the /healthz API path. |
| `authorizer.serviceAccount('default', 'myserviceaccount').resource('deployments').check('delete').allowed()` | Checks if the service account is authorized to delete deployments. |
{{< /table >}}

{{< feature-state state="alpha" for_k8s_version="v1.31" >}}

With the alpha `AuthorizeWithSelectors` feature enabled, field and label selectors can be added to authorization checks.

{{< table caption="Examples of CEL expressions using selector authorization functions" >}}
| CEL Expression                                                                                               | Purpose                                        |
|--------------------------------------------------------------------------------------------------------------|------------------------------------------------|
| `authorizer.group('').resource('pods').fieldSelector('spec.nodeName=mynode').check('list').allowed()`        | Returns true if the principal (user or service account) is allowed to list pods with the field selector `spec.nodeName=mynode`. |
| `authorizer.group('').resource('pods').labelSelector('example.com/mylabel=myvalue').check('list').allowed()` | Returns true if the principal (user or service account) is allowed to list pods with the label selector `example.com/mylabel=myvalue`. |
{{< /table >}}

See the [Kubernetes Authz library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz)
and [Kubernetes AuthzSelectors library](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors)
godoc for more information.

### Kubernetes quantity library

Kubernetes 1.28 adds support for manipulating quantity strings (ex 1.5G, 512k, 20Mi)

- `isQuantity(string)` checks if a string is a valid Quantity according to [Kubernetes'
  resource.Quantity](https://pkg.go.dev/k8s.io/apimachinery/pkg/api/resource#Quantity). 
- `quantity(string) Quantity` converts a string to a Quantity or results in an error if the
  string is not a valid quantity.

Once parsed via the `quantity` function, the resulting Quantity object has the 
following library of member functions:

{{< table caption="Available member functions of a Quantity" >}}
| Member Function               | CEL Return Value  | Description                                                                                                                                                          |
|-------------------------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `isInteger()`                 | bool              | returns true if and only if asInteger is safe to call without an error                                                                                               |
| `asInteger()`                 | int               | returns a representation of the current value as an int64 if possible or results in an error if conversion would result in overflow or loss of precision.             |
| `asApproximateFloat()`        | float              | returns a float64 representation of the quantity which may lose precision. If the value of the quantity is outside the range of a float64 +Inf/-Inf will be returned.  |
| `sign()`                      | int               | Returns `1` if the quantity is positive, `-1` if it is negative. `0` if it is zero                                                                                   |
| `add(<Quantity>)`             | Quantity          | Returns sum of two quantities                                                                                                                                        |
| `add(<int>)`                  | Quantity          | Returns sum of quantity and an integer                                                                                                                               | 
| `sub(<Quantity>)`             | Quantity          | Returns difference between two quantities                                                                                                                            |
| `sub(<int>)`                  | Quantity          | Returns difference between a quantity and an integer                                                                                                                 |
| `isLessThan(<Quantity>)`      | bool              | Returns true if and only if the receiver is less than the operand                                                                                                    |
| `isGreaterThan(<Quantity>)`   | bool              | Returns true if and only if the receiver is greater than the operand                                                                                                 |
| `compareTo(<Quantity>)`       | int               | Compares receiver to operand and returns 0 if they are equal, 1 if the receiver is greater, or -1 if the receiver is less than the operand                           |
{{< /table >}}

Examples:

{{< table caption="Examples of CEL expressions using URL library functions" >}}
| CEL Expression                                                            | Purpose                                               |
|---------------------------------------------------------------------------|-------------------------------------------------------|
| `quantity("500000G").isInteger()`                                         | Test if conversion to integer would throw an error    |
| `quantity("50k").asInteger()`                                             | Precise conversion to integer                         |
| `quantity("9999999999999999999999999999999999999G").asApproximateFloat()` | Lossy conversion to float                              |
| `quantity("50k").add(quantity("20k"))`                                   | Add two quantities                                    |
| `quantity("50k").sub(20000)`                                              | Subtract an integer from a quantity                   |
| `quantity("50k").add(20).sub(quantity("100k")).sub(-50000)`               | Chain adding and subtracting integers and quantities  |
| `quantity("200M").compareTo(quantity("0.2G"))`                            | Compare two quantities                                |
| `quantity("150Mi").isGreaterThan(quantity("100Mi"))`                      | Test if a quantity is greater than the receiver       |
| `quantity("50M").isLessThan(quantity("100M"))`                            | Test if a quantity is less than the receiver          |
{{< /table >}}

## Type checking

CEL is a [gradually typed language](https://github.com/google/cel-spec/blob/master/doc/langdef.md#gradual-type-checking).

Some Kubernetes API fields contain fully type checked CEL expressions. For
example, [CustomResourceDefinitions Validation
Rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
are fully type checked.

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

The `has()` macro in CEL may be used in CEL expressions to check if a field of a
dynamically typed variable is accessible before attempting to access the field's
value. For example:

```cel
has(object.namex) ? object.namex == 'special' : request.name == 'special'
```

## Type system integration

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

Also see: [CEL types](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#values),
[OpenAPI types](https://swagger.io/specification/#data-types),
[Kubernetes Structural Schemas](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).

Equality comparison for arrays with `x-kubernetes-list-type` of `set` or `map` ignores element
order. For example `[1, 2] == [2, 1]` if the arrays represent Kubernetes `set` values.

Concatenation on arrays with `x-kubernetes-list-type` use the semantics of the
list type:

- `set`: `X + Y` performs a union where the array positions of all elements in
  `X` are preserved and non-intersecting elements in `Y` are appended, retaining
  their partial order.
- `map`: `X + Y` performs a merge where the array positions of all keys in `X`
  are preserved but the values are overwritten by values in `Y` when the key
  sets of `X` and `Y` intersect. Elements in `Y` with non-intersecting keys are
  appended, retaining their partial order.

## Escaping

Only Kubernetes resource property names of the form
`[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible from CEL. Accessible property
names are escaped according to the following rules when accessed in the
expression:

{{< table caption="Table of CEL identifier escaping rules" >}}
| escape sequence   | property name equivalent                                                                     |
|-------------------|----------------------------------------------------------------------------------------------|
| `__underscores__` | `__`                                                                                         |
| `__dot__`         | `.`                                                                                          |
| `__dash__`        | `-`                                                                                          |
| `__slash__`       | `/`                                                                                          |
| `__{keyword}__`   | [CEL **RESERVED** keyword](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#syntax) |
{{< /table >}}

When you escape any of CEL's **RESERVED** keywords you need to match the exact property name
use the underscore escaping
(for example, `int` in the word `sprint` would not be escaped and nor would it need to be).

Examples on escaping:

{{< table caption="Examples escaped CEL identifiers" >}}
| property name | rule with escaped property name   |
|---------------|-----------------------------------|
| `namespace`   | `self.__namespace__ > 0`          |
| `x-prop`      | `self.x__dash__prop > 0`          |
| `redact__d`   | `self.redact__underscores__d > 0` |
| `string`      | `self.startsWith('kube')`         |
{{< /table >}}

## Resource constraints

CEL is non-Turing complete and offers a variety of production safety controls to
limit execution time. CEL's _resource constraint_ features provide feedback to
developers about expression complexity and help protect the API server from
excessive resource consumption during evaluation. CEL's resource constraint
features are used to prevent CEL evaluation from consuming excessive API server
resources.

A key element of the resource constraint features is a _cost unit_ that CEL
defines as a way of tracking CPU utilization. Cost units are independent of
system load and hardware. Cost units are also deterministic; for any given CEL
expression and input data, evaluation of the expression by the CEL interpreter
will always result in the same cost.

Many of CEL's core operations have fixed costs. The simplest operations, such as
comparisons (e.g. `<`) have a cost of 1. Some have a higher fixed cost, for
example list literal declarations have a fixed base cost of 40 cost units.

Calls to functions implemented in native code approximate cost based on the time
complexity of the operation. For example: operations that use regular
expressions, such as `match` and `find`, are estimated using an approximated
cost of `length(regexString)*length(inputString)`. The approximated cost
reflects the worst case time complexity of Go's RE2 implementation.

### Runtime cost budget

All CEL expressions evaluated by Kubernetes are constrained by a runtime cost
budget. The runtime cost budget is an estimate of actual CPU utilization
computed by incrementing a cost unit counter while interpreting a CEL
expression. If the CEL interpreter executes too many instructions, the runtime
cost budget will be exceeded, execution of the expressions will be halted, and
an error will result.

Some Kubernetes resources define an additional runtime cost budget that bounds
the execution of multiple expressions. If the sum total of the cost of
expressions exceed the budget, execution of the expressions will be halted, and
an error will result. For example the validation of a custom resource has a
_per-validation_ runtime cost budget for all
[Validation Rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
evaluated to validate the custom resource.

### Estimated cost limits

For some Kubernetes resources, the API server may also check if worst case
estimated running time of CEL expressions would be prohibitively expensive to
execute. If so, the API server prevent the CEL expression from being written to
API resources by rejecting create or update operations containing the CEL
expression to the API resources. This feature offers a stronger assurance that
CEL expressions written to the API resource will be evaluate at runtime without
exceeding the runtime cost budget.

