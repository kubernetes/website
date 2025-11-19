---
title: 爲容器分派擴展資源 
content_type: task
weight: 70
---

<!--
title: Assign Extended Resources to a Container
content_type: task
weight: 70
-->

<!-- overview -->

{{< feature-state state="stable" >}}

<!--
This page shows how to assign extended resources to a Container.
-->
本文介紹如何爲容器指定擴展資源。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Before you do this exercise, do the exercise in
[Advertise Extended Resources for a Node](/docs/tasks/administer-cluster/extended-resource-node/).
That will configure one of your Nodes to advertise a dongle resource.
-->
在你開始此練習前，請先練習
[爲節點廣播擴展資源](/zh-cn/docs/tasks/administer-cluster/extended-resource-node/)。
在那個練習中將設定你的一個節點來廣播 dongle 資源。

<!-- steps -->

<!--
## Assign an extended resource to a Pod

To request an extended resource, include the `resources:requests` field in your
Container manifest. Extended resources are fully qualified with any domain outside of
`*.kubernetes.io/`. Valid extended resource names have the form `example.com/foo` where
`example.com` is replaced with your organization's domain and `foo` is a
descriptive resource name.

Here is the configuration file for a Pod that has one Container:
-->
## 給 Pod 分派擴展資源

要請求擴展資源，需要在你的容器清單中包括 `resources:requests` 字段。
擴展資源可以使用任何完全限定名稱，只是不能使用 `*.kubernetes.io/`。
有效的擴展資源名的格式爲 `example.com/foo`，其中 `example.com` 應被替換爲
你的組織的域名，而 `foo` 則是描述性的資源名稱。

下面是包含一個容器的 Pod 設定文件：

{{% code_sample file="pods/resource/extended-resource-pod.yaml" %}}

<!--
In the configuration file, you can see that the Container requests 3 dongles.

Create a Pod:
-->
在設定文件中，你可以看到容器請求了 3 個 dongles。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod.yaml
```

<!--
Verify that the Pod is running:
-->
檢查 Pod 是否運行正常：

```shell
kubectl get pod extended-resource-demo
```

<!--
Describe the Pod:
-->
描述 Pod:

```shell
kubectl describe pod extended-resource-demo
```

<!--
The output shows dongle requests:
-->
輸出結果顯示 dongle 請求如下：

```yaml
Limits:
  example.com/dongle: 3
Requests:
  example.com/dongle: 3
```

<!--
## Attempt to create a second Pod

Here is the configuration file for a Pod that has one Container. The Container requests
two dongles.
-->
## 嘗試創建第二個 Pod

下面是包含一個容器的 Pod 設定文件，容器請求了 2 個 dongles。

{{% code_sample file="pods/resource/extended-resource-pod-2.yaml" %}}

<!--
Kubernetes will not be able to satisfy the request for two dongles, because the first Pod
used three of the four available dongles.

Attempt to create a Pod:
-->
Kubernetes 將不能滿足 2 個 dongles 的請求，因爲第一個 Pod 已經使用了 4 個可用 dongles 中的 3 個。

嘗試創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod-2.yaml
```

<!--
Describe the Pod
-->
描述 Pod：

```shell
kubectl describe pod extended-resource-demo-2
```

<!--
The output shows that the Pod cannot be scheduled, because there is no Node that has
2 dongles available:
-->
輸出結果表明 Pod 不能被調度，因爲沒有一個節點上存在兩個可用的 dongles。

```
Conditions:
  Type    Status
  PodScheduled  False
...
Events:
  ...
  ... Warning   FailedScheduling  pod (extended-resource-demo-2) failed to fit in any node
fit failure summary on nodes : Insufficient example.com/dongle (1)
```

<!--
View the Pod status:
-->
查看 Pod 的狀態：

```shell
kubectl get pod extended-resource-demo-2
```

<!--
The output shows that the Pod was created, but not scheduled to run on a Node.
It has a status of Pending:
-->
輸出結果表明 Pod 雖然被創建了，但沒有被調度到節點上正常運行。Pod 的狀態爲 Pending：

```yaml
NAME                       READY     STATUS    RESTARTS   AGE
extended-resource-demo-2   0/1       Pending   0          6m
```

<!--
## Clean up

Delete the Pods that you created for this exercise:
-->
## 清理

刪除本練習中創建的 Pod：

```shell
kubectl delete pod extended-resource-demo
kubectl delete pod extended-resource-demo-2
```

## {{% heading "whatsnext" %}}

<!--
### For application developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
-->
## 應用開發者參考

* [爲容器和 Pod 分配內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [爲容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)

<!--
### For cluster administrators

* [Advertise Extended Resources for a Node](/docs/tasks/administer-cluster/extended-resource-node/)
-->
### 叢集管理員參考

* [爲節點廣播擴展資源](/zh-cn/docs/tasks/administer-cluster/extended-resource-node/)

