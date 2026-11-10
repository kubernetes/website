---
title: Certificates
content_type: concept
weight: 20
---

<!-- overview -->

Certificates are fundamental to the security model of Kubernetes, providing identity and encryption for communication between all components (`kube-apiserver`, `kubelet`, `etcd`, etc.).

<!-- body -->

## Certificate Management Concepts

Kubernetes provides several mechanisms for managing X.509 certificates within a cluster:

### CertificateSigningRequest (CSR)

The `CertificateSigningRequest` API is the standard, general-purpose way to ask the cluster for a certificate.
- **Usage**: Primarily used by administrators to issue client certificates for users, or by Kubernetes components like the `kubelet` (for serving endpoints and TLS bootstrapping).
- **Workflow**: An user or component submits a request, an administrator (or an automated system) reviews and approves it, and finally, a "signer" issues the official certificate.
- **Signers**: You can use the built-in Kubernetes authorities to sign the certificates (e.g., `kubernetes.io/kube-apiserver-client`) or custom external signers.

### PodCertificateRequest (PCR)

{{< feature-state feature_gate_name="PodCertificateRequest" >}}

The `PodCertificateRequest` API is a specialized tool designed specifically for your applications.
- **Usage**: When an application running inside a `Pod` needs its own certificate to talk securely to other services, it uses a PCR. The cluster automatically places this certificate directly into the Pod for the application to use it.
- **Workflow**: When a Pod starts up, the `kubelet` automatically requests a certificate. Then `kube-apiserver` confirms the identity of the Pod, the signer issues the certificate and `kubelet` places it securely inside the Pod for the application to use.
- **Key Difference from CSR**: While a CSR is a general tool that often requires manual approval, a PCR is a flow built specifically for workloads. It allows the `kubelet` to automatically request and handle certificates for running applications behind the scenes, without waiting for an administrator approval.

## Key Components

- **Signers**: The entities responsible for verifying the request and producing the signed certificate.
- **Trust Bundles**: Objects (like the `ClusterTrustBundle` API) that securely distribute the CA certificates required to verify the issued certificates across the cluster.

## {{% heading "whatsnext" %}}

- Learn more about [certificate signing requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
- Learn how to [generate certificates for your cluster](/docs/tasks/administer-cluster/certificates/)
- Learn about [Kubelet TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
- Read how to [manage TLS certificates in a cluster](/docs/tasks/tls/managing-tls-in-a-cluster/)
- Read about [PKI certificates and requirements](/docs/setup/best-practices/certificates/)
