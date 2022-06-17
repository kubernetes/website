---
title: Windows 節點的資源管理
content_type: concept
weight: 75
---
<!--
reviewers:
- jayunit100
- jsturtevant
- marosset
- perithompson
title: Resource Management for Windows nodes
content_type: concept
weight: 75
-->

<!-- overview 
This page outlines the differences in how resources are managed between Linux and Windows.
-->
本頁概述了 Linux 和 Windows 在資源管理方式上的區別。

<!-- body -->
<!--
On Linux nodes, {{< glossary_tooltip text="cgroups" term_id="cgroup" >}} are used
as a pod boundary for resource control. Containers are created within that boundary for network, process and file system isolation. The Linux cgroup APIs can be used to gather CPU, I/O, and memory use statistics.

In contrast, Windows uses a [_job object_](https://docs.microsoft.com/windows/win32/procthread/job-objects) per container with a system namespace filter
to contain all processes in a container and provide logical isolation from the
host. (Job objects are a Windows process isolation mechanism and are different from what Kubernetes refers to as a {{< glossary_tooltip term_id="job" text="Job" >}}).

There is no way to run a Windows container without the namespace filtering in
place. This means that system privileges cannot be asserted in the context of the
host, and thus privileged containers are not available on Windows.
Containers cannot assume an identity from the host because the Security Account Manager (SAM) is separate.
-->
在 Linux 節點上，{{< glossary_tooltip text="cgroup" term_id="cgroup" >}} 用作資源控制的 Pod 邊界。
在這個邊界內建立容器以便於隔離網路、程序和檔案系統。
Linux cgroup API 可用於收集 CPU、I/O 和記憶體使用統計資料。

與此相反，Windows 中每個容器對應一個[**作業物件**](https://docs.microsoft.com/zh-cn/windows/win32/procthread/job-objects)，
與系統名稱空間過濾器一起使用，將所有程序包含在一個容器中，提供與主機的邏輯隔離。
（作業物件是一種 Windows 程序隔離機制，不同於 Kubernetes 提及的 {{< glossary_tooltip term_id="job" text="Job" >}})。

如果沒有名稱空間過濾，就無法執行 Windows 容器。
這意味著在主機環境中無法讓系統特權生效，因此特權容器在 Windows 上不可用。
容器不能使用來自主機的標識，因為安全帳戶管理器（Security Account Manager，SAM）是獨立的。

<!--
## Memory management {#resource-management-memory}

Windows does not have an out-of-memory process killer as Linux does. Windows always
treats all user-mode memory allocations as virtual, and pagefiles are mandatory.

Windows nodes do not overcommit memory for processes. The
net effect is that Windows won't reach out of memory conditions the same way Linux
does, and processes page to disk instead of being subject to out of memory (OOM)
termination. If memory is over-provisioned and all physical memory is exhausted,
then paging can slow down performance.
-->
## 記憶體管理 {#resource-management-memory}

Windows 不像 Linux 一樣提供殺手（killer）機制，殺死記憶體不足的程序。
Windows 始終將所有使用者態記憶體分配視為虛擬記憶體，並強制使用頁面檔案（pagefile）。

Windows 節點不會為程序過量使用記憶體。
最終結果是 Windows 不會像 Linux 那樣達到記憶體不足的情況，Windows 將程序頁面放到磁碟，
不會因為記憶體不足（OOM）而終止程序。
如果記憶體配置過量且所有物理記憶體都已耗盡，則換頁效能就會降低。
<!--
## CPU management {#resource-management-cpu}

Windows can limit the amount of CPU time allocated for different processes but cannot
guarantee a minimum amount of CPU time.

On Windows, the kubelet supports a command-line flag to set the
[scheduling priority](https://docs.microsoft.com/windows/win32/procthread/scheduling-priorities) of the
kubelet process: `--windows-priorityclass`. This flag allows the kubelet process to get
more CPU time slices when compared to other processes running on the Windows host.
More information on the allowable values and their meaning is available at
[Windows Priority Classes](https://docs.microsoft.com/en-us/windows/win32/procthread/scheduling-priorities#priority-class).
To ensure that running Pods do not starve the kubelet of CPU cycles, set this flag to `ABOVE_NORMAL_PRIORITY_CLASS` or above.
-->
## CPU 管理 {#resource-management-cpu}

Windows 可以限制為不同程序分配的 CPU 時間長度，但無法保證最小的 CPU 時間長度。

在 Windows 上，kubelet 支援使用命令列標誌來設定 kubelet 程序的[排程優先順序](https://docs.microsoft.com/zh-cn/windows/win32/procthread/scheduling-priorities)：
`--windows-priorityclass`。
與 Windows 主機上執行的其他程序相比，此標誌允許 kubelet 程序獲取更多的 CPU 時間片。
有關允許值及其含義的更多資訊，請訪問 [Windows 優先順序類](https://docs.microsoft.com/zh-cn/windows/win32/procthread/scheduling-priorities#priority-class)。
為了確保執行的 Pod 不會耗盡 kubelet 的 CPU 時鐘週期，
要將此標誌設定為 `ABOVE_NORMAL_PRIORITY_CLASS` 或更高。

<!--
## Resource reservation {#resource-reservation}

To account for memory and CPU used by the operating system, the container runtime, and by
Kubernetes host processes such as the kubelet, you can (and should) reserve
memory and CPU resources with the  `--kube-reserved` and/or `--system-reserved` kubelet flags.
On Windows these values are only used to calculate the node's
[allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) resources.
-->
## 資源預留 {#resource-reservation}

為了滿足作業系統、容器執行時和 kubelet 等 Kubernetes 主機程序使用的記憶體和 CPU，
你可以（且應該）用 `--kube-reserved` 和/或 `--system-reserved` kubelet 標誌來預留記憶體和 CPU 資源。
在 Windows 上，這些值僅用於計算節點的[可分配](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)資源。

<!--
As you deploy workloads, set resource memory and CPU limits on containers.
This also subtracts from `NodeAllocatable` and helps the cluster-wide scheduler in determining which pods to place on which nodes.

Scheduling pods without limits may over-provision the Windows nodes and in extreme
cases can cause the nodes to become unhealthy.
-->
{{< caution >}}
在你部署工作負載時，需對容器設定記憶體和 CPU 資源的限制。
這也會從 `NodeAllocatable` 中減去，幫助叢集範圍的排程器決定哪些 Pod 放到哪些節點上。

若排程 Pod 時未設定限制值，可能對 Windows 節點過量配置資源。
在極端情況下，這會讓節點變得不健康。
{{< /caution >}}

<!--
On Windows, a good practice is to reserve at least 2GiB of memory.

To determine how much CPU to reserve,
identify the maximum pod density for each node and monitor the CPU usage of
the system services running there, then choose a value that meets your workload needs.
-->
在 Windows 上，一種好的做法是預留至少 2GiB 的記憶體。

要決定預留多少 CPU，需明確每個節點的最大 Pod 密度，
並監控節點上執行的系統服務的 CPU 使用率，然後選擇一個滿足工作負載需求的值。
