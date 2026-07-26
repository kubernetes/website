---
layout: blog
title: "Kubernetes v1.25: Pod Security Admission Controller in Stable"
date: 2022-08-25
slug: pod-security-admission-stable
author: >
  Tim Allclair (Google),
  Sam Stoelinga (Google)
---

The release of Kubernetes v1.25 marks a major milestone for Kubernetes out-of-the-box pod security
controls: Pod Security admission (PSA) graduated to stable, and Pod Security Policy (PSP) has been
removed.
[PSP was deprecated in Kubernetes v1.21](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/),
and no longer functions in Kubernetes v1.25 and later.

The Pod Security admission controller replaces PodSecurityPolicy, making it easier to enforce predefined
[Pod Security Standards](/docs/concepts/security/pod-security-standards/) by
simply adding a label to a namespace. The Pod Security Standards are maintained by the K8s
community, which means you automatically get updated security policies whenever new
security-impacting Kubernetes features are introduced.


## What’s new since Beta?

Pod Security Admission hasn’t changed much since the Beta in Kubernetes v1.23. The focus has been on
improving the user experience, while continuing to maintain a high quality bar.

### Improved violation messages

We improved violation messages so that you get
[fewer duplicate messages](https://github.com/kubernetes/kubernetes/pull/107698). For example,
instead of the following message when the Baseline and Restricted policies check the same
capability:

```
pods "admin-pod" is forbidden: violates PodSecurity "restricted:latest": non-default capabilities (container "admin" must not include "SYS_ADMIN" in securityContext.capabilities.add), unrestricted capabilities (container "admin" must not include "SYS_ADMIN" in securityContext.capabilities.add)
```

You get this message:

```
pods "admin-pod" is forbidden: violates PodSecurity "restricted:latest": unrestricted capabilities (container "admin" must not include "SYS_ADMIN" in securityContext.capabilities.add)
```

### Improved namespace warnings

When you modify the `enforce` Pod Security labels on a namespace, the Pod Security
admission controller checks all existing pods for
violations and surfaces a [warning](/blog/2020/09/03/warnings/) if any are out of compliance. These
[warnings are now aggregated](https://github.com/kubernetes/kubernetes/pull/105889) for pods with
identical violations, making large namespaces with many replicas much more manageable. For example:

```
Warning: frontend-h23gf2: allowPrivilegeEscalation != false
Warning: myjob-g342hj (and 6 other pods): host namespaces, allowPrivilegeEscalation != false Warning: backend-j23h42 (and 1 other pod): non-default capabilities, unrestricted capabilities
```

Additionally, when you apply a non-privileged label to a namespace that has been
[configured to be exempt](/docs/concepts/security/pod-security-admission/#exemptions),
you will now get a warning alerting you to this fact:

```
Warning: namespace 'kube-system' is exempt from Pod Security, and the policy (enforce=baseline:latest) will be ignored
```

### Changes to the Pod Security Standards

The [Pod Security Standards](/docs/concepts/security/pod-security-standards/),
which Pod Security admission enforces, have been updated with support for the new Pod OS
field. In v1.25 and later, if you use the Restricted policy, the following Linux-specific restrictions will no
longer be required if you explicitly set the pod's `.spec.os.name` field to `windows`:

* Seccomp - The `seccompProfile.type` field for Pod and container security contexts
* Privilege escalation - The `allowPrivilegeEscalation` field on container security contexts
* Capabilities - The requirement to drop `ALL` capabilities in the `capabilities` field on containers

In Kubernetes v1.23 and earlier, the kubelet didn't enforce the Pod OS field.
If your cluster includes nodes running a v1.23 or older kubelet, you should explicitly
[pin Restricted policies](/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces)
to a version prior to v1.25.

## Migrating from PodSecurityPolicy to the Pod Security admission controller

For instructions to migrate from PodSecurityPolicy to the Pod Security admission controller, and
for help choosing a migration strategy, refer to the
[migration guide](/docs/tasks/configure-pod-container/migrate-from-psp/).
We're also developing a tool called
[pspmigrator](https://github.com/kubernetes-sigs/pspmigrator) to automate parts
of the migration process.

We'll be talking about PSP migration in more detail at our upcoming KubeCon 2022 NA talk,
[*Migrating from Pod Security Policy*](https://sched.co/182Jx). Use the
[KubeCon NA schedule](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/schedule/)
to learn more.
