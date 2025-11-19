---
title: 分配 Pod 級別 CPU 和內存資源
content_type: task
weight: 30
min-kubernetes-server-version: 1.34
---
<!--
title: Assign Pod-level CPU and memory resources
content_type: task
weight: 30
min-kubernetes-server-version: 1.34
-->

<!-- overview -->

{{< feature-state feature_gate_name="PodLevelResources" >}}

<!--
This page shows how to specify CPU and memory resources for a Pod at pod-level in
addition to container-level resource specifications. A Kubernetes node allocates
resources to a pod based on the pod's resource requests. These requests can be
defined at the pod level or individually for containers within the pod. When
both are present, the pod-level requests take precedence.
-->
本頁介紹除了容器級別的資源規約外，如何在 Pod 級別指定 CPU 和內存資源。
Kubernetes 節點基於 Pod 的資源請求分配資源。
這些請求可以在 Pod 級別定義，也可以逐個爲 Pod 內的容器定義。
當兩種級別的請求都存在時，Pod 級別的請求優先。

<!--
Similarly, a pod's resource usage is restricted by limits, which can also be set at
the pod-level or individually for containers within the pod. Again,
pod-level limits are prioritized when both are present. This allows for flexible
resource management, enabling you to control resource allocation at both the pod and
container levels.

In order to specify the resources at pod-level, it is required to enable
`PodLevelResources` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
-->
同樣，Pod 的資源用量受限於限制值（limits），這些限制值也可以在 Pod 級別或爲 Pod 內的容器逐個設置。
另外，當兩種級別的限制值都存在時，Pod 級別的設置值優先。
這樣可以靈活地管理資源，使你能夠在 Pod 級別和容器級別控制資源分配。

要在 Pod 級別指定資源，必須啓用 `PodLevelResources`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
For Pod Level Resources:
* Priority: When both pod-level and container-level resources are specified,
  pod-level resources take precedence.
* QoS: Pod-level resources take precedence in influencing the QoS class of the pod.
* OOM Score: The OOM score adjustment calculation considers both pod-level and
  container-level resources.
* Compatibility: Pod-level resources are designed to be compatible with existing
  features.
-->
對於 Pod 級別資源：

* 優先級：當 Pod 級別和容器級別的資源被同時指定時，Pod 級別的資源優先。
* QoS：Pod 級別的資源在影響 Pod 的 QoS 類時優先。
* OOM 分數：OOM 分數調整計算會同時考慮 Pod 級別和容器級別的資源。
* 兼容性：Pod 級別的資源設計爲與現有特性兼容。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
The `PodLevelResources` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) must be enabled
for your control plane and for all nodes in your cluster.
-->
你必須爲叢集中的控制平面和所有節點啓用 `PodLevelResources`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
## Limitations

For Kubernetes {{< skew currentVersion >}}, resizing pod-level resources has the
following limitations:
-->
## 限制     {#limitations}

對於 Kubernetes {{< skew currentVersion >}}，調整 Pod 級別資源的大小有以下限制：

<!--
* **Resource Types:** Only CPU, memory and hugepages resources can be specified at pod-level.
* **Operating System:** Pod-level resources are not supported for Windows
  pods.
* **Resource Managers:** The Topology Manager, Memory Manager and CPU Manager do not
  align pods and containers based on pod-level resources as these resource managers 
  don't currently support pod-level resources.
* **[In-Place
  Resize](https://kubernetes.io/docs/tasks/configure-pod-container/resize-container-resources/):**
  In-place resize of pod-level resources is not supported. Modifying the pod-level resource
  limits or requests on a pod result in a field.Forbidden error. The error message
  explicitly states, "pods with pod-level resources cannot be resized."
-->
* **資源類型：** 僅支持在 Pod 級別指定 CPU、內存和大頁內存資源。
* **操作系統：** Windows Pod 不支持 Pod 級別資源。
* **資源管理器：** 拓撲管理器、內存管理器和 CPU 管理器不根據 Pod
  級別資源對齊 Pod 和容器，因爲這些資源管理器目前不支持 Pod 級別資源。
* **[原地調整大小](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)：** 
  不支持 Pod 級別資源的原地調整大小。修改 Pod 級別的資源限制或請求會導致
  `field.Forbidden` 錯誤。錯誤信息明確指出："pods with pod-level resources cannot be resized"。

<!-- steps -->

<!--
## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.
-->
## 創建命名空間   {#create-a-namespace}

創建一個命名空間，以便你在本次練習中所創建的資源與叢集的其餘部分隔離開來。

```shell
kubectl create namespace pod-resources-example
```

<!--
## Create a pod with memory requests and limits at pod-level

To specify memory requests for a Pod at pod-level, include the `resources.requests.memory`
field in the Pod spec manifest. To specify a memory limit, include `resources.limits.memory`.

In this exercise, you create a Pod that has one Container. The Pod has a
memory request of 100 MiB and a memory limit of 200 MiB. Here's the configuration
file for the Pod:
-->
## 創建具有 Pod 級別內存請求和限制的 Pod

要在 Pod 級別爲 Pod 指定內存請求，可以在 Pod 規約清單中包含 `resources.requests.memory` 字段。
要指定內存限制，可以包含 `resources.limits.memory` 字段。

在本次練習中，你將創建包含一個容器的 Pod。
此 Pod 的內存請求爲 100 MiB，內存限制爲 200 MiB。以下是 Pod 的設定文件：

{{% code_sample file="pods/resource/pod-level-memory-request-limit.yaml" %}}

<!--
The `args` section in the manifest provides arguments for the container when it starts.
The `"--vm-bytes", "150M"` arguments tell the Container to attempt to allocate 150 MiB of memory.

Create the Pod:
-->
清單中的 `args` 部分在容器啓動時爲容器提供參數。
`"--vm-bytes", "150M"` 參數告知容器嘗試分配 150 MiB 的內存。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-memory-request-limit.yaml --namespace=pod-resources-example
```

<!--
Verify that the Pod is running:
-->
驗證 Pod 正在運行：

```shell
kubectl get pod memory-demo --namespace=pod-resources-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 的詳細信息：

```shell
kubectl get pod memory-demo --output=yaml --namespace=pod-resources-example
```

<!--
The output shows that the Pod has a memory request of 100 MiB
and a memory limit of 200 MiB.
-->
輸出顯示 Pod 的內存請求爲 100 MiB，內存限制爲 200 MiB。

```yaml
...
spec: 
  containers:    
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
運行 `kubectl top` 獲取 Pod 的指標度量值：

```shell
kubectl top pod memory-demo --namespace=pod-resources-example
```

<!--
The output shows that the Pod is using about 162,900,000 bytes of memory, which
is about 150 MiB. This is greater than the Pod's 100 MiB request, but within the
Pod's 200 MiB limit.
-->
輸出顯示 Pod 使用了大約 162,900,000 字節的內存，約 150 MiB。
這個數值超過了 Pod 的 100 MiB 請求值，但小於 Pod 的 200 MiB 限制值。

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

<!--
## Create a pod with CPU requests and limits at pod-level
To specify a CPU request for a Pod, include the `resources.requests.cpu` field
in the Pod spec manifest. To specify a CPU limit, include `resources.limits.cpu`.

In this exercise, you create a Pod that has one container. The Pod has a request
of 0.5 CPU and a limit of 1 CPU. Here is the configuration file for the Pod:
-->
## 創建具有 Pod 級別 CPU 請求和限制的 Pod

要爲 Pod 指定 CPU 請求，可以在 Pod 規約清單中包含 `resources.requests.cpu` 字段。
要指定 CPU 限制，可以包含 `resources.limits.cpu` 字段。

在本次練習中，你將創建包含一個容器的 Pod。
此 Pod 的請求爲 0.5 CPU，限制爲 1 CPU。以下是 Pod 的設定文件：

{{% code_sample file="pods/resource/pod-level-cpu-request-limit.yaml" %}}

<!--
The `args` section of the configuration file provides arguments for the container when it starts.
The `-cpus "2"` argument tells the Container to attempt to use 2 CPUs.

Create the Pod:
-->
設定文件的 `args` 部分在容器啓動時爲容器提供參數。
`-cpus "2"` 參數告知容器嘗試使用 2 個 CPU。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-cpu-request-limit.yaml --namespace=pod-resources-example
```

<!--
Verify that the Pod is running:
-->
驗證 Pod 正在運行：

```shell
kubectl get pod cpu-demo --namespace=pod-resources-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 的詳細信息：

```shell
kubectl get pod cpu-demo --output=yaml --namespace=pod-resources-example
```

<!--
The output shows that the Pod has a CPU request of 500 milliCPU
and a CPU limit of 1 CPU.
-->
輸出顯示 Pod 的 CPU 請求爲 500 milliCPU，CPU 限制爲 1 CPU。

```yaml
spec:
  containers:
  ...
  resources:
    limits:
      cpu: "1"
    requests:
      cpu: 500m
```

<!--
Use `kubectl top` to fetch the metrics for the Pod:
-->
使用 `kubectl top` 獲取 Pod 的指標度量值：

```shell
kubectl top pod cpu-demo --namespace=pod-resources-example
```

<!--
This example output shows that the Pod is using 974 milliCPU, which is
slightly less than the limit of 1 CPU specified in the Pod configuration.
-->
這個示例的輸出顯示 Pod 使用了 974 milliCPU，這略低於 Pod 設定中指定的 1 CPU 限制值。

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

<!--
Recall that by setting `-cpu "2"`, you configured the Container to attempt to use 2
CPUs, but the Container is only being allowed to use about 1 CPU. The container's
CPU use is being throttled, because the container is attempting to use more CPU
resources than the Pod CPU limit.
-->
請注意，通過設置 `-cpu "2"`，你設定了容器嘗試使用 2 個 CPU，但容器僅被允許使用約 1 個 CPU。
容器的 CPU 用量受到限制，因爲容器正在嘗試使用超過 Pod CPU 限制值的 CPU 資源。

<!--
## Create a pod with resource requests and limits at both pod-level and container-level

To assign CPU and memory resources to a Pod, you can specify them at both the pod
level and the container level.  Include the `resources` field in the Pod spec to
define resources for the entire Pod. Additionally, include the `resources` field
within container's specification in the Pod's manifest to set container-specific
resource requirements.
-->
## 創建具有 Pod 級別和容器級別資源請求和限制的 Pod

要爲 Pod 指定 CPU 和內存資源，你可以在 Pod 級別和容器級別同時指定它們。
在 Pod 規約中包含 `resources` 字段以定義整個 Pod 的資源。
此外，在 Pod 的清單中包含容器規約中的 `resources` 字段，以設置特定於容器的資源要求。

<!--
In this exercise, you'll create a Pod with two containers to explore the interaction
of pod-level and container-level resource specifications. The Pod itself will have
defined CPU requests and limits, while only one of the containers will have its own
explicit resource requests and limits. The other container will inherit the resource
constraints from the pod-level settings. Here's the configuration file for the Pod:
-->
在本次練習中，你將創建包含兩個容器的 Pod，以探索 Pod 級別和容器級別資源規約的相互作用。
Pod 本身將定義 CPU 請求和限制，而只有一個容器將帶有自己的顯式資源請求和限制。
另一個容器將從 Pod 級別設置中繼承資源約束。以下是 Pod 的設定文件：

{{% code_sample file="pods/resource/pod-level-resources.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-resources.yaml --namespace=pod-resources-example
```

<!--
Verify that the Pod Container is running:
-->
驗證 Pod 容器正在運行：

```shell
kubectl get pod-resources-demo --namespace=pod-resources-example
```

<!--
View detailed information about the Pod:
-->
查看 Pod 的詳細信息：

```shell
kubectl get pod memory-demo --output=yaml --namespace=pod-resources-example
```

<!--
The output shows that one container in the Pod has a memory request of 50 MiB and a
CPU request of 0.5 cores, with a memory limit of 100 MiB and a CPU limit of 0.5
cores. The Pod itself has a memory request of 100 MiB and a CPU request of
1 core, and a memory limit of 200 MiB and a CPU limit of 1 core.
-->
輸出顯示 Pod 中的一個容器具有 50 MiB 的內存請求和 0.5 核的 CPU 請求，
內存限制爲 100 MiB，CPU 限制爲 0.5 核。
Pod 本身具有 100 MiB 的內存請求和 1 核的 CPU 請求，以及 200 MiB 的內存限制和 1 核的 CPU 限制。

```yaml
...
containers:
  name: pod-resources-demo-ctr-1
  resources:
      requests:
        cpu: 500m
        memory: 50Mi
      limits:
        cpu: 500m
        memory: 100Mi
  ...
  name: pod-resources-demo-ctr-2
  resources: {}  
resources:
  limits:
      cpu: 1
      memory: 200Mi
    requests:
      cpu: 1
      memory: 100Mi
...
```

<!--
Since pod-level requests and limits are specified, the request guarantees for both
containers in the pod will be equal 1 core or CPU and 100Mi of memory. Additionally,
both containers together won't be able to use more resources than specified in the
pod-level limits, ensuring they cannot exceed a combined total of 200 MiB of memory
and 1 core of CPU.
-->
由於 Pod 級別的請求和限制被指定，所以 Pod 中兩個容器的請求保證將等於 1 核 CPU 和 100Mi 內存。
此外，這兩個容器能夠使用的資源總量將不能超過 Pod 級別限制中指定的資源，
確保其使用的資源不能超過 200 MiB 的內存和 1 核的 CPU。

<!--
## Clean up

Delete your namespace:
-->
## 清理   {#clean-up}

刪除你的命名空間：

```shell
kubectl delete namespace pod-resources-example
```

## {{% heading "whatsnext" %}}

<!--
### For application developers

* [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
-->
### 對於應用開發者

* [爲容器和 Pod 分配內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
* [爲容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)

<!--
### For cluster administrators

* [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configure Minimum and Maximum Memory Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configure Minimum and Maximum CPU Constraints for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configure Memory and CPU Quotas for a Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
-->
### 對於叢集管理員

* [爲命名空間設定默認內存請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
* [爲命名空間設定默認 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
* [爲命名空間設定最小和最大內存約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [爲命名空間設定最小和最大 CPU 約束](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)
* [爲命名空間設定內存和 CPU 配額](/zh-cn/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
