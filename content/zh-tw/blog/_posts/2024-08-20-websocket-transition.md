---
layout: blog
title: 'Kubernetes 1.31：流式傳輸從 SPDY 轉換爲 WebSocket'
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
在 Kubernetes 1.31 中，kubectl 現在預設使用 WebSocket 協議而不是 SPDY 進行流式傳輸。

這篇文章介紹了這些變化對你意味着什麼以及這些流式傳輸 API 的重要性。

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

在 Kubernetes 中，某些以 HTTP 或 RESTful 介面公開的某些端點會被升級爲流式連接，因而需要使用流式協議。
與 HTTP 這種請求-響應協議不同，流式協議提供了一種持久的雙向連接，具有低延遲的特點，並允許實時交互。
流式協議支持在客戶端與伺服器之間通過同一個連接進行雙向的資料讀寫。
這種類型的連接非常有用，例如，當你從本地工作站在某個運行中的容器內創建 shell 並在該容器中運行命令時。

<!--
## Why change the streaming protocol?

Before the v1.31 release, Kubernetes used the SPDY/3.1 protocol by default when
upgrading streaming connections. SPDY/3.1 has been deprecated for eight years,
and it was never standardized. Many modern proxies, gateways, and load balancers
no longer support the protocol. As a result, you might notice that commands like
`kubectl cp`, `kubectl attach`, `kubectl exec`, and `kubectl port-forward`
stop working when you try to access your cluster through a proxy or gateway.
-->
## 爲什麼要改變流式傳輸協議？

在 v1.31 版本發佈之前，Kubernetes 預設使用 SPDY/3.1 協議來升級流式連接。
但是 SPDY/3.1 已經被廢棄了八年之久，並且從未被標準化，許多現代代理、網關和負載均衡器已經不再支持該協議。
因此，當你嘗試通過代理或網關訪問叢集時，可能會發現像 `kubectl cp`、`kubectl attach`、`kubectl exec`
和 `kubectl port-forward` 這樣的命令無法正常工作。

<!--
As of Kubernetes v1.31, SIG API Machinery has modified the streaming
protocol that a Kubernetes client (such as `kubectl`) uses for these commands
to the more modern [WebSocket streaming protocol](https://datatracker.ietf.org/doc/html/rfc6455).
The WebSocket protocol is a currently supported standardized streaming protocol
that guarantees compatibility and interoperability with different components and
programming languages. The WebSocket protocol is more widely supported by modern
proxies and gateways than SPDY.
-->
從 Kubernetes v1.31 版本開始，SIG API Machinery 修改了 Kubernetes 
客戶端（如 `kubectl`）中用於這些命令的流式傳輸協議，將其改爲更現代化的
[WebSocket 流式傳輸協議](https://datatracker.ietf.org/doc/html/rfc6455)。
WebSocket 協議是一種當前得到支持的標準流式傳輸協議，
它可以確保與不同組件及編程語言之間的兼容性和互操作性。
相較於 SPDY，WebSocket 協議更爲廣泛地被現代代理和網關所支持。

<!--
## How streaming APIs work

Kubernetes upgrades HTTP connections to streaming connections by adding
specific upgrade headers to the originating HTTP request. For example, an HTTP
upgrade request for running the `date` command on an `nginx` container within
a cluster is similar to the following:
-->
## 流式 API 的工作原理

Kubernetes 通過在原始的 HTTP 請求中添加特定的升級頭字段來將 HTTP 連接升級爲流式連接。
例如，在叢集內的 `nginx` 容器上運行 `date` 命令的 HTTP 升級請求類似於以下內容：

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
如果容器運行時支持 WebSocket 流式協議及其至少一個子協議版本（例如 `v5.channel.k8s.io`），
伺服器會以代表成功的 `101 Switching Protocols` 狀態碼進行響應，並附帶協商後的子協議版本：

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
此時，原本用於 HTTP 協議的 TCP 連接已轉換爲流式連接。
隨後，此 Shell 交互中的標準輸入（STDIN）、標準輸出（STDOUT）和標準錯誤輸出（STDERR）資料
（以及終端重置大小資料和進程退出碼資料）會通過這個升級後的連接進行流式傳輸。

<!--
## How to use the new WebSocket streaming protocol

If your cluster and kubectl are on version 1.29 or later, there are two
control plane feature gates and two kubectl environment variables that
govern the use of the WebSockets rather than SPDY. In Kubernetes 1.31,
all of the following feature gates are in beta and are enabled by
default:
-->
## 如何使用新的 WebSocket 流式協議

如果你的叢集和 kubectl 版本爲 1.29 及以上版本，有兩個控制面特性門控以及兩個
kubectl 環境變量用來控制啓用 WebSocket 而不是 SPDY 作爲流式協議。
在 Kubernetes 1.31 中，以下所有特性門控均處於 Beta 階段，並且預設被啓用：

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
- [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
  - `TranslateStreamCloseWebsocketRequests`
    - `.../exec`
    - `.../attach`
  - `PortForwardWebsockets`
      - `.../port-forward`
- kubectl 特性控制環境變量
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
如果你正在使用一個較舊的叢集但可以管理其特性門控設置，
那麼可以通過開啓 `TranslateStreamCloseWebsocketRequests`（在 Kubernetes v1.29 中添加）
和 `PortForwardWebsockets`（在 Kubernetes v1.30 中添加）來嘗試啓用 Websocket 作爲流式傳輸協議。
版本爲 1.31 的 kubectl 可以自動使用新的行爲，但你需要連接到明確啓用了伺服器端特性的叢集。

<!--
## Learn more about streaming APIs

- [KEP 4006 - Transitioning from SPDY to WebSockets](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/4006-transition-spdy-to-websockets)
- [RFC 6455 - The WebSockets Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [Container Runtime Interface streaming explained](https://kubernetes.io/blog/2024/05/01/cri-streaming-explained/)
-->
## 瞭解有關流式 API 的更多資訊

- [KEP 4006 - Transitioning from SPDY to WebSockets（英文）](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/4006-transition-spdy-to-websockets)
- [RFC 6455 - The WebSockets Protocol（英文）](https://datatracker.ietf.org/doc/html/rfc6455)
- [Container Runtime Interface streaming explained（英文）](https://kubernetes.io/blog/2024/05/01/cri-streaming-explained/)
