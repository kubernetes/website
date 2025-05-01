---
title: "Audit Annotations"
weight: 10
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

## k8s.io/deprecated

Example: `k8s.io/deprecated: "true"`

Value **must** be "true" or "false". The value "true" indicates that the
request used a deprecated API version.

## k8s.io/removed-release

Example: `k8s.io/removed-release: "1.22"`

Value **must** be in the format "<major>.<minor>". It is set to target the removal release
on requests made to deprecated API versions with a target removal release.

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

Value must be **forbid** or **allow**. This annotation indicates whether or not a request
was authorized in Kubernetes audit logs.

See [Auditing](/docs/tasks/debug/debug-cluster/audit/) for more information.

## authorization.k8s.io/reason

Example: `authorization.k8s.io/reason: "Human-readable reason for the decision"`

This annotation gives reason for the [decision](#authorization-k8s-io-decision) in Kubernetes audit logs.

See [Auditing](/docs/tasks/debug/debug-cluster/audit/) for more information.

## missing-san.invalid-cert.kubernetes.io/$hostname

Example: `missing-san.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "relies on a legacy Common Name field instead of the SAN extension for subject validation"`

Used by Kubernetes version v1.24 and later

This annotation indicates a webhook or aggregated API server
is using an invalid certificate that is missing `subjectAltNames`.
Support for these certificates was disabled by default in Kubernetes 1.19,
and removed in Kubernetes 1.23.

Requests to endpoints using these certificates will fail.
Services using these certificates should replace them as soon as possible
to avoid disruption when running in Kubernetes 1.23+ environments.

There's more information about this in the Go documentation:
[X.509 CommonName deprecation](https://go.dev/doc/go1.15#commonname).

## insecure-sha1.invalid-cert.kubernetes.io/$hostname

Example: `insecure-sha1.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "uses an insecure SHA-1 signature"`

Used by Kubernetes version v1.24 and later

This annotation indicates a webhook or aggregated API server
is using an insecure certificate signed with a SHA-1 hash.
Support for these insecure certificates is disabled by default in Kubernetes 1.24,
and will be removed in a future release.

Services using these certificates should replace them as soon as possible,
to ensure connections are secured properly and to avoid disruption in future releases.

There's more information about this in the Go documentation:
[Rejecting SHA-1 certificates](https://go.dev/doc/go1.18#sha1).

## validation.policy.admission.k8s.io/validation_failure

Example: `validation.policy.admission.k8s.io/validation_failure: '[{"message": "Invalid value", {"policy": "policy.example.com", {"binding": "policybinding.example.com", {"expressionIndex": "1", {"validationActions": ["Audit"]}]'`

Used by Kubernetes version v1.27 and later.

This annotation indicates that a admission policy validation evaluated to false
for an API request, or that the validation resulted in an error while the policy
was configured with `failurePolicy: Fail`.

The value of the annotation is a JSON object. The `message` in the JSON
provides the message about the validation failure.

The `policy`, `binding` and `expressionIndex` in the JSON identifies the
name of the `ValidatingAdmissionPolicy`, the name of the
`ValidatingAdmissionPolicyBinding` and the index in the policy `validations` of
the CEL expressions that failed, respectively.

The `validationActions` shows what actions were taken for this validation failure.
See [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/)
for more details about `validationActions`.
