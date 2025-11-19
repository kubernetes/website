---
title: 構建一個基本的 DaemonSet  
content_type: task  
weight: 5  
---
<!--
title: Building a Basic DaemonSet  
content_type: task  
weight: 5
-->

<!-- overview -->

<!--
This page demonstrates how to build a basic {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}
that runs a Pod on every node in a Kubernetes cluster.
It covers a simple use case of mounting a file from the host, logging its contents using
an [init container](/docs/concepts/workloads/pods/init-containers/), and utilizing a pause container.
-->
本頁演示如何構建一個基本的 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}，
用其在 Kubernetes 集羣中的每個節點上運行 Pod。
這個簡單的使用場景包含了從主機掛載一個文件，使用
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)記錄文件的內容，
以及使用 `pause` 容器。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
A Kubernetes cluster with at least two nodes (one control plane node and one worker node)
to demonstrate the behavior of DaemonSets.
-->
爲了演示 DaemonSet 的行爲，Kubernetes 集羣至少需包含兩個節點（一個控制平面節點和一個工作節點）。

<!--
## Define the DaemonSet

In this task, a basic DaemonSet is created which ensures that the copy of a Pod is scheduled on every node.
The Pod will use an init container to read and log the contents of `/etc/machine-id` from the host,
while the main container will be a `pause` container, which keeps the Pod running.
-->
## 定義 DaemonSet   {#define-the-daemonset}

在此任務中，將創建一個基本的 DaemonSet，確保 Pod 的副本被調度到每個節點上。
此 Pod 將使用 Init 容器從主機讀取並記錄 `/etc/machine-id` 的內容，
而主容器將是一個 `pause` 容器，用於保持 Pod 運行。

{{% code_sample file="application/basic-daemonset.yaml" %}}

<!--
1. Create a DaemonSet based on the (YAML) manifest:
-->
1. 基於（YAML）清單創建 DaemonSet：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/basic-daemonset.yaml
   ```

<!--
1. Once applied, you can verify that the DaemonSet is running a Pod on every node in the cluster:
-->
2. 完成創建操作後，你可以驗證 DaemonSet 是否在集羣中的每個節點上運行 Pod：

   ```shell
   kubectl get pods -o wide
   ```

   <!--
   The output will list one Pod per node, similar to:
   -->

   輸出將列出每個節點上有一個 Pod，類似於：

   ```
   NAME                                READY   STATUS    RESTARTS   AGE    IP       NODE
   example-daemonset-xxxxx             1/1     Running   0          5m     x.x.x.x  node-1
   example-daemonset-yyyyy             1/1     Running   0          5m     x.x.x.x  node-2
   ```

<!--
1. You can inspect the contents of the logged `/etc/machine-id` file by checking
   the log directory mounted from the host:
-->
3. 你可以通過檢查從主機掛載的日誌目錄來查看 `/etc/machine-id` 文件的日誌內容：

   ```shell
   kubectl exec <pod-name> -- cat /var/log/machine-id.log
   ```
  
   <!--
   Where `<pod-name>` is the name of one of your Pods.
   -->

   其中 `<pod-name>` 是某一個 Pod 的名稱。

## {{% heading "cleanup" %}}

<!--
To delete the DaemonSet, run this command:
-->
要刪除 DaemonSet，請運行以下命令：

```shell
kubectl delete --cascade=foreground --ignore-not-found --now daemonsets/example-daemonset
```

<!--
This simple DaemonSet example introduces key components like init containers and host path volumes,
which can be expanded upon for more advanced use cases. For more details refer to
[DaemonSet](/docs/concepts/workloads/controllers/daemonset/).
-->
這個簡單的 DaemonSet 例子介紹了 Init 容器和主機路徑卷這類關鍵組件，
你可以在此基礎上擴展以應對更高級的使用場景。有關細節參閱
[DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/)。

## {{% heading "whatsnext" %}}

<!--
* See [Performing a rolling update on a DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/)
* See [Creating a DaemonSet to adopt existing DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)
-->
* 參閱[在 DaemonSet 上執行滾動更新](/zh-cn/docs/tasks/manage-daemon/update-daemon-set/)
* 參見[創建 DaemonSet 以收養現有 DaemonSet Pod](/zh-cn/docs/concepts/workloads/controllers/daemonset/)
