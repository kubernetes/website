---
title: Application Security Checklist
description: >
  Baseline checklist for ensuring application security for Kubernetes Developers
content_type: concept
weight: 110
---

<!-- overview -->

This checklist aims on providing basic guidelines on securing applications running in Kubernetes from a developer perspective. 
This list is not meant to be exhaustive and is meant to evolve over time.

<!-- The following is taken from the existing checklist created for Kubernetes admins. https://kubernetes.io/docs/concepts/security/security-checklist/ -->

On how to read and use this document:

- The order of topics does not reflect an order of priority.
- Some checklist items are detailed in the paragraph below the list of each section.
- This checklist assumes a `developer` is a Kubernetes cluster user that interacts with namespaced scope objects.


{{< caution >}}
Checklists are **not** sufficient for attaining a good security posture on their own. A good security posture requires constant attention and improvement, but a checklist can be the first step on the never-ending journey towards security preparedness. Some of the recommendations in this checklist may be too restrictive or too lax for your specific security needs. Since Kubernetes security is not "one size fits all", each category of checklist items should be evaluated on its merits.
{{< /caution >}}


<!-- body -->
## Base security hardening
The following checklist provide a base security hardening recommendations that would apply to most applications deploying to Kubernetes.

### Application design
- [ ] Following the right [design principles for the application.](https://kubernetes.io/blog/2018/03/principles-of-container-app-design/)
- [ ] Application configured with appropriate {{< glossary_tooltip text="QoS class" term_id="QoS-class" >}} through resource request and limits
  - [ ] Memory limit is set for the workloads with a limit equal or inferior to the request.
  - [ ] CPU limit might be set on sensitive workloads.

### Service account
- [ ] Avoid using `default` service account. Create service accounts for workloads.
- [ ] `automountServiceAccountToken` should be set to `false` unless the pod specifically requires access to the Kubernetes API to operate.

### Pod Security Context
- [ ] Set `runAsNonRoot: true`.
- [ ] Configure User permissions and access controls using `runAsUser` and `runAsGroup`.
- [ ] Optionally add a supplimentary group with `fsGroup` to access persistent volumes.
- [ ] Appropriate Pod Security Standard policies are enforced to all pods in the application namespace.

### Container Security Context
- [ ] Disable privilege escalations using `allowPrivilegeEscalation: false`.
- [ ] Configure the root filesystem to be read-only with `readOnlyRootFilesystem: true`.
- [ ] Avoid running privileged containers with `privileged: false`.
- [ ] Drop all capabilities from the containers, and add back only specific ones that are needed for operation of the container.

### Role Based Access Control (RBAC)
- [ ] Permissions such as `create`, `patch`, `update` and `delete` should be only granted if necessary.
- [ ] Avoid creating RBAC permissions to create or update roles which can lead to [privilege escalation](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping).
- [ ] Review bindings for the `system:unauthenticated` group and remove them where possible, as this gives access to anyone who can contact the API server at a network level.

The `create`, `update` and `delete` should be used judicously. The `patch` permission can [allow users to update labels on the namespace or deployments](/docs/concepts/security/rbac-good-practices/#namespace-modification) which can increase the attack surface.

### Image security
- [ ] Using a image scanning tool the scan an image before deploying containers in the Kubernetes cluster.
- [ ] Use container signing to validate the container image signature before deploying to the Kubernetes cluster.

### Network Policies
- [ ] Configure network policies to only allow expected ingress and egress traffic from the pods.

## Advanced Security Hardening
This section of this guide covers some advanced security hardening points which might be valuable based on different Kubernetes environment setup

### Linux container security
Configure {{< glossary_tooltip text="Security Context" term_id="Security-Context" >}} for the pod-container.
- [ ] [Set appropriate Seccomp profiles.](/docs/tasks/configure-pod-container/security-context/#set-the-seccomp-profile-for-a-container)
- [ ] [Configure appropriate AppArmor policies.](/docs/tutorials/security/apparmor/)
- [ ] [Assign appropriate SELinux labels to the contianers.](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)

### Runtime Classes
- [ ] Configure appropriate runtime classes for containers.

Some containers may require a different isolation level from what is provided by the default runtime of the cluster. `runtimeClassname` can be used in a podspec to define a differnt runtime class.

For sensitive workloads consider using Kernel emulation tools like [gVisor](https://gvisor.dev/docs/) or [kata-containers](https://katacontainers.io/).

In high trust environments, consider using [confidential virutal machines](/blog/2023/07/06/confidential-kubernetes/) to improve cluster security even further.
