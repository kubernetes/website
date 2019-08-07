---
title: Service controller
content_template: templates/concept
---

{{% capture overview %}}

The {{< glossary_tooltip term_id="service" >}} controller manages network
access to a set of Pods via one or more Endpoints.

{{% /capture %}}

{{% capture body %}}

## Controller behaviour

For each Service, the controller continuously scans for Pods that match that
Service's {{< glossary_tooltip term_id="selector" >}}, and will then POST any
updates to an Endpoint object with the same name as the Service.

Unless the Service controller idenfifies a “headless” Service (with `.spec.clusterIP`
explicitly set to `None`) then this controller will attempt to set up access to
the Service. For example, the Service controller might assign an IP address for
external access, or it might defer to another controller to ensure that an address
gets assigned.

Using a Service resource you can set up several different mechanisms to handle
incoming network traffic to your application. Depending on your cluster and its
environment, this may involve the cloud-controller-manager as well as cloud-specific
controller behaviors.

{{% /capture %}}
{{% capture whatsnext %}}

* Read about the [Endpoint controller](/docs/reference/controllers/endpoint/)
* Read about the [Service](/docs/concepts/services-networking/service/) concept
* Read about the [Ingress](/docs/concepts/services-networking/ingress/) concept

{{% /capture %}}
