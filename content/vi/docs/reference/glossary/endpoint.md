---
title: Endpoints
id: endpoints
date: 2020-04-23
full_link: 
short_description: >
  An endpoint of a Service is one of the Pods (or external servers) that implements the Service.

aka:
tags:
- networking
---
 An endpoint of a {{< glossary_tooltip text="Service" term_id="service" >}} is one of the {{< glossary_tooltip text="Pods" term_id="pod" >}} (or external servers) that implements the Service.

<!--more-->
For Services with {{< glossary_tooltip text="selectors" term_id="selector" >}},
the EndpointSlice controller will automatically create one or more {{<
glossary_tooltip text="EndpointSlices" term_id="endpoint-slice" >}} giving the
IP addresses of the selected endpoint Pods.

EndpointSlices can also be created manually to indicate the endpoints of
Services that have no selector specified.
