---
layout: blog
title: "Gateway API v1.3.0: Advancements in Request Mirroring, CORS, Gateway Merging, and Retry Budgets"
date: 2025-06-02T09:00:00-08:00
draft: false
slug: gateway-api-v1-3
author: >
  [Candace Holman](https://github.com/candita) (Red Hat)
---

![Gateway API logo](gateway-api-logo.svg)

Join us in the Kubernetes SIG Network community in celebrating the general
availability of [Gateway API](https://gateway-api.sigs.k8s.io/) v1.3.0! We are
also pleased to announce that there are already a number of conformant
implementations to try, made possible by postponing this blog
announcement. Version 1.3.0 of the API was released about a month ago on
April 24, 2025.

Gateway API v1.3.0 brings a new feature to the _Standard_ channel
(Gateway API's GA release channel): _percentage-based request mirroring_, and
introduces three new experimental features: cross-origin resource sharing (CORS)
filters, a standardized mechanism for listener and gateway merging, and retry
budgets.

Also see the full
[release notes](https://github.com/kubernetes-sigs/gateway-api/blob/54df0a899c1c5c845dd3a80f05dcfdf65576f03c/CHANGELOG/1.3-CHANGELOG.md)
and applaud the
[v1.3.0 release team](https://github.com/kubernetes-sigs/gateway-api/blob/54df0a899c1c5c845dd3a80f05dcfdf65576f03c/CHANGELOG/1.3-TEAM.md)
next time you see them.

## Graduation to Standard channel

Graduation to the Standard channel is a notable achievement for Gateway API
features, as inclusion in the Standard release channel denotes a high level of
confidence in the API surface and provides guarantees of backward compatibility.
Of course, as with any other Kubernetes API, Standard channel features can continue
to evolve with backward-compatible additions over time, and we (SIG Network)
certainly expect
further refinements and improvements in the future. For more information on how
all of this works, refer to the [Gateway API Versioning Policy](https://gateway-api.sigs.k8s.io/concepts/versioning/).

### Percentage-based request mirroring
Leads: [Lior Lieberman](https://github.com/LiorLieberman),[Jake Bennert](https://github.com/jakebennert)

GEP-3171: [Percentage-Based Request Mirroring](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-3171/index.md)

_Percentage-based request mirroring_ is an enhancement to the
existing support for [HTTP request mirroring](https://gateway-api.sigs.k8s.io/guides/http-request-mirroring/), which allows HTTP requests to be duplicated to another backend using the
RequestMirror filter type.  Request mirroring is particularly useful in
blue-green deployment. It can be used to assess the impact of request scaling on
application performance without impacting responses to clients.

The previous mirroring capability worked on all the requests to a `backendRef`.  
Percentage-based request mirroring allows users to specify a subset of requests
they want to be mirrored, either by percentage or fraction. This can be
particularly useful when services are receiving a large volume of requests.
Instead of mirroring all of those requests, this new feature can be used to
mirror a smaller subset of them.

Here's an example with 42% of the requests to "foo-v1" being mirrored to "foo-v2":

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: http-filter-mirror
  labels:
    gateway: mirror-gateway
spec:
  parentRefs:
  - name: mirror-gateway
  hostnames:
  - mirror.example
  rules:
  - backendRefs:
    - name: foo-v1
      port: 8080
    filters:
    - type: RequestMirror
      requestMirror:
        backendRef:
          name: foo-v2
          port: 8080
        percent: 42 # This value must be an integer.
```
You can also configure the partial mirroring using a fraction. Here is an example
with 5 out of every 1000 requests to "foo-v1" being mirrored to "foo-v2".

```yaml
  rules:
  - backendRefs:
    - name: foo-v1
      port: 8080
    filters:
    - type: RequestMirror
      requestMirror:
        backendRef:
          name: foo-v2
          port: 8080
        fraction:
          numerator: 5
          denominator: 1000
```

## Additions to Experimental channel

The Experimental channel is Gateway API's channel for experimenting with new
features and gaining confidence with them before allowing them to graduate to
standard.  Please note: the experimental channel may include features that are
changed or removed later.

Starting in release v1.3.0, in an effort to distinguish Experimental channel
resources from Standard channel resources, any new experimental API kinds have the
prefix "**X**".  For the same reason, experimental resources are now added to the
API group `gateway.networking.x-k8s.io` instead of `gateway.networking.k8s.io`. 
Bear in mind that using new experimental channel resources means they can coexist
with standard channel resources, but migrating these resources to the standard
channel will require recreating them with the standard channel names and API
group (both of which lack the "x-k8s" designator or "X" prefix).

The v1.3 release introduces two new experimental API kinds: XBackendTrafficPolicy
and XListenerSet.  To be able to use experimental API kinds, you need to install
the Experimental channel Gateway API YAMLs from the locations listed below.

### CORS filtering
Leads: [Liang Li](https://github.com/liangli), [Eyal Pazz](https://github.com/EyalPazz), [Rob Scott](https://github.com/robscott)

GEP-1767: [CORS Filter](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-1767/index.md)

Cross-origin resource sharing (CORS) is an HTTP-header based mechanism that allows
a web page to access restricted resources from a server on an origin (domain,
scheme, or port) different from the domain that served the web page. This feature
adds a new HTTPRoute `filter` type, called "CORS", to configure the handling of
cross-origin requests before the response is sent back to the client.

To be able to use experimental CORS filtering, you need to install the
[Experimental channel Gateway API HTTPRoute yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.k8s.io_httproutes.yaml).

Here's an example of a simple cross-origin configuration:
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: http-route-cors
spec:
  parentRefs:
  - name: http-gateway
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /resource/foo
    filters:
    - cors:
      - type: CORS
        allowOrigins:
        - *
        allowMethods: 
        - GET
        - HEAD
        - POST
        allowHeaders: 
        - Accept
        - Accept-Language
        - Content-Language
        - Content-Type
        - Range
    backendRefs:
    - kind: Service
      name: http-route-cors
      port: 80
```
In this case, the Gateway returns an _origin header_ of "*", which means that the
requested resource can be referenced from any origin, a _methods header_
(`Access-Control-Allow-Methods`) that permits the `GET`, `HEAD`, and `POST`
verbs, and a _headers header_ allowing `Accept`, `Accept-Language`,
`Content-Language`, `Content-Type`, and `Range`.

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, POST
Access-Control-Allow-Headers: Accept,Accept-Language,Content-Language,Content-Type,Range
```     
The complete list of fields in the new CORS filter:
* `allowOrigins`
* `allowMethods`
* `allowHeaders`
* `allowCredentials`
* `exposeHeaders`
* `maxAge`

See [CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol) for details.

### XListenerSets (standardized mechanism for Listener and Gateway merging){#XListenerSet}
Lead: [Dave Protasowski](https://github.com/dprotaso)

GEP-1713: [ListenerSets - Standard Mechanism to Merge Multiple Gateways](https://github.com/kubernetes-sigs/gateway-api/pull/3213)

This release adds a new experimental API kind, XListenerSet, that allows a
shared list of _listeners_ to be attached to one or more parent Gateway(s).  In
addition, it expands upon the existing suggestion that Gateway API implementations
may merge configuration from multiple Gateway objects.  It also:

- adds a new field `allowedListeners` to the `.spec` of a Gateway. The
`allowedListeners` field defines from which Namespaces to select XListenerSets
that are allowed to attach to that Gateway: Same, All, None, or Selector based.
- increases the previous maximum number (64) of listeners with the addition of
XListenerSets.
- allows the delegation of listener configuration, such as TLS, to applications in
other namespaces.

To be able to use experimental XListenerSet, you need to install the
[Experimental channel Gateway API XListenerSet yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.x-k8s.io_xlistenersets.yaml).

The following example shows a Gateway with an HTTP listener and two child HTTPS
XListenerSets with unique hostnames and certificates.  The combined set of listeners
attached to the Gateway includes the two additional HTTPS listeners in the
XListenerSets that attach to the Gateway.  This example illustrates the
delegation of listener TLS config to application owners in different namespaces
("store" and "app").  The HTTPRoute has both the Gateway listener named "foo" and
one XListenerSet listener named "second" as `parentRefs`.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: prod-external
  namespace: infra
spec:
  gatewayClassName: example
  allowedListeners:
  - from: All
  listeners:
  - name: foo
    hostname: foo.com
    protocol: HTTP
    port: 80
---
apiVersion: gateway.networking.x-k8s.io/v1alpha1
kind: XListenerSet
metadata:
  name: store
  namespace: store
spec:
  parentRef:
    name: prod-external
  listeners:
  - name: first
    hostname: first.foo.com
    protocol: HTTPS
    port: 443
    tls:
      mode: Terminate
      certificateRefs:
      - kind: Secret
        group: ""
        name: first-workload-cert
---
apiVersion: gateway.networking.x-k8s.io/v1alpha1
kind: XListenerSet
metadata:
  name: app
  namespace: app
spec:
  parentRef:
    name: prod-external
  listeners:
  - name: second
    hostname: second.foo.com
    protocol: HTTPS
    port: 443
    tls:
      mode: Terminate
      certificateRefs:
      - kind: Secret
        group: ""
        name: second-workload-cert
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: httproute-example
spec:
  parentRefs:
  - name: app
    kind: XListenerSet
    sectionName: second
  - name: parent-gateway
    kind: Gateway
    sectionName: foo
    ...
```
Each listener in a Gateway must have a unique combination of `port`, `protocol`,
(and `hostname` if supported by the protocol) in order for all listeners to be
**compatible** and not conflicted over which traffic they should receive.

Furthermore, implementations can _merge_ separate Gateways into a single set of
listener addresses if all listeners across those Gateways are compatible.  The
management of merged listeners was under-specified in releases prior to v1.3.0.

With the new feature, the specification on merging is expanded.  Implementations
must treat the parent Gateways as having the merged list of all listeners from
itself and from attached XListenerSets, and validation of this list of listeners
must behave the same as if the list were part of a single Gateway. Within a single
Gateway, listeners are ordered using the following precedence:

1. Single Listeners (not a part of an XListenerSet) first,
2. Remaining listeners ordered by:
   - object creation time (oldest first), and if two listeners are defined in
   objects that have the same timestamp, then
   - alphabetically based on "{namespace}/{name of listener}"

### Retry budgets (XBackendTrafficPolicy) {#XBackendTrafficPolicy}
Leads: [Eric Bishop](https://github.com/ericdbishop), [Mike Morris](https://github.com/mikemorris)

GEP-3388: [Retry Budgets](https://gateway-api.sigs.k8s.io/geps/gep-3388)

This feature allows you to configure a _retry budget_ across all endpoints
of a destination Service.  This is used to limit additional client-side retries
after reaching a configured threshold. When configuring the budget, the maximum 
percentage of active requests that may consist of retries may be specified, as well as 
the interval over which requests will be considered when calculating the threshold 
for retries. The development of this specification changed the existing
experimental API kind BackendLBPolicy into a new experimental API kind,
XBackendTrafficPolicy, in the interest of reducing the proliferation of policy
resources that had commonalities.

To be able to use experimental retry budgets, you need to install the
[Experimental channel Gateway API XBackendTrafficPolicy yaml](https://github.com/kubernetes-sigs/gateway-api/blob/main/config/crd/experimental/gateway.networking.x-k8s.io_xbackendtrafficpolicies.yaml).

The following example shows an XBackendTrafficPolicy that applies a
`retryConstraint` that represents a budget that limits the retries to a maximum
of 20% of requests, over a duration of 10 seconds, and to a minimum of 3 retries
over 1 second.

```yaml
apiVersion: gateway.networking.x-k8s.io/v1alpha1
kind: XBackendTrafficPolicy
metadata:
  name: traffic-policy-example
spec:
  retryConstraint:
    budget: 
        percent: 20
        interval: 10s
    minRetryRate:
      count: 3
      interval: 1s
    ...
```

## Try it out

Unlike other Kubernetes APIs, you don't need to upgrade to the latest version of
Kubernetes to get the latest version of Gateway API. As long as you're running
Kubernetes 1.26 or later, you'll be able to get up and running with this version
of Gateway API.

To try out the API, follow the [Getting Started Guide](https://gateway-api.sigs.k8s.io/guides/).
As of this writing, four implementations are already conformant with Gateway API
v1.3 experimental channel features. In alphabetical order:

- [Airlock Microgateway 4.6](https://github.com/airlock/microgateway/releases/tag/4.6.0)
- [Cilium main](https://github.com/cilium/cilium)
- [Envoy Gateway v1.4.0](https://github.com/envoyproxy/gateway/releases/tag/v1.4.0)
- [Istio 1.27-dev](https://istio.io)

## Get involved

Wondering when a feature will be added?  There are lots of opportunities to get
involved and help define the future of Kubernetes routing APIs for both ingress
and service mesh.

* Check out the [user guides](https://gateway-api.sigs.k8s.io/guides) to see what use-cases can be addressed.
* Try out one of the [existing Gateway controllers](https://gateway-api.sigs.k8s.io/implementations/).
* Or [join us in the community](https://gateway-api.sigs.k8s.io/contributing/)
and help us build the future of Gateway API together!

The maintainers would like to thank _everyone_ who's contributed to Gateway
API, whether in the form of commits to the repo, discussion, ideas, or general
support. We could never have made this kind of progress without the support of
this dedicated and active community.

## Related Kubernetes blog articles

* [Gateway API v1.2: WebSockets, Timeouts, Retries, and More](/blog/2024/11/21/gateway-api-v1-2/)
  (November 2024)
* [Gateway API v1.1: Service mesh, GRPCRoute, and a whole lot more](/blog/2024/05/09/gateway-api-v1-1/)
  (May 2024)
* [New Experimental Features in Gateway API v1.0](/blog/2023/11/28/gateway-api-ga/)
  (November 2023)
* [Gateway API v1.0: GA Release](/blog/2023/10/31/gateway-api-ga/)
  (October 2023)
