---
title: Certificate signature approver
content_template: templates/concept
---

{{% capture overview %}}

The CertificateSigningRequest approver controller is part of a set of built-in
controllers for certificate management.

{{% /capture %}}


{{% capture body %}}
The certificate approver is built in to kube-controller-manager.

## Controller behaviour

This controller acts specifically on CertificateSigningRequests (CSR) that come from
kubelet (or that purport to come from kubelet).

When kubelet is setting up on a new node, kubelet will generate a CSR and submit it
to the Kubernetes API server using its bootstrap authentication and authorization.

This controller watches for CertificateSigningRequests from kubelet. For each submitted
CertificateSigningRequest, this controller creates a SubjectAccessReview to verify Kubelet's
entitlement to have the certificate signed (based on the API server's authorization mechanisms).

If the request is authentica and the SubjectAccessReview passes, the controller marks the
CSR as approved. This approval allows the Certificate signer can issue a certificate.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about the [certificate signer](/docs/reference/controllers/certificate-signer/)
{{% /capture %}}

