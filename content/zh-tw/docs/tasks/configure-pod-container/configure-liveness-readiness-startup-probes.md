---
title: 設定存活、就緒和啓動探針
content_type: task
weight: 140
---
<!--
title: Configure Liveness, Readiness and Startup Probes
content_type: task
weight: 140
-->

<!-- overview -->
<!--
This page shows how to configure liveness, readiness and startup probes for containers.

For more information about probes, see [Liveness, Readiness and Startup Probes](/docs/concepts/configuration/liveness-readiness-startup-probes)

The [kubelet](/docs/reference/command-line-tools-reference/kubelet/) uses
liveness probes to know when to restart a container. For example, liveness
probes could catch a deadlock, where an application is running, but unable to
make progress. Restarting a container in such a state can help to make the
application more available despite bugs.
-->
這篇文章介紹如何給容器設定存活（Liveness）、就緒（Readiness）和啓動（Startup）探針。

有關探針的更多資訊，
請參閱[存活、就緒和啓動探針](/zh-cn/docs/concepts/configuration/liveness-readiness-startup-probes)。

[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
使用存活探針來確定什麼時候要重啓容器。
例如，存活探針可以探測到應用死鎖（應用在運行，但是無法繼續執行後面的步驟）情況。
重啓這種狀態下的容器有助於提高應用的可用性，即使其中存在缺陷。

<!--
A common pattern for liveness probes is to use the same low-cost HTTP endpoint
s for readiness probes, but with a higher failureThreshold. This ensures that the pod
is observed as not-ready for some period of time before it is hard killed.
-->
存活探針的常見模式是爲就緒探針使用相同的低成本 HTTP 端點，但具有更高的 failureThreshold。
這樣可以確保在硬性終止 Pod 之前，將觀察到 Pod 在一段時間內處於非就緒狀態。

<!--
The kubelet uses readiness probes to know when a container is ready to start
accepting traffic. One use of this signal is to control which Pods are used as
backends for Services. A Pod is considered ready when its `Ready` [condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)
is true. When a Pod is not ready, it is removed from Service load balancers.
A Pod's `Ready` condition is false when its Node's `Ready` condition is not true,
when one of the Pod's `readinessGates` is false, or when at least one of its containers
is not ready.

The kubelet uses startup probes to know when a container application has started.
If such a probe is configured, liveness and readiness probes do not start until
it succeeds, making sure those probes don't interfere with the application startup.
This can be used to adopt liveness checks on slow starting containers, avoiding them
getting killed by the kubelet before they are up and running.
-->
kubelet 使用就緒探針可以知道容器何時準備好接受請求流量。
這種信號的一個用途就是控制哪個 Pod 作爲 Service 的後端。
當 Pod 的 `Ready` [狀況](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) 爲
true 時，Pod 被認爲是就緒的。若 Pod 未就緒，會被從 Service 的負載均衡器中剔除。
當 Pod 所在節點的 `Ready` 狀況不爲 true 時、當 Pod 的某個 `readinessGates` 爲 false
時，或者當 Pod 中有任何一個容器未就緒時，Pod 的 `Ready` 狀況爲 false。

kubelet 使用啓動探針來了解應用容器何時啓動。
如果設定了這類探針，存活探針和就緒探針在啓動探針成功之前不會啓動，從而確保存活探針或就緒探針不會影響應用的啓動。
啓動探針可以用於對慢啓動容器進行存活性檢測，避免它們在啓動運行之前就被殺掉。

{{< caution >}}
<!--
Liveness probes can be a powerful way to recover from application failures, but
they should be used with caution. Liveness probes must be configured carefully
to ensure that they truly indicate unrecoverable application failure, for example a deadlock.
-->
存活探針是一種從應用故障中恢復的強勁方式，但應謹慎使用。
你必須仔細設定存活探針，確保它能真正標示出不可恢復的應用故障，例如死鎖。
{{< /caution >}}

{{< note >}}
<!--
Incorrect implementation of liveness probes can lead to cascading failures. This results in
restarting of container under high load; failed client requests as your application became less
scalable; and increased workload on remaining pods due to some failed pods.
Understand the difference between readiness and liveness probes and when to apply them for your app.
-->
錯誤的存活探針可能會導致級聯故障。
這會導致在高負載下容器重啓；例如由於應用無法擴展，導致客戶端請求失敗；以及由於某些
Pod 失敗而導致剩餘 Pod 的工作負載增加。瞭解就緒探針和存活探針之間的區別，
以及何時爲應用設定使用它們非常重要。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Define a liveness command

Many applications running for long periods of time eventually transition to
broken states, and cannot recover except by being restarted. Kubernetes provides
liveness probes to detect and remedy such situations.

In this exercise, you create a Pod that runs a container based on the
`registry.k8s.io/busybox:1.27.2` image. Here is the configuration file for the Pod:
-->
## 定義存活命令 {#define-a-liveness-command}

許多長時間運行的應用最終會進入損壞狀態，除非重新啓動，否則無法被恢復。
Kubernetes 提供了存活探針來發現並處理這種情況。

在本練習中，你會創建一個 Pod，其中運行一個基於 `registry.k8s.io/busybox:1.27.2` 映像檔的容器。
下面是這個 Pod 的設定檔案。

{{% code_sample file="pods/probe/exec-liveness.yaml" %}}

<!--
In the configuration file, you can see that the Pod has a single `Container`.
The `periodSeconds` field specifies that the kubelet should perform a liveness
probe every 5 seconds. The `initialDelaySeconds` field tells the kubelet that it
should wait 5 seconds before performing the first probe. To perform a probe, the
kubelet executes the command `cat /tmp/healthy` in the target container. If the
command succeeds, it returns 0, and the kubelet considers the container to be alive and
healthy. If the command returns a non-zero value, the kubelet kills the container
and restarts it.

When the container starts, it executes this command:
-->
在這個設定檔案中，可以看到 Pod 中只有一個 `Container`。
`periodSeconds` 字段指定了 kubelet 應該每 5 秒執行一次存活探測。
`initialDelaySeconds` 字段告訴 kubelet 在執行第一次探測前應該等待 5 秒。
kubelet 在容器內執行命令 `cat /tmp/healthy` 來進行探測。
如果命令執行成功並且返回值爲 0，kubelet 就會認爲這個容器是健康存活的。
如果這個命令返回非 0 值，kubelet 會殺死這個容器並重新啓動它。

當容器啓動時，執行如下的命令：

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600"
```

<!--
For the first 30 seconds of the container's life, there is a `/tmp/healthy` file.
So during the first 30 seconds, the command `cat /tmp/healthy` returns a success
code. After 30 seconds, `cat /tmp/healthy` returns a failure code.

Create the Pod:
-->
這個容器生命的前 30 秒，`/tmp/healthy` 檔案是存在的。
所以在這最開始的 30 秒內，執行命令 `cat /tmp/healthy` 會返回成功代碼。
30 秒之後，執行命令 `cat /tmp/healthy` 就會返回失敗代碼。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

<!--
Within 30 seconds, view the Pod events:
-->
在 30 秒內，查看 Pod 的事件：

```shell
kubectl describe pod liveness-exec
```

<!--
The output indicates that no liveness probes have failed yet:
-->
輸出結果表明還沒有存活探針失敗：

```none
Type    Reason     Age   From               Message
----    ------     ----  ----               -------
Normal  Scheduled  11s   default-scheduler  Successfully assigned default/liveness-exec to node01
Normal  Pulling    9s    kubelet, node01    Pulling image "registry.k8s.io/busybox:1.27.2"
Normal  Pulled     7s    kubelet, node01    Successfully pulled image "registry.k8s.io/busybox:1.27.2"
Normal  Created    7s    kubelet, node01    Created container liveness
Normal  Started    7s    kubelet, node01    Started container liveness
```

<!--
After 35 seconds, view the Pod events again:
-->
35 秒之後，再來看 Pod 的事件：

```shell
kubectl describe pod liveness-exec
```

<!--
At the bottom of the output, there are messages indicating that the liveness
probes have failed, and the failed containers have been killed and recreated.
-->
在輸出結果的最下面，有資訊顯示存活探針失敗了，這個失敗的容器被殺死並且被重建了。

```none
Type     Reason     Age                From               Message
----     ------     ----               ----               -------
Normal   Scheduled  57s                default-scheduler  Successfully assigned default/liveness-exec to node01
Normal   Pulling    55s                kubelet, node01    Pulling image "registry.k8s.io/busybox:1.27.2"
Normal   Pulled     53s                kubelet, node01    Successfully pulled image "registry.k8s.io/busybox:1.27.2"
Normal   Created    53s                kubelet, node01    Created container liveness
Normal   Started    53s                kubelet, node01    Started container liveness
Warning  Unhealthy  10s (x3 over 20s)  kubelet, node01    Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
Normal   Killing    10s                kubelet, node01    Container liveness failed liveness probe, will be restarted
```

<!--
Wait another 30 seconds, and verify that the Container has been restarted:
-->
再等 30 秒，確認這個容器被重啓了：

```shell
kubectl get pod liveness-exec
```

<!--
The output shows that `RESTARTS` has been incremented. Note that the `RESTARTS` counter
increments as soon as a failed container comes back to the running state:
-->
輸出結果顯示 `RESTARTS` 的值增加了 1。
請注意，一旦失敗的容器恢復爲運行狀態，`RESTARTS` 計數器就會增加 1：

```none
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

<!--
## Define a liveness HTTP request

Another kind of liveness probe uses an HTTP GET request. Here is the configuration
file for a Pod that runs a container based on the `registry.k8s.io/e2e-test-images/agnhost` image.
-->
## 定義一個存活態 HTTP 請求介面 {#define-a-liveness-HTTP-request}

另外一種類型的存活探測方式是使用 HTTP GET 請求。
下面是一個 Pod 的設定檔案，其中運行一個基於 `registry.k8s.io/e2e-test-images/agnhost` 映像檔的容器。

{{% code_sample file="pods/probe/http-liveness.yaml" %}}

<!--
In the configuration file, you can see that the Pod has a single container.
The `periodSeconds` field specifies that the kubelet should perform a liveness
probe every 3 seconds. The `initialDelaySeconds` field tells the kubelet that it
should wait 3 seconds before performing the first probe. To perform a probe, the
kubelet sends an HTTP GET request to the server that is running in the container
and listening on port 8080. If the handler for the server's `/healthz` path
returns a success code, the kubelet considers the container to be alive and
healthy. If the handler returns a failure code, the kubelet kills the container
and restarts it.
-->
在這個設定檔案中，你可以看到 Pod 也只有一個容器。
`periodSeconds` 字段指定了 kubelet 每隔 3 秒執行一次存活探測。
`initialDelaySeconds` 字段告訴 kubelet 在執行第一次探測前應該等待 3 秒。
kubelet 會向容器內運行的服務（服務在監聽 8080 端口）發送一個 HTTP GET 請求來執行探測。
如果伺服器上 `/healthz` 路徑下的處理程式返回成功代碼，則 kubelet 認爲容器是健康存活的。
如果處理程式返回失敗代碼，則 kubelet 會殺死這個容器並將其重啓。

<!--
Any code greater than or equal to 200 and less than 400 indicates success. Any
other code indicates failure.

You can see the source code for the server in
[server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go).

For the first 10 seconds that the container is alive, the `/healthz` handler
returns a status of 200. After that, the handler returns a status of 500.
-->
返回大於或等於 200 並且小於 400 的任何代碼都標示成功，其它返回代碼都標示失敗。

你可以訪問 [server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go)
閱讀服務的源碼。
容器存活期間的最開始 10 秒中，`/healthz` 處理程式返回 200 的狀態碼。
之後處理程式返回 500 的狀態碼。

```go
http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
    duration := time.Now().Sub(started)
    if duration.Seconds() > 10 {
        w.WriteHeader(500)
        w.Write([]byte(fmt.Sprintf("error: %v", duration.Seconds())))
    } else {
        w.WriteHeader(200)
        w.Write([]byte("ok"))
    }
})
```

<!--
The kubelet starts performing health checks 3 seconds after the container starts.
So the first couple of health checks will succeed. But after 10 seconds, the health
checks will fail, and the kubelet will kill and restart the container.

To try the HTTP liveness check, create a Pod:
-->
kubelet 在容器啓動之後 3 秒開始執行健康檢查。所以前幾次健康檢查都是成功的。
但是 10 秒之後，健康檢查會失敗，並且 kubelet 會殺死容器再重新啓動容器。

創建一個 Pod 來測試 HTTP 的存活檢測：

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

<!--
After 10 seconds, view Pod events to verify that liveness probes have failed and
the container has been restarted:
-->
10 秒之後，通過查看 Pod 事件來確認存活探針已經失敗，並且容器被重新啓動了。

```shell
kubectl describe pod liveness-http
```

<!--
In releases after v1.13, local HTTP proxy environment variable settings do not
affect the HTTP liveness probe.
-->
在 1.13 之後的版本中，設置本地的 HTTP 代理環境變量不會影響 HTTP 的存活探測。

<!--
## Define a TCP liveness probe

A third type of liveness probe uses a TCP socket. With this configuration, the
kubelet will attempt to open a socket to your container on the specified port.
If it can establish a connection, the container is considered healthy, if it
can't it is considered a failure.
-->
## 定義 TCP 的存活探測 {#define-a-TCP-liveness-probe}

第三種類型的存活探測是使用 TCP 套接字。
使用這種設定時，kubelet 會嘗試在指定端口和容器建立套接字鏈接。
如果能建立連接，這個容器就被看作是健康的，如果不能則這個容器就被看作是有問題的。

{{% code_sample file="pods/probe/tcp-liveness-readiness.yaml" %}}

<!--
As you can see, configuration for a TCP check is quite similar to an HTTP check.
This example uses both readiness and liveness probes. The kubelet will run the
first liveness probe 15 seconds after the container starts. This will attempt to
connect to the `goproxy` container on port 8080. If the liveness probe fails,
the container will be restarted. The kubelet will continue to run this check
every 10 seconds.
-->
如你所見，TCP 檢測的設定和 HTTP 檢測非常相似。
下面這個例子同時使用就緒探針和存活探針。kubelet 會在容器啓動 15 秒後運行第一次存活探測。
此探測會嘗試連接 `goproxy` 容器的 8080 端口。
如果此存活探測失敗，容器將被重啓。kubelet 將繼續每隔 10 秒運行一次這種探測。

<!--
In addition to the liveness probe, this configuration includes a readiness
probe. The kubelet will run the first readiness probe 15 seconds after the
container starts. Similar to the liveness probe, this will attempt to connect to
the `goproxy` container on port 8080. If the probe succeeds, the Pod will be
marked as ready and will receive traffic from services. If the readiness probe
fails, the pod will be marked unready and will not receive traffic from any
services.

To try the TCP liveness check, create a Pod:
-->
除了存活探針，這個設定還包括一個就緒探針。
kubelet 會在容器啓動 15 秒後運行第一次就緒探測。
與存活探測類似，就緒探測會嘗試連接 `goproxy` 容器的 8080 端口。
如果就緒探測失敗，Pod 將被標記爲未就緒，且不會接收來自任何服務的流量。

要嘗試 TCP 存活檢測，運行以下命令創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

<!--
After 15 seconds, view Pod events to verify that liveness probes:
-->
15 秒之後，通過查看 Pod 事件來檢測存活探針：

```shell
kubectl describe pod goproxy
```

<!--
## Define a gRPC liveness probe
-->
## 定義 gRPC 存活探針 {#define-a-grpc-liveness-probe}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

<!--
If your application implements the
[gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md),
this example shows how to configure Kubernetes to use it for application liveness checks.
Similarly you can configure readiness and startup probes.

Here is an example manifest:
-->
如果你的應用實現了
[gRPC 健康檢查協議](https://github.com/grpc/grpc/blob/master/doc/health-checking.md)，
這個例子展示瞭如何設定 Kubernetes 以將其用於應用的存活性檢查。
類似地，你可以設定就緒探針和啓動探針。

下面是一個示例清單：

{{% code_sample file="pods/probe/grpc-liveness.yaml" %}}

<!--
To use a gRPC probe, `port` must be configured. If you want to distinguish probes of different types
and probes for different features you can use the `service` field.
You can set `service` to the value `liveness` and make your gRPC Health Checking endpoint
respond to this request differently than when you set `service` set to `readiness`.
This lets you use the same endpoint for different kinds of container health check
rather than listening on two different ports.
If you want to specify your own custom service name and also specify a probe type,
the Kubernetes project recommends that you use a name that concatenates
those. For example: `myservice-liveness` (using `-` as a separator).
-->
要使用 gRPC 探針，必須設定 `port` 屬性。
如果要區分不同類型的探針和不同功能的探針，可以使用 `service` 字段。
你可以將 `service` 設置爲 `liveness`，並使你的 gRPC
健康檢查端點對該請求的響應與將 `service` 設置爲 `readiness` 時不同。
這使你可以使用相同的端點進行不同類型的容器健康檢查而不是監聽兩個不同的端口。
如果你想指定自己的自定義服務名稱並指定探測類型，Kubernetes
項目建議你使用使用一個可以關聯服務和探測類型的名稱來命名。
例如：`myservice-liveness`（使用 `-` 作爲分隔符）。

{{< note >}}
<!--
Unlike HTTP or TCP probes, you cannot specify the health check port by name, and you
cannot configure a custom hostname.
-->
與 HTTP 或 TCP 探針不同，gRPC 探測不能按名稱指定健康檢查端口，
也不能自定義主機名。
{{< /note >}}

<!--
Configuration problems (for example: incorrect port or service, unimplemented health checking protocol)
are considered a probe failure, similar to HTTP and TCP probes.

To try the gRPC liveness check, create a Pod using the command below.
In the example below, the etcd pod is configured to use gRPC liveness probe.
-->
設定問題（例如：錯誤的 `port` 或 `service`、未實現健康檢查協議）
都被認作是探測失敗，這一點與 HTTP 和 TCP 探針類似。

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/grpc-liveness.yaml
```

<!--
After 15 seconds, view Pod events to verify that the liveness check has not failed:
-->
15 秒鐘之後，查看 Pod 事件確認存活性檢查並未失敗：

```shell
kubectl describe pod etcd-with-grpc
```

<!--
When using a gRPC probe, there are some technical details to be aware of:

- The probes run against the pod IP address or its hostname.
  Be sure to configure your gRPC endpoint to listen on the Pod's IP address.
- The probes do not support any authentication parameters (like `-tls`).
- There are no error codes for built-in probes. All errors are considered as probe failures.
- If `ExecProbeTimeout` feature gate is set to `false`, grpc-health-probe does **not**
  respect the `timeoutSeconds` setting (which defaults to 1s), while built-in probe would fail on timeout.
-->
當使用 gRPC 探針時，需要注意以下一些技術細節：

- 這些探針運行時針對的是 Pod 的 IP 地址或其主機名。
  請一定設定你的 gRPC 端點使之監聽於 Pod 的 IP 地址之上。
- 這些探針不支持任何身份認證參數（例如 `-tls`）。
- 對於內置的探針而言，不存在錯誤代碼。所有錯誤都被視作探測失敗。
- 如果 `ExecProbeTimeout` 特性門控被設置爲 `false`，則 `grpc-health-probe`
  不會考慮 `timeoutSeconds` 設置狀態（預設值爲 1s），
  而內置探針則會在超時時返回失敗。

<!--
## Use a named port

You can use a named [`port`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#ports)
for HTTP and TCP probes. (gRPC probes do not support named ports).

For example:
-->
## 使用命名端口 {#use-a-named-port}

對於 HTTP 和 TCP 存活檢測可以使用命名的
[`port`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#ports)（gRPC 探針不支持使用命名端口）。

例如：

```yaml
ports:
- name: liveness-port
  containerPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
```

<!--
## Protect slow starting containers with startup probes {#define-startup-probes}

Sometimes, you have to deal with applications that require additional startup
time on their first initialization. In such cases, it can be tricky to set up
liveness probe parameters without compromising the fast response to deadlocks
that motivated such a probe. The solution is to set up a startup probe with the
same command, HTTP or TCP check, with a `failureThreshold * periodSeconds` long
enough to cover the worst case startup time.

So, the previous example would become:
-->
## 使用啓動探針保護慢啓動容器 {#define-startup-probes}

有時候，會有一些現有的應用在啓動時需要較長的初始化時間。
在這種情況下，若要不影響對死鎖作出快速響應的探測，設置存活探測參數是要技巧的。
解決辦法是使用相同的命令來設置啓動探測，針對 HTTP 或 TCP 檢測，可以通過將
`failureThreshold * periodSeconds` 參數設置爲足夠長的時間來應對最糟糕情況下的啓動時間。

這樣，前面的例子就變成了：

```yaml
ports:
- name: liveness-port
  containerPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 1
  periodSeconds: 10

startupProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 30
  periodSeconds: 10
```

<!--
Thanks to the startup probe, the application will have a maximum of 5 minutes
(30 * 10 = 300s) to finish its startup.
Once the startup probe has succeeded once, the liveness probe takes over to
provide a fast response to container deadlocks.
If the startup probe never succeeds, the container is killed after 300s and
subject to the pod's `restartPolicy`.
-->
幸虧有啓動探測，應用將會有最多 5 分鐘（30 * 10 = 300s）的時間來完成其啓動過程。
一旦啓動探測成功一次，存活探測任務就會接管對容器的探測，對容器死鎖作出快速響應。
如果啓動探測一直沒有成功，容器會在 300 秒後被殺死，並且根據 `restartPolicy`
來執行進一步處置。

<!--
## Define readiness probes

Sometimes, applications are temporarily unable to serve traffic.
For example, an application might need to load large data or configuration
files during startup, or depend on external services after startup.
In such cases, you don't want to kill the application,
but you don't want to send it requests either. Kubernetes provides
readiness probes to detect and mitigate these situations. A pod with containers
reporting that they are not ready does not receive traffic through Kubernetes
Services.
-->
## 定義就緒探針 {#define-readiness-probes}

有時候，應用會暫時性地無法爲請求提供服務。
例如，應用在啓動時可能需要加載大量的資料或設定檔案，或是啓動後要依賴等待外部服務。
在這種情況下，既不想殺死應用，也不想給它發送請求。
Kubernetes 提供了就緒探針來發現並緩解這些情況。
容器所在 Pod 上報還未就緒的資訊，並且不接受通過 Kubernetes Service 的流量。

{{< note >}}
<!--
Readiness probes runs on the container during its whole lifecycle.
-->
就緒探針在容器的整個生命週期中保持運行狀態。
{{< /note >}}

{{< caution >}}
<!--
The readiness and liveness probes do not depend on each other to succeed.
If you want to wait before executing a readiness probe, you should use
`initialDelaySeconds` or a `startupProbe`.
-->
存活探針與就緒性探針相互間不等待對方成功。
如果要在執行就緒性探針之前等待，應該使用 `initialDelaySeconds` 或 `startupProbe`。
{{< /caution >}}

<!--
Readiness probes are configured similarly to liveness probes. The only difference
is that you use the `readinessProbe` field instead of the `livenessProbe` field.
-->
就緒探針的設定和存活探針的設定相似。
唯一區別就是要使用 `readinessProbe` 字段，而不是 `livenessProbe` 字段。

```yaml
readinessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

<!--
Configuration for HTTP and TCP readiness probes also remains identical to
liveness probes.

Readiness and liveness probes can be used in parallel for the same container.
Using both can ensure that traffic does not reach a container that is not ready
for it, and that containers are restarted when they fail.
-->
HTTP 和 TCP 的就緒探針設定也和存活探針的設定完全相同。

就緒和存活探測可以在同一個容器上並行使用。
兩者共同使用，可以確保流量不會發給還未就緒的容器，當這些探測失敗時容器會被重新啓動。

<!--
## Configure Probes
-->
## 設定探針 {#configure-probes}

<!--Eventually, some of this section could be moved to a concept topic.-->

<!--
[Probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)
have a number of fields that you can use to more precisely control the behavior of startup,
liveness and readiness checks:
-->
[Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)
有很多設定字段，可以使用這些字段精確地控制啓動、存活和就緒檢測的行爲：

<!--
* `initialDelaySeconds`: Number of seconds after the container has started before startup,
  liveness or readiness probes are initiated. If a startup  probe is defined, liveness and
  readiness probe delays do not begin until the startup probe has succeeded. If the value of
  `periodSeconds` is greater than `initialDelaySeconds` then the `initialDelaySeconds` will be
  ignored. Defaults to 0 seconds. Minimum value is 0.
* `periodSeconds`: How often (in seconds) to perform the probe. Default to 10 seconds.
  The minimum value is 1.
  While a container is not Ready, the `ReadinessProbe` may be executed at times other than
  the configured `periodSeconds` interval. This is to make the Pod ready faster.
* `timeoutSeconds`: Number of seconds after which the probe times out.
  Defaults to 1 second. Minimum value is 1.
* `successThreshold`: Minimum consecutive successes for the probe to be considered successful
  after having failed. Defaults to 1. Must be 1 for liveness and startup Probes.
  Minimum value is 1.
-->
* `initialDelaySeconds`：容器啓動後要等待多少秒後才啓動啓動、存活和就緒探針。
  如果定義了啓動探針，則存活探針和就緒探針的延遲將在啓動探針已成功之後纔開始計算。
  如果 `periodSeconds` 的值大於 `initialDelaySeconds`，則 `initialDelaySeconds`
  將被忽略。預設是 0 秒，最小值是 0。
* `periodSeconds`：執行探測的時間間隔（單位是秒）。預設是 10 秒。最小值是 1。
  當容器未就緒時，`ReadinessProbe` 可能會在除設定的 `periodSeconds`
  間隔以外的時間執行。這是爲了讓 Pod 更快地達到可用狀態。
* `timeoutSeconds`：探測的超時後等待多少秒。預設值是 1 秒。最小值是 1。
* `successThreshold`：探針在失敗後，被視爲成功的最小連續成功數。預設值是 1。
  存活和啓動探測的這個值必須是 1。最小值是 1。
<!--
* `failureThreshold`: After a probe fails `failureThreshold` times in a row, Kubernetes
  considers that the overall check has failed: the container is _not_ ready/healthy/live.
  Defaults to 3. Minimum value is 1.
  For the case of a startup or liveness probe, if at least `failureThreshold` probes have
  failed, Kubernetes treats the container as unhealthy and triggers a restart for that
  specific container. The kubelet honors the setting of `terminationGracePeriodSeconds`
  for that container.
  For a failed readiness probe, the kubelet continues running the container that failed
  checks, and also continues to run more probes; because the check failed, the kubelet
  sets the `Ready` [condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)
  on the Pod to `false`.
-->
* `failureThreshold`：探針連續失敗了 `failureThreshold` 次之後，
  Kubernetes 認爲總體上檢查已失敗：容器狀態未就緒、不健康、不活躍。
  預設值爲 3，最小值爲 1。
  對於啓動探針或存活探針而言，如果至少有 `failureThreshold` 個探針已失敗，
  Kubernetes 會將容器視爲不健康併爲這個特定的容器觸發重啓操作。
  kubelet 遵循該容器的 `terminationGracePeriodSeconds` 設置。
  對於失敗的就緒探針，kubelet 繼續運行檢查失敗的容器，並繼續運行更多探針；
  因爲檢查失敗，kubelet 將 Pod 的 `Ready`
  [狀況](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)設置爲 `false`。
<!--
* `terminationGracePeriodSeconds`: configure a grace period for the kubelet to wait between
  triggering a shut down of the failed container, and then forcing the container runtime to stop
  that container.
  The default is to inherit the Pod-level value for `terminationGracePeriodSeconds`
  (30 seconds if not specified), and the minimum value is 1.
  See [probe-level `terminationGracePeriodSeconds`](#probe-level-terminationgraceperiodseconds)
  for more detail.
-->
* `terminationGracePeriodSeconds`：爲 kubelet
  設定從爲失敗的容器觸發終止操作到強制容器運行時停止該容器之前等待的寬限時長。
  預設值是繼承 Pod 級別的 `terminationGracePeriodSeconds` 值（如果不設置則爲 30 秒），最小值爲 1。
  更多細節請參見[探針級別 `terminationGracePeriodSeconds`](#probe-level-terminationgraceperiodseconds)。

{{< caution >}}
<!--
Incorrect implementation of readiness probes may result in an ever growing number
of processes in the container, and resource starvation if this is left unchecked.
-->
如果就緒態探針的實現不正確，可能會導致容器中進程的數量不斷上升。
如果不對其採取措施，很可能導致資源枯竭的狀況。
{{< /caution >}}

<!--
### HTTP probes

[HTTP probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
have additional fields that can be set on `httpGet`:

* `host`: Host name to connect to, defaults to the pod IP. You probably want to
  set "Host" in httpHeaders instead.
* `scheme`: Scheme to use for connecting to the host (HTTP or HTTPS). Defaults to "HTTP".
* `path`: Path to access on the HTTP server. Defaults to "/".
* `httpHeaders`: Custom headers to set in the request. HTTP allows repeated headers.
* `port`: Name or number of the port to access on the container. Number must be
  in the range 1 to 65535.
-->
### HTTP 探測  {#http-probes}

[HTTP Probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
允許針對 `httpGet` 設定額外的字段：

* `host`：連接使用的主機名，預設是 Pod 的 IP。也可以在 HTTP 頭中設置 "Host" 來代替。
* `scheme`：用於設置連接主機的方式（HTTP 還是 HTTPS）。預設是 "HTTP"。
* `path`：訪問 HTTP 服務的路徑。預設值爲 "/"。
* `httpHeaders`：請求中自定義的 HTTP 頭。HTTP 頭字段允許重複。
* `port`：訪問容器的端口號或者端口名。如果數字必須在 1～65535 之間。

<!--
For an HTTP probe, the kubelet sends an HTTP request to the specified port and
path to perform the check. The kubelet sends the probe to the pod's IP address,
unless the address is overridden by the optional `host` field in `httpGet`. If
`scheme` field is set to `HTTPS`, the kubelet sends an HTTPS request skipping the
certificate verification. In most scenarios, you do not want to set the `host` field.
Here's one scenario where you would set it. Suppose the container listens on 127.0.0.1
and the Pod's `hostNetwork` field is true. Then `host`, under `httpGet`, should be set
to 127.0.0.1. If your pod relies on virtual hosts, which is probably the more common
case, you should not use `host`, but rather set the `Host` header in `httpHeaders`.
-->
對於 HTTP 探測，kubelet 發送一個 HTTP 請求到指定的端口和路徑來執行檢測。
除非 `httpGet` 中的 `host` 字段設置了，否則 kubelet 預設是給 Pod 的 IP 地址發送探測。
如果 `scheme` 字段設置爲了 `HTTPS`，kubelet 會跳過證書驗證發送 HTTPS 請求。
大多數情況下，不需要設置 `host` 字段。
這裏有個需要設置 `host` 字段的場景，假設容器監聽 127.0.0.1，並且 Pod 的 `hostNetwork`
字段設置爲了 `true`。那麼 `httpGet` 中的 `host` 字段應該設置爲 127.0.0.1。
可能更常見的情況是如果 Pod 依賴虛擬主機，你不應該設置 `host` 字段，而是應該在
`httpHeaders` 中設置 `Host`。

<!--
For an HTTP probe, the kubelet sends two request headers in addition to the mandatory `Host` header:
- `User-Agent`: The default value is `kube-probe/{{< skew currentVersion >}}`,
  where `{{< skew currentVersion >}}` is the version of the kubelet.
- `Accept`: The default value is `*/*`.

You can override the default headers by defining `httpHeaders` for the probe.
For example
-->
針對 HTTP 探針，kubelet 除了必需的 `Host` 頭部之外還發送兩個請求頭部字段：
- `User-Agent`：預設值是 `kube-probe/{{< skew currentVersion >}}`，其中 `{{< skew currentVersion >}}` 是 kubelet 的版本號。
- `Accept`：預設值 `*/*`。

你可以通過爲探測設置 `httpHeaders` 來重載預設的頭部字段值。例如：

```yaml
livenessProbe:
  httpGet:
    httpHeaders:
      - name: Accept
        value: application/json

startupProbe:
  httpGet:
    httpHeaders:
      - name: User-Agent
        value: MyUserAgent
```

<!--
You can also remove these two headers by defining them with an empty value.
-->
你也可以通過將這些頭部字段定義爲空值，從請求中去掉這些頭部字段。

```yaml
livenessProbe:
  httpGet:
    httpHeaders:
      - name: Accept
        value: ""

startupProbe:
  httpGet:
    httpHeaders:
      - name: User-Agent
        value: ""
```

{{< note >}}
<!--
When the kubelet probes a Pod using HTTP, it only follows redirects if the redirect
is to the same host. If the kubelet receives 11 or more redirects during probing, the probe is considered successful
and a related Event is created:
-->
當 kubelet 使用 HTTP 探測 Pod 時，僅當重定向到同一主機時，它纔會遵循重定向。
如果 kubelet 在探測期間收到 11 個或更多重定向，則認爲探測成功並創建相關事件：

```none
Events:
  Type     Reason        Age                     From               Message
  ----     ------        ----                    ----               -------
  Normal   Scheduled     29m                     default-scheduler  Successfully assigned default/httpbin-7b8bc9cb85-bjzwn to daocloud
  Normal   Pulling       29m                     kubelet            Pulling image "docker.io/kennethreitz/httpbin"
  Normal   Pulled        24m                     kubelet            Successfully pulled image "docker.io/kennethreitz/httpbin" in 5m12.402735213s
  Normal   Created       24m                     kubelet            Created container httpbin
  Normal   Started       24m                     kubelet            Started container httpbin
 Warning  ProbeWarning  4m11s (x1197 over 24m)  kubelet            Readiness probe warning: Probe terminated redirects
```

<!--
If the kubelet receives a redirect where the hostname is different from the request,
the outcome of the probe is treated as successful and kubelet creates an event
to report the redirect failure.
-->
如果 kubelet 收到主機名與請求不同的重定向，則探測結果將被視爲成功，並且
kubelet 將創建一個事件來報告重定向失敗。
{{< /note >}}

<!--
### TCP probes

For a TCP probe, the kubelet makes the probe connection at the node, not in the Pod, which
means that you can not use a service name in the `host` parameter since the kubelet is unable
to resolve it.
-->
### TCP 探測  {#tcp-probes}

對於 TCP 探測而言，kubelet 在節點上（不是在 Pod 裏面）發起探測連接，
這意味着你不能在 `host` 參數上設定服務名稱，因爲 kubelet 不能解析服務名稱。

<!--
### Probe-level `terminationGracePeriodSeconds`
-->
### 探針層面的 `terminationGracePeriodSeconds`

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

<!--
In 1.25 and above, users can specify a probe-level `terminationGracePeriodSeconds`
as part of the probe specification. When both a pod- and probe-level
`terminationGracePeriodSeconds` are set, the kubelet will use the probe-level value.
-->
在 1.25 及以上版本中，使用者可以指定一個探針層面的 `terminationGracePeriodSeconds`
作爲探針規約的一部分。
當 Pod 層面和探針層面的 `terminationGracePeriodSeconds`
都已設置，kubelet 將使用探針層面設置的值。

<!--
When setting the `terminationGracePeriodSeconds`, please note the following:

* The kubelet always honors the probe-level `terminationGracePeriodSeconds` field if 
  it is present on a Pod.
-->
當設置 `terminationGracePeriodSeconds` 時，請注意以下事項：

* kubelet 始終優先選用探針級別 `terminationGracePeriodSeconds` 字段
  （如果它存在於 Pod 上）。

<!--
* If you have existing Pods where the `terminationGracePeriodSeconds` field is set and
  you no longer wish to use per-probe termination grace periods, you must delete
  those existing Pods.
-->
* 如果你已經爲現有 Pod 設置了 `terminationGracePeriodSeconds`
  字段並且不再希望使用針對每個探針的終止寬限期，則必須刪除現有的這類 Pod。

<!--
For example:
-->
例如：

<!--
```yaml
spec:
  terminationGracePeriodSeconds: 3600  # pod-level
  containers:
  - name: test
    image: ...

    ports:
    - name: liveness-port
      containerPort: 8080

    livenessProbe:
      httpGet:
        path: /healthz
        port: liveness-port
      failureThreshold: 1
      periodSeconds: 60
      # Override pod-level terminationGracePeriodSeconds #
      terminationGracePeriodSeconds: 60
```
-->
```yaml
spec:
  terminationGracePeriodSeconds: 3600  # Pod 級別設置
  containers:
  - name: test
    image: ...

    ports:
    - name: liveness-port
      containerPort: 8080

    livenessProbe:
      httpGet:
        path: /healthz
        port: liveness-port
      failureThreshold: 1
      periodSeconds: 60
      # 重載 Pod 級別的 terminationGracePeriodSeconds
      terminationGracePeriodSeconds: 60
```

<!--
Probe-level `terminationGracePeriodSeconds` cannot be set for readiness probes.
It will be rejected by the API server.
-->
探針層面的 `terminationGracePeriodSeconds` 不能用於就緒態探針。
這一設置將被 API 伺服器拒絕。

## {{% heading "whatsnext" %}}

<!--
* Learn more about
  [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).
-->
* 進一步瞭解[容器探針](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。

<!--
You can also read the API references for:

* [Pod](/docs/reference/kubernetes-api/workload-resources/pod-v1/), and specifically:
  * [container(s)](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
  * [probe(s)](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
-->
你也可以閱讀以下的 API 參考資料：

* [Pod](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/)，尤其是：
  * [container](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
  * [probe](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
