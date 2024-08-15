---
title: 容器生命周期回调
content_type: concept
weight: 40
---
<!--
reviewers:
- mikedanese
- thockin
title: Container Lifecycle Hooks
content_type: concept
weight: 40
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
## 概述   {#overview}

类似于许多具有生命周期回调组件的编程语言框架，例如 Angular、Kubernetes 为容器提供了生命周期回调。
回调使容器能够了解其管理生命周期中的事件，并在执行相应的生命周期回调时运行在处理程序中实现的代码。

<!--
## Container hooks

There are two hooks that are exposed to Containers:
-->
## 容器回调 {#container-hooks}

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
This hook is called immediately before a container is terminated due to an API request or management
event such as a liveness/startup probe failure, preemption, resource contention and others. A call
to the `PreStop` hook fails if the container is already in a terminated or completed state and the
hook must complete before the TERM signal to stop the container can be sent. The Pod's termination
grace period countdown begins before the `PreStop` hook is executed, so regardless of the outcome of
the handler, the container will eventually terminate within the Pod's termination grace period. No
parameters are passed to the handler.
-->
在容器因 API 请求或者管理事件（诸如存活态探针、启动探针失败、资源抢占、资源竞争等）
而被终止之前，此回调会被调用。
如果容器已经处于已终止或者已完成状态，则对 preStop 回调的调用将失败。
在用来停止容器的 TERM 信号被发出之前，回调必须执行结束。
Pod 的终止宽限周期在 `PreStop` 回调被执行之前即开始计数，
所以无论回调函数的执行结果如何，容器最终都会在 Pod 的终止宽限期内被终止。
没有参数会被传递给处理程序。

<!--
A more detailed description of the termination behavior can be found in
[Termination of Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).
-->
有关终止行为的更详细描述，
请参见[终止 Pod](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)。

<!--
### Hook handler implementations

Containers can access a hook by implementing and registering a handler for that hook.
There are three types of hook handlers that can be implemented for Containers:
-->
### 回调处理程序的实现   {#hook-handler-implementations}

容器可以通过实现和注册该回调的处理程序来访问该回调。
针对容器，有三种类型的回调处理程序可供实现：

<!--
* Exec - Executes a specific command, such as `pre-stop.sh`, inside the cgroups and namespaces of the Container.
Resources consumed by the command are counted against the Container.
* HTTP - Executes an HTTP request against a specific endpoint on the Container.
* Sleep - Pauses the container for a specified duration.
  This is a beta-level feature default enabled by the `PodLifecycleSleepAction` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
-->

* Exec - 在容器的 cgroups 和名字空间中执行特定的命令（例如 `pre-stop.sh`）。
  命令所消耗的资源计入容器的资源消耗。
* HTTP - 对容器上的特定端点执行 HTTP 请求。
* Sleep - 将容器暂停一段指定的时间。
  这是由 `PodLifecycleSleepAction`
  [特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)默认启用的 Beta 级特性。

<!--
### Hook handler execution

When a Container lifecycle management hook is called,
the Kubernetes management system executes the handler according to the hook action,
`httpGet` , `tcpSocket` and `sleep` are executed by the kubelet process, and `exec` is executed in the container.
-->
### 回调处理程序执行   {#hook-handler-execution}

当调用容器生命周期管理回调时，Kubernetes 管理系统根据回调动作执行其处理程序，
`httpGet`、`tcpSocket` 和 `sleep` 由 kubelet 进程执行，而 `exec` 在容器中执行。

<!--
The `PostStart` hook handler call is initiated when a container is created,
meaning the container ENTRYPOINT and the `PostStart` hook are triggered simultaneously. 
However, if the `PostStart` hook takes too long to execute or if it hangs,
it can prevent the container from transitioning to a `running` state.
-->
当容器创建时，会调用 `PostStart` 回调程序，
这意味着容器的 ENTRYPOINT 和 `PostStart` 回调会同时触发。然而，
如果 `PostStart` 回调程序执行时间过长或挂起，它可能会阻止容器进入 `running` 状态。

<!--
`PreStop` hooks are not executed asynchronously from the signal
to stop the Container; the hook must complete its execution before
the TERM signal can be sent.
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
`PreStop` 回调并不会与停止容器的信号处理程序异步执行；回调必须在可以发送信号之前完成执行。
如果 `PreStop` 回调在执行期间停滞不前，Pod 的阶段会变成 `Terminating`并且一直处于该状态，
直到其 `terminationGracePeriodSeconds` 耗尽为止，这时 Pod 会被杀死。
这一宽限期是针对 `PreStop` 回调的执行时间及容器正常停止时间的总和而言的。
例如，如果 `terminationGracePeriodSeconds` 是 60，回调函数花了 55 秒钟完成执行，
而容器在收到信号之后花了 10 秒钟来正常结束，那么容器会在其能够正常结束之前即被杀死，
因为 `terminationGracePeriodSeconds` 的值小于后面两件事情所花费的总时间（55+10）。

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
### 回调递送保证   {#hook-delivery-guarantees}

回调的递送应该是**至少一次**，这意味着对于任何给定的事件，
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
To generate a failed `FailedPostStartHook` event yourself, modify the [lifecycle-events.yaml](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/lifecycle-events.yaml) file to change the postStart command to "badcommand" and apply it.
Here is some example output of the resulting events you see from running `kubectl describe pod lifecycle-demo`:
-->
### 调试回调处理程序   {#debugging-hook-handlers}

回调处理程序的日志不会在 Pod 事件中公开。
如果处理程序由于某种原因失败，它将播放一个事件。
对于 `PostStart`，这是 `FailedPostStartHook` 事件，对于 `PreStop`，这是 `FailedPreStopHook` 事件。
要自己生成失败的 `FailedPostStartHook` 事件，请修改
[lifecycle-events.yaml](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/lifecycle-events.yaml)
文件将 postStart 命令更改为 “badcommand” 并应用它。
以下是通过运行 `kubectl describe pod lifecycle-demo` 后你看到的一些结果事件的示例输出：

```
Events:
  Type     Reason               Age              From               Message
  ----     ------               ----             ----               -------
  Normal   Scheduled            7s               default-scheduler  Successfully assigned default/lifecycle-demo to ip-XXX-XXX-XX-XX.us-east-2...
  Normal   Pulled               6s               kubelet            Successfully pulled image "nginx" in 229.604315ms
  Normal   Pulling              4s (x2 over 6s)  kubelet            Pulling image "nginx"
  Normal   Created              4s (x2 over 5s)  kubelet            Created container lifecycle-demo-container
  Normal   Started              4s (x2 over 5s)  kubelet            Started container lifecycle-demo-container
  Warning  FailedPostStartHook  4s (x2 over 5s)  kubelet            Exec lifecycle hook ([badcommand]) for Container "lifecycle-demo-container" in Pod "lifecycle-demo_default(30229739-9651-4e5a-9a32-a8f1688862db)" failed - error: command 'badcommand' exited with 126: , message: "OCI runtime exec failed: exec failed: container_linux.go:380: starting container process caused: exec: \"badcommand\": executable file not found in $PATH: unknown\r\n"
  Normal   Killing              4s (x2 over 5s)  kubelet            FailedPostStartHook
  Normal   Pulled               4s               kubelet            Successfully pulled image "nginx" in 215.66395ms
  Warning  BackOff              2s (x2 over 3s)  kubelet            Back-off restarting failed container
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about the [Container environment](/docs/concepts/containers/container-environment/).
* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).
-->
* 进一步了解[容器环境](/zh-cn/docs/concepts/containers/container-environment/)。
* 动手[为容器的生命周期事件设置处理函数](/zh-cn/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)。
