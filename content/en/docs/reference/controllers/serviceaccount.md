---
toc_hide: true
title: ServiceAccount controller
content_template: templates/concept
---

{{% capture overview %}}

One of a pair of {{< glossary_tooltip term_id="controller" text="controllers">}}
for the {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}
resource.

{{% /capture %}}

{{% capture body %}}

The ServiceAccount controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

This controller ensures that each {{< glossary_tooltip term_id="namespace" >}}
contains a default ServiceAccount.
{{% /capture %}}
{{% capture whatsnext %}}
* Read about the [ServiceAccount token controller](/docs/reference/controllers/serviceaccount-token/)
* Read about other [cluster orchestration controllers](/docs/reference/controllers/cluster-orchestration-controllers/)
{{% /capture %}}
