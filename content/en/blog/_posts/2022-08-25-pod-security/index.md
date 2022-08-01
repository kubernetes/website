---
layout: blog
title: "Pod Security Admission goes Stable"
date: 2022-08-25
slug: pod-security-admission-stable
canonicalUrl: https://kubernetes.dev/blog/2022/08/25/pod-security-admission-stable/
---

 **Authors:** Tim Allclair and Sam Stoelinga (Google)

The release of Kubernetes v1.25 marks a major milestone for Kubernetes out-of-the-box pod security
controls: Pod Security admission (PSA) graduated to stable, and Pod Security Policy (PSP) has been
removed.
[PSP has been deprecated since Kubernetes v1.21](https://kubernetes.io/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/),
but as of v1.25 it will no longer be functional.

Pod Security Admission was designed as PSP's replacement, and makes it easier to enforce predefined
[Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) by
simply adding a label to a namespace. The Pod Security Standards are maintained by the K8s
community, which means you automatically get updated security policies when new K8s features are
introduced.


## What’s new since Beta?

Pod Security Admission hasn’t changed much since Beta (in Kubernetes v1.23). The focus has been on
improving the user experience, while continuing to maintain a high quality and scalability bar.

**Improved violation messages:**

Minor improvements to violation messages were made to produce
[fewer duplicate messages](https://github.com/kubernetes/kubernetes/pull/107698), so instead of
getting this (since the baseline & restricted policies have overlapping capabilities checks):

```
pods "admin-pod" is forbidden: violates PodSecurity "restricted:latest": non-default capabilities (container "admin" must not include "SYS_ADMIN" in securityContext.capabilities.add), unrestricted capabilities (container "admin" must not include "SYS_ADMIN" in securityContext.capabilities.add)
```

You get:

```
pods "admin-pod" is forbidden: violates PodSecurity "restricted:latest": unrestricted capabilities (container "admin" must not include "SYS_ADMIN" in securityContext.capabilities.add)
```

**Improved namespace warnings:**

When modifying the `enforce` Pod Security labels on a namespace, PSA checks all existing pods for
violations and surfaces warning if any are out of compliance. Now,
[warnings are aggregated](https://github.com/kubernetes/kubernetes/pull/105889) for pods with
identical violations, making large namespaces with many replicas much more manageable. For example:

```
Warning: frontend-h23gf2: allowPrivilegeEscalation != false
Warning: myjob-g342hj (and 6 other pods): host namespaces, allowPrivilegeEscalation != false Warning: backend-j23h42 (and 1 other pod): non-default capabilities, unrestricted capabilities
```

Additionally, when applying a non-privileged to a namespace that has been
[configured to be exempt](https://kubernetes.io/docs/concepts/security/pod-security-admission/#exemptions),
you will now get a warning alerting you to this fact:

```
Warning: namespace 'kube-system' is exempt from Pod Security, and the policy (enforce=baseline:latest) will be ignored
```

**Changes to the Pod Security Standards**

The [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/),
which are enforced by Pod Security admission, have been updated with support for the new Pod OS
field. For restricted profiles in versions v1.25 and up, the following linux-specific fields will no
longer be required when the pod's `.spec.os.name` has been explicitly set to `windows`:

* Seccomp - The `seccompProfile.type` field on pod and/or container security contexts
* Privilege escalation - The `allowPrivilegeEscalation` field on container security contexts
* Capabilities - The requirement to drop `ALL` capabilities

_Note that Kubelets prior to Kubernetes v1.24 did not enforce the Pod OS field, so clusters running
older nodes should explicitly
[pin restricted policies to a version](https://kubernetes.io/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces)
prior to v1.25._


## Migrating from Pod Security Policy to Pod Security Admission

A [guide](https://kubernetes.io/docs/tasks/configure-pod-container/migrate-from-psp/) was published
to make the process of migrating from PSP to PSA easier, and to help you choose the best migration
strategy for your use case. In addition, a tool called
[pspmigrator](https://github.com/kubernetes-sigs/pspmigrator) is being developed to automate parts
of the migration process. We'll be talking about PSP migration in more detail at our upcoming
Kubecon talk,
[Migrating from Pod Security Policy](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/schedule/).
