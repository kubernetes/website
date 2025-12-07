---
title: EndpointSlice
id: endpoint-slice
date: 2018-04-12
full_link: /docs/concepts/services-networking/endpoint-slices/
short_description: >
  EndpointSlices track the IP addresses of Pods for Services.

aka:
tags:
- networking
---
EndpointSlices track the IP addresses of backend endpoints.
EndpointSlices are normally associated with a
{{< glossary_tooltip text="Service" term_id="service" >}} and the backend endpoints typically represent
{{< glossary_tooltip text="Pods" term_id="pod" >}}.

<!--more-->
One Service can be backed by multiple Pods. Kubernetes represents the backing endpoints of a Service
with a set of EndpointSlices that are associated with that Service.
The backing endpoints are usually, but not always, pods running in the cluster.

The control plane usually manages EndpointSlices for you automatically. However,
EndpointSlices can be defined manually for {{< glossary_tooltip text="Services" term_id="service" >}} without
{{< glossary_tooltip text="selectors" term_id="selector" >}} specified.
