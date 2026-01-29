---
reviewers:
- thockin
- danwinship
- aojea
min-kubernetes-server-version: v1.30
title: Block Services with external IPs
content_type: task
---

<!-- overview -->

This document explains a way to control how {{< glossary_tooltip text="Services" term_id="service" >}} with external IP address(es) are managed within your cluster.

The ability to [set an external IP address for a Service](/docs/concepts/services-networking/service/#external-ips) could be musused as a way for an otherwise unprivileged user to intercept traffic associated with that IP address.

See [CVE-2020-8554](https://www.cvedetails.com/cve/CVE-2020-8554/) for more details.

Any user who can create a Service with external IPs could:

- intercept other users' outbound traffic to arbitrary cluster-external IPs.
- (non-deterministically) steal other users' inbound traffic to their own external IPs.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- steps -->

## Service external IP address policies for Kubernetes

As a cluster administrator, you can implement policies to control the creation and modification of Services with external IP addresses within the cluster.
This allows for centralized management of the allowed external IP addresses that can be used for Services,
and helps prevent unintended or conflicting configurations.
Kubernetes provides mechanisms such as [ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/) that
you can use to enforce these rules.

## Restrict Service external IP addresses to permitted address ranges

The following example allows an administrator to restrict the allowed IP address range(s) of any new or updated Service:

```yaml
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "allow-specific-externalips"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   [""]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["services"]
  variables:
  - name: allowed
    expression: "['192.0.2.0/24', '2001:db8::/64']"  # Change these values to for your use case
  validations:
  - expression: |
      !has(object.spec.externalIPs) ||
      object.spec.externalIPs.all(ip, variables.allowed.exists(cidr, cidr(cidr).containsIP(ip)))
    message: "All externalIPs must be within the allowed CIDR ranges."
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "allow-specific-externalips-binding"
spec:
  policyName: "allow-specific-externalips"
  validationActions: [Deny, Audit]
```

## Restrict which users or groups may specify external IP addresses for Services

```yaml
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "allow-specific-users-to-manage-externalips"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   [""]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["services"]
  validations:
  - expression: |
      !has(object.spec.externalIPs) ||
      request.userInfo.username == "myuser" ||
      request.userInfo.groups.exists(g, g in ["system:masters", "net-admins"])
    message: "Only user 'myuser' or members of groups 'system:masters' and 'net-admins' can assign externalIPs."
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "allow-specific-users-binding"
spec:
  policyName: "allow-specific-users-to-manage-externalips"
  validationActions: [Deny, Audit]
```
