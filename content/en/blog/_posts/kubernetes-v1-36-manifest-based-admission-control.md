---
layout: blog
title: "Kubernetes v1.36: Admission Policies That Can't Be Deleted"
date: 2026-xx-xxT10:30:00-08:00
draft: true
slug: kubernetes-v1-36-manifest-based-admission-control
author: >
  [Anish Ramasekar](https://github.com/aramase) (Microsoft),
  [Benjamin Elder](https://github.com/BenTheElder) (Google)
---

If you've ever tried to enforce a security policy across a fleet of
Kubernetes clusters, you've probably run into a frustrating chicken-and-egg
problem. Your admission policies are API objects, which means they don't
exist until someone creates them, and they can be deleted by anyone with
the right RBAC permissions. There's always a window during cluster bootstrap
where your policies aren't active yet, and there's no way to prevent a
privileged user from removing them.

Kubernetes v1.36 introduces an alpha feature that addresses this:
*manifest-based admission control*. It lets you define admission webhooks
and [CEL](/docs/reference/using-api/cel/)-based policies as files on disk, loaded by the API server at
startup, before it serves any requests.

## The gap we're closing

Most Kubernetes policy enforcement today works through the API. You create
a ValidatingAdmissionPolicy or a webhook configuration as an API object,
and the admission controller picks it up. This works well in steady state,
but it has some fundamental limitations.

During cluster bootstrap, there's a gap between when the API server starts
serving requests and when your policies are created and active. If you're
restoring from a backup or recovering from an etcd failure, that gap can be
significant.

There's also a self-protection problem. Admission webhooks and policies
can't intercept operations on their own configuration resources. Kubernetes
skips invoking webhooks on types like ValidatingWebhookConfiguration to
avoid circular dependencies. That means a sufficiently privileged user can
delete your critical admission policies, and there's nothing in the
admission chain to stop them.

We - Kubernetes SIG API Machinery - wanted a way to say "these policies are always on, full stop."

## How it works

You add a `staticManifestsDir` field to the `AdmissionConfiguration` file
that you already pass to the API server via `--admission-control-config-file`.
Point it at a directory, drop your policy YAML files in there, and the API
server loads them before it starts serving.

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: ValidatingAdmissionPolicy
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: ValidatingAdmissionPolicyConfiguration
    staticManifestsDir: "/etc/kubernetes/admission/validating-policies/"
```

The manifest files are standard Kubernetes resource definitions. The only
requirement is that all the objects that these manifests define **must** have names ending in `.static.k8s.io`.
This reserved suffix prevents collisions with API-based configurations and
makes it easy to tell where an admission decision came from when you're
looking at metrics or audit logs.

Here's a complete example that denies privileged containers outside
kube-system:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "deny-privileged.static.k8s.io"
  annotations:
    kubernetes.io/description: "Deny privileged containers outside kube-system"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups: [""]
      apiVersions: ["v1"]
      operations: ["CREATE", "UPDATE"]
      resources: ["pods"]
  variables:
  - name: allContainers
    expression: >-
      object.spec.containers +
      (has(object.spec.initContainers) ? object.spec.initContainers : []) +
      (has(object.spec.ephemeralContainers) ? object.spec.ephemeralContainers : [])
  validations:
  - expression: >-
      !variables.allContainers.exists(c,
      has(c.securityContext) && has(c.securityContext.privileged) &&
      c.securityContext.privileged == true)
    message: "Privileged containers are not allowed"
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "deny-privileged-binding.static.k8s.io"
  annotations:
    kubernetes.io/description: "Bind deny-privileged policy to all namespaces except kube-system"
spec:
  policyName: "deny-privileged.static.k8s.io"
  validationActions:
  - Deny
  matchResources:
    namespaceSelector:
      matchExpressions:
      - key: "kubernetes.io/metadata.name"
        operator: NotIn
        values: ["kube-system"]
```

## Protecting what couldn't be protected before

The part we're most excited about is the ability to intercept operations on
admission configuration resources themselves.

With API-based admission, webhooks and policies are never invoked on types
like ValidatingAdmissionPolicy or ValidatingWebhookConfiguration. That
restriction exists for good reason: if a webhook could reject changes to
its own configuration, you could end up locked out with no way to fix it
through the API.

Manifest-based policies don't have that problem. If a bad policy is
blocking something it shouldn't, you fix the file on disk and the API
server picks up the change. There's no circular dependency because the
recovery path doesn't go through the API.

This means you can write a manifest-based policy that prevents deletion of
your critical API-based admission policies. For platform teams managing
shared clusters, this is a significant improvement. You can now guarantee
that your baseline security policies can't be removed by a cluster admin,
accidentally or otherwise.

Here's what that looks like in practice. This policy prevents any
modification or deletion of admission resources that carry the
`platform.example.com/protected: "true"` label:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "protect-policies.static.k8s.io"
  annotations:
    kubernetes.io/description: "Prevent modification or deletion of protected admission resources"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups: ["admissionregistration.k8s.io"]
      apiVersions: ["*"]
      operations: ["DELETE", "UPDATE"]
      resources:
      - "validatingadmissionpolicies"
      - "validatingadmissionpolicybindings"
      - "validatingwebhookconfigurations"
      - "mutatingwebhookconfigurations"
  validations:
  - expression: >-
      !has(oldObject.metadata.labels) ||
      !('platform.example.com/protected' in oldObject.metadata.labels) ||
      oldObject.metadata.labels['platform.example.com/protected'] != 'true'
    message: "Protected admission resources cannot be modified or deleted"
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "protect-policies-binding.static.k8s.io"
  annotations:
    kubernetes.io/description: "Bind protect-policies policy to all admission resources"
spec:
  policyName: "protect-policies.static.k8s.io"
  validationActions:
  - Deny
```

With this in place, any API-based admission policy or webhook configuration
labeled `platform.example.com/protected: "true"` is shielded from tampering.
The protection itself lives on disk and can't be removed through the API.

## A few things to know

Manifest-based configurations are intentionally self-contained. They can't
reference API resources, which means no `paramKind` for policies, no
Service references for admission webhooks (instead they are URL-only),
and bindings may only reference
policies in the same manifest set. These restrictions exist because the
configurations need to work without any cluster state, including at startup
before etcd is available.

If you run multiple API server instances, each one loads its own manifest
files independently. There's no cross-server synchronization built in. This
is the same model as other file-based API server configurations like
encryption at rest. When this feature is enabled, Kubernetes exposes a configuration hash as a label on relevant metrics, so you can
detect drift.

Files are watched for changes at runtime, so you don't need to restart the
API server to update policies. If you update a manifest file, the API
server validates the new configuration and swaps it in atomically. If
validation fails, it keeps the previous good configuration and logs the
error. This means you can roll out policy changes across your fleet using
standard configuration management tools (Ansible, Puppet, or even mounted
ConfigMaps) without any API server downtime.

The initial load at startup is stricter: if any manifest is invalid, the
API server won't start. This is intentional. At startup, failing fast is
safer than running without your expected policies.

## Try it out

To try this in Kubernetes v1.36:

1. Enable the [`ManifestBasedAdmissionControlConfig`](/docs/reference/command-line-tools-reference/feature-gates/#ManifestBasedAdmissionControlConfig) feature gate on the
   kube-apiserver.
2. Create a directory with your static manifest files.
3. Configure `staticManifestsDir` in your [`AdmissionConfiguration`](/docs/reference/access-authn-authz/admission-controllers/)
   with the directory path.
4. Start the API server with `--admission-control-config-file` pointing to
   your `AdmissionConfiguration` file.

The full documentation is at
[Manifest-Based Admission Control](/docs/reference/access-authn-authz/manifest-admission-control/),
and you can follow
[KEP-5793](https://kep.k8s.io/5793)
for ongoing progress.

We'd love to hear your feedback. Reach out on the
[#sig-api-machinery](https://kubernetes.slack.com/archives/C0EG7JC6T)
channel on Kubernetes Slack
(for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).

## How to get involved

If you're interested in contributing to this feature or other
SIG API Machinery projects, join us on
[#sig-api-machinery](https://kubernetes.slack.com/archives/C0EG7JC6T)
on Kubernetes Slack. You're also welcome to attend the
[SIG API Machinery meetings](https://github.com/kubernetes/community/blob/master/sig-api-machinery/README.md#meetings),
held every other Wednesday.
