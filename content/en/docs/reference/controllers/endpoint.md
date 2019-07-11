---
toc_hide: true
title: Endpoint controller
content_template: templates/concept
---

{{% capture overview %}}

This {{< glossary_tooltip term_id="controller" text="controller" >}} makes
sure that {{< glossary_tooltip text="Services" term_id="service" >}}
have an Endpoint for each Pod that matches the Service's
{{< glossary_tooltip term_id="label" >}} selector.

{{% /capture %}}

{{% capture body %}}

The Endpoint controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

This controller watches for Service and Pod objects. For each Service that has
a {{< glossary_tooltip term_id="selector" >}}, this
controller adds or removes Endpoints so that each Pod has a matching Endpoint.

{{< note >}}
If you define a Service without a selector, this controller will not create
Endpoints for that Service.
{{< /note >}}

{{% /capture %}}
{{% capture whatsnext %}}

* Read about the [Service controller](/docs/reference/controllers/service/)
* Read about the [EndpointSlice controller](/docs/reference/controllers/endpoint-slice/)

{{% /capture %}}
