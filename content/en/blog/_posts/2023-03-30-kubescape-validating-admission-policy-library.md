---
layout: blog
title: "Kubernetes Validating Admission Policies: A Practical Example"
date: 2023-03-30T00:00:00+0000
slug: kubescape-validating-admission-policy-library
author: >
   Craig Box (ARMO),
   Ben Hirschberg (ARMO)
---

Admission control is an important part of the Kubernetes control plane, with several internal
features depending on the ability to approve or change an API object as it is submitted to the
server. It is also useful for an administrator to be able to define business logic, or policies,
regarding what objects can be admitted into a cluster. To better support that use case, [Kubernetes
introduced external admission control in
v1.7](/blog/2017/06/kubernetes-1-7-security-hardening-stateful-application-extensibility-updates/).

In addition to countless custom, internal implementations, many open source projects and commercial
solutions implement admission controllers with user-specified policy, including
[Kyverno](https://github.com/kyverno/kyverno) and Open Policy Agent’s
[Gatekeeper](https://github.com/open-policy-agent/gatekeeper).

While admission controllers for policy have seen adoption, there are blockers for their widespread
use. Webhook infrastructure must be maintained as a production service, with all that entails. The
failure case of an admission control webhook must either be closed, reducing the availability of the
cluster; or open, negating the use of the feature for policy enforcement. The network hop and
evaluation time makes admission control a notable component of latency when dealing with, for
example, pods being spun up to respond to a network request in a "serverless" environment.

## Validating admission policies and the Common Expression Language

Version 1.26 of Kubernetes introduced, in alpha, a compromise solution. [Validating admission
policies](/docs/reference/access-authn-authz/validating-admission-policy/) are a declarative,
in-process alternative to admission webhooks. They use the [Common Expression
Language](https://github.com/google/cel-spec) (CEL) to declare validation rules.

CEL was developed by Google for security and policy use cases, based on learnings from the Firebase
real-time database. Its design allows it to be safely embedded into applications and executed in
microseconds, with limited compute and memory impact. [Validation rules for
CRDs](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
introduced CEL to the Kubernetes ecosystem in v1.23, and at the time it was noted that the language
would suit a more generic implementation of validation by admission control.

## Giving CEL a roll - a practical example

[Kubescape](https://github.com/kubescape/kubescape) is a CNCF project which has become one of the
most popular ways for users to improve the security posture of a Kubernetes cluster and validate its
compliance. Its [controls](https://github.com/kubescape/regolibrary) — groups of tests against API
objects — are built in [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/), the
policy language of Open Policy Agent.

Rego has a reputation for complexity, based largely on the fact that it is a declarative query
language (like SQL). It [was
considered](https://github.com/kubernetes/enhancements/blob/499e28/keps/sig-api-machinery/2876-crd-validation-expression-language/README.md#alternatives)
for use in Kubernetes, but it does not offer the same sandbox constraints as CEL.

A common feature request for the project is to be able to implement policies based on Kubescape’s
findings and output. For example, after scanning pods for [known paths to cloud credential
files](https://hub.armosec.io/docs/c-0020), users would like the ability to enforce policy that
these pods should not be admitted at all. The Kubescape team thought this would be the perfect
opportunity to try and port our existing controls to CEL and apply them as admission policies.

### Show me the policy

It did not take us long to convert many of our controls and build a [library of validating admission
policies](https://github.com/kubescape/cel-admission-library). Let’s look at one as an example.

Kubescape’s [control C-0017](https://hub.armosec.io/docs/c-0017) covers the requirement for
containers to have an immutable (read-only) root filesystem. This is a best practice according to
the [NSA Kubernetes hardening
guidelines](/blog/2021/10/05/nsa-cisa-kubernetes-hardening-guidance/#immutable-container-filesystems),
but is not currently required as a part of any of the [pod security
standards](/docs/concepts/security/pod-security-standards/).

Here's how we implemented it in CEL:

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicy
metadata:
  name: "kubescape-c-0017-deny-resources-with-mutable-container-filesystem"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   [""]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["pods"]
    - apiGroups:   ["apps"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["deployments","replicasets","daemonsets","statefulsets"]
    - apiGroups:   ["batch"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["jobs","cronjobs"]
  validations:
    - expression: "object.kind != 'Pod' || object.spec.containers.all(container, has(container.securityContext) && has(container.securityContext.readOnlyRootFilesystem) &&  container.securityContext.readOnlyRootFilesystem == true)"
      message: "Pods having containers with mutable filesystem not allowed! (see more at https://hub.armosec.io/docs/c-0017)"
    - expression: "['Deployment','ReplicaSet','DaemonSet','StatefulSet','Job'].all(kind, object.kind != kind) || object.spec.template.spec.containers.all(container, has(container.securityContext) && has(container.securityContext.readOnlyRootFilesystem) &&  container.securityContext.readOnlyRootFilesystem == true)"
      message: "Workloads having containers with mutable filesystem not allowed! (see more at https://hub.armosec.io/docs/c-0017)"
    - expression: "object.kind != 'CronJob' || object.spec.jobTemplate.spec.template.spec.containers.all(container, has(container.securityContext) && has(container.securityContext.readOnlyRootFilesystem) &&  container.securityContext.readOnlyRootFilesystem == true)"
      message: "CronJob having containers with mutable filesystem not allowed! (see more at https://hub.armosec.io/docs/c-0017)"
```

Match constraints are provided for three possible API groups: the `core/v1` group for Pods, the
`apps/v1` workload controllers, and the `batch/v1` job controllers. 

{{< note >}} `matchConstraints` will convert the API object to the matched version for you. If, for
example, an API request was for `apps/v1beta1` and you match `apps/v1` in matchConstraints, the API
request will be converted from `apps/v1beta1` to `apps/v1` and then validated. This has the useful
property of making validation rules secure against the introduction of new versions of APIs, which
would otherwise allow API requests to sneak past the validation rule by using the newly introduced
version. {{< /note >}}

The `validations` include the CEL rules for the objects. There are three different expressions,
catering for the fact that a Pod `spec` can be at the root of the object (a [naked
pod](/docs/concepts/configuration/overview/#naked-pods-vs-replicasets-deployments-and-jobs)),
under `template` (a workload controller or a Job), or under `jobTemplate` (a CronJob).

In the event that any `spec` does not have `readOnlyRootFilesystem` set to true, the object will not
be admitted.

{{< note >}} In our initial release, we have grouped the three expressions into the same policy
object. This means they can be enabled and disabled atomically, and thus there is no chance that a
user will accidentally leave a compliance gap by enabling policy for one API group and not the
others. Breaking them into separate policies would allow us access to improvements targeted for the
1.27 release, including type checking. We are talking to SIG API Machinery about how to best address
this before the APIs reach `v1`. {{< /note >}}

### Using the CEL library in your cluster

Policies are provided as Kubernetes objects, which are then bound to certain resources by a
[selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors).

[Minikube](https://minikube.sigs.k8s.io/docs/) is a quick and easy way to install and configure a
Kubernetes cluster for testing. To install Kubernetes v1.26 with the `ValidatingAdmissionPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled:

```shell
minikube start --kubernetes-version=1.26.1 --extra-config=apiserver.runtime-config=admissionregistration.k8s.io/v1alpha1  --feature-gates='ValidatingAdmissionPolicy=true'
```

To install the policies in your cluster:

```shell
# Install configuration CRD
kubectl apply -f https://github.com/kubescape/cel-admission-library/releases/latest/download/policy-configuration-definition.yaml
# Install basic configuration
kubectl apply -f https://github.com/kubescape/cel-admission-library/releases/latest/download/basic-control-configuration.yaml
# Install policies
kubectl apply -f https://github.com/kubescape/cel-admission-library/releases/latest/download/kubescape-validating-admission-policies.yaml
```

To apply policies to objects, create a `ValidatingAdmissionPolicyBinding` resource. Let’s apply the
above Kubescape C-0017 control to any namespace with the label `policy=enforced`:

```shell
# Create a binding
kubectl apply -f - <<EOT
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: c0017-binding
spec:
  policyName: kubescape-c-0017-deny-mutable-container-filesystem
  matchResources:
    namespaceSelector:
      matchLabels:
        policy: enforced
EOT

# Create a namespace for running the example
kubectl create namespace policy-example
kubectl label namespace policy-example 'policy=enforced'
```

Now, if you attempt to create an object without specifying a `readOnlyRootFilesystem`, it will not
be created.

```shell
# The next line should fail
kubectl -n policy-example run nginx --image=nginx --restart=Never
```

The output shows our error:

```
The pods "nginx" is invalid: : ValidatingAdmissionPolicy 'kubescape-c-0017-deny-mutable-container-filesystem' with binding 'c0017-binding' denied request: Pods having containers with mutable filesystem not allowed! (see more at https://hub.armosec.io/docs/c-0017)
```

### Configuration

Policy objects can include configuration, which is provided in a different object. Many of the
Kubescape controls require a configuration: which labels to require, which capabilities to allow or
deny, which registries to allow containers to be deployed from, etc. Default values for those
controls are defined in [the ControlConfiguration
object](https://github.com/kubescape/cel-admission-library/blob/main/configuration/basic-control-configuration.yaml).

To use this configuration object, or your own object in the same format, add a `paramRef.name` value
to your binding object:

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: c0001-binding
spec:
  policyName: kubescape-c-0001-deny-forbidden-container-registries
  paramRef:
    name: basic-control-configuration
  matchResources:
    namespaceSelector:
      matchLabels:
        policy: enforced
```

## Summary

Converting our controls to CEL was simple, in most cases. We cannot port the whole Kubescape
library, as some controls check for things outside a Kubernetes cluster, and some require data that
is not available in the admission request object. Overall, we are happy to contribute this library
to the Kubernetes community and will continue to develop it for Kubescape and Kubernetes users
alike. We hope it becomes useful, either as something you use yourself, or as examples for you to
write your own policies.

As for the validating admission policy feature itself, we are very excited to see this native
functionality introduced to Kubernetes. We look forward to watching it move to Beta and then GA,
hopefully by the end of the year. It is important to note this feature is currently in Alpha, which
means this is the perfect opportunity to play around with it in environments like Minikube and give
a test drive. However, it is not yet considered production-ready and stable, and will not be enabled
on most managed Kubernetes environments. We will not recommend Kubescape users use these policies in
production until the underlying functionality becomes stable. Keep an eye on [the
KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/3488-cel-admission-control/README.md),
and of course this blog, for an eventual release announcement.
