---
title: Endpoints
id: endpoints
date: 2020-04-23
full_link: /docs/concepts/services-networking/service/#endpoints
short_description: >
  (Deprecated) API representing endpoints of a Service
tags:
- networking
---
A deprecated API that represents the set of all endpoints for a
{{< glossary_tooltip text="Service" term_id="service" >}}.

<!--more-->

Since v1.21, Kubernetes uses 
{{< glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}}
rather than Endpoints; the original Endpoints API was deprecated due to
concerns about scalability.

To learn more about Endpoints, read [Endpoints](/docs/concepts/services-networking/service/#endpoints).
