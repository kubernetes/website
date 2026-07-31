---
layout: blog
title: "Gateway API v1.6: TCPRoute and UDPRoute Graduate to Standard"
date: 2026-07-31
slug: gateway-api-v1-6-release
author: >
  [Beka Modebadze](https://github.com/bexxmodd) (Google),
  [Ricardo Katz](https://github.com/rikatz) (Red Hat)
---

![Gateway API logo](gateway-api-logo.svg)

The Kubernetes SIG Network community is thrilled to share the release of **Gateway API v1.6.0**, which was released on June 30th of this year!

Gateway API has become the standard for modern, role-oriented,
and expressive service networking in Kubernetes.
In previous releases, Gateway API established a production-grade foundation
for HTTP and TLS layer 7 traffic.
With version 1.6.0, Gateway API takes a major step forward by expanding
standard layer 4 protocol routing and introducing cleaner API boundaries for experimental innovation.

Here is a quick summary of what's new in Gateway API v1.6.0:

- **TCPRoute and UDPRoute Graduate to Standard**: Raw L4 TCP and UDP traffic routing reach GA stability in the `v1` API version.
- **Experimental API Group Separation**: Experimental resources transition to a distinct API group (`gateway.networking.x-k8s.io`) with an `X` prefix to make experimental vs. standard boundaries crystal clear.

Let's dive into the details!


## TCPRoute and UDPRoute graduate to Standard

Leads: [Nick Young](https://github.com/youngnick), [Ricardo Katz](https://github.com/rikatz) and [Zac Nixon](https://github.com/zac-nixon)

* [GEP-2644 - TCPRoute](https://gateway-api.sigs.k8s.io/geps/gep-2644/)
* [GEP-2645 - UDPRoute](https://gateway-api.sigs.k8s.io/geps/gep-2645/)

Until now, Gateway API only offered a stable routing model for HTTP and TLS traffic.
Workloads that speak a raw protocol over TCP or UDP - databases,
DNS, VoIP, gaming, IoT telemetry - had no portable way to plug
into a Gateway. Users either fell back to a plain Kubernetes Service,
or to an implementation-specific CRD that doesn't travel between Gateway controllers.

[TCPRoute] and [UDPRoute] close that gap: they route traffic to backends based on protocol and port alone, no L7 awareness required.
With this release, both have graduated from the Experimental channel to Standard, and moved to the `v1` API version.
The `v1alpha2` version of each was deprecated as of the v1.6 release, and will be removed in a future release.

### How it works

A Gateway needs a listener that allows TCPRoute attachment:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-gateway-class
  listeners:
    - name: foo
      protocol: TCP
      port: 12345
      allowedRoutes:
        kinds:
          - kind: TCPRoute
```

A TCPRoute then attaches to that listener and forwards traffic to a backend:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: TCPRoute
metadata:
  name: tcp-app
spec:
  parentRefs:
    - name: example-gateway
      sectionName: foo
  rules:
    - backendRefs:
        - name: my-foo-service
          port: 6000
```

Traffic arriving on the Gateway's port `12345` is proxied to the endpoints of `my-foo-service` on port `6000`. Omitting `sectionName` and `port` from `parentRefs` attaches the route to every TCP listener on the Gateway instead of a single one.

UDPRoute follows the same pattern; swap the listener protocol and the route kind:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-gateway-class
  listeners:
    - name: foo
      protocol: UDP
      port: 12345
      allowedRoutes:
        kinds:
          - kind: UDPRoute
---
apiVersion: gateway.networking.k8s.io/v1
kind: UDPRoute
metadata:
  name: udp-app
spec:
  parentRefs:
    - name: example-gateway
      sectionName: foo
  rules:
    - backendRefs:
        - name: my-foo-service
          port: 6000
```

## XBackend arrives in Experimental

Leads: [Keith Mattix II](https://github.com/keithmattix) 

* [GEP-4894 - Backend Resource](https://github.com/kubernetes-sigs/gateway-api/issues/4894)

Gateway API v1.6 introduces the new `XBackend` resource, which is a general-purpose decorator for Service (and other backend types) within Gateway API.

The Service resource is an amazing, stable, and flexible object, but that comes with some costs: The flexibility creates a lot of edge cases that Gateway API needs to handle, and the stability makes it impossible to add new concepts to Service.

The XBackend resource builds on the ideas in the upstream [`EndpointSelector` KEP](https://github.com/kubernetes/enhancements/issues/6116), to add a Gateway API-native object that still targets the backend app, while allowing the community to extend it to handle use cases that are difficult or dangerous to handle with Service.

The first version of XBackend includes support for ExternalHostname destinations, which are ruled out from Service support in Gateway API because of the possibility of confused deputy attacks.

For XBackend, this support is an Extended/Optional feature, allowing implementations and users to opt in once they understand the security tradeoffs.

This support is very useful for egress use cases (which are most commonly used for cluster-hosted agentic workloads), which the community is also working towards formalizing in GEPs about Gateways for Egress (work in progress, stay tuned!)

**The XBackend API is experimental and its behavior can change, do not assume it is ready for production**

An example of a Gateway with an ExternalName backend that can be used for egress to a cloud AI API is as follows:

```yaml

# Gateway-level TLS remains authoritative for incoming connections
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
spec:
  listeners:
  - name: https
    protocol: HTTPS
    tls:
      certificateRefs:
      - name: gateway-cert
---
# Backend resource for external destination
apiVersion: gateway.networking.x-k8s.io/v1alpha1
kind: XBackend
metadata:
  name: ai-provider-api
  namespace: ai-apps
spec:
  type: ExternalHostname
  externalHostname:
    hostname: api.ai-provider.com

---
# HTTPRoute referencing XBackend
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
spec:
  rules:
  - backendRefs:
    - name: ai-provider-api
      kind: XBackend
      group: gateway.networking.x-k8s.io
```

The community is also working on moving Session Persistence config from `XBackendTrafficPolicy` into `XBackend`, along with other use cases like retries, TLS origination and similar config that is useful to be able to configure per-application rather than per-Route.

## Experimental resources move off the standard API group

Previously, experimental resources shared the same API group as standard ones - `gateway.networking.k8s.io` - distinguished only by a `v1alpha2`-style version. TCPRoute and UDPRoute were the last resources to graduate under that scheme.

Going forward, new experimental resources are defined in a separate group,
`gateway.networking.x-k8s.io`,
and the names of their API types get an `X` prefix - for example XBackend and XMesh.
When one of these graduates to Standard, it's renamed into the `gateway.networking.k8s.io` group
and drops the `X` prefix, the same way XMesh is expected to become Mesh.

This separation makes the experimental/standard boundary explicit at the API group level, rather than relying on version strings alone.


## What's next & getting involved

The graduation of TCPRoute and UDPRoute to Standard marks an essential milestone
in making Gateway API a complete, universal ingress and mesh networking API
for Kubernetes workloads across layer 4 and layer 7 protocols.

### Try it out

You can start using Gateway API v1.6.0 today with your favorite Gateway controller implementation:

- Check out the [Gateway API Documentation](https://gateway-api.sigs.k8s.io/) for detailed guides and API references.
- View the [v1.6.0 Release Notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.6.0) for complete details on the CRD installation and changes.

Gateway API relies on an extensive conformance test suite to ensure consistent,
portable behavior across all implementations.
Here is a list of the implementations that are conforment with v1.6 on the day we published the article:

- [Agentgateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/agentgateway-agentgateway)
- [Airlock Microgateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/airlock-microgateway)
- [GKE Gateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/gke-gateway)
- [kgateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/kgateway)
- [NGINX Gateway Fabric](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/nginx-nginx-gateway-fabric)

### Get involved

Gateway API is an open, community-driven project built under Kubernetes SIG Network. We welcome contributions, feedback, and participation from everyone!

- **Join our Slack Channel**: Join `#sig-network-gateway-api` on the [Kubernetes Slack](https://slack.k8s.io/).
- **Attend Community Meetings**: We hold weekly community meetings. Check out the [SIG Network Calendar](https://www.kubernetes.dev/community/community-groups/sigs/network/) for dates and agendas.
- **Contribute on GitHub**: File issues, suggest enhancements (GEPs), or submit PRs at [kubernetes-sigs/gateway-api](https://github.com/kubernetes-sigs/gateway-api).

### Acknowledgments

A huge thank you to all the contributors, reviewers, maintainers, and implementation authors whose hard work made Gateway API v1.6.0 possible!

[TCPRoute]: https://gateway-api.sigs.k8s.io/guides/user-guides/tcp/
[UDPRoute]: https://gateway-api.sigs.k8s.io/guides/user-guides/udp/
