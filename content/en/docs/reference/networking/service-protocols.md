---
title: Protocols for Services
content_type: reference
weight: 10
---

<!-- overview -->
If you configure a {{< glossary_tooltip text="Service" term_id="service" >}},
you can select from any network protocol that Kubernetes supports.

Kubernetes supports the following protocols with Services:

- [`SCTP`](#protocol-sctp)
- [`TCP`](#protocol-tcp) _(the default)_
- [`UDP`](#protocol-udp)

When you define a Service, you can also specify the
[application protocol](/docs/concepts/services-networking/service/#application-protocol)
that it uses.

This document details some special cases, all of them typically using TCP
as a transport protocol:

- [HTTP](#protocol-http-special) and [HTTPS](#protocol-http-special)
- [PROXY protocol](#protocol-proxy-special)
- [TLS](#protocol-tls-special) termination at the load balancer

<!-- body -->
## Supported protocols {#protocol-support}

There are 3 valid values for the `protocol` of a port for a Service:

### `SCTP` {#protocol-sctp}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

When using a network plugin that supports SCTP traffic, you can use SCTP for
most Services. For `type: LoadBalancer` Services, SCTP support depends on the cloud
provider offering this facility. (Most do not).

SCTP is not supported on nodes that run Windows.

#### Support for multihomed SCTP associations {#caveat-sctp-multihomed}

The support of multihomed SCTP associations requires that the CNI plugin can support the assignment of multiple interfaces and IP addresses to a Pod.

NAT for multihomed SCTP associations requires special logic in the corresponding kernel modules.

### `TCP` {#protocol-tcp}

You can use TCP for any kind of Service, and it's the default network protocol.

### `UDP` {#protocol-udp}

You can use UDP for most Services. For `type: LoadBalancer` Services,
UDP support depends on the cloud provider offering this facility.


## Special cases

### HTTP {#protocol-http-special}

If your cloud provider supports it, you can use a Service in LoadBalancer mode to
configure a load balancer outside of your Kubernetes cluster, in a special mode
where your cloud provider's load balancer implements HTTP / HTTPS reverse proxying,
with traffic forwarded to the backend endpoints for that Service.

Typically, you set the protocol for the Service to `TCP` and add an
{{< glossary_tooltip text="annotation" term_id="annotation" >}}
(usually specific to your cloud provider) that configures the load balancer
to handle traffic at the HTTP level.
This configuration might also include serving HTTPS (HTTP over TLS) and
reverse-proxying plain HTTP to your workload.

{{< note >}}
You can also use an {{< glossary_tooltip term_id="ingress" >}} to expose
HTTP/HTTPS Services.
{{< /note >}}

You might additionally want to specify that the
[application protocol](/docs/concepts/services-networking/service/#application-protocol)
of the connection is `http` or `https`. Use `http` if the session from the
load balancer to your workload is HTTP without TLS, and use `https` if the
session from the load balancer to your workload uses TLS encryption.

### PROXY protocol {#protocol-proxy-special}

If your cloud provider supports it, you can use a Service set to `type: LoadBalancer`
to configure a load balancer outside of Kubernetes itself, that will forward connections
wrapped with the
[PROXY protocol](https://www.haproxy.org/download/2.5/doc/proxy-protocol.txt).

The load balancer then sends an initial series of octets describing the
incoming connection, similar to this example (PROXY protocol v1):

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```

The data after the proxy protocol preamble are the original
data from the client. When either side closes the connection,
the load balancer also triggers a connection close and sends
any remaining data where feasible.

Typically, you define a Service with the protocol to `TCP`.
You also set an annotation, specific to your
cloud provider, that configures the load balancer to wrap each incoming connection in the PROXY protocol.

### TLS {#protocol-tls-special}

If your cloud provider supports it, you can use a Service set to `type: LoadBalancer` as
a way to set up external reverse proxying, where the connection from client to load
balancer is TLS encrypted and the load balancer is the TLS server peer.
The connection from the load balancer to your workload can also be TLS,
or might be plain text. The exact options available to you depend on your
cloud provider or custom Service implementation.

Typically, you set the protocol to `TCP` and set an annotation
(usually specific to your cloud provider) that configures the load balancer
to act as a TLS server. You would configure the TLS identity (as server,
and possibly also as a client that connects to your workload) using
mechanisms that are specific to your cloud provider.
