---
title: "Audit Annotations"
weight: 1
---

<!-- overview -->

This page serves as a reference for the audit annotations of the kubernetes.io
namespace. These annotations apply to `Event` object from API group
`audit.k8s.io`.

{{< note >}}
The following annotations are not used within the Kubernetes API. When you
[enable auditing](/docs/tasks/debug/debug-cluster/audit/) in your cluster,
audit event data is written using `Event` from API group `audit.k8s.io`.
The annotations apply to audit events. Audit events are different from objects in the
[Event API](/docs/reference/kubernetes-api/cluster-resources/event-v1/) (API group
`events.k8s.io`).
{{< /note >}}

<!-- body -->

## pod-security.kubernetes.io/exempt

Example: `pod-security.kubernetes.io/exempt: namespace`

Value **must** be one of `user`, `namespace`, or `runtimeClass` which correspond to
[Pod Security Exemption](/docs/concepts/security/pod-security-admission/#exemptions)
dimensions. This annotation indicates on which dimension was based the exemption
from the PodSecurity enforcement.


## pod-security.kubernetes.io/enforce-policy

Example: `pod-security.kubernetes.io/enforce-policy: restricted:latest`

Value **must** be `privileged:<version>`, `baseline:<version>`,
`restricted:<version>` which correspond to [Pod Security
Standard](/docs/concepts/security/pod-security-standards) levels accompanied by
a version which **must** be `latest` or a valid Kubernetes version in the format
`v<MAJOR>.<MINOR>`. This annotations informs about the enforcement level that
allowed or denied the pod during PodSecurity admission.

See [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
for more information.

## pod-security.kubernetes.io/audit-violations

Example:  `pod-security.kubernetes.io/audit-violations: would violate
PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container
"example" must set securityContext.allowPrivilegeEscalation=false), ...`

Value details an audit policy violation, it contains the
[Pod Security Standard](/docs/concepts/security/pod-security-standards/) level
that was transgressed as well as the specific policies on the fields that were
violated from the PodSecurity enforcement.

See [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
for more information.

## authorization.k8s.io/decision

Example: `authorization.k8s.io/decision: "forbid"`

This annotation indicates whether or not a request was authorized in Kubernetes audit logs.

See [Auditing](/docs/tasks/debug/debug-cluster/audit/) for more information.

## authorization.k8s.io/reason

Example: `authorization.k8s.io/reason: "Human-readable reason for the decision"`

This annotation gives reason for the [decision](#authorization-k8s-io-decision) in Kubernetes audit logs.

See [Auditing](/docs/tasks/debug/debug-cluster/audit/) for more information.
