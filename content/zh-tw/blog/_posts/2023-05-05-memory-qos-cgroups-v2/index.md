---
layout: blog
title: 'Kubernetes 1.27：內存資源的服務質量（QoS）Alpha'
date: 2023-05-05
slug: qos-memory-resources
---
<!--
layout: blog
title: 'Kubernetes 1.27: Quality-of-Service for Memory Resources (alpha)'
date: 2023-05-05
slug: qos-memory-resources
-->

<!--
**Authors:** Dixita Narang (Google)
-->
**作者**：Dixita Narang (Google)

**譯者**：Wilson Wu (DaoCloud)

<!--
Kubernetes v1.27, released in April 2023, introduced changes to Memory QoS (alpha) to improve memory management capabilites in Linux nodes.
-->
Kubernetes v1.27 於 2023 年 4 月發佈，引入了對內存 QoS（Alpha）的更改，用於提高 Linux 節點中的內存管理功能。

<!--
Support for Memory QoS was initially added in Kubernetes v1.22, and later some
[limitations](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2570-memory-qos#reasons-for-changing-the-formula-of-memoryhigh-calculation-in-alpha-v127)
around the formula for calculating `memory.high` were identified. These limitations are addressed in Kubernetes v1.27.
-->
對內存 QoS 的支持最初是在 Kubernetes v1.22 中添加的，後來發現了關於計算 `memory.high`
公式的一些[不足](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2570-memory-qos#reasons-for-changing-the-formula-of-memoryhigh-calculation-in-alpha-v127)。
這些不足在 Kubernetes v1.27 中得到解決。

<!--
## Background
-->
## 背景 {#background}

<!--
Kubernetes allows you to optionally specify how much of each resources a container needs
in the Pod specification. The most common resources to specify are CPU and Memory.
-->
Kubernetes 允許你在 Pod 規約中設置某容器對每類資源的需求。通常要設置的資源是 CPU 和內存。

<!--
For example, a Pod manifest that defines container resource requirements could look like:
-->
例如，定義容器資源需求的 Pod 清單可能如下所示：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example
spec:
  containers:
  - name: nginx
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "64Mi"
        cpu: "500m"
```

* `spec.containers[].resources.requests`

  <!--
  When you specify the resource request for containers in a Pod, the
  [Kubernetes scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)
  uses this information to decide which node to place the Pod on. The scheduler
  ensures that for each resource type, the sum of the resource requests of the
  scheduled containers is less than the total allocatable resources on the node.
  -->
  當你爲 Pod 中的容器設置資源請求時，
  [Kubernetes 調度器](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)使用此資訊來決定將 Pod 放置在哪個節點上。
  調度器確保對於每種資源類型，已調度容器的資源請求總和小於節點上可分配資源的總量。

* `spec.containers[].resources.limits`

  <!--
  When you specify the resource limit for containers in a Pod, the kubelet enforces
  those limits so that the running containers are not allowed to use more of those
  resources than the limits you set.
  -->
  當你爲 Pod 中的容器設置資源限制時，kubelet 會強制實施這些限制，
  以便運行的容器使用的資源不得超過你設置的限制。

<!--
When the kubelet starts a container as a part of a Pod, kubelet passes the
container's requests and limits for CPU and memory to the container runtime.
The container runtime assigns both CPU request and CPU limit to a container.
Provided the system has free CPU time, the containers are guaranteed to be
allocated as much CPU as they request. Containers cannot use more CPU than
the configured limit i.e. containers CPU usage will be throttled if they
use more CPU than the specified limit within a given time slice.
-->
當 kubelet 將容器作爲 Pod 的一部分啓動時，kubelet 會將容器的 CPU 和內存請求和限制傳遞給容器運行時。
容器運行時將 CPU 請求和 CPU 限制設置到容器上。如果系統有空閒的 CPU 時間，
就保證爲容器分配它們請求的 CPU 數量。容器使用的 CPU 數量不能超過設定的限制，
即，如果容器在給定時間片內使用的 CPU 數量超過指定的限制，則容器的 CPU 使用率將受到限制。

<!--
Prior to Memory QoS feature, the container runtime only used the memory limit
and discarded the memory `request` (requests were, and still are, also used to
influence [scheduling](/docs/concepts/scheduling-eviction/#scheduling)).
If a container uses more memory than the configured limit, the Linux Out Of Memory (OOM) killer will be invoked.
-->
在內存 QoS 特性出現之前，容器運行時僅使用內存限制並忽略內存的 `request`
（請求值從前到現在一直被用於影響[調度](/zh-cn/docs/concepts/scheduling-eviction/#scheduling)）。
如果容器使用的內存超過所設定的限制，則會調用 Linux 內存不足（OOM）殺手機制。

<!--
Let's compare how the container runtime on Linux typically configures memory request and limit in cgroups, with and without Memory QoS feature:
-->
讓我們比較一下在有和沒有內存 QoS 特性時，Linux 上的容器運行時通常如何在 cgroup 中設定內存請求和限制：

<!--
* **Memory request**
-->
* **內存請求**

  <!--
  The memory request is mainly used by kube-scheduler during (Kubernetes) Pod scheduling.
  In cgroups v1, there are no controls to specify the minimum amount of memory the cgroups
  must always retain. Hence, the container runtime did not use the value of requested memory set in the Pod spec.
  -->
  內存請求主要由 kube-scheduler 在（Kubernetes）Pod 調度時使用。
  在 cgroups v1 中，沒有任何控件來設置 cgroup 必須始終保留的最小內存量。
  因此，容器運行時不使用 Pod 規約中設置的內存請求值。

  <!--
  cgroups v2 introduced a `memory.min` setting, used to specify the minimum amount of memory
  that should remain available to the processes within a given cgroup.
  If the memory usage of a cgroup is within its effective min boundary,
  the cgroup’s memory won’t be reclaimed under any conditions.
  If the kernel cannot maintain at least `memory.min` bytes of memory for the processes within the cgroup,
  the kernel invokes its OOM killer. In other words, the kernel guarantees at least this
  much memory is available or terminates processes (which may be outside the cgroup)
  in order to make memory more available. Memory QoS maps `memory.min` to
  `spec.containers[].resources.requests.memory` to ensure the availability of memory for containers in Kubernetes Pods.
  -->
  cgroups v2 中引入了一個 `memory.min` 設置，用於設置給定 cgroup 中的進程確定可用的最小內存量。
  如果 cgroup 的內存使用量在其有效最小邊界內，則該 cgroup 的內存在任何情況下都不會被回收。
  如果內核無法爲 cgroup 中的進程維護至少 `memory.min` 字節的內存，內核將調用其 OOM 殺手機制。
  換句話說，內核保證至少有這麼多內存可用，或者終止進程（可能在 cgroup 之外）以騰出更多內存。
  MemoryQoS 機制將 `memory.min` 映射到 `spec.containers[].resources.requests.memory`，
  以確保 Kubernetes Pod 中容器的內存可用性。

<!--
* **Memory limit**
-->
* **內存限制**

  <!--
  The `memory.limit` specifies the memory limit, beyond which if the container
  tries to allocate more memory, Linux kernel will terminate a process with an
  OOM (Out of Memory) kill. If the terminated process was the main (or only)
  process inside the container, the container may exit.
  -->
  `memory.limit` 指定內存限制，如果容器嘗試分配更多內存，超出該限制，
  Linux 內核將通過 OOM（內存不足）來殺死並終止進程。如果終止的進程是容器內的主
  （或唯一）進程，則容器可能會退出。

  <!--
  In cgroups v1, `memory.limit_in_bytes` interface is used to set the memory usage limit.
  However, unlike CPU, it was not possible to apply memory throttling: as soon as a container
  crossed the memory limit, it would be OOM killed.
  -->
  在 cgroups v1 中，`memory.limit_in_bytes` 介面用於設置內存用量限制。
  然而，與 CPU 不同的是，內存用量是無法抑制的：一旦容器超過內存限制，它就會被 OOM 殺死。

  <!--
  In cgroups v2, `memory.max` is analogous to `memory.limit_in_bytes` in cgroupv1.
  Memory QoS maps `memory.max` to `spec.containers[].resources.limits.memory` to
  specify the hard limit for memory usage. If the memory consumption goes above
  this level, the kernel invokes its OOM Killer.
  -->
  在 cgroups v2 中，`memory.max` 類似於 cgroupv1 中的 `memory.limit_in_bytes`。
  MemoryQoS 機制將 `memory.max` 映射到 `spec.containers[].resources.limits.memory`
  以設置內存用量的硬性限制。如果內存消耗超過此水平，內核將調用其 OOM 殺手機制。

  <!--
  cgroups v2 also added `memory.high` configuration . Memory QoS uses `memory.high`
  to set memory usage throttle limit. If the `memory.high` limit is breached,
  the offending cgroups are throttled, and the kernel tries to reclaim memory which may avoid an OOM kill.
  -->
  cgroups v2 中還添加了 `memory.high` 設定。MemoryQoS 機制使用 `memory.high` 來設置內存用量抑制上限。
  如果超出了 `memory.high` 限制，則違規的 cgroup 會受到抑制，並且內核會嘗試回收內存，這可能會避免 OOM 終止。

<!--
## How it works
-->
## 如何工作 {#how-it-works}

<!--
### Cgroups v2 memory controller interfaces & Kubernetes container resources mapping
-->
### Cgroups v2 內存控制器介面和 Kubernetes 容器資源映 {#cgroups-v2-memory-controller-interfaces-kubernetes-container-resources-mapping}

<!--
Memory QoS uses the memory controller of cgroups v2 to guarantee memory resources
in Kubernetes. cgroupv2 interfaces that this feature uses are:
-->
MemoryQoS 機制使用 cgroups v2 的內存控制器來保證 Kubernetes 中的內存資源。
此特性使用的 cgroupv2 介面有：

* `memory.max`
* `memory.min`
* `memory.high`

<!--
{{< figure src="/blog/2023/05/05/qos-memory-resources/memory-qos-cal.svg" title="Memory QoS Levels" alt="Memory QoS Levels" >}}
-->
{{< figure src="/blog/2023/05/05/qos-memory-resources/memory-qos-cal.svg" title="內存 QoS 級別" alt="內存 QoS 級別" >}}

<!--
`memory.max` is mapped to `limits.memory` specified in the Pod spec.
The kubelet and the container runtime configure the limit in the respective cgroup.
The kernel enforces the limit to prevent the container from using more than the
configured resource limit. If a process in a container tries to consume more
than the specified limit, kernel terminates a process(es) with an out of memory Out of Memory (OOM) error.
-->
`memory.max` 映射到 Pod 規約中指定的 `limits.memory`。
kubelet 和容器運行時在對應的 cgroup 中設定限制值。內核強制執行限制機制以防止容器用量超過所設定的資源限制。
如果容器中的進程嘗試消耗的資源超過所設置的限制值，內核將終止進程並報告內存不足（OOM）錯誤。

<!--
{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-max.svg" title="memory.max maps to limits.memory" alt="memory.max maps to limits.memory" >}}
-->
{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-max.svg" title="memory.max 映射到 limit.memory" alt="memory.max 映射到 limit.memory" >}}

<!--
`memory.min` is mapped to `requests.memory`, which results in reservation of
memory resources that should never be reclaimed by the kernel.
This is how Memory QoS ensures the availability of memory for Kubernetes pods.
If there's no unprotected reclaimable memory available, the OOM killer is
invoked to make more memory available.
-->
`memory.min` 被映射到 `requests.memory`，這會導致內存資源被預留而永遠不會被內核回收。
這就是 MemoryQoS 機制確保 Kubernetes Pod 內存可用性的方式。
如果沒有不受保護的、可回收的內存，則內核會調用 OOM 殺手以提供更多可用內存。

<!--
{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-min.svg" title="memory.min maps to requests.memory" alt="memory.min maps to requests.memory" >}}
-->
{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-min.svg" title="memory.min 映射到 requests.memory" alt="memory.min 映射到 requests.memory" >}}

<!--
For memory protection, in addition to the original way of limiting memory usage,
Memory QoS throttles workload approaching its memory limit, ensuring that the system
is not overwhelmed by sporadic increases in memory usage. A new field, `memoryThrottlingFactor`,
is available in the KubeletConfiguration when you enable MemoryQoS feature. It is set to 0.9 by default.
`memory.high` is mapped to throttling limit calculated by using `memoryThrottlingFactor`,
`requests.memory` and `limits.memory` as in the formula below, and rounding down the value to the nearest page size:
-->
對於內存保護，除了原來的限制內存用量的方式之外，MemoryQoS 機制還會對用量接近其內存限制的工作負載進行抑制，
確保系統不會因內存使用的零星增加而不堪重負。當你啓用 MemoryQoS 特性時，
KubeletConfiguration 中將提供一個新字段 `memoryThrottlingFactor`。預設設置爲 0.9。
`memory.high` 被映射到通過 `memoryThrottlingFactor`、`requests.memory` 和 `limits.memory`
計算得出的抑制上限，計算方法如下式所示，所得的值向下舍入到最接近的頁面大小：

<!--
{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high.svg" title="memory.high formula" alt="memory.high formula" >}}
-->
{{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high.svg" title="memory.high 公式" alt="memory.high 公式" >}}

<!--
**Note**: If a container has no memory limits specified, `limits.memory` is substituted for node allocatable memory.
-->
**注意**：如果容器沒有指定內存限制，則 `limits.memory` 將被替換爲節點可分配內存的值。

<!--
**Summary:**
-->
**總結：**
<table>
    <tr>
        <!--
        <th style="text-align:center">File</th>
        <th style="text-align:center">Description</th>
        -->
        <th style="text-align:center">檔案</th>
        <th style="text-align:center">描述</th>
    </tr>
    <tr>
        <td>memory.max</td>
        <!-- <td><code>memory.max</code> specifies the maximum memory limit, a container
        is allowed to use. If a process within the container tries to consume more memory than the configured limit,
        the kernel terminates the process with an Out of Memory (OOM) error.
        <br>
        <br>
        <i>It is mapped to the container's memory limit specified in Pod manifest.</i>
        </td> -->
        <td><code>memory.max</code> 指定允許容器使用的最大內存限制。
        如果容器內的進程嘗試使用的內存量超過所設定的限制值，內核將終止該進程並顯示內存不足（OOM）錯誤。
        <br>
        <br>
        <i>此設定映射到 Pod 清單中指定的容器內存限制。</i>
        </td>
    </tr>
    <tr>
        <td>memory.min</td>
        <!--
        <td><code>memory.min</code> specifies a minimum amount of memory the cgroups must always retain, i.e.,
        memory that should never be reclaimed by the system. If there's no unprotected reclaimable memory available, OOM kill is invoked.
        <br>
        <br>
        <i>It is mapped to the container's memory request specified in the Pod manifest.</i>
        </td>
        -->
        <td><code>memory.min</code> 指定 cgroup 必須始終保留的最小內存量，
        即系統永遠不應回收的內存。如果沒有可用的未受保護的可回收內存，則會調用 OOM 終止程式。
        <br>
        <br>
        <i>此設定映射到 Pod 清單中指定的容器的內存請求。</i>
        </td>
   </tr>
   <tr>
       <td>memory.high</td>
       <!--
       <td><code>memory.high</code> specifies the memory usage throttle limit. This is the main
       mechanism to control a cgroup's memory use. If cgroups memory use goes over the high boundary
       specified here, the cgroups processes are throttled and put under heavy reclaim pressure.
       <br>
       <br>
       <i>Kubernetes uses a formula to calculate <code>memory.high</code>, depending on container's memory request,
        memory limit or node allocatable memory (if container's memory limit is empty) and a throttling factor.
        Please refer to the <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2570-memory-qos">KEP</a> for more details on the formula.</i>
       </td>
       -->
       <td><code>memory.high</code> 指定內存用量抑制上限。這是控制 cgroup 內存用量的主要機制。
       如果 cgroups 內存使用量超過此處指定的上限，則 cgroups 進程將受到抑制並標記回收壓力較大。
       <br>
       <br>
       <i>Kubernetes 使用公式來計算 <code>memory.high</code>，具體取決於容器的內存請求、
       內存限制或節點可分配內存（如果容器的內存限制爲空）和抑制因子。有關公式的更多詳細資訊，
       請參閱 <a href="https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2570-memory-qos">KEP</a>。</i>
       </td>
   </tr>
</table>

<!--
**Note** `memory.high` is set only on container level cgroups while `memory.min` is set on container, pod, and node level cgroups.
-->
**注意**：`memory.high` 僅可在容器級別的 cgroups 上設置，
而 `memory.min` 則可在容器、Pod 和節點級別的 cgroups 上設置。

<!--
### `memory.min` calculations for cgroups heirarchy
-->
### 針對 cgroup 層次結構的 `memory.min` 計算 {#memory-min-calculations-for-cgroups-heirarchy}

<!--
When container memory requests are made, kubelet passes `memory.min` to the back-end CRI
runtime (such as containerd or CRI-O) via the `Unified` field in CRI during container creation.
The `memory.min` in container level cgroups will be set to:
-->
當發出容器內存請求時，kubelet 在創建容器期間通過 CRI 中的 `Unified` 字段將 `memory.min`
傳遞給後端 CRI 運行時（例如 containerd 或 CRI-O）。容器級別 cgroup 中的 `memory.min` 將設置爲：

$memory.min =  pod.spec.containers[i].resources.requests[memory]$
<!--
<sub>for every i<sup>th</sup> container in a pod</sub>
-->
<sub>對於 Pod 中每個 i<sup>th</sup> 容器</sub>
<br>
<br>
<!--
Since the `memory.min` interface requires that the ancestor cgroups directories are all set,
the pod and node cgroups directories need to be set correctly. 
-->
由於 `memory.min` 介面要求祖先 cgroups 目錄全部被設置，
因此需要正確設置 Pod 和節點的 cgroups 目錄。

<!--
`memory.min` in pod level cgroup:
-->
Pod 級別 cgroup 中的 `memory.min`：

$memory.min = \sum_{i=0}^{no. of pods}pod.spec.containers[i].resources.requests[memory]$
<!--
<sub>for every i<sup>th</sup> container in a pod</sub>
-->
<sub>對於 Pod 中每個 i<sup>th</sup> 容器</sub>
<br>
<br>
<!--
`memory.min` in node level cgroup:
-->
節點級別 cgroup 中的 `memory.min`：

$memory.min = \sum_{i}^{no. of nodes}\sum_{j}^{no. of pods}pod[i].spec.containers[j].resources.requests[memory]$
<!--
<sub>for every j<sup>th</sup> container in every i<sup>th</sup> pod on a node</sub>
-->
<sub>對於節點中每個 i<sup>th</sup> Pod 中的每個 j<sup>th</sup> 容器</sub>
<br>
<br>
<!--
Kubelet will manage the cgroups hierarchy of the pod level and node level cgroups directly
using the libcontainer library (from the runc project), while container cgroups limits are managed by the container runtime.
-->
Kubelet 將直接使用 libcontainer 庫（來自 runc 項目）管理 Pod 級別和節點級別
cgroups 的層次結構，而容器 cgroups 限制由容器運行時管理。

<!--
### Support for Pod QoS classes
-->
### 支持 Pod QoS 類別 {#support-for-pod-qos-classes}

<!--
Based on user feedback for the Alpha feature in Kubernetes v1.22, some users would like
to opt out of MemoryQoS on a per-pod basis to ensure there is no early memory throttling.
Therefore, in Kubernetes v1.27 Memory QOS also supports memory.high to be set as per
Quality of Service(QoS) for Pod classes. Following are the different cases for memory.high as per QOS classes:
-->
根據使用者對 Kubernetes v1.22 中 Alpha 特性的反饋，一些使用者希望在 Pod 層面選擇不啓用 MemoryQoS，
以確保不會出現早期內存抑制現象。因此，在 Kubernetes v1.27 中 MemoryQoS 還支持根據
服務質量（QoS）對 Pod 類設置 memory.high。以下是按 QoS 類設置 memory.high 的幾種情況：

<!--
1. **Guaranteed pods** by their QoS definition require memory requests=memory limits and are
   not overcommitted. Hence MemoryQoS feature is disabled on those pods by not setting
   memory.high. This ensures that Guaranteed pods can fully use their memory requests up
   to their set limit, and not hit any throttling.
-->
1. **Guaranteed Pods**：根據其 QoS 定義，要求 Pod 的內存請求等於其內存限制，並且不允許超配。
   因此，通過不設置 memory.high，MemoryQoS 特性會針對這些 Pod 被禁用。
   這樣做可以確保 **Guaranteed Pod** 充分利用其內存請求，也就是其內存限制，並且不會被抑制。

<!--
2. **Burstable pods** by their QoS definition require at least one container in the Pod with
   CPU or memory request or limit set.
-->
2. **Burstable Pod**：根據其 QoS 定義，要求 Pod 中至少有一個容器具有 CPU 或內存請求或限制設置。

   <!--
   * When requests.memory and limits.memory are set, the formula is used as-is:
   -->
   * 當 requests.memory 和 limits.memory 都被設置時，公式按原樣使用：

     <!--
     {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-limit.svg" title="memory.high when requests and limits are set" alt="memory.high when requests and limits are set" >}}
     -->
     {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-limit.svg" title="當請求和限制被設置時的 memory.high" alt="當請求和限制被設置時的 memory.high" >}}

   <!--
   * When requests.memory is set and limits.memory is not set, limits.memory is substituted for node allocatable memory in the formula:
   -->
   * 當設置了 requests.memory 但未設置 limits.memory 時，公式中的 limits.memory 替換爲節點可分配內存：

     <!--
     {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-no-limits.svg" title="memory.high when requests and limits are not set" alt="memory.high when requests and limits are not set" >}}
     -->
     {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-no-limits.svg" title="當請求和限制未被設置時的 memory.high" alt="當請求和限制未被設置時的 memory.high" >}}

<!--
3. **BestEffort** by their QoS definition do not require any memory or CPU limits or requests.
   For this case, kubernetes sets requests.memory = 0 and substitute limits.memory for node allocatable
   memory in the formula:
-->
3. **BestEffort Pod**：根據其 QoS 定義，不需要設置內存或 CPU 限制或請求。對於這種情況，
   kubernetes 設置 requests.memory = 0 並將公式中的 limits.memory 替換爲節點可分配內存：

   <!--
   {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-best-effort.svg" title="memory.high for BestEffort Pod" alt="memory.high for BestEffort Pod" >}}
   -->
   {{< figure src="/blog/2023/05/05/qos-memory-resources/container-memory-high-best-effort.svg" title="BestEffort Pod 的 memory.high" alt="BestEffort Pod 的 memory.high" >}}

<!--
**Summary**: Only Pods in Burstable and BestEffort QoS classes will set `memory.high`. Guaranteed QoS pods do not set `memory.high` as their memory is guaranteed.
-->
**總結**：只有 Burstable 和 BestEffort QoS 類別中的 Pod 纔會設置 `memory.high`。
Guaranteed QoS 的 Pod 不會設置 `memory.high`，因爲它們的內存是有保證的。

<!--
## How do I use it?
-->
## 我該如何使用它？ {#how-do-i-use-it}

<!--
The prerequisites for enabling Memory QoS feature on your Linux node are:
-->
在 Linux 節點上啓用 MemoryQoS 特性的先決條件是：

<!--
1. Verify the [requirements](/docs/concepts/architecture/cgroups/#requirements)
   related to [Kubernetes support for cgroups v2](/docs/concepts/architecture/cgroups)
   are met.
2. Ensure CRI Runtime supports Memory QoS. At the time of writing, only containerd
   and CRI-O provide support compatible with Memory QoS (alpha). This was implemented in the following PRs:
   * Containerd: [Feature: containerd-cri support LinuxContainerResources.Unified #5627](https://github.com/containerd/containerd/pull/5627).
   * CRI-O: [implement kube alpha features for 1.22 #5207](https://github.com/cri-o/cri-o/pull/5207).
-->
1. 驗證是否滿足
   [Kubernetes 對 cgroup v2 支持](/zh-cn/docs/concepts/architecture/cgroups)的相關[要求](/zh-cn/docs/concepts/architecture/cgroups/#requirements)。

2. 確保 CRI 運行時支持內存 QoS。在撰寫本文時，
   只有 Containerd 和 CRI-O 提供與內存 QoS（alpha）兼容的支持。是在以下 PR 中實現的：
    * Containerd：[Feature: containerd-cri support LinuxContainerResources.Unified #5627](https://github.com/containerd/containerd/pull/5627)。
    * CRI-O：[implement kube alpha features for 1.22 #5207](https://github.com/cri-o/cri-o/pull/5207)。

<!--
Memory QoS remains an alpha feature for Kubernetes v1.27. You can enable the feature by setting `MemoryQoS=true` in the kubelet configuration file:
-->
MemoryQoS 在 Kubernetes v1.27 中仍然是 Alpha 特性。
你可以通過在 kubelet 設定檔案中設置 `MemoryQoS=true` 來啓用該特性：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: true
```

<!--
## How do I get involved?
-->
## 我如何參與？ {#how-do-i-get-involved}

<!--
Huge thank you to all the contributors who helped with the design, implementation, and review of this feature:
-->
非常感謝所有幫助設計、實施和審查此功能的貢獻者：

* Dixita Narang ([ndixita](https://github.com/ndixita))
* Tim Xu ([xiaoxubeii](https://github.com/xiaoxubeii))
* Paco Xu ([pacoxu](https://github.com/pacoxu))
* David Porter([bobbypage](https://github.com/bobbypage))
* Mrunal Patel([mrunalp](https://github.com/mrunalp))

<!--
For those interested in getting involved in future discussions on Memory QoS feature,
you can reach out SIG Node by several means:
-->
對於那些有興趣參與未來內存 QoS 特性討論的人，你可以通過多種方式聯繫 SIG Node：

<!--
- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [Open Community Issues/PRs](https://github.com/kubernetes/community/labels/sig%2Fnode)
-->
- Slack：[#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [郵件列表](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [開放社區 Issue/PR](https://github.com/kubernetes/community/labels/sig%2Fnode)
