---
title: Windows 节点的资源管理
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
本页概述了 Linux 和 Windows 在资源管理方式上的区别。

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
在 Linux 节点上，{{< glossary_tooltip text="cgroup" term_id="cgroup" >}} 用作资源控制的 Pod 边界。
在这个边界内创建容器以便于隔离网络、进程和文件系统。
Linux cgroup API 可用于收集 CPU、I/O 和内存使用统计数据。

与此相反，Windows 中每个容器对应一个[**作业对象**](https://docs.microsoft.com/zh-cn/windows/win32/procthread/job-objects)，
与系统命名空间过滤器一起使用，将所有进程包含在一个容器中，提供与主机的逻辑隔离。
（作业对象是一种 Windows 进程隔离机制，不同于 Kubernetes 提及的 {{< glossary_tooltip term_id="job" text="Job" >}})。

如果没有命名空间过滤，就无法运行 Windows 容器。
这意味着在主机环境中无法让系统特权生效，因此特权容器在 Windows 上不可用。
容器不能使用来自主机的标识，因为安全帐户管理器（Security Account Manager，SAM）是独立的。

<!--
## Memory reservations {#resource-management-memory}

Windows does not have an out-of-memory process killer as Linux does. Windows always
treats all user-mode memory allocations as virtual, and pagefiles are mandatory.

Windows nodes do not overcommit memory for processes running in containers. The
net effect is that Windows won't reach out of memory conditions the same way Linux
does, and processes page to disk instead of being subject to out of memory (OOM)
termination. If memory is over-provisioned and all physical memory is exhausted,
then paging can slow down performance.
-->
## 内存预留 {#resource-management-memory}

Windows 不像 Linux 一样提供杀手（killer）机制，杀死内存不足的进程。
Windows 始终将所有用户态内存分配视为虚拟内存，并强制使用页面文件（pagefile）。

Windows 节点不会为容器中运行的进程过量使用内存。
最终结果是 Windows 不会像 Linux 那样达到内存不足的情况，Windows 将进程页面放到磁盘，
不会因为内存不足（OOM）而终止进程。
如果内存配置过量且所有物理内存都已耗尽，则换页性能就会降低。

<!--
You can place bounds on memory use for workloads using the kubelet
parameters `--kubelet-reserve` and/or `--system-reserve`; these account
for memory usage on the node (outside of containers), and reduce
[NodeAllocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).
As you deploy workloads, set resource limits on containers. This also subtracts from `NodeAllocatable` and prevents the scheduler from adding more pods once a node is full.
-->
你可以使用 kubelet 的 `--kubelet-reserve` 和/或 `--system-reserve`
参数设定工作负载的内存使用边界；这些参数负责表示节点上（容器外）的内存用量，并会减少
[节点可分配（NodeAllocatable）](/zh/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)内存量。
在你部署工作负载时，会对容器设置资源限制值。
这个限制值也会从 `NodeAllocatable` 中减去，并防止调度器在节点已满时增加更多 Pod。

<!--
When you set memory resource limits for Windows containers, you should either set a limit and leave the memory request unspecified, or set the request equal to the limit.

On Windows, good practice to avoid over-provisioning is to configure the kubelet
with a system reserved memory of at least 2GiB to account for Windows, Kubernetes
and container runtime overheads.
-->
{{< note >}} 
当你为 Windows 容器设置内存资源限制时，你应设置一个内存限制但不指定内存请求，
或将请求值设为等于限制值。
{{< /note >}}

在 Windows 上，避免过量配置的良好做法是为 kubelet 配置至少 2GiB 的系统预留内存，
以满足 Windows、Kubernetes 和容器运行时开销。

<!--
## CPU reservations {#resource-management-cpu}

To account for CPU use by the operating system, the container runtime, and by
Kubernetes host processes such as the kubelet, you can (and should) reserve a
percentage of total CPU. You should determine this CPU reservation taking account of to the number of CPU cores available on the node. To decide on the CPU percentage to reserve, identify the maximum pod density for each node and monitor the CPU usage of the system services running there, then choose a value that meets your workload needs.
-->
## CPU 预留 {#resource-management-cpu}

为了满足操作系统、容器运行时和 kubelet 等 Kubernetes 主机进程的 CPU 使用量，
你可以（且应该）从 CPU 总量中预留一定百分比。
你应该根据节点上可用的 CPU 核数来确定这个 CPU 预留量。
要决定预留的 CPU 百分比，需确定每个节点的最大 Pod 密度，
并监控节点上运行的系统服务的 CPU 使用量，然后选择一个满足工作负载需求的值。

<!--
You can place bounds on CPU usage for workloads using the
kubelet parameters `--kubelet-reserve` and/or `--system-reserve` to
account for CPU usage on the node (outside of containers).
This reduces `NodeAllocatable`.
The cluster-wide scheduler then takes this reservation into account when determining pod placement.

On Windows, the kubelet supports a command-line flag to set the priority of the
kubelet process: `--windows-priorityclass`. This flag allows the kubelet process to get more CPU time slices when compared to other processes running on the Windows host.
More information on the allowable values and their meaning is available at
[Windows Priority Classes](https://docs.microsoft.com/en-us/windows/win32/procthread/scheduling-priorities#priority-class).
To ensure that running Pods do not starve the kubelet of CPU cycles, set this flag to `ABOVE_NORMAL_PRIORITY_CLASS` or above.
-->
你可以使用 kubelet 的 `--kubelet-reserve` 和/或 `--system-reserve`
参数设定工作负载的 CPU 使用边界，以统计节点上（容器外）的 CPU 使用量。
这会减少 `NodeAllocatable`。
然后集群范围的调度器在决定放置 Pod 时会考虑这个预留量。

在 Windows 上，kubelet 支持使用命令行标志来设置 kubelet 进程的优先级：`--windows-priorityclass`。
与 Windows 主机上运行的其他进程相比，此标志允许 kubelet 进程获取更多的 CPU 时间片。
有关允许值及其含义的更多信息，请访问 [Windows 优先级类](https://docs.microsoft.com/zh-cn/windows/win32/procthread/scheduling-priorities#priority-class)。
为了确保运行的 Pod 不会耗尽 kubelet 的 CPU 时钟周期，
要将此标志设置为 `ABOVE_NORMAL_PRIORITY_CLASS` 或更高。
