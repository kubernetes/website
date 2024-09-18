---
title: 存活、就绪和启动探针
content_type: concept
weight: 40
---
<!--
title: Liveness, Readiness, and Startup Probes
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
Kubernetes has various types of probes:

- [Liveness probe](#liveness-probe)
- [Readiness probe](#readiness-probe)
- [Startup probe](#startup-probe)
-->
Kubernetes 提供了多种探针：

- [存活探针](#liveness-probe)
- [就绪探针](#readiness-probe)
- [启动探针](#startup-probe)

<!-- body -->

<!--
## Liveness probe

Liveness probes determine when to restart a container. For example, liveness probes could catch a deadlock, when an application is running, but unable to make progress.
-->
## 存活探针   {#liveness-probe}

存活探针决定何时重启容器。
例如，当应用在运行但无法取得进展时，存活探针可以捕获这类死锁。

<!--
If a container fails its liveness probe repeatedly, the kubelet restarts the container.
-->
如果一个容器的存活探针失败多次，kubelet 将重启该容器。

<!--
Liveness probes do not wait for readiness probes to succeed. If you want to wait before
executing a liveness probe you can either define `initialDelaySeconds`, or use a
[startup probe](#startup-probe).
-->
存活探针不会等待就绪探针成功。
如果你想在执行存活探针前等待，你可以定义 `initialDelaySeconds`，或者使用[启动探针](#startup-probe)。

<!--
## Readiness probe

Readiness probes determine when a container is ready to start accepting traffic. This is useful when waiting for an application to perform time-consuming initial tasks, such as establishing network connections, loading files, and warming caches. 
-->
## 就绪探针   {#readiness-probe}

就绪探针决定何时容器准备好开始接受流量。
这种探针在等待应用执行耗时的初始任务时非常有用，例如建立网络连接、加载文件和预热缓存。

<!--
If the readiness probe returns a failed state, Kubernetes removes the pod from all matching service endpoints.

Readiness probes runs on the container during its whole lifecycle.
-->
如果就绪探针返回的状态为失败，Kubernetes 会将该 Pod 从所有对应服务的端点中移除。

就绪探针在容器的整个生命期内持续运行。

<!--
## Startup probe

A startup probe verifies whether the application within a container is started. This can be used to adopt liveness checks on slow starting containers, avoiding them getting killed by the kubelet before they are up and running.
-->
## 启动探针   {#startup-probe}

启动探针检查容器内的应用是否已启动。
启动探针可以用于对慢启动容器进行存活性检测，避免它们在启动运行之前就被 kubelet 杀掉。

<!--
If such a probe is configured, it disables liveness and readiness checks until it succeeds.
-->
如果配置了这类探针，它会禁用存活检测和就绪检测，直到启动探针成功为止。

<!--
This type of probe is only executed at startup, unlike liveness and readiness probes, which are run periodically.

* Read more about the [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes).
-->
这类探针仅在启动时执行，不像存活探针和就绪探针那样周期性地运行。

* 更多细节参阅[配置存活、就绪和启动探针](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes)。
