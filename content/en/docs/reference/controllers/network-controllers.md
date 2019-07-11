---
title: Networking controllers
content_template: templates/concept
weight: 70
---

{{% capture overview %}}

This page lists the networking
{{< glossary_tooltip text="controllers" term_id="controller" >}}
that come as part of Kubernetes itself.

{{% /capture %}}

{{% capture body %}}

## Endpoint controller

The [Endpoint controller](/docs/reference/controllers/endpoint/) makes sure
that there is an Endpoint for each {{< glossary_tooltip term_id="pod" >}} in a
{{< glossary_tooltip term_id="service" >}}.

## EndpointSlice controller

The [EndpointSlice controller](/docs/reference/controllers/endpoint-slice/)
manages EndpointSlice objects rather than Endpoints, providing a different way
to map Services to Pods.

## Service controller

The [Service controller](/docs/reference/controllers/service/) tracks the Pods
in a Service and implements access to that Service; for example, via a load
balancer outside your cluster.

## Node IPAM controller

When active, the
[Node IP address management (IPAM) controller](/docs/reference/controllers/node-ip-address-management/)
manages the blocks of IP addresses assigned to
{{< glossary_tooltip text="Nodes" term_id="node" >}}.

{{% /capture %}}

{{% capture whatsnext %}}
* Read about the [Service](/docs/concepts/services-networking/service/) concept
* Read about the [Ingress](/docs/concepts/services-networking/ingress/) concept
* Read about [cluster orchestration controllers](/docs/reference/controllers/cluster-orchestration-controllers/)
{{% /capture %}}
