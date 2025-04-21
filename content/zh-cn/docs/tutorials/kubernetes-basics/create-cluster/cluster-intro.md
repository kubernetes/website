---
title: 使用 Minikube 创建集群
weight: 10
---
<!--
title: Using Minikube to Create a Cluster
weight: 10
-->

## {{% heading "objectives" %}}

<!--
* Learn what a Kubernetes cluster is.
* Learn what Minikube is.
* Start a Kubernetes cluster on your computer.
-->
* 了解 Kubernetes 集群。
* 了解 Minikube。
* 在你的电脑上启动一个 Kubernetes 集群。

<!--
## Kubernetes Clusters
-->
## Kubernetes 集群

{{% alert %}}
<!--
_Kubernetes is a production-grade, open-source platform that orchestrates
the placement (scheduling) and execution of application containers
within and across computer clusters._
-->
**Kubernetes 是一个生产级别的开源平台，
可编排在计算机集群内和跨计算机集群的应用容器的部署（调度）和执行。**
{{% /alert %}}

<!--
**Kubernetes coordinates a highly available cluster of computers that are connected
to work as a single unit.** The abstractions in Kubernetes allow you to deploy
containerized applications to a cluster without tying them specifically to individual
machines. To make use of this new model of deployment, applications need to be packaged
in a way that decouples them from individual hosts: they need to be containerized.
Containerized applications are more flexible and available than in past deployment models,
where applications were installed directly onto specific machines as packages deeply
integrated into the host. **Kubernetes automates the distribution and scheduling of
application containers across a cluster in a more efficient way.** Kubernetes is an
open-source platform and is production-ready.
-->
**Kubernetes 协调一个高可用计算机集群，每个计算机互相连接之后作为同一个工作单元运行。**
Kubernetes 中的抽象允许你将容器化的应用部署到集群，而无需将它们绑定到某个特定的独立计算机。
为了使用这种新的部署模型，需要以将应用与单个主机解耦的方式打包：它们需要被容器化。
与过去的那种应用直接以包的方式深度与主机集成的部署模型相比，容器化应用更灵活、更可用。
**Kubernetes 以更高效的方式跨集群自动分布和调度应用容器。**
Kubernetes 是一个开源平台，并且可应用于生产环境。

<!--
A Kubernetes cluster consists of two types of resources:

* The **Control Plane** coordinates the cluster
* **Nodes** are the workers that run applications
-->
一个 Kubernetes 集群包含两种类型的资源：

* **控制面（Control Plane）** 调度整个集群
* **节点（Nodes）** 负责运行应用

<!--
### Cluster Diagram

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_01_cluster.svg" style="width: 100%;" >}}

**The Control Plane is responsible for managing the cluster.** The Control Plane
coordinates all activities in your cluster, such as scheduling applications, maintaining
applications' desired state, scaling applications, and rolling out new updates.
-->
### 集群图

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_01_cluster.svg" style="width: 100%;" >}}

**控制面负责管理整个集群。**
控制面协调集群中的所有活动，例如调度应用、维护应用的期望状态、对应用扩容以及将新的更新上线等等。


{{% alert %}}
<!--
_Control Planes manage the cluster and the nodes that are used to host the running
applications._
-->
**控制面管理集群，节点用于托管运行中的应用**
{{% /alert %}}

<!--
**A node is a VM or a physical computer that serves as a worker machine in a Kubernetes
cluster.** Each node has a Kubelet, which is an agent for managing the node and
communicating with the Kubernetes control plane. The node should also have tools for
handling container operations, such as {{< glossary_tooltip text="containerd" term_id="containerd" >}}
or {{< glossary_tooltip term_id="cri-o" >}}. A Kubernetes cluster that handles production
traffic should have a minimum of three nodes because if one node goes down, both an
[etcd](/docs/concepts/architecture/#etcd) member and a control plane instance are lost,
and redundancy is compromised. You can mitigate this risk by adding more control plane nodes.
-->
**节点是一个虚拟机或者物理机，它在 Kubernetes 集群中充当工作机器的角色。**
每个节点都有 Kubelet，它管理节点而且是节点与控制面通信的代理。
节点还应该具有用于处理容器操作的工具，例如 {{< glossary_tooltip text="containerd" term_id="containerd" >}}
或 {{< glossary_tooltip term_id="cri-o" >}}。
处理生产级流量的 Kubernetes 集群至少应具有三个节点，因为如果只有一个节点，出现故障时其对应的
[etcd](/zh-cn/docs/concepts/architecture/#etcd) 成员和控制面实例都会丢失，
并且冗余会受到影响。你可以通过添加更多控制面节点来降低这种风险。

<!--
When you deploy applications on Kubernetes, you tell the control plane to start
the application containers. The control plane schedules the containers to run on
the cluster's nodes. **Node-level components, such as the kubelet, communicate
with the control plane using the [Kubernetes API](/docs/concepts/overview/kubernetes-api/)**,
which the control plane exposes. End users can also use the Kubernetes API directly
to interact with the cluster.
-->
在 Kubernetes 上部署应用时，你告诉控制面启动应用容器。
控制面就编排容器在集群的节点上运行。
**节点使用控制面所公布的 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/)**
与控制面通信。终端用户也可以使用 Kubernetes API 与集群交互。

<!--
A Kubernetes cluster can be deployed on either physical or virtual machines. To
get started with Kubernetes development, you can use Minikube. Minikube is a lightweight
Kubernetes implementation that creates a VM on your local machine and deploys a
simple cluster containing only one node. Minikube is available for Linux, macOS,
and Windows systems. The Minikube CLI provides basic bootstrapping operations for
working with your cluster, including start, stop, status, and delete.
-->
Kubernetes 既可以部署在物理机上也可以部署在虚拟机上。你可以使用 Minikube 开始部署 Kubernetes 集群。
Minikube 是一种轻量级的 Kubernetes 实现，可在本地计算机上创建 VM 并部署仅包含一个节点的简单集群。
Minikube 可用于 Linux、macOS 和 Windows 系统。Minikube CLI 提供了用于引导集群工作的多种操作，
包括启动、停止、查看状态和删除。

## {{% heading "whatsnext" %}}

<!--
* Tutorial [Hello Minikube](/docs/tutorials/hello-minikube/).
* Learn more about [Cluster Architecture](/docs/concepts/architecture/).
-->
* [Hello Minikube](/zh-cn/docs/tutorials/hello-minikube/) 教程。
* 了解更多关于[集群架构](/zh-cn/docs/concepts/architecture/)方面的知识。
