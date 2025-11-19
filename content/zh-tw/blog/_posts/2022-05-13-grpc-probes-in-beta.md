---
layout: blog
title: "Kubernetes 1.24：gRPC 容器探針功能進入 Beta 階段"
date: 2022-05-13
slug: grpc-probes-now-in-beta
---
<!--
layout: blog
title: "Kubernetes 1.24: gRPC container probes in beta"
date: 2022-05-13
slug: grpc-probes-now-in-beta
-->

<!--
**Author**: Sergey Kanzhelev (Google)
-->
**作者**：Sergey Kanzhelev (Google)

**譯者**：Xiaoyang Zhang（Huawei）

<!--
With Kubernetes 1.24 the gRPC probes functionality entered beta and is available by default.
Now you can configure startup, liveness, and readiness probes for your gRPC app
without exposing any HTTP endpoint, nor do you need an executable. Kubernetes can natively connect to your workload via gRPC and query its status.
-->
在 Kubernetes 1.24 中，gRPC 探針（probe）功能進入了 beta 階段，默認情況下可用。
現在，你可以爲 gRPC 應用程序配置啓動、活躍和就緒探測，而無需公開任何 HTTP 端點，
也不需要可執行文件。Kubernetes 可以通過 gRPC 直接連接到你的工作負載並查詢其狀態。

<!--
## Some history

It's useful to let the system managing your workload check that the app is
healthy, has started OK, and whether the app considers itself good to accept
traffic. Before the gRPC support was added, Kubernetes already allowed you to
check for health based on running an executable from inside the container image,
by making an HTTP request, or by checking whether a TCP connection succeeded.
-->
## 一些歷史

讓管理你的工作負載的系統檢查應用程序是否健康、啓動是否正常，以及應用程序是否認爲自己可以接收流量，是很有用的。
在添加 gRPC 探針支持之前，Kubernetes 已經允許你通過從容器鏡像內部運行可執行文件、發出 HTTP
請求或檢查 TCP 連接是否成功來檢查健康狀況。

<!--
For most apps, those checks are enough. If your app provides a gRPC endpoint
for a health (or readiness) check, it is easy
to repurpose the `exec` probe to use it for gRPC health checking.
In the blog article [Health checking gRPC servers on Kubernetes](/blog/2018/10/01/health-checking-grpc-servers-on-kubernetes/),
Ahmet Alp Balkan described how you can do that — a mechanism that still works today.
-->
對於大多數應用程序來說，這些檢查就足夠了。如果你的應用程序提供了用於運行狀況（或準備就緒）檢查的
gRPC 端點，則很容易重新調整 `exec` 探針的用途，將其用於 gRPC 運行狀況檢查。
在博文[在 Kubernetes 上對 gRPC 服務器進行健康檢查](/zh-cn/blog/2018/10/01/health-checking-grpc-servers-on-kubernetes/)中，
Ahmet Alp Balkan 描述瞭如何做到這一點 —— 這種機制至今仍在工作。

<!--
There is a commonly used tool to enable this that was [created](https://github.com/grpc-ecosystem/grpc-health-probe/commit/2df4478982e95c9a57d5fe3f555667f4365c025d)
on August 21, 2018, and with
the first release at [Sep 19, 2018](https://github.com/grpc-ecosystem/grpc-health-probe/releases/tag/v0.1.0-alpha.1).
-->
2018 年 8 月 21 日所[創建](https://github.com/grpc-ecosystem/grpc-health-probe/commit/2df4478982e95c9a57d5fe3f555667f4365c025d)的一種常用工具可以啓用此功能，
工具於 [2018 年 9 月 19 日](https://github.com/grpc-ecosystem/grpc-health-probe/releases/tag/v0.1.0-alpha.1)首次發佈。

<!--
This approach for gRPC apps health checking is very popular. There are [3,626 Dockerfiles](https://github.com/search?l=Dockerfile&q=grpc_health_probe&type=code)
with the `grpc_health_probe` and [6,621 yaml](https://github.com/search?l=YAML&q=grpc_health_probe&type=Code) files that are discovered with the
basic search on GitHub (at the moment of writing). This is a good indication of the tool popularity
and the need to support this natively.
-->
這種 gRPC 應用健康檢查的方法非常受歡迎。使用 GitHub 上的基本搜索，發現了帶有 `grpc_health_probe`
的 [3,626 個 Dockerfile 文件](https://github.com/search?l=Dockerfile&q=grpc_health_probe&type=code)和
[6,621 個 yaml 文件](https://github.com/search?l=YAML&q=grpc_health_probe&type=Code)（在撰寫本文時）。
這很好地表明瞭該工具的受歡迎程度，以及對其本地支持的需求。

<!--
Kubernetes v1.23 introduced an alpha-quality implementation of native support for
querying a workload status using gRPC. Because it was an alpha feature,
this was disabled by default for the v1.23 release.
-->
Kubernetes v1.23 引入了一個 alpha 質量的實現，原生支持使用 gRPC 查詢工作負載狀態。
因爲這是一個 alpha 特性，所以在 1.23 版中默認是禁用的。

<!--
## Using the feature

We built gRPC health checking in similar way with other probes and believe
it will be [easy to use](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)
if you are familiar with other probe types in Kubernetes.
The natively supported health probe has many benefits over the workaround involving `grpc_health_probe` executable.
-->
## 使用該功能

我們用與其他探針類似的方式構建了 gRPC 健康檢查，相信如果你熟悉 Kubernetes 中的其他探針類型，
它會[很容易使用](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)。
與涉及 `grpc_health_probe` 可執行文件的解決辦法相比，原生支持的健康探針有許多好處。

<!--
With the native gRPC support you don't need to download and carry `10MB` of an additional executable with your image.
Exec probes are generally slower than a gRPC call as they require instantiating a new process to run an executable.
It also makes the checks less sensible for edge cases when the pod is running at maximum resources and has troubles
instantiating new processes.
-->
有了原生 gRPC 支持，你不需要在鏡像中下載和攜帶 `10MB` 的額外可執行文件。
Exec 探針通常比 gRPC 調用慢，因爲它們需要實例化一個新進程來運行可執行文件。
當 Pod 在最大資源下運行並且在實例化新進程時遇到困難時，它還使得對邊界情況的檢查變得不那麼智能。

<!--
There are a few limitations though. Since configuring a client certificate for probes is hard,
services that require client authentication are not supported. The built-in probes are also
not checking the server certificates and ignore related problems.
-->
不過有一些限制。由於爲探針配置客戶端證書很難，因此不支持依賴客戶端身份驗證的服務。
內置探針也不檢查服務器證書，並忽略相關問題。

<!--
Built-in checks also cannot be configured to ignore certain types of errors
(`grpc_health_probe` returns different exit codes for different errors),
and cannot be "chained" to run the health check on multiple services in a single probe.
-->
內置檢查也不能配置爲忽略某些類型的錯誤（`grpc_health_probe` 針對不同的錯誤返回不同的退出代碼），
並且不能“串接”以在單個探測中對多個服務運行健康檢查。

<!--
But all these limitations are quite standard for gRPC and there are easy workarounds
for those.
-->
但是所有這些限制對於 gRPC 來說都是相當標準的，並且有簡單的解決方法。

<!--
## Try it for yourself

### Cluster-level setup

You can try this feature today. To try native gRPC probes, you can spin up a Kubernetes cluster
yourself with the `GRPCContainerProbe` feature gate enabled, there are many [tools available](/docs/tasks/tools/).
-->
## 自己試試

### 集羣級設置

你現在可以嘗試這個功能。要嘗試原生 gRPC 探針，你可以自己啓動一個啓用了
`GRPCContainerProbe` 特性門控的 Kubernetes 集羣，可用的[工具](/zh-cn/docs/tasks/tools/)有很多。

<!--
Since the feature gate `GRPCContainerProbe` is enabled by default in 1.24,
many vendors will have this functionality working out of the box.
So you may just create an 1.24 cluster on platform of your choice. Some vendors
allow to enable alpha features on 1.23 clusters.
-->
由於特性門控 `GRPCContainerProbe` 在 1.24 版本中是默認啓用的，因此許多供應商支持此功能開箱即用。
因此，你可以在自己選擇的平臺上創建 1.24 版本集羣。一些供應商允許在 1.23 版本集羣上啓用 alpha 特性。

<!--
For example, at the moment of writing, you can spin up the test cluster on GKE for a quick test.
Other vendors may also have similar capabilities, especially if you
are reading this blog post long after the Kubernetes 1.24 release.
-->
例如，在編寫本文時，你可以在 GKE 上運行測試集羣來進行快速測試。
其他供應商可能也有類似的功能，尤其是當你在 Kubernetes 1.24 版本發佈很久後才閱讀這篇博客時。

<!--
On GKE use the following command (note, version is `1.23` and `enable-kubernetes-alpha` are specified).
-->
在 GKE 上使用以下命令（注意，版本是 `1.23`，並且指定了 `enable-kubernetes-alpha`）。

```shell
gcloud container clusters create test-grpc \
    --enable-kubernetes-alpha \
    --no-enable-autorepair \
    --no-enable-autoupgrade \
    --release-channel=rapid \
    --cluster-version=1.23
```

<!--
You will also need to configure `kubectl` to access the cluster:
-->
你還需要配置 kubectl 來訪問集羣：

```shell
gcloud container clusters get-credentials test-grpc
```

<!--
### Trying the feature out

Let's create the pod to test how gRPC probes work. For this test we will use the `agnhost` image.
This is a k8s maintained image with that can be used for all sorts of workload testing.
For example, it has a useful [grpc-health-checking](https://github.com/kubernetes/kubernetes/blob/b2c5bd2a278288b5ef19e25bf7413ecb872577a4/test/images/agnhost/README.md#grpc-health-checking) module
that exposes two ports - one is serving health checking service,
another - http port to react on commands `make-serving` and `make-not-serving`.
-->
### 試用該功能

讓我們創建 Pod 來測試 gRPC 探針是如何工作的。對於這個測試，我們將使用 `agnhost` 鏡像。
這是一個 k8s 維護的鏡像，可用於各種工作負載測試。例如，它有一個有用的
[grpc-health-checking](https://github.com/kubernetes/kubernetes/blob/b2c5bd2a278288b5ef19e25bf7413ecb872577a4/test/images/agnhost/README.md#grpc-health-checking)
模塊，該模塊暴露了兩個端口：一個是提供健康檢查服務的端口，另一個是對 `make-serving` 和
`make-not-serving` 命令做出反應的 http 端口。

<!--
Here is an example pod definition. It starts the `grpc-health-checking` module,
exposes ports `5000` and `8080`, and configures gRPC readiness probe:
-->
下面是一個 Pod 定義示例。它啓用 `grpc-health-checking` 模塊，暴露 5000 和 8080 端口，並配置 gRPC 就緒探針：

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: test-grpc
spec:
  containers:
    - name: agnhost
      # 鏡像自發布以來已更改（以前使用的倉庫爲 "k8s.gcr.io"）
      image: registry.k8s.io/e2e-test-images/agnhost:2.35
      command: ["/agnhost", "grpc-health-checking"]
      ports:
        - containerPort: 5000
        - containerPort: 8080
      readinessProbe:
        grpc:
          port: 5000
```

<!--
In the manifest file called `test.yaml`, you can create the pod and check its status.
The pod will be in ready state as indicated by the snippet of the output.
-->
如果清單文件名爲 `test.yaml`，你可以用以下命令創建 Pod，並檢查它的狀態。如輸出片段所示，Pod 將處於就緒狀態。

```shell
kubectl apply -f test.yaml
kubectl describe test-grpc
```

<!--
The output will contain something like this:
-->
輸出將包含如下內容：

```
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
```

<!--
Now let's change the health checking endpoint status to NOT_SERVING.
In order to call the http port of the Pod, let's create a port forward:
-->
現在讓我們將健康檢查端點狀態更改爲 `NOT_SERVING`。爲了調用 Pod 的 http 端口，讓我們創建一個端口轉發：

```shell
kubectl port-forward test-grpc 8080:8080
```

<!--
You can `curl` to call the command...
-->
你可以用 `curl` 來調用這個命令。

```shell
curl http://localhost:8080/make-not-serving
```

<!--
... and in a few seconds the port status will switch to not ready.
-->
幾秒鐘後，端口狀態將切換到未就緒。

```shell
kubectl describe pod test-grpc
```

<!--
The output now will have:
-->
現在的輸出將顯示：

```
Conditions:
  Type              Status
  Initialized       True
  Ready             False
  ContainersReady   False
  PodScheduled      True

...

  Warning  Unhealthy  2s (x6 over 42s)  kubelet            Readiness probe failed: service unhealthy (responded with "NOT_SERVING")
```

<!--
Once it is switched back, in about one second the Pod will get back to ready status:
-->
一旦切換回來，Pod 將在大約一秒鐘後恢復到就緒狀態：

```bash
curl http://localhost:8080/make-serving
kubectl describe test-grpc
```

<!--
The output indicates that the Pod went back to being `Ready`:
-->
輸出表明 Pod 恢復爲 `Ready`：

```
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
```

<!--
This new built-in gRPC health probing on Kubernetes makes implementing a health-check via gRPC
much easier than the older approach that relied on using a separate `exec` probe. Read through
the official
[documentation](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)
to learn more and provide feedback before the feature will be promoted to GA.
-->
Kubernetes 上這種新的內置 gRPC 健康探測，使得通過 gRPC 實現健康檢查比依賴使用額外的 `exec`
探測的舊方法更容易。請閱讀官方
[文檔](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)
瞭解更多信息並在該功能正式發佈（GA）之前提供反饋。

<!--
## Summary

Kubernetes is a popular workload orchestration platform and we add features based on feedback and demand.
Features like gRPC probes support is a minor improvement that will make life of many app developers
easier and apps more resilient. Try it today and give feedback, before the feature went into GA.
-->
## 總結

Kubernetes 是一個流行的工作負載編排平臺，我們根據反饋和需求添加功能。
像 gRPC 探針支持這樣的特性是一個小的改進，它將使許多應用程序開發人員的生活更容易，應用程序更有彈性。
在該功能 GA（正式發佈）之前，現在就試試，並給出反饋。
