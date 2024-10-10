---
layout: blog
title: "Gateway API v1.2: Protocols, Labels, and Timeouts, oh my!"
date: 2024-05-09T09:00:00-08:00
slug: gateway-api-v1-1
author: Gateway API Contributors
---

![Gateway API logo](gateway-api-logo.svg)

Kubernetes SIG Network is delighted to announce the v1.2 release of [Gateway
API](https://gateway-api.sigs.k8s.io/)! This release brings a number of new
features to the _Standard Channel_ (Gateway API's GA release channel),
introduces some new experimental features, and inaugurates our new release
process -- but it also brings two breaking changes that you'll want to be
careful of.

## BREAKING CHANGES

### GRPCRoute and ReferenceGrant `v1alpha2` Removal

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
that it thinks you're using: check out [the release notes] for more
information about what you need to do to safely upgrade.

[the release notes]: https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.2.0

### Experimental `Gateway.status.supportedFeatures`

A much smaller breaking change, `Gateway.status.supportedFeatures` is now a
list of objects instead of a list of strings. The objects have a single `name`
field, so the translation from the strings is straightforward, but moving to
objects permits a lot more flexibility for the future. This stanza is not yet
present in the Standard channel.

## Graduations to the Standard Channel

Gateway API 1.2.0 graduates four features to the Standard channel. This means
they are no longer experimental concepts; inclusion in the Standard release
channel denotes a high level of confidence in the API surface and provides
guarantees of backward compatibility. Of course, as with any other Kubernetes
API, Standard Channel features can continue to evolve with backward-compatible
additions over time, and we certainly expect further refinements and
improvements to these new features in the future. For more information on how
all of this works, refer to the [Gateway API Versioning
Policy](https://gateway-api.sigs.k8s.io/concepts/versioning/).

#### [HTTPRoute Timeouts](https://gateway-api.sigs.k8s.io/guides/http-routing/)

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
      port: 80
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

For more information, check out the [HTTP routing
documentation](https://gateway-api.sigs.k8s.io/guides/http-routing/). (Note
that this applies only to HTTPRoute timeouts. GRPCRoute timeouts are not yet
part of Gateway API.)

#### [Gateway Infrastructure Labels and Annotations](https://gateway-api.sigs.k8s.io/guides/grpc-routing/)

Gateway API for north-south traffic has always had the concept that declaring
a Gateway causes the backing infrastructure (for example, a Service and a
Deployment) to be created by the Gateway API controller. One complication with
this approach is that sometimes it's important to label or annotate the
infrastructure: for example, it's commonly necessary to use one of these
mechanisms to tell a service mesh to incorporate the Gateway infrastructure.

In 1.2.0, the Gateway `infrastructure` stanza moves to the Standard channel,
allowing you to specify labels and annotations for the infrastructure created
by the Gateway API controller. For example, the following Gateway
configuration specifies both Linkerd and Istio injection, allowing the Gateway
infrastructure to be incorporated into whichever service mesh you've
installed:

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

For more information, check out the [`infrastructure` API
reference](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.GatewayInfrastructure).

#### [Backend Protocol Support](https://gateway-api.sigs.k8s.io/geps/gep-1911/)

Since Kubernetes 1.20, the Service and EndpointSlice resources have supported
a stable `appProtocol`  field to allow users to specify the L7 protocol that
Service supports. With the adoption of [KEP
3726](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/3726-standard-application-protocols),
Kubernetes now supports three new `appProtocol` values:

- `kubernetes.io/h2c` - HTTP/2 over cleartext as described in
[RFC7540](https://www.rfc-editor.org/rfc/rfc7540)
- `kubernetes.io/ws` - WebSocket over cleartext as described in
[RFC6445](https://www.rfc-editor.org/rfc/rfc6445)
- `kubernetes.io/wss` - WebSocket over TLS as described in
[RFC6445](https://www.rfc-editor.org/rfc/rfc6445)

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

For more information, check out the
[GEP-1911](https://gateway-api.sigs.k8s.io/geps/gep-1911/).

### New additions to Experimental channel

#### [Named Rules for Route resources](https://gateway-api.sigs.k8s.io/geps/gep-995/)

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
or `edge-rule` instead of being forced to refer to them by index. At present,
rule names are only available for logging and status.

#### [HTTPRoute Retry Support](https://gateway-api.sigs.k8s.io/geps/gep-1731)

Gateway API 1.2.0 introduces experimental support for counted HTTPRoute retries. For example, the following HTTPRoute configuration retries requests to the `/face` path up to 3 times with a 500ms delay between retries:

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

For more information, check out the [GEP
1731](https://gateway-api.sigs.k8s.io/geps/gep-1731).

#### [HTTPRoute Percentage-Based Mirroring](https://gateway-api.sigs.k8s.io/geps/gep-3171)

Gateway API has long supported the [Request
Mirroring](https://gateway-api.sigs.k8s.io/guides/http-request-mirroring/)
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
        percent: 42
```

There's also a `fraction` stanza which can be used in place of `percent`, to allow for more fine-grained control over the mirroring percentage:

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
which may be relevant with very high request rates.

#### [BackendTLSPolicy Client Certificates](https://gateway-api.sigs.k8s.io/geps/gep-3155)

Last but not least for new experimental features, Gateway API 1.2.0 introduces
the ability to configure client certificates for backend connections, enabling
mutual TLS authentication. The following BackendTLSPolicy configuration
specifies a client certificate to use when connecting to the `color` backend:

```yaml
...needs work here...
```

### More Changes

For a full list of the changes included in this release, please refer to the
[v1.2.0 release notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.2.0).

## Project Updates

Beyond the technical, the 1.2 release also marks a few milestones in the life
of the Gateway API project itself.

### Release Process Improvements

Gateway API has never been intended to be a static API, and as more projects
use it as a component to build on, it's become clear that we need to bring
some more predictability to Gateway API releases. To that end, we're pleased -
and a little nervous! - to announce that we've formalized a new release
process:

- **Scoping** (4-6 weeks): maintainers and community determine the set of
  features we want to include in the release. A particular emphasis here is
  getting features _out_ of the Experimental channel -- ideally this involves
  moving them to Standard, but it can also mean removing them.

- **GEP Iteration and Review** (5-7 weeks): contributors write or update
  Gateway Enhancement Proposals (GEPs) for features accepted into the release,
  with emphasis on getting consensus around the design and graduation criteria
  of the feature.

- **API Refinement and Documentation** (3-5 weeks): contributors implement the
  features in the Gateway API controllers and write the necessary
  documentation.

- **SIG-Network Review and Release Candidates** (2-4 weeks): maintainers get
  the required upstream review, build release candidates, and release the new
  version.

Gateway API 1.2.0 is the first release to use the new process, and although
there are the usual rough edges of anything new, we believe that it went well.
To that end, we've just started the Scoping phase for Gateway API 1.3, which
will end on November 19, 2024, with the release expected around the end of
January 2025.

### `gwctl` Moves Out

The `gwctl` CLI tool has moved into its very own repository,
https://github.com/kubernetes-sigs/gwctl. `gwctl` has proven a valuable tool
for the Gateway API community; moving it into its own repository will, we
believe, make it easier to maintain and develop. As always, we welcome
contributions; `gwctl` makes quite a few things about Gateway API and
Kubernetes easier to manage.

### Maintainer Changes

Rounding out our changes to the project itself, we're pleased to announce that
[Mattia Lavacca] has joined the ranks of Gateway API Maintainers! We're also
sad to announce that [Keith Mattix] has stepped down as a GAMMA lead --
happily, [Mike Morris] has returned to the role. We're grateful for everything
Keith has done, and excited to have Mattia and Mike on board.

[Mattia Lavacca]: https://github.com/mlavacca
[Keith Mattix]: https://github.com/@keithmattix
[Mike Morris]: https://github.com/@mikemorris

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
