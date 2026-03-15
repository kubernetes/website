---
reviewers:
- lmktfy
- reylejano
- windsonsea
min-kubernetes-server-version: v1.30
title: Block Services with external IPs
content_type: task
---

<!-- overview -->

This document explains a way to control how {{< glossary_tooltip text="Services" term_id="service" >}} with externalIP address(es) are managed within your cluster.

The `Service.spec.externalIPs` field is deprecated and is planned for removal in a future Kubernetes release, as described in [KEP-5707](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/5707-deprecate-service-externalips). This feature historically allowed Services to be exposed using manually specified external IP addresses, but it has security risks and operational challenges. In particular, it can allow users with permission to create or modify Services to claim arbitrary IP addresses, potentially enabling traffic interception attacks as documented in [CVE-2020-8554](https://www.cvedetails.com/cve/CVE-2020-8554/).

If you still rely on externalIPs in your cluster, this document describes mechanisms that cluster administrators can use to disable the feature entirely or enforce policies that restrict how and by whom it can be used.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

The ability to [set an external IP address for a Service](/docs/concepts/services-networking/service/#external-ips) can be misused as a way for an otherwise unprivileged user to intercept traffic associated with that IP address.

See [CVE-2020-8554](https://www.cvedetails.com/cve/CVE-2020-8554/) for more details.

Any user who can create a Service with external IPs can:

- intercept other users' outbound traffic to arbitrary cluster-external IPs.
- (non-deterministically) steal other users' inbound traffic to their own external IPs.

Due to these security concerns, as documented in [CVE-2020-8554](https://www.cvedetails.com/cve/CVE-2020-8554/), the Kubernetes project has deprecated the `Service.spec.externalIPs` field and will remove it in a future release, as described in [KEP-5707](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/5707-deprecate-service-externalips).

If you want to prevent the use of `externalIPs` entirely, you can enable the `DenyServiceExternalIPs` admission controller.

{{< tabs name="deny-externalips" >}}
{{% tab name="kube-apiserver flag" %}}

Enable the admission controller using the `--enable-admission-plugins` flag:

```bash
kube-apiserver --enable-admission-plugins=DenyServiceExternalIPs
```

{{% /tab %}}
{{% tab name="API server configuration file" %}}

Add `DenyServiceExternalIPs` to the `enable-admission-plugins` list in the kube-apiserver configuration:

```yaml
apiServer:
  extraArgs:
    enable-admission-plugins: DenyServiceExternalIPs
```

{{% /tab %}}
{{< /tabs >}}

Enabling this admission controller disables the ability for users to specify external IP addresses for Services across the entire cluster.

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
  annotations:
    kubernetes.io/description: "Restricts Service externalIPs to a set of allowed CIDR ranges."
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
    expression: "['192.0.2.0/24', '2001:db8::/64']"  # change this to your actual allowed IP address range.
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
  annotations:
    kubernetes.io/description: "Restricts Service externalIPs to a set of allowed CIDR ranges."
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
  annotations:
    kubernetes.io/description: "Allows only specific users to assign externalIPs to Services."
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
  annotations:
    kubernetes.io/description: "Allows only specific users to assign externalIPs to Services."
spec:
  policyName: "allow-specific-users-to-manage-externalips"
  validationActions: [Deny, Audit]
```
