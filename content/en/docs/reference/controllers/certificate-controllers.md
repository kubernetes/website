---
title: Certificate controllers
content_template: templates/concept
weight: 50
---

{{% capture overview %}}

This page lists the
{{< glossary_tooltip term_id="certificate" text="certificate" >}}
{{< glossary_tooltip text="controllers" term_id="controller" >}}
that come as part of Kubernetes itself.

{{% /capture %}}

{{% capture body %}}

## Root certificate publisher

The [root certificate publisher](/docs/reference/controllers/certificate-root-ca-publisher/)
manages a {{< glossary_tooltip term_id="configmap" >}} in every configured Namespace, so that Pods in that
namespace have access to the cluster's root certificate. Pods can load that
ConfigMap and use the cluster root certificate to validate other components'
identities.

## Certificate signing controllers

There are a set of three controllers that work together to provide signed
certificates on demand, for use within your cluster:

### Certificate signature approver

The [certificate signature approver](/docs/reference/controllers/certificate-approver/)
automates approval of certificate signing requests made by a Node within your
cluster.

{{< note >}}
If you want to enable something that isn't a Node to use a CertificateSigningRequest and
obtain valid cluster certificates, you can implement that in a new
[custom controller](/docs/concepts/extend-kubernetes/extend-cluster/#extension-patterns).

The built-in certificate signature approver only reacts to certificate signing
requests that come from cluster nodes.
{{< /note >}}

### CertificateSigningRequest signer

The [certificate signer](/docs/reference/controllers/certificate-signer/) is a
controller that signs certificates based on a certificate signing request (CSR),
once approved. The issued certificates will have a signing chain back to the
root CA.

### CSR cleaner

Within your cluster, CertificateSigningRequests (CSRs) stay valid only for a
limited time.
The [CSR cleaner](/docs/reference/controllers/certificate-cleaner/)
removes CertificateSigningRequests that have expired without being approved.

{{% /capture %}}

{{% capture whatsnext %}}
* Read about [storage controllers](/docs/reference/controllers/storage-controllers/)
{{% /capture %}}
