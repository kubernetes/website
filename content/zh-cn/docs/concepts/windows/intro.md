---
title: Kubernetes 中的 Windows 容器
content_type: concept
weight: 65
---
<!--
reviewers:
- jayunit100
- jsturtevant
- marosset
- perithompson
title: Windows containers in Kubernetes
content_type: concept
weight: 65
-->

<!-- overview -->
<!--
Windows applications constitute a large portion of the services and applications that
run in many organizations. [Windows containers](https://aka.ms/windowscontainers)
provide a way to encapsulate processes and package dependencies, making it easier
to use DevOps practices and follow cloud native patterns for Windows applications.

Organizations with investments in Windows-based applications and Linux-based
applications don't have to look for separate orchestrators to manage their workloads,
leading to increased operational efficiencies across their deployments, regardless
of operating system.
-->
在许多组织中，所运行的很大一部分服务和应用是 Windows 应用。
[Windows 容器](https://aka.ms/windowscontainers)提供了一种封装进程和包依赖项的方式，
从而简化了 DevOps 实践，令 Windows 应用同样遵从云原生模式。

对于同时投入基于 Windows 应用和 Linux 应用的组织而言，他们不必寻找不同的编排系统来管理其工作负载，
使其跨部署的运营效率得以大幅提升，而不必关心所用的操作系统。

<!-- body -->

<!--
## Windows nodes in Kubernetes

To enable the orchestration of Windows containers in Kubernetes, include Windows nodes
in your existing Linux cluster. Scheduling Windows containers in
{{< glossary_tooltip text="Pods" term_id="pod" >}} on Kubernetes is similar to
scheduling Linux-based containers.

In order to run Windows containers, your Kubernetes cluster must include
multiple operating systems.
While you can only run the {{< glossary_tooltip text="control plane" term_id="control-plane" >}} on Linux,
you can deploy worker nodes running either Windows or Linux.
-->
## Kubernetes 中的 Windows 节点   {#windows-nodes-in-k8s}

若要在 Kubernetes 中启用对 Windows 容器的编排，可以在现有的 Linux 集群中包含 Windows 节点。
在 Kubernetes 上调度 {{< glossary_tooltip text="Pod" term_id="pod" >}} 中的 Windows 容器与调度基于 Linux 的容器类似。

为了运行 Windows 容器，你的 Kubernetes 集群必须包含多个操作系统。
尽管你只能在 Linux 上运行{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}，
你可以部署运行 Windows 或 Linux 的工作节点。

<!--
Windows {{< glossary_tooltip text="nodes" term_id="node" >}} are
[supported](#windows-os-version-support) provided that the operating system is
Windows Server 2019 or Windows Server 2022.

This document uses the term *Windows containers* to mean Windows containers with
process isolation. Kubernetes does not support running Windows containers with
[Hyper-V isolation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container).
-->
支持 Windows {{< glossary_tooltip text="节点" term_id="node" >}}的前提是操作系统为
Windows Server 2019 或 Windows Server 2022。

本文使用术语 **Windows 容器**表示具有进程隔离能力的 Windows 容器。
Kubernetes 不支持使用
[Hyper-V 隔离能力](https://docs.microsoft.com/zh-cn/virtualization/windowscontainers/manage-containers/hyperv-container)来运行
Windows 容器。

<!--
## Compatibility and limitations {#limitations}

Some node features are only available if you use a specific
[container runtime](#container-runtime); others are not available on Windows nodes,
including:

* HugePages: not supported for Windows containers
* Privileged containers: not supported for Windows containers.
  [HostProcess Containers](/docs/tasks/configure-pod-container/create-hostprocess-pod/) offer similar functionality.
* TerminationGracePeriod: requires containerD
-->
## 兼容性与局限性   {#limitations}

某些节点层面的功能特性仅在使用特定[容器运行时](#container-runtime)时才可用；
另外一些特性则在 Windows 节点上不可用，包括：

* 巨页（HugePages）：Windows 容器当前不支持。
* 特权容器：Windows 容器当前不支持。
  [HostProcess 容器](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod/)提供类似功能。
* TerminationGracePeriod：需要 containerD。

<!--
Not all features of shared namespaces are supported. See [API compatibility](#api)
for more details.

See [Windows OS version compatibility](#windows-os-version-support) for details on
the Windows versions that Kubernetes is tested against.

From an API and kubectl perspective, Windows containers behave in much the same
way as Linux-based containers. However, there are some notable differences in key
functionality which are outlined in this section.
-->
Windows 节点并不支持共享命名空间的所有功能特性。
有关更多详细信息，请参考 [API 兼容性](#api)。

有关 Kubernetes 测试时所使用的 Windows 版本的详细信息，请参考
[Windows 操作系统版本兼容性](#windows-os-version-support)。

从 API 和 kubectl 的角度来看，Windows 容器的行为与基于 Linux 的容器非常相似。
然而，在本节所概述的一些关键功能上，二者存在一些显著差异。

<!--
### Comparison with Linux {#compatibility-linux-similarities}

Key Kubernetes elements work the same way in Windows as they do in Linux. This
section refers to several key workload abstractions and how they map to Windows.
-->
### 与 Linux 比较   {#comparison-with-Linux-similarities}

Kubernetes 关键组件在 Windows 上的工作方式与在 Linux 上相同。
本节介绍几个关键的工作负载抽象及其如何映射到 Windows。

<!--
* [Pods](/docs/concepts/workloads/pods/)

  A Pod is the basic building block of Kubernetes–the smallest and simplest unit in
  the Kubernetes object model that you create or deploy. You may not deploy Windows and
  Linux containers in the same Pod. All containers in a Pod are scheduled onto a single
  Node where each Node represents a specific platform and architecture. The following
  Pod capabilities, properties and events are supported with Windows containers:
-->
* [Pod](/zh-cn/docs/concepts/workloads/pods/)

  Pod 是 Kubernetes 的基本构建块，是可以创建或部署的最小和最简单的单元。
  你不可以在同一个 Pod 中部署 Windows 和 Linux 容器。
  Pod 中的所有容器都调度到同一 Node 上，每个 Node 代表一个特定的平台和体系结构。
  Windows 容器支持以下 Pod 能力、属性和事件：

  <!--
  * Single or multiple containers per Pod with process isolation and volume sharing
  * Pod `status` fields
  * Readiness, liveness, and startup probes
  * postStart & preStop container lifecycle hooks
  * ConfigMap, Secrets: as environment variables or volumes
  * `emptyDir` volumes
  * Named pipe host mounts
  * Resource limits
  -->
  * 每个 Pod 有一个或多个容器，具有进程隔离和卷共享能力
  * Pod `status` 字段
  * 就绪、存活和启动探针
  * postStart 和 preStop 容器生命周期回调
  * ConfigMap 和 Secret：作为环境变量或卷
  * `emptyDir` 卷
  * 命名管道形式的主机挂载
  * 资源限制
  <!--
  * OS field:

    The `.spec.os.name` field should be set to `windows` to indicate that the current Pod uses Windows containers.
  -->
  * 操作系统字段：

    `.spec.os.name` 字段应设置为 `windows` 以表明当前 Pod 使用 Windows 容器。

    <!--
    If you set the `.spec.os.name` field to `windows`,
    you must not set the following fields in the `.spec` of that Pod:
    -->
    如果你将 `.spec.os.name` 字段设置为 `windows`，
    则你必须不能在对应 Pod 的 `.spec` 中设置以下字段：

    * `spec.hostPID`
    * `spec.hostIPC`
    * `spec.securityContext.seLinuxOptions`
    * `spec.securityContext.seccompProfile`
    * `spec.securityContext.fsGroup`
    * `spec.securityContext.fsGroupChangePolicy`
    * `spec.securityContext.sysctls`
    * `spec.shareProcessNamespace`
    * `spec.securityContext.runAsUser`
    * `spec.securityContext.runAsGroup`
    * `spec.securityContext.supplementalGroups`
    * `spec.containers[*].securityContext.seLinuxOptions`
    * `spec.containers[*].securityContext.seccompProfile`
    * `spec.containers[*].securityContext.capabilities`
    * `spec.containers[*].securityContext.readOnlyRootFilesystem`
    * `spec.containers[*].securityContext.privileged`
    * `spec.containers[*].securityContext.allowPrivilegeEscalation`
    * `spec.containers[*].securityContext.procMount`
    * `spec.containers[*].securityContext.runAsUser`
    * `spec.containers[*].securityContext.runAsGroup`

    <!--
    In the above list, wildcards (`*`) indicate all elements in a list.
    For example, `spec.containers[*].securityContext` refers to the SecurityContext object
    for all containers. If any of these fields is specified, the Pod will
    not be admitted by the API server.
    -->
    在上述列表中，通配符（`*`）表示列表中的所有项。
    例如，`spec.containers[*].securityContext` 指代所有容器的 SecurityContext 对象。
    如果指定了这些字段中的任意一个，则 API 服务器不会接受此 Pod。

<!--
* [Workload resources](/docs/concepts/workloads/controllers/) including:
  * ReplicaSet
  * Deployment
  * StatefulSet
  * DaemonSet
  * Job
  * CronJob
  * ReplicationController
* {{< glossary_tooltip text="Services" term_id="service" >}}
  See [Load balancing and Services](/docs/concepts/services-networking/windows-networking/#load-balancing-and-services) for more details.
-->
* [工作负载资源](/zh-cn/docs/concepts/workloads/controllers/)包括：
  
  * ReplicaSet
  * Deployment
  * StatefulSet
  * DaemonSet
  * Job
  * CronJob
  * ReplicationController

* {{< glossary_tooltip text="Services" term_id="service" >}}

  有关更多详细信息，请参考[负载均衡和 Service](/zh-cn/docs/concepts/services-networking/windows-networking/#load-balancing-and-services)。

<!--
Pods, workload resources, and Services are critical elements to managing Windows
workloads on Kubernetes. However, on their own they are not enough to enable
the proper lifecycle management of Windows workloads in a dynamic cloud native
environment.

* `kubectl exec`
* Pod and container metrics
* {{< glossary_tooltip text="Horizontal pod autoscaling" term_id="horizontal-pod-autoscaler" >}}
* {{< glossary_tooltip text="Resource quotas" term_id="resource-quota" >}}
* Scheduler preemption
-->
Pod、工作负载资源和 Service 是在 Kubernetes 上管理 Windows 工作负载的关键元素。
然而，它们本身还不足以在动态的云原生环境中对 Windows 工作负载进行恰当的生命周期管理。

* `kubectl exec`
* Pod 和容器度量指标
* {{< glossary_tooltip text="Pod 水平自动扩缩容" term_id="horizontal-pod-autoscaler" >}}
* {{< glossary_tooltip text="资源配额" term_id="resource-quota" >}}
* 调度器抢占

<!--
### Command line options for the kubelet {#kubelet-compatibility}

Some kubelet command line options behave differently on Windows, as described below:
-->
### kubelet 的命令行选项   {#kubelet-compatibility}

某些 kubelet 命令行选项在 Windows 上的行为不同，如下所述：

<!--
* The `--windows-priorityclass` lets you set the scheduling priority of the kubelet process
  (see [CPU resource management](/docs/concepts/configuration/windows-resource-management/#resource-management-cpu))
* The `--kube-reserved`, `--system-reserved` , and `--eviction-hard` flags update
  [NodeAllocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
* Eviction by using `--enforce-node-allocable` is not implemented
* When running on a Windows node the kubelet does not have memory or CPU
  restrictions. `--kube-reserved` and `--system-reserved` only subtract from `NodeAllocatable`
  and do not guarantee resource provided for workloads.
  See [Resource Management for Windows nodes](/docs/concepts/configuration/windows-resource-management/#resource-reservation)
  for more information.
* The `PIDPressure` Condition is not implemented
* The kubelet does not take OOM eviction actions
-->
* `--windows-priorityclass` 允许你设置 kubelet 进程的调度优先级
  （参考 [CPU 资源管理](/zh-cn/docs/concepts/configuration/windows-resource-management/#resource-management-cpu)）。
* `--kube-reserved`、`--system-reserved` 和 `--eviction-hard` 标志更新
  [NodeAllocatable](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)。
* 未实现使用 `--enforce-node-allocable` 驱逐。
* 在 Windows 节点上运行时，kubelet 没有内存或 CPU 限制。
  `--kube-reserved` 和 `--system-reserved` 仅从 `NodeAllocatable` 中减去，并且不保证为工作负载提供的资源。
  有关更多信息，请参考 [Windows 节点的资源管理](/zh-cn/docs/concepts/configuration/windows-resource-management/#resource-reservation)。
* 未实现 `PIDPressure` 条件。
* kubelet 不会执行 OOM 驱逐操作。

<!--
### API compatibility {#api}

There are subtle differences in the way the Kubernetes APIs work for Windows due to the OS
and container runtime. Some workload properties were designed for Linux, and fail to run on Windows.

At a high level, these OS concepts are different:
-->
### API 兼容性   {#api}

由于操作系统和容器运行时的缘故，Kubernetes API 在 Windows 上的工作方式存在细微差异。
某些工作负载属性是为 Linux 设计的，无法在 Windows 上运行。

从较高的层面来看，以下操作系统概念是不同的：

<!--
* Identity - Linux uses userID (UID) and groupID (GID) which
  are represented as integer types. User and group names
  are not canonical - they are just an alias in `/etc/groups`
  or `/etc/passwd` back to UID+GID. Windows uses a larger binary
  [security identifier](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/security-identifiers) (SID)
  which is stored in the Windows Security Access Manager (SAM) database. This
  database is not shared between the host and containers, or between containers.
* File permissions - Windows uses an access control list based on (SIDs), whereas
  POSIX systems such as Linux use a bitmask based on object permissions and UID+GID,
  plus _optional_ access control lists.
* File paths - the convention on Windows is to use `\` instead of `/`. The Go IO
  libraries typically accept both and just make it work, but when you're setting a
  path or command line that's interpreted inside a container, `\` may be needed.
-->
* 身份 - Linux 使用 userID（UID）和 groupID（GID），表示为整数类型。
  用户名和组名是不规范的，它们只是 `/etc/groups` 或 `/etc/passwd` 中的别名，
  作为 UID+GID 的后备标识。
  Windows 使用更大的二进制[安全标识符](https://docs.microsoft.com/zh-cn/windows/security/identity-protection/access-control/security-identifiers)（SID），
  存放在 Windows 安全访问管理器（Security Access Manager，SAM）数据库中。
  此数据库在主机和容器之间或容器之间不共享。
* 文件权限 - Windows 使用基于 SID 的访问控制列表，
  而像 Linux 使用基于对象权限和 UID+GID 的位掩码（POSIX 系统）以及**可选的**访问控制列表。
* 文件路径 - Windows 上的约定是使用 `\` 而不是 `/`。
  Go IO 库通常接受两者，能让其正常工作，但当你设置要在容器内解读的路径或命令行时，
  可能需要用 `\`。

<!--
* Signals - Windows interactive apps handle termination differently, and can
  implement one or more of these:
  * A UI thread handles well-defined messages including `WM_CLOSE`.
  * Console apps handle Ctrl-C or Ctrl-break using a Control Handler.
  * Services register a Service Control Handler function that can accept
    `SERVICE_CONTROL_STOP` control codes.

Container exit codes follow the same convention where 0 is success, and nonzero is failure.
The specific error codes may differ across Windows and Linux. However, exit codes
passed from the Kubernetes components (kubelet, kube-proxy) are unchanged.
-->
* 信号 - Windows 交互式应用处理终止的方式不同，可以实现以下一种或多种：
  * UI 线程处理包括 `WM_CLOSE` 在内准确定义的消息。
  * 控制台应用使用控制处理程序（Control Handler）处理 Ctrl-C 或 Ctrl-Break。
  * 服务会注册可接受 `SERVICE_CONTROL_STOP` 控制码的服务控制处理程序（Service Control Handler）函数。

容器退出码遵循相同的约定，其中 0 表示成功，非零表示失败。
具体的错误码在 Windows 和 Linux 中可能不同。
但是，从 Kubernetes 组件（kubelet、kube-proxy）传递的退出码保持不变。

<!--
#### Field compatibility for container specifications {#compatibility-v1-pod-spec-containers}

The following list documents differences between how Pod container specifications
work between Windows and Linux:

* Huge pages are not implemented in the Windows container
  runtime, and are not available. They require [asserting a user
  privilege](https://docs.microsoft.com/en-us/windows/desktop/Memory/large-page-support)
  that's not configurable for containers.
* `requests.cpu` and `requests.memory` - requests are subtracted
  from node available resources, so they can be used to avoid overprovisioning a
  node. However, they cannot be used to guarantee resources in an overprovisioned
  node. They should be applied to all containers as a best practice if the operator
  wants to avoid overprovisioning entirely.
-->
#### 容器规约的字段兼容性   {#compatibility-v1-pod-spec-containers}

以下列表记录了 Pod 容器规约在 Windows 和 Linux 之间的工作方式差异：

* 巨页（Huge page）在 Windows 容器运行时中未实现，且不可用。
  巨页需要不可为容器配置的[用户特权生效](https://docs.microsoft.com/zh-cn/windows/win32/memory/large-page-support)。
* `requests.cpu` 和 `requests.memory` -
  从节点可用资源中减去请求，因此请求可用于避免一个节点过量供应。
  但是，请求不能用于保证已过量供应的节点中的资源。
  如果运营商想要完全避免过量供应，则应将设置请求作为最佳实践应用到所有容器。
<!--
* `securityContext.allowPrivilegeEscalation` -
   not possible on Windows; none of the capabilities are hooked up
* `securityContext.capabilities` -
   POSIX capabilities are not implemented on Windows
* `securityContext.privileged` -
   Windows doesn't support privileged containers, use [HostProcess Containers](/docs/tasks/configure-pod-container/create-hostprocess-pod/) instead
* `securityContext.procMount` -
   Windows doesn't have a `/proc` filesystem
* `securityContext.readOnlyRootFilesystem` -
   not possible on Windows; write access is required for registry & system
   processes to run inside the container
* `securityContext.runAsGroup` -
   not possible on Windows as there is no GID support
-->  
* `securityContext.allowPrivilegeEscalation` -
  不能在 Windows 上使用；所有权能字都无法生效。
* `securityContext.capabilities` - POSIX 权能未在 Windows 上实现。
* `securityContext.privileged` - Windows 不支持特权容器，
  可使用 [HostProcess 容器](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod/)代替。
* `securityContext.procMount` - Windows 没有 `/proc` 文件系统。
* `securityContext.readOnlyRootFilesystem` -
  不能在 Windows 上使用；对于容器内运行的注册表和系统进程，写入权限是必需的。
* `securityContext.runAsGroup` - 不能在 Windows 上使用，因为不支持 GID。
<!--
* `securityContext.runAsNonRoot` -
   this setting will prevent containers from running as `ContainerAdministrator`
   which is the closest equivalent to a root user on Windows.
* `securityContext.runAsUser` -
   use [`runAsUserName`](/docs/tasks/configure-pod-container/configure-runasusername)
   instead
* `securityContext.seLinuxOptions` -
   not possible on Windows as SELinux is Linux-specific
* `terminationMessagePath` -
   this has some limitations in that Windows doesn't support mapping single files. The
   default value is `/dev/termination-log`, which does work because it does not
   exist on Windows by default.
-->
* `securityContext.runAsNonRoot` -
  此设置将阻止以 `ContainerAdministrator` 身份运行容器，这是 Windows 上与 root 用户最接近的身份。
* `securityContext.runAsUser` - 改用 [`runAsUserName`](/zh-cn/docs/tasks/configure-pod-container/configure-runasusername)。
* `securityContext.seLinuxOptions` - 不能在 Windows 上使用，因为 SELinux 特定于 Linux。
* `terminationMessagePath` - 这个字段有一些限制，因为 Windows 不支持映射单个文件。
  默认值为 `/dev/termination-log`，因为默认情况下它在 Windows 上不存在，所以能生效。

<!--
#### Field compatibility for Pod specifications {#compatibility-v1-pod}

The following list documents differences between how Pod specifications work between Windows and Linux:

* `hostIPC` and `hostpid` - host namespace sharing is not possible on Windows
* `hostNetwork` - [see below](#compatibility-v1-pod-spec-containers-hostnetwork)
* `dnsPolicy` - setting the Pod `dnsPolicy` to `ClusterFirstWithHostNet` is
   not supported on Windows because host networking is not provided. Pods always
   run with a container network.
* `podSecurityContext` [see below](#compatibility-v1-pod-spec-containers-securitycontext)
* `shareProcessNamespace` - this is a beta feature, and depends on Linux namespaces
  which are not implemented on Windows. Windows cannot share process namespaces or
  the container's root filesystem. Only the network can be shared.
-->
#### Pod 规约的字段兼容性   {#compatibility-v1-pod}

以下列表记录了 Pod 规约在 Windows 和 Linux 之间的工作方式差异：

* `hostIPC` 和 `hostpid` - 不能在 Windows 上共享主机命名空间。
* `hostNetwork` - [参见下文](#compatibility-v1-pod-spec-containers-hostnetwork)
* `dnsPolicy` - Windows 不支持将 Pod `dnsPolicy` 设为 `ClusterFirstWithHostNet`，
  因为未提供主机网络。Pod 始终用容器网络运行。
* `podSecurityContext` [参见下文](#compatibility-v1-pod-spec-containers-securitycontext)
* `shareProcessNamespace` - 这是一个 Beta 版功能特性，依赖于 Windows 上未实现的 Linux 命名空间。
  Windows 无法共享进程命名空间或容器的根文件系统（root filesystem）。
  只能共享网络。
<!--
* `terminationGracePeriodSeconds` - this is not fully implemented in Docker on Windows,
  see the [GitHub issue](https://github.com/moby/moby/issues/25982).
  The behavior today is that the ENTRYPOINT process is sent CTRL_SHUTDOWN_EVENT,
  then Windows waits 5 seconds by default, and finally shuts down
  all processes using the normal Windows shutdown behavior. The 5
  second default is actually in the Windows registry
  [inside the container](https://github.com/moby/moby/issues/25982#issuecomment-426441183),
  so it can be overridden when the container is built.
* `volumeDevices` - this is a beta feature, and is not implemented on Windows.
  Windows cannot attach raw block devices to pods.
* `volumes`
  * If you define an `emptyDir` volume, you cannot set its volume source to `memory`.
* You cannot enable `mountPropagation` for volume mounts as this is not
  supported on Windows.
-->
* `terminationGracePeriodSeconds` - 这在 Windows 上的 Docker 中没有完全实现，
  请参考 [GitHub issue](https://github.com/moby/moby/issues/25982)。
  目前的行为是通过 CTRL_SHUTDOWN_EVENT 发送 ENTRYPOINT 进程，然后 Windows 默认等待 5 秒，
  最后使用正常的 Windows 关机行为终止所有进程。
  5 秒默认值实际上位于[容器内](https://github.com/moby/moby/issues/25982#issuecomment-426441183)的
  Windows 注册表中，因此在构建容器时可以覆盖这个值。
* `volumeDevices` - 这是一个 Beta 版功能特性，未在 Windows 上实现。
  Windows 无法将原始块设备挂接到 Pod。
* `volumes`
  * 如果你定义一个 `emptyDir` 卷，则你无法将卷源设为 `memory`。
* 你无法为卷挂载启用 `mountPropagation`，因为这在 Windows 上不支持。

<!--
#### Field compatibility for hostNetwork {#compatibility-v1-pod-spec-containers-hostnetwork}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

The kubelet can now request that pods running on Windows nodes use the host's network namespace instead
of creating a new pod network namespace. To enable this functionality pass `--feature-gates=WindowsHostNetwork=true` to the kubelet.
-->
#### hostNetwork 的字段兼容性   {#compatibility-v1-pod-spec-containers-hostnetwork}

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

现在，kubelet 可以请求在 Windows 节点上运行的 Pod 使用主机的网络命名空间，而不是创建新的 Pod 网络命名空间。
要启用此功能，请将 `--feature-gates=WindowsHostNetwork=true` 传递给 kubelet。

{{< note >}}
<!-- 
This functionality requires a container runtime that supports this functionality.
-->
此功能需要支持该功能的容器运行时。
{{< /note >}}

<!--
#### Field compatibility for Pod security context {#compatibility-v1-pod-spec-containers-securitycontext}

Only the `securityContext.runAsNonRoot` and `securityContext.windowsOptions` from the Pod
[`securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) fields work on Windows.
-->
#### Pod 安全上下文的字段兼容性   {#compatibility-v1-pod-spec-containers-securitycontext}

Pod 的 [`securityContext`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
中只有 `securityContext.runAsNonRoot` 和 `securityContext.windowsOptions` 字段在 Windows 上生效。

<!--
## Node problem detector

The node problem detector (see
[Monitor Node Health](/docs/tasks/debug/debug-cluster/monitor-node-health/))
has preliminary support for Windows.
For more information, visit the project's [GitHub page](https://github.com/kubernetes/node-problem-detector#windows).
-->
## 节点问题检测器   {#node-problem-detector}

节点问题检测器（参考[节点健康监测](/zh-cn/docs/tasks/debug/debug-cluster/monitor-node-health/)）初步支持 Windows。
有关更多信息，请访问该项目的 [GitHub 页面](https://github.com/kubernetes/node-problem-detector#windows)。

<!--
## Pause container

In a Kubernetes Pod, an infrastructure or “pause” container is first created
to host the container. In Linux, the cgroups and namespaces that make up a pod
need a process to maintain their continued existence; the pause process provides
this. Containers that belong to the same pod, including infrastructure and worker
containers, share a common network endpoint (same IPv4 and / or IPv6 address, same
network port spaces). Kubernetes uses pause containers to allow for worker containers
crashing or restarting without losing any of the networking configuration.
-->
## Pause 容器   {#pause-container}

在 Kubernetes Pod 中，首先创建一个基础容器或 “pause” 容器来承载容器。
在 Linux 中，构成 Pod 的 cgroup 和命名空间维持持续存在需要一个进程；
而 pause 进程就提供了这个功能。
属于同一 Pod 的容器（包括基础容器和工作容器）共享一个公共网络端点
（相同的 IPv4 和/或 IPv6 地址，相同的网络端口空间）。
Kubernetes 使用 pause 容器以允许工作容器崩溃或重启，而不会丢失任何网络配置。

<!--
Kubernetes maintains a multi-architecture image that includes support for Windows.
For Kubernetes v{{< skew currentPatchVersion >}} the recommended pause image is `registry.k8s.io/pause:3.6`.
The [source code](https://github.com/kubernetes/kubernetes/tree/master/build/pause)
is available on GitHub.

Microsoft maintains a different multi-architecture image, with Linux and Windows
amd64 support, that you can find as `mcr.microsoft.com/oss/kubernetes/pause:3.6`.
This image is built from the same source as the Kubernetes maintained image but
all of the Windows binaries are [authenticode signed](https://docs.microsoft.com/en-us/windows-hardware/drivers/install/authenticode) by Microsoft.
The Kubernetes project recommends using the Microsoft maintained image if you are
deploying to a production or production-like environment that requires signed
binaries.
-->
Kubernetes 维护一个多体系结构的镜像，包括对 Windows 的支持。
对于 Kubernetes v{{< skew currentPatchVersion >}}，推荐的 pause 镜像为 `registry.k8s.io/pause:3.6`。
可在 GitHub 上获得[源代码](https://github.com/kubernetes/kubernetes/tree/master/build/pause)。

Microsoft 维护一个不同的多体系结构镜像，支持 Linux 和 Windows amd64，
你可以找到的镜像类似 `mcr.microsoft.com/oss/kubernetes/pause:3.6`。
此镜像的构建与 Kubernetes 维护的镜像同源，但所有 Windows 可执行文件均由
Microsoft 进行了[验证码签名](https://docs.microsoft.com/zh-cn/windows-hardware/drivers/install/authenticode)。
如果你正部署到一个需要签名可执行文件的生产或类生产环境，
Kubernetes 项目建议使用 Microsoft 维护的镜像。

<!--
## Container runtimes {#container-runtime}

You need to install a
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
into each node in the cluster so that Pods can run there.

The following container runtimes work with Windows:
-->
## 容器运行时   {#container-runtime}

你需要将{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}安装到集群中的每个节点，
这样 Pod 才能在这些节点上运行。

以下容器运行时适用于 Windows：

{{% thirdparty-content %}}

<!--
### ContainerD

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

You can use {{< glossary_tooltip term_id="containerd" text="ContainerD" >}} 1.4.0+
as the container runtime for Kubernetes nodes that run Windows.

Learn how to [install ContainerD on a Windows node](/docs/setup/production-environment/container-runtimes/#containerd).
-->
### ContainerD

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

对于运行 Windows 的 Kubernetes 节点，你可以使用
{{< glossary_tooltip term_id="containerd" text="ContainerD" >}} 1.4.0+ 作为容器运行时。

学习如何[在 Windows 上安装 ContainerD](/zh-cn/docs/setup/production-environment/container-runtimes/#containerd)。

{{< note >}}
<!--
There is a [known limitation](/docs/tasks/configure-pod-container/configure-gmsa/#gmsa-limitations)
when using GMSA with containerd to access Windows network shares, which requires a
kernel patch.
-->
将 GMSA 和 containerd 一起用于访问 Windows
网络共享时存在[已知限制](/zh-cn/docs/tasks/configure-pod-container/configure-gmsa/#gmsa-limitations)，
这需要一个内核补丁。
{{< /note >}}

<!--
### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html) (MCR)
is available as a container runtime for all Windows Server 2019 and later versions.

See [Install MCR on Windows Servers](https://docs.mirantis.com/mcr/20.10/install/mcr-windows.html) for more information.
-->
### Mirantis 容器运行时   {#mcr}

[Mirantis 容器运行时](https://docs.mirantis.com/mcr/20.10/overview.html)（MCR）
可作为所有 Windows Server 2019 和更高版本的容器运行时。

有关更多信息，请参考[在 Windows Server 上安装 MCR](https://docs.mirantis.com/mcr/20.10/install/mcr-windows.html)。

<!--
## Windows OS version compatibility {#windows-os-version-support}

On Windows nodes, strict compatibility rules apply where the host OS version must
match the container base image OS version. Only Windows containers with a container
operating system of Windows Server 2019 are fully supported.

For Kubernetes v{{< skew currentVersion >}}, operating system compatibility for Windows nodes (and Pods)
is as follows:
-->
## Windows 操作系统版本兼容性   {#windows-os-version-support}

在 Windows 节点上，如果主机操作系统版本必须与容器基础镜像操作系统版本匹配，
则会应用严格的兼容性规则。
仅 Windows Server 2019 作为容器操作系统时，才能完全支持 Windows 容器。

对于 Kubernetes v{{< skew currentVersion >}}，Windows 节点（和 Pod）的操作系统兼容性如下：

Windows Server LTSC release
: Windows Server 2019
: Windows Server 2022

Windows Server SAC release
: Windows Server version 20H2

<!--
The Kubernetes [version-skew policy](/docs/setup/release/version-skew-policy/) also applies.
-->
也适用 Kubernetes [版本偏差策略](/zh-cn/releases/version-skew-policy/)。

<!--
## Hardware recommendations and considerations {#windows-hardware-recommendations}
-->
## 硬件建议和注意事项   {#windows-hardware-recommendations}

{{% thirdparty-content %}}

{{< note >}}
<!--
The following hardware specifications outlined here should be regarded as sensible default values. 
They are not intended to represent minimum requirements or specific recommendations for production environments.
Depending on the requirements for your workload these values may need to be adjusted.
-->
这里列出的硬件规格应被视为合理的默认值。
它们并不代表生产环境的最低要求或具体推荐。
根据你的工作负载要求，这些值可能需要进行调整。
{{< /note >}}

<!--
- 64-bit processor 4 CPU cores or more, capable of supporting virtualization
- 8GB or more of RAM
- 50GB or more of free disk space
-->
- 64 位处理器，4 核或更多的 CPU，能够支持虚拟化
- 8GB 或更多的 RAM
- 50GB 或更多的可用磁盘空间

<!--
Refer to
[Hardware requirements for Windows Server Microsoft documentation](https://learn.microsoft.com/en-us/windows-server/get-started/hardware-requirements)
for the most up-to-date information on minimum hardware requirements. For guidance on deciding on resources for
production worker nodes refer to [Production worker nodes Kubernetes documentation](https://kubernetes.io/docs/setup/production-environment/#production-worker-nodes).
-->
有关最新的最低硬件要求信息，
请参考[微软文档：Windows Server 的硬件要求](https://learn.microsoft.com/zh-cn/windows-server/get-started/hardware-requirements)。
有关决定生产工作节点资源的指导信息，
请参考 [Kubernetes 文档：生产用工作节点](https://kubernetes.io/zh-cn/docs/setup/production-environment/#production-worker-nodes)。

<!--
To optimize system resources, if a graphical user interface is not required,
it may be preferable to use a Windows Server OS installation that excludes
the [Windows Desktop Experience](https://learn.microsoft.com/en-us/windows-server/get-started/install-options-server-core-desktop-experience)
installation option, as this configuration typically frees up more system 
resources.
-->
为了优化系统资源，如果图形用户界面不是必需的，最好选择一个不包含
[Windows 桌面体验](https://learn.microsoft.com/zh-cn/windows-server/get-started/install-options-server-core-desktop-experience)安装选项的
Windows Server 操作系统安装包，因为这种配置通常会释放更多的系统资源。

<!--
In assessing disk space for Windows worker nodes, take note that Windows container images are typically larger than
Linux container images, with container image sizes ranging
from [300MB to over 10GB](https://techcommunity.microsoft.com/t5/containers/nano-server-x-server-core-x-server-which-base-image-is-the-right/ba-p/2835785)
for a single image. Additionally, take note that the `C:` drive in Windows containers represents a virtual free size of
20GB by default, which is not the actual consumed space, but rather the disk size for which a single container can grow
to occupy when using local storage on the host.
See [Containers on Windows - Container Storage Documentation](https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/container-storage#storage-limits)
for more detail.
-->
在估算 Windows 工作节点的磁盘空间时，需要注意 Windows 容器镜像通常比 Linux 容器镜像更大，
单个镜像的容器大小范围从 [300MB 到超过 10GB](https://techcommunity.microsoft.com/t5/containers/nano-server-x-server-core-x-server-which-base-image-is-the-right/ba-p/2835785)。
此外，需要注意 Windows 容器中的 `C:` 驱动器默认呈现的虚拟剩余空间为 20GB，
这不是实际的占用空间，而是使用主机上的本地存储时单个容器可以最多占用的磁盘大小。
有关更多详细信息，
请参见[在 Windows 上运行容器 - 容器存储文档](https://learn.microsoft.com/zh-cn/virtualization/windowscontainers/manage-containers/container-storage#storage-limits)。

<!--
## Getting help and troubleshooting {#troubleshooting}

Your main source of help for troubleshooting your Kubernetes cluster should start
with the [Troubleshooting](/docs/tasks/debug/)
page.

Some additional, Windows-specific troubleshooting help is included
in this section. Logs are an important element of troubleshooting
issues in Kubernetes. Make sure to include them any time you seek
troubleshooting assistance from other contributors. Follow the
instructions in the
SIG Windows [contributing guide on gathering logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs).
-->
## 获取帮助和故障排查   {#troubleshooting}

对 Kubernetes 集群进行故障排查的主要帮助来源应始于[故障排查](/zh-cn/docs/tasks/debug/)页面。

本节包括了一些其他特定于 Windows 的故障排查帮助。
日志是解决 Kubernetes 中问题的重要元素。
确保在任何时候向其他贡献者寻求故障排查协助时随附了日志信息。
遵照 SIG Windows
[日志收集贡献指南](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs)中的指示说明。

<!--
### Reporting issues and feature requests

If you have what looks like a bug, or you would like to
make a feature request, please follow the [SIG Windows contributing guide](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#reporting-issues-and-feature-requests) to create a new issue.
You should first search the list of issues in case it was
reported previously and comment with your experience on the issue and add additional
logs. SIG Windows channel on the Kubernetes Slack is also a great avenue to get some initial support and
troubleshooting ideas prior to creating a ticket.
-->
### 报告问题和功能请求   {#report-issue-and-feature-request}

如果你发现疑似 bug，或者你想提出功能请求，请按照
[SIG Windows 贡献指南](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#reporting-issues-and-feature-requests)
新建一个 Issue。你应该先搜索 Issue 列表，以防之前报告过这个问题，凭你对该问题的经验添加评论，
并随附日志信息。Kubernetes Slack 上的 SIG Windows 频道也是一个很好的途径，
可以在创建工单之前获得一些初始支持和故障排查思路。

<!--
### Validating the Windows cluster operability

The Kubernetes project provides a _Windows Operational Readiness_ specification,
accompanied by a structured test suite. This suite is split into two sets of tests,
core and extended, each containing categories aimed at testing specific areas.
It can be used to validate all the functionalities of a Windows and hybrid system
(mixed with Linux nodes) with full coverage.

To set up the project on a newly created cluster, refer to the instructions in the
[project guide](https://github.com/kubernetes-sigs/windows-operational-readiness/blob/main/README.md).
-->

### 验证 Windows 集群的操作性  {#validating-windows-cluster-operability}

Kubernetes 项目提供了 **Windows 操作准备**规范，配备了结构化的测试套件。
这个套件分为两组测试：核心和扩展。每组测试都包含了针对特定场景的分类测试。
它可以用来验证 Windows 和混合系统（混合了 Linux 节点）的所有功能，实现全面覆盖。

要在新创建的集群上搭建此项目，
请参考[项目指南](https://github.com/kubernetes-sigs/windows-operational-readiness/blob/main/README.md)中的说明。


<!--
## Deployment tools

The kubeadm tool helps you to deploy a Kubernetes cluster, providing the control
plane to manage the cluster it, and nodes to run your workloads.

The Kubernetes [cluster API](https://cluster-api.sigs.k8s.io/) project also provides means to automate deployment of Windows nodes.
-->
## 部署工具   {#deployment-tools}

kubeadm 工具帮助你部署 Kubernetes 集群，提供管理集群的控制平面以及运行工作负载的节点。

Kubernetes [集群 API](https://cluster-api.sigs.k8s.io/) 项目也提供了自动部署
Windows 节点的方式。

<!--
## Windows distribution channels

For a detailed explanation of Windows distribution channels see the
[Microsoft documentation](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19).

Information on the different Windows Server servicing channels
including their support models can be found at
[Windows Server servicing channels](https://docs.microsoft.com/en-us/windows-server/get-started/servicing-channels-comparison).
-->
## Windows 分发渠道   {#windows-distribution-channels}

有关 Windows 分发渠道的详细阐述，请参考
[Microsoft 文档](https://docs.microsoft.com/zh-cn/windows-server/get-started-19/servicing-channels-19)。

有关支持模型在内的不同 Windows Server 服务渠道的信息，请参考
[Windows Server 服务渠道](https://docs.microsoft.com/zh-cn/windows-server/get-started/servicing-channels-comparison)。
