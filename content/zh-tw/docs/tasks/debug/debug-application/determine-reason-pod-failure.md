---
title: 確定 Pod 失敗的原因
content_type: task
---

<!--
title: Determine the Reason for Pod Failure
content_type: task
-->

<!-- overview -->

<!--
This page shows how to write and read a Container
termination message.
-->
本文介紹如何編寫和讀取容器的終止訊息。

<!--
Termination messages provide a way for containers to write
information about fatal events to a location where it can
be easily retrieved and surfaced by tools like dashboards
and monitoring software. In most cases, information that you
put in a termination message should also be written to
the general
[Kubernetes logs](/docs/concepts/cluster-administration/logging/).
-->
終止訊息為容器提供了一種方法，可以將有關致命事件的資訊寫入某個位置，
在該位置可以透過儀表板和監控軟體等工具輕鬆檢索和顯示致命事件。
在大多數情況下，你放入終止訊息中的資訊也應該寫入
[常規 Kubernetes 日誌](/zh-cn/docs/concepts/cluster-administration/logging/)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Writing and reading a termination message

In this exercise, you create a Pod that runs one container.
The configuration file specifies a command that runs when
the container starts.
-->
## 讀寫終止訊息

在本練習中，你將建立執行一個容器的 Pod。
配置檔案指定在容器啟動時要執行的命令。

{{< codenew file="debug/termination.yaml" >}}

<!-- 1. Create a Pod based on the YAML configuration file: -->
1. 基於 YAML 配置檔案建立 Pod：

        kubectl apply -f https://k8s.io/examples/debug/termination.yaml   

   <!--
   In the YAML file, in the `command` and `args` fields, you can see that the
   container sleeps for 10 seconds and then writes "Sleep expired" to
   the `/dev/termination-log` file. After the container writes
   the "Sleep expired" message, it terminates.
   -->
   YAML 檔案中，在 `command` 和 `args` 欄位，你可以看到容器休眠 10 秒然後將 "Sleep expired"
   寫入 `/dev/termination-log` 檔案。
   容器寫完 "Sleep expired" 訊息後就終止了。

<!-- 1. Display information about the Pod: -->
1. 顯示 Pod 的資訊：

        kubectl get pod termination-demo

   <!--Repeat the preceding command until the Pod is no longer running.-->
   重複前面的命令直到 Pod 不再執行。

<!-- 1. Display detailed information about the Pod: -->
1. 顯示 Pod 的詳細資訊：

        kubectl get pod termination-demo --output=yaml

   <!--The output includes the "Sleep expired" message:-->
   輸出結果包含 "Sleep expired" 訊息：

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

<!-- 
1. Use a Go template to filter the output so that it includes
only the termination message:
-->
1. 使用 Go 模板過濾輸出結果，使其只含有終止訊息：

        kubectl get pod termination-demo -o go-template="{{range .status.containerStatuses}}{{.lastState.terminated.message}}{{end}}"
   
<!--
If you are running a multi-container pod, you can use a Go template to include the container's name. By doing so, you can discover which of the containers is failing:
-->
如果你正在執行多容器 Pod，則可以使用 Go 模板來包含容器的名稱。這樣，你可以發現哪些容器出現故障:

```shell
kubectl get pod multi-container-pod -o go-template='{{range .status.containerStatuses}}{{printf "%s:\n%s\n\n" .name .lastState.terminated.message}}{{end}}'
```

<!--
## Customizing the termination message

Kubernetes retrieves termination messages from the termination message file
specified in the `terminationMessagePath` field of a Container, which as a default
value of `/dev/termination-log`. By customizing this field, you can tell Kubernetes
to use a different file. Kubernetes use the contents from the specified file to
populate the Container's status message on both success and failure.
-->
## 定製終止訊息

Kubernetes 從容器的 `terminationMessagePath` 欄位中指定的終止訊息檔案中檢索終止訊息，
預設值為 `/dev/termination-log`。
透過定製這個欄位，你可以告訴 Kubernetes 使用不同的檔案。
Kubernetes 使用指定檔案中的內容在成功和失敗時填充容器的狀態訊息。

<!--
In the following example, the container writes termination messages to
`/tmp/my-log` for Kubernetes to retrieve:
-->
在下例中，容器將終止訊息寫入 `/tmp/my-log` 給 Kubernetes 來接收：

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
此外，使用者可以設定容器的 `terminationMessagePolicy` 欄位，以便進一步自定義。
此欄位預設為 "`File`"，這意味著僅從終止訊息檔案中檢索終止訊息。
透過將 `terminationMessagePolicy` 設定為 "`FallbackToLogsOnError`"，你就可以告訴 Kubernetes，在容器因錯誤退出時，如果終止訊息檔案為空，則使用容器日誌輸出的最後一塊作為終止訊息。
日誌輸出限制為 2048 位元組或 80 行，以較小者為準。

## {{% heading "whatsnext" %}}

<!--
* See the `terminationMessagePath` field in
  [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core).
* Learn about [retrieving logs](/docs/concepts/cluster-administration/logging/).
* Learn about [Go templates](https://golang.org/pkg/text/template/).
-->

* 參考 [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
  資源的 `terminationMessagePath` 欄位。
* 瞭解[接收日誌](/zh-cn/docs/concepts/cluster-administration/logging/)。
* 瞭解 [Go 模版](https://golang.org/pkg/text/template/)。

