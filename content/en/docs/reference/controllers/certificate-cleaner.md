---
title: Certificate signing request cleaner
content_template: templates/concept
---

{{% capture overview %}}

This controller removes certificate signing requests that have expired without being approved.

{{% /capture %}}

{{% capture body %}}

The certificate cleaner is built in to kube-controller-manager.

## Controller behaviour

This controller watches for CertificateSigningRequest (CSR) objects and their approvals.

After a CSR has been in the system for a certain amount of time, without being approved,
this controller will delete it.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about the [certificate approver](/docs/reference/controllers/certificate-approver/)
* Read about the [certificate signer](/docs/reference/controllers/certificate-signer/)
{{% /capture %}}
