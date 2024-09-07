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
This page shows how to configure liveness, readiness and startup probes for containers.

For more information about probes, see [Liveness, Readiness and Startup Probes](/docs/concepts/configuration/liveness-readiness-startup-probes)

The [kubelet](/docs/reference/command-line-tools-reference/kubelet/) uses
liveness probes to know when to restart a container. For example, liveness
probes could catch a deadlock, where an application is running, but unable to
make progress. Restarting a container in such a state can help to make the
application more available despite bugs.
-->
这篇文章介绍如何给容器配置存活（Liveness）、就绪（Readiness）和启动（Startup）探针。

有关探针的更多信息，
请参阅[存活、就绪和启动探针](/zh-cn/docs/concepts/configuration/liveness-readiness-startup-probes)。

[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
使用存活探针来确定什么时候要重启容器。
例如，存活探针可以探测到应用死锁（应用在运行，但是无法继续执行后面的步骤）情况。
重启这种状态下的容器有助于提高应用的可用性，即使其中存在缺陷。

<!--
A common pattern for liveness probes is to use the same low-cost HTTP endpoint
s for readiness probes, but with a higher failureThreshold. This ensures that the pod
is observed as not-ready for some period of time before it is hard killed.
-->
存活探针的常见模式是为就绪探针使用相同的低成本 HTTP 端点，但具有更高的 failureThreshold。
这样可以确保在硬性终止 Pod 之前，将观察到 Pod 在一段时间内处于非就绪状态。

<!--
The kubelet uses readiness probes to know when a container is ready to start
accepting traffic. A Pod is considered ready when all of its containers are ready.
One use of this signal is to control which Pods are used as backends for Services.
When a Pod is not ready, it is removed from Service load balancers.

The kubelet uses startup probes to know when a container application has started.
If such a probe is configured, liveness and readiness probes do not start until
it succeeds, making sure those probes don't interfere with the application startup.
This can be used to adopt liveness checks on slow starting containers, avoiding them
getting killed by the kubelet before they are up and running.
-->
kubelet 使用就绪探针可以知道容器何时准备好接受请求流量，当一个 Pod
内的所有容器都就绪时，才能认为该 Pod 就绪。
这种信号的一个用途就是控制哪个 Pod 作为 Service 的后端。
若 Pod 尚未就绪，会被从 Service 的负载均衡器中剔除。

kubelet 使用启动探针来了解应用容器何时启动。
如果配置了这类探针，存活探针和就绪探针在启动探针成功之前不会启动，从而确保存活探针或就绪探针不会影响应用的启动。
启动探针可以用于对慢启动容器进行存活性检测，避免它们在启动运行之前就被杀掉。

{{< caution >}}
<!--
Liveness probes can be a powerful way to recover from application failures, but
they should be used with caution. Liveness probes must be configured carefully
to ensure that they truly indicate unrecoverable application failure, for example a deadlock.
-->
存活探针是一种从应用故障中恢复的强劲方式，但应谨慎使用。
你必须仔细配置存活探针，确保它能真正标示出不可恢复的应用故障，例如死锁。
{{< /caution >}}

{{< note >}}
<!--
Incorrect implementation of liveness probes can lead to cascading failures. This results in
restarting of container under high load; failed client requests as your application became less
scalable; and increased workload on remaining pods due to some failed pods.
Understand the difference between readiness and liveness probes and when to apply them for your app.
-->
错误的存活探针可能会导致级联故障。
这会导致在高负载下容器重启；例如由于应用无法扩展，导致客户端请求失败；以及由于某些
Pod 失败而导致剩余 Pod 的工作负载增加。了解就绪探针和存活探针之间的区别，
以及何时为应用配置使用它们非常重要。
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
`registry.k8s.io/busybox` image. Here is the configuration file for the Pod:
-->
## 定义存活命令 {#define-a-liveness-command}

许多长时间运行的应用最终会进入损坏状态，除非重新启动，否则无法被恢复。
Kubernetes 提供了存活探针来发现并处理这种情况。

在本练习中，你会创建一个 Pod，其中运行一个基于 `registry.k8s.io/busybox` 镜像的容器。
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
Normal  Pulling    9s    kubelet, node01    Pulling image "registry.k8s.io/busybox"
Normal  Pulled     7s    kubelet, node01    Successfully pulled image "registry.k8s.io/busybox"
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
Normal   Pulling    55s                kubelet, node01    Pulling image "registry.k8s.io/busybox"
Normal   Pulled     53s                kubelet, node01    Successfully pulled image "registry.k8s.io/busybox"
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

你可以访问 [server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go)
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
要使用 gRPC 探针，必须配置 `port` 属性。
如果要区分不同类型的探针和不同功能的探针，可以使用 `service` 字段。
你可以将 `service` 设置为 `liveness`，并使你的 gRPC
健康检查端点对该请求的响应与将 `service` 设置为 `readiness` 时不同。
这使你可以使用相同的端点进行不同类型的容器健康检查而不是监听两个不同的端口。
如果你想指定自己的自定义服务名称并指定探测类型，Kubernetes
项目建议你使用使用一个可以关联服务和探测类型的名称来命名。
例如：`myservice-liveness`（使用 `-` 作为分隔符）。

{{< note >}}
<!--
Unlike HTTP or TCP probes, you cannot specify the health check port by name, and you
cannot configure a custom hostname.
-->
与 HTTP 或 TCP 探针不同，gRPC 探测不能按名称指定健康检查端口，
也不能自定义主机名。
{{< /note >}}

<!--
Configuration problems (for example: incorrect port or service, unimplemented health checking protocol)
are considered a probe failure, similar to HTTP and TCP probes.

To try the gRPC liveness check, create a Pod using the command below.
In the example below, the etcd pod is configured to use gRPC liveness probe.
-->
配置问题（例如：错误的 `port` 或 `service`、未实现健康检查协议）
都被认作是探测失败，这一点与 HTTP 和 TCP 探针类似。

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
  不会考虑 `timeoutSeconds` 设置状态（默认值为 1s），
  而内置探针则会在超时时返回失败。

<!--
## Use a named port

You can use a named [`port`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#ports)
for HTTP and TCP probes. (gRPC probes do not support named ports).

For example:
-->
## 使用命名端口 {#use-a-named-port}

对于 HTTP 和 TCP 存活检测可以使用命名的
[`port`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#ports)（gRPC 探针不支持使用命名端口）。

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
Readiness probes runs on the container during its whole lifecycle.
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

就绪和存活探测可以在同一个容器上并行使用。
两者共同使用，可以确保流量不会发给还未就绪的容器，当这些探测失败时容器会被重新启动。

<!--
## Configure Probes
-->
## 配置探针 {#configure-probes}

<!--Eventually, some of this section could be moved to a concept topic.-->

<!--
[Probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)
have a number of fields that you can use to more precisely control the behavior of startup,
liveness and readiness checks:
-->
[Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)
有很多配置字段，可以使用这些字段精确地控制启动、存活和就绪检测的行为：

<!--
* `initialDelaySeconds`: Number of seconds after the container has started before startup,
  liveness or readiness probes are initiated. If a startup  probe is defined, liveness and
  readiness probe delays do not begin until the startup probe has succeeded. If the value of
  `periodSeconds` is greater than `initialDelaySeconds` then the `initialDelaySeconds` will be
  ignored. Defaults to 0 seconds. Minimum value is 0.
* `periodSeconds`: How often (in seconds) to perform the probe. Default to 10 seconds.
  The minimum value is 1.
* `timeoutSeconds`: Number of seconds after which the probe times out.
  Defaults to 1 second. Minimum value is 1.
* `successThreshold`: Minimum consecutive successes for the probe to be considered successful
  after having failed. Defaults to 1. Must be 1 for liveness and startup Probes.
  Minimum value is 1.
-->
* `initialDelaySeconds`：容器启动后要等待多少秒后才启动启动、存活和就绪探针。
  如果定义了启动探针，则存活探针和就绪探针的延迟将在启动探针已成功之后才开始计算。
  如果 `periodSeconds` 的值大于 `initialDelaySeconds`，则 `initialDelaySeconds`
  将被忽略。默认是 0 秒，最小值是 0。
* `periodSeconds`：执行探测的时间间隔（单位是秒）。默认是 10 秒。最小值是 1。
* `timeoutSeconds`：探测的超时后等待多少秒。默认值是 1 秒。最小值是 1。
* `successThreshold`：探针在失败后，被视为成功的最小连续成功数。默认值是 1。
  存活和启动探测的这个值必须是 1。最小值是 1。
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
* `failureThreshold`：探针连续失败了 `failureThreshold` 次之后，
  Kubernetes 认为总体上检查已失败：容器状态未就绪、不健康、不活跃。
  默认值为 3，最小值为 1。
  对于启动探针或存活探针而言，如果至少有 `failureThreshold` 个探针已失败，
  Kubernetes 会将容器视为不健康并为这个特定的容器触发重启操作。
  kubelet 遵循该容器的 `terminationGracePeriodSeconds` 设置。
  对于失败的就绪探针，kubelet 继续运行检查失败的容器，并继续运行更多探针；
  因为检查失败，kubelet 将 Pod 的 `Ready`
  [状况](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)设置为 `false`。
<!--
* `terminationGracePeriodSeconds`: configure a grace period for the kubelet to wait between
  triggering a shut down of the failed container, and then forcing the container runtime to stop
  that container.
  The default is to inherit the Pod-level value for `terminationGracePeriodSeconds`
  (30 seconds if not specified), and the minimum value is 1.
  See [probe-level `terminationGracePeriodSeconds`](#probe-level-terminationgraceperiodseconds)
  for more detail.
-->
* `terminationGracePeriodSeconds`：为 kubelet
  配置从为失败的容器触发终止操作到强制容器运行时停止该容器之前等待的宽限时长。
  默认值是继承 Pod 级别的 `terminationGracePeriodSeconds` 值（如果不设置则为 30 秒），最小值为 1。
  更多细节请参见[探针级别 `terminationGracePeriodSeconds`](#probe-level-terminationgraceperiodseconds)。

{{< caution >}}
<!--
Incorrect implementation of readiness probes may result in an ever growing number
of processes in the container, and resource starvation if this is left unchecked.
-->
如果就绪态探针的实现不正确，可能会导致容器中进程的数量不断上升。
如果不对其采取措施，很可能导致资源枯竭的状况。
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
### HTTP 探测  {#http-probes}

[HTTP Probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
允许针对 `httpGet` 配置额外的字段：

* `host`：连接使用的主机名，默认是 Pod 的 IP。也可以在 HTTP 头中设置 "Host" 来代替。
* `scheme`：用于设置连接主机的方式（HTTP 还是 HTTPS）。默认是 "HTTP"。
* `path`：访问 HTTP 服务的路径。默认值为 "/"。
* `httpHeaders`：请求中自定义的 HTTP 头。HTTP 头字段允许重复。
* `port`：访问容器的端口号或者端口名。如果数字必须在 1～65535 之间。

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
对于 HTTP 探测，kubelet 发送一个 HTTP 请求到指定的端口和路径来执行检测。
除非 `httpGet` 中的 `host` 字段设置了，否则 kubelet 默认是给 Pod 的 IP 地址发送探测。
如果 `scheme` 字段设置为了 `HTTPS`，kubelet 会跳过证书验证发送 HTTPS 请求。
大多数情况下，不需要设置 `host` 字段。
这里有个需要设置 `host` 字段的场景，假设容器监听 127.0.0.1，并且 Pod 的 `hostNetwork`
字段设置为了 `true`。那么 `httpGet` 中的 `host` 字段应该设置为 127.0.0.1。
可能更常见的情况是如果 Pod 依赖虚拟主机，你不应该设置 `host` 字段，而是应该在
`httpHeaders` 中设置 `Host`。

<!--
For an HTTP probe, the kubelet sends two request headers in addition to the mandatory `Host` header:
- `User-Agent`: The default value is `kube-probe/{{< skew currentVersion >}}`,
  where `{{< skew currentVersion >}}` is the version of the kubelet.
- `Accept`: The default value is `*/*`.

You can override the default headers by defining `httpHeaders` for the probe.
For example
-->
针对 HTTP 探针，kubelet 除了必需的 `Host` 头部之外还发送两个请求头部字段：
- `User-Agent`：默认值是 `kube-probe/{{< skew currentVersion >}}`，其中 `{{< skew currentVersion >}}` 是 kubelet 的版本号。
- `Accept`：默认值 `*/*`。

你可以通过为探测设置 `httpHeaders` 来重载默认的头部字段值。例如：

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
你也可以通过将这些头部字段定义为空值，从请求中去掉这些头部字段。

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
当 kubelet 使用 HTTP 探测 Pod 时，仅当重定向到同一主机时，它才会遵循重定向。
如果 kubelet 在探测期间收到 11 个或更多重定向，则认为探测成功并创建相关事件：

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
如果 kubelet 收到主机名与请求不同的重定向，则探测结果将被视为成功，并且
kubelet 将创建一个事件来报告重定向失败。
{{< /note >}}

<!--
### TCP probes

For a TCP probe, the kubelet makes the probe connection at the node, not in the Pod, which
means that you can not use a service name in the `host` parameter since the kubelet is unable
to resolve it.
-->
### TCP 探测  {#tcp-probes}

对于 TCP 探测而言，kubelet 在节点上（不是在 Pod 里面）发起探测连接，
这意味着你不能在 `host` 参数上配置服务名称，因为 kubelet 不能解析服务名称。

<!--
### Probe-level `terminationGracePeriodSeconds`
-->
### 探针层面的 `terminationGracePeriodSeconds`

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

<!--
In 1.25 and above, users can specify a probe-level `terminationGracePeriodSeconds`
as part of the probe specification. When both a pod- and probe-level
`terminationGracePeriodSeconds` are set, the kubelet will use the probe-level value.
-->
在 1.25 及以上版本中，用户可以指定一个探针层面的 `terminationGracePeriodSeconds`
作为探针规约的一部分。
当 Pod 层面和探针层面的 `terminationGracePeriodSeconds`
都已设置，kubelet 将使用探针层面设置的值。

<!--
When setting the `terminationGracePeriodSeconds`, please note the following:

* The kubelet always honors the probe-level `terminationGracePeriodSeconds` field if 
  it is present on a Pod.
-->
当设置 `terminationGracePeriodSeconds` 时，请注意以下事项：

* kubelet 始终优先选用探针级别 `terminationGracePeriodSeconds` 字段
  （如果它存在于 Pod 上）。

<!--
* If you have existing Pods where the `terminationGracePeriodSeconds` field is set and
  you no longer wish to use per-probe termination grace periods, you must delete
  those existing Pods.
-->
* 如果你已经为现有 Pod 设置了 `terminationGracePeriodSeconds`
  字段并且不再希望使用针对每个探针的终止宽限期，则必须删除现有的这类 Pod。

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
  terminationGracePeriodSeconds: 3600  # Pod 级别设置
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
      # 重载 Pod 级别的 terminationGracePeriodSeconds
      terminationGracePeriodSeconds: 60
```

<!--
Probe-level `terminationGracePeriodSeconds` cannot be set for readiness probes.
It will be rejected by the API server.
-->
探针层面的 `terminationGracePeriodSeconds` 不能用于就绪态探针。
这一设置将被 API 服务器拒绝。

## {{% heading "whatsnext" %}}

<!--
* Learn more about
  [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).
-->
* 进一步了解[容器探针](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。

<!--
You can also read the API references for:

* [Pod](/docs/reference/kubernetes-api/workload-resources/pod-v1/), and specifically:
  * [container(s)](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
  * [probe(s)](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
-->
你也可以阅读以下的 API 参考资料：

* [Pod](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/)，尤其是：
  * [container](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
  * [probe](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
