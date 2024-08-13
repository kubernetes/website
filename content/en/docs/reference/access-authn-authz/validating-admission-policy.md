---
reviewers:
- liggitt
- jpbetz
- cici37
title: Validating Admission Policy
content_type: concept
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.30" >}}

This page provides an overview of Validating Admission Policy.


<!-- body -->

## What is Validating Admission Policy?

Validating admission policies offer a declarative, in-process alternative to validating admission webhooks.

Validating admission policies use the Common Expression Language (CEL) to declare the validation
rules of a policy. 
Validation admission policies are highly configurable, enabling policy authors to define policies
that can be parameterized and scoped to resources as needed by cluster administrators.

## What Resources Make a Policy

A policy is generally made up of three resources:

- The `ValidatingAdmissionPolicy` describes the abstract logic of a policy
  (think: "this policy makes sure a particular label is set to a particular value").

- A `ValidatingAdmissionPolicyBinding` links the above resources together and provides scoping.
  If you only want to require an `owner` label to be set for `Pods`, the binding is where you would
  specify this restriction.

- A parameter resource provides information to a ValidatingAdmissionPolicy to make it a concrete
  statement (think "the `owner` label must be set to something that ends in `.company.com`").
  A native type such as ConfigMap or a CRD defines the schema of a parameter resource.
  `ValidatingAdmissionPolicy` objects specify what Kind they are expecting for their parameter resource.

At least a `ValidatingAdmissionPolicy` and a corresponding  `ValidatingAdmissionPolicyBinding`
must be defined for a policy to have an effect.

If a `ValidatingAdmissionPolicy` does not need to be configured via parameters, simply leave
`spec.paramKind` in  `ValidatingAdmissionPolicy` not specified.

## Getting Started with Validating Admission Policy

Validating Admission Policy is part of the cluster control-plane. You should write and deploy them
with great caution. The following describes how to quickly experiment with Validating Admission Policy.

### Creating a ValidatingAdmissionPolicy

The following is an example of a ValidatingAdmissionPolicy.

{{% code_sample language="yaml" file="validatingadmissionpolicy/basic-example-policy.yaml" %}}

`spec.validations` contains CEL expressions which use the [Common Expression Language (CEL)](https://github.com/google/cel-spec)
to validate the request. If an expression evaluates to false, the validation check is enforced
according to the `spec.failurePolicy` field.

{{< note >}}
You can quickly test CEL expressions in [CEL Playground](https://playcel.undistro.io).
{{< /note >}}

To configure a validating admission policy for use in a cluster, a binding is required.
The following is an example of a ValidatingAdmissionPolicyBinding.:

{{% code_sample language="yaml" file="validatingadmissionpolicy/basic-example-binding.yaml" %}}

When trying to create a deployment with replicas set not satisfying the validation expression, an
error will return containing message:

```none
ValidatingAdmissionPolicy 'demo-policy.example.com' with binding 'demo-binding-test.example.com' denied request: failed expression: object.spec.replicas <= 5
```

The above provides a simple example of using ValidatingAdmissionPolicy without a parameter configured.

#### Validation actions

Each `ValidatingAdmissionPolicyBinding` must specify one or more
`validationActions` to declare how `validations` of a policy are enforced.

The supported `validationActions` are:

- `Deny`: Validation failure results in a denied request.
- `Warn`: Validation failure is reported to the request client
  as a [warning](/blog/2020/09/03/warnings/).
- `Audit`: Validation failure is included in the audit event for the API request.

For example, to both warn clients about a validation failure and to audit the
validation failures, use:

```yaml
validationActions: [Warn, Audit]
```

`Deny` and `Warn` may not be used together since this combination
needlessly duplicates the validation failure both in the
API response body and the HTTP warning headers.

A `validation` that evaluates to false is always enforced according to these
actions. Failures defined by the `failurePolicy` are enforced
according to these actions only if the `failurePolicy` is set to `Fail` (or not specified),
otherwise the failures are ignored.

See [Audit Annotations: validation failures](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure)
for more details about the validation failure audit annotation.

### Parameter resources

Parameter resources allow a policy configuration to be separate from its definition. 
A policy can define paramKind, which outlines GVK of the parameter resource, 
and then a policy binding ties a policy by name (via policyName) to a particular parameter resource via paramRef.

If parameter configuration is needed, the following is an example of a ValidatingAdmissionPolicy
with parameter configuration.

{{% code_sample language="yaml" file="validatingadmissionpolicy/policy-with-param.yaml" %}}

The `spec.paramKind` field of the ValidatingAdmissionPolicy specifies the kind of resources used
to parameterize this policy. For this example, it is configured by ReplicaLimit custom resources. 
Note in this example how the CEL expression references the parameters via the CEL params variable,
e.g. `params.maxReplicas`. `spec.matchConstraints` specifies what resources this policy is
designed to validate. Note that the native types such like `ConfigMap` could also be used as
parameter reference.

The `spec.validations` fields contain CEL expressions. If an expression evaluates to false, the
validation check is enforced according to the `spec.failurePolicy` field.

The validating admission policy author is responsible for providing the ReplicaLimit parameter CRD.

To configure an validating admission policy for use in a cluster, a binding and parameter resource
are created. The following is an example of a ValidatingAdmissionPolicyBinding 
that uses a **cluster-wide** param - the same param will be used to validate
every resource request that matches the binding:

{{% code_sample language="yaml" file="validatingadmissionpolicy/binding-with-param.yaml" %}}

Notice this binding applies a parameter to the policy for all resources which
are in the `test` environment.

The parameter resource could be as following:

{{% code_sample language="yaml" file="validatingadmissionpolicy/replicalimit-param.yaml" %}}

This policy parameter resource limits deployments to a max of 3 replicas.

An admission policy may have multiple bindings. To bind all other environments
to have a maxReplicas limit of 100, create another ValidatingAdmissionPolicyBinding:

{{% code_sample language="yaml" file="validatingadmissionpolicy/binding-with-param-prod.yaml" %}}

Notice this binding applies a different parameter to resources which
are not in the `test` environment.

And have a parameter resource:

{{% code_sample language="yaml" file="validatingadmissionpolicy/replicalimit-param-prod.yaml" %}}

For each admission request, the API server evaluates CEL expressions of each 
(policy, binding, param) combination that match the request. For a request
to be admitted it must pass **all** evaluations.

If multiple bindings match the request, the policy will be evaluated for each,
and they must all pass evaluation for the policy to be considered passed. 

If multiple parameters match a single binding, the policy rules will be evaluated
for each param, and they too must all pass for the binding to be considered passed.
Bindings can have overlapping match criteria. The policy is evaluated for each 
matching binding-parameter combination. A policy may even be evaluated multiple
times if multiple bindings match it, or a single binding that matches multiple 
parameters.

The params object representing a parameter resource will not be set if a parameter resource has
not been bound, so for policies requiring a parameter resource, it can be useful to add a check to
ensure one has been bound. A parameter resource will not be bound and `params` will be null
if `paramKind` of the policy, or `paramRef` of the binding are not specified.

For the use cases require parameter configuration, we recommend to add a param check in
`spec.validations[0].expression`:

```
- expression: "params != null"
  message: "params missing but required to bind to this policy"
```

#### Optional parameters

It can be convenient to be able to have optional parameters as part of a parameter resource, and
only validate them if present. CEL provides `has()`, which checks if the key passed to it exists.
CEL also implements Boolean short-circuiting. If the first half of a logical OR evaluates to true,
it won’t evaluate the other half (since the result of the entire OR will be true regardless). 

Combining the two, we can provide a way to validate optional parameters:

`!has(params.optionalNumber) || (params.optionalNumber >= 5 && params.optionalNumber <= 10)`

Here, we first check that the optional parameter is present with `!has(params.optionalNumber)`. 

- If `optionalNumber` hasn’t been defined, then the expression short-circuits since
  `!has(params.optionalNumber)` will evaluate to true. 
- If `optionalNumber` has been defined, then the latter half of the CEL expression will be
  evaluated, and optionalNumber will be checked to ensure that it contains a value between 5 and
  10 inclusive.


#### Per-namespace Parameters

As the author of a ValidatingAdmissionPolicy and its ValidatingAdmissionPolicyBinding, 
you can choose to specify cluster-wide, or per-namespace parameters. 
If you specify a `namespace` for the binding's `paramRef`, the control plane only
searches for parameters in that namespace.

However, if `namespace` is not specified in the ValidatingAdmissionPolicyBinding, the
API server can search for relevant parameters in the namespace that a request is against.
For example, if you make a request to modify a ConfigMap in the `default` namespace and
there is a relevant ValidatingAdmissionPolicyBinding with no `namespace` set, then the
API server looks for a parameter object in `default`.
This design enables policy configuration that depends on the namespace
of the resource being manipulated, for more fine-tuned control.

#### Parameter selector

In addition to specify a parameter in a binding by `name`, you may
choose instead to specify label selector, such that all resources of the
policy's `paramKind`, and the param's `namespace` (if applicable) that match the
label selector are selected for evaluation. See {{< glossary_tooltip text="selector" term_id="selector">}} for more information on how label selectors match resources.

If multiple parameters are found to meet the condition, the policy's rules are
evaluated for each parameter found and the results will be ANDed together.

If `namespace` is provided, only objects of the `paramKind` in the provided
namespace are eligible for selection. Otherwise, when `namespace` is empty and 
`paramKind` is namespace-scoped, the `namespace` used in the request being 
admitted will be used.

#### Authorization checks {#authorization-check} 

We introduced the authorization check for parameter resources.
User is expected to have `read` access to the resources referenced by `paramKind` in
`ValidatingAdmissionPolicy` and `paramRef` in `ValidatingAdmissionPolicyBinding`.

Note that if a resource in `paramKind` fails resolving via the restmapper, `read` access to all
resources of groups is required.

### Failure Policy

`failurePolicy` defines how mis-configurations and CEL expressions evaluating to error from the
admission policy are handled. Allowed values are `Ignore` or `Fail`.

- `Ignore` means that an error calling the ValidatingAdmissionPolicy is ignored and the API
  request is allowed to continue.
- `Fail` means that an error calling the ValidatingAdmissionPolicy causes the admission to fail
  and the API request to be rejected.

Note that the `failurePolicy` is defined inside `ValidatingAdmissionPolicy`:

{{% code_sample language="yaml" file="validatingadmissionpolicy/failure-policy-ignore.yaml" %}}

### Validation Expression

`spec.validations[i].expression` represents the expression which will be evaluated by CEL.
To learn more, see the [CEL language specification](https://github.com/google/cel-spec)
CEL expressions have access to the contents of the Admission request/response, organized into CEL
variables as well as some other useful variables:

- 'object' - The object from the incoming request. The value is null for DELETE requests.
- 'oldObject' - The existing object. The value is null for CREATE requests.
- 'request' - Attributes of the [admission request](/docs/reference/config-api/apiserver-admission.v1/#admission-k8s-io-v1-AdmissionRequest).
- 'params' - Parameter resource referred to by the policy binding being evaluated. The value is
  null if `ParamKind` is not specified.
- `namespaceObject` - The namespace, as a Kubernetes resource, that the incoming object belongs to.
  The value is null if the incoming object is cluster-scoped.
- `authorizer` - A CEL Authorizer. May be used to perform authorization checks for the principal
  (authenticated user) of the request. See
  [AuthzSelectors](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#AuthzSelectors) and
  [Authz](https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz) in the Kubernetes CEL library
  documentation for more details.
- `authorizer.requestResource` - A shortcut for an authorization check configured with the request
  resource (group, resource, (subresource), namespace, name).
	
The `apiVersion`, `kind`, `metadata.name` and `metadata.generateName` are always accessible from
the root of the object. No other metadata properties are accessible.
	
Equality on arrays with list type of 'set' or 'map' ignores element order, i.e. [1, 2] == [2, 1].
Concatenation on arrays with x-kubernetes-list-type use the semantics of the list type:

- 'set': `X + Y` performs a union where the array positions of all elements in `X` are preserved and
  non-intersecting elements in `Y` are appended, retaining their partial order.
- 'map': `X + Y` performs a merge where the array positions of all keys in `X` are preserved but the values
  are overwritten by values in `Y` when the key sets of `X` and `Y` intersect. Elements in `Y` with
  non-intersecting keys are appended, retaining their partial order.

#### Validation expression examples

| Expression                                                                                   | Purpose                                                                           |
|----------------------------------------------------------------------------------------------| ------------                                                                      |
| `object.minReplicas <= object.replicas && object.replicas <= object.maxReplicas`             | Validate that the three fields defining replicas are ordered appropriately        |
| `'Available' in object.stateCounts`                                                          | Validate that an entry with the 'Available' key exists in a map                   |
| `(size(object.list1) == 0) != (size(object.list2) == 0)`                                     | Validate that one of two lists is non-empty, but not both                         |
| <code>!('MY_KEY' in object.map1) &#124;&#124; object['MY_KEY'].matches('^[a-zA-Z]*$')</code> | Validate the value of a map for a specific key, if it is in the map               |
| `object.envars.filter(e, e.name == 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$')`          | Validate the 'value' field of a listMap entry where key field 'name' is 'MY_ENV'  |
| `has(object.expired) && object.created + object.ttl < object.expired`                        | Validate that 'expired' date is after a 'create' date plus a 'ttl' duration       |
| `object.health.startsWith('ok')`                                                             | Validate a 'health' string field has the prefix 'ok'                              |
| `object.widgets.exists(w, w.key == 'x' && w.foo < 10)`                                       | Validate that the 'foo' property of a listMap item with a key 'x' is less than 10 |
| `type(object) == string ? object == '100%' : object == 1000`                                 | Validate an int-or-string field for both the int and string cases             |
| `object.metadata.name.startsWith(object.prefix)`                                             | Validate that an object's name has the prefix of another field value              |
| `object.set1.all(e, !(e in object.set2))`                                                    | Validate that two listSets are disjoint                                           |
| `size(object.names) == size(object.details) && object.names.all(n, n in object.details)`     | Validate the 'details' map is keyed by the items in the 'names' listSet           |
| `size(object.clusters.filter(c, c.name == object.primary)) == 1`                             | Validate that the 'primary' property has one and only one occurrence in the 'clusters' listMap           |

Read [Supported evaluation on CEL](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#evaluation)
for more information about CEL rules.

`spec.validation[i].reason` represents a machine-readable description of why this validation failed.
If this is the first validation in the list to fail, this reason, as well as the corresponding
HTTP response code, are used in the HTTP response to the client.
The currently supported reasons are: `Unauthorized`, `Forbidden`, `Invalid`, `RequestEntityTooLarge`.
If not set, `StatusReasonInvalid` is used in the response to the client.

### Matching requests: `matchConditions`

You can define _match conditions_ for a `ValidatingAdmissionPolicy` if you need fine-grained request filtering. These
conditions are useful if you find that match rules, `objectSelectors` and `namespaceSelectors` still
doesn't provide the filtering you want. Match conditions are
[CEL expressions](/docs/reference/using-api/cel/). All match conditions must evaluate to true for the
resource to be evaluated.

Here is an example illustrating a few different uses for match conditions:

{{% code_sample file="access/validating-admission-policy-match-conditions.yaml" %}}

Match conditions have access to the same CEL variables as validation expressions.

In the event of an error evaluating a match condition the policy is not evaluated. Whether to reject
the request is determined as follows:

1. If **any** match condition evaluated to `false` (regardless of other errors), the API server skips the policy.
2. Otherwise:
   - for [`failurePolicy: Fail`](#failure-policy), reject the request (without evaluating the policy).
   - for [`failurePolicy: Ignore`](#failure-policy), proceed with the request but skip the policy.

### Audit annotations

`auditAnnotations` may be used to include audit annotations in the audit event of the API request.

For example, here is an admission policy with an audit annotation:

{{% code_sample file="access/validating-admission-policy-audit-annotation.yaml" %}}

When an API request is validated with this admission policy, the resulting audit event will look like:

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

In this example the annotation will only be included if the `spec.replicas` of the Deployment is more than
50, otherwise the CEL expression evaluates to null and the annotation will not be included.

Note that audit annotation keys are prefixed by the name of the `ValidatingAdmissionWebhook` and a `/`. If
another admission controller, such as an admission webhook, uses the exact same audit annotation key, the 
value of the first admission controller to include the audit annotation will be included in the audit
event and all other values will be ignored.

### Message expression

To return a more friendly message when the policy rejects a request, we can use a CEL expression
to composite a message with `spec.validations[i].messageExpression`. Similar to the validation expression,
a message expression has access to `object`, `oldObject`, `request`, `params`, and `namespaceObject`.
Unlike validations, message expression must evaluate to a string.

For example, to better inform the user of the reason of denial when the policy refers to a parameter,
we can have the following validation:

{{% code_sample file="access/deployment-replicas-policy.yaml" %}}

After creating a params object that limits the replicas to 3 and setting up the binding,
when we try to create a deployment with 5 replicas, we will receive the following message.

```
$ kubectl create deploy --image=nginx nginx --replicas=5
error: failed to create deployment: deployments.apps "nginx" is forbidden: ValidatingAdmissionPolicy 'deploy-replica-policy.example.com' with binding 'demo-binding-test.example.com' denied request: object.spec.replicas must be no greater than 3
```

This is more informative than a static message of "too many replicas".

The message expression takes precedence over the static message defined in `spec.validations[i].message` if both are defined.
However, if the message expression fails to evaluate, the static message will be used instead.
Additionally, if the message expression evaluates to a multi-line string,
the evaluation result will be discarded and the static message will be used if present.
Note that static message is validated against multi-line strings.

### Type checking

When a policy definition is created or updated, the validation process parses the expressions it contains
and reports any syntax errors, rejecting the definition if any errors are found. 
Afterward, the referred variables are checked for type errors, including missing fields and type confusion,
against the matched types of `spec.matchConstraints`.
The result of type checking can be retrieved from `status.typeChecking`.
The presence of `status.typeChecking` indicates the completion of type checking,
and an empty `status.typeChecking` means that no errors were detected.

For example, given the following policy definition:

{{< code_sample language="yaml" file="validatingadmissionpolicy/typechecking.yaml" >}}

The status will yield the following information:

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

If multiple resources are matched in `spec.matchConstraints`, all of matched resources will be checked against.
For example, the following policy definition 

{{% code_sample language="yaml" file="validatingadmissionpolicy/typechecking-multiple-match.yaml" %}}


will have multiple types and type checking result of each type in the warning message.

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

Type Checking has the following limitation:

- No wildcard matching. If `spec.matchConstraints.resourceRules` contains `"*"` in any of `apiGroups`, `apiVersions` or `resources`,
  the types that `"*"` matches will not be checked.
- The number of matched types is limited to 10. This is to prevent a policy that manually specifying too many types.
  to consume excessive computing resources. In the order of ascending group, version, and then resource, 11th combination and beyond are ignored.
- Type Checking does not affect the policy behavior in any way. Even if the type checking detects errors, the policy will continue
  to evaluate. If errors do occur during evaluate, the failure policy will decide its outcome.
- Type Checking does not apply to CRDs, including matched CRD types and reference of paramKind. The support for CRDs will come in future release.

### Variable composition

If an expression grows too complicated, or part of the expression is reusable and computationally expensive to evaluate,
you can extract some part of the expressions into variables. A variable is a named expression that can be referred later
in `variables` in other expressions.

```yaml
spec:
  variables:
    - name: foo
      expression: "'foo' in object.spec.metadata.labels ? object.spec.metadata.labels['foo'] : 'default'"
  validations:
    - expression: variables.foo == 'bar'
```

A variable is lazily evaluated when it is first referred. Any error that occurs during the evaluation will be
reported during the evaluation of the referring expression. Both the result and potential error are memorized and
count only once towards the runtime cost.

The order of variables are important because a variable can refer to other variables that are defined before it.
This ordering prevents circular references.

The following is a more complex example of enforcing that image repo names match the environment defined in its namespace.

{{< code_sample file="access/image-matches-namespace-environment.policy.yaml" >}}

With the policy bound to the namespace `default`, which is labeled `environment: prod`,
the following attempt to create a deployment would be rejected.
```shell
kubectl create deploy --image=dev.example.com/nginx invalid
```
The error message is similar to this.
```console
error: failed to create deployment: deployments.apps "invalid" is forbidden: ValidatingAdmissionPolicy 'image-matches-namespace-environment.policy.example.com' with binding 'demo-binding-test.example.com' denied request: only prod images are allowed in namespace default
```
