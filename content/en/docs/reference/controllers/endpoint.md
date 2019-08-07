---
title: Endpoint controller
content_template: templates/concept
---

{{% capture overview %}}

This controller makes sure that {{< glossary_tooltip text="Services" term_id="service" >}}
have an Endpoint for each Pod that matches the Services' label selector.

{{% /capture %}}

{{% capture body %}}

The endpoint controller is built in to kube-controller-manager.

## Controller behaviour

The controller watches for Service objects. For each Service, this
controller normally adds or removes Endpoints so that the each Pod has a matching
Endpoint.

If you define a Service without a selector, this controller will *not* create
Endpoints for that Service. You can instead manually map the service to the
network address and port where it’s running, by adding an Endpoint object manually.

{{% /capture %}}
{{% capture whatsnext %}}

* Read about the [Service controller](/docs/reference/controllers/service/)

{{% /capture %}}
