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
在許多組織中，所運行的很大一部分服務和應用是 Windows 應用。
[Windows 容器](https://aka.ms/windowscontainers)提供了一種封裝進程和包依賴項的方式，
從而簡化了 DevOps 實踐，令 Windows 應用同樣遵從雲原生模式。

對於同時投入基於 Windows 應用和 Linux 應用的組織而言，他們不必尋找不同的編排系統來管理其工作負載，
使其跨部署的運營效率得以大幅提升，而不必關心所用的操作系統。

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
## Kubernetes 中的 Windows 節點   {#windows-nodes-in-k8s}

若要在 Kubernetes 中啓用對 Windows 容器的編排，可以在現有的 Linux 叢集中包含 Windows 節點。
在 Kubernetes 上調度 {{< glossary_tooltip text="Pod" term_id="pod" >}} 中的 Windows 容器與調度基於 Linux 的容器類似。

爲了運行 Windows 容器，你的 Kubernetes 叢集必須包含多個操作系統。
儘管你只能在 Linux 上運行{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}，
你可以部署運行 Windows 或 Linux 的工作節點。

<!--
Windows {{< glossary_tooltip text="nodes" term_id="node" >}} are
[supported](#windows-os-version-support) provided that the operating system is
Windows Server 2019 or Windows Server 2022.

This document uses the term *Windows containers* to mean Windows containers with
process isolation. Kubernetes does not support running Windows containers with
[Hyper-V isolation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container).
-->
支持 Windows {{< glossary_tooltip text="節點" term_id="node" >}}的前提是操作系統爲
Windows Server 2019 或 Windows Server 2022。

本文使用術語 **Windows 容器**表示具有進程隔離能力的 Windows 容器。
Kubernetes 不支持使用
[Hyper-V 隔離能力](https://docs.microsoft.com/zh-cn/virtualization/windowscontainers/manage-containers/hyperv-container)來運行
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
## 兼容性與侷限性   {#limitations}

某些節點層面的功能特性僅在使用特定[容器運行時](#container-runtime)時纔可用；
另外一些特性則在 Windows 節點上不可用，包括：

* 巨頁（HugePages）：Windows 容器當前不支持。
* 特權容器：Windows 容器當前不支持。
  [HostProcess 容器](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod/)提供類似功能。
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
Windows 節點並不支持共享命名空間的所有功能特性。
有關更多詳細資訊，請參考 [API 兼容性](#api)。

有關 Kubernetes 測試時所使用的 Windows 版本的詳細資訊，請參考
[Windows 操作系統版本兼容性](#windows-os-version-support)。

從 API 和 kubectl 的角度來看，Windows 容器的行爲與基於 Linux 的容器非常相似。
然而，在本節所概述的一些關鍵功能上，二者存在一些顯著差異。

<!--
### Comparison with Linux {#compatibility-linux-similarities}

Key Kubernetes elements work the same way in Windows as they do in Linux. This
section refers to several key workload abstractions and how they map to Windows.
-->
### 與 Linux 比較   {#comparison-with-Linux-similarities}

Kubernetes 關鍵組件在 Windows 上的工作方式與在 Linux 上相同。
本節介紹幾個關鍵的工作負載抽象及其如何映射到 Windows。

<!--
* [Pods](/docs/concepts/workloads/pods/)

  A Pod is the basic building block of Kubernetes–the smallest and simplest unit in
  the Kubernetes object model that you create or deploy. You may not deploy Windows and
  Linux containers in the same Pod. All containers in a Pod are scheduled onto a single
  Node where each Node represents a specific platform and architecture. The following
  Pod capabilities, properties and events are supported with Windows containers:
-->
* [Pod](/zh-cn/docs/concepts/workloads/pods/)

  Pod 是 Kubernetes 的基本構建塊，是可以創建或部署的最小和最簡單的單元。
  你不可以在同一個 Pod 中部署 Windows 和 Linux 容器。
  Pod 中的所有容器都調度到同一 Node 上，每個 Node 代表一個特定的平臺和體系結構。
  Windows 容器支持以下 Pod 能力、屬性和事件：

  <!--
  * Single or multiple containers per Pod with process isolation and volume sharing
  * Pod `status` fields
  * Readiness, liveness, and startup probes
  * postStart & preStop container lifecycle hooks
  * ConfigMap, Secrets: as environment variables or volumes
  * `emptyDir` volumes
  * Named pipe host mounts
  * Resource limits
  * OS field: 
  -->
  * 每個 Pod 有一個或多個容器，具有進程隔離和卷共享能力
  * Pod `status` 字段
  * 就緒、存活和啓動探針
  * postStart 和 preStop 容器生命週期回調
  * ConfigMap 和 Secret：作爲環境變量或卷
  * `emptyDir` 卷
  * 命名管道形式的主機掛載
  * 資源限制
  * 操作系統字段：

    <!--
    The `.spec.os.name` field should be set to `windows` to indicate that the current Pod uses Windows containers.

    If you set the `.spec.os.name` field to `windows`,
    you must not set the following fields in the `.spec` of that Pod:
    -->

    `.spec.os.name` 字段應設置爲 `windows` 以表明當前 Pod 使用 Windows 容器。

    如果你將 `.spec.os.name` 字段設置爲 `windows`，
    則你必須不能在對應 Pod 的 `.spec` 中設置以下字段：

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

    在上述列表中，通配符（`*`）表示列表中的所有項。
    例如，`spec.containers[*].securityContext` 指代所有容器的 SecurityContext 對象。
    如果指定了這些字段中的任意一個，則 API 伺服器不會接受此 Pod。

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
* [工作負載資源](/zh-cn/docs/concepts/workloads/controllers/)包括：
  
  * ReplicaSet
  * Deployment
  * StatefulSet
  * DaemonSet
  * Job
  * CronJob
  * ReplicationController

* {{< glossary_tooltip text="Services" term_id="service" >}}

  有關更多詳細資訊，請參考[負載均衡和 Service](/zh-cn/docs/concepts/services-networking/windows-networking/#load-balancing-and-services)。

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
Pod、工作負載資源和 Service 是在 Kubernetes 上管理 Windows 工作負載的關鍵元素。
然而，它們本身還不足以在動態的雲原生環境中對 Windows 工作負載進行恰當的生命週期管理。

* `kubectl exec`
* Pod 和容器度量指標
* {{< glossary_tooltip text="Pod 水平自動擴縮容" term_id="horizontal-pod-autoscaler" >}}
* {{< glossary_tooltip text="資源配額" term_id="resource-quota" >}}
* 調度器搶佔

<!--
### Command line options for the kubelet {#kubelet-compatibility}

Some kubelet command line options behave differently on Windows, as described below:
-->
### kubelet 的命令列選項   {#kubelet-compatibility}

某些 kubelet 命令列選項在 Windows 上的行爲不同，如下所述：

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
* `--windows-priorityclass` 允許你設置 kubelet 進程的調度優先級
  （參考 [CPU 資源管理](/zh-cn/docs/concepts/configuration/windows-resource-management/#resource-management-cpu)）。
* `--kube-reserved`、`--system-reserved` 和 `--eviction-hard` 標誌更新
  [NodeAllocatable](/zh-cn/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)。
* 未實現使用 `--enforce-node-allocable` 驅逐。
* 在 Windows 節點上運行時，kubelet 沒有內存或 CPU 限制。
  `--kube-reserved` 和 `--system-reserved` 僅從 `NodeAllocatable` 中減去，並且不保證爲工作負載提供的資源。
  有關更多資訊，請參考 [Windows 節點的資源管理](/zh-cn/docs/concepts/configuration/windows-resource-management/#resource-reservation)。
* 未實現 `PIDPressure` 條件。
* kubelet 不會執行 OOM 驅逐操作。

<!--
### API compatibility {#api}

There are subtle differences in the way the Kubernetes APIs work for Windows due to the OS
and container runtime. Some workload properties were designed for Linux, and fail to run on Windows.

At a high level, these OS concepts are different:
-->
### API 兼容性   {#api}

由於操作系統和容器運行時的緣故，Kubernetes API 在 Windows 上的工作方式存在細微差異。
某些工作負載屬性是爲 Linux 設計的，無法在 Windows 上運行。

從較高的層面來看，以下操作系統概念是不同的：

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
* 身份 - Linux 使用 userID（UID）和 groupID（GID），表示爲整數類型。
  使用者名和組名是不規範的，它們只是 `/etc/groups` 或 `/etc/passwd` 中的別名，
  作爲 UID+GID 的後備標識。
  Windows 使用更大的二進制[安全標識符](https://docs.microsoft.com/zh-cn/windows/security/identity-protection/access-control/security-identifiers)（SID），
  存放在 Windows 安全訪問管理器（Security Access Manager，SAM）資料庫中。
  此資料庫在主機和容器之間或容器之間不共享。
* 檔案權限 - Windows 使用基於 SID 的訪問控制列表，
  而像 Linux 使用基於對象權限和 UID+GID 的位掩碼（POSIX 系統）以及**可選的**訪問控制列表。
* 檔案路徑 - Windows 上的約定是使用 `\` 而不是 `/`。
  Go IO 庫通常接受兩者，能讓其正常工作，但當你設置要在容器內解讀的路徑或命令列時，
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
* 信號 - Windows 交互式應用處理終止的方式不同，可以實現以下一種或多種：
  * UI 執行緒處理包括 `WM_CLOSE` 在內準確定義的消息。
  * 控制檯應用使用控制處理程式（Control Handler）處理 Ctrl-C 或 Ctrl-Break。
  * 服務會註冊可接受 `SERVICE_CONTROL_STOP` 控制碼的服務控制處理程式（Service Control Handler）函數。

容器退出碼遵循相同的約定，其中 0 表示成功，非零表示失敗。
具體的錯誤碼在 Windows 和 Linux 中可能不同。
但是，從 Kubernetes 組件（kubelet、kube-proxy）傳遞的退出碼保持不變。

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
#### 容器規約的字段兼容性   {#compatibility-v1-pod-spec-containers}

以下列表記錄了 Pod 容器規約在 Windows 和 Linux 之間的工作方式差異：

* 巨頁（Huge page）在 Windows 容器運行時中未實現，且不可用。
  巨頁需要不可爲容器設定的[使用者特權生效](https://docs.microsoft.com/zh-cn/windows/win32/memory/large-page-support)。
* `requests.cpu` 和 `requests.memory` -
  從節點可用資源中減去請求，因此請求可用於避免一個節點過量供應。
  但是，請求不能用於保證已過量供應的節點中的資源。
  如果運營商想要完全避免過量供應，則應將設置請求作爲最佳實踐應用到所有容器。
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
  不能在 Windows 上使用；所有權能字都無法生效。
* `securityContext.capabilities` - POSIX 權能未在 Windows 上實現。
* `securityContext.privileged` - Windows 不支持特權容器，
  可使用 [HostProcess 容器](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod/)代替。
* `securityContext.procMount` - Windows 沒有 `/proc` 檔案系統。
* `securityContext.readOnlyRootFilesystem` -
  不能在 Windows 上使用；對於容器內運行的註冊表和系統進程，寫入權限是必需的。
* `securityContext.runAsGroup` - 不能在 Windows 上使用，因爲不支持 GID。
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
  此設置將阻止以 `ContainerAdministrator` 身份運行容器，這是 Windows 上與 root 使用者最接近的身份。
* `securityContext.runAsUser` - 改用 [`runAsUserName`](/zh-cn/docs/tasks/configure-pod-container/configure-runasusername)。
* `securityContext.seLinuxOptions` - 不能在 Windows 上使用，因爲 SELinux 特定於 Linux。
* `terminationMessagePath` - 這個字段有一些限制，因爲 Windows 不支持映射單個檔案。
  預設值爲 `/dev/termination-log`，因爲預設情況下它在 Windows 上不存在，所以能生效。

<!--
#### Field compatibility for Pod specifications {#compatibility-v1-pod}

The following list documents differences between how Pod specifications work between Windows and Linux:

* `hostIPC` and `hostpid` - host namespace sharing is not possible on Windows
* `hostNetwork` - host networking is not possible on Windows
* `dnsPolicy` - setting the Pod `dnsPolicy` to `ClusterFirstWithHostNet` is
   not supported on Windows because host networking is not provided. Pods always
   run with a container network.
* `podSecurityContext` [see below](#compatibility-v1-pod-spec-containers-securitycontext)
* `shareProcessNamespace` - this is a beta feature, and depends on Linux namespaces
  which are not implemented on Windows. Windows cannot share process namespaces or
  the container's root filesystem. Only the network can be shared.
-->
#### Pod 規約的字段兼容性   {#compatibility-v1-pod}

以下列表記錄了 Pod 規約在 Windows 和 Linux 之間的工作方式差異：

* `hostIPC` 和 `hostpid` - 不能在 Windows 上共享主機命名空間。
* `hostNetwork` - 在 Windows 上不支持主機網路模式。
* `dnsPolicy` - Windows 不支持將 Pod `dnsPolicy` 設爲 `ClusterFirstWithHostNet`，
  因爲未提供主機網路。Pod 始終用容器網路運行。
* `podSecurityContext` [參見下文](#compatibility-v1-pod-spec-containers-securitycontext)
* `shareProcessNamespace` - 這是一個 Beta 版功能特性，依賴於 Windows 上未實現的 Linux 命名空間。
  Windows 無法共享進程命名空間或容器的根檔案系統（root filesystem）。
  只能共享網路。
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
* `terminationGracePeriodSeconds` - 這在 Windows 上的 Docker 中沒有完全實現，
  請參考 [GitHub issue](https://github.com/moby/moby/issues/25982)。
  目前的行爲是通過 CTRL_SHUTDOWN_EVENT 發送 ENTRYPOINT 進程，然後 Windows 預設等待 5 秒，
  最後使用正常的 Windows 關機行爲終止所有進程。
  5 秒預設值實際上位於[容器內](https://github.com/moby/moby/issues/25982#issuecomment-426441183)的
  Windows 註冊表中，因此在構建容器時可以覆蓋這個值。
* `volumeDevices` - 這是一個 Beta 版功能特性，未在 Windows 上實現。
  Windows 無法將原始塊設備掛接到 Pod。
* `volumes`
  * 如果你定義一個 `emptyDir` 卷，則你無法將卷源設爲 `memory`。
* 你無法爲卷掛載啓用 `mountPropagation`，因爲這在 Windows 上不支持。

<!--
#### Host network access {#compatibility-v1-pod-spec-containers-hostnetwork}

Kubernetes v1.26 to v1.32  included alpha support for running Windows Pods in the host's network namespace.
-->
#### 主機網路訪問   {#compatibility-v1-pod-spec-containers-hostnetwork}

Kubernetes 從 v1.26 到 v1.32 提供了在主機網路命名空間中運行 Windows Pod 的 Alpha 版本支持。

<!--
Kubernetes v{{< skew currentVersion >}} does **not** include the `WindowsHostNetwork` feature gate
or support for running Windows Pods in the host's network namespace.
-->
Kubernetes v{{< skew currentVersion >}} **不**包含 `WindowsHostNetwork` 特性門控，
也不支持在主機網路命名空間中運行 Windows Pod。

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
## 節點問題檢測器   {#node-problem-detector}

節點問題檢測器（參考[節點健康監測](/zh-cn/docs/tasks/debug/debug-cluster/monitor-node-health/)）初步支持 Windows。
有關更多資訊，請訪問該項目的 [GitHub 頁面](https://github.com/kubernetes/node-problem-detector#windows)。

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

在 Kubernetes Pod 中，首先創建一個基礎容器或 “pause” 容器來承載容器。
在 Linux 中，構成 Pod 的 cgroup 和命名空間維持持續存在需要一個進程；
而 pause 進程就提供了這個功能。
屬於同一 Pod 的容器（包括基礎容器和工作容器）共享一個公共網路端點
（相同的 IPv4 和/或 IPv6 地址，相同的網路端口空間）。
Kubernetes 使用 pause 容器以允許工作容器崩潰或重啓，而不會丟失任何網路設定。

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
Kubernetes 維護一個多體系結構的映像檔，包括對 Windows 的支持。
對於 Kubernetes v{{< skew currentPatchVersion >}}，推薦的 pause 映像檔爲 `registry.k8s.io/pause:3.6`。
可在 GitHub 上獲得[源代碼](https://github.com/kubernetes/kubernetes/tree/master/build/pause)。

Microsoft 維護一個不同的多體系結構映像檔，支持 Linux 和 Windows amd64，
你可以找到的映像檔類似 `mcr.microsoft.com/oss/kubernetes/pause:3.6`。
此映像檔的構建與 Kubernetes 維護的映像檔同源，但所有 Windows 可執行檔案均由
Microsoft 進行了[驗證碼簽名](https://docs.microsoft.com/zh-cn/windows-hardware/drivers/install/authenticode)。
如果你正部署到一個需要簽名可執行檔案的生產或類生產環境，
Kubernetes 項目建議使用 Microsoft 維護的映像檔。

<!--
## Container runtimes {#container-runtime}

You need to install a
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
into each node in the cluster so that Pods can run there.

The following container runtimes work with Windows:
-->
## 容器運行時   {#container-runtime}

你需要將{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}安裝到叢集中的每個節點，
這樣 Pod 才能在這些節點上運行。

以下容器運行時適用於 Windows：

{{% thirdparty-content %}}

### ContainerD

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

<!--
You can use {{< glossary_tooltip term_id="containerd" text="ContainerD" >}} 1.4.0+
as the container runtime for Kubernetes nodes that run Windows.

Learn how to [install ContainerD on a Windows node](/docs/setup/production-environment/container-runtimes/#containerd).
-->
對於運行 Windows 的 Kubernetes 節點，你可以使用
{{< glossary_tooltip term_id="containerd" text="ContainerD" >}} 1.4.0+ 作爲容器運行時。

學習如何[在 Windows 上安裝 ContainerD](/zh-cn/docs/setup/production-environment/container-runtimes/#containerd)。

{{< note >}}
<!--
There is a [known limitation](/docs/tasks/configure-pod-container/configure-gmsa/#gmsa-limitations)
when using GMSA with containerd to access Windows network shares, which requires a
kernel patch.
-->
將 GMSA 和 containerd 一起用於訪問 Windows
網路共享時存在[已知限制](/zh-cn/docs/tasks/configure-pod-container/configure-gmsa/#gmsa-limitations)，
這需要一個內核補丁。
{{< /note >}}

<!--
### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR)
is available as a container runtime for all Windows Server 2019 and later versions.

See [Install MCR on Windows Servers](https://docs.mirantis.com/mcr/25.0/install/mcr-windows.html) for more information.
-->
### Mirantis 容器運行時   {#mcr}

[Mirantis 容器運行時](https://docs.mirantis.com/mcr/25.0/overview.html)（MCR）
可作爲所有 Windows Server 2019 和更高版本的容器運行時。

有關更多資訊，請參考[在 Windows Server 上安裝 MCR](https://docs.mirantis.com/mcr/25.0/install/mcr-windows.html)。

<!--
## Windows OS version compatibility {#windows-os-version-support}

On Windows nodes, strict compatibility rules apply where the host OS version must
match the container base image OS version. Only Windows containers with a container
operating system of Windows Server 2019 are fully supported.

For Kubernetes v{{< skew currentVersion >}}, operating system compatibility for Windows nodes (and Pods)
is as follows:
-->
## Windows 操作系統版本兼容性   {#windows-os-version-support}

在 Windows 節點上，如果主機操作系統版本必須與容器基礎映像檔操作系統版本匹配，
則會應用嚴格的兼容性規則。
僅 Windows Server 2019 作爲容器操作系統時，才能完全支持 Windows 容器。

對於 Kubernetes v{{< skew currentVersion >}}，Windows 節點（和 Pod）的操作系統兼容性如下：

<!--
Windows Server LTSC release
: Windows Server 2019
: Windows Server 2022

Windows Server SAC release
:  Windows Server version 20H2
-->
Windows Server LTSC（長期服務渠道）版本
: Windows Server 2019
: Windows Server 2022

Windows Server SAC（半年渠道）版本
: Windows Server 版本 20H2

<!--
The Kubernetes [version-skew policy](/docs/setup/release/version-skew-policy/) also applies.
-->
也適用 Kubernetes [版本偏差策略](/zh-cn/releases/version-skew-policy/)。

<!--
## Hardware recommendations and considerations {#windows-hardware-recommendations}
-->
## 硬件建議和注意事項   {#windows-hardware-recommendations}

{{% thirdparty-content %}}

{{< note >}}
<!--
The following hardware specifications outlined here should be regarded as sensible default values. 
They are not intended to represent minimum requirements or specific recommendations for production environments.
Depending on the requirements for your workload these values may need to be adjusted.
-->
這裏列出的硬件規格應被視爲合理的預設值。
它們並不代表生產環境的最低要求或具體推薦。
根據你的工作負載要求，這些值可能需要進行調整。
{{< /note >}}

<!--
- 64-bit processor 4 CPU cores or more, capable of supporting virtualization
- 8GB or more of RAM
- 50GB or more of free disk space
-->
- 64 位處理器，4 核或更多的 CPU，能夠支持虛擬化
- 8GB 或更多的 RAM
- 50GB 或更多的可用磁盤空間

<!--
Refer to
[Hardware requirements for Windows Server Microsoft documentation](https://learn.microsoft.com/en-us/windows-server/get-started/hardware-requirements)
for the most up-to-date information on minimum hardware requirements. For guidance on deciding on resources for
production worker nodes refer to [Production worker nodes Kubernetes documentation](/docs/setup/production-environment/#production-worker-nodes).
-->
有關最新的最低硬件要求資訊，
請參考[微軟文檔：Windows Server 的硬件要求](https://learn.microsoft.com/zh-cn/windows-server/get-started/hardware-requirements)。
有關決定生產工作節點資源的指導資訊，
請參考 [Kubernetes 文檔：生產用工作節點](/zh-cn/docs/setup/production-environment/#production-worker-nodes)。

<!--
To optimize system resources, if a graphical user interface is not required,
it may be preferable to use a Windows Server OS installation that excludes
the [Windows Desktop Experience](https://learn.microsoft.com/en-us/windows-server/get-started/install-options-server-core-desktop-experience)
installation option, as this configuration typically frees up more system 
resources.
-->
爲了優化系統資源，如果圖形使用者界面不是必需的，最好選擇一個不包含
[Windows 桌面體驗](https://learn.microsoft.com/zh-cn/windows-server/get-started/install-options-server-core-desktop-experience)安裝選項的
Windows Server 操作系統安裝包，因爲這種設定通常會釋放更多的系統資源。

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
在估算 Windows 工作節點的磁盤空間時，需要注意 Windows 容器映像檔通常比 Linux 容器映像檔更大，
單個映像檔的容器大小範圍從 [300MB 到超過 10GB](https://techcommunity.microsoft.com/t5/containers/nano-server-x-server-core-x-server-which-base-image-is-the-right/ba-p/2835785)。
此外，需要注意 Windows 容器中的 `C:` 驅動器預設呈現的虛擬剩餘空間爲 20GB，
這不是實際的佔用空間，而是使用主機上的本地儲存時單個容器可以最多佔用的磁盤大小。
有關更多詳細資訊，
請參見[在 Windows 上運行容器 - 容器儲存文檔](https://learn.microsoft.com/zh-cn/virtualization/windowscontainers/manage-containers/container-storage#storage-limits)。

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
## 獲取幫助和故障排查   {#troubleshooting}

對 Kubernetes 叢集進行故障排查的主要幫助來源應始於[故障排查](/zh-cn/docs/tasks/debug/)頁面。

本節包括了一些其他特定於 Windows 的故障排查幫助。
日誌是解決 Kubernetes 中問題的重要元素。
確保在任何時候向其他貢獻者尋求故障排查協助時隨附了日誌資訊。
遵照 SIG Windows
[日誌收集貢獻指南](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs)中的指示說明。

<!--
### Reporting issues and feature requests

If you have what looks like a bug, or you would like to
make a feature request, please follow the [SIG Windows contributing guide](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#reporting-issues-and-feature-requests) to create a new issue.
You should first search the list of issues in case it was
reported previously and comment with your experience on the issue and add additional
logs. SIG Windows channel on the Kubernetes Slack is also a great avenue to get some initial support and
troubleshooting ideas prior to creating a ticket.
-->
### 報告問題和功能請求   {#report-issue-and-feature-request}

如果你發現疑似 bug，或者你想提出功能請求，請按照
[SIG Windows 貢獻指南](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#reporting-issues-and-feature-requests)
新建一個 Issue。你應該先搜索 Issue 列表，以防之前報告過這個問題，憑你對該問題的經驗添加評論，
並隨附日誌資訊。Kubernetes Slack 上的 SIG Windows 頻道也是一個很好的途徑，
可以在創建工單之前獲得一些初始支持和故障排查思路。

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
### 驗證 Windows 叢集的操作性  {#validating-windows-cluster-operability}

Kubernetes 項目提供了 **Windows 操作準備**規範，配備了結構化的測試套件。
這個套件分爲兩組測試：核心和擴展。每組測試都包含了針對特定場景的分類測試。
它可以用來驗證 Windows 和混合系統（混合了 Linux 節點）的所有功能，實現全面覆蓋。

要在新創建的叢集上搭建此項目，
請參考[項目指南](https://github.com/kubernetes-sigs/windows-operational-readiness/blob/main/README.md)中的說明。

<!--
## Deployment tools

The kubeadm tool helps you to deploy a Kubernetes cluster, providing the control
plane to manage the cluster it, and nodes to run your workloads.

The Kubernetes [cluster API](https://cluster-api.sigs.k8s.io/) project also provides means to automate deployment of Windows nodes.
-->
## 部署工具   {#deployment-tools}

kubeadm 工具幫助你部署 Kubernetes 叢集，提供管理叢集的控制平面以及運行工作負載的節點。

Kubernetes [叢集 API](https://cluster-api.sigs.k8s.io/) 項目也提供了自動部署
Windows 節點的方式。

<!--
## Windows distribution channels

For a detailed explanation of Windows distribution channels see the
[Microsoft documentation](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19).

Information on the different Windows Server servicing channels
including their support models can be found at
[Windows Server servicing channels](https://docs.microsoft.com/en-us/windows-server/get-started/servicing-channels-comparison).
-->
## Windows 分發渠道   {#windows-distribution-channels}

有關 Windows 分發渠道的詳細闡述，請參考
[Microsoft 文檔](https://docs.microsoft.com/zh-cn/windows-server/get-started-19/servicing-channels-19)。

有關支持模型在內的不同 Windows Server 服務渠道的資訊，請參考
[Windows Server 服務渠道](https://docs.microsoft.com/zh-cn/windows-server/get-started/servicing-channels-comparison)。
