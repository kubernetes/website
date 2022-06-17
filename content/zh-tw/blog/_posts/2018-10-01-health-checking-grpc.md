---
layout: blog
title:  '在 Kubernetes 上對 gRPC 伺服器進行健康檢查'
date: 2018-10-01
---
<!--
---
layout: blog
title:  'Health checking gRPC servers on Kubernetes'
date: 2018-10-01
---
--->

<!--
**Author**: [Ahmet Alp Balkan](https://twitter.com/ahmetb) (Google)
--->
**作者**： [Ahmet Alp Balkan](https://twitter.com/ahmetb) (Google)

<!-- 
**Update (December 2021):** _Kubernetes now has built-in gRPC health probes starting in v1.23.
To learn more, see [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe).
This article was originally written about an external tool to achieve the same task._
-->
**更新（2021 年 12 月）：** “Kubernetes 從 v1.23 開始具有內建 gRPC 健康探測。
瞭解更多資訊，請參閱[配置存活探針、就緒探針和啟動探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)。
本文最初是為有關實現相同任務的外部工具所寫。”

<!--
[gRPC](https://grpc.io) is on its way to becoming the lingua franca for
communication between cloud-native microservices. If you are deploying gRPC
applications to Kubernetes today, you may be wondering about the best way to
configure health checks. In this article, we will talk about
[grpc-health-probe](https://github.com/grpc-ecosystem/grpc-health-probe/), a
Kubernetes-native way to health check gRPC apps.
--->
[gRPC](https://grpc.io) 將成為本地雲微服務間進行通訊的通用語言。如果您現在將 gRPC 應用程式部署到 Kubernetes，您可能會想要了解配置健康檢查的最佳方法。在本文中，我們將介紹 [grpc-health-probe](https://github.com/grpc-ecosystem/grpc-health-probe/)，這是 Kubernetes 原生的健康檢查 gRPC 應用程式的方法。

<!--
If you're unfamiliar, Kubernetes [health
checks](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
(liveness and readiness probes) is what's keeping your applications available
while you're sleeping. They detect unresponsive pods, mark them unhealthy, and
cause these pods to be restarted or rescheduled.
--->
如果您不熟悉，Kubernetes的 [健康檢查](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)（存活探針和就緒探針）可以使您的應用程式在睡眠時保持可用狀態。當檢測到沒有回應的 Pod 時，會將其標記為不健康，並使這些 Pod 重新啟動或重新安排。

<!--
Kubernetes [does not
support](https://github.com/kubernetes/kubernetes/issues/21493) gRPC health
checks natively. This leaves the gRPC developers with the following three
approaches when they deploy to Kubernetes:

[![options for health checking grpc on kubernetes today](/images/blog/2019-09-30-health-checking-grpc/options.png)](/images/blog/2019-09-30-health-checking-grpc/options.png)
--->
Kubernetes 原本 [不支援](https://github.com/kubernetes/kubernetes/issues/21493) gRPC 健康檢查。gRPC 的開發人員在 Kubernetes 中部署時可以採用以下三種方法：

[![當前在 kubernetes 上進行 gRPC 健康檢查的選項](/images/blog/2019-09-30-health-checking-grpc/options.png)](/images/blog/2019-09-30-health-checking-grpc/options.png)


<!--
1.  **httpGet probe:** Cannot be natively used with gRPC. You need to refactor
    your app to serve both gRPC and HTTP/1.1 protocols (on different port
    numbers).
2.  **tcpSocket probe:** Opening a socket to gRPC server is not meaningful,
    since it cannot read the response body.
3.  **exec probe:** This invokes a program in a container's ecosystem
    periodically. In the case of gRPC, this means you implement a health RPC
    yourself, then write and ship a client tool with your container.

Can we do better? Absolutely.
--->
1.  **httpGet prob：** 不能與 gRPC 一起使用。您需要重構您的應用程式，必須同時支援 gRPC 和 HTTP/1.1 協議（在不同的埠號上）。
2.  **tcpSocket probe：** 開啟 gRPC 伺服器的 Socket 是沒有意義的，因為它無法讀取響應主體。
3.  **exec probe：** 將定期呼叫容器生態系統中的程式。對於 gRPC，這意味著您要自己實現健康 RPC，然後使用容器編寫並交付客戶端工具。

我們可以做得更好嗎？這是肯定的。

<!--
## Introducing “grpc-health-probe”

To standardize the "exec probe" approach mentioned above, we need:

- a **standard** health check "protocol" that can be implemented in any gRPC
  server easily.
- a **standard** health check "tool" that can query the health protocol easily.
--->
## 介紹 “grpc-health-probe”

為了使上述 "exec probe" 方法標準化，我們需要：

- 可以在任何 gRPC 伺服器中輕鬆實現的 **標準** 健康檢查 "協議" 。
- 一種 **標準** 健康檢查 "工具" ，可以輕鬆查詢健康協議。

<!--
Thankfully, gRPC has a [standard health checking
protocol](https://github.com/grpc/grpc/blob/v1.15.0/doc/health-checking.md). It
can be used easily from any language. Generated code and the utilities for
setting the health status are shipped in nearly all language implementations of
gRPC.
--->
幸運的是，gRPC 具有 [標準的健康檢查協議](https://github.com/grpc/grpc/blob/v1.15.0/doc/health-checking.md)。可以用任何語言輕鬆呼叫它。幾乎所有實現 gRPC 的語言都附帶了生成的程式碼和用於設定健康狀態的實用程式。

<!--
If you
[implement](https://github.com/grpc/grpc/blob/v1.15.0/src/proto/grpc/health/v1/health.proto)
this health check protocol in your gRPC apps, you can then use a standard/common
tool to invoke this `Check()` method to determine server status.
--->
如果您在 gRPC 應用程式中 [實現](https://github.com/grpc/grpc/blob/v1.15.0/src/proto/grpc/health/v1/health.proto) 此健康檢查協議，那麼可以使用標準或通用工具呼叫 `Check()` 方法來確定伺服器狀態。

<!--
The next thing you need is the "standard tool", and it's the
[**grpc-health-probe**](https://github.com/grpc-ecosystem/grpc-health-probe/).
--->
接下來您需要的是 "標準工具" [**grpc-health-probe**](https://github.com/grpc-ecosystem/grpc-health-probe/)。

<a href='/images/blog/2019-09-30-health-checking-grpc/grpc_health_probe.png'>
    <img width="768"  title='grpc-health-probe on kubernetes'
        src='/images/blog/2019-09-30-health-checking-grpc/grpc_health_probe.png'/>
</a>

<!--
With this tool, you can use the same health check configuration in all your gRPC
applications. This approach requires you to:
--->
使用此工具，您可以在所有 gRPC 應用程式中使用相同的健康檢查配置。這種方法有以下要求：

<!--
1.  Find the gRPC "health" module in your favorite language and start using it
    (example [Go library](https://godoc.org/github.com/grpc/grpc-go/health)).
2.  Ship the
    [grpc_health_probe](https://github.com/grpc-ecosystem/grpc-health-probe/)
    binary in your container.
3.  [Configure](https://github.com/grpc-ecosystem/grpc-health-probe/tree/1329d682b4232c102600b5e7886df8ffdcaf9e26#example-grpc-health-checking-on-kubernetes)
    Kubernetes "exec" probe to invoke the "grpc_health_probe" tool in the
    container.
--->
1.  用您喜歡的語言找到 gRPC 的 "健康" 模組並開始使用它（例如 [Go 庫](https://godoc.org/github.com/grpc/grpc-go/health)）。
2.  將二進位制檔案 [grpc_health_probe](https://github.com/grpc-ecosystem/grpc-health-probe/) 送到容器中。
3.  [配置](https://github.com/grpc-ecosystem/grpc-health-probe/tree/1329d682b4232c102600b5e7886df8ffdcaf9e26#example-grpc-health-checking-on-kubernetes) Kubernetes 的 "exec" 檢查模組來呼叫容器中的 "grpc_health_probe" 工具。

<!--
In this case, executing "grpc_health_probe" will call your gRPC server over
`localhost`, since they are in the same pod.
--->
在這種情況下，執行 "grpc_health_probe" 將透過 `localhost` 呼叫您的 gRPC 伺服器，因為它們位於同一個容器中。

<!--
## What's next

**grpc-health-probe** project is still in its early days and it needs your
feedback. It supports a variety of features like communicating with TLS servers
and configurable connection/RPC timeouts.
--->
## 下一步工作

**grpc-health-probe** 專案仍處於初期階段，需要您的反饋。它支援多種功能，例如與 TLS 伺服器通訊和配置延時連線/RPC。

<!--
If you are running a gRPC server on Kubernetes today, try using the gRPC Health
Protocol and try the grpc-health-probe in your deployments, and [give
feedback](https://github.com/grpc-ecosystem/grpc-health-probe/).
--->
如果您最近要在 Kubernetes 上執行 gRPC 伺服器，請嘗試使用 gRPC Health Protocol，並在您的 Deployment 中嘗試 grpc-health-probe，然後 [進行反饋](https://github.com/grpc-ecosystem/grpc-health-probe/)。

<!--
## Further reading

- Protocol: [GRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/v1.15.0/doc/health-checking.md) ([health.proto](https://github.com/grpc/grpc/blob/v1.15.0/src/proto/grpc/health/v1/health.proto))
- Documentation: [Kubernetes liveness and readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
- Article: [Advanced Kubernetes Health Check Patterns](https://ahmet.im/blog/advanced-kubernetes-health-checks/)
--->
## 更多內容

- 協議： [GRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/v1.15.0/doc/health-checking.md) ([health.proto](https://github.com/grpc/grpc/blob/v1.15.0/src/proto/grpc/health/v1/health.proto))
- 文件： [Kubernetes 存活和就緒探針](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
- 文章： [升級版 Kubernetes 健康檢查模式](https://ahmet.im/blog/advanced-kubernetes-health-checks/)
