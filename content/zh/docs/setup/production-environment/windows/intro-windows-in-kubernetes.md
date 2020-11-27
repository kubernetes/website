---
reviewers:
- michmike
- patricklang
title: Kubernetes中Windows支持简介
content_type: concept
weight: 65
---
<!-- 
reviewers:
- michmike
- patricklang
title: Intro to Windows support in Kubernetes
content_type: concept
weight: 65
-->

<!-- overview -->

<!-- Windows applications constitute a large portion of the services and applications that run in many organizations. -->
在许多组织中运行的服务和应用程序中，Windows 应用程序占很大一部分。

<!-- [Windows containers](https://aka.ms/windowscontainers) provide a modern way to encapsulate processes and package dependencies, making it easier to use DevOps practices and follow cloud native patterns for Windows applications. -->
[Windows 容器](https://aka.ms/windowscontainers) 提供了一种封装进程和包依赖关系的现代方法，使使用 DevOps 实践和遵循 Windows 应用程序的云原生模式变得更加容易。

<!-- Kubernetes has become the defacto standard container orchestrator, and the release of Kubernetes 1.14 includes production support for scheduling Windows containers on Windows nodes in a Kubernetes cluster, enabling a vast ecosystem of Windows applications to leverage the power of Kubernetes. -->
Kubernetes 已经成为事实上的标准容器协调器，并且 kubernetes 1.14的发行版包含了在 Kubernetes 集群中调度 Windows 节点上的 Windows 容器的生产支持，使得 Windows 应用程序的巨大生态系统能够利用 Kubernetes 的强大功能。

<!-- Organizations with investments in Windows-based applications and Linux-based applications don't have to look for separate orchestrators to manage their workloads, leading to increased operational efficiencies across their deployments, regardless of operating system.-->
投资于基于 Windows 的应用程序和基于 Linux 的应用程序的公司不必寻找单独的协调器来管理其工作负载，从而提高了部署中的操作效率，而不必考虑操作系统。


<!-- body -->

<!-- ## Windows containers in Kubernetes -->
## kubernetes 中的 windows 容器

<!-- To enable the orchestration of Windows containers in Kubernetes, simply include Windows nodes in your existing Linux cluster. -->
要在 Kubernetes 中启用 Windows 容器的编排，只需在现有的 Linux 集群中包含 Windows 节点。
<!-- Scheduling Windows containers in {{< glossary_tooltip text="Pods" term_id="pod" >}} on Kubernetes is as simple and easy as scheduling Linux-based containers. -->
在 Kubernetes 上的 {<glossary_tooltip text=“Pods”term_id=“pod”>}} 中调度 Windows 容器与调度基于 Linux 的容器一样简单容易。

<!-- In order to run Windows containers, your Kubernetes cluster must include multiple operating systems, with control plane nodes running Linux and workers running either Windows or Linux depending on your workload needs. -->
为了运行 Windows 容器，Kubernetes 集群必须包含多个操作系统，控制平面节点运行 Linux，worker 运行 Windows 或 Linux，具体取决于你的工作负载需求。

<!-- Windows Server 2019 is the only Windows operating system supported, enabling [Kubernetes Node](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node) on Windows (including kubelet, [container runtime](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/containerd), and kube-proxy). -->
Windows Server 2019是唯一受支持的 Windows 操作系统，支持 [Kubernetes Node](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node) -包括 Bernkuets 节点，[容器运行时](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/containerd)，以及 kube 代理）。

<!-- For a detailed explanation of Windows distribution channels see the [Microsoft documentation](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19). -->
有关 Windows 分发频道的详细说明，请参阅[Microsoft文档](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19).

<!-- 
{{< note >}}
The Kubernetes control plane, including the [master components](/docs/concepts/overview/components/), continues to run on Linux. There are no plans to have a Windows-only Kubernetes cluster.
{{< /note >}}
-->
{{< note >}}
Kubernetes 控制平面，包括 [master components](/docs/concepts/overview/components/)，继续在 Linux上 运行。目前还没有计划只使用 Windows 的 Kubernetes 集群。
{{< /note >}}

<!-- 
{{< note >}}
In this document, when we talk about Windows containers we mean Windows containers with process isolation. Windows containers with [Hyper-V isolation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container) is planned for a future release.
{{< /note >}}
-->
{{< note >}}
在本文中，当我们谈论 Windows 容器时，我们指的是具有进程隔离的 Windows 容器。具有 [Hyper-V 隔离](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)的 windows 容器计划在未来发布。
{{< /note >}}

<!--
## Supported Functionality and Limitations

### Supported Functionality

#### Windows OS Version Support
-->
## 支持的功能和限制

### 支持的功能

#### Windows操作系统版本支持

<!-- Refer to the following table for Windows operating system support in Kubernetes. A single heterogeneous Kubernetes cluster can have both Windows and Linux worker nodes. Windows containers have to be scheduled on Windows nodes and Linux containers on Linux nodes. -->
有关 Kubernetes 中的 Windows 操作系统支持，请参阅下表。单个异构 Kubernetes 集群可以同时具有 Windows 和 Linux 工作节点。必须在 Windows 节点上调度 Windows 容器，在 Linux 节点上调度 Linux 容器。

<!--
| Kubernetes version | Windows Server LTSC releases | Windows Server SAC releases |
| --- | --- | --- | --- |
| *Kubernetes v1.14* | Windows Server 2019 | Windows Server ver 1809 |
| *Kubernetes v1.15* | Windows Server 2019 | Windows Server ver 1809 |
| *Kubernetes v1.16* | Windows Server 2019 | Windows Server ver 1809 |
| *Kubernetes v1.17* | Windows Server 2019 | Windows Server ver 1809 |
| *Kubernetes v1.18* | Windows Server 2019 | Windows Server ver 1809, Windows Server ver 1903, Windows Server ver 1909 |
| *Kubernetes v1.19* | Windows Server 2019 | Windows Server ver 1909, Windows Server ver 2004 |

-->
| Kubernetes 版本 | Windows Server LTSC 版本 | Windows Server SAC 版本 |
| --- | --- | --- | --- |
| *Kubernetes v1.14* | Windows Server 2019 | Windows Server ver 1809 |
| *Kubernetes v1.15* | Windows Server 2019 | Windows Server ver 1809 |
| *Kubernetes v1.16* | Windows Server 2019 | Windows Server ver 1809 |
| *Kubernetes v1.17* | Windows Server 2019 | Windows Server ver 1809 |
| *Kubernetes v1.18* | Windows Server 2019 | Windows Server ver 1809, Windows Server ver 1903, Windows Server ver 1909 |
| *Kubernetes v1.19* | Windows Server 2019 | Windows Server ver 1909, Windows Server ver 2004 |

<！--
{{< note >}}
Information on the different Windows Server servicing channels including their support models can be found at [Windows Server servicing channels](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19).
{{< /note >}}
-->
{{< note >}}
有关不同 Windows Server 服务频道（包括其支持模型）的信息，请访问 [Windows Server Service channels](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19) 。
{{< /note >}}

<!--
{{< note >}}
We don't expect all Windows customers to update the operating system for their apps frequently. Upgrading your applications is what dictates and necessitates upgrading or introducing new nodes to the cluster. For the customers that chose to upgrade their operating system for containers running on Kubernetes, we will offer guidance and step-by-step instructions when we add support for a new operating system version. This guidance will include recommended upgrade procedures for upgrading user applications together with cluster nodes. Windows nodes adhere to Kubernetes [version-skew policy](/docs/setup/release/version-skew-policy/) (node to control plane versioning) the same way as Linux nodes do today.
{{< /note >}}
-->
{{< note >}}
我们不希望所有 Windows 用户都频繁地为他们的应用程序更新操作系统。升级你的应用程序意味着并必须升级或向集群引入新节点。对于选择为运行在 Kubernetes 上的容器升级其操作系统的客户，我们将在添加对新操作系统版本的支持时提供指导和分步说明。
本指南将包括升级用户应用程序和群集节点的推荐升级过程。Windows 节点遵循 Kubernetes [version-skew policy](/docs/setup/release/version-skew-policy/)（节点到控制平面的版本控制），就像现在的 Linux 节点一样。
{{< /note >}}

<!--
{{< note >}}
The Windows Server Host Operating System is subject to the [Windows Server ](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing) licensing. The Windows Container images are subject to the [Supplemental License Terms for Windows containers](https://docs.microsoft.com/en-us/virtualization/windowscontainers/images-eula).
{{< /note >}}
-->
{{< note >}}
Windows Server 主机操作系统受 [Windows Server](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing) 的约束许可。Windows 容器映像受 [Windows 容器的补充许可条款](https://docs.microsoft.com/en-us/virtualization/windowscontainers/images-eula)的约束。
{{< /note >}}

<!--
{{< note >}}
Windows containers with process isolation have strict compatibility rules, [where the host OS version must match the container base image OS version](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility). Once we support Windows containers with Hyper-V isolation in Kubernetes, the limitation and compatibility rules will change.
{{< /note >}}
-->
{{< note >}}
具有进程隔离的 Windows 容器具有严格的兼容性规则，[其中主机操作系统版本必须与容器基本映像操作系统版本匹配](https://docs.microsoft.com/en-us/virtualization/windowscenters/deploy-containers/version-compatibility)。 一旦我们在 Kubernetes 中支持带有 Hyper-V 隔离的 Windows 容器，限制和兼容性规则就会改变。
{{< /note >}}


<!-- #### Compute -->

#### 计算

<!-- From an API and kubectl perspective, Windows containers behave in much the same way as Linux-based containers. However, there are some notable differences in key functionality which are outlined in the [limitation section](#limitations). -->
从 API 和 kubectl 的角度来看，Windows 容器的行为方式与基于 Linux 的容器基本相同。但是，在关键功能上有一些显著的差异，这些差异在[限制部分](#限制)中有所概述。

<!-- Key Kubernetes elements work the same way in Windows as they do in Linux. In this section, we talk about some of the key workload enablers and how they map to Windows.-->
Kubernetes 的关键元素在 Windows 中的工作方式与在 Linux 中的工作方式相同。在这一节中，我们将讨论一些关键的工作负载使能器，以及它们如何映射到 Windows 。

<!--
* [Pods](/docs/concepts/workloads/pods/)

    A Pod is the basic building block of Kubernetes–the smallest and simplest unit in the Kubernetes object model that you create or deploy. You may not deploy Windows and Linux containers in the same Pod. All containers in a Pod are scheduled onto a single Node where each Node represents a specific platform and architecture. The following Pod capabilities, properties and events are supported with Windows containers:

  * Single or multiple containers per Pod with process isolation and volume sharing
  * Pod status fields
  * Readiness and Liveness probes
  * postStart & preStop container lifecycle events
  * ConfigMap, Secrets: as environment variables or volumes
  * EmptyDir
  * Named pipe host mounts
  * Resource limits
-->
* [Pods](/docs/concepts/workloads/pods/)

   Pod 是 Kubernetes 的基本构建块，Kubernetes 是你创建或部署的 Kubernetes 对象模型中最小、最简单的单元。不能在同一个 Pod 中部署 Windows 和 Linux 容器。Pod 中的所有容器都被调度到一个节点上，每个节点代表一个特定的平台和体系结构。Windows 容器支持以下 Pod 功能、属性和事件：
   
  * 每个 pod 有一个或多个容器，具有过程隔离和卷共享
  * Pod 状态字段
  * Readiness 和 Liveness 探针
  * postStart & preStop 容器生命周期事件
  * ConfigMap, Secrets: 作为环境变量或卷
  * EmptyDir
  * 命名管道主机安装
  * 资源限制  
<!--  
* [Controllers](/docs/concepts/workloads/controllers/)

    Kubernetes controllers handle the desired state of Pods. The following workload controllers are supported with Windows containers:

  * ReplicaSet
  * ReplicationController
  * Deployments
  * StatefulSets
  * DaemonSet
  * Job
  * CronJob
-->
* [Controllers](/docs/concepts/workloads/controllers/)

    Kubernetes 控制器处理所需的 pod 状态。Windows 容器支持以下工作负载控制器：

  * ReplicaSet
  * ReplicationController
  * Deployments
  * StatefulSets
  * DaemonSet
  * Job
  * CronJob
<!--    
* [Services](/docs/concepts/services-networking/service/)

    A Kubernetes Service is an abstraction which defines a logical set of Pods and a policy by which to access them - sometimes called a micro-service. You can use services for cross-operating system connectivity. In Windows, services can utilize the following types, properties and capabilities:

  * Service Environment variables
  * NodePort
  * ClusterIP
  * LoadBalancer
  * ExternalName
  * Headless services
-->
* [Services](/docs/concepts/services-networking/service/)

    Kubernetes 服务是一种抽象，它定义了一组逻辑 pod 和访问它们的策略，有时称为微服务。你可以使用服务进行跨操作系统连接。在 Windows 中，服务可以利用以下类型、属性和功能：
    
  * Service 环境变量
  * NodePort
  * ClusterIP
  * LoadBalancer
  * ExternalName
  * Headless services
  
<!-- Pods, Controllers and Services are critical elements to managing Windows workloads on Kubernetes. However, on their own they are not enough to enable the proper lifecycle management of Windows workloads in a dynamic cloud native environment. We added support for the following features: -->

pod 、Controllers 和 Services 是在 Kubernetes 上管理 Windows 工作负载的关键元素。但是，单靠它们本身还不足以在动态云原生环境中对 Windows 工作负载进行适当的生命周期管理。我们添加了对以下功能的支持：

<!--
* Pod and container metrics
* Horizontal Pod Autoscaler support
* kubectl Exec
* Resource Quotas
* Scheduler preemption
-->
* Pod 和容器指标
* 水平 Pod 自动缩放器支持
* kubectl Exec
* 资源配额
* 调度程序抢占

<!--
#### Container Runtime

##### Docker EE
-->
#### 容器运行时

##### Docker EE

<!--
{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Docker EE-basic 19.03+ is the recommended container runtime for all Windows Server versions. This works with the dockershim code included in the kubelet.
-->
{{< feature-state for_k8s_version="v1.14" state="stable" >}}

对于所有 Windows Server 版本，建议使用 Docker EE-basic 19.03+ 。 这适用于 kubelet 中包含的 dockershim 代码。

<!--
##### CRI-ContainerD

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

{{< caution >}}
There is a [known limitation](/docs/tasks/configure-pod-container/configure-gmsa/#gmsa-limitations) when using GMSA with ContainerD to access Windows network shares which requires a kernel patch. Check for updates on the [Microsoft Windows Containers issue tracker](https://github.com/microsoft/Windows-Containers/issues/44).
{{< /caution >}}
-->
##### CRI-ContainerD

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

{{< caution >}}
使用带有 ContainerD 的 GMSA 来访问 Windows 网络共享时，有一个[已知限制](/docs/tasks/configure-pod-container/configure-gmsa/#gmsa-limitations)，它需要内核补丁。 在 [Microsoft Windows容器问题跟踪器](https://github.com/microsoft/Windows-Containers/issues/44)上检查更新。
{{< /caution >}}

<!--
{{< glossary_tooltip term_id="containerd" text="ContainerD" >}} 1.4.0-beta.2+ can also be used as the container runtime for Windows Kubernetes nodes.

Initial support for ContainerD on Windows was added in Kubernetes v1.18. Progress for ContainerD on Windows can be tracked at [enhancements#1001](https://github.com/kubernetes/enhancements/issues/1001).

Learn how to [install ContainerD on a Windows](/docs/setup/production-environment/container-runtimes/#install-containerd).
-->
{{< glossary_tooltip term_id="containerd" text="ContainerD" >}} 1.4.0-beta.2+ 也可以用作 Windows Kubernetes 节点的容器运行时。

最初对 Windows 上 ContainerD 的支持是在 kubernetesv1.18 中添加的。Windows上ContainerD 的进度可在 [enhancements\1001](https://github.com/kubernetes/enhancements/issues/1001)上跟踪.

学习如何[在Windows上安装ContainerD](/docs/setup/production-environment/container-runtimes/#install-containerd).
<!--
#### Persistent Storage

Kubernetes [volumes](/docs/concepts/storage/volumes/) enable complex applications, with data persistence and Pod volume sharing requirements, to be deployed on Kubernetes. Management of persistent volumes associated with a specific storage back-end or protocol includes actions such as: provisioning/de-provisioning/resizing of volumes, attaching/detaching a volume to/from a Kubernetes node and mounting/dismounting a volume to/from individual containers in a pod that needs to persist data. The code implementing these volume management actions for a specific storage back-end or protocol is shipped in the form of a Kubernetes volume [plugin](/docs/concepts/storage/volumes/#types-of-volumes). The following broad classes of Kubernetes volume plugins are supported on Windows:
-->
#### 永久存储

Kubernetes [volumes](/docs/concepts/storage/volumes/) 支持在 Kubernetes 上部署具有数据持久性和 Pod 卷共享需求的复杂应用程序。
对与特定存储后端或协议相关联的持久卷的管理包括以下操作：配置/取消配置/调整卷大小，将卷附加/分离到 Kubernetes 节点，以及将卷装载/卸载到需要持久化数据的 pod 中的各个容器中。
为特定存储后端或协议实现这些卷管理操作的代码以 Kubernetes 卷[插件](/docs/concepts/storage/volumes/#types of volumes) 的形式提供。Windows 支持以下广泛的 Kubernetes 卷插件：

<!--
##### In-tree Volume Plugins
Code associated with in-tree volume plugins ship as part of the core Kubernetes code base. Deployment of in-tree volume plugins do not require installation of additional scripts or deployment of separate containerized plugin components. These plugins can handle: provisioning/de-provisioning and resizing of volumes in the storage backend, attaching/detaching of volumes to/from a Kubernetes node and mounting/dismounting a volume to/from individual containers in a pod. The following in-tree plugins support Windows nodes:

* [awsElasticBlockStore](/docs/concepts/storage/volumes/#awselasticblockstore)
* [azureDisk](/docs/concepts/storage/volumes/#azuredisk)
* [azureFile](/docs/concepts/storage/volumes/#azurefile)
* [gcePersistentDisk](/docs/concepts/storage/volumes/#gcepersistentdisk)
* [vsphereVolume](/docs/concepts/storage/volumes/#vspherevolume)
-->
##### In-tree 卷插件库
与树内卷插件相关的代码作为核心 Kubernetes 代码库的一部分提供。部署树内卷插件不需要安装其他脚本或部署单独的容器化插件组件。这些插件可以处理：在存储后端中调配/取消调配和调整卷的大小，将卷连接到 Kubernetes 节点/从 Kubernetes 节点分离，以及将卷安装到 Pod 中的各个容器/从中卸载。 以下树中插件支持 Windows 节点：

* [awsElasticBlockStore](/docs/concepts/storage/volumes/#awselasticblockstore)
* [azureDisk](/docs/concepts/storage/volumes/#azuredisk)
* [azureFile](/docs/concepts/storage/volumes/#azurefile)
* [gcePersistentDisk](/docs/concepts/storage/volumes/#gcepersistentdisk)
* [vsphereVolume](/docs/concepts/storage/volumes/#vspherevolume)

<!--
##### FlexVolume Plugins
Code associated with [FlexVolume](/docs/concepts/storage/volumes/#flexVolume) plugins ship as out-of-tree scripts or binaries that need to be deployed directly on the host. FlexVolume plugins handle attaching/detaching of volumes to/from a Kubernetes node and mounting/dismounting a volume to/from individual containers in a pod. Provisioning/De-provisioning of persistent volumes associated with FlexVolume plugins may be handled through an external provisioner that is typically separate from the FlexVolume plugins. The following FlexVolume [plugins](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows), deployed as powershell scripts on the host, support Windows nodes:

* [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
* [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)
-->
##### FlexVolume 插件库
与 [FlexVolume](/docs/concepts/storage/volumes/#flexVolume) 插件相关的代码以树外脚本或二进制文件的形式提供，这些脚本或二进制文件需要直接部署在主机上。
FlexVolume 插件处理将卷附加/分离到 Kubernetes 节点，以及将卷装载/卸载到 pod 中的各个容器。与 FlexVolume 插件相关联的持久卷的配置/取消配置可以通过通常与 FlexVolume 插件分开的外部供应器来处理。
以下 FlexVolume [插件](https://github.com/Microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows)，在主机上部署为 powershell 脚本，支持 Windows 节点：

* [SMB](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~smb.cmd)
* [iSCSI](https://github.com/microsoft/K8s-Storage-Plugins/tree/master/flexvolume/windows/plugins/microsoft.com~iscsi.cmd)

<!--
##### CSI Plugins

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

Code associated with {{< glossary_tooltip text="CSI" term_id="csi" >}} plugins ship as out-of-tree scripts and binaries that are typically distributed as container images and deployed using standard Kubernetes constructs like DaemonSets and StatefulSets. CSI plugins handle a wide range of volume management actions in Kubernetes: provisioning/de-provisioning/resizing of volumes, attaching/detaching of volumes to/from a Kubernetes node and mounting/dismounting a volume to/from individual containers in a pod, backup/restore of persistent data using snapshots and cloning. CSI plugins typically consist of node plugins (that run on each node as a DaemonSet) and controller plugins.

CSI node plugins (especially those associated with persistent volumes exposed as either block devices or over a shared file-system) need to perform various privileged operations like scanning of disk devices, mounting of file systems, etc. These operations differ for each host operating system. For Linux worker nodes, containerized CSI node plugins are typically deployed as privileged containers. For Windows worker nodes, privileged operations for containerized CSI node plugins is supported using [csi-proxy](https://github.com/kubernetes-csi/csi-proxy), a community-managed, stand-alone binary that needs to be pre-installed on each Windows node. Please refer to the deployment guide of the CSI plugin you wish to deploy for further details.
-->
##### CSI 插件库

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

与 {<glossary_tooltip text=“CSI”term_id=“CSI”>}} 插件相关的代码以树外脚本和二进制文件的形式提供，这些脚本和二进制文件通常作为容器映像分发，并使用标准 Kubernetes 构造（如守护程序集和状态集）进行部署。
CSI 插件在 Kubernetes 中处理范围广泛的卷管理操作：卷的配置/取消配置/调整大小、将卷附加/分离到 Kubernetes 节点或从 Kubernetes 节点上分离卷、在 pod 中的单个容器上装载/卸载卷、使用快照和克隆备份/恢复持久数据。
CSI 插件通常由节点插件（作为守护进程在每个节点上运行）和控制器插件组成。

CSI 节点插件（尤其是那些与持久卷相关联的插件，这些卷要么作为块设备公开，要么通过共享文件系统公开），需要执行各种特权操作，如磁盘设备扫描、文件系统挂载等。
这些操作因主机操作系统而异。对于 Linux 工作节点，容器化 CSI 节点插件通常部署为特权容器。
对于 Windows worker 节点，使用 [CSI proxy](https://github.com/kubernetes-csi/csi-proxy) 支持容器化CSI节点插件的特权操作，需要在每个 Windows 节点上预安装社区管理的独立二进制文件。有关详细信息，请参阅你希望部署的 CSI 插件的部署指南。

<!--
#### Networking

Networking for Windows containers is exposed through [CNI plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/). Windows containers function similarly to virtual machines in regards to networking. Each container has a virtual network adapter (vNIC) which is connected to a Hyper-V virtual switch (vSwitch). The Host Networking Service (HNS) and the Host Compute Service (HCS) work together to create containers and attach container vNICs to networks. HCS is responsible for the management of containers whereas HNS is responsible for the management of networking resources such as:

* Virtual networks (including creation of vSwitches)
* Endpoints / vNICs
* Namespaces
* Policies (Packet encapsulations, Load-balancing rules, ACLs, NAT'ing rules, etc.)
-->
#### 网络

Windows 容器的网络通过 [CNI plugins](/docs/concepts/extend-kubernetes/compute storage net/network plugins/) 公开。Windows 容器在网络方面的功能类似于虚拟机。每个容器都有一个连接到 Hyper-V 虚拟交换机（vSwitch）的虚拟网络适配器（vNIC）。
主机网络服务（HNS）和主机计算服务（HCS）协同工作来创建容器并将容器 vnic 附加到网络上。HCS 负责管理容器，而 HNS 负责管理网络资源，如：

* 虚拟网络（包括创建vSwitch）
* Endpoints / vNICs
* Namespaces
* Policies （包封装、负载平衡规则、ACL、NAT规则等）
<!--
The following service spec types are supported:

* NodePort
* ClusterIP
* LoadBalancer
* ExternalName
-->
支持以下服务规范类型：

* NodePort
* ClusterIP
* LoadBalancer
* ExternalName

<!--
##### Network modes
Windows supports five different networking drivers/modes: L2bridge, L2tunnel, Overlay, Transparent, and NAT. In a heterogeneous cluster with Windows and Linux worker nodes, you need to select a networking solution that is compatible on both Windows and Linux. The following out-of-tree plugins are supported on Windows, with recommendations on when to use each CNI:
-->
##### 网络模式
Windows 支持五种不同的网络驱动程序/模式：L2bridge、L2tunnel、Overlay、Transparent 和 NAT。在具有 Windows 和 Linux worker 节点的异构集群中，需要选择在 Windows 和 Linux 上都兼容的网络解决方案。Windows 支持以下树外插件，并建议何时使用每个 CNI ：

<!--
| Network Driver | Description | Container Packet Modifications | Network Plugins | Network Plugin Characteristics |
| -------------- | ----------- | ------------------------------ | --------------- | ------------------------------ |
| L2bridge       | Containers are attached to an external vSwitch. Containers are attached to the underlay network, although the physical network doesn't need to learn the container MACs because they are rewritten on ingress/egress. | MAC is rewritten to host MAC, IP may be rewritten to host IP using HNS OutboundNAT policy. | [win-bridge](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-bridge), [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md), Flannel host-gateway uses win-bridge | win-bridge uses L2bridge network mode, connects containers to the underlay of hosts, offering best performance. Requires user-defined routes (UDR) for inter-node connectivity. |
| L2Tunnel | This is a special case of l2bridge, but only used on Azure. All packets are sent to the virtualization host where SDN policy is applied. | MAC rewritten, IP visible on the underlay network | [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) | Azure-CNI allows integration of containers with Azure vNET, and allows them to leverage the set of capabilities that [Azure Virtual Network provides](https://azure.microsoft.com/en-us/services/virtual-network/). For example, securely connect to Azure services or use Azure NSGs. See [azure-cni for some examples](https://docs.microsoft.com/en-us/azure/aks/concepts-network#azure-cni-advanced-networking) |
| Overlay (Overlay networking for Windows in Kubernetes is in *alpha* stage) | Containers are given a vNIC connected to an external vSwitch. Each overlay network gets its own IP subnet, defined by a custom IP prefix.The overlay network driver uses VXLAN encapsulation. | Encapsulated with an outer header. | [Win-overlay](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-overlay), Flannel VXLAN (uses win-overlay) | win-overlay should be used when virtual container networks are desired to be isolated from underlay of hosts (e.g. for security reasons). Allows for IPs to be re-used for different overlay networks (which have different VNID tags)  if you are restricted on IPs in your datacenter.  This option requires [KB4489899](https://support.microsoft.com/help/4489899) on Windows Server 2019. |
| Transparent (special use case for [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes)) | Requires an external vSwitch. Containers are attached to an external vSwitch which enables intra-pod communication via logical networks (logical switches and routers). | Packet is encapsulated either via [GENEVE](https://datatracker.ietf.org/doc/draft-gross-geneve/) or [STT](https://datatracker.ietf.org/doc/draft-davie-stt/) tunneling to reach pods which are not on the same host.  <br/> Packets are forwarded or dropped via the tunnel metadata information supplied by the ovn network controller. <br/> NAT is done for north-south communication. | [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) | [Deploy via ansible](https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib). Distributed ACLs can be applied via Kubernetes policies. IPAM support. Load-balancing can be achieved without kube-proxy. NATing is done without using iptables/netsh. |
| NAT (*not used in Kubernetes*) | Containers are given a vNIC connected to an internal vSwitch. DNS/DHCP is provided using an internal component called [WinNAT](https://blogs.technet.microsoft.com/virtualization/2016/05/25/windows-nat-winnat-capabilities-and-limitations/) | MAC and IP is rewritten to host MAC/IP. | [nat](https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat) | Included here for completeness |
-->
| 网络驱动程序 | 描述 | 容器数据包修改 | 网络插件 | 网络插件特征 |
| -------------- | ----------- | ------------------------------ | --------------- | ------------------------------ |
| L2bridge       | 容器已连接到外部 vSwitch 。 容器连接到底层网络，尽管物理网络无需学习容器 MAC ，因为它们是在入口/出口处重写的。 | MAC 被重写为主机 MAC，可以使用 HNS OutboundNAT 策略将 IP 重写为主机 IP。 | [win-bridge](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-bridge)， [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md)， Flannel 主机网关使用 Win-bridge | Win-bridge 使用 L2bridge 网络模式，将容器连接到主机底层，从而提供最佳性能。 需要用于节点间连接的用户定义的路由（UDR）。|
| L2Tunnel | 这是 l2bridge 的特例，但仅在 Azure 上使用。所有数据包都发送到应用了 SDN 策略的虚拟化主机。 | 重写了 MAC，在底层网络上可以看到 IP | [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) | Azure-CNI允许容器与Azure vNET集成，并允许它们利用[Azure虚拟网络提供的](https://azure.microsoft.com/en-us/services/virtual-network/)功能集。 例如，安全地连接到 Azure 服务或使用 Azure NSG 。 参考 [举例说明 azure-cni ](https://docs.microsoft.com/en-us/azure/aks/concepts-network#azure-cni-advanced-networking) |
| Overlay （Windows 的 Overlay 网络在 Kubernetes 中处于 *alpha* 阶段） | 为容器提供了连接到外部 vSwitch 的 vNIC 。 每个覆盖网络都有自己的 IP 子网，该 IP 子网由自定义 IP 前缀定义。覆盖网络驱动程序使用 VXLAN 封装。 | 用外部头封装。 | [Win-overlay](https://github.com/containernetworking/plugins/tree/master/plugins/main/windows/win-overlay) ， Flannel VXLAN （使用 win-overlay） | 当希望将虚拟容器网络与主机底层隔离时（例如出于安全原因），应使用 win-overlay。如果你对数据中心中的 IP 进行限制，则可以将 IP 重新用于不同的覆盖网络（具有不同的 VNID 标签）。此选项在 Windows Server 2019上要求 [KB4489899](https://support.microsoft.com/help/4489899)。 |
| Transparent ([ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) 的特殊用例) | 需要一个外部 vSwitch。容器连接到外部 vSwitch，该 vSwitch 允许通过逻辑网络（逻辑交换机和路由器）进行内部 Pod 通信。 | 数据包通过 [GENEVE](https://datatracker.ietf.org/doc/draft-gross-geneve/) 或 [STT](https://datatracker.ietf.org/doc/draft-davie-stt/) 隧道封装，以到达不在同一主机上的 Pod 。 <br/> 数据包通过 ovn 网络控制器提供的隧道元数据信息转发或丢弃。 <br/> NAT 用于南北通信。 | [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) | [Deploy via ansible](https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib)。可以通过 Kubernetes 策略应用分布式 ACL 。IPAM 支持。无需 kube-proxy 即可实现负载平衡。无需使iptables/netsh 即可完成 NAT。 |
| NAT (*在Kubernetes中不使用*) | 为容器提供了连接到内部 vSwitch 的 vNIC 。使用称为 [WinNAT]（https://blogs.technet.microsoft.com/virtualization/2016/05/25/windows-nat-winnat-capabilities-and-limitations/） 的内部组件提供 DNS/DHCP 。MAC 和 IP 被重写为主机 MAC/IP。 | [nat](https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat) | 包含在此处是为了完整性 |

<!--
As outlined above, the [Flannel](https://github.com/coreos/flannel) CNI [meta plugin](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel) is also supported on [Windows](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel#windows-support-experimental) via the [VXLAN network backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) (**alpha support** ; delegates to win-overlay) and [host-gateway network backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) (stable support; delegates to win-bridge). This plugin supports delegating to one of the reference CNI plugins (win-overlay, win-bridge), to work in conjunction with Flannel daemon on Windows (Flanneld) for automatic node subnet lease assignment and HNS network creation. This plugin reads in its own configuration file (cni.conf), and aggregates it with the environment variables from the FlannelD generated subnet.env file. It then delegates to one of the reference CNI plugins for network plumbing, and sends the correct configuration containing the node-assigned subnet to the IPAM plugin (e.g. host-local).
-->
如上所述，[Flannel](https://github.com/coreos/flannel) CNI [元插件](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel)在 [Windows](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel#windows-support-experimental) 上也支持，通过 [VXLAN 网络后端](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)（**alpha 支持**；委托 win overlay）和 [host-gateway network backend](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) （稳定支持；代表赢得桥梁）。
此插件支持委派给一个参考 CNI 插件（win overlay，win bridge），与 Windows 上的 Flannel 守护程序（Flanneld）一起工作，以自动分配节点子网租约和创建 HNS 网络。这个插件读取它自己的配置文件(中国国际会议)，并使用生成的 FlannelD 中的环境变量对其进行聚合子网 .env 文件。
然后，它委托给一个参考 CNI 插件进行网络连接，并将包含节点分配的子网的正确配置发送到 IPAM 插件（例如主机本地）。

<!--
For the node, pod, and service objects, the following network flows are supported for TCP/UDP traffic:

* Pod -> Pod (IP)
* Pod -> Pod (Name)
* Pod -> Service (Cluster IP)
* Pod -> Service (PQDN, but only if there are no ".")
* Pod -> Service (FQDN)
* Pod -> External (IP)
* Pod -> External (DNS)
* Node -> Pod
* Pod -> Node
-->
对于节点、pod 和 service 对象，TCP/UDP 流量支持以下网络流：

* Pod -> Pod (IP)
* Pod -> Pod (Name)
* Pod -> Service (Cluster IP)
* Pod -> Service (PQDN, 但前提是没有 ".")
* Pod -> Service (FQDN)
* Pod -> External (IP)
* Pod -> External (DNS)
* Node -> Pod
* Pod -> Node

<!--
##### IP address management (IPAM) {#ipam}
The following IPAM options are supported on Windows:

* [Host-local](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/host-local)
* HNS IPAM (Inbox platform IPAM, this is a fallback when no IPAM is set)
* [Azure-vnet-ipam](https://github.com/Azure/azure-container-networking/blob/master/docs/ipam.md) (for azure-cni only)
-->
##### IP地址管理 (IPAM) {#ipam}
Windows 支持以下 IPAM 选项：

* [Host-local](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/host-local)
* HNS IPAM （Inbox 平台 IPAM, 这是没有设置IPAM时的备用）
* [Azure-vnet-ipam](https://github.com/Azure/azure-container-networking/blob/master/docs/ipam.md) (for azure-cni only)

<!--
##### Load balancing and Services

On Windows, you can use the following settings to configure Services and load balancing behavior:

{{< table caption="Windows Service Settings" >}}
| Feature | Description | Supported Kubernetes version  | Supported Windows OS build | How to enable |
| ------- | ----------- | ----------------------------- | -------------------------- | ------------- |
| Session affinity | Ensures that connections from a particular client are passed to the same Pod each time. | v1.19+ | [Windows Server vNext Insider Preview Build 19551](https://blogs.windows.com/windowsexperience/2020/01/28/announcing-windows-server-vnext-insider-preview-build-19551/) (or higher) | Set `service.spec.sessionAffinity` to "ClientIP" |
| Direct Server Return | Load balancing mode where the IP address fixups and the LBNAT occurs at the container vSwitch port directly; service traffic arrives with the source IP set as the originating pod IP. Promises lower latency and scalability. | v1.15+ | Windows Server, version 2004 | Set the following flags in kube-proxy: `--feature-gates="WinDSR=true" --enable-dsr=true` |
| Preserve-Destination | Skips DNAT of service traffic, thereby preserving the virtual IP of the target service in packets reaching the backend Pod. This setting will also ensure that the client IP of incoming packets get preserved. | v1.15+ | Windows Server, version 1903 (or higher) | Set `"preserve-destination": "true"` in service annotations and enable DSR flags in kube-proxy. |
| IPv4/IPv6 dual-stack networking | Native IPv4-to-IPv4 in parallel with IPv6-to-IPv6 communications to, from, and within a cluster | v1.19+ | Windows Server vNext Insider Preview Build 19603 (or higher) | See [IPv4/IPv6 dual-stack](#ipv4ipv6-dual-stack) |
{{< /table >}}
-->
##### 负载均衡和 Services

在 Windows 上，可以使用以下设置来配置服务和负载平衡行为：

{{< table caption="Windows Service Settings" >}}
| 功能 | 描述 | 支持的 Kubernetes 版本  | 支持的 Windows 操作系统版本 | 如何启用 |
| ------- | ----------- | ----------------------------- | -------------------------- | ------------- |
| Session affinity | 确保每次都将来自特定客户端的连接传递到同一 Pod 。 | v1.19+ | [Windows Server vNext Insider Preview Build 19551](https://blogs.windows.com/windowsexperience/2020/01/28/announcing-windows-server-vnext-insider-preview-build-19551/) (或以上版本) | 将 `service.spec.sessionAffinity` 设置为 “ClientIP” |
| Direct Server Return | 负载平衡模式，其中 IP 地址修正和 LBNAT 直接在容器 vSwitch 端口上发生； 服务流量以源 IP 设置为原始 Pod IP 的形式到达。承诺更低的延迟和可扩展性。 | v1.15+ | Windows Server, 2004 版本 | 在kube-proxy中设置以下标志： `--feature-gates="WinDSR=true" --enable-dsr=true` |
| Preserve-Destination | 跳过服务流量的 DNAT，从而在到达后端 Pod 的数据包中保留目标服务的虚拟 IP 。此设置还将确保保留传入数据包的客户端 IP 。 | v1.15+ | Windows Server, 1903 版本 (或以上版本) | 在服务注释中设置 `"preserve-destination": "true"`，并在 kube-proxy 中启用 DSR 标志。 |
| IPv4/IPv6 dual-stack networking | 与集群之间，集群之间以及集群内部的 IPv6 到 IPv6 通信并行的本机 IPv4 到 IPv4  | v1.19+ | Windows Server vNext Insider Preview 内部版本19603（或更高版本） | 参考 [IPv4/IPv6 dual-stack](#ipv4ipv6-dual-stack) |
{{< /table >}}

<!--
#### IPv4/IPv6 dual-stack
You can enable IPv4/IPv6 dual-stack networking for `l2bridge` networks using the `IPv6DualStack` [feature gate](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/). See [enable IPv4/IPv6 dual stack](/docs/concepts/services-networking/dual-stack#enable-ipv4ipv6-dual-stack) for more details.

{{< note >}}
On Windows, using IPv6 with Kubernetes require Windows Server vNext Insider Preview Build 19603 (or higher).
{{< /note >}}

{{< note >}}
Overlay (VXLAN) networks on Windows do not support dual-stack networking today.
{{< /note >}}
-->
#### IPv4/IPv6 dual-stack
你可以使用 `IPv6DualStack` [功能门](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)为 `l2bridge` 网络启用 IPv4/IPv6 双协议栈网络。有关更多详细信息，请参见[启用 IPv4/IPv6 双协议栈](/docs/concepts/services-networking/dual-stack#enable-ipv4ipv6-dual-stack)。

{{< note >}}
在 Windows 上，将 IPv6 与 Kubernetes 一起使用需要 Windows Server vNext Insider Preview Build 19603（或更高版本）。
{{< /note >}}

{{< note >}}
Windows 上的覆盖 （VXLAN） 网络目前不支持双堆栈网络。
{{< /note >}}

<!--
### Limitations

#### Control Plane

Windows is only supported as a worker node in the Kubernetes architecture and component matrix. This means that a Kubernetes cluster must always include Linux master nodes, zero or more Linux worker nodes, and zero or more Windows worker nodes.
-->
### 局限性

#### 控制平面

在 Kubernetes 架构和组件矩阵中，仅支持 Windows 作为工作节点。 这意味着 Kubernetes 集群必须始终包括 Linux 主节点，零个或多个 Linux 工作程序节点以及零个或多个 Windows 工作程序节点。

<!--
#### Compute

##### Resource management and process isolation

 Linux cgroups are used as a pod boundary for resource controls in Linux. Containers are created within that boundary for network, process and file system isolation. The cgroups APIs can be used to gather cpu/io/memory stats. In contrast, Windows uses a Job object per container with a system namespace filter to contain all processes in a container and provide logical isolation from the host. There is no way to run a Windows container without the namespace filtering in place. This means that system privileges cannot be asserted in the context of the host, and thus privileged containers are not available on Windows. Containers cannot assume an identity from the host because the Security Account Manager (SAM) is separate.
-->
#### 计算

##### 资源管理和流程隔离

 Linux cgroup 用作 Linux 中资源控制的 pod 边界。在该边界内创建容器以隔离网络，进程和文件系统。cgroups API 可用于收集 cpu/io 内存统计信息。
 相反，Windows 使用每个容器的 Job 对象以及系统名称空间过滤器来包含容器中的所有进程，并提供与主机的逻辑隔离。没有名称空间过滤，就无法运行 Windows 容器。
 这意味着无法在主机上下文中声明系统特权，因此特权容器在 Windows 上不可用。 由于安全帐户管理器 （SAM） 是独立的，因此容器无法从主机获取身份。
 
<!--
##### Operating System Restrictions

Windows has strict compatibility rules, where the host OS version must match the container base image OS version. Only Windows containers with a container operating system of Windows Server 2019 are supported. Hyper-V isolation of containers, enabling some backward compatibility of Windows container image versions, is planned for a future release.

##### Feature Restrictions
-->
##### 操作系统限制

Windows 具有严格的兼容性规则，其中主机 OS 版本必须与容器基本映像 OS 版本匹配。仅支持具有 Windows Server 2019 容器操作系统的 Windows 容器。计划在将来的发行版中对容器进行 Hyper-V 隔离，以实现 Windows 容器映像版本的向后兼容性。
##### Feature Restrictions

<!--
* TerminationGracePeriod: not implemented
* Single file mapping: to be implemented with CRI-ContainerD
* Termination message: to be implemented with CRI-ContainerD
* Privileged Containers: not currently supported in Windows containers
* HugePages: not currently supported in Windows containers
* The existing node problem detector is Linux-only and requires privileged containers. In general, we don't expect this to be used on Windows because privileged containers are not supported
* Not all features of shared namespaces are supported (see API section for more details)
-->
* TerminationGracePeriod：未实现
* 单个文件映射：将与 CRI-ContainerD 一起实现
* 终止消息：将与 CRI-ContainerD 一起实施
* 特权容器：Windows 容器当前不支持
* HugePages：Windows 容器当前不支持
* 现有的节点问题检测器仅适用于 Linux，并且需要特权容器。 通常，我们不希望在 Windows 上使用它，因为不支持特权容器
* 并非支持共享名称空间的所有功能（有关更多详细信息，请参阅 API 部分）

<!--
##### Memory Reservations and Handling

Windows does not have an out-of-memory process killer as Linux does. Windows always treats all user-mode memory allocations as virtual, and pagefiles are mandatory. The net effect is that Windows won't reach out of memory conditions the same way Linux does, and processes page to disk instead of being subject to out of memory (OOM) termination. If memory is over-provisioned and all physical memory is exhausted, then paging can slow down performance.

-->
##### 内存保留和处理

Windows 没有像 Linux 这样的内存不足进程杀手。Windows 始终将所有用户模式的内存分配都视为虚拟的，而页面文件则是必需的。最终结果是 Windows 不会像 Linux 那样达到内存不足的情况，而是处理页面到磁盘而不是内存不足（OOM）终止。 
如果内存预留过多，并且所有物理内存都已耗尽，则分页会降低性能。

<!--
Keeping memory usage within reasonable bounds is possible with a two-step process. First, use the kubelet parameters `--kubelet-reserve` and/or `--system-reserve` to account for memory usage on the node (outside of containers). This reduces [NodeAllocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)). As you deploy workloads, use resource limits (must set only limits or limits must equal requests) on containers. This also subtracts from NodeAllocatable and prevents the scheduler from adding more pods once a node is full.
-->
通过两步过程，可以将内存使用率保持在合理的范围内。首先，使用 kubelet 参数`--kubelet-reserve` 和/或 `--system-reserve` 来说明节点（容器外部）上的内存使用情况。
这减少了 [NodeAllocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) 。 部署工作负载时，请在容器上使用资源限制（必须仅设置限制，或者限制必须等于请求）。 
这也从 NodeAllocatable 中减去，并防止调度器在节点已满时添加更多的 Pod。

<!--
A best practice to avoid over-provisioning is to configure the kubelet with a system reserved memory of at least 2GB to account for Windows, Docker, and Kubernetes processes.

The behavior of the flags behave differently as described below:
-->
避免过度配置的最佳实践是为 kubelet 配置至少 2GB 的系统保留内存，以应对 Windows，Docker 和 Kubernetes 进程。

标志的行为具有不同的行为，如下所述：

<!--
* `--kubelet-reserve`, `--system-reserve` , and `--eviction-hard` flags update Node Allocatable
* Eviction by using `--enforce-node-allocable` is not implemented
* Eviction by using `--eviction-hard` and `--eviction-soft` are not implemented
* MemoryPressure Condition is not implemented
* There are no OOM eviction actions taken by the kubelet
* Kubelet running on the windows node does not have memory restrictions. `--kubelet-reserve` and `--system-reserve` do not set limits on kubelet or processes running on the host. This means kubelet or a process on the host could cause memory resource starvation outside the node-allocatable and scheduler
-->
* `--kubelet-reserve`，`--system-reserve` 和 `--eviction-hard` 标志更新可分配节点
* 使用 `--enforce-node-allocable` 的驱逐未实现
* 使用 `--eviction-hard` 和 `--eviction-soft` 的驱逐未实现
* 未实现 MemoryPressure 条件
* kubelet 没有采取 OOM 驱逐动作
* 在 Windows 节点上运行的 Kubelet 没有内存限制。--kubelet-reserve 和 --system-reserve 不会对在主机上运行的 kubelet 或进程设置限制。这意味着 kubelet 或主机上的进程可能会导致节点可分配和调度程序之外的内存资源短缺

<!--
#### Storage

Windows has a layered filesystem driver to mount container layers and create a copy filesystem based on NTFS. All file paths in the container are resolved only within the context of that container.

* Volume mounts can only target a directory in the container, and not an individual file
* Volume mounts cannot project files or directories back to the host filesystem
* Read-only filesystems are not supported because write access is always required for the Windows registry and SAM database. However, read-only volumes are supported
* Volume user-masks and permissions are not available. Because the SAM is not shared between the host & container, there's no mapping between them. All permissions are resolved within the context of the container
-->
#### 存储

Windows 具有分层的文件系统驱动程序，用于挂载容器层并基于 NTFS 创建复制文件系统。 容器中的所有文件路径仅在该容器的上下文中解析。

* 卷挂载只能针对容器中的目录，而不能针对单个文件
* 卷装载无法将文件或目录投影回主机文件系统
* 不支持只读文件系统，因为 Windows 注册表和 SAM 数据库始终需要写访问权限。 但是，支持只读卷
* 卷用户掩码和权限不可用。 因为 SAM 在主机和容器之间不共享，所以它们之间没有映射。 所有权限都在容器的上下文中解决

<!--
As a result, the following storage functionality is not supported on Windows nodes

* Volume subpath mounts. Only the entire volume can be mounted in a Windows container.
* Subpath volume mounting for Secrets
* Host mount projection
* DefaultMode (due to UID/GID dependency)
* Read-only root filesystem. Mapped volumes still support readOnly
* Block device mapping
* Memory as the storage medium
* File system features like uui/guid, per-user Linux filesystem permissions
* NFS based storage/volume support
* Expanding the mounted volume (resizefs)
-->
因此，Windows 节点不支持以下存储功能

* 卷子路径安装。 Windows 容器中只能安装整个卷。
* 秘密的子路径卷安装
* 主机安装投影
* DefaultMode（由于 UID/GID 依赖性）
* 只读根文件系统。映射的卷仍支持 readOnly
* 块设备映射
* 内存作为存储介质
* 文件系统功能，例如 uui/guid，每用户 Linux 文件系统权限
* 基于 NFS 的存储/卷支持
* 扩展已安装的卷（resizefs）

<!--
#### Networking

Windows Container Networking differs in some important ways from Linux networking. The [Microsoft documentation for Windows Container Networking](https://docs.microsoft.com/en-us/virtualization/windowscontainers/container-networking/architecture) contains additional details and background.
-->
#### 网络

Windows 容器网络在某些重要方面与 Linux 网络不同。 [Windows 容器网络的 Microsoft 文档](https://docs.microsoft.com/zh-cn/virtualization/windowscontainers/container-networking/architecture)包含其他详细信息和背景。

<!--
The Windows host networking service and virtual switch implement namespacing and can create virtual NICs as needed for a pod or container. However, many configurations such as DNS, routes, and metrics are stored in the Windows registry database rather than /etc/... files as they are on Linux. The Windows registry for the container is separate from that of the host, so concepts like mapping /etc/resolv.conf from the host into a container don't have the same effect they would on Linux. These must be configured using Windows APIs run in the context of that container. Therefore CNI implementations need to call the HNS instead of relying on file mappings to pass network details into the pod or container.
-->
Windows 主机网络服务和虚拟交换机实现命名间隔，并可以根据需要为 Pod 或容器创建虚拟 NIC 。 但是，许多配置（例如 DNS，路由和度量标准）存储在 Windows 注册表数据库中，而不是像在 Linux 上那样存储在/etc/... 文件中。
容器的 Windows 注册表与主机的注册表是分开的，因此将 /etc/resolv.conf 从主机映射到容器的概念与在 Linux 上的效果不同。
这些必须使用在该容器的上下文中运行的 Windows API 进行配置。因此，CNI 实现需要调用 HNS，而不是依赖文件映射将网络详细信息传递到 Pod 或容器中。

<!--
The following networking functionality is not supported on Windows nodes

* Host networking mode is not available for Windows pods
* Local NodePort access from the node itself fails (works for other nodes or external clients)
* Accessing service VIPs from nodes will be available with a future release of Windows Server
* Overlay networking support in kube-proxy is an alpha release. In addition, it requires [KB4482887](https://support.microsoft.com/en-us/help/4482887/windows-10-update-kb4482887) to be installed on Windows Server 2019
* Local Traffic Policy and DSR mode
-->
Windows 节点不支持以下联网功能

* 主机联网模式不适用于 Windows Pod
* 从节点本身进行本地 NodePort 访问失败（适用于其他节点或外部客户端）
* 将来的 Windows Server 版本将提供从节点访问服务 VIP 的功能
* kube-proxy 中的 Overlay 网络支持是 Alpha 版本。此外，它要求[KB4482887]（https://support.microsoft.com/zh-cn/help/4482887/windows-10-update-kb4482887）必须安装在 Windows Server 2019上
* 本地流量策略和 DSR 模式
<!--
* Windows containers connected to l2bridge, l2tunnel, or overlay networks do not support communicating over the IPv6 stack. There is outstanding Windows platform work required to enable these network drivers to consume IPv6 addresses and subsequent Kubernetes work in kubelet, kube-proxy, and CNI plugins.
* Outbound communication using the ICMP protocol via the win-overlay, win-bridge, and Azure-CNI plugin. Specifically, the Windows data plane ([VFP](https://www.microsoft.com/en-us/research/project/azure-virtual-filtering-platform/)) doesn't support ICMP packet transpositions. This means:
  * ICMP packets directed to destinations within the same network (e.g. pod to pod communication via ping) work as expected and without any limitations
  * TCP/UDP packets work as expected and without any limitations
  * ICMP packets directed to pass through a remote network (e.g. pod to external internet communication via ping) cannot be transposed and thus will not be routed back to their source
  * Since TCP/UDP packets can still be transposed, one can substitute `ping <destination>` with `curl <destination>` to be able to debug connectivity to the outside world.
-->
* 连接到 l2bridge，l2tunnel 或覆盖网络的 Windows 容器不支持通过 IPv6 堆栈进行通信。要使这些网络驱动程序能够使用 IPv6 地址，需要进行出色的 Windows 平台工作，随后的 Kubernetes 可以在 kubelet，kube-proxy 和 CNI 插件中使用。
* 通过 Win-overlay，Win-bridge 和 Azure-CNI 插件使用 ICMP 协议进行出站通信。具体来说，Windows 数据平面（[VFP](https://www.microsoft.com/zh-cn/research/project/azure-virtual-filtering-platform/)）不支持 ICMP 数据包转置。这意味着：
  * 定向到同一网络内目标的 ICMP 数据包（例如通过ping进行的Pod到Pod通信）可以按预期工作并且没有任何限制
  * TCP/UDP 数据包按预期工作，没有任何限制
  * 定向通过远程网络（例如 Pod 通过 ping 到外部 Internet 通信的 ICMP 数据包）无法进行转置，因此不会路由回其源
  * 由于仍可以转置 TCP/UDP数据包，因此可以用“ curl <destination>” 代替 “ ping <destination>”，以便调试与外界的连接。

<!--
These features were added in Kubernetes v1.15:

* `kubectl port-forward`
-->
这些功能已在Kubernetes v1.15中添加：

* `kubectl port-forward`

<!--
##### CNI Plugins

* Windows reference network plugins win-bridge and win-overlay do not currently implement [CNI spec](https://github.com/containernetworking/cni/blob/master/SPEC.md) v0.4.0 due to missing "CHECK" implementation.
* The Flannel VXLAN CNI has the following limitations on Windows:

1. Node-pod connectivity isn't possible by design. It's only possible for local pods with Flannel v0.12.0 (or higher).
2. We are restricted to using VNI 4096 and UDP port 4789. The VNI limitation is being worked on and will be overcome in a future release (open-source flannel changes). See the official [Flannel VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) backend docs for more details on these parameters.
-->
##### CNI 插件

* Windows 参考网络插件 win-bridge 和 win-overlay 当前未实现 [CNI 规范](https://github.com/containernetworking/cni/blob/master/SPEC.md) v0.4.0，原因是缺少“CHECK”实现 。
* Flannel VXLAN CNI 在 Windows 上具有以下限制：

1. 设计上无法实现节点 Pod 连接。 仅适用于 Flannel v0.12.0（或更高版本）的本地 Pod。
2. 我们被限制使用 VNI 4096和 UDP 端口4789。VNI 限制正在研究中，并将在以后的版本中解决（开源 flannel 的变化）。有关这些参数的更多详细信息，请参见官方 [Flannel VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) 后端文档。

<!--
##### DNS {#dns-limitations}

* ClusterFirstWithHostNet is not supported for DNS. Windows treats all names with a '.' as a FQDN and skips PQDN resolution
* On Linux, you have a DNS suffix list, which is used when trying to resolve PQDNs. On Windows, we only have 1 DNS suffix, which is the DNS suffix associated with that pod's namespace (mydns.svc.cluster.local for example). Windows can resolve FQDNs and services or names resolvable with just that suffix. For example, a pod spawned in the default namespace, will have the DNS suffix **default.svc.cluster.local**. On a Windows pod, you can resolve both **kubernetes.default.svc.cluster.local** and **kubernetes**, but not the in-betweens, like **kubernetes.default** or **kubernetes.default.svc**.
* On Windows, there are multiple DNS resolvers that can be used. As these come with slightly different behaviors, using the `Resolve-DNSName` utility for name query resolutions is recommended.
-->
##### DNS {#dns限制}

* DNS 不支持 ClusterFirstWithHostNet。Windows 将所有带有“.”的名称视为 FQDN，并跳过 PQDN 解析
* 在 Linux 上，你有一个 DNS 后缀列表，该列表在尝试解析 PQDN 时使用。 在 Windows 上，我们只有1个 DNS 后缀，这是与该 pod 的命名空间关联的 DNS 后缀（例如，mydns.svc.cluster.local）。Windows 可以解析带有该后缀的 FQDN 和服务或名称。例如，在默认名称空间中生成的 Pod 将具有 DNS 后缀 **default.svc.cluster.local** 。在 Windows Pod 上，你可以解析 **kubernetes.default.svc.cluster.local** 和 **kubernetes**，但不能解析中间值，例如 **kubernetes.default** 或 **kubernetes.default.svc**。
* 在 Windows 上，可以使用多个 DNS 解析器。 由于这些行为的行为略有不同，因此建议使用 `Resolve-DNSName` 实用程序进行名称查询解析。

<!--
##### IPv6
Kubernetes on Windows does not support single-stack "IPv6-only" networking. However,dual-stack IPv4/IPv6 networking for pods and nodes with single-family services is supported. See [IPv4/IPv6 dual-stack networking](#ipv4ipv6-dual-stack) for more details.
-->
##### IPv6
Windows 上的 Kubernetes 不支持单堆栈“仅 IPv6” 网络。但是，支持用于具有单族服务的 Pod 和节点的双栈 IPv4/IPv6 网络。有关更多详细信息，请参见 [IPv4/IPv6 双协议栈联网](#ipv4ipv6-dual-stack)。

<!--
##### Session affinity
Setting the maximum session sticky time for Windows services using `service.spec.sessionAffinityConfig.clientIP.timeoutSeconds` is not supported.
-->
##### 会话亲和力
不支持使用 `service.spec.sessionAffinityConfig.clientIP.timeoutSeconds`设置 Windows 服务的最大会话粘性时间。

<!--
##### Security

Secrets are written in clear text on the node's volume (as compared to tmpfs/in-memory on linux). This means customers have to do two things

1. Use file ACLs to secure the secrets file location
2. Use volume-level encryption using [BitLocker](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server)
-->
##### 安全

机密信息以明文形式写在节点的卷上（与 Linux上 的 tmpfs/in-memory 相比）。 这意味着客户必须做两件事

1. 使用文件 ACL 保护机密文件位置
2. 使用 [BitLocker](https://docs.microsoft.com/zh-cn/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server) 使用卷级加密

<!--
[RunAsUser ](/docs/concepts/policy/pod-security-policy/#users-and-groups)is not currently supported on Windows. The workaround is to create local accounts before packaging the container. The RunAsUsername capability may be added in a future release.
-->
Windows 当前不支持 [RunAsUser ](/docs/concepts/policy/pod-security-policy/#users-and-groups)。解决方法是在打包容器之前创建本地帐户。在将来的版本中可能会添加 RunAsUsername 功能。

<!--
Linux specific pod security context privileges such as SELinux, AppArmor, Seccomp, Capabilities (POSIX Capabilities), and others are not supported.

In addition, as mentioned already, privileged containers are not supported on Windows.
-->
不支持 Linux 特定的 pod 安全上下文特权，例如 SELinux、AppArmor、Seccomp、Capabilities (POSIX Capabilities) 和其他。

此外，如前所述，Windows 不支持特权容器。

<!--
#### API

There are no differences in how most of the Kubernetes APIs work for Windows. The subtleties around what's different come down to differences in the OS and container runtime. In certain situations, some properties on workload APIs such as Pod or Container were designed with an assumption that they are implemented on Linux, failing to run on Windows.
-->
#### API

大多数 Kubernetes API 在 Windows 上的工作方式没有差异。围绕不同之处的精妙之处归结为操作系统和容器运行时的差异。在某些情况下，工作负载 API（例如 Pod 或 Container） 的某些属性是在假定它们在 Linux 上实现而无法在 Windows 上运行的前提下设计的。

<!--
At a high level, these OS concepts are different:

* Identity - Linux uses userID (UID) and groupID (GID) which are represented as integer types. User and group names are not canonical - they are just an alias in `/etc/groups` or `/etc/passwd` back to UID+GID. Windows uses a larger binary security identifier (SID) which is stored in the Windows Security Access Manager (SAM) database. This database is not shared between the host and containers, or between containers.
* File permissions - Windows uses an access control list based on SIDs, rather than a bitmask of permissions and UID+GID
* File paths - convention on Windows is to use `\` instead of `/`. The Go IO libraries typically accept both and just make it work, but when you're setting a path or command line that's interpreted inside a container, `\` may be needed.
* Signals - Windows interactive apps handle termination differently, and can implement one or more of these:
  * A UI thread handles well-defined messages including WM_CLOSE
  * Console apps handle ctrl-c or ctrl-break using a Control Handler
  * Services register a Service Control Handler function that can accept SERVICE_CONTROL_STOP control codes
-->
在较高的层次上，这些操作系统概念是不同的：

* Identity- Linux 使用 userID （UID） 和 groupID （GID），它们被表示为整数类型。用户名和组名不是规范的-它们只是 `/etc/groups` 或 `/etc/passwd` 返回 UID+GID 中的别名。Windows 使用更大的二进制安全标识符（SID），该标识符存储在 Windows 安全访问管理器（SAM）数据库中。此数据库不在主机和容器之间或容器之间共享。
* 文件权限- Windows 使用基于 SID 的访问控制列表，而不是权限和 UID+GID 的位掩码
* 文件路径- Windows 上的惯例是使用“\”而不是“/”。Go-IO 库通常同时接受这两种方法并使其正常工作，但是当你设置在容器中解释的路径或命令行时，可能需要使用“\”。
* 信号- Windows 交互式应用程序处理终止的方式不同，可以实现一个或多个：
* UI 线程处理定义良好的消息，包括 WM_CLOSE
* 控制台应用程序使用控制处理程序处理 ctrl-c 或 ctrl-break
* 服务注册服务控制处理程序函数，该函数可以接受服务控制停止控制代码

<!--
Exit Codes follow the same convention where 0 is success, nonzero is failure. The specific error codes may differ across Windows and Linux. However, exit codes passed from the Kubernetes components (kubelet, kube-proxy) are unchanged.
-->
退出代码遵循相同的约定，其中0为成功，非零为失败。在 Windows 和 Linux 上，特定的错误代码可能有所不同。但是，从 Kubernetes 组件（kubelet，kube-proxy）传递的退出代码未更改。


<!--
##### V1.Container

* V1.Container.ResourceRequirements.limits.cpu and V1.Container.ResourceRequirements.limits.memory - Windows doesn't use hard limits for CPU allocations. Instead, a share system is used. The existing fields based on millicores are scaled into relative shares that are followed by the Windows scheduler. [see: kuberuntime/helpers_windows.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/kuberuntime/helpers_windows.go), [see: resource controls in Microsoft docs](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/resource-controls)
  * Huge pages are not implemented in the Windows container runtime, and are not available. They require [asserting a user privilege](https://docs.microsoft.com/en-us/windows/desktop/Memory/large-page-support) that's not configurable for containers.
* V1.Container.ResourceRequirements.requests.cpu and V1.Container.ResourceRequirements.requests.memory - Requests are subtracted from node available resources, so they can be used to avoid overprovisioning a node. However, they cannot be used to guarantee resources in an overprovisioned node. They should be applied to all containers as a best practice if the operator wants to avoid overprovisioning entirely.
* V1.Container.SecurityContext.allowPrivilegeEscalation - not possible on Windows, none of the capabilities are hooked up
* V1.Container.SecurityContext.Capabilities - POSIX capabilities are not implemented on Windows
* V1.Container.SecurityContext.privileged - Windows doesn't support privileged containers
* V1.Container.SecurityContext.procMount - Windows doesn't have a /proc filesystem
* V1.Container.SecurityContext.readOnlyRootFilesystem - not possible on Windows, write access is required for registry & system processes to run inside the container
* V1.Container.SecurityContext.runAsGroup - not possible on Windows, no GID support
* V1.Container.SecurityContext.runAsNonRoot - Windows does not have a root user. The closest equivalent is ContainerAdministrator which is an identity that doesn't exist on the node.
* V1.Container.SecurityContext.runAsUser - not possible on Windows, no UID support as int.
* V1.Container.SecurityContext.seLinuxOptions - not possible on Windows, no SELinux
* V1.Container.terminationMessagePath - this has some limitations in that Windows doesn't support mapping single files. The default value is /dev/termination-log, which does work because it does not exist on Windows by default.
-->
##### V1.Container

* V1.Container.ResourceRequirements.limits.cpu and V1.Container.ResourceRequirements.limits.memory - Windows 不对 CPU 分配使用硬限制。 而是使用共享系统。 基于千位数的现有字段被缩放为 Windows 计划程序遵循的相对份额。 [参考: kuberuntime/helpers_windows.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/kubelet/kuberuntime/helpers_windows.go), [参考: resource controls in Microsoft docs](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/resource-controls)
  * Windows 容器运行时中未实现大页面，并且这些页面不可用。他们需要无法为容器配置的[声明用户权限](https://docs.microsoft.com/en-us/windows/desktop/Memory/large-page-support) 。
* V1.Container.ResourceRequirements.requests.cpu and V1.Container.ResourceRequirements.requests.memory - 从节点可用资源中减去请求，因此可以将其用于避免过度配置节点。但是，它们不能用于保证预留空间中的资源。如果操作员希望完全避免过度配置，则应将它们应用于所有容器，这是最佳做法。
* V1.Container.SecurityContext.allowPrivilegeEscalation - 在 Windows 上无法实现，所有功能均未连接
* V1.Container.SecurityContext.Capabilities - Windows 上未实现 POSIX 功能
* V1.Container.SecurityContext.privileged - Windows 不支持特权容器
* V1.Container.SecurityContext.procMount - Windows 没有 /proc 文件系统
* V1.Container.SecurityContext.readOnlyRootFilesystem - 在 Windows 上无法实现，注册表和系统进程必须在容器中运行才具有写访问权
* V1.Container.SecurityContext.runAsGroup - 在 Windows 上无法使用，不支持 GID
* V1.Container.SecurityContext.runAsNonRoot - Windows 没有 root 用户。最接近的等效项是 ContainerAdministrator，它是节点上不存在的标识。
* V1.Container.SecurityContext.runAsUser - 在 Windows 上不可能，没有 int 的 UID 支持。
* V1.Container.SecurityContext.seLinuxOptions - 在 Windows 上不可能，没有 SELinux
* V1.Container.terminationMessagePath - 这有一些限制，因为 Windows 不支持映射单个文件。默认值为 /dev/termination-log，它可以工作，因为默认情况下 Windows 上不存在

<!--
##### V1.Pod

* V1.Pod.hostIPC, v1.pod.hostpid - host namespace sharing is not possible on Windows
* V1.Pod.hostNetwork - There is no Windows OS support to share the host network
* V1.Pod.dnsPolicy - ClusterFirstWithHostNet - is not supported because Host Networking is not supported on Windows.
* V1.Pod.podSecurityContext - see V1.PodSecurityContext below
* V1.Pod.shareProcessNamespace - this is a beta feature, and depends on Linux namespaces which are not implemented on Windows. Windows cannot share process namespaces or the container's root filesystem. Only the network can be shared.
* V1.Pod.terminationGracePeriodSeconds - this is not fully implemented in Docker on Windows, see: [reference](https://github.com/moby/moby/issues/25982). The behavior today is that the ENTRYPOINT process is sent CTRL_SHUTDOWN_EVENT, then Windows waits 5 seconds by default, and finally shuts down all processes using the normal Windows shutdown behavior. The 5 second default is actually in the Windows registry [inside the container](https://github.com/moby/moby/issues/25982#issuecomment-426441183), so it can be overridden when the container is built.
* V1.Pod.volumeDevices - this is a beta feature, and is not implemented on Windows. Windows cannot attach raw block devices to pods.
* V1.Pod.volumes - EmptyDir, Secret, ConfigMap, HostPath - all work and have tests in TestGrid
  * V1.emptyDirVolumeSource - the Node default medium is disk on Windows. Memory is not supported, as Windows does not have a built-in RAM disk.
* V1.VolumeMount.mountPropagation - mount propagation is not supported on Windows.
-->
##### V1.Pod

* V1.Pod.hostIPC, v1.pod.hostpid - Windows 上无法共享主机名称空间
* V1.Pod.hostNetwork - 没有 Windows OS 支持共享主机网络
* V1.Pod.dnsPolicy - ClusterFirstWithHostNet - 不支持，因为 Windows 不支持主机网络。
* V1.Pod.podSecurityContext - 请参阅下面的 V1.PodSecurityContext
* V1.Pod.shareProcessNamespace - 这是一个 beta 功能，它取决于 Windows 上未实现的 Linux 名称空间。Windows 无法共享进程名称空间或容器的根文件系统。仅网络可以共享。
* V1.Pod.terminationGracePeriodSeconds - 这在 Windows 的 Docker 中尚未完全实现， 参阅: [参考](https://github.com/moby/moby/issues/25982). 今天的行为是发送 ENTRYPOINT 进程 CTRL_SHUTDOWN_EVENT，然后 Windows 默认情况下等待5秒钟，最后使用正常的 Windows 关闭行为关闭所有进程。5秒的默认值实际上位于 Windows 注册表中[在容器内部]（https://github.com/moby/moby/issues/25982#issuecomment-426441183），因此在构建容器时可以将其覆盖。
* V1.Pod.volumeDevices - 这是一个 beta 功能，在 Windows 上未实现。Windows 无法将原始块设备连接到 Pod。
* V1.Pod.volumes - EmptyDir、Secret、ConfigMap、HostPath -全部工作并在 TestGrid 中进行测试
  * V1.emptyDirVolumeSource - Node 默认介质是 Windows 上的磁盘。不支持内存，因为 Windows 没有内置的 RAM 磁盘。
* V1.VolumeMount.mountPropagation - Windows 不支持挂载传播。

<!--
##### V1.PodSecurityContext

None of the PodSecurityContext fields work on Windows. They're listed here for reference.

* V1.PodSecurityContext.SELinuxOptions - SELinux is not available on Windows
* V1.PodSecurityContext.RunAsUser - provides a UID, not available on Windows
* V1.PodSecurityContext.RunAsGroup - provides a GID, not available on Windows
* V1.PodSecurityContext.RunAsNonRoot - Windows does not have a root user. The closest equivalent is ContainerAdministrator which is an identity that doesn't exist on the node.
* V1.PodSecurityContext.SupplementalGroups - provides GID, not available on Windows
* V1.PodSecurityContext.Sysctls - these are part of the Linux sysctl interface. There's no equivalent on Windows.
-->
##### V1.PodSecurityContext

PodSecurityContext 字段在 Windows 上均不起作用。 它们在此处列出以供参考。

* V1.PodSecurityContext.SELinuxOptions - SELinux 在 Windows 上不可用
* V1.PodSecurityContext.RunAsUser - 提供一个 UID，在 Windows 上不可用
* V1.PodSecurityContext.RunAsGroup - 提供 GID，在 Windows 上不可用
* V1.PodSecurityContext.RunAsNonRoot - Windows 没有 root 用户。最接近的等效项是 ContainerAdministrator ，它是节点上不存在的标识。
* V1.PodSecurityContext.SupplementalGroups - 提供 GID，在 Windows 上不可用
* V1.PodSecurityContext.Sysctls - 这些是 Linux sysctl 接口的一部分。Windows 上没有等效功能。

<!--
## Getting Help and Troubleshooting {#troubleshooting}

Your main source of help for troubleshooting your Kubernetes cluster should start with this [section](/docs/tasks/debug-application-cluster/troubleshooting/). Some additional, Windows-specific troubleshooting help is included in this section. Logs are an important element of troubleshooting issues in Kubernetes. Make sure to include them any time you seek troubleshooting assistance from other contributors. Follow the instructions in the SIG-Windows [contributing guide on gathering logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs).
-->
## 获取帮助和故障排除{#troubleshooting}

你的 Kubernetes 群集故障排除的主要帮助资源应从此 [部分](/docs/tasks/debug-application-cluster/troubleshooting/)开始。本节包括一些其他的 Windows 特定的疑难解答帮助。日志是解决 Kubernetes 中问题的重要元素。
当你寻求其他贡献者的故障排除帮助时，请确保将它们包括在内。请遵循 SIG-Windows [有关收集日志的贡献指南](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs)中的说明。

<!--
1. How do I know start.ps1 completed successfully?

    You should see kubelet, kube-proxy, and (if you chose Flannel as your networking solution) flanneld host-agent processes running on your node, with running logs being displayed in separate PowerShell windows. In addition to this, your Windows node should be listed as "Ready" in your Kubernetes cluster.
-->
1. 我如何知道start.ps1成功完成？

   你应该看到 kubelet，kube-proxy 和（如果你选择 Flannel 作为网络解决方案）在节点上运行的 flanneld 主机代理进程，并且运行日志分别显示在单独的 PowerShell 窗口中。 除此之外，你的 Windows 节点在 Kubernetes 群集中应列为“就绪”。

<!--
1. Can I configure the Kubernetes node processes to run in the background as services?

    Kubelet and kube-proxy are already configured to run as native Windows Services, offering resiliency by re-starting the services automatically in the event of failure (for example a process crash). You have two options for configuring these node components as services.
-->
1. 是否可以将 Kubernetes 节点进程配置为作为服务在后台运行？

   Kubelet 和 kube-proxy 已经配置为作为本机 Windows 服务运行，通过在出现故障（例如进程崩溃）时自动重新启动服务来提供弹性。 你有两个选项可将这些节点组件配置为服务。

<!--
   1. As native Windows Services

        Kubelet & kube-proxy can be run as native Windows Services using `sc.exe`.
       
        ```powershell
        # Create the services for kubelet and kube-proxy in two separate commands
        sc.exe create <component_name> binPath= "<path_to_binary> --service <other_args>"

        # Please note that if the arguments contain spaces, they must be escaped.
        sc.exe create kubelet binPath= "C:\kubelet.exe --service --hostname-override 'minion' <other_args>"

        # Start the services
        Start-Service kubelet
        Start-Service kube-proxy

        # Stop the service
        Stop-Service kubelet (-Force)
        Stop-Service kube-proxy (-Force)

        # Query the service status
        Get-Service kubelet
        Get-Service kube-proxy
        ```
-->
   1. 作为本机 Windows 服务

       Kubelet 和 kube-proxy 可以使用 `sc.exe` 作为本机 Windows 服务运行。
       
        ```powershell
        # Create the services for kubelet and kube-proxy in two separate commands
        sc.exe create <component_name> binPath= "<path_to_binary> --service <other_args>"

        # Please note that if the arguments contain spaces, they must be escaped.
        sc.exe create kubelet binPath= "C:\kubelet.exe --service --hostname-override 'minion' <other_args>"

        # Start the services
        Start-Service kubelet
        Start-Service kube-proxy

        # Stop the service
        Stop-Service kubelet (-Force)
        Stop-Service kube-proxy (-Force)

        # Query the service status
        Get-Service kubelet
        Get-Service kube-proxy
        ```
      
<!--      
   1. Using nssm.exe

        You can also always use alternative service managers like [nssm.exe](https://nssm.cc/) to run these processes (flanneld, kubelet & kube-proxy) in the background for you. You can use this [sample script](https://github.com/Microsoft/SDN/tree/master/Kubernetes/flannel/register-svc.ps1), leveraging nssm.exe to register kubelet, kube-proxy, and flanneld.exe to run as Windows services in the background.

        ```powershell
        register-svc.ps1 -NetworkMode <Network mode> -ManagementIP <Windows Node IP> -ClusterCIDR <Cluster subnet> -KubeDnsServiceIP <Kube-dns Service IP> -LogDir <Directory to place logs>

        # NetworkMode      = The network mode l2bridge (flannel host-gw, also the default value) or overlay (flannel vxlan) chosen as a network solution
        # ManagementIP     = The IP address assigned to the Windows node. You can use ipconfig to find this
        # ClusterCIDR      = The cluster subnet range. (Default value 10.244.0.0/16)
        # KubeDnsServiceIP = The Kubernetes DNS service IP (Default value 10.96.0.10)
        # LogDir           = The directory where kubelet and kube-proxy logs are redirected into their respective output files (Default value C:\k)
        ```

        If the above referenced script is not suitable, you can manually configure nssm.exe using the following examples.
        ```powershell
        # Register flanneld.exe
        nssm install flanneld C:\flannel\flanneld.exe
        nssm set flanneld AppParameters --kubeconfig-file=c:\k\config --iface=<ManagementIP> --ip-masq=1 --kube-subnet-mgr=1
        nssm set flanneld AppEnvironmentExtra NODE_NAME=<hostname>
        nssm set flanneld AppDirectory C:\flannel
        nssm start flanneld

        # Register kubelet.exe
        # Microsoft releases the pause infrastructure container at mcr.microsoft.com/k8s/core/pause:1.2.0
        nssm install kubelet C:\k\kubelet.exe
        nssm set kubelet AppParameters --hostname-override=<hostname> --v=6 --pod-infra-container-image=mcr.microsoft.com/k8s/core/pause:1.2.0 --resolv-conf="" --allow-privileged=true --enable-debugging-handlers --cluster-dns=<DNS-service-IP> --cluster-domain=cluster.local --kubeconfig=c:\k\config --hairpin-mode=promiscuous-bridge --image-pull-progress-deadline=20m --cgroups-per-qos=false  --log-dir=<log directory> --logtostderr=false --enforce-node-allocatable="" --network-plugin=cni --cni-bin-dir=c:\k\cni --cni-conf-dir=c:\k\cni\config
        nssm set kubelet AppDirectory C:\k
        nssm start kubelet

        # Register kube-proxy.exe (l2bridge / host-gw)
        nssm install kube-proxy C:\k\kube-proxy.exe
        nssm set kube-proxy AppDirectory c:\k
        nssm set kube-proxy AppParameters --v=4 --proxy-mode=kernelspace --hostname-override=<hostname>--kubeconfig=c:\k\config --enable-dsr=false --log-dir=<log directory> --logtostderr=false
        nssm.exe set kube-proxy AppEnvironmentExtra KUBE_NETWORK=cbr0
        nssm set kube-proxy DependOnService kubelet
        nssm start kube-proxy

        # Register kube-proxy.exe (overlay / vxlan)
        nssm install kube-proxy C:\k\kube-proxy.exe
        nssm set kube-proxy AppDirectory c:\k
        nssm set kube-proxy AppParameters --v=4 --proxy-mode=kernelspace --feature-gates="WinOverlay=true" --hostname-override=<hostname> --kubeconfig=c:\k\config --network-name=vxlan0 --source-vip=<source-vip> --enable-dsr=false --log-dir=<log directory> --logtostderr=false
        nssm set kube-proxy DependOnService kubelet
        nssm start kube-proxy
        ```


        For initial troubleshooting, you can use the following flags in [nssm.exe](https://nssm.cc/) to redirect stdout and stderr to a output file:

        ```powershell
        nssm set <Service Name> AppStdout C:\k\mysvc.log
        nssm set <Service Name> AppStderr C:\k\mysvc.log
        ```

        For additional details, see official [nssm usage](https://nssm.cc/usage) docs.
-->
   1. 使用 nssm.exe

        你也可以始终使用 [nssm.exe](https://nssm.cc/) 之类的备用服务管理器在后台为你运行这些进程（flanneld，kubelet 和 kube-proxy）。你可以使用此[示例脚本](https://github.com/Microsoft/SDN/tree/master/Kubernetes/flannel/register-svc.ps1)，利用 nssm.exe 注册 kubelet，kube-proxy 和 flanneld.exe 在后台作为 Windows 服务运行。
        
        ```powershell
        register-svc.ps1 -NetworkMode <Network mode> -ManagementIP <Windows Node IP> -ClusterCIDR <Cluster subnet> -KubeDnsServiceIP <Kube-dns Service IP> -LogDir <Directory to place logs>

        # NetworkMode      = The network mode l2bridge (flannel host-gw, also the default value) or overlay (flannel vxlan) chosen as a network solution
        # ManagementIP     = The IP address assigned to the Windows node. You can use ipconfig to find this
        # ClusterCIDR      = The cluster subnet range. (Default value 10.244.0.0/16)
        # KubeDnsServiceIP = The Kubernetes DNS service IP (Default value 10.96.0.10)
        # LogDir           = The directory where kubelet and kube-proxy logs are redirected into their respective output files (Default value C:\k)
        ```

        如果以上引用的脚本不合适，则可以使用以下示例手动配置 nssm.exe。
        ```powershell
        # Register flanneld.exe
        nssm install flanneld C:\flannel\flanneld.exe
        nssm set flanneld AppParameters --kubeconfig-file=c:\k\config --iface=<ManagementIP> --ip-masq=1 --kube-subnet-mgr=1
        nssm set flanneld AppEnvironmentExtra NODE_NAME=<hostname>
        nssm set flanneld AppDirectory C:\flannel
        nssm start flanneld

        # Register kubelet.exe
        # Microsoft releases the pause infrastructure container at mcr.microsoft.com/k8s/core/pause:1.2.0
        nssm install kubelet C:\k\kubelet.exe
        nssm set kubelet AppParameters --hostname-override=<hostname> --v=6 --pod-infra-container-image=mcr.microsoft.com/k8s/core/pause:1.2.0 --resolv-conf="" --allow-privileged=true --enable-debugging-handlers --cluster-dns=<DNS-service-IP> --cluster-domain=cluster.local --kubeconfig=c:\k\config --hairpin-mode=promiscuous-bridge --image-pull-progress-deadline=20m --cgroups-per-qos=false  --log-dir=<log directory> --logtostderr=false --enforce-node-allocatable="" --network-plugin=cni --cni-bin-dir=c:\k\cni --cni-conf-dir=c:\k\cni\config
        nssm set kubelet AppDirectory C:\k
        nssm start kubelet

        # Register kube-proxy.exe (l2bridge / host-gw)
        nssm install kube-proxy C:\k\kube-proxy.exe
        nssm set kube-proxy AppDirectory c:\k
        nssm set kube-proxy AppParameters --v=4 --proxy-mode=kernelspace --hostname-override=<hostname>--kubeconfig=c:\k\config --enable-dsr=false --log-dir=<log directory> --logtostderr=false
        nssm.exe set kube-proxy AppEnvironmentExtra KUBE_NETWORK=cbr0
        nssm set kube-proxy DependOnService kubelet
        nssm start kube-proxy

        # Register kube-proxy.exe (overlay / vxlan)
        nssm install kube-proxy C:\k\kube-proxy.exe
        nssm set kube-proxy AppDirectory c:\k
        nssm set kube-proxy AppParameters --v=4 --proxy-mode=kernelspace --feature-gates="WinOverlay=true" --hostname-override=<hostname> --kubeconfig=c:\k\config --network-name=vxlan0 --source-vip=<source-vip> --enable-dsr=false --log-dir=<log directory> --logtostderr=false
        nssm set kube-proxy DependOnService kubelet
        nssm start kube-proxy
        ```

        对于最初的故障排除，可以在 [nssm.exe](https://nssm.cc/) 中使用以下标志将 stdout 和 stderr 重定向到输出文件：

        ```powershell
        nssm set <Service Name> AppStdout C:\k\mysvc.log
        nssm set <Service Name> AppStderr C:\k\mysvc.log
        ```

        有关更多详细信息，请参见官方 [nssm 用法](https://nssm.cc/usage)文档。

<!--
1. My Windows Pods do not have network connectivity

    If you are using virtual machines, ensure that MAC spoofing is enabled on all the VM network adapter(s).
-->
1.我的 Windows Pods 没有网络连接

   如果使用虚拟机，请确保在所有 VM 网络适配器上启用了 MAC 欺骗。
 
 <!--    
1. My Windows Pods cannot ping external resources

    Windows Pods do not have outbound rules programmed for the ICMP protocol today. However, TCP/UDP is supported. When trying to demonstrate connectivity to resources outside of the cluster, please substitute `ping <IP>` with corresponding `curl <IP>` commands.

    If you are still facing problems, most likely your network configuration in [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf) deserves some extra attention. You can always edit this static file. The configuration update will apply to any newly created Kubernetes resources.

    One of the Kubernetes networking requirements (see [Kubernetes model](/docs/concepts/cluster-administration/networking/)) is for cluster communication to occur without NAT internally. To honor this requirement, there is an [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20) for all the communication where we do not want outbound NAT to occur. However, this also means that you need to exclude the external IP you are trying to query from the ExceptionList. Only then will the traffic originating from your Windows pods be SNAT'ed correctly to receive a response from the outside world. In this regard, your ExceptionList in `cni.conf` should look as follows:

    ```conf
    "ExceptionList": [
                    "10.244.0.0/16",  # Cluster subnet
                    "10.96.0.0/12",   # Service subnet
                    "10.127.130.0/24" # Management (host) subnet
                ]
    ```
-->
1. 我的 Windows Pods 无法 ping 外部资源

    Windows Pod 尚无针对 ICMP 协议编程的出站规则。但是，支持 TCP/UDP。 尝试演示与群集外部资源的连接时，请用相应的 “curl <IP>” 命令替换 “ping <IP>”。

    如果仍然遇到问题，很可能应该在 [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf) 中进行网络配置一些额外的注意。你始终可以编辑此静态文件。配置更新将适用于任何新创建的 Kubernetes 资源。

    Kubernetes 的网络需求之一（请参阅 [Kubernetes 模型](/docs/concepts/cluster-administration/networking/)）是在内部没有 NAT 的情况下进行群集通信。为了满足这一要求， 对于我们不希望出站 NAT 的所有通信，都有一个 [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20) 发生。
    但是，这也意味着你需要从 ExceptionList 中排除要查询的外部 IP。只有这样，才能正确地对源自 Windows Pod 的流量进行 SNAT，以接收外界的响应。在这方面，你在 `cni.conf` 中的 ExceptionList 应该如下所示：

    ```conf
    "ExceptionList": [
                    "10.244.0.0/16",  # Cluster subnet
                    "10.96.0.0/12",   # Service subnet
                    "10.127.130.0/24" # Management (host) subnet
                ]
    ```

<!--
1. My Windows node cannot access NodePort service

    Local NodePort access from the node itself fails. This is a known limitation. NodePort access works from other nodes or external clients.
-->
1.我的 Windows 节点无法访问 NodePort 服务

   从节点本身进行本地 NodePort 访问失败。这是一个已知的限制。NodePort 访问可从其他节点或外部客户端进行。
   
<!--
1. vNICs and HNS endpoints of containers are being deleted

    This issue can be caused when the `hostname-override` parameter is not passed to [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/). To resolve it, users need to pass the hostname to kube-proxy as follows:

    ```powershell
    C:\k\kube-proxy.exe --hostname-override=$(hostname)
    ```
-->
1. 容器的 vNIC 和 HNS 端点将被删除

    当 `hostname-override` 参数未传递给 [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) 时，可能导致此问题。要解决此问题，用户需要将主机名传递给 kube-proxy，如下所示：
    
    ```powershell
    C:\k\kube-proxy.exe --hostname-override=$(hostname)
    ```

<!--
1. With flannel my nodes are having issues after rejoining a cluster

    Whenever a previously deleted node is being re-joined to the cluster, flannelD tries to assign a new pod subnet to the node. Users should remove the old pod subnet configuration files in the following paths:

    ```powershell
    Remove-Item C:\k\SourceVip.json
    Remove-Item C:\k\SourceVipRequest.json
    ```
-->
1. 使用 flannel，我的节点重新加入集群后出现问题

    每当将先前删除的节点重新加入群集时，flannelD 都会尝试为该节点分配一个新的 pod 子网。 用户应在以下路径中删除旧的 pod 子网配置文件
    
    ```powershell
    Remove-Item C:\k\SourceVip.json
    Remove-Item C:\k\SourceVipRequest.json
    ```

<!--
1. After launching `start.ps1`, flanneld is stuck in "Waiting for the Network to be created"

    There are numerous reports of this [issue which are being investigated](https://github.com/coreos/flannel/issues/1066); most likely it is a timing issue for when the management IP of the flannel network is set. A workaround is to simply relaunch start.ps1 or relaunch it manually as follows:

    ```powershell
    PS C:> [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
    PS C:> C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
    ```
-->
1. 启动 `start.ps1` 之后，flanneld 停留在“等待创建网络”中

    有很多关于此[问题的报告，正在调查中](https://github.com/coreos/flannel/issues/1066)； 设置 flannel 网络的管理 IP 时最有可能是时序问题。一种解决方法是简单地重新启动 start.ps1 或手动重新启动它，如下所示：
    
    ```powershell
    PS C:> [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
    PS C:> C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
    ```
<!--   
1. My Windows Pods cannot launch because of missing `/run/flannel/subnet.env`

    This indicates that Flannel didn't launch correctly. You can either try to restart flanneld.exe or you can copy the files over manually from `/run/flannel/subnet.env` on the Kubernetes master to` C:\run\flannel\subnet.env` on the Windows worker node and modify the `FLANNEL_SUBNET` row to a different number. For example, if node subnet 10.244.4.1/24 is desired:

    ```env
    FLANNEL_NETWORK=10.244.0.0/16
    FLANNEL_SUBNET=10.244.4.1/24
    FLANNEL_MTU=1500
    FLANNEL_IPMASQ=true
    ```
-->
1. 由于缺少 `/run/flannel/subnet.env`，我的 Windows Pods 无法启动。

    这表明 Flannel 没有正确启动。你可以尝试重新启动 flanneld.exe，也可以将文件手动从 Kubernetes 主目录上的 `/run/flannel/subnet.env` 复制到 Windows worker 节点上的` C:\run\flannel\subnet.env`。并将 “FLANNEL_SUBNET” 行修改为其他数字。例如，如果需要节点子网10.244.4.1/24：
    ```env
    FLANNEL_NETWORK=10.244.0.0/16
    FLANNEL_SUBNET=10.244.4.1/24
    FLANNEL_MTU=1500
    FLANNEL_IPMASQ=true
    ```

<!--
1. My Windows node cannot access my services using the service IP

    This is a known limitation of the current networking stack on Windows. Windows Pods are able to access the service IP however.
-->
1. 我的 Windows 节点无法使用服务 IP 访问我的服务

   这是 Windows 上当前网络堆栈的已知限制。Windows Pods 可以访问服务 IP。
   
<!--
1. No network adapter is found when starting kubelet

    The Windows networking stack needs a virtual adapter for Kubernetes networking to work. If the following commands return no results (in an admin shell), virtual network creation — a necessary prerequisite for Kubelet to work — has failed:

    ```powershell
    Get-HnsNetwork | ? Name -ieq "cbr0"
    Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
    ```

    Often it is worthwhile to modify the [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7) parameter of the start.ps1 script, in cases where the host's network adapter isn't "Ethernet". Otherwise, consult the output of the `start-kubelet.ps1` script to see if there are errors during virtual network creation.
-->
1. 启动 kubelet 时未找到网络适配器

    Windows 网络堆栈需要一个虚拟适配器才能使 Kubernetes 网络正常工作。如果以下命令没有返回结果（在管理外壳中），则虚拟网络创建（ Kubelet 正常工作的必要先决条件）已失败：

    ```powershell
    Get-HnsNetwork | ? Name -ieq "cbr0"
    Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
    ```

    通常，在主机的主机名被修改的情况下，值得修改 start.ps1 脚本的 [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7) 参数

<!--
1. My Pods are stuck at "Container Creating" or restarting over and over

    Check that your pause image is compatible with your OS version. The [instructions](https://docs.microsoft.com/en-us/virtualization/windowscontainers/kubernetes/deploying-resources) assume that both the OS and the containers are version 1803. If you have a later version of Windows, such as an Insider build, you need to adjust the images accordingly. Please refer to the Microsoft's [Docker repository](https://hub.docker.com/u/microsoft/) for images. Regardless, both the pause image Dockerfile and the sample service expect the image to be tagged as :latest.

    Starting with Kubernetes v1.14, Microsoft releases the pause infrastructure container at `mcr.microsoft.com/k8s/core/pause:1.2.0`.
-->
1. 我的 Pod 卡在“容器创建”中，或者一遍又一遍地重启

   检查你的暂停图片是否与你的操作系统版本兼容。[说明](https://docs.microsoft.com/zh-cn/virtualization/windowscontainers/kubernetes/deploying-resources)假定操作系统和容器均为1803版。如果你使用 Windows 的更高版本， 例如 Insider 版本，则需要相应地调整图像。请参阅 Microsoft 的 [Docker 存储库](https://hub.docker.com/u/microsoft/)获取图像。无论如何，暂停映像 Dockerfile 和示例服务都希望该映像被标记为 :latest。

   从 Kubernetes v1.14 开始，Microsoft 在 `mcr.microsoft.com/k8s/core/pause:1.2.0` 发行了暂停基础结构容器。
   
<!--
1. DNS resolution is not properly working

    Check the DNS limitations for Windows in this [section](#dns-limitations).
-->
1. DNS 解析无法正常工作

     在此部分中检查 Windows 的 DNS 限制（＃dns-limitations）。
     
<!--
1. `kubectl port-forward` fails with "unable to do port forwarding: wincat not found"

    This was implemented in Kubernetes 1.15, and the pause infrastructure container `mcr.microsoft.com/k8s/core/pause:1.2.0`. Be sure to use these versions or newer ones.
    If you would like to build your own pause infrastructure container, be sure to include [wincat](https://github.com/kubernetes-sigs/sig-windows-tools/tree/master/cmd/wincat)
-->
1. `kubectl port-forward` 失败，并显示“无法进行端口转发：未找到 wincat”

   这是在 Kubernetes 1.15 和暂停基础结构容器 “mcr.microsoft.com/k8s/core/pause:1.2.0” 中实现的。 确保使用这些版本或更新的版本。
   如果你想构建自己的暂停基础结构容器，请确保包含 [wincat](https://github.com/kubernetes-sigs/sig-windows-tools/tree/master/cmd/wincat)
     
<!--
1. My Kubernetes installation is failing because my Windows Server node is behind a proxy

    If you are behind a proxy, the following PowerShell environment variables must be defined:

    ```PowerShell
    [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
    [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
    ```
-->
1. 我的 Kubernetes 安装失败，因为我的 Windows Server 节点位于代理后面

    如果你位于代理后面，则必须定义以下PowerShell环境变量：

    ```PowerShell
    [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
    [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
    ```
   
<!--
1. What is a `pause` container?

    In a Kubernetes Pod, an infrastructure or "pause" container is first created to host the container endpoint. Containers that belong to the same pod, including infrastructure and worker containers, share a common network namespace and endpoint (same IP and port space). Pause containers are needed to accommodate worker containers crashing or restarting without losing any of the networking configuration.

    The "pause" (infrastructure) image is hosted on Microsoft Container Registry (MCR). You can access it using `docker pull mcr.microsoft.com/k8s/core/pause:1.2.0`. For more details, see the [DOCKERFILE](https://github.com/kubernetes-sigs/windows-testing/blob/master/images/pause/Dockerfile).
--> 
1.什么是 `pause` 容器？

   在 Kubernetes Pod 中，首先创建一个基础结构或 "pause" 容器来托管容器端点。属于同一容器的容器（包括基础结构容器和工作容器）共享一个公共的网络名称空间和终结点（相同的 IP 和端口空间）。需要暂停容器来容纳工作容器崩溃或重新启动而不会丢失任何网络配置。

   "pause"（基础结构）映像位于 Microsoft 容器注册表（MCR）上。 你可以使用 `docker pull mcr.microsoft.com/k8s/core/pause:1.2.0` 访问它。有关更多详细信息，请参见[DOCKERFILE](https://github.com/kubernetes-sigs/windows-testing/blob/master/images/pause/Dockerfile)。
 
<!--     
### Further investigation

If these steps don't resolve your problem, you can get help running Windows containers on Windows nodes in Kubernetes through:

* StackOverflow [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container) topic
* Kubernetes Official Forum [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)
-->
### 进一步的调查

如果这些步骤不能解决问题，则可以通过以下方法获得在 Kubernetes 中 Windows 节点上运行 Windows 容器的帮助：

* StackOverflow [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container) topic
* Kubernetes Official Forum [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)

<！--
## Reporting Issues and Feature Requests

If you have what looks like a bug, or you would like to make a feature request, please use the [GitHub issue tracking system](https://github.com/kubernetes/kubernetes/issues). You can open issues on [GitHub](https://github.com/kubernetes/kubernetes/issues/new/choose) and assign them to SIG-Windows. You should first search the list of issues in case it was reported previously and comment with your experience on the issue and add additional logs. SIG-Windows Slack is also a great avenue to get some initial support and troubleshooting ideas prior to creating a ticket.

If filing a bug, please include detailed information about how to reproduce the problem, such as:

* Kubernetes version: kubectl version
* Environment details: Cloud provider, OS distro, networking choice and configuration, and Docker version
* Detailed steps to reproduce the problem
* [Relevant logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs)
* Tag the issue sig/windows by commenting on the issue with `/sig windows` to bring it to a SIG-Windows member's attention
-->
## 报告问题和功能请求

如果你看起来像个错误，或者想要提出功能请求，请使用 [GitHub 问题跟踪系统](https://github.com/kubernetes/kubernetes/issues)。你可以在 [GitHub](https://github.com/kubernetes/kubernetes/issues/new/choose) 上打开问题，并将其分配给 SIG-Windows 。
如果以前曾报告过该问题，则应首先搜索该问题的列表，并用你对该问题的经验进行评论并添加其他日志。SIG-Windows Slack 还是在创建故障单之前获得一些初始支持和疑难解答的好方法。

如果提交错误，请提供有关如何重现该问题的详细信息，例如：

* Kubernetes version: kubectl 版本
* Environment details: Cloud provider, OS distro, networking choice and configuration, and Docker 版本
* 重现问题的详细步骤
* [Relevant logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs)
* 通过用 `/sig windows` 评论问题来标记问题 `/sig windows` ，以引起 SIG-Windows 成员的注意

<!--
## {{% heading "whatsnext" %}}


We have a lot of features in our roadmap. An abbreviated high level list is included below, but we encourage you to view our [roadmap project](https://github.com/orgs/kubernetes/projects/8) and help us make Windows support better by [contributing](https://github.com/kubernetes/community/blob/master/sig-windows/).
-->
## {{% heading "whatsnext" %}}


我们的路线图中有很多功能。下面是一个简短的高级列表，但我们鼓励你查看我们的[路线图项目](https://github.com/orgs/kubernetes/projects/8)，并通过[贡献](https://github.com/kubernetes/community/blob/master/sig-windows/)。

<!--
### Hyper-V isolation

Hyper-V isolation is requried to enable the following use cases for Windows containers in Kubernetes:

* Hypervisor-based isolation between pods for additional security
* Backwards compatibility allowing a node to run a newer Windows Server version without requiring containers to be rebuilt
* Specific CPU/NUMA settings for a pod
* Memory isolation and reservations
-->
### Hyper-V隔离

需要 Hyper-V 隔离以为 Kubernetes 中的 Windows 容器启用以下用例：

* Pod 之间基于虚拟机管理程序的隔离可增强安全性
* 向后兼容性，允许节点运行较新的 Windows Server 版本，而无需重建容器
* 主机的特定 CPU/NUMA 设置
* 内存隔离和保留

<!--
The existing Hyper-V isolation support, an experimental feature as of v1.10, will be deprecated in the future in favor of the CRI-ContainerD and RuntimeClass features mentioned above. To use the current features and create a Hyper-V isolated container, the kubelet should be started with feature gates `HyperVContainer=true` and the Pod should include the annotation `experimental.windows.kubernetes.io/isolation-type=hyperv`. In the experiemental release, this feature is limited to 1 container per Pod.
-->
现有的 Hyper-V 隔离支持（从 v1.10 开始为实验性功能）将在将来被弃用，以支持上述 CRI-ContainerD 和 RuntimeClass 功能。要使用当前功能并创建 Hyper-V 隔离容器，kubelet 应该以功能门 `HyperVContainer=true` 开始，并且 Pod 应该包含注解 `experimental.windows.kubernetes.io/isolation-type=hyperv`。在实验性发行版中，此功能仅限于每个 Pod 1个容器。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: iis
spec:
  selector:
    matchLabels:
      app: iis
  replicas: 3
  template:
    metadata:
      labels:
        app: iis
      annotations:
        experimental.windows.kubernetes.io/isolation-type: hyperv
    spec:
      containers:
      - name: iis
        image: microsoft/iis
        ports:
        - containerPort: 80
```

<!--
### Deployment with kubeadm and cluster API

Kubeadm is becoming the de facto standard for users to deploy a Kubernetes
cluster. Windows node support in kubeadm is currently a work-in-progress but a
guide is available [here](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/).
We are also making investments in cluster API to ensure Windows nodes are
properly provisioned.
-->
### 使用kubeadm和集群API进行部署

Kubeadm 正在成为用户部署 Kubernetes 集群的事实上的标准。目前，kubeadm 中的 Windows 节点支持尚在开发中，但仍可使用指南[此处](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)。我们还对集群 API 进行了投资，以确保 Windows 节点已正确配置。

<!--
### A few other key features
* Beta support for Group Managed Service Accounts
* More CNIs
* More Storage Plugins
-->
### 其他一些关键功能
* 对群组托管服务帐户的 Beta 支持
* 更多 CNI
* 更多存储插件


