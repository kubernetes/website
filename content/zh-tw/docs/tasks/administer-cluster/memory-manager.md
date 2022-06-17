---
title: 使用 NUMA 感知的記憶體管理器
content_type: task
min-kubernetes-server-version: v1.21
---

<!--
title: Utilizing the NUMA-aware Memory Manager

reviewers:
- klueska
- derekwaynecarr

content_type: task
min-kubernetes-server-version: v1.21
-->

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.22" >}}

<!--
The Kubernetes *Memory Manager* enables the feature of guaranteed memory (and hugepages)
allocation for pods in the `Guaranteed` {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}.

The Memory Manager employs hint generation protocol to yield the most suitable NUMA affinity for a pod.
The Memory Manager feeds the central manager (*Topology Manager*) with these affinity hints.
Based on both the hints and Topology Manager policy, the pod is rejected or admitted to the node.
-->
Kubernetes 記憶體管理器（Memory Manager）為 `Guaranteed`
{{< glossary_tooltip text="QoS 類" term_id="qos-class" >}}
的 Pods 提供可保證的記憶體（及大頁面）分配能力。

記憶體管理器使用提示生成協議來為 Pod 生成最合適的 NUMA 親和性配置。
記憶體管理器將這類親和性提示輸入給中央管理器（即 Topology Manager）。
基於所給的提示和 Topology Manager（拓撲管理器）的策略設定，Pod
或者會被某節點接受，或者被該節點拒絕。

<!--
Moreover, the Memory Manager ensures that the memory which a pod
requests is allocated from
a minimum number of NUMA nodes.

The Memory Manager is only pertinent to Linux based hosts.
-->
此外，記憶體管理器還確保 Pod 所請求的記憶體是從儘量少的 NUMA 節點分配而來。

記憶體管理器僅能用於 Linux 主機。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
To align memory resources with other requested resources in a Pod Spec:

- the CPU Manager should be enabled and proper CPU Manager policy should be configured on a Node.
  See [control CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/);
- the Topology Manager should be enabled and proper Topology Manager policy should be configured on a Node.
  See [control Topology Management Policies](/docs/tasks/administer-cluster/topology-manager/).
-->
為了使得記憶體資源與 Pod 規約中所請求的其他資源對齊：

- CPU 管理器應該被啟用，並且在節點（Node）上要配置合適的 CPU 管理器策略，
  參見[控制 CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)；
- 拓撲管理器要被啟用，並且要在節點上配置合適的拓撲管理器策略，參見
  [控制拓撲管理器策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)。

<!--
Starting from v1.22, the Memory Manager is enabled by default through `MemoryManager`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).

Preceding v1.22, the `kubelet` must be started with the following flag:

`--feature-gates=MemoryManager=true`

in order to enable the Memory Manager feature.
-->
從 v1.22 開始，記憶體管理器透過
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
`MemoryManager` 預設啟用。

在 v1.22 之前，`kubelet` 必須在啟動時設定如下標誌：

`--feature-gates=MemoryManager=true`

這樣記憶體管理器特性才會被啟用。

<!--
## How Memory Manager Operates?
-->
## 記憶體管理器如何運作？

<!--
The Memory Manager currently offers the guaranteed memory (and hugepages) allocation
for Pods in Guaranteed QoS class.
To immediately put the Memory Manager into operation follow the guidelines in the section
[Memory Manager configuration](#memory-manager-configuration), and subsequently,
prepare and deploy a `Guaranteed` pod as illustrated in the section
[Placing a Pod in the Guaranteed QoS class](#placing-a-pod-in-the-guaranteed-qos-class).
-->
記憶體管理器目前為 Guaranteed QoS 類中的 Pod 提供可保證的記憶體（和大頁面）分配能力。
若要立即將記憶體管理器啟用，可參照[記憶體管理器配置](#memory-manager-configuration)節中的指南，
之後按[將 Pod 放入 Guaranteed QoS 類](#placing-a-pod-in-the-guaranteed-qos-class)
節中所展示的，準備並部署一個 `Guaranteed` Pod。

<!--
The Memory Manager is a Hint Provider, and it provides topology hints for
the Topology Manager which then aligns the requested resources according to these topology hints.
It also enforces `cgroups` (i.e. `cpuset.mems`) for pods.
The complete flow diagram concerning pod admission and deployment process is illustrated in
[Memory Manager KEP: Design Overview][4] and below:
-->
記憶體管理器是一個提示驅動元件（Hint Provider），負責為拓撲管理器提供拓撲提示，
後者根據這些拓撲提示對所請求的資源執行對齊操作。
記憶體管理器也會為 Pods 應用 `cgroups` 設定（即 `cpuset.mems`）。
與 Pod 准入和部署流程相關的完整流程圖在[Memory Manager KEP: Design Overview][4]
和下面。

<!--
![Memory Manager in the pod admission and deployment process](/images/docs/memory-manager-diagram.svg)
-->
![Pod 准入與部署流程中的記憶體管理器](/images/docs/memory-manager-diagram.svg)

<!--
During this process, the Memory Manager updates its internal counters stored in
[Node Map and Memory Maps][2] to manage guaranteed memory allocation. 

The Memory Manager updates the Node Map during the startup and runtime as follows.
-->
在這個過程中，記憶體管理器會更新其內部儲存於[節點對映和記憶體對映][2]中的計數器，
從而管理有保障的記憶體分配。

記憶體管理器在啟動和執行期間按下述邏輯更新節點對映（Node Map）。

<!--
### Startup
-->
### 啟動  {#startup}

<!--
This occurs once a node administrator employs `--reserved-memory` (section
[Reserved memory flag](#reserved-memory-flag)).
In this case, the Node Map becomes updated to reflect this reservation as illustrated in
[Memory Manager KEP: Memory Maps at start-up (with examples)][5].

The administrator must provide `--reserved-memory` flag when `Static` policy is configured.
-->
當節點管理員應用 `--reserved-memory` [預留記憶體標誌](#reserved-memory-flag)時執行此邏輯。
這時，節點對映會被更新以反映記憶體的預留，如
[Memory Manager KEP: Memory Maps at start-up (with examples)][5]
所說明。

當配置了 `Static` 策略時，管理員必須提供 `--reserved-memory` 標誌設定。

<!--
### Runtime
-->
### 執行時  {#runtime} 

<!--
Reference [Memory Manager KEP: Memory Maps at runtime (with examples)][6]
illustrates how a successful pod deployment affects the Node Map, and it also relates to
how potential Out-of-Memory (OOM) situations are handled further by Kubernetes or operating system.
-->
參考文獻 [Memory Manager KEP: Memory Maps at runtime (with examples)][6]
中說明了成功的 Pod 部署是如何影響節點對映的，該文件也解釋了可能發生的記憶體不足
（Out-of-memory，OOM）情況是如何進一步被 Kubernetes 或作業系統處理的。

<!--
Important topic in the context of Memory Manager operation is the management of NUMA groups.
Each time pod's memory request is in excess of single NUMA node capacity, the Memory Manager
attempts to create a group that comprises several NUMA nodes and features extend memory capacity.
The problem has been solved as elaborated in
[Memory Manager KEP: How to enable the guaranteed memory allocation over many NUMA nodes?][3].
Also, reference [Memory Manager KEP: Simulation - how the Memory Manager works? (by examples)][1]
illustrates how the management of groups occurs. 
-->
在記憶體管理器運作的語境中，一個重要的話題是對 NUMA 分組的管理。
每當 Pod 的記憶體請求超出單個 NUMA 節點容量時，記憶體管理器會嘗試建立一個包含多個
NUMA 節點的分組，從而擴充套件記憶體容量。解決這個問題的詳細描述在文件
[Memory Manager KEP: How to enable the guaranteed memory allocation over many NUMA nodes?][3]
中。同時，關於 NUMA 分組是如何管理的，你還可以參考文件
[Memory Manager KEP: Simulation - how the Memory Manager works? (by examples)][1]。

<!--
## Memory Manager configuration
-->
## 記憶體管理器配置   {#memory-manager-configuration}

<!--
Other Managers should be first pre-configured. Next, the Memory Manger feature should be enabled
and be run with `Static` policy (section [Static policy](#static-policy)).
Optionally, some amount of memory can be reserved for system or kubelet processes to increase
node stability (section [Reserved memory flag](#reserved-memory-flag)).
-->
其他管理器也要預先配置。接下來，記憶體管理器特性需要被啟用，
並且採用 `Static` 策略（[靜態策略](#policy-static)）執行。
作為可選操作，可以預留一定數量的記憶體給系統或者 kubelet 程序以增強節點的
穩定性（[預留記憶體標誌](#reserved-memory-flag)）。

<!--
### Policies 
-->
### 策略    {#policies}

<!--
Memory Manager supports two policies. You can select a policy via a `kubelet` flag `--memory-manager-policy`:

* `None` (default)
* `Static`
-->
記憶體管理器支援兩種策略。你可以透過 `kubelet` 標誌 `--memory-manager-policy` 來
選擇一種策略：

* `None` （預設）
* `Static`

<!--
#### None policy {#policy-none}

This is the default policy and does not affect the memory allocation in any way.
It acts the same as if the Memory Manager is not present at all.

The `None` policy returns default topology hint. This special hint denotes that Hint Provider
(Memory Manger in this case) has no preference for NUMA affinity with any resource.
-->
#### None 策略    {#policy-none}

這是預設的策略，並且不會以任何方式影響記憶體分配。該策略的行為好像記憶體管理器不存在一樣。

`None` 策略返回預設的拓撲提示資訊。這種特殊的提示會表明拓撲驅動元件（Hint Provider）
（在這裡是記憶體管理器）對任何資源都沒有與 NUMA 親和性關聯的偏好。

<!--
#### Static policy {#policy-static}

In the case of the `Guaranteed` pod, the `Static` Memory Manger policy returns topology hints
relating to the set of NUMA nodes where the memory can be guaranteed,
and reserves the memory through updating the internal [NodeMap][2] object.

In the case of the `BestEffort` or `Burstable` pod, the `Static` Memory Manager policy sends back
the default topology hint as there is no request for the guaranteed memory,
and does not reserve the memory in the internal [NodeMap][2] object.
-->
#### Static 策略    {#policy-static}

對 `Guaranteed` Pod 而言，`Static` 記憶體管理器策略會返回拓撲提示資訊，該資訊
與記憶體分配有保障的 NUMA 節點集合有關，並且記憶體管理器還透過更新內部的
[節點對映][2] 物件來完成記憶體預留。

對 `BestEffort` 或 `Burstable` Pod 而言，因為不存在對有保障的記憶體資源的請求，
`Static` 記憶體管理器策略會返回預設的拓撲提示，並且不會透過內部的[節點對映][2]物件
來預留記憶體。

<!--
### Reserved memory flag
-->
### 預留記憶體標誌    {#reserved-memory-flag}

<!--
The [Node Allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/) mechanism
is commonly used by node administrators to reserve K8S node system resources for the kubelet
or operating system processes in order to enhance the node stability.
A dedicated set of flags can be used for this purpose to set the total amount of reserved memory
for a node. This pre-configured value is subsequently utilized to calculate
the real amount of node's "allocatable" memory available to pods.
-->
[節點可分配](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/)機制通常
被節點管理員用來為 kubelet 或作業系統程序預留 K8S 節點上的系統資源，目的是提高節點穩定性。
有一組專用的標誌可用於這個目的，為節點設定總的預留記憶體量。
此預配置的值接下來會被用來計算節點上對 Pods “可分配的”記憶體。

<!--
The Kubernetes scheduler incorporates "allocatable" to optimise pod scheduling process.
The foregoing flags include `--kube-reserved`, `--system-reserved` and `--eviction-threshold`.
The sum of their values will account for the total amount of reserved memory.

A new `--reserved-memory` flag was added to Memory Manager to allow for this total reserved memory
to be split (by a node administrator) and accordingly reserved across many NUMA nodes. 
-->
Kubernetes 排程器在最佳化 Pod 排程過程時，會考慮“可分配的”記憶體。
前面提到的標誌包括 `--kube-reserved`、`--system-reserved` 和 `--eviction-threshold`。
這些標誌值的綜合計作預留記憶體的總量。

為記憶體管理器而新增加的 `--reserved-memory` 標誌可以（讓節點管理員）將總的預留記憶體進行劃分，
並完成跨 NUMA 節點的預留操作。

<!--
The flag specifies a comma-separated list of memory reservations of different memory types per NUMA node.
Memory reservations across multiple NUMA nodes can be specified using semicolon as separator.
This parameter is only useful in the context of the Memory Manager feature. 
The Memory Manager will not use this reserved memory for the allocation of container workloads.

For example, if you have a NUMA node "NUMA0" with `10Gi` of memory available, and
the `--reserved-memory` was specified to reserve `1Gi` of memory at "NUMA0",
the Memory Manager assumes that only `9Gi` is available for containers.
-->
標誌設定的值是一個按 NUMA 節點的不同記憶體型別所給的記憶體預留的值的列表，用逗號分開。
可以使用分號作為分隔符來指定跨多個 NUMA 節點的記憶體預留。
只有在記憶體管理器特性被啟用的語境下，這個引數才有意義。
記憶體管理器不會使用這些預留的記憶體來為容器負載分配記憶體。

例如，如果你有一個可用記憶體為 `10Gi` 的 NUMA 節點 "NUMA0"，而引數 `--reserved-memory`
被設定成要在 "NUMA0" 上預留 `1Gi` 的記憶體，那麼記憶體管理器會假定節點上只有 `9Gi`
記憶體可用於容器負載。

<!--
You can omit this parameter, however, you should be aware that the quantity of reserved memory
from all NUMA nodes should be equal to the quantity of memory specified by the
[Node Allocatable feature](/docs/tasks/administer-cluster/reserve-compute-resources/).
If at least one node allocatable parameter is non-zero, you will need to specify
`--reserved-memory` for at least one NUMA node.
In fact, `eviction-hard` threshold value is equal to `100Mi` by default, so
if `Static` policy is used, `--reserved-memory` is obligatory.
-->
你也可以忽略此引數，不過這樣做時，你要清楚，所有 NUMA 節點上預留記憶體的數量要等於
[節點可分配特性](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/)
所設定的記憶體量。如果至少有一個節點可分配引數值為非零，你就需要至少為一個 NUMA
節點設定 `--reserved-memory`。實際上，`eviction-hard` 閾值預設為 `100Mi`，
所以當使用 `Static` 策略時，`--reserved-memory` 是必須設定的。

<!--
Also, avoid the following configurations:

1. duplicates, i.e. the same NUMA node or memory type, but with a different value;
1. setting zero limit for any of memory types;
1. NUMA node IDs that do not exist in the machine hardware;
1. memory type names different than `memory` or `hugepages-<size>`
   (hugepages of particular `<size>` should also exist).
-->
此外，應儘量避免如下配置：

1. 重複的配置，即同一 NUMA 節點或記憶體型別被設定不同的取值；
1. 為某種記憶體型別設定約束值為零；
1. 使用物理硬體上不存在的 NUMA 節點 ID；
1. 使用名字不是 `memory` 或 `hugepages-<size>` 的記憶體型別名稱
   （特定的 `<size>` 的大頁面也必須存在）。

<!--
Syntax: 
-->
語法：

`--reserved-memory N:memory-type1=value1,memory-type2=value2,...`

<!--
* `N` (integer) - NUMA node index, e.g. `0`
* `memory-type` (string) - represents memory type:
  * `memory` - conventional memory
  * `hugepages-2Mi` or `hugepages-1Gi` - hugepages 
* `value` (string) - the quantity of reserved memory, e.g. `1Gi`
-->
* `N`（整數）- NUMA 節點索引，例如，`0`
* `memory-type`（字串）- 代表記憶體型別：
  * `memory` - 常規記憶體；
  * `hugepages-2Mi` 或 `hugepages-1Gi` - 大頁面
* `value`（字串） - 預留記憶體的量，例如 `1Gi`

<!--
Example usage:
-->
用法示例：

`--reserved-memory 0:memory=1Gi,hugepages-1Gi=2Gi`

<!-- or -->
或者

`--reserved-memory 0:memory=1Gi --reserved-memory 1:memory=2Gi`

<!--
When you specify values for `--reserved-memory` flag, you must comply with the setting that
you prior provided via Node Allocatable Feature flags.
That is, the following rule must be obeyed for each memory type: 

`sum(reserved-memory(i)) = kube-reserved + system-reserved + eviction-threshold`, 

where `i` is an index of a NUMA node. 
-->
當你為 `--reserved-memory` 標誌指定取值時，必須要遵從之前透過節點可分配特性標誌所設定的值。
換言之，對每種記憶體型別而言都要遵從下面的規則：

`sum(reserved-memory(i)) = kube-reserved + system-reserved + eviction-threshold` 

其中，`i` 是 NUMA 節點的索引。

<!--
If you do not follow the formula above, the Memory Manager will show an error on startup.

In other words, the example above illustrates that for the conventional memory (`type=memory`),
we reserve `3Gi` in total, i.e.: 
-->
如果你不遵守上面的公示，記憶體管理器會在啟動時輸出錯誤資訊。

換言之，上面的例子我們一共要預留 `3Gi` 的常規記憶體（`type=memory`），即：

`sum(reserved-memory(i)) = reserved-memory(0) + reserved-memory(1) = 1Gi + 2Gi = 3Gi`

<!--
An example of kubelet command-line arguments relevant to the node Allocatable configuration:
-->
下面的例子中給出與節點可分配配置相關的 kubelet 命令列引數：

* `--kube-reserved=cpu=500m,memory=50Mi`
* `--system-reserved=cpu=123m,memory=333Mi`
* `--eviction-hard=memory.available<500Mi`

{{< note >}} 
<!--
The default hard eviction threshold is 100MiB, and **not** zero.
Remember to increase the quantity of memory that you reserve by setting `--reserved-memory`
by that hard eviction threshold. Otherwise, the kubelet will not start Memory Manager and
display an error. 
-->
預設的硬性驅逐閾值是 100MiB，**不是**零。
請記得在使用 `--reserved-memory` 設定要預留的記憶體量時，加上這個硬性驅逐閾值。
否則 kubelet 不會啟動記憶體管理器，而會輸出一個錯誤資訊。
{{< /note >}}

<!--
Here is an example of a correct configuration:
-->
下面是一個正確配置的示例：

```shell
--feature-gates=MemoryManager=true 
--kube-reserved=cpu=4,memory=4Gi 
--system-reserved=cpu=1,memory=1Gi 
--memory-manager-policy=Static 
--reserved-memory '0:memory=3Gi;1:memory=2148Mi'
```

<!--
Let us validate the configuration above:
-->
我們對上面的配置做一個檢查：

1. `kube-reserved + system-reserved + eviction-hard(default) = reserved-memory(0) + reserved-memory(1)`
1. `4GiB + 1GiB + 100MiB = 3GiB + 2148MiB`
1. `5120MiB + 100MiB = 3072MiB + 2148MiB`
1. `5220MiB = 5220MiB` （這是對的）

<!--
## Placing a Pod in the Guaranteed QoS class

If the selected policy is anything other than `None`, the Memory Manager identifies pods
that are in the `Guaranteed` QoS class.
The Memory Manager provides specific topology hints to the Topology Manager for each `Guaranteed` pod.
For pods in a QoS class other than `Guaranteed`, the Memory Manager provides default topology hints
to the Topology Manager.
-->
## 將 Pod 放入 Guaranteed QoS 類  {#placing-a-pod-in-the-guaranteed-qos-class} 

若所選擇的策略不是 `None`，則記憶體管理器會辨識處於 `Guaranteed` QoS 類中的 Pod。
記憶體管理器為每個 `Guaranteed` Pod 向拓撲管理器提供拓撲提示資訊。
對於不在 `Guaranteed` QoS 類中的其他 Pod，記憶體管理器向拓撲管理器提供預設的 
拓撲提示資訊。

<!--
The following excerpts from pod manifests assign a pod to the `Guaranteed` QoS class.

Pod with integer CPU(s) runs in the `Guaranteed` QoS class, when `requests` are equal to `limits`:
-->
下面的來自 Pod 清單的片段將 Pod 加入到 `Guaranteed` QoS 類中。

當 Pod 的 CPU `requests` 等於 `limits` 且為整數值時，Pod 將執行在 `Guaranteed`
QoS 類中。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
```

<!--
Also, a pod sharing CPU(s) runs in the `Guaranteed` QoS class, when `requests` are equal to `limits`.
-->
此外，共享 CPU 的 Pods 在 `requests` 等於 `limits` 值時也執行在 `Guaranteed`
QoS 類中。

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
```

<!--
Notice that both CPU and memory requests must be specified for a Pod to lend it to Guaranteed QoS class.
-->
要注意的是，只有 CPU 和記憶體請求都被設定時，Pod 才會進入 Guaranteed QoS 類。

<!--
## Troubleshooting

The following means can be used to troubleshoot the reason why a pod could not be deployed or
became rejected at a node:
-->
## 故障排查   {#troubleshooting}

下面的方法可用來排查為什麼 Pod 無法被排程或者被節點拒絕：

<!--
- pod status - indicates topology affinity errors
- system logs - include valuable information for debugging, e.g., about generated hints
- state file - the dump of internal state of the Memory Manager
  (includes [Node Map and Memory Maps][2]) 
- starting from v1.22, the [device plugin resource API](#device-plugin-resource-api) can be used
  to retrieve information about the memory reserved for containers
-->
- Pod 狀態 - 可表明拓撲親和性錯誤
- 系統日誌 - 包含用來除錯的有價值的資訊，例如，關於所生成的提示資訊
- 狀態檔案 - 其中包含記憶體管理器內部狀態的轉儲（包含[節點對映和記憶體對映][2]）
- 從 v1.22 開始，[裝置外掛資源 API](#device-plugin-resource-api) 可以用來
  檢索關於為容器預留的記憶體的資訊

<!--
### Pod status (TopologyAffinityError) {#TopologyAffinityError}

This error typically occurs in the following situations:

* a node has not enough resources available to satisfy the pod's request
* the pod's request is rejected due to particular Topology Manager policy constraints 

The error appears in the status of a pod:
-->
### Pod 狀態 （TopologyAffinityError）   {#TopologyAffinityError}

這類錯誤通常在以下情形出現：

* 節點缺少足夠的資源來滿足 Pod 請求
* Pod 的請求因為特定的拓撲管理器策略限制而被拒絕

錯誤資訊會出現在 Pod 的狀態中：

```shell
kubectl get pods
```

```none
NAME         READY   STATUS                  RESTARTS   AGE
guaranteed   0/1     TopologyAffinityError   0          113s
```

<!--
Use `kubectl describe pod <id>` or `kubectl get events` to obtain detailed error message:
-->
使用 `kubectl describe pod <id>` 或 `kubectl get events` 可以獲得詳細的錯誤資訊。

```none
Warning  TopologyAffinityError  10m   kubelet, dell8  Resources cannot be allocated with Topology locality
```

<!--
### System logs

Search system logs with respect to a particular pod.

The set of hints that Memory Manager generated for the pod can be found in the logs. 
Also, the set of hints generated by CPU Manager should be present in the logs.
-->
### 系統日誌     {#system-logs}

針對特定的 Pod 搜尋系統日誌。

記憶體管理器為 Pod 所生成的提示資訊可以在日誌中找到。
此外，日誌中應該也存在 CPU 管理器所生成的提示資訊。

<!--
Topology Manager merges these hints to calculate a single best hint.
The best hint should be also present in the logs.

The best hint indicates where to allocate all the resources.
Topology Manager tests this hint against its current policy, and based on the verdict,
it either admits the pod to the node or rejects it.  

Also, search the logs for occurrences associated with the Memory Manager,
e.g. to find out information about `cgroups` and `cpuset.mems` updates.
-->
拓撲管理器將這些提示資訊進行合併，計算得到唯一的最合適的提示資料。
此最佳提示資料也應該出現在日誌中。

最佳提示表明要在哪裡分配所有的資源。拓撲管理器會用當前的策略來測試此資料，
並基於得出的結論或者接納 Pod 到節點，或者將其拒絕。

此外，你可以搜尋日誌查詢與記憶體管理器相關的其他條目，例如 `cgroups` 和
`cpuset.mems` 的更新資訊等。

<!--
### Examine the memory manager state on a node

Let us first deploy a sample `Guaranteed` pod whose specification is as follows:
-->
### 檢查節點上記憶體管理器狀態

我們首先部署一個 `Guaranteed` Pod 示例，其規約如下所示：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: guaranteed
spec:
  containers:
  - name: guaranteed
    image: consumer
    imagePullPolicy: Never
    resources:
      limits:
        cpu: "2"
        memory: 150Gi
      requests:
        cpu: "2"
        memory: 150Gi
    command: ["sleep","infinity"]
``` 

<!--
Next, let us log into the node where it was deployed and examine the state file in
`/var/lib/kubelet/memory_manager_state`:
-->
接下來，我們登入到 Pod 執行所在的節點，檢查位於
`/var/lib/kubelet/memory_manager_state` 的狀態檔案：

```json
{
   "policyName":"Static",
   "machineState":{
      "0":{
         "numberOfAssignments":1,
         "memoryMap":{
            "hugepages-1Gi":{
               "total":0,
               "systemReserved":0,
               "allocatable":0,
               "reserved":0,
               "free":0
            },
            "memory":{
               "total":134987354112,
               "systemReserved":3221225472,
               "allocatable":131766128640,
               "reserved":131766128640,
               "free":0
            }
         },
         "nodes":[
            0,
            1
         ]
      },
      "1":{
         "numberOfAssignments":1,
         "memoryMap":{
            "hugepages-1Gi":{
               "total":0,
               "systemReserved":0,
               "allocatable":0,
               "reserved":0,
               "free":0
            },
            "memory":{
               "total":135286722560,
               "systemReserved":2252341248,
               "allocatable":133034381312,
               "reserved":29295144960,
               "free":103739236352
            }
         },
         "nodes":[
            0,
            1
         ]
      }
   },
   "entries":{
      "fa9bdd38-6df9-4cf9-aa67-8c4814da37a8":{
         "guaranteed":[
            {
               "numaAffinity":[
                  0,
                  1
               ],
               "type":"memory",
               "size":161061273600
            }
         ]
      }
   },
   "checksum":4142013182
}
```

<!--
It can be deduced from the state file that the pod was pinned to both NUMA nodes, i.e.:
-->
從這個狀態檔案，可以推斷 Pod 被同時繫結到兩個 NUMA 節點，即：

```json
"numaAffinity":[
   0,
   1
],
``` 

<!--
Pinned term means that pod's memory consumption is constrained (through `cgroups` configuration)
to these NUMA nodes.

This automatically implies that Memory Manager instantiated a new group that
comprises these two NUMA nodes, i.e. `0` and `1` indexed NUMA nodes. 
-->
術語繫結（pinned）意味著 Pod 的記憶體使用被（透過 `cgroups` 配置）限制到
這些 NUMA 節點。

這也直接意味著記憶體管理器已經建立了一個 NUMA 分組，由這兩個 NUMA 節點組成，
即索引值分別為 `0` 和 `1` 的 NUMA 節點。

<!--
Notice that the management of groups is handled in a relatively complex manner, and
further elaboration is provided in Memory Manager KEP in [this][1] and [this][3] sections.

In order to analyse memory resources available in a group,the corresponding entries from
NUMA nodes belonging to the group must be added up.  
-->
注意 NUMA 分組的管理是有一個相對複雜的管理器處理的，相關邏輯的進一步細節可在記憶體管理器的
KEP 中[示例1][1]和[跨 NUMA 節點][3]節找到。

為了分析 NUMA 組中可用的記憶體資源，必須對分組內 NUMA 節點對應的條目進行彙總。

<!--
For example, the total amount of free "conventional" memory in the group can be computed
by adding up the free memory available at every NUMA node in the group,
i.e., in the `"memory"` section of NUMA node `0` (`"free":0`) and NUMA node `1` (`"free":103739236352`).
So, the total amount of free "conventional" memory in this group is equal to `0 + 103739236352` bytes.
-->
例如，NUMA 分組中空閒的“常規”記憶體的總量可以透過將分組內所有 NUMA
節點上空閒記憶體加和來計算，即將 NUMA 節點 `0` 和 NUMA 節點 `1`  的 `"memory"` 節
（分別是 `"free":0` 和 `"free": 103739236352`）相加，得到此分組中空閒的“常規”
記憶體總量為 `0 + 103739236352` 位元組。

<!--
The line `"systemReserved":3221225472` indicates that the administrator of this node reserved
`3221225472` bytes (i.e. `3Gi`) to serve kubelet and system processes at NUMA node `0`,
by using `--reserved-memory` flag.
-->
`"systemReserved": 3221225472` 這一行表明節點的管理員使用 `--reserved-memory` 為 NUMA
節點 `0` 上執行的 kubelet 和系統程序預留了 `3221225472` 位元組 （即 `3Gi`）。

<!--
### Device plugin resource API

By employing the [API](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/),
the information about reserved memory for each container can be retrieved, which is contained
in protobuf `ContainerMemory` message.
This information can be retrieved solely for pods in Guaranteed QoS class.   
-->
### 裝置外掛資源 API     {#device-plugin-resource-api}

透過使用此 [API](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)，
可以獲得每個容器的預留記憶體資訊，該資訊位於 protobuf 協議的 `ContainerMemory` 訊息中。
只能針對 Guaranteed QoS 類中的 Pod 來檢索此資訊。

## {{% heading "whatsnext" %}}

<!--
以下均為英文設計文件，因此其標題不翻譯。
-->
- [Memory Manager KEP: Design Overview][4] 
- [Memory Manager KEP: Memory Maps at start-up (with examples)][5]
- [Memory Manager KEP: Memory Maps at runtime (with examples)][6]
- [Memory Manager KEP: Simulation - how the Memory Manager works? (by examples)][1]
- [Memory Manager KEP: The Concept of Node Map and Memory Maps][2]
- [Memory Manager KEP: How to enable the guaranteed memory allocation over many NUMA nodes?][3]

[1]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#simulation---how-the-memory-manager-works-by-examples
[2]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#the-concept-of-node-map-and-memory-maps
[3]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#how-to-enable-the-guaranteed-memory-allocation-over-many-numa-nodes
[4]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#design-overview
[5]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#memory-maps-at-start-up-with-examples
[6]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#memory-maps-at-runtime-with-examples
