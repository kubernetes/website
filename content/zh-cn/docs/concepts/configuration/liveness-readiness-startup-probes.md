---
title: 存活、就绪和启动探针
content_type: concept
weight: 40
math: true
---
<!--
title: Liveness, Readiness, and Startup Probes
content_type: concept
weight: 40
math: true
-->

<!-- overview -->

<!--
Kubernetes lets you define _probes_ to continuously monitor the health
of containers in a Pod. A probe is a diagnostic performed periodically
by the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} on a container.
To perform a diagnostic, the kubelet either executes code within
the container or makes a network request.
-->
Kubernetes 允许你定义**探针（Probe）**来持续监控 Pod 中容器的健康状况。
探针是由 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
对容器周期性执行的诊断。
为执行诊断，kubelet 或是在容器内执行代码，或是发起一个网络请求。

<!--
Based on the probe results, Kubernetes can restart unhealthy containers
or stop sending traffic to containers that are not ready.
-->
根据探针的结果，Kubernetes 可以重启不健康的容器，或者停止向尚未就绪的容器发送流量。

<!-- body -->

<!--
## Types of probe {#types-of-probe}

The kubelet can optionally perform and react to three kinds of probes on running
containers, each serving a different purpose:

- [Startup probe](#startup-probe)
- [Liveness probe](#liveness-probe)
- [Readiness probe](#readiness-probe)
-->
## 探针的类型   {#types-of-probe}

kubelet 可以选择对运行中的容器执行三种探针，并对探针的结果作出响应；
每种探针有不同的用途：

- [启动探针](#startup-probe)
- [存活探针](#liveness-probe)
- [就绪探针](#readiness-probe)

<!--
### Startup probe {#startup-probe}

Startup probes verify whether the application within a container is started.
If a startup probe is configured, Kubernetes does not execute liveness or
readiness probes until the startup probe succeeds, allowing the application
time to finish its initialization.
-->
### 启动探针   {#startup-probe}

启动探针（Startup Probe）用于检查容器内的应用是否已经启动。
如果配置了启动探针，Kubernetes 将在启动探针成功之前不执行存活探针或就绪探针，
从而为应用留出足够的时间完成初始化。

<!--
This type of probe is only executed at startup, unlike liveness and readiness
probes, which are run periodically.
If the startup probe fails, the kubelet kills the container, and the container
is subjected to its [restart policy](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy).
-->
启动探针仅在启动时执行，不像存活探针和就绪探针那样周期性地运行。
如果启动探针失败，kubelet 将杀死容器，容器随后将依据其
[重启策略](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)进行处理。

<!--
### Liveness probe {#liveness-probe}

Liveness probes determine when to restart a container.
For example, liveness probes could catch a deadlock, where an application is
running, but unable to make progress. Restarting a container in such a state
can help to make the application more available despite bugs.
-->
### 存活探针   {#liveness-probe}

存活探针（Liveness Probe）决定何时重启容器。
例如，存活探针可以捕获死锁——即应用在运行但无法取得进展。
在此类情况下重启容器，有助于提高应用的可用性，即使应用本身存在缺陷。

<!--
If a container fails its liveness probe more times than the configured tolerance,
the kubelet restarts that container.
Liveness probes do not wait for readiness probes to succeed. If you want to
wait before executing a liveness probe, you can either define
`initialDelaySeconds` or use a [startup probe](#startup-probe).
-->
如果某容器的存活探针失败次数超过配置的容忍次数，kubelet 将重启该容器。
存活探针不会等待就绪探针成功。如果你希望在执行存活探针之前先等待，
可以定义 `initialDelaySeconds`，或者使用[启动探针](#startup-probe)。

{{< caution >}}
<!--
Liveness probes can be a powerful way to recover from application failures,
but they should be used with caution.
Liveness probes must be configured carefully to ensure that they truly indicate
unrecoverable application failure, for example a deadlock.
-->
存活探针是从应用故障中恢复的有效手段，但应谨慎使用。
存活探针必须经过仔细配置，确保其真正能够指示不可恢复的应用故障，例如死锁。

<!--
Incorrect implementation of liveness probes can lead to cascading failures.
This results in restarting of container under high load; failed client requests
as your application became less scalable; and increased workload on remaining
pods due to some failed pods. Understand the difference between liveness and
readiness probes and when to apply them for your app.
-->
错误地实现存活探针可能导致级联故障。这会引发容器在高负载下被重启、
客户端请求因应用可伸缩性下降而失败，以及由于某些 Pod 失败导致剩余 Pod 工作负载增加等问题。
请理解存活探针和就绪探针之间的区别，并明确何时为你的应用使用它们。
{{< /caution >}}

<!--
### Readiness probe {#readiness-probe}

Readiness probes determine when a container is ready to accept traffic.
This is useful when waiting for an application to perform time-consuming initial
tasks, such as establishing network connections, loading files, and warming
caches.
Readiness probes can also be useful later in the container’s lifecycle,
for example, when recovering from temporary faults or overloads.
-->
### 就绪探针   {#readiness-probe}

就绪探针（Readiness Probe）决定容器何时准备好接受流量。
这种探针在等待应用执行耗时的初始任务时非常有用，
例如建立网络连接、加载文件和预热缓存等。
就绪探针在容器生命周期的后期也很有用，例如从临时故障或过载中恢复时。

<!--
If the readiness probe returns a failed state, the
{{< glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}}
controller removes the Pod's IP address from the EndpointSlices of all Services
that match the Pod.
-->
如果就绪探针返回失败状态，
{{< glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}}
控制器会将 Pod 的 IP 地址从与该 Pod 匹配的所有 Service 的 EndpointSlice 中移除。

<!--
Readiness probes run on the container during its whole lifecycle.
-->
就绪探针在容器的整个生命周期内持续运行。

{{< note >}}
<!--
If you want to be able to drain requests when the Pod is deleted, you do not
necessarily need a readiness probe; when the Pod is deleted, the corresponding
endpoint in the EndpointSlice will update its [conditions](https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/#conditions): the endpoint ready
condition will be set to false, so load balancers will not use the Pod for
regular traffic. See [Pod termination](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
for more information about how the kubelet handles Pod deletion.
-->
如果你希望在 Pod 被删除时能够腾空请求，并不一定需要就绪探针；
当 Pod 被删除时，EndpointSlice 中对应的端点会更新其[状况](/zh-cn/docs/concepts/services-networking/endpoint-slices/#conditions)：
端点的 ready 状况会被设为 false，从而负载均衡器不会将常规流量发送给该 Pod。
关于 kubelet 如何处理 Pod 删除的更多信息，
参阅 [Pod 终止](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)。
{{< /note >}}

<!--
## When to use each probe {#when-to-use-each-probe}

### When should you use a startup probe? {#when-should-you-use-a-startup-probe}

Startup probes are useful for Pods that have containers that take a long time to
come into service. Rather than set a long liveness interval, you can configure a
separate configuration for probing the container as it starts up, allowing a
time longer than the liveness interval would allow.
-->
## 何时使用各类探针   {#when-to-use-each-probe}

### 何时使用启动探针？   {#when-should-you-use-a-startup-probe}

对于包含启动时间较长的容器的 Pod，启动探针非常有用。
你不必设置较长的存活探针时间间隔，
而是为容器启动阶段单独配置探针参数，允许使用比存活探针时间间隔更长的时间。

<!--
<!-\- ensure front matter contains math: true -\->
If your container usually starts in more than
\\( initialDelaySeconds + failureThreshold \times  periodSeconds \\), you should specify a
startup probe that checks the same endpoint as the liveness probe. The default
for `periodSeconds` is 10s. You should then set its `failureThreshold` high
enough to allow the container to start, without changing the default values of
the liveness probe. This helps to protect against deadlocks.
-->
<!-- 确保 front matter 包含 math: true -->
如果你的容器通常需要超过
\\( initialDelaySeconds + failureThreshold \times  periodSeconds \\) 的时间启动，
你应该指定一个启动探针，对存活探针所使用的同一端点执行检查。
`periodSeconds` 的默认值是 10 秒。
你应将其 `failureThreshold` 设置得足够高，以便容器能够启动，
同时不必更改存活探针的默认值。这种设置有助于防范死锁状况。

<!--
### When should you use a liveness probe? {#when-should-you-use-a-liveness-probe}

If the process in your container is able to crash on its own whenever it
encounters an issue or becomes unhealthy, you do not necessarily need a liveness
probe; the kubelet will automatically perform the correct action in accordance
with the Pod's `restartPolicy`.
-->
### 何时使用存活探针？   {#when-should-you-use-a-liveness-probe}

如果你的容器中的进程在遇到问题或变得不健康时能够自行崩溃，
那么你不一定需要存活探针；kubelet 将根据 Pod 的 `restartPolicy` 自动执行正确的操作。

<!--
If you'd like your container to be killed and restarted if a probe fails, then
specify a liveness probe, and specify a `restartPolicy` of `Always` or
`OnFailure`.
-->
如果你希望容器在探针失败时被杀死并重新启动，
那么请指定一个存活探针，并将 `restartPolicy` 设置为 `Always` 或 `OnFailure`。

<!--
A common pattern for liveness probes is to use the same low-cost HTTP endpoint
as for readiness probes, but with a higher `failureThreshold`. This ensures
that the pod is observed as not-ready for some period of time before it is hard
killed.
-->
存活探针的一种常见模式是使用与就绪探针相同的低成本 HTTP 端点，
但设置较高的 `failureThreshold`。
这样可以确保在容器被强制杀死之前，Pod 会有一段时间被观察为未就绪状态。

<!--
### When should you use a readiness probe? {#when-should-you-use-a-readiness-probe}

To start sending traffic to a Pod only when a probe succeeds, specify a
readiness probe. The readiness probe might be the same as the liveness probe,
but the existence of the readiness probe in the spec means that the Pod will
start without receiving any traffic and only start receiving traffic after the
probe starts succeeding.
-->
### 何时使用就绪探针？   {#when-should-you-use-a-readiness-probe}

如果你希望仅在探针成功时才开始向 Pod 发送流量，请指定就绪探针。
就绪探针可以与存活探针相同，但规约中存在就绪探针意味着 Pod 启动时不接收任何流量，
只有在探针开始成功后才开始接收流量。

<!--
You can also use a readiness probe to let a container take itself down for
maintenance, by checking an endpoint specific to readiness that is different
from the liveness probe.
-->
你也可以使用就绪探针让容器在维护期间将自身下线，
方法是检查一个专用于就绪检查的端点，与存活探针所使用的端点不同。

<!--
When your app has a strict dependency on back-end services, you can implement
both a liveness and a readiness probe. The liveness probe passes when the app
itself is healthy, but the readiness probe additionally checks that each
required back-end service is available. This helps you avoid directing traffic
to Pods that can only respond with error messages.
-->
当你的应用对后端服务有强依赖时，你可以同时实现存活探针和就绪探针。
当应用自身健康时存活探针通过，但就绪探针还会检查所需的每个后端服务是否可用。
这有助于避免将流量导向只能以错误信息响应的 Pod。

<!--
For containers that need to work on loading large data, configuration files, or
migrations during startup, consider using a [startup probe](#startup-probe).
However, if you want to detect the difference between an app that has failed
and an app that is still processing its startup data, you might prefer a readiness probe.
-->
对于在启动期间需要加载大量数据、配置文件或执行迁移操作的容器，
请考虑使用[启动探针](#startup-probe)。
不过，如果你希望区分应用已经失败和应用仍在处理启动数据这两种情况，
可能更适合使用就绪探针。

<!--
## Check mechanisms {#check-mechanisms}

There are four different ways to check a container using a probe. Each probe
must define exactly one of these four mechanisms:
-->
## 检查机制   {#check-mechanisms}

使用探针检查容器有四种不同的方法。每个探针必须恰好定义这四种机制中的一种：

<!--
`exec`
: Executes a specified command inside the container. The diagnostic is
  considered successful if the command exits with a status code of 0.
-->
`exec`
: 在容器内执行指定的命令。如果命令以状态码 0 退出，则认为诊断成功。

<!--
`grpc`
: Performs a remote procedure call using [gRPC](https://grpc.io/). The target
  should implement [gRPC health checks](https://grpc.io/grpc/core/md_doc_health-checking.html).
  The diagnostic is considered successful if the `status` of the response is
  `SERVING`. For more details, see [gRPC probes](#grpc-probes).
-->
`grpc`
: 使用 [gRPC](https://grpc.io/) 执行远程过程调用。
  目标应实现 [gRPC 健康检查](https://grpc.io/grpc/core/md_doc_health-checking.html)。
  如果响应的 `status` 为 `SERVING`，则认为诊断成功。
  更多细节参阅 [gRPC 探针](#grpc-probes)。

<!--
`httpGet`
: Performs an HTTP `GET` request against the Pod's IP address on a specified
  port and path. The diagnostic is considered successful if the response has a
  status code greater than or equal to 200 and less than 400.
  For more details, see [HTTP probes](#http-probes).
-->
`httpGet`
: 针对 Pod IP 地址上指定端口和路径执行 HTTP `GET` 请求。
  如果响应的状态码大于等于 200 且小于 400，则认为诊断成功。
  更多细节参阅 [HTTP 探针](#http-probes)。

<!--
`tcpSocket`
: Performs a TCP check against the Pod's IP address on a specified port. The
  diagnostic is considered successful if the port is open. If the remote system
  (the container) closes the connection immediately after it opens, this counts
  as healthy.
  For more details, see [TCP probes](#tcp-probes).
-->
`tcpSocket`
: 针对 Pod IP 地址上指定端口执行 TCP 检查。
  如果该端口是开放的，则认为诊断成功。
  如果远程系统（容器）在打开连接后立即将其关闭，这也算作健康。
  更多细节参阅 [TCP 探针](#tcp-probes)。

{{< caution >}}
<!--
Unlike the other mechanisms, `exec` probe's implementation involves the
creation/forking of multiple processes each time when executed. As a result, in
case of the clusters having higher pod densities, lower intervals of
`initialDelaySeconds`, `periodSeconds`, configuring any probe with exec
mechanism might introduce an overhead on the cpu usage of the node. In such
scenarios, consider using the alternative probe mechanisms to avoid the overhead.
-->
与其他机制不同，`exec` 探针的实现涉及每次执行时创建/派生多个进程。
因此，在 Pod 密度较高、`initialDelaySeconds` 和 `periodSeconds` 间隔较短的集群中，
为任何探针配置 exec 机制都可能给节点的 CPU 使用带来额外开销。
在这种场景下，请考虑使用替代的探针机制来避免这种开销。
{{< /caution >}}

<!--
## Probe results {#probe-results}

The kubelet evaluates the result of each probe execution and takes action
accordingly. Each probe has one of three results:
-->
## 探针结果   {#probe-results}

kubelet 评估每次探针执行的结果，并据此采取相应措施。每个探针的结果有以下三种之一：

<!--
`Success`
: The container passed the diagnostic.
-->
`Success`
: 容器通过了诊断。

<!--
`Failure`
: The container failed the diagnostic. For liveness and startup probes, the
  kubelet kills the container, and the container is subjected to its
  [restart policy](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy).
  For readiness probes, the kubelet marks the container as not ready, and the
  Pod stops receiving traffic from matching Services.
-->
`Failure`
: 容器未通过诊断。对于存活探针和启动探针，
  kubelet 会杀死容器，容器随后依据其[重启策略](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)进行处理。
  对于就绪探针，kubelet 会将容器标记为未就绪，
  Pod 将停止从与之匹配的 Service 接收流量。

<!--
`Unknown`
: The diagnostic failed (no action should be taken, and the kubelet will make
  further checks).
-->
`Unknown`
: 诊断失败（不应采取任何行动，kubelet 将继续执行进一步的检查）。

<!--
If a container does not provide a particular probe, the kubelet always
considers the result as `Success`. For readiness probes specifically,
the result is considered `Failure` before the initial delay.
-->
如果容器未提供某种特定探针，kubelet 始终将其结果视为 `Success`。
对于就绪探针，在初始延迟之前，结果被视为 `Failure`。

<!--
## Configuration fields {#configure-probes}

[Probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)
have a number of fields that you can use to more precisely control the behavior of startup,
liveness and readiness checks. For example:
-->
## 配置字段   {#configure-probes}

[探针](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)
有若干字段，可用来更精确地控制启动、存活和就绪检查的行为。例如：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: probe-example
spec:
  containers:
  - name: app
    image: registry.k8s.io/e2e-test-images/agnhost:2.40
    ports:
    - containerPort: 8080
    startupProbe:
      httpGet:
        path: /healthz
        port: 8080
      failureThreshold: 30
      periodSeconds: 10
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      periodSeconds: 5
```

<!--
`initialDelaySeconds`
: Number of seconds after the container has started before startup, liveness or readiness probes are initiated. If a startup probe is defined, liveness and readiness probe delays do not begin until the startup probe has succeeded. In some older Kubernetes versions, the initialDelaySeconds might be ignored if periodSeconds was set to a value higher than initialDelaySeconds. However, in current versions, initialDelaySeconds is always honored and the probe will not start until after this initial delay. Defaults to 0 seconds. Minimum value is 0.
-->
`initialDelaySeconds`
: 容器启动后到启动、存活或就绪探针开始执行之间的秒数。
  如果定义了启动探针，则存活探针和就绪探针的延迟在启动探针成功之前不会开始计时。
  在某些较早的 Kubernetes 版本中，如果 periodSeconds 被设置为高于 initialDelaySeconds 的值，
  initialDelaySeconds 可能会被忽略。
  然而在当前版本中，initialDelaySeconds 始终被遵守，
  探针只有在初始延迟之后才会启动。默认为 0 秒。最小值为 0。

<!--
`periodSeconds`
: How often (in seconds) to perform the probe. Default to 10 seconds. The minimum value is 1. While a container is not Ready, the readiness probe may be executed at times other than the configured `periodSeconds` interval. This is to make the Pod ready faster.
-->
`periodSeconds`
: 执行探针的频率（以秒为单位）。默认为 10 秒。最小值为 1。
  当容器未就绪时，就绪探针可能在 `periodSeconds` 配置的间隔之外的时刻执行。
  这是为了让 Pod 更快地变为就绪状态。

<!--
`timeoutSeconds`
: Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1.
-->
`timeoutSeconds`
: 探针超时时间（以秒为单位）。默认为 1 秒。最小值为 1。

<!--
`successThreshold`
: Minimum consecutive successes for the probe to be considered successful after having failed. Defaults to 1. Must be 1 for liveness and startup Probes. Minimum value is 1.
-->
`successThreshold`
: 探针在失败之后被视为成功所需的最小连续成功次数。默认值为 1。
  对于存活探针和启动探针，该值必须为 1。最小值为 1。

<!--
`failureThreshold`
: After a probe fails `failureThreshold` times in a row, Kubernetes considers that the overall check has failed: the container is _not_ ready/healthy/live. Defaults to 3. Minimum value is 1. For the case of a startup or liveness probe, if at least `failureThreshold` probes have failed, Kubernetes treats the container as unhealthy and triggers a restart for that specific container. The kubelet honors the setting of `terminationGracePeriodSeconds` for that container. For a failed readiness probe, the kubelet continues running the container that failed checks, and also continues to run more probes; because the check failed, the kubelet sets the `Ready` [condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions) on the Pod to `false`.
-->
`failureThreshold`
: 探针连续失败 `failureThreshold` 次之后，Kubernetes 认为整体检查已失败：
  容器**未**就绪/未健康/不存活。默认为 3。最小值为 1。
  对于启动探针或存活探针的情形，如果至少有 `failureThreshold` 个探针失败，
  Kubernetes 会将容器视为不健康，并触发该特定容器的重启。
  kubelet 会遵从该容器的 `terminationGracePeriodSeconds` 设置。
  对于失败的就绪探针，kubelet 会继续运行检查失败的容器并继续运行更多探针；
  由于检查失败，kubelet 会将 Pod 的 `Ready` [状况](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)设置为 `false`。

<!--
`terminationGracePeriodSeconds`
: configure a grace period for the kubelet to wait between triggering a shut down of the failed container, and then forcing the container runtime to stop that container. The default is to inherit the Pod-level value for `terminationGracePeriodSeconds` (30 seconds if not specified), and the minimum value is 1. See [probe-level `terminationGracePeriodSeconds`](#probe-level-terminationgraceperiodseconds) for more detail.
-->
`terminationGracePeriodSeconds`
: 为 kubelet 配置一个宽限期，用于在触发关闭失败容器与强制容器运行时停止该容器之间等待。
  默认值为继承 Pod 层面的 `terminationGracePeriodSeconds` 值（如果未指定则为 30 秒），
  最小值为 1。
  更多细节参阅[探针层面的 `terminationGracePeriodSeconds`](#probe-level-terminationgraceperiodseconds)。

{{< caution >}}
<!--
Incorrect implementation of readiness probes may result in an ever growing
number of processes in the container, and resource starvation if this is left
unchecked.
-->
错误地实现就绪探针可能导致容器内的进程数不断增长，
若不加以控制，可能造成资源耗尽。
{{< /caution >}}

<!--
### Probe-level `terminationGracePeriodSeconds` {#probe-level-terminationgraceperiodseconds}
-->
### 探针层面的 `terminationGracePeriodSeconds`   {#probe-level-terminationgraceperiodseconds}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

<!--
In 1.25 and above, users can specify a probe-level `terminationGracePeriodSeconds`
as part of the probe specification. When both a pod- and probe-level
`terminationGracePeriodSeconds` are set, the kubelet will use the probe-level
value.
-->
在 1.25 及以上版本中，用户可以将探针层面的 `terminationGracePeriodSeconds`
作为探针规约的一部分来设置。
当 Pod 层面和探针层面的 `terminationGracePeriodSeconds` 都被设置时，
kubelet 将使用探针层面的值。

<!--
When setting the `terminationGracePeriodSeconds`, note the following:

* The kubelet always honors the probe-level `terminationGracePeriodSeconds`
  field if it is present on a Pod.
* If you have existing Pods where the `terminationGracePeriodSeconds` field is
  set and you no longer wish to use per-probe termination grace periods, you
  must delete those existing Pods.
-->
在设置 `terminationGracePeriodSeconds` 时，请注意以下几点：

* 如果 Pod 上存在探针层面的 `terminationGracePeriodSeconds` 字段，
  kubelet 始终会遵守该字段。
* 如果你的现有 Pod 设置了 `terminationGracePeriodSeconds` 字段，
  并且你不再希望使用按探针配置的终止宽限期，你必须删除这些现有的 Pod。

<!--
For example:
-->
例如：

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
      # Override pod-level terminationGracePeriodSeconds
      terminationGracePeriodSeconds: 60
```

<!--
Probe-level `terminationGracePeriodSeconds` **cannot** be set for readiness probes.
It will be rejected by the API server.
-->
探针层面的 `terminationGracePeriodSeconds` **不能**为就绪探针设置。
API 服务器将拒绝这种设置。

<!--
## Probe mechanism details {#probe-mechanism-details}

### HTTP probes {#http-probes}

[HTTP probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
have additional fields that can be set on `httpGet`:
-->
## 探针机制详解   {#probe-mechanism-details}

### HTTP 探针   {#http-probes}

[HTTP 探针](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
可以在 `httpGet` 上设置以下额外字段：

<!--
* `host`: Host name to connect to, defaults to the pod IP. You probably want to
  set "Host" in `httpHeaders` instead.
* `scheme`: Scheme to use for connecting to the host (HTTP or HTTPS). Defaults
  to "HTTP".
* `path`: Path to access on the HTTP server. Defaults to "/".
* `httpHeaders`: Custom headers to set in the request. HTTP allows repeated
  headers.
* `port`: Name or number of the port to access on the container. Number must be
  in the range 1 to 65535.
-->
* `host`：要连接的主机名，默认为 Pod IP。你可能更希望在 `httpHeaders` 中设置 `Host`。
* `scheme`：用于连接主机的协议（HTTP 或 HTTPS）。默认为 "HTTP"。
* `path`：HTTP 服务器上要访问的路径。默认为 "/"。
* `httpHeaders`：请求中要设置的自定义标头。HTTP 允许重复的标头。
* `port`：要在容器上访问的端口的名称或编号。编号必须在 1 到 65535 之间。

<!--
For an HTTP probe, the kubelet sends an HTTP request to the specified port and
path to perform the check. The kubelet sends the probe to the Pod's IP address,
unless the address is overridden by the optional `host` field in `httpGet`. If
`scheme` field is set to `HTTPS`, the kubelet sends an HTTPS request skipping
the certificate verification. In most scenarios, you do not want to set the
`host` field. Here's one scenario where you would set it. Suppose the container
listens on 127.0.0.1 and the Pod's `hostNetwork` field is true. Then `host`,
under `httpGet`, should be set to 127.0.0.1. If your pod relies on virtual
hosts, which is probably the more common case, you should not use `host`, but
rather set the `Host` header in `httpHeaders`.
-->
对于 HTTP 探针，kubelet 向指定的端口和路径发送 HTTP 请求来执行检查。
kubelet 会将探针发送到 Pod 的 IP 地址，
除非地址被 `httpGet` 中的可选 `host` 字段覆盖。
如果 `scheme` 字段被设置为 `HTTPS`，kubelet 会发送 HTTPS 请求并跳过证书验证。
在大多数场景下，你不需要设置 `host` 字段。
下面是一个需要设置的场景：假设容器监听 127.0.0.1，且 Pod 的 `hostNetwork` 字段为 true。
此时 `httpGet` 下的 `host` 应被设置为 127.0.0.1。
如果你的 Pod 依赖虚拟主机（这可能是更常见的情况），
你不应使用 `host`，而是应该在 `httpHeaders` 中设置 `Host` 标头。

<!--
For an HTTP probe, the kubelet sends two request headers in addition to the
mandatory `Host` header:

- `User-Agent`, which defaults to `kube-probe/{{< skew currentVersion >}}`
  where `{{< skew currentVersion >}}` is the version of the kubelet.
- `Accept`, which defaults to `*/*`.
-->
对于 HTTP 探针，除了必需的 `Host` 标头之外，kubelet 还会发送两个请求标头：

- `User-Agent`，默认值为 `kube-probe/{{< skew currentVersion >}}`，
  其中 `{{< skew currentVersion >}}` 是 kubelet 的版本。
- `Accept`，默认值为 `*/*`。

<!--
You can override these headers by defining `httpHeaders` for the probe.
For example:
-->
你可以通过为探针定义 `httpHeaders` 来覆盖这些标头。例如：

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
你也可以通过将其设置为空值来移除这两个标头。

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
#### Redirect handling {#http-probes-redirects}

When the kubelet probes a container using HTTP, it follows redirects only if
the redirect is to the same host. This includes redirects that change the
protocol from HTTP to HTTPS, even if the probe is configured with
`scheme: HTTP`.
-->
#### 重定向处理   {#http-probes-redirects}

当 kubelet 使用 HTTP 探测容器时，只有当重定向目标是同一主机时才会跟随重定向。
这包括将协议从 HTTP 更改为 HTTPS 的重定向，
即使探针被配置为 `scheme: HTTP`。

<!--
If the redirect is to a different hostname, the kubelet does not follow it.
Instead, the kubelet treats the probe as successful and records a
`ProbeWarning` event.
-->
如果重定向到不同的主机名，kubelet 不会跟随该重定向。
此时，kubelet 会将探针视为成功，并记录一个 `ProbeWarning` 事件。

<!--
If the kubelet follows a redirect and receives 11 or more redirects in total, the probe
is considered successful and records a `ProbeWarning` event. For example:
-->
如果 kubelet 跟随重定向并累计收到 11 次或以上的重定向，
探针被视为成功并记录一个 `ProbeWarning` 事件。例如：

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

{{< caution >}}
<!--
When processing an `httpGet` probe, the kubelet stops reading the response body after 10KiB.
The probe's success is determined solely by the response status code, which is found in the response headers.
-->
处理 `httpGet` 探针时，kubelet 在读取响应主体超过 10KiB 后会停止读取。
探针的成功与否仅由响应状态码决定，状态码可以在响应标头中找到。

<!--
If you probe an endpoint that returns a response body larger than **10KiB**,
the kubelet will still mark the probe as successful based on the status code,
but it will close the connection after reaching the 10KiB limit.
This abrupt closure can cause **connection reset by peer** or **broken pipe errors** to appear in your application's logs,
which can be difficult to distinguish from legitimate network issues.
-->
如果你探测的端点返回的响应主体大于 **10KiB**，
kubelet 仍会根据状态码将探针标记为成功，
但在达到 10KiB 限制后会关闭连接。
这种突然的关闭可能导致 **connection reset by peer** 或 **broken pipe errors**
等错误出现在你的应用日志中，而这些错误可能难以与真正的网络问题区分。

<!--
For reliable `httpGet` probes, it is strongly recommended to use dedicated health check endpoints
that return a minimal response body. If you must use an existing endpoint with a large payload,
consider using an `exec` probe to perform a HEAD request instead.
-->
为了让 `httpGet` 探针更可靠，强烈建议使用专用的健康检查端点，
让其返回较小的响应主体。
如果你必须使用一个负载较大的现有端点，可以考虑改用 `exec` 探针执行一次 HEAD 请求。
{{< /caution >}}

<!--
### TCP probes {#tcp-probes}

For a TCP probe, the kubelet makes the probe connection at the node, not in the
Pod, which means that you can not use a service name in the `host` parameter
since the kubelet is unable to resolve it.
-->
### TCP 探针   {#tcp-probes}

对于 TCP 探针，kubelet 在节点上而不是在 Pod 中建立探测连接，
这意味着你不能在 `host` 参数中使用服务名称，因为 kubelet 无法解析它。

<!--
### gRPC probes {#grpc-probes}
-->
### gRPC 探针   {#grpc-probes}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

<!--
If your application implements the
[gRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md),
you can configure Kubernetes to use it for application startup, liveness or readiness checks.
-->
如果你的应用实现了 [gRPC 健康检查协议](https://github.com/grpc/grpc/blob/master/doc/health-checking.md)，
你可以配置 Kubernetes 使用该协议来执行应用启动、存活或就绪检查。

<!--
Here is an example manifest:
-->
下面是一个清单示例：

{{% code_sample file="pods/probe/grpc-liveness.yaml" %}}

<!--
To use a gRPC probe, `port` must be configured. If you want to
distinguish probes of different types and probes for different features you can
use the `service` field. You can set `service` to the value `liveness` and make
your gRPC Health Checking endpoint respond to this request differently than when
you set `service` set to `readiness`. This lets you use the same endpoint for
different kinds of container health check rather than listening on two different
ports. If you want to specify your own custom service name and also specify a
probe type, the Kubernetes project recommends that you use a name that
concatenates those. For example: `myservice-liveness` (using `-` as a separator).
-->
要使用 gRPC 探针，必须配置 `port`。
如果你想区分不同类型的探针和针对不同特性的探针，可以使用 `service` 字段。
你可以将 `service` 设置为 `liveness`，
并让你的 gRPC 健康检查端点对此请求作出与设置 `service` 为 `readiness` 时不同的响应。
这使你能够使用同一端点完成不同种类的容器健康检查，
而不必监听两个不同的端口。
如果你想指定自己的自定义服务名称并同时指定一种探针类型，
Kubernetes 项目建议你使用将两者连接起来的名称。
例如：`myservice-liveness`（使用 `-` 作为分隔符）。

{{< note >}}
<!--
Unlike HTTP or TCP probes, you cannot specify the health check port by name,
and you cannot configure a custom hostname.
-->
与 HTTP 或 TCP 探针不同，你不能通过名称指定健康检查端口，
也不能配置自定义主机名。
{{< /note >}}

<!--
Configuration problems (for example: incorrect port or service, unimplemented
health checking protocol) are considered a probe failure, similar to HTTP and
TCP probes.
-->
配置问题（例如：端口或服务不正确、未实现健康检查协议）
被视为探针失败，类似于 HTTP 和 TCP 探针。

## {{% heading "whatsnext" %}}

<!--
* Learn how to
  [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).
* For the full specification of probe-related fields, see the API reference:
  [Pod](/docs/reference/kubernetes-api/workload-resources/pod-v1/),
  [Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container),
  [Probe](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
-->
* 学习如何[配置存活、就绪和启动探针](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)。
* 关于探针相关字段的完整规约，参阅 API 参考：
  [Pod](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/)、
  [Container](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)、
  [Probe](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
