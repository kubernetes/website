---
title: Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller
reviewers:
- tallclair
- liggitt
content_type: task
min-kubernetes-server-version: v1.22
---

<!-- overview -->

This page describes the process of migrating from PodSecurityPolicies to the built-in PodSecurity
admission controller. This can be done effectively using a combination of dry-run and `audit` and
`warn` modes, although this becomes harder if mutating PSPs are used.

## {{% heading "prerequisites" %}}

The Pod Security admission controller must be enabled on the cluster. See [Pod Security
Admission](/docs/concepts/security/pod-security-admission/) for instructions on enabling the
admission controller.

<!-- body -->

## Steps

- **Eliminate mutating PodSecurityPolicies, if your cluster has any set up.**
  - Clone all mutating PSPs into a non-mutating version.
  - Update all ClusterRoles authorizing use of those mutating PSPs to also authorize use of the
    non-mutating variant.
  - Watch for Pods using the mutating PSPs and work with code owners to migrate to valid,
    non-mutating resources.
  - Delete mutating PSPs.
- **Select a compatible policy level for each namespace.** Analyze existing resources in the
  namespace to drive this decision.
  - Review the requirements of the different [Pod Security Standards](/docs/concepts/security/pod-security-standards).
  - Evaluate the difference in privileges that would come from disabling the PSP controller.
  - In the event that a PodSecurityPolicy falls between two levels, consider:
    - Selecting a _less_ permissive PodSecurity level prioritizes security, and may require adjusting
      workloads to fit within the stricter policy.
    - Selecting a _more_ permissive PodSecurity level prioritizes avoiding disrupting or
      changing workloads, but may allow workload authors in the namespace greater permissions
      than desired.
- **Apply the selected profiles in `warn` and `audit` mode.** This will give you an idea of how
  your Pods will respond to the new policies, without breaking existing workloads. Iterate on your
  [Pods' configuration](/docs/concepts/security/pod-security-admission#configuring-pods) until
  they are in compliance with the selected profiles.
- Apply the profiles in `enforce` mode.
- Stop including `PodSecurityPolicy` in the `--enable-admission-plugins` flag.