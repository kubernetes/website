---
title: Application Security Checklist
description: >
  Baseline guidelines around ensuring application security on Kubernetes, aimed at application developers
content_type: concept
weight: 110
---

<!-- overview -->

This checklist aims to provide basic guidelines on securing applications
running in Kubernetes from a developer's perspective.
This list is not meant to be exhaustive and is intended to evolve over time.

<!-- The following is taken from the existing checklist created for Kubernetes admins. https://kubernetes.io/docs/concepts/security/security-checklist/ -->

On how to read and use this document:

- The order of topics does not reflect an order of priority.
- Some checklist items are detailed in the paragraph below the list of each section.
- This checklist assumes that a `developer` is a Kubernetes cluster user who
  interacts with namespaced scope objects.

{{< caution >}}
Checklists are **not** sufficient for attaining a good security posture on their own.
A good security posture requires constant attention and improvement, but a checklist
can be the first step on the never-ending journey towards security preparedness.
Some recommendations in this checklist may be too restrictive or too lax for
your specific security needs. Since Kubernetes security is not "one size fits all",
each category of checklist items should be evaluated on its merits.
{{< /caution >}}

<!-- body -->

## Base security hardening

The following checklist provides base security hardening recommendations that
would apply to most applications deploying to Kubernetes.

### Application design

- [ ] Follow the right
  [security principles](https://www.cncf.io/wp-content/uploads/2022/06/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)
  when designing applications.
- [ ] Application configured with appropriate {{< glossary_tooltip text="QoS class" term_id="QoS-class" >}}
  through resource request and limits.
  - [ ] Memory limit is set for the workloads with a limit equal to or greater than the request.
  - [ ] CPU limit might be set on sensitive workloads.

### Service account

- [ ] Avoid using the `default` ServiceAccount. Instead, create ServiceAccounts for
  each workload or microservice.
- [ ] `automountServiceAccountToken` should be set to `false` unless the pod
  specifically requires access to the Kubernetes API to operate.

### Pod-level `securityContext` recommendations {#security-context-pod}

- [ ] Set `runAsNonRoot: true`.
- [ ] Configure the container to execute as a less privileged user
  (for example, using `runAsUser` and `runAsGroup`), and configure appropriate
  permissions on files or directories inside the container image.
- [ ] Optionally add a supplementary group with `fsGroup` to access persistent volumes.
- [ ] The application deploys into a namespace that enforces an appropriate
  [Pod security standard](/docs/concepts/security/pod-security-standards/).
  If you cannot control this enforcement for the cluster(s) where the application is
  deployed, take this into account either through documentation or additional defense in depth.

### Container-level `securityContext` recommendations {#security-context-container}

- [ ] Disable privilege escalations using `allowPrivilegeEscalation: false`.
- [ ] Configure the root filesystem to be read-only with `readOnlyRootFilesystem: true`.
- [ ] Avoid running privileged containers (set `privileged: false`).
- [ ] Drop all capabilities from the containers and add back only specific ones
  that are needed for operation of the container.

### Role Based Access Control (RBAC) {#rbac}

- [ ] Permissions such as **create**, **patch**, **update** and **delete**
  should be only granted if necessary.
- [ ] Avoid creating RBAC permissions to create or update roles which can lead to
  [privilege escalation](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping).
- [ ] Review bindings for the `system:unauthenticated` group and remove them where
  possible, as this gives access to anyone who can contact the API server at a network level.

The **create**, **update** and **delete** verbs should be permitted judiciously.
The **patch** verb if allowed on a Namespace can
[allow users to update labels on the namespace or deployments](/docs/concepts/security/rbac-good-practices/#namespace-modification)
which can increase the attack surface.

For sensitive workloads, consider providing a recommended ValidatingAdmissionPolicy
that further restricts the permitted write actions.

### Image security

- [ ] Using an image scanning tool to scan an image before deploying containers in the Kubernetes cluster.
- [ ] Use container signing to validate the container image signature before deploying to the Kubernetes cluster.

### Network policies

- [ ] Configure [NetworkPolicies](/docs/concepts/services-networking/network-policies/)
  to only allow expected ingress and egress traffic from the pods.

Make sure that your cluster provides and enforces NetworkPolicy.
If you are writing an application that users will deploy to different clusters,
consider whether you can assume that NetworkPolicy is available and enforced.

## Advanced security hardening {#advanced}

This section of this guide covers some advanced security hardening points
which might be valuable based on different Kubernetes environment setup.

### Linux container security

Configure {{< glossary_tooltip text="Security Context" term_id="Security-Context" >}}
for the pod-container.

- [ ] [Set the Seccomp Profile for a Container](/docs/tasks/configure-pod-container/security-context/#set-the-seccomp-profile-for-a-container).
- [ ] [Restrict a Container's Access to Resources with AppArmor](/docs/tutorials/security/apparmor/).
- [ ] [Assign SELinux Labels to a Container](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container).

### Runtime classes

- [ ] Configure appropriate runtime classes for containers.

{{% thirdparty-content %}}

Some containers may require a different isolation level from what is provided by
the default runtime of the cluster. `runtimeClassName` can be used in a podspec
to define a different runtime class.

For sensitive workloads consider using kernel emulation tools like
[gVisor](https://gvisor.dev/docs/), or virtualized isolation using a mechanism
such as [kata-containers](https://katacontainers.io/).

In high trust environments, consider using
[confidential virtual machines](/blog/2023/07/06/confidential-kubernetes/)
to improve cluster security even further.
