---
title: Certificate signature approver
content_template: templates/concept
---

{{% capture overview %}}

The CertificateSigningRequest approver controller (aka CSR approver) is
part of a set of built-in controllers for certificate management.

{{% /capture %}}


{{% capture body %}}
The CSR approver is built in to kube-controller-manager.

## Controller behavior

This controller acts specifically on CertificateSigningRequests (CSR) that come from
kubelet (or that purport to come from kubelet).

When kubelet is setting up on a new node, kubelet will generate a CSR and submit it
to the Kubernetes API server using its
[bootstrap](/docs/reference/access-authn-authz/bootstrap-tokens/)
authentication and authorization.

This controller watches for CertificateSigningRequests from kubelet. For each submitted
CertificateSigningRequest, this controller creates a SubjectAccessReview to verify
whether this Node's kubelet is allowed to have its certificate signed.

If the request is authentic and the SubjectAccessReview passes, the controller marks the
CSR as approved. This approval allows the Certificate signer to issue a certificate.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about the [certificate signer](/docs/reference/controllers/certificate-signer/)
{{% /capture %}}
