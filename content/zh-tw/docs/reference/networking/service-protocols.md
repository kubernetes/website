---
title: Service 所用的協議
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
如果你設定 {{< glossary_tooltip text="Service" term_id="service" >}}，
你可以從 Kubernetes 支持的任何網路協議中選擇一個協議。

Kubernetes 支持以下協議用於 Service：

- [`SCTP`](#protocol-sctp)
- [`TCP`](#protocol-tcp) **（預設值）**
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
當你定義 Service 時，
你還可以指定其使用的[應用協議](/zh-cn/docs/concepts/services-networking/service/#application-protocol)。

本文詳細說明了一些特殊場景，這些場景通常均使用 TCP 作爲傳輸協議：

- [HTTP](#protocol-http-special) 和 [HTTPS](#protocol-http-special)
- [PROXY 協議](#protocol-proxy-special)
- [TLS](#protocol-tls-special) 終止於負載均衡器處

<!-- body -->
<!--
## Supported protocols {#protocol-support}

There are 3 valid values for the `protocol` of a port for a Service:
-->
## 支持的協議  {#protocol-support}

Service 端口的 `protocol` 有 3 個有效值：

### `SCTP` {#protocol-sctp}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

<!--
When using a network plugin that supports SCTP traffic, you can use SCTP for
most Services. For `type: LoadBalancer` Services, SCTP support depends on the cloud
provider offering this facility. (Most do not).

SCTP is not supported on nodes that run Windows.
-->
當使用支持 SCTP 流量的網路插件時，你可以爲大多數 Service 使用 SCTP。
對於 `type: LoadBalancer` Service，對 SCTP 的支持情況取決於提供此項設施的雲供應商（大部分不支持）。

運行 Windows 的節點不支持 SCTP。

<!--
#### Support for multihomed SCTP associations {#caveat-sctp-multihomed}

The support of multihomed SCTP associations requires that the CNI plugin can support the assignment of multiple interfaces and IP addresses to a Pod.

NAT for multihomed SCTP associations requires special logic in the corresponding kernel modules.
-->
#### 支持多宿主 SCTP 關聯   {#caveat-sctp-multihomed}

對多宿主 SCTP 關聯的支持要求 CNI 插件可以支持爲 Pod 分配多個介面和 IP 地址。

針對多宿主 SCTP 關聯的 NAT 需要在對應的內核模塊具有特殊的邏輯。

### `TCP` {#protocol-tcp}

<!--
You can use TCP for any kind of Service, and it's the default network protocol.
-->
你可以將 TCP 用於任何類別的 Service，這是預設的網路協議。

### `UDP` {#protocol-udp}

<!--
You can use UDP for most Services. For `type: LoadBalancer` Services,
UDP support depends on the cloud provider offering this facility.
-->
你可以將 UDP 用於大多數 Service。對於 `type: LoadBalancer` Service，
UDP 的支持與否取決於提供此項設施的雲供應商。

<!--
## Special cases
-->
## 特殊場景   {#special-cases}

### HTTP {#protocol-http-special}

<!--
If your cloud provider supports it, you can use a Service in LoadBalancer mode to
configure a load balancer outside of your Kubernetes cluster, in a special mode
where your cloud provider's load balancer implements HTTP / HTTPS reverse proxying,
with traffic forwarded to the backend endpoints for that Service.
-->
如果你的雲供應商支持負載均衡，而且尤其是該雲供應商的負載均衡器實現了 HTTP/HTTPS 反向代理，
可將流量轉發到該 Service 的後端端點，那麼你就可以使用 LoadBalancer 模式的 Service 以便在
Kubernetes 叢集外部設定負載均衡器。

<!--
Typically, you set the protocol for the Service to `TCP` and add an
{{< glossary_tooltip text="annotation" term_id="annotation" >}}
(usually specific to your cloud provider) that configures the load balancer
to handle traffic at the HTTP level.
This configuration might also include serving HTTPS (HTTP over TLS) and
reverse-proxying plain HTTP to your workload.
-->
通常，你將 Service 協議設置爲 `TCP`，
並添加一個{{< glossary_tooltip text="註解" term_id="annotation" >}}
（一般取決於你的雲供應商）設定負載均衡器，以便在 HTTP 級別處理流量。
此設定也可能包括爲你的工作負載提供 HTTPS（基於 TLS 的 HTTP）並反向代理純 HTTP。

{{< note >}}
<!--
You can also use an {{< glossary_tooltip term_id="ingress" >}} to expose
HTTP/HTTPS Services.
-->
你也可以使用 {{< glossary_tooltip term_id="ingress" >}} 來暴露 HTTP/HTTPS Service。
{{< /note >}}

<!--
You might additionally want to specify that the
[application protocol](/docs/concepts/services-networking/service/#application-protocol)
of the connection is `http` or `https`. Use `http` if the session from the
load balancer to your workload is HTTP without TLS, and use `https` if the
session from the load balancer to your workload uses TLS encryption.
-->
你可能還想指定連接的[應用協議](/zh-cn/docs/concepts/services-networking/service/#application-protocol)是
`http` 還是 `https`。如果從負載均衡器到工作負載的會話是不帶 TLS 的 HTTP，請使用 `http`；
如果從負載均衡器到工作負載的會話使用 TLS 加密，請使用 `https`。

<!--
### PROXY protocol {#protocol-proxy-special}

If your cloud provider supports it, you can use a Service set to `type: LoadBalancer`
to configure a load balancer outside of Kubernetes itself, that will forward connections
wrapped with the
[PROXY protocol](https://www.haproxy.org/download/2.5/doc/proxy-protocol.txt).

The load balancer then sends an initial series of octets describing the
incoming connection, similar to this example (PROXY protocol v1):
-->
### PROXY 協議   {#protocol-proxy-special}

如果你的雲供應商支持此協議，你可以使用設置爲 `type: LoadBalancer` 的 Service，
在 Kubernetes 本身的外部設定負載均衡器，以轉發用
[PROXY 協議](https://www.haproxy.org/download/2.5/doc/proxy-protocol.txt)封裝的連接。

負載均衡器然後發送一個初始的八位元組系列來描述傳入的連接，這類似於以下示例（PROXY 協議 v1）：

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
代理協議前導碼之後的資料是來自客戶端的原始資料。
當任何一側關閉連接時，負載均衡器也會觸發連接關閉並在可行的情況下發送所有殘留資料。

通常，你會將 Service 協議定義爲 `TCP`。
你還會設置一個特定於雲供應商的註解，將負載均衡器設定爲以 PROXY 協議封裝所有傳入的連接。

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
如果你的雲供應商支持 TLS，你可以使用設置爲 `type: LoadBalancer` 的 Service
作爲設置外部反向代理的一種方式，其中從客戶端到負載均衡器的連接是 TLS 加密的且該負載均衡器是
TLS 對等伺服器。從負載均衡器到工作負載的連接可以是 TLS，或可能是純文本。
你可以使用的確切選項取決於你的雲供應商或自定義 Service 實現。

通常，你會將協議設置爲 `TCP` 並設置一個註解（通常特定於你的雲供應商），
將負載均衡器設定爲充當一個 TLS 伺服器。你將使用特定於雲供應商的機制來設定 TLS 身份
（作爲伺服器，也可能作爲連接到工作負載的客戶端）。
