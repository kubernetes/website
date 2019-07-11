---
toc_hide: true
title: Certificate signing request cleaner
content_template: templates/concept
---

{{% capture overview %}}

This {{< glossary_tooltip term_id="controller" >}} removes certificate signing
requests (CSRs) that have expired without being approved.

{{% /capture %}}

{{% capture body %}}

The CSR cleaner is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

This controller watches for CertificateSigningRequest objects and their approvals.

After a CSR has been in the system for a certain amount of time without being approved,
this controller deletes it.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about the [certificate approver](/docs/reference/controllers/certificate-approver/)
* Read about the [certificate signer](/docs/reference/controllers/certificate-signer/)
* Learn about other [resource clean-up controllers](/docs/reference/controllers/resource-cleanup-controllers/)
{{% /capture %}}
