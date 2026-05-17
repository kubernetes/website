---
title: 配置存活、就绪和启动探针
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
This page shows how to configure liveness, readiness and startup probes for
containers.
-->
本页展示了如何配置容器的存活、就绪和启动探针。

<!--
For more information about probes, see
[Liveness, Readiness and Startup Probes](/docs/concepts/configuration/liveness-readiness-startup-probes).
-->
有关探测的更多信息，请参阅[存活、就绪和启动探针](/zh-cn/docs/concepts/configuration/liveness-readiness-startup-probes)。

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
## 定义存活命令 {#define-a-liveness-command}

许多长时间运行的应用最终会进入损坏状态，除非重新启动，否则无法被恢复。
Kubernetes 提供了存活探针来发现并处理这种情况。

在本练习中，你会创建一个 Pod，其中运行一个基于 `registry.k8s.io/busybox:1.27.2` 镜像的容器。
下面是这个 Pod 的配置文件。

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
在这个配置文件中，可以看到 Pod 中只有一个 `Container`。
`periodSeconds` 字段指定了 kubelet 应该每 5 秒执行一次存活探测。
`initialDelaySeconds` 字段告诉 kubelet 在执行第一次探测前应该等待 5 秒。
kubelet 在容器内执行命令 `cat /tmp/healthy` 来进行探测。
如果命令执行成功并且返回值为 0，kubelet 就会认为这个容器是健康存活的。
如果这个命令返回非 0 值，kubelet 会杀死这个容器并重新启动它。

当容器启动时，执行如下的命令：

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600"
```

<!--
For the first 30 seconds of the container's life, there is a `/tmp/healthy` file.
So during the first 30 seconds, the command `cat /tmp/healthy` returns a success
code. After 30 seconds, `cat /tmp/healthy` returns a failure code.

Create the Pod:
-->
这个容器生命的前 30 秒，`/tmp/healthy` 文件是存在的。
所以在这最开始的 30 秒内，执行命令 `cat /tmp/healthy` 会返回成功代码。
30 秒之后，执行命令 `cat /tmp/healthy` 就会返回失败代码。

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

<!--
Within 30 seconds, view the Pod events:
-->
在 30 秒内，查看 Pod 的事件：

```shell
kubectl describe pod liveness-exec
```

<!--
The output indicates that no liveness probes have failed yet:
-->
输出结果表明还没有存活探针失败：

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
35 秒之后，再来看 Pod 的事件：

```shell
kubectl describe pod liveness-exec
```

<!--
At the bottom of the output, there are messages indicating that the liveness
probes have failed, and the failed containers have been killed and recreated.
-->
在输出结果的最下面，有信息显示存活探针失败了，这个失败的容器被杀死并且被重建了。

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
再等 30 秒，确认这个容器被重启了：

```shell
kubectl get pod liveness-exec
```

<!--
The output shows that `RESTARTS` has been incremented. Note that the `RESTARTS` counter
increments as soon as a failed container comes back to the running state:
-->
输出结果显示 `RESTARTS` 的值增加了 1。
请注意，一旦失败的容器恢复为运行状态，`RESTARTS` 计数器就会增加 1：

```none
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

<!--
## Define a liveness HTTP request

Another kind of liveness probe uses an HTTP GET request. Here is the configuration
file for a Pod that runs a container based on the `registry.k8s.io/e2e-test-images/agnhost` image.
-->
## 定义一个存活态 HTTP 请求接口 {#define-a-liveness-HTTP-request}

另外一种类型的存活探测方式是使用 HTTP GET 请求。
下面是一个 Pod 的配置文件，其中运行一个基于 `registry.k8s.io/e2e-test-images/agnhost` 镜像的容器。

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
在这个配置文件中，你可以看到 Pod 也只有一个容器。
`periodSeconds` 字段指定了 kubelet 每隔 3 秒执行一次存活探测。
`initialDelaySeconds` 字段告诉 kubelet 在执行第一次探测前应该等待 3 秒。
kubelet 会向容器内运行的服务（服务在监听 8080 端口）发送一个 HTTP GET 请求来执行探测。
如果服务器上 `/healthz` 路径下的处理程序返回成功代码，则 kubelet 认为容器是健康存活的。
如果处理程序返回失败代码，则 kubelet 会杀死这个容器并将其重启。

<!--
Any code greater than or equal to 200 and less than 400 indicates success. Any
other code indicates failure.

You can see the source code for the server in
[server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go).

For the first 10 seconds that the container is alive, the `/healthz` handler
returns a status of 200. After that, the handler returns a status of 500.
-->
返回大于或等于 200 并且小于 400 的任何代码都标示成功，其它返回代码都标示失败。

你可以访问 [`server.go`](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go)
阅读服务的源码。

容器存活期间的最开始 10 秒中，`/healthz` 处理程序返回 200 的状态码。
之后处理程序返回 500 的状态码。

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
kubelet 在容器启动之后 3 秒开始执行健康检查。所以前几次健康检查都是成功的。
但是 10 秒之后，健康检查会失败，并且 kubelet 会杀死容器再重新启动容器。

创建一个 Pod 来测试 HTTP 的存活检测：

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

<!--
After 10 seconds, view Pod events to verify that liveness probes have failed and
the container has been restarted:
-->
10 秒之后，通过查看 Pod 事件来确认存活探针已经失败，并且容器被重新启动了。

```shell
kubectl describe pod liveness-http
```

<!--
In releases after v1.13, local HTTP proxy environment variable settings do not
affect the HTTP liveness probe.
-->
在 1.13 之后的版本中，设置本地的 HTTP 代理环境变量不会影响 HTTP 的存活探测。

<!--
## Define a TCP liveness probe

A third type of liveness probe uses a TCP socket. With this configuration, the
kubelet will attempt to open a socket to your container on the specified port.
If it can establish a connection, the container is considered healthy, if it
can't it is considered a failure.
-->
## 定义 TCP 的存活探测 {#define-a-TCP-liveness-probe}

第三种类型的存活探测是使用 TCP 套接字。
使用这种配置时，kubelet 会尝试在指定端口和容器建立套接字链接。
如果能建立连接，这个容器就被看作是健康的，如果不能则这个容器就被看作是有问题的。

{{% code_sample file="pods/probe/tcp-liveness-readiness.yaml" %}}

<!--
As you can see, configuration for a TCP check is quite similar to an HTTP check.
This example uses both readiness and liveness probes. The kubelet will run the
first liveness probe 15 seconds after the container starts. This will attempt to
connect to the `goproxy` container on port 8080. If the liveness probe fails,
the container will be restarted. The kubelet will continue to run this check
every 10 seconds.
-->
如你所见，TCP 检测的配置和 HTTP 检测非常相似。
下面这个例子同时使用就绪探针和存活探针。kubelet 会在容器启动 15 秒后运行第一次存活探测。
此探测会尝试连接 `goproxy` 容器的 8080 端口。
如果此存活探测失败，容器将被重启。kubelet 将继续每隔 10 秒运行一次这种探测。

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
除了存活探针，这个配置还包括一个就绪探针。
kubelet 会在容器启动 15 秒后运行第一次就绪探测。
与存活探测类似，就绪探测会尝试连接 `goproxy` 容器的 8080 端口。
如果就绪探测失败，Pod 将被标记为未就绪，且不会接收来自任何服务的流量。

要尝试 TCP 存活检测，运行以下命令创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

<!--
After 15 seconds, view Pod events to verify that liveness probes:
-->
15 秒之后，通过查看 Pod 事件来检测存活探针：

```shell
kubectl describe pod goproxy
```

<!--
## Define a gRPC liveness probe
-->
## 定义 gRPC 存活探针 {#define-a-grpc-liveness-probe}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

<!--
If your application implements the
[gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md),
this example shows how to configure Kubernetes to use it for application liveness checks.
Similarly you can configure readiness and startup probes.

Here is an example manifest:
-->
如果你的应用实现了
[gRPC 健康检查协议](https://github.com/grpc/grpc/blob/master/doc/health-checking.md)，
这个例子展示了如何配置 Kubernetes 以将其用于应用的存活性检查。
类似地，你可以配置就绪探针和启动探针。

下面是一个示例清单：

{{% code_sample file="pods/probe/grpc-liveness.yaml" %}}

<!--
To try the gRPC liveness check, create a Pod using the command below.
In the example below, the etcd pod is configured to use gRPC liveness probe.
-->
要尝试 gRPC 存活检查，请使用以下命令创建一个 Pod。
在下面的示例中，etcd Pod 配置为使用 gRPC 存活探针。

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/grpc-liveness.yaml
```

<!--
After 15 seconds, view Pod events to verify that the liveness check has not failed:
-->
15 秒钟之后，查看 Pod 事件确认存活性检查并未失败：

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
当使用 gRPC 探针时，需要注意以下一些技术细节：

- 这些探针运行时针对的是 Pod 的 IP 地址或其主机名。
  请一定配置你的 gRPC 端点使之监听于 Pod 的 IP 地址之上。
- 这些探针不支持任何身份认证参数（例如 `-tls`）。
- 对于内置的探针而言，不存在错误代码。所有错误都被视作探测失败。
- 如果 `ExecProbeTimeout` 特性门控被设置为 `false`，则 `grpc-health-probe`
  不会考虑 `timeoutSeconds` 设置状态（默认值为 `1s`），
  而内置探针则会在超时时返回失败。

<!--
## Use a named port

You can use a named [`port`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#ports)
for HTTP and TCP probes. (gRPC probes do not support named ports).

For example:
-->
## 使用命名端口 {#use-a-named-port}

对于 HTTP 和 TCP 存活检测可以使用命名的
[`port`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#ports)
（gRPC 探针不支持使用命名端口）。

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
## 使用启动探针保护慢启动容器 {#define-startup-probes}

有时候，会有一些现有的应用在启动时需要较长的初始化时间。
在这种情况下，若要不影响对死锁作出快速响应的探测，设置存活探测参数是要技巧的。
解决办法是使用相同的命令来设置启动探测，针对 HTTP 或 TCP 检测，可以通过将
`failureThreshold * periodSeconds` 参数设置为足够长的时间来应对最糟糕情况下的启动时间。

这样，前面的例子就变成了：

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
幸亏有启动探测，应用将会有最多 5 分钟（30 * 10 = 300s）的时间来完成其启动过程。
一旦启动探测成功一次，存活探测任务就会接管对容器的探测，对容器死锁作出快速响应。
如果启动探测一直没有成功，容器会在 300 秒后被杀死，并且根据 `restartPolicy`
来执行进一步处置。

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
## 定义就绪探针 {#define-readiness-probes}

有时候，应用会暂时性地无法为请求提供服务。
例如，应用在启动时可能需要加载大量的数据或配置文件，或是启动后要依赖等待外部服务。
在这种情况下，既不想杀死应用，也不想给它发送请求。
Kubernetes 提供了就绪探针来发现并缓解这些情况。
容器所在 Pod 上报还未就绪的信息，并且不接受通过 Kubernetes Service 的流量。

{{< note >}}
<!--
Readiness probes run on the container during its whole lifecycle.
-->
就绪探针在容器的整个生命周期中保持运行状态。
{{< /note >}}

{{< caution >}}
<!--
The readiness and liveness probes do not depend on each other to succeed.
If you want to wait before executing a readiness probe, you should use
`initialDelaySeconds` or a `startupProbe`.
-->
存活探针与就绪性探针相互间不等待对方成功。
如果要在执行就绪性探针之前等待，应该使用 `initialDelaySeconds` 或 `startupProbe`。
{{< /caution >}}

<!--
Readiness probes are configured similarly to liveness probes. The only difference
is that you use the `readinessProbe` field instead of the `livenessProbe` field.
-->
就绪探针的配置和存活探针的配置相似。
唯一区别就是要使用 `readinessProbe` 字段，而不是 `livenessProbe` 字段。

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
HTTP 和 TCP 的就绪探针配置也和存活探针的配置完全相同。

## {{% heading "whatsnext" %}}

<!--
* Learn more about
  [Liveness, Readiness and Startup Probes](/docs/concepts/configuration/liveness-readiness-startup-probes/).
* For the full specification of probe-related fields, see the API reference:
  [Pod](/docs/reference/kubernetes-api/workload-resources/pod-v1/),
  [Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container),
  [Probe](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
-->
* 进一步了解关于[存活、就绪和启动探针](/zh-cn/docs/concepts/configuration/liveness-readiness-startup-probes/)的信息。
* 有关探针相关字段的完整规范，请参阅 API 参考：
  * [Pod](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/)
  * [Container](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
  * [Probe](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
