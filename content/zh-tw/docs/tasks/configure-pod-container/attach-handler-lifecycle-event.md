---
title: 爲容器的生命週期事件設置處理函數
content_type: task
weight: 180
---
<!--
title: Attach Handlers to Container Lifecycle Events
content_type: task
weight: 180
-->

<!-- overview -->

<!--
This page shows how to attach handlers to Container lifecycle events. Kubernetes supports
the postStart and preStop events. Kubernetes sends the postStart event immediately
after a Container is started, and it sends the preStop event immediately before the
Container is terminated. A Container may specify one handler per event.
-->
這個頁面將演示如何爲容器的生命週期事件掛接處理函數。Kubernetes 支持 postStart 和 preStop 事件。
當一個容器啓動後，Kubernetes 將立即發送 postStart 事件；在容器被終結之前，
Kubernetes 將發送一個 preStop 事件。容器可以爲每個事件指定一個處理程序。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Define postStart and preStop handlers

In this exercise, you create a Pod that has one Container. The Container has handlers
for the postStart and preStop events.
-->
## 定義 postStart 和 preStop 處理函數  {#define-poststart-and-prestop-handlers}

在本練習中，你將創建一個包含一個容器的 Pod，該容器爲 postStart 和 preStop 事件提供對應的處理函數。

<!--
Here is the configuration file for the Pod:
-->
下面是對應 Pod 的設定文件：

{{% code_sample file="pods/lifecycle-events.yaml" %}}

<!--
In the configuration file, you can see that the postStart command writes a `message`
file to the Container's `/usr/share` directory. The preStop command shuts down
nginx gracefully. This is helpful if the Container is being terminated because of a failure.
-->
在上述設定文件中，你可以看到 postStart 命令在容器的 `/usr/share` 目錄下寫入文件 `message`。
命令 preStop 負責優雅地終止 nginx 服務。當因爲失效而導致容器終止時，這一處理方式很有用。

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/lifecycle-events.yaml
```

<!--
Verify that the Container in the Pod is running:
-->
驗證 Pod 中的容器已經運行：

```shell
kubectl get pod lifecycle-demo
```

<!--
Get a shell into the Container running in your Pod:
-->
使用 shell 連接到你的 Pod 裏的容器：

```shell
kubectl exec -it lifecycle-demo -- /bin/bash
```

<!--
In your shell, verify that the `postStart` handler created the `message` file:
-->
在 shell 中，驗證 `postStart` 處理函數創建了 `message` 文件：

```
root@lifecycle-demo:/# cat /usr/share/message
```

<!--
The output shows the text written by the postStart handler:
-->
命令列輸出的是 `postStart` 處理函數所寫入的文本：

```
Hello from the postStart handler
```

<!-- discussion -->

<!--
## Discussion

Kubernetes sends the postStart event immediately after the Container is created.
There is no guarantee, however, that the postStart handler is called before
the Container's entrypoint is called. The postStart handler runs asynchronously
relative to the Container's code, but Kubernetes' management of the container
blocks until the postStart handler completes. The Container's status is not
set to RUNNING until the postStart handler completes.
-->
## 討論  {#discussion}

Kubernetes 在容器創建後立即發送 postStart 事件。
然而，postStart 處理函數的調用不保證早於容器的入口點（entrypoint）
的執行。postStart 處理函數與容器的代碼是異步執行的，但 Kubernetes
的容器管理邏輯會一直阻塞等待 postStart 處理函數執行完畢。
只有 postStart 處理函數執行完畢，容器的狀態纔會變成
RUNNING。

<!--
Kubernetes sends the preStop event immediately before the Container is terminated.
Kubernetes' management of the Container blocks until the preStop handler completes,
unless the Pod's grace period expires. For more details, see
[Pod Lifecycle](/docs/concepts/workloads/pods/pod-lifecycle/).
-->
Kubernetes 在容器結束前立即發送 preStop 事件。除非 Pod 寬限期限超時，
Kubernetes 的容器管理邏輯會一直阻塞等待 preStop 處理函數執行完畢。
更多細節請參閱 [Pod 的生命週期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)。

{{< note >}}
<!--
Kubernetes only sends the preStop event when a Pod or a container in the Pod is *terminated*.
This means that the preStop hook is not invoked when the Pod is *completed*.
About this limitation, please see [Container hooks](/docs/concepts/containers/container-lifecycle-hooks/#container-hooks) for the detail.
-->
Kubernetes 只有在一個 Pod 或該 Pod 中的容器**結束（Terminated）** 的時候纔會發送 preStop 事件，
這意味着在 Pod **完成（Completed）** 時
preStop 的事件處理邏輯不會被觸發。有關這個限制，
請參閱[容器回調](/zh-cn/docs/concepts/containers/container-lifecycle-hooks/#container-hooks)瞭解詳情。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).
* Learn more about the [lifecycle of a Pod](/docs/concepts/workloads/pods/pod-lifecycle/).
-->
* 進一步瞭解[容器生命週期回調](/zh-cn/docs/concepts/containers/container-lifecycle-hooks/)。
* 進一步瞭解 [Pod 的生命週期](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)。

<!--
### Reference

* [Lifecycle](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* See `terminationGracePeriodSeconds` in [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
-->
### 參考

* [Lifecycle](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#lifecycle-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* 參閱 [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) 中關於 `terminationGracePeriodSeconds` 的部分
