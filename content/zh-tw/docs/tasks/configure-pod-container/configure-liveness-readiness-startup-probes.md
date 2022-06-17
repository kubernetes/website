---
title: 配置存活、就緒和啟動探測器
content_type: task
weight: 110
---

<!-- overview -->
<!--
This page shows how to configure liveness, readiness and startup probes for Containers.

The [kubelet](/docs/reference/command-line-tools-reference/kubelet/) uses liveness probes to know when to
restart a container. For example, liveness probes could catch a deadlock,
where an application is running, but unable to make progress. Restarting a
container in such a state can help to make the application more available
despite bugs.
-->
這篇文章介紹如何給容器配置活躍（Liveness）、就緒（Readiness）和啟動（Startup）探測器。

[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
使用存活探測器來確定什麼時候要重啟容器。
例如，存活探測器可以探測到應用死鎖（應用程式在執行，但是無法繼續執行後面的步驟）情況。
重啟這種狀態下的容器有助於提高應用的可用性，即使其中存在缺陷。

<!--
The kubelet uses readiness probes to know when a container is ready to start
accepting traffic. A Pod is considered ready when all of its containers are ready.
One use of this signal is to control which Pods are used as backends for Services.
When a Pod is not ready, it is removed from Service load balancers.

The kubelet uses startup probes to know when a container application has started.
If such a probe is configured, it disables liveness and readiness checks until
it succeeds, making sure those probes don't interfere with the application startup.
This can be used to adopt liveness checks on slow starting containers, avoiding them
getting killed by the kubelet before they are up and running.
-->
kubelet 使用就緒探測器可以知道容器何時準備好接受請求流量，當一個 Pod 
內的所有容器都就緒時，才能認為該 Pod 就緒。
這種訊號的一個用途就是控制哪個 Pod 作為 Service 的後端。
若 Pod 尚未就緒，會被從 Service 的負載均衡器中剔除。

kubelet 使用啟動探測器來了解應用容器何時啟動。
如果配置了這類探測器，你就可以控制容器在啟動成功後再進行存活性和就緒態檢查，
確保這些存活、就緒探測器不會影響應用的啟動。
啟動探測器可以用於對慢啟動容器進行存活性檢測，避免它們在啟動執行之前就被殺掉。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Define a liveness command

Many applications running for long periods of time eventually transition to
broken states, and cannot recover except by being restarted. Kubernetes provides
liveness probes to detect and remedy such situations.

In this exercise, you create a Pod that runs a container based on the
`k8s.gcr.io/busybox` image. Here is the configuration file for the Pod:
-->
## 定義存活命令 {#define-a-liveness-command}

許多長時間執行的應用最終會進入損壞狀態，除非重新啟動，否則無法被恢復。
Kubernetes 提供了存活探測器來發現並處理這種情況。

在本練習中，你會建立一個 Pod，其中執行一個基於 `k8s.gcr.io/busybox` 映象的容器。
下面是這個 Pod 的配置檔案。

{{< codenew file="pods/probe/exec-liveness.yaml" >}}

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
在這個配置檔案中，可以看到 Pod 中只有一個 `Container`。
`periodSeconds` 欄位指定了 kubelet 應該每 5 秒執行一次存活探測。
`initialDelaySeconds` 欄位告訴 kubelet 在執行第一次探測前應該等待 5 秒。
kubelet 在容器內執行命令 `cat /tmp/healthy` 來進行探測。
如果命令執行成功並且返回值為 0，kubelet 就會認為這個容器是健康存活的。
如果這個命令返回非 0 值，kubelet 會殺死這個容器並重新啟動它。

當容器啟動時，執行如下的命令：

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
所以在這最開始的 30 秒內，執行命令 `cat /tmp/healthy` 會返回成功程式碼。
30 秒之後，執行命令 `cat /tmp/healthy` 就會返回失敗程式碼。

建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

<!--
Within 30 seconds, view the Pod events:
-->
在 30 秒內，檢視 Pod 的事件：

```shell
kubectl describe pod liveness-exec
```

<!--
The output indicates that no liveness probes have failed yet:
-->
輸出結果表明還沒有存活探測器失敗：

```
FirstSeen    LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
24s       24s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "k8s.gcr.io/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "k8s.gcr.io/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
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
probes have failed, and the containers have been killed and recreated.
-->
在輸出結果的最下面，有資訊顯示存活探測器失敗了，這個容器被殺死並且被重建了。

```
FirstSeen LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
37s       37s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "k8s.gcr.io/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "k8s.gcr.io/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
2s        2s      1   {kubelet worker0}   spec.containers{liveness}   Warning     Unhealthy   Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
```

<!--
Wait another 30 seconds, and verify that the Container has been restarted:
-->
再等 30 秒，確認這個容器被重啟了：

```shell
kubectl get pod liveness-exec
```

<!--
The output shows that `RESTARTS` has been incremented:
-->
輸出結果顯示 `RESTARTS` 的值增加了 1。

```
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

<!--
## Define a liveness HTTP request

Another kind of liveness probe uses an HTTP GET request. Here is the configuration
file for a Pod that runs a container based on the `k8s.gcr.io/liveness`
image.
-->
## 定義一個存活態 HTTP 請求介面 {#define-a-liveness-HTTP-request}

另外一種型別的存活探測方式是使用 HTTP GET 請求。
下面是一個 Pod 的配置檔案，其中執行一個基於 `k8s.gcr.io/liveness` 映象的容器。

{{< codenew file="pods/probe/http-liveness.yaml" >}}

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
在這個配置檔案中，你可以看到 Pod 也只有一個容器。
`periodSeconds` 欄位指定了 kubelet 每隔 3 秒執行一次存活探測。
`initialDelaySeconds` 欄位告訴 kubelet 在執行第一次探測前應該等待 3 秒。
kubelet 會向容器內執行的服務（服務在監聽 8080 埠）傳送一個 HTTP GET 請求來執行探測。
如果伺服器上 `/healthz`  路徑下的處理程式返回成功程式碼，則 kubelet 認為容器是健康存活的。
如果處理程式返回失敗程式碼，則 kubelet 會殺死這個容器並將其重啟。

<!--
Any code greater than or equal to 200 and less than 400 indicates success. Any
other code indicates failure.

You can see the source code for the server in
[server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go).

For the first 10 seconds that the container is alive, the `/healthz` handler
returns a status of 200. After that, the handler returns a status of 500.
-->
返回大於或等於 200 並且小於 400 的任何程式碼都標示成功，其它返回程式碼都標示失敗。

你可以訪問 [server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go)。
閱讀服務的原始碼。
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
kubelet 在容器啟動之後 3 秒開始執行健康檢測。所以前幾次健康檢查都是成功的。
但是 10 秒之後，健康檢查會失敗，並且 kubelet 會殺死容器再重新啟動容器。

建立一個 Pod 來測試 HTTP 的存活檢測：

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

<!--
After 10 seconds, view Pod events to verify that liveness probes have failed and
the container has been restarted:
-->
10 秒之後，透過檢視 Pod 事件來確認活躍探測器已經失敗，並且容器被重新啟動了。

```shell
kubectl describe pod liveness-http
```

<!--
In releases prior to v1.13 (including v1.13), if the environment variable
`http_proxy` (or `HTTP_PROXY`) is set on the node where a Pod is running,
the HTTP liveness probe uses that proxy.
In releases after v1.13, local HTTP proxy environment variable settings do not
affect the HTTP liveness probe.
-->
在 1.13 之前（包括 1.13）的版本中，如果在 Pod 執行的節點上設定了環境變數
`http_proxy`（或者 `HTTP_PROXY`），HTTP 的存活探測會使用這個代理。
在 1.13 之後的版本中，設定本地的 HTTP 代理環境變數不會影響 HTTP 的存活探測。

<!--
## Define a TCP liveness probe

A third type of liveness probe uses a TCP socket. With this configuration, the
kubelet will attempt to open a socket to your container on the specified port.
If it can establish a connection, the container is considered healthy, if it
can't it is considered a failure.
-->
## 定義 TCP 的存活探測 {#define-a-TCP-liveness-probe}

第三種類型的存活探測是使用 TCP 套接字。
使用這種配置時，kubelet 會嘗試在指定埠和容器建立套接字連結。
如果能建立連線，這個容器就被看作是健康的，如果不能則這個容器就被看作是有問題的。

{{< codenew file="pods/probe/tcp-liveness-readiness.yaml" >}}

<!--
As you can see, configuration for a TCP check is quite similar to an HTTP check.
This example uses both readiness and liveness probes. The kubelet will send the
first readiness probe 5 seconds after the container starts. This will attempt to
connect to the `goproxy` container on port 8080. If the probe succeeds, the Pod
will be marked as ready. The kubelet will continue to run this check every 10
seconds.

In addition to the readiness probe, this configuration includes a liveness probe.
The kubelet will run the first liveness probe 15 seconds after the container
starts. Similar to the readiness probe, this will attempt to connect to the
`goproxy` container on port 8080. If the liveness probe fails, the container
will be restarted.

To try the TCP liveness check, create a Pod:
-->
如你所見，TCP 檢測的配置和 HTTP 檢測非常相似。
下面這個例子同時使用就緒和存活探測器。kubelet 會在容器啟動 5 秒後傳送第一個就緒探測。
探測器會嘗試連線 `goproxy` 容器的 8080 埠。
如果探測成功，這個 Pod 會被標記為就緒狀態，kubelet 將繼續每隔 10 秒執行一次檢測。

除了就緒探測，這個配置包括了一個存活探測。
kubelet 會在容器啟動 15 秒後進行第一次存活探測。
與就緒探測類似，活躍探測器會嘗試連線 `goproxy` 容器的 8080 埠。
如果存活探測失敗，容器會被重新啟動。

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

<!--
After 15 seconds, view Pod events to verify that liveness probes:
-->
15 秒之後，透過看 Pod 事件來檢測存活探測器：

```shell
kubectl describe pod goproxy
```

<!--
## Define a gRPC liveness probe
-->
## 定義 gRPC 活躍探測器

{{< feature-state for_k8s_version="v1.24" state="beta" >}}


<!--
If your application implements [gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md),
kubelet can be configured to use it for application liveness checks.
You must enable the `GRPCContainerProbe`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
in order to configure checks that rely on gRPC.

Here is an example manifest:
-->
如果你的應用實現了 [gRPC 健康檢查協議](https://github.com/grpc/grpc/blob/master/doc/health-checking.md)，
kubelet 可以配置為使用該協議來執行應用活躍性檢查。
你必須啟用 `GRPCContainerProbe`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
才能配置依賴於 gRPC 的檢查機制。

下面是一個示例清單：

{{< codenew file="pods/probe/grpc-liveness.yaml" >}}

<!--
To use a gRPC probe, `port` must be configured. If the health endpoint is configured
on a non-default service, you must also specify the `service`.
-->
要使用 gRPC 探測器，必須配置 `port` 屬性。如果健康狀態端點配置在非預設服務之上，
你還必須設定 `service` 屬性。

{{< note >}}
<!--
Unlike HTTP and TCP probes, named ports cannot be used and custom host cannot be configured.
-->
與 HTTP 和 TCP 探測器不同，gRPC 探測不能使用命名埠或定製主機。
{{< /note >}}

<!--
Configuration problems (for example: incorrect port and service, unimplemented health checking protocol)
are considered a probe failure, similar to HTTP and TCP probes.

To try the gRPC liveness check, create a Pod using the command below.
In the example below, the etcd pod is configured to use gRPC liveness probe.
-->
配置問題（例如：錯誤的 `port` 和 `service`、未實現健康檢查協議）
都被認作是探測失敗，這一點與 HTTP 和 TCP 探測器類似。

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/grpc-liveness.yaml
```

<!--
After 15 seconds, view Pod events to verify that the liveness check has not failed:
-->
15 秒鐘之後，檢視 Pod 事件確認活躍性檢查並未失敗：

```shell
kubectl describe pod etcd-with-grpc
```

<!--
Before Kubernetes 1.23, gRPC health probes were often implemented using [grpc-health-probe](https://github.com/grpc-ecosystem/grpc-health-probe/),
as described in the blog post [Health checking gRPC servers on Kubernetes](/blog/2018/10/01/health-checking-grpc-servers-on-kubernetes/).
The built-in gRPC probes behavior is similar to one implemented by grpc-health-probe.
When migrating from grpc-health-probe to built-in probes, remember the following differences:
-->
在 Kubernetes 1.23 之前，gRPC 健康探測通常使用
[grpc-health-probe](https://github.com/grpc-ecosystem/grpc-health-probe/)
來實現，如部落格 [Health checking gRPC servers on Kubernetes（對 Kubernetes 上的 gRPC 伺服器執行健康檢查）](/blog/2018/10/01/health-checking-grpc-servers-on-kubernetes/)所描述。
內建的 gRPC 探測器行為與 `grpc-health-probe` 所實現的行為類似。
從 `grpc-health-probe` 遷移到內建探測器時，請注意以下差異：

<!--
- Built-in probes run against the pod IP address, unlike grpc-health-probe that often runs against `127.0.0.1`.
  Be sure to configure your gRPC endpoint to listen on the Pod's IP address.
- Built-in probes do not support any authentication parameters (like `-tls`).
- There are no error codes for built-in probes. All errors are considered as probe failures.
- If `ExecProbeTimeout` feature gate is set to `false`, grpc-health-probe does **not** respect the `timeoutSeconds` setting (which defaults to 1s),
  while built-in probe would fail on timeout.
-->
- 內建探測器執行時針對的是 Pod 的 IP 地址，不像 `grpc-health-probe`
  那樣通常針對 `127.0.0.1` 執行探測；
  請一定配置你的 gRPC 端點使之監聽於 Pod 的 IP 地址之上。
- 內建探測器不支援任何身份認證引數（例如 `tls`）。
- 對於內建的探測器而言，不存在錯誤程式碼。所有錯誤都被視作探測失敗。
- 如果 `ExecProbeTimeout` 特性門控被設定為 `false`，則 `grpc-health-probe`
  不會考慮 `timeoutSeconds` 設定狀態（預設值為 1s），
  而內建探測器則會在超時時返回失敗。

<!--
## Use a named port

You can use a named
[ContainerPort](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerport-v1-core)
for HTTP or TCP liveness checks:
-->
## 使用命名埠 {#use-a-named-port}

對於 HTTP 或者 TCP 存活檢測可以使用命名的
[ContainerPort](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerport-v1-core)。

```yaml
ports:
- name: liveness-port
  containerPort: 8080
  hostPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
```

<!--
## Protect slow starting containers with startup probes {#define-startup-probes}

Sometimes, you have to deal with legacy applications that might require
an additional startup time on their first initialization.
In such cases, it can be tricky to set up liveness probe parameters without
compromising the fast response to deadlocks that motivated such a probe.
The trick is to set up a startup probe with the same command, HTTP or TCP
check, with a `failureThreshold * periodSeconds` long enough to cover the
worse case startup time.

So, the previous example would become:
-->
## 使用啟動探測器保護慢啟動容器 {#define-startup-probes}

有時候，會有一些現有的應用在啟動時需要較長的初始化時間。
要這種情況下，若要不影響對死鎖作出快速響應的探測，設定存活探測引數是要技巧的。
技巧就是使用相同的命令來設定啟動探測，針對 HTTP 或 TCP 檢測，可以透過將
`failureThreshold * periodSeconds` 引數設定為足夠長的時間來應對糟糕情況下的啟動時間。

這樣，前面的例子就變成了：

```yaml
ports:
- name: liveness-port
  containerPort: 8080
  hostPort: 8080

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
幸虧有啟動探測，應用程式將會有最多 5 分鐘（30 * 10 = 300s）的時間來完成其啟動過程。
一旦啟動探測成功一次，存活探測任務就會接管對容器的探測，對容器死鎖作出快速響應。
如果啟動探測一直沒有成功，容器會在 300 秒後被殺死，並且根據 `restartPolicy` 來
執行進一步處置。

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
## 定義就緒探測器 {#define-readiness-probes}

有時候，應用會暫時性地無法為請求提供服務。
例如，應用在啟動時可能需要載入大量的資料或配置檔案，或是啟動後要依賴等待外部服務。
在這種情況下，既不想殺死應用，也不想給它傳送請求。
Kubernetes 提供了就緒探測器來發現並緩解這些情況。
容器所在 Pod 上報還未就緒的資訊，並且不接受透過 Kubernetes Service 的流量。

<!--
Readiness probes runs on the container during its whole lifecycle.
-->
{{< note >}}
就緒探測器在容器的整個生命週期中保持執行狀態。
{{< /note >}}

<!--
Liveness probes *do not* wait for readiness probes to succeed. If you want to wait before executing a liveness probe you should use initialDelaySeconds or a startupProbe.
-->
{{< caution >}}
活躍探測器 **不等待** 就緒性探測器成功。
如果要在執行活躍探測器之前等待，應該使用 `initialDelaySeconds` 或 `startupProbe`。
{{< /caution >}}

<!--
Readiness probes are configured similarly to liveness probes. The only difference
is that you use the `readinessProbe` field instead of the `livenessProbe` field.
-->
就緒探測器的配置和存活探測器的配置相似。
唯一區別就是要使用 `readinessProbe` 欄位，而不是 `livenessProbe` 欄位。

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
HTTP 和 TCP 的就緒探測器配置也和存活探測器的配置完全相同。

就緒和存活探測可以在同一個容器上並行使用。
兩者都可以確保流量不會發給還未就緒的容器，當這些探測失敗時容器會被重新啟動。

<!--
## Configure Probes
-->
## 配置探測器 {#configure-probes}

<!--
Eventually, some of this section could be moved to a concept topic.
-->
{{< comment >}}
最後，本節的一些內容可以放到某個概念主題裡。
{{< /comment >}}

<!--
[Probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core) have a number of fields that
you can use to more precisely control the behavior of liveness and readiness
checks:
-->
[Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)
有很多配置欄位，可以使用這些欄位精確地控制活躍和就緒檢測的行為：

<!--
* `initialDelaySeconds`: Number of seconds after the container has started
before liveness or readiness probes are initiated. Defaults to 0 seconds. Minimum value is 0.
* `periodSeconds`: How often (in seconds) to perform the probe. Default to 10
seconds. Minimum value is 1.
* `timeoutSeconds`: Number of seconds after which the probe times out. Defaults
to 1 second. Minimum value is 1.
* `successThreshold`: Minimum consecutive successes for the probe to be
considered successful after having failed. Defaults to 1. Must be 1 for liveness
and startup Probes. Minimum value is 1.
* `failureThreshold`: When a probe fails, Kubernetes will
try `failureThreshold` times before giving up. Giving up in case of liveness probe means restarting the container. In case of readiness probe the Pod will be marked Unready.
Defaults to 3. Minimum value is 1.
-->
* `initialDelaySeconds`：容器啟動後要等待多少秒後才啟動存活和就緒探測器，
  預設是 0 秒，最小值是 0。
* `periodSeconds`：執行探測的時間間隔（單位是秒）。預設是 10 秒。最小值是 1。
* `timeoutSeconds`：探測的超時後等待多少秒。預設值是 1 秒。最小值是 1。
* `successThreshold`：探測器在失敗後，被視為成功的最小連續成功數。預設值是 1。
  存活和啟動探測的這個值必須是 1。最小值是 1。
* `failureThreshold`：當探測失敗時，Kubernetes 的重試次數。
  對存活探測而言，放棄就意味著重新啟動容器。
  對就緒探測而言，放棄意味著 Pod 會被打上未就緒的標籤。預設值是 3。最小值是 1。

{{< note >}}
<!--
Before Kubernetes 1.20, the field `timeoutSeconds` was not respected for exec probes:
probes continued running indefinitely, even past their configured deadline,
until a result was returned.
-->
在 Kubernetes 1.20 版本之前，`exec` 探針會忽略 `timeoutSeconds`：
探針會無限期地持續執行，甚至可能超過所配置的限期，直到返回結果為止。
 
<!--
This defect was corrected in Kubernetes v1.20. You may have been relying on the previous behavior,
even without realizing it, as the default timeout is 1 second.
As a cluster administrator, you can disable the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `ExecProbeTimeout` (set it to `false`)
on each kubelet to restore the  behavior from older versions, then remove that override
once all the exec probes in the cluster have a `timeoutSeconds` value set.  
If you have pods that are impacted from the default 1 second timeout,
you should update their probe timeout so that you're ready for the
eventual removal of that feature gate.
-->
這一缺陷在 Kubernetes v1.20 版本中得到修復。你可能一直依賴於之前錯誤的探測行為，
甚至都沒有覺察到這一問題的存在，因為預設的超時值是 1 秒鐘。
作為叢集管理員，你可以在所有的 kubelet 上禁用 `ExecProbeTimeout`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
（將其設定為 `false`），從而恢復之前版本中的執行行為。之後當叢集中所有的
exec 探針都設定了 `timeoutSeconds` 引數後，移除此標誌過載。
如果你有 Pod 受到此預設 1 秒鐘超時值的影響，你應該更新這些 Pod 對應的探針的超時值，
這樣才能為最終去除該特性門控做好準備。

<!--
With the fix of the defect, for exec probes, on Kubernetes `1.20+` with the `dockershim` container runtime,
the process inside the container may keep running even after probe returned failure because of the timeout.
-->
當此缺陷被修復之後，在使用 `dockershim` 容器執行時的 Kubernetes `1.20+`
版本中，對於 exec 探針而言，容器中的程序可能會因為超時值的設定保持持續執行，
即使探針返回了失敗狀態。
{{< /note >}}

{{< caution >}}
<!--
Incorrect implementation of readiness probes may result in an ever growing number
of processes in the container, and resource starvation if this is left unchecked.
-->
如果就緒態探針的實現不正確，可能會導致容器中程序的數量不斷上升。
如果不對其採取措施，很可能導致資源枯竭的狀況。
{{< /caution >}}

<!--
### HTTP probes

[HTTP probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
have additional fields that can be set on `httpGet`:

* `host`: Host name to connect to, defaults to the pod IP. You probably want to
set "Host" in httpHeaders instead.
* `scheme`: Scheme to use for connecting to the host (HTTP or HTTPS). Defaults to HTTP.
* `path`: Path to access on the HTTP server. Defaults to /.
* `httpHeaders`: Custom headers to set in the request. HTTP allows repeated headers.
* `port`: Name or number of the port to access on the container. Number must be
in the range 1 to 65535.
-->
### HTTP 探測  {#http-probes}

[HTTP Probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
允許針對 `httpGet` 配置額外的欄位：

* `host`：連線使用的主機名，預設是 Pod 的 IP。也可以在 HTTP 頭中設定 “Host” 來代替。
* `scheme` ：用於設定連線主機的方式（HTTP 還是 HTTPS）。預設是 "HTTP"。
* `path`：訪問 HTTP 服務的路徑。預設值為 "/"。
* `httpHeaders`：請求中自定義的 HTTP 頭。HTTP 頭欄位允許重複。
* `port`：訪問容器的埠號或者埠名。如果數字必須在 1～65535 之間。

<!--
For an HTTP probe, the kubelet sends an HTTP request to the specified path and
port to perform the check. The kubelet sends the probe to the pod's IP address,
unless the address is overridden by the optional `host` field in `httpGet`. If
`scheme` field is set to `HTTPS`, the kubelet sends an HTTPS request skipping the
certificate verification. In most scenarios, you do not want to set the `host` field.
Here's one scenario where you would set it. Suppose the container listens on 127.0.0.1
and the Pod's `hostNetwork` field is true. Then `host`, under `httpGet`, should be set
to 127.0.0.1. If your pod relies on virtual hosts, which is probably the more common
case, you should not use `host`, but rather set the `Host` header in `httpHeaders`.
-->
對於 HTTP 探測，kubelet 傳送一個 HTTP 請求到指定的路徑和埠來執行檢測。
除非 `httpGet` 中的 `host` 欄位設定了，否則 kubelet 預設是給 Pod 的 IP 地址傳送探測。
如果 `scheme` 欄位設定為了 `HTTPS`，kubelet 會跳過證書驗證傳送 HTTPS 請求。
大多數情況下，不需要設定`host` 欄位。
這裡有個需要設定 `host` 欄位的場景，假設容器監聽 127.0.0.1，並且 Pod 的 `hostNetwork` 
欄位設定為了 `true`。那麼 `httpGet` 中的 `host` 欄位應該設定為 127.0.0.1。
可能更常見的情況是如果 Pod 依賴虛擬主機，你不應該設定 `host` 欄位，而是應該在
`httpHeaders` 中設定 `Host`。

<!--
For an HTTP probe, the kubelet sends two request headers in addition to the mandatory `Host` header:
`User-Agent`, and `Accept`. The default values for these headers are `kube-probe/{{< skew latestVersion >}}`
(where `{{< skew latestVersion >}}` is the version of the kubelet ), and `*/*` respectively.

You can override the default headers by defining `.httpHeaders` for the probe; for example
-->
針對 HTTP 探針，kubelet 除了必需的 `Host` 頭部之外還發送兩個請求頭部欄位：
`User-Agent` 和 `Accept`。這些頭部的預設值分別是 `kube-probe/{{ skew latestVersion >}}`
（其中 `{{< skew latestVersion >}}` 是 kubelet 的版本號）和 `*/*`。

你可以透過為探測設定 `.httpHeaders` 來過載預設的頭部欄位值；例如：

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
你也可以透過將這些頭部欄位定義為空值，從請求中去掉這些頭部欄位。

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

<!--
### TCP probes

For a TCP probe, the kubelet makes the probe connection at the node, not in the pod, which
means that you can not use a service name in the `host` parameter since the kubelet is unable
to resolve it.
-->
### TCP 探測  {#tcp-probes}

對於 TCP 探測而言，kubelet 在節點上（不是在 Pod 裡面）發起探測連線，
這意味著你不能在 `host` 引數上配置服務名稱，因為 kubelet 不能解析服務名稱。

<!--
### Probe-level `terminationGracePeriodSeconds`
-->
### 探測器層面的 `terminationGracePeriodSeconds`

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

<!--
Prior to release 1.21, the pod-level `terminationGracePeriodSeconds` was used
for terminating a container that failed its liveness or startup probe. This
coupling was unintended and may have resulted in failed containers taking an
unusually long time to restart when a pod-level `terminationGracePeriodSeconds`
was set.
-->
在 1.21 發行版之前，Pod 層面的 `terminationGracePeriodSeconds`
被用來終止活躍探測或啟動探測失敗的容器。
這一行為上的關聯不是我們想要的，可能導致 Pod 層面設定了 `terminationGracePeriodSeconds`
時容器要花非常長的時間才能重新啟動。

<!--
In 1.21 and beyond, when the feature gate `ProbeTerminationGracePeriod` is
enabled, users can specify a probe-level `terminationGracePeriodSeconds` as
part of the probe specification. When the feature gate is enabled, and both a
pod- and probe-level `terminationGracePeriodSeconds` are set, the kubelet will
use the probe-level value.
-->
在 1.21 及更高版本中，當特性門控 `ProbeTerminationGracePeriod` 被啟用時，
使用者可以指定一個探測器層面的 `terminationGracePeriodSeconds` 作為探測器規約的一部分。
當該特性門控被啟用，並且 Pod 層面和探測器層面的 `terminationGracePeriodSeconds`
都已設定，kubelet 將使用探測器層面設定的值。

<!--
As of Kubernetes 1.22, the `ProbeTerminationGracePeriod` feature gate is only
available on the API Server. The kubelet always honors the probe-level
`terminationGracePeriodSeconds` field if it is present on a Pod.
-->
在 Kubernetes 1.22 中，`ProbeTerminationGracePeriod` 特性門控只能用在 API 伺服器上。
kubelet 始終遵守探針級別 `terminationGracePeriodSeconds` 欄位
（如果它存在於 Pod 上）。

<!--
If you have existing Pods where the `terminationGracePeriodSeconds` field is set and
you no longer wish to use per-probe termination grace periods, you must delete
those existing Pods.
-->
如果你已經為現有 Pod 設定了 `terminationGracePeriodSeconds`
欄位並且不再希望使用針對每個探針的終止寬限期，則必須刪除現有的這類 Pod。

<!--
When you (or the control plane, or some other component) create replacement
Pods, and the feature gate `ProbeTerminationGracePeriod` is disabled, then the
API server ignores the Pod-level `terminationGracePeriodSeconds` field, even if
a Pod or pod template specifies it.
-->
當你（或控制平面或某些其他元件）建立替換 Pod，並且特性門控 `ProbeTerminationGracePeriod`
被禁用時，API 伺服器會忽略 Pod 級別的 `terminationGracePeriodSeconds` 欄位設定，
即使 Pod 或 Pod 模板指定了它。

例如:

```yaml
spec:
  terminationGracePeriodSeconds: 3600  # pod-level
  containers:
  - name: test
    image: ...

    ports:
    - name: liveness-port
      containerPort: 8080
      hostPort: 8080

    livenessProbe:
      httpGet:
        path: /healthz
        port: liveness-port
      failureThreshold: 1
      periodSeconds: 60
      # Override pod-level terminationGracePeriodSeconds #
      terminationGracePeriodSeconds: 60
```

<!--
Probe-level `terminationGracePeriodSeconds` cannot be set for readiness probes.
It will be rejected by the API server.
-->
探測器層面的 `terminationGracePeriodSeconds` 不能用於就緒態探針。
這一設定將被 API 伺服器拒絕。

## {{% heading "whatsnext" %}}

<!--
* Learn more about
[Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).
-->
* 進一步瞭解[容器探針](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。

<!--
You can also read the API references for:

* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)
-->
你也可以閱讀以下的 API 參考資料：

* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)

