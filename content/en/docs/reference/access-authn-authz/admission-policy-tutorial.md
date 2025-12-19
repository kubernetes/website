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

This page provides an overview of declarative admission policies,
which allow you to use the Common Expression Language (CEL)
to validate or mutate resources.

`MutatingAdmissionPolicy` (beta)
: Modifies an object before it is stored
  (example: adding a default label).

`ValidatingAdmissionPolicy`
: Configures whether to allow or deny a request
  that would modify a resource,
  based on specific rules.

{{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

For `ValidatingAdmissionPolicy`,
ensure your cluster is version 1.30 or later.

For `MutatingAdmissionPolicy`, you need:
* A cluster running version 1.32 or later.
* The `MutatingAdmissionPolicy` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled.
* The `admissionregistration.k8s.io/v1beta1` [API group](/docs/concepts/overview/kubernetes-api/#api-groups) enabled.

### Local testing

{{< tabs name="local_cluster_setup" >}}
{{% tab name="kind" %}}
If you are using [kind](https://kind.sigs.k8s.io/), 
use this configuration to enable the necessary features:

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
If you are using minikube, 
run:

```bash
minikube start --feature-gates=MutatingAdmissionPolicy=true \
  --runtime-config=admissionregistration.k8s.io/v1beta1=true
```

{{% /tab %}} 
{{< /tabs >}}

## What are Declarative Admission Policies?

Declarative admission policies offer a declarative, 
in-process alternative to admission webhooks.
By using the Common Expression Language (CEL) 
to declare policy rules,
these policies are evaluated directly within the API server.

These policies are highly configurable,
enabling policy authors to define logic that can be parameterized
and scoped to resources as needed by cluster administrators.
They are divided into two types:

`ValidatingAdmissionPolicy` 
: for enforcing constraints.

`MutatingAdmissionPolicy` (beta) 
: for modifying resources during admission.

## What Resources Make a Policy

A declarative policy is generally made up of three distinct resources:

The `policy` resource
: Describes the abstract logic.
  For example, a `ValidatingAdmissionPolicy` might ensure a specific label is present,
  while a `MutatingAdmissionPolicy` adds a default owner label.

A `parameter` resource
: Provides information to the policy to make it a concrete statement.
  For example, the `owner` label must be set to `champbreed`.
  A native type such as a `ConfigMap` or a Custom Resource Definition (CRD)
  defines the schema of a parameter resource.
  The `Policy` object specifies the `paramKind` it expects.

A `binding` resource
: Links the policy to specific resources and provides scoping.
  A `ValidatingAdmissionPolicyBinding` or `MutatingAdmissionPolicyBinding`
  connects the logic to your cluster.
  If you only want to enforce or apply a policy to `Namespaces`,
  the binding is where you specify that restriction via `matchResources`.

At least a `Policy` and a corresponding `Binding` must be defined
for a policy to have an effect.

If a policy does not require configuration,
you may leave the `spec.paramKind` field empty in the `Policy` resource.

## Getting Started with Declarative Admission Policies

Admission policies are part of the cluster control plane.
You should write and deploy them with great caution.

The following describes how to quickly experiment with both
`ValidatingAdmissionPolicy` and `MutatingAdmissionPolicy` (beta).

### Validating Admission Policy

The following is an example of a `ValidatingAdmissionPolicy`
that limits deployment replicas.

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

`spec.validations` contains CEL Expressions which use the [Common Expression Language (CEL)](https://github.com/google/cel-spec)
to validate the request. 
If an expression evaluates to false, 
the validation check is enforced
according to the `spec.failurePolicy` field.

{{< note >}}
You can quickly test CEL expressions in [CEL Playground](https://playcel.undistro.io).
{{< /note >}}

To configure a validating admission policy for use in a cluster, 
a binding is required.
The following is an example of a `ValidatingAdmissionPolicyBinding`:

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

### Mutating Admission Policy (Beta)

Similar to validation, you can create a `MutatingAdmissionPolicy` to modify resources. 
The following example ensures that all created Pods have a specific owner label.

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

Each admission policy binding must specify one or more actions
to declare how the policy is enforced.

For `ValidatingAdmissionPolicyBinding`,
the supported `validationActions` are:

`Deny`
: Validation failure results in a denied request.

`Warn`
: Validation failure is reported to the request client as a
  [warning](/blog/2020/09/03/warnings/).

`Audit`
: Validation failure is included in the audit event for the API request.

`Deny` and `Warn` may not be used together,
since this combination duplicates the validation failure
in both the API response body and the HTTP warning headers.

For `MutatingAdmissionPolicyBinding`,
the supported `mutationActions` (beta) include:

`Apply`
: Applies the CEL-based mutation to the resource.

A policy check that fails or an error that occurs
is enforced according to these actions.
Failures defined by the `failurePolicy` are enforced
according to these actions only if the `failurePolicy`
is set to `Fail` (or not specified).

See [Audit Annotations: validation failures](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure)
for more details about audit logging for policies.

### Parameter resources

Parameter resources allow a policy configuration to be separate from its definition.
A policy can define `paramKind`, 
which outlines the GVK of the parameter resource,
and then a policy binding ties a policy by name (via `policyName`)
to a particular parameter resource via `paramRef`.

If parameter configuration is needed, 
the following is an example of a `ValidatingAdmissionPolicy` with parameter configuration.

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

The `spec.paramKind` field specifies the kind of resources 
used to parameterize the policy.
In this example,
it is configured by `ReplicaLimit` custom resources.

Note how the CEL expression references the parameters 
via the CEL `params` variable (e.g., `params.maxReplicas`).
The `spec.matchConstraints` specifies what resources 
this policy is designed to evaluate.
Native types such as `ConfigMap` 
can also be used as parameter references.

For each admission request, 
the API server evaluates CEL expressions 
of each (`policy`, `binding`, `param`) combination 
that match the request.
For a request to be admitted, 
it must pass all evaluations.
