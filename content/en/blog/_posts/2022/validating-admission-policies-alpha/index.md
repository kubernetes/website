---
layout: blog
title: "Kubernetes 1.26: Introducing Validating Admission Policies"
date: 2022-12-20
slug: validating-admission-policies-alpha
author: >
  Joe Betz (Google),
  Cici Huang (Google)
---

In Kubernetes 1.26, the 1st alpha release of validating admission policies is
available!

Validating admission policies use the [Common Expression
Language](https://github.com/google/cel-spec) (CEL) to offer a declarative,
in-process alternative to [validating admission
webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks).

CEL was first introduced to Kubernetes for the [Validation rules for
CustomResourceDefinitions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules).
This enhancement expands the use of CEL in Kubernetes to support a far wider
range of admission use cases.

Admission webhooks can be burdensome to develop and operate. Webhook developers
must implement and maintain a webhook binary to handle admission requests. Also,
admission webhooks are complex to operate. Each webhook must be deployed,
monitored and have a well defined upgrade and rollback plan. To make matters
worse, if a webhook times out or becomes unavailable, the Kubernetes control
plane can become unavailable. This enhancement avoids much of this complexity of
admission webhooks by embedding CEL expressions into Kubernetes resources
instead of calling out to a remote webhook binary.

For example, to set a limit on how many replicas a Deployment can have.
Start by defining a validation policy:

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
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

The `expression` field contains the CEL expression that is used to validate
admission requests. `matchConstraints` declares what types of requests this
`ValidatingAdmissionPolicy` is may validate.

Next bind the policy to the appropriate resources:

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "demo-binding-test.example.com"
spec:
  policyName: "demo-policy.example.com"
  matchResources:
    namespaceSelector:
      matchExpressions:
      - key: environment
        operator: In
        values:
        - test
```

This `ValidatingAdmissionPolicyBinding` resource binds the above policy only to
namespaces where the `environment` label is set to `test`. Once this binding
is created, the kube-apiserver will begin enforcing this admission policy.

To emphasize how much simpler this approach is than admission webhooks, if this example
were instead implemented with a webhook, an entire binary would need to be
developed and maintained just to perform a `<=` check. In our review of a wide
range of admission webhooks used in production, the vast majority performed
relatively simple checks, all of which can easily be expressed using CEL.

Validation admission policies are highly configurable, enabling policy authors
to define policies that can be parameterized and scoped to resources as needed
by cluster administrators.

For example, the above admission policy can be modified to make it configurable:

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicy
metadata:
  name: "demo-policy.example.com"
spec:
  paramKind:
    apiVersion: rules.example.com/v1 # You also need a CustomResourceDefinition for this API
    kind: ReplicaLimit
  matchConstraints:
    resourceRules:
    - apiGroups:   ["apps"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["deployments"]
  validations:
    - expression: "object.spec.replicas <= params.maxReplicas"
```

Here, `paramKind` defines the resources used to configure the policy and the
`expression` uses the `params` variable to access the parameter resource.

This allows multiple bindings to be defined, each configured differently. For
example:

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "demo-binding-production.example.com"
spec:
  policyName: "demo-policy.example.com"
  paramRef:
    name: "demo-params-production.example.com"
  matchResources:
    namespaceSelector:
      matchExpressions:
      - key: environment
        operator: In
        values:
        - production
```

```yaml
apiVersion: rules.example.com/v1 # defined via a CustomResourceDefinition
kind: ReplicaLimit
metadata:
  name: "demo-params-production.example.com"
maxReplicas: 1000
```

This binding and parameter resource pair limit deployments in namespaces with the
`environment` label set to `production` to a max of 1000 replicas.

You can then use a separate binding and parameter pair to set a different limit
for namespaces in the `test` environment.

I hope this has given you a glimpse of what is possible with validating
admission policies! There are many features that we have not yet touched on.

To learn more, read
[Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/).

We are working hard to add more features to admission policies and make the
enhancement easier to use. Try it out, send us your feedback and help us build
a simpler alternative to admission webhooks!

## How do I get involved?

If you want to get involved in development of admission policies, discuss enhancement
roadmaps, or report a bug, you can get in touch with developers at
[SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery).
