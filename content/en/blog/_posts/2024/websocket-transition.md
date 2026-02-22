---
layout: blog
title: 'Kubernetes 1.31: Streaming Transitions from SPDY to WebSockets'
date: 2024-08-20
slug: websockets-transition
author: >
  [Sean Sullivan](https://github.com/seans3) (Google)
  [Shannon Kularathna](https://github.com/shannonxtreme) (Google)
---

In Kubernetes 1.31, by default kubectl now uses the WebSocket protocol
instead of SPDY for streaming.

This post describes what these changes mean for you and why these streaming APIs
matter.

## Streaming APIs in Kubernetes

In Kubernetes, specific endpoints that are exposed as an HTTP or RESTful
interface are upgraded to streaming connections, which require a streaming
protocol. Unlike HTTP, which is a request-response protocol, a streaming
protocol provides a persistent connection that's bi-directional, low-latency,
and lets you interact in real-time. Streaming protocols support reading and
writing data between your client and the server, in both directions, over the
same connection. This type of connection is useful, for example, when you create
a shell in a running container from your local workstation and run commands in
the container.

## Why change the streaming protocol?

Before the v1.31 release, Kubernetes used the SPDY/3.1 protocol by default when
upgrading streaming connections. SPDY/3.1 has been deprecated for eight years,
and it was never standardized. Many modern proxies, gateways, and load balancers
no longer support the protocol. As a result, you might notice that commands like
`kubectl cp`, `kubectl attach`, `kubectl exec`, and `kubectl port-forward`
stop working when you try to access your cluster through a proxy or gateway.

As of Kubernetes v1.31, SIG API Machinery has modified the streaming
protocol that a Kubernetes client (such as `kubectl`) uses for these commands
to the more modern [WebSocket streaming protocol](https://datatracker.ietf.org/doc/html/rfc6455).
The WebSocket protocol is a currently supported standardized streaming protocol
that guarantees compatibility and interoperability with different components and
programming languages. The WebSocket protocol is more widely supported by modern
proxies and gateways than SPDY.

## How streaming APIs work

Kubernetes upgrades HTTP connections to streaming connections by adding
specific upgrade headers to the originating HTTP request. For example, an HTTP
upgrade request for running the `date` command on an `nginx` container within
a cluster is similar to the following:

```console
$ kubectl exec -v=8 nginx -- date
GET https://127.0.0.1:43251/api/v1/namespaces/default/pods/nginx/exec?command=date…
Request Headers:
    Connection: Upgrade
    Upgrade: websocket
    Sec-Websocket-Protocol: v5.channel.k8s.io
    User-Agent: kubectl/v1.31.0 (linux/amd64) kubernetes/6911225
```

If the container runtime supports the WebSocket streaming protocol and at least
one of the subprotocol versions (e.g. `v5.channel.k8s.io`), the server responds
with a successful `101 Switching Protocols` status, along with the negotiated
subprotocol version:

```console
Response Status: 101 Switching Protocols in 3 milliseconds
Response Headers:
    Upgrade: websocket
    Connection: Upgrade
    Sec-Websocket-Accept: j0/jHW9RpaUoGsUAv97EcKw8jFM=
    Sec-Websocket-Protocol: v5.channel.k8s.io
```

At this point the TCP connection used for the HTTP protocol has changed to a
streaming connection. Subsequent STDIN, STDOUT, and STDERR data (as well as
terminal resizing data and process exit code data) for this shell interaction is
then streamed over this upgraded connection.

## How to use the new WebSocket streaming protocol

If your cluster and kubectl are on version 1.29 or later, there are two
control plane feature gates and two kubectl environment variables that
govern the use of the WebSockets rather than SPDY. In Kubernetes 1.31,
all of the following feature gates are in beta and are enabled by
default:

- [Feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
  - `TranslateStreamCloseWebsocketRequests`
      - `.../exec`
      - `.../attach`
  - `PortForwardWebsockets`
      - `.../port-forward`
- kubectl feature control environment variables
  - `KUBECTL_REMOTE_COMMAND_WEBSOCKETS`
      - `kubectl exec`
      - `kubectl cp`
      - `kubectl attach`
  - `KUBECTL_PORT_FORWARD_WEBSOCKETS`
      - `kubectl port-forward`

If you're connecting to an older cluster but can manage the feature gate
settings, turn on both `TranslateStreamCloseWebsocketRequests` (added in
Kubernetes v1.29) and `PortForwardWebsockets` (added in Kubernetes
v1.30) to try this new behavior. Version 1.31 of `kubectl` can automatically use
the new behavior, but you do need to connect to a cluster where the server-side
features are explicitly enabled.

## Learn more about streaming APIs

- [KEP 4006 - Transitioning from SPDY to WebSockets](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/4006-transition-spdy-to-websockets)
- [RFC 6455 - The WebSockets Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [Container Runtime Interface streaming explained](https://kubernetes.io/blog/2024/05/01/cri-streaming-explained/)
