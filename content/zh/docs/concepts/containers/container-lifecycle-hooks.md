---
title: 容器生命周期钩子
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

<!--
This page describes how kubelet managed Containers can use the Container lifecycle hook framework
to run code triggered by events during their management lifecycle.
-->
这个页面描述了 kubelet 管理的容器如何使用容器生命周期钩子框架来运行在其管理生命周期中由事件触发的代码。

{{% /capture %}}


{{% capture body %}}

<!--
## Overview
-->

## 概述

<!--
Analogous to many programming language frameworks that have component lifecycle hooks, such as Angular,
Kubernetes provides Containers with lifecycle hooks.
The hooks enable Containers to be aware of events in their management lifecycle
and run code implemented in a handler when the corresponding lifecycle hook is executed.
-->
类似于许多具有生命周期钩子组件的编程语言框架，例如Angular，Kubernetes为容器提供了生命周期钩子。
钩子使容器能够了解其管理生命周期中的事件，并在执行相应的生命周期钩子时运行在处理程序中实现的代码。

<!--
## Container hooks
-->

## 容器钩子

<!--
There are two hooks that are exposed to Containers:
-->
有两个钩子暴露在容器中:

`PostStart`

<!--
This hook executes immediately after a container is created.
However, there is no guarantee that the hook will execute before the container ENTRYPOINT.
No parameters are passed to the handler.
-->
这个钩子在创建容器之后立即执行。
但是，不能保证钩子会在容器入口点之前执行。
没有参数传递给处理程序。

`PreStop`

<!--
This hook is called immediately before a container is terminated due to an API request or management event such as liveness probe failure, preemption, resource contention and others. A call to the preStop hook fails if the container is already in terminated or completed state.
It is blocking, meaning it is synchronous,
so it must complete before the call to delete the container can be sent.
No parameters are passed to the handler.
-->

在容器终止之前是否立即调用此钩子，取决于 API 的请求或者管理事件，类似活动探针故障、资源抢占、资源竞争等等。 如果容器已经完全处于终止或者完成状态，则对 preStop 钩子的调用将失败。
它是阻塞的，同时也是同步的，因此它必须在删除容器的调用之前完成。
没有参数传递给处理程序。

<!--
A more detailed description of the termination behavior can be found in
[Termination of Pods](/docs/concepts/workloads/pods/pod/#termination-of-pods).
-->
有关终止行为的更详细描述，请参见[终止 Pod](/docs/concepts/workloads/pods/pod/#termination-of-pods)。

<!--
### Hook handler implementations
-->

### 钩子处理程序的实现

<!--
Containers can access a hook by implementing and registering a handler for that hook.
There are two types of hook handlers that can be implemented for Containers:
-->
容器可以通过实现和注册该钩子的处理程序来访问该钩子。
针对容器，有两种类型的钩子处理程序可供实现：

<!--
* Exec - Executes a specific command, such as `pre-stop.sh`, inside the cgroups and namespaces of the Container.
Resources consumed by the command are counted against the Container.
* HTTP - Executes an HTTP request against a specific endpoint on the Container.
-->

* Exec - 执行一个特定的命令，例如 `pre-stop.sh`，在容器的 cgroups 和名称空间中。
命令所消耗的资源根据容器进行计算。
* HTTP - 对容器上的特定端点执行 HTTP 请求。

<!--
### Hook handler execution
-->

### 钩子处理程序执行

<!--
When a Container lifecycle management hook is called,
the Kubernetes management system executes the handler in the Container registered for that hook. 
-->
当调用容器生命周期管理钩子时，Kubernetes 管理系统在为该钩子注册的容器中执行处理程序。

<!--
Hook handler calls are synchronous within the context of the Pod containing the Container.
This means that for a `PostStart` hook,
the Container ENTRYPOINT and hook fire asynchronously.
However, if the hook takes too long to run or hangs,
the Container cannot reach a `running` state.
-->
钩子处理程序调用在包含容器的 Pod 上下文中是同步的。
这意味着对于 `PostStart` 钩子，容器入口点和钩子异步触发。
但是，如果钩子运行或挂起的时间太长，则容器无法达到 `running` 状态。

<!--
The behavior is similar for a `PreStop` hook.
If the hook hangs during execution,
the Pod phase stays in a `Terminating` state and is killed after `terminationGracePeriodSeconds` of pod ends.
If a `PostStart` or `PreStop` hook fails,
it kills the Container.
-->
行为与 `PreStop` 钩子的行为类似。
如果钩子在执行过程中挂起，Pod 阶段将保持在 `Terminating` 状态，并在 Pod 结束的 `terminationGracePeriodSeconds` 之后被杀死。
如果 `PostStart` 或 `PreStop` 钩子失败，它会杀死容器。

<!--
Users should make their hook handlers as lightweight as possible.
There are cases, however, when long running commands make sense,
such as when saving state prior to stopping a Container.
-->
用户应该使他们的钩子处理程序尽可能的轻量级。
但也需要考虑长时间运行的命令也很有用的情况，比如在停止容器之前保存状态。

<!--
### Hook delivery guarantees
-->

### 钩子寄送保证

<!--
Hook delivery is intended to be *at least once*,
which means that a hook may be called multiple times for any given event,
such as for `PostStart` or `PreStop`.
It is up to the hook implementation to handle this correctly.
-->
钩子的寄送应该是*至少一次*，这意味着对于任何给定的事件，例如 `PostStart` 或 `PreStop`，钩子可以被调用多次。
如何正确处理，是钩子实现所要考虑的问题。

<!--
Generally, only single deliveries are made.
If, for example, an HTTP hook receiver is down and is unable to take traffic,
there is no attempt to resend.
In some rare cases, however, double delivery may occur.
For instance, if a kubelet restarts in the middle of sending a hook,
the hook might be resent after the kubelet comes back up.
-->
通常情况下，只会进行单次寄送。
例如，如果 HTTP 钩子接收器宕机，无法接收流量，则不会尝试重新发送。
然而，偶尔也会发生重复寄送的可能。
例如，如果 kubelet 在发送钩子的过程中重新启动，钩子可能会在 kubelet 恢复后重新发送。

<!--
### Debugging Hook handlers
-->

### 调试钩子处理程序

<!--
The logs for a Hook handler are not exposed in Pod events.
If a handler fails for some reason, it broadcasts an event.
For `PostStart`, this is the `FailedPostStartHook` event,
and for `PreStop`, this is the `FailedPreStopHook` event.
You can see these events by running `kubectl describe pod <pod_name>`.
Here is some example output of events from running this command:
-->
钩子处理程序的日志不会在 Pod 事件中公开。
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

{{% /capture %}}

{{% capture whatsnext %}}

<!--
* Learn more about the [Container environment](/docs/concepts/containers/container-environment-variables/).
* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).
-->

* 了解更多关于[容器环境](/docs/concepts/containers/container-environment-variables/)。
* 获取实践经验[将处理程序附加到容器生命周期事件](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)。

{{% /capture %}}
