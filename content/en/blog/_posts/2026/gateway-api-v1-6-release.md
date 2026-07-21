---
layout: blog
title: "Gateway API v1.6: TCPRoute and UDPRoute Graduate to Standard"
draft: true # will be changed to date: 2026-07-30 before publication
slug: gateway-api-v1-6
author: >
  [Beka Modebadze](https://github.com/bexxmodd) (Google),
  [Ricardo Katz](https://github.com/rikatz) (Red Hat)
---

![logo](gateway-api-v1-5/gateway-api-logo.svg)

The Kubernetes SIG Network community is thrilled to announce the release of **Gateway API v1.6.0**!

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
  namespace: infra
spec:
  gatewayClassName: example-gateway-class
  allowedListeners:
    namespaces:
      from: All
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
  namespace: infra
spec:
  gatewayClassName: example-gateway-class
  allowedListeners:
    namespaces:
      from: All
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

## Experimental resources move off the standard API group

Previously, experimental resources shared the same API group as standard ones - `gateway.networking.k8s.io` - distinguished only by a `v1alpha2`-style version. TCPRoute and UDPRoute were the last resources to graduate under that scheme.

Going forward, new experimental resources are defined in a separate group,
`gateway.networking.x-k8s.io`,
and the names of their API types get an `X` prefix - for example XBackend, XBackendTrafficPolicy, and XMesh.
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
- View the [v1.6.0 Release Notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.6.1) for complete details on the CRD installation and changes.

Gateway API relies on an extensive conformance test suite to ensure consistent,
portable behavior across all implementations.
At the time of release, the following implementations had already submitted conformance reports
for Gateway API v1.6:

- [Agentgateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/agentgateway-agentgateway)
- [Airlock Microgateway](https://github.com/kubernetes-sigs/gateway-api/tree/main/conformance/reports/v1.6/airlock-microgateway)

### Get involved

Gateway API is an open, community-driven project built under Kubernetes SIG Network. We welcome contributions, feedback, and participation from everyone!

- **Join our Slack Channel**: Join `#sig-network-gateway-api` on the [Kubernetes Slack](https://slack.k8s.io/).
- **Attend Community Meetings**: We hold weekly community meetings. Check out the [SIG Network Calendar](https://github.com/kubernetes/community/tree/master/sig-network) for dates and agendas.
- **Contribute on GitHub**: File issues, suggest enhancements (GEPs), or submit PRs at [kubernetes-sigs/gateway-api](https://github.com/kubernetes-sigs/gateway-api).

### Acknowledgments

A huge thank you to all the contributors, reviewers, maintainers, and implementation authors whose hard work made Gateway API v1.6.0 possible!

[TCPRoute]: https://gateway-api.sigs.k8s.io/api-types/tcproute/
[UDPRoute]: https://gateway-api.sigs.k8s.io/api-types/udproute/
