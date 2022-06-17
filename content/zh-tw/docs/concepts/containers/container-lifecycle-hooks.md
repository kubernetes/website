---
title: 容器生命週期回撥
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
這個頁面描述了 kubelet 管理的容器如何使用容器生命週期回撥框架，
藉由其管理生命週期中的事件觸發，執行指定程式碼。

<!-- body -->

<!--
## Overview

Analogous to many programming language frameworks that have component lifecycle hooks, such as Angular,
Kubernetes provides Containers with lifecycle hooks.
The hooks enable Containers to be aware of events in their management lifecycle
and run code implemented in a handler when the corresponding lifecycle hook is executed.
-->
## 概述

類似於許多具有生命週期回撥元件的程式語言框架，例如 Angular、Kubernetes 為容器提供了生命週期回撥。
回撥使容器能夠了解其管理生命週期中的事件，並在執行相應的生命週期回撥時執行在處理程式中實現的程式碼。

<!--
## Container hooks

There are two hooks that are exposed to Containers:
-->
## 容器回撥

有兩個回撥暴露給容器：

`PostStart`

<!--
This hook is executed immediately after a container is created.
However, there is no guarantee that the hook will execute before the container ENTRYPOINT.
No parameters are passed to the handler.
-->
這個回撥在容器被建立之後立即被執行。
但是，不能保證回撥會在容器入口點（ENTRYPOINT）之前執行。
沒有引數傳遞給處理程式。

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
在容器因 API 請求或者管理事件（諸如存活態探針、啟動探針失敗、資源搶佔、資源競爭等）
而被終止之前，此回撥會被呼叫。
如果容器已經處於已終止或者已完成狀態，則對 preStop 回撥的呼叫將失敗。
在用來停止容器的 TERM 訊號被髮出之前，回撥必須執行結束。
Pod 的終止寬限週期在 `PreStop` 回撥被執行之前即開始計數，所以無論
回撥函式的執行結果如何，容器最終都會在 Pod 的終止寬限期內被終止。
沒有引數會被傳遞給處理程式。

<!--
A more detailed description of the termination behavior can be found in
[Termination of Pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).
-->
有關終止行為的更詳細描述，請參見
[終止 Pod](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#termination-of-pods)。

<!--
### Hook handler implementations

Containers can access a hook by implementing and registering a handler for that hook.
There are two types of hook handlers that can be implemented for Containers:
-->
### 回撥處理程式的實現

容器可以透過實現和註冊該回調的處理程式來訪問該回調。
針對容器，有兩種型別的回撥處理程式可供實現：

<!--
* Exec - Executes a specific command, such as `pre-stop.sh`, inside the cgroups and namespaces of the Container.
Resources consumed by the command are counted against the Container.
* HTTP - Executes an HTTP request against a specific endpoint on the Container.
-->

* Exec - 在容器的 cgroups 和名稱空間中執行特定的命令（例如 `pre-stop.sh`）。
  命令所消耗的資源計入容器的資源消耗。
* HTTP - 對容器上的特定端點執行 HTTP 請求。

<!--
### Hook handler execution

When a Container lifecycle management hook is called,
the Kubernetes management system executes the handler according to the hook action,
`httpGet` and `tcpSocket` are executed by the kubelet process, and `exec` is executed in the container.
-->
### 回撥處理程式執行

當呼叫容器生命週期管理回撥時，Kubernetes 管理系統根據回撥動作執行其處理程式，
`httpGet` 和 `tcpSocket` 在kubelet 程序執行，而 `exec` 則由容器內執行 。

<!--
Hook handler calls are synchronous within the context of the Pod containing the Container.
This means that for a `PostStart` hook,
the Container ENTRYPOINT and hook fire asynchronously.
However, if the hook takes too long to run or hangs,
the Container cannot reach a `running` state.
-->
回撥處理程式呼叫在包含容器的 Pod 上下文中是同步的。
這意味著對於 `PostStart` 回撥，容器入口點和回撥非同步觸發。
但是，如果回撥執行或掛起的時間太長，則容器無法達到 `running` 狀態。

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
`PreStop` 回撥並不會與停止容器的訊號處理程式非同步執行；回撥必須在
可以傳送訊號之前完成執行。
如果 `PreStop` 回撥在執行期間停滯不前，Pod 的階段會變成 `Terminating`
並且一直處於該狀態，直到其 `terminationGracePeriodSeconds` 耗盡為止，
這時 Pod 會被殺死。
這一寬限期是針對 `PreStop` 回撥的執行時間及容器正常停止時間的總和而言的。
例如，如果 `terminationGracePeriodSeconds` 是 60，回撥函式花了 55 秒鐘
完成執行，而容器在收到訊號之後花了 10 秒鐘來正常結束，那麼容器會在其
能夠正常結束之前即被殺死，因為 `terminationGracePeriodSeconds` 的值
小於後面兩件事情所花費的總時間（55+10）。

<!--
If either a `PostStart` or `PreStop` hook fails,
it kills the Container.
-->
如果 `PostStart` 或 `PreStop` 回撥失敗，它會殺死容器。

<!--
Users should make their hook handlers as lightweight as possible.
There are cases, however, when long running commands make sense,
such as when saving state prior to stopping a Container.
-->
使用者應該使他們的回撥處理程式儘可能的輕量級。
但也需要考慮長時間執行的命令也很有用的情況，比如在停止容器之前儲存狀態。

<!--
### Hook delivery guarantees

Hook delivery is intended to be *at least once*,
which means that a hook may be called multiple times for any given event,
such as for `PostStart` or `PreStop`.
It is up to the hook implementation to handle this correctly.
-->
### 回撥遞送保證

回撥的遞送應該是 *至少一次*，這意味著對於任何給定的事件，
例如 `PostStart` 或 `PreStop`，回撥可以被呼叫多次。
如何正確處理被多次呼叫的情況，是回撥實現所要考慮的問題。

<!--
Generally, only single deliveries are made.
If, for example, an HTTP hook receiver is down and is unable to take traffic,
there is no attempt to resend.
In some rare cases, however, double delivery may occur.
For instance, if a kubelet restarts in the middle of sending a hook,
the hook might be resent after the kubelet comes back up.
-->
通常情況下，只會進行單次遞送。
例如，如果 HTTP 回撥接收器宕機，無法接收流量，則不會嘗試重新發送。
然而，偶爾也會發生重複遞送的可能。
例如，如果 kubelet 在傳送回撥的過程中重新啟動，回撥可能會在 kubelet 恢復後重新發送。

<!--
### Debugging Hook handlers

The logs for a Hook handler are not exposed in Pod events.
If a handler fails for some reason, it broadcasts an event.
For `PostStart`, this is the `FailedPostStartHook` event,
and for `PreStop`, this is the `FailedPreStopHook` event.
To generate a failed `FailedPreStopHook` event yourself, modify the [lifecycle-events.yaml](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/lifecycle-events.yaml) file to change the postStart command to "badcommand" and apply it.
Here is some example output of the resulting events you see from running `kubectl describe pod lifecycle-demo`:
-->
### 除錯回撥處理程式

回撥處理程式的日誌不會在 Pod 事件中公開。
如果處理程式由於某種原因失敗，它將播放一個事件。
對於 `PostStart`，這是 `FailedPostStartHook` 事件，對於 `PreStop`，這是 `FailedPreStopHook` 事件。
要自己生成失敗的 `FailedPreStopHook` 事件，請修改
[lifecycle-events.yaml](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/lifecycle-events.yaml)
檔案將 postStart 命令更改為 ”badcommand“ 並應用它。
以下是透過執行 `kubectl describe pod lifecycle-demo` 後你看到的一些結果事件的示例輸出：

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

* 進一步瞭解[容器環境](/zh-cn/docs/concepts/containers/container-environment/)
* 動手實踐，[為容器生命週期事件新增處理程式](/zh-cn/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)

