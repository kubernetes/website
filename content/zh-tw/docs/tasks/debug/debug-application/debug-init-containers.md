---
title: 調試 Init 容器
content_type: task
weight: 40
---

<!--
reviewers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Debug Init Containers
content_type: task
weight: 40
-->

<!-- overview -->

<!--
This page shows how to investigate problems related to the execution of
Init Containers. The example command lines below refer to the Pod as
`<pod-name>` and the Init Containers as `<init-container-1>` and
`<init-container-2>`.
-->
此頁顯示如何覈查與 Init 容器執行相關的問題。
下面的示例命令列將 Pod 稱爲 `<pod-name>`，而 Init 容器稱爲 `<init-container-1>` 和
`<init-container-2>`。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* You should be familiar with the basics of
  [Init Containers](/docs/concepts/workloads/pods/init-containers/).
* You should have [Configured an Init Container](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).
-->

* 你應該熟悉 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)的基礎知識。
* 你應該已經[設定好一個 Init 容器](/zh-cn/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)。

<!-- steps -->

<!--
## Checking the status of Init Containers

Display the status of your pod:
-->

## 檢查 Init 容器的狀態

顯示你的 Pod 的狀態：

```shell
kubectl get pod <pod-name>
```

<!--
For example, a status of `Init:1/2` indicates that one of two Init Containers
has completed successfully:
-->

例如，狀態 `Init:1/2` 表明兩個 Init 容器中的一個已經成功完成：

```
NAME         READY     STATUS     RESTARTS   AGE
<pod-name>   0/1       Init:1/2   0          7s
```

<!--
See [Understanding Pod status](#understanding-pod-status) for more examples of
status values and their meanings.
-->
更多狀態值及其含義請參考[理解 Pod 的狀態](#understanding-pod-status)。

<!--
## Getting details about Init Containers

View more detailed information about Init Container execution:
-->
## 獲取 Init 容器詳情   {#getting-details-about-init-containers}

查看 Init 容器運行的更多詳情：

```shell
kubectl describe pod <pod-name>
```

<!--
For example, a Pod with two Init Containers might show the following:
-->
例如，對於包含兩個 Init 容器的 Pod 可能顯示如下信息：

```
Init Containers:
  <init-container-1>:
    Container ID:    ...
    ...
    State:           Terminated
      Reason:        Completed
      Exit Code:     0
      Started:       ...
      Finished:      ...
    Ready:           True
    Restart Count:   0
    ...
  <init-container-2>:
    Container ID:    ...
    ...
    State:           Waiting
      Reason:        CrashLoopBackOff
    Last State:      Terminated
      Reason:        Error
      Exit Code:     1
      Started:       ...
      Finished:      ...
    Ready:           False
    Restart Count:   3
    ...
```

<!--
You can also access the Init Container statuses programmatically by reading the
`status.initContainerStatuses` field on the Pod Spec:
-->
你還可以通過編程方式讀取 Pod Spec 上的 `status.initContainerStatuses` 字段，瞭解 Init 容器的狀態：

```shell
kubectl get pod <pod-name> --template '{{.status.initContainerStatuses}}'
```

<!--
This command will return the same information as above, formatted using a [Go template](https://pkg.go.dev/text/template).
-->
此命令將返回與上述相同的信息，並使用 [Go 模板](https://pkg.go.dev/text/template)對結果進行格式化。

<!--
## Accessing logs from Init Containers

Pass the Init Container name along with the Pod name
to access its logs.
-->
## 通過 Init 容器訪問日誌   {#accessing-logs-from-init-containers}

與 Pod 名稱一起傳遞 Init 容器名稱，以訪問容器的日誌。

```shell
kubectl logs <pod-name> -c <init-container-2>
```

<!--
Init Containers that run a shell script print
commands as they're executed. For example, you can do this in Bash by running
`set -x` at the beginning of the script.
-->
運行 Shell 腳本的 Init 容器在執行 Shell 腳本時輸出命令本身。
例如，你可以在 Bash 中通過在腳本的開頭運行 `set -x` 來實現。

<!-- discussion -->

<!--
## Understanding Pod status

A Pod status beginning with `Init:` summarizes the status of Init Container
execution. The table below describes some example status values that you might
see while debugging Init Containers.
-->
## 理解 Pod 的狀態   {#understanding-pod-status}

以 `Init:` 開頭的 Pod 狀態彙總了 Init 容器執行的狀態。
下表介紹調試 Init 容器時可能看到的一些狀態值示例。

<!--
Status | Meaning
------ | -------
`Init:N/M` | The Pod has `M` Init Containers, and `N` have completed so far.
`Init:Error` | An Init Container has failed to execute.
`Init:CrashLoopBackOff` | An Init Container has failed repeatedly.
`Pending` | The Pod has not yet begun executing Init Containers.
`PodInitializing` or `Running` | The Pod has already finished executing Init Containers.
-->

狀態   | 含義
------ | -------
`Init:N/M` | Pod 包含 `M` 個 Init 容器，其中 `N` 個已經運行完成。
`Init:Error` | Init 容器已執行失敗。
`Init:CrashLoopBackOff` | Init 容器執行總是失敗。
`Pending` | Pod 還沒有開始執行 Init 容器。
`PodInitializing` or `Running` | Pod 已經完成執行 Init 容器。

