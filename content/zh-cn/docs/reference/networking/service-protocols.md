---
title: Service 所用的协议
content_type: reference
weight: 10
---
<!--
title: Protocols for Services
content_type: reference
weight: 10
-->

<!-- overview -->
<!--
If you configure a {{< glossary_tooltip text="Service" term_id="service" >}},
you can select from any network protocol that Kubernetes supports.

Kubernetes supports the following protocols with Services:

- [`SCTP`](#protocol-sctp)
- [`TCP`](#protocol-tcp) _(the default)_
- [`UDP`](#protocol-udp)
-->
如果你配置 {{< glossary_tooltip text="Service" term_id="service" >}}，
你可以从 Kubernetes 支持的任何网络协议中选择一个协议。

Kubernetes 支持以下协议用于 Service：

- [`SCTP`](#protocol-sctp)
- [`TCP`](#protocol-tcp) **（默认值）**
- [`UDP`](#protocol-udp)

<!--
When you define a Service, you can also specify the
[application protocol](/docs/concepts/services-networking/service/#application-protocol)
that it uses.

This document details some special cases, all of them typically using TCP
as a transport protocol:

- [HTTP](#protocol-http-special) and [HTTPS](#protocol-http-special)
- [PROXY protocol](#protocol-proxy-special)
- [TLS](#protocol-tls-special) termination at the load balancer
-->
当你定义 Service 时，
你还可以指定其使用的[应用协议](/zh-cn/docs/concepts/services-networking/service/#application-protocol)。

本文详细说明了一些特殊场景，这些场景通常均使用 TCP 作为传输协议：

- [HTTP](#protocol-http-special) 和 [HTTPS](#protocol-http-special)
- [PROXY 协议](#protocol-proxy-special)
- [TLS](#protocol-tls-special) 终止于负载均衡器处

<!-- body -->
<!--
## Supported protocols {#protocol-support}

There are 3 valid values for the `protocol` of a port for a Service:
-->
## 支持的协议  {#protocol-support}

Service 端口的 `protocol` 有 3 个有效值：

### `SCTP` {#protocol-sctp}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

<!--
When using a network plugin that supports SCTP traffic, you can use SCTP for
most Services. For `type: LoadBalancer` Services, SCTP support depends on the cloud
provider offering this facility. (Most do not).

SCTP is not supported on nodes that run Windows.
-->
当使用支持 SCTP 流量的网络插件时，你可以为大多数 Service 使用 SCTP。
对于 `type: LoadBalancer` Service，对 SCTP 的支持情况取决于提供此项设施的云供应商（大部分不支持）。

运行 Windows 的节点不支持 SCTP。

<!--
#### Support for multihomed SCTP associations {#caveat-sctp-multihomed}

The support of multihomed SCTP associations requires that the CNI plugin can support the assignment of multiple interfaces and IP addresses to a Pod.

NAT for multihomed SCTP associations requires special logic in the corresponding kernel modules.
-->
#### 支持多宿主 SCTP 关联   {#caveat-sctp-multihomed}

对多宿主 SCTP 关联的支持要求 CNI 插件可以支持为 Pod 分配多个接口和 IP 地址。

针对多宿主 SCTP 关联的 NAT 需要在对应的内核模块具有特殊的逻辑。

### `TCP` {#protocol-tcp}

<!--
You can use TCP for any kind of Service, and it's the default network protocol.
-->
你可以将 TCP 用于任何类别的 Service，这是默认的网络协议。

### `UDP` {#protocol-udp}

<!--
You can use UDP for most Services. For `type: LoadBalancer` Services,
UDP support depends on the cloud provider offering this facility.
-->
你可以将 UDP 用于大多数 Service。对于 `type: LoadBalancer` Service，
UDP 的支持与否取决于提供此项设施的云供应商。

<!--
## Special cases
-->
## 特殊场景   {#special-cases}

### HTTP {#protocol-http-special}

<!--
If your cloud provider supports it, you can use a Service in LoadBalancer mode to
configure a load balancer outside of your Kubernetes cluster, in a special mode
where your cloud provider's load balancer implements HTTP / HTTPS reverse proxying,
with traffic forwarded to the backend endpoints for that Service.
-->
如果你的云供应商支持负载均衡，而且尤其是该云供应商的负载均衡器实现了 HTTP/HTTPS 反向代理，
可将流量转发到该 Service 的后端端点，那么你就可以使用 LoadBalancer 模式的 Service 以便在
Kubernetes 集群外部配置负载均衡器。

<!--
Typically, you set the protocol for the Service to `TCP` and add an
{{< glossary_tooltip text="annotation" term_id="annotation" >}}
(usually specific to your cloud provider) that configures the load balancer
to handle traffic at the HTTP level.
This configuration might also include serving HTTPS (HTTP over TLS) and
reverse-proxying plain HTTP to your workload.
-->
通常，你将 Service 协议设置为 `TCP`，
并添加一个{{< glossary_tooltip text="注解" term_id="annotation" >}}
（一般取决于你的云供应商）配置负载均衡器，以便在 HTTP 级别处理流量。
此配置也可能包括为你的工作负载提供 HTTPS（基于 TLS 的 HTTP）并反向代理纯 HTTP。

{{< note >}}
<!--
You can also use an {{< glossary_tooltip term_id="ingress" >}} to expose
HTTP/HTTPS Services.
-->
你也可以使用 {{< glossary_tooltip term_id="ingress" >}} 来暴露 HTTP/HTTPS Service。
{{< /note >}}

<!--
You might additionally want to specify that the
[application protocol](/docs/concepts/services-networking/service/#application-protocol)
of the connection is `http` or `https`. Use `http` if the session from the
load balancer to your workload is HTTP without TLS, and use `https` if the
session from the load balancer to your workload uses TLS encryption.
-->
你可能还想指定连接的[应用协议](/zh-cn/docs/concepts/services-networking/service/#application-protocol)是
`http` 还是 `https`。如果从负载均衡器到工作负载的会话是不带 TLS 的 HTTP，请使用 `http`；
如果从负载均衡器到工作负载的会话使用 TLS 加密，请使用 `https`。

<!--
### PROXY protocol {#protocol-proxy-special}

If your cloud provider supports it, you can use a Service set to `type: LoadBalancer`
to configure a load balancer outside of Kubernetes itself, that will forward connections
wrapped with the
[PROXY protocol](https://www.haproxy.org/download/2.5/doc/proxy-protocol.txt).

The load balancer then sends an initial series of octets describing the
incoming connection, similar to this example (PROXY protocol v1):
-->
### PROXY 协议   {#protocol-proxy-special}

如果你的云供应商支持此协议，你可以使用设置为 `type: LoadBalancer` 的 Service，
在 Kubernetes 本身的外部配置负载均衡器，以转发用
[PROXY 协议](https://www.haproxy.org/download/2.5/doc/proxy-protocol.txt)封装的连接。

负载均衡器然后发送一个初始的八位元组系列来描述传入的连接，这类似于以下示例（PROXY 协议 v1）：

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```

<!--
The data after the proxy protocol preamble are the original
data from the client. When either side closes the connection,
the load balancer also triggers a connection close and sends
any remaining data where feasible.

Typically, you define a Service with the protocol to `TCP`.
You also set an annotation, specific to your
cloud provider, that configures the load balancer to wrap each incoming connection in the PROXY protocol.
-->
代理协议前导码之后的数据是来自客户端的原始数据。
当任何一侧关闭连接时，负载均衡器也会触发连接关闭并在可行的情况下发送所有残留数据。

通常，你会将 Service 协议定义为 `TCP`。
你还会设置一个特定于云供应商的注解，将负载均衡器配置为以 PROXY 协议封装所有传入的连接。

### TLS {#protocol-tls-special}

<!--
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
-->
如果你的云供应商支持 TLS，你可以使用设置为 `type: LoadBalancer` 的 Service
作为设置外部反向代理的一种方式，其中从客户端到负载均衡器的连接是 TLS 加密的且该负载均衡器是
TLS 对等服务器。从负载均衡器到工作负载的连接可以是 TLS，或可能是纯文本。
你可以使用的确切选项取决于你的云供应商或自定义 Service 实现。

通常，你会将协议设置为 `TCP` 并设置一个注解（通常特定于你的云供应商），
将负载均衡器配置为充当一个 TLS 服务器。你将使用特定于云供应商的机制来配置 TLS 身份
（作为服务器，也可能作为连接到工作负载的客户端）。
