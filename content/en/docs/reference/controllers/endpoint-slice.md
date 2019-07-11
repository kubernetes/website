---
toc_hide: true
title: EndpointSlice controller
content_template: templates/concept
---

{{% capture overview %}}
{{< feature-state for_k8s_version="v1.17" state="beta" >}}

This {{< glossary_tooltip term_id="controller" text="controller" >}} makes
complements the [Endpoint controller](/docs/reference/controllers/endpoint/)
with a higher-performance API object, EndpointSlice.

{{% /capture %}}

{{% capture body %}}

The EndpointSlice controller is built in to the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

## Controller behavior

Endpoint Slices group network endpoints together by unique Service and Port combinations.

This controller watches for Service and Pod objects. For each Service that has
a {{< glossary_tooltip term_id="selector" >}}, this
controller adds, removes or amends EndpointSlices so that each Pod has an endpoint in the
relevant EndpointSlice.

{{< note >}}
If you define a Service without a selector, this controller will not create
EndpointSlices for that Service.
{{< /note >}}

{{% /capture %}}
{{% capture whatsnext %}}

* Read about [endpoint slices](/docs/concepts/services-networking/endpoint-slices/)
* Read about the [Endpoint controller](/docs/reference/controllers/endpoint/)
* Read about the [Service controller](/docs/reference/controllers/service/)

{{% /capture %}}
