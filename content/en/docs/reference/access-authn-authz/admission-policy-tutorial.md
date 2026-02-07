---
reviewers:
- liggitt
- jpbetz
- cici37
- sftim
title: Validating and Mutating Admission Policies
content_type: tutorial
description: >-
  Use declarative admission policies to validate or mutate resources
  at admission time using Common Expression Language (CEL).
weight: 120
---
<!-- overview -->

This page provides an overview of declarative admission policies, which allow you to use the Common Expression Language (CEL) to validate or mutate resources.

`MutatingAdmissionPolicy` (beta)
: Modifies an object before it is stored (example: adding a default label).

ValidatingAdmissionPolicy
: Configures whether to allow or deny a request that would modify a resource, based on specific rules.

<!-- body -->

## Before you begin

You need to have a Kubernetes cluster, and the kubectl command-line tool must be configured to communicate with your cluster.

* For **ValidatingAdmissionPolicy**, ensure your cluster is version 1.30 or later.
* For **MutatingAdmissionPolicy**, you need:
    * A cluster running version **1.32** or later.
    * The `MutatingAdmissionPolicy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled.
    * The `admissionregistration.k8s.io/v1beta1` [API group](/docs/concepts/overview/kubernetes-api/#api-groups) enabled.

### Local testing

{{< tabs name="local_cluster_setup" >}}
{{% tab name="kind" %}}
If you are using [kind](https://kind.sigs.k8s.io/), use this configuration to enable the necessary features:

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

{{% /tab %}} {{% tab name="minikube" %}} If you are using minikube, run:

```bash
minikube start --feature-gates=MutatingAdmissionPolicy=true --runtime-config=admissionregistration.k8s.io/v1beta1=true
```
{{% /tab %}} {{< /tabs >}}

## What are Declarative Admission Policies?

Declarative admission policies offer a declarative, in-process alternative to admission webhooks. By using the Common Expression Language (CEL) to declare policy rules, these policies are evaluated directly within the API server.

These policies are highly configurable, enabling policy authors to define logic that can be parameterized and scoped to resources as needed by cluster administrators. They are divided into two types:
* **Validating Admission Policies** for enforcing constraints.
* **Mutating Admission Policies** for modifying resources during admission.

## What Resources Make a Policy

A declarative policy is generally made up of three distinct resources:

- The **Policy resource** (`ValidatingAdmissionPolicy` or `MutatingAdmissionPolicy`) describes the abstract logic. 
  (Example: "this policy ensures a specific label is present" or "this policy adds a default owner label").

- A **Parameter resource** provides information to the policy to make it a concrete statement. 
  (Example: "the `owner` label must be set to `champbreed`"). 
  A native type such as a `ConfigMap` or a Custom Resource Definition (CRD) defines the schema of a parameter resource. The Policy object specifies the `paramKind` it expects.

- A **Binding resource** (`ValidatingAdmissionPolicyBinding` or `MutatingAdmissionPolicyBinding`) links the policy to specific resources and provides scoping. 
  If you only want to enforce or apply a policy to `Namespaces`, the binding is where you specify that restriction via `matchResources`.

At least a Policy and a corresponding Binding must be defined for a policy to have an effect. If a policy does not require configuration, you may leave the `spec.paramKind` field empty in the Policy resource.

## Getting Started with Declarative Admission Policies

Admission policies are part of the cluster control-plane. You should write and deploy them
with great caution. The following describes how to quickly experiment with both Validating and Mutating Admission Policies.

### Validating Admission Policy

The following is an example of a `ValidatingAdmissionPolicy` that limits deployment replicas.


```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "demo-policy.example.com"
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
`spec.validations` contains CEL Expressions which use the [Common Expression Language (CEL)](https://github.com/google/cel-spec)
to validate the request. If an expression evaluates to false, the validation check is enforced
according to the `spec.failurePolicy` field.

{{< note >}}
You can quickly test CEL expressions in [CEL Playground](https://playcel.undistro.io).
{{< /note >}}

To configure a validating admission policy for use in a cluster, a binding is required.
The following is an example of a `ValidatingAdmissionPolicyBinding`:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "demo-binding-test.example.com"
spec:
  policyName: "demo-policy.example.com"
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchLabels:
        environment: test
```

### Mutating Admission Policy (Beta)

Similar to validation, you can create a `MutatingAdmissionPolicy` to modify resources. The following example ensures that all created Pods have a specific owner label.

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingAdmissionPolicy
metadata:
  name: "set-default-owner"
spec:
  reinvocationPolicy: Never
  matchConstraints:
    resourceRules:
    - apiGroups:   [""]
      apiVersions: ["v1"]
      operations:  ["CREATE"]
      resources:   ["pods"]
  mutations:
    - patchType: "ApplyConfiguration"
      applyConfiguration:
        expression: "Object{metadata: Object.metadata{labels: {'owner': 'champbreed'}}}"
```
A MutatingAdmissionPolicyBinding is required to activate this policy:
```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: "set-default-owner-binding"
spec:
  policyName: "set-default-owner"
```
#### Policy actions

Each admission policy binding must specify one or more actions to declare how the policy is enforced.

For `ValidatingAdmissionPolicyBinding`, the supported `validationActions` are:

- `Deny`: Validation failure results in a denied request.
- `Warn`: Validation failure is reported to the request client as a [warning](/blog/2020/09/03/warnings/).
- `Audit`: Validation failure is included in the audit event for the API request.

`Deny` and `Warn` may not be used together since this combination duplicates the validation failure in both the API response body and the HTTP warning headers.

For `MutatingAdmissionPolicyBinding`, the supported `mutationActions` (currently Beta) include:

- `Apply`: Applies the CEL-based mutation to the resource.

A policy check that fails or an error that occurs is enforced according to these actions. Failures defined by the `failurePolicy` are enforced according to these actions only if the `failurePolicy` is set to `Fail` (or not specified).

See [Audit Annotations: validation failures](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure) for more details about audit logging for policies.

### Parameter resources

Parameter resources allow a policy configuration to be separate from its definition. A policy can define paramKind, which outlines the GVK of the parameter resource, and then a policy binding ties a policy by name (via policyName) to a particular parameter resource via paramRef.

If parameter configuration is needed, the following is an example of a ValidatingAdmissionPolicy with parameter configuration.
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "replica-limit-policy.example.com"
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
The spec.paramKind field specifies the kind of resources used to parameterize the policy. In this example, it is configured by ReplicaLimit custom resources. Note how the CEL expression references the parameters via the CEL params variable (e.g., params.maxReplicas). The spec.matchConstraints specifies what resources this policy is designed to evaluate. Native types such as ConfigMap can also be used as parameter references.

The spec.validations or spec.mutations fields contain CEL expressions. For validation, if an expression evaluates to false, the check is enforced according to the spec.failurePolicy field.

The policy author is responsible for providing the parameter CRD (e.g., ReplicaLimit) if a custom type is used.

To configure an admission policy for use in a cluster, a binding and parameter resource are created. The following is an example of a ValidatingAdmissionPolicyBinding that uses a cluster-wide param—the same param will be used to evaluate every resource request that matches the binding:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "demo-binding-test.example.com"
spec:
  policyName: "replica-limit-policy.example.com"
  paramRef:
    name: "replica-limit-test.example.com"
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchLabels:
        environment: test
```
Notice this binding applies a parameter to the policy for all resources which are in the test environment.

The parameter resource could be as follows:
```yaml
apiVersion: rules.example.com/v1
kind: ReplicaLimit
metadata:
  name: "replica-limit-test.example.com"
maxReplicas: 3
```
This policy parameter resource limits deployments to a maximum of 3 replicas.

An admission policy may have multiple bindings. To bind other environments to a maxReplicas limit of 100, create another ValidatingAdmissionPolicyBinding:
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "demo-binding-prod.example.com"
spec:
  policyName: "replica-limit-policy.example.com"
  paramRef:
    name: "replica-limit-prod.example.com"
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchLabels:
        environment: prod
```
And a corresponding parameter resource:
```yaml
apiVersion: rules.example.com/v1
kind: ReplicaLimit
metadata:
  name: "replica-limit-prod.example.com"
maxReplicas: 100
```
For each admission request, the API server evaluates CEL expressions of each (policy, binding, param) combination that match the request. For a request to be admitted, it must pass all evaluations.

If multiple bindings match the request, the policy is evaluated for each, and all must pass for the request to be admitted.

If multiple parameters match a single binding, the policy rules are evaluated for each param, and these too must all pass. Bindings can have overlapping match criteria. A policy may be evaluated multiple times if multiple bindings match it, or if a single binding matches multiple parameters.

The params object representing a parameter resource will not be set if a parameter resource has not been bound. For policies requiring a parameter resource, it is a best practice to add a check to ensure one has been bound. A parameter resource will not be bound and params will be null if paramKind of the policy or paramRef of the binding are not specified.

For use cases requiring parameter configuration, it is recommended to add a param check:

```yaml
- expression: "params != null"
  message: "params missing but required to bind to this policy"
```

#### Optional parameters

It can be convenient to have optional parameters as part of a parameter resource and only evaluate them if present. CEL provides `has()`, which checks if the key passed to it exists. CEL also implements Boolean short-circuiting: if the first half of a logical OR evaluates to true, it won’t evaluate the other half.

Combining the two, we can provide a way to handle optional parameters in your policy expressions:

`!has(params.optionalNumber) || (params.optionalNumber >= 5 && params.optionalNumber <= 10)`

In this example, we first check if the optional parameter is present with `!has(params.optionalNumber)`:

- If `optionalNumber` has not been defined, the expression short-circuits to true, and the policy proceeds.
- If `optionalNumber` has been defined, the second half of the CEL expression is evaluated to ensure the value is between 5 and 10 inclusive.


#### Per-namespace Parameters

As the author of an admission policy and its corresponding binding, you can choose to specify cluster-wide or per-namespace parameters. If you specify a `namespace` for the binding's `paramRef`, the control plane only searches for parameters in that specific namespace.

However, if `namespace` is not specified in the `paramRef`, the API server can search for relevant parameters in the namespace that the request is against. For example, if you make a request to modify a `ConfigMap` in the `default` namespace and there is a relevant policy binding with no `namespace` set in its `paramRef`, then the API server looks for a parameter object in the `default` namespace.

This design enables policy configuration that depends on the namespace of the resource being manipulated, allowing for more fine-tuned control across different environments.

#### Parameter selector

In addition to specifying a parameter in a binding by `name`, you may choose instead to specify a label selector. When a selector is used, all resources of the policy's `paramKind` and the parameter's `namespace` (if applicable) that match the label selector are selected for evaluation. See {{< glossary_tooltip text="selector" term_id="selector">}} for more information on how label selectors match resources.

If multiple parameters are found:
- For **Validating Admission Policies**, the rules are evaluated for each parameter found, and the results are **ANDed** together (all must pass).
- For **Mutating Admission Policies**, the mutations are applied for each matching parameter.

If `namespace` is provided in `paramRef`, only objects of the `paramKind` in that namespace are eligible for selection. Otherwise, when `namespace` is empty and `paramKind` is namespace-scoped, the namespace of the resource being admitted is used.

#### Authorization checks {#authorization-check}

The API server performs authorization checks for parameter resources. The user performing an action is expected to have `read` access to the resources referenced by `paramKind` in the policy and `paramRef` in the policy binding. This applies to both Validating and Mutating admission policies.

Note that if a resource in `paramKind` fails to resolve via the restmapper, `read` access to all resources within that API group is required.

#### `paramRef`

The `paramRef` field specifies the parameter resource used by the policy. It has the following fields:

- **name**: The name of the parameter resource.
- **namespace**: The namespace of the parameter resource.
- **selector**: A label selector to match multiple parameter resources.
- **parameterNotFoundAction**: (Required) Controls the behavior when the specified parameters are not found.

  - **Allowed Values**:
    - **`Allow`**: The absence of matched parameters is treated as the policy check passing for that binding.
    - **`Deny`**: The absence of matched parameters is subject to the `failurePolicy` of the policy.

One of `name` or `selector` must be set, but not both.

{{< note >}}
The `parameterNotFoundAction` field in `paramRef` is **required**. It specifies the action to take when no parameters are found matching the `paramRef`. If not specified, the policy binding may be considered invalid and will be ignored.

- **`Allow`**: If set to `Allow` and no parameters are found, the binding treats the absence of parameters as a pass, and the policy is considered satisfied for that binding.
- **`Deny`**: If set to `Deny` and no parameters are found, the binding enforces the `failurePolicy` of the policy. If the `failurePolicy` is `Fail`, the request is rejected.
{{< /note >}}

#### Handling Missing Parameters with `parameterNotFoundAction`

When using `paramRef` with a selector, it's possible that no parameters match the selector. The `parameterNotFoundAction` field determines how the binding behaves in this scenario.

**Example:**

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: example-binding
spec:
  policyName: example-policy
  paramRef:
    selector:
      matchLabels:
        environment: test
    parameterNotFoundAction: Allow
  validationActions:
  - Deny
```
  
### Failure Policy

`failurePolicy` defines how mis-configurations and CEL expressions evaluating to error are handled. Allowed values are `Ignore` or `Fail`.

- `Ignore` means that an error evaluating the policy is ignored and the API request is allowed to continue.
- `Fail` means that an error evaluating the policy causes the admission to fail and the API request to be rejected.

Note that the `failurePolicy` is defined inside the policy resource (`ValidatingAdmissionPolicy` or `MutatingAdmissionPolicy`):
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "replica-limit-policy.example.com"
spec:
  failurePolicy: Ignore
  matchConstraints:
    resourceRules:
    - apiGroups:   ["apps"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["deployments"]
  validations:
    - expression: "object.spec.replicas <= 100"
```

### CEL Expressions

The spec.validations[i].expression (for validation) and spec.mutations[i].patchType logic (for mutation) represent the expressions evaluated by CEL. To learn more, see the CEL language specification.
CEL expressions have access to the contents of the admission request, organized into the following variables:

- object - The object from the incoming request. The value is null for DELETE requests.
- oldObject - The existing object. The value is null for CREATE requests.
- request - Attributes of the admission request.
- params - The parameter resource referred to by the policy binding. The value is null if paramKind is not specified.
- namespaceObject - The namespace resource that the incoming object belongs to. The value is null if the incoming object is cluster-scoped.
- authorizer - A CEL Authorizer used to perform authorization checks for the principal (authenticated user) of the request.
- authorizer.requestResource - A shortcut for an authorization check configured with the request resource (group, resource, subresource, namespace, name).

In CEL expressions, variables like object and oldObject are strongly-typed. You can access any field in the object's schema, such as object.metadata.labels or fields within spec.
For any Kubernetes object, including schemaless Custom Resources, CEL guarantees access to a minimal set of properties: apiVersion, kind, metadata.name, and metadata.generateName.
List Type Semantics
Equality on arrays with a list type of set or map ignores element order (e.g., [1, 2] == [2, 1]). Concatenation on arrays with x-kubernetes-list-type uses the following semantics:

- set: X + Y performs a union where the array positions of all elements in X are preserved and non-intersecting elements in Y are appended.
- map: X + Y performs a merge where the array positions of all keys in X are preserved, but values are overwritten by Y if keys intersect.

#### Validation expression examples

| Expression                                                                                   | Purpose                                                                           |
|----------------------------------------------------------------------------------------------| ------------                                                                      |
| `object.minReplicas <= object.replicas && object.replicas <= object.maxReplicas`             | Validate that the three fields defining replicas are ordered appropriately        |
| `'Available' in object.stateCounts`                                                          | Validate that an entry with the 'Available' key exists in a map                   |
| `(size(object.list1) == 0) != (size(object.list2) == 0)`                                     | Validate that one of two lists is non-empty, but not both                         |
| <code>!('MY_KEY' in object.map1) &#124;&#124; object['MY_KEY'].matches('^[a-zA-Z]*$')</code> | Validate the value of a map for a specific key, if it is in the map               |
| `object.envars.filter(e, e.name == 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$'))`          | Validate the 'value' field of a listMap entry where key field 'name' is 'MY_ENV'  |
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

`spec.validations[i].reason` represents a machine-readable description of why this validation failed.
If this is the first validation in the list to fail, this reason, as well as the corresponding
HTTP response code, are used in the HTTP response to the client.
The currently supported reasons are: `Unauthorized`, `Forbidden`, `Invalid`, `RequestEntityTooLarge`.
If not set, `StatusReasonInvalid` is used in the response to the client.

### Matching requests: `matchConditions`

You can define _match conditions_ for an admission policy if you need fine-grained request filtering. These conditions are useful if you find that match rules, `objectSelectors`, and `namespaceSelectors` still do not provide the filtering you want. Match conditions are [CEL expressions](/docs/reference/using-api/cel/). All match conditions must evaluate to true for the resource to be evaluated.

Here is an example illustrating a few different uses for match conditions:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "demo-policy.example.com"
spec:
  matchConstraints:
    resourceRules:
    - apiGroups:   ["apps"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["deployments"]
  matchConditions:
    - name: 'exclude-kube-system'
      expression: 'object.metadata.namespace != "kube-system"'
    - name: 'exclude-canary-deployments'
      expression: 'request.operation == "UPDATE" || !object.metadata.name.contains("canary")'
  validations:
    - expression: "object.spec.replicas <= 100"
```
Match conditions have access to the same CEL variables as validation and mutation expressions.

In the event of an error evaluating a match condition, the policy is not evaluated. Whether to reject the request is determined as follows:

1. If **any** match condition evaluates to `false` (regardless of other errors), the API server skips the policy.
2. Otherwise:
   - For [`failurePolicy: Fail`](#failure-policy), reject the request (without evaluating the policy).
   - For [`failurePolicy: Ignore`](#failure-policy), proceed with the request but skip the policy.

### Audit annotations

`auditAnnotations` may be used to include custom audit annotations in the audit event of the API request.

For example, here is an admission policy with an audit annotation:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "demo-policy.example.com"
spec:
  matchConstraints:
    resourceRules:
    - apiGroups:   ["apps"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["deployments"]
  auditAnnotations:
    - key: "high-replica-count"
      valueExpression: "object.spec.replicas > 50 ? 'Deployment spec.replicas set to ' + string(object.spec.replicas) : null"
  validations:
    - expression: "object.spec.replicas <= 128"
```
When an API request is evaluated by this admission policy, the resulting audit event will include an annotation. For example

 **the audit event recorded:**

```json
{
    "kind": "Event",
    "apiVersion": "audit.k8s.io/v1",
    "annotations": {
        "admissionregistration.k8s.io/policy": "demo-policy.example.com",
        "demo-policy.example.com/high-replica-count": "Deployment spec.replicas set to 128"
        // other annotations
        ...
    }
    // other fields
    ...
}
```

In this example, the annotation will only be included if the `spec.replicas` of the Deployment is more than 50; otherwise, the CEL expression evaluates to null and the annotation will not be included.

Note that audit annotation keys are prefixed by the name of the policy and a /. If another admission controller, such as an admission webhook, uses the exact same audit annotation key, the value from the first admission controller to set the annotation is preserved, and subsequent attempts to set the same key are ignored.

### Message expression

To return a more friendly message when the policy rejects a request, you can use a CEL expression to compose a message with `spec.validations[i].messageExpression`. Similar to the validation expression, a message expression has access to `object`, `oldObject`, `request`, `params`, and `namespaceObject`. Unlike validations, a message expression must evaluate to a string.

For example, to better inform the user of the reason for denial when the policy refers to a parameter, you can use the following validation:
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "deploy-replica-policy.example.com"
spec:
  matchConstraints:
    resourceRules:
    - apiGroups: ["apps"]
      apiVersions: ["v1"]
      operations: ["CREATE", "UPDATE"]
      resources: ["deployments"]
  validations:
    - expression: "object.spec.replicas <= params.maxReplicas"
      messageExpression: "'object.spec.replicas must be no greater than ' + string(params.maxReplicas)"
```

After creating a params object that limits the replicas to 3 and setting up the binding, when you try to create a deployment with 5 replicas, you will receive the following message:

```shell
error: failed to create deployment: deployments.apps "nginx" is forbidden: ValidatingAdmissionPolicy 'deploy-replica-policy.example.com' with binding 'demo-binding-test.example.com' denied request: object.spec.replicas must be no greater than 3
```

This is more informative than a static message such as "too many replicas".

The message expression takes precedence over the static message defined in spec.validations[i].message if both are defined. However, if the message expression fails to evaluate, the static message is used instead. Additionally, if the message expression evaluates to a multi-line string, the evaluation result is discarded and the static message is used if present. Note that the static message itself is validated to ensure it does not contain multi-line strings.

### Type checking

When a policy definition is created or updated, the API server parses the expressions it contains and reports any syntax errors, rejecting the definition if errors are found. Afterward, the expressions are checked for type errors—including missing fields and type confusion—against the types matched by spec.matchConstraints.

The result of type checking can be retrieved from status.typeChecking. The presence of status.typeChecking indicates the completion of type checking, and an empty status.typeChecking field means no errors were detected.

For example, given the following policy definition:
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
spec:
  matchConstraints:
    resourceRules:
    - apiGroups: ["apps"]
      apiVersions: ["v1"]
      operations: ["CREATE", "UPDATE"]
      resources: ["deployments"]
  validations:
  - expression: "object.replicas > 1"
```

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
If multiple resources are matched in spec.matchConstraints, all matched resources will be checked. For example, the following policy definition:


```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
spec:
  matchConstraints:
    resourceRules:
    - apiGroups: ["apps"]
      apiVersions: ["v1"]
      operations: ["CREATE", "UPDATE"]
      resources: ["deployments", "replicasets"]
  validations:
  - expression: "object.replicas > 1"
```

will produce warnings for each matched type in the status:


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
Type checking has the following limitations:

- No wildcard matching: If spec.matchConstraints.resourceRules contains "*" in any apiGroups, apiVersions, or resources, the types matched by the wildcard will not be checked.
- Matched type limit: The number of matched types is limited to 10. This prevents policies that manually specify too many types from consuming excessive computing resources. Types are ordered by group, then version, then resource; the 11th combination and beyond are ignored.
- Evaluation behavior: Type checking does not affect policy behavior. Even if type checking detects errors, the policy will still be evaluated. If an error occurs during evaluation, the failurePolicy determines the outcome.
- CRD limitations: Type checking does not apply to CustomResourceDefinitions (CRDs), including matched CRD types or the paramKind reference. Support for CRDs is planned for a future release.

### Variable composition

If an expression becomes too complicated, or part of the expression is reusable and computationally expensive to evaluate,
you can extract some part of the expressions into variables. A variable is a named expression that can be referred to later
in `variables` in other expressions.

```yaml
spec:
  variables:
    - name: foo
      expression: "'foo' in object.metadata.labels ? object.metadata.labels['foo'] : 'default'"
  validations:
    - expression: variables.foo == 'bar'
```

A variable is lazily evaluated when it is first referred. Any error that occurs during the evaluation will be
reported during the evaluation of the referring expression. Both the result and potential error are memoized and
count only once towards the runtime cost.

The order of variables is important because a variable can refer to other variables that are defined before it.
This ordering prevents circular references.

The following is a more complex example of enforcing that image repo names match the environment defined in its namespace.
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "image-matches-namespace-environment.policy.example.com"
spec:
  matchConstraints:
    resourceRules:
    - apiGroups: ["apps"]
      apiVersions: ["v1"]
      operations: ["CREATE", "UPDATE"]
      resources: ["deployments"]
  variables:
    - name: environment
      expression: "namespaceObject.metadata.labels['environment']"
  validations:
    - expression: "object.spec.template.spec.containers.all(c, c.image.startsWith(variables.environment + '.example.com/'))"
      messageExpression: "'only ' + variables.environment + ' images are allowed in namespace ' + request.namespace"
```

With the policy bound to the namespace `default`, which is labeled `environment: prod`,
the following attempt to create a deployment would be rejected.
```shell
kubectl create deploy --image=dev.example.com/nginx invalid
```
The error message is similar to this.
```console
error: failed to create deployment: deployments.apps "invalid" is forbidden: ValidatingAdmissionPolicy 'image-matches-namespace-environment.policy.example.com' with binding 'demo-binding-test.example.com' denied request: only prod images are allowed in namespace default
```

## API kinds exempt from admission validation

There are certain API kinds that are exempt from admission-time validation checks. For example, you cannot create a ValidatingAdmissionPolicy that prevents changes to ValidatingAdmissionPolicyBindings.

The list of exempt API kinds is:
* [ValidatingAdmissionPolicies]({{< relref "/docs/reference/kubernetes-api/policy-resources/validating-admission-policy-v1/" >}})
* [ValidatingAdmissionPolicyBindings]({{< relref "/docs/reference/kubernetes-api/policy-resources/validating-admission-policy-binding-v1/" >}})
* MutatingAdmissionPolicies
* MutatingAdmissionPolicyBindings
* [TokenReviews]({{< relref "/docs/reference/kubernetes-api/authentication-resources/token-review-v1/" >}})
* [SubjectAccessReviews]({{< relref "/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/" >}})
* [LocalSubjectAccessReviews]({{< relref "/docs/reference/kubernetes-api/authorization-resources/local-subject-access-review-v1/" >}})
* [SelfSubjectAccessReviews]({{< relref "/docs/reference/kubernetes-api/authorization-resources/self-subject-access-review-v1/" >}})
* [SelfSubjectRulesReviews]({{< relref "/docs/reference/kubernetes-api/authorization-resources/self-subject-rules-review-v1/" >}})
* [SelfSubjectReviews]({{< relref "/docs/reference/kubernetes-api/authentication-resources/self-subject-review-v1/" >}})
