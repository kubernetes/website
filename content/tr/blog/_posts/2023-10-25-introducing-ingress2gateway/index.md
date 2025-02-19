---
layout: blog
title: "Introducing ingress2gateway; Simplifying Upgrades to Gateway API"
date: 2023-10-25T10:00:00-08:00
slug: introducing-ingress2gateway
author: >
  Lior Lieberman (Google),
  Kobi Levi (independent)
---

Today we are releasing [ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway), a tool
that can help you migrate from [Ingress](/docs/concepts/services-networking/ingress/) to [Gateway
API](https://gateway-api.sigs.k8s.io). Gateway API is just weeks away from graduating to GA, if you
haven't upgraded yet, now's the time to think about it!


## Background

In the ever-evolving world of Kubernetes, networking plays a pivotal role. As more applications are
deployed in Kubernetes clusters, effective exposure of these services to clients becomes a critical
concern. If you've been working with Kubernetes, you're likely familiar with the [Ingress API],
which has been the go-to solution for managing external access to services.

[Ingress API]:/docs/concepts/services-networking/ingress/

The Ingress API provides a way to route external traffic to your applications within the cluster,
making it an indispensable tool for many Kubernetes users. Ingress has its limitations however, and
as applications become more complex and the demands on your Kubernetes clusters increase, these
limitations can become bottlenecks.

Some of the limitations are:

- **Insufficient common denominator** - by attempting to establish a common denominator for various
  HTTP proxies, Ingress can only accommodate basic HTTP routing, forcing more features of
  contemporary proxies like traffic splitting and header matching into provider-specific,
  non-transferable annotations.
- **Inadequate permission model** - Ingress spec configures both infrastructure and application
  configuration in one object. With Ingress, the cluster operator and application developer operate
  on the same Ingress object without being aware of each other’s roles. This creates an insufficient
  role-based access control and has high potential for setup errors. 
- **Lack of protocol diversity** - Ingress primarily focuses on HTTP(S) routing and does not provide
  native support for other protocols, such as TCP, UDP and gRPC. This limitation makes it less
  suitable for handling non-HTTP workloads.

## Gateway API

To overcome this, Gateway API is designed to provide a more flexible, extensible, and powerful way
to manage traffic to your services.

Gateway API is just weeks away from a GA (General Availability) release. It provides a standard
Kubernetes API for ingress traffic control. It offers extended functionality, improved
customization, and greater flexibility. By focusing on modular and expressive API resources, Gateway
API makes it possible to describe a wider array of routing configurations and models.

The transition from Ingress API to Gateway API in Kubernetes is driven by advantages and advanced
functionalities that Gateway API offers, with its foundation built on four core principles: a
role-oriented approach, portability, expressiveness and extensibility.

### A role-oriented approach

Gateway API employs a role-oriented approach that aligns with the conventional roles within
organizations involved in configuring Kubernetes service networking. This approach enables
infrastructure engineers, cluster operators, and application developers to collectively address
different aspects of Gateway API.

For instance, infrastructure engineers play a pivotal role in deploying GatewayClasses,
cluster-scoped resources that act as templates to explicitly define behavior for Gateways derived
from them, laying the groundwork for robust service networking.

Subsequently, cluster operators utilize these GatewayClasses to deploy gateways. A Gateway in
Kubernetes' Gateway API defines how external traffic can be directed to Services within the cluster,
essentially bridging non-Kubernetes sources to Kubernetes-aware destinations. It represents a
request for a load balancer configuration aligned with a GatewayClass’ specification. The Gateway
spec may not be exhaustive as some details can be supplied by the GatewayClass controller, ensuring
portability. Additionally, a Gateway can be linked to multiple Route references to channel specific
traffic subsets to designated services.

Lastly, application developers configure route resources (such as HTTPRoutes), to manage
configuration (e.g. timeouts, request matching/filter) and Service composition (e.g. path routing to
backends) Route resources define protocol-specific rules for mapping requests from a Gateway to
Kubernetes Services. HTTPRoute is for multiplexing HTTP or terminated HTTPS connections. It's
intended for use in cases where you want to inspect the HTTP stream and use HTTP request data for
either routing or modification, for example using HTTP Headers for routing, or modifying them
in-flight.

{{< figure src="gateway-api-resources.svg" alt="Diagram showing the key resources that make up Gateway API and how they relate to each other. The resources shown are GatewayClass, Gateway, and HTTPRoute; the Service API is also shown" class="diagram-medium" >}}

### Portability

With more than 20 [API
implementations](https://gateway-api.sigs.k8s.io/implementations/#implementations), Gateway API is
designed to be more portable across different implementations, clusters and environments. It helps
reduce Ingress' reliance on non-portable, provider-specific annotations, making your configurations
more consistent and easier to manage across multiple clusters.

Gateway API commits to supporting the 5 latest Kubernetes minor versions. That means that Gateway
API currently supports Kubernetes 1.24+.

### Expressiveness

Gateway API provides standard, Kubernetes-backed support for a wide range of features, such as
header-based matching, traffic splitting, weight-based routing, request mirroring and more. With
Ingress, these features need custom provider-specific annotations.

### Extensibility

Gateway API is designed with extensibility as a core feature. Rather than enforcing a
one-size-fits-all model, it offers the flexibility to link custom resources at multiple layers
within the API's framework. This layered approach to customization ensures that users can tailor
configurations to their specific needs without overwhelming the main structure. By doing so, Gateway
API facilitates more granular and context-sensitive adjustments, allowing for a fine-tuned balance
between standardization and adaptability. This becomes particularly valuable in complex cloud-native
environments where specific use cases require nuanced configurations. A critical difference is that
Gateway API has a much broader base set of features and a standard pattern for extensions that can
be more expressive than annotations were on Ingress.


## Upgrading to Gateway

Migrating from Ingress to Gateway API may seem intimidating, but luckily Kubernetes just released a
tool to simplify the process. [ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway)
assists in the migration by converting your existing Ingress resources into Gateway API resources.
Here is how you can get started with Gateway API and using ingress2gateway:

1. [Install a Gateway
   controller](https://gateway-api.sigs.k8s.io/guides/#installing-a-gateway-controller) OR [install
   the Gateway API CRDs manually](https://gateway-api.sigs.k8s.io/guides/#installing-gateway-api) .

2. Install [ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway).
   
   If you have a Go development environment locally, you can install `ingress2gateway` with:

   ```
   go install github.com/kubernetes-sigs/ingress2gateway@v0.1.0
   ```

   This installs `ingress2gateway` to `$(go env GOPATH)/bin/ingress2gateway`.

   Alternatively, follow the installation guide
   [here](https://github.com/kubernetes-sigs/ingress2gateway#installation).

3. Once the tool is installed, you can use it to convert the ingress resources in your cluster to
   Gateway API resources.

   ```
   ingress2gateway print
   ```

   This above command will:

   1. Load your current Kubernetes client config including the active context, namespace and
      authentication details.
   2. Search for ingresses and provider-specific resources in that namespace.
   3. Convert them to Gateway API resources (Currently only Gateways and HTTPRoutes). For other
   options you can  run the tool with `-h`, or refer to
   [https://github.com/kubernetes-sigs/ingress2gateway#options](https://github.com/kubernetes-sigs/ingress2gateway#options).

4. Review the converted Gateway API resources, validate them, and then apply them to your cluster.

5. Send test requests to your Gateway to check that it is working. You could get your gateway
   address using `kubectl get gateway <gateway-name> -n <namespace> -o
   jsonpath='{.status.addresses}{"\n"}'`.

6. Update your DNS to point to the new Gateway. 

7. Once you've confirmed that no more traffic is going through your Ingress configuration, you can
   safely delete it.

## Wrapping up

Achieving reliable, scalable and extensible networking has always been a challenging objective. The
Gateway API is designed to improve the current Kubernetes networking standards like ingress and
reduce the need for implementation specific annotations and CRDs.

It is a Kubernetes standard API, consistent across different platforms and implementations and most
importantly it is future proof. Gateway API is the next generation of the Ingress API, but has a
larger scope than that, expanding to tackle mesh and layer 4 routing as well. Gateway API and
ingress2gateway are supported by a dedicated team under SIG Network that actively work on it and
manage the ecosystem. It is also likely to receive more updates and community support.

### The Road Ahead

ingress2gateway is just getting started. We're planning to onboard more providers, introduce support
for more types of Gateway API routes, and make sure everything syncs up smoothly with the ongoing
development of Gateway API.

Excitingly, Gateway API is also making significant strides. While v1.0 is about to launching,
there's still a lot of work ahead. This release incorporates many new experimental features, with
additional functionalities currently in the early stages of planning and development.

If you're interested in helping to contribute, we would love to have you! Please check out the
[community page](https://gateway-api.sigs.k8s.io/contributing/community/) which includes links to
the Slack channel and community meetings. We look forward to seeing you!!

### Useful Links

- Get involved with the Ingress2Gateway project on
  [GitHub](https://github.com/kubernetes-sigs/ingress2gateway)
- Open a new issue -
  [ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway/issues/new/choose), [Gateway
  API](https://github.com/kubernetes-sigs/gateway-api/issues/new/choose).
- Join our [discussions](https://github.com/kubernetes-sigs/gateway-api/discussions).
- [Gateway API Getting Started](https://gateway-api.sigs.k8s.io/guides/)
- [Gateway API Implementations](https://gateway-api.sigs.k8s.io/implementations/#gateways)
