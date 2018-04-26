---
redirect_from:
- "/docs/user-guide/liveness/"
- "/docs/user-guide.liveness.html"
title: 配置Liveness和Readiness探针
cn-approvers:
- rootsongjc
cn-reviewers:
- rootsongjc
---

{% capture overview %}
<!--
This page shows how to configure liveness and readiness probes for Containers.
-->

本文将向您展示如何配置容器的存活和可读性探针。
<!--
The [kubelet](/docs/admin/kubelet/) uses liveness probes to know when to
restart a Container. For example, liveness probes could catch a deadlock,
where an application is running, but unable to make progress. Restarting a
Container in such a state can help to make the application more available
despite bugs.
-->
[kubelet](/docs/admin/kubelet/) 使用 liveness probe（存活探针）来确定何时重启容器。例如，当应用程序处于运行状态但无法做进一步操作，liveness 探针将捕获到 deadlock，重启处于该状态下的容器，使应用程序在存在 bug 的情况下依然能够继续运行下去。
<!--
The kubelet uses readiness probes to know when a Container is ready to start
accepting traffic. A Pod is considered ready when all of its Containers are ready.
One use of this signal is to control which Pods are used as backends for Services.
When a Pod is not ready, it is removed from Service load balancers.
-->
Kubelet 使用 readiness probe（就绪探针）来确定容器是否已经就绪可以接受流量。只有当 Pod 中的容器都处于就绪状态时 kubelet 才会认定该 Pod处于就绪状态。该信号的作用是控制哪些 Pod应该作为service的后端。如果 Pod 处于非就绪状态，那么它们将会被从 service 的 load balancer中移除。

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}
<!--
## Define a liveness command
-->
## 定义 liveness 命令
<!--
Many applications running for long periods of time eventually transition to
broken states, and cannot recover except by being restarted. Kubernetes provides
liveness probes to detect and remedy such situations.
-->
许多长时间运行的应用程序最终会转换到 broken 状态，除非重新启动，否则无法恢复。Kubernetes 提供了 liveness probe 来检测和补救这种情况。
<!--
In this exercise, you create a Pod that runs a Container based on the
`gcr.io/google_containers/busybox` image. Here is the configuration file for the Pod:
-->
在本次练习将基于 `gcr.io/google_containers/busybox`镜像创建运行一个容器的 Pod。以下是 Pod 的配置文件`exec-liveness.yaml`：

{% include code.html language="yaml" file="exec-liveness.yaml" ghlink="/docs/tasks/configure-pod-container/exec-liveness.yaml" %}
<!--
In the configuration file, you can see that the Pod has a single Container.
The `periodSeconds` field specifies that the kubelet should perform a liveness
probe every 5 seconds. The `initialDelaySeconds` field tells the kubelet that it
should wait 5 second before performing the first probe. To perform a probe, the
kubelet executes the command `cat /tmp/healthy` in the Container. If the
command succeeds, it returns 0, and the kubelet considers the Container to be alive and
healthy. If the command returns a non-zero value, the kubelet kills the Container
and restarts it.
-->
该配置文件给 Pod 配置了一个容器。`periodSeconds` 规定 kubelet 要每隔5秒执行一次 liveness probe。  `initialDelaySeconds` 告诉 kubelet 在第一次执行 probe 之前要的等待5秒钟。探针检测命令是在容器中执行 `cat /tmp/healthy` 命令。如果命令执行成功，将返回0，kubelet 就会认为该容器是活着的并且很健康。如果返回非0值，kubelet 就会杀掉这个容器并重启它。
<!--
When the Container starts, it executes this command:
-->
容器启动时，执行该命令：

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -rf /tmp/healthy; sleep 600"
```
<!--
For the first 30 seconds of the Container's life, there is a `/tmp/healthy` file.
So during the first 30 seconds, the command `cat /tmp/healthy` returns a success
code. After 30 seconds, `cat /tmp/healthy` returns a failure code.

Create the Pod:
-->
在容器生命的最初30秒内有一个 `/tmp/healthy` 文件，在这30秒内 `cat /tmp/healthy`命令会返回一个成功的返回码。30秒后， `cat /tmp/healthy` 将返回失败的返回码。

创建Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/exec-liveness.yaml
```
<!--
Within 30 seconds, view the Pod events:
-->
在30秒内，查看 Pod 的 event：

```
kubectl describe pod liveness-exec
```
<!--
The output indicates that no liveness probes have failed yet:
-->
结果显示没有失败的 liveness probe：

```shell
FirstSeen    LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
24s       24s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "gcr.io/google_containers/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "gcr.io/google_containers/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
```
<!--
After 35 seconds, view the Pod events again:
-->
35秒后，再次查看 Pod 的 event：

```shell
kubectl describe pod liveness-exec
```
<!--
At the bottom of the output, there are messages indicating that the liveness
probes have failed, and the containers have been killed and recreated.
-->
在最下面有一条信息显示 liveness probe 失败，容器被删掉并重新创建。

```shell
FirstSeen LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
37s       37s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "gcr.io/google_containers/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "gcr.io/google_containers/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
2s        2s      1   {kubelet worker0}   spec.containers{liveness}   Warning     Unhealthy   Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
```
<!--
Wait another 30 seconds, and verify that the Container has been restarted:
-->
再等30秒，确认容器已经重启：

```shell
kubectl get pod liveness-exec
```
<!--
The output shows that `RESTARTS` has been incremented:
-->
从输出结果来`RESTARTS`值加1了。

```shell
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```
<!--
## Define a liveness HTTP request
-->
## 定义 liveness HTTP请求
<!--
Another kind of liveness probe uses an HTTP GET request. Here is the configuration
file for a Pod that runs a container based on the `gcr.io/google_containers/liveness`
image.
-->
我们还可以使用 HTTP GET 请求作为 liveness probe。下面是一个基于`gcr.io/google_containers/liveness`镜像运行了一个容器的 Pod 的例子`http-liveness.yaml`：

{% include code.html language="yaml" file="http-liveness.yaml" ghlink="/docs/tasks/configure-pod-container/http-liveness.yaml" %}
<!--
In the configuration file, you can see that the Pod has a single Container.
The `livenessProbe` field specifies that the kubelet should perform a liveness
probe every 3 seconds. The `initialDelaySeconds` field tells the kubelet that it
should wait 3 seconds before performing the first probe. To perform a probe, the
kubelet sends an HTTP GET request to the server that is running in the Container
and listening on port 8080. If the handler for the server's `/healthz` path
returns a success code, the kubelet considers the Container to be alive and
healthy. If the handler returns a failure code, the kubelet kills the Container
and restarts it.
-->
该配置文件只定义了一个容器，`livenessProbe` 指定 kubelet 需要每隔3秒执行一次 liveness probe。`initialDelaySeconds` 指定 kubelet 在该执行第一次探测之前需要等待3秒钟。该探针将向容器中的 server 的8080端口发送一个HTTP GET 请求。如果server的`/healthz`路径的 handler 返回一个成功的返回码，kubelet 就会认定该容器是活着的并且很健康。如果返回失败的返回码，kubelet 将杀掉该容器并重启它。
<!--
Any code greater than or equal to 200 and less than 400 indicates success. Any
other code indicates failure.
-->
任何大于200小于400的返回码都会认定是成功的返回码。其他返回码都会被认为是失败的返回码。
<!--
You can see the source code for the server in
[server.go](http://k8s.io/docs/user-guide/liveness/image/server.go).
-->
查看server的源码：[server.go](http://k8s.io/docs/user-guide/liveness/image/server.go).
<!--
For the first 10 seconds that the Container is alive, the `/healthz` handler
returns a status of 200. After that, the handler returns a status of 500.
-->
最开始的10秒该容器是活着的， `/healthz` handler 返回200的状态码。这之后将返回500的返回码。

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
The kubelet starts performing health checks 3 seconds after the Container starts.
So the first couple of health checks will succeed. But after 10 seconds, the health
checks will fail, and the kubelet will kill and restart the Container.
-->
容器启动3秒后，kubelet 开始执行健康检查。第一次健康监测会成功，但是10秒后，健康检查将失败，kubelet将杀掉和重启容器。
<!--
To try the HTTP liveness check, create a Pod:
-->
创建一个 Pod 来测试一下 HTTP liveness检测：

```shell
kubectl create -f https://k8s.io/docs/tasks/configure-pod-container/http-liveness.yaml
```
<!--
After 10 seconds, view Pod events to verify that liveness probes have failed and
the Container has been restarted:
-->
10秒后，查看 Pod 的 event，确认 liveness probe 失败并重启了容器。

```shell
kubectl describe pod liveness-http
```
<!--
## Define a TCP liveness probe
-->
## 定义 TCP liveness probe
<!--
A third type of liveness probe uses a TCP Socket. With this configuration, the
kubelet will attempt to open a socket to your container on the specified port.
If it can establish a connection, the container is considered healthy, if it
can’t it is considered a failure.
-->
第三种 liveness probe 使用 TCP Socket。 使用此配置，kubelet 将尝试在指定端口上打开容器的套接字。 如果可以建立连接，容器被认为是健康的，如果不能就认为是失败的。

{% include code.html language="yaml" file="tcp-liveness-readiness.yaml" ghlink="/docs/tasks/configure-pod-container/tcp-liveness-readiness.yaml" %}

如您所见，TCP 检查的配置与 HTTP 检查非常相似。 此示例同时使用了 readiness 和 liveness probe。 容器启动后5秒钟，kubelet将发送第一个 readiness probe。 这将尝试连接到端口8080上的 goproxy 容器。如果探测成功，则该 Pod 将被标记为就绪。Kubelet 将每隔10秒钟执行一次该检查。
<!--
As you can see, configuration for a TCP check is quite similar to a HTTP check.
This example uses both readiness and liveness probes. The kubelet will send the
first readiness probe 5 seconds after the container starts. This will attempt to
connect to the `goproxy` container on port 8080. If the probe succeeds, the pod
will be marked as ready. The kubelet will continue to run this check every 10
seconds.
-->
如您所见，TCP 检查的配置与 HTTP 检查非常相似。 此示例同时使用了 readiness 和 liveness probe。 容器启动后5秒钟，kubelet 将发送第一个 readiness probe。 这将尝试连接到端口8080上的 goproxy 容器。如果探测成功，则该 pod 将被标记为就绪。Kubelet 将每隔10秒钟执行一次该检查。
<!--
In addition to the readiness probe, this configuration includes a liveness probe.
The kubelet will run the first liveness probe 15 seconds after the container
starts. Just like the readiness probe, this will attempt to connect to the
`goproxy` container on port 8080. If the liveness probe fails, the container
will be restarted.
-->
除了 readiness probe之外，该配置还包括 liveness probe。 容器启动15秒后，kubelet 将运行第一个 liveness probe。 就像readiness probe一样，这将尝试连接到 goproxy 容器上的8080端口。如果 liveness probe 失败，容器将重新启动。
<!--
## Use a named port

You can use a named
[ContainerPort](/docs/api-reference/v1.6/#containerport-v1-core)
for HTTP or TCP liveness checks:
-->

## 使用命名的端口

可以使用命名的 [ContainerPort ](/docs/api-reference/v1.6/#containerport-v1-core)作为 HTTP 或 TCP liveness检查：

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
## Define readiness probes
-->
## 定义readiness probe
<!--
Sometimes, applications are temporarily unable to serve traffic.
For example, an application might need to load large data or configuration
files during startup. In such cases, you don't want to kill the application,
but you don’t want to send it requests either. Kubernetes provides
readiness probes to detect and mitigate these situations. A pod with containers
reporting that they are not ready does not receive traffic through Kubernetes
Services.
-->
有时，应用程序暂时无法对外部流量提供服务。 例如，应用程序可能需要在启动期间加载大量数据或配置文件。 在这种情况下，您不想杀死应用程序，也不想发送请求。 Kubernetes提供了readiness probe来检测和减轻这些情况。 Pod中的容器可以报告自己还没有准备，不能处理Kubernetes服务发送过来的流量。
<!--
Readiness probes are configured similarly to liveness probes. The only difference
is that you use the `readinessProbe` field instead of the `livenessProbe` field.
-->
Readiness probe的配置跟liveness probe很像。唯一的不同是使用 `readinessProbe `而不是`livenessProbe`。

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
-->
Readiness probe 的 HTTP 和 TCP 的探测器配置跟 liveness probe 一样。
<!--
Readiness and liveness probes can be used in parallel for the same container.
Using both can ensure that traffic does not reach a container that is not ready
for it, and that containers are restarted when they fail.
-->
Readiness 和 livenss probe 可以并行用于同一容器。 使用两者可以确保流量无法到达未准备好的容器，并且容器在失败时重新启动。

## Configure Probes

## 配置 Probe

{% comment %}
Eventually, some of this section could be moved to a concept topic.
{% endcomment %}

<!--

[Probes](/docs/api-reference/v1.6/#probe-v1-core) have a number of fields that
you can use to more precisely control the behavior of liveness and readiness
checks:

* `initialDelaySeconds`: Number of seconds after the container has started
  before liveness probes are initiated.
* `periodSeconds`: How often (in seconds) to perform the probe. Default to 10
  seconds. Minimum value is 1.
* `timeoutSeconds`: Number of seconds after which the probe times out. Defaults
  to 1 second. Minimum value is 1.
* `successThreshold`: Minimum consecutive successes for the probe to be
  considered successful after having failed. Defaults to 1. Must be 1 for
  liveness. Minimum value is 1.
* `failureThreshold`: Minimum consecutive failures for the probe to be
  considered failed after having succeeded. Defaults to 3. Minimum value is 1.

-->

[Probe ](/docs/api-reference/v1.6/#probe-v1-core)中有很多精确和详细的配置，通过它们您能准确的控制 liveness 和 readiness 检查：

- `initialDelaySeconds`：容器启动后第一次执行探测是需要等待多少秒。
- `periodSeconds`：执行探测的频率。默认是10秒，最小1秒。
- `timeoutSeconds`：探测超时时间。默认1秒，最小1秒。
- `successThreshold`：探测失败后，最少连续探测成功多少次才被认定为成功。默认是 1。对于 liveness 必须是 1。最小值是 1。 
- `failureThreshold`：探测成功后，最少连续探测失败多少次才被认定为失败。默认是 3。最小值是 1。

<!--

[HTTP probes](/docs/api-reference/v1.6/#httpgetaction-v1-core)
have additional fields that can be set on `httpGet`:

* `host`: Host name to connect to, defaults to the pod IP. You probably want to
  set "Host" in httpHeaders instead.
* `scheme`: Scheme to use for connecting to the host. Defaults to HTTP.
* `path`: Path to access on the HTTP server.
* `httpHeaders`: Custom headers to set in the request. HTTP allows repeated headers.
* `port`: Name or number of the port to access on the container. Number must be
  in the range 1 to 65535.

-->

[HTTP probe ](/docs/api-reference/v1.6/#httpgetaction-v1-core)中可以给 `httpGet`设置其他配置项：

- `host`：连接的主机名，默认连接到 pod 的 IP。您可能想在 http header 中设置 "Host" 而不是使用 IP。
- `scheme`：连接使用的 schema，默认HTTP。
- `path`: 访问的HTTP server 的 path。
- `httpHeaders`：自定义请求的 header。HTTP运行重复的 header。
- `port`：访问的容器的端口名字或者端口号。端口号必须介于 1 和 65525 之间。

<!--
For an HTTP probe, the kubelet sends an HTTP request to the specified path and
port to perform the check. The kubelet sends the probe to the container’s IP address,
unless the address is overridden by the optional `host` field in `httpGet`.
In most scenarios, you do not want to set the `host` field. Here's one scenario
where you would set it. Suppose the Container listens on 127.0.0.1 and the Pod's
`hostNetwork` field is true. Then `host`, under `httpGet`, should be set to 127.0.0.1.
If your pod relies on virtual hosts, which is probably the more common case,
you should not use `host`, but rather set the `Host` header in `httpHeaders`.

-->

对于 HTTP 探测器，kubelet 向指定的路径和端口发送 HTTP 请求以执行检查。 Kubelet 将 probe 发送到容器的 IP 地址，除非地址被`httpGet`中的可选`host`字段覆盖。 在大多数情况下，您不想设置主机字段。 有一种情况下您可以设置它。 假设容器在127.0.0.1上侦听，并且 Pod 的`hostNetwork`字段为 true。 然后，在`httpGet`下的`host`应该设置为127.0.0.1。 如果您的 pod 依赖于虚拟主机，这可能是更常见的情况，您不应该是用`host`，而是应该在`httpHeaders`中设置`Host`头。

{% endcapture %}

{% capture whatsnext %}

* 关于 [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes) 的更多信息

### 参考

* [Pod](/docs/api-reference/v1.6/#pod-v1-core)
* [Container](/docs/api-reference/v1.6/#container-v1-core)
* [Probe](/docs/api-reference/v1.6/#probe-v1-core)

{% endcapture %}

{% include templates/task.md %}
