---
layout: blog
title: "Gateway API is now Generally Available (GA)"
date: 2023-10-19T10:00:00-08:00
slug: gateway-api-ga
---

***Authors:*** Shane Utt (Kong), Nick Young (Isovalent), Rob Scott (Google)

We (the community developing [Gateway API][gwapi]) are incredibly pleased and
proud to announce _general availability_ of Gateway API for use with Kubernetes
clusters (versions 1.24 and newer)!

## Important Highlights

Kubernetes' Gateway API brings a lot of new networking possibilities to the table in your
Kubernetes cluster. In this post we'll cover some of the most important
highlights.

For a complete list of changes for this specific release, please see our
[v1.0.0 changelog entry][chlogv1].

For a complete list of every feature for every release, or to review some of
the releases leading up to v1.0.0, please see our [historical
changelog][clog].

### Version 1 APIs

This marks the **first stable release** of Gateway API, where we are now
publishing the following APIs as `v1` (version 1):

- [GatewayClass][gwc]
- [Gateway][gw]
- [HTTPRoute][hr]

Reaching version 1 with these APIs means we future iterations on them will be
handled in a backwards compatible manner.

### CEL Migration

Gateway API [CRDs][crds] now include [CEL][cel] validation. This streamlines
the development of validation for our resources, and reduces the overhead of
deploying Gateway API to a cluster as it eliminates the need for our historical
[admission webhook][admw].

> **Note**: For Kubernetes `v1.25` and newer we recommend against deploying the
> webhook, and if you had it running previously you can now uninstall it in
> favor of the validation now provided via CEL.

### Kubernetes Support

Gateway API generally [supports the last 5 stable Kubernetes versions][kvs]. As
such, this release is supported on Kubernetes clusters version `1.24` through
`1.29` at the time of release.

> **Warning**: Related to our migration to [CEL][cel] as mentioned above, we
> don't recommend deploying on `v1.24` clusters if it can be avoided as these
> clusters will still require the admission webhook, and that webhook is
> considered deprecated and support for it will drop shortly after this GA
> release when Kubernetes `v1.30` becomes available. If it's unavoidable to
> deploy on `v1.24`, just note that you'll need to upgrade fairly soon in
> order to be considered supported.

### Getting Started

If you want to try Gateway API features out for yourself but don't know where
to get started you'll want to check out one of the 20+
[implementations](https://gateway-api.sigs.k8s.io/implementations/) which
we list on the Gateway API website.

Gateway API itself is just an API for downstream projects to implement, so take
some time to peruse the implementations list above and find one that seems to
fit your needs, or that you're most familiar with.

> **Note**: with this release we now have basic support for downstream
> implementations to report the results of their Gateway API conformance test
> runs. This means that for some implementations on the above implementations
> page you may see a `Gateway API Conformance vX.X.X` badge present under their
> project header. This indicates that this implementation _is conformant_ for
> the version present in the badge, and is sending back reports of their
> conformance to the upstream project, including details on which specific
> features they support. Click on the badge to see a more detailed report of
> supported features, but note that the reporting system is considered
> experimental and the structure of these reports is subject to change.

## Future Plans

General availability is just the beginning of the much larger journey for
Gateway API, and there's plenty of new features and new ideas in flight for the
upcoming releases!

If you opt-in to the [experimental channel][expch] for this release, you'll find
that there are several experimental features available which are being
considered for inclusion as stable in future releases:

- [Backend TLS policy][gep1897]
- [HTTPRoute Timeouts][gep1742]
- [Gateway Infrastructure Labels][gep1762]
- Support for [Websockets, HTTP/2 and more!][gep1911]
- [`gwctl`][gwctl], our new Gateway API command line tool

We intend to have a blog post following up on this one which will cover these
(and potentially more) experimental and upcoming features where the authors of
the features themselves can provide a greater level of detail.

In future iterations we also intend to grow the maturity and work towards
[graduation][grad] of APIs other than GatewayClass, Gateway, and
HTTPRoute. There are several APIs that are not yet at version 1:

- [GRPCRoute][grpc]
- [TCPRoute][tcp]
- [UDPRoute][udp]
- [TLSRoute][tls]
- [ReferenceGrant][refg]

[ReferenceGrant][refg] is a slightly special case as we are considering what
to do with this: we've come to understand this might be a
feature applicable to the greater Kubernetes community and we're trying to
navigate potentially moving it somewhere more general to maximize benefit.

For those interested in service mesh, note that we continue to work on making
Gateway API resources available for use in service mesh contexts as part of the
[GAMMA project][gamma]. Please see our recent blog post [Gateway API v0.8.0:
Introducing Service Mesh Support][gammablog] for more details.

What you've seen here is _not exhaustive_! Gateway API is a highly active
project, with dozens of people actively working on it. If you're hoping to see
one of the above routes graduated, or have ideas for features that we have yet
to account for, we _strongly encourage_ you to [join us in the community][com]
and help us build!

## Gateway API events at KubeCon + CloudNativeCon

At [Kubecon North America (Chicago)][kna] and the adjacent
[Contributor Summit][csum] there are several talks about or related to Gateway
API that expand upon GA, discuss some of our new features, and even talk about
what happens next. If you're attending Kubecon and the Contributor Summit this
year, please do see us at these talks!

*Contributor Summit*:

- [Lessons learned building a GA API with CRDs][csum1]
- [Conformance Testing (from Gateway API)][csum2]
- [Gateway API: Beyond GA][csum3]

*Kubecon Main Event*:

**TODO**

## Recognition & Appreciation

Our project is more than just a project, it is a community of people working
together to solve common problems. Our community _is_ the project and we want to
give a huge shout out and thanks to them!

Thank you so much to our [170+ contributors][contribs] who built this project
together with us, and made our GA release possible!

A special thank you to our [community members who agreed to take on an
official role in the project][roles], explicitly providing some time for reviews
and sharing the load of maintaining the project!

[gwapi]:https://gateway-api.sigs.k8s.io/
[clogv1]:https://github.com/kubernetes-sigs/gateway-api/blob/main/CHANGELOG.md#v100
[clog]:https://github.com/kubernetes-sigs/gateway-api/blob/main/CHANGELOG.md
[gwc]:https://gateway-api.sigs.k8s.io/api-types/gatewayclass/
[gw]:https://gateway-api.sigs.k8s.io/api-types/gateway/
[hr]:https://gateway-api.sigs.k8s.io/api-types/httproute/
[crds]:https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
[kvs]:https://gateway-api.sigs.k8s.io/concepts/versioning/#supported-versions
[cel]:https://kubernetes.io/docs/reference/using-api/cel/
[admw]:https://github.com/kubernetes-sigs/gateway-api/tree/main/config/webhook
[expch]:https://gateway-api.sigs.k8s.io/concepts/versioning/#release-channels
[gep1897]:https://gateway-api.sigs.k8s.io/geps/gep-1897/
[gep1742]:https://gateway-api.sigs.k8s.io/geps/gep-1742/
[gep1762]:https://gateway-api.sigs.k8s.io/geps/gep-1762/
[gep1911]:https://gateway-api.sigs.k8s.io/geps/gep-1911/
[gwctl]:https://github.com/kubernetes-sigs/gateway-api/tree/main/gwctl
[grad]:https://gateway-api.sigs.k8s.io/concepts/versioning/#graduation-criteria
[grpc]:https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.GRPCRoute
[tcp]:https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.TCPRoute
[udp]:https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.UDPRoute
[tls]:https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1alpha2.TLSRoute
[com]:https://gateway-api.sigs.k8s.io/contributing/#how-to-get-involved
[refg]:https://gateway-api.sigs.k8s.io/api-types/referencegrant/
[gamma]:https://gateway-api.sigs.k8s.io/concepts/gamma/
[gammablog]:https://kubernetes.io/blog/2023/08/29/gateway-api-v0-8/
[kna]:https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/
[csum]:https://kcsna2023.sched.com/
[csum1]:https://kcsna2023.sched.com/event/1Sp9u/lessons-learned-building-a-ga-api-with-crds
[csum2]:https://kcsna2023.sched.com/event/1Sp9l/conformance-profiles-building-a-generic-conformance-test-reporting-framework
[csum3]:https://kcsna2023.sched.com/event/1SpA9/gateway-api-beyond-ga
[contribs]:https://github.com/kubernetes-sigs/gateway-api/graphs/contributors
[roles]:https://github.com/kubernetes-sigs/gateway-api/blob/main/OWNERS_ALIASES