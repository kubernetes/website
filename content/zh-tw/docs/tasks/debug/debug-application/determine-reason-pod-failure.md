---
title: 確定 Pod 失敗的原因
content_type: task
weight: 30
---
<!--
title: Determine the Reason for Pod Failure
content_type: task
weight: 30
-->

<!-- overview -->

<!--
This page shows how to write and read a Container termination message.
-->
本文介紹如何編寫和讀取容器的終止消息。

<!--
Termination messages provide a way for containers to write
information about fatal events to a location where it can
be easily retrieved and surfaced by tools like dashboards
and monitoring software. In most cases, information that you
put in a termination message should also be written to
the general
[Kubernetes logs](/docs/concepts/cluster-administration/logging/).
-->
終止消息爲容器提供了一種方法，可以將有關致命事件的信息寫入某個位置，
在該位置可以通過儀表板和監控軟件等工具輕鬆檢索和顯示致命事件。
在大多數情況下，你放入終止消息中的信息也應該寫入
[常規 Kubernetes 日誌](/zh-cn/docs/concepts/cluster-administration/logging/)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Writing and reading a termination message

In this exercise, you create a Pod that runs one container.
The manifest for that Pod specifies a command that runs when the container starts:
-->
## 讀寫終止消息   {#writing-and-reading-a-termination-message}

在本練習中，你將創建運行一個容器的 Pod。
設定文件指定在容器啓動時要運行的命令。

{{% code_sample file="debug/termination.yaml" %}}

<!--
1. Create a Pod based on the YAML configuration file:
-->
1. 基於 YAML 設定文件創建 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/debug/termination.yaml   
   ```

   <!--
   In the YAML file, in the `command` and `args` fields, you can see that the
   container sleeps for 10 seconds and then writes "Sleep expired" to
   the `/dev/termination-log` file. After the container writes
   the "Sleep expired" message, it terminates.
   -->
   YAML 文件中，在 `command` 和 `args` 字段，你可以看到容器休眠 10 秒然後將 "Sleep expired"
   寫入 `/dev/termination-log` 文件。
   容器寫完 "Sleep expired" 消息後就終止了。

<!--
1. Display information about the Pod:
-->
2. 顯示 Pod 的信息：

   ```shell
   kubectl get pod termination-demo
   ```

   <!--
   Repeat the preceding command until the Pod is no longer running.
   -->
   重複前面的命令直到 Pod 不再運行。

<!--
1. Display detailed information about the Pod:
-->
3. 顯示 Pod 的詳細信息：

   ```shell
   kubectl get pod termination-demo --output=yaml
   ```

   <!--
   The output includes the "Sleep expired" message:
   -->
   輸出結果包含 "Sleep expired" 消息：

   ```yaml
   apiVersion: v1
   kind: Pod
   ...
       lastState:
         terminated:
           containerID: ...
           exitCode: 0
           finishedAt: ...
           message: |
             Sleep expired
           ...
   ```

<!-- 
1. Use a Go template to filter the output so that it includes only the termination message:
-->
4. 使用 Go 模板過濾輸出結果，使其只含有終止消息：

   ```shell
   kubectl get pod termination-demo -o go-template="{{range .status.containerStatuses}}{{.lastState.terminated.message}}{{end}}"
   ```

   <!--
   If you are running a multi-container Pod, you can use a Go template to include the container's name.
   By doing so, you can discover which of the containers is failing:
   -->
   如果你正在運行多容器 Pod，則可以使用 Go 模板來包含容器的名稱。這樣，你可以發現哪些容器出現故障：

   ```shell
   kubectl get pod multi-container-pod -o go-template='{{range .status.containerStatuses}}{{printf "%s:\n%s\n\n" .name .lastState.terminated.message}}{{end}}'
   ```

<!--
## Customizing the termination message

Kubernetes retrieves termination messages from the termination message file
specified in the `terminationMessagePath` field of a Container, which has a default
value of `/dev/termination-log`. By customizing this field, you can tell Kubernetes
to use a different file. Kubernetes use the contents from the specified file to
populate the Container's status message on both success and failure.
-->
## 定製終止消息   {#customizing-the-termination-message}

Kubernetes 從容器的 `terminationMessagePath` 字段中指定的終止消息文件中檢索終止消息，
默認值爲 `/dev/termination-log`。
通過定製這個字段，你可以告訴 Kubernetes 使用不同的文件。
Kubernetes 使用指定文件中的內容在成功和失敗時填充容器的狀態消息。

<!--
The termination message is intended to be brief final status, such as an assertion failure message.
The kubelet truncates messages that are longer than 4096 bytes.

The total message length across all containers is limited to 12KiB, divided equally among each container.
For example, if there are 12 containers (`initContainers` or `containers`), each has 1024 bytes of available termination message space.

The default termination message path is `/dev/termination-log`.
You cannot set the termination message path after a Pod is launched.
-->
終止消息旨在簡要說明最終狀態，例如斷言失敗消息。
kubelet 會截斷長度超過 4096 字節的消息。

所有容器的總消息長度限制爲 12KiB，將會在每個容器之間平均分配。
例如，如果有 12 個容器（`initContainers` 或 `containers`），
每個容器都有 1024 字節的可用終止消息空間。

默認的終止消息路徑是 `/dev/termination-log`。
Pod 啓動後不能設置終止消息路徑。

<!--
In the following example, the container writes termination messages to
`/tmp/my-log` for Kubernetes to retrieve:
-->
在下例中，容器將終止消息寫入 `/tmp/my-log` 給 Kubernetes 來檢索：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: msg-path-demo
spec:
  containers:
  - name: msg-path-demo-container
    image: debian
    terminationMessagePath: "/tmp/my-log"
```

<!--
Moreover, users can set the `terminationMessagePolicy` field of a Container for
further customization. This field defaults to "`File`" which means the termination
messages are retrieved only from the termination message file. By setting the
`terminationMessagePolicy` to "`FallbackToLogsOnError`", you can tell Kubernetes
to use the last chunk of container log output if the termination message file
is empty and the container exited with an error. The log output is limited to
2048 bytes or 80 lines, whichever is smaller.
-->
此外，使用者可以設置容器的 `terminationMessagePolicy` 字段，以便進一步自定義。
此字段默認爲 "`File`"，這意味着僅從終止消息文件中檢索終止消息。
通過將 `terminationMessagePolicy` 設置爲 "`FallbackToLogsOnError`"，你就可以告訴 Kubernetes，在容器因錯誤退出時，如果終止消息文件爲空，則使用容器日誌輸出的最後一塊作爲終止消息。
日誌輸出限制爲 2048 字節或 80 行，以較小者爲準。

## {{% heading "whatsnext" %}}

<!--
* See the `terminationMessagePath` field in
  [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core).
* See [ImagePullBackOff](/docs/concepts/containers/images/#imagepullbackoff) in [Images](/docs/concepts/containers/images/).
* Learn about [retrieving logs](/docs/concepts/cluster-administration/logging/).
* Learn about [Go templates](https://pkg.go.dev/text/template).
* Learn about [Pod status](/docs/tasks/debug/debug-application/debug-init-containers/#understanding-pod-status) and [Pod phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase).
* Learn about [container states](/docs/concepts/workloads/pods/pod-lifecycle/#container-states).
-->

* 參考 [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
  資源的 `terminationMessagePath` 字段。
* 參考[映像檔](/zh-cn/docs/concepts/containers/images/)中的 [ImagePullBackOff](/zh-cn/docs/concepts/containers/images/#imagepullbackoff)。
* 瞭解[檢索日誌](/zh-cn/docs/concepts/cluster-administration/logging/)。
* 瞭解 [Go 模板](https://pkg.go.dev/text/template)。
* 瞭解 [Pod 狀態](/zh-cn/docs/tasks/debug/debug-application/debug-init-containers/#understanding-pod-status)和
  [Pod 階段](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)。
* 瞭解[容器狀態](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-states)。