---
layout: blog
title: "Gateway API v0.8.0: Introducing Service Mesh Support"
date: 2023-08-29T10:00:00-08:00
slug: gateway-api-v0-8
author: >
  Flynn (Buoyant),
  John Howard (Google),
  Keith Mattix (Microsoft),
  Michael Beaumont (Kong),
  Mike Morris (independent),
  Rob Scott (Google)
---

We are thrilled to announce the v0.8.0 release of Gateway API! With this
release, Gateway API support for service mesh has reached [Experimental
status][status]. We look forward to your feedback!

We're especially delighted to announce that Kuma 2.3+, Linkerd 2.14+, and Istio
1.16+ are all fully-conformant implementations of Gateway API service mesh
support.

## Service mesh support in Gateway API

While the initial focus of Gateway API was always ingress (north-south)
traffic, it was clear almost from the beginning that the same basic routing
concepts should also be applicable to service mesh (east-west) traffic. In
2022, the Gateway API subproject started the [GAMMA initiative][gamma], a
dedicated vendor-neutral workstream, specifically to examine how best to fit
service mesh support into the framework of the Gateway API resources, without
requiring users of Gateway API to relearn everything they understand about the
API.

Over the last year, GAMMA has dug deeply into the challenges and possible
solutions around using Gateway API for service mesh. The end result is a small
number of [enhancement proposals][geps] that subsume many hours of thought and
debate, and provide a minimum viable path to allow Gateway API to be used for
service mesh.

### How will mesh routing work when using Gateway API?

You can find all the details in the [Gateway API Mesh routing
documentation][mesh-routing] and [GEP-1426], but the short version for Gateway
API v0.8.0 is that an HTTPRoute can now have a `parentRef` that is a Service,
rather than just a Gateway. We anticipate future GEPs in this area as we gain
more experience with service mesh use cases -- binding to a Service makes it
possible to use the Gateway API with a service mesh, but there are several
interesting use cases that remain difficult to cover.

As an example, you might use an HTTPRoute to do an A-B test in the mesh as
follows:

```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
  name: bar-route
spec:
  parentRefs:
  - group: ""
    kind: Service
    name: demo-app
    port: 5000
  rules:
  - matches:
    - headers:
      - type: Exact
        name: env
        value: v1
    backendRefs:
    - name: demo-app-v1
      port: 5000
  - backendRefs:
    - name: demo-app-v2
      port: 5000
```

Any request to port 5000 of the `demo-app` Service that has the header `env:
v1` will be routed to `demo-app-v1`, while any request without that header
will be routed to `demo-app-v2` -- and since this is being handled by the
service mesh, not the ingress controller, the A/B test can happen anywhere in
the application's call graph.

### How do I know this will be truly portable?

Gateway API has been investing heavily in conformance tests across all
features it supports, and mesh is no exception. One of the challenges that the
GAMMA initiative ran into is that many of these tests were strongly tied to
the idea that a given implementation provides an ingress controller. Many
service meshes don't, and requiring a GAMMA-conformant mesh to also implement
an ingress controller seemed impractical at best. This resulted in work
restarting on Gateway API _conformance profiles_, as discussed in [GEP-1709].

The basic idea of conformance profiles is that we can define subsets of the
Gateway API, and allow implementations to choose (and document) which subsets
they conform to. GAMMA is adding a new profile, named `Mesh` and described in
[GEP-1686], which checks only the mesh functionality as defined by GAMMA. At
this point, Kuma 2.3+, Linkerd 2.14+, and Istio 1.16+ are all conformant with
the `Mesh` profile.

## What else is in Gateway API v0.8.0?

This release is all about preparing Gateway API for the upcoming v1.0 release
where HTTPRoute, Gateway, and GatewayClass will graduate to GA. There are two
main changes related to this: CEL validation and API version changes.

### CEL Validation

The first major change is that Gateway API v0.8.0 is the start of a transition
from webhook validation to [CEL validation][cel] using information built into
the CRDs. That will mean different things depending on the version of
Kubernetes you're using:

#### Kubernetes 1.25+

CEL validation is fully supported, and almost all validation is implemented in
CEL. (The sole exception is that header names in header modifier filters can
only do case-insensitive validation. There is more information in [issue
2277].)

We recommend _not_ using the validating webhook on these Kubernetes versions.

#### Kubernetes 1.23 and 1.24

CEL validation is not supported, but Gateway API v0.8.0 CRDs can still be
installed. When you upgrade to Kubernetes 1.25+, the validation included in
these CRDs will automatically take effect.

We recommend continuing to use the validating webhook on these Kubernetes
versions.

#### Kubernetes 1.22 and older

Gateway API only commits to support for [5 most recent versions of
Kubernetes][supported-versions]. As such, these versions are no longer
supported by Gateway API, and unfortunately Gateway API v0.8.0 cannot be
installed on them, since CRDs containing CEL validation will be rejected.

### API Version Changes

As we prepare for a v1.0 release that will graduate Gateway, GatewayClass, and
HTTPRoute to the `v1` API Version from `v1beta1`, we are continuing the process
of moving away from `v1alpha2` for resources that have graduated to `v1beta1`.
For more information on this change and everything else included in this
release, refer to the [v0.8.0 release notes][v0.8.0 release notes].

## How can I get started with Gateway API?

Gateway API represents the future of load balancing, routing, and service mesh
APIs in Kubernetes. There are already more than 20 [implementations][impl]
available (including both ingress controllers and service meshes) and the list
keeps growing.

If you're interested in getting started with Gateway API, take a look at the
[API concepts documentation][concepts] and check out some of the
[Guides][guides] to try it out. Because this is a CRD-based API, you can
install the latest version on any Kubernetes 1.23+ cluster.

If you're specifically interested in helping to contribute to Gateway API, we
would love to have you! Please feel free to [open a new issue][issue] on the
repository, or join in the [discussions][disc]. Also check out the [community
page][community] which includes links to the Slack channel and community
meetings. We look forward to seeing you!!

## Further Reading:

- [GEP-1324] provides an overview of the GAMMA goals and some important
  definitions. This GEP is well worth a read for its discussion of the problem
  space.
- [GEP-1426] defines how to use Gateway API route resources, such as
  HTTPRoute, to manage traffic within a service mesh.
- [GEP-1686] builds on the work of [GEP-1709] to define a _conformance
  profile_ for service meshes to be declared conformant with Gateway API.

Although these are [Experimental][status] patterns, note that they are available
in the [`standard` release channel][ch], since the GAMMA initiative has not
needed to introduce new resources or fields to date.

[gamma]:https://gateway-api.sigs.k8s.io/concepts/gamma/
[status]:https://gateway-api.sigs.k8s.io/geps/overview/#status
[ch]:https://gateway-api.sigs.k8s.io/concepts/versioning/#release-channels-eg-experimental-standard
[cel]:/docs/reference/using-api/cel/
[crd]:/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
[concepts]:https://gateway-api.sigs.k8s.io/concepts/api-overview/
[geps]:https://gateway-api.sigs.k8s.io/contributing/enhancement-requests/
[guides]:https://gateway-api.sigs.k8s.io/guides/getting-started/
[impl]:https://gateway-api.sigs.k8s.io/implementations/
[install-crds]:https://gateway-api.sigs.k8s.io/guides/getting-started/#install-the-crds
[issue]:https://github.com/kubernetes-sigs/gateway-api/issues/new/choose
[disc]:https://github.com/kubernetes-sigs/gateway-api/discussions
[community]:https://gateway-api.sigs.k8s.io/contributing/community/
[mesh-routing]:https://gateway-api.sigs.k8s.io/concepts/gamma/#how-the-gateway-api-works-for-service-mesh
[GEP-1426]:https://gateway-api.sigs.k8s.io/geps/gep-1426/
[GEP-1324]:https://gateway-api.sigs.k8s.io/geps/gep-1324/
[GEP-1686]:https://gateway-api.sigs.k8s.io/geps/gep-1686/
[GEP-1709]:https://gateway-api.sigs.k8s.io/geps/gep-1709/
[issue 2277]:https://github.com/kubernetes-sigs/gateway-api/issues/2277
[supported-versions]:https://gateway-api.sigs.k8s.io/concepts/versioning/#supported-versions
[v0.8.0 release notes]:https://github.com/kubernetes-sigs/gateway-api/releases/tag/v0.8.0
[versioning docs]:https://gateway-api.sigs.k8s.io/concepts/versioning/
