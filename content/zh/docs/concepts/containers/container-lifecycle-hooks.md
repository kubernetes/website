---
title: 容器生命周期回调
content_type: concept
weight: 30
---
<!--
reviewers:
- mikedanese
- thockin
title: Container Lifecycle Hooks
content_type: concept
weight: 30
-->

<!-- overview -->

<!--
This page describes how kubelet managed Containers can use the Container lifecycle hook framework
to run code triggered by events during their management lifecycle.
-->
这个页面描述了 kubelet 管理的容器如何使用容器生命周期回调框架，
藉由其管理生命周期中的事件触发，运行指定代码。

<!-- body -->

<!--
## Overview

Analogous to many programming language frameworks that have component lifecycle hooks, such as Angular,
Kubernetes provides Containers with lifecycle hooks.
The hooks enable Containers to be aware of events in their management lifecycle
and run code implemented in a handler when the corresponding lifecycle hook is executed.
-->
## 概述

类似于许多具有生命周期回调组件的编程语言框架，例如 Angular、Kubernetes 为容器提供了生命周期回调。
回调使容器能够了解其管理生命周期中的事件，并在执行相应的生命周期回调时运行在处理程序中实现的代码。

<!--
## Container hooks

There are two hooks that are exposed to Containers:
-->
## 容器回调

有两个回调暴露给容器：

`PostStart`

<!--
This hook is executed immediately after a container is created.
However, there is no guarantee that the hook will execute before the container ENTRYPOINT.
No parameters are passed to the handler.
-->
这个回调在容器被创建之后立即被执行。
但是，不能保证回调会在容器入口点（ENTRYPOINT）之前执行。
没有参数传递给处理程序。

`PreStop`

<!--
This hook is called immediately before a container is terminated due to an API request or management event such as liveness probe failure, preemption, resource contention and others. A call to the preStop hook fails if the container is already in terminated or completed state.
It is blocking, meaning it is synchronous,
so it must complete before the signal to stop the container can be sent.
No parameters are passed to the handler.
-->
在容器因 API 请求或者管理事件（诸如存活态探针失败、资源抢占、资源竞争等）而被终止之前，
此回调会被调用。
如果容器已经处于终止或者完成状态，则对 preStop 回调的调用将失败。
此调用是阻塞的，也是同步调用，因此必须在发出删除容器的信号之前完成。
没有参数传递给处理程序。

<!--
A more detailed description of the termination behavior can be found in
[Termination of Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).
-->
有关终止行为的更详细描述，请参见
[终止 Pod](/zh/docs/concepts/workloads/pods/pod-lifecycle/#termination-of-pods)。

<!--
### Hook handler implementations

Containers can access a hook by implementing and registering a handler for that hook.
There are two types of hook handlers that can be implemented for Containers:
-->
### 回调处理程序的实现

容器可以通过实现和注册该回调的处理程序来访问该回调。
针对容器，有两种类型的回调处理程序可供实现：

<!--
* Exec - Executes a specific command, such as `pre-stop.sh`, inside the cgroups and namespaces of the Container.
Resources consumed by the command are counted against the Container.
* HTTP - Executes an HTTP request against a specific endpoint on the Container.
-->

* Exec - 在容器的 cgroups 和名称空间中执行特定的命令（例如 `pre-stop.sh`）。
  命令所消耗的资源计入容器的资源消耗。
* HTTP - 对容器上的特定端点执行 HTTP 请求。

<!--
### Hook handler execution

When a Container lifecycle management hook is called,
the Kubernetes management system execute the handler according to the hook action,
`httpGet` and `tcpSocket` are executed by the kubelet process, and `exec` is executed in the container.
-->
### 回调处理程序执行

当调用容器生命周期管理回调时，Kubernetes 管理系统根据回调动作执行其处理程序，
`httpGet` 和 `tcpSocket` 在kubelet 进程执行，而 `exec` 则由容器内执行 。

<!--
Hook handler calls are synchronous within the context of the Pod containing the Container.
This means that for a `PostStart` hook,
the Container ENTRYPOINT and hook fire asynchronously.
However, if the hook takes too long to run or hangs,
the Container cannot reach a `running` state.
-->
回调处理程序调用在包含容器的 Pod 上下文中是同步的。
这意味着对于 `PostStart` 回调，容器入口点和回调异步触发。
但是，如果回调运行或挂起的时间太长，则容器无法达到 `running` 状态。

<!--
`PreStop` hooks are not executed asynchronously from the signal
to stop the Container; the hook must complete its execution before
the signal can be sent.
If a `PreStop` hook hangs during execution,
the Pod's phase will be `Terminating` and remain there until the Pod is
killed after its `terminationGracePeriodSeconds` expires.
This grace period applies to the total time it takes for both
the `PreStop` hook to execute and for the Container to stop normally.
If, for example, `terminationGracePeriodSeconds` is 60, and the hook
takes 55 seconds to complete, and the Container takes 10 seconds to stop
normally after receiving the signal, then the Container will be killed
before it can stop normally, since `terminationGracePeriodSeconds` is
less than the total time (55+10) it takes for these two things to happen.
-->
`PreStop` 回调并不会与停止容器的信号处理程序异步执行；回调必须在
可以发送信号之前完成执行。
如果 `PreStop` 回调在执行期间停滞不前，Pod 的阶段会变成 `Terminating`
并且一致处于该状态，直到其 `terminationGracePeriodSeconds` 耗尽为止，
这时 Pod 会被杀死。
这一宽限期是针对 `PreStop` 回调的执行时间及容器正常停止时间的总和而言的。
例如，如果 `terminationGracePeriodSeconds` 是 60，回调函数花了 55 秒钟
完成执行，而容器在收到信号之后花了 10 秒钟来正常结束，那么容器会在其
能够正常结束之前即被杀死，因为 `terminationGracePeriodSeconds` 的值
小于后面两件事情所花费的总时间（55 + 10）。

<!--
If either a `PostStart` or `PreStop` hook fails,
it kills the Container.
-->
如果 `PostStart` 或 `PreStop` 回调失败，它会杀死容器。

<!--
Users should make their hook handlers as lightweight as possible.
There are cases, however, when long running commands make sense,
such as when saving state prior to stopping a Container.
-->
用户应该使他们的回调处理程序尽可能的轻量级。
但也需要考虑长时间运行的命令也很有用的情况，比如在停止容器之前保存状态。

<!--
### Hook delivery guarantees

Hook delivery is intended to be *at least once*,
which means that a hook may be called multiple times for any given event,
such as for `PostStart` or `PreStop`.
It is up to the hook implementation to handle this correctly.
-->
### 回调递送保证

回调的递送应该是 *至少一次*，这意味着对于任何给定的事件，
例如 `PostStart` 或 `PreStop`，回调可以被调用多次。
如何正确处理被多次调用的情况，是回调实现所要考虑的问题。

<!--
Generally, only single deliveries are made.
If, for example, an HTTP hook receiver is down and is unable to take traffic,
there is no attempt to resend.
In some rare cases, however, double delivery may occur.
For instance, if a kubelet restarts in the middle of sending a hook,
the hook might be resent after the kubelet comes back up.
-->
通常情况下，只会进行单次递送。
例如，如果 HTTP 回调接收器宕机，无法接收流量，则不会尝试重新发送。
然而，偶尔也会发生重复递送的可能。
例如，如果 kubelet 在发送回调的过程中重新启动，回调可能会在 kubelet 恢复后重新发送。

<!--
### Debugging Hook handlers

The logs for a Hook handler are not exposed in Pod events.
If a handler fails for some reason, it broadcasts an event.
For `PostStart`, this is the `FailedPostStartHook` event,
and for `PreStop`, this is the `FailedPreStopHook` event.
You can see these events by running `kubectl describe pod <pod_name>`.
Here is some example output of events from running this command:
-->
### 调试回调处理程序

回调处理程序的日志不会在 Pod 事件中公开。
如果处理程序由于某种原因失败，它将播放一个事件。
对于 `PostStart`，这是 `FailedPostStartHook` 事件，对于 `PreStop`，这是 `FailedPreStopHook` 事件。
您可以通过运行 `kubectl describe pod <pod_name>` 命令来查看这些事件。
下面是运行这个命令的一些事件输出示例:

```
Events:
  FirstSeen    LastSeen    Count    From                            SubobjectPath        Type        Reason        Message
  ---------    --------    -----    ----                            -------------        --------    ------        -------
  1m        1m        1    {default-scheduler }                                Normal        Scheduled    Successfully assigned test-1730497541-cq1d2 to gke-test-cluster-default-pool-a07e5d30-siqd
  1m        1m        1    {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}    spec.containers{main}    Normal        Pulling        pulling image "test:1.0"
  1m        1m        1    {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}    spec.containers{main}    Normal        Created        Created container with docker id 5c6a256a2567; Security:[seccomp=unconfined]
  1m        1m        1    {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}    spec.containers{main}    Normal        Pulled        Successfully pulled image "test:1.0"
  1m        1m        1    {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}    spec.containers{main}    Normal        Started        Started container with docker id 5c6a256a2567
  38s        38s        1    {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}    spec.containers{main}    Normal        Killing        Killing container with docker id 5c6a256a2567: PostStart handler: Error executing in Docker Container: 1
  37s        37s        1    {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}    spec.containers{main}    Normal        Killing        Killing container with docker id 8df9fdfd7054: PostStart handler: Error executing in Docker Container: 1
  38s        37s        2    {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}                Warning        FailedSync    Error syncing pod, skipping: failed to "StartContainer" for "main" with RunContainerError: "PostStart handler: Error executing in Docker Container: 1"
  1m         22s         2     {kubelet gke-test-cluster-default-pool-a07e5d30-siqd}    spec.containers{main}    Warning        FailedPostStartHook
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about the [Container environment](/docs/concepts/containers/container-environment/).
* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).
-->

* 进一步了解[容器环境](/zh/docs/concepts/containers/container-environment/)
* 动手实践，[为容器生命周期事件添加处理程序](/zh/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)

