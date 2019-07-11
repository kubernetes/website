---
toc_hide: true
title: Certificate signature approver
content_template: templates/concept
---

{{% capture overview %}}

The CertificateSigningRequest approver
{{< glossary_tooltip term_id="controller" text="controller">}}
(aka CSR approver) is part of a set of built-in controllers for certificate management.

{{% /capture %}}


{{% capture body %}}
The CSR approver is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

This controller acts specifically on CertificateSigningRequests (CSR) that come from
the kubelet (or that purport to come from kubelet).

When the kubelet is setting up on a new node, the kubelet generates a CSR and submits
it to the Kubernetes API server using
[bootstrap](/docs/reference/access-authn-authz/bootstrap-tokens/)
authentication and authorization.

This controller watches for CertificateSigningRequests from a kubelet. For each
submitted CertificateSigningRequest, this controller creates a
SubjectAccessReview object to verify whether this Node's kubelet is allowed to
have its certificate signed.

If the request is authentic and the SubjectAccessReview passes, the controller marks the
CSR as approved. This approval allows the
[certificate signer](/docs/reference/controllers/certificate-signer) to issue a certificate.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about the [certificate signer](/docs/reference/controllers/certificate-signer/)
* Read about other [certificate controllers](/docs/reference/controllers/certificate-controllers/)
{{% /capture %}}
