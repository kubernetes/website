---
title: 概念
---

本概念章节帮助您了解 Kubernetes 系统和 Kubernetes 对您集群资源的抽象，并帮助您更深入地了解 Kubernetes 的工作原理。

## 概述

要使用 Kubernetes，您可以使用 *Kubernetes API 对象* 来描述您集群的 *期望状态*: 您想要运行哪些应用程序或其他负载，它们使用什么容器镜像、幅本数量、要使其可用的网络和磁盘资源等等。您通过使用 Kubernetes API 创建对象来设置其所需的状态，通常使用命令行接口 `kubectl`。您还可以直接使用 Kubernetes API 与集群进行交互，并设置或修改所需的状态。

一旦您设置了期望的状态， *Kubernetes 控制层* 可以使用集群的当前状态与期望状态相匹配。为此，Kuberentes 会自动执行各种任务，例如启动或重新启动容器、缩放给定应用程序的副本数等等。Kubernetes 控制层包括在您集群上运行的进程集合:

* **Kubernetes Master** 是集群中某个节点上运行的四个进程的集合，该节点被指定为主节点。
* 集群中的每个单独的非主节点都运行两个进程:
  * **kubelet**, 它与 Kubernetes Master 进行通信，并管理容器运行时,如 Docker、Rkt。
  * **kube-proxy**, 在每个节点上运行的 Kubernetes 网络代理服务。

## Kubernetes 对象

Kubernetes 包含一些表示系统状态的抽象: 部署容器化应用程序和工作负载、关联的网络和磁盘资源以及有关集群当前工作的其他信息。这些抽象由 Kubernetes API 中的对象表示；请参阅 [Kubernetes 对象概述](/docs/concepts/abstractions/overview/) 获取更多信息。

基础的 Kubernetes 对象包括:

* [Pod](/docs/concepts/abstractions/pod/)
* Service
* Volume
* Namespace

此外，Kubernetes 包含一些称为控制器的更高级抽象。控制器基于基础对象，并提供额外的功能和便利性。它们包括:

* ReplicaSet
* Deployment
* [StatefulSet](/docs/concepts/abstractions/controllers/statefulsets/)
* DaemonSet
* Job

## Kubernetes 控制层

Kubernetes 控制层包含了几部分，如 Kubernetes Master 和 kubelet 进程，确定 Kubernetes 如何与您的集群通信。控制层维护系统中所有 Kubernetes 对象的记录，并运行连续的控制循环来管理这些对象的状态。在任何给定时间，控制层的控制循环将响应集群中的变化，并使系统中所有对象的实际状态达到您提供的期望状态。

例如，当您使用 Kubernetes API 创建 Deployment 对象时，您为系统提供了新的期望状态。 Kubernetes 控制层将记录对象创建，并通过启动所需的应用程序并将其调度到集群节点来执行指令，从而使集群的实际状态与所期望的状态相匹配。

### Kubernetes Master

Kubernetes master 负责维护您的集群期望的状态。当您与 Kubernetes 进行交互时，例如通过使用 `kubectl` 命令行工具，您正在与集群的 Kubernetes master 进行协调。

> 此 "master" 指的是管理集群状态的进程集合。通常，这些进程都在集群中的单个节点上运行，并且此节点也称为主节点。还可以有多个主节点以实现高可用和冗余 。

### Kubernetes Nodes

集群中的 nodes 是运行应用程序和云工作流的计算机 (物理机或虚拟机) Kubernetes master 控制每个 node，您很少会直接与 node 进行交互。

#### 对象元数据


* [注解](/docs/concepts/object-metadata/annotations/)


### 下一步做什么呢

如果您想参与概念页面的编写，请参阅
[使用页面模板](/docs/contribute/page-templates/)
获取有关概念页面类型和概念模板的参考信息。
