---
layout: blog
title: "Gateway API v1.3.0: Advancements in Request Mirroring, CORS, Gateway Merging, and Retry Budgets"
date: 2025-05-22T09:00:00-08:00
slug: gateway-api-v1-3
author: Gateway API Contributors
---

{{< figure src="gateway-api-logo.svg" alt="Gateway API logo" >}}

Join us in the Kubernetes SIG Network community in celebrating the general
availability of [Gateway API](https://gateway-api.sigs.k8s.io/) v1.3.0! This
version of the API was released on April 24, 2025, and there are already a number
of conformant implementations to try out.

Gateway API v1.3.0 brings a new feature to the _Standard channel_
(Gateway API's GA release channel): percentage-based request mirroring, and
introduces three new experimental features: cross-origin resource sharing (CORS)
filters, a standard mechanism for listener and gateway merging, and retry budgets.

## Graduation to Standard Channel:

Graduation to Standard Channel is a notable achievement for Gateway API
features, as inclusion in the Standard release channel denotes a high level of
confidence in the API surface and provides guarantees of backward compatibility.
Of course, as with any other Kubernetes API, Standard Channel features can continue
to evolve with backward-compatible additions over time, and we certainly expect
further refinements and improvements in the future. For more information on how
all of this works, refer to the [Gateway API Versioning Policy](https://gateway-api.sigs.k8s.io/concepts/versioning/).

### Percentage-Based Request Mirroring :tada:
Leads: [Lior Lieberman](https://github.com/LiorLieberman),[Jake Bennert](https://github.com/jakebennert)

GEP-3171: [Percentage-Based Request Mirroring](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-3171/index.md)

Percentage-Based Request Mirroring is an enhancement to the
[HTTP Request Mirroring](https://gateway-api.sigs.k8s.io/guides/http-request-mirroring/)
feature, which allows HTTP requests to be duplicated to another backend using the
`RequestMirror` filter type.  Request mirroring is particularly useful in
blue-green deployment. It can be used to assess the impact of request scaling on
application performance without impacting responses to clients.

The previous mirroring capability worked on all the requests to a `backendRef`.  
Percentage-Based Request Mirroring allows users to specify a percentage of requests
they want to be mirrored.

Here's an example with 42% of the requests to `foo-v1` being mirrored to `foo-v2`:

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
The percentage can also be expressed using a fraction.  This shows an example
with 5 out of every 1000 requests to `foo-v1` being mirrored to `foo-v2`.

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

## Additions to Experimental Channel:
#### Experimental Channel Additions and Changes

The experimental channel is Gateway API's channel for experimenting with new
features and gaining confidence with them before allowing them to graduate to
standard.  Please note: the experimental channel may include features that are
changed or removed later.

Starting in release v1.3.0, in an effort to distinguish experimental channel
resources from standard channel resources, new experimental resources have the
prefix "**X**".  For the same reason, experimental resources are now added to the
object group `gateway.networking.x-k8s.io` instead of `gateway.networking.k8s.io`. 
Bear in mind that using new experimental channel resources means they can coexist
with standard channel resources, but migrating these resources to the standard
channel will require recreating them with the standard channel names and API
Group (both of which lack the "x" prefix).

This release introduces two new experimental resources: `XBackendTrafficPolicy`
and `XListenerSet`.

### CORS Filter
Leads: [Liang Li](https://github.com/liangli), [Eyal Pazz](https://github.com/EyalPazz), [Rob Scott](https://github.com/robscott)

GEP-1767: [CORS Filter](https://github.com/kubernetes-sigs/gateway-api/blob/main/geps/gep-1767/index.md)

Cross-origin resource sharing (CORS) is an HTTP-header based mechanism that allows
a web page to access restricted resources from a server on an origin (domain,
scheme, or port) different from the domain that served the web page. This feature
adds a new `HTTPRouteFilter` called `HTTPCORSFilter` to configure the handling of
cross-origin requests before the response is sent back to the client.

Here's an example of a simple cross-origin configuration:
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: http-route-cors
spec:
  hostnames:
  - http.route.cors.com
  parentRefs:
  - group: gateway.networking.k8s.io
    kind: Gateway
    name: http-gateway
  rules:
  - backendRefs:
    - kind: Service
      name: http-route-cors
      port: 80
    matches:
    - path:
        type: PathPrefix
        value: /resource/foo
    filters:
    - cors:
      - allowOrigins:
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
      type: CORS
```
In this case, the `Gateway` returns an origin header of "*", which means that the
requested resource can be accessed from any `Origin`, a methods header consisting
of `GET`, `HEAD`, and `POST`, and a headers header of `Accept`, `Accept-Language`,
`Content-Language`, `Content-Type`, and `Range`.

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, POST
Access-Control-Allow-Headers: Accept,Accept-Language,Content-Language,Content-Type,Range
```     
The complete list of fields in the new CORS filter:
* AllowOrigins
* AllowMethods
* AllowHeaders
* AllowCredentials
* ExposeHeaders
* MaxAge

See [CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol) for details.

### XListenerSets (Standard Mechanism for Listener  and Gateway Merging)
Lead: [Dave Protasowski](https://github.com/dprotaso)

GEP-1713: [ListenerSets - Standard Mechanism to Merge Multiple Gateways](https://github.com/kubernetes-sigs/gateway-api/pull/3213)

This feature adds a new experimental resource called `XListenerSet` to allow a
shared list of Listeners to be attached to one or more parent Gateway(s).  In
addition, it expands upon the current suggestion that implementations may merge
`Gateway` resources.  It also:

- adds new field `AllowedListeners` to `GatewaySpec`. `AllowedListeners` defines
from which namespaces to select XListenerSets that are allowed to attach to that
`Gateway` (Same, All, None, or Selector based)
- renames the `Listener` resource to `ListenerEntry`
- re-types the `Port` resource to allow for dynamic port assignment
- adds a new `Gateway` condition type `AttachedListenerSets`
- provides for xRoute `parentRefs` to contain both `XListenerSet` and `Gateway`

The following example shows a `Gateway` with an HTTP listener and two child HTTPS
XListenerSets with unique hostnames and certificates.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: parent-gateway
  namespace: parent-listener
spec:
  gatewayClassName: example
  allowedListeners:
  - from: Same
  listeners:
  - name: foo
    hostname: foo.com
    protocol: HTTP
    port: 80
---
apiVersion: gateway.networking.x-k8s.io/v1alpha1
kind: XListenerSet
metadata:
  name: first-workload-listeners
  namespace: parent-listener
spec:
  parentRef:
    name: parent-gateway
    kind: Gateway
    group: gateway.networking.k8s.io
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
  name: second-workload-listeners
  namespace: parent-listener
spec:
  parentRef:
    name: parent-gateway
    kind: Gateway
    group: gateway.networking.k8s.io
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
  - name: second-workload-listeners
    kind: XListenerSet
    sectionName: second
  - name: parent-gateway
    kind: Gateway
    sectionName: foo
    ...
```
Each Listener in a `Gateway` must have a unique combination of Port, Protocol,
(and Hostname if supported by the protocol) in order for all Listeners to be
*compatible* and not conflicted over which traffic they should receive.  
Furthermore, implementations can *merge* separate Gateways into a single set of
Listener addresses if all Listeners across all Gateways are compatible.  The
management of merged Listeners is under-specified in releases prior to v1.3.0.

With this feature, the specification on merging is expanded.  Implementations
must treat the parent Gateways as having the merged list of all listeners from
itself and from attached XListenerSets, and validation of this list of listeners
must behave the same as if the list were part of a single `Gateway`. Within a single
Gateway, Listeners will then be ordered using the following precedence:

1. Single Listeners (not a part of an `XListenerSet`) first, followed by
1. Listeners ordered by creation time (oldest first), followed by
1. Listeners ordered alphabetically by “namespace/name”

### XBackendTrafficPolicy (Retry Budgets)
Leads: [Eric Bishop](https://github.com/ericbishop), [Mike Morris](https://github.com/mikemorris)

GEP-3388: [Retry Budgets](https://gateway-api.sigs.k8s.io/geps/gep-3388)

This feature specifies the configuration of a "retry budget" across all endpoints
of a destination service.  This is used to limit additional client-side retries
after reaching a configured threshold. The budget can be configured using a
maximum percentage of active requests, or an interval during which requests will
be considered. The development of this specification changed the existing
experimental field `BackendLBPolicy` into `XBackendTrafficPolicy` in the interest
of reducing the proliferation of policy resources that had commonalities.

The following example shows an `XBackendTrafficPolicy` that applies a
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

To try out the API, follow our [Getting Started Guide](https://gateway-api.sigs.k8s.io/guides/).
As of this writing, two implementations are already conformant with Gateway API
v1.3. In alphabetical order:

- [Cilium](https://github.com/cilium/cilium), Experimental channel
- [Istio](https://istio.io), Experimental channel

## Get involved

Wondering when a feature will be added?  There are lots of opportunities to get
involved and help define the future of Kubernetes routing APIs for both ingress
and service mesh.

* Check out the [user guides](https://gateway-api.sigs.k8s.io/guides) to see what
use-cases can be addressed.
* Try out one of the [existing Gateway controllers](https://gateway-api.sigs.k8s.io/implementations/).
* Or [join us in the community](https://gateway-api.sigs.k8s.io/contributing/)
and help us build the future of Gateway API together!

The maintainers would like to thank _everyone_ who's contributed to Gateway
API, whether in the form of commits to the repo, discussion, ideas, or general
support. We could never have made this kind of progress without the support of
this dedicated and active community.

## Related Kubernetes blog articles

* [Gateway API v1.2: WebSockets, Timeouts, Retries, and More](https://kubernetes.io/blog/2024/11/21/gateway-api-v1-2/)
  11/2024
* [Gateway API v1.1: Service mesh, GRPCRoute, and a whole lot more](https://kubernetes.io/blog/2024/05/09/gateway-api-v1-1/)
  05/2024
* [New Experimental Features in Gateway API v1.0](https://kubernetes.io/blog/2023/11/28/gateway-api-ga/)
  11/2023
* [Gateway API v1.0: GA Release](https://kubernetes.io/blog/2023/10/31/gateway-api-ga/)
  10/2023
