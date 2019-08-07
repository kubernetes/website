---
title: Certificate signer controller
content_template: templates/concept
---

{{% capture overview %}}

A controller that signs {{< glossary_tooltip text="certificates" term_id="certificate" >}},
based on a certificate signing request (CSR), once approved. The issued
certificates will have a signing chain back to the cluster's root CA.

{{% /capture %}}

{{% capture body %}}

The certificate signer is built in to kube-controller-manager. You can add your own controller,
either to work alongside this built-in controller, or to work in its place.

## Controller behaviour

This controller watches for CertificateSigningRequest (CSR) objects and their approvals.
When the certificate signer sees an approved request, it signs the request using the
configured certificate and key (typically, this will be the cluster root CA).

The controller stores the issued certificate into the status field of the CSR.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about the [certificate approver](/docs/reference/controllers/certificate-approver/)
{{% /capture %}}
