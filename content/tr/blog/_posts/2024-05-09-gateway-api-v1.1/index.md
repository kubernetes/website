---
layout: blog
title: "Gateway API v1.1: Service mesh, GRPCRoute, and a whole lot more"
date: 2024-05-09T09:00:00-08:00
slug: gateway-api-v1-1
author: >
  [Richard Belleville](https://github.com/gnossen) (Google),
  [Frank Budinsky](https://github.com/frankbu) (IBM),
  [Arko Dasgupta](https://github.com/arkodg) (Tetrate),
  [Flynn](https://github.com/kflynn) (Buoyant),
  [Candace Holman](https://github.com/candita) (Red Hat),
  [John Howard](https://github.com/howardjohn) (Solo.io),
  [Christine Kim](https://github.com/xtineskim) (Isovalent),
  [Mattia Lavacca](https://github.com/mlavacca) (Kong),
  [Keith Mattix](https://github.com/keithmattix) (Microsoft),
  [Mike Morris](https://github.com/mikemorris) (Microsoft),
  [Rob Scott](https://github.com/robscott) (Google),
  [Grant Spence](https://github.com/gcs278) (Red Hat),
  [Shane Utt](https://github.com/shaneutt) (Kong),
  [Gina Yeh](https://github.com/ginayeh) (Google),
  and other review and release note contributors
---

![Gateway API logo](gateway-api-logo.svg)

Following the GA release of Gateway API last October, Kubernetes
SIG Network is pleased to announce the v1.1 release of
[Gateway API](https://gateway-api.sigs.k8s.io/). In this release, several features are graduating to
_Standard Channel_ (GA), notably including support for service mesh and
GRPCRoute. We're also introducing some new experimental features, including
session persistence and client certificate verification.

## What's new

### Graduation to Standard

This release includes the graduation to Standard of four eagerly awaited features.
This means they are no longer experimental concepts; inclusion in the Standard
release channel denotes a high level of confidence in the API surface and
provides guarantees of backward compatibility. Of course, as with any other
Kubernetes API, Standard Channel features can continue to evolve with
backward-compatible additions over time, and we certainly expect further
refinements and improvements to these new features in the future.
For more information on how all of this works, refer to the
[Gateway API Versioning Policy](https://gateway-api.sigs.k8s.io/concepts/versioning/).

#### [Service Mesh Support](https://gateway-api.sigs.k8s.io/mesh/)

Service mesh support in Gateway API allows service mesh users to use the same
API to manage ingress traffic and mesh traffic, reusing the same policy and
routing interfaces. In Gateway API v1.1, routes (such as HTTPRoute) can now have
a Service as a `parentRef`, to control how traffic to specific services behave.
For more information, read the
[Gateway API service mesh documentation](https://gateway-api.sigs.k8s.io/mesh/)
or see the
[list of Gateway API implementations](https://gateway-api.sigs.k8s.io/implementations/#service-mesh-implementation-status).

As an example, one could do a canary deployment of a workload deep in an
application's call graph with an HTTPRoute as follows:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: color-canary
  namespace: faces
spec:
  parentRefs:
    - name: color
      kind: Service
      group: ""
      port: 80
  rules:
  - backendRefs:
    - name: color
      port: 80
      weight: 50
    - name: color2
      port: 80
      weight: 50
```

This would split traffic sent to the `color` Service in the `faces` namespace
50/50 between the original `color` Service and the `color2` Service, using a
portable configuration that's easy to move from one mesh to another.

#### [GRPCRoute](https://gateway-api.sigs.k8s.io/guides/grpc-routing/)

If you are already using the experimental version of GRPCRoute, we recommend holding
off on upgrading to the standard channel version of GRPCRoute until the
controllers you're using have been updated to support GRPCRoute v1. Until then,
it is safe to upgrade to the experimental channel version of GRPCRoute in v1.1
that includes both v1alpha2 and v1 API versions.

#### [ParentReference Port](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.ParentReference)

The `port` field was added to ParentReference, allowing you to attach resources
to Gateway Listeners, Services, or other parent resources
(depending on the implementation). Binding to a port also allows you to attach
to multiple Listeners at once.

For example, you can attach an HTTPRoute to one or more specific Listeners of a
Gateway as specified by the Listener `port`, instead of the Listener `name` field.

For more information, see
[Attaching to Gateways](https://gateway-api.sigs.k8s.io/api-types/httproute/#attaching-to-gateways).

#### [Conformance Profiles and Reports](https://gateway-api.sigs.k8s.io/concepts/conformance/#conformance-profiles)

The conformance report API has been expanded with the `mode` field (intended to
specify the working mode of the implementation), and the `gatewayAPIChannel`
(standard or experimental). The `gatewayAPIVersion` and `gatewayAPIChannel` are
now filled in automatically by the suite machinery, along with a brief
description of the testing outcome. The Reports have been reorganized in a more
structured way, and the implementations can now add information on how the tests
have been run and provide reproduction steps.

### New additions to Experimental channel

#### [Gateway Client Certificate Verification](https://gateway-api.sigs.k8s.io/geps/gep-91/)

Gateways can now configure client cert verification for each Gateway Listener by
introducing a new `frontendValidation` field within `tls`. This field
supports configuring a list of CA Certificates that can be used as a trust
anchor to validate the certificates presented by the client.

The following example shows how the CACertificate stored in
the `foo-example-com-ca-cert` ConfigMap can be used to validate the certificates
presented by clients connecting to the `foo-https` Gateway Listener.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: client-validation-basic
spec:
  gatewayClassName: acme-lb
  listeners:
    name: foo-https
    protocol: HTTPS
    port: 443
    hostname: foo.example.com
  tls:
    certificateRefs:
      kind: Secret
      group: ""
      name: foo-example-com-cert
    frontendValidation:
      caCertificateRefs:
        kind: ConfigMap
        group: ""
        name: foo-example-com-ca-cert
```

#### [Session Persistence and BackendLBPolicy](https://gateway-api.sigs.k8s.io/geps/gep-1619/)

[Session Persistence](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.SessionPersistence)
is being introduced to Gateway API via a new policy
([BackendLBPolicy](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1alpha2.BackendLBPolicy))
for Service-level configuration and as fields within HTTPRoute
and GRPCRoute for route-level configuration. The BackendLBPolicy and route-level
APIs provide the same session persistence configuration, including session
timeouts, session name, session type, and cookie lifetime type.

Below is an example configuration of `BackendLBPolicy` that enables cookie-based
session persistence for the `foo` service. It sets the session name to
`foo-session`, defines absolute and idle timeouts, and configures the cookie to
be a session cookie:

```yaml
apiVersion: gateway.networking.k8s.io/v1alpha2
kind: BackendLBPolicy
metadata:
  name: lb-policy
  namespace: foo-ns
spec:
  targetRefs:
  - group: core
    kind: service
    name: foo
  sessionPersistence:
    sessionName: foo-session
    absoluteTimeout: 1h
    idleTimeout: 30m
    type: Cookie
    cookieConfig:
      lifetimeType: Session
```

### Everything else

#### [TLS Terminology Clarifications](https://gateway-api.sigs.k8s.io/geps/gep-2907/)

As part of a broader goal of making our TLS terminology more consistent
throughout the API, we've introduced some breaking changes to BackendTLSPolicy.
This has resulted in a new API version (v1alpha3) and will require any existing
implementations of this policy to properly handle the version upgrade, e.g.
by backing up data and uninstalling the v1alpha2 version before installing this
newer version.

Any references to v1alpha2 BackendTLSPolicy fields will need to be updated to
v1alpha3. Specific changes to fields include:

- `targetRef` becomes `targetRefs` to allow a BackendTLSPolicy to attach to
  multiple targets
- `tls` becomes `validation`
- `tls.caCertRefs` becomes `validation.caCertificateRefs`
- `tls.wellKnownCACerts` becomes `validation.wellKnownCACertificates`

For a full list of the changes included in this release, please refer to the
[v1.1.0 release notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.1.0).

## Gateway API background

The idea of Gateway API was initially [proposed](https://youtu.be/Ne9UJL6irXY?si=wgtC9w8PMB5ZHil2)
at the 2019 KubeCon San Diego as the next generation
of Ingress API. Since then, an incredible community has formed to develop what
has likely become the
[most collaborative API in Kubernetes history](https://www.youtube.com/watch?v=V3Vu_FWb4l4).
Over 200 people have contributed to this API so far, and that number continues to grow.

The maintainers would like to thank _everyone_ who's contributed to Gateway API, whether in the
form of commits to the repo, discussion, ideas, or general support. We literally
couldn't have gotten this far without the support of this dedicated and active
community.

## Try it out

Unlike other Kubernetes APIs, you don't need to upgrade to the latest version of
Kubernetes to get the latest version of Gateway API. As long as you're running
Kubernetes 1.26 or later, you'll be able to get up and running with this
version of Gateway API.

To try out the API, follow our [Getting Started Guide](https://gateway-api.sigs.k8s.io/guides/).

## Get involved

There are lots of opportunities to get involved and help define the future of
Kubernetes routing APIs for both ingress and service mesh.

* Check out the [user guides](https://gateway-api.sigs.k8s.io/guides) to see what use-cases can be addressed.
* Try out one of the [existing Gateway controllers](https://gateway-api.sigs.k8s.io/implementations/).
* Or [join us in the community](https://gateway-api.sigs.k8s.io/contributing/)
  and help us build the future of Gateway API together!

## Related Kubernetes blog articles

* [New Experimental Features in Gateway API v1.0](/blog/2023/11/28/gateway-api-ga/)
  11/2023
* [Gateway API v1.0: GA Release](/blog/2023/10/31/gateway-api-ga/)
  10/2023
* [Introducing ingress2gateway; Simplifying Upgrades to Gateway API](/blog/2023/10/25/introducing-ingress2gateway/)
  10/2023
* [Gateway API v0.8.0: Introducing Service Mesh Support](/blog/2023/08/29/gateway-api-v0-8/)
  08/2023
