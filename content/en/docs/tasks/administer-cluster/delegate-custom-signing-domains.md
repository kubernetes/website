---
title: Delegate Custom Signing Domains
content_type: task
weight: 30
---

<!-- overview -->

[Custom signers](/docs/reference/access-authn-authz/certificate-signing-requests#custom-signers) that approve, deny and sign 
[CertificateSigningRequests](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/) may be given permissions
to delegate their privileges over an entire signing domain.

<!-- body -->

{{< feature-state feature_gate_name="ValidatingAdmissionPolicy" >}}

When working with [custom signers](/docs/reference/access-authn-authz/certificate-signing-requests#custom-signers) that approve, deny and sign 
[CertificateSigningRequests](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/) 
using the [Kubernetes API](/docs/reference/access-authn-authz/certificate-signing-requests#signer-api), the signer's identity may be given
[privileges](/docs/reference/access-authn-authz/certificate-signing-requests#authorization)
over the entire domain by using trailing wild-cards in the `resourceNames`:

{{% code_sample file="access/delegated-certificate-signing-request/domain-clusterrole.yaml" %}}

As `resourceNames` are opaque to the RBAC authorizer, however, an entity with permission
to approve and sign for an entire domain cannot delegate specific paths to other entities.
Applications which install signers therefore require `approve` and `sign` permissions for all
signers, which is an over-broad permissions set and leads to a poor security posture as the
credentials for such installers are good targets for actors wishing to escalate their privileges.

On clusters with [ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/),
these installers may have their privileges restricted to the minimal set required for their function.

### Set up a service account for the installer

In this example, an application that installs CSR signers on a Kubernetes cluster will be configured.
First, set up prerequisites by:

1. creating the Namespace in which the installer ServiceAccount will exist:

   {{% code_sample file="access/delegated-certificate-signing-request/namespace.yaml" %}}

1. creating the ServiceAccount the installer will authenticate as:

   {{% code_sample file="access/delegated-certificate-signing-request/serviceaccount.yaml" %}}

### Provide permissions to the installer

The application installing other signers will need to be granted over-broad permissions via RBAC to
approve and sign certificate signing requests, as well as to create cluster roles for delegating these
permissions. Grant these permissions to the installer by:

1. defining a ClusterRole with the over-broad permissions:

   {{% code_sample file="access/delegated-certificate-signing-request/clusterrole.yaml" %}}

1. assigning the role to the installer with a ClusterRoleBinding:

   {{% code_sample file="access/delegated-certificate-signing-request/clusterrolebinding.yaml" %}}

### Restrict the installer's permissions over CSRs

As the installer only needs the ability to act on CSRs for a specific domain, 
its permissions to sign, approve or deny CertificateSigningRequests outside of that
domain may be restricted by:

<!-- TODO validate best posture here, signer names are opaque and don't need to be domains? -->

1. creating a ValidatingAdmissionPolicy to describe intent:

   {{% code_sample file="access/delegated-certificate-signing-request/installer-csr-validatingadmissionpolicy.yaml" %}}

1. realizing the policy by creating a ValidatingAdmissionPolicyBinding:

   {{% code_sample file="access/delegated-certificate-signing-request/installer-csr-validatingadmissionpolicybinding.yaml" %}}

1. configuring the policy by creating the ConfigMap that identifies which identity is being restricted and for which domains it is expected to act:

   {{% code_sample file="access/delegated-certificate-signing-request/validatingadmissionpolicy-parameters-configmap.yaml" %}}

### Restrict the installer's permissions to delegate

As the installer only needs the ability delegate ownership of CertificateSigningRequests within
its domian, its permissions to delegate may be restricted by:

<!-- TODO validate best posture here, signer names are opaque and don't need to be domains? -->

1. creating a ValidatingAdmissionPolicy to describe intent:

   {{% code_sample file="access/delegated-certificate-signing-request/installer-csr-delegation-validatingadmissionpolicy.yaml" %}}

1. realizing the policy by creating a ValidatingAdmissionPolicyBinding:

   {{% code_sample file="access/delegated-certificate-signing-request/installer-csr-delegation-validatingadmissionpolicybinding.yaml" %}}

### Test it out

With these validating admission policies in place, the installer service account may delegate
CSR approval and signing for some specific part of the domain:

{{% code_sample file="access/delegated-certificate-signing-request/invalid-delegated-clusterrole.yaml" %}}

```shell
$ kubectl --as system:serviceaccount:csr-signer-installer:installer create -f invalid-delegated-clusterrole.yaml
clusterrole.rbac.authorization.k8s.io/specific-csr-approver created
```

However, for a ClusterRole delegating some unrelated domain:

{{% code_sample file="access/delegated-certificate-signing-request/invalid-delegated-clusterrole.yaml" %}}

The validating admission policies forbid creation:

```shell
$ kubectl --as system:serviceaccount:csr-signer-installer:installer create -f invalid-delegated-clusterrole.yaml
Error from server (Forbidden): error when creating "-": clusterroles.rbac.authorization.k8s.io "specific-csr-approver" is forbidden: ValidatingAdmissionPolicy 'installer-csr-delegation-policy' with binding 'installer-csr-delegation-policy-binding' denied request: failed expression: variables.signerNameInDomain == true
```

TODO: why don't we get the message? from the VAP??

TODO: validate that domain parameter is not empty or startsWith is useless?
