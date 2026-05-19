---
layout: blog
title: "Gateway API v1.2: WebSockets, Timeouts, Retries, and More"
date: 2024-11-21T09:00:00-08:00
slug: gateway-api-v1-2
author: Gateway API Contributors
---

![Gateway API logo](gateway-api-logo.svg)

Kubernetes SIG Network is delighted to announce the general availability of
[Gateway API](https://gateway-api.sigs.k8s.io/) v1.2! This version of the API
was released on October 3, and we're delighted to report that we now have a
number of conformant implementations of it for you to try out.

Gateway API v1.2 brings a number of new features to the _Standard channel_
(Gateway API's GA release channel), introduces some new experimental features,
and inaugurates our new release process — but it also brings two breaking
changes that you'll want to be careful of.

## Breaking changes

### GRPCRoute and ReferenceGrant `v1alpha2` removal

Now that the `v1` versions of GRPCRoute and ReferenceGrant have graduated to
Standard, the old `v1alpha2` versions have been removed from both the Standard
and Experimental channels, in order to ease the maintenance burden that
perpetually supporting the old versions would place on the Gateway API
community.

Before upgrading to Gateway API v1.2, you'll want to confirm that any
implementations of Gateway API have been upgraded to support the v1 API
version of these resources instead of the v1alpha2 API version. Note that even
if you've been using v1 in your YAML manifests, a controller may still be
using v1alpha2 which would cause it to fail during this upgrade. Additionally,
Kubernetes itself goes to some effort to stop you from removing a CRD version
that it thinks you're using: check out the [release notes] for more
information about what you need to do to safely upgrade.

[release notes]: https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.2.0

### Change to `.status.supportedFeatures` (experimental) {#status-supported-features}

A much smaller breaking change: `.status.supportedFeatures` in a Gateway is
now a list of objects instead of a list of strings. The objects have a single
`name` field, so the translation from the strings is straightforward, but
moving to objects permits a lot more flexibility for the future. This stanza
is not yet present in the Standard channel.

## Graduations to the standard channel

Gateway API 1.2.0 graduates four features to the Standard channel, meaning
that they can now be considered generally available. Inclusion in the Standard
release channel denotes a high level of confidence in the API surface and
provides guarantees of backward compatibility. Of course, as with any other
Kubernetes API, Standard channel features can continue to evolve with
backward-compatible additions over time, and we certainly expect further
refinements and improvements to these new features in the future. For more
information on how all of this works, refer to the [Gateway API Versioning
Policy](https://gateway-api.sigs.k8s.io/concepts/versioning/).

### HTTPRoute timeouts

[GEP-1742](https://gateway-api.sigs.k8s.io/geps/gep-1742/) introduced the
`timeouts` stanza into HTTPRoute, permitting configuring basic timeouts for
HTTP traffic. This is a simple but important feature for proper resilience
when handling HTTP traffic, and it is now Standard.

For example, this HTTPRoute configuration sets a timeout of 300ms for traffic
to the `/face` path:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: face-with-timeouts
  namespace: faces
spec:
  parentRefs:
    - name: my-gateway
      kind: Gateway
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /face
    backendRefs:
    - name: face
      port: 80
    timeouts:
      request: 300ms
```

For more information, check out the [HTTP routing] documentation. (Note that
this applies only to HTTPRoute timeouts. GRPCRoute timeouts are not yet part
of Gateway API.)

[HTTP routing]: https://gateway-api.sigs.k8s.io/guides/http-routing/

### Gateway infrastructure labels and annotations

Gateway API implementations are responsible for creating the backing
infrastructure needed to make each Gateway work. For example, implementations
running in a Kubernetes cluster often create Services and Deployments, while
cloud-based implementations may be creating cloud load balancer resources. In
many cases, it can be helpful to be able to propagate labels or annotations to
these generated resources.

In v1.2.0, the Gateway `infrastructure` stanza moves to the Standard channel,
allowing you to specify labels and annotations for the infrastructure created
by the Gateway API controller. For example, if your Gateway infrastructure is
running in-cluster, you can specify both Linkerd and Istio injection using the
following Gateway configuration, making it simpler for the infrastructure to
be incorporated into whichever service mesh you've installed:

```
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: meshed-gateway
  namespace: incoming
spec:
  gatewayClassName: meshed-gateway-class
  listeners:
  - name: http-listener
    protocol: HTTP
    port: 80
  infrastructure:
    labels:
      istio-injection: enabled
    annotations:
      linkerd.io/inject: enabled
```

For more information, check out the
[`infrastructure` API reference](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.GatewayInfrastructure).

### Backend protocol support

Since Kubernetes v1.20, the Service and EndpointSlice resources have supported
a stable `appProtocol`  field to allow users to specify the L7 protocol that
Service supports. With the adoption of
[KEP 3726](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/3726-standard-application-protocols),
Kubernetes now supports three new `appProtocol` values:

`kubernetes.io/h2c`
: HTTP/2 over cleartext as described in [RFC7540](https://www.rfc-editor.org/rfc/rfc7540)

`kubernetes.io/ws`
: WebSocket over cleartext as described in [RFC6445](https://www.rfc-editor.org/rfc/rfc6445)

`kubernetes.io/wss`
: WebSocket over TLS as described in [RFC6445](https://www.rfc-editor.org/rfc/rfc6445)

With Gateway API 1.2.0, support for honoring `appProtocol` is now Standard.
For example, given the following Service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: websocket-service
  namespace: my-namespace
spec:
  selector:
    app.kubernetes.io/name: websocket-app
  ports:
    - name: http
      port: 80
      targetPort: 9376
      protocol: TCP
      appProtocol: kubernetes.io/ws
```

then an HTTPRoute that includes this Service as a `backendRef` will
automatically upgrade the connection to use WebSockets rather than assuming
that the connection is pure HTTP.

For more information, check out
[GEP-1911](https://gateway-api.sigs.k8s.io/geps/gep-1911/).

## New additions to experimental channel

### Named rules for *Route resources

The `rules` field in HTTPRoute and GRPCRoute resources can now be named, in
order to make it easier to reference the specific rule, for example:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: multi-color-route
  namespace: faces
spec:
  parentRefs:
    - name: my-gateway
      kind: Gateway
      port: 80
  rules:
  - name: center-rule
    matches:
    - path:
        type: PathPrefix
        value: /color/center
    backendRefs:
    - name: color-center
      port: 80
  - name: edge-rule
    matches:
    - path:
        type: PathPrefix
        value: /color/edge
    backendRefs:
    - name: color-edge
      port: 80
```

Logging or status messages can now refer to these two rules as `center-rule`
or `edge-rule` instead of being forced to refer to them by index. For more
information, see [GEP-995](https://gateway-api.sigs.k8s.io/geps/gep-995/).

### HTTPRoute retry support

Gateway API 1.2.0 introduces experimental support for counted HTTPRoute
retries. For example, the following HTTPRoute configuration retries requests
to the `/face` path up to 3 times with a 500ms delay between retries:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: face-with-retries
  namespace: faces
spec:
  parentRefs:
    - name: my-gateway
      kind: Gateway
      port: 80
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /face
    backendRefs:
    - name: face
      port: 80
    retry:
      codes: [ 500, 502, 503, 504 ]
      attempts: 3
      backoff: 500ms
```

For more information, check out [GEP
1731](https://gateway-api.sigs.k8s.io/geps/gep-1731).

### HTTPRoute percentage-based mirroring

Gateway API has long supported the
[Request Mirroring](https://gateway-api.sigs.k8s.io/guides/http-request-mirroring/)
feature, which allows sending the same request to multiple backends. In
Gateway API 1.2.0, we're introducing percentage-based mirroring, which allows
you to specify a percentage of requests to mirror to a different backend. For
example, the following HTTPRoute configuration mirrors 42% of requests to the
`color-mirror` backend:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: color-mirror-route
  namespace: faces
spec:
  parentRefs:
  - name: mirror-gateway
  hostnames:
  - mirror.example
  rules:
  - backendRefs:
    - name: color
      port: 80
    filters:
    - type: RequestMirror
      requestMirror:
        backendRef:
          name: color-mirror
          port: 80
        percent: 42   # This value must be an integer.
```

There's also a `fraction` stanza which can be used in place of `percent`, to
allow for more precise control over exactly what amount of traffic is
mirrored, for example:

```yaml
    ...
    filters:
    - type: RequestMirror
      requestMirror:
        backendRef:
          name: color-mirror
          port: 80
        fraction:
          numerator: 1
          denominator: 10000
```

This configuration mirrors 1 in 10,000 requests to the `color-mirror` backend,
which may be relevant with very high request rates. For more details, see
[GEP-1731](https://gateway-api.sigs.k8s.io/geps/gep-3171).

### Additional backend TLS configuration

This release includes three additions related to TLS configuration for
communications between a Gateway and a workload (a _backend_):

1. **A new `backendTLS` field on Gateway**

   This new field allows you to specify the client certificate that a Gateway
   should use when connecting to backends.

2. **A new `subjectAltNames` field on BackendTLSPolicy**

   Previously, the `hostname` field was used to configure both the SNI that a
   Gateway should send to a backend _and_ the identity that should be provided
   by a certificate. When the new `subjectAltNames` field is specified, any
   certificate matching at least one of the specified SANs will be considered
   valid. This is particularly critical for SPIFFE where URI-based SANs may
   not be valid SNIs.

3. **A new `options` field on BackendTLSPolicy**

   Similar to the TLS options field on Gateway Listeners, we believe the same
   concept will be broadly useful for TLS-specific configuration for Backend
   TLS.

For more information, check out
[GEP-3135](https://gateway-api.sigs.k8s.io/geps/gep-3155).

## More changes

For a full list of the changes included in this release, please refer to the
[v1.2.0 release notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.2.0).

## Project updates

Beyond the technical, the v1.2 release also marks a few milestones in the life
of the Gateway API project itself.

### Release process improvements

Gateway API has never been intended to be a static API, and as more projects
use it as a component to build on, it's become clear that we need to bring
some more predictability to Gateway API releases. To that end, we're pleased -
and a little nervous! - to announce that we've formalized a new release
process:

- **Scoping** (4-6 weeks): maintainers and community determine the set of
  features we want to include in the release. A particular emphasis here is
  getting features _out_ of the Experimental channel — ideally this involves
  moving them to Standard, but it can also mean removing them.

- **GEP Iteration and Review** (5-7 weeks): contributors write or update
  Gateway Enhancement Proposals (GEPs) for features accepted into the release,
  with emphasis on getting consensus around the design and graduation criteria
  of the feature.

- **API Refinement and Documentation** (3-5 weeks): contributors implement the
  features in the Gateway API controllers and write the necessary
  documentation.

- **SIG Network Review and Release Candidates** (2-4 weeks): maintainers get
  the required upstream review, build release candidates, and release the new
  version.

Gateway API 1.2.0 was the first release to use the new process, and although
there are the usual rough edges of anything new, we believe that it went well.
We've already completed the Scoping phase for Gateway API 1.3, with the
release expected around the end of January 2025.

### `gwctl` moves out

The `gwctl` CLI tool has moved into its very own repository,
https://github.com/kubernetes-sigs/gwctl. `gwctl` has proven a valuable tool
for the Gateway API community; moving it into its own repository will, we
believe, make it easier to maintain and develop. As always, we welcome
contributions; while still experimental, `gwctl` already helps make working
with Gateway API a bit easier — especially for newcomers to the project!

### Maintainer changes

Rounding out our changes to the project itself, we're pleased to announce that
[Mattia Lavacca] has joined the ranks of Gateway API Maintainers! We're also
sad to announce that [Keith Mattix] has stepped down as a GAMMA lead —
happily, [Mike Morris] has returned to the role. We're grateful for everything
Keith has done, and excited to have Mattia and Mike on board.

[Mattia Lavacca]: https://github.com/mlavacca
[Keith Mattix]: https://github.com/keithmattix
[Mike Morris]: https://github.com/mikemorris

## Try it out

Unlike other Kubernetes APIs, you don't need to upgrade to the latest version of
Kubernetes to get the latest version of Gateway API. As long as you're running
Kubernetes 1.26 or later, you'll be able to get up and running with this
version of Gateway API.

To try out the API, follow our [Getting Started
Guide](https://gateway-api.sigs.k8s.io/guides/). As of this writing, five
implementations are already conformant with Gateway API v1.2. In alphabetical
order:

* [Cilium v1.17.0-pre.1](https://github.com/cilium/cilium), Experimental channel
* [Envoy Gateway v1.2.0-rc.1](https://github.com/envoyproxy/gateway), Experimental channel
* [Istio v1.24.0-alpha.0](https://istio.io), Experimental channel
* [Kong v3.2.0-244-gea4944bb0](https://github.com/kong/kubernetes-ingress-controller), Experimental channel
* [Traefik v3.2](https://traefik.io), Experimental channel

## Get involved

There are lots of opportunities to get involved and help define the future of
Kubernetes routing APIs for both ingress and service mesh.

* Check out the [user guides](https://gateway-api.sigs.k8s.io/guides) to see what use-cases can be addressed.
* Try out one of the [existing Gateway controllers](https://gateway-api.sigs.k8s.io/implementations/).
* Or [join us in the community](https://gateway-api.sigs.k8s.io/contributing/)
  and help us build the future of Gateway API together!

The maintainers would like to thank _everyone_ who's contributed to Gateway
API, whether in the form of commits to the repo, discussion, ideas, or general
support. We could never have gotten this far without the support of this
dedicated and active community.

## Related Kubernetes blog articles

* [Gateway API v1.1: Service mesh, GRPCRoute, and a whole lot more](https://kubernetes.io/blog/2024/05/09/gateway-api-v1-1/)
* [New Experimental Features in Gateway API v1.0](/blog/2023/11/28/gateway-api-ga/)
  11/2023
* [Gateway API v1.0: GA Release](/blog/2023/10/31/gateway-api-ga/)
  10/2023
* [Introducing ingress2gateway; Simplifying Upgrades to Gateway API](/blog/2023/10/25/introducing-ingress2gateway/)
  10/2023
* [Gateway API v0.8.0: Introducing Service Mesh Support](/blog/2023/08/29/gateway-api-v0-8/)
  08/2023
