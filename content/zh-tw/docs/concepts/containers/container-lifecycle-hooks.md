---
title: 容器生命週期回調
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
這個頁面描述了 kubelet 管理的容器如何使用容器生命週期回調框架，
藉由其管理生命週期中的事件觸發，運行指定代碼。

<!-- body -->

<!--
## Overview

Analogous to many programming language frameworks that have component lifecycle hooks, such as Angular,
Kubernetes provides Containers with lifecycle hooks.
The hooks enable Containers to be aware of events in their management lifecycle
and run code implemented in a handler when the corresponding lifecycle hook is executed.
-->
## 概述   {#overview}

類似於許多具有生命週期回調組件的編程語言框架，例如 Angular、Kubernetes 爲容器提供了生命週期回調。
回調使容器能夠了解其管理生命週期中的事件，並在執行相應的生命週期回調時運行在處理程序中實現的代碼。

<!--
## Container hooks

There are two hooks that are exposed to Containers:
-->
## 容器回調 {#container-hooks}

有兩個回調暴露給容器：

`PostStart`

<!--
This hook is executed immediately after a container is created.
However, there is no guarantee that the hook will execute before the container ENTRYPOINT.
No parameters are passed to the handler.
-->
這個回調在容器被創建之後立即被執行。
但是，不能保證回調會在容器入口點（ENTRYPOINT）之前執行。
沒有參數傳遞給處理程序。

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
在容器因 API 請求或者管理事件（諸如存活態探針、啓動探針失敗、資源搶佔、資源競爭等）
而被終止之前，此回調會被調用。
如果容器已經處於已終止或者已完成狀態，則對 preStop 回調的調用將失敗。
在用來停止容器的 TERM 信號被髮出之前，回調必須執行結束。
Pod 的終止寬限週期在 `PreStop` 回調被執行之前即開始計數，
所以無論回調函數的執行結果如何，容器最終都會在 Pod 的終止寬限期內被終止。
沒有參數會被傳遞給處理程序。

<!--
A more detailed description of the termination behavior can be found in
[Termination of Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).
-->
有關終止行爲的更詳細描述，
請參見[終止 Pod](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)。

<!--
`StopSignal`

The StopSignal lifecycle can be used to define a stop signal which would be sent to the container when it is
stopped. If you set this, it overrides any `STOPSIGNAL` instruction defined within the container image.

A more detailed description of termination behaviour with custom stop signals can be found in
[Stop Signals](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-stop-signals).
-->
`StopSignal`

StopSignal 生命週期可用於定義停止信號，該信號將在容器停止時發送給容器。
如果設置了該字段，將會覆蓋容器鏡像中定義的 `STOPSIGNAL` 指令。

關於自定義停止信號的終止行爲的更爲詳細的描述，請參閱
[停止信號](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination-stop-signals)。

<!--
### Hook handler implementations

Containers can access a hook by implementing and registering a handler for that hook.
There are three types of hook handlers that can be implemented for Containers:
-->
### 回調處理程序的實現   {#hook-handler-implementations}

容器可以通過實現和註冊該回調的處理程序來訪問該回調。
針對容器，有三種類型的回調處理程序可供實現：

<!--
* Exec - Executes a specific command, such as `pre-stop.sh`, inside the cgroups and namespaces of the Container.
Resources consumed by the command are counted against the Container.
* HTTP - Executes an HTTP request against a specific endpoint on the Container.
* Sleep - Pauses the container for a specified duration.
-->

* Exec - 在容器的 cgroups 和名字空間中執行特定的命令（例如 `pre-stop.sh`）。
  命令所消耗的資源計入容器的資源消耗。
* HTTP - 對容器上的特定端點執行 HTTP 請求。
* Sleep - 將容器暫停一段指定的時間。

<!--
### Hook handler execution

When a Container lifecycle management hook is called,
the Kubernetes management system executes the handler according to the hook action,
and `sleep` are executed by the kubelet process, and `exec` is executed in the container.
-->
### 回調處理程序執行   {#hook-handler-execution}

當調用容器生命週期管理回調時，Kubernetes 管理系統根據回調動作執行其處理程序，
`httpGet`、`tcpSocket`（[已棄用](/docs/reference/generated/kubernetes-api/v1.31/#lifecyclehandler-v1-core)）
和 `sleep` 由 kubelet 進程執行，而 `exec` 在容器內執行。

<!--
The `PostStart` hook handler call is initiated when a container is created,
meaning the container ENTRYPOINT and the `PostStart` hook are triggered simultaneously. 
However, if the `PostStart` hook takes too long to execute or if it hangs,
it can prevent the container from transitioning to a `running` state.
-->
當容器創建時，會調用 `PostStart` 回調程序，
這意味着容器的 ENTRYPOINT 和 `PostStart` 回調會同時觸發。然而，
如果 `PostStart` 回調程序執行時間過長或掛起，它可能會阻止容器進入 `running` 狀態。

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
`PreStop` 回調並不會與停止容器的信號處理程序異步執行；回調必須在可以發送信號之前完成執行。
如果 `PreStop` 回調在執行期間停滯不前，Pod 的階段會變成 `Terminating`並且一直處於該狀態，
直到其 `terminationGracePeriodSeconds` 耗盡爲止，這時 Pod 會被殺死。
這一寬限期是針對 `PreStop` 回調的執行時間及容器正常停止時間的總和而言的。
例如，如果 `terminationGracePeriodSeconds` 是 60，回調函數花了 55 秒鐘完成執行，
而容器在收到信號之後花了 10 秒鐘來正常結束，那麼容器會在其能夠正常結束之前即被殺死，
因爲 `terminationGracePeriodSeconds` 的值小於後面兩件事情所花費的總時間（55+10）。

<!--
If either a `PostStart` or `PreStop` hook fails,
it kills the Container.
-->
如果 `PostStart` 或 `PreStop` 回調失敗，它會殺死容器。

<!--
Users should make their hook handlers as lightweight as possible.
There are cases, however, when long running commands make sense,
such as when saving state prior to stopping a Container.
-->
用戶應該使他們的回調處理程序儘可能的輕量級。
但也需要考慮長時間運行的命令也很有用的情況，比如在停止容器之前保存狀態。

<!--
### Hook delivery guarantees

Hook delivery is intended to be *at least once*,
which means that a hook may be called multiple times for any given event,
such as for `PostStart` or `PreStop`.
It is up to the hook implementation to handle this correctly.
-->
### 回調遞送保證   {#hook-delivery-guarantees}

回調的遞送應該是**至少一次**，這意味着對於任何給定的事件，
例如 `PostStart` 或 `PreStop`，回調可以被調用多次。
如何正確處理被多次調用的情況，是回調實現所要考慮的問題。

<!--
Generally, only single deliveries are made.
If, for example, an HTTP hook receiver is down and is unable to take traffic,
there is no attempt to resend.
In some rare cases, however, double delivery may occur.
For instance, if a kubelet restarts in the middle of sending a hook,
the hook might be resent after the kubelet comes back up.
-->
通常情況下，只會進行單次遞送。
例如，如果 HTTP 回調接收器宕機，無法接收流量，則不會嘗試重新發送。
然而，偶爾也會發生重複遞送的可能。
例如，如果 kubelet 在發送回調的過程中重新啓動，回調可能會在 kubelet 恢復後重新發送。

<!--
### Debugging Hook handlers

The logs for a Hook handler are not exposed in Pod events.
If a handler fails for some reason, it broadcasts an event.
For `PostStart`, this is the `FailedPostStartHook` event,
and for `PreStop`, this is the `FailedPreStopHook` event.
To generate a failed `FailedPostStartHook` event yourself, modify the
[lifecycle-events.yaml](https://k8s.io/examples/pods/lifecycle-events.yaml)
file to change the postStart command to "badcommand" and apply it.
Here is some example output of the resulting events you see from running `kubectl describe
pod lifecycle-demo`:
-->
### 調試回調處理程序   {#debugging-hook-handlers}

回調處理程序的日誌不會在 Pod 事件中公開。
如果處理程序由於某種原因失敗，它將播放一個事件。
對於 `PostStart`，這是 `FailedPostStartHook` 事件，對於 `PreStop`，這是 `FailedPreStopHook` 事件。
要自己生成失敗的 `FailedPostStartHook` 事件，請修改
[lifecycle-events.yaml](https://k8s.io/examples/pods/lifecycle-events.yaml)
文件將 postStart 命令更改爲 “badcommand” 並應用它。
以下是通過運行 `kubectl describe pod lifecycle-demo` 後你看到的一些結果事件的示例輸出：

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
* 進一步瞭解[容器環境](/zh-cn/docs/concepts/containers/container-environment/)。
* 動手[爲容器的生命週期事件設置處理函數](/zh-cn/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)。
