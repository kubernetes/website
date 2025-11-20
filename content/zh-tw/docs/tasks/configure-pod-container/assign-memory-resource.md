---
title: 爲容器和 Pod 分配內存資源
content_type: task
weight: 10
---

<!--
title: Assign Memory Resources to Containers and Pods
content_type: task
weight: 10
-->

<!-- overview -->

<!--
This page shows how to assign a memory *request* and a memory *limit* to a
Container. A Container is guaranteed to have as much memory as it requests,
but is not allowed to use more memory than its limit.
-->
此頁面展示如何將內存**請求**（request）和內存**限制**（limit）分配給一個容器。
我們保障容器擁有它請求數量的內存，但不允許使用超過限制數量的內存。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Each node in your cluster must have at least 300 MiB of memory.
-->
你叢集中的每個節點必須擁有至少 300 MiB 的內存。

<!--
A few of the steps on this page require you to run the
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)
service in your cluster. If you have the metrics-server
running, you can skip those steps.
-->
該頁面上的一些步驟要求你在叢集中運行
[metrics-server](https://github.com/kubernetes-sigs/metrics-server) 服務。
如果你已經有在運行中的 metrics-server，則可以跳過這些步驟。

<!--
If you are running Minikube, run the following command to enable the
metrics-server:
-->
如果你運行的是 Minikube，可以運行下面的命令啓用 metrics-server：

```shell
minikube addons enable metrics-server
```

<!--
To see whether the metrics-server is running, or another provider of the resource metrics
API (`metrics.k8s.io`), run the following command:
-->
要查看 metrics-server 或資源指標 API (`metrics.k8s.io`) 是否已經運行，請運行以下命令：

```shell
kubectl get apiservices
```

<!--
If the resource metrics API is available, the output includes a
reference to `metrics.k8s.io`.
-->
如果資源指標 API 可用，則輸出結果將包含對 `metrics.k8s.io` 的引用資訊。

```
NAME
v1beta1.metrics.k8s.io
```

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 創建命名空間    {#create-a-namespace}

創建一個命名空間，以便將本練習中創建的資源與叢集的其餘部分隔離。

```shell
kubectl create namespace mem-example
```

<!--
## Specify a memory request and a memory limit

To specify a memory request for a Container, include the `resources:requests` field
in the Container's resource manifest. To specify a memory limit, include `resources:limits`.

In this exercise, you create a Pod that has one Container. The Container has a memory
request of 100 MiB and a memory limit of 200 MiB. Here's the configuration file
for the Pod:
-->
## 指定內存請求和限制    {#specify-a-memory-request-and-a-memory-limit}

要爲容器指定內存請求，請在容器資源清單中包含 `resources: requests` 字段。
同理，要指定內存限制，請包含 `resources: limits`。

在本練習中，你將創建一個擁有一個容器的 Pod。
容器將會請求 100 MiB 內存，並且內存會被限制在 200 MiB 以內。
這是 Pod 的設定檔案：

{{% code_sample file="pods/resource/memory-request-limit.yaml" %}}

<!--
The `args` section in the configuration file provides arguments for the Container when it starts.
The `"--vm-bytes", "150M"` arguments tell the Container to attempt to allocate 150 MiB of memory.

Create the Pod:
-->
設定檔案的 `args` 部分提供了容器啓動時的參數。
`"--vm-bytes", "150M"` 參數告知容器嘗試分配 150 MiB 內存。

開始創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

<!--
Verify that the Pod Container is running:
-->
驗證 Pod 中的容器是否已運行：

```shell
kubectl get pod memory-demo --namespace=mem-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 相關的詳細資訊：

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

<!--
The output shows that the one Container in the Pod has a memory request of 100 MiB
and a memory limit of 200 MiB.
-->
輸出結果顯示：該 Pod 中容器的內存請求爲 100 MiB，內存限制爲 200 MiB。

```yaml
...
resources:
  requests:
    memory: 100Mi
  limits:
    memory: 200Mi
...
```

<!--
Run `kubectl top` to fetch the metrics for the pod:
-->
運行 `kubectl top` 命令，獲取該 Pod 的指標資料：

```shell
kubectl top pod memory-demo --namespace=mem-example
```

<!--
The output shows that the Pod is using about 162,900,000 bytes of memory, which
is about 150 MiB. This is greater than the Pod's 100 MiB request, but within the
Pod's 200 MiB limit.
-->
輸出結果顯示：Pod 正在使用的內存大約爲 162,900,000 字節，約爲 150 MiB。
這大於 Pod 請求的 100 MiB，但在 Pod 限制的 200 MiB之內。

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

<!--
Delete your Pod:
-->
刪除 Pod：

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

<!--
## Exceed a Container's memory limit

A Container can exceed its memory request if the Node has memory available. But a Container
is not allowed to use more than its memory limit. If a Container allocates more memory than
its limit, the Container becomes a candidate for termination. If the Container continues to
consume memory beyond its limit, the Container is terminated. If a terminated Container can be
restarted, the kubelet restarts it, as with any other type of runtime failure.
-->
## 超過容器限制的內存    {#exceed-a-container-s-memory-limit}

當節點擁有足夠的可用內存時，容器可以使用其請求的內存。
但是，容器不允許使用超過其限制的內存。
如果容器分配的內存超過其限制，該容器會成爲被終止的候選容器。
如果容器繼續消耗超出其限制的內存，則終止容器。
如果終止的容器可以被重啓，則 kubelet 會重新啓動它，就像其他任何類型的運行時失敗一樣。

<!--
In this exercise, you create a Pod that attempts to allocate more memory than its limit.
Here is the configuration file for a Pod that has one Container with a
memory request of 50 MiB and a memory limit of 100 MiB:
-->
在本練習中，你將創建一個 Pod，嘗試分配超出其限制的內存。
這是一個 Pod 的設定檔案，其擁有一個容器，該容器的內存請求爲 50 MiB，內存限制爲 100 MiB：

{{% code_sample file="pods/resource/memory-request-limit-2.yaml" %}}

<!--
In the `args` section of the configuration file, you can see that the Container
will attempt to allocate 250 MiB of memory, which is well above the 100 MiB limit.

Create the Pod:
-->
在設定檔案的 `args` 部分中，你可以看到容器會嘗試分配 250 MiB 內存，這遠高於 100 MiB 的限制。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 相關的詳細資訊：

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```
<!--
At this point, the Container might be running or killed. Repeat the preceding command until the Container is killed:
-->
此時，容器可能正在運行或被殺死。重複前面的命令，直到容器被殺掉：

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

<!--
Get a more detailed view of the Container status:
-->
獲取容器更詳細的狀態資訊：

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

<!--
The output shows that the Container was killed because it is out of memory (OOM):
-->
輸出結果顯示：由於內存溢出（OOM），容器已被殺掉：

```yaml
lastState:
   terminated:
     containerID: 65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

<!--
The Container in this exercise can be restarted, so the kubelet restarts it. Repeat
this command several times to see that the Container is repeatedly killed and restarted:
-->
本練習中的容器可以被重啓，所以 kubelet 會重啓它。
多次運行下面的命令，可以看到容器在反覆的被殺死和重啓：

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

<!--
The output shows that the Container is killed, restarted, killed again, restarted again, and so on:
-->
輸出結果顯示：容器被殺掉、重啓、再殺掉、再重啓……：

```
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
```
```

kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

<!--
View detailed information about the Pod history:
-->
查看關於該 Pod 歷史的詳細資訊：

```
kubectl describe pod memory-demo-2 --namespace=mem-example
```

<!--
The output shows that the Container starts and fails repeatedly:
-->
輸出結果顯示：該容器反覆的在啓動和失敗：

```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

<!--
View detailed information about your cluster's Nodes:
-->
查看關於叢集節點的詳細資訊：

```
kubectl describe nodes
```

<!--
The output includes a record of the Container being killed because of an out-of-memory condition:
-->
輸出結果包含了一條練習中的容器由於內存溢出而被殺掉的記錄：

```
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

<!--
Delete your Pod:
-->
刪除 Pod：

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

<!--
## Specify a memory request that is too big for your Nodes

Memory requests and limits are associated with Containers, but it is useful to think
of a Pod as having a memory request and limit. The memory request for the Pod is the
sum of the memory requests for all the Containers in the Pod. Likewise, the memory
limit for the Pod is the sum of the limits of all the Containers in the Pod.
-->
## 超過整個節點容量的內存    {#specify-a-memory-request-that-is-too-big-for-your-nodes}

內存請求和限制是與容器關聯的，但將 Pod 視爲具有內存請求和限制，也是很有用的。
Pod 的內存請求是 Pod 中所有容器的內存請求之和。
同理，Pod 的內存限制是 Pod 中所有容器的內存限制之和。

<!--
Pod scheduling is based on requests. A Pod is scheduled to run on a Node only if the Node
has enough available memory to satisfy the Pod's memory request.

In this exercise, you create a Pod that has a memory request so big that it exceeds the
capacity of any Node in your cluster. Here is the configuration file for a Pod that has one
Container with a request for 1000 GiB of memory, which likely exceeds the capacity
of any Node in your cluster.
-->
Pod 的調度基於請求。只有當節點擁有足夠滿足 Pod 內存請求的內存時，纔會將 Pod 調度至節點上運行。

在本練習中，你將創建一個 Pod，其內存請求超過了你叢集中的任意一個節點所擁有的內存。
這是該 Pod 的設定檔案，其擁有一個請求 1000 GiB 內存的容器，這應該超過了你叢集中任何節點的容量。

{{% code_sample file="pods/resource/memory-request-limit-3.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-3.yaml --namespace=mem-example
```

<!--
View the Pod status:
-->
查看 Pod 狀態：

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

<!--
The output shows that the Pod status is PENDING. That is, the Pod is not scheduled to run on any Node, and it will remain in the PENDING state indefinitely:
-->
輸出結果顯示：Pod 處於 PENDING 狀態。
這意味着，該 Pod 沒有被調度至任何節點上運行，並且它會無限期的保持該狀態：

```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

<!--
View detailed information about the Pod, including events:
-->
查看關於 Pod 的詳細資訊，包括事件：


```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

<!--
The output shows that the Container cannot be scheduled because of insufficient memory on the Nodes:
-->
輸出結果顯示：由於節點內存不足，該容器無法被調度：

```
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```

<!--
## Memory units

The memory resource is measured in bytes. You can express memory as a plain integer or a
fixed-point integer with one of these suffixes: E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki.
For example, the following represent approximately the same value:
-->
## 內存單位    {#memory-units}

內存資源的基本單位是字節（byte）。你可以使用這些後綴之一，將內存表示爲
純整數或定點整數：E、P、T、G、M、K、Ei、Pi、Ti、Gi、Mi、Ki。
例如，下面是一些近似相同的值：

```
128974848, 129e6, 129M, 123Mi
```

<!--
Delete your Pod:
-->
刪除 Pod：

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

<!--
## If you do not specify a memory limit

If you do not specify a memory limit for a Container, one of the following situations applies:
-->
## 如果你沒有指定內存限制    {#if-you-do-not-specify-a-memory-limit}

如果你沒有爲一個容器指定內存限制，則自動遵循以下情況之一：

<!--
* The Container has no upper bound on the amount of memory it uses. The Container
could use all of the memory available on the Node where it is running which in turn could invoke the OOM Killer. Further, in case of an OOM Kill, a container with no resource limits will have a greater chance of being killed.

* The Container is running in a namespace that has a default memory limit, and the
Container is automatically assigned the default limit. Cluster administrators can use a
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)
to specify a default value for the memory limit.
-->
* 容器可無限制地使用內存。容器可以使用其所在節點所有的可用內存，
  進而可能導致該節點調用 OOM Killer。
  此外，如果發生 OOM Kill，沒有資源限制的容器將被殺掉的可行性更大。

* 運行的容器所在命名空間有預設的內存限制，那麼該容器會被自動分配預設限制。
  叢集管理員可用使用 [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)
  來指定預設的內存限制。

<!--
## Motivation for memory requests and limits

By configuring memory requests and limits for the Containers that run in your
cluster, you can make efficient use of the memory resources available on your cluster's
Nodes. By keeping a Pod's memory request low, you give the Pod a good chance of being
scheduled. By having a memory limit that is greater than the memory request, you accomplish two things:
-->
## 內存請求和限制的目的    {#motivation-for-memory-requests-and-limits}

通過爲叢集中運行的容器設定內存請求和限制，你可以有效利用叢集節點上可用的內存資源。
通過將 Pod 的內存請求保持在較低水平，你可以更好地安排 Pod 調度。
通過讓內存限制大於內存請求，你可以完成兩件事：

<!--
* The Pod can have bursts of activity where it makes use of memory that happens to be available.
* The amount of memory a Pod can use during a burst is limited to some reasonable amount.
-->
* Pod 可以進行一些突發活動，從而更好的利用可用內存。
* Pod 在突發活動期間，可使用的內存被限制爲合理的數量。

<!--
## Clean up

Delete your namespace. This deletes all the Pods that you created for this task:
-->
## 清理    {#clean-up}

刪除命名空間。下面的命令會刪除你根據這個任務創建的所有 Pod：

```shell
kubectl delete namespace mem-example
```

## {{% heading "whatsnext" %}}

<!--
### For app developers

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

* [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)
-->
### 應用開發者擴展閱讀    {#for-app-developers}

* [爲容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [分配 Pod 級別的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [設定 Pod 的服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)

* [調整分配給容器的 CPU 和內存資源大小](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configure a Pod Quota for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configure Quotas for API Objects](/docs/tasks/administer-cluster/quota-api-object/)

* [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)
-->
### 叢集管理員擴展閱讀    {#for-cluster-administrators}

* [爲命名空間設定預設的內存請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [爲命名空間設定預設的 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [設定命名空間的最小和最大內存約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [設定命名空間的最小和最大 CPU 約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [爲命名空間設定內存和 CPU 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [設定命名空間下 Pod 總數](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [設定 API 對象配額](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)
* [調整分配給容器的 CPU 和內存資源的大小](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)
