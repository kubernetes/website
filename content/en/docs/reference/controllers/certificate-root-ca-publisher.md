---
toc_hide: true
title: Root CA controller
content_template: templates/concept
---

{{% capture overview %}}

Kubernetes clusters have a [certificate authority](/docs/concepts/cluster-administration/certificates/)
(CA) that the control plane uses to authenticate different components.

This {{< glossary_tooltip term_id="controller" text="controller" >}} manages a
{{< glossary_tooltip term_id="configmap" >}} in every configured
{{< glossary_tooltip term_id="namespace" >}}, so that Pods
in that Namespace have access to the cluster's root CA and can validate other
components' identity.

{{% /capture %}}

{{% capture body %}}

The root CA controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

This controller watches for Namespaces. For every new Namespace, the
controller adds a ConfigMap containing the cluster's root certificate.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about other [certificate controllers](/docs/reference/controllers/certificate-controllers/)
{{% /capture %}}
