---
title: 存活、就緒和啓動探針
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
Kubernetes 提供了多種探針：

- [存活探針](#liveness-probe)
- [就緒探針](#readiness-probe)
- [啓動探針](#startup-probe)

<!-- body -->

<!--
## Liveness probe

Liveness probes determine when to restart a container. For example, liveness probes could catch a deadlock when an application is running, but unable to make progress.
-->
## 存活探針   {#liveness-probe}

存活探針決定何時重啓容器。
例如，當應用在運行但無法取得進展時，存活探針可以捕獲這類死鎖。

<!--
If a container fails its liveness probe repeatedly, the kubelet restarts the container.
-->
如果一個容器的存活探針失敗多次，kubelet 將重啓該容器。

<!--
Liveness probes do not wait for readiness probes to succeed. If you want to wait before executing a liveness probe, you can either define `initialDelaySeconds`, or use a
[startup probe](#startup-probe).
-->
存活探針不會等待就緒探針成功。
如果你想在執行存活探針前等待，你可以定義 `initialDelaySeconds`，或者使用[啓動探針](#startup-probe)。

<!--
## Readiness probe

Readiness probes determine when a container is ready to accept traffic. This is useful when waiting for an application to perform time-consuming initial tasks that depend on its backing services; for example: establishing network connections, loading files, and warming caches. Readiness probes can also be useful later in the container’s lifecycle, for example, when recovering from temporary faults or overloads.
-->
## 就緒探針   {#readiness-probe}

就緒探針決定容器何時準備好接受流量。
這種探針在等待應用執行耗時的初始任務時非常有用；
例如：建立網路連接、加載文件和預熱緩存。在容器的生命週期後期，
就緒探針也很有用，例如，從臨時故障或過載中恢復時。

<!--
If the readiness probe returns a failed state, Kubernetes removes the pod from all matching service endpoints.

Readiness probes run on the container during its whole lifecycle.
-->
如果就緒探針返回的狀態爲失敗，Kubernetes 會將該 Pod 從所有對應服務的端點中移除。

就緒探針在容器的整個生命期內持續運行。

<!--
## Startup probe

A startup probe verifies whether the application within a container is started. This can be used to adopt liveness checks on slow starting containers, avoiding them getting killed by the kubelet before they are up and running.
-->
## 啓動探針   {#startup-probe}

啓動探針檢查容器內的應用是否已啓動。
啓動探針可以用於對慢啓動容器進行存活性檢測，避免它們在啓動運行之前就被 kubelet 殺掉。

<!--
If such a probe is configured, it disables liveness and readiness checks until it succeeds.
-->
如果設定了這類探針，它會禁用存活檢測和就緒檢測，直到啓動探針成功爲止。

<!--
This type of probe is only executed at startup, unlike liveness and readiness probes, which are run periodically.

* Read more about the [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes).
-->
這類探針僅在啓動時執行，不像存活探針和就緒探針那樣週期性地運行。

* 更多細節參閱[設定存活、就緒和啓動探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes)。
