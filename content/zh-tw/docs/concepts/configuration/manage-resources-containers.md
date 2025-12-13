---
title: 爲 Pod 和容器管理資源
content_type: concept
weight: 40
feature:
  title: 自動裝箱
  description: >
    根據資源需求和其他限制自動放置容器，同時避免影響可用性。
    將關鍵性的和盡力而爲性質的工作負載進行混合放置，以提高資源利用率並節省更多資源。
---
<!--
title: Resource Management for Pods and Containers
content_type: concept
weight: 40
feature:
  title: Automatic bin packing
  description: >
    Automatically places containers based on their resource requirements and other constraints, while not sacrificing availability.
    Mix critical and best-effort workloads in order to drive up utilization and save even more resources.
-->

<!-- overview -->

<!--
When you specify a {{< glossary_tooltip term_id="pod" >}}, you can optionally specify how much of each resource a 
{{< glossary_tooltip text="container" term_id="container" >}} needs. The most common resources to specify are CPU and memory 
(RAM); there are others.

When you specify the resource _request_ for containers in a Pod, the
{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} uses this information to decide which node to place the Pod on. 
When you specify a resource _limit_ for a container, the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} enforces those 
limits so that the running container is not allowed to use more of that resource 
than the limit you set. The kubelet also reserves at least the _request_ amount of 
that system resource specifically for that container to use.
-->
當你定義 {{< glossary_tooltip text="Pod" term_id="pod" >}}
時可以選擇性地爲每個{{< glossary_tooltip text="容器" term_id="container" >}}設定所需要的資源數量。
最常見的可設定資源是 CPU 和內存（RAM）大小；此外還有其他類型的資源。

當你爲 Pod 中的 Container 指定了資源 **requests（請求）** 時，
{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
會利用該資訊決定將 Pod 調度到哪個節點上。
當你爲 Container 指定了資源 **limits（限制）** 時，{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
可以確保運行的容器不會使用超出所設限制的資源。
kubelet 還會爲容器預留 **requests（請求）** 所指定數量的系統資源，供其使用。

<!-- body -->

<!--
## Requests and limits

If the node where a Pod is running has enough of a resource available, it's possible (and
allowed) for a container to use more resource than its `request` for that resource specifies.

For example, if you set a `memory` request of 256 MiB for a container, and that container is in
a Pod scheduled to a Node with 8GiB of memory and no other Pods, then the container can try to use
more RAM.
-->
## 請求和限制  {#requests-and-limits}

如果 Pod 運行所在的節點具有足夠的可用資源，容器可能（且可以）使用超出對應資源
`requests` 屬性所設置的資源量。

例如，如果你將容器的 `memory` 的請求量設置爲 256 MiB，而該容器所處的 Pod
被調度到一個具有 8 GiB 內存的節點上，並且該節點上沒有其他 Pod 運行，
那麼該容器就可以嘗試使用更多的內存。

<!--
Limits are a different story. Both `cpu` and `memory` limits are applied by the kubelet (and
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}),
and are ultimately enforced by the kernel. On Linux nodes, the Linux kernel
enforces limits with
{{< glossary_tooltip text="cgroups" term_id="cgroup" >}}.
The behavior of `cpu` and `memory` limit enforcement is slightly different.
-->
限制是另一個話題。`cpu` 限制和 `memory` 限制都由 kubelet
（以及 {{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}）來實施，
最終由內核強制執行。在 Linux 節點上，Linux 內核通過
{{< glossary_tooltip text="CGroup" term_id="cgroup" >}} 來強制執行限制。
`cpu` 限制和 `memory` 限制的執行行爲略有不同。

<!--
`cpu` limits are enforced by CPU throttling. When a container approaches
its `cpu` limit, the kernel will restrict access to the CPU corresponding to the
container's limit. Thus, a `cpu` limit is a hard limit the kernel enforces.
Containers may not use more CPU than is specified in their `cpu` limit.
-->
`cpu` 限制通過 CPU 節流機制（CPU Throttling）來強制執行。
當某容器接近其 `cpu` 限制值時，內核會基於容器的限制值來限制其對 CPU 的訪問。
因此，`cpu` 限制是內核強制執行的一個硬性限制。容器不得使用超出其 `cpu` 限制所指定的 CPU 核數。

<!--
`memory` limits are enforced by the kernel with out of memory (OOM) kills. When
a container uses more than its `memory` limit, the kernel may terminate it. However,
terminations only happen when the kernel detects memory pressure. Thus, a
container that over allocates memory may not be immediately killed. This means
`memory` limits are enforced reactively. A container may use more memory than
its `memory` limit, but if it does, it may get killed.
-->
`memory` 限制由內核使用 OOM（內存不足）殺死機制來強制執行。
當某容器使用的內存超過其 `memory` 限制時，內核可以終止此容器。
然而，終止操作只會在內核檢測到內存壓力時纔會發生。
因此，內存分配過量的容器可能不會被立即終止。
這意味着 `memory` 限制是被動執行的。
某容器可以使用超過其 `memory` 限制的內存，但如果這樣做了，它可能會被終止。

{{< note >}}
<!--
There is an alpha feature `MemoryQoS` which attempts to add more preemptive
limit enforcement for memory (as opposed to reactive enforcement by the OOM
killer). However, this effort is
[stalled](https://github.com/kubernetes/enhancements/tree/a47155b340/keps/sig-node/2570-memory-qos#latest-update-stalled)
due to a potential livelock situation a memory hungry can cause.
-->
你可以使用一個 Alpha 特性 `MemoryQoS` 來嘗試爲內存添加執行更多的搶佔限制
（這與 OOM Killer 的被動執行相反）。然而，由於可能會因內存飢餓造成活鎖情形，
所以這一特性現在處於[停滯狀態](https://github.com/kubernetes/enhancements/tree/a47155b340/keps/sig-node/2570-memory-qos#latest-update-stalled)。
{{< /note >}}

{{< note >}}
<!--
If you specify a limit for a resource, but do not specify any request, and no admission-time
mechanism has applied a default request for that resource, then Kubernetes copies the limit
you specified and uses it as the requested value for the resource.
-->
如果你爲某個資源指定了限制值，但不指定請求值，
並且沒有應用某種准入時機制爲該資源設置預設請求值，
那麼 Kubernetes 會複製你所指定的限制值，將其用作資源的請求值。
{{< /note >}}

<!--
## Resource types

*CPU* and *memory* are each a *resource type*. A resource type has a base unit.
CPU represents compute processing and is specified in units of [Kubernetes CPUs](#meaning-of-cpu).
Memory is specified in units of bytes.
For Linux workloads, you can specify _huge page_ resources.
Huge pages are a Linux-specific feature where the node kernel allocates blocks of memory
that are much larger than the default page size.

For example, on a system where the default page size is 4KiB, you could specify a limit,
`hugepages-2Mi: 80Mi`. If the container tries allocating over 40 2MiB huge pages (a
total of 80 MiB), that allocation fails.
-->
## 資源類型  {#resource-types}

**CPU** 和**內存**都是**資源類型**。每種資源類型具有其基本單位。
CPU 表達的是計算處理能力，其單位是 [Kubernetes CPU](#meaning-of-cpu)。
內存的單位是字節。
對於 Linux 負載，你可以設置巨頁（Huge Page）資源。
巨頁是 Linux 特有的功能，節點內核在其中分配的內存塊比預設頁大小大得多。

例如，在預設頁面大小爲 4KiB 的系統上，你可以指定限制 `hugepages-2Mi: 80Mi`。
如果容器嘗試分配 40 個 2MiB 大小的巨頁（總共 80 MiB ），則分配請求會失敗。

{{< note >}}
<!--
You cannot overcommit `hugepages-*` resources.
This is different from the `memory` and `cpu` resources.
-->
你不能過量使用 `hugepages- *` 資源。
這與 `memory` 和 `cpu` 資源不同。
{{< /note >}}

<!--
CPU and memory are collectively referred to as *compute resources*, or *resources*. Compute
resources are measurable quantities that can be requested, allocated, and
consumed. They are distinct from
[API resources](/docs/concepts/overview/kubernetes-api/). API resources, such as Pods and
[Services](/docs/concepts/services-networking/service/) are objects that can be read and modified
through the Kubernetes API server.
-->
CPU 和內存統稱爲**計算資源**，或簡稱爲**資源**。
計算資源的數量是可測量的，可以被請求、被分配、被消耗。
它們與 [API 資源](/zh-cn/docs/concepts/overview/kubernetes-api/)不同。
API 資源（如 Pod 和 [Service](/zh-cn/docs/concepts/services-networking/service/)）是可通過
Kubernetes API 伺服器讀取和修改的對象。

<!--
## Resource requests and limits of Pod and container

For each container, you can specify resource limits and requests,
including the following:
-->
## Pod 和容器的資源請求和限制  {#resource-requests-and-limits-of-pod-and-container}

針對每個容器，你都可以指定其資源限制和請求，包括如下選項：

* `spec.containers[].resources.limits.cpu`
* `spec.containers[].resources.limits.memory`
* `spec.containers[].resources.limits.hugepages-<size>`
* `spec.containers[].resources.requests.cpu`
* `spec.containers[].resources.requests.memory`
* `spec.containers[].resources.requests.hugepages-<size>`

<!--
Although you can only specify requests and limits for individual containers,
it is also useful to think about the overall resource requests and limits for
a Pod.
For a particular resource, a *Pod resource request/limit* is the sum of the
resource requests/limits of that type for each container in the Pod.
-->
儘管你只能逐個容器地指定請求和限制值，但考慮 Pod 的總體資源請求和限制也是有用的。
對特定資源而言，**Pod 的資源請求/限制值**是 Pod 中各容器對該類型資源的請求/限制值的總和。

<!--
## Pod-level resource specification
-->
## Pod 級資源規約

{{< feature-state feature_gate_name="PodLevelResources" >}}

<!--
Provided your cluster has the `PodLevelResources`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled,
you can specify resource requests and limits at
the Pod level. At Pod level, Kubernetes {{< skew currentVersion >}}
only supports resource requests or limits for specific resource types: `cpu` and /
or `memory` and / or `hugepages`. With this feature, Kubernetes allows you to declare an overall resource
budget for the Pod, which is especially helpful when dealing with a large number of
containers where it can be difficult to accurately gauge individual resource needs.
Additionally, it enables containers within a Pod to share idle resources with each
other, improving resource utilization.
-->
如果你的叢集啓用了 `PodLevelResources`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
你可以在 Pod 級別指定資源請求和限制值。
在 Pod 級別，Kubernetes {{< skew currentVersion >}} 僅支持爲特定資源類型設置資源請求或限制值，
具體包括 `cpu` 和/或 `memory` 和/或 `hugepages`。
啓用此特性時，Kubernetes 允許你爲 Pod 聲明一個資源總預算，
這在處理大量容器時特別有用，因爲在這種情況下很難準確評估各個容器的資源需求。
此外，這一特性還允許 Pod 內的容器之間共享空閒資源，從而提高資源利用率。

<!--
For a Pod, you can specify resource limits and requests for CPU and memory by including the following:
-->
對於一個 Pod，你可以通過包含以下內容來指定 CPU 和內存的資源限制和請求：

* `spec.resources.limits.cpu`
* `spec.resources.limits.memory`
* `spec.resources.limits.hugepages-<size>`
* `spec.resources.requests.cpu`
* `spec.resources.requests.memory`
* `spec.resources.requests.hugepages-<size>`

<!--
## Resource units in Kubernetes

### CPU resource units {#meaning-of-cpu}

Limits and requests for CPU resources are measured in *cpu* units.
In Kubernetes, 1 CPU unit is equivalent to **1 physical CPU core**,
or **1 virtual core**, depending on whether the node is a physical host
or a virtual machine running inside a physical machine.
-->
## Kubernetes 中的資源單位  {#resource-units-in-kubernetes}

### CPU 資源單位    {#meaning-of-cpu}

CPU 資源的限制和請求以 **cpu** 爲單位。
在 Kubernetes 中，一個 CPU 等於 **1 個物理 CPU 核**或者 **1 個虛擬核**，
取決於節點是一臺物理主機還是運行在某物理主機上的虛擬機。

<!--
Fractional requests are allowed. When you define a container with
`spec.containers[].resources.requests.cpu` set to `0.5`, you are requesting half
as much CPU time compared to if you asked for `1.0` CPU.
For CPU resource units, the [quantity](/docs/reference/kubernetes-api/common-definitions/quantity/) expression `0.1` is equivalent to the
expression `100m`, which can be read as "one hundred millicpu". Some people say
"one hundred millicores", and this is understood to mean the same thing.
-->
你也可以表達帶小數 CPU 的請求。
當你定義一個容器，將其 `spec.containers[].resources.requests.cpu` 設置爲 `0.5` 時，
你所請求的 CPU 是你請求 `1.0` CPU 時的一半。對於 CPU 資源單位，
[數量](/zh-cn/docs/reference/kubernetes-api/common-definitions/quantity/)表達式 `0.1`
等價於表達式 `100m`，可以看作 “100 millicpu”。
有些人說成是“一百毫核”，其實說的是同樣的事情。

<!--
CPU resource is always specified as an absolute amount of resource, never as a relative amount. For example,
`500m` CPU represents the roughly same amount of computing power whether that container
runs on a single-core, dual-core, or 48-core machine.
-->
CPU 資源總是設置爲資源的絕對數量而非相對數量值。
例如，無論容器運行在單核、雙核或者 48 核的機器上，`500m` CPU 表示的是大約相同的算力。

{{< note >}}
<!--
Kubernetes doesn't allow you to specify CPU resources with a precision finer than
`1m` or `0.001` CPU. To avoid accidentally using an invalid CPU quantity, it's useful to specify CPU units using the milliCPU form 
instead of the decimal form when using less than 1 CPU unit. 

For example, you have a Pod that uses `5m` or `0.005` CPU and would like to decrease
its CPU resources. By using the decimal form, it's harder to spot that `0.0005` CPU
is an invalid value, while by using the milliCPU form, it's easier to spot that
`0.5m` is an invalid value.
-->
Kubernetes 不允許設置精度小於 `1m` 或 `0.001` 的 CPU 資源。
爲了避免意外使用無效的 CPU 數量，當使用少於 1 個 CPU 單元時，使用
milliCPU 形式而不是十進制形式指定 CPU 單元非常有用。

例如，你有一個使用 `5m` 或 `0.005` 核 CPU 的 Pod，並且希望減少其 CPU 資源。
通過使用十進制形式，更難發現 `0.0005` CPU 是無效值，而通過使用 milliCPU 形式，
更容易發現 `0.5m` 是無效值。
{{< /note >}}

<!--
### Memory resource units {#meaning-of-memory}

Limits and requests for `memory` are measured in bytes. You can express memory as
a plain integer or as a fixed-point number using one of these
[quantity](/docs/reference/kubernetes-api/common-definitions/quantity/) suffixes:
E, P, T, G, M, k. You can also use the power-of-two equivalents: Ei, Pi, Ti, Gi,
Mi, Ki. For example, the following represent roughly the same value:
-->
## 內存資源單位      {#meaning-of-memory}

`memory` 的限制和請求以字節爲單位。你可以使用普通的整數，
或者帶有以下[數量](/zh-cn/docs/reference/kubernetes-api/common-definitions/quantity/)後綴的定點數字來表示內存：
E、P、T、G、M、k。你也可以使用對應的 2 的冪數：Ei、Pi、Ti、Gi、Mi、Ki。
例如，以下表達式所代表的是大致相同的值：

```shell
128974848、129e6、129M、128974848000m、123Mi
```

<!--
Pay attention to the case of the suffixes. If you request `400m` of memory, this is a request
for 0.4 bytes. Someone who types that probably meant to ask for 400 mebibytes (`400Mi`)
or 400 megabytes (`400M`).
-->
請注意後綴的大小寫。如果你請求 `400m` 臨時儲存，實際上所請求的是 0.4 字節。
如果有人這樣設定資源請求或限制，可能他的實際想法是申請 400Mi 字節（`400Mi`）
或者 400M 字節。

<!--
## Container resources example {#example-1}

The following Pod has two containers. Both containers are defined with a request for
0.25 CPU
and 64MiB (2<sup>26</sup> bytes) of memory. Each container has a limit of 0.5
CPU and 128MiB of memory. You can say the Pod has a request of 0.5 CPU and 128
MiB of memory, and a limit of 1 CPU and 256MiB of memory.
-->
## 容器資源示例     {#example-1}

以下 Pod 有兩個容器。每個容器的請求爲 0.25 CPU 和 64MiB（2<sup>26</sup> 字節）內存，
每個容器的資源限制爲 0.5 CPU 和 128MiB 內存。
你可以認爲該 Pod 的資源請求爲 0.5 CPU 和 128 MiB 內存，資源限制爲 1 CPU 和 256MiB 內存。

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

<!--
## Pod resources example {#example-2}
-->
## Pod 資源示例 {#example-2}

{{< feature-state feature_gate_name="PodLevelResources" >}}

<!--
This feature can be enabled by setting the `PodLevelResources` 
[feature gate](/docs/reference/command-line-tools-reference/feature-gates).
The following Pod has an explicit request of 1 CPU and 100 MiB of memory, and an
explicit limit of 1 CPU and 200 MiB of memory. The `pod-resources-demo-ctr-1`
container has explicit requests and limits set. However, the
`pod-resources-demo-ctr-2` container will simply share the resources available
within the Pod resource boundaries, as it does not have explicit requests and limits
set.
-->
此特性可以通過設置 `PodLevelResources`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates)來啓用。
以下 Pod 明確請求了 1 個 CPU 和 100 MiB 的內存，並設置了明確的限制值爲 1 個 CPU 和 200 MiB 的內存。
`pod-resources-demo-ctr-1` 容器設置了明確的資源請求和限制值。不過 `pod-resources-demo-ctr-2`
容器沒有設置明確的資源請求和限制，因此它將共享 Pod 資源邊界內的可用資源。

{{% code_sample file="pods/resource/pod-level-resources.yaml" %}}

<!--
## How Pods with resource requests are scheduled

When you create a Pod, the Kubernetes scheduler selects a node for the Pod to
run on. Each node has a maximum capacity for each of the resource types: the
amount of CPU and memory it can provide for Pods. The scheduler ensures that,
for each resource type, the sum of the resource requests of the scheduled
containers is less than the capacity of the node.
Note that although actual memory
or CPU resource usage on nodes is very low, the scheduler still refuses to place
a Pod on a node if the capacity check fails. This protects against a resource
shortage on a node when resource usage later increases, for example, during a
daily peak in request rate.
-->
## 帶資源請求的 Pod 如何調度  {#how-pods-with-resource-limits-are-run}

當你創建一個 Pod 時，Kubernetes 調度程式將爲 Pod 選擇一個節點。
每個節點對每種資源類型都有一個容量上限：可爲 Pod 提供的 CPU 和內存量。
調度程式確保對於每種資源類型，所調度的容器的資源請求的總和小於節點的容量。
請注意，儘管節點上的實際內存或 CPU 資源使用量非常低，如果容量檢查失敗，
調度程式仍會拒絕將 Pod 放置在該節點上。
當稍後節點上資源用量增加，例如到達請求率的每日峯值區間時，節點上也不會出現資源不足的問題。

<!--
## How Kubernetes applies resource requests and limits {#how-pods-with-resource-limits-are-run}

When the kubelet starts a container as part of a Pod, the kubelet passes that container's
requests and limits for memory and CPU to the container runtime.

On Linux, the container runtime typically configures
kernel {{< glossary_tooltip text="cgroups" term_id="cgroup" >}} that apply and enforce the
limits you defined.
-->
## Kubernetes 處理資源請求與限制的方式 {#how-pods-with-resource-limits-are-run}

當 kubelet 將容器作爲 Pod 的一部分啓動時，它會將容器的 CPU 和內存請求與限制值資訊傳遞給容器運行時。

在 Linux 系統上，容器運行時通常會設定內核
{{< glossary_tooltip text="CGroup" term_id="cgroup" >}}，負責應用並實施所定義的請求。

<!--
- The CPU limit defines a hard ceiling on how much CPU time the container can use.
  During each scheduling interval (time slice), the Linux kernel checks to see if this
  limit is exceeded; if so, the kernel waits before allowing that cgroup to resume execution.
-->
- CPU 限制定義的是容器可使用的 CPU 時間的硬性上限。
  在每個調度週期（時間片）期間，Linux 內核檢查是否已經超出該限制；
  內核在允許該 CGroup 恢復執行之前會等待。
<!--
- The CPU request typically defines a weighting. If several different containers (cgroups)
  want to run on a contended system, workloads with larger CPU requests are allocated more
  CPU time than workloads with small requests.
-->
- CPU 請求值定義的是一個權重值。如果若干不同的容器（CGroup）需要在一個共享的系統上競爭運行，
  CPU 請求值大的負載會獲得比請求值小的負載更多的 CPU 時間。
<!--
- The memory request is mainly used during (Kubernetes) Pod scheduling. On a node that uses
  cgroups v2, the container runtime might use the memory request as a hint to set
  `memory.min` and `memory.low`.
-->
- 內存請求值主要用於（Kubernetes）Pod 調度期間。在一個啓用了 CGroup v2 的節點上，
  容器運行時可能會使用內存請求值作爲設置 `memory.min` 和 `memory.low` 的提示值。
<!--
- The memory limit defines a memory limit for that cgroup. If the container tries to
  allocate more memory than this limit, the Linux kernel out-of-memory subsystem activates
  and, typically, intervenes by stopping one of the processes in the container that tried
  to allocate memory. If that process is the container's PID 1, and the container is marked
  as restartable, Kubernetes restarts the container.
-->
- 內存限制定義的是 CGroup 的內存限制。如果容器嘗試分配的內存量超出限制，
  則 Linux 內核的 out-of-memory （內存不足）子系統會被激活，並停止嘗試分配內存的容器中的某個進程。
  如果該進程在容器中 PID 爲 1，而容器被標記爲可重新啓動，則 Kubernetes
  會重新啓動該容器。
<!--
- The memory limit for the Pod or container can also apply to pages in memory backed
  volumes, such as an `emptyDir`. The kubelet tracks `tmpfs` emptyDir volumes as container
  memory use, rather than as local ephemeral storage.　When using memory backed `emptyDir`,
  be sure to check the notes [below](#memory-backed-emptydir).
-->
- Pod 或容器的內存限制也適用於以內存爲介質的卷，例如 `emptyDir` 卷。
  kubelet 會跟蹤 `tmpfs` 形式的 emptyDir 卷用量，將其作爲容器的內存用量，
  而不是臨時儲存用量。當使用內存作爲介質的 `emptyDir` 時，
  請務必查看[下面](#memory-backed-emptydir)的注意事項。

<!--
If a container exceeds its memory request and the node that it runs on becomes short of
memory overall, it is likely that the Pod the container belongs to will be
{{< glossary_tooltip text="evicted" term_id="eviction" >}}.

A container might or might not be allowed to exceed its CPU limit for extended periods of time.
However, container runtimes don't terminate Pods or containers for excessive CPU usage.

To determine whether a container cannot be scheduled or is being killed due to resource limits,
see the [Troubleshooting](#troubleshooting) section.
-->
如果某容器內存用量超過其內存請求值並且所在節點內存不足時，容器所處的 Pod
可能被{{< glossary_tooltip text="逐出" term_id="eviction" >}}。

每個容器可能被允許也可能不被允許使用超過其 CPU 限制值的處理時間。
但是，容器運行時不會由於 CPU 使用率過高而殺死 Pod 或容器。

要確定某容器是否會由於資源限制而無法調度或被殺死，請參閱[問題診斷](#troubleshooting)節。
<!--
### Monitoring compute & memory resource usage

The kubelet reports the resource usage of a Pod as part of the Pod
[`status`](/docs/concepts/overview/working-with-objects/#object-spec-and-status).

If optional [tools for monitoring](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
are available in your cluster, then Pod resource usage can be retrieved either
from the [Metrics API](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-api)
directly or from your monitoring tools.
-->
### 監控計算和內存資源用量  {#monitoring-compute-memory-resource-usage}

kubelet 會將 Pod 的資源使用情況作爲 Pod
[`status`](/zh-cn/docs/concepts/overview/working-with-objects/#object-spec-and-status)
的一部分來報告的。

如果爲叢集設定了可選的[監控工具](/zh-cn/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)，
則可以直接從[指標 API](/zh-cn/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-api)
或者監控工具獲得 Pod 的資源使用情況。

<!--
### Considerations for memory backed `emptyDir` volumes {#memory-backed-emptydir}
-->
### 使用內存作爲介質的 `emptyDir` 卷的注意事項 {#memory-backed-emptydir}

{{< caution >}}
<!--
If you do not specify a `sizeLimit` for an `emptyDir` volume, that volume may
consume up to that pod's memory limit (`Pod.spec.containers[].resources.limits.memory`).
If you do not set a memory limit, the pod has no upper bound on memory consumption,
and can consume all available memory on the node. Kubernetes schedules pods based
on resource requests (`Pod.spec.containers[].resources.requests`) and will not
consider memory usage above the request when deciding if another pod can fit on
a given node. This can result in a denial of service and cause the OS to do
out-of-memory (OOM) handling. It is possible to create any number of `emptyDir`s
that could potentially consume all available memory on the node, making OOM
more likely.
-->
如果你沒有爲 `emptyDir` 卷指定 `sizeLimit`，該卷就會消耗 Pod 的內存，
卷的用量上限爲 Pod 的內存限制（`Pod.spec.containers[].resources.limits.memory`）。
如果你沒有設置內存限制，Pod 的內存消耗將沒有上限，並且可能會用掉節點上的所有可用內存。
Kubernetes 基於資源請求（`Pod.spec.containers[].resources.requests`）調度 Pod，
並且在決定另一個 Pod 是否適合調度到某個給定的節點上時，不會考慮超出請求的內存用量。
這可能導致拒絕服務，並使得操作系統需要處理內存不足（OOM）的情況。
使用者可以創建任意數量的 `emptyDir`，可能會消耗節點上的所有可用內存，使得 OOM 更有可能發生。
{{< /caution >}}

<!--
From the perspective of memory management, there are some similarities between
when a process uses memory as a work area and when using memory-backed
`emptyDir`. But when using memory as a volume, like memory-backed `emptyDir`,
there are additional points below that you should be careful of:
-->
從內存管理的角度來看，進程使用內存作爲工作區與使用內存作爲 `emptyDir` 的介質有一些相似之處。
但當將內存用作儲存卷（例如內存爲介質的 `emptyDir` 卷）時，你需要額外注意以下幾點：

<!--
* Files stored on a memory-backed volume are almost entirely managed by the
  user application. Unlike when used as a work area for a process, you can not
  rely on things like language-level garbage collection.
* The purpose of writing files to a volume is to save data or pass it between
  applications. Neither Kubernetes nor the OS may automatically delete files
  from a volume, so memory used by those files can not be reclaimed when the
  system or the pod are under memory pressure.
* A memory-backed `emptyDir` is useful because of its performance, but memory
  is generally much smaller in size and much higher in cost than other storage
  media, such as disks or SSDs. Using large amounts of memory for `emptyDir`
  volumes may affect the normal operation of your pod or of the whole node,
  so should be used carefully.
-->
* 儲存在內存爲介質的捲上的檔案幾乎完全由使用者應用所管理。
  與用作進程工作區的用法不同，你無法依賴語言級別垃圾回收這類機制。
* 將檔案寫入某個卷的目的是保存資料或在應用之間傳遞資料。
  Kubernetes 或操作系統都不會自動從卷中刪除檔案，
  因此當系統或 Pod 面臨內存壓力時，將無法回收這些檔案所使用的內存。
* 以內存爲介質的 `emptyDir` 因性能較好而很有用，但內存通常比其他儲存介質（如磁盤或 SSD）小得多且成本更高。
  爲 `emptyDir` 卷使用大量內存可能會影響 Pod 或整個節點的正常運行，因此你應謹慎使用。

<!--
If you are administering a cluster or namespace, you can also set
[ResourceQuota](/docs/concepts/policy/resource-quotas/) that limits memory use;
you may also want to define a [LimitRange](/docs/concepts/policy/limit-range/)
for additional enforcement.
If you specify a `spec.containers[].resources.limits.memory` for each Pod,
then the maximum size of an `emptyDir` volume will be the pod's memory limit.
-->
如果你在管理叢集或命名空間，還可以設置限制內存使用的
[ResourceQuota](/zh-cn/docs/concepts/policy/resource-quotas/)；
你可能還希望定義一個 [LimitRange](/zh-cn/docs/concepts/policy/limit-range/)
以施加額外的限制。如果爲每個 Pod 指定 `spec.containers[].resources.limits.memory`，
那麼 `emptyDir` 卷的最大尺寸將是 Pod 的內存限制。

<!--
As an alternative, a cluster administrator can enforce size limits for
`emptyDir` volumes in new Pods using a policy mechanism such as
[ValidationAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy).
-->
作爲一種替代方案，叢集管理員可以使用諸如
[ValidationAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy)
之類的策略機制來強制對新 Pod 的 `emptyDir` 捲進行大小限制。

<!--
## Local ephemeral storage

Nodes have local ephemeral storage, backed by
locally-attached writeable devices or, sometimes, by RAM.
"Ephemeral" means that there is no long-term guarantee about durability.

Pods use ephemeral local storage for scratch space, caching, and for logs.
The kubelet can provide scratch space to Pods using local ephemeral storage to
mount [`emptyDir`](/docs/concepts/storage/volumes/#emptydir)
 {{< glossary_tooltip term_id="volume" text="volumes" >}} into containers.
-->
## 本地臨時儲存   {#local-ephemeral-storage}

<!-- feature gate LocalStorageCapacityIsolation -->
{{< feature-state for_k8s_version="v1.25" state="stable" >}}

節點通常還可以具有本地的臨時性儲存，由本地掛接的可寫入設備或者有時也用 RAM
來提供支持。“臨時（Ephemeral）”意味着對所儲存的資料不提供長期可用性的保證。

Pods 通常可以使用臨時性本地儲存來實現緩衝區、保存日誌等功能。
kubelet 可以爲使用本地臨時儲存的 Pods 提供這種儲存空間，允許後者使用
[`emptyDir`](/zh-cn/docs/concepts/storage/volumes/#emptydir)
類型的{{< glossary_tooltip term_id="volume" text="卷" >}}將其掛載到容器中。

<!--
The kubelet also uses this kind of storage to hold
[node-level container logs](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level),
container images, and the writable layers of running containers.
-->
kubelet 也使用此類儲存來保存[節點層面的容器日誌](/zh-cn/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)、
容器映像檔檔案以及運行中容器的可寫入層。

{{< caution >}}
<!--
If a node fails, the data in its ephemeral storage can be lost.
Your applications cannot expect any performance SLAs (disk IOPS for example)
from local ephemeral storage.
-->
如果節點失效，儲存在臨時性儲存中的資料會丟失。
你的應用不能對本地臨時性儲存的性能 SLA（例如磁盤 IOPS）作任何假定。
{{< /caution >}}

{{< note >}}
<!--
To make the resource quota work on ephemeral-storage, two things need to be done:

* An admin sets the resource quota for ephemeral-storage in a namespace.
* A user needs to specify limits for the ephemeral-storage resource in the Pod spec.

If the user doesn't specify the ephemeral-storage resource limit in the Pod spec,
the resource quota is not enforced on ephemeral-storage.
-->
爲了使臨時性儲存的資源配額生效，需要完成以下兩個步驟：

* 管理員在命名空間中設置臨時性儲存的資源配額。
* 使用者需要在 Pod 規約中指定臨時性儲存資源的限制。

如果使用者在 Pod 規約中未指定臨時性儲存資源的限制，
則臨時性儲存的資源配額不會生效。
{{< /note >}}

<!--
Kubernetes lets you track, reserve and limit the amount
of ephemeral local storage a Pod can consume.
-->
Kubernetes 允許你跟蹤、預留和限制 Pod
可消耗的臨時性本地儲存數量。

<!--
### Configurations for local ephemeral storage

Kubernetes supports two ways to configure local ephemeral storage on a node:

In this configuration, you place all different kinds of ephemeral local data
(`emptyDir` volumes, writeable layers, container images, logs) into one filesystem.
The most effective way to configure the kubelet means dedicating this filesystem
to Kubernetes (kubelet) data.

The kubelet also writes
[node-level container logs](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
and treats these similarly to ephemeral local storage.
-->
### 本地臨時性儲存的設定  {##configurations-for-local-ephemeral-storage}

Kubernetes 有兩種方式支持節點上設定本地臨時性儲存：

{{< tabs name="local_storage_configurations" >}}
{{% tab name="單一檔案系統" %}}
採用這種設定時，你會把所有類型的臨時性本地資料（包括 `emptyDir`
卷、可寫入容器層、容器映像檔、日誌等）放到同一個檔案系統中。
作爲最有效的 kubelet 設定方式，這意味着該檔案系統是專門提供給 Kubernetes
（kubelet）來保存資料的。

kubelet 也會生成[節點層面的容器日誌](/zh-cn/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)，
並按臨時性本地儲存的方式對待之。

<!--
The kubelet writes logs to files inside its configured log directory (`/var/log`
by default); and has a base directory for other locally stored data
(`/var/lib/kubelet` by default).

Typically, both `/var/lib/kubelet` and `/var/log` are on the system root filesystem,
and the kubelet is designed with that layout in mind.

Your node can have as many other filesystems, not used for Kubernetes,
as you like.
-->
kubelet 會將日誌寫入到所設定的日誌目錄（預設爲 `/var/log`）下的檔案中；
還會針對其他本地儲存的資料使用同一個基礎目錄（預設爲 `/var/lib/kubelet`）。

通常，`/var/lib/kubelet` 和 `/var/log` 都是在系統的根檔案系統中。kubelet
的設計也考慮到這一點。

你的叢集節點當然可以包含其他的、並非用於 Kubernetes 的很多檔案系統。
{{% /tab %}}

{{% tab name="雙檔案系統" %}}
<!--
You have a filesystem on the node that you're using for ephemeral data that
comes from running Pods: logs, and `emptyDir` volumes. You can use this filesystem
for other data (for example: system logs not related to Kubernetes); it can even
be the root filesystem.

The kubelet also writes
[node-level container logs](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
into the first filesystem, and treats these similarly to ephemeral local storage.
-->
你使用節點上的某個檔案系統來保存運行 Pod 時產生的臨時性資料：日誌和
`emptyDir` 卷等。你可以使用這個檔案系統來保存其他資料（例如：與 Kubernetes
無關的其他系統日誌）；這個檔案系統還可以是根檔案系統。

kubelet 也將[節點層面的容器日誌](/zh-cn/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
寫入到第一個檔案系統中，並按臨時性本地儲存的方式對待之。

<!--
You also use a separate filesystem, backed by a different logical storage device.
In this configuration, the directory where you tell the kubelet to place
container image layers and writeable layers is on this second filesystem.

The first filesystem does not hold any image layers or writeable layers.

Your node can have as many other filesystems, not used for Kubernetes,
as you like.
-->
同時你使用另一個由不同邏輯儲存設備支持的檔案系統。在這種設定下，你會告訴
kubelet 將容器映像檔層和可寫層保存到這第二個檔案系統上的某個目錄中。

第一個檔案系統中不包含任何映像檔層和可寫層資料。

當然，你的叢集節點上還可以有很多其他與 Kubernetes 沒有關聯的檔案系統。
{{% /tab %}}
{{< /tabs >}}

<!--
The kubelet can measure how much local storage it is using. It does this provided
that you have set up the node using one of the supported configurations for local
ephemeral storage.

If you have a different configuration, then the kubelet does not apply resource
limits for ephemeral local storage.
-->
kubelet 能夠度量其本地儲存的用量。
實現度量機制的前提是你已使用本地臨時儲存所支持的設定之一對節點進行設定。

如果你的節點設定不同於以上預期，kubelet 就無法對臨時性本地儲存實施資源限制。

{{< note >}}
<!--
The kubelet tracks `tmpfs` emptyDir volumes as container memory use, rather
than as local ephemeral storage.
-->
kubelet 會將 `tmpfs` emptyDir 卷的用量當作容器內存用量，而不是本地臨時性儲存來統計。
{{< /note >}}

{{< note >}}
<!--
The kubelet will only track the root filesystem for ephemeral storage. OS layouts that mount a separate disk to `/var/lib/kubelet` or `/var/lib/containers` will not report ephemeral storage correctly.
-->
kubelet 將僅跟蹤臨時儲存的根檔案系統。
如果你掛載另一個磁盤到 `/var/lib/kubelet` 或 `/var/lib/containers` 目錄下，
形成新的操作系統層面佈局，kubelet 將無法正確報告臨時儲存用量。
{{< /note >}}

<!--
### Setting requests and limits for local ephemeral storage

You can specify `ephemeral-storage` for managing local ephemeral storage. Each
container of a Pod can specify either or both of the following:

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`
-->
### 爲本地臨時性儲存設置請求和限制  {#setting-requests-and-limits-for-local-ephemeral-storage}

你可以指定 `ephemeral-storage` 來管理本地臨時性儲存。
Pod 中的每個容器可以設置以下屬性：

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

<!--
Limits and requests for `ephemeral-storage` are measured in byte quantities.
You can express storage as a plain integer or as a fixed-point number using one of these suffixes:
E, P, T, G, M, k. You can also use the power-of-two equivalents: Ei, Pi, Ti, Gi,
Mi, Ki. For example, the following quantities all represent roughly the same value:
-->
`ephemeral-storage` 的請求和限制是按量綱計量的。
你可以使用一般整數或者定點數字加上下面的後綴來表達儲存量：E、P、T、G、M、k。
你也可以使用對應的 2 的冪級數來表達：Ei、Pi、Ti、Gi、Mi、Ki。
例如，下面的表達式所表達的大致是同一個值：

- `128974848`
- `129e6`
- `129M`
- `123Mi`

<!--
Pay attention to the case of the suffixes. If you request `400m` of ephemeral-storage, this is a request
for 0.4 bytes. Someone who types that probably meant to ask for 400 mebibytes (`400Mi`)
or 400 megabytes (`400M`).
-->
請注意後綴的大小寫。如果你請求 `400m` 臨時儲存，實際上所請求的是 0.4 字節。
如果有人這樣設定資源請求或限制，可能他的實際想法是申請 400Mi 字節（`400Mi`）
或者 400M 字節。

<!--
In the following example, the Pod has two containers. Each container has a request of
2GiB of local ephemeral storage. Each container has a limit of 4GiB of local ephemeral
storage. Therefore, the Pod has a request of 4GiB of local ephemeral storage, and
a limit of 8GiB of local ephemeral storage. 500Mi of that limit could be
consumed by the `emptyDir` volume.
-->
在下面的例子中，Pod 包含兩個容器。每個容器請求 2 GiB 大小的本地臨時性儲存。
每個容器都設置了 4 GiB 作爲其本地臨時性儲存的限制。
因此，整個 Pod 的本地臨時性儲存請求是 4 GiB，且其本地臨時性儲存的限制爲 8 GiB。
該限制值中有 500Mi 可供 `emptyDir` 卷使用。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  volumes:
    - name: ephemeral
      emptyDir:
        sizeLimit: 500Mi
```

<!--
### How Pods with ephemeral-storage requests are scheduled

When you create a Pod, the Kubernetes scheduler selects a node for the Pod to
run on. Each node has a maximum amount of local ephemeral storage it can provide for Pods.
For more information, see
[Node Allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

The scheduler ensures that the sum of the resource requests of the scheduled containers is less than the capacity of the node.
-->
### 帶臨時性儲存的 Pods 的調度行爲  {#how-pods-with-ephemeral-storage-requests-are-scheduled}

當你創建一個 Pod 時，Kubernetes 調度器會爲 Pod 選擇一個節點來運行之。
每個節點都有一個本地臨時性儲存的上限，是其可提供給 Pod 使用的總量。
欲瞭解更多資訊，
可參考[節點可分配資源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)節。

調度器會確保所調度的容器的資源請求總和不會超出節點的資源容量。

<!--
### Ephemeral storage consumption management {#resource-emphemeralstorage-consumption}

If the kubelet is managing local ephemeral storage as a resource, then the
kubelet measures storage use in:

- `emptyDir` volumes, except _tmpfs_ `emptyDir` volumes
- directories holding node-level logs
- writeable container layers

If a Pod is using more ephemeral storage than you allow it to, the kubelet
sets an eviction signal that triggers Pod eviction.
-->
### 臨時性儲存消耗的管理 {#resource-emphemeralstorage-consumption}

如果 kubelet 將本地臨時性儲存作爲資源來管理，則 kubelet 會度量以下各處的儲存用量：

- `emptyDir` 卷，除了 **tmpfs** `emptyDir` 卷
- 保存節點層面日誌的目錄
- 可寫入的容器映像檔層

如果某 Pod 的臨時儲存用量超出了你所允許的範圍，
kubelet 會向其發出逐出（eviction）信號，觸發該 Pod 被逐出所在節點。

<!--
For container-level isolation, if a container's writable layer and log
usage exceeds its storage limit, the kubelet marks the Pod for eviction.

For pod-level isolation the kubelet works out an overall Pod storage limit by
summing the limits for the containers in that Pod. In this case, if the sum of
the local ephemeral storage usage from all containers and also the Pod's `emptyDir`
volumes exceeds the overall Pod storage limit, then the kubelet also marks the Pod
for eviction.
-->
就容器層面的隔離而言，如果某容器的可寫入映像檔層和日誌用量超出其儲存限制，
kubelet 也會將所在的 Pod 標記爲逐出候選。

就 Pod 層面的隔離而言，kubelet 會將 Pod 中所有容器的限制相加，得到 Pod 儲存限制的總值。
如果所有容器的本地臨時性儲存用量總和加上 Pod 的 `emptyDir`
卷的用量超出 Pod 儲存限制，kubelet 也會將該 Pod 標記爲逐出候選。

{{< caution >}}
<!--
If the kubelet is not measuring local ephemeral storage, then a Pod
that exceeds its local storage limit will not be evicted for breaching
local storage resource limits.

However, if the filesystem space for writeable container layers, node-level logs,
or `emptyDir` volumes falls low, the node
{{< glossary_tooltip text="taints" term_id="taint" >}} itself as short on local storage
and this taint triggers eviction for any Pods that don't specifically tolerate the taint.

See the supported [configurations](#configurations-for-local-ephemeral-storage)
for ephemeral local storage.
-->
如果 kubelet 沒有度量本地臨時性儲存的用量，即使 Pod
的本地儲存用量超出其限制也不會被逐出。

不過，如果用於可寫入容器映像檔層、節點層面日誌或者 `emptyDir` 卷的檔案系統中可用空間太少，
節點會爲自身設置本地儲存不足的{{< glossary_tooltip text="污點" term_id="taint" >}}標籤。
這一污點會觸發對那些無法容忍該污點的 Pod 的逐出操作。

關於臨時性本地儲存的設定資訊，請參考[這裏](#configurations-for-local-ephemeral-storage)。
{{< /caution >}}

<!--
The kubelet supports different ways to measure Pod storage use:
-->
kubelet 支持使用不同方式來度量 Pod 的儲存用量：

{{< tabs name="resource-emphemeralstorage-measurement" >}}
{{% tab name="週期性掃描" %}}

<!--
The kubelet performs regular, scheduled checks that scan each
`emptyDir` volume, container log directory, and writeable container layer.

The scan measures how much space is used.
-->
kubelet 按預定週期執行掃描操作，檢查 `emptyDir` 卷、容器日誌目錄以及可寫入容器映像檔層。

這一掃描會度量儲存空間用量。

{{< note >}}
<!--
In this mode, the kubelet does not track open file descriptors
for deleted files.

If you (or a container) create a file inside an `emptyDir` volume,
something then opens that file, and you delete the file while it is
still open, then the inode for the deleted file stays until you close
that file but the kubelet does not categorize the space as in use.
-->
在這種模式下，kubelet 並不檢查已刪除檔案所對應的、仍處於打開狀態的檔案描述符。

如果你（或者容器）在 `emptyDir` 卷中創建了一個檔案，
寫入一些內容之後再次打開該檔案並執行了刪除操作，所刪除檔案對應的 inode 仍然存在，
直到你關閉該檔案爲止。kubelet 不會將該檔案所佔用的空間視爲已使用空間。
{{< /note >}}

{{% /tab %}}

{{% tab name="檔案系統項目配額" %}}

{{< feature-state feature_gate_name="LocalStorageCapacityIsolationFSQuotaMonitoring" >}}

<!--
Project quotas are an operating-system level feature for managing
storage use on filesystems. With Kubernetes, you can enable project
quotas for monitoring storage use. Make sure that the filesystem
backing the `emptyDir` volumes, on the node, provides project quota support.
For example, XFS and ext4fs offer project quotas.
-->
項目配額（Project Quota）是一個操作系統層的功能特性，用來管理檔案系統中的儲存用量。
在 Kubernetes 中，你可以啓用項目配額以監視儲存用量。
你需要確保節點上爲 `emptyDir` 提供儲存的檔案系統支持項目配額。
例如，XFS 和 ext4fs 檔案系統都支持項目配額。

{{< note >}}
<!--
Project quotas let you monitor storage use; they do not enforce limits.
-->
項目配額可以幫你監視儲存用量，但無法強制執行限制。
{{< /note >}}

<!--
Kubernetes uses project IDs starting from `1048576`. The IDs in use are
registered in `/etc/projects` and `/etc/projid`. If project IDs in
this range are used for other purposes on the system, those project
IDs must be registered in `/etc/projects` and `/etc/projid` so that
Kubernetes does not use them.

Quotas are faster and more accurate than directory scanning. When a
directory is assigned to a project, all files created under a
directory are created in that project, and the kernel merely has to
keep track of how many blocks are in use by files in that project.
If a file is created and deleted, but has an open file descriptor,
it continues to consume space. Quota tracking records that space accurately
whereas directory scans overlook the storage used by deleted files.
-->
Kubernetes 所使用的項目 ID 始於 `1048576`。
所使用的 IDs 會註冊在 `/etc/projects` 和 `/etc/projid` 檔案中。
如果該範圍中的項目 ID 已經在系統中被用於其他目的，則已佔用的項目 ID
也必須註冊到 `/etc/projects` 和 `/etc/projid` 中，這樣 Kubernetes
纔不會使用它們。

配額方式與目錄掃描方式相比速度更快，結果更精確。當某個目錄被分配給某個項目時，
該目錄下所創建的所有檔案都屬於該項目，內核只需要跟蹤該項目中的檔案所使用的儲存塊個數。
如果某檔案被創建後又被刪除，但對應檔案描述符仍處於打開狀態，
該檔案會繼續耗用儲存空間。配額跟蹤技術能夠精確第記錄對應儲存空間的狀態，
而目錄掃描方式會忽略被刪除檔案所佔用的空間。

<!--
To use quotas to track a pod's resource usage, the pod must be in 
a user namespace. Within user namespaces, the kernel restricts changes 
to projectIDs on the filesystem, ensuring the reliability of storage 
metrics calculated by quotas.
-->
要使用配額來跟蹤 Pod 的資源使用情況，Pod 必須位於使用者命名空間中。
在使用者命名空間內，內核限制對檔案系統上 projectID 的更改，從而確保按配額計算的儲存指標的可靠性。

<!--
If you want to use project quotas, you should:

* Enable the `LocalStorageCapacityIsolationFSQuotaMonitoring=true`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  using the `featureGates` field in the
  [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/).
-->
如果你希望使用項目配額，你需要：

* 在 [kubelet 設定](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中使用
  `featureGates` 字段啓用
  `LocalStorageCapacityIsolationFSQuotaMonitoring=true` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
* Ensure the `UserNamespacesSupport` 
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  is enabled, and that the kernel, CRI implementation and OCI runtime support user namespaces.
-->
* 確保 `UserNamespacesSupport` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)已啓用，
  並且內核、CRI 實現和 OCI 運行時支持使用者命名空間。

<!--
* Ensure that the root filesystem (or optional runtime filesystem)
  has project quotas enabled. All XFS filesystems support project quotas.
  For ext4 filesystems, you need to enable the project quota tracking feature
  while the filesystem is not mounted.

  ```bash
  # For ext4, with /dev/block-device not mounted
  sudo tune2fs -O project -Q prjquota /dev/block-device
  ```
-->
* 確保根檔案系統（或者可選的運行時檔案系統）啓用了項目配額。所有 XFS
  檔案系統都支持項目配額。
  對 extf 檔案系統而言，你需要在檔案系統尚未被掛載時啓用項目配額跟蹤特性：

  ```bash
  # 對 ext4 而言，在 /dev/block-device 尚未被掛載時執行下面操作
  sudo tune2fs -O project -Q prjquota /dev/block-device
  ```

<!--
* Ensure that the root filesystem (or optional runtime filesystem) is
  mounted with project quotas enabled. For both XFS and ext4fs, the
  mount option is named `prjquota`.
-->
* 確保根檔案系統（或者可選的運行時檔案系統）在掛載時項目配額特性是被啓用了的。
  對於 XFS 和 ext4fs 而言，對應的掛載選項稱作 `prjquota`。

<!--
If you don't want to use project quotas, you should:

* Disable the `LocalStorageCapacityIsolationFSQuotaMonitoring`
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  using the `featureGates` field in the
  [kubelet configuration](/docs/reference/config-api/kubelet-config.v1beta1/).
-->
如果不想使用項目配額，你應該：

* 使用 [kubelet 設定](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中的
  `featureGates` 字段禁用 `LocalStorageCapacityIsolationFSQuotaMonitoring`
  [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

{{% /tab %}}
{{< /tabs >}}

<!--
## Extended resources

Extended resources are fully-qualified resource names outside the
`kubernetes.io` domain. They allow cluster operators to advertise and users to
consume the non-Kubernetes-built-in resources.

There are two steps required to use Extended Resources. First, the cluster
operator must advertise an Extended Resource. Second, users must request the
Extended Resource in Pods.
-->
## 擴展資源（Extended Resources）   {#extended-resources}

擴展資源是 `kubernetes.io` 域名之外的標準資源名稱。
它們使得叢集管理員能夠頒佈非 Kubernetes 內置資源，而使用者可以使用他們。

使用擴展資源需要兩個步驟。首先，叢集管理員必須頒佈擴展資源。
其次，使用者必須在 Pod 中請求擴展資源。

<!--
### Managing extended resources

#### Node-level extended resources

Node-level extended resources are tied to nodes.

##### Device plugin managed resources

See [Device
Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
for how to advertise device plugin managed resources on each node.
-->
### 管理擴展資源   {#managing-extended-resources}

#### 節點級擴展資源     {#node-level-extended-resources}

節點級擴展資源綁定到節點。

##### 設備插件管理的資源   {#device-plugin-managed-resources}

有關如何頒佈在各節點上由設備插件所管理的資源，
請參閱[設備插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)。

<!--
##### Other resources

To advertise a new node-level extended resource, the cluster operator can
submit a `PATCH` HTTP request to the API server to specify the available
quantity in the `status.capacity` for a node in the cluster. After this
operation, the node's `status.capacity` will include a new resource. The
`status.allocatable` field is updated automatically with the new resource
asynchronously by the kubelet.
-->
##### 其他資源   {#other-resources}

爲了頒佈新的節點級擴展資源，叢集操作員可以向 API 伺服器提交 `PATCH` HTTP 請求，
以在叢集中節點的 `status.capacity` 中爲其設定可用數量。
完成此操作後，節點的 `status.capacity` 字段中將包含新資源。
kubelet 會異步地對 `status.allocatable` 字段執行自動更新操作，使之包含新資源。

<!--
Because the scheduler uses the node's `status.allocatable` value when
evaluating Pod fitness, the scheduler only takes account of the new value after
that asynchronous update. There may be a short delay between patching the
node capacity with a new resource and the time when the first Pod that requests
the resource can be scheduled on that node.
-->
由於調度器在評估 Pod 是否適合在某節點上執行時會使用節點的 `status.allocatable` 值，
調度器只會考慮異步更新之後的新值。
在更新節點容量使之包含新資源之後和請求該資源的第一個 Pod 被調度到該節點之間，
可能會有短暫的延遲。

<!--
**Example:**

Here is an example showing how to use `curl` to form an HTTP request that
advertises five "example.com/foo" resources on node `k8s-node-1` whose master
is `k8s-master`.
-->
**示例：**

這是一個示例，顯示瞭如何使用 `curl` 構造 HTTP 請求，公告主節點爲 `k8s-master`
的節點 `k8s-node-1` 上存在五個 `example.com/foo` 資源。

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/example.com~1foo", "value": "5"}]' \
http://k8s-master:8080/api/v1/nodes/k8s-node-1/status
```

{{< note >}}
<!--
In the preceding request, `~1` is the encoding for the character `/`
in the patch path. The operation path value in JSON-Patch is interpreted as a
JSON-Pointer. For more details, see
[IETF RFC 6901, section 3](https://tools.ietf.org/html/rfc6901#section-3).
-->
在前面的請求中，`~1` 是在 patch 路徑中對字符 `/` 的編碼。
JSON-Patch 中的操作路徑的值被視爲 JSON-Pointer 類型。
有關更多詳細資訊，請參見
[IETF RFC 6901 第 3 節](https://tools.ietf.org/html/rfc6901#section-3)。
{{< /note >}}

<!--
#### Cluster-level extended resources

Cluster-level extended resources are not tied to nodes. They are usually managed
by scheduler extenders, which handle the resource consumption and resource quota.

You can specify the extended resources that are handled by scheduler extenders
in [scheduler configuration](/docs/reference/config-api/kube-scheduler-config.v1/)
-->
#### 叢集層面的擴展資源   {#cluster-level-extended-resources}

叢集層面的擴展資源並不綁定到具體節點。
它們通常由調度器擴展程式（Scheduler Extenders）管理，這些程式處理資源消耗和資源配額。

你可以在[調度器設定](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)
中指定由調度器擴展程式處理的擴展資源。

<!--
**Example:**

The following configuration for a scheduler policy indicates that the
cluster-level extended resource "example.com/foo" is handled by the scheduler
extender.

- The scheduler sends a Pod to the scheduler extender only if the Pod requests
     "example.com/foo".
- The `ignoredByScheduler` field specifies that the scheduler does not check
     the "example.com/foo" resource in its `PodFitsResources` predicate.
-->
**示例：**

下面的調度器策略設定標明叢集層擴展資源 "example.com/foo" 由調度器擴展程式處理。

- 僅當 Pod 請求 "example.com/foo" 時，調度器纔會將 Pod 發送到調度器擴展程式。
- `ignoredByScheduler` 字段指定調度器不要在其 `PodFitsResources` 斷言中檢查
  "example.com/foo" 資源。

```json
{
  "kind": "Policy",
  "apiVersion": "v1",
  "extenders": [
    {
      "urlPrefix": "<extender-endpoint>",
      "bindVerb": "bind",
      "managedResources": [
        {
          "name": "example.com/foo",
          "ignoredByScheduler": true
        }
      ]
    }
  ]
}
```

<!--
#### Extended resources allocation by DRA

Extended resources allocation by DRA allows cluster administrators to specify an `extendedResourceName`
in DeviceClass, then the devices matching the DeviceClass can be requested from a pod's extended
resource requests. Read more about
[Extended Resource allocation by DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource).
-->
#### DRA 擴展資源分配

DRA 擴展資源分配允許叢集管理員在 DeviceClass 中指定一個
`extendedResourceName`，然後與所指定 DeviceClass 匹配的設備可以使用
Pod 的擴展資源請求來獲取。
進一步閱讀關於[使用 DRA 進行擴展資源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)的內容。

<!--
### Consuming extended resources

Users can consume extended resources in Pod specs like CPU and memory.
The scheduler takes care of the resource accounting so that no more than the
available amount is simultaneously allocated to Pods.
-->
### 使用擴展資源  {#consuming-extended-resources}

就像 CPU 和內存一樣，使用者可以在 Pod 的規約中使用擴展資源。
調度器負責資源的核算，確保同時分配給 Pod 的資源總量不會超過可用數量。

<!--
The API server restricts quantities of extended resources to whole numbers.
Examples of _valid_ quantities are `3`, `3000m` and `3Ki`. Examples of
_invalid_ quantities are `0.5` and `1500m` (because `1500m` would result in `1.5`).
-->
API 伺服器將擴展資源的數量限制爲整數。
**有效**數量的示例是 `3`、`3000m` 和 `3Ki`。
**無效**數量的示例是 `0.5` 和 `1500m`（因爲 `1500m` 結果等同於 `1.5`）。

{{< note >}}
<!--
Extended resources replace Opaque Integer Resources.
Users can use any domain name prefix other than `kubernetes.io` which is reserved.
-->
擴展資源取代了非透明整數資源（Opaque Integer Resources，OIR）。
使用者可以使用 `kubernetes.io`（保留）以外的任何域名前綴。
{{< /note >}}

<!--
To consume an extended resource in a Pod, include the resource name as a key
in the `spec.containers[].resources.limits` map in the container spec.
-->
要在 Pod 中使用擴展資源，請在容器規約的 `spec.containers[].resources.limits`
映射中包含資源名稱作爲鍵。

{{< note >}}
<!--
Extended resources cannot be overcommitted, so request and limit
must be equal if both are present in a container spec.
-->
擴展資源不能過量使用，因此如果容器規約中同時存在請求和限制，則它們的取值必須相同。
{{< /note >}}

<!--
A Pod is scheduled only if all of the resource requests are satisfied, including
CPU, memory and any extended resources. The Pod remains in the `PENDING` state
as long as the resource request cannot be satisfied.

**Example:**

The Pod below requests 2 CPUs and 1 "example.com/foo" (an extended resource).
-->
僅當所有資源請求（包括 CPU、內存和任何擴展資源）都被滿足時，Pod 才能被調度。
在資源請求無法滿足時，Pod 會保持在 `PENDING` 狀態。

**示例：**

下面的 Pod 請求 2 個 CPU 和 1 個 "example.com/foo"（擴展資源）。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: myimage
    resources:
      requests:
        cpu: 2
        example.com/foo: 1
      limits:
        example.com/foo: 1
```

<!--
## PID limiting

Process ID (PID) limits allow for the configuration of a kubelet
to limit the number of PIDs that a given Pod can consume. See
[PID Limiting](/docs/concepts/policy/pid-limiting/) for information.
-->
## PID 限制   {#pid-limiting}

進程 ID（PID）限制允許對 kubelet 進行設定，以限制給定 Pod 可以消耗的 PID 數量。
有關資訊，請參見 [PID 限制](/zh-cn/docs/concepts/policy/pid-limiting/)。

<!--
## Troubleshooting

### My Pods are pending with event message `FailedScheduling`

If the scheduler cannot find any node where a Pod can fit, the Pod remains
unscheduled until a place can be found. An
[Event](/docs/reference/kubernetes-api/cluster-resources/event-v1/) is produced
each time the scheduler fails to find a place for the Pod. You can use `kubectl`
to view the events for a Pod; for example:
-->
## 問題診斷  {#troubleshooting}

### 我的 Pod 處於懸決狀態且事件資訊顯示 `FailedScheduling`  {#my-pods-are-pending-with-event-message-failedscheduling}

如果調度器找不到該 Pod 可以匹配的任何節點，則該 Pod 將保持未被調度狀態，
直到找到一個可以被調度到的位置。每當調度器找不到 Pod 可以調度的地方時，
會產生一個 [Event](/zh-cn/docs/reference/kubernetes-api/cluster-resources/event-v1/)。
你可以使用 `kubectl` 來查看 Pod 的事件；例如：

```shell
kubectl describe pod frontend | grep -A 9999999999 Events
```

```
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  23s   default-scheduler  0/42 nodes available: insufficient cpu
```

<!--
In the preceding example, the Pod named "frontend" fails to be scheduled due to
insufficient CPU resource on any node. Similar error messages can also suggest
failure due to insufficient memory (PodExceedsFreeMemory). In general, if a Pod
is pending with a message of this type, there are several things to try:

- Add more nodes to the cluster.
- Terminate unneeded Pods to make room for pending Pods.
- Check that the Pod is not larger than all the nodes. For example, if all the
  nodes have a capacity of `cpu: 1`, then a Pod with a request of `cpu: 1.1` will
  never be scheduled.
- Check for node taints. If most of your nodes are tainted, and the new Pod does
  not tolerate that taint, the scheduler only considers placements onto the
  remaining nodes that don't have that taint.

You can check node capacities and amounts allocated with the
`kubectl describe nodes` command. For example:
-->
在上述示例中，由於節點上的 CPU 資源不足，名爲 “frontend” 的 Pod 無法被調度。
由於內存不足（PodExceedsFreeMemory）而導致失敗時，也有類似的錯誤消息。
一般來說，如果 Pod 處於懸決狀態且有這種類型的消息時，你可以嘗試如下幾件事情：

- 向叢集添加更多節點。
- 終止不需要的 Pod，爲懸決的 Pod 騰出空間。
- 檢查 Pod 所需的資源是否超出所有節點的資源容量。例如，如果所有節點的容量都是 `cpu：1`，
  那麼一個請求爲 `cpu: 1.1` 的 Pod 永遠不會被調度。
- 檢查節點上的污點設置。如果叢集中節點上存在污點，而新的 Pod 不能容忍污點，
  調度器只會考慮將 Pod 調度到不帶有該污點的節點上。

你可以使用 `kubectl describe nodes` 命令檢查節點容量和已分配的資源數量。例如：

```shell
kubectl describe nodes e2e-test-node-pool-4lw4
```

<!--
[ ... lines removed for clarity ...]
-->
```
Name:            e2e-test-node-pool-4lw4
[ ... 這裏忽略了若干行以便閱讀 ...]
Capacity:
 cpu:                               2
 memory:                            7679792Ki
 pods:                              110
Allocatable:
 cpu:                               1800m
 memory:                            7474992Ki
 pods:                              110
[ ... 這裏忽略了若干行以便閱讀 ...]
Non-terminated Pods:        (5 in total)
  Namespace    Name                                  CPU Requests  CPU Limits  Memory Requests  Memory Limits
  ---------    ----                                  ------------  ----------  ---------------  -------------
  kube-system  fluentd-gcp-v1.38-28bv1               100m (5%)     0 (0%)      200Mi (2%)       200Mi (2%)
  kube-system  kube-dns-3297075139-61lj3             260m (13%)    0 (0%)      100Mi (1%)       170Mi (2%)
  kube-system  kube-proxy-e2e-test-...               100m (5%)     0 (0%)      0 (0%)           0 (0%)
  kube-system  monitoring-influxdb-grafana-v4-z1m12  200m (10%)    200m (10%)  600Mi (8%)       600Mi (8%)
  kube-system  node-problem-detector-v0.1-fj7m3      20m (1%)      200m (10%)  20Mi (0%)        100Mi (1%)
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  CPU Requests    CPU Limits    Memory Requests    Memory Limits
  ------------    ----------    ---------------    -------------
  680m (34%)      400m (20%)    920Mi (11%)        1070Mi (13%)
```

<!--
In the preceding output, you can see that if a Pod requests more than 1.120 CPUs
or more than 6.23Gi of memory, that Pod will not fit on the node.

By looking at the “Pods” section, you can see which Pods are taking up space on
the node.
-->
在上面的輸出中，你可以看到如果 Pod 請求超過 1.120 CPU 或者 6.23Gi 內存，節點將無法滿足。

通過查看 "Pods" 部分，你將看到哪些 Pod 佔用了節點上的資源。

<!--
The amount of resources available to Pods is less than the node capacity because
system daemons use a portion of the available resources. Within the Kubernetes API,
each Node has a `.status.allocatable` field
(see [NodeStatus](/docs/reference/kubernetes-api/cluster-resources/node-v1/#NodeStatus)
for details).
-->
Pods 可用的資源量低於節點的資源總量，因爲系統守護進程也會使用一部分可用資源。
在 Kubernetes API 中，每個 Node 都有一個 `.status.allocatable` 字段
（詳情參見 [NodeStatus](/zh-cn/docs/reference/kubernetes-api/cluster-resources/node-v1/#NodeStatus)）。

<!--
The `.status.allocatable` field describes the amount of resources that are available
to Pods on that node (for example: 15 virtual CPUs and 7538 MiB of memory).
For more information on node allocatable resources in Kubernetes, see
[Reserve Compute Resources for System Daemons](/docs/tasks/administer-cluster/reserve-compute-resources/).
-->
字段 `.status.allocatable` 描述節點上可以用於 Pod 的資源總量（例如：15 個虛擬
CPU、7538 MiB 內存）。關於 Kubernetes 中節點可分配資源的資訊，
可參閱[爲系統守護進程預留計算資源](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/)。

<!--
You can configure [resource quotas](/docs/concepts/policy/resource-quotas/)
to limit the total amount of resources that a namespace can consume.
Kubernetes enforces quotas for objects in particular namespace when there is a
ResourceQuota in that namespace.
For example, if you assign specific namespaces to different teams, you
can add ResourceQuotas into those namespaces. Setting resource quotas helps to
prevent one team from using so much of any resource that this over-use affects other teams.

You should also consider what access you grant to that namespace:
**full** write access to a namespace allows someone with that access to remove any
resource, including a configured ResourceQuota.
-->
你可以設定[資源配額](/zh-cn/docs/concepts/policy/resource-quotas/)功能特性以限制每個名字空間可以使用的資源總量。
當某名字空間中存在 ResourceQuota 時，Kubernetes 會在該名字空間中的對象強制實施配額。
例如，如果你爲不同的團隊分配名字空間，你可以爲這些名字空間添加 ResourceQuota。
設置資源配額有助於防止一個團隊佔用太多資源，以至於這種佔用會影響其他團隊。

你還需要考慮爲這些名字空間設置授權訪問：
爲名字空間提供**全部**的寫權限時，具有合適權限的人可能刪除所有資源，
包括所設定的 ResourceQuota。

<!--
### My container is terminated

Your container might get terminated because it is resource-starved. To check
whether a container is being killed because it is hitting a resource limit, call
`kubectl describe pod` on the Pod of interest:
-->

### 我的容器被終止了  {#my-container-is-terminated}

你的容器可能因爲資源緊張而被終止。要查看容器是否因爲遇到資源限制而被殺死，
請針對相關的 Pod 執行 `kubectl describe pod`：

```shell
kubectl describe pod simmemleak-hra99
```

<!--
The output is similar to:
-->
輸出類似於：

```
Name:                           simmemleak-hra99
Namespace:                      default
Image(s):                       saadali/simmemleak
Node:                           kubernetes-node-tf0f/10.240.216.66
Labels:                         name=simmemleak
Status:                         Running
Reason:
Message:
IP:                             10.244.2.75
Containers:
  simmemleak:
    Image:  saadali/simmemleak:latest
    Limits:
      cpu:          100m
      memory:       50Mi
    State:          Running
      Started:      Tue, 07 Jul 2019 12:54:41 -0700
    Last State:     Terminated
      Reason:       OOMKilled
      Exit Code:    137
      Started:      Fri, 07 Jul 2019 12:54:30 -0700
      Finished:     Fri, 07 Jul 2019 12:54:33 -0700
    Ready:          False
    Restart Count:  5
Conditions:
  Type      Status
  Ready     False
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  42s   default-scheduler  Successfully assigned simmemleak-hra99 to kubernetes-node-tf0f
  Normal  Pulled     41s   kubelet            Container image "saadali/simmemleak:latest" already present on machine
  Normal  Created    41s   kubelet            Created container simmemleak
  Normal  Started    40s   kubelet            Started container simmemleak
  Normal  Killing    32s   kubelet            Killing container with id ead3fb35-5cf5-44ed-9ae1-488115be66c6: Need to kill Pod
```

<!--
In the preceding example, the `Restart Count:  5` indicates that the `simmemleak`
container in the Pod was terminated and restarted five times (so far).
The `OOMKilled` reason shows that the container tried to use more memory than its limit.
-->
在上面的例子中，`Restart Count: 5` 意味着 Pod 中的 `simmemleak`
容器被終止並且（到目前爲止）重啓了五次。
原因 `OOMKilled` 顯示容器嘗試使用超出其限制的內存量。

<!--
Your next step might be to check the application code for a memory leak. If you
find that the application is behaving how you expect, consider setting a higher
memory limit (and possibly request) for that container.
-->
你接下來要做的或許是檢查應用代碼，看看是否存在內存泄露。
如果你發現應用的行爲與你所預期的相同，則可以考慮爲該容器設置一個更高的內存限制
（也可能需要設置請求值）。

## {{% heading "whatsnext" %}}

<!--
* Get hands-on experience [assigning Memory resources to containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/).
* Get hands-on experience [assigning CPU resources to containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/).
* Read how the API reference defines a [container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
  and its [resource requirements](/docs/reference/kubernetes-api/workload-resources/pod-v1/#resources)
* Read about [project quotas](https://www.linux.org/docs/man8/xfs_quota.html) in XFS
* Read more about the [kube-scheduler configuration reference (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
* Read more about [Quality of Service classes for Pods](/docs/concepts/workloads/pods/pod-qos/)
* Read more about [Extended Resource allocation by DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)
-->
* 獲取[分配內存資源給容器和 Pod](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/) 的實踐經驗
* 獲取[分配 CPU 資源給容器和 Pod](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/) 的實踐經驗
* 閱讀 API 參考如何定義[容器](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
  及其[資源請求](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#resources)。
* 閱讀 XFS 中[項目配額](https://www.linux.org/docs/man8/xfs_quota.html)的文檔
* 進一步閱讀 [kube-scheduler 設定參考（v1）](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)
* 進一步閱讀 [Pod 的服務質量等級](/zh-cn/docs/concepts/workloads/pods/pod-qos/)
* 進一步閱讀[使用 DRA 進行擴展資源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)
