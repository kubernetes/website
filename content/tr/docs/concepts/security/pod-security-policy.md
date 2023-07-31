---
title: Pod Security Policies
content_type: concept
weight: 30
---

<!-- overview -->

{{% alert title="Removed feature" color="warning" %}}
PodSecurityPolicy was [deprecated](/blog/2021/04/08/kubernetes-1-21-release-announcement/#podsecuritypolicy-deprecation)
in Kubernetes v1.21, and removed from Kubernetes in v1.25.
{{% /alert %}}

Instead of using PodSecurityPolicy, you can enforce similar restrictions on Pods using
either or both:

- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- a 3rd party admission plugin, that you deploy and configure yourself

For a migration guide, see [Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/).
For more information on the removal of this API,
see [PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).

If you are not running Kubernetes v{{< skew currentVersion >}}, check the documentation for
your version of Kubernetes.
