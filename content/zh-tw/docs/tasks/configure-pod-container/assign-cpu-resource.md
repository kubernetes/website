---
title: 爲容器和 Pods 分配 CPU 資源
content_type: task
weight: 20
---

<!--
title: Assign CPU Resources to Containers and Pods
content_type: task
weight: 20
-->

<!-- overview -->

<!--
This page shows how to assign a CPU *request* and a CPU *limit* to
a container. Containers cannot use more CPU than the configured limit.
Provided the system has CPU time free, a container is guaranteed to be
allocated as much CPU as it requests.
-->
本頁面展示如何爲容器設置 CPU **request（請求）** 和 CPU **limit（限制）**。
容器使用的 CPU 不能超過所設定的限制。
如果系統有空閒的 CPU 時間，則可以保證給容器分配其所請求數量的 CPU 資源。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
Your cluster must have at least 1 CPU available for use to run the task examples.

A few of the steps on this page require you to run the
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)
service in your cluster. If you have the metrics-server
running, you can skip those steps.

If you are running {{< glossary_tooltip term_id="minikube" >}}, run the
following command to enable metrics-server:
-->
你的叢集必須至少有 1 個 CPU 可用才能運行本任務中的示例。

本頁的一些步驟要求你在叢集中運行
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)
服務。如果你的叢集中已經有正在運行的 metrics-server 服務，可以跳過這些步驟。

如果你正在運行 {{< glossary_tooltip term_id="minikube" >}}，請運行以下命令啓用 metrics-server：

```shell
minikube addons enable metrics-server
```

<!-- 
To see whether metrics-server (or another provider of the resource metrics
API, `metrics.k8s.io`) is running, type the following command:
-->
查看 metrics-server（或者其他資源指標 API `metrics.k8s.io` 服務提供者）是否正在運行，
請鍵入以下命令：

```shell
kubectl get apiservices
```

<!-- 
If the resource metrics API is available, the output will include a
reference to `metrics.k8s.io`.
-->
如果資源指標 API 可用，則會輸出將包含一個對 `metrics.k8s.io` 的引用。

```
NAME
v1beta1.metrics.k8s.io
```

<!-- steps -->

<!-- 
## Create a namespace

Create a {{< glossary_tooltip term_id="namespace" >}} so that the resources you
create in this exercise are isolated from the rest of your cluster.
-->
## 創建一個名字空間 {#create-a-namespace}

創建一個{{< glossary_tooltip text="名字空間" term_id="namespace" >}}，以便將
本練習中創建的資源與叢集的其餘部分資源隔離。

```shell
kubectl create namespace cpu-example
```

<!-- 
## Specify a CPU request and a CPU limit

To specify a CPU request for a container, include the `resources:requests` field
in the Container resource manifest. To specify a CPU limit, include `resources:limits`.

In this exercise, you create a Pod that has one container. The container has a request
of 0.5 CPU and a limit of 1 CPU. Here is the configuration file for the Pod:

{{% code_sample file="pods/resource/cpu-request-limit.yaml" %}}

The `args` section of the configuration file provides arguments for the container when it starts.
The `-cpus "2"` argument tells the Container to attempt to use 2 CPUs.

Create the Pod:
-->
## 指定 CPU 請求和 CPU 限制 {#specify-a-CPU-request-and-a-CPU-limit}

要爲容器指定 CPU 請求，請在容器資源清單中包含 `resources: requests` 字段。
要指定 CPU 限制，請包含 `resources:limits`。

在本練習中，你將創建一個具有一個容器的 Pod。容器將會請求 0.5 個 CPU，而且最多限制使用 1 個 CPU。
這是 Pod 的設定檔案：

{{% code_sample file="pods/resource/cpu-request-limit.yaml" %}}

設定檔案的 `args` 部分提供了容器啓動時的參數。
`-cpus "2"` 參數告訴容器嘗試使用 2 個 CPU。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

<!-- 
Verify that the Pod is running:
-->
驗證所創建的 Pod 處於 Running 狀態

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

<!-- 
View detailed information about the Pod:
-->
查看顯示關於 Pod 的詳細資訊：

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

<!-- 
The output shows that the one container in the Pod has a CPU request of 500 milliCPU
and a CPU limit of 1 CPU.
-->
輸出顯示 Pod 中的一個容器的 CPU 請求爲 500 milliCPU，並且 CPU 限制爲 1 個 CPU。

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

<!-- 
Use `kubectl top` to fetch the metrics for the Pod:
-->
使用 `kubectl top` 命令來獲取該 Pod 的指標：

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

<!-- 
This example output shows that the Pod is using 974 milliCPU, which is
slightly less than the limit of 1 CPU specified in the Pod configuration.
-->
此示例輸出顯示 Pod 使用的是 974 milliCPU，即略低於 Pod 設定中指定的 1 個 CPU 的限制。

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

<!-- 
Recall that by setting `-cpu "2"`, you configured the Container to attempt to use 2 CPUs, but the Container is only being allowed to use about 1 CPU. The container's CPU use is being throttled, because the container is attempting to use more CPU resources than its limit.
-->
回想一下，通過設置 `-cpu "2"`，你將容器設定爲嘗試使用 2 個 CPU，
但是容器只被允許使用大約 1 個 CPU。
容器的 CPU 用量受到限制，因爲該容器正嘗試使用超出其限制的 CPU 資源。

{{< note >}}
<!-- 
Another possible explanation for the CPU use being below 1.0 is that the Node might not have
enough CPU resources available. Recall that the prerequisites for this exercise require your cluster to have at least 1 CPU available for use. If your Container runs on a Node that has only 1 CPU, the Container cannot use more than 1 CPU regardless of the CPU limit specified for the Container.
-->
CPU 使用率低於 1.0 的另一種可能的解釋是，節點可能沒有足夠的 CPU 資源可用。
回想一下，此練習的先決條件需要你的叢集至少具有 1 個 CPU 可用。
如果你的容器在只有 1 個 CPU 的節點上運行，則容器無論爲容器指定的 CPU 限制如何，
都不能使用超過 1 個 CPU。
{{< /note >}}

<!-- 
## CPU units

The CPU resource is measured in *CPU* units. One CPU, in Kubernetes, is equivalent to:

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* 1 Hyperthread on a bare-metal Intel processor with Hyperthreading
-->
## CPU 單位  {#cpu-units}

CPU 資源以 **CPU** 單位度量。Kubernetes 中的一個 CPU 等同於：

* 1 個 AWS vCPU 
* 1 個 GCP核心
* 1 個 Azure vCore
* 裸機上具有超執行緒能力的英特爾處理器上的 1 個超執行緒

<!-- 
Fractional values are allowed. A Container that requests 0.5 CPU is guaranteed half as much
CPU as a Container that requests 1 CPU. You can use the suffix m to mean milli. For example
100m CPU, 100 milliCPU, and 0.1 CPU are all the same. Precision finer than 1m is not allowed.

CPU is always requested as an absolute quantity, never as a relative quantity; 0.1 is the same
amount of CPU on a single-core, dual-core, or 48-core machine.

Delete your Pod:
-->
小數值是可以使用的。一個請求 0.5 CPU 的容器保證會獲得請求 1 個 CPU 的容器的 CPU 的一半。
你可以使用後綴 `m` 表示毫。例如 `100m` CPU、100 milliCPU 和 0.1 CPU 都相同。
精度不能超過 1m。

CPU 請求只能使用絕對數量，而不是相對數量。0.1 在單核、雙核或 48 覈計算機上的 CPU 數量值是一樣的。

刪除 Pod：

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

<!-- 
## Specify a CPU request that is too big for your Nodes

CPU requests and limits are associated with Containers, but it is useful to think
of a Pod as having a CPU request and limit. The CPU request for a Pod is the sum
of the CPU requests for all the Containers in the Pod. Likewise, the CPU limit for
a Pod is the sum of the CPU limits for all the Containers in the Pod.

Pod scheduling is based on requests. A Pod is scheduled to run on a Node only if
the Node has enough CPU resources available to satisfy the Pod CPU request.

In this exercise, you create a Pod that has a CPU request so big that it exceeds
the capacity of any Node in your cluster. Here is the configuration file for a Pod
that has one Container. The Container requests 100 CPU, which is likely to exceed the
capacity of any Node in your cluster.

{{% code_sample file="pods/resource/cpu-request-limit-2.yaml" %}}

Create the Pod:
-->
## 設置超過節點能力的 CPU 請求 {#specify-a-CPU-request-that-is-too-big-for-your-nodes}

CPU 請求和限制與都與容器相關，但是我們可以考慮一下 Pod 具有對應的 CPU 請求和限制這樣的場景。
Pod 對 CPU 用量的請求等於 Pod 中所有容器的請求數量之和。
同樣，Pod 的 CPU 資源限制等於 Pod 中所有容器 CPU 資源限制數之和。

Pod 調度是基於資源請求值來進行的。
僅在某節點具有足夠的 CPU 資源來滿足 Pod CPU 請求時，Pod 將會在對應節點上運行：

在本練習中，你將創建一個 Pod，該 Pod 的 CPU 請求對於叢集中任何節點的容量而言都會過大。
下面是 Pod 的設定檔案，其中有一個容器。容器請求 100 個 CPU，這可能會超出叢集中任何節點的容量。

{{% code_sample file="pods/resource/cpu-request-limit-2.yaml" %}}

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```
<!-- 
View the Pod status:
-->
查看該 Pod 的狀態：

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

<!-- 
The output shows that the Pod status is Pending. That is, the Pod has not been
scheduled to run on any Node, and it will remain in the Pending state indefinitely:
-->
輸出顯示 Pod 狀態爲 Pending。也就是說，Pod 未被調度到任何節點上運行，
並且 Pod 將無限期地處於 Pending 狀態：

```
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

<!-- 
View detailed information about the Pod, including events:
-->

查看有關 Pod 的詳細資訊，包含事件：

```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

<!-- 
The output shows that the Container cannot be scheduled because of insufficient
CPU resources on the Nodes:
-->
輸出顯示由於節點上的 CPU 資源不足，無法調度容器：

```
Events:
  Reason                        Message
  ------                        -------
  FailedScheduling      No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

<!-- 
Delete your Pod:
-->
刪除你的 Pod： 

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

<!-- 
## If you do not specify a CPU limit

If you do not specify a CPU limit for a Container, then one of these situations applies:

* The Container has no upper bound on the CPU resources it can use. The Container
could use all of the CPU resources available on the Node where it is running.

* The Container is running in a namespace that has a default CPU limit, and the
Container is automatically assigned the default limit. Cluster administrators can use a
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/)
to specify a default value for the CPU limit.
-->
## 如果不指定 CPU 限制 {#if-you-do-not-specify-a-cpu-limit}

如果你沒有爲容器指定 CPU 限制，則會發生以下情況之一：

* 容器在可以使用的 CPU 資源上沒有上限。因而可以使用所在節點上所有的可用 CPU 資源。

* 容器在具有預設 CPU 限制的名字空間中運行，系統會自動爲容器設置預設限制。
  叢集管理員可以使用
  [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/)
  指定 CPU 限制的預設值。

<!--
## If you specify a CPU limit but do not specify a CPU request

If you specify a CPU limit for a Container but do not specify a CPU request, Kubernetes automatically
assigns a CPU request that matches the limit. Similarly, if a Container specifies its own memory limit,
but does not specify a memory request, Kubernetes automatically assigns a memory request that matches
the limit.
-->
## 如果你設置了 CPU 限制但未設置 CPU 請求 {#if-you-specify-a-CPU-limit-but-do-not-specify-a-CPU-request}

如果你爲容器指定了 CPU 限制值但未爲其設置 CPU 請求，Kubernetes 會自動爲其
設置與 CPU 限制相同的 CPU 請求值。類似的，如果容器設置了內存限制值但未設置
內存請求值，Kubernetes 也會爲其設置與內存限制值相同的內存請求。

<!-- 
## Motivation for CPU requests and limits

By configuring the CPU requests and limits of the Containers that run in your
cluster, you can make efficient use of the CPU resources available on your cluster
Nodes. By keeping a Pod CPU request low, you give the Pod a good chance of being
scheduled. By having a CPU limit that is greater than the CPU request, you accomplish two things:

* The Pod can have bursts of activity where it makes use of CPU resources that happen to be available.
* The amount of CPU resources a Pod can use during a burst is limited to some reasonable amount.
-->
## CPU 請求和限制的初衷 {#motivation-for-CPU-requests-and-limits}

通過設定你的叢集中運行的容器的 CPU 請求和限制，你可以有效利用叢集上可用的 CPU 資源。
通過將 Pod CPU 請求保持在較低水平，可以使 Pod 更有機會被調度。
通過使 CPU 限制大於 CPU 請求，你可以完成兩件事：

* Pod 可能會有突發性的活動，它可以利用碰巧可用的 CPU 資源。

* Pod 在突發負載期間可以使用的 CPU 資源數量仍被限制爲合理的數量。	

<!-- 
## Clean up

Delete your namespace:
-->
## 清理 {#clean-up}

刪除名字空間：

```shell
kubectl delete namespace cpu-example
```

## {{% heading "whatsnext" %}}


<!-- 
### For app developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Configure Quality of Service for Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

* [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)
-->
### 針對應用開發者 {#for-app-developers}

* [將內存資源分配給容器和 Pod](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)

* [分配 Pod 級別的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [設定 Pod 服務質量](/zh-cn/docs/tasks/configure-pod-container/quality-service-pod/)

* [調整分配給容器的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)

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
### 針對叢集管理員 {for-cluster-administrators}

* [設定名字空間的預設內存請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [爲名字空間設定預設 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [爲名字空間設定最小和最大內存限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [爲名字空間設定最小和最大 CPU 約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [爲名字空間設定內存和 CPU 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
* [爲名字空間設定 Pod 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)
* [設定 API 對象的配額](/zh-cn/docs/tasks/administer-cluster/quota-api-object/)
* [調整分配給容器的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)
 