---
layout: blog
title: Kubernetes Gateway API Graduates to Beta
date: 2022-07-13
slug: gateway-api-graduates-to-beta
canonicalUrl: https://gateway-api.sigs.k8s.io/blog/2022/graduating-to-beta/
author: >
  Shane Utt (Kong),
  Rob Scott (Google),
  Nick Young (VMware),
  Jeff Apple (HashiCorp)
---

We are excited to announce the v0.5.0 release of Gateway API. For the first
time, several of our most important Gateway API resources are graduating to
beta. Additionally, we are starting a new initiative to explore how Gateway API
can be used for mesh and introducing new experimental concepts such as URL
rewrites. We'll cover all of this and more below.

## What is Gateway API?

Gateway API is a collection of resources centered around [Gateway][gw] resources
(which represent the underlying network gateways / proxy servers) to enable
robust Kubernetes service networking through expressive, extensible and
role-oriented interfaces that are implemented by many vendors and have broad
industry support.

Originally conceived as a successor to the well known [Ingress][ing] API, the
benefits of Gateway API include (but are not limited to) explicit support for
many commonly used networking protocols (e.g. `HTTP`, `TLS`, `TCP`, `UDP`) as
well as tightly integrated support for Transport Layer Security (TLS). The
`Gateway` resource in particular enables implementations to manage the lifecycle
of network gateways as a Kubernetes API.

If you're an end-user interested in some of the benefits of Gateway API we
invite you to jump in and find an implementation that suits you. At the time of
this release there are over a dozen [implementations][impl] for popular API
gateways and service meshes and guides are available to start exploring quickly.

[gw]:https://gateway-api.sigs.k8s.io/api-types/gateway/
[ing]:https://kubernetes.io/docs/reference/kubernetes-api/service-resources/ingress-v1/
[impl]:https://gateway-api.sigs.k8s.io/implementations/

### Getting started

Gateway API is an official Kubernetes API like
[Ingress](/docs/concepts/services-networking/ingress/).
Gateway API represents a superset of Ingress functionality, enabling more
advanced concepts. Similar to Ingress, there is no default implementation of
Gateway API built into Kubernetes. Instead, there are many different
[implementations][impl] available, providing significant choice in terms of underlying
technologies while providing a consistent and portable experience.

Take a look at the [API concepts documentation][concepts] and check out some of
the [Guides][guides] to start familiarizing yourself with the APIs and how they
work. When you're ready for a practical application open the [implementations
page][impl] and select an implementation that belongs to an existing technology
you may already be familiar with or the one your cluster provider uses as a
default (if applicable). Gateway API is a [Custom Resource Definition
(CRD)][crd] based API so you'll need to [install the CRDs][install-crds] onto a
cluster to use the API.

If you're specifically interested in helping to contribute to Gateway API, we
would love to have you! Please feel free to [open a new issue][issue] on the
repository, or join in the [discussions][disc]. Also check out the [community
page][community] which includes links to the Slack channel and community meetings.

[crd]:https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
[concepts]:https://gateway-api.sigs.k8s.io/concepts/api-overview/
[guides]:https://gateway-api.sigs.k8s.io/guides/getting-started/
[impl]:https://gateway-api.sigs.k8s.io/implementations/
[install-crds]:https://gateway-api.sigs.k8s.io/guides/getting-started/#install-the-crds
[issue]:https://github.com/kubernetes-sigs/gateway-api/issues/new/choose
[disc]:https://github.com/kubernetes-sigs/gateway-api/discussions
[community]:https://gateway-api.sigs.k8s.io/contributing/community/

## Release highlights

### Graduation to beta

The `v0.5.0` release is particularly historic because it marks the growth in
maturity to a beta API version (`v1beta1`) release for some of the key APIs:

- [GatewayClass](https://gateway-api.sigs.k8s.io/api-types/gatewayclass/)
- [Gateway](https://gateway-api.sigs.k8s.io/api-types/gateway/)
- [HTTPRoute](https://gateway-api.sigs.k8s.io/api-types/httproute/)

This achievement was marked by the completion of several graduation criteria:

- API has been [widely implemented][impl].
- Conformance tests provide basic coverage for all resources and have multiple implementations passing tests.
- Most of the API surface is actively being used.
- Kubernetes SIG Network API reviewers have approved graduation to beta.

For more information on Gateway API versioning, refer to the [official
documentation](https://gateway-api.sigs.k8s.io/concepts/versioning/). To see
what's in store for future releases check out the [next steps](#next-steps)
section.

[impl]:https://gateway-api.sigs.k8s.io/implementations/

### Release channels

This release introduces the `experimental` and `standard` [release channels][ch]
which enable a better balance of maintaining stability while still enabling
experimentation and iterative development.

The `standard` release channel includes:

- resources that have graduated to beta
- fields that have graduated to standard (no longer considered experimental)

The `experimental` release channel includes everything in the `standard` release
channel, plus:

- `alpha` API resources
- fields that are considered experimental and have not graduated to `standard` channel

Release channels are used internally to enable iterative development with
quick turnaround, and externally to indicate feature stability to implementors
and end-users.

For this release we've added the following experimental features:

- [Routes can attach to Gateways by specifying port numbers](https://gateway-api.sigs.k8s.io/geps/gep-957/)
- [URL rewrites and path redirects](https://gateway-api.sigs.k8s.io/geps/gep-726/)

[ch]:https://gateway-api.sigs.k8s.io/concepts/versioning/#release-channels-eg-experimental-standard

### Other improvements

For an exhaustive list of changes included in the `v0.5.0` release, please see
the [v0.5.0 release notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v0.5.0).

## Gateway API for service mesh: the GAMMA Initiative
Some service mesh projects have [already implemented support for the Gateway
API](https://gateway-api.sigs.k8s.io/implementations/). Significant overlap
between the Service Mesh Interface (SMI) APIs and the Gateway API has [inspired
discussion in the SMI
community](https://github.com/servicemeshinterface/smi-spec/issues/249) about
possible integration.

We are pleased to announce that the service mesh community, including
representatives from Cilium Service Mesh, Consul, Istio, Kuma, Linkerd, NGINX
Service Mesh and Open Service Mesh, is coming together to form the [GAMMA
Initiative](https://gateway-api.sigs.k8s.io/contributing/gamma/), a dedicated
workstream within the Gateway API subproject focused on Gateway API for Mesh
Management and Administration.

This group will deliver [enhancement
proposals](https://gateway-api.sigs.k8s.io/geps/overview/) consisting
of resources, additions, and modifications to the Gateway API specification for
mesh and mesh-adjacent use-cases.

This work has begun with [an exploration of using Gateway API for
service-to-service
traffic](https://docs.google.com/document/d/1T_DtMQoq2tccLAtJTpo3c0ohjm25vRS35MsestSL9QU/edit#heading=h.jt37re3yi6k5)
and will continue with enhancement in areas such as authentication and
authorization policy.

## Next steps

As we continue to mature the API for production use cases, here are some of the highlights of what we'll be working on for the next Gateway API releases:

- [GRPCRoute][gep1016] for [gRPC][grpc] traffic routing
- [Route delegation][pr1085]
- Layer 4 API maturity: Graduating [TCPRoute][tcpr], [UDPRoute][udpr] and
  [TLSRoute][tlsr] to beta
- [GAMMA Initiative](https://gateway-api.sigs.k8s.io/contributing/gamma/) - Gateway API for Service Mesh

If there's something on this list you want to get involved in, or there's
something not on this list that you want to advocate for to get on the roadmap
please join us in the #sig-network-gateway-api channel on Kubernetes Slack or our weekly [community calls](https://gateway-api.sigs.k8s.io/contributing/community/#meetings).

[gep1016]:https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-1016.md
[grpc]:https://grpc.io/
[pr1085]:https://github.com/kubernetes-sigs/gateway-api/pull/1085
[tcpr]:https://github.com/kubernetes-sigs/gateway-api/blob/main/apis/v1alpha2/tcproute_types.go
[udpr]:https://github.com/kubernetes-sigs/gateway-api/blob/main/apis/v1alpha2/udproute_types.go
[tlsr]:https://github.com/kubernetes-sigs/gateway-api/blob/main/apis/v1alpha2/tlsroute_types.go
[community]:https://gateway-api.sigs.k8s.io/contributing/community/
