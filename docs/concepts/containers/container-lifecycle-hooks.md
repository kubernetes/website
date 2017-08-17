<!--
---
assignees:
- mikedanese
- thockin
title: Container Lifecycle Hooks
redirect_from:
- "/docs/user-guide/container-environment/"
- "/docs/user-guide/container-environment.html"
---
-->
---
assignees:
- mikedanese
- thockin
title: 容器生命周期的钩子
redirect_from:
- "/docs/user-guide/container-environment/"
- "/docs/user-guide/container-environment.html"
---
<!--
{% capture overview %}

This page describes how kubelet managed Containers can use the Container lifecycle hook framework
to run code triggered by events during their management lifecycle. 

{% endcapture %}

{:toc}

{% capture body %}
-->
本页描述了被`kubelet`管理的容器是如何使用容器生命周期的钩子框架通过其生命周期内的事件触发来运行代码的。

<!--
## Overview

Analogous to many programming language frameworks that have component lifecycle hooks, such as Angular,
Kubernetes provides Containers with lifecycle hooks.
The hooks enable Containers to be aware of events in their management lifecycle
and run code implemented in a handler when the corresponding lifecycle hook is executed.
-->
## 概述

类似于许多具有生命周期钩子组件的编程语言框架，比如[Angular](https://github.com/angular),
Kubernetes为容器提供了生命周期钩子。  
钩子能使容器感知其生命周期内的事件并且当相应的生命周期钩子被调用时运行在处理程序中实现的代码。

<!--
## Container hooks

There are two hooks that are exposed to Containers:
-->
## 容器钩子

容器中有两个钩子：
<!--
`PostStart`

This hook executes immediately after a container is created.
However, there is no guarantee that the hook will execute before the container ENTRYPOINT.
No parameters are passed to the handler. 
-->
`PostStart`

这个钩子在容器创建后立即执行。  
但是，并不能保证钩子将在容器ENTRYPOINT之前运行。  
没有参数传递给处理程序。

<!--
`PreStop`

This hook is called immediately before a container is terminated.
It is blocking, meaning it is synchronous,
so it must complete before the call to delete the container can be sent. 
No parameters are passed to the handler. 
-->
`PreStop`

这个钩子在容器终止之前立即被调用。  
它是阻塞的，意味着它是同步的，
所以它必须在删除容器的调用发出之前完成。

<!--
A more detailed description of the termination behavior can be found in
[Termination of Pods](/docs/concepts/workloads/pods/pod/#termination-of-pods).
-->
更多终止行为的详细描述可以在这找到：[Termination of Pods](/docs/concepts/workloads/pods/pod/#termination-of-pods).

<!--
### Hook handler implementations

Containers can access a hook by implementing and registering a handler for that hook.
There are two types of hook handlers that can be implemented for Containers:
-->
### 钩子处理程序的实现

容器可以通过实现和注册该钩子的处理程序来访问钩子。  
可以为容器实现两种类型的钩子处理程序：

<!--
* Exec - Executes a specific command, such as `pre-stop.sh`, inside the cgroups and namespaces of the Container.
Resources consumed by the command are counted against the Container.
* HTTP - Executes an HTTP request against a specific endpoint on the Container.
-->
* Exec - 在容器的cgroups和命名空间内执行一个特定的命令，比如`pre-stop.sh`。  
该命令消耗的资源被计入容器。  
* HTTP -  对容器上的特定的端点执行HTTP请求。

<!--
### Hook handler execution

When a Container lifecycle management hook is called,
the Kubernetes management system executes the handler in the Container registered for that hook.  
-->
### 钩子处理程序的执行

当容器生命周期管理钩子被调用后，Kubernetes管理系统执行该钩子在容器中注册的处理程序。

<!--
Hook handler calls are synchronous within the context of the Pod containing the Container.
This means that for a `PostStart` hook,
the Container ENTRYPOINT and hook fire asynchronously.
However, if the hook takes too long to run or hangs,
the Container cannot reach a `running` state. 
-->
在含有容器的Pod的上下文中钩子处理程序的调用是同步的。  
这意味着对于`PostStart`钩子，
容器ENTRYPOINT和钩子执行是异步的。  
然而，如果钩子花费太长时间以至于不能运行或者挂起，
容器将不能达到`running`状态。

<!--
The behavior is similar for a `PreStop` hook.
If the hook hangs during execution,
the Pod phase stays in a `running` state and never reaches `failed`.
If a `PostStart` or `PreStop` hook fails,
it kills the Container.
-->
`PreStop`钩子的行为是类似的。  
如果钩子在执行期间挂起，
Pod阶段将停留在`running`状态并且永不会达到`failed`状态。  
如果`PostStart`或者`PreStop`钩子失败，
它会杀死容器。

<!--
Users should make their hook handlers as lightweight as possible.
There are cases, however, when long running commands make sense,
such as when saving state prior to stopping a Container.
-->
用户应该使他们的钩子处理程序尽可能的轻量。  
然而，有些情况下，长时间运行命令是合理的，
比如在停止容器之前预先保存状态。

<!--
### Hook delivery guarantees

Hook delivery is intended to be *at least once*,
which means that a hook may be called multiple times for any given event,
such as for `PostStart` or `PreStop`.
It is up to the hook implementation to handle this correctly.
-->
### 钩子交付保证

钩子交付打算*至少一次*,这意味着对于给定的事件，一个钩子可能被多次调用，
例如对于`PostStart`或者`PreStop`。  
它是由钩子的实现来正确的处理这个。

<!--
Generally, only single deliveries are made.
If, for example, an HTTP hook receiver is down and is unable to take traffic,
there is no attempt to resend.
In some rare cases, however, double delivery may occur.
For instance, if a kubelet restarts in the middle of sending a hook, 
the hook might be resent after the kubelet comes back up.
-->
通常，只有单次交付。  
例如，如果一个HTTP钩子的接收者挂掉不能接收流量，
该钩子不会尝试重新发送。  
然而，在一些极不常见的情况下，可能发生两次交付。  
例如，如果在发送钩子的途中kubelet重启，
该钩子可能在kubelet启动之后重新发送。

<!--
### Debugging Hook handlers

The logs for a Hook handler are not exposed in Pod events.
If a handler fails for some reason, it broadcasts an event.
For `PostStart`, this is the `FailedPostStartHook` event, 
and for `PreStop`, this is the `FailedPreStopHook` event. 
You can see these events by running `kubectl describe pod <pod_name>`. 
Here is some example output of events from running this command:
-->
### 调试钩子处理程序

在Pod的事件中没有钩子处理程序的日志。
如果一个处理程序因为某些原因运行失败，它广播一个事件。  
对于`PostStart`, 这是`FailedPostStartHook`事件，
对于`PreStop`, 这是`FailedPreStopHook`事件。  
你可以通过运行`kubectl describe pod <pod_name>`来查看这些事件。  
下面是运行这条命令的输出示例：
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



<!--
{% endcapture %}

{% capture whatsnext %}

* Learn more about the [Container environment](/docs/concepts/containers/container-environment-variables/).
* Get hands-on experience
  [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

{% endcapture %}

{% include templates/concept.md %}
-->
* 了解更多关于 [Container environment](/docs/concepts/containers/container-environment-variables/)。
* 亲身体验 [attaching handlers to Container lifecycle events](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)。
