---
title: Validating and Mutating Admission Policies
content_type: tutorial
description: >-
  Use declarative admission policies to validate or mutate resources
  at admission time using Common Expression Language (CEL).
weight: 120
min-kubernetes-server-version: v1.32
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

For ValidatingAdmissionPolicy,
ensure your cluster is version 1.30 or later.

For MutatingAdmissionPolicy, you need:
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

## What are declarative admission policies?

Declarative admission policies offer a declarative, 
in-process alternative to admission webhooks.
By using the Common Expression Language (CEL) 
to declare policy rules,
these policies are evaluated directly within the API server.

These policies are highly configurable,
enabling policy authors to define logic that can be parameterized
and scoped to resources as needed by cluster administrators.
They are divided into two types:

ValidatingAdmissionPolicy 
: for enforcing constraints.

MutatingAdmissionPolicy (beta) 
: for modifying resources during admission.

## API types for admission policies

A declarative policy requires a Policy and a Binding. 
Parameter resources are optional and provide runtime configuration.

The `policy` resource
: Describes the abstract logic of a policy using Common Expression Language (CEL). 
  For example, a ValidatingAdmissionPolicy might enforce replica limits 
  or ensure specific labels are present, 
  while a MutatingAdmissionPolicy can modify resources 
  such as adding a default label to a namespace.

The `binding` resource
: Links the policy to your cluster and provides scoping. 
  A ValidatingAdmissionPolicyBinding or MutatingAdmissionPolicyBinding 
  connects the policy to specific resources. 
  If you only want to enforce a policy for a specific subset of resources, 
  the binding is where you narrow the scope of the policy using `matchResources`.

The `parameter` resource (optional)
: Allows a policy configuration to be separate from its definition. 
  Parameter resources refer to Kubernetes resources available in the API. 
  They can be built-in types like `ConfigMap` 
  or extensions such as a CustomResourceDefinition (CRD). 
  A policy binding then uses `spec.paramRef` to reference an actual parameter resource. 
  If a policy does not require parameters, leave `spec.paramKind` unspecified.

### ValidatingAdmissionPolicy

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

### MutatingAdmissionPolicy (beta) {#mutatingadmissionpolicy}

Similar to validation, you can create a MutatingAdmissionPolicy that can modify 
resources during admission.
The following example enforces the baseline Pod Security Standard on newly created
namespaces that are not system namespaces and have no pod security admission label set.

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

A MutatingAdmissionPolicyBinding is required to activate this policy:

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: "set-baseline-pod-security-binding"
spec:
  policyName: "set-baseline-pod-security"
```

#### Policy actions

Each admission policy binding must specify one or more actions
to declare how the policy is enforced.

For ValidatingAdmissionPolicyBinding,
the supported `validationActions` are:

`Audit`
: Validation failure is included in the audit event for the API request.

`Warn`
: Validation failure is reported to the request client as a
  [warning](/blog/2020/09/03/warnings/).

`Deny`
: Validation failure results in a denied request.

`Deny` and `Warn` may not be used together,
since this combination duplicates the validation failure
in both the API response body and the HTTP warning headers.

For MutatingAdmissionPolicyBinding,
the supported `mutationActions` include:

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
which outlines the Group, Version, and Kind (GVK) of the parameter resource,
and then a policy binding ties a policy by name (via `policyName`)
to a particular parameter resource via `paramRef`.

Parameter resources decouple policy logic from its configuration. 
To use them, define a ValidatingAdmissionPolicy with a paramKind 
that references your configuration resource:

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

## Clean up

To remove the resources created, run the following commands:

```bash
kubectl delete validatingadmissionpolicy replica-limit-prod.example.com
kubectl delete validatingadmissionpolicybinding demo-binding-test.example.com
kubectl delete mutatingadmissionpolicy set-baseline-pod-security
kubectl delete mutatingadmissionpolicybinding set-baseline-pod-security-binding
```
