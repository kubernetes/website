---
title: 使用 Minikube 創建集羣
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
* 瞭解 Kubernetes 集羣。
* 瞭解 Minikube。
* 在你的電腦上啓動一個 Kubernetes 集羣。

<!--
## Kubernetes Clusters
-->
## Kubernetes 集羣

{{% alert %}}
<!--
_Kubernetes is a production-grade, open-source platform that orchestrates
the placement (scheduling) and execution of application containers
within and across computer clusters._
-->
**Kubernetes 是一個生產級別的開源平臺，
可編排在計算機集羣內和跨計算機集羣的應用容器的部署（調度）和執行。**
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
**Kubernetes 協調一個高可用計算機集羣，每個計算機互相連接之後作爲同一個工作單元運行。**
Kubernetes 中的抽象允許你將容器化的應用部署到集羣，而無需將它們綁定到某個特定的獨立計算機。
爲了使用這種新的部署模型，需要以將應用與單個主機解耦的方式打包：它們需要被容器化。
與過去的那種應用直接以包的方式深度與主機集成的部署模型相比，容器化應用更靈活、更可用。
**Kubernetes 以更高效的方式跨集羣自動分佈和調度應用容器。**
Kubernetes 是一個開源平臺，並且可應用於生產環境。

<!--
A Kubernetes cluster consists of two types of resources:

* The **Control Plane** coordinates the cluster
* **Nodes** are the workers that run applications
-->
一個 Kubernetes 集羣包含兩種類型的資源：

* **控制面（Control Plane）** 調度整個集羣
* **節點（Nodes）** 負責運行應用

<!--
### Cluster Diagram

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_01_cluster.svg" style="width: 100%;" >}}

**The Control Plane is responsible for managing the cluster.** The Control Plane
coordinates all activities in your cluster, such as scheduling applications, maintaining
applications' desired state, scaling applications, and rolling out new updates.
-->
### 集羣圖

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_01_cluster.svg" style="width: 100%;" >}}

**控制面負責管理整個集羣。**
控制面協調集羣中的所有活動，例如調度應用、維護應用的期望狀態、對應用擴容以及將新的更新上線等等。


{{% alert %}}
<!--
_Control Planes manage the cluster and the nodes that are used to host the running
applications._
-->
**控制面管理集羣，節點用於託管運行中的應用**
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
**節點是一個虛擬機或者物理機，它在 Kubernetes 集羣中充當工作機器的角色。**
每個節點都有 Kubelet，它管理節點而且是節點與控制面通信的代理。
節點還應該具有用於處理容器操作的工具，例如 {{< glossary_tooltip text="containerd" term_id="containerd" >}}
或 {{< glossary_tooltip term_id="cri-o" >}}。
處理生產級流量的 Kubernetes 集羣至少應具有三個節點，因爲如果只有一個節點，出現故障時其對應的
[etcd](/zh-cn/docs/concepts/architecture/#etcd) 成員和控制面實例都會丟失，
並且冗餘會受到影響。你可以通過添加更多控制面節點來降低這種風險。

<!--
When you deploy applications on Kubernetes, you tell the control plane to start
the application containers. The control plane schedules the containers to run on
the cluster's nodes. **Node-level components, such as the kubelet, communicate
with the control plane using the [Kubernetes API](/docs/concepts/overview/kubernetes-api/)**,
which the control plane exposes. End users can also use the Kubernetes API directly
to interact with the cluster.
-->
在 Kubernetes 上部署應用時，你告訴控制面啓動應用容器。
控制面就編排容器在集羣的節點上運行。
**節點使用控制面所公佈的 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/)**
與控制面通信。終端用戶也可以使用 Kubernetes API 與集羣交互。

<!--
A Kubernetes cluster can be deployed on either physical or virtual machines. To
get started with Kubernetes development, you can use Minikube. Minikube is a lightweight
Kubernetes implementation that creates a VM on your local machine and deploys a
simple cluster containing only one node. Minikube is available for Linux, macOS,
and Windows systems. The Minikube CLI provides basic bootstrapping operations for
working with your cluster, including start, stop, status, and delete.
-->
Kubernetes 既可以部署在物理機上也可以部署在虛擬機上。你可以使用 Minikube 開始部署 Kubernetes 集羣。
Minikube 是一種輕量級的 Kubernetes 實現，可在本地計算機上創建 VM 並部署僅包含一個節點的簡單集羣。
Minikube 可用於 Linux、macOS 和 Windows 系統。Minikube CLI 提供了用於引導集羣工作的多種操作，
包括啓動、停止、查看狀態和刪除。

## {{% heading "whatsnext" %}}

<!--
* Tutorial [Hello Minikube](/docs/tutorials/hello-minikube/).
* Learn more about [Cluster Architecture](/docs/concepts/architecture/).
-->
* [Hello Minikube](/zh-cn/docs/tutorials/hello-minikube/) 教程。
* 瞭解更多關於[集羣架構](/zh-cn/docs/concepts/architecture/)方面的知識。
