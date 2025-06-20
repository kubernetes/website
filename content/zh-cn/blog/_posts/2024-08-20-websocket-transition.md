---
layout: blog
title: 'Kubernetes 1.31：流式传输从 SPDY 转换为 WebSocket'
date: 2024-08-20
slug: websockets-transition
author: >
  [Sean Sullivan](https://github.com/seans3) (Google)
  [Shannon Kularathna](https://github.com/shannonxtreme) (Google)
translator: >
  Xin Li (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes 1.31: Streaming Transitions from SPDY to WebSockets'
date: 2024-08-20
slug: websockets-transition
author: >
  [Sean Sullivan](https://github.com/seans3) (Google)
  [Shannon Kularathna](https://github.com/shannonxtreme) (Google)
-->

<!--
In Kubernetes 1.31, by default kubectl now uses the WebSocket protocol
instead of SPDY for streaming.

This post describes what these changes mean for you and why these streaming APIs
matter.
-->
在 Kubernetes 1.31 中，kubectl 现在默认使用 WebSocket 协议而不是 SPDY 进行流式传输。

这篇文章介绍了这些变化对你意味着什么以及这些流式传输 API 的重要性。

<!--
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
-->
## Kubernetes 中的流式 API

在 Kubernetes 中，某些以 HTTP 或 RESTful 接口公开的某些端点会被升级为流式连接，因而需要使用流式协议。
与 HTTP 这种请求-响应协议不同，流式协议提供了一种持久的双向连接，具有低延迟的特点，并允许实时交互。
流式协议支持在客户端与服务器之间通过同一个连接进行双向的数据读写。
这种类型的连接非常有用，例如，当你从本地工作站在某个运行中的容器内创建 shell 并在该容器中运行命令时。

<!--
## Why change the streaming protocol?

Before the v1.31 release, Kubernetes used the SPDY/3.1 protocol by default when
upgrading streaming connections. SPDY/3.1 has been deprecated for eight years,
and it was never standardized. Many modern proxies, gateways, and load balancers
no longer support the protocol. As a result, you might notice that commands like
`kubectl cp`, `kubectl attach`, `kubectl exec`, and `kubectl port-forward`
stop working when you try to access your cluster through a proxy or gateway.
-->
## 为什么要改变流式传输协议？

在 v1.31 版本发布之前，Kubernetes 默认使用 SPDY/3.1 协议来升级流式连接。
但是 SPDY/3.1 已经被废弃了八年之久，并且从未被标准化，许多现代代理、网关和负载均衡器已经不再支持该协议。
因此，当你尝试通过代理或网关访问集群时，可能会发现像 `kubectl cp`、`kubectl attach`、`kubectl exec`
和 `kubectl port-forward` 这样的命令无法正常工作。

<!--
As of Kubernetes v1.31, SIG API Machinery has modified the streaming
protocol that a Kubernetes client (such as `kubectl`) uses for these commands
to the more modern [WebSocket streaming protocol](https://datatracker.ietf.org/doc/html/rfc6455).
The WebSocket protocol is a currently supported standardized streaming protocol
that guarantees compatibility and interoperability with different components and
programming languages. The WebSocket protocol is more widely supported by modern
proxies and gateways than SPDY.
-->
从 Kubernetes v1.31 版本开始，SIG API Machinery 修改了 Kubernetes 
客户端（如 `kubectl`）中用于这些命令的流式传输协议，将其改为更现代化的
[WebSocket 流式传输协议](https://datatracker.ietf.org/doc/html/rfc6455)。
WebSocket 协议是一种当前得到支持的标准流式传输协议，
它可以确保与不同组件及编程语言之间的兼容性和互操作性。
相较于 SPDY，WebSocket 协议更为广泛地被现代代理和网关所支持。

<!--
## How streaming APIs work

Kubernetes upgrades HTTP connections to streaming connections by adding
specific upgrade headers to the originating HTTP request. For example, an HTTP
upgrade request for running the `date` command on an `nginx` container within
a cluster is similar to the following:
-->
## 流式 API 的工作原理

Kubernetes 通过在原始的 HTTP 请求中添加特定的升级头字段来将 HTTP 连接升级为流式连接。
例如，在集群内的 `nginx` 容器上运行 `date` 命令的 HTTP 升级请求类似于以下内容：

```console
$ kubectl exec -v=8 nginx -- date
GET https://127.0.0.1:43251/api/v1/namespaces/default/pods/nginx/exec?command=date…
Request Headers:
    Connection: Upgrade
    Upgrade: websocket
    Sec-Websocket-Protocol: v5.channel.k8s.io
    User-Agent: kubectl/v1.31.0 (linux/amd64) kubernetes/6911225
```

<!--
If the container runtime supports the WebSocket streaming protocol and at least
one of the subprotocol versions (e.g. `v5.channel.k8s.io`), the server responds
with a successful `101 Switching Protocols` status, along with the negotiated
subprotocol version:
-->
如果容器运行时支持 WebSocket 流式协议及其至少一个子协议版本（例如 `v5.channel.k8s.io`），
服务器会以代表成功的 `101 Switching Protocols` 状态码进行响应，并附带协商后的子协议版本：

```console
Response Status: 101 Switching Protocols in 3 milliseconds
Response Headers:
    Upgrade: websocket
    Connection: Upgrade
    Sec-Websocket-Accept: j0/jHW9RpaUoGsUAv97EcKw8jFM=
    Sec-Websocket-Protocol: v5.channel.k8s.io
```

<!--
At this point the TCP connection used for the HTTP protocol has changed to a
streaming connection. Subsequent STDIN, STDOUT, and STDERR data (as well as
terminal resizing data and process exit code data) for this shell interaction is
then streamed over this upgraded connection.
-->
此时，原本用于 HTTP 协议的 TCP 连接已转换为流式连接。
随后，此 Shell 交互中的标准输入（STDIN）、标准输出（STDOUT）和标准错误输出（STDERR）数据
（以及终端重置大小数据和进程退出码数据）会通过这个升级后的连接进行流式传输。

<!--
## How to use the new WebSocket streaming protocol

If your cluster and kubectl are on version 1.29 or later, there are two
control plane feature gates and two kubectl environment variables that
govern the use of the WebSockets rather than SPDY. In Kubernetes 1.31,
all of the following feature gates are in beta and are enabled by
default:
-->
## 如何使用新的 WebSocket 流式协议

如果你的集群和 kubectl 版本为 1.29 及以上版本，有两个控制面特性门控以及两个
kubectl 环境变量用来控制启用 WebSocket 而不是 SPDY 作为流式协议。
在 Kubernetes 1.31 中，以下所有特性门控均处于 Beta 阶段，并且默认被启用：

<!--
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
-->
- [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
  - `TranslateStreamCloseWebsocketRequests`
    - `.../exec`
    - `.../attach`
  - `PortForwardWebsockets`
      - `.../port-forward`
- kubectl 特性控制环境变量
  - `KUBECTL_REMOTE_COMMAND_WEBSOCKETS`
    - `kubectl exec`
    - `kubectl cp`
    - `kubectl attach`
  - `KUBECTL_PORT_FORWARD_WEBSOCKETS`
    - `kubectl port-forward`

<!--
If you're connecting to an older cluster but can manage the feature gate
settings, turn on both `TranslateStreamCloseWebsocketRequests` (added in
Kubernetes v1.29) and `PortForwardWebsockets` (added in Kubernetes
v1.30) to try this new behavior. Version 1.31 of `kubectl` can automatically use
the new behavior, but you do need to connect to a cluster where the server-side
features are explicitly enabled.
-->
如果你正在使用一个较旧的集群但可以管理其特性门控设置，
那么可以通过开启 `TranslateStreamCloseWebsocketRequests`（在 Kubernetes v1.29 中添加）
和 `PortForwardWebsockets`（在 Kubernetes v1.30 中添加）来尝试启用 Websocket 作为流式传输协议。
版本为 1.31 的 kubectl 可以自动使用新的行为，但你需要连接到明确启用了服务器端特性的集群。

<!--
## Learn more about streaming APIs

- [KEP 4006 - Transitioning from SPDY to WebSockets](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/4006-transition-spdy-to-websockets)
- [RFC 6455 - The WebSockets Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [Container Runtime Interface streaming explained](https://kubernetes.io/blog/2024/05/01/cri-streaming-explained/)
-->
## 了解有关流式 API 的更多信息

- [KEP 4006 - Transitioning from SPDY to WebSockets（英文）](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/4006-transition-spdy-to-websockets)
- [RFC 6455 - The WebSockets Protocol（英文）](https://datatracker.ietf.org/doc/html/rfc6455)
- [Container Runtime Interface streaming explained（英文）](https://kubernetes.io/blog/2024/05/01/cri-streaming-explained/)
