---
title: Pod 生命周期
redirect_from:
- "/docs/user-guide/pod-states/"
- "/docs/user-guide/pod-states.html"
cn-approvers:
- rootsongjc
cn-reviewers:
- zjj2wry
---

{% capture overview %}

{% comment %}Updated: 4/14/2015{% endcomment %}
{% comment %}Edited and moved to Concepts section: 2/2/17{% endcomment %}

<!--

This page describes the lifecycle of a Pod.

-->

该页面将描述 Pod 的生命周期。

{% endcapture %}

{% capture body %}

<!--

## Pod phase

A Pod's `status` field is a
[PodStatus](/docs/resources-reference/v1.6/#podstatus-v1-core)
object, which has a `phase` field.

The phase of a Pod is a simple, high-level summary of where the Pod is in its
lifecycle. The phase is not intended to be a comprehensive rollup of observations
of Container or Pod state, nor is it intended to be a comprehensive state machine.

The number and meanings of Pod phase values are tightly guarded.
Other than what is documented here, nothing should be assumed about Pods that
have a given `phase` value.

Here are the possible values for `phase`:

* Pending: The Pod has been accepted by the Kubernetes system, but one or more of
  the Container images has not been created. This includes time before being
  scheduled as well as time spent downloading images over the network,
  which could take a while.
* Running: The Pod has been bound to a node, and all of the Containers have been
  created. At least one Container is still running, or is in the process of
  starting or restarting.
* Succeeded: All Containers in the Pod have terminated in success, and will not
  be restarted.
* Failed: All Containers in the Pod have terminated, and at least one Container
  has terminated in failure. That is, the Container either exited with non-zero
  status or was terminated by the system.
* Unknown: For some reason the state of the Pod could not be obtained, typically
  due to an error in communicating with the host of the Pod.

-->

## Pod phase

Pod 的 `status` 定义在 [PodStatus](/docs/resources-reference/v1.7/#podstatus-v1-core) 对象中，其中有一个 `phase` 字段。

Pod 的相位（phase）是 Pod 在其生命周期中的简单宏观概述。该阶段并不是对容器或 Pod 的综合汇总，也不是为了做为综合状态机。

Pod 相位的数量和含义是严格指定的。除了本文档中列举的内容外，不应该再假定 Pod 有其他的 `phase` 值。

下面是 `phase` 可能的值：

- 挂起（Pending）：Pod 已被 Kubernetes 系统接受，但有一个或者多个容器镜像尚未创建。等待时间包括调度 Pod 的时间和通过网络下载镜像的时间，这可能需要花点时间。
- 运行中（Running）：该 Pod 已经绑定到了一个节点上，Pod 中所有的容器都已被创建。至少有一个容器正在运行，或者正处于启动或重启状态。
- 成功（Succeeded）：Pod 中的所有容器都被成功终止，并且不会再重启。
- 失败（Failed）：Pod 中的所有容器都已终止了，并且至少有一个容器是因为失败终止。也就是说，容器以非0状态退出或者被系统终止。
- 未知（Unknown）：因为某些原因无法取得 Pod 的状态，通常是因为与 Pod 所在主机通信失败。

<!--

## Pod conditions

A Pod has a PodStatus, which has an array of
[PodConditions](/docs/resources-reference/v1.6/#podcondition-v1-core). Each element
of the PodCondition array has a `type` field and a `status` field. The `type`
field is a string, with possible values PodScheduled, Ready, Initialized, and
Unschedulable. The `status` field is a string, with possible values True, False,
and Unknown.

-->

## Pod 状态

Pod 有一个 PodStatus 对象，其中包含一个 [PodCondition](/docs/resources-reference/v1.7/#podcondition-v1-core) 数组。 PodCondition 数组的每个元素都有一个 `type` 字段和一个 `status` 字段。`type` 字段是字符串，可能的值有 PodScheduled、Ready、Initialized 和 Unschedulable。`status` 字段是一个字符串，可能的值有 True、False 和 Unknown。

<!--

## Container probes

A [Probe](/docs/resources-reference/v1.6/#probe-v1-core) is a diagnostic
performed periodically by the [kubelet](/docs/admin/kubelet/)
on a Container. To perform a diagnostic,
the kubelet calls a
[Handler](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#Handler) implemented by
the Container. There are three types of handlers:

* [ExecAction](/docs/resources-reference/v1.6/#execaction-v1-core):
  Executes a specified command inside the Container. The diagnostic
  is considered successful if the command exits with a status code of 0.

* [TCPSocketAction](/docs/resources-reference/v1.6/#tcpsocketaction-v1-core):
  Performs a TCP check against the Container's IP address on
  a specified port. The diagnostic is considered successful if the port is open.

* [HTTPGetAction](/docs/resources-reference/v1.6/#httpgetaction-v1-core):
  Performs an HTTP Get request against the Container's IP
  address on a specified port and path. The diagnostic is considered successful
  if the response has a status code greater than or equal to 200 and less than 400.

Each probe has one of three results:

* Success: The Container passed the diagnostic.
* Failure: The Container failed the diagnostic.
* Unknown: The diagnostic failed, so no action should be taken.

The kubelet can optionally perform and react to two kinds of probes on running
Containers:

* `livenessProbe`: Indicates whether the Container is running. If
   the liveness probe fails, the kubelet kills the Container, and the Container
   is subjected to its [restart policy](#restart-policy). If a Container does not
   provide a liveness probe, the default state is `Success`.
* `readinessProbe`: Indicates whether the Container is ready to service requests.
   If the readiness probe fails, the endpoints controller removes the Pod's IP
   address from the endpoints of all Services that match the Pod. The default
   state of readiness before the initial delay is `Failure`. If a Container does
   not provide a readiness probe, the default state is `Success`.

-->

## 容器探针

[探针](/docs/resources-reference/v1.7/#probe-v1-core) 是由 [kubelet](/docs/admin/kubelet/) 对容器执行的定期诊断。要执行诊断，kubelet 调用由容器实现的 [Handler](https://godoc.org/k8s.io/kubernetes/pkg/api/v1#Handler)。有三种类型的处理程序：

- [ExecAction](/docs/resources-reference/v1.7/#execaction-v1-core)：在容器内执行指定命令。如果命令退出时返回码为 0 则认为诊断成功。
- [TCPSocketAction](/docs/resources-reference/v1.7/#tcpsocketaction-v1-core)：对指定端口上的容器的 IP 地址进行 TCP 检查。如果端口打开，则诊断被认为是成功的。
- [HTTPGetAction](/docs/resources-reference/v1.7/#httpgetaction-v1-core)：对指定的端口和路径上的容器的 IP 地址执行 HTTP Get 请求。如果响应的状态码大于等于200 且小于 400，则诊断被认为是成功的。

每次探测都将获得以下三种结果之一：

- 成功：容器通过了诊断。
- 失败：容器未通过诊断。
- 未知：诊断失败，因此不会采取任何行动。

Kubelet 可以选择是否执行在容器上运行的两种探针执行和做出反应：

- `livenessProbe`：指示容器是否正在运行。如果存活探测失败，则 kubelet 会杀死容器，并且容器将受到其 [重启策略](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) 的影响。如果容器不提供存活探针，则默认状态为 `Success`。
- `readinessProbe`：指示容器是否准备好服务请求。如果就绪探测失败，端点控制器将从与 Pod 匹配的所有 Service 的端点中删除该 Pod 的 IP 地址。初始延迟之前的就绪状态默认为 `Failure`。如果容器不提供就绪探针，则默认状态为 `Success`。

<!--

### When should you use liveness or readiness probes?

If the process in your Container is able to crash on its own whenever it
encounters an issue or becomes unhealthy, you do not necessarily need a liveness
probe; the kubelet will automatically perform the correct action in accordance
with the Pod's `restartPolicy`.

If you'd like your Container to be killed and restarted if a probe fails, then
specify a liveness probe, and specify a `restartPolicy` of Always or OnFailure.

If you'd like to start sending traffic to a Pod only when a probe succeeds,
specify a readiness probe. In this case, the readiness probe might be the same
as the liveness probe, but the existence of the readiness probe in the spec means
that the Pod will start without receiving any traffic and only start receiving
traffic after the probe starts succeeding.

If you want your Container to be able to take itself down for maintenance, you
can specify a readiness probe that checks an endpoint specific to readiness that
is different from the liveness probe.

Note that if you just want to be able to drain requests when the Pod is deleted,
you do not necessarily need a readiness probe; on deletion, the Pod automatically
puts itself into an unready state regardless of whether the readiness probe exists.
The Pod remains in the unready state while it waits for the Containers in the Pod
to stop.

-->

### 该什么时候使用存活（liveness）和就绪（readiness）探针?

如果容器中的进程能够在遇到问题或不健康的情况下自行崩溃，则不一定需要存活探针; kubelet 将根据 Pod 的`restartPolicy` 自动执行正确的操作。

如果您希望容器在探测失败时被杀死并重新启动，那么请指定一个存活探针，并指定`restartPolicy` 为 Always 或 OnFailure。

如果要仅在探测成功时才开始向 Pod 发送流量，请指定就绪探针。在这种情况下，就绪探针可能与存活探针相同，但是 spec 中的就绪探针的存在意味着 Pod 将在没有接收到任何流量的情况下启动，并且只有在探针探测成功后才开始接收流量。

如果您希望容器能够自行维护，您可以指定一个就绪探针，该探针检查与存活探针不同的端点。

请注意，如果您只想在 Pod 被删除时能够排除请求，则不一定需要使用就绪探针；在删除 Pod 时，Pod 会自动将自身置于未完成状态，无论就绪探针是否存在。当等待 Pod 中的容器停止时，Pod 仍处于未完成状态。

<!--

## Pod and Container status

For detailed information about Pod Container status, see
[PodStatus](/docs/resources-reference/v1.6/#podstatus-v1-core)
and
[ContainerStatus](/docs/resources-reference/v1.6/#containerstatus-v1-core).
Note that the information reported as Pod status depends on the current
[ContainerState](/docs/resources-reference/v1.6/#containerstatus-v1-core).

-->

## Pod 和容器状态

有关 Pod 容器状态的详细信息，请参阅 [PodStatus](/docs/resources-reference/v1.7/#podstatus-v1-core) 和 [ContainerStatus](/docs/resources-reference/v1.7/#containerstatus-v1-core)。请注意，报告的 Pod 状态信息取决于当前的 [ContainerState](/docs/resources-reference/v1.7/#containerstatus-v1-core)。

<!--

## Restart policy

A PodSpec has a `restartPolicy` field with possible values Always, OnFailure,
and Never. The default value is Always.
`restartPolicy` applies to all Containers in the Pod. `restartPolicy` only
refers to restarts of the Containers by the kubelet on the same node. Failed
Containers that are restarted by the kubelet are restarted with an exponential
back-off delay (10s, 20s, 40s ...) capped at five minutes, and is reset after ten
minutes of successful execution. As discussed in the
[Pods document](/docs/user-guide/pods/#durability-of-pods-or-lack-thereof),
once bound to a node, a Pod will never be rebound to another node.

-->

## 重启策略

PodSpec 中有一个 `restartPolicy` 字段，可能的值为 Always、OnFailure 和 Never。默认为 Always。 `restartPolicy` 适用于 Pod 中的所有容器。`restartPolicy` 仅指通过同一节点上的 kubelet 重新启动容器。失败的容器由 kubelet 以五分钟为上限的指数退避延迟（10秒，20秒，40秒...）重新启动，并在成功执行十分钟后重置。如 [Pod 文档](/docs/user-guide/pods/#durability-of-pods-or-lack-thereof) 中所述，一旦绑定到一个节点，Pod 将永远不会重新绑定到另一个节点。

<!--

## Pod lifetime

In general, Pods do not disappear until someone destroys them. This might be a
human or a controller. The only exception to
this rule is that Pods with a `phase` of Succeeded or Failed for more than some
duration (determined by the master) will expire and be automatically destroyed.

Three types of controllers are available:

- Use a [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) for Pods that are expected to terminate,
  for example, batch computations. Jobs are appropriate only for Pods with
  `restartPolicy` equal to OnFailure or Never.

- Use a [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/),
  [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/), or
  [Deployment](/docs/concepts/workloads/controllers/deployment/)
  for Pods that are not expected to terminate, for example, web servers.
  ReplicationControllers are appropriate only for Pods with a `restartPolicy` of
  Always.

- Use a [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) for Pods that need to run one per
  machine, because they provide a machine-specific system service.

All three types of controllers contain a PodTemplate. It
is recommended to create the appropriate controller and let
it create Pods, rather than directly create Pods yourself. That is because Pods
alone are not resilient to machine failures, but controllers are.

If a node dies or is disconnected from the rest of the cluster, Kubernetes
applies a policy for setting the `phase` of all Pods on the lost node to Failed.

-->

## Pod 的生命

一般来说，Pod 不会消失，直到人为销毁他们。这可能是一个人或控制器。这个规则的唯一例外是成功或失败的 `phase` 超过一段时间（由 master 确定）的Pod将过期并被自动销毁。

有三种可用的控制器：

- 使用 [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) 运行预期会终止的 Pod，例如批量计算。Job 仅适用于重启策略为 `OnFailure` 或 `Never` 的 Pod。


- 对预期不会终止的 Pod 使用 [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/)、[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) 和 [Deployment](/docs/concepts/workloads/controllers/deployment/) ，例如 Web 服务器。 ReplicationController 仅适用于具有 `restartPolicy` 为 Always 的 Pod。
- 提供特定于机器的系统服务，使用 [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) 为每台机器运行一个 Pod 。

所有这三种类型的控制器都包含一个 PodTemplate。建议创建适当的控制器，让它们来创建 Pod，而不是直接自己创建 Pod。这是因为单独的 Pod 在机器故障的情况下没有办法自动复原，而控制器却可以。

如果节点死亡或与集群的其余部分断开连接，则 Kubernetes 将应用一个策略将丢失节点上的所有 Pod 的 `phase` 设置为 Failed。

<!--

## Examples

### Advanced liveness probe example

Liveness probes are executed by the kubelet, so all requests are made in the
kubelet network namespace.

-->

## 示例

### 高级 liveness 探针示例

存活探针由 kubelet 来执行，因此所有的请求都在 kubelet 的网络命名空间中进行。

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    test: liveness
  name: liveness-http
spec:
  containers:
  - args:
    - /server
    image: gcr.io/google_containers/liveness
    livenessProbe:
      httpGet:
        # when "host" is not defined, "PodIP" will be used
        # host: my-host
        # when "scheme" is not defined, "HTTP" scheme will be used. Only "HTTP" and "HTTPS" are allowed
        # scheme: HTTPS
        path: /healthz
        port: 8080
        httpHeaders:
          - name: X-Custom-Header
            value: Awesome
      initialDelaySeconds: 15
      timeoutSeconds: 1
    name: liveness
```

<!--

### Example states

   * Pod is running and has one Container. Container exits with success.
     * Log completion event.
     * If `restartPolicy` is:
       * Always: Restart Container; Pod `phase` stays Running.
       * OnFailure: Pod `phase` becomes Succeeded.
       * Never: Pod `phase` becomes Succeeded.

   * Pod is running and has one Container. Container exits with failure.
     * Log failure event.
     * If `restartPolicy` is:
       * Always: Restart Container; Pod `phase` stays Running.
       * OnFailure: Restart Container; Pod `phase` stays Running.
       * Never: Pod `phase` becomes Failed.

   * Pod is running and has two Containers. Container 1 exits with failure.
     * Log failure event.
     * If `restartPolicy` is:
       * Always: Restart Container; Pod `phase` stays Running.
       * OnFailure: Restart Container; Pod `phase` stays Running.
       * Never: Do not restart Container; Pod `phase` stays Running.
     * If Container 1 is not running, and Container 2 exits:
       * Log failure event.
       * If `restartPolicy` is:
         * Always: Restart Container; Pod `phase` stays Running.
         * OnFailure: Restart Container; Pod `phase` stays Running.
         * Never: Pod `phase` becomes Failed.

   * Pod is running and has one Container. Container runs out of memory.
     * Container terminates in failure.
     * Log OOM event.
     * If `restartPolicy` is:
       * Always: Restart Container; Pod `phase` stays Running.
       * OnFailure: Restart Container; Pod `phase` stays Running.
       * Never: Log failure event; Pod `phase` becomes Failed.

   * Pod is running, and a disk dies.
     * Kill all Containers.
     * Log appropriate event.
     * Pod `phase` becomes Failed.
     * If running under a controller, Pod is recreated elsewhere.

   * Pod is running, and its node is segmented out.
     * Node controller waits for timeout.
     * Node controller sets Pod `phase` to Failed.
     * If running under a controller, Pod is recreated elsewhere.

{% endcapture %}


{% capture whatsnext %}

* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).
* Get hands-on experience
  [configuring liveness and readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/).
* Learn more about [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).

-->

### 状态示例

- Pod 中只有一个容器并且正在运行。容器成功退出。
  - 记录完成事件。
  - 如果 `restartPolicy` 为：
    - Always：重启容器；Pod `phase` 仍为 Running。
    - OnFailure：Pod `phase` 变成 Succeeded。
    - Never：Pod `phase` 变成 Succeeded。
- Pod 中只有一个容器并且正在运行。容器退出失败。
  - 记录失败事件。
  - 如果 `restartPolicy` 为：
    - Always：重启容器；Pod `phase` 仍为 Running。
    - OnFailure：重启容器；Pod `phase` 仍为 Running。
    - Never：Pod `phase` 变成 Failed。
- Pod 中有两个容器并且正在运行。有一个容器退出失败。
  - 记录失败事件。
  - 如果 restartPolicy 为：
    - Always：重启容器；Pod `phase` 仍为 Running。
    - OnFailure：重启容器；Pod `phase` 仍为 Running。
    - Never：不重启容器；Pod `phase` 仍为 Running。
  - 如果有一个容器没有处于运行状态，并且两个容器退出：
    - 记录失败事件。
    - 如果 `restartPolicy` 为：
      - Always：重启容器；Pod `phase` 仍为 Running。
      - OnFailure：重启容器；Pod `phase` 仍为 Running。
      - Never：Pod `phase` 变成 Failed。
- Pod 中只有一个容器并处于运行状态。容器运行时内存超出限制：
  - 容器以失败状态终止。
  - 记录 OOM 事件。
  - 如果 `restartPolicy` 为：
    - Always：重启容器；Pod `phase` 仍为 Running。
    - OnFailure：重启容器；Pod `phase` 仍为 Running。
    - Never: 记录失败事件；Pod `phase` 仍为 Failed。
- Pod 正在运行，磁盘故障：
  - 杀掉所有容器。
  - 记录适当事件。
  - Pod `phase` 变成 Failed。
  - 如果使用控制器来运行，Pod 将在别处重建。
- Pod 正在运行，其节点被分段。
  - 节点控制器等待直到超时。
  - 节点控制器将 Pod `phase` 设置为 Failed。
  - 如果是用控制器来运行，Pod 将在别处重建。

{% endcapture %}

{% include templates/concept.md %}

