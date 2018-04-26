---
cn-approvers:
- tianshapjq
title: 概念
---
<!--
---
title: Concepts
---
-->

<!--
The Concepts section helps you learn about the parts of the Kubernetes system and the abstractions Kubernetes uses to represent your cluster, and helps you obtain a deeper understanding of how Kubernetes works.
-->
本概念章节可帮助您了解 Kubernetes 系统的各个部分以及 Kubernetes 用于表示集群的抽象概念，并帮助您深入了解 Kubernetes 的工作原理。

<!--
## Overview
-->
## 概述

<!--
To work with Kubernetes, you use *Kubernetes API objects* to describe your cluster's *desired state*: what applications or other workloads you want to run, what container images they use, the number of replicas, what network and disk resources you want to make available, and more. You set your desired state by creating objects using the Kubernetes API, typically via the command-line interface, `kubectl`. You can also use the Kubernetes API directly to interact with the cluster and set or modify your desired state.
-->
要使用 Kubernetes，您可以使用 *Kubernetes API 对象* 来描述您集群的 *所需状态*：您要运行的应用程序或其他工作负载、使用的容器镜像、副本数量和要使用的网络和磁盘资源 等等。您可以通过使用 Kubernetes API 创建对象（通常通过命令行界面 `kubectl` ）来设置所需的状态，也可以直接使用 Kubernetes API 与集群进行交互，并设置或修改您所需的状态。

<!--
Once you've set your desired state, the *Kubernetes Control Plane* works to make the cluster's current state match the desired state. To do so, Kubernetes performs a variety of tasks automatically--such as starting or restarting containers, scaling the number of replicas of a given application, and more. The Kubernetes Control Plane consists of a collection of processes running on your cluster: 
-->
一旦您设置了想要的状态，*Kubernetes 控制平面* 将会使集群的当前状态匹配所需的状态。为此，Kubernetes 自动执行各种任务--例如启动或重新启动容器、伸缩给定应用程序的副本数量等等。Kubernetes 控制平面由运行在集群上的一系列进程组成：

<!--
* The **Kubernetes Master** is a collection of three processes that run on a single node in your cluster, which is designated as the master node. Those processes are: [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) and [kube-scheduler](/docs/admin/kube-scheduler/).
* Each individual non-master node in your cluster runs two processes:
  * **[kubelet](/docs/admin/kubelet/)**, which communicates with the Kubernetes Master.
  * **[kube-proxy](/docs/admin/kube-proxy/)**, a network proxy which reflects Kubernetes networking services on each node.
-->
* **Kubernetes Master** 是由您集群中单个节点上运行的三个进程组成的，该节点被指定为 master 节点。这些进程包括：[kube-apiserver](/docs/admin/kube-apiserver/)、[kube-controller-manager](/docs/admin/kube-controller-manager/) 和 [kube-scheduler](/docs/admin/kube-scheduler/)。
* 每个集群的非 master 节点运行两个进程：
  * **[kubelet](/docs/admin/kubelet/)**，它和 Kubernetes Master 进行通信。
  * **[kube-proxy](/docs/admin/kube-proxy/)**，在每个节点上反映 Kubernetes 网络服务的网络代理。

<!--
## Kubernetes Objects
-->
## Kubernetes 对象

<!--
Kubernetes contains a number of abstractions that represent the state of your system: deployed containerized applications and workloads, their associated network and disk resources, and other information about what your cluster is doing. These abstractions are represented by objects in the Kubernetes API; see the [Kubernetes Objects overview](/docs/concepts/abstractions/overview/) for more details. 
-->
Kubernetes 包含许多代表系统状态的抽象概念：已部署的容器化应用程序和工作负载，与它们相关的网络和磁盘资源，以及有关您的集群所做事情的其他信息。这些抽象概念是由 Kubernetes API 中的对象来表示的; 请参阅 [Kubernetes 对象概述](/docs/concepts/abstractions/overview/) 以了解更多详情。

<!--
The basic Kubernetes objects include:
-->
Kubernetes 的基本对象包括：

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/docs/concepts/overview/working-with-objects/namespaces/)

<!--
In addition, Kubernetes contains a number of higher-level abstractions called Controllers. Controllers build upon the basic objects, and provide additional functionality and convenience features. They include:
-->
另外，Kubernetes 还包含一些称为控制器的更高层次的抽象概念。控制器基于基本对象，并提供附加特性和便利特性。包括：

* [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
* [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

<!--
## Kubernetes Control Plane
-->
## Kubernetes 控制平面

<!--
The various parts of the Kubernetes Control Plane, such as the Kubernetes Master and kubelet processes, govern how Kubernetes communicates with your cluster. The Control Plane maintains a record of all of the Kubernetes Objects in the system, and runs continuous control loops to manage those objects' state. At any given time, the Control Plane's control loops will respond to changes in the cluster and work to make the actual state of all the objects in the system match the desired state that you provided.
-->
Kubernetes 控制平面的各个部分（如 Kubernetes Master 和 Kubelet 进程）管理 Kubernetes 如何与您的集群进行通信。控制平面保存系统中所有 Kubernetes 对象的记录，并运行连续的控制循环来管理这些对象的状态。在任何给定时间，控制平面的控制回路将响应集群中的变化，并使系统中所有对象的实际状态与您提供的所需状态相匹配。

<!--
For example, when you use the Kubernetes API to create a Deployment object, you provide a new desired state for the system. The Kubernetes Control Plane records that object creation, and carries out your instructions by starting the required applications and scheduling them to cluster nodes--thus making the cluster's actual state match the desired state.
-->
例如，当您使用 Kubernetes API 创建一个 Deployment 对象时，您就为系统提供了一个新的所需状态。Kubernetes 控制平面记录了对象的创建，并通过启动所需的应用程序并将它们调度到集群节点来执行您的指令--从而使集群的实际状态符合所需的状态。

### Kubernetes Master

<!--
The Kubernetes master is responsible for maintaining the desired state for your cluster. When you interact with Kubernetes, such as by using the `kubectl` command-line interface, you're communicating with your cluster's Kubernetes master.
-->
Kubernetes master 负责维护您集群的所需状态。当您与 Kubernetes 进行交互时（例如使用 `kubectl` 命令行界面），您就是在与集群的 Kubernetes master 进行通信。

<!--
> The "master" refers to a collection of processes managing the cluster state.  Typically these processes are all run on a single node in the cluster, and this node is also referred to as the master. The master can also be replicated for availability and redundancy.
-->
> "master" 是指管理集群状态的进程的集合。通常，这些进程都运行在集群中的单个节点上，并且该节点也被称为 master 节点。您也可以通过实现多个 master 副本来提供高可用。

### Kubernetes Nodes

<!--
The nodes in a cluster are the machines (VMs, physical servers, etc) that run your applications and cloud workflows. The Kubernetes master controls each node; you'll rarely interact with nodes directly.
-->
集群中的 node 是运行应用程序和云工作流的机器（虚拟机，物理服务器等）。Kubernetes master 控制每个 node; 您很少会直接与 node 进行交互。

<!--
#### Object Metadata
-->
#### 对象元数据

<!--
* [Annotations](/docs/concepts/overview/working-with-objects/annotations/)
-->
* [注解（Annotations）](/docs/concepts/overview/working-with-objects/annotations/)

<!--
### What's next
-->
### 下一步

<!--
If you would like to write a concept page, see
[Using Page Templates](/docs/home/contribute/page-templates/)
for information about the concept page type and the concept template.
-->
如果您想编写一个概念页面，请参阅 [使用页面模板](/docs/home/contribute/page-templates/) 来获取概念页面类型和概念模板的信息。
