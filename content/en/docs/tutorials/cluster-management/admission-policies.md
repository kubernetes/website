---
title: Explore Validating and Mutating Admission Policies
content_type: tutorial
description: >-
  Use declarative admission policies to validate or mutate resources
  at admission time using Common Expression Language (CEL).
weight: 70
min-kubernetes-server-version: v1.32
---
<!-- overview -->

This page lets you try out declarative _admission policies_, which allow you to use the Common
Expression Language (CEL) to validate or mutate resources.

Kubernetes {{< skew currentVersion >}} supports two kinds of admission policy:

- [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)
- [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/)

This tutorial covers both kinds of admission policy.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

To define admission policies, you must be a cluster administrator. Make sure you have administrator
access to the cluster where you are learning.

For ValidatingAdmissionPolicy, you need:
* A cluster running version 1.30 or later.

For MutatingAdmissionPolicy, you need:
* A cluster running version 1.36 or later.

To check the version, run `kubectl version`.
If you are running an older version of Kubernetes, check the documentation for that version.


## What are declarative admission policies?

Declarative admission policies offer a declarative, 
in-process alternative to admission webhooks.

By using the Common Expression Language (CEL) to declare policy rules,
these policies are evaluated directly within the API server.

These policies are highly configurable, enabling policy authors to define logic that can be parameterized
and scoped to resources as needed by cluster administrators.

### API types for admission policies

The two types of policy have different purposes.

ValidatingAdmissionPolicy is for _enforcing constraints_.

MutatingAdmissionPolicy is for _modifying resources during admission_.

### Policy elements

Each applied policy always has a _policy_ object (ValidatingAdmissionPolicy or MutatingAdmissionPolicy)
and a separate _binding_ object (ValidatingAdmissionPolicyBinding or MutatingAdmissionPolicyBinding).

You can also use _parameters_, which are **optional**. To learn more, see
[parameter resources](/docs/reference/access-authn-authz/validating-admission-policy/#parameter-resources) (ValidatingAdmissionPolicy) or
[parameter resources](/docs/reference/access-authn-authz/mutating-admission-policy/#parameter-resources) (MutatingAdmissionPolicy).

Policy objects describes the abstract logic of a policy using Common Expression Language (CEL). 
For example, a ValidatingAdmissionPolicy might enforce replica limits or ensure specific labels are present, 
while a MutatingAdmissionPolicy can modify resources such as adding a default label to a namespace.

Binding objects link the policy to your cluster and provides scoping. 
A ValidatingAdmissionPolicyBinding or MutatingAdmissionPolicyBinding connects the policy to specific resources. 
If you only want to enforce a policy for a specific subset of resources, the binding is where you narrow the
scope of the policy (using `matchResources`).

Parameters allow separating configuration for the policy behavior from its definition.
Parameter resources refer to Kubernetes resources available in the API. 
They can be built-in API types (such as ConfigMap), or they can be
[custom resources](docs/concepts/extend-kubernetes/api-extension/custom-resources/).
A policy binding then uses `spec.paramRef` to reference an actual parameter resource. 

If a policy does not require parameters, you leave `spec.paramKind` unspecified.

### CEL expressions

Both kinds of policy rely on an expression language known as Common Expression Language (CEL).
Read [CEL in Kubernetes](/docs/reference/using-api/cel/) to learn more.

If you are new to CEL, practice writing a very simple expression, such as `false || true`.
You can test CEL expressions in [CEL Playground](https://playcel.undistro.io).

### Policy actions

Each admission policy binding must specify one or more actions to declare how the policy
is enforced.

#### ValidatingAdmissionPolicyBinding {#policy-actions-validating}


For ValidatingAdmissionPolicyBinding, the supported `validationActions` are:

Audit
: Validation failure is included in the audit event for the API request.

Warn
: Validation failure is reported to the request client as a
  [warning](/blog/2020/09/03/warnings/).

Deny
: Validation failure results in a denied request.

A policy check that fails or an error that occurs is enforced according to these actions.
Failures defined by the `failurePolicy` are enforced according to these actions only if the `failurePolicy`
is set to `Fail` (or not specified).

See [Audit Annotations: validation failures](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure)
for more details about audit logging for policies.

You are not allowed to use Deny and Warn together, since this combination would duplicate
the validation failure in both the API response body and the HTTP `Warning:` header.

#### MutatingAdmissionPolicyBinding {#policy-actions-mutating}

For MutatingAdmissionPolicyBinding, the the action is always to mutate the object.

You can use a JSON Patch or a Kubernetes _apply configuration_.

## Enforcement through validation

Now, try defining a ValidatingAdmissionPolicy.

The following is an example of a ValidatingAdmissionPolicy that requires that any Deployment has multiple replicas.

{{< code_sample language="yaml" file="access/manifest-admission-control/vap-min-replicas.yaml" >}}

`spec.validations` contains CEL expressions which use the [Common Expression Language (CEL)](https://github.com/google/cel-spec)
to validate the request. 
If an expression evaluates to false, the validation check is enforced according to the `spec.failurePolicy` field.

Write a policy like this and apply it.

Or, if you want to apply a ready-made manifest:

```shell
kubectl apply --server-side -f https://k8s.io/examples/access/manifest-admission-control/vap-min-replicas.yaml
```

On its own, this doesn't do anything.

You can try creating a Deployment with 0 or 1 replicas; it will work (unless some other policy prevents it).

---

To make it work, you define a ValidatingAdmissionPolicyBinding.

Pick a namespace where you'll enforce the new policy.

The following is an example ValidatingAdmissionPolicyBinding for the policy you made:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: enforce-multiple-replicas-deployments-binding
spec:
  policyName: "enforce-multiple-replicas-deployments"
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchLabels:
        kubernetes.io/metadata.name: default # change this to match the namespace you're using
```

{{< caution >}}
Anyone with full / admin access to a namespace can write to its labels. This includes deleting a label from
the namespace.

The `kubernetes.io/metadata.name` label is protected, but if you use a different label, take care to make sure
that only trusted users have a way to remove or edit that label you choose.
{{< /caution >}}

Write a manifest based on that example YAML (if you're using the `default` namespace, you can use
it without any changes). Apply that manifest using `kubectl apply`.


### Test the policy {#test-admission-policy-validation}

Now, test the policy. Try [creating a Deployment](docs/tasks/run-application/run-stateless-application-deployment/)
and then scale it to 0 replicas using `kubectl scale`. What happens?

You could change the ValidatingAdmissionPolicyBinding to have a different validation action,
instead of Deny. If you choose the Warning validation action and try to scale a Deployment to 0 replicas,
what happens?

{{< note >}}
If you did change the ValidatingAdmissionPolicyBinding to just warn people, there's a problem&hellip;

The name is wrong! If you change a ValidatingAdmissionPolicyBinding or the associated ValidatingAdmissionPolicy so
that it only warns people, you should check if you also need to change the name of the policy. You would change the
name to make sure that the naming doesn't mislead people.
{{< /note >}}



### Existing resources aren't affected {#limitation-admission-policy-validation}

If you have a Deployment with 0 or 1 replicas, and you change the ValidatingAdmissionPolicyBinding back
to Deny mode, it doesn't affect any existing resources.

(If you wanted to try to scale out Deployments to have at least 2 replicas, you could achieve that another
way - for example, using a {{< glossary_tooltip text="controller" term_id="controller" >}}).

That's all for the ValidatingAdmissionPolicy. Now you'll learn about MutatingAdmissionPolicies.

## Modifying resources when they are created or changed {#mutation}

For this example, imagine that you want to use [Pod security admission](/docs/concepts/security/pod-security-admission/)
to ensure that namespaces, other than system namespaces, enforce a Pod security standard.

Similar to validation, you can create a MutatingAdmissionPolicy that can modify 
resources during admission. The API type that you need to modify is Namespace.

Here's a MutatingAdmissionPolicy that does some of this:

{{< code_sample language="yaml" file="access/manifest-admission-control/default-pod-security-baseline.yaml" >}}

{{< caution >}}
This policy sets a **default**. Someone with the ability to update a Namespace would be able to remove the
`pod-security.kubernetes.io/enforce` label from a namespace.

If you are not sure what this means, read through the [Security](/docs/concepts/security/) documentation or
get external information security advice.
{{< /caution >}}

To apply that policy:

```shell
kubectl apply --server-side -f https://k8s.io/examples/access/manifest-admission-control/default-pod-security-baseline.yaml 
```

A MutatingAdmissionPolicyBinding is required to activate this policy; for example:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: default-pod-security-baseline
spec:
  # the name of the MutatingAdmissionPolicy to apply
  policyName: default-pod-security-baseline
```

### Test the policy {#test-admission-policy-mutation}

Try creating a new namespace named `example`:

```shell
kubectl create ns example
```

Examine its labels:
```shell
kubectl describe ns example
```

Even though you didn't specify a Pod security admission enforcement level, the label has been set.

Next, check whether you can find a way round the security settings.
Create a YAML manifest for a different Namespace:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: another-example
  labels:
    pod-security.kubernetes.io/enforce: privileged
```

You can create that namespace from the local manifest using `kubectl apply --server-side`. Does it work?

Yes, and the new namespace allows running privileged Pods.

This admission policy was **not** set up to validate or restrict. It provides a default value, but you can set
your own.
However, you can combine mutating admission with a validating admission policy as a way to enforce something,
but also make it easy to comply. (The tutorial doesn't explain this, but you can do it).

Providing a useful default means that when people don't set anything, they get a better outcome than just seeing
an error message. Imagine if you did have a validation rule to make sure that all namespaces had to enforce at
least the baseline standard. Anyone who didn't know about that rule might try to deploy something and immediately
see an error message when they try making a namespace.

### Use a parameter resource

Parameter resources allow a policy configuration to be separate from its definition.
A policy can define `paramKind`, which outlines the group, version, and kind (also known as GVK)
of the parameter resource. Then, a  policy binding ties that policy to the scope where it is bound,
as configured by a particular parameter resource.

{{< code_sample language="yaml" file="access/manifest-admission-control/default-pod-security-configurable.yaml" >}}

Here is a sample MutatingAdmissionPolicyBinding:

```yaml
---
apiVersion: admissionregistration.k8s.io/v1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: default-pod-security-configurable
spec:
  # the name of the MutatingAdmissionPolicy to apply
  policyName: default-pod-security-configurable

  # parameters to use
  paramRef:
    # if the ConfigMap is missing or empty, don't set a default
    # (but do allow namespace creation)
    parameterNotFoundAction: Allow

    # where to find the parameter
    namespace: kube-system
    name: default-pod-security-standard
```

and here's a sample ConfigMap to put into the kube-system namespace:

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: kube-system
  name: default-pod-security-standard
data:
  default: baseline # could also be "restricted"
```

Define both of those. You should **create the ConfigMap first**; the binding expects that the parameter
resource already exists (even if you plan to change it later).

Now, delete the previous MutatingAdmissionPolicyBinding:
```shell
kubectl delete mutatingadmissionpolicybindings/default-pod-security-baseline
```

and create a new namespace:
```shell
kubectl create ns yet-another-example
```

```shell
kubectl describe ns yet-another-example
```

Did the labels get defaulted?

### Change the parameter

```shell
# This starts an editor that lets you change .data.default for the parameter
kubectl --namespace kube-system edit configmap default-pod-security-standard
```

After you change it, try creating one more namespace. What happens?

## Clean up

To remove the resources created, run the following commands:

```bash
kubectl delete validatingadmissionpolices/enforce-multiple-replicas-deployments \
               validatingadmissionpolicybindings/enforce-multiple-replicas-deployments

kubectl delete mutatingadmissionpolicies/default-pod-security-baseline \
               mutatingadmissionpolicybindings/default-pod-security-baseline

kubectl delete mutatingadmissionpolicies/default-pod-security-configurable \
               mutatingadmissionpolicybindings/default-pod-security-configurable

kubectl --namespace kube-system delete configmaps/default-pod-security-standard

kubectl delete namespaces/example namespaces/another-example namespaces/yet-another-example
```

If you created any test Pods or test Namespaces, clear those up too.
