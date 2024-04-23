---
layout: blog
title: "Gateway API v1.1: Feature Graduation and Other Updates"
date: 2024-05-13T19:00:00-08:00
slug: gateway-api-v1-1
---

![Gateway API Logo](gateway-api-logo.png)
**Authors:** 
GRPCRoute - Richard Belleville (Google), 
ParentRef Port - Frank Budinsky (IBM),
Gateway Client Certificate Validation - Arko Dasgupta (Tetrate),
GAMMA - John Howard (Solo.io),
Conformance Profiles and Reports - Mattia Lavacca (Kong), Christine Kim (Isovalent),
Session Persistence and BackendLBPolicy - Grant Spence (Red Hat), Gina Yeh (Google),
TLS Terminology Clarifications - Candace Holman (Red Hat),
and other reviewer and release note contributors.

In the wake of the GA release of Gateway API last October, the Kubernetes
SIG Network buoyantly announces the v1.1 release
of [Gateway API](https://gateway-api.sigs.k8s.io/). Gateway API features for
**Gateway API for Service Mesh (GAMMA)**, **GRPCRoute**, **ParentRef Port**, 
and **Conformance Profiles and Reports** will graduate to Standard.
In addition, **Gateway Client Certificate Verification** and **Session
Persistence** are adopted as new, Experimental features. Clarifications to TLS
terminology and gateway merging are added to strengthen the release.

## What's new

### Graduation to Standard
This release includes the graduation to Standard of four eagerly awaited features.
This means they are no longer experimental concepts. **Standard** denotes a high
level of confidence in the API surface and provides guarantees of backward
compatibility.  Though these features are now considered stable, that does not
mean that they are complete. These and other features will continue to evolve via
the Experimental channel. For more information on how all of this works, refer
to the [Gateway API Versioning Policy](https://gateway-api.sigs.k8s.io/concepts/versioning/).


#### [GAMMA](https://gateway-api.sigs.k8s.io/mesh/)
Service mesh support in Gateway API allows service mesh users to use the same
API to manage ingress traffic and mesh traffic, reusing the same policy and
routing interfaces. In Gateway API v1.1, routes (such as HTTPRoute) can now have
a Service as a `parentRef`, to control how traffic to specific services behave.
For more information, read the 
[Gateway API service mesh documentation](https://gateway-api.sigs.k8s.io/mesh/) or see the
[list of Gateway API implementations](https://gateway-api.sigs.k8s.io/implementations/#service-mesh-implementation-status).
As an example, one could do a canary deployment of a workload deep in an application's call graph with an HTTPRoute as follows:

~~~
apiVersion: gateway.networking.k8s.io/v1beta1
kind: HTTPRoute
metadata:
  name: color-canary
  namespace: faces
spec:
  parentRefs:
    - name: color
      kind: Service
      group: core
      port: 80
  rules:
  - backendRefs:
    - name: color
      port: 80
      weight: 50
    - name: color2
      port: 80
      weight: 50
~~~
      
This would split traffic sent to the color Service in the faces namespace 50/50 between the original color Service and the color2 Service, using a portable configuration that's easy to move from one mesh to another.
Leading Contributors: Flynn, John Howard, Keith Mattix, and Mike Morris

#### [GRPCRoute](https://gateway-api.sigs.k8s.io/guides/grpc-routing/)
If you are already using the experimental version of GRPCRoute, we recommend holding
off on upgrading to the standard channel version of GRPCRoute until the
controllers you're using have been updated to support GRPCRoute v1. Until then,
it is safe to upgrade to the experimental channel version of GRPCRoute in v1.1
that includes both v1alpha2 and v1 API versions.

Leading Contributor: Richard Belleville

#### [ParentRef Port](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.ParentReference)
Now you can use the `port` field in ParentRefs to attach resources to Gateways,
Services, or other parent resources. For example, you can attach an HTTPRoute to
one or more specific Listeners of a Gateway based
on the Listener `port`, instead of `name` field.

Leading Contributor: Frank Budinsky

#### [Conformance Profiles and Reports](https://gateway-api.sigs.k8s.io/concepts/conformance/#conformance-profiles)

The Conformance report API has been expanded with the `mode` field (intended to
specify the working mode of the implementation), and the `gatewayAPIChannel`
(standard or experimental). The `gatewayAPIVersion` and `gatewayAPIChannel` are
now filled in automatically by the suite machinery, along with a brief
description of the testing outcome. The Reports have been reorganized in a more
structured way, and the implementations can now add information on how the tests
have been run and provide reproduction steps.

Leading Contributors: Christine Kim, Mattia Lavacca, Shane Utt

### New Additions to Experimental Channel

#### [Gateway Client Certificate Verification](https://gateway-api.sigs.k8s.io/geps/gep-91/)

Gateways can now configure client cert verification for each Gateway Listener by
introducing a new field `frontendValidation` field within `tls`. This field
supports configuring a list of CA Certificates that can be used as a trust
anchor to validate the certificates presented by the client.

Leading Contributor: Arko Dasgupta

#### [Session Persistence and BackendLBPolicy](https://gateway-api.sigs.k8s.io/geps/gep-1619/)

[Session Persistence](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.SessionPersistence) is being introduced to Gateway API via a new policy
([BackendLBPolicy](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1alpha2.BackendLBPolicy))
for Service-level configuration and as fields within HTTPRoute
and GRPCRoute for route-level configuration. The BackendLBPolicy and route-level
APIs provide the same session persistence configuration, including session
timeouts, session name, session type, and cookie lifetime type.

Leading Contributors: Grant Spence, Gina Yeh

#### [TLS Terminology Clarifications](https://gateway-api.sigs.k8s.io/geps/gep-2907/)

As part of a broader goal of making our TLS terminology more consistent
throughout the API, we've introduced some breaking changes to BackendTLSPolicy.
This has resulted in a new API version (v1alpha3) and will require any existing
users of this policy to uninstall the v1alpha2 version before installing this
newer version.

Any references to v1alpha2 BackendTLSPolicy fields will need to be updated to
v1alpha3. Specific changes to fields include:
- TargetRef is changed to allow multiples: BackendTLSPolicySpec.TargetRef
becomes a slice named `TargetRefs`.
- TLS is changed to `Validation`, and the type name changes from
BackendTLSPolicyConfig to  `BackendTLSPolicyValidation`.
- CACertRefs becomes `CACertificateRefs` in what is now `BackendTLSPolicyValidation`
- WellKnownCACerts becomes `WellKnownCACertificates` and the type name
changes from WellKnownCACertType to `WellKnownCACertificatesType`
- the constant WellKnownCACertSystem becomes `WellKnownCACertificatesSystem`

Leading Contributors: Candace Holman, Rob Scott

### Everything else

For a full list of the changes included in this release, please refer to the
[v1.1.0 release
notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.1.0).

## Gateway API background

The idea of Gateway API was initially [proposed](https://youtu.be/Ne9UJL6irXY?si=wgtC9w8PMB5ZHil2)
at the 2019 KubeCon San Diego as the next generation
of Ingress API. Since then, an incredible community has formed to develop what
has likely become the
[most collaborative API in Kubernetes history](https://www.youtube.com/watch?v=V3Vu_FWb4l4).
Over 200 people have contributed to this API so far, and that number continues
to grow.

The maintainers
would like to thank _everyone_ who's contributed to Gateway API, whether in the
form of commits to the repo, discussion, ideas, or general support. We literally
couldn't have gotten this far without the support of this dedicated and active
community.

## Try it out

Unlike other Kubernetes APIs, you don't need to upgrade to the latest version of
Kubernetes to get the latest version of Gateway API. As long as you're running
one of the 5 most recent minor versions of Kubernetes (1.25+), you'll be able to
get up and running with the latest version of Gateway API.

To try out the API, follow our [Getting Started Guide](https://gateway-api.sigs.k8s.io/guides/).

## Get involved

There are lots of opportunities to get involved and help define the future of
Kubernetes routing APIs for both ingress and service mesh.

* Check out the [user guides](https://gateway-api.sigs.k8s.io/guides) to see what use-cases can be addressed. 
* Try out one of the [existing Gateway controllers ](https://gateway-api.sigs.k8s.io/implementations/)
* Or [join us in the community](https://gateway-api.sigs.k8s.io/contributing/)
and help us build the future of Gateway API together!

## Related Kubernetes Blogs
* [New Experimental Features in Gateway API v1.0](https://kubernetes.io/blog/2023/11/28/gateway-api-ga/)
11/2023
* [Gateway API v1.0: GA Release](https://kubernetes.io/blog/2023/10/31/gateway-api-ga/)
10/2023
* [Introducing ingress2gateway; Simplifying Upgrades to Gateway API](https://kubernetes.io/blog/2023/10/25/introducing-ingress2gateway/)
10/2023
* [Gateway API v0.8.0: Introducing Service Mesh Support](https://kubernetes.io/blog/2023/08/29/gateway-api-v0-8/)
08/2022
* [Kubernetes Gateway API Graduates to Beta](https://kubernetes.io/blog/2022/07/13/gateway-api-graduates-to-beta/)
07/2022
